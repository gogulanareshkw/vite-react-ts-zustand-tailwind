import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  Chip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountCircle,
  Dashboard,
  Logout,
  Home,
  EmojiEvents,
  Assessment,
  Help,
  Info,
  ContactSupport,
  Support,
} from '@mui/icons-material';
import { useStore } from '../store/useStore';
import { getPublicNavigation, getUserRoleDisplayName, getUserRoleColor, ICON_MAP } from '../config/navigation';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout } = useStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);

  const publicNavItems = getPublicNavigation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    setUserMenuAnchor(null);
  };

  const isActive = (path: string) => location.pathname === path;

  const renderIcon = (iconName: string) => {
    const IconComponent = ICON_MAP[iconName as keyof typeof ICON_MAP];
    return IconComponent ? <IconComponent /> : <Home />;
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        WahLotto
      </Typography>
      <Divider />
      <List>
        {publicNavItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              sx={{
                textAlign: 'center',
                backgroundColor: isActive(item.path) ? 'primary.light' : 'transparent',
                '&:hover': {
                  backgroundColor: 'primary.light',
                },
              }}
              onClick={() => navigate(item.path)}
            >
              <ListItemIcon sx={{ color: isActive(item.path) ? 'primary.main' : 'inherit' }}>
                {renderIcon(item.icon)}
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
        
        {/* Development-only test notifications link */}
        {process.env.NODE_ENV === 'development' && (
          <ListItem disablePadding>
            <ListItemButton
              sx={{
                textAlign: 'center',
                backgroundColor: isActive('/test-notifications') ? 'primary.light' : 'transparent',
                '&:hover': {
                  backgroundColor: 'primary.light',
                },
              }}
              onClick={() => navigate('/test-notifications')}
            >
              <ListItemIcon sx={{ color: isActive('/test-notifications') ? 'primary.main' : 'inherit' }}>
                <Support />
              </ListItemIcon>
              <ListItemText 
                primary="Test Notifications"
                sx={{
                  '& .MuiListItemText-primary': {
                    fontWeight: isActive('/test-notifications') ? 'bold' : 'normal',
                  },
                }}
              />
            </ListItemButton>
          </ListItem>
        )}
        
        {isAuthenticated && (
          <>
            <Divider />
            <ListItem disablePadding>
              <ListItemButton onClick={() => navigate('/dashboard')}>
                <ListItemIcon>
                  <Dashboard />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={() => navigate('/profile')}>
                <ListItemIcon>
                  <AccountCircle />
                </ListItemIcon>
                <ListItemText primary="Profile" />
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
          </>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: 'primary.main' }}>
        {/* Only show mobile menu button for non-authenticated users */}
        {!isAuthenticated && (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
        )}
        
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          WahLotto
        </Typography>
        
        {/* Desktop Navigation */}
        <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 1 }}>
          {publicNavItems.map((item) => (
            <Button
              key={item.path}
              color="inherit"
              onClick={() => navigate(item.path)}
              sx={{
                backgroundColor: isActive(item.path) ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              {item.title}
            </Button>
          ))}
          
          {/* Development-only test notifications link */}
          {process.env.NODE_ENV === 'development' && (
            <Button
              color="inherit"
              onClick={() => navigate('/test-notifications')}
              sx={{
                backgroundColor: isActive('/test-notifications') ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              Test Notifications
            </Button>
          )}
        </Box>
        
        {/* User Menu */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: 2 }}>
          {isAuthenticated ? (
            <>
              <Chip
                label={getUserRoleDisplayName(user?.userRole || 3)}
                color={getUserRoleColor(user?.userRole || 3) as any}
                size="small"
              />
              <IconButton
                color="inherit"
                onClick={(e) => setUserMenuAnchor(e.currentTarget)}
              >
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                  {user?.firstName?.charAt(0) || 'U'}
                </Avatar>
              </IconButton>
            </>
          ) : (
            <>
              <Button
                color="inherit"
                onClick={() => navigate('/login')}
                sx={{ display: { xs: 'none', sm: 'block' } }}
              >
                Login
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => navigate('/signup')}
                sx={{ display: { xs: 'none', sm: 'block' } }}
              >
                Sign Up
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                onClick={() => navigate('/agent-registration')}
                sx={{ display: { xs: 'none', sm: 'block' } }}
              >
                Agent Signup
              </Button>
            </>
          )}
        </Box>
      </AppBar>

      {/* User Menu Dropdown */}
      <Menu
        anchorEl={userMenuAnchor}
        open={Boolean(userMenuAnchor)}
        onClose={() => setUserMenuAnchor(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={() => {
          navigate('/dashboard');
          setUserMenuAnchor(null);
        }}>
          <ListItemIcon>
            <Dashboard fontSize="small" />
          </ListItemIcon>
          Dashboard
        </MenuItem>
        <MenuItem onClick={() => {
          navigate('/profile');
          setUserMenuAnchor(null);
        }}>
          <ListItemIcon>
            <AccountCircle fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>

      {/* Only show mobile drawer for non-authenticated users */}
      {!isAuthenticated && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
          }}
        >
          {drawer}
        </Drawer>
      )}
    </>
  );
};

export default Header; 