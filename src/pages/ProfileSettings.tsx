import React, { useEffect, useState } from 'react';
import { 
  Container, 
  Typography, 
  Card, 
  CardContent, 
  TextField, 
  Button, 
  Box, 
  MenuItem, 
  CircularProgress, 
  Alert,
  Avatar,
  InputAdornment,
  IconButton
} from '@mui/material';
import { useStore } from '../store/useStore';
import { AccountCircle, Visibility, VisibilityOff } from '@mui/icons-material';

const GENDERS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' }
];

interface ChangePasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  showCurrentPassword: boolean;
  showNewPassword: boolean;
  showConfirmPassword: boolean;
}

interface UserProfileData {
  firstName: string;
  lastName: string;
  phone: string;
  gender: string;
}

const ProfileSettings: React.FC = () => {
  const { api, notification, user: currentUser } = useStore();
  const [form, setForm] = useState({
    firstName: currentUser?.firstName || '',
    lastName: currentUser?.lastName || '',
    phone: currentUser?.phone || '',
    gender: currentUser?.gender?.toLowerCase() || '',
    email: currentUser?.email || ''
  });
  const [initialForm, setInitialForm] = useState(form);
  const [isDirty, setIsDirty] = useState(false);
  
  const [passwordForm, setPasswordForm] = useState<ChangePasswordForm>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    showCurrentPassword: false,
    showNewPassword: false,
    showConfirmPassword: false
  });
  
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser) {
      const userData = {
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        phone: currentUser.phone || '',
        gender: currentUser.gender?.toLowerCase() || '',
        email: currentUser.email || ''
      };
      setForm(userData);
      setInitialForm(userData);
    }
  }, [currentUser]);

  useEffect(() => {
    const hasChanged = 
      form.firstName.trim() !== initialForm.firstName.trim() ||
      form.lastName.trim() !== initialForm.lastName.trim() ||
      form.phone.trim() !== initialForm.phone.trim() ||
      form.gender !== initialForm.gender;
    setIsDirty(hasChanged);
  }, [form, initialForm]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    if (name) {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const profileData: UserProfileData = {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        phone: form.phone.trim(),
        gender: form.gender
      };

      const response = await api.updateUserProfile(profileData);

      if (response.success) {
        notification.show('Profile updated successfully!', 'success');
        // Update the user in the store
        if (currentUser) {
          const updatedUser = {
            ...currentUser,
            ...profileData
          };
          useStore.getState().setUser(updatedUser);
          setInitialForm(form);
        }
      } else {
        setError(response.message || 'Failed to update profile');
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'An error occurred while updating your profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setChangingPassword(true);
    setError(null);
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('New password and confirm password do not match');
      setChangingPassword(false);
      return;
    }
    
    try {
      await api.changePassword(
        passwordForm.currentPassword,
        passwordForm.newPassword
      );
      notification.show('Password changed successfully!', 'success');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        showCurrentPassword: false,
        showNewPassword: false,
        showConfirmPassword: false
      });
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to change password.');
    } finally {
      setChangingPassword(false);
    }
  };
  
  const togglePasswordVisibility = (field: keyof Pick<ChangePasswordForm, 'showCurrentPassword' | 'showNewPassword' | 'showConfirmPassword'>) => {
    setPasswordForm(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 2 }}>
        <Avatar sx={{ width: 60, height: 60, bgcolor: 'primary.main' }}>
          {currentUser?.firstName?.[0] || <AccountCircle fontSize="large" />}
        </Avatar>
        <Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
            {currentUser?.firstName} {currentUser?.lastName}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {currentUser?.email}
          </Typography>
        </Box>
      </Box>
      
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Button
          variant={activeTab === 'profile' ? 'contained' : 'outlined'}
          onClick={() => setActiveTab('profile')}
        >
          Profile Information
        </Button>
        <Button
          variant={activeTab === 'password' ? 'contained' : 'outlined'}
          onClick={() => setActiveTab('password')}
        >
          Change Password
        </Button>
      </Box>
      
      <Card elevation={3}>
        <CardContent>
          {false ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : activeTab === 'profile' ? (
            <form onSubmit={handleSave} autoComplete="off">
              <div className="flex flex-wrap -mx-2">
                <div className="w-full md:w-1/2 px-2 mb-4">
                  <TextField
                    label="First Name"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    fullWidth
                    required
                    margin="normal"
                  />
                </div>
                <div className="w-full md:w-1/2 px-2 mb-4">
                  <TextField
                    label="Last Name"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    fullWidth
                    required
                    margin="normal"
                  />
                </div>
                <div className="w-full px-2 mb-4">
                  <TextField
                    label="Email"
                    name="email"
                    value={currentUser?.email || ''}
                    fullWidth
                    margin="normal"
                    disabled
                  />
                </div>
                <div className="w-full md:w-1/2 px-2 mb-4">
                  <TextField
                    label="Phone Number"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    fullWidth
                    required
                    margin="normal"
                  />
                </div>
                <div className="w-full md:w-1/2 px-2 mb-4">
                  <TextField
                    select
                    label="Gender"
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                    fullWidth
                    required
                    margin="normal"
                  >
                    {GENDERS.map((g) => (
                      <MenuItem key={g.value} value={g.value}>
                        {g.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </div>
              </div>
              
              {error && <Alert severity="error" sx={{ mt: 2, mb: 2 }}>{error}</Alert>}
              
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={saving || !isDirty}
                  sx={{ minWidth: 150 }}
                >
                  {saving ? <CircularProgress size={24} /> : 'Save Changes'}
                </Button>
              </Box>
            </form>
          ) : (
            <form onSubmit={handlePasswordChange} autoComplete="off">
              <div className="flex flex-wrap -mx-2">
                <div className="w-full px-2 mb-4">
                  <TextField
                    label="Current Password"
                    name="currentPassword"
                    type={passwordForm.showCurrentPassword ? 'text' : 'password'}
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                    fullWidth
                    required
                    margin="normal"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => togglePasswordVisibility('showCurrentPassword')}
                            edge="end"
                          >
                            {passwordForm.showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </div>
                <div className="w-full md:w-1/2 px-2 mb-4">
                  <TextField
                    label="New Password"
                    name="newPassword"
                    type={passwordForm.showNewPassword ? 'text' : 'password'}
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                    fullWidth
                    required
                    margin="normal"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => togglePasswordVisibility('showNewPassword')}
                            edge="end"
                          >
                            {passwordForm.showNewPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </div>
                <div className="w-full md:w-1/2 px-2 mb-4">
                  <TextField
                    label="Confirm New Password"
                    name="confirmPassword"
                    type={passwordForm.showConfirmPassword ? 'text' : 'password'}
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                    fullWidth
                    required
                    margin="normal"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => togglePasswordVisibility('showConfirmPassword')}
                            edge="end"
                          >
                            {passwordForm.showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </div>
              </div>
              
              {error && <Alert severity="error" sx={{ mt: 2, mb: 2 }}>{error}</Alert>}
              
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={changingPassword}
                  sx={{ minWidth: 150 }}
                >
                  {changingPassword ? <CircularProgress size={24} /> : 'Change Password'}
                </Button>
              </Box>
            </form>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default ProfileSettings; 
