package notif

import (
	"fmt"
	"sync"
	"time"
)

// Types of notification types matching the database enum
const (
	TypeInfo    = "info"
	TypeSuccess = "success"
)

// BuildStatusUpdate builds the title and message for a status update notification
func BuildStatusUpdate(jenisSuratNama, status string) (string, string) {
	return "Pembaruan Status Surat", fmt.Sprintf("Surat %s Anda kini berstatus: %s", jenisSuratNama, status)
}

// BuildSuratSelesai builds the title and message for a finished/completed letter notification
func BuildSuratSelesai(jenisSuratNama string) (string, string) {
	return "Surat Selesai", fmt.Sprintf("Surat %s Anda telah selesai diterbitkan.", jenisSuratNama)
}

// Deduplicator manages in-memory deduplication of sent notifications to avoid duplication within a short window.
type Deduplicator struct {
	mu    sync.Mutex
	cache map[string]time.Time
	ttl   time.Duration
}

// NewDeduplicator creates a new Deduplicator instance with the specified cache duration
func NewDeduplicator(ttl time.Duration) *Deduplicator {
	return &Deduplicator{
		cache: make(map[string]time.Time),
		ttl:   ttl,
	}
}

// ShouldSend returns true if the notification hasn't been sent recently for the given key (userID:msgType:refID)
func (d *Deduplicator) ShouldSend(userID, msgType, refID string) bool {
	d.mu.Lock()
	defer d.mu.Unlock()

	key := fmt.Sprintf("%s:%s:%s", userID, msgType, refID)
	now := time.Now()

	// Clean up old entries first to prevent memory leak
	for k, t := range d.cache {
		if now.Sub(t) >= d.ttl {
			delete(d.cache, k)
		}
	}

	if lastSent, exists := d.cache[key]; exists && now.Sub(lastSent) < d.ttl {
		return false
	}

	d.cache[key] = now
	return true
}
