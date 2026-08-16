package email

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"
	"time"
)

const brevoAPIBase = "https://api.brevo.com/v3/smtp/email"

// BrevoSender delivers email through the Brevo (formerly Sendinblue) SMTP HTTP API.
type BrevoSender struct {
	apiKey string
	from   string
	client *http.Client
}

// NewBrevo creates a sender backed by the Brevo transactional email API.
func NewBrevo(apiKey, from string) *BrevoSender {
	return &BrevoSender{
		apiKey: apiKey,
		from:   from,
		client: &http.Client{Timeout: 15 * time.Second},
	}
}

func (b *BrevoSender) From() string { return b.from }

// Send dispatches a single email via Brevo. A non-2xx response yields an error.
func (b *BrevoSender) Send(ctx context.Context, to, subject, htmlBody string) error {
	payload := map[string]any{
		"sender":      map[string]string{"email": b.from, "name": "Desa Borong"},
		"to":          []map[string]string{{"email": to}},
		"subject":     subject,
		"htmlContent": htmlBody,
	}
	body, err := json.Marshal(payload)
	if err != nil {
		return err
	}
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, brevoAPIBase, bytes.NewReader(body))
	if err != nil {
		return err
	}
	req.Header.Set("accept", "application/json")
	req.Header.Set("api-key", b.apiKey)
	req.Header.Set("Content-Type", "application/json")

	resp, err := b.client.Do(req)
	if err != nil {
		return fmt.Errorf("brevo request failed: %w", err)
	}
	defer resp.Body.Close()
	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		respBody, _ := io.ReadAll(resp.Body)
		return fmt.Errorf("brevo API returned status %d: %s", resp.StatusCode, strings.TrimSpace(string(respBody)))
	}
	return nil
}
