import React from 'react';
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
  ListItemText,
  useTheme,
  useMediaQuery,
  Avatar,
} from '@mui/material';
import { Menu as MenuIcon, AccountCircle, EmojiEvents, Star, Diamond } from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  const navItems = [
    { text: 'Home', path: '/' },
    { text: 'Prizes', path: '/prizes' },
    { text: 'Results', path: '/results' },
    { text: 'How to Play', path: '/how-to-play' },
    { text: 'About Us', path: '/about' },
    { text: 'Contact Us', path: '/contact' },
    { text: 'Help', path: '/help' },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogin = () => {
    setIsLoggedIn(!isLoggedIn);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', my: 2 }}>
        <Box
          sx={{
            position: 'relative',
            width: 60,
            height: 60,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mr: 2,
            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
          }}
        >
          <EmojiEvents sx={{ fontSize: 28, color: 'white' }} />
          <Star 
            sx={{ 
              position: 'absolute', 
              top: -5, 
              right: -5, 
              fontSize: 16, 
              color: '#FFD700',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
            }} 
          />
        </Box>
        <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
          GulfLotto
        </Typography>
      </Box>
      <List>
        {navItems.map((item) => (
          <ListItem key={item.text} component={Link} to={item.path}>
            <ListItemText 
              primary={item.text} 
              sx={{ 
                color: location.pathname === item.path ? 'primary.main' : 'inherit',
                textAlign: 'center'
              }}
            />
          </ListItem>
        ))}
        <ListItem>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleLogin}
          >
            {isLoggedIn ? 'Logout' : 'Login'}
          </Button>
        </ListItem>
        <ListItem>
          <Button
            variant="outlined"
            color="primary"
            fullWidth
          >
            Sign Up
          </Button>
        </ListItem>
        <ListItem>
          <Button
            variant="outlined"
            color="secondary"
            fullWidth
          >
            Agent SignUp
          </Button>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="static" elevation={0} sx={{ backgroundColor: 'white', color: 'text.primary' }}>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Box
              sx={{
                position: 'relative',
                width: 50,
                height: 50,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2,
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
                  transition: 'all 0.3s ease-in-out',
                },
              }}
            >
              <EmojiEvents sx={{ fontSize: 24, color: 'white' }} />
              <Star 
                sx={{ 
                  position: 'absolute', 
                  top: -3, 
                  right: -3, 
                  fontSize: 14, 
                  color: '#FFD700',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                }} 
              />
            </Box>
            <Typography
              variant="h6"
              component="div"
              sx={{ 
                fontWeight: 'bold', 
                background: 'linear-gradient(45deg, #667eea, #764ba2)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                letterSpacing: '0.5px',
              }}
            >
              GulfLotto
            </Typography>
          </Box>
          
          {isMobile ? (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
          ) : (
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              {navItems.slice(0, 4).map((item) => (
                <Button
                  key={item.text}
                  component={Link}
                  to={item.path}
                  size="small"
                  sx={{
                    color: location.pathname === item.path ? 'primary.main' : 'text.primary',
                    fontWeight: location.pathname === item.path ? 'bold' : 'normal',
                    '&:hover': {
                      backgroundColor: 'rgba(25, 118, 210, 0.04)',
                    },
                  }}
                >
                  {item.text}
                </Button>
              ))}
              
              <Box sx={{ display: 'flex', gap: 1, ml: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={handleLogin}
                  startIcon={<AccountCircle />}
                >
                  {isLoggedIn ? 'Logout' : 'Login'}
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  size="small"
                >
                  Sign Up
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  size="small"
                >
                  Agent SignUp
                </Button>
              </Box>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', lg: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280 },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Header; 