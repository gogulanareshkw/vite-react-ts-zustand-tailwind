import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
} from '@mui/material';
import {
  Logout,
} from '@mui/icons-material';
import { useStore } from '../store/useStore';

interface UserLayoutProps {
  children: React.ReactNode;
  title?: string;
}

const UserLayout: React.FC<UserLayoutProps> = ({ children, title = 'My Profile' }) => {
  const navigate = useNavigate();
  const { logout, addNotification } = useStore();

  const handleLogout = () => {
    logout();
    addNotification({
      message: 'Logged out successfully',
      type: 'success',
    });
    navigate('/');
  };

  return (
    <Box sx={{ p: 2 }}>
      {/* Page Title and Logout Button */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>
          {title}
        </h1>
        <Button
          variant="outlined"
          startIcon={<Logout />}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Box>

      {/* Page Content */}
      {children}
    </Box>
  );
};

export default UserLayout; 
