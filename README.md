# Ecommerce Backend API

This project is a backend-focused ecommerce API written in Go. It exposes user authentication and product management endpoints, connects to PostgreSQL with `sqlx`, and applies SQL migrations automatically on startup.

The codebase is structured around a simple layered backend design:

- `rest/handlers`: HTTP handlers and route registration
- `rest/middlewares`: CORS, logging, preflight, and JWT auth middleware
- `user` and `product`: service layer contracts and business flow
- `repo`: PostgreSQL repository implementations
- `infra/db`: database connection and migration setup
- `domain`: core data models
- `util`: shared helpers for JWT, password hashing, and JSON responses

## Backend Features

- User registration
- User login with JWT generation
- Protected product create, update, and delete endpoints
- Public product list and product details endpoints
- PostgreSQL persistence
- SQL migrations on application startup
- Password hashing with bcrypt

## Tech Stack

- Go
- Standard library `net/http`
- PostgreSQL
- `github.com/jmoiron/sqlx`
- `github.com/rubenv/sql-migrate`
- `golang.org/x/crypto/bcrypt`
- `github.com/joho/godotenv`

## Project Structure

```text
.
|-- cmd/
|-- config/
|-- domain/
|-- infra/
|   `-- db/
|-- migrations/
|-- product/
|-- repo/
|-- rest/
|   |-- handlers/
|   `-- middlewares/
|-- user/
|-- util/
|-- main.go
`-- go.mod
```

## How the Backend Starts

When the server boots:

1. Environment variables are loaded from `.env`
2. A PostgreSQL connection is created
3. Migrations inside `./migrations` are applied
4. Repositories and services are wired together
5. Routes are registered on `http.ServeMux`
6. The HTTP server starts on `HTTP_PORT`

## Environment Variables

Create a `.env` file in the project root with the following values:

```env
VERSION=1.0.0
SERVICE_NAME=ecommerce-backend
HTTP_PORT=8080
JWT_SECRET_KEY=change-me

DB_HOST=localhost
DB_PORT=5432
DB_NAME=ecommerce
DB_USER=postgres
DB_PASSWORD=postgres
DB_ENABLE_SSL_MODE=false
```

## Running Locally

### 1. Install dependencies

```bash
go mod tidy
```

### 2. Prepare PostgreSQL

Create a PostgreSQL database that matches your `.env` values.

Example:

```sql
CREATE DATABASE ecommerce;
```

### 3. Start the server

```bash
go run main.go
```

The server will:

- connect to PostgreSQL
- run migrations automatically
- start listening on `http://localhost:<HTTP_PORT>`

## Database Schema

The current migrations create two tables:

### `users`

- `id`
- `first_name`
- `last_name`
- `email`
- `password`
- `is_shop_owner`
- `created_at`
- `updated_at`

### `products`

- `id`
- `title`
- `description`
- `price`
- `img_url`
- `created_at`
- `updated_at`

## Authentication

Login returns a JWT signed with HMAC SHA-256 using `JWT_SECRET_KEY`.

Protected routes require this header:

```http
Authorization: Bearer <token>
```

Protected endpoints:

- `POST /products`
- `PUT /products/{id}`
- `DELETE /products/{id}`

## API Endpoints

### Health of the API Surface

This backend currently exposes two resource groups:

- `users`
- `products`

### Users

#### Create user

`POST /users`

Request body:

```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "password": "secret123",
  "is_shop_owner": true
}
```

Behavior:

- hashes the password with bcrypt before saving
- stores the user in PostgreSQL
- returns the created user as JSON

#### Login

`POST /users/login`

Request body:

```json
{
  "email": "john@example.com",
  "password": "secret123"
}
```

Behavior:

- looks up the user by email
- compares the submitted password
- returns a JWT token on success

### Products

#### List products

`GET /products?page=1&limit=10`

Query params:

- `page` defaults to `1`
- `limit` defaults to `10`

Response shape:

```json
{
  "data": [],
  "pagination": {
    "Page": 1,
    "limit": 10,
    "totalItems": 0,
    "totalPages": 0
  }
}
```

#### Get product by ID

`GET /products/{id}`

#### Create product

`POST /products`

Requires JWT.

Request body:

```json
{
  "title": "Orange",
  "description": "Fresh and sweet",
  "price": 120.5,
  "imageUrl": "https://example.com/orange.png"
}
```

#### Update product

`PUT /products/{id}`

Requires JWT.

Request body:

```json
{
  "title": "Updated Orange",
  "description": "Fresh and sweet",
  "price": 140,
  "imageUrl": "https://example.com/orange.png"
}
```

#### Delete product

`DELETE /products/{id}`

Requires JWT.

## Example Backend Flow

1. Register a user with `POST /users`
2. Log in with `POST /users/login`
3. Copy the returned JWT
4. Call protected product endpoints with `Authorization: Bearer <token>`

## Backend Notes for Developers

- The server uses the Go standard library router with method-aware patterns such as `GET /products` and `POST /users/login`.
- Passwords are hashed during signup, and login supports bcrypt verification.
- Migrations are executed every time the application starts.
- Product pagination exists, but the current offset and total page calculation are basic and may need refinement.
- JWT validation currently verifies the signature but does not enforce claims like expiration.
- The current CORS middleware allows `content-type` but does not explicitly allow the `Authorization` header, which may matter for browser clients using protected routes.
- The database connection code currently builds a PostgreSQL connection string with `sslmode=disable`.

## Suggested Next Backend Improvements

- Add request validation for payload fields
- Add JWT claims such as `exp` and `iat`
- Add role-based authorization for shop owners
- Add unit and integration tests
- Add `.env.example`
- Improve pagination math and response consistency
- Add centralized error handling
- Add API documentation with OpenAPI or Swagger

## Focus of This Repository

This project is primarily a backend learning and development project. The main value of the repository is in the API design, authentication flow, database integration, and clean separation between handlers, services, and repositories.
