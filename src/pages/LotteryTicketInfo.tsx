import React from 'react';
import { Container, Typography, Box, Card, CardContent, Button } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowBack, ConfirmationNumber } from '@mui/icons-material';

const LotteryTicketInfo: React.FC = () => {
  const navigate = useNavigate();
  const { ticketId } = useParams();

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          sx={{ mb: 2 }}
        >
          Back
        </Button>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Lottery Ticket Info
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Ticket ID: {ticketId}
        </Typography>
      </Box>
      <Card elevation={3}>
        <CardContent sx={{ p: 4, textAlign: 'center' }}>
          <ConfirmationNumber sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Ticket Details Coming Soon
          </Typography>
          <Typography variant="body1" color="text.secondary">
            The ticket details and status will be displayed here. Stay tuned!
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default LotteryTicketInfo; 