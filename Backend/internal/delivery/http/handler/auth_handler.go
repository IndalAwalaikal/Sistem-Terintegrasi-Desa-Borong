package handler

import (
	"time"

	httpapi "desa-borong-api/internal/delivery/http/apiresponse"
	"desa-borong-api/internal/domain"
	"desa-borong-api/internal/usecase/auth"
	"net/http"
)

func (h *Handler) Register(w http.ResponseWriter, r *http.Request) {
	var v struct{ Nama, Email, Password, NIK, Telepon, Alamat string }
	if decode(r, &v) != nil || !valid(v.Nama, 3, 150) || !valid(v.Password, 8, 128) || len(v.NIK) != 16 || !digits(v.NIK) || !valid(v.Telepon, 10, 30) || !valid(v.Alamat, 5, 2000) || !validEmail(v.Email) {
		httpapi.Error(w, domain.ErrValidation)
		return
	}
	res, err := h.app.Auth.Register(r.Context(), v.Nama, v.Email, v.Password, v.NIK, v.Telepon, v.Alamat)
	if err != nil {
		httpapi.Error(w, err)
		return
	}
	httpapi.JSON(w, 201, map[string]any{"email": res.Email, "message": res.Message, "emailSent": res.EmailSent})
}

func (h *Handler) Login(w http.ResponseWriter, r *http.Request) {
	var v struct{ Email, Password string }
	if decode(r, &v) != nil || !valid(v.Email, 3, 191) || !valid(v.Password, 1, 128) {
		httpapi.Error(w, domain.ErrValidation)
		return
	}
	s, err := h.app.Auth.Login(r.Context(), v.Email, v.Password)
	if err != nil {
		httpapi.Error(w, err)
		return
	}
	httpapi.JSON(w, 200, sessionResp(s))
}

// VerifyOTP validates a registration OTP and starts a session.
func (h *Handler) VerifyOTP(w http.ResponseWriter, r *http.Request) {
	var v struct{ Email, Code string }
	if decode(r, &v) != nil || !valid(v.Email, 3, 191) || !validEmail(v.Email) || !valid(v.Code, 4, 10) || !digits(v.Code) {
		httpapi.Error(w, domain.ErrValidation)
		return
	}
	s, err := h.app.Auth.VerifyOTP(r.Context(), v.Email, v.Code)
	if err != nil {
		httpapi.Error(w, err)
		return
	}
	httpapi.JSON(w, 200, sessionResp(s))
}

// ResendOTP re-issues a verification code to the given email.
func (h *Handler) ResendOTP(w http.ResponseWriter, r *http.Request) {
	var v struct{ Email string }
	if decode(r, &v) != nil || !valid(v.Email, 3, 191) || !validEmail(v.Email) {
		httpapi.Error(w, domain.ErrValidation)
		return
	}
	if err := h.app.Auth.ResendOTP(r.Context(), v.Email); err != nil {
		httpapi.Error(w, err)
		return
	}
	httpapi.JSON(w, 200, map[string]any{"message": "Kode verifikasi telah dikirim ulang ke email Anda."})
}

// ForgotPassword issues a password-reset OTP (never reveals if email exists).
func (h *Handler) ForgotPassword(w http.ResponseWriter, r *http.Request) {
	var v struct{ Email string }
	if decode(r, &v) != nil || !valid(v.Email, 3, 191) || !validEmail(v.Email) {
		httpapi.Error(w, domain.ErrValidation)
		return
	}
	if err := h.app.Auth.ForgotPassword(r.Context(), v.Email); err != nil {
		httpapi.Error(w, err)
		return
	}
	httpapi.JSON(w, 200, map[string]any{"message": "Jika akun terdaftar, kode reset password telah dikirim ke email Anda."})
}

// ResetPassword consumes a reset OTP and changes the password.
func (h *Handler) ResetPassword(w http.ResponseWriter, r *http.Request) {
	var v struct{ Email, Code, PasswordBaru string }
	if decode(r, &v) != nil || !valid(v.Email, 3, 191) || !validEmail(v.Email) || !valid(v.Code, 4, 10) || !digits(v.Code) || !valid(v.PasswordBaru, 8, 128) {
		httpapi.Error(w, domain.ErrValidation)
		return
	}
	if err := h.app.Auth.ResetPassword(r.Context(), v.Email, v.Code, v.PasswordBaru); err != nil {
		httpapi.Error(w, err)
		return
	}
	httpapi.JSON(w, 200, map[string]any{"message": "Password berhasil diubah. Silakan masuk kembali."})
}

