# Referral App - Project Architecture Documentation

## 📁 Project Structure Overview

```
frontend/
├── app/                           # Next.js 14 App Router (Pages & Layouts)
├── components/                    # Reusable UI Components
├── hooks/                         # Custom React Hooks
├── store/                         # Zustand State Management
├── utils/                         # Utility Functions & Helpers
├── types/                         # TypeScript Type Definitions
├── public/                        # Static Assets
├── Configuration Files            # Build & Development Config
└── Documentation                  # Project Documentation
```

---

## 📂 Detailed Folder Structure & Code Analysis

### 🎯 **app/** - Next.js App Router Pages

#### **app/layout.tsx** - Root Layout Component

**Purpose**: Main application wrapper with global styles and metadata
**Code Written**:

- Root HTML structure with Inter font
- Global CSS imports
- Metadata configuration
- Hydration warning suppression for theme switching

#### **app/page.tsx** - Landing Page

**Purpose**: Homepage with hero section and feature overview
**Code Written**:

- Hero section with call-to-action buttons
- Feature showcase cards (Refer Friends, Track Earnings, Secure & Reliable)
- Responsive grid layout
- Navigation integration
- Smooth animations (fade-in, slide-in)

#### **app/register/page.tsx** - User Registration

**Purpose**: User signup with referral code support
**Code Written**:

- Multi-step form validation
- Referral code detection from URL params
- Real-time error handling
- Password confirmation validation
- API integration preparation
- Success/error state management

#### **app/login/page.tsx** - User Authentication

**Purpose**: User login with form validation
**Code Written**:

- Email/password authentication form
- Form validation with error states
- Remember me functionality
- Forgot password link
- Registration success message display
- API integration preparation

#### **app/dashboard/page.tsx** - User Dashboard

**Purpose**: Main user interface with stats and referral management
**Code Written**:

- Statistics cards (Total Referrals, Successful Referrals, Earnings)
- Referral link generation and copy functionality
- Recent referrals list
- Quick action buttons (Social sharing, Email invites, QR code)
- Mock data integration
- Responsive grid layouts

#### **app/purchases/page.tsx** - Purchase Simulation

**Purpose**: Mock purchase system for testing referrals
**Code Written**:

- Purchase statistics display
- Mock product cards (Premium Plan, Add-on Feature, Storage Upgrade)
- Purchase simulation logic
- Purchase history display
- Status badges and formatting
- API integration preparation

#### **app/globals.css** - Global Styles

**Purpose**: Tailwind CSS configuration and custom styles
**Code Written**:

- Tailwind CSS imports
- CSS custom properties for theming (light/dark mode)
- Custom animations (fadeIn, slideIn)
- Base styles for consistent theming
- Dark mode class definitions

---

### 🧩 **components/** - Reusable UI Components

#### **components/Button.tsx** - Generic Button Component

**Purpose**: Reusable button with multiple variants and states
**Code Written**:

- TypeScript interface for props (variant, size, loading, etc.)
- Multiple button variants (primary, secondary, outline, ghost)
- Size variations (sm, md, lg)
- Loading state with spinner animation
- Accessibility features (focus states, disabled states)
- Tailwind CSS class composition

#### **components/Input.tsx** - Form Input Component

**Purpose**: Reusable form input with validation states
**Code Written**:

- Label, error, and helper text support
- Error state styling
- Unique ID generation for accessibility
- TypeScript interface for form props
- Consistent styling with Tailwind CSS

#### **components/StatCard.tsx** - Statistics Display Card

**Purpose**: Dashboard metrics display component
**Code Written**:

- Card layout with title, value, description
- Icon support with proper sizing
- Trend indicators (positive/negative percentages)
- Responsive design
- Consistent card styling

#### **components/CopyButton.tsx** - Clipboard Copy Functionality

**Purpose**: Copy-to-clipboard button with feedback
**Code Written**:

- Clipboard API integration
- Success state with visual feedback
- Auto-reset after 2 seconds
- Error handling for clipboard failures
- Icon switching (copy → checkmark)

#### **components/ThemeToggle.tsx** - Dark/Light Mode Toggle

**Purpose**: Theme switching functionality
**Code Written**:

- Local storage integration for theme persistence
- System preference detection
- DOM manipulation for theme classes
- Icon switching (sun/moon)
- Accessibility labels

#### **components/Loader.tsx** - Loading Spinner

**Purpose**: Reusable loading indicator
**Code Written**:

- SVG-based spinner animation
- Multiple size options
- Smooth rotation animation
- Consistent styling across app

#### **components/Navbar.tsx** - Navigation Bar

**Purpose**: Main navigation with user state
**Code Written**:

- Responsive navigation layout
- User authentication state handling
- Logo and branding
- Navigation links (Dashboard, Purchases)
- User menu with logout functionality
- Mobile-responsive design

---

### 🎣 **hooks/** - Custom React Hooks

#### **hooks/useAuth.ts** - Authentication Management

**Purpose**: Centralized authentication state and logic
**Code Written**:

- User state management (user, token, isAuthenticated, isLoading)
- Login/register/logout functions
- Local storage integration
- API integration with error handling
- User profile refresh functionality
- Router integration for redirects

#### **hooks/useFetch.ts** - API Data Fetching

**Purpose**: Reusable data fetching with loading states
**Code Written**:

- Generic fetch hook with TypeScript generics
- Loading, error, and success state management
- Immediate execution option
- Success/error callback support
- Authenticated fetch variants
- API method helpers (GET, POST, PUT, DELETE)

---

### 🗄️ **store/** - State Management

#### **store/userStore.ts** - User State Store (Zustand)

**Purpose**: Global user state management
**Code Written**:

- User interface definition
- Zustand store with persistence
- User state actions (setUser, setToken, clearAuth, updateUser)
- Local storage integration
- TypeScript type safety

---

### 🛠️ **utils/** - Utility Functions

#### **utils/fetcher.ts** - HTTP Client

**Purpose**: Centralized API communication
**Code Written**:

- Fetcher class with base URL configuration
- Request/response handling
- Authentication token management
- Error handling and logging
- HTTP method implementations (GET, POST, PUT, DELETE)
- Authenticated fetch helper

#### **utils/constants.ts** - Application Constants

**Purpose**: Centralized configuration and constants
**Code Written**:

- API endpoints configuration
- App configuration (name, description)
- Referral system constants
- Route definitions
- Local storage keys
- Environment variable defaults

#### **utils/formatter.ts** - Data Formatting Utilities

**Purpose**: Data formatting and validation helpers
**Code Written**:

- Currency formatting with Intl.NumberFormat
- Date/time formatting functions
- Relative time formatting ("2 days ago")
- Number and percentage formatting
- Text utilities (truncate, capitalize)
- Email validation
- Referral code generation and formatting

---

### 📝 **types/** - TypeScript Definitions

#### **types/index.d.ts** - Global Type Definitions

**Purpose**: Shared TypeScript interfaces and types
**Code Written**:

- Global window interface extensions
- Utility types (Optional, RequiredBy)
- API response interfaces
- Form state types
- Theme types
- Component prop interfaces
- Navigation and modal types
- Loading state definitions

#### **types/api.ts** - API-Specific Types

**Purpose**: API request/response type definitions
**Code Written**:

- User and UserProfile interfaces
- Authentication types (LoginRequest, RegisterRequest, AuthResponse)
- Referral system types (Referral, ReferralStats, ReferralLink)
- Purchase types (Purchase, CreatePurchaseRequest)
- Notification types
- Dashboard data types
- Error handling types
- Pagination and filter types

---

### 🎨 **public/** - Static Assets

#### **public/logo.svg** - Application Logo

**Purpose**: Brand identity and visual recognition
**Code Written**:

