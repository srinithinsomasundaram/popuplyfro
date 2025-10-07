# Popuply SaaS - Complete Backend Documentation

## 📋 Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Technology Stack](#technology-stack)
3. [Database Models](#database-models)
4. [API Endpoints](#api-endpoints)
5. [Authentication & Authorization](#authentication--authorization)
6. [Utilities & Helpers](#utilities--helpers)
7. [Environment Configuration](#environment-configuration)
8. [Implementation Guide](#implementation-guide)
9. [API Response Standards](#api-response-standards)
10. [Error Handling](#error-handling)
11. [Security Best Practices](#security-best-practices)

---

## 🏗️ Architecture Overview

### Current Structure

```
popuplysaas/
├── app/api/              # Next.js API Routes (Current)
│   ├── popups/          # Popup CRUD operations
│   └── websites/        # Website management
├── lib/                  # Utilities & Helpers
│   ├── jwt.ts           # JWT token management
│   ├── password.ts      # Password hashing
│   ├── middleware.ts    # Auth middleware
│   ├── response.ts      # Standardized responses
│   ├── api.ts           # Client-side API wrapper
│   ├── auth.ts          # Client auth helpers
│   └── mongoose.ts      # Database connection
├── models/              # MongoDB Models
│   ├── user.ts          # User schema
│   ├── website.ts       # Website schema
│   ├── popup.ts         # Popup schema
│   └── analytics-event.ts # Analytics tracking
└── .env                 # Environment variables
```

### Recommended Backend Structure (To Implement)

```
server/
├── server.js            # Express app entry
├── config/
│   ├── db.js           # Database config
│   └── razorpay.js     # Payment gateway
├── routes/
│   ├── auth.mjs        # Authentication routes
│   ├── user.mjs        # User management
│   ├── websites.mjs    # Website CRUD
│   ├── popups.mjs      # Popup CRUD
│   ├── analytics.mjs   # Analytics endpoints
│   ├── track.mjs       # Public tracking
│   ├── embed.mjs       # Public embed
│   └── billing.mjs     # Razorpay integration
├── middleware/
│   ├── auth.mjs        # JWT verification
│   ├── rateLimit.mjs   # Rate limiting
│   └── validation.mjs  # Request validation
└── utils/
    ├── generateKey.mjs # Website key generation
    └── helpers.mjs     # Common utilities
```

---

## 🔧 Technology Stack

### Core Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 15.2.4 | Frontend & API Routes |
| **React** | 19 | UI Framework |
| **TypeScript** | 5.x | Type Safety |
| **MongoDB** | Latest | Database |
| **Mongoose** | 8.9.3 | ODM |
| **Express** | 4.21.2 | Backend Server (To Add) |

### Authentication & Security

| Package | Version | Purpose |
|---------|---------|---------|
| **jsonwebtoken** | 9.0.2 | JWT tokens |
| **bcryptjs** | 2.4.3 | Password hashing |
| **cors** | 2.8.5 | CORS handling |

### Payment & Analytics

| Package | Purpose |
|---------|---------|
| **razorpay** | Payment gateway |
| **date-fns** | Date manipulation |

---

## 🗄️ Database Models

### 1. User Model (`models/user.ts`)

**Schema Definition:**

```typescript
{
  // Authentication
  email: string (unique, required, indexed)
  passwordHash: string (required)
  refreshTokenVersion: number (default: 0)

  // Profile
  name: string
  fullName: string
  avatarUrl: string
  company: string
  language: string (default: "en")
  role: "user" | "admin" (default: "user")

  // Subscription
  subscriptionTier: "free" | "starter" | "growth" (default: "free")
  subscriptionStatus: "active" | "cancelled" | "trialing" | "past_due"
  razorpayCustomerId: string

  // Notification Preferences
  notificationPreferences: {
    email: {
      updatesAboutPopups: boolean (default: true)
      leadNotifications: boolean (default: true)
      weeklyReports: boolean (default: false)
      marketingEmails: boolean (default: false)
    }
  }

  // Activity Tracking
  lastSeen: Date
  devices: [{
    deviceId: string
    deviceType: "web" | "ios" | "android"
    ip: string
    userAgent: string
    lastActive: Date
  }]
  loginHistory: [{
    ip: string
    userAgent: string
    loggedInAt: Date
  }]

  // Timestamps
  createdAt: Date (auto)
  updatedAt: Date (auto)
}
```

**Indexes:**
- `email: 1` (unique)
- `subscriptionTier: 1`
- `createdAt: -1`

**Methods:**
```typescript
// Add to model
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.passwordHash;
  delete user.refreshTokenVersion;
  return user;
};
```

---

### 2. Website Model (`models/website.ts`)

**Schema Definition:**

```typescript
{
  // Ownership
  userId: ObjectId (ref: "User", required, indexed)

  // Core Info
  domain: string (required, indexed)
  websiteKey: string (unique, required) // e.g., "wk_abc123xyz"
  name: string
  faviconUrl: string

  // Status
  status: "pending" | "active" | "paused" | "deleted" (default: "pending")
  verifiedAt: Date
  lastChecked: Date
  deletedAt: Date (soft delete)

  // Relations
  popups: [ObjectId] (ref: "Popup")

  // Settings
  settings: {
    embedScriptEnabled: boolean (default: true)
    autoPublish: boolean (default: false)
    language: string (default: "en")
  }

  // Analytics
  stats: {
    totalViews: number (default: 0)
    totalConversions: number (default: 0)
    last30Days: {
      views: number (default: 0)
      conversions: number (default: 0)
    }
  }

  // Metadata
  createdBy: string
  previousKeys: [string] // Track rotated keys

  // Timestamps
  createdAt: Date (auto)
  updatedAt: Date (auto)
}
```

**Indexes:**
- `userId: 1, status: 1`
- `websiteKey: 1` (unique)
- `domain: 1`

**Key Generation:**
```typescript
// Implement in utils
function generateWebsiteKey(): string {
  return `wk_${nanoid(16)}`;
}
```

---

### 3. Popup Model (`models/popup.ts`)

**Schema Definition:**

```typescript
{
  // Ownership
  userId: ObjectId (ref: "User", required, indexed)
  websiteId: ObjectId (ref: "Website", required, indexed)

  // Configuration
  type: "email_capture" | "announcement" | "exit_intent" | "countdown" | "video" | "custom"
  trigger: "page_load" | "scroll_percentage" | "exit_intent" | "time_delay" | "click"

  // Design & Display
  designConfig: Object {
    title?: string
    description?: string
    buttonText?: string
    buttonColor?: string
    backgroundColor?: string
    textColor?: string
    position?: "center" | "top" | "bottom" | "corner"
    animation?: "fade" | "slide" | "bounce"
    image?: string
    formFields?: Array<{
      name: string
      type: "text" | "email" | "tel" | "textarea"
      label: string
      required: boolean
    }>
  }

  displayRules: Object {
    delay?: number (ms)
    scrollPercentage?: number
    maxDisplays?: number
    cookieDuration?: number (days)
    urlPatterns?: string[]
    deviceTypes?: ("desktop" | "mobile" | "tablet")[]
  }

  // Status
  status: "draft" | "active" | "paused" | "archived" (default: "draft")
  publishedAt: Date

  // Metrics
  metrics: {
    views: number (default: 0)
    clicks: number (default: 0)
    conversions: number (default: 0)
    closes: number (default: 0)
  }

  // Timestamps
  createdAt: Date (auto)
  updatedAt: Date (auto)
}
```

**Indexes:**
- `websiteId: 1, status: 1`
- `userId: 1, createdAt: -1`
- `type: 1, status: 1`

**Virtuals:**
```typescript
popupSchema.virtual('conversionRate').get(function() {
  if (this.metrics.views === 0) return 0;
  return (this.metrics.conversions / this.metrics.views) * 100;
});
```

---

### 4. AnalyticsEvent Model (`models/analytics-event.ts`)

**Schema Definition:**

```typescript
{
  // References
  popupId: ObjectId (ref: "Popup", required, indexed)
  websiteId: ObjectId (ref: "Website", required, indexed)

  // Event Data
  eventType: "view" | "click" | "conversion" | "close" (required, indexed)

  // Visitor Info
  visitorId: string (indexed) // UUID from cookie
  sessionId: string // Session identifier

  // Context
  pageUrl: string
  referrer: string
  deviceType: "desktop" | "mobile" | "tablet"
  browser: string
  country: string
  city: string

  // Additional Data
  metadata: Object {
    formData?: Object
    customFields?: Object
  }

  // Timestamp
  createdAt: Date (auto, indexed)
}
```

**Compound Indexes:**
- `{ popupId: 1, createdAt: -1 }`
- `{ websiteId: 1, eventType: 1, createdAt: -1 }`
- `{ visitorId: 1, sessionId: 1 }`

---

## 🔌 API Endpoints

### Authentication Routes (`/api/auth/*`)

#### POST `/api/auth/register`
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "name": "John Doe"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "user@example.com",
      "name": "John Doe",
      "tier": "free",
      "role": "user"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  },
  "message": "Registration successful"
}
```

**Validation:**
- Email: Valid format, unique
- Password: Min 8 chars, 1 uppercase, 1 number
- Name: Optional, max 100 chars

**Implementation:**
```typescript
// app/api/auth/register/route.ts
import { NextRequest } from 'next/server';
import { connectMongo } from '@/lib/mongoose';
import User from '@/models/user';
import { hashPassword } from '@/lib/password';
import { generateTokenPair } from '@/lib/jwt';
import { successResponse, errorResponse } from '@/lib/response';

export async function POST(req: NextRequest) {
  try {
    await connectMongo();

    const { email, password, name } = await req.json();

    // Validation
    if (!email || !password) {
      return errorResponse('Email and password required', 400);
    }

    // Check existing
    const existing = await User.findOne({ email });
    if (existing) {
      return errorResponse('Email already registered', 409);
    }

    // Create user
    const passwordHash = await hashPassword(password);
    const user = await User.create({
      email,
      passwordHash,
      name,
      subscriptionTier: 'free',
      subscriptionStatus: 'active',
    });

    // Generate tokens
    const tokens = generateTokenPair(
      String(user._id),
      user.email,
      user.refreshTokenVersion
    );

    return successResponse({
      user: {
        id: String(user._id),
        email: user.email,
        name: user.name,
        tier: user.subscriptionTier,
        role: user.role,
      },
      ...tokens,
    }, 'Registration successful', 201);

  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}
```

---

#### POST `/api/auth/login`
Authenticate user and return tokens.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "user@example.com",
      "name": "John Doe",
      "tier": "starter",
      "role": "user"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Implementation:**
```typescript
// app/api/auth/login/route.ts
import { NextRequest } from 'next/server';
import { connectMongo } from '@/lib/mongoose';
import User from '@/models/user';
import { verifyPassword } from '@/lib/password';
import { generateTokenPair } from '@/lib/jwt';
import { successResponse, errorResponse } from '@/lib/response';

export async function POST(req: NextRequest) {
  try {
    await connectMongo();

    const { email, password } = await req.json();

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return errorResponse('Invalid credentials', 401);
    }

    // Verify password
    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return errorResponse('Invalid credentials', 401);
    }

    // Update last seen
    user.lastSeen = new Date();
    await user.save();

    // Generate tokens
    const tokens = generateTokenPair(
      String(user._id),
      user.email,
      user.refreshTokenVersion
    );

    return successResponse({
      user: {
        id: String(user._id),
        email: user.email,
        name: user.name,
        tier: user.subscriptionTier,
        role: user.role,
      },
      ...tokens,
    });

  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}
```

---

#### POST `/api/auth/refresh`
Refresh access token using refresh token.

**Request Body:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Implementation:**
```typescript
// app/api/auth/refresh/route.ts
import { NextRequest } from 'next/server';
import { connectMongo } from '@/lib/mongoose';
import User from '@/models/user';
import { verifyRefreshToken, generateTokenPair } from '@/lib/jwt';
import { successResponse, errorResponse, unauthorizedResponse } from '@/lib/response';

export async function POST(req: NextRequest) {
  try {
    await connectMongo();

    const { token } = await req.json();

    if (!token) {
      return unauthorizedResponse('Refresh token required');
    }

    // Verify refresh token
    const payload = verifyRefreshToken(token);
    if (!payload) {
      return unauthorizedResponse('Invalid refresh token');
    }

    // Check user and token version
    const user = await User.findById(payload.userId);
    if (!user || user.refreshTokenVersion !== payload.tokenVersion) {
      return unauthorizedResponse('Invalid refresh token');
    }

    // Generate new tokens
    const tokens = generateTokenPair(
      String(user._id),
      user.email,
      user.refreshTokenVersion
    );

    return successResponse(tokens);

  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}
```

---

### User Routes (`/api/user/*`)

#### GET `/api/user/profile`
Get authenticated user's profile.

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "John Doe",
    "fullName": "John Michael Doe",
    "company": "Acme Corp",
    "avatarUrl": "https://...",
    "language": "en",
    "tier": "starter",
    "status": "active",
    "role": "user",
    "notificationPreferences": {
      "email": {
        "updatesAboutPopups": true,
        "leadNotifications": true,
        "weeklyReports": false,
        "marketingEmails": false
      }
    },
    "createdAt": "2025-01-15T10:00:00.000Z"
  }
}
```

**Implementation:**
```typescript
// app/api/user/profile/route.ts
import { NextRequest } from 'next/server';
import { connectMongo } from '@/lib/mongoose';
import User from '@/models/user';
import { requireAuth } from '@/lib/middleware';
import { successResponse, unauthorizedResponse, errorResponse } from '@/lib/response';

export async function GET(req: NextRequest) {
  try {
    await connectMongo();

    // Authenticate
    const authUser = await requireAuth(req);
    if (!authUser) {
      return unauthorizedResponse();
    }

    // Get full profile
    const user = await User.findById(authUser.id)
      .select('-passwordHash -refreshTokenVersion')
      .lean();

    if (!user) {
      return errorResponse('User not found', 404);
    }

    return successResponse({
      id: String(user._id),
      email: user.email,
      name: user.name,
      fullName: user.fullName,
      company: user.company,
      avatarUrl: user.avatarUrl,
      language: user.language,
      tier: user.subscriptionTier,
      status: user.subscriptionStatus,
      role: user.role,
      notificationPreferences: user.notificationPreferences,
      createdAt: user.createdAt,
    });

  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}
```

---

#### PATCH `/api/user/profile`
Update user profile.

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Request Body:**
```json
{
  "name": "John Doe",
  "fullName": "John Michael Doe",
  "company": "Acme Corp",
  "avatarUrl": "https://...",
  "language": "en"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": { /* updated user object */ }
  },
  "message": "Profile updated successfully"
}
```

---

#### POST `/api/user/profile/password`
Change user password.

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Request Body:**
```json
{
  "currentPassword": "OldPass123!",
  "newPassword": "NewSecurePass456!"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Password changed successfully",
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Notes:**
- Invalidates all existing sessions
- Increments `refreshTokenVersion`
- Returns new tokens

---

### Website Routes (`/api/websites/*`)

#### POST `/api/websites`
Create a new website.

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Request Body:**
```json
{
  "domain": "example.com",
  "name": "My Website",
  "faviconUrl": "https://...",
  "settings": {
    "embedScriptEnabled": true,
    "autoPublish": false,
    "language": "en"
  }
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "website": {
      "id": "507f1f77bcf86cd799439011",
      "domain": "example.com",
      "websiteKey": "wk_abc123xyz",
      "name": "My Website",
      "status": "pending",
      "settings": { /* ... */ },
      "createdAt": "2025-01-15T10:00:00.000Z"
    },
    "embed": {
      "embedUrl": "https://cdn.popuply.com/embed.js",
      "websiteKey": "wk_abc123xyz",
      "embedSnippet": "<script src=\"https://cdn.popuply.com/embed.js\" data-website-key=\"wk_abc123xyz\"></script>"
    }
  },
  "message": "Website created successfully"
}
```

**Subscription Limits:**
- **Free:** 1 website max
- **Starter:** 5 websites max
- **Growth:** Unlimited

---

#### GET `/api/websites`
List all websites for authenticated user (paginated).

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Query Params:**
```
?page=1&limit=10
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "websites": [
      {
        "id": "507f1f77bcf86cd799439011",
        "domain": "example.com",
        "websiteKey": "wk_abc123xyz",
        "name": "My Website",
        "faviconUrl": "https://...",
        "status": "active",
        "settings": { /* ... */ },
        "stats": {
          "totalViews": 1250,
          "totalConversions": 85,
          "last30Days": {
            "views": 450,
            "conversions": 32
          }
        },
        "createdAt": "2025-01-15T10:00:00.000Z",
        "updatedAt": "2025-01-20T14:30:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 3,
      "pages": 1
    }
  }
}
```

---

#### GET `/api/websites/:id`
Get website details.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "website": { /* full website object */ },
    "embed": { /* embed code details */ }
  }
}
```

---

#### GET `/api/websites/:id/embed`
Get embed code for website.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "embed": {
      "embedUrl": "https://cdn.popuply.com/embed.js",
      "websiteKey": "wk_abc123xyz",
      "embedSnippet": "<script src=\"https://cdn.popuply.com/embed.js\" data-website-key=\"wk_abc123xyz\"></script>"
    }
  }
}
```

---

#### POST `/api/websites/:id/rotate-key`
Rotate website key (security feature).

**Response (200):**
```json
{
  "success": true,
  "data": {
    "website": {
      "websiteKey": "wk_new_key_xyz",
      "previousKeys": ["wk_old_key_abc"]
    },
    "embed": { /* updated embed code */ }
  },
  "message": "Website key rotated successfully"
}
```

---

#### PATCH `/api/websites/:id`
Update website settings.

**Request Body:**
```json
{
  "name": "Updated Name",
  "faviconUrl": "https://...",
  "settings": {
    "embedScriptEnabled": false
  }
}
```

---

#### POST `/api/websites/:id/status`
Update website status.

**Request Body:**
```json
{
  "status": "active" // or "paused", "deleted"
}
```

---

#### DELETE `/api/websites/:id`
Soft delete website.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "ok": true
  },
  "message": "Website deleted successfully"
}
```

---

### Popup Routes (`/api/popups/*`)

#### POST `/api/popups`
Create a new popup.

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Request Body:**
```json
{
  "websiteId": "507f1f77bcf86cd799439011",
  "type": "email_capture",
  "trigger": "page_load",
  "designConfig": {
    "title": "Get 20% Off!",
    "description": "Subscribe to our newsletter",
    "buttonText": "Subscribe",
    "buttonColor": "#3A8DFF",
    "backgroundColor": "#FFFFFF",
    "position": "center",
    "formFields": [
      {
        "name": "email",
        "type": "email",
        "label": "Email Address",
        "required": true
      }
    ]
  },
  "displayRules": {
    "delay": 3000,
    "maxDisplays": 1,
    "cookieDuration": 7
  }
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "popup": {
      "id": "507f1f77bcf86cd799439012",
      "websiteId": "507f1f77bcf86cd799439011",
      "type": "email_capture",
      "trigger": "page_load",
      "status": "draft",
      "designConfig": { /* ... */ },
      "displayRules": { /* ... */ },
      "metrics": {
        "views": 0,
        "clicks": 0,
        "conversions": 0,
        "closes": 0
      },
      "createdAt": "2025-01-15T10:00:00.000Z"
    }
  },
  "message": "Popup created successfully"
}
```

**Subscription Limits:**
- **Free:** 1 active popup
- **Starter:** 20 active popups
- **Growth:** Unlimited

---

#### GET `/api/popups`
List all popups for authenticated user.

**Query Params:**
```
?page=1&limit=10&websiteId=507f1f77bcf86cd799439011
```

**Response:** Same pagination structure as websites

---

#### GET `/api/popups/:id`
Get popup details.

---

#### PATCH `/api/popups/:id`
Update popup.

**Request Body:**
```json
{
  "type": "announcement",
  "trigger": "exit_intent",
  "designConfig": { /* updated config */ },
  "displayRules": { /* updated rules */ },
  "status": "draft"
}
```

---

#### POST `/api/popups/:id/publish`
Publish popup (change status to "active").

**Response (200):**
```json
{
  "success": true,
  "data": {
    "popup": {
      "id": "507f1f77bcf86cd799439012",
      "status": "active",
      "publishedAt": "2025-01-15T11:00:00.000Z"
    }
  },
  "message": "Popup published successfully"
}
```

---

#### POST `/api/popups/:id/duplicate`
Duplicate existing popup.

**Response (201):**
```json
{
  "success": true,
  "data": {
    "popup": {
      "id": "507f1f77bcf86cd799439013",
      "name": "Copy of Original Popup",
      "status": "draft"
      /* ... copied config ... */
    }
  }
}
```

---

### Analytics Routes (`/api/analytics/*`)

#### GET `/api/analytics/popup/:popupId`
Get analytics for a specific popup.

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Query Params:**
```
?start_date=2025-01-01&end_date=2025-01-31&granularity=day
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "total_views": 1250,
    "total_clicks": 380,
    "total_conversions": 85,
    "conversion_rate": 6.8,
    "time_series": [
      {
        "date": "2025-01-15",
        "views": 45,
        "clicks": 12,
        "conversions": 3,
        "closes": 30
      },
      {
        "date": "2025-01-16",
        "views": 52,
        "clicks": 18,
        "conversions": 5,
        "closes": 29
      }
    ],
    "breakdown": {
      "by_device": {
        "desktop": { "views": 750, "conversions": 55 },
        "mobile": { "views": 450, "conversions": 28 },
        "tablet": { "views": 50, "conversions": 2 }
      },
      "by_country": {
        "US": { "views": 600, "conversions": 42 },
        "UK": { "views": 250, "conversions": 18 }
      }
    }
  }
}
```

**Implementation:**
```typescript
// Uses AnalyticsEvent model for aggregation
import AnalyticsEvent from '@/models/analytics-event';

const analytics = await AnalyticsEvent.aggregate([
  {
    $match: {
      popupId: new mongoose.Types.ObjectId(popupId),
      createdAt: { $gte: startDate, $lte: endDate }
    }
  },
  {
    $group: {
      _id: {
        date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        eventType: '$eventType'
      },
      count: { $sum: 1 }
    }
  }
]);
```

---

### Tracking Routes (Public) (`/api/track/*`)

**No authentication required** - These are called from the embed script.

#### POST `/api/track/view`
Track popup view.

**Request Body:**
```json
{
  "popupId": "507f1f77bcf86cd799439012",
  "visitorId": "uuid-visitor-123",
  "sessionId": "uuid-session-456",
  "pageUrl": "https://example.com/page",
  "referrer": "https://google.com",
  "deviceType": "desktop",
  "browser": "Chrome"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "ok": true
  }
}
```

---

#### POST `/api/track/click`
Track popup button click.

---

#### POST `/api/track/conversion`
Track popup conversion (form submission).

**Request Body:**
```json
{
  "popupId": "507f1f77bcf86cd799439012",
  "visitorId": "uuid-visitor-123",
  "sessionId": "uuid-session-456",
  "metadata": {
    "formData": {
      "email": "user@example.com",
      "name": "John Doe"
    }
  }
}
```

---

#### POST `/api/track/close`
Track popup close.

---

#### POST `/api/track/batch`
Batch track multiple events (optimization).

**Request Body:**
```json
{
  "events": [
    {
      "popupId": "507f1f77bcf86cd799439012",
      "type": "view",
      "timestamp": "2025-01-15T10:00:00.000Z"
    },
    {
      "popupId": "507f1f77bcf86cd799439012",
      "type": "click",
      "timestamp": "2025-01-15T10:00:05.000Z"
    }
  ]
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "ok": true,
    "processed": 2
  }
}
```

---

### Embed Routes (Public) (`/api/embed/*`)

#### GET `/api/embed/popups/:websiteKey`
Fetch active popups for a website (called by embed script).

**Response (200):**
```json
{
  "success": true,
  "data": {
    "popups": [
      {
        "id": "507f1f77bcf86cd799439012",
        "type": "email_capture",
        "trigger": "page_load",
        "designConfig": { /* ... */ },
        "displayRules": { /* ... */ }
      }
    ]
  }
}
```

**Caching:**
- Cache-Control: public, max-age=300 (5 minutes)
- Only returns popups with `status: "active"`

---

### Billing Routes (`/api/billing/*`)

#### GET `/api/billing/plans`
List available subscription plans.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "plans": [
      {
        "id": "free",
        "name": "Free",
        "interval": "month",
        "amount": 0,
        "currency": "INR",
        "features": [
          "1 Website",
          "1 Active Popup",
          "Basic Templates",
          "Basic Analytics"
        ]
      },
      {
        "id": "starter-monthly",
        "name": "Starter",
        "interval": "month",
        "amount": 900,
        "currency": "INR",
        "features": [
          "Up to 5 Websites",
          "20 Active Popups",
          "Advanced Templates",
          "Custom Branding",
          "Email Integrations",
          "Advanced Analytics"
        ]
      },
      {
        "id": "growth-monthly",
        "name": "Growth",
        "interval": "month",
        "amount": 2900,
        "currency": "INR",
        "features": [
          "Unlimited Websites",
          "Unlimited Popups",
          "A/B Testing",
          "Team Access",
          "API Access",
          "Premium 24/7 Support"
        ]
      }
    ]
  }
}
```

---

#### POST `/api/billing/create-order`
Create Razorpay order for subscription.

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Request Body:**
```json
{
  "planId": "starter-monthly"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "order": {
      "id": "order_razorpay_123",
      "amount": 90000,
      "currency": "INR",
      "planId": "starter-monthly"
    },
    "keyId": "rzp_test_xxxxx"
  }
}
```

---

#### POST `/api/billing/webhooks/razorpay`
Razorpay webhook handler.

**Headers:**
```
x-razorpay-signature: <signature>
```

**Request Body:** Razorpay webhook payload

**Response (200):**
```json
{
  "success": true,
  "data": {
    "received": true
  }
}
```

**Events Handled:**
- `payment.captured` - Update subscription
- `subscription.activated` - Activate subscription
- `subscription.cancelled` - Cancel subscription

---

## 🔐 Authentication & Authorization

### JWT Token Flow

```
┌──────────┐                 ┌──────────┐                ┌──────────┐
│  Client  │                 │   API    │                │ Database │
└─────┬────┘                 └─────┬────┘                └─────┬────┘
      │                            │                           │
      │  POST /auth/login          │                           │
      │ {email, password}          │                           │
      │──────────────────────────► │                           │
      │                            │  Find user & verify       │
      │                            │──────────────────────────►│
      │                            │                           │
      │                            │◄──────────────────────────│
      │                            │  User data                │
      │                            │                           │
      │  {accessToken,             │                           │
      │   refreshToken}            │                           │
      │◄───────────────────────────│                           │
      │                            │                           │
      │  GET /websites             │                           │
      │  Authorization: Bearer xxx │                           │
      │──────────────────────────► │                           │
      │                            │  Verify JWT               │
      │                            │                           │
      │                            │  Query data               │
      │                            │──────────────────────────►│
      │                            │                           │
      │  {websites: [...]}         │                           │
      │◄───────────────────────────│                           │
      │                            │                           │
```

### Token Expiration & Refresh

**Access Token:**
- Lifespan: 15 minutes
- Used for: All authenticated requests
- Storage: localStorage (client-side)

**Refresh Token:**
- Lifespan: 7 days
- Used for: Renewing access tokens
- Storage: localStorage (client-side)

**Refresh Flow:**
```typescript
// Automatic in lib/api.ts
if (response.status === 401) {
  // Try refresh
  const newTokens = await refreshAccessToken();
  // Retry original request
}
```

### Token Versioning

**Purpose:** Invalidate all sessions when password changes

```typescript
// User model
refreshTokenVersion: number (default: 0)

// On password change
user.refreshTokenVersion += 1;
await user.save();

// Token verification
if (tokenPayload.version !== user.refreshTokenVersion) {
  throw new Error('Token invalidated');
}
```

### Authorization Levels

**Public Routes** (No auth required):
- `/api/track/*` - Tracking endpoints
- `/api/embed/*` - Embed endpoints
- `/api/billing/plans` - Plan listing

**User Routes** (Requires authentication):
- `/api/user/*` - User management
- `/api/websites/*` - Website CRUD
- `/api/popups/*` - Popup CRUD
- `/api/analytics/*` - Analytics

**Admin Routes** (Requires admin role):
- To be implemented for admin dashboard

---

## 🛠️ Utilities & Helpers

### JWT Utils (`lib/jwt.ts`)

```typescript
// Generate tokens
const tokens = generateTokenPair(userId, email, tokenVersion);

// Verify tokens
const payload = verifyAccessToken(token);
const refreshPayload = verifyRefreshToken(refreshToken);
```

### Password Utils (`lib/password.ts`)

```typescript
// Hash password
const hash = await hashPassword('MyPassword123!');

// Verify password
const isValid = await verifyPassword('MyPassword123!', hash);
```

### Response Utils (`lib/response.ts`)

```typescript
// Success
return successResponse(data, 'Success message', 200);

// Error
return errorResponse('Error message', 400);

// Validation error
return validationErrorResponse({
  email: ['Invalid email format'],
  password: ['Password too weak']
});

// Unauthorized
return unauthorizedResponse();

// Not found
return notFoundResponse('Resource not found');

// Server error
return serverErrorResponse();
```

### Middleware (`lib/middleware.ts`)

```typescript
// Require authentication
const user = await requireAuth(request);
if (!user) {
  return unauthorizedResponse();
}

// Require admin
const admin = await requireAdmin(request);
if (!admin) {
  return forbiddenResponse();
}
```

### Database Connection (`lib/mongoose.ts`)

```typescript
// Connect to MongoDB (cached)
await connectMongo();
```

### Client API (`lib/api.ts`)

```typescript
// GET request
const data = await apiGet('/api/websites');

// POST request
const result = await apiPost('/api/popups', {
  websiteId: '123',
  type: 'email_capture'
});

// PATCH request
await apiPatch('/api/popups/123', { status: 'active' });

// DELETE request
await apiDelete('/api/popups/123');

// Automatic token refresh on 401
```

---

## ⚙️ Environment Configuration

### Required Variables

```env
# Application
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000

# Database
MONGODB_URI=mongodb://localhost:27017/popuply

# JWT
JWT_SECRET=your-secret-key-min-32-chars
JWT_REFRESH_SECRET=your-refresh-secret-min-32-chars
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Razorpay
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=secret_xxxxx
RAZORPAY_WEBHOOK_SECRET=webhook_secret_xxxxx

# Server
PORT=5000
NODE_ENV=development

# CORS
ALLOWED_ORIGINS=http://localhost:3000
```

### Production Checklist

- [ ] Generate strong JWT secrets (min 32 characters)
- [ ] Use MongoDB Atlas or managed database
- [ ] Set up Razorpay production keys
- [ ] Configure proper CORS origins
- [ ] Enable HTTPS
- [ ] Set NODE_ENV=production
- [ ] Add rate limiting
- [ ] Set up monitoring (Sentry, LogRocket)
- [ ] Configure CDN for embed script

---

## 📚 Implementation Guide

### Step 1: Install Dependencies

```bash
# Clear disk space first
npm install
```

### Step 2: Configure Environment

```bash
cp .env.example .env
# Edit .env with actual values
```

### Step 3: Implement Auth Routes

Create these files:
- `app/api/auth/register/route.ts`
- `app/api/auth/login/route.ts`
- `app/api/auth/refresh/route.ts`

### Step 4: Implement User Routes

Create these files:
- `app/api/user/profile/route.ts`
- `app/api/user/profile/password/route.ts`
- `app/api/user/subscription/route.ts`

### Step 5: Update Existing Routes

Update these files to use new utilities:
- `app/api/websites/route.ts`
- `app/api/websites/[id]/route.ts`
- `app/api/popups/route.ts`
- `app/api/popups/[id]/route.ts`

### Step 6: Implement Analytics

Create:
- `app/api/analytics/popup/[id]/route.ts`
- `app/api/track/view/route.ts`
- `app/api/track/click/route.ts`
- `app/api/track/conversion/route.ts`
- `app/api/track/close/route.ts`
- `app/api/track/batch/route.ts`

### Step 7: Implement Embed

Create:
- `app/api/embed/popups/[websiteKey]/route.ts`

### Step 8: Implement Billing

Create:
- `app/api/billing/plans/route.ts`
- `app/api/billing/create-order/route.ts`
- `app/api/billing/webhooks/razorpay/route.ts`

### Step 9: Add Validation

Install zod and create schemas:

```typescript
// lib/validation.ts
import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).regex(/[A-Z]/).regex(/[0-9]/),
  name: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const createPopupSchema = z.object({
  websiteId: z.string(),
  type: z.enum(['email_capture', 'announcement', 'exit_intent', 'countdown', 'video', 'custom']),
  trigger: z.enum(['page_load', 'scroll_percentage', 'exit_intent', 'time_delay', 'click']),
  designConfig: z.object({}).passthrough(),
  displayRules: z.object({}).passthrough(),
});
```

### Step 10: Add Rate Limiting

```typescript
// lib/rate-limit.ts
import { NextRequest } from 'next/server';

const rateLimits = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(req: NextRequest, limit = 100, window = 60000): boolean {
  const ip = req.headers.get('x-forwarded-for') || 'unknown';
  const now = Date.now();

  const current = rateLimits.get(ip);

  if (!current || current.resetAt < now) {
    rateLimits.set(ip, { count: 1, resetAt: now + window });
    return true;
  }

  if (current.count >= limit) {
    return false;
  }

  current.count++;
  return true;
}
```

---

## 📊 API Response Standards

### Success Response

```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Optional success message"
}
```

### Error Response

```json
{
  "success": false,
  "error": "Error message",
  "errors": {
    "field": ["Validation error"]
  }
}
```

### Pagination

```json
{
  "success": true,
  "data": {
    "items": [ /* ... */ ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "pages": 10
    }
  }
}
```

---

## ⚠️ Error Handling

### HTTP Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful GET, PATCH, DELETE |
| 201 | Created | Successful POST |
| 204 | No Content | Successful DELETE (no body) |
| 400 | Bad Request | Invalid request data |
| 401 | Unauthorized | Missing/invalid token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate resource |
| 422 | Unprocessable | Validation failed |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Server Error | Internal error |

### Error Examples

```typescript
// Validation error
{
  "success": false,
  "error": "Validation failed",
  "errors": {
    "email": ["Invalid email format"],
    "password": ["Password must be at least 8 characters"]
  }
}

