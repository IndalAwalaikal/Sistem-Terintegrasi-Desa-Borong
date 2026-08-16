package handler

import (
	"io"
	"net/http"
	"net/url"
	"strings"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestValid(t *testing.T) {
	assert.True(t, valid("  abc  ", 1, 5))
	assert.False(t, valid("abc", 5, 10))
	assert.False(t, valid("abc", 4, 10))
	assert.False(t, valid("abcdefghijk", 1, 5))
	assert.False(t, valid("", 1, 5))
}

func TestDigits(t *testing.T) {
	assert.True(t, digits("1234567890123456"))
	assert.False(t, digits("12345abcde"))
	assert.False(t, digits(""))
}

func TestValidEmail(t *testing.T) {
	// validEmail memang disengaja naive: hanya memastikan ada '@' dan '.'.
	// Ini adalah titik kelemahan yang harus dipertimbangkan penggunaan
	// email-validator paket bila butuh validasi lokal yang ketat.
	assert.True(t, validEmail("warga@desaborong.id"))
	assert.False(t, validEmail("bukan-email"))
	assert.False(t, validEmail("tanpatointi@"))
	assert.False(t, validEmail("a.b"))
}

func TestOne(t *testing.T) {
	assert.True(t, one("admin", "admin", "super_admin"))
	assert.False(t, one("warga", "admin", "super_admin"))
}

func TestPageDefaultsAndClamping(t *testing.T) {
	// No params → default page 1, limit 10.
	r := &http.Request{URL: &url.URL{}}
	p, l := page(r)
	assert.Equal(t, 1, p)
	assert.Equal(t, 10, l)

	// Explicit values.
	r = &http.Request{URL: &url.URL{RawQuery: "page=3&limit=25"}}
	p, l = page(r)
	assert.Equal(t, 3, p)
	assert.Equal(t, 25, l)

	// Limit clamped to max 100.
	r = &http.Request{URL: &url.URL{RawQuery: "limit=500"}}
	_, l = page(r)
	assert.Equal(t, 100, l)

	// Negative page resets to 1.
	r = &http.Request{URL: &url.URL{RawQuery: "page=-1&limit=5"}}
	p, l = page(r)
	assert.Equal(t, 1, p)
	assert.Equal(t, 5, l)
}

func TestDecodeValidAndRejectsMultipleJSONValues(t *testing.T) {
	r := &http.Request{Header: http.Header{"Content-Type": []string{"application/json"}}}

	// Valid single JSON object decodes cleanly.
	r.Body = io.NopCloser(strings.NewReader(`{"name":"Budi"}`))
	var v struct{ Name string }
	err := decode(r, &v)
	assert.NoError(t, err)
	assert.Equal(t, "Budi", v.Name)

	// Two concatenated JSON values must be rejected by the one-value contract.
	r.Body = io.NopCloser(strings.NewReader(`{"a":1}{"b":2}`))
	var v2 struct{ A, B int }
	err = decode(r, &v2)
	assert.Error(t, err)
	assert.Contains(t, err.Error(), "one JSON value")
}
