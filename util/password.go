package util

import "golang.org/x/crypto/bcrypt"

// HashPassword generates a bcrypt hash of the given password.
func HashPassword(password string) (string, error) {
	hashed, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return string(hashed), nil
}

// ComparePassword compares a bcrypt hashed password with its possible plaintext equivalent.
// Returns nil on success, or an error if the password does not match.
func ComparePassword(hashedPassword, password string) error {
	return bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
}
