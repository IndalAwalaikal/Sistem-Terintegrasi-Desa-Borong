package handler

import (
	"time"

	httpapi "desa-borong-api/internal/delivery/http/apiresponse"
	"desa-borong-api/internal/domain"
	"desa-borong-api/internal/usecase/berita"
	"net/http"
	"strings"
)

func (h *Handler) BeritaList(w http.ResponseWriter, r *http.Request) {
	h.beritaList(w, r, false)
}

func (h *Handler) BeritaAdminList(w http.ResponseWriter, r *http.Request) {
	h.beritaList(w, r, true)
}

func (h *Handler) beritaList(w http.ResponseWriter, r *http.Request, includeDraft bool) {
	p, l := page(r)
	q := r.URL.Query()
	f := berita.ListFilter{
		Kategori:     q.Get("kategori"),
		Search:       q.Get("search"),
		Page:         p,
		Limit:        l,
		IncludeDraft: includeDraft,
	}
	items, total := h.app.Berita.List(r.Context(), f)
	out := make([]map[string]any, 0, len(items))
	for _, b := range items {
		out = append(out, beritaResp(b))
	}
	httpapi.List(w, out, p, l, total)
}

func (h *Handler) BeritaGet(w http.ResponseWriter, r *http.Request) {
	b, err := h.app.Berita.GetBySlug(r.Context(), r.PathValue("slug"))
	if err != nil {
		httpapi.Error(w, err)
		return
	}
	httpapi.JSON(w, 200, beritaResp(b))
}

func (h *Handler) BeritaCreate(w http.ResponseWriter, r *http.Request) {
	var v struct {
		Judul, Ringkasan, Konten, Kategori, GambarSampul, Status string
		Tags                                                     []string
	}
	if decode(r, &v) != nil || !valid(v.Judul, 5, 220) || !valid(v.Ringkasan, 10, 1000) || !valid(v.Konten, 10, 200000) || !one(v.Kategori, "pengumuman", "kegiatan", "pembangunan", "lainnya") {
		httpapi.Error(w, domain.ErrValidation)
		return
	}
	b := domain.Berita{
		Judul: v.Judul, Ringkasan: v.Ringkasan, Konten: v.Konten, Kategori: v.Kategori,
		GambarSampul: strings.TrimSpace(v.GambarSampul), Tags: v.Tags,
		Status: domain.BeritaStatus(strings.TrimSpace(v.Status)),
	}
	pID := principalID(r)
	created, err := h.app.Berita.Create(r.Context(), b, &pID)
	if err != nil {
		httpapi.Error(w, err)
		return
	}
	httpapi.JSON(w, 201, beritaResp(created))
}

func (h *Handler) BeritaUpdate(w http.ResponseWriter, r *http.Request) {
	var v struct {
		Judul, Ringkasan, Konten, Kategori, GambarSampul, Status string
		Tags                                                     []string
	}
	if decode(r, &v) != nil {
		httpapi.Error(w, domain.ErrValidation)
		return
	}
	b := domain.Berita{
		Judul: v.Judul, Ringkasan: v.Ringkasan, Konten: v.Konten, Kategori: v.Kategori,
		GambarSampul: v.GambarSampul, Tags: v.Tags, Status: domain.BeritaStatus(v.Status),
	}
	updated, err := h.app.Berita.Update(r.Context(), r.PathValue("id"), b)
	if err != nil {
		httpapi.Error(w, err)
		return
	}
	httpapi.JSON(w, 200, beritaResp(updated))
}

func (h *Handler) BeritaDelete(w http.ResponseWriter, r *http.Request) {
	if err := h.app.Berita.Delete(r.Context(), r.PathValue("id")); err != nil {
		httpapi.Error(w, err)
		return
	}
	httpapi.JSON(w, 200, map[string]bool{"ok": true})
}

func beritaResp(b domain.Berita) map[string]any {
	resp := map[string]any{
		"id":           b.ID,
		"slug":         b.Slug,
		"judul":        b.Judul,
		"ringkasan":    b.Ringkasan,
		"konten":       b.Konten,
		"kategori":     b.Kategori,
		"gambarSampul": b.GambarSampul,
		"penulis":      b.Penulis,
		"tags":         b.Tags,
		"dibaca":       b.Dibaca,
		"status":       string(b.Status),
	}
	if b.TanggalTerbit != nil {
		resp["tanggalTerbit"] = b.TanggalTerbit.Format(time.RFC3339)
	} else {
		resp["tanggalTerbit"] = nil
	}
	return resp
}