func sessionResp(s auth.Session) map[string]any {
	resp := map[string]any{
		"token":        s.AccessToken,
		"accessToken":  s.AccessToken,
		"refreshToken": s.RefreshToken,
		"expiresAt":    s.ExpiresAt.Format(time.RFC3339),
		"user":         userResp(s.User),
	}
	return resp
}

func (h *Handler) Refresh(w http.ResponseWriter, r *http.Request) {
	var v struct{ RefreshToken string }
	if decode(r, &v) != nil || !valid(v.RefreshToken, 20, 500) {
		httpapi.Error(w, domain.ErrValidation)
		return
	}
	a, ref, err := h.app.Auth.Refresh(r.Context(), v.RefreshToken)
	if err != nil {
		httpapi.Error(w, err)
		return
	}
	httpapi.JSON(w, 200, map[string]any{"token": a, "accessToken": a, "refreshToken": ref})
}

func (h *Handler) Logout(w http.ResponseWriter, r *http.Request) {
	var v struct{ RefreshToken string }
	if decode(r, &v) != nil || !valid(v.RefreshToken, 20, 500) {
		httpapi.Error(w, domain.ErrValidation)
		return
	}
	if err := h.app.Auth.Logout(r.Context(), v.RefreshToken); err != nil {
		httpapi.Error(w, err)
		return
	}
	httpapi.JSON(w, 200, map[string]bool{"ok": true})
}

func (h *Handler) Me(w http.ResponseWriter, r *http.Request) {
	u, err := h.app.Auth.Me(r.Context(), principalID(r))
	if err != nil {
		httpapi.Error(w, err)
		return
	}
	httpapi.JSON(w, 200, userResp(u))
}

func (h *Handler) ChangePassword(w http.ResponseWriter, r *http.Request) {
	var v struct{ PasswordLama, PasswordBaru string }
	if decode(r, &v) != nil || !valid(v.PasswordLama, 1, 128) || !valid(v.PasswordBaru, 8, 128) {
		httpapi.Error(w, domain.ErrValidation)
		return
	}
	if err := h.app.Auth.ChangePassword(r.Context(), principalID(r), v.PasswordLama, v.PasswordBaru); err != nil {
		httpapi.Error(w, err)
		return
	}
	httpapi.JSON(w, 200, map[string]bool{"ok": true})
}

// UpdateProfile handles PUT /api/users/profile (logged-in user edits own data).
func (h *Handler) UpdateProfile(w http.ResponseWriter, r *http.Request) {
	var v struct {
		Nama, Email, NIK, NoKK, TempatLahir, TanggalLahir, JenisKelamin, Agama, StatusPerkawinan, Pekerjaan, RT, RW, Dusun, Telepon, Alamat, AvatarUrl string
		PasswordBaru                                                                                                                                   string
	}
	if decode(r, &v) != nil || !valid(v.Nama, 3, 150) || !validEmail(v.Email) {
		httpapi.Error(w, domain.ErrValidation)
		return
	}
	if v.PasswordBaru != "" && !valid(v.PasswordBaru, 8, 128) {
		httpapi.Error(w, domain.ErrValidation)
		return
	}
	input := auth.ProfileInput{
		Nama:             v.Nama,
		Email:            v.Email,
		NIK:              v.NIK,
		NoKK:             v.NoKK,
		TempatLahir:      v.TempatLahir,
		TanggalLahir:     v.TanggalLahir,
		JenisKelamin:     v.JenisKelamin,
		Agama:            v.Agama,
		StatusPerkawinan: v.StatusPerkawinan,
		Pekerjaan:        v.Pekerjaan,
		RT:               v.RT,
		RW:               v.RW,
		Dusun:            v.Dusun,
		Telepon:          v.Telepon,
		Alamat:           v.Alamat,
		AvatarURL:        v.AvatarUrl,
		PasswordBaru:     v.PasswordBaru,
	}
	u, err := h.app.Auth.UpdateProfile(r.Context(), principalID(r), input)
	if err != nil {
		httpapi.Error(w, err)
		return
	}
	httpapi.JSON(w, 200, userResp(u))
}
