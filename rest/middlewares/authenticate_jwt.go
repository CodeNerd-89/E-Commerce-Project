package middlewares

import (
	"crypto/hmac"
	"crypto/sha256"
	"ecommerce/util"
	"encoding/base64"
	"encoding/json"
	"errors"
	"net/http"
	"strings"
)

func (m *Middlewares) AuthenticateJWT(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		_, err := m.validateToken(r.Header.Get("Authorization"))
		if err != nil {
			http.Error(w, "Unauthorized", 401)
			return
		}
		next.ServeHTTP(w, r)
	})
}

func (m *Middlewares) AuthenticateAdmin(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		payload, err := m.validateToken(r.Header.Get("Authorization"))
		if err != nil {
			http.Error(w, "Unauthorized", 401)
			return
		}
		if !payload.IsShopOwner {
			http.Error(w, "Forbidden", http.StatusForbidden)
			return
		}
		next.ServeHTTP(w, r)
	})
}

func (m *Middlewares) validateToken(header string) (*util.Payload, error) {
	if header == "" {
		return nil, errors.New("missing authorization header")
	}

	headerArr := strings.Split(header, " ")
	if len(headerArr) != 2 {
		return nil, errors.New("invalid authorization header")
	}

	accessToken := headerArr[1]
	tokenParts := strings.Split(accessToken, ".")
	if len(tokenParts) != 3 {
		return nil, errors.New("invalid jwt token")
	}

	jwtHeader := tokenParts[0]
	jwtPayload := tokenParts[1]
	jwtSignature := tokenParts[2]
	message := jwtHeader + "." + jwtPayload
	byteArrSecret := []byte(m.cnf.JwtSecretKey)
	byteArrMessage := []byte(message)
	h := hmac.New(sha256.New, byteArrSecret)
	h.Write(byteArrMessage)
	hash := h.Sum(nil)
	newSignature := base64UrlEncode(hash)
	if newSignature != jwtSignature {
		return nil, errors.New("invalid jwt signature")
	}

	payloadBytes, err := base64.RawURLEncoding.DecodeString(jwtPayload)
	if err != nil {
		return nil, err
	}

	var payload util.Payload
	if err := json.Unmarshal(payloadBytes, &payload); err != nil {
		return nil, err
	}

	return &payload, nil
}

func base64UrlEncode(data []byte) string {
	return base64.URLEncoding.WithPadding(base64.NoPadding).EncodeToString(data)
}
