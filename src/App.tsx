import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import { theme } from './theme';
import { useStore } from './store/useStore';
import Header from './components/Header';
import Footer from './components/Footer';
import Notification from './components/Notification';
import AppRoutes from './routes';
import type { User } from './types';

function App() {
  const { setUser, setToken, setAuthenticated } = useStore();

  // Initialize app state from localStorage
  useEffect(() => {
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
  }, [setUser, setToken, setAuthenticated]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
          }}
        >
          <Header />
          <Box component="main" sx={{ flexGrow: 1 }}>
            <AppRoutes />
          </Box>
          <Footer />
          <Notification />
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
