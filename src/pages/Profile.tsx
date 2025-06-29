import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Avatar,
  Button,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Person,
  Email,
  Phone,
  AccountBalance,
  History,
  Settings,
  Edit,
  VerifiedUser,
} from '@mui/icons-material';
import { useStore } from '../store/useStore';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { 
    user,
    getUserBalance,
    getUserReferralCount,
    getUserDisplayName
  } = useStore();
  const [userInfo, setUserInfo] = useState(user);

  useEffect(() => {
    if (user) {
      setUserInfo(user);
    }
  }, [user]);

  const getRoleLabel = (role: number) => {
    switch (role) {
      case 1: return 'Super Admin';
      case 2: return 'Admin';
      case 3: return 'User';
      case 4: return 'Agent';
      case 5: return 'Staff';
      default: return 'Unknown';
    }
  };

  const getStatusColor = (status: boolean) => {
    return status ? 'success' : 'error';
  };

  const getStatusLabel = (status: boolean) => {
    return status ? 'Active' : 'Inactive';
  };

  if (!userInfo) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h4" textAlign="center">
          Loading profile...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
        Profile
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
        {/* Profile Card */}
        <Box sx={{ width: { xs: '100%', md: '33%' } }}>
          <Card elevation={3}>
            <CardContent sx={{ textAlign: 'center', p: 4 }}>
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  mx: 'auto',
                  mb: 3,
                  bgcolor: 'primary.main',
                  fontSize: '3rem',
                }}
              >
                {userInfo.firstName?.charAt(0) || userInfo.email.charAt(0).toUpperCase()}
              </Avatar>

              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                {getUserDisplayName()}
              </Typography>

              <Typography variant="body1" color="text.secondary" gutterBottom>
                {userInfo.email}
              </Typography>

              <Box sx={{ mt: 2, mb: 3 }}>
                <Chip
                  label={getRoleLabel(userInfo.userRole)}
                  color="primary"
                  variant="outlined"
                  sx={{ mr: 1 }}
                />
                <Chip
                  label={getStatusLabel(userInfo.activeStatus)}
                  color={getStatusColor(userInfo.activeStatus)}
                  variant="outlined"
                />
              </Box>

              <Button
                variant="contained"
                startIcon={<Edit />}
                onClick={() => navigate('/profile-settings')}
                fullWidth
                sx={{ mb: 2 }}
              >
                Edit Profile
              </Button>

              <Button
                variant="outlined"
                startIcon={<Settings />}
                onClick={() => navigate('/change-password')}
                fullWidth
              >
                Change Password
              </Button>
            </CardContent>
          </Card>
        </Box>

        {/* User Details */}
        <Box sx={{ flex: 1 }}>
          <Card elevation={3}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                User Information
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3 }}>
                <Box sx={{ flex: 1 }}>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <Person color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="User ID"
                        secondary={userInfo.userId}
                      />
                    </ListItem>

                    <ListItem>
                      <ListItemIcon>
                        <Email color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Email"
                        secondary={userInfo.email}
                      />
                    </ListItem>

                    {userInfo.phone && (
                      <ListItem>
                        <ListItemIcon>
                          <Phone color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Phone"
                          secondary={userInfo.phone}
                        />
                      </ListItem>
                    )}

                    {userInfo.gender && (
                      <ListItem>
                        <ListItemIcon>
                          <Person color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Gender"
                          secondary={userInfo.gender}
                        />
                      </ListItem>
                    )}
                  </List>
                </Box>

                <Box sx={{ flex: 1 }}>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <AccountBalance color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Available Balance"
                        secondary={`$${getUserBalance().toFixed(2)}`}
                      />
                    </ListItem>

                    <ListItem>
                      <ListItemIcon>
                        <History color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Referral Count"
                        secondary={getUserReferralCount()}
                      />
                    </ListItem>

                    <ListItem>
                      <ListItemIcon>
                        <VerifiedUser color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Email Verified"
                        secondary={
                          <Chip
                            label={userInfo.isEmailVerified ? 'Verified' : 'Not Verified'}
                            color={userInfo.isEmailVerified ? 'success' : 'warning'}
                            size="small"
                          />
                        }
                      />
                    </ListItem>

                    <ListItem>
                      <ListItemIcon>
                        <VerifiedUser color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Agent Verified"
                        secondary={
                          <Chip
                            label={userInfo.isAgentVerified ? 'Verified' : 'Not Verified'}
                            color={userInfo.isAgentVerified ? 'success' : 'warning'}
                            size="small"
                          />
                        }
                      />
                    </ListItem>
                  </List>
                </Box>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Quick Actions */}
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                Quick Actions
              </Typography>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                {userInfo.userRole === 3 && (
                  <>
                    <Button
                      variant="outlined"
                      onClick={() => navigate('/recharge')}
                      sx={{ py: 2, minWidth: 120 }}
                    >
                      Recharge
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => navigate('/withdraw')}
                      sx={{ py: 2, minWidth: 120 }}
                    >
                      Withdraw
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => navigate('/game-options')}
                      sx={{ py: 2, minWidth: 120 }}
                    >
                      Play Games
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => navigate('/lottery-history')}
                      sx={{ py: 2, minWidth: 120 }}
                    >
                      Game History
                    </Button>
                  </>
                )}

                {(userInfo.userRole === 1 || userInfo.userRole === 2) && (
                  <>
                    <Button
                      variant="outlined"
                      onClick={() => navigate('/admin/users')}
                      sx={{ py: 2, minWidth: 120 }}
                    >
                      Manage Users
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => navigate('/admin/game-settings')}
                      sx={{ py: 2, minWidth: 120 }}
                    >
                      Game Settings
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => navigate('/admin/search-transactions')}
                      sx={{ py: 2, minWidth: 120 }}
                    >
                      Transactions
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => navigate('/admin/feedbacks')}
                      sx={{ py: 2, minWidth: 120 }}
                    >
                      Feedbacks
                    </Button>
                  </>
                )}
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Container>
  );
};

export default Profile; 