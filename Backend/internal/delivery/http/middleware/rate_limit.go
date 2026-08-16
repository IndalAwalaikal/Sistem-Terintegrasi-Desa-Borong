package middleware

import (
	"net"
	"net/http"
	"sync"
	"time"

	apiresponse "desa-borong-api/internal/delivery/http/apiresponse"
	"desa-borong-api/internal/domain"
)

type visitor struct {
	tokens  float64
	updated time.Time
}
type RateLimiter struct {
	mu                  sync.Mutex
	visitors            map[string]visitor
	capacity, perSecond float64
	lastCleanup         time.Time
}

func NewRateLimiter(capacity int, window time.Duration) *RateLimiter {
	return &RateLimiter{visitors: map[string]visitor{}, capacity: float64(capacity), perSecond: float64(capacity) / window.Seconds()}
}
func (l *RateLimiter) Allow(ip string) bool {
	l.mu.Lock()
	defer l.mu.Unlock()
	now := time.Now()
	if now.Sub(l.lastCleanup) >= 10*time.Minute {
		for key, candidate := range l.visitors {
			if now.Sub(candidate.updated) > 2*time.Hour {
				delete(l.visitors, key)
			}
		}
		l.lastCleanup = now
	}
	v := l.visitors[ip]
	if v.updated.IsZero() {
		v = visitor{tokens: l.capacity, updated: now}
	}
	v.tokens = min(l.capacity, v.tokens+now.Sub(v.updated).Seconds()*l.perSecond)
	v.updated = now
	if v.tokens < 1 {
		l.visitors[ip] = v
		return false
	}
	v.tokens--
	l.visitors[ip] = v
	return true
}
func (l *RateLimiter) Middleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		host, _, err := net.SplitHostPort(r.RemoteAddr)
		if err != nil {
			host = r.RemoteAddr
		}
		if !l.Allow(host) {
			w.Header().Set("Retry-After", "60")
			apiresponse.Error(w, domain.ErrRateLimited)
			return
		}
		next.ServeHTTP(w, r)
	})
}
func min(a, b float64) float64 {
	if a < b {
		return a
	}
	return b
}
