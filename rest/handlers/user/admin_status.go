package user

import (
	"ecommerce/util"
	"net/http"
)

func (h *Handler) GetAdminStatus(w http.ResponseWriter, r *http.Request) {
	adminExists, err := h.svc.AdminExists()
	if err != nil {
		util.SendError(w, http.StatusInternalServerError, "Internal server error")
		return
	}

	util.SendData(w, adminStatusResponse{
		AdminExists: adminExists,
	}, http.StatusOK)
}
