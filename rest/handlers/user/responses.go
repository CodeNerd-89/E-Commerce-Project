package user

import "ecommerce/domain"

type userResponse struct {
	ID          int    `json:"id"`
	FirstName   string `json:"first_name"`
	LastName    string `json:"last_name"`
	Email       string `json:"email"`
	IsShopOwner bool   `json:"is_shop_owner"`
}

type loginResponse struct {
	Token string       `json:"token"`
	User  userResponse `json:"user"`
}

type adminStatusResponse struct {
	AdminExists bool `json:"admin_exists"`
}

func newUserResponse(usr *domain.User) userResponse {
	return userResponse{
		ID:          usr.ID,
		FirstName:   usr.FirstName,
		LastName:    usr.LastName,
		Email:       usr.Email,
		IsShopOwner: usr.IsShopOwner,
	}
}
