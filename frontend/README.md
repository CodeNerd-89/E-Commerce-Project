# ShopHub - Ecommerce Frontend

A modern React-based ecommerce frontend application with user authentication, product browsing, shopping cart, and admin dashboard for product management.

## Features

### User Features
- **User Authentication**
  - Sign up with email and password
  - Login with existing account
  - Persistent login with JWT tokens

- **Product Browsing**
  - View all products on the home page
  - Search/filter products by title
  - View detailed product information
  - View product images, descriptions, and prices

- **Shopping Cart**
  - Add products to cart with custom quantity
  - Update quantities or remove items
  - View order summary with total price
  - Checkout (simulated ordinal placement)
  - Persistent cart storage

### Admin Features
- **Admin Registration**
  - Register as a shop owner/admin
  - Access admin dashboard once logged in

- **Product Management**
  - Create new products with title, description, price, and image URL
  - Edit existing products
  - Delete products
  - View all products managed by the store

## Technology Stack

- **React 18** - Frontend framework
- **React Router v6** - Client-side routing
- **Axios** - HTTP client for API communication
- **Context API** - State management for authentication and cart

## Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Navbar.js
│   │   ├── Navbar.css
│   │   ├── ProtectedRoute.js
│   ├── context/
│   │   ├── AuthContext.js      # Authentication state management
│   │   └── CartContext.js      # Shopping cart state management
│   ├── pages/
│   │   ├── Home.js             # Product listing page
│   │   ├── Home.css
│   │   ├── ProductDetail.js    # Product detail page
│   │   ├── ProductDetail.css
│   │   ├── Cart.js             # Shopping cart page
│   │   ├── Cart.css
│   │   ├── Login.js            # User login page
│   │   ├── Signup.js           # User signup page
│   │   ├── Auth.css            # Auth pages styling
│   │   ├── AdminRegister.js    # Admin registration page
│   │   ├── AdminDashboard.js   # Admin product management
│   │   └── AdminDashboard.css
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
├── .env
├── package.json
└── README.md
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Setup Steps

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create .env file** (already created, but verify it contains):
   ```
   REACT_APP_API_URL=http://localhost:8080
   ```
   - Adjust the port if your backend runs on a different port

4. **Start the development server:**
   ```bash
   npm start
   ```

The application will open in your browser at `http://localhost:3000`

## API Integration

The frontend communicates with the Go backend using the following endpoints:

### Authentication Endpoints
- `POST /users` - User registration (sign up)
- `POST /users/login` - User login

### Product Endpoints
- `GET /products` - Get all products
- `GET /products/{id}` - Get product by ID
- `POST /products` - Create new product (requires JWT, admin only)
- `PUT /products/{id}` - Update product (requires JWT, admin only)
- `DELETE /products/{id}` - Delete product (requires JWT, admin only)

## How to Use

### For Regular Users

1. **Visit Home Page**
   - Browse all available products
   - Use search bar to find specific products

2. **View Product Details**
   - Click on any product to see detailed information
   - View larger product image, full description, and price

3. **Add to Cart**
   - Select quantity and click "Add to Cart"
   - View cart notification in navbar

4. **Checkout**
   - Click cart icon or go to cart page
   - Review items and adjust quantities
   - Click "Place Order" to complete purchase

5. **User Account**
   - Click "Signup" to create new account
   - Enter first name, last name, email, and password
   - Log in with your credentials
   - Click "Logout" to exit

### For Admins

1. **Admin Registration**
   - Click "Admin Register" in navbar
   - Fill in registration details
   - This creates your account as a shop owner

2. **Access Admin Dashboard**
   - Log in with your admin account
   - Click "Admin Dashboard" in navbar

3. **Manage Products**
   - Click "+ Add New Product" to create products
   - Fill in all fields:
     - Product Title
     - Product Description
     - Price (numbers only)
     - Image URL (must be a valid image URL)
   - Submit to add product

4. **Edit Products**
   - Click "Edit" button on product row
   - Form will populate with current product data
   - Update fields as needed
   - Click "Update Product" to save changes

5. **Delete Products**
   - Click "Delete" button on product row
   - Confirm deletion

## Features Explained

### Authentication System
- Uses JWT tokens for user authentication
- Tokens stored in localStorage for persistence
- Automatic logout on session expiry
- Role-based access control (admin vs regular user)

### Cart System
- Prices are fixed (users cannot change them)
- Cart stored in localStorage for persistence
- Items persist even after page refresh
- Real-time cart count in navbar

### State Management
- **AuthContext**: Manages user login/logout, token storage
- **CartContext**: Manages shopping cart operations

### Responsive Design
- Mobile-friendly interface
- Works on desktop, tablet, and mobile devices
- Responsive navigation and product grid

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API base URL | `http://localhost:8080` |

## Troubleshooting

### CORS Errors
- Make sure your backend is running on the correct port
- Verify the `REACT_APP_API_URL` in `.env` matches your backend URL
- Check that your backend has CORS middleware enabled

### Images Not Loading
- Ensure image URLs are publicly accessible
- Use complete URLs (including protocol: http:// or https://)
- Invalid images will show a placeholder

### Login/Signup Issues
- Ensure backend is running
- Check network tab in browser DevTools for API errors
- Verify correct API endpoint configuration

### Cart Not Persisting
- Browser localStorage must be enabled
- Clear localStorage if experiencing issues:
  ```javascript
  localStorage.clear()
  ```

## Building for Production

```bash
npm run build
```

This creates a production-ready build in the `build/` directory.

## Security Notes

- Passwords are sent to backend for hashing
- JWT tokens are stored in localStorage
- Always use HTTPS in production
- Never commit `.env` with sensitive data

## Future Enhancements

- Payment gateway integration
- Order history and tracking
- User profile management
- Product reviews and ratings
- Wishlist functionality
- Advanced filtering and sorting
- Email notifications

## Support

For issues or questions, please check:
1. Backend is running on correct port
2. Network tab in browser DevTools for API errors
3. Browser console for JavaScript errors

---

**Built with React & ❤️**
