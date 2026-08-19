package jobs

import (
	"context"
	"encoding/json"
	"log/slog"
	"sync"
	"time"
)

// JobType identifies the kind of background job.
type JobType string

const (
	JobTypeSendEmail      JobType = "send_email"
	JobTypeSendWhatsApp   JobType = "send_whatsapp"
	JobTypeGeneratePDF    JobType = "generate_pdf"
	JobTypeCleanupExpired JobType = "cleanup_expired"
)

// EmailJobPayload carries data for an outbound email.
type EmailJobPayload struct {
	To       string `json:"to"`
	Subject  string `json:"subject"`
	HTMLBody string `json:"htmlBody"`
}

// WhatsAppJobPayload carries data for an outbound WhatsApp message.
type WhatsAppJobPayload struct {
	To   string `json:"to"`
	Text string `json:"text"`
}

// PDFJobPayload carries data for PDF generation.
type PDFJobPayload struct {
	PengajuanID string `json:"pengajuanId"`
	HTML        string `json:"html"`
	Title       string `json:"title"`
}

// CleanupJobPayload carries data for expired data cleanup.
type CleanupJobPayload struct {
	OlderThan time.Time `json:"olderThan"`
}

// Job represents a unit of background work.
type Job struct {
	ID         string         `json:"id"`
	Type       JobType        `json:"type"`
	Payload    map[string]any `json:"payload"`
	CreatedAt  time.Time      `json:"createdAt"`
	Retries    int            `json:"retries"`
	MaxRetries int            `json:"maxRetries"`
}

// JobHandler executes a specific job type.
type JobHandler func(ctx context.Context, job Job) error

// Store persists jobs durably so they survive process restarts.
// Implementations must be safe for concurrent use.
type Store interface {
	PersistJob(ctx context.Context, j Job) error
	UpdateJobStatus(ctx context.Context, jobID, status string) error
	IncrementJobRetries(ctx context.Context, jobID string) error
	SetJobError(ctx context.Context, jobID, errorMsg string) error
	// ClaimStaleJobs returns jobs stuck in 'pending' or 'processing' that
	// have not been picked up within olderThan.  Used for crash recovery
	// on startup to re-enqueue orphaned jobs.
	ClaimStaleJobs(ctx context.Context, olderThan time.Time, limit int) ([]Job, error)
}

// Worker processes jobs from the queue.
type Worker struct {
	queue    chan Job
	wg       sync.WaitGroup
	handlers map[JobType]JobHandler
	logger   *slog.Logger
	shutdown chan struct{}
	store    Store // optional — when set, jobs are persisted for crash recovery
}

// NewWorker creates a background job worker with the given buffer size.
func NewWorker(buffer int, logger *slog.Logger) *Worker {
	w := &Worker{
		queue:    make(chan Job, buffer),
		handlers: map[JobType]JobHandler{},
		logger:   logger,
		shutdown: make(chan struct{}),
	}
	return w
}

// WithStore attaches a persistent Store so jobs survive process restarts.
func (w *Worker) WithStore(s Store) *Worker {
	w.store = s
	return w
}

// Register adds a handler for a specific job type.
func (w *Worker) Register(jobType JobType, handler JobHandler) {
	w.handlers[jobType] = handler
}

// Start launches worker goroutines.
func (w *Worker) Start(workers int) {
	for i := 0; i < workers; i++ {
		w.wg.Add(1)
		go w.run(i)
	}
}

// run is the worker loop.
func (w *Worker) run(id int) {
	defer w.wg.Done()
	w.logger.Info("job worker started", "workerId", id)
	for {
		select {
		case job, ok := <-w.queue:
			if !ok {
				return
			}
			w.process(job)
		case <-w.shutdown:
			return
		}
	}
}

