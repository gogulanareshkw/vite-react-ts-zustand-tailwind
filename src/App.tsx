import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
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
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

const App: React.FC = () => {
  const { isAuthenticated, user, setUser, setToken, setAuthenticated, addNotification } = useStore();

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
        const user: User = JSON.parse(userStr);
        setUser(user);
        setToken(token);
        setAuthenticated(true);
      } catch (error) {
        console.error('Failed to parse user data from localStorage:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, [setUser, setToken, setAuthenticated, addNotification]);



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
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          {/* Header - show for all pages */}
          <Header />
          
          <Box component="main" sx={{ flexGrow: 1, pb: { xs: 12, sm: 11 } }}>
            <AppRoutes />
          </Box>
          
          {/* Footer - show for all pages */}
          <Footer />
          
          {/* Bottom Navigation - show for all pages */}
          <BottomNav />
        </Box>
        
        <Notification />
      </Router>
    </ThemeProvider>
  );
};

export default App;
