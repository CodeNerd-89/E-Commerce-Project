package middlewares

import (
	"net/http"
)

func Cors(next http.Handler) http.Handler {
	// Handle Cors
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		allowHeaders := r.Header.Get("Access-Control-Request-Headers")
		if allowHeaders == "" {
			allowHeaders = "Content-Type, Authorization"
		}

		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", allowHeaders)
		w.Header().Set("Content-Type", "application/json")
		next.ServeHTTP(w, r)
	})
}
