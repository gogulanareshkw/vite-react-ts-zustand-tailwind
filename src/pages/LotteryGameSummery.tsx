import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Card, CardContent, Button, Grid, CircularProgress, Alert, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ArrowBack, Assessment } from '@mui/icons-material';
import { useStore } from '../store/useStore';
import type { LotteryGamePlay } from '../types';

const LotteryGameSummery: React.FC = () => {
  const navigate = useNavigate();
  const { api } = useStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<LotteryGamePlay[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const pageSize = 100; // Fetch a large page for summary

  useEffect(() => {
    fetchSummary();
    // eslint-disable-next-line
  }, [page]);

  const fetchSummary = async () => {
    setLoading(true);
    setError(null);
    try {
      // 0 means all game types
      const res = await api.getUserGameHistory(0, page, pageSize);
      setHistory(res.data || []);
      setTotalPages(res.totalPages || 1);
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to load game summary.');
    } finally {
      setLoading(false);
    }
  };

  // Compute summary stats
  const totalGames = history.length;
  const totalSpent = history.reduce((sum, h) => sum + (h.playedAmount || 0), 0);
  const totalPaid = history.reduce((sum, h) => sum + (h.paidAmount || 0), 0);
  const totalDiscount = history.reduce((sum, h) => sum + (h.discount || 0), 0);
  // Group by game type
  const gamesByType: { [type: number]: LotteryGamePlay[] } = {};
  history.forEach((h) => {
    if (!gamesByType[h.lotteryGameType]) gamesByType[h.lotteryGameType] = [];
    gamesByType[h.lotteryGameType].push(h);
  });

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
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <>
          <Card elevation={3} sx={{ mb: 4 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Assessment sx={{ fontSize: 48, color: 'primary.main' }} />
                <Typography variant="h5" fontWeight="bold">Your Lottery Game Stats</Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="subtitle2" color="text.secondary">Total Games Played</Typography>
                  <Typography variant="h6" fontWeight="bold">{totalGames}</Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="subtitle2" color="text.secondary">Total Spent</Typography>
                  <Typography variant="h6" fontWeight="bold" color="error">₹{totalSpent.toLocaleString()}</Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="subtitle2" color="text.secondary">Total Paid</Typography>
                  <Typography variant="h6" fontWeight="bold" color="success.main">₹{totalPaid.toLocaleString()}</Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="subtitle2" color="text.secondary">Total Discount</Typography>
                  <Typography variant="h6" fontWeight="bold" color="info.main">₹{totalDiscount.toLocaleString()}</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>Stats by Game Type</Typography>
              <Grid container spacing={2}>
                {Object.entries(gamesByType).map(([type, games]) => (
                  <Grid item xs={12} sm={6} key={type}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle1" fontWeight="bold">Game Type: {type}</Typography>
                        <Typography variant="body2">Games Played: {games.length}</Typography>
                        <Typography variant="body2">Total Spent: ₹{games.reduce((sum, h) => sum + (h.playedAmount || 0), 0).toLocaleString()}</Typography>
                        <Typography variant="body2">Total Paid: ₹{games.reduce((sum, h) => sum + (h.paidAmount || 0), 0).toLocaleString()}</Typography>
                        <Typography variant="body2">Total Discount: ₹{games.reduce((sum, h) => sum + (h.discount || 0), 0).toLocaleString()}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
                {Object.keys(gamesByType).length === 0 && (
                  <Grid item xs={12}>
                    <Typography color="text.secondary">No game data available.</Typography>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>
        </>
      )}
    </Container>
  );
};

export default LotteryGameSummery; 