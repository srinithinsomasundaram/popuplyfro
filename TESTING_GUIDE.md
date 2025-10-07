# Testing Guide - Settings Page Fix

## Problem Identified

The settings page at `/dashboard/settings` was not fetching user data because:

1. ✅ **Missing `/api/auth/me` endpoint** - The page was calling this endpoint but it didn't exist
2. ✅ **Missing `/api/auth/change-password` endpoint** - Password change functionality was not implemented
3. ⚠️ **No authentication system** - No login/signup endpoints were created yet

## Files Created

### 1. `/app/api/auth/me/route.ts`
**Endpoints:**
- `GET /api/auth/me` - Fetch current user profile
- `PATCH /api/auth/me` - Update user profile
- `DELETE /api/auth/me` - Delete user account

**Features:**
- Returns user data formatted for frontend
- Updates profile information
- Updates notification preferences
- Soft deletes user and related data

### 2. `/app/api/auth/change-password/route.ts`
**Endpoint:**
- `POST /api/auth/change-password` - Change user password

**Features:**
- Verifies current password
- Hashes new password
- Invalidates all sessions (increments refreshTokenVersion)
- Returns new JWT tokens

### 3. `/app/api/auth/mock-login/route.ts` (TEMPORARY - FOR TESTING ONLY)
**Endpoints:**
- `POST /api/auth/mock-login` - Create test user and get tokens
- `GET /api/auth/mock-login` - Get testing instructions

**Features:**
- Creates test user automatically
- Returns JWT tokens for development
- **DELETE THIS FILE IN PRODUCTION!**

---

## How to Test

### Option 1: Quick Test with Mock Login (Recommended for Now)

**Step 1: Start your servers**
```bash
# Terminal 1: Start backend (if separate)
cd server
npm run dev  # or node server.js

# Terminal 2: Start Next.js
npm run dev
```

**Step 2: Get test tokens**

Open your browser console and run:

```javascript
// Get mock login tokens
fetch('http://localhost:3000/api/auth/mock-login', {
  method: 'POST'
})
  .then(res => res.json())
  .then(data => {
    console.log('Response:', data);
    if (data.success) {
      // Save tokens to localStorage
      localStorage.setItem('accessToken', data.data.accessToken);
      localStorage.setItem('refreshToken', data.data.refreshToken);
      console.log('✅ Tokens saved! Refresh the page.');
    }
  });
```

**Step 3: Refresh the page**

The settings page should now load your user data!

**Test User Credentials:**
- Email: `test@popuply.com`
- Password: `Test123!`
- Tier: `starter`

---

### Option 2: Test with Actual Authentication (Production Ready)

You need to create the full auth flow first:

**1. Create Login Endpoint**

Create `/app/api/auth/login/route.ts`:

```typescript
import { NextRequest } from "next/server"
import { connectMongo } from "@/lib/mongoose"
import User from "@/models/user"
import { verifyPassword } from "@/lib/password"
import { generateTokenPair } from "@/lib/jwt"
import { successResponse, errorResponse } from "@/lib/response"

export async function POST(req: NextRequest) {
  try {
    await connectMongo()
    const { email, password } = await req.json()

    const user = await User.findOne({ email })
    if (!user) {
      return errorResponse('Invalid credentials', 401)
    }

    const isValid = await verifyPassword(password, user.passwordHash)
    if (!isValid) {
      return errorResponse('Invalid credentials', 401)
    }

    const tokens = generateTokenPair(
      String(user._id),
      user.email,
      user.refreshTokenVersion
    )

    return successResponse({
      user: {
        id: String(user._id),
        email: user.email,
        name: user.name,
        tier: user.subscriptionTier,
        role: user.role,
      },
      ...tokens,
    })
  } catch (error: any) {
    return errorResponse(error.message, 500)
  }
}
```

**2. Use the Login Page**

Navigate to `/login` and login with:
- Email: `test@popuply.com`
- Password: `Test123!`

---

## Testing Checklist

### Settings Page Features

- [ ] **Profile Loading**
  - Navigate to `/dashboard/settings`
  - Check if name, email, company fields are populated
  - Check browser console for errors

