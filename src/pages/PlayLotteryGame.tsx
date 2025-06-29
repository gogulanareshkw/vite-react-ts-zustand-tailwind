import React from 'react';
import { Container, Typography, Box, Card, CardContent, Button } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowBack, Casino } from '@mui/icons-material';

const PlayLotteryGame: React.FC = () => {
  const navigate = useNavigate();
  const { lotteryGameType } = useParams();

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
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
          Play Lottery Game
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Game Type: {lotteryGameType}
        </Typography>
      </Box>
      <Card elevation={3}>
        <CardContent sx={{ p: 4, textAlign: 'center' }}>
          <Casino sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Lottery Gameplay Coming Soon
          </Typography>
          <Typography variant="body1" color="text.secondary">
            The interactive lottery gameplay UI will be implemented here. Stay tuned!
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default PlayLotteryGame; 