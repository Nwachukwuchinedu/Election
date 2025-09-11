# 🗳️ Election Web App - Developer Implementation Guide

## Table of Contents
1. [Technical Overview](#technical-overview)
2. [Database Schema](#database-schema)
3. [Project Structure](#project-structure)
4. [Backend API Design](#backend-api-design)
5. [Frontend-Backend Integration](#frontend-backend-integration)
6. [Key Implementation Flows](#key-implementation-flows)
7. [Security Implementations](#security-implementations)
8. [Setup Instructions](#setup-instructions)
9. [Environment Variables](#environment-variables)
10. [Scripts Usage](#scripts-usage)

## Technical Overview

This is a **full-stack MERN application** with JWT-based authentication, role-based access control (RBAC), and Cloudinary integration for image management. The system implements a **stateless authentication pattern** using JWTs stored in sessionStorage for security.

### Tech Stack
- **Frontend**: React + Vite, Tailwind CSS, Axios, React Router
- **Backend**: Node.js + Express, JWT, bcrypt, Nodemailer, Cloudinary SDK
- **Database**: MongoDB (Mongoose ODM)
- **Image Storage**: Cloudinary

### Key Features
- **Three Roles**: Admin, Voter, Candidate
- **Secure Authentication**: JWT-based with bcrypt password hashing
- **One Vote Per Position**: Database-enforced voting constraints
- **Image Management**: Cloudinary for candidate profile pictures
- **Admin Dashboard**: Real-time voting statistics and user management

## Database Schema

### MongoDB Collections

#### Voters Collection
```javascript
{
  _id: ObjectId,
  firstName: String (required, trim),
  lastName: String (required, trim),
  email: String (required, unique, lowercase),
  matricNumber: String (required, unique),
  level: Number (required, enum: [100, 200, 300, 400]),
  password: String (required, bcrypt hashed),
  hasVoted: [String] (array of position names),
  createdAt: Date (default: Date.now),
  updatedAt: Date (default: Date.now)
}
```

#### Candidates Collection
```javascript
{
  _id: ObjectId,
  firstName: String (required, trim),
  lastName: String (required, trim),
  email: String (required, unique, lowercase),
  position: String (required),
  profilePictureUrl: String (required, Cloudinary URL),
  cloudinaryPublicId: String (for deletion if needed),
  createdAt: Date (default: Date.now)
}
```

#### Votes Collection
```javascript
{
  _id: ObjectId,
  voterId: ObjectId (ref: 'Voter', required),
  position: String (required),
  candidateId: ObjectId (ref: 'Candidate', required),
  timestamp: Date (default: Date.now)
}
```

#### Admins Collection
```javascript
{
  _id: ObjectId,
  firstName: String (required),
  lastName: String (required),
  email: String (required, unique),
  password: String (required, bcrypt hashed),
  role: String (default: 'admin'),
  createdAt: Date (default: Date.now)
}
```

## Project Structure

### Backend Structure
```
backend/
├── src/
│   ├── config/
│   │   ├── database.js          # MongoDB connection
│   │   ├── cloudinary.js        # Cloudinary configuration
│   │   └── jwt.js               # JWT secret and options
│   ├── models/
│   │   ├── Voter.js             # Voter schema
│   │   ├── Candidate.js         # Candidate schema
│   │   ├── Vote.js              # Vote schema
│   │   └── Admin.js             # Admin schema
│   ├── controllers/
│   │   ├── authController.js    # Login, token validation
│   │   ├── voterController.js   # Voter CRUD, voting logic
│   │   ├── candidateController.js # Candidate CRUD
│   │   └── adminController.js   # Admin dashboard data
│   ├── middleware/
│   │   ├── authMiddleware.js    # JWT verification
│   │   ├── roleMiddleware.js    # Role-based access
│   │   └── errorHandler.js      # Global error handling
│   ├── routes/
│   │   ├── auth.js              # Authentication routes
│   │   ├── voters.js            # Voter-related routes
│   │   ├── candidates.js        # Candidate routes
│   │   └── admin.js             # Admin dashboard routes
│   ├── services/
│   │   ├── emailService.js      # Nodemailer configuration
│   │   └── cloudinaryService.js # Image upload utilities
│   ├── scripts/
│   │   ├── seedAdmin.js         # Create admin user
│   │   ├── registerVoters.js    # Bulk voter creation
│   │   └── registerCandidates.js # Bulk candidate creation
│   └── app.js                   # Express app setup
├── package.json
└── .env                         # Environment variables
```

### Frontend Structure (Vite + React)
```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Header.jsx       # Navigation component
│   │   │   ├── Footer.jsx       # Footer component
│   │   │   └── LoadingSpinner.jsx # Loading states
│   │   ├── auth/
│   │   │   └── LoginForm.jsx    # Login form component
│   │   ├── voter/
│   │   │   ├── Dashboard.jsx    # Voter dashboard
│   │   │   ├── CandidateCard.jsx # Individual candidate display
│   │   │   └── VotingModal.jsx  # Vote confirmation modal
│   │   └── admin/
│   │       ├── AdminDashboard.jsx # Admin main view
│   │       ├── VoterList.jsx    # Voter management
│   │       ├── CandidateList.jsx # Candidate management
│   │       └── VoteStats.jsx    # Vote analytics
│   ├── pages/
│   │   ├── Login.jsx            # Login page
│   │   ├── VoterDashboard.jsx   # Voter main page
│   │   └── AdminDashboard.jsx   # Admin main page
│   ├── services/
│   │   └── api.js               # Axios configuration & API calls
│   ├── context/
│   │   └── AuthContext.jsx      # Authentication state management
│   ├── hooks/
│   │   └── useAuth.js           # Authentication custom hook
│   ├── utils/
│   │   ├── constants.js         # App constants
│   │   └── helpers.js           # Utility functions
│   ├── App.jsx                  # Main app component with routing
│   └── main.jsx                 # Vite entry point
├── package.json
├── vite.config.js               # Vite configuration
└── tailwind.config.js           # Tailwind CSS configuration
```

## Backend API Design

### Authentication Endpoints

#### POST /api/auth/login
**Purpose**: User login (voters and admins)

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "autogenerated123"
}
```

**Success Response (200)**:
```json
{
  "status": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "64a1b2c3d4e5f6789abcdef0",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "role": "voter",
      "level": 300
    }
  }
}
```

**Error Responses**:
```json
// 401 - Invalid credentials
{
  "status": "error",
  "message": "Invalid email or password"
}

// 400 - Missing fields
{
  "status": "error",
  "message": "Email and password are required"
}
```

#### POST /api/auth/verify-token
**Purpose**: Validate JWT token on app reload

**Request Headers**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Success Response (200)**:
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "64a1b2c3d4e5f6789abcdef0",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "role": "voter",
      "level": 300
    }
  }
}
```

### Candidate Endpoints

#### GET /api/candidates
**Purpose**: Get all candidates grouped by position

**Success Response (200)**:
```json
{
  "status": "success",
  "data": {
    "President": [
      {
        "id": "64a1b2c3d4e5f6789abcdef1",
        "firstName": "Jane",
        "lastName": "Smith",
        "email": "jane@example.com",
        "position": "President",
        "profilePictureUrl": "https://res.cloudinary.com/demo/image/upload/v1234567890/candidates/jane_smith.jpg"
      }
    ],
    "Vice President": [
      {
        "id": "64a1b2c3d4e5f6789abcdef2",
        "firstName": "Mike",
        "lastName": "Johnson",
        "email": "mike@example.com",
        "position": "Vice President",
        "profilePictureUrl": "https://res.cloudinary.com/demo/image/upload/v1234567890/candidates/mike_johnson.jpg"
      }
    ]
  }
}
```

### Voting Endpoints

#### POST /api/votes
**Purpose**: Cast a vote (protected route)

**Request Headers**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Request Body**:
```json
{
  "position": "President",
  "candidateId": "64a1b2c3d4e5f6789abcdef1"
}
```

**Success Response (201)**:
```json
{
  "status": "success",
  "message": "Vote cast successfully",
  "data": {
    "position": "President",
    "candidateId": "64a1b2c3d4e5f6789abcdef1",
    "timestamp": "2025-09-10T14:30:00.000Z"
  }
}
```

**Error Responses**:
```json
// 400 - Already voted
{
  "status": "error",
  "message": "You have already voted for this position"
}

// 404 - Invalid candidate
{
  "status": "error",
  "message": "Candidate not found"
}
```

#### GET /api/votes/my-votes
**Purpose**: Get current user's voting status

**Success Response (200)**:
```json
{
  "status": "success",
  "data": {
    "votedPositions": ["President", "Vice President"],
    "availablePositions": ["Secretary", "Treasurer"]
  }
}
```

### Admin Endpoints

#### GET /api/admin/voters
**Purpose**: Get all voters with voting status (admin only)

**Query Parameters**: `?level=300&hasVoted=true`

**Success Response (200)**:
```json
{
  "status": "success",
  "data": {
    "voters": [
      {
        "id": "64a1b2c3d4e5f6789abcdef0",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com",
        "matricNumber": "ENG1234",
        "level": 300,
        "hasVoted": ["President"],
        "totalVotes": 1
      }
    ],
    "totalVoters": 1500,
    "votersWhoVoted": 850,
    "votersWhoNotVoted": 650
  }
}
```

#### GET /api/admin/vote-stats
**Purpose**: Get voting statistics by position

**Success Response (200)**:
```json
{
  "status": "success",
  "data": {
    "President": {
      "totalVotes": 850,
      "candidates": [
        {
          "candidateId": "64a1b2c3d4e5f6789abcdef1",
          "name": "Jane Smith",
          "votes": 450
        },
        {
          "candidateId": "64a1b2c3d4e5f6789abcdef2",
          "name": "Bob Wilson",
          "votes": 400
        }
      ]
    },
    "Vice President": {
      "totalVotes": 820,
      "candidates": []
    }
  }
}
```

## Frontend-Backend Integration

### API Service Configuration

**`src/services/api.js`**:
```javascript
import axios from 'axios';

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      sessionStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || { message: 'Network error' });
  }
);

// API methods
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  verifyToken: () => api.post('/auth/verify-token')
};

export const candidatesAPI = {
  getAll: () => api.get('/candidates'),
  getById: (id) => api.get(`/candidates/${id}`)
};

export const votesAPI = {
  castVote: (voteData) => api.post('/votes', voteData),
  getMyVotes: () => api.get('/votes/my-votes')
};

export const adminAPI = {
  getVoters: (filters) => api.get('/admin/voters', { params: filters }),
  getVoteStats: () => api.get('/admin/vote-stats')
};

export default api;
```

### Authentication Context

**`src/context/AuthContext.jsx`**:
```javascript
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing token on app load
  useEffect(() => {
    const verifyToken = async () => {
      const token = sessionStorage.getItem('authToken');
      if (token) {
        try {
          const response = await authAPI.verifyToken();
          setUser(response.data.user);
        } catch (error) {
          sessionStorage.removeItem('authToken');
        }
      }
      setLoading(false);
    };
    verifyToken();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      const { token, user } = response.data;
      
      sessionStorage.setItem('authToken', token);
      setUser(user);
      
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const logout = () => {
    sessionStorage.removeItem('authToken');
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isVoter: user?.role === 'voter'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
```

### Protected Routes Implementation

**`src/App.jsx`**:
```javascript
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import VoterDashboard from './pages/VoterDashboard';
import AdminDashboard from './pages/AdminDashboard';
import LoadingSpinner from './components/common/LoadingSpinner';

// Protected Route Component
const ProtectedRoute = ({ children, requireRole }) => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) return <LoadingSpinner />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (requireRole && user.role !== requireRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

// Main App Component
const AppRoutes = () => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) return <LoadingSpinner />;

  return (
    <Routes>
      <Route 
        path="/login" 
        element={!isAuthenticated ? <Login /> : <Navigate to={isAdmin ? "/admin" : "/dashboard"} />} 
      />
      
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute requireRole="voter">
            <VoterDashboard />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute requireRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/" 
        element={<Navigate to={isAuthenticated ? (isAdmin ? "/admin" : "/dashboard") : "/login"} />} 
      />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <AppRoutes />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
```

## Key Implementation Flows

### 1. Complete Login Flow
1. **User enters credentials** in `LoginForm.jsx`
2. **Frontend calls** `authAPI.login(credentials)`
3. **Backend validates** email/password in `authController.js`
4. **JWT generated** with user payload (id, role, etc.)
5. **Token sent** to frontend in response
6. **Frontend stores** token in sessionStorage
7. **User state updated** in AuthContext
8. **Redirect** to appropriate dashboard based on role

### 2. Vote Casting Flow
1. **Voter selects candidate** on dashboard
2. **Confirmation modal** appears with candidate details
3. **Frontend calls** `votesAPI.castVote({ position, candidateId })`
4. **Backend middleware** verifies JWT and extracts voterId
5. **Vote validation** checks if already voted for position
6. **Vote recorded** in votes collection
7. **Voter's hasVoted array** updated
8. **Success response** sent to frontend
9. **UI updated** to disable voting for that position

### 3. Image Storage with Cloudinary
**Candidate Registration Script Flow:**
1. **Script reads** candidate data from CSV/JSON file
2. **For each candidate:**
   - Upload image to Cloudinary using SDK
   - Receive `secure_url` and `public_id`
   - Store candidate with Cloudinary URL in MongoDB
3. **Frontend displays** images directly from Cloudinary URLs
4. **Cloudinary handles** optimization, resizing, and CDN delivery

### 4. Admin Dashboard Data Flow
1. **Admin accesses** `/admin` route
2. **Multiple API calls** triggered simultaneously:
   - `adminAPI.getVoters()` for voter list
   - `adminAPI.getVoteStats()` for vote analytics
3. **Data rendered** in respective components
4. **Real-time updates** can be added via WebSocket later

## Security Implementations

### JWT Security
- **Algorithm**: HS256 with secret from environment variable
- **Expiration**: 24 hours
- **Storage**: sessionStorage (auto-clears on browser close)
- **Validation**: Every protected route validates token

### Password Security
- **Hashing**: bcrypt with salt rounds of 12
- **Auto-generation**: Cryptographically secure random passwords
- **No reset**: Passwords can only be changed via admin scripts

### Vote Privacy
- **No result display** to voters during election
- **Vote anonymization**: Only admins see aggregated counts
- **One vote per position** enforced at database level

### Input Validation
- **Backend**: Joi/express-validator for all inputs
- **Frontend**: React form validation before API calls
- **MongoDB**: Schema validation as final layer

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Cloudinary account
- SMTP server for emails

### Backend Setup
```bash
# Clone and navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file (see Environment Variables section)
cp .env.example .env

# Run database migrations/seeds
npm run seed:admin

# Start development server
npm run dev
```

### Frontend Setup (Vite)
```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start Vite development server
npm run dev
```

### Database Setup
```bash
# Run admin seed script
npm run seed:admin

# Run voter registration script
npm run seed:voters

# Run candidate registration script
npm run seed:candidates
```

## Environment Variables

### Backend (.env)
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/election-app
# or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/election-app

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=24h

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email Configuration (for sending credentials)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=your-email@gmail.com
```

### Frontend (.env)
```env
# API Configuration
VITE_API_URL=http://localhost:5000/api

# App Configuration
VITE_APP_NAME=Election System
VITE_APP_VERSION=1.0.0
```

### Vite Configuration

**`vite.config.js`**:
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
```

## Scripts Usage

### Admin Creation
```bash
# Create initial admin user
npm run seed:admin
```

### Voter Registration
```bash
# Bulk create voters from CSV/JSON
npm run seed:voters -- --file voters.csv
```

### Candidate Registration
```bash
# Bulk create candidates with image upload
npm run seed:candidates -- --file candidates.csv --images ./candidate-images/
```

### Development Scripts
```bash
# Backend
npm run dev          # Start backend with nodemon
npm run start        # Start backend production
npm run test         # Run tests

# Frontend
npm run dev          # Start Vite dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Production Deployment
```bash
# Build frontend
cd frontend && npm run build

# Start backend
cd backend && npm start
```

## API Testing

Use the provided Postman collection or test with curl:

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'

# Get candidates
curl -X GET http://localhost:5000/api/candidates \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Cast vote
curl -X POST http://localhost:5000/api/votes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"position":"President","candidateId":"CANDIDATE_ID"}'
```

---

This implementation guide provides the complete technical blueprint for building the election system. The architecture ensures security, scalability, and maintainability while leveraging Vite for fast development and optimized builds.