import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Card, 
  Tabs, 
  Tab, 
  Divider,
  useMediaQuery,
  useTheme
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import GroupIcon from '@mui/icons-material/Group';
import SettingsIcon from '@mui/icons-material/Settings';
import { useStore } from '../store/useStore';

// Import tab components
import ProfileSettings from './ProfileSettings';

// --- Profile Info Tab ---
const ProfileInfoTab: React.FC = () => {
  const { user, getUserBalance, getUserReferralCount, getUserDisplayName } = useStore();
  if (!user) return <Typography>Loading...</Typography>;
  return (
    <Box>
      <Card elevation={3} sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h5" fontWeight="bold" gutterBottom>Profile Information</Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography><b>Name:</b> {getUserDisplayName()}</Typography>
          <Typography><b>Email:</b> {user.email}</Typography>
          <Typography><b>Phone:</b> {user.phone || '-'}</Typography>
          <Typography><b>Gender:</b> {user.gender || '-'}</Typography>
          <Typography><b>Role:</b> {user.userRole}</Typography>
          <Typography><b>Status:</b> {user.activeStatus ? 'Active' : 'Inactive'}</Typography>
          <Typography><b>Available Balance:</b> ₹{getUserBalance().toLocaleString()}</Typography>
          <Typography><b>Referral Count:</b> {getUserReferralCount()}</Typography>
        </CardContent>
      </Card>
      <ProfileSettingsTab />
    </Box>
  );
};

// Tab components
const ChangePasswordTab: React.FC = () => {
  return (
    <Box>
      <ProfileSettings />
    </Box>
  );
};

const BankCardsTab: React.FC = () => (
  <Box>
    <Typography variant="h6" gutterBottom>Bank Cards</Typography>
    <Typography>Bank cards management will be available soon.</Typography>
  </Box>
);

const UserReferralsHistoryTab: React.FC = () => {
  const { getUserReferralCount } = useStore();
  return (
    <Box>
      <Typography variant="h6" gutterBottom>Referral Program</Typography>
      <Typography>Total Referrals: {getUserReferralCount()}</Typography>
    </Box>
  );
};

const Profile: React.FC = () => {
  const [tab, setTab] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => setTab(newValue);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography 
        variant="h3" 
        component="h1" 
        gutterBottom 
        sx={{ 
          fontWeight: 'bold', 
          mb: 4, 
          textAlign: 'center',
          fontSize: isMobile ? '2rem' : '2.5rem'
        }}
      >
        My Account
      </Typography>
      <Card elevation={4} sx={{ mb: 3, borderRadius: 2 }}>
        <Tabs 
          value={tab} 
          onChange={handleTabChange} 
          variant="scrollable" 
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{
            '& .MuiTabs-scroller': {
              overflowX: 'auto !important',
            },
            '& .MuiTab-root': {
              minHeight: 64,
              minWidth: 'auto',
              px: { xs: 1, sm: 2 },
              '& .MuiSvgIcon-root': {
                marginRight: 1,
              }
            }
          }}
        >
          <Tab label="Profile" icon={<PersonIcon />} iconPosition="start" />
          <Tab label="Settings" icon={<SettingsIcon />} iconPosition="start" />
          <Tab label="Bank Cards" icon={<CreditCardIcon />} iconPosition="start" />
          <Tab label="Referrals" icon={<GroupIcon />} iconPosition="start" />
        </Tabs>
      </Card>
      <Box sx={{ mt: 2 }}>
        {tab === 0 && <ProfileInfoTab />}
        {tab === 1 && <ProfileSettings />}
        {tab === 2 && <BankCardsTab />}
        {tab === 3 && <UserReferralsHistoryTab />}
      </Box>
    </Container>
  );
};

export default Profile; 
