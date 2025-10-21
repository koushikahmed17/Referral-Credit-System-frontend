# Referral App Frontend

A modern referral system built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- 🔐 **Authentication**: Login/Register with referral code support
- 📊 **Dashboard**: Track referral performance and earnings
- 🛒 **Purchase Simulation**: Test referral system with mock purchases
- 🎨 **Modern UI**: Beautiful, responsive design with dark/light mode
- 📱 **Mobile First**: Optimized for all device sizes
- ⚡ **Fast**: Built with Next.js 14 App Router for optimal performance

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **HTTP Client**: Fetch API with custom wrapper
- **Icons**: Heroicons (SVG)
- **Font**: Inter (Google Fonts)

## Project Structure

```
frontend/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with theme
│   ├── page.tsx           # Landing page
│   ├── register/          # Registration page
│   ├── login/             # Login page
│   ├── dashboard/         # User dashboard
│   └── purchases/         # Purchase simulation
├── components/            # Reusable UI components
│   ├── Button.tsx         # Custom button component
│   ├── Input.tsx          # Form input component
│   ├── StatCard.tsx       # Statistics display card
│   ├── CopyButton.tsx     # Copy to clipboard button
│   ├── ThemeToggle.tsx    # Dark/light mode toggle
│   ├── Loader.tsx         # Loading spinner
│   └── Navbar.tsx         # Navigation component
├── hooks/                 # Custom React hooks
│   ├── useAuth.ts         # Authentication logic
│   └── useFetch.ts        # API fetch wrapper
├── store/                 # Zustand state management
│   └── userStore.ts       # User state store
├── utils/                 # Utility functions
│   ├── fetcher.ts         # HTTP client
│   ├── constants.ts       # App constants
│   └── formatter.ts       # Data formatting helpers
├── types/                 # TypeScript type definitions
│   ├── index.d.ts         # Global types
│   └── api.ts             # API types
└── public/                # Static assets
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd referral-code/frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**

   ```bash
   cp env.example .env.local
   ```

   Edit `.env.local` with your configuration:

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   NEXT_PUBLIC_APP_NAME=ReferralApp
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Features Overview

### Authentication

- User registration with optional referral code
- Secure login/logout
- Protected routes
- Token-based authentication

### Dashboard

- Referral statistics overview
- Earnings tracking
- Recent referrals list
- Quick actions for sharing

### Purchase Simulation

- Mock purchase functionality
- Purchase history tracking
- Integration with referral system

### UI Components

- Responsive design
- Dark/light theme support
- Loading states
- Error handling
- Form validation

## API Integration

The frontend is designed to work with a backend API. Update the `NEXT_PUBLIC_API_URL` environment variable to point to your backend server.

### Expected API Endpoints

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/user/profile` - Get user profile
- `GET /api/referral/stats` - Get referral statistics
- `POST /api/purchase/create` - Create purchase
- `GET /api/purchase/history` - Get purchase history

## Customization

### Theming

The app uses CSS custom properties for theming. You can customize colors in `app/globals.css`:

```css
:root {
  --primary: 222.2 47.4% 11.2%;
  --secondary: 210 40% 96%;
  /* ... other color variables */
}
```

### Components

All components are built with Tailwind CSS and can be easily customized by modifying the className props or extending the component styles.

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

The app can be deployed to any platform that supports Node.js:

- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

If you have any questions or need help, please open an issue in the repository.
