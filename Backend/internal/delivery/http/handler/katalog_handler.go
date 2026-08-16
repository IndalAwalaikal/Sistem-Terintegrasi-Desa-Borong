package handler

import (
	httpapi "desa-borong-api/internal/delivery/http/apiresponse"
	"desa-borong-api/internal/domain"
	"net/http"
)

// ---- Galeri ----

func (h *Handler) GaleriList(w http.ResponseWriter, r *http.Request) {
	items, err := h.app.Galeri.List(r.Context())
	if err != nil {
		httpapi.Error(w, err)
		return
	}
	httpapi.JSON(w, 200, items)
}

func (h *Handler) GaleriGet(w http.ResponseWriter, r *http.Request) {
	a, err := h.app.Galeri.GetByID(r.Context(), r.PathValue("id"))
	if err != nil {
		httpapi.Error(w, err)
		return
	}
	httpapi.JSON(w, 200, a)
}

func (h *Handler) GaleriCreate(w http.ResponseWriter, r *http.Request) {
	var v domain.GaleriAlbum
	if decode(r, &v) != nil || !valid(v.Judul, 3, 200) {
		httpapi.Error(w, domain.ErrValidation)
		return
	}
	a, err := h.app.Galeri.Create(r.Context(), v)
	if err != nil {
		httpapi.Error(w, err)
		return
	}
	httpapi.JSON(w, 201, a)
}

func (h *Handler) GaleriUpdate(w http.ResponseWriter, r *http.Request) {
	var v domain.GaleriAlbum
	if decode(r, &v) != nil {
		httpapi.Error(w, domain.ErrValidation)
		return
	}
	a, err := h.app.Galeri.Update(r.Context(), r.PathValue("id"), v)
	if err != nil {
		httpapi.Error(w, err)
		return
	}
	httpapi.JSON(w, 200, a)
}

func (h *Handler) GaleriDelete(w http.ResponseWriter, r *http.Request) {
	if err := h.app.Galeri.Delete(r.Context(), r.PathValue("id")); err != nil {
		httpapi.Error(w, err)
		return
	}
	httpapi.JSON(w, 200, map[string]bool{"ok": true})
}

// ---- UMKM ----

func (h *Handler) UmkmList(w http.ResponseWriter, r *http.Request) {
	items, err := h.app.Umkm.List(r.Context(), r.URL.Query().Get("kategori"))
	if err != nil {
		httpapi.Error(w, err)
		return
	}
	httpapi.JSON(w, 200, items)
}

func (h *Handler) UmkmGet(w http.ResponseWriter, r *http.Request) {
	u, err := h.app.Umkm.GetBySlug(r.Context(), r.PathValue("slug"))
	if err != nil {
		httpapi.Error(w, err)
		return
	}
	httpapi.JSON(w, 200, u)
}

func (h *Handler) UmkmCreate(w http.ResponseWriter, r *http.Request) {
	var v domain.Umkm
	if decode(r, &v) != nil || !valid(v.NamaUsaha, 3, 200) || !valid(v.Pemilik, 3, 150) {
		httpapi.Error(w, domain.ErrValidation)
		return
	}
	u, err := h.app.Umkm.Create(r.Context(), v)
	if err != nil {
		httpapi.Error(w, err)
		return
	}
	httpapi.JSON(w, 201, u)
}

func (h *Handler) UmkmUpdate(w http.ResponseWriter, r *http.Request) {
	var v domain.Umkm
	if decode(r, &v) != nil {
		httpapi.Error(w, domain.ErrValidation)
		return
	}
	u, err := h.app.Umkm.Update(r.Context(), r.PathValue("id"), v)
	if err != nil {
		httpapi.Error(w, err)
		return
	}
	httpapi.JSON(w, 200, u)
}

func (h *Handler) UmkmDelete(w http.ResponseWriter, r *http.Request) {
	if err := h.app.Umkm.Delete(r.Context(), r.PathValue("id")); err != nil {
		httpapi.Error(w, err)
		return
	}
	httpapi.JSON(w, 200, map[string]bool{"ok": true})
}