- SVG logo with "R" initial
- Blue color scheme (#3B82F6)
- Rounded rectangle design
- Scalable vector format

#### **public/favicon.ico** - Browser Icon

**Purpose**: Browser tab and bookmark icon
**Code Written**:

- Placeholder favicon file
- Browser compatibility

---

### ⚙️ **Configuration Files**

#### **package.json** - Dependencies & Scripts

**Purpose**: Project dependencies and npm scripts
**Code Written**:

- Next.js 14 and React 18 dependencies
- Tailwind CSS and PostCSS configuration
- TypeScript and ESLint setup
- Zustand for state management
- Development and build scripts

#### **tailwind.config.js** - Tailwind CSS Configuration

**Purpose**: Tailwind CSS customization and theme setup
**Code Written**:

- Content paths for file scanning
- Custom color palette with CSS variables
- Border radius configuration
- Dark mode class strategy
- Extended theme properties

#### **postcss.config.js** - PostCSS Configuration

**Purpose**: CSS processing pipeline
**Code Written**:

- Tailwind CSS plugin
- Autoprefixer for browser compatibility

#### **tsconfig.json** - TypeScript Configuration

**Purpose**: TypeScript compiler settings
**Code Written**:

- Strict type checking enabled
- Path mapping for clean imports (@/components, @/utils, etc.)
- Next.js specific configurations
- ES modules and JSX settings

#### **next.config.js** - Next.js Configuration

**Purpose**: Next.js build and runtime settings
**Code Written**:

- App directory configuration
- Image domain configuration
- Environment variable handling

#### **.eslintrc.json** - ESLint Configuration

**Purpose**: Code linting and quality rules
**Code Written**:

- Next.js recommended ESLint rules
- Code quality enforcement

---

## 🏗️ **Architecture Patterns Used**

### **1. Component-Based Architecture**

- Reusable, composable UI components
- Props-based configuration
- Consistent styling with Tailwind CSS

### **2. Custom Hooks Pattern**

- Logic separation from UI components
- Reusable stateful logic
- API integration abstraction

### **3. State Management (Zustand)**

- Global state for user authentication
- Persistent storage integration
- Type-safe state updates

### **4. Utility-First Styling (Tailwind CSS)**

- Consistent design system
- Responsive design patterns
- Dark/light theme support

### **5. TypeScript Integration**

- Type safety throughout the application
- Interface definitions for all data structures
- Generic types for reusable components

### **6. API Abstraction Layer**

- Centralized HTTP client
- Error handling and logging
- Authentication token management

---

## 🚀 **Key Features Implemented**

### **Authentication System**

- Login/Register forms with validation
- JWT token management
- Protected routes
- User state persistence

### **Referral System**

- Referral code generation and sharing
- Statistics tracking
- Copy-to-clipboard functionality
- Mock purchase simulation

### **Responsive Design**

- Mobile-first approach
- Breakpoint-based layouts
- Touch-friendly interactions

### **Theme System**

- Dark/light mode toggle
- CSS custom properties
- Persistent theme preferences

### **Form Management**

- Real-time validation
- Error state handling
- Loading states
- Success feedback

---

## 📊 **Code Statistics**

- **Total Files**: 25+ files
- **Lines of Code**: ~2,500+ lines
- **Components**: 7 reusable components
- **Hooks**: 2 custom hooks
- **Pages**: 5 main pages
- **Types**: 20+ TypeScript interfaces
- **Utilities**: 15+ helper functions

---

## 🔧 **Development Setup**

1. **Install Dependencies**: `npm install`
2. **Start Development Server**: `npm run dev`
3. **Build for Production**: `npm run build`
4. **Run Linting**: `npm run lint`

---

## 📱 **Browser Support**

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile responsive design
- Progressive enhancement
- Accessibility features (ARIA labels, keyboard navigation)

---

_This documentation provides a comprehensive overview of the project structure and the specific code written in each file. The architecture follows modern React/Next.js best practices with TypeScript, Tailwind CSS, and a clean separation of concerns._