// process executes a single job with retry logic.
func (w *Worker) process(job Job) {
	handler, ok := w.handlers[job.Type]
	if !ok {
		w.logger.Warn("no handler for job type", "jobId", job.ID, "type", job.Type)
		return
	}

	// Mark as processing (for persistence tracking).
	if w.store != nil {
		if err := w.store.UpdateJobStatus(context.Background(), job.ID, "processing"); err != nil {
			w.logger.Warn("failed to update job status to processing", "jobId", job.ID, "error", err)
		}
	}

	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()
	if err := handler(ctx, job); err != nil {
		w.logger.Error("job failed", "jobId", job.ID, "type", job.Type, "error", err)
		if w.store != nil {
			_ = w.store.IncrementJobRetries(context.Background(), job.ID)
			_ = w.store.SetJobError(context.Background(), job.ID, err.Error())
		}
		if job.Retries < job.MaxRetries {
			job.Retries++
			time.AfterFunc(time.Duration(job.Retries)*time.Second, func() {
				w.queue <- job
			})
		} else if w.store != nil {
			_ = w.store.UpdateJobStatus(context.Background(), job.ID, "failed")
		}
	} else {
		w.logger.Info("job completed", "jobId", job.ID, "type", job.Type)
		if w.store != nil {
			_ = w.store.UpdateJobStatus(context.Background(), job.ID, "completed")
		}
	}
}

// Enqueue submits a job for async processing.  When a persistent Store is
// attached the job is saved to the store first so it survives a crash.
func (w *Worker) Enqueue(job Job) {
	if w.store != nil {
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()
		if err := w.store.PersistJob(ctx, job); err != nil {
			w.logger.Warn("failed to persist job, queueing in-memory only",
				"jobId", job.ID, "type", job.Type, "error", err)
		}
	}
	select {
	case w.queue <- job:
	default:
		w.logger.Warn("job queue full, dropping job", "jobId", job.ID, "type", job.Type)
	}
}

// RecoverPending re-enqueues jobs that were 'pending' or 'processing' before
// the process crashed.  Call this right after Start() on startup.
func (w *Worker) RecoverPending(ctx context.Context, limit int) int {
	if w.store == nil {
		return 0
	}
	// Jobs stuck in processing for more than 10 minutes are considered
	// orphaned (the worker that claimed them is gone).
	stale, err := w.store.ClaimStaleJobs(ctx, time.Now().Add(-10*time.Minute), limit)
	if err != nil {
		w.logger.Warn("failed to recover stale jobs", "error", err)
		return 0
	}
	for i := range stale {
		// Reset retries counter for recovery so the new worker gets a fresh
		// retry budget.  The original failure error (if any) stays in the
		// store for auditing.
		stale[i].Retries = 0
		w.queue <- stale[i]
	}
	return len(stale)
}

// Shutdown gracefully stops the worker pool.
func (w *Worker) Shutdown(timeout time.Duration) {
	close(w.shutdown)
	done := make(chan struct{})
	go func() {
		w.wg.Wait()
		close(done)
	}()
	select {
	case <-done:
	case <-time.After(timeout):
		w.logger.Warn("job worker shutdown timed out")
	}
}

// MarshalPayload serializes a job payload.
func MarshalPayload(v any) (map[string]any, error) {
	b, err := json.Marshal(v)
	if err != nil {
		return nil, err
	}
	var m map[string]any
	if err := json.Unmarshal(b, &m); err != nil {
		return nil, err
	}
	return m, nil
}

// UnmarshalEmailPayload deserializes an email job payload.
func UnmarshalEmailPayload(payload map[string]any) (EmailJobPayload, error) {
	var p EmailJobPayload
	b, err := json.Marshal(payload)
	if err != nil {
		return p, err
	}
	if err := json.Unmarshal(b, &p); err != nil {
		return p, err
	}
	return p, nil
}

// UnmarshalWhatsAppPayload deserializes a WhatsApp job payload.
func UnmarshalWhatsAppPayload(payload map[string]any) (WhatsAppJobPayload, error) {
	var p WhatsAppJobPayload
	b, err := json.Marshal(payload)
	if err != nil {
		return p, err
	}
	if err := json.Unmarshal(b, &p); err != nil {
		return p, err
	}
	return p, nil
}

// UnmarshalPDFPayload deserializes a PDF job payload.
func UnmarshalPDFPayload(payload map[string]any) (PDFJobPayload, error) {
	var p PDFJobPayload
	b, err := json.Marshal(payload)
	if err != nil {
		return p, err
	}
	if err := json.Unmarshal(b, &p); err != nil {
		return p, err
	}
	return p, nil
}

// UnmarshalCleanupPayload deserializes a cleanup job payload.
func UnmarshalCleanupPayload(payload map[string]any) (CleanupJobPayload, error) {
	var p CleanupJobPayload
	b, err := json.Marshal(payload)
	if err != nil {
		return p, err
	}
	if err := json.Unmarshal(b, &p); err != nil {
		return p, err
	}
	return p, nil
}
