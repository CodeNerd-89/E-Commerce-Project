package product

import (
	"ecommerce/util"
	"net/http"
	"strconv"
)

func (h *Handler) GetProduct(w http.ResponseWriter, r *http.Request) {
	productID := r.PathValue("id")
	pId, err := strconv.Atoi(productID)
	if err != nil {
		http.Error(w, "Invalid request", 400)
		return
	}

	product, err := h.svc.Get(pId)
	if err != nil {
		util.SendError(w, 500, "Internal server error")
		return
	}

	if product == nil {
		util.SendError(w, 404, "Product not found")
		return
	}
	util.SendData(w, product, 200)
}
