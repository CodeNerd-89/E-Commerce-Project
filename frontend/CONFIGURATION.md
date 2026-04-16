# Environment & Configuration Guide

## Frontend Configuration

### .env File Setup

The `.env` file in the frontend directory controls the API connection:

```env
REACT_APP_API_URL=http://localhost:8080
```

### Changing the Backend URL

If your backend is running on a different host/port:

**Local development:**
```env
REACT_APP_API_URL=http://localhost:8080
```

**Remote server:**
```env
REACT_APP_API_URL=https://api.example.com
```

**Docker:**
```env
REACT_APP_API_URL=http://backend-service:8080
```

**Important:** Always restart the React dev server after changing `.env`
```bash
# Stop the server (Ctrl+C)
# Then restart
npm start
```

---

## Backend Compatibility

Your React frontend is designed to work with the existing Go backend. Ensure:

1. **Backend is running:**
   ```bash
   go run main.go
   # Output should show: "Server is running on port :8080" (or your configured port)
   ```

2. **Backend has CORS enabled:**
   Your backend already has CORS middleware in `rest/middlewares/cors.go`
   - This allows requests from the React frontend

3. **Database is connected:**
   The backend should have proper database migrations running

4. **Environment file configured:**
   Make sure backend `.env` has:
   - `HTTP_PORT=8080`
   - `JWT_SECRET_KEY=your-secret-key`
   - Database connection details

---

## Troubleshooting Connection Issues

### Issue: "Failed to connect to backend"

**1. Check if backend is running:**
```bash
# Test if backend is accessible
curl http://localhost:8080/products
```

**2. Check backend port:**
In your Go backend `cmd/serve.go`:
```go
addr := ":" + strconv.Itoa(s.cnf.HttpPort)
fmt.Println("Server is running on port", addr)
```

Update frontend `.env` if port is different:
```env
REACT_APP_API_URL=http://localhost:YOUR_PORT
```

**3. Check CORS middleware:**
Your backend has CORS middleware. If still getting CORS errors, verify:
- Middleware is registered in `rest/server.go`
- Correct origin headers are set

### Issue: "CORS error even though backend is running"

This usually means:
1. Backend CORS middleware isn't allowing the frontend origin
2. Frontend is on different domain than configured in backend

**Solution:** Both should be accessible:
```
Frontend: http://localhost:3000
Backend:  http://localhost:8080
```

### Issue: "Login/signup not working"

**Check:**
1. Backend is running: `go run main.go`
2. Database migrations completed (no errors in backend output)
3. JWT_SECRET_KEY is set in backend `.env`
4. Check browser console (F12 > Console tab) for specific errors

### Issue: "Can't upload images" or "Images not showing"

Images must be:
- Public URLs (not local file paths)
- Accessible from your browser
- Properly formatted URLs

**Valid examples:**
```
https://via.placeholder.com/400
https://example.com/products/image.jpg
https://cdn.example.com/image.png
```

**Invalid examples:**
```
/images/product.jpg          ❌ Local path
C:\Users\image.jpg           ❌ Windows path
file:///images/product.jpg   ❌ File protocol
```

---

## Development Server Configuration

### Frontend (React)

**Port:** 3000 (default)
**Command:** `npm start`
**URL:** `http://localhost:3000`

To change port:
```bash
PORT=3001 npm start
```

### Backend (Go)

**Port:** 8080 (configurable in `.env`)
**Command:** `go run main.go`
**URL:** Configured by `REACT_APP_API_URL`

---

## Production Deployment

### Build Frontend for Production

```bash
cd frontend
npm run build
```

This creates optimized files in `frontend/build/` directory.

### Production Checklist

- [ ] Change `REACT_APP_API_URL` to production backend URL
- [ ] Update backend CORS to allow production frontend domain
- [ ] Use HTTPS for both frontend and backend
- [ ] Set proper environment variables on server
- [ ] Test all features (login, product creation, etc.)

### Deployment Platforms

