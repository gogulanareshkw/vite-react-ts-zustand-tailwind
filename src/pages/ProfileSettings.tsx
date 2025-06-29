import React from 'react';
import { Container, Typography, Box, Card, CardContent, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ArrowBack, Settings } from '@mui/icons-material';

const ProfileSettings: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={() => navigate('/profile')}
          sx={{ mb: 2 }}
        >
          Back to Profile
        </Button>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Profile Settings
        </Typography>
      </Box>
      <Card elevation={3}>
        <CardContent sx={{ p: 4, textAlign: 'center' }}>
          <Settings sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Profile Settings Coming Soon
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Advanced profile configuration options will be available here. Stay tuned!
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default ProfileSettings; 