import React, { useEffect, useState } from 'react';
import type { UserInfoResponse, GameSettingsResponse } from '../types';
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
  Badge,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';

const MyProfile: React.FC = () => {
  const navigate = useNavigate();
  const { user, gameSettings, api, setUser, setGameSettings } = useStore();
  const [isLoading, setIsLoading] = useState(false);

  // Fetch user details and game settings when component mounts or user changes
  useEffect(() => {
    const fetchUserData = async () => {
      if (user?._id) {
        setIsLoading(true);
        try {
          // Fetch updated user details
          const userInfoResponse = await api.getUserInfo(user.userId);
          if (userInfoResponse.success && userInfoResponse.userInfo) {
            setUser(userInfoResponse.userInfo);
          }
          
          // Fetch game settings
          const gameSettingsResponse = await api.getGameSettings();
          if (gameSettingsResponse.success && gameSettingsResponse.gameSettings) {
            setGameSettings(gameSettingsResponse.gameSettings);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchUserData();
  }, [user?._id, api, setUser, setGameSettings]);

  // Always fetch data on component mount (for page refresh scenarios)
  useEffect(() => {
    const fetchDataOnMount = async (userId: string) => {
      setIsLoading(true);
      try {
        console.log('Fetching data for user:', userId); // Debug log
        // Always fetch fresh data on mount
        const userInfoResponse = await api.getUserInfo(userId);
        if (userInfoResponse.success && userInfoResponse.userInfo) {
          setUser(userInfoResponse.userInfo);
        }
        
        const gameSettingsResponse = await api.getGameSettings();
        if (gameSettingsResponse.success && gameSettingsResponse.gameSettings) {
          setGameSettings(gameSettingsResponse.gameSettings);
        }
      } catch (error) {
        console.error('Error fetching data on mount:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Try to get userId from multiple sources
    let userId = user?._id;
    
    // If not in store, try localStorage as fallback
    if (!userId) {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          userId = parsedUser.userId;
          console.log('Got userId from localStorage:', userId);
        }
      } catch (error) {
        console.error('Error parsing stored user:', error);
      }
    }

    if (userId) {
      fetchDataOnMount(userId);
    } else {
      console.log('No userId available yet, waiting...');
      // Set up a small delay to wait for Zustand persistence to load
      const timer = setTimeout(() => {
        const delayedUserId = user?._id;
        if (delayedUserId) {
          console.log('UserId now available:', delayedUserId);
          fetchDataOnMount(delayedUserId);
        }
      }, 200);
      
      return () => clearTimeout(timer);
    }
  }, [user?._id, api, setUser, setGameSettings]); // Add all dependencies

  const quickActions = [
    { title: 'Wallet History', icon: <AccountBalanceWallet />, path: '/wallethistory' },
    { title: 'Transactions', icon: <ReceiptLong />, path: '/transactions' },
    { title: 'Recharges', icon: <AddCard />, path: '/recharges' },
    { title: 'Withdraws', icon: <MoneyOff />, path: '/withdraws' },
    { title: 'Bank Cards', icon: <CreditCard />, path: '/bankcards' },
    { title: 'Referrals', icon: <GroupAdd />, path: '/referrals' },
    { title: 'Play History', icon: <History />, path: '/playhistory' },
    { title: 'Profile Settings', icon: <Settings />, path: '/profilesettings' },
  ];

  const formatDate = (date: string | Date | undefined) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
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
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3, textAlign: 'center', color: 'primary.main' }}>
            Account Overview & Referrals
          </Typography>
          
          {/* Stats Row */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: 2, 
            mb: 4, 
            flexWrap: 'wrap' 
          }}>
            <Chip 
              icon={<GroupAdd />} 
              label={`Referrals: ${user?.referralCount || 0}`} 
              color="secondary" 
              variant="outlined" 
              sx={{ fontSize: '1rem', py: 1 }}
            />
            <Chip 
              icon={<Badge />} 
              label={user?.isEmailVerified ? 'Verified' : 'Not Verified'} 
              color={user?.isEmailVerified ? 'success' : 'warning'} 
              variant="outlined" 
              sx={{ fontSize: '1rem', py: 1 }}
            />
            <Chip 
              icon={<AccountBalanceWallet />} 
              label={`${user?.availableAmount?.toFixed(2) || '0.00'}`} 
              color="primary" 
              variant="outlined" 
              sx={{ fontSize: '1rem', py: 1 }}
            />
          </Box>
          
          {/* App ID & Status Section */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            gap: 2, 
            mb: 4,
            flexWrap: 'wrap'
          }}>
            <Chip
              label={`App ID: ${user?.appId}`}
              color="info"
              variant="outlined"
              onDelete={() => navigator.clipboard.writeText(user?.appId || '')}
              deleteIcon={<ContentCopy />}
              sx={{ fontSize: '1rem', py: 1 }}
            />
            <Chip
              label={user?.activeStatus ? 'Active' : 'Inactive'}
              color={user?.activeStatus ? 'success' : 'error'}
              variant="outlined"
              sx={{ fontSize: '1rem', py: 1 }}
            />
          </Box>
          
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
        <Card sx={{ height: '100%', cursor: 'pointer' }} onClick={() => navigate(`/wallet/${user?.userId}`)}>
          <CardContent sx={{ textAlign: 'center', py: 3 }}>
            <AccountBalanceWallet sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>Wallet History</Typography>
            <Typography variant="body2" color="text.secondary">View your wallet activity</Typography>
          </CardContent>
        </Card>
        <Card sx={{ height: '100%', cursor: 'pointer' }} onClick={() => navigate(`/transactions/${user?.userId}`)}>
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
        <Card sx={{ height: '100%', cursor: 'pointer' }} onClick={() => navigate('/bank-cards')}>
          <CardContent sx={{ textAlign: 'center', py: 3 }}>
            <CreditCard sx={{ fontSize: 48, color: 'info.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>Bank Cards</Typography>
            <Typography variant="body2" color="text.secondary">Manage your bank cards</Typography>
          </CardContent>
        </Card>
        <Card sx={{ height: '100%', cursor: 'pointer' }} onClick={() => navigate(`/referrals/${user?.userId}`)}>
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