- [ ] **Profile Update**
  - Change name, email, or company
  - Click "Save Changes"
  - Verify success message appears
  - Refresh page and verify changes persisted

- [ ] **Password Change**
  - Enter current password: `Test123!`
  - Enter new password: `NewPass456!`
  - Confirm new password
  - Click "Update Password"
  - Verify new tokens are returned
  - Try logging in with new password

- [ ] **Notification Preferences**
  - Toggle notification switches
  - Click "Save Preferences"
  - Verify success message
  - Refresh and verify toggles remain changed

- [ ] **Embed Code**
  - Verify embed code displays
  - Click "Copy Code"
  - Verify "Copied!" message appears

- [ ] **Account Deletion**
  - Click "Delete Account"
  - Confirm deletion prompt
  - Verify account and data are deleted
  - Verify redirect to homepage

---

## API Testing with cURL

### Get User Profile
```bash
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Update Profile
```bash
curl -X PATCH http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Name",
    "company": "New Company",
    "preferences": {
      "emailNotifications": true,
      "leadNotifications": false
    }
  }'
```

### Change Password
```bash
curl -X POST http://localhost:3000/api/auth/change-password \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "Test123!",
    "newPassword": "NewPass456!"
  }'
```

### Mock Login
```bash
curl -X POST http://localhost:3000/api/auth/mock-login
```

---

## Troubleshooting

### Issue: "Unauthorized" error

**Solution:**
1. Check if tokens are in localStorage:
   ```javascript
   console.log(localStorage.getItem('accessToken'));
   ```

2. If missing, use mock login to get tokens:
   ```javascript
   // See "Quick Test with Mock Login" above
   ```

3. Verify token format:
   ```javascript
   // Should start with "eyJ..."
   ```

### Issue: "Failed to load profile"

**Solution:**
1. Check MongoDB is running:
   ```bash
   # macOS
   brew services start mongodb-community

   # Or use connection string in .env
   ```

2. Verify MONGODB_URI in `.env`:
   ```env
   MONGODB_URI=mongodb://localhost:27017/popuply
   ```

3. Check server logs for errors

### Issue: CORS errors

**Solution:**
If backend is on port 5000 and frontend on 3000:

```typescript
// Add to your Express server
import cors from 'cors';

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

### Issue: 500 Internal Server Error

**Solution:**
1. Check server console logs
2. Verify all dependencies installed:
   ```bash
   npm install
   ```
3. Check MongoDB connection
4. Verify JWT_SECRET is set in `.env`

---

## Database Verification

Check if test user was created:

```javascript
// In MongoDB Compass or shell
use popuply
db.users.find({ email: "test@popuply.com" })
```

Or via Node.js:

```javascript
const mongoose = require('mongoose');
const User = require('./models/user');

mongoose.connect('mongodb://localhost:27017/popuply');

User.findOne({ email: 'test@popuply.com' })
  .then(user => console.log(user))
  .finally(() => mongoose.disconnect());
```

---

## Next Steps

1. ✅ **Test the settings page** with mock login
2. ⏳ **Create full auth flow** (login, register, refresh)
3. ⏳ **Remove mock-login endpoint** before production
4. ⏳ **Add proper login/signup pages**
5. ⏳ **Add protected route middleware**
6. ⏳ **Implement token refresh logic**

---

## Security Notes

🔴 **IMPORTANT:**

- The `mock-login` endpoint is **FOR DEVELOPMENT ONLY**
- **DELETE** `/app/api/auth/mock-login/route.ts` before deploying to production
- Use proper authentication in production
- Store JWT secrets securely
- Use HTTPS in production
- Implement rate limiting

---

## Response Format

All endpoints follow this format:

**Success:**
```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Optional success message"
}
```

**Error:**
```json
{
  "success": false,
  "error": "Error message"
}
```

---

## Environment Variables Required

```env
# Database
MONGODB_URI=mongodb://localhost:27017/popuply

# JWT
JWT_SECRET=your-secret-key-min-32-chars
JWT_REFRESH_SECRET=your-refresh-secret-min-32-chars
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# API URLs
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
```

---

**Last Updated:** January 2025
**Status:** Ready for Testing
