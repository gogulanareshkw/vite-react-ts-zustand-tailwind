# WahLotto - Modern Lottery Application

A modern lottery application built with Vite, React, TypeScript, Zustand, and Tailwind CSS, integrated with a Node.js backend.

## Features

### ✅ Completed
- **Authentication System**
  - Login with email/password
  - Session persistence with localStorage
  - Automatic token management
  - User role-based redirects
  - Modern UI with Material-UI and Tailwind CSS

- **State Management**
  - Zustand store with persistence
  - Centralized API service layer
  - Type-safe TypeScript interfaces
  - Global notification system

- **API Integration**
  - Complete API service layer
  - Error handling and validation
  - Automatic token injection
  - Response interceptors

### 🚧 In Progress
- User registration
- Email verification
- Password reset
- Lottery game interface
- Wallet management
- Game history

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Running Node.js backend server (port 3001)

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

## API Integration

### Authentication Flow
1. User enters email/password
2. API call to `/user/public/login` with app key
3. On success:
   - Store token and user data in localStorage
   - Update Zustand store
   - Redirect based on user verification status
4. On error:
   - Display error notification
   - Show validation errors

### Key Components

#### Login Page (`/src/pages/Login.tsx`)
- Modern Material-UI design
- Form validation
- API integration with error handling
- Automatic redirects based on user status

#### API Service (`/src/services/api.ts`)
- Centralized API calls
- Automatic token management
- Error handling utilities
- Type-safe responses

#### Store (`/src/store/useStore.ts`)
- Zustand with persistence
- User authentication state
- Global notifications
- Loading states

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Notification.tsx # Global notification system
│   └── ...
├── pages/              # Page components
│   ├── Login.tsx       # Login page with API integration
│   ├── Dashboard.tsx   # User dashboard
│   └── ...
├── services/           # API and external services
│   └── api.ts         # Centralized API service
├── store/             # State management
│   └── useStore.ts    # Zustand store
├── types/             # TypeScript type definitions
│   └── index.ts       # All application types
├── config/            # Configuration
│   └── constants.ts   # API URLs, constants
└── App.tsx            # Main app component
```

## API Endpoints

### Authentication
- `POST /user/public/login` - User login
- `POST /user/public/create` - User registration
- `POST /user/public/createAgent` - Agent registration
- `POST /user/verifyEmailOtp` - Email verification
- `POST /user/public/forgotPassword` - Forgot password
- `POST /user/public/resetPassword` - Reset password

### User Management
- `GET /user/getUserInfo` - Get user information
- `PUT /user/updateProfile` - Update user profile
- `POST /user/changePassword` - Change password

### Game Settings
- `GET /gameSettings/getBasicGameSettings` - Get basic settings
- `GET /lotteryGameSetting/getAllLotteryGameSettings` - Get game settings
- `GET /lotteryGamePermission/getAllLotteryGamePermissions` - Get permissions
- `GET /lotteryGameBoard/getAllLotteryGameBoards` - Get game boards

## Environment Configuration

Update `src/config/constants.ts` for your environment:

```typescript
export const API_URL = 'http://localhost:3001/api'; // Your backend URL
export const APP_KEY = 'your-app-key'; // Your application key
```

## Development

### Adding New API Endpoints
1. Add the method to `src/services/api.ts`
2. Add corresponding types to `src/types/index.ts`
3. Use in components with proper error handling

### Adding New Pages
1. Create the page component in `src/pages/`
2. Add the route to `src/App.tsx`
3. Update navigation as needed

## Contributing

1. Follow TypeScript best practices
2. Use the existing API service pattern
3. Add proper error handling
4. Update types when adding new features
5. Test with the backend server

## License

This project is part of the WahLotto lottery application.
