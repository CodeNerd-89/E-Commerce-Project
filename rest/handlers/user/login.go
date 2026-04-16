package user

import (
	"ecommerce/util"
	"encoding/json"
	"fmt"
	"net/http"
)

type ReqLogin struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func (h *Handler) Login(w http.ResponseWriter, r *http.Request) {

	var req ReqLogin
	decoder := json.NewDecoder(r.Body)
	err := decoder.Decode(&req)

	if err != nil {
		fmt.Println(err)
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}
	usr, err := h.svc.Find(req.Email, req.Password)
	if err != nil || usr == nil {
		http.Error(w, "Invalid credentials", http.StatusUnauthorized)
		return
	}
	accessToken, err := util.CreateJWT(h.cnf.JwtSecretKey, util.Payload{
		Sub:         usr.ID,
		FirstName:   usr.FirstName,
		LastName:    usr.LastName,
		Email:       usr.Email,
		IsShopOwner: usr.IsShopOwner,
	})
	if err != nil {
		http.Error(w, "Error creating access token", http.StatusInternalServerError)
		return
	}

	util.SendData(w, loginResponse{
		Token: accessToken,
		User:  newUserResponse(usr),
	}, http.StatusOK)
}
