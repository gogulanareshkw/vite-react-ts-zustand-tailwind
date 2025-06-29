import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Divider,
  Chip,
} from '@mui/material';
import {
  Menu,
  Dashboard,
  People,
  Settings,
  Receipt,
  Casino,
  Security,
  Notifications,
  Logout,
  Home,
  LocalOffer,
} from '@mui/icons-material';
import { useStore } from '../store/useStore';

const AdminNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useStore();
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const adminMenuItems = [
    {
      title: 'Dashboard',
      path: '/admin/dashboard',
      icon: <Dashboard />,
    },
    {
      title: 'Users Management',
      path: '/admin/users',
      icon: <People />,
    },
    {
      title: 'Offers Management',
      path: '/admin/offers',
      icon: <LocalOffer />,
    },
    {
      title: 'Game Settings',
      path: '/admin/game-settings',
      icon: <Casino />,
    },
    {
      title: 'Transactions',
      path: '/admin/transactions',
      icon: <Receipt />,
    },
    {
      title: 'System Settings',
      path: '/admin/system-settings',
      icon: <Settings />,
    },
    {
      title: 'Security',
      path: '/admin/security',
      icon: <Security />,
    },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: 'primary.main' }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => setDrawerOpen(true)}
            sx={{ mr: 2 }}
          >
            <Menu />
          </IconButton>
          
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            WahLotto Admin Panel
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Chip
              label={`${user?.firstName} ${user?.lastName}`}
              color="secondary"
              size="small"
            />
            <Button
              color="inherit"
              startIcon={<Home />}
              onClick={() => navigate('/dashboard')}
            >
              User View
            </Button>
            <Button
              color="inherit"
              startIcon={<Logout />}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: 280,
            boxSizing: 'border-box',
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
            Admin Menu
          </Typography>
        </Box>
        
        <Divider />
        
        <List>
          {adminMenuItems.map((item) => (
            <ListItem key={item.path} disablePadding>
              <ListItemButton
                onClick={() => {
                  navigate(item.path);
                  setDrawerOpen(false);
                }}
                sx={{
                  backgroundColor: isActive(item.path) ? 'primary.light' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'primary.light',
                  },
                }}
              >
                <ListItemIcon sx={{ color: isActive(item.path) ? 'primary.main' : 'inherit' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.title}
                  sx={{
                    '& .MuiListItemText-primary': {
                      fontWeight: isActive(item.path) ? 'bold' : 'normal',
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        
        <Divider />
        
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate('/dashboard')}>
              <ListItemIcon>
                <Home />
              </ListItemIcon>
              <ListItemText primary="Back to User View" />
            </ListItemButton>
          </ListItem>
          
          <ListItem disablePadding>
            <ListItemButton onClick={handleLogout}>
              <ListItemIcon>
                <Logout />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
    </>
  );
};

export default AdminNav; 