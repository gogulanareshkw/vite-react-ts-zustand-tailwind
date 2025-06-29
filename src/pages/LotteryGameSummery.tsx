import React from 'react';
import { Container, Typography, Box, Card, CardContent, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ArrowBack, Assessment } from '@mui/icons-material';

const LotteryGameSummery: React.FC = () => {
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
          Lottery Game Summary
        </Typography>
      </Box>
      <Card elevation={3}>
        <CardContent sx={{ p: 4, textAlign: 'center' }}>
          <Assessment sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Game Summary Coming Soon
          </Typography>
          <Typography variant="body1" color="text.secondary">
            The summary and statistics of lottery games will be displayed here. Stay tuned!
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default LotteryGameSummery; 