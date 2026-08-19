package whatsapp

import (
	"context"
	"log/slog"
)

// NoopSender logs WhatsApp messages instead of sending them. Safe fallback when
// FLOWKIRIM_API_KEY is not configured (local/dev).
type NoopSender struct{}

// NewNoop creates a sender that only logs.
func NewNoop() *NoopSender { return &NoopSender{} }

// Send records the message via the structured logger and always succeeds.
func (n *NoopSender) Send(ctx context.Context, to, text string) error {
	slog.Info("noop whatsapp", "to", to, "text", text)
	return nil
}
