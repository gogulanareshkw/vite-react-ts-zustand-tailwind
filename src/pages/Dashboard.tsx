import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Button,
  Avatar,
  Chip,
  IconButton,
  AppBar,
  Toolbar,
  Drawer,
} from '@mui/material';
import {
  AccountBalance,
  History,
  EmojiEvents,
  Settings,
  Logout,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { useStore } from '../store/useStore';
import UserNav from '../components/UserNav';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { 
    user, 
    isAuthenticated, 
    logout, 
    addNotification,
    getUserBalance,
    getUserReferralCount,
    getUserDisplayName
  } = useStore();
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    addNotification({
      message: 'Logged out successfully',
      type: 'success',
    });
    navigate('/');
  };

  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" textAlign="center">
          Loading dashboard...
        </Typography>
      </Container>
    );
  }

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
              Dashboard
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

        {/* Dashboard Content */}
        <Container maxWidth="lg" sx={{ py: 4, flexGrow: 1 }}>
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
              Welcome back, {getUserDisplayName()}!
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Your WahLotto Dashboard
            </Typography>
          </Box>

          {/* User Info Card */}
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ width: 64, height: 64, bgcolor: 'primary.main' }}>
                  {user.firstName ? user.firstName[0].toUpperCase() : user.email[0].toUpperCase()}
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h5" gutterBottom>
                    {getUserDisplayName()}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" gutterBottom>
                    User ID: {user.appId || user.userId}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip 
                      label={user.isEmailVerified ? 'Email Verified' : 'Email Not Verified'} 
                      color={user.isEmailVerified ? 'success' : 'warning'} 
                      size="small" 
                    />
                    <Chip 
                      label={`Balance: ₹${getUserBalance().toFixed(2)}`} 
                      color="primary" 
                      size="small" 
                    />
                    <Chip 
                      label={`Referrals: ${getUserReferralCount()}`} 
                      color="secondary" 
                      size="small" 
                    />
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3, mb: 4 }}>
            <Card sx={{ height: '100%', cursor: 'pointer' }} onClick={() => navigate('/lottery-game')}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <EmojiEvents sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Play Lottery
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Buy tickets and play games
                </Typography>
              </CardContent>
            </Card>

            <Card sx={{ height: '100%', cursor: 'pointer' }} onClick={() => navigate('/recharge')}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <AccountBalance sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Recharge
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Add money to your wallet
                </Typography>
              </CardContent>
            </Card>

            <Card sx={{ height: '100%', cursor: 'pointer' }} onClick={() => navigate('/lottery-history')}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <History sx={{ fontSize: 48, color: 'info.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Game History
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  View your game history
                </Typography>
              </CardContent>
            </Card>

            <Card sx={{ height: '100%', cursor: 'pointer' }} onClick={() => navigate('/profile')}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Settings sx={{ fontSize: 48, color: 'warning.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Profile
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Manage your profile
                </Typography>
              </CardContent>
            </Card>
          </Box>

          {/* Recent Activity */}
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Recent Activity
              </Typography>
              <Typography variant="body2" color="text.secondary">
                No recent activity to display.
              </Typography>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </Box>
  );
};

export default Dashboard; 