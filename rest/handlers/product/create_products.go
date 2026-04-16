package product

import (
	"ecommerce/domain"
	"ecommerce/util"
	"encoding/json"
	"fmt"
	"net/http"
)

type ReqCreateProduct struct {
	Title       string  `json:"title"`
	Description string  `json:"description"`
	Price       float64 `json:"price"`
	ImgUrl      string  `json:"imageUrl"`
}

func (h *Handler) CreateProduct(w http.ResponseWriter, r *http.Request) {
	var req ReqCreateProduct
	decoder := json.NewDecoder(r.Body)
	err := decoder.Decode(&req)

	if err != nil {
		fmt.Println(err)
		util.SendError(w, http.StatusBadRequest, "Invalid request")
		return
	}

	if req.Title == "" || req.Description == "" || req.Price < 0 {
		util.SendError(w, http.StatusBadRequest, "Title, description, and a valid price are required")
		return
	}
	createdProduct, err := h.svc.Create(domain.Product{Title: req.Title, Description: req.Description, Price: req.Price, ImgUrl: req.ImgUrl})
	if err != nil {
		fmt.Println(err)
		util.SendError(w, http.StatusInternalServerError, "Internal server error")
		return
	}
	util.SendData(w, createdProduct, http.StatusCreated)
}
