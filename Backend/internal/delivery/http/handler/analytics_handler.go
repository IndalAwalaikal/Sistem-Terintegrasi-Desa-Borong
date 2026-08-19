package handler

import (
	"net/http"
	"time"

	httpapi "desa-borong-api/internal/delivery/http/apiresponse"
)

func (h *Handler) AnalyticsDashboard(w http.ResponseWriter, r *http.Request) {
	now := time.Now()
	startOfMonth := time.Date(now.Year(), now.Month(), 1, 0, 0, 0, 0, now.Location())
	pengajuanList, _ := h.app.Persuratan.ListAll(r.Context(), "")
	pengaduanList, _ := h.app.Pengaduan.ListAll(r.Context(), "")
	pengajuanByStatus := map[string]int{}
	pengaduanByStatus := map[string]int{}
	for _, p := range pengajuanList {
		pengajuanByStatus[string(p.Status)]++
	}
	for _, p := range pengaduanList {
		pengaduanByStatus[string(p.Status)]++
	}
	httpapi.JSON(w, 200, map[string]any{
		"period": map[string]string{
			"start": startOfMonth.Format("2006-01-02"),
			"end":   now.Format("2006-01-02"),
		},
		"pengajuan": map[string]any{
			"total":     len(pengajuanList),
			"byStatus":  pengajuanByStatus,
		},
		"pengaduan": map[string]any{
			"total":     len(pengaduanList),
			"byStatus":  pengaduanByStatus,
		},
	})
}
