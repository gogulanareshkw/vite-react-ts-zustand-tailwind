import React from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Home,
  Person,
  Search,
  Casino,
  Settings,
  Help,
  Info,
  ContactSupport,
  Security,
  Description,
  Language,
  Notifications,
  AccountCircle,
  Payment,
  History,
  Star,
  Group,
  EmojiEvents,
  TrendingUp,
  Support,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const More: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4, fontWeight: 'bold' }}>
        More Options
      </Typography>

      {/* Public Sections */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3, color: 'primary.main' }}>
          General
        </Typography>
        <Card elevation={2}>
          <List>
            <ListItem button onClick={() => navigate('/help')}>
              <ListItemIcon>
                <Help color="primary" />
              </ListItemIcon>
              <ListItemText primary="Help & Support" />
            </ListItem>
            <Divider />
            <ListItem button onClick={() => navigate('/about')}>
              <ListItemIcon>
                <Info color="primary" />
              </ListItemIcon>
              <ListItemText primary="About Us" />
            </ListItem>
            <Divider />
            <ListItem button onClick={() => navigate('/contact')}>
              <ListItemIcon>
                <ContactSupport color="primary" />
              </ListItemIcon>
              <ListItemText primary="Contact Us" />
            </ListItem>
            <Divider />
            <ListItem button onClick={() => navigate('/terms')}>
              <ListItemIcon>
                <Description color="primary" />
              </ListItemIcon>
              <ListItemText primary="Terms & Conditions" />
            </ListItem>
            <Divider />
            <ListItem button onClick={() => navigate('/privacy')}>
              <ListItemIcon>
                <Security color="primary" />
              </ListItemIcon>
              <ListItemText primary="Privacy Policy" />
            </ListItem>
          </List>
        </Card>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3, color: 'secondary.main' }}>
          Account & Settings
        </Typography>
        <Card elevation={2}>
          <List>
            <ListItem button onClick={() => navigate('/my-profile')}>
              <ListItemIcon>
                <AccountCircle color="secondary" />
              </ListItemIcon>
              <ListItemText primary="My Profile" />
            </ListItem>
            <Divider />
            <ListItem button onClick={() => navigate('/settings')}>
              <ListItemIcon>
                <Settings color="secondary" />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItem>
            <Divider />
            <ListItem button onClick={() => navigate('/notifications')}>
              <ListItemIcon>
                <Notifications color="secondary" />
              </ListItemIcon>
              <ListItemText primary="Notifications" />
            </ListItem>
            <Divider />
            <ListItem button onClick={() => navigate('/payment-methods')}>
              <ListItemIcon>
                <Payment color="secondary" />
              </ListItemIcon>
              <ListItemText primary="Payment Methods" />
            </ListItem>
          </List>
        </Card>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3, color: 'success.main' }}>
          Games & History
        </Typography>
        <Card elevation={2}>
          <List>
            <ListItem button onClick={() => navigate('/games')}>
              <ListItemIcon>
                <Casino color="success" />
              </ListItemIcon>
              <ListItemText primary="All Games" />
            </ListItem>
            <Divider />
            <ListItem button onClick={() => navigate('/play-history')}>
              <ListItemIcon>
                <History color="success" />
              </ListItemIcon>
              <ListItemText primary="Play History" />
            </ListItem>
            <Divider />
            <ListItem button onClick={() => navigate('/winners')}>
              <ListItemIcon>
                <EmojiEvents color="success" />
              </ListItemIcon>
              <ListItemText primary="Winners" />
            </ListItem>
            <Divider />
            <ListItem button onClick={() => navigate('/leaderboard')}>
              <ListItemIcon>
                <TrendingUp color="success" />
              </ListItemIcon>
              <ListItemText primary="Leaderboard" />
            </ListItem>
          </List>
        </Card>
      </Box>

      <Box>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3, color: 'info.main' }}>
          Community & Support
        </Typography>
        <Card elevation={2}>
          <List>
            <ListItem button onClick={() => navigate('/referrals')}>
              <ListItemIcon>
                <Group color="info" />
              </ListItemIcon>
              <ListItemText primary="Referrals" />
            </ListItem>
            <Divider />
            <ListItem button onClick={() => navigate('/feedback')}>
              <ListItemIcon>
                <Star color="info" />
              </ListItemIcon>
              <ListItemText primary="Feedback" />
            </ListItem>
            <Divider />
            <ListItem button onClick={() => navigate('/support')}>
              <ListItemIcon>
                <Support color="info" />
              </ListItemIcon>
              <ListItemText primary="Customer Support" />
            </ListItem>
            <Divider />
            <ListItem button onClick={() => navigate('/language')}>
              <ListItemIcon>
                <Language color="info" />
              </ListItemIcon>
              <ListItemText primary="Language Settings" />
            </ListItem>
          </List>
        </Card>
      </Box>
    </Container>
  );
};

export default More; 