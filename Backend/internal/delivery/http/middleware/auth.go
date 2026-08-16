package middleware

import (
	"context"
	httpapi "desa-borong-api/internal/delivery/http/apiresponse"
	"desa-borong-api/internal/domain"
	iauth "desa-borong-api/internal/infrastructure/auth"
	"net/http"
	"strings"
)

type ctxKey struct{}
type Principal struct{ ID, Role string }

func PrincipalFrom(ctx context.Context) (Principal, bool) {
	v, ok := ctx.Value(ctxKey{}).(Principal)
	return v, ok
}
func Auth(s *iauth.Service) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			parts := strings.Fields(r.Header.Get("Authorization"))
			if len(parts) != 2 || !strings.EqualFold(parts[0], "bearer") {
				httpapi.Error(w, domain.ErrUnauthorized)
				return
			}
			c, e := s.Parse(parts[1])
			if e != nil {
				httpapi.Error(w, domain.ErrUnauthorized)
				return
			}
			next.ServeHTTP(w, r.WithContext(context.WithValue(r.Context(), ctxKey{}, Principal{c.Subject, c.Role})))
		})
	}
}
func Role(roles ...string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			p, ok := PrincipalFrom(r.Context())
			if !ok {
				httpapi.Error(w, domain.ErrUnauthorized)
				return
			}
			for _, role := range roles {
				if p.Role == role {
					next.ServeHTTP(w, r)
					return
				}
			}
			httpapi.Error(w, domain.ErrForbidden)
		})
	}
}
