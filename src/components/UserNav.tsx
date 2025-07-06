import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider,
  Chip,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  ListItemAvatar,
} from '@mui/material';
import {
  Dashboard,
  AccountCircle,
  Logout,
  Menu as MenuIcon,
  Home,
  Wallet,
  Payment,
  Money,
  CreditCard,
  Gamepad,
  History,
  Assessment,
  LocalOffer,
  TrendingUp,
  Security,
  Business,
  People,
  MonetizationOn,
  Assignment,
  Support,
} from '@mui/icons-material';
import { useStore } from '../store/useStore';
import { 
  getNavigationItems, 
  getUserRoleDisplayName, 
  getUserRoleColor,
  ICON_MAP,
  USER_ROLES 
} from '../config/navigation';

interface UserNavProps {
  open: boolean;
  onClose: () => void;
}

const UserNav: React.FC<UserNavProps> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useStore();
  const [userMenuAnchor, setUserMenuAnchor] = React.useState<null | HTMLElement>(null);

  // Helper function to categorize navigation items
  const getCategoryFromPath = (path: string) => {
    if (path.includes('dashboard') || path.includes('profile')) {
      return 'Account';
    } else if (path.includes('wallet') || path.includes('recharge') || path.includes('withdraw') || path.includes('bank-cards')) {
      return 'Financial';
    } else if (path.includes('lottery') || path.includes('game')) {
      return 'Gaming';
    } else if (path.includes('offers') || path.includes('exchange-rates')) {
      return 'Offers & Rates';
    } else if (path.includes('agent') || path.includes('referrals') || path.includes('commission')) {
      return 'Agent Features';
    } else if (path.includes('staff') || path.includes('support') || path.includes('reports')) {
      return 'Staff Features';
    }
    return 'Other';
  };

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
    onClose();
  };

  const isActive = (path: string) => location.pathname === path;

  const renderIcon = (iconName: string) => {
    const IconComponent = ICON_MAP[iconName as keyof typeof ICON_MAP];
    return IconComponent ? <IconComponent /> : <AccountCircle />;
  };

  return (
    <>
      <Drawer
        anchor="left"
        open={open}
        onClose={onClose}
        sx={{
          '& .MuiDrawer-paper': {
            width: 300,
            boxSizing: 'border-box',
          },
        }}
      >
        {/* User Profile Section */}
        <Box sx={{ p: 2, backgroundColor: 'primary.main', color: 'white' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Avatar 
              sx={{ 
                width: 56, 
                height: 56, 
                bgcolor: 'secondary.main',
                fontSize: '1.5rem'
              }}
            >
              {user?.firstName?.charAt(0) || 'U'}
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {user?.firstName} {user?.lastName}
              </Typography>
              <Chip
                label={getUserRoleDisplayName(user?.userRole || 3)}
                color={getUserRoleColor(user?.userRole || 3) as any}
                size="small"
                sx={{ mt: 0.5 }}
              />
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              Balance:
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              ${user?.walletBalance || 0}
            </Typography>
          </Box>
        </Box>
        
        <Divider />
        
        {/* Navigation Menu */}
        <List sx={{ width: '100%', bgcolor: 'background.paper', flexGrow: 1 }}>
          {Object.entries(groupedItems).map(([category, items]) => (
            <React.Fragment key={category}>
              <Box sx={{ 
                px: 2, 
                py: 1, 
                backgroundColor: 'grey.100',
                borderBottom: '1px solid',
                borderColor: 'grey.300'
              }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>
                  {category}
                </Typography>
              </Box>
              {items.map((item) => (
                <ListItem key={item.path} disablePadding>
                  <ListItemButton
                    onClick={() => {
                      navigate(item.path);
                      onClose();
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
        
        {/* Quick Actions */}
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={() => {
              navigate('/');
              onClose();
            }}>
              <ListItemIcon>
                <Home />
              </ListItemIcon>
              <ListItemText primary="Back to Home" />
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

export default UserNav; 