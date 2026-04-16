# API Integration Guide

This document explains all the API endpoints used by the frontend and how they integrate with the Go backend.

## Base URL
```
http://localhost:8080
```
Change this in `/frontend/.env` if your backend runs on a different URL.

---

## Authentication Endpoints

### Register / Sign Up
- **Endpoint:** `POST /users`
- **Authentication:** Not required
- **Request Body:**
  ```json
  {
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "password": "password123",
    "is_shop_owner": false
  }
  ```
- **Response (200):**
  ```json
  {
    "id": 1,
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "is_shop_owner": false
  }
  ```
- **Used in:** `pages/Signup.js`, `pages/AdminRegister.js`
- **Notes:** 
  - Set `is_shop_owner: false` for regular users
  - Set `is_shop_owner: true` for admin registration

### Login
- **Endpoint:** `POST /users/login`
- **Authentication:** Not required
- **Request Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response (200):**
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": 1,
      "first_name": "John",
      "last_name": "Doe",
      "email": "john@example.com",
      "is_shop_owner": false
    }
  }
  ```
- **Used in:** `pages/Login.js`
- **Notes:** 
  - Returns JWT token for subsequent authenticated requests
  - Token stored in localStorage and used in Authorization header

---

## Product Endpoints

### Get All Products
- **Endpoint:** `GET /products`
- **Authentication:** Not required
- **Query Parameters:** None
- **Response (200):**
  ```json
  [
    {
      "id": 1,
      "title": "Product Name",
      "description": "Product description",
      "price": 29.99,
      "imageUrl": "https://example.com/image.jpg"
    }
  ]
  ```
- **Used in:** `pages/Home.js`
- **Notes:** Returns all products available in the store

### Get Single Product
- **Endpoint:** `GET /products/{id}`
- **Authentication:** Not required
- **Parameters:**
  - `id` (integer, required) - Product ID
- **Response (200):**
  ```json
  {
    "id": 1,
    "title": "Product Name",
    "description": "Product description",
    "price": 29.99,
    "imageUrl": "https://example.com/image.jpg"
  }
  ```
- **Used in:** `pages/ProductDetail.js`
- **Notes:** Get detailed information about a single product

### Create Product (Admin Only)
- **Endpoint:** `POST /products`
- **Authentication:** Required (JWT token)
- **Headers:**
  ```
  Authorization: Bearer {token}
  ```
- **Request Body:**
  ```json
  {
    "title": "New Product",
    "description": "Product description",
    "price": 49.99,
    "imageUrl": "https://example.com/image.jpg"
  }
  ```
- **Response (201):**
  ```json
  {
    "id": 2,
    "title": "New Product",
    "description": "Product description",
    "price": 49.99,
    "imageUrl": "https://example.com/image.jpg"
  }
  ```
- **Used in:** `pages/AdminDashboard.js`
- **Error Responses:**
  - `401 Unauthorized` - Token missing or invalid
  - `403 Forbidden` - User is not an admin (is_shop_owner: false)
  - `400 Bad Request` - Missing required fields

### Update Product (Admin Only)
- **Endpoint:** `PUT /products/{id}`
- **Authentication:** Required (JWT token)
- **Headers:**
  ```
  Authorization: Bearer {token}
  ```
- **Parameters:**
  - `id` (integer, required) - Product ID
- **Request Body:**
  ```json
  {
    "title": "Updated Product",
    "description": "Updated description",
    "price": 59.99,
    "imageUrl": "https://example.com/new-image.jpg"
  }
  ```
- **Response (200):**
  ```json
  {
    "id": 1,
    "title": "Updated Product",
    "description": "Updated description",
    "price": 59.99,
    "imageUrl": "https://example.com/new-image.jpg"
  }
  ```
- **Used in:** `pages/AdminDashboard.js`
- **Error Responses:**
  - `401 Unauthorized` - Token missing or invalid
  - `403 Forbidden` - User is not an admin
  - `404 Not Found` - Product not found

### Delete Product (Admin Only)
- **Endpoint:** `DELETE /products/{id}`
- **Authentication:** Required (JWT token)
- **Headers:**
  ```
  Authorization: Bearer {token}
  ```
- **Parameters:**
  - `id` (integer, required) - Product ID
- **Response (200/204):** Success (empty body or success message)
- **Used in:** `pages/AdminDashboard.js`
- **Error Responses:**
  - `401 Unauthorized` - Token missing or invalid
  - `403 Forbidden` - User is not an admin
  - `404 Not Found` - Product not found

---

## Authentication Flow

### 1. User Registration
```
User fills signup form → POST /users → Response with user data → Redirect to login
```

### 2. User Login
```
User fills login form → POST /users/login → Get JWT token → 
Store token in localStorage → Redirect to home → Use token for authenticated requests
```

### 3. Authenticated Request (Admin endpoints)
```
Frontend includes token in header → Request to protected endpoint → 
Backend validates token → Allow or deny request
```

### 4. Admin Access
- Only users with `is_shop_owner: true` can access:
  - POST /products (create)
  - PUT /products (update)
  - DELETE /products (delete)
  - `/admin/dashboard` route

---

## Token Management

### Storing Token
```javascript
// After successful login
localStorage.setItem('token', response.data.token);
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
```

### Using Token in Requests
```javascript
const response = await axios.get('/products', {
  headers: { Authorization: `Bearer ${token}` }
});
```

### Clearing Token (Logout)
```javascript
localStorage.removeItem('token');
delete axios.defaults.headers.common['Authorization'];
```

---

## Data Models

### User Object
```json
{
  "id": 1,
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "is_shop_owner": false
}
```

### Product Object
```json
{
  "id": 1,
  "title": "Product Name",
  "description": "Detailed description of the product",
  "price": 29.99,
  "imageUrl": "https://example.com/image.jpg"
}
```

### Cart Item (Frontend only)
```json
{
  "id": 1,
  "title": "Product Name",
  "description": "Detailed description",
  "price": 29.99,
  "imageUrl": "https://example.com/image.jpg",
  "quantity": 2
}
```

---

## Error Handling

### Common HTTP Status Codes

| Status | Meaning | Example |
|--------|---------|---------|
| 200 | OK - Request successful | GET request returns data |
| 201 | Created - Resource created | POST creates new product |
| 400 | Bad Request - Invalid data | Missing required fields |
| 401 | Unauthorized - Token invalid/missing | No auth header provided |
| 403 | Forbidden - Access denied | Non-admin tries to create product |
| 404 | Not Found - Resource doesn't exist | Product ID doesn't exist |
| 500 | Server Error - Backend issue | Database connection failed |

### Frontend Error Handling
All API calls include error handling:
```javascript
try {
  const response = await axios.post('/endpoint', data);
  // Handle success
} catch (error) {
  const message = error.response?.data?.message || 'An error occurred';
  // Display error to user
}
```

---

## Testing API Endpoints

Use tools like Postman or curl to test:

### Test Login (curl)
```bash
curl -X POST http://localhost:8080/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

