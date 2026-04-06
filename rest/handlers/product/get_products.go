package product

import (
	"ecommerce/util"
	"net/http"
	"strconv"
)

func (h *Handler) GetProducts(w http.ResponseWriter, r *http.Request) {
	reqQuery := r.URL.Query()
	pageAsStr := reqQuery.Get("page")
	limitAsStr := reqQuery.Get("limit")
	page, _ := strconv.Atoi(pageAsStr)
	limit, _ := strconv.Atoi(limitAsStr)
	if page == 0 {
		page = 1
	}
	if limit == 0 {
		limit = 10
	}

	productList, err := h.svc.List(int64(page), int64(limit))
	if err != nil {
		util.SendError(w, 500, "Internal server error")
		return
	}
	// Count is not part of the Service interface
	// If you need total items, implement a separate Count method
	// For now, we'll use a placeholder or fetch all records
	cnt, err := h.svc.Count()
	if err != nil {
		util.SendError(w, http.StatusInternalServerError, "Internal server error")
		return
	}
	util.SendPage(w, productList, page, limit, int(cnt))

}
