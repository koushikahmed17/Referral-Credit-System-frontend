# Referral Credit System - Frontend

A modern referral and credit management system built with Next.js, TypeScript, and Tailwind CSS.

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables (see Environment Variables section below)

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📝 Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Optional: Add any other environment-specific variables here
```

### Environment Variables Explained

- `NEXT_PUBLIC_API_URL` - Base URL for the backend API. Update this to point to your backend server.

## 📁 Folder Structure

```
frontend/
├── app/                          # Next.js App Router pages
│   ├── credits/
│   │   └── page.tsx             # Credits history page
│   ├── dashboard/
│   │   └── page.tsx             # Main dashboard page
│   ├── login/
│   │   └── page.tsx             # Login page
│   ├── purchases/
│   │   └── page.tsx             # Purchases page
│   ├── referrals/
│   │   └── page.tsx             # Referrals listing page
│   ├── register/
│   │   └── page.tsx             # Registration page
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home page (redirects to dashboard)
│   └── globals.css              # Global styles
│
├── components/                   # Reusable UI components
│   ├── Button.tsx               # Button component
│   ├── CopyButton.tsx           # Copy to clipboard button
│   ├── Input.tsx                # Form input component
│   ├── Loader.tsx               # Loading spinner
│   ├── Navbar.tsx               # Navigation bar
│   ├── ReferrerInfo.tsx         # Referrer information display
│   ├── Skeleton.tsx             # Loading skeleton components
│   ├── SocialShare.tsx          # Social sharing buttons
│   ├── StatCard.tsx             # Statistics card
│   ├── ThemeToggle.tsx          # Theme switcher
│   └── Toast.tsx                # Toast notification
│
├── hooks/                        # Custom React hooks
│   ├── useAuth.ts               # Authentication hook
│   ├── useDashboard.ts          # Dashboard data hook
│   ├── useFetch.ts              # Generic fetch hook
│   ├── usePurchases.ts          # Purchases data hook
│   └── useReferrals.ts          # Referrals data hook
│
├── services/                     # API service functions
│   ├── dashboard.ts             # Dashboard API calls
│   ├── purchases.ts             # Purchases API calls
│   └── referrals.ts             # Referrals API calls
│
├── store/                        # Zustand state management
│   ├── authStore.ts             # Authentication state
│   ├── toastStore.ts            # Toast notifications state
│   └── userStore.ts             # User data state
│
├── types/                        # TypeScript type definitions
│   ├── api.ts                   # API response types
│   └── index.d.ts               # Global type definitions
│
├── utils/                        # Utility functions
│   ├── constants.ts             # App constants (API endpoints, etc.)
│   ├── fetcher.ts               # API request handler
│   └── formatter.ts             # Data formatting utilities
│
├── public/                       # Static assets
│   ├── favicon.ico              # Site favicon
│   └── logo.svg                 # Application logo
│
├── .env.example                  # Environment variables example
├── .eslintrc.json               # ESLint configuration
├── .gitignore                   # Git ignore rules
├── next.config.js               # Next.js configuration
├── package.json                 # Dependencies and scripts
├── postcss.config.js            # PostCSS configuration
├── tailwind.config.js           # Tailwind CSS configuration
└── tsconfig.json                # TypeScript configuration
```

## 🏗️ Architecture

### App Router Structure (app/)

- **Pages**: Each folder represents a route in the application
- **Layout**: `app/layout.tsx` defines the root layout for all pages
- **Global Styles**: `app/globals.css` contains global CSS and Tailwind directives

### Components (components/)

Reusable UI components built with TypeScript and styled with Tailwind CSS. Each component is self-contained with its own props interface.

### Hooks (hooks/)

Custom React hooks for data fetching and state management:

- `useAuth` - Handles authentication logic
- `useDashboard` - Fetches dashboard data
- `useFetch` - Generic data fetching hook
- `usePurchases` - Manages purchase data
- `useReferrals` - Manages referral data

### Services (services/)

API service layer that communicates with the backend:

- Each service file contains functions for specific API endpoints
- Uses the `fetcher` utility for making HTTP requests
- Handles API errors and response parsing

### Store (store/)

Zustand state management stores:

- **authStore**: Manages user authentication state, login, logout, and registration
- **toastStore**: Handles toast notifications across the app
- **userStore**: Stores user profile data

### Utils (utils/)

Utility functions and constants:

- **constants.ts**: API endpoints, storage keys, and app constants
- **fetcher.ts**: Centralized HTTP client with authentication handling
- **formatter.ts**: Data formatting utilities (dates, numbers, etc.)

### Types (types/)

TypeScript type definitions for:

- API request/response types
- Component props
- Global application types

## 🔑 Key Features

- ✅ User authentication (Login, Register, Logout)
- ✅ Dashboard with statistics and referral link
- ✅ Referral tracking and management
- ✅ Purchase history and credit tracking
- ✅ Responsive design with Tailwind CSS
- ✅ Toast notifications for user feedback
- ✅ Loading states and error handling
- ✅ Field-level form validation
- ✅ Optional referral code support

## 📚 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🔧 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **HTTP Client**: Fetch API with custom wrapper
- **Validation**: Client-side validation with error display
- **Routing**: Next.js App Router

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is proprietary and confidential.
