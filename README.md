# URL Shortener Service

A full-stack URL shortening service built with modern web technologies. Users can create short links, track click analytics, and manage their shortened URLs through an intuitive web interface.

## 🚀 Setup Instructions

### Prerequisites

Before running this project, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **PostgreSQL** (v12 or higher)
- **Yarn** or **npm**
- **Git**

### Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```bash
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/url_shortener"

# Authentication
JWT_SECRET=your-super-secret-jwt-key
ACCESS_TOKEN_SECRET=your-access-token-secret
REFRESH_TOKEN_SECRET=your-refresh-token-secret
BCRYPT_SALT=12

# Email Configuration (for password reset)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-password
```

Create a `.env.local` file in the `frontend` directory:

```bash
VITE_APP_URL=http://localhost:3000
VITE_NODE_ENV=development
```

### Installation Steps

1. **Clone the repository:**

   ```bash
   git clone https://github.com/monishatBaishnab/url-shortener
   cd url-shortener
   ```

2. **Backend Setup:**

   ```bash
   cd backend
   yarn install
   ```

3. **Frontend Setup:**

   ```bash
   cd ../frontend
   yarn install
   ```

4. **Database Setup:**
   ```bash
   cd ../backend
   yarn migrate
   ```

### How to Run the Project Locally

1. **Start the Backend:**

   ```bash
   cd backend
   yarn dev
   ```

   The backend will run on `http://localhost:3000`

2. **Start the Frontend:**

   ```bash
   cd frontend
   yarn dev
   ```

   The frontend will run on `http://localhost:5173`

3. **Access the Application:**
   Open your browser and navigate to `http://localhost:5173`

### How to Build

**Backend:**

```bash
cd backend
yarn build
```

**Frontend:**

```bash
cd frontend
yarn build
```

## 📁 Project Structure

```
url-shortener-service/
├── backend/                    # Backend application
│   ├── src/
│   │   ├── app/
│   │   │   ├── config/         # Configuration files
│   │   │   ├── errors/         # Custom error classes
│   │   │   ├── lib/            # Database and email utilities
│   │   │   ├── middlewares/    # Express middlewares (auth, error handling)
│   │   │   ├── modules/        # Feature modules
│   │   │   │   ├── auth/       # Authentication module
│   │   │   │   └── link/       # URL shortening module
│   │   │   ├── routes/         # Route definitions
│   │   │   └── utils/          # Utility functions
│   │   ├── app.ts              # Express app configuration
│   │   └── server.ts           # Server entry point
│   ├── prisma/
│   │   ├── schema.prisma       # Database schema
│   │   └── migrations/         # Database migrations
│   └── package.json
├── frontend/                   # Frontend application
│   ├── src/
│   │   ├── app/
│   │   │   ├── apis/           # API service definitions
│   │   │   ├── features/       # Redux features (auth, shortener)
│   │   │   └── app.store.ts    # Redux store configuration
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/              # Page components
│   │   ├── hooks/              # Custom React hooks
│   │   └── types/              # TypeScript type definitions
│   ├── components.json         # Shadcn/UI configuration
│   └── package.json
└── README.md
```

### Key Directories Explained

- **`backend/src/app/modules/`**: Contains feature-specific modules following clean architecture patterns
- **`backend/src/app/utils/`**: Utility functions for common operations (OTP, short code generation, etc.)
- **`frontend/src/app/features/`**: Redux Toolkit Query features for API state management
- **`frontend/src/components/`**: Reusable UI components built with Shadcn/UI

## 📡 API Documentation

### Base URL

```
http://localhost:3000/api/v1
```

### Authentication Endpoints

#### POST `/auth/register`

Register a new user account.

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (201):**

