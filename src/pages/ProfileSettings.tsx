import React, { useEffect, useState } from 'react';
import { Container, Typography, Card, CardContent, TextField, Button, Box, MenuItem, CircularProgress, Alert } from '@mui/material';
import { useStore } from '../store/useStore';
import type { User } from '../types';

const GENDERS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];

const ProfileSettings: React.FC = () => {
  const { api, notification } = useStore();
  const [user, setUser] = useState<User | null>(null);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    gender: '',
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.getUserInfo();
      if (response.data) {
        setUser(response.data);
        setForm({
          firstName: response.data.firstName || '',
          lastName: response.data.lastName || '',
          phone: response.data.phone || '',
          gender: response.data.gender || '',
        });
      } else {
        setError('Failed to load profile.');
      }
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to load profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      await api.updateUserProfile(form);
      setSuccess('Profile updated successfully!');
      notification.show('Profile updated successfully!', 'success');
      fetchProfile();
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center' }}>
        Profile Settings
      </Typography>
      <Card elevation={3}>
        <CardContent>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <form onSubmit={handleSave} autoComplete="off">
              <TextField
                label="First Name"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                fullWidth
                required
                sx={{ mb: 2 }}
              />
              <TextField
                label="Last Name"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                fullWidth
                required
                sx={{ mb: 2 }}
              />
              <TextField
                label="Phone"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                fullWidth
                required
                sx={{ mb: 2 }}
              />
              <TextField
                select
                label="Gender"
                name="gender"
                value={form.gender}
                onChange={handleChange}
                fullWidth
                required
                sx={{ mb: 2 }}
              >
                {GENDERS.map((g) => (
                  <MenuItem key={g.value} value={g.value}>{g.label}</MenuItem>
                ))}
              </TextField>
              {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
              {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                disabled={saving}
              >
                {saving ? <CircularProgress size={24} /> : 'Save Changes'}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default ProfileSettings; 