import React, { useEffect, useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Avatar,
  Divider,
  Button,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Grid,
  IconButton,
} from '@mui/material';
import {
  AccountBalanceWallet,
  ReceiptLong,
  AddCard,
  MoneyOff,
  CreditCard,
  GroupAdd,
  History,
  Settings,
  Star,
  ContentCopy,
  Event,
  PersonAdd,
  Fingerprint,
  VerifiedUser,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';

const formatDate = (dateString: string | undefined) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const MyProfile: React.FC = () => {
  const navigate = useNavigate();
  const { 
    user, 
    api, 
    setUser
  } = useStore();
  const [isLoading, setIsLoading] = useState(false);

  // Fetch user info and game settings on component mount
  useEffect(() => {
    if (user?.userId) {
      fetchMyProfileData();
    }
  }, [user?.userId]);

  const fetchMyProfileData = async () => {
    try {
      setIsLoading(true);
      const userId = user?.userId || user?._id;
      if (!userId) return;
      
      const userInfoRes = await api.getUserInfo(userId);

      if (userInfoRes.success && userInfoRes.userInfo) {
        setUser(userInfoRes.userInfo);
      }

    } catch (error: any) {
      // notification.show(error?.response?.data?.message || 'Failed to fetch profile data', 'error');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Loading Indicator */}
      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <CircularProgress size={40} />
        </Box>
      )}
      
      {/* Cover Photo Area */}
      <Box sx={{ 
        position: 'relative', 
        height: { xs: 200, md: 300 }, 
        borderRadius: 3, 
        overflow: 'hidden',
        mb: 8,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        textAlign: 'center'
      }}>
        <Box>
          <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
            Welcome to GulfLotto
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            Your trusted lottery platform
          </Typography>
        </Box>
        

      </Box>

      {/* Profile Picture Overlapping Cover */}
      <Box sx={{ 
        position: 'relative', 
        mt: -12, 
        mb: 4,
        textAlign: 'center'
      }}>
        <Avatar
          sx={{
            width: { xs: 120, md: 150 },
            height: { xs: 120, md: 150 },
            fontSize: { xs: 48, md: 60 },
            mx: 'auto',
            border: '6px solid white',
            boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
            bgcolor: 'primary.main',
          }}
        >
          {user?.firstName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase()}
        </Avatar>
        
        {/* Email below profile picture */}
        <Typography variant="h6" sx={{ mt: 2, mb: 1, color: 'text.secondary' }}>
          {user?.email}
        </Typography>
        
        {/* Phone in brackets */}
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 2 }}>
          {user?.phone ? `(${user.phone})` : ''}
        </Typography>
        

      </Box>

      {/* Unified Middle Section Card */}
      <Card sx={{ mb: 4, boxShadow: 3 }}>
        <CardContent sx={{ p: 4 }}>
          {/* Header */}
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 4, textAlign: 'center', color: 'primary.main' }}>
            Account Overview
          </Typography>
          <Grid container spacing={3} alignItems="stretch" justifyContent="center">
            <Grid item xs={12} sm={6} md={4}>
              <Paper elevation={2} sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%' }}>
                <AccountBalanceWallet color="primary" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{`$${user?.availableAmount?.toFixed(2) || '0.00'}`}</Typography>
                <Typography variant="body2" color="text.secondary">Available Balance</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Paper elevation={2} sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%' }}>
                <GroupAdd color="secondary" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{user?.referralCount || 0}</Typography>
                <Typography variant="body2" color="text.secondary">Referrals</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Paper elevation={2} sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%' }}>
                <Event color="info" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {user?.createdDateTime ? formatDate(user.createdDateTime) : 'N/A'}
                </Typography>
                <Typography variant="body2" color="text.secondary">Joined On</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Paper elevation={2} sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%' }}>
                <Fingerprint color="success" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {user?.appId}
                  <IconButton size="small" onClick={() => navigator.clipboard.writeText(user?.appId || '')} sx={{ ml: 1 }}>
                    <ContentCopy fontSize="small" />
                  </IconButton>
                </Typography>
                <Typography variant="body2" color="text.secondary">App ID</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Paper elevation={2} sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%' }}>
                <PersonAdd color="warning" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{user?.referredBy || 'N/A'}</Typography>
                <Typography variant="body2" color="text.secondary">Referred By</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Paper elevation={2} sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%' }}>
                <VerifiedUser color="action" sx={{ fontSize: 40, mb: 1 }} />
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 1 }}>
                  <Chip label={user?.isEmailVerified ? 'Verified' : 'Not Verified'} color={user?.isEmailVerified ? 'success' : 'warning'} size="small" />
                  <Chip label={user?.activeStatus ? 'Active' : 'Inactive'} color={user?.activeStatus ? 'success' : 'error'} size="small" />
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Status</Typography>
              </Paper>
            </Grid>
          </Grid>
          
          <Divider sx={{ my: 3 }} />
          
          {/* Referral Link Section */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 2, color: 'text.primary' }}>
              Your Referral Link
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2, 
              mb: 3, 
              flexWrap: 'wrap' 
            }}>
              <Typography 
                variant="body1" 
                sx={{ 
                  bgcolor: 'background.paper', 
                  p: 2, 
                  borderRadius: 2, 
                  border: '2px solid',
                  borderColor: 'primary.main',
                  flex: 1, 
                  minWidth: 280,
                  fontFamily: 'monospace',
                  fontSize: '0.9rem'
                }}
              >
                {`localhost/signup?ref=${user?.appId}`}
              </Typography>
              <Button 
                size="medium" 
                variant="contained" 
                onClick={() => navigator.clipboard.writeText(`localhost/signup?ref=${user?.appId}`)}
                sx={{ minWidth: 100 }}
              >
                Copy Link
              </Button>
            </Box>
          </Box>
          
          {/* How it works Section */}
          <Box>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2, color: 'success.main' }}>
              How Referrals Work
            </Typography>
            <List dense>
              <ListItem sx={{ py: 1 }}>
                <ListItemIcon>
                  <Star color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Share your unique referral code with friends and family"
                  primaryTypographyProps={{ variant: 'body2' }}
                />
              </ListItem>
              <ListItem sx={{ py: 1 }}>
                <ListItemIcon>
                  <Star color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Ask your friends to download GulfLotto app or visit the website for signup"
                  primaryTypographyProps={{ variant: 'body2' }}
                />
              </ListItem>
              <ListItem sx={{ py: 1 }}>
                <ListItemIcon>
                  <Star color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Earn exciting rewards when your friends register with GulfLotto"
                  primaryTypographyProps={{ variant: 'body2' }}
                />
              </ListItem>
            </List>
          </Box>
          

        </CardContent>
      </Card>

      {/* Quick Actions - Old Card Style */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
        gap: 3,
        mb: 4
      }}>
        <Card sx={{ height: '100%', cursor: 'pointer' }} onClick={() => navigate(`/wallet/${user?._id}`)}>
          <CardContent sx={{ textAlign: 'center', py: 3 }}>
            <AccountBalanceWallet sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>Wallet History</Typography>
            <Typography variant="body2" color="text.secondary">View your wallet activity</Typography>
          </CardContent>
        </Card>
        <Card sx={{ height: '100%', cursor: 'pointer' }} onClick={() => navigate(`/transactions/${user?._id}`)}>
          <CardContent sx={{ textAlign: 'center', py: 3 }}>
            <ReceiptLong sx={{ fontSize: 48, color: 'secondary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>Transactions</Typography>
            <Typography variant="body2" color="text.secondary">All your transactions</Typography>
          </CardContent>
        </Card>
        <Card sx={{ height: '100%', cursor: 'pointer' }} onClick={() => navigate('/recharge')}>
          <CardContent sx={{ textAlign: 'center', py: 3 }}>
            <AddCard sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>Recharges</Typography>
            <Typography variant="body2" color="text.secondary">Recharge history</Typography>
          </CardContent>
        </Card>
        <Card sx={{ height: '100%', cursor: 'pointer' }} onClick={() => navigate('/withdraw')}>
          <CardContent sx={{ textAlign: 'center', py: 3 }}>
            <MoneyOff sx={{ fontSize: 48, color: 'warning.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>Withdraws</Typography>
            <Typography variant="body2" color="text.secondary">Withdraw history</Typography>
          </CardContent>
        </Card>
        <Card sx={{ height: '100%', cursor: 'pointer' }} onClick={() => navigate(`/bank-cards/${user?._id}`)}>
          <CardContent sx={{ textAlign: 'center', py: 3 }}>
            <CreditCard sx={{ fontSize: 48, color: 'info.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>Bank Cards</Typography>
            <Typography variant="body2" color="text.secondary">Manage your bank cards</Typography>
          </CardContent>
        </Card>
        <Card sx={{ height: '100%', cursor: 'pointer' }} onClick={() => navigate(`/referrals/${user?._id}`)}>
          <CardContent sx={{ textAlign: 'center', py: 3 }}>
            <GroupAdd sx={{ fontSize: 48, color: 'secondary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>Referrals</Typography>
            <Typography variant="body2" color="text.secondary">Your referrals</Typography>
          </CardContent>
        </Card>
        <Card sx={{ height: '100%', cursor: 'pointer' }} onClick={() => navigate('/lottery-history')}>
          <CardContent sx={{ textAlign: 'center', py: 3 }}>
            <History sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>Play History</Typography>
            <Typography variant="body2" color="text.secondary">Your lottery play history</Typography>
          </CardContent>
        </Card>
        <Card sx={{ height: '100%', cursor: 'pointer' }} onClick={() => navigate('/profile-settings')}>
          <CardContent sx={{ textAlign: 'center', py: 3 }}>
            <Settings sx={{ fontSize: 48, color: 'warning.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>Profile Settings</Typography>
            <Typography variant="body2" color="text.secondary">Manage your profile settings</Typography>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default MyProfile;