import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
} from '@mui/material';
import {
  Logout,
} from '@mui/icons-material';
import { useStore } from '../store/useStore';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: 'primary.main' }}>
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          WahLotto
        </Typography>
        
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
