package domain

import "errors"

var (
	ErrNotFound             = errors.New("resource not found")
	ErrConflict             = errors.New("resource conflict")
	ErrUnauthorized         = errors.New("unauthorized")
	ErrForbidden            = errors.New("forbidden")
	ErrInvalidState         = errors.New("invalid state transition")
	ErrValidation           = errors.New("validation failed")
	ErrRateLimited          = errors.New("rate limit exceeded")
	ErrEmailNotVerified     = errors.New("email not verified")
	ErrOTPInvalid           = errors.New("invalid or expired otp code")
	ErrOTPNotFound          = errors.New("otp not found")
	ErrEmailSendFailed      = errors.New("email send failed")
	ErrEmailAlreadyVerified = errors.New("email already verified")
)
