import React, { useState } from 'react';
import { Container, Typography, Box, Card, CardContent, Tabs, Tab, Divider } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import GroupIcon from '@mui/icons-material/Group';
import { useStore } from '../store/useStore';
// Import merged tab content components (to be defined below)

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

// --- Profile Settings Tab ---
import ProfileSettingsTab from './ProfileSettings';
// --- Change Password Tab ---
import ChangePasswordTab from './ChangePassword';
// --- Bank Cards Tab ---
import BankCardsTab from './BankCards';
// --- Referrals Tab ---
import UserReferralsHistoryTab from './UserReferralsHistory';

const Profile: React.FC = () => {
  const [tab, setTab] = useState(0);
  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => setTab(newValue);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 4, textAlign: 'center' }}>
        Profile
      </Typography>
      <Card elevation={4} sx={{ mb: 3 }}>
        <Tabs value={tab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
          <Tab label="Info" icon={<PersonIcon />} iconPosition="start" />
          <Tab label="Change Password" icon={<LockIcon />} iconPosition="start" />
          <Tab label="Bank Cards" icon={<CreditCardIcon />} iconPosition="start" />
          <Tab label="Referrals" icon={<GroupIcon />} iconPosition="start" />
        </Tabs>
      </Card>
      <Box>
        {tab === 0 && <ProfileInfoTab />}
        {tab === 1 && <ChangePasswordTab />}
        {tab === 2 && <BankCardsTab />}
        {tab === 3 && <UserReferralsHistoryTab />}
      </Box>
    </Container>
  );
};

export default Profile; 
