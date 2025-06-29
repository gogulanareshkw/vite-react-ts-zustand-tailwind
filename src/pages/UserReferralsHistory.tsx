import React from 'react';
import { Container, Typography, Box, Card, CardContent, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ArrowBack, GroupAdd } from '@mui/icons-material';

const UserReferralsHistory: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={() => navigate('/dashboard')}
          sx={{ mb: 2 }}
        >
          Back to Dashboard
        </Button>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Referral History
        </Typography>
      </Box>
      <Card elevation={3}>
        <CardContent sx={{ p: 4, textAlign: 'center' }}>
          <GroupAdd sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Referral History Coming Soon
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Your referral history will be displayed here. Stay tuned!
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default UserReferralsHistory; 