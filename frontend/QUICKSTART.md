# SETUP AND QUICKSTART GUIDE

## 🚀 Quick Start (5 minutes)

### 1. Prerequisites
Make sure you have Node.js installed:
```bash
node --version  # Should be v14 or higher
npm --version
```

### 2. Install Dependencies
```bash
cd frontend
npm install
```

### 3. Start Frontend
```bash
npm start
```
The app opens at `http://localhost:3000`

### 4. Ensure Backend is Running
Make sure your Go backend is running on port 8080:
```bash
# In your Go project directory
go run main.go
```

---

## 📁 What Was Created

The complete React ecommerce frontend with:

✅ **User System**
- Sign up / Login / Logout
- JWT token authentication
- Persistent login

✅ **Shopping Features**
- Browse products
- Search products
- View detailed product info
- Add to cart
- Manage cart (update qty, remove items)  
- Checkout (simulated)

✅ **Admin System**
- Admin registration
- Admin dashboard
- Create products (with image, price, description)
- Edit products
- Delete products
- Manage inventory

✅ **UI Components**
- Responsive navbar with cart badge
- Product grid/listing
- Product detail page
- Shopping cart page
- Forms with validation
- Protected routes for admin

---

## 🔗 Connecting to Backend

The frontend communicates with your Go backend via REST APIs.

**API Configuration:**
- Location: `frontend/.env`
- Variable: `REACT_APP_API_URL`
- Default: `http://localhost:8080`

**Change backend URL if needed:**
```
REACT_APP_API_URL=http://your-backend-url:8080
```

---

## 👥 User Roles

### Regular User
1. Click "Signup" to create account
2. Login with email/password
3. Browse and buy products
4. Can only view products, add to cart, checkout

### Admin/Shop Owner
1. Click "Admin Register" to create admin account
2. Login with admin credentials
3. Click "Admin Dashboard"
4. Add, edit, delete products
5. Manage product inventory

---

## 📝 Important Notes

### Price Management
- ✅ Users CANNOT change product prices (locked in)
- ✅ Only admins can set prices when creating/editing products
- ✅ Prices shown to users are exactly what they pay

### Product Images
- Provide image URLs when creating products
- URLs must be publicly accessible
- Examples of valid formats:
  - `https://example.com/product.jpg`
  - `https://via.placeholder.com/400`

### Cart & Checkout
- Cart is saved in browser (localStorage)
- Users can modify quantities or remove items
- Checkout is simulated (doesn't process real payments)
- Cart persists even after page refresh/browser close

---

## 🛠 Development Commands

```bash
# Start development server
npm start

# Build for production
npm build

# Run tests (if configured)
npm test

# Install new dependencies
npm install package-name
```

---

## 🔐 Security

- Passwords are hashed by backend (never stored plain text)
- JWT tokens used for secure API calls
- Roles (admin vs user) determined by `is_shop_owner` flag
- Protected routes ensure only authorized users access admin area

---

## 📱 Browser Support

Works on:
- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers
- ✅ Tablets

---

## ❓ Common Questions

**Q: Why can't I see the Admin Dashboard?**
A: Only users registered as admin (via Admin Register) can see it. Regular users don't have access.

**Q: Why can't I change product prices?**
A: By design, users see fixed prices. Only admins can set prices.

**Q: Where is my cart data stored?**
A: Browser localStorage. Clears when you clear browser data.

**Q: Do I need a database for the frontend?**
A: No! Frontend communicates with Go backend which has the database.

**Q: Can I deploy this separately from backend?**
A: Yes! Frontend and backend are separate. Deploy frontend to any host (Netlify, Vercel, AWS, etc.)

---

## 📞 Frontend Structure

```
Components Flow:
App
├── Navbar (visible on all pages)
├── Routes
│   ├── Home (public)
│   ├── ProductDetail (public)
│   ├── Cart (public)
│   ├── Login (public)
│   ├── Signup (public)
│   ├── AdminRegister (public)
│   └── AdminDashboard (protected - admin only)
```

**State Management:**
- `AuthContext` - User login state, tokens
- `CartContext` - Shopping cart items

---

## 🎨 Customization

### Change Colors
Edit CSS files in `/pages` and `/components`:
- Primary color: `#3498db` (blue)
- Success color: `#27ae60` (green)
- Error color: `#e74c3c` (red)
- Text color: `#2c3e50` (dark gray)

### Change App Name
Edit in:
1. `frontend/public/index.html` - Page title
2. `frontend/src/components/Navbar.js` - Logo text
3. `frontend/README.md` - Documentation

### Add Features
See code structure for adding:
- More pages (create new file in `/pages`)
- More components (create new file in `/components`)
- API calls (use axios in any component)

---

## ✨ Next Steps

1. ✅ Install dependencies: `npm install`
2. ✅ Start frontend: `npm start`
3. ✅ Start backend on port 8080
4. ✅ Open `http://localhost:3000`
5. ✅ Create account and test!

Enjoy your ecommerce application! 🎉
