import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  Box,
} from '@mui/material';
import {
  Home,
  Person,
  Search,
  Casino,
  MoreHoriz,
} from '@mui/icons-material';
import { useStore } from '../store/useStore';

const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useStore();
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    
    switch (newValue) {
      case 0: // Home
        navigate('/');
        break;
      case 1: // Profile
        if (isAuthenticated) {
          navigate('/my-profile');
        } else {
          navigate('/login');
        }
        break;
      case 2: // Search
        navigate('/results');
        break;
      case 3: // Games
        if (isAuthenticated) {
          navigate('/lottery-game');
        } else {
          navigate('/login');
        }
        break;
      case 4: // More
        navigate('/more');
        break;
      default:
        navigate('/');
    }
  };

  // Set active tab based on current location
  React.useEffect(() => {
    const path = location.pathname;
    if (path === '/') {
      setValue(0);
    } else if (path === '/my-profile' || path === '/profile') {
      setValue(1);
    } else if (path === '/results') {
      setValue(2);
    } else if (path === '/lottery-game') {
      setValue(3);
    } else if (path === '/more' || path === '/about' || path === '/contact' || path === '/help') {
      setValue(4);
    }
  }, [location.pathname]);

  return (
    <Paper 
      sx={{ 
        position: 'fixed', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        zIndex: 1000,
        borderTop: '1px solid',
        borderColor: 'divider',
        width: '100%',
        maxWidth: '100vw',
      }} 
      elevation={3}
    >
      <BottomNavigation
        value={value}
        onChange={handleChange}
        showLabels
        sx={{
          '& .MuiBottomNavigationAction-root': {
            minWidth: 'auto',
            padding: '6px 12px 8px',
          },
          '& .MuiBottomNavigationAction-label': {
            fontSize: '0.75rem',
          },
        }}
      >
        <BottomNavigationAction
          label="Home"
          icon={<Home />}
        />
        <BottomNavigationAction
          label="Profile"
          icon={<Person />}
        />
        <BottomNavigationAction
          label="Search"
          icon={<Search />}
        />
        <BottomNavigationAction
          label="Games"
          icon={<Casino />}
        />
        <BottomNavigationAction
          label="More"
          icon={<MoreHoriz />}
        />
      </BottomNavigation>
    </Paper>
  );
};

export default BottomNav; 