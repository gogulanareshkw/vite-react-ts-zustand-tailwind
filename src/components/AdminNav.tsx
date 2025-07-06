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
  Avatar,
  Menu,
  MenuItem,
  ListSubheader,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home,
  Logout,
  AccountCircle,
  AdminPanelSettings,
} from '@mui/icons-material';
import { useStore } from '../store/useStore';
import { 
  getNavigationItems, 
  getUserRoleDisplayName, 
  getUserRoleColor,
  ICON_MAP,
  USER_ROLES 
} from '../config/navigation';

const AdminNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useStore();
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = React.useState<null | HTMLElement>(null);

  // Get navigation items based on user role
  const navigationItems = user ? getNavigationItems(user.userRole) : [];
  
  // Group navigation items by category
  const groupedItems = navigationItems.reduce((groups, item) => {
    const category = getCategoryFromPath(item.path);
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(item);
    return groups;
  }, {} as Record<string, typeof navigationItems>);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setUserMenuAnchor(null);
  };

  const isActive = (path: string) => location.pathname === path;

  const getCategoryFromPath = (path: string) => {
    if (path.includes('dashboard') || path.includes('analytics') || path.includes('monitor')) {
      return 'Dashboard & Overview';
    } else if (path.includes('users') || path.includes('agents') || path.includes('support')) {
      return 'User Management';
    } else if (path.includes('transaction') || path.includes('bank') || path.includes('recharge') || path.includes('withdrawal') || path.includes('financial')) {
      return 'Financial Management';
    } else if (path.includes('lottery') || path.includes('game') || path.includes('casino')) {
      return 'Game Management';
    } else if (path.includes('offers') || path.includes('media') || path.includes('feedback')) {
      return 'Content Management';
    } else if (path.includes('logs') || path.includes('database') || path.includes('system') || path.includes('backup') || path.includes('api') || path.includes('security') || path.includes('audit')) {
      return 'System Management';
    } else if (path.includes('admin-management')) {
      return 'Admin Management';
    }
    return 'Other';
  };

  const renderIcon = (iconName: string) => {
    const IconComponent = ICON_MAP[iconName as keyof typeof ICON_MAP];
    return IconComponent ? <IconComponent /> : <AccountCircle />;
  };

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
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            WahLotto Admin Panel
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Chip
              label={getUserRoleDisplayName(user?.userRole || 3)}
              color={getUserRoleColor(user?.userRole || 3) as any}
              size="small"
            />
            
            <Button
              color="inherit"
              startIcon={<Home />}
              onClick={() => navigate('/dashboard')}
            >
              User View
            </Button>
            
            <IconButton
              color="inherit"
              onClick={(e) => setUserMenuAnchor(e.currentTarget)}
            >
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                {user?.firstName?.charAt(0) || 'U'}
              </Avatar>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* User Menu */}
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
          navigate('/profile');
          setUserMenuAnchor(null);
        }}>
          <ListItemIcon>
            <AccountCircle fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={() => {
          navigate('/dashboard');
          setUserMenuAnchor(null);
        }}>
          <ListItemIcon>
            <Home fontSize="small" />
          </ListItemIcon>
          User Dashboard
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: 320,
            boxSizing: 'border-box',
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
            Admin Menu
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {getUserRoleDisplayName(user?.userRole || 3)}
          </Typography>
        </Box>
        
        <Divider />
        
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
          {Object.entries(groupedItems).map(([category, items]) => (
            <React.Fragment key={category}>
              <ListSubheader sx={{ 
                backgroundColor: 'primary.light', 
                color: 'primary.contrastText',
                fontWeight: 'bold'
              }}>
                {category}
              </ListSubheader>
              {items.map((item) => (
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
                      pl: 3,
                    }}
                  >
                    <ListItemIcon sx={{ 
                      color: isActive(item.path) ? 'primary.main' : 'inherit',
                      minWidth: 40
                    }}>
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
            </React.Fragment>
          ))}
        </List>
        
        <Divider />
        
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={() => {
              navigate('/dashboard');
              setDrawerOpen(false);
            }}>
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