// Authentication error
{
  "success": false,
  "error": "Invalid credentials"
}

// Authorization error
{
  "success": false,
  "error": "Insufficient permissions"
}

// Rate limit error
{
  "success": false,
  "error": "Too many requests. Please try again later."
}

// Server error
{
  "success": false,
  "error": "Internal server error"
}
```

---

## 🔒 Security Best Practices

### 1. Password Security
- ✅ Bcrypt with 10 rounds
- ✅ Min 8 characters
- ✅ Require uppercase + number
- ✅ Never log passwords

### 2. JWT Security
- ✅ Strong secrets (min 32 chars)
- ✅ Short access token expiry (15m)
- ✅ Token versioning for invalidation
- ✅ HTTPS only in production

### 3. Database Security
- ✅ Connection string in env
- ✅ Parameterized queries (Mongoose)
- ✅ Input validation
- ✅ Proper indexing

### 4. API Security
- ✅ Rate limiting
- ✅ CORS configuration
- ✅ Request size limits
- ✅ Sanitize user input

### 5. Subscription Limits
```typescript
// Check limits before creation
const websiteCount = await Website.countDocuments({
  userId,
  status: { $ne: 'deleted' }
});

const limits = {
  free: { websites: 1, popups: 1 },
  starter: { websites: 5, popups: 20 },
  growth: { websites: Infinity, popups: Infinity }
};

