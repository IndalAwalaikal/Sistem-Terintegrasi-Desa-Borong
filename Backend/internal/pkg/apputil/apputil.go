// Package apputil holds small, dependency-free helpers shared across usecase
// services. It exists in its own package so the sub-package services can import
// it without creating an import cycle with the usecase composition root.
package apputil

import (
	"encoding/json"
	"strings"
	"time"

	"github.com/oklog/ulid/v2"
)

// NewID returns a new ULID string used as primary key for rows.
func NewID() string { return ulid.Make().String() }

// JSON marshals v into a compact JSON string.
func JSON(v any) (string, error) {
	b, e := json.Marshal(v)
	return string(b), e
}

// ParseJSON decodes a JSON string into a generic value, falling back to the raw
// string when it is not valid JSON (used for JSON column attributes).
func ParseJSON(s string) any {
	var v any
	if json.Unmarshal([]byte(s), &v) != nil {
		return s
	}
	return v
}

// Slug converts an arbitrary UTF-8 title into a URL-safe slug.
func Slug(v string) string {
	v = strings.ToLower(strings.TrimSpace(v))
	var b strings.Builder
	dash := false
	for _, r := range v {
		if (r >= 'a' && r <= 'z') || (r >= '0' && r <= '9') {
			b.WriteRune(r)
			dash = false
		} else if !dash {
			b.WriteByte('-')
			dash = true
		}
	}
	return strings.Trim(b.String(), "-")
}

// Resi creates an opaque, collision-resistant tracking number. It must not be
// predictable because it is accepted by the public tracking endpoint.
func Resi(kode string) string {
	id := ulid.Make().String()
	return strings.ToUpper(kode) + "-" + time.Now().Format("20060102") + "-" + id[len(id)-8:]
}

// Tiket creates an opaque, collision-resistant complaint tracking number.
func Tiket() string {
	id := ulid.Make().String()
	return "ADU-" + time.Now().Format("20060102") + "-" + id[len(id)-8:]
}
