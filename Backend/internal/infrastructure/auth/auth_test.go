package auth

import (
	"testing"
	"time"
)

func TestAccessTokenRoundTrip(t *testing.T) {
	s := New("01234567890123456789012345678901", time.Minute)
	token, _, err := s.IssueAccess("01HUSER", "warga")
	if err != nil {
		t.Fatal(err)
	}
	claims, err := s.Parse(token)
	if err != nil {
		t.Fatal(err)
	}
	if claims.Subject != "01HUSER" || claims.Role != "warga" {
		t.Fatalf("unexpected claims: %#v", claims)
	}
}

func TestRefreshIsRandomAndHashDoesNotExposeIt(t *testing.T) {
	a, err := NewRefresh()
	if err != nil {
		t.Fatal(err)
	}
	b, err := NewRefresh()
	if err != nil {
		t.Fatal(err)
	}
	if a == b || Hash(a) == a {
		t.Fatal("refresh token generation/hash is unsafe")
	}
}
