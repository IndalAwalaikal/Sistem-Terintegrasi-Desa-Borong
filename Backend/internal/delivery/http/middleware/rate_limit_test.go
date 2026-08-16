package middleware

import (
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
)

func TestRateLimiter_AllowsUpToCapacity(t *testing.T) {
	l := NewRateLimiter(3, time.Minute)
	for i := 0; i < 3; i++ {
		assert.True(t, l.Allow("192.0.2.1"), "request %d should be allowed", i+1)
	}
}

func TestRateLimiter_BlocksOverLimit(t *testing.T) {
	l := NewRateLimiter(2, time.Minute)
	assert.True(t, l.Allow("198.51.100.7"))
	assert.True(t, l.Allow("198.51.100.7"))
	assert.False(t, l.Allow("198.51.100.7"), "third request within the window must be rejected")
}

func TestRateLimiter_IsPerIP(t *testing.T) {
	l := NewRateLimiter(1, time.Minute)
	assert.True(t, l.Allow("10.0.0.1"))
	assert.False(t, l.Allow("10.0.0.1"))
	// Different IP has its own bucket.
	assert.True(t, l.Allow("10.0.0.2"))
}

func TestRateLimiter_RefillsOverTime(t *testing.T) {
	// capacity 1 token, refilling 1 token per second (window 1s).
	l := NewRateLimiter(1, time.Second)
	assert.True(t, l.Allow("172.16.0.1"))
	assert.False(t, l.Allow("172.16.0.1"))
	// Advance beyond the refill window.
	time.Sleep(1100 * time.Millisecond)
	assert.True(t, l.Allow("172.16.0.1"), "token bucket should refill after window elapses")
}
