package product

import (
	"ecommerce/domain"
	"ecommerce/util"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
)

type ReqUpdateProduct struct {
	Title       string  `json:"title"`
	Description string  `json:"description"`
	Price       float64 `json:"price"`
	ImgUrl      string  `json:"imageUrl"`
}

func (h *Handler) UpdateProduct(w http.ResponseWriter, r *http.Request) {
	productID := r.PathValue("id")
	pId, err := strconv.Atoi(productID)
	if err != nil {
		util.SendError(w, http.StatusBadRequest, "Invalid product ID")
		return
	}

	var req ReqUpdateProduct
	decoder := json.NewDecoder(r.Body)
	err = decoder.Decode(&req)
	if err != nil {
		fmt.Println(err)
		util.SendError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	if req.Title == "" || req.Description == "" || req.Price < 0 {
		util.SendError(w, http.StatusBadRequest, "Title, description, and a valid price are required")
		return
	}
	_, err = h.svc.Update(domain.Product{ID: pId, Title: req.Title, Description: req.Description, Price: req.Price, ImgUrl: req.ImgUrl})
	if err != nil {
		util.SendError(w, http.StatusBadRequest, err.Error())
		return
	}
	util.SendData(w, "Successfully updated", http.StatusOK)
}