if (websiteCount >= limits[user.tier].websites) {
  throw new Error('Website limit reached');
}
```

### 6. Input Sanitization
```typescript
import sanitizeHtml from 'sanitize-html';

const sanitized = sanitizeHtml(userInput, {
  allowedTags: [],
  allowedAttributes: {}
});
```

---

## 🚀 Performance Optimization

### 1. Database Indexing
All indexes are already defined in models.

### 2. Query Optimization
```typescript
// Use .lean() for read-only
const websites = await Website.find({ userId }).lean();

// Select only needed fields
const user = await User.findById(id).select('email name tier');

// Pagination
const popups = await Popup.find({ userId })
  .limit(limit)
  .skip((page - 1) * limit)
  .sort({ createdAt: -1 });
```

### 3. Caching Strategy
```typescript
// Embed endpoint caching
export async function GET(req: NextRequest) {
  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, max-age=300'
    }
  });
}
```

### 4. Batch Operations
```typescript
// Batch insert analytics events
await AnalyticsEvent.insertMany(events);
```

---

## 📝 Testing

### Unit Tests (To Implement)

```typescript
// __tests__/lib/jwt.test.ts
import { generateTokenPair, verifyAccessToken } from '@/lib/jwt';

describe('JWT Utils', () => {
  it('should generate valid token pair', () => {
    const tokens = generateTokenPair('userId123', 'user@example.com');
    expect(tokens.accessToken).toBeDefined();
    expect(tokens.refreshToken).toBeDefined();
  });

  it('should verify valid access token', () => {
    const tokens = generateTokenPair('userId123', 'user@example.com');
    const payload = verifyAccessToken(tokens.accessToken);
    expect(payload.userId).toBe('userId123');
  });
});
```

### Integration Tests

```typescript
// __tests__/api/auth.test.ts
import { POST as register } from '@/app/api/auth/register/route';

describe('Auth API', () => {
  it('should register new user', async () => {
    const req = new NextRequest('http://localhost:3000/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'Test123!'
      })
    });

    const response = await register(req);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.success).toBe(true);
    expect(data.data.user.email).toBe('test@example.com');
  });
});
```

---

## 📚 Additional Resources

### Related Files
- `UPDATES.md` - Changelog of recent updates
- `package.json` - Dependencies
- `.env.example` - Environment template
- `models/*.ts` - Database schemas
- `lib/*.ts` - Utilities

### External Documentation
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [JWT.io](https://jwt.io/)
- [Razorpay API](https://razorpay.com/docs/api/)

---

## ✅ Next Steps

1. **Free up disk space** and run `npm install`
2. **Configure environment** variables in `.env`
3. **Implement authentication routes** (register, login, refresh)
4. **Implement user routes** (profile, password)
5. **Update existing routes** to use middleware
6. **Implement analytics routes**
7. **Implement tracking routes**
8. **Implement billing routes**
9. **Add validation and rate limiting**
10. **Test all endpoints**
11. **Deploy to production**

---

**Last Updated:** January 2025
**Version:** 1.0.0
**Maintainer:** Popuply Development Team
