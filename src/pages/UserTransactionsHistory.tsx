import React from 'react';
import { Container, Typography, Box, Card, CardContent, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ArrowBack, ReceiptLong } from '@mui/icons-material';

const UserTransactionsHistory: React.FC = () => {
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
          Transaction History
        </Typography>
      </Box>
      <Card elevation={3}>
        <CardContent sx={{ p: 4, textAlign: 'center' }}>
          <ReceiptLong sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Transaction History Coming Soon
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Your transaction history will be displayed here. Stay tuned!
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default UserTransactionsHistory; 