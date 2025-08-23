import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import { useStore } from './store/useStore';
import apiService from './services/api';
import AppRoutes from './routes';
import Header from './components/Header';
import Footer from './components/Footer';
import Notification from './components/Notification';
import BottomNav from './components/BottomNavigation';
import { USER_ROLES } from './config/navigation';
import type { User } from './types';

const theme = createTheme({
  palette: {
    primary: {
      main: '#a78bfa', // Playful purple
      dark: '#7c3aed',
      light: '#ddd6fe',
      contrastText: '#fff',
    },
    secondary: {
      main: '#f472b6', // Playful pink
      dark: '#db2777',
      light: '#fbcfe8',
      contrastText: '#fff',
    },
    accent: {
      main: '#bef264', // Lime accent
      contrastText: '#1e293b',
    },
    success: {
      main: '#4ade80',
    },
    warning: {
      main: '#fde047',
      contrastText: '#1e293b',
    },
    error: {
      main: '#fb7185',
    },
    info: {
      main: '#38bdf8',
    },
    background: {
      default: '#f9fafb',
      paper: '#fff',
    },
    text: {
      primary: '#1e293b',
      secondary: '#64748b',
    },
    divider: '#e5e7eb',
  },
  typography: {
    fontFamily: 'Inter, Roboto, Helvetica, Arial, sans-serif',
    fontSize: 17,
    h1: { fontWeight: 700, fontSize: '2.3rem', lineHeight: 1.2 },
    h2: { fontWeight: 600, fontSize: '2rem', lineHeight: 1.25 },
    h3: { fontWeight: 600, fontSize: '1.6rem', lineHeight: 1.3 },
    h4: { fontWeight: 600, fontSize: '1.3rem', lineHeight: 1.35 },
    h5: { fontWeight: 500, fontSize: '1.1rem', lineHeight: 1.4 },
    h6: { fontWeight: 500, fontSize: '1rem', lineHeight: 1.4 },
    button: { fontWeight: 600, textTransform: 'none' },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          fontWeight: 600,
          textTransform: 'none',
          boxShadow: 'none',
          padding: '8px 18px',
          '&:hover': {
            boxShadow: '0 2px 8px rgba(167,139,250,0.10)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 2px 8px rgba(244,114,182,0.08)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: ({ ownerState }) => ({
          // Remove border radius for AppBar (header)
          borderRadius: ownerState.variant === 'elevation' && ownerState.component === 'header' ? 0 : 16,
        }),
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          fontWeight: 500,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 4px rgba(244,114,182,0.08)',
          borderRadius: 0,
        },
      },
    },
  },
});

const AppContent: React.FC = () => {
  const { isAuthenticated, user, setUser, setToken, setAuthenticated, addNotification } = useStore();
  const location = useLocation();

  useEffect(() => {
    // Set up API service notification callback
    const notificationCallback = (message: string, type: 'success' | 'error' | 'warning' | 'info', duration = 5000) => {
      addNotification({ message, type, duration });
    };
    
    apiService.setNotificationCallback(notificationCallback);

    // Initialize app state from localStorage
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (token && userStr) {
      try {
        const userData = JSON.parse(userStr);
        setUser(userData);
      } catch (error) {
        // Failed to parse user data from localStorage
        localStorage.removeItem('user');
      }
    }
  }, [setUser, setToken, setAuthenticated, addNotification]);

  // Check if footer should be shown (only on Home and More pages)
  const shouldShowFooter = () => {
    const path = location.pathname;
    return path === '/' || path === '/more';
  };



  const isUserRoute = () => {
    const path = window.location.pathname;
    return path.startsWith('/my-profile') || 
           path.startsWith('/profile') || 
           path.startsWith('/recharge') || 
           path.startsWith('/withdraw') || 
           path.startsWith('/lottery') || 
           path.startsWith('/bank-cards') || 
           path.startsWith('/offers') || 
           path.startsWith('/exchange-rates') || 
           path.startsWith('/lottery-history') || 
           path.startsWith('/verify-email') || 
           path.startsWith('/verify-agent') || 
           path.startsWith('/change-password');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%', minWidth: '100%' }}>
      {/* Header - show for all pages */}
      <Header />
      
      <Box component="main" sx={{ flexGrow: 1, pb: shouldShowFooter() ? { xs: 12, sm: 11 } : { xs: 7, sm: 6 } }}>
        <AppRoutes />
      </Box>
      
      {/* Footer - show only on Home and More pages */}
      {shouldShowFooter() && <Footer />}
      
      {/* Bottom Navigation - show for all pages */}
      <BottomNav />
    </Box>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppContent />
        <Notification />
      </Router>
    </ThemeProvider>
  );
};

export default App;
