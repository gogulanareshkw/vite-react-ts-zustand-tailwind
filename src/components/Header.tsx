import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
} from '@mui/material';
import {
  Logout,
  Refresh,
  AccountBalanceWallet,
} from '@mui/icons-material';
import { useStore } from '../store/useStore';
import apiService from '../services/api';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, setUser, logout, addNotification } = useStore();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshBalance = async () => {
    if (!user?._id) {
      addNotification({
        message: 'User not found. Cannot refresh balance.',
        type: 'error',
      });
      return;
    }
    setIsRefreshing(true);
    try {
      const response = await apiService.getUserInfo(user._id);
      setUser(response.userInfo);
      addNotification({
        message: 'Account balance refreshed successfully!',
        type: 'success',
      });
    } catch (error) {
      // Error is handled by the api service interceptor
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: 'primary.main', width: '100%', minWidth: '100%' }}>
      <Toolbar sx={{ width: '100%', minWidth: '100%', px: { xs: 1, sm: 2 } }}>
        <Typography
          variant="h6"
          component="div"
          sx={{ cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          WahLotto
        </Typography>

        {/* Account Balance */}
        {isAuthenticated && user && (
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
            <AccountBalanceWallet />
            <Typography variant="h6">
              ₹{user.availableAmount?.toFixed(2) || '0.00'}
            </Typography>
            <IconButton onClick={handleRefreshBalance} color="inherit" disabled={isRefreshing}>
              <Refresh />
            </IconButton>
          </Box>
        )}
        
        {/* User Menu */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {isAuthenticated ? (
            <Button
              color="inherit"
              startIcon={<Logout />}
              onClick={handleLogout}
            >
              Logout
            </Button>
          ) : (
            <>
              <Button
                color="inherit"
                onClick={() => navigate('/login')}
              >
                Sign In
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => navigate('/signup')}
              >
                Sign Up
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header; 
