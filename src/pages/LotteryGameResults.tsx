import React from 'react';
import { Container, Typography, Box, Card, CardContent, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ArrowBack, EmojiEvents } from '@mui/icons-material';

const LotteryGameResults: React.FC = () => {
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
          Lottery Game Results
        </Typography>
      </Box>
      <Card elevation={3}>
        <CardContent sx={{ p: 4, textAlign: 'center' }}>
          <EmojiEvents sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Lottery Results Coming Soon
          </Typography>
          <Typography variant="body1" color="text.secondary">
            The results of recent lottery games will be displayed here. Stay tuned!
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default LotteryGameResults; 