```json
{
  "success": true,
  "statusCode": 201,
  "message": "User created successfully",
  "data": {
    "id": "uuid-string",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Error Response (400):**

```json
{
  "success": false,
  "message": "Validation error",
  "error": {
    "name": "Name must be at least 2 characters long"
  }
}
```

#### POST `/auth/login`

Authenticate user and return tokens.

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Login successful",
  "data": {
    "accessToken": "jwt-access-token",
    "refreshToken": "jwt-refresh-token",
    "user": {
      "id": "uuid-string",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

#### GET `/auth/me`

Get current authenticated user information.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Success Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "User fetched successfully",
  "data": {
    "id": "uuid-string",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### POST `/auth/change-password`

Change user password (requires current password).

**Headers:**

```
Authorization: Bearer <access_token>
```

**Request Body:**

```json
{
  "current_password": "oldpassword123",
  "new_password": "newpassword123"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Password changed successfully",
  "data": null
}
```

#### POST `/auth/forgot-password`

Send OTP to user email for password reset.

**Request Body:**

```json
{
  "email": "john@example.com"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Verification Email Send. Check inbox with spam/junk",
  "data": {
    "otp": "123456"
  }
}
```

#### POST `/auth/verify-otp`

Verify OTP code for password reset.

**Request Body:**

```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "OTP verified successfully",
  "data": null
}
```

#### POST `/auth/reset-password`

Reset password after OTP verification.

**Request Body:**

```json
{
  "email": "john@example.com",
  "new_password": "newpassword123"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Password reset successfully",
  "data": null
}
```

### Link Management Endpoints

#### POST `/links`

Create a new shortened link.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Request Body:**

```json
{
  "original_link": "https://example.com/very/long/url/path"
}
```

**Success Response (201):**

```json
{
  "success": true,
  "statusCode": 201,
  "message": "Link created successfully",
  "data": {
    "id": "uuid-string",
    "original_url": "https://example.com/very/long/url/path",
    "keyword": "abc123",
    "clicks": 0,
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Response (400 - Limit Reached):**

```json
{
  "success": false,
  "message": "You have reached the maximum limit of 100 shortened links. Please upgrade your account to create more links.",
  "statusCode": 400
}
```

#### GET `/links`

Get all links for the authenticated user.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Success Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Links fetched successfully",
  "data": [
    {
      "id": "uuid-string",
      "original_url": "https://example.com/page1",
      "keyword": "abc123",
      "clicks": 15,
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### GET `/links/count`

Get total count of links created by user (including deleted).

**Headers:**

```
Authorization: Bearer <access_token>
```

**Success Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Link count fetched successfully",
  "data": {
    "totalCount": 85
  }
}
```

#### GET `/links/key/:key`

Get link details by short code (keyword).

**Headers:**

```
Authorization: Bearer <access_token>
```

**Success Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Link fetched successfully",
  "data": "https://example.com/very/long/url/path"
}
```

#### DELETE `/links/:id`

Soft delete a link.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Success Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Link deleted successfully",
  "data": null
}
```

## 🏗️ Design Decisions

### Technology Stack

#### Backend

- **Node.js & Express**: Chosen for its lightweight nature and extensive ecosystem. Express provides robust routing and middleware capabilities.
- **TypeScript**: Provides type safety and better developer experience, reducing runtime errors.
- **Prisma ORM**: Modern database toolkit with type-safe database access and automatic migration generation.
- **PostgreSQL**: Relational database chosen for its reliability, ACID compliance, and advanced features.
- **JWT Authentication**: Stateless authentication with access and refresh tokens for security.
- **bcrypt**: Industry-standard password hashing for security.
- **Zod**: Runtime type validation for API requests and responses.

#### Frontend

- **React 19**: Latest React version with improved performance and concurrent features.
- **TypeScript**: Type safety throughout the frontend application.
- **Vite**: Fast build tool with hot module replacement for development.
- **Redux Toolkit Query (RTK Query)**: Efficient API state management with caching and optimistic updates.
- **React Hook Form + Zod**: Robust form handling with validation.
- **Shadcn/UI + Tailwind CSS**: Modern, accessible UI components with utility-first styling.
- **React Router**: Client-side routing for single-page application.

### Architectural Decisions

#### Modular Architecture

- **Feature-based modules**: Each feature (auth, links) is self-contained with its own controllers, services, and validation.
- **Separation of concerns**: Clear separation between routes, controllers, services, and utilities.
- **Middleware pattern**: Authentication and error handling abstracted into reusable middleware.

#### Security Considerations

- **JWT with refresh tokens**: Secure token-based authentication with automatic token refresh.
- **Password hashing**: bcrypt with configurable salt rounds for secure password storage.
- **Input validation**: Zod schemas ensure all inputs are validated before processing.
- **Soft deletion**: Links are soft-deleted to maintain data integrity and allow recovery.

#### URL Shortening Logic

- **Unique short codes**: 6-character alphanumeric codes ensuring uniqueness across all users.
- **Click tracking**: Each link tracks click count for analytics.
- **Free tier limit**: 100 links per user as a free tier limitation (upgrade required for more).

### Trade-offs

#### Database Design

- **UUIDs for primary keys**: Provides better security than auto-incrementing IDs but requires more storage.
- **Soft deletion**: Preserves data integrity but requires additional filtering in queries.

#### Authentication

- **JWT over sessions**: Stateless authentication is scalable but requires token refresh logic.
- **OTP via email**: User-friendly password reset but depends on email deliverability.

#### Frontend State Management

- **Redux**: More opinionated and feature-rich for API state, but has a learning curve.

## ⚠️ Known Limitations

### Current Limitations

1. **Free Tier Constraints**

   - No upgrade system implemented yet
   - Users are limited to 100 shortened links total
   - Link deletion doesn't free up space for new links

2. **Email Dependency**

   - Password reset relies on email delivery
   - Email templates are basic text-based

3. **Analytics Features**

   - Basic click counting only
   - No link expiration or custom domains

4. **Security Considerations**

   - No rate limiting implemented
   - No CAPTCHA for registration/login
   - Basic password requirements (minimum 6 characters)

5. **User Experience**

   - No bulk link creation/import
   - No link editing after creation
   - No custom short codes (only auto-generated)
