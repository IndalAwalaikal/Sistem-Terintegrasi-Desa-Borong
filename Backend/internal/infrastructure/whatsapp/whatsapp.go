// Package whatsapp provides outbound WhatsApp delivery via the FlowKirim gateway.
// When FLOWKIRIM_API_KEY is configured the real FlowKirimSender is used;
// otherwise a NoopSender logs the message (development / local without network egress).
package whatsapp

import (
	"context"
	"log/slog"
)

// Sender delivers WhatsApp messages. Implementations must be safe for concurrent use.
type Sender interface {
	Send(ctx context.Context, to, text string) error
}

// New returns a FlowKirim sender when apiKey is set, otherwise a NoopSender that
// only logs. This lets the rest of the app stay decoupled from the delivery
// mechanism.
func New(apiKey, baseURL string) Sender {
	if apiKey != "" {
		return NewFlowKirim(apiKey, baseURL)
	}
	slog.Info("whatsapp delivery running in NOOP mode (set FLOWKIRIM_API_KEY to enable)")
	return NewNoop()
}
