package config

import (
	"fmt"
	"os"
	"strconv"

	"github.com/joho/godotenv"
)

var configurations *Config

type DBConfig struct {
	Host          string
	Port          int
	Name          string
	User          string
	Password      string
	EnableSSLMODE bool
}

type Config struct {
	Version      string
	ServiceName  string
	HttpPort     int
	JwtSecretKey string
	DB           DBConfig
}

func loadConfig() {

	err := godotenv.Load()
	if err != nil {
		fmt.Println("Error loading.env file", err)
		os.Exit(1)
	}

	version := os.Getenv("VERSION")
	if version == "" {
		fmt.Println("Version is required")
		os.Exit(1)
	}
	serviceName := os.Getenv("SERVICE_NAME")
	if serviceName == "" {
		fmt.Println("Service name is required")
		os.Exit(1)
	}
	httpPort := os.Getenv("HTTP_PORT")
	if httpPort == "" {
		fmt.Println("HTTP port is required")
		os.Exit(1)
	}
	port, err := strconv.ParseInt(httpPort, 10, 64)
	if err != nil {
		fmt.Println("HTTP port is not a valid integer")
		os.Exit(1)
	}
	JwtSecretKey := os.Getenv("JWT_SECRET_KEY")
	if JwtSecretKey == "" {
		fmt.Println("JWT secret key is required")
		os.Exit(1)
	}

	dbhost := os.Getenv("DB_HOST")
	if dbhost == "" {
		fmt.Println("DB_HOST must be provided")
		os.Exit(1)
	}

	dbPort := os.Getenv("DB_PORT")
	if dbPort == "" {
		fmt.Println("DB_PORT must be provided")
		os.Exit(1)
	}

	dbPortInt, err := strconv.ParseInt(dbPort, 10, 64)
	if err != nil {
		fmt.Println("DB_PORT is not a valid integer")
		os.Exit(1)
	}

	dbName := os.Getenv("DB_NAME")
	if dbName == "" {
		fmt.Println("DB_NAME must be provided")
		os.Exit(1)
	}

	dbUser := os.Getenv("DB_USER")
	if dbUser == "" {
		fmt.Println("DB_USER must be provided")
		os.Exit(1)
	}

	dbPass := os.Getenv("DB_PASSWORD")
	if dbPass == "" {
		fmt.Println("DB_PASSWORD must be provided")
		os.Exit(1)
	}
	enableSSLModeStr := os.Getenv("DB_ENABLE_SSL_MODE")
	// if enableSSLModeStr == "" {
	// 	fmt.Println(" EnableSSLMODE must be provided")
	// 	os.Exit(1)
	// }
	enableSSLMode, err := strconv.ParseBool(enableSSLModeStr)
	if err != nil {
		fmt.Println("DB_ENABLE_SSL_MODE is not a valid boolean")
		os.Exit(1)
	}

	dbConfig := DBConfig{
		Host:          dbhost,
		Port:          int(dbPortInt),
		Name:          dbName,
		User:          dbUser,
		Password:      dbPass,
		EnableSSLMODE: enableSSLMode,
	}

	configurations = &Config{
		Version:      version,
		ServiceName:  serviceName,
		HttpPort:     int(port),
		JwtSecretKey: JwtSecretKey,
		DB:           dbConfig,
	}
}

func GetConfig() *Config {
	if configurations == nil {
		loadConfig()
	}
	return configurations
}
