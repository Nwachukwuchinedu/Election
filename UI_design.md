# 🎨 Election Web App - UI Design System

## Table of Contents
1. [Design Overview](#design-overview)
2. [Design Principles](#design-principles)
3. [Color Palette](#color-palette)
4. [Typography](#typography)
5. [Component Library](#component-library)
6. [Layout System](#layout-system)
7. [Page Designs](#page-designs)
8. [Responsive Design](#responsive-design)
9. [Accessibility Guidelines](#accessibility-guidelines)
10. [Animation & Interactions](#animation--interactions)
11. [Implementation Guide](#implementation-guide)

## Design Overview

The Election Web App follows a **clean, professional, and trustworthy design** that instills confidence in the voting process. The UI emphasizes **accessibility, security, and ease of use** with a modern, government-appropriate aesthetic.

### Design Goals
- **Trust & Security**: Visual elements that convey reliability and security
- **Accessibility**: WCAG 2.1 AA compliant design for all users
- **Simplicity**: Clean, uncluttered interface focused on core functionality
- **Professional**: Government/institutional aesthetic appropriate for elections
- **Mobile-First**: Responsive design that works on all devices

### Target Users
- **Voters**: Students/citizens casting votes (primary users)
- **Administrators**: Election officials managing the system
- **Candidates**: Individuals whose information is displayed

## Design Principles

### 1. Clarity First
- Clear visual hierarchy with proper spacing
- Obvious call-to-action buttons
- Simple, direct language
- Unambiguous icons and symbols

### 2. Trust & Security
- Professional color scheme (blues, whites, grays)
- Secure visual indicators (locks, shields)
- Clear voting confirmation flows
- Transparent process communication

### 3. Accessibility
- High contrast ratios (4.5:1 minimum)
- Keyboard navigation support
- Screen reader compatibility
- Clear focus states

### 4. Consistency
- Unified component library
- Consistent spacing system
- Standardized interaction patterns
- Cohesive visual language

## Color Palette

### Primary Colors
```css
/* Primary Blue - Trust & Authority */
--primary-50: #eff6ff
--primary-100: #dbeafe
--primary-200: #bfdbfe
--primary-300: #93c5fd
--primary-400: #60a5fa
--primary-500: #3b82f6  /* Main primary */
--primary-600: #2563eb
--primary-700: #1d4ed8
--primary-800: #1e40af
--primary-900: #1e3a8a

/* Secondary Green - Success & Confirmation */
--secondary-50: #ecfdf5
--secondary-100: #d1fae5
--secondary-200: #a7f3d0
--secondary-300: #6ee7b7
--secondary-400: #34d399
--secondary-500: #10b981  /* Main secondary */
--secondary-600: #059669
--secondary-700: #047857
--secondary-800: #065f46
--secondary-900: #064e3b
```

### Neutral Colors
```css
/* Grays - Text & Backgrounds */
--gray-50: #f9fafb
--gray-100: #f3f4f6
--gray-200: #e5e7eb
--gray-300: #d1d5db
--gray-400: #9ca3af
--gray-500: #6b7280
--gray-600: #4b5563
--gray-700: #374151
--gray-800: #1f2937
--gray-900: #111827
```

### Status Colors
```css
/* Success */
--success-50: #ecfdf5
--success-500: #10b981
--success-700: #047857

/* Warning */
--warning-50: #fffbeb
--warning-500: #f59e0b
--warning-700: #b45309

/* Error */
--error-50: #fef2f2
--error-500: #ef4444
--error-700: #b91c1c

/* Info */
--info-50: #eff6ff
--info-500: #3b82f6
--info-700: #1d4ed8
```

### Usage Guidelines
- **Primary Blue**: Main actions, links, active states
- **Secondary Green**: Success states, vote confirmations
- **Gray**: Text, borders, inactive states
- **Status Colors**: Alerts, notifications, feedback

## Typography

### Font Stack
```css
/* Primary Font - Inter */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

/* Monospace - For codes/IDs */
font-family: 'JetBrains Mono', 'Fira Code', Consolas, monospace;
```

### Type Scale
```css
/* Headings */
.text-5xl { font-size: 3rem; line-height: 1.2; }      /* 48px - Page titles */
.text-4xl { font-size: 2.25rem; line-height: 1.25; }  /* 36px - Section headers */
.text-3xl { font-size: 1.875rem; line-height: 1.3; }  /* 30px - Card titles */
.text-2xl { font-size: 1.5rem; line-height: 1.35; }   /* 24px - Component titles */
.text-xl { font-size: 1.25rem; line-height: 1.4; }    /* 20px - Subtitles */
.text-lg { font-size: 1.125rem; line-height: 1.45; }  /* 18px - Large body */

/* Body Text */
.text-base { font-size: 1rem; line-height: 1.5; }     /* 16px - Default body */
.text-sm { font-size: 0.875rem; line-height: 1.55; }  /* 14px - Small text */
.text-xs { font-size: 0.75rem; line-height: 1.6; }    /* 12px - Captions */
```

### Font Weights
```css
.font-light { font-weight: 300; }     /* Light text */
.font-normal { font-weight: 400; }    /* Regular body */
.font-medium { font-weight: 500; }    /* Emphasized text */
.font-semibold { font-weight: 600; }  /* Headings */
.font-bold { font-weight: 700; }      /* Strong emphasis */
```

## Component Library

### 1. Buttons

#### Primary Button
```jsx
<button className="px-6 py-3 bg-primary-600 text-white font-medium rounded-lg 
                   hover:bg-primary-700 focus:ring-4 focus:ring-primary-200 
                   transition-colors duration-200 disabled:opacity-50">
  Cast Vote
</button>
```

#### Secondary Button
```jsx
<button className="px-6 py-3 bg-white border-2 border-primary-600 text-primary-600 
                   font-medium rounded-lg hover:bg-primary-50 focus:ring-4 
                   focus:ring-primary-200 transition-colors duration-200">
  View Details
</button>
```

#### Danger Button
```jsx
<button className="px-6 py-3 bg-error-600 text-white font-medium rounded-lg 
                   hover:bg-error-700 focus:ring-4 focus:ring-error-200 
                   transition-colors duration-200">
  Logout
</button>
```

### 2. Form Elements

#### Input Field
```jsx
<div className="space-y-2">
  <label className="block text-sm font-medium text-gray-700">
    Email Address
  </label>
  <input 
    type="email"
    className="w-full px-4 py-3 border border-gray-300 rounded-lg 
               focus:ring-2 focus:ring-primary-500 focus:border-primary-500 
               transition-colors duration-200"
    placeholder="Enter your email"
  />
</div>
```

#### Select Dropdown
```jsx
<select className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                   focus:ring-2 focus:ring-primary-500 focus:border-primary-500 
                   bg-white transition-colors duration-200">
  <option value="">Select Level</option>
  <option value="100">100 Level</option>
  <option value="200">200 Level</option>
</select>
```

### 3. Cards

#### Candidate Card
```jsx
<div className="bg-white rounded-xl shadow-sm border border-gray-200 
                hover:shadow-md transition-shadow duration-200 overflow-hidden">
  {/* Image */}
  <div className="aspect-square w-full bg-gray-100">
    <img 
      src={candidate.profilePictureUrl} 
      alt={`${candidate.firstName} ${candidate.lastName}`}
      className="w-full h-full object-cover"
    />
  </div>
  
  {/* Content */}
  <div className="p-6">
    <h3 className="text-xl font-semibold text-gray-900 mb-2">
      {candidate.firstName} {candidate.lastName}
    </h3>
    <p className="text-gray-600 mb-4">{candidate.position}</p>
    
    <button className="w-full px-4 py-2 bg-primary-600 text-white 
                       rounded-lg hover:bg-primary-700 transition-colors">
      Vote for {candidate.firstName}
    </button>
  </div>
</div>
```

#### Statistics Card
```jsx
<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
  <div className="flex items-center justify-between">
    <div>
      <p className="text-sm font-medium text-gray-600">Total Voters</p>
      <p className="text-3xl font-bold text-gray-900">1,247</p>
    </div>
    <div className="p-3 bg-primary-100 rounded-lg">
      <UsersIcon className="h-8 w-8 text-primary-600" />
    </div>
  </div>
</div>
```

### 4. Navigation

#### Header Navigation
```jsx
<header className="bg-white border-b border-gray-200 sticky top-0 z-40">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex justify-between items-center h-16">
      {/* Logo */}
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-primary-600 rounded-lg">
          <VoteIcon className="h-6 w-6 text-white" />
        </div>
        <h1 className="text-xl font-bold text-gray-900">Election System</h1>
      </div>
      
      {/* User Menu */}
      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-600">Welcome, {user.firstName}</span>
        <button className="px-4 py-2 text-sm text-error-600 hover:bg-error-50 
                           rounded-lg transition-colors">
          Logout
        </button>
      </div>
    </div>
  </div>
</header>
```

#### Sidebar Navigation (Admin)
```jsx
<nav className="bg-white border-r border-gray-200 w-64 fixed left-0 top-16 h-full">
  <div className="p-4 space-y-2">
    <a href="/admin/dashboard" 
       className="flex items-center space-x-3 px-4 py-3 text-gray-700 
                  hover:bg-gray-100 rounded-lg transition-colors">
      <DashboardIcon className="h-5 w-5" />
      <span>Dashboard</span>
    </a>
    <a href="/admin/voters" 
       className="flex items-center space-x-3 px-4 py-3 text-gray-700 
                  hover:bg-gray-100 rounded-lg transition-colors">
      <UsersIcon className="h-5 w-5" />
      <span>Voters</span>
    </a>
  </div>
</nav>
```

### 5. Modals & Alerts

#### Vote Confirmation Modal
```jsx
<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
  <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
    <div className="flex items-center space-x-3 mb-4">
      <div className="p-2 bg-primary-100 rounded-lg">
        <VoteIcon className="h-6 w-6 text-primary-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900">Confirm Your Vote</h3>
    </div>
    
    <p className="text-gray-600 mb-6">
      You are about to vote for <strong>{candidate.name}</strong> for the position of 
      <strong> {position}</strong>. This action cannot be undone.
    </p>
    
    <div className="flex space-x-3">
      <button className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg 
                         hover:bg-gray-300 transition-colors">
        Cancel
      </button>
      <button className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg 
                         hover:bg-primary-700 transition-colors">
        Confirm Vote
      </button>
    </div>
  </div>
</div>
```

#### Success Alert
```jsx
<div className="bg-success-50 border border-success-200 rounded-lg p-4 mb-6">
  <div className="flex items-center space-x-3">
    <CheckCircleIcon className="h-5 w-5 text-success-600" />
    <div>
      <p className="font-medium text-success-800">Vote Successful!</p>
      <p className="text-sm text-success-700">Your vote has been recorded securely.</p>
    </div>
  </div>
</div>
```

## Layout System

### Grid System
```css
/* Container sizes */
.container-sm { max-width: 640px; }    /* Small screens */
.container-md { max-width: 768px; }    /* Medium screens */
.container-lg { max-width: 1024px; }   /* Large screens */
.container-xl { max-width: 1280px; }   /* Extra large screens */

/* Grid layouts */
.grid-1 { grid-template-columns: repeat(1, 1fr); }
.grid-2 { grid-template-columns: repeat(2, 1fr); }
.grid-3 { grid-template-columns: repeat(3, 1fr); }
.grid-4 { grid-template-columns: repeat(4, 1fr); }
```

### Spacing System
```css
/* Spacing scale (based on 4px) */
.space-1 { margin/padding: 0.25rem; }    /* 4px */
.space-2 { margin/padding: 0.5rem; }     /* 8px */
.space-3 { margin/padding: 0.75rem; }    /* 12px */
.space-4 { margin/padding: 1rem; }       /* 16px */
.space-6 { margin/padding: 1.5rem; }     /* 24px */
.space-8 { margin/padding: 2rem; }       /* 32px */
.space-12 { margin/padding: 3rem; }      /* 48px */
.space-16 { margin/padding: 4rem; }      /* 64px */
```

## Page Designs

### 1. Login Page

#### Layout Structure
```jsx
<div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 
                flex items-center justify-center p-4">
  <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
    {/* Header */}
    <div className="text-center mb-8">
      <div className="inline-flex items-center justify-center w-16 h-16 
                      bg-primary-600 rounded-full mb-4">
        <VoteIcon className="h-8 w-8 text-white" />
      </div>
      <h1 className="text-2xl font-bold text-gray-900">Election Login</h1>
      <p className="text-gray-600">Access your voting dashboard</p>
    </div>
    
    {/* Login Form */}
    <form className="space-y-6">
      {/* Email Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email Address
        </label>
        <input 
          type="email"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                     focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          placeholder="Enter your email"
        />
      </div>
      
      {/* Password Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Password
        </label>
        <input 
          type="password"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                     focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          placeholder="Enter your password"
        />
      </div>
      
      {/* Submit Button */}
      <button 
        type="submit"
        className="w-full py-3 bg-primary-600 text-white font-medium rounded-lg 
                   hover:bg-primary-700 focus:ring-4 focus:ring-primary-200 
                   transition-colors duration-200">
        Sign In
      </button>
    </form>
    
    {/* Security Notice */}
    <div className="mt-6 p-4 bg-info-50 rounded-lg">
      <div className="flex items-start space-x-3">
        <ShieldIcon className="h-5 w-5 text-info-600 mt-0.5" />
        <div className="text-sm text-info-800">
          <p className="font-medium">Secure Voting</p>
          <p>Your vote is encrypted and anonymous.</p>
        </div>
      </div>
    </div>
  </div>
</div>
```

### 2. Voter Dashboard

#### Layout Structure
```jsx
<div className="min-h-screen bg-gray-50">
  {/* Header */}
  <Header />
  
  {/* Main Content */}
  <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    {/* Welcome Section */}
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Welcome, {user.firstName}!
      </h1>
      <p className="text-gray-600">
        Cast your vote for the following positions. You can vote once per position.
      </p>
    </div>
    
    {/* Voting Status */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-sm font-medium text-gray-600">Positions Available</h3>
        <p className="text-2xl font-bold text-gray-900">{totalPositions}</p>
      </div>
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-sm font-medium text-gray-600">Votes Cast</h3>
        <p className="text-2xl font-bold text-success-600">{votedPositions}</p>
      </div>
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-sm font-medium text-gray-600">Remaining</h3>
        <p className="text-2xl font-bold text-warning-600">{remainingVotes}</p>
      </div>
    </div>
    
    {/* Positions & Candidates */}
    <div className="space-y-8">
      {positions.map(position => (
        <section key={position.name} className="bg-white rounded-xl shadow-sm 
                                               border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{position.name}</h2>
            {hasVoted(position.name) && (
              <span className="px-3 py-1 bg-success-100 text-success-800 
                               rounded-full text-sm font-medium">
                ✓ Vote Cast
              </span>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {position.candidates.map(candidate => (
              <CandidateCard 
                key={candidate.id} 
                candidate={candidate}
                position={position.name}
                disabled={hasVoted(position.name)}
                onVote={handleVote}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  </main>
</div>
```

### 3. Admin Dashboard

#### Layout Structure
```jsx
<div className="min-h-screen bg-gray-50">
  {/* Header */}
  <Header />
  
  <div className="flex">
    {/* Sidebar */}
    <Sidebar />
    
    {/* Main Content */}
    <main className="flex-1 ml-64 p-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Total Voters"
          value="1,247"
          icon={UsersIcon}
          color="primary"
        />
        <StatCard 
          title="Votes Cast"
          value="856"
          icon={VoteIcon}
          color="success"
        />
        <StatCard 
          title="Participation"
          value="68.6%"
          icon={ChartIcon}
          color="info"
        />
        <StatCard 
          title="Candidates"
          value="24"
          icon={PersonIcon}
          color="warning"
        />
      </div>
      
      {/* Charts & Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Vote Statistics */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Voting Progress
          </h3>
          <VoteChart data={voteData} />
        </div>
        
        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Votes
          </h3>
          <ActivityList activities={recentVotes} />
        </div>
      </div>
    </main>
  </div>
</div>
```

## Responsive Design

### Breakpoints
```css
/* Mobile First Approach */
/* xs: 0px - 639px (default) */
/* sm: 640px and up */
@media (min-width: 640px) { /* Small tablets */ }

/* md: 768px and up */
@media (min-width: 768px) { /* Large tablets */ }

/* lg: 1024px and up */
@media (min-width: 1024px) { /* Laptops */ }

/* xl: 1280px and up */
@media (min-width: 1280px) { /* Desktops */ }

/* 2xl: 1536px and up */
@media (min-width: 1536px) { /* Large desktops */ }
```

### Responsive Patterns

#### Candidate Cards
```jsx
/* Mobile: 1 column */
/* Tablet: 2 columns */
/* Desktop: 3 columns */
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {candidates.map(candidate => <CandidateCard key={candidate.id} />)}
</div>
```

#### Navigation
```jsx
/* Mobile: Hamburger menu */
/* Desktop: Full navigation */
<nav className="hidden lg:flex lg:space-x-8">
  {/* Desktop navigation */}
</nav>

<button className="lg:hidden">
  {/* Mobile hamburger */}
</button>
```

## Accessibility Guidelines

### WCAG 2.1 AA Compliance

#### Color Contrast
- **Normal text**: 4.5:1 contrast ratio minimum
- **Large text**: 3:1 contrast ratio minimum
- **UI components**: 3:1 contrast ratio minimum

#### Keyboard Navigation
```jsx
/* Focus management */
.focus\:ring-2:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
  box-shadow: 0 0 0 2px #3b82f6;
}

/* Skip navigation */
<a href="#main-content" 
   className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 
              bg-primary-600 text-white px-4 py-2 rounded-lg">
  Skip to main content
</a>
```

#### Screen Reader Support
```jsx
/* Proper labeling */
<button aria-label="Vote for Jane Smith as President">
  Vote
</button>

/* Status announcements */
<div aria-live="polite" className="sr-only">
  {statusMessage}
</div>

/* Loading states */
<button disabled aria-describedby="loading-text">
  {loading ? 'Casting vote...' : 'Cast Vote'}
</button>
```

## Animation & Interactions

### Micro-interactions
```css
/* Button hover */
.btn-primary {
  transition: all 0.2s ease-in-out;
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

/* Card hover */
.candidate-card {
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.candidate-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
}
```

### Loading States
```jsx
/* Skeleton loader */
<div className="animate-pulse">
  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
</div>

/* Spinner */
<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
```

### Page Transitions
```jsx
/* Fade in animation */
<div className="animate-fadeIn">
  {content}
</div>

/* Slide up animation */
<div className="animate-slideUp">
  {modal}
</div>
```

## Implementation Guide

### 1. Tailwind CSS Configuration

**`tailwind.config.js`**:
```javascript
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        secondary: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'fadeIn': 'fadeIn 0.5s ease-in-out',
        'slideUp': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
```

### 2. Icon Library Setup

**Install Heroicons**:
```bash
npm install @heroicons/react
```

**Usage**:
```jsx
import { 
  UserIcon, 
  VoteIcon, 
  ChartBarIcon,
  ShieldCheckIcon 
} from '@heroicons/react/24/outline'

<UserIcon className="h-6 w-6 text-primary-600" />
```

### 3. Component Organization

**Create reusable components**:
```
src/components/
├── ui/
│   ├── Button.jsx
│   ├── Input.jsx
│   ├── Card.jsx
│   ├── Modal.jsx
│   └── Alert.jsx
├── layout/
│   ├── Header.jsx
│   ├── Sidebar.jsx
│   └── Footer.jsx
└── features/
    ├── voting/
    ├── admin/
    └── auth/
```

### 4. Theme Provider Setup

**`src/context/ThemeContext.jsx`**:
```jsx
import React, { createContext, useContext } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const theme = {
    colors: {
      primary: '#3b82f6',
      secondary: '#10b981',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
    },
    borderRadius: {
      sm: '0.375rem',
      md: '0.5rem',
      lg: '0.75rem',
      xl: '1rem',
    },
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};
```

## Google Fonts Integration

### HTML Setup
Add the following to your `index.html` file in the `<head>` section:

```html
<!-- Google Fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Montserrat:wght@300;400;500;600&family=Raleway:wght@100;300;400;500&display=swap" rel="stylesheet">
```

### CSS Import (Alternative)
Or add to your main CSS file:

```css
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Montserrat:wght@300;400;500;600&family=Raleway:wght@100;300;400;500&display=swap');
```

### Performance Optimization
For better performance, use font-display: swap in your CSS:

```css
@font-face {
  font-family: 'Poppins';
  font-display: swap;
  /* Other font properties */
}
```

## Typography Examples

### Heading Hierarchy with Fonts
```jsx
// Page Title - Poppins Bold
<h1 className="text-4xl font-poppins-bold text-gray-900 mb-6">
  Election Dashboard
</h1>

// Section Title - Poppins Semibold  
<h2 className="text-2xl font-poppins-semibold text-gray-800 mb-4">
  Presidential Candidates
</h2>

// Card Title - Poppins Medium
<h3 className="text-xl font-poppins-medium text-gray-900 mb-2">
  Jane Smith
</h3>

// Body Text - Montserrat Regular
<p className="text-base font-montserrat-regular text-gray-600 leading-relaxed">
  Cast your vote for the candidate of your choice. Your vote is confidential and secure.
</p>

// Accent Text - Raleway Light
<p className="text-lg font-raleway-light text-primary-600 italic">
  "Every vote counts in shaping our future"
</p>

// Button Text - Poppins Medium
<button className="px-6 py-3 bg-primary-600 text-white font-poppins-medium rounded-lg">
  Cast Your Vote
</button>
```

### Font Pairing Guidelines

#### Primary Combinations
1. **Headings**: Poppins (Bold/Semibold) + **Body**: Montserrat (Regular)
2. **Buttons/UI**: Poppins (Medium) + **Content**: Montserrat (Regular) 
3. **Accents**: Raleway (Light/Regular) for quotes and special elements

#### Usage Rules
- **Poppins**: All headings, navigation, buttons, labels, and UI elements
- **Montserrat**: All body text, descriptions, form inputs, and general content
- **Raleway**: Special text like quotes, testimonials, hero text, and decorative elements
- **Limit to 2-3 fonts per page** to maintain visual hierarchy

### Responsive Typography
```css
/* Mobile-first responsive typography */
@media (max-width: 640px) {
  .responsive-title {
    @apply text-2xl font-poppins-bold;
  }
  
  .responsive-body {
    @apply text-sm font-montserrat-regular;
  }
}

@media (min-width: 641px) {
  .responsive-title {
    @apply text-4xl font-poppins-bold;
  }
  
  .responsive-body {
    @apply text-base font-montserrat-regular;
  }
}
```

**`src/styles/utilities.css`**:
```css
/* Custom animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* Custom utilities */
.text-balance {
  text-wrap: balance;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* Glass morphism effect */
.glass {
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.18);
}

/* Custom focus styles */
.focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Print styles */
@media print {
  .no-print {
    display: none !important;
  }
  
  .print-only {
    display: block !important;
  }
}
```

## Dark Mode Support (Optional Future Enhancement)

### Dark Mode Color Palette
```css
/* Dark mode colors */
:root[data-theme="dark"] {
  --primary-50: #1e3a8a;
  --primary-500: #60a5fa;
  --primary-600: #3b82f6;
  
  --gray-50: #1f2937;
  --gray-100: #374151;
  --gray-200: #4b5563;
  --gray-800: #f3f4f6;
  --gray-900: #ffffff;
  
  --bg-primary: #111827;
  --bg-secondary: #1f2937;
  --text-primary: #f9fafb;
  --text-secondary: #d1d5db;
}
```

### Dark Mode Implementation
```jsx
// Dark mode toggle component
const DarkModeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 
                 text-gray-600 dark:text-gray-300"
    >
      {isDark ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
    </button>
  );
};
```

## Performance Optimization

### Image Optimization
```jsx
// Lazy loading for candidate images
const CandidateImage = ({ src, alt, className }) => {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      decoding="async"
      onError={(e) => {
        e.target.src = '/images/placeholder-avatar.jpg';
      }}
    />
  );
};
```

### Code Splitting
```jsx
// Lazy load admin components
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const VoterDashboard = lazy(() => import('./pages/VoterDashboard'));

// Wrap in Suspense
<Suspense fallback={<LoadingSpinner />}>
  <Routes>
    <Route path="/admin" element={<AdminDashboard />} />
    <Route path="/dashboard" element={<VoterDashboard />} />
  </Routes>
</Suspense>
```

## Testing UI Components

### Visual Testing Setup
```bash
# Install Storybook for component development
npx storybook@latest init

# Install testing utilities
npm install --save-dev @testing-library/react @testing-library/jest-dom
```

### Component Stories
**`src/stories/Button.stories.js`**:
```javascript
export default {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export const Primary = {
  args: {
    variant: 'primary',
    children: 'Cast Vote',
  },
};

export const Secondary = {
  args: {
    variant: 'secondary',
    children: 'View Details',
  },
};

export const Disabled = {
  args: {
    variant: 'primary',
    disabled: true,
    children: 'Already Voted',
  },
};
```

## Mobile-Specific Considerations

### Touch Interactions
```css
/* Larger touch targets for mobile */
@media (max-width: 768px) {
  .btn {
    min-height: 44px;
    min-width: 44px;
  }
  
  .touch-target {
    padding: 12px;
  }
}

/* Remove hover effects on touch devices */
@media (hover: none) {
  .hover\:bg-primary-700:hover {
    background-color: inherit;
  }
}
```

### Mobile Navigation
```jsx
// Mobile-first navigation
const MobileNavigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="lg:hidden p-2"
        onClick={() => setIsOpen(true)}
      >
        <MenuIcon className="h-6 w-6" />
      </button>

      {/* Mobile menu overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50">
          <div className="bg-white w-64 h-full p-4">
            <nav className="space-y-2">
              {/* Navigation items */}
            </nav>
          </div>
        </div>
      )}
    </>
  );
};
```

## Error States & Empty States

### Error State Design
```jsx
const ErrorState = ({ message, onRetry }) => (
  <div className="text-center py-12">
    <div className="inline-flex items-center justify-center w-16 h-16 
                    bg-error-100 rounded-full mb-4">
      <ExclamationTriangleIcon className="h-8 w-8 text-error-600" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">
      Something went wrong
    </h3>
    <p className="text-gray-600 mb-6">{message}</p>
    <button
      onClick={onRetry}
      className="px-6 py-3 bg-primary-600 text-white rounded-lg 
                 hover:bg-primary-700 transition-colors"
    >
      Try Again
    </button>
  </div>
);
```

### Empty State Design
```jsx
const EmptyState = ({ title, description, action }) => (
  <div className="text-center py-12">
    <div className="inline-flex items-center justify-center w-16 h-16 
                    bg-gray-100 rounded-full mb-4">
      <InboxIcon className="h-8 w-8 text-gray-400" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600 mb-6">{description}</p>
    {action && (
      <button className="px-6 py-3 bg-primary-600 text-white rounded-lg 
                         hover:bg-primary-700 transition-colors">
        {action.label}
      </button>
    )}
  </div>
);
```

## Form Validation UI

### Input Validation States
```jsx
const ValidatedInput = ({ label, error, success, ...props }) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <div className="relative">
      <input
        {...props}
        className={`w-full px-4 py-3 rounded-lg border transition-colors
          ${error 
            ? 'border-error-300 focus:border-error-500 focus:ring-error-500' 
            : success 
            ? 'border-success-300 focus:border-success-500 focus:ring-success-500'
            : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
          }`}
      />
      {error && (
        <ExclamationCircleIcon className="absolute right-3 top-3 h-5 w-5 text-error-500" />
      )}
      {success && (
        <CheckCircleIcon className="absolute right-3 top-3 h-5 w-5 text-success-500" />
      )}
    </div>
    {error && (
      <p className="text-sm text-error-600">{error}</p>
    )}
    {success && (
      <p className="text-sm text-success-600">{success}</p>
    )}
  </div>
);
```

## Print Styles

### Print-Friendly Designs
```css
@media print {
  /* Hide non-essential elements */
  .no-print,
  header,
  nav,
  .sidebar,
  button {
    display: none !important;
  }
  
  /* Optimize for print */
  body {
    font-size: 12pt;
    line-height: 1.4;
    color: black;
    background: white;
  }
  
  .page-break {
    page-break-before: always;
  }
  
  /* Show URLs for links */
  a[href]:after {
    content: " (" attr(href) ")";
    font-size: 0.8em;
    color: #666;
  }
}
```

## Browser Support

### Supported Browsers
- **Chrome**: Latest 2 versions
- **Firefox**: Latest 2 versions
- **Safari**: Latest 2 versions
- **Edge**: Latest 2 versions
- **Mobile Safari**: iOS 12+
- **Chrome Mobile**: Android 8+

### Fallbacks
```css
/* CSS Grid fallback */
.grid-fallback {
  display: flex;
  flex-wrap: wrap;
}

.grid-fallback > * {
  flex: 1 1 300px;
  margin: 0.5rem;
}

/* Modern features with fallbacks */
.modern-card {
  background: white;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  /* Fallback for older browsers */
  background: white;
}
```

## Design Tokens (Future Enhancement)

### Token Structure
```javascript
// design-tokens.js
export const tokens = {
  colors: {
    primary: {
      50: '#eff6ff',
      500: '#3b82f6',
      900: '#1e3a8a',
    },
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  typography: {
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
    },
    fontSize: {
      xs: '12px',
      sm: '14px',
      base: '16px',
      lg: '18px',
      xl: '20px',
    },
  },
  borderRadius: {
    sm: '4px',
    md: '6px',
    lg: '8px',
    xl: '12px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  },
};
```

---

This UI design system provides a comprehensive foundation for building a professional, accessible, and user-friendly election web application. The design emphasizes trust, security, and ease of use while maintaining modern web standards and best practices.