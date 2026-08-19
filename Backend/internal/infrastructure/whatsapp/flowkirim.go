package whatsapp

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

const defaultFlowKirimBase = "https://api.flowkirim.com"

// FlowKirimSender delivers WhatsApp text messages through the FlowKirim REST API.
//
// Kontrak umum FlowKirim (lihat https://flowkirim.com):
//
//	POST {baseURL}/v1/messages/send
//	Authorization: Bearer <API_KEY>
//	Body: {"to":"6281234567890","text":"Pesan","secret":false}
type FlowKirimSender struct {
	apiKey  string
	baseURL string
	client  *http.Client
}

// NewFlowKirim creates a sender backed by the FlowKirim API. baseURL boleh kosong
// untuk memakai default https://api.flowkirim.com (bisa di-override via env).
func NewFlowKirim(apiKey, baseURL string) *FlowKirimSender {
	if strings.TrimSpace(baseURL) == "" {
		baseURL = defaultFlowKirimBase
	}
	return &FlowKirimSender{
		apiKey:  apiKey,
		baseURL: strings.TrimRight(baseURL, "/"),
		client:  &http.Client{Timeout: 15 * time.Second},
	}
}

// Send dispatches a single WhatsApp message via FlowKirim. A non-2xx response
// yields an error so the caller can retry/log.
func (f *FlowKirimSender) Send(ctx context.Context, to, text string) error {
	payload := map[string]any{
		"to":     to,
		"text":   text,
		"secret": false,
	}
	body, err := json.Marshal(payload)
	if err != nil {
		return err
	}
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, f.baseURL+"/v1/messages/send", bytes.NewReader(body))
	if err != nil {
		return err
	}
	req.Header.Set("accept", "application/json")
	req.Header.Set("Authorization", "Bearer "+f.apiKey)
	req.Header.Set("Content-Type", "application/json")

	resp, err := f.client.Do(req)
	if err != nil {
		return fmt.Errorf("flowkirim request failed: %w", err)
	}
	defer resp.Body.Close()
	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		respBody, _ := io.ReadAll(resp.Body)
		return fmt.Errorf("flowkirim API returned status %d: %s", resp.StatusCode, strings.TrimSpace(string(respBody)))
	}
	return nil
}
