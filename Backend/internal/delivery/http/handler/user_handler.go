package handler

import (
	httpapi "desa-borong-api/internal/delivery/http/apiresponse"
	"desa-borong-api/internal/domain"
	"net/http"
)

func (h *Handler) UsersList(w http.ResponseWriter, r *http.Request) {
	users, err := h.app.User.ListAll(r.Context())
	if err != nil {
		httpapi.Error(w, err)
		return
	}
	out := make([]map[string]any, 0, len(users))
	for _, u := range users {
		out = append(out, userResp(u))
	}
	httpapi.JSON(w, 200, out)
}

func (h *Handler) UserUpdate(w http.ResponseWriter, r *http.Request) {
	var v struct {
		Role     string `json:"role"`
		IsActive *bool  `json:"isActive"`
	}
	if decode(r, &v) != nil || !one(v.Role, "warga", "admin", "super_admin") {
		httpapi.Error(w, domain.ErrValidation)
		return
	}
	isActive := true
	if v.IsActive != nil {
		isActive = *v.IsActive
	}
	u, err := h.app.User.UpdateRole(r.Context(), r.PathValue("id"), domain.Role(v.Role), isActive)
	if err != nil {
		httpapi.Error(w, err)
		return
	}
	httpapi.JSON(w, 200, userResp(u))
}
