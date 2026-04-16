package user

import (
	"ecommerce/domain"
	"ecommerce/util"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"

	"github.com/lib/pq"
)

type ReqCreateUser struct {
	FirstName   string `json:"first_name"`
	LastName    string `json:"last_name"`
	Email       string `json:"email"`
	Password    string `json:"password"`
	IsShopOwner bool   `json:"is_shop_owner"`
}

func (h *Handler) CreateUser(w http.ResponseWriter, r *http.Request) {

	var req ReqCreateUser
	decoder := json.NewDecoder(r.Body)
	err := decoder.Decode(&req)

	if err != nil {
		fmt.Println(err)
		util.SendError(w, http.StatusBadRequest, "Invalid request")
		return
	}

	if req.IsShopOwner {
		adminExists, err := h.svc.AdminExists()
		if err != nil {
			fmt.Println(err)
			util.SendError(w, http.StatusInternalServerError, "Internal server error")
			return
		}

		if adminExists {
			util.SendError(w, http.StatusConflict, "Admin account already exists")
			return
		}
	}

	hashedPassword, err := util.HashPassword(req.Password)
	if err != nil {
		fmt.Println("error hashing password:", err)
		util.SendError(w, http.StatusInternalServerError, "Internal server error")
		return
	}

	usr, err := h.svc.Create(domain.User{
		FirstName:   req.FirstName,
		LastName:    req.LastName,
		Email:       req.Email,
		Password:    hashedPassword,
		IsShopOwner: req.IsShopOwner,
	})
	if err != nil {
		fmt.Println(err)
		var pqErr *pq.Error
		if errors.As(err, &pqErr) && pqErr.Code == "23505" {
			util.SendError(w, http.StatusConflict, "An account with this email already exists")
			return
		}
		util.SendError(w, http.StatusInternalServerError, "Internal server error")
		return
	}
	util.SendData(w, newUserResponse(usr), http.StatusCreated)
}
