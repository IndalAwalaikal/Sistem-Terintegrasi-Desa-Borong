package domain

import "time"

type Role string

const (
	RoleWarga      Role = "warga"
	RoleAdmin      Role = "admin"
	RoleSuperAdmin Role = "super_admin"
)

func (r Role) IsAdmin() bool { return r == RoleAdmin || r == RoleSuperAdmin }

type User struct {
	ID                                                                                                               string
	Nama                                                                                                             string
	Email                                                                                                            string
	PasswordHash                                                                                                     string
	NIK, NoKK, TempatLahir, JenisKelamin, Agama, StatusPerkawinan, Pekerjaan, RT, RW, Dusun, Telepon, Alamat, AvatarURL *string
	TanggalLahir                                                                                                     *time.Time
	EmailVerified                                                                                                    bool
	Role                                                                                                             Role
	IsActive                                                                                                         bool
	CreatedAt, UpdatedAt                                                                                             time.Time
}

// PendingRegistration is a partially-registered account awaiting email OTP
// verification. It is promoted to a real User only once the OTP is confirmed,
// so an email/NIK that failed verification does not occupy a unique constraint
// in users and can always be registered again.
type PendingRegistration struct {
	Email                string
	Nama                 string
	PasswordHash         string
	NIK, Telepon, Alamat *string
	OTPCode              string
	OTPExpiresAt         time.Time
	CreatedAt            time.Time
}

// IsValid reports whether the pending registration's OTP is not expired.
func (p PendingRegistration) IsValid() bool { return time.Now().Before(p.OTPExpiresAt) }

// OTP is a one-time passcode issued to a user for verify_email or reset_password.
type OTP struct {
	ID        string
	UserID    string
	Code      string
	Purpose   string
	ExpiresAt time.Time
	UsedAt    *time.Time
	CreatedAt time.Time
}

const (
	OTPPurposeVerifyEmail   = "verify_email"
	OTPPurposeResetPassword = "reset_password"
)

// IsExpired reports whether the OTP is past its expiry window.
func (o OTP) IsExpired() bool { return time.Now().After(o.ExpiresAt) }

// IsValid reports whether the OTP is unused and not expired.
func (o OTP) IsValid() bool { return o.UsedAt == nil && !o.IsExpired() }

// RefreshToken is a refresh token bound to a user session.
type RefreshToken struct {
	ID, UserID, TokenHash string
	ExpiresAt             time.Time
	RevokedAt             *time.Time
	ReplacedBy            *string
	CreatedAt             time.Time
	LastUsedAt            time.Time
}
