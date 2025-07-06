import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Avatar,
  Chip,
} from '@mui/material';
import {
  AccountBalance,
  History,
  EmojiEvents,
  Settings,
} from '@mui/icons-material';
import { useStore } from '../store/useStore';
import UserLayout from '../components/UserLayout';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { 
    user, 
    isAuthenticated, 
    getUserBalance,
    getUserReferralCount,
    getUserDisplayName
  } = useStore();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

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
    <UserLayout title="Dashboard">
      <Container maxWidth="lg" sx={{ py: 4 }}>
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
    </UserLayout>
  );
};

export default Dashboard; 