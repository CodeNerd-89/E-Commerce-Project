package rest

import (
	"ecommerce/config"
	product "ecommerce/rest/handlers/product"
	user "ecommerce/rest/handlers/user"
	middleware "ecommerce/rest/middlewares"
	"fmt"
	"net/http"
	"os"
	"strconv"
)

type Server struct {
	cnf            *config.Config
	productHandler *product.Handler
	userHandler    *user.Handler
}

func NewServer(cnf *config.Config, productHandler *product.Handler, userHandler *user.Handler) *Server {
	return &Server{
		cnf:            cnf,
		productHandler: productHandler,
		userHandler:    userHandler,
	}
}

func (s *Server) Start() {
	manager := middleware.NewManager()
	manager.Use(
		middleware.Preflight,
		middleware.Cors,
		middleware.Logger,
	)
	mux := http.NewServeMux()
	wrappedMux := manager.WrapMux(mux)
	s.productHandler.RegisterRoutes(mux, manager)
	s.userHandler.RegisterRoutes(mux, manager)
	addr := ":" + strconv.Itoa(s.cnf.HttpPort)
	fmt.Println("Server is running on port", addr)
	err := http.ListenAndServe(addr, wrappedMux)
	if err != nil {
		fmt.Println("Error starting server", err)
		os.Exit(1)
	}

}
