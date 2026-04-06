package repo

import (
	"ecommerce/domain"
	"ecommerce/user"
	"fmt"
	"strings"

	"github.com/jmoiron/sqlx"
	"golang.org/x/crypto/bcrypt"
)

type UserRepo interface {
	user.UserRepo
}

type UserStore struct {
	db *sqlx.DB
}

func NewUserRepo(db *sqlx.DB) UserRepo {
	return &UserStore{
		db: db,
	}
}

func (r *UserStore) Create(user domain.User) (*domain.User, error) {
	query := `
INSERT INTO users (first_name, last_name, email, password, is_shop_owner)
VALUES (:first_name, :last_name, :email, :password, :is_shop_owner)
RETURNING id
`

	var userID int
	rows, err := r.db.NamedQuery(query, user)
	if err != nil {
		fmt.Println(err)
		return nil, err
	}

	if rows.Next() {
		rows.Scan(&userID)
	}
	user.ID = userID
	return &user, nil
}

func (r *UserStore) Find(email, pass string) (*domain.User, error) {
	var user domain.User
	query := `
	SELECT id, first_name, last_name, email, password, is_shop_owner
	FROM users
	WHERE email=$1
	`
	err := r.db.Get(&user, query, email)
	if err != nil {
		return nil, err
	}

	// Support both plaintext and bcrypt-hashed passwords.
	// If the password looks like a bcrypt hash, verify using bcrypt.
	if strings.HasPrefix(user.Password, "$2a$") || strings.HasPrefix(user.Password, "$2b$") || strings.HasPrefix(user.Password, "$2y$") {
		if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(pass)); err != nil {
			return nil, fmt.Errorf("invalid credentials")
		}
		return &user, nil
	}

	if user.Password != pass {
		return nil, fmt.Errorf("invalid credentials")
	}

	return &user, nil
}
