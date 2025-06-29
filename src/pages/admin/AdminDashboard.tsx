import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Grid,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@mui/material';
import {
  People,
  AccountBalance,
  TrendingUp,
  TrendingDown,
  Casino,
  Receipt,
  Settings,
  Security,
  Notifications,
  Dashboard,
  ArrowForward,
} from '@mui/icons-material';
import { useStore } from '../../store/useStore';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useStore();

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAgents: 0,
    totalTransactions: 0,
    totalRevenue: 0,
    pendingWithdrawals: 0,
    activeGames: 0,
  });

  const quickActions = [
    {
      title: 'Manage Users',
      description: 'View and manage all registered users',
      icon: <People sx={{ fontSize: 40, color: 'primary.main' }} />,
      path: '/admin/users',
      color: 'primary',
    },
    {
      title: 'Game Settings',
      description: 'Configure lottery game parameters',
      icon: <Casino sx={{ fontSize: 40, color: 'secondary.main' }} />,
      path: '/admin/game-settings',
      color: 'secondary',
    },
    {
      title: 'Application Logs',
      description: 'Monitor system errors and events',
      icon: <Notifications sx={{ fontSize: 40, color: 'error.main' }} />,
      path: '/admin/application-logs',
      color: 'error',
    },
    {
      title: 'Database History',
      description: 'Track database changes and transactions',
      icon: <AccountBalance sx={{ fontSize: 40, color: 'warning.main' }} />,
      path: '/admin/database-history',
      color: 'warning',
    },
    {
      title: 'System Monitor',
      description: 'Real-time system performance monitoring',
      icon: <Dashboard sx={{ fontSize: 40, color: 'info.main' }} />,
      path: '/admin/system-monitor',
      color: 'info',
    },
    {
      title: 'Transactions',
      description: 'Monitor financial transactions',
      icon: <Receipt sx={{ fontSize: 40, color: 'success.main' }} />,
      path: '/admin/transactions',
      color: 'success',
    },
  ];

  const recentActivities = [
    {
      type: 'user_registration',
      message: 'New user registered: john.doe@example.com',
      time: '2 minutes ago',
      priority: 'low',
    },
    {
      type: 'withdrawal_request',
      message: 'Withdrawal request: ₹5000 from user ID 12345',
      time: '5 minutes ago',
      priority: 'medium',
    },
    {
      type: 'game_completed',
      message: 'Lottery game completed: 50 tickets sold',
      time: '10 minutes ago',
      priority: 'low',
    },
    {
      type: 'system_alert',
      message: 'System maintenance scheduled for tonight',
      time: '1 hour ago',
      priority: 'high',
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Admin Dashboard
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Welcome back, {user?.firstName}! Here's what's happening with WahLotto.
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3} sx={{ background: 'linear-gradient(135deg, #2196f3 0%, #64b5f6 100%)', color: 'white' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h6" gutterBottom>Total Users</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {stats.totalUsers.toLocaleString()}
                  </Typography>
                </Box>
                <People sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3} sx={{ background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)', color: 'white' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h6" gutterBottom>Total Revenue</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    ₹{stats.totalRevenue.toLocaleString()}
                  </Typography>
                </Box>
                <TrendingUp sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3} sx={{ background: 'linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)', color: 'white' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h6" gutterBottom>Pending Withdrawals</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {stats.pendingWithdrawals}
                  </Typography>
                </Box>
                <TrendingDown sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3} sx={{ background: 'linear-gradient(135deg, #9c27b0 0%, #ba68c8 100%)', color: 'white' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h6" gutterBottom>Active Games</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {stats.activeGames}
                  </Typography>
                </Box>
                <Casino sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Quick Actions */}
        <Grid item xs={12} md={8}>
          <Card elevation={3}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                Quick Actions
              </Typography>
              <Grid container spacing={2}>
                {quickActions.map((action, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Card 
                      elevation={2} 
                      sx={{ 
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: 4,
                        }
                      }}
                      onClick={() => navigate(action.path)}
                    >
                      <CardContent sx={{ p: 2, textAlign: 'center' }}>
                        <Box sx={{ mb: 2 }}>
                          {action.icon}
                        </Box>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                          {action.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {action.description}
                        </Typography>
                        <Button
                          variant="outlined"
                          size="small"
                          endIcon={<ArrowForward />}
                          color={action.color as any}
                        >
                          Open
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activities */}
        <Grid item xs={12} md={4}>
          <Card elevation={3}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                Recent Activities
              </Typography>
              <List sx={{ p: 0 }}>
                {recentActivities.map((activity, index) => (
                  <React.Fragment key={index}>
                    <ListItem sx={{ px: 0, py: 1 }}>
                      <ListItemIcon>
                        <Notifications sx={{ fontSize: 20, color: `${getPriorityColor(activity.priority)}.main` }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={activity.message}
                        secondary={activity.time}
                        primaryTypographyProps={{ variant: 'body2' }}
                        secondaryTypographyProps={{ variant: 'caption' }}
                      />
                      <Chip
                        label={activity.priority}
                        color={getPriorityColor(activity.priority) as any}
                        size="small"
                      />
                    </ListItem>
                    {index < recentActivities.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* System Status */}
      <Card elevation={3} sx={{ mt: 4 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
            System Status
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: 'success.main' }} />
                <Typography variant="body2">System Online</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: 'success.main' }} />
                <Typography variant="body2">Database Connected</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: 'success.main' }} />
                <Typography variant="body2">Payment Gateway Active</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: 'success.main' }} />
                <Typography variant="body2">Email Service Running</Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};

export default AdminDashboard; 