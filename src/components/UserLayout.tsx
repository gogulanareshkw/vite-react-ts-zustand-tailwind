import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Logout,
} from '@mui/icons-material';
import { useStore } from '../store/useStore';
import UserNav from './UserNav';

interface UserLayoutProps {
  children: React.ReactNode;
  title?: string;
}

const UserLayout: React.FC<UserLayoutProps> = ({ children, title = 'Dashboard' }) => {
  const navigate = useNavigate();
  const { logout, addNotification } = useStore();
  const [navOpen, setNavOpen] = useState(false);

  const handleLogout = () => {
    logout();
    addNotification({
      message: 'Logged out successfully',
      type: 'success',
    });
    navigate('/');
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* User Navigation Sidebar */}
      <UserNav open={navOpen} onClose={() => setNavOpen(false)} />
      
      {/* Main Content */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Top App Bar */}
        <AppBar position="static" sx={{ backgroundColor: 'primary.main' }}>
          <Toolbar>
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => setNavOpen(true)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              {title}
            </Typography>
            <Button
              color="inherit"
              startIcon={<Logout />}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Toolbar>
        </AppBar>

        {/* Page Content */}
        <Box sx={{ flexGrow: 1 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default UserLayout; 