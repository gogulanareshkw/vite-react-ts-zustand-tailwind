import React from 'react';
import { Container, Typography, Box, Card, CardContent, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ArrowBack, ConfirmationNumber } from '@mui/icons-material';

const BuyFullLotteryTicket: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={() => navigate('/game-options')}
          sx={{ mb: 2 }}
        >
          Back to Game Options
        </Button>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Buy Full Lottery Ticket
        </Typography>
      </Box>
      <Card elevation={3}>
        <CardContent sx={{ p: 4, textAlign: 'center' }}>
          <ConfirmationNumber sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Ticket Purchase Coming Soon
          </Typography>
          <Typography variant="body1" color="text.secondary">
            The ticket purchase UI and logic will be implemented here. Stay tuned!
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default BuyFullLotteryTicket; 