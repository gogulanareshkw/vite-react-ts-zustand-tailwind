import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Card, CardContent, Button, MenuItem, Select, FormControl, InputLabel, Grid, CircularProgress, Alert, Divider, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ArrowBack, EmojiEvents } from '@mui/icons-material';
import { useStore } from '../store/useStore';
import type { LotteryGameResult, LotteryGameSetting, WinnerDetail } from '../types';

const LotteryGameResults: React.FC = () => {
  const navigate = useNavigate();
  const { api } = useStore();
  const [gameTypes, setGameTypes] = useState<LotteryGameSetting[]>([]);
  const [selectedType, setSelectedType] = useState<number>(0);
  const [results, setResults] = useState<LotteryGameResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchGameTypes();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (selectedType !== 0) fetchResults(selectedType);
    // eslint-disable-next-line
  }, [selectedType]);

  const fetchGameTypes = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getLotteryGameSettings();
      if (res.success && res.data) {
        setGameTypes(res.data);
        if (res.data.length > 0) setSelectedType(res.data[0].lotteryGameType);
      } else {
        setError(res.message || 'Failed to fetch game types');
      }
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to fetch game types');
    } finally {
      setLoading(false);
    }
  };

  const fetchResults = async (type: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getLotteryGameResults(type);
      if (res.success && res.data) {
        setResults(res.data);
      } else {
        setError(res.message || 'Failed to fetch results');
      }
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to fetch results');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={() => navigate('/my-profile')}
          sx={{ mb: 2 }}
        >
          Back to My Profile
        </Button>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Lottery Game Results
        </Typography>
      </Box>
      <Card elevation={3} sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <EmojiEvents sx={{ fontSize: 48, color: 'primary.main' }} />
            <Typography variant="h5" fontWeight="bold">Recent Results</Typography>
          </Box>
          <Divider sx={{ my: 2 }} />
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel id="game-type-label">Game Type</InputLabel>
            <Select
              labelId="game-type-label"
              value={selectedType}
              label="Game Type"
              onChange={e => setSelectedType(Number(e.target.value))}
            >
              {gameTypes.map(gt => (
                <MenuItem key={gt.lotteryGameType} value={gt.lotteryGameType}>
                  {`Game Type ${gt.lotteryGameType}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : (
            <Grid container spacing={3}>
              {results.length === 0 ? (
                <Grid item xs={12}>
                  <Typography color="text.secondary">No results available for this game type.</Typography>
                </Grid>
              ) : (
                results.map(result => (
                  <Grid item xs={12} sm={6} key={result._id}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle1" fontWeight="bold">
                          Game #{result.gameNumber} — {new Date(result.drawDate).toLocaleDateString()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          Result: <b>{result.result}</b>
                        </Typography>
                        <Divider sx={{ my: 1 }} />
                        <Typography variant="body2" fontWeight="bold" sx={{ mb: 1 }}>Winners:</Typography>
                        {result.winners?.details?.length > 0 ? (
                          result.winners.details.map((winner: WinnerDetail) => (
                            <Box key={winner._id} sx={{ mb: 1, pl: 1 }}>
                              <Chip label={`Ticket: ${winner.ticketNumber}`} size="small" sx={{ mr: 1 }} />
                              <Chip label={`Win: ₹${winner.finalWinningAmount.toLocaleString()}`} color="success" size="small" />
                            </Box>
                          ))
                        ) : (
                          <Typography variant="body2" color="text.secondary">No winners for this draw.</Typography>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              )}
            </Grid>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default LotteryGameResults; 
