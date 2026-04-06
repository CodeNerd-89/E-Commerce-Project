package db

import (
	"ecommerce/config"
	"fmt"

	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
)

func GetNewConnectionString(cnf *config.DBConfig) string {
	connString := fmt.Sprintf("user=%s password=%s host=%s port=%d dbname=%s sslmode=disable", cnf.User, cnf.Password, cnf.Host, cnf.Port, cnf.Name)
	return connString

	if !cnf.EnableSSLMODE {
		connString += "sslmode=disable"
	}
	return connString
}

func NewConnection(cnf *config.DBConfig) (*sqlx.DB, error) {
	dbsource := GetNewConnectionString(cnf)
	dbCon, err := sqlx.Connect("postgres", dbsource)
	if err != nil {
		fmt.Println("Error connecting to database")
		return nil, err
	}
	return dbCon, nil
}
