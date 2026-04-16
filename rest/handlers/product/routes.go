package product

import (
	middleware "ecommerce/rest/middlewares"
	"net/http"
)

func (h *Handler) RegisterRoutes(mux *http.ServeMux, manager *middleware.Manager) {
	mux.Handle("GET /products",
		manager.With(
			http.HandlerFunc(h.GetProducts),
		),
	)
	// Create product (RESTful)
	mux.Handle("POST /products",
		manager.With(
			http.HandlerFunc(h.CreateProduct),
			h.middlewares.AuthenticateAdmin,
		),
	)
	mux.Handle("GET /products/{id}",
		manager.With(
			http.HandlerFunc(h.GetProduct),
		),
	)
	mux.Handle("PUT /products/{id}",
		manager.With(
			http.HandlerFunc(h.UpdateProduct),
			h.middlewares.AuthenticateAdmin,
		),
	)
	mux.Handle("DELETE /products/{id}",
		manager.With(
			http.HandlerFunc(h.DeleteProduct),
			h.middlewares.AuthenticateAdmin,
		),
	)
}