### Test Get Products (curl)
```bash
curl http://localhost:8080/products
```

### Test Create Product (curl)
```bash
curl -X POST http://localhost:8080/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "title":"New Product",
    "description":"A great product",
    "price":99.99,
    "imageUrl":"https://example.com/image.jpg"
  }'
```

---

## Frontend API Usage Examples

### Get All Products
```javascript
import axios from 'axios';

async function fetchProducts() {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/products`
    );
    return response.data.data || response.data;
  } catch (error) {
    console.error('Failed to fetch products:', error);
  }
}
```

### Create Product (Admin)
```javascript
async function createProduct(token, productData) {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/products`,
      productData,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Failed to create product:', error);
  }
}
```

### Login User
```javascript
async function loginUser(email, password) {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/users/login`,
      { email, password }
    );
    const { token, user } = response.data;
    
    // Store token
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    return { success: true, user };
  } catch (error) {
    return { success: false, message: error.response?.data?.message };
  }
}
```

---

## Rate Limiting

Currently, no rate limiting is implemented. Backend may add this in the future.

## CORS

The backend has CORS middleware enabled to allow requests from the frontend running on different ports/domains.

---

## Performance Notes

- Product listing returns all products at once (consider pagination for large datasets)
- Image URLs should be optimized, use CDN for better performance
- JWT tokens don't automatically expire (implement expiration for better security)

---

## Security Considerations

- ✅ Passwords are hashed on backend (SHA/bcrypt)
- ✅ JWT tokens used for authentication
- ✅ Passwords never sent back to frontend
- ⚠️ Token stored in localStorage (consider using secure cookies)
- ⚠️ No HTTPS in dev environment (use HTTPS in production)

---

Last Updated: 2024