**Frontend can be deployed to:**
- Vercel (recommended for React)
- Netlify
- AWS S3 + CloudFront
- GitHub Pages
- Any static hosting service

**Backend deployment:**
- AWS EC2
- Docker container
- Heroku
- DigitalOcean
- VPS

### Example: Deploying to Vercel

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. From frontend directory:
   ```bash
   vercel
   ```

3. When prompted, set environment variables:
   ```
   REACT_APP_API_URL=https://your-backend-domain.com
   ```

---

## API Rate Limiting

Currently not implemented, but can be added using:
- Middleware in browser (limit requests from client)
- Backend rate limiting (limit requests per IP/user)

---

## Security Configuration

### JWT Token

The backend uses JWT for authentication. Current implementation:
- Tokens stored in localStorage (browser)
- Included in Authorization headers
- No expiration set (consider adding)

### For Production

1. **Use HTTPS everywhere**
2. **Set secure cookie flags** if switching to cookies
3. **Implement token expiration**
4. **Add rate limiting on login endpoint**
5. **Implement refresh tokens**

---

## Environment Variables Reference

### Frontend (.env)
```env
# Backend API URL
REACT_APP_API_URL=http://localhost:8080
```

### Backend (.env)
```env
# Server
VERSION=1.0.0
SERVICE_NAME=ecommerce
HTTP_PORT=8080
JWT_SECRET_KEY=your-secret-key

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ecommerce_db
DB_USER=postgres
DB_PASSWORD=your-password
DB_ENABLE_SSL_MODE=false
```

---

## Testing Configuration

### Test Backend Connection

```bash
# Get all products (public endpoint)
curl http://localhost:8080/products

# Register user (public endpoint)
curl -X POST http://localhost:8080/users \
  -H "Content-Type: application/json" \
  -d '{
    "first_name":"Test",
    "last_name":"User",
    "email":"test@example.com",
    "password":"password123",
    "is_shop_owner":false
  }'

# Login (get JWT token)
curl -X POST http://localhost:8080/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "password":"password123"
  }'
```

### Test Frontend Connection

Open browser console (F12) and run:
```javascript
// Test if API is accessible
fetch('http://localhost:8080/products')
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error('Connection failed:', err))
```

---

## Debugging Tips

### Enable Development Tools

In frontend, you can add logging:
```javascript
// In any component
console.log('API URL:', process.env.REACT_APP_API_URL);

// Check stored token
console.log('Token:', localStorage.getItem('token'));

// Check cart
console.log('Cart:', JSON.parse(localStorage.getItem('cart')));
```

### Browser DevTools

1. **Network Tab:** See all API requests
   - Check request headers (should include Authorization)
   - Check response status (2xx = success, 4xx = error)

2. **Console Tab:** JavaScript errors
   - CORS errors show here
   - API errors display here

3. **Storage Tab:** localStorage contents
   - View stored token
   - View cart data
   - View user info

### Backend Logging

Go backend logs important events:
- Server startup
- Database migrations
- Request errors
- Database errors

Watch logs while testing to debug issues.

---

## Performance Optimization

### Frontend

1. **Lazy loading:** Product images use lazy loading
2. **Caching:** Browser caches API responses
3. **Code splitting:** Consider implementing with React.lazy()

### Backend

Consider:
- Database indexing on frequently queried columns
- Caching product lists
- Pagination for large product lists

---

## Monitoring & Logging

### Frontend
- Browser console for errors
- Network tab for API issues
- localStorage for state issues

### Backend
- Server logs for connection errors
- Database logs for query issues
- API response times

---

## Common Configuration Mistakes

❌ **Don't:**
- Use relative paths for images (`/images/pic.jpg`)
- Forget to restart server after `.env` changes
- Mix HTTP and HTTPS in production
- Hardcode API URLs in code
- Store sensitive data in localStorage (in production)

✅ **Do:**
- Use absolute URLs for images
- Restart servers after config changes
- Use HTTPS in production
- Use environment variables for configuration
- Use secure cookies instead of localStorage (production)

---

Last Updated: 2024
