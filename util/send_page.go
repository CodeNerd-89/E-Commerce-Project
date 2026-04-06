package util

import (
	"net/http"
)

type PaginatedData struct {
	Data       any        `json:"data"`
	Pagination Pagination `json:"pagination"`
}

type Pagination struct {
	Page       int64 `json:"Page"`
	Limit      int64 `json:"limit"`
	TotalItems int64 `json:"totalItems"`
	TotalPages int64 `json:"totalPages"`
}

func SendPage(w http.ResponseWriter, data any, page, limit, cnt int) {
	PaginatedData := PaginatedData{
		Data: data,
		Pagination: Pagination{
			Page:       int64(page),
			Limit:      int64(limit),
			TotalItems: int64(cnt),
			TotalPages: int64(cnt / limit),
		},
	}
	SendData(w, PaginatedData, http.StatusOK)
}
