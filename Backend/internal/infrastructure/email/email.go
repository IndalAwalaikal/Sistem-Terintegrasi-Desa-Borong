// Package email provides outbound email delivery. When a Brevo API key is
// configured the real BrevoSender is used; otherwise a NoopSender simply logs
// the message (development / local without network egress).
package email

import (
	"context"

	"log/slog"
)

// Sender delivers email. Implementations must be safe for concurrent use.
type Sender interface {
	From() string
	Send(ctx context.Context, to, subject, htmlBody string) error
}

// New returns a Brevo sender when apiKey is set, otherwise a NoopSender that
// only logs. This lets the rest of the app stay decoupled from the delivery
// mechanism.
func New(apiKey, from string) Sender {
	if apiKey != "" {
		return NewBrevo(apiKey, from)
	}
	slog.Info("email delivery running in NOOP mode (set BREVO_API_KEY to enable)")
	return NewNoop(from)
}
