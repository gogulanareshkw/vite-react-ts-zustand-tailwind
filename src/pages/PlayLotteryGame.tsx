import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Container, Typography, Box, Card, CardContent, Button, TextField, MenuItem, Grid, Alert, CircularProgress } from '@mui/material';
import { ArrowBack, Casino } from '@mui/icons-material';
import type { LotteryGameSetting, LotteryGamePermission, PlayLotteryGameRequest } from '../types';

const GAME_TYPES = [
  { value: 'FirstPrize', label: 'First Prize', numberLength: 6 },
  { value: 'ThreeUp', label: 'Three Up', numberLength: 3 },
  { value: 'TwoUp', label: 'Two Up', numberLength: 2 },
  { value: 'TwoDown', label: 'Two Down', numberLength: 2 },
  { value: 'ThreeUpSingle', label: 'Three Up Single', numberLength: 1 },
  { value: 'TwoUpSingle', label: 'Two Up Single', numberLength: 1 },
  { value: 'TwoDownSingle', label: 'Two Down Single', numberLength: 1 },
  { value: 'ThreeUpTotal', label: 'Three Up Total', numberLength: 1 },
  { value: 'TwoUpTotal', label: 'Two Up Total', numberLength: 1 },
  { value: 'TwoDownTotal', label: 'Two Down Total', numberLength: 1 },
];

const PlayLotteryGame: React.FC = () => {
  const { lotteryGameType } = useParams();
  const navigate = useNavigate();
  const { api, notification, user } = useStore();
  const [settings, setSettings] = useState<LotteryGameSetting | null>(null);
  const [permissions, setPermissions] = useState<LotteryGamePermission | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [gameType, setGameType] = useState('FirstPrize');
  const [gameNumber, setGameNumber] = useState('');
  const [numbers, setNumbers] = useState([{ number: '', straight: '', rumble: '' }]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadGameData();
    // eslint-disable-next-line
  }, [lotteryGameType]);

  const loadGameData = async () => {
    setLoading(true);
    try {
      const [settingsRes, permissionsRes] = await Promise.all([
        api.getLotteryGameSettings(),
        api.getLotteryGamePermissions()
      ]);
      setSettings(settingsRes.data?.find((s: LotteryGameSetting) => s.lotteryGameType === Number(lotteryGameType)) || null);
      setPermissions(permissionsRes.data?.find((p: LotteryGamePermission) => p.lotteryGameType === Number(lotteryGameType)) || null);
    } catch (e) {
      setError('Failed to load game settings.');
    } finally {
      setLoading(false);
    }
  };

  const handleNumberChange = (idx: number, field: string, value: string) => {
    setNumbers((prev) => prev.map((n, i) => i === idx ? { ...n, [field]: value } : n));
  };

  const addRow = () => setNumbers((prev) => [...prev, { number: '', straight: '', rumble: '' }]);
  const removeRow = (idx: number) => setNumbers((prev) => prev.filter((_, i) => i !== idx));

  const validate = () => {
    setError(null);
    if (!gameNumber || gameNumber.length < 3) return 'Game number is required (min 3 chars).';
    const typeObj = GAME_TYPES.find((g) => g.value === gameType);
    if (!typeObj) return 'Invalid game type.';
    for (const n of numbers) {
      if (!n.number || n.number.length !== typeObj.numberLength) return `Each number must be ${typeObj.numberLength} digits.`;
      if (!n.straight && !n.rumble) return 'Enter straight or rumble amount.';
      if (n.straight && isNaN(Number(n.straight))) return 'Straight must be a number.';
      if (n.rumble && isNaN(Number(n.rumble))) return 'Rumble must be a number.';
      if (settings && Number(n.straight) < settings.minimumAmountForPlay && Number(n.rumble) < settings.minimumAmountForPlay) return `Minimum amount is ${settings.minimumAmountForPlay}.`;
    }
    if (!permissions?.canPlayLotteryGame || !permissions?.isAvailableLotteryGame) return 'Lottery game is not available.';
    if (user && user.availableAmount < totalPayable()) return 'Insufficient balance.';
    return null;
  };

  const totalPayable = () => {
    let total = 0;
    for (const n of numbers) {
      total += Number(n.straight || 0) + Number(n.rumble || 0);
    }
    // TODO: apply discounts if needed
    return total;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    setSubmitting(true);
    try {
      const req: PlayLotteryGameRequest = {
        lotteryGameType: Number(lotteryGameType),
        playingGameType: gameType,
        gameNumber,
        numbers: numbers.map((n) => ({ number: n.number, straight: Number(n.straight) || 0, rumble: Number(n.rumble) || 0 })),
        playedAmount: totalPayable(),
        isOriginalTicket: false,
      };
      await api.playLotteryGame(req);
      setSuccess('Your ticket has been submitted!');
      setNumbers([{ number: '', straight: '', rumble: '' }]);
      setGameNumber('');
      notification.show('Lottery game played successfully!', 'success');
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to play lottery game.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}><CircularProgress /></Box>;
  }

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
          Game Type: {settings?.lotteryGameType}
        </Typography>
      </Box>
      <Card elevation={3}>
        <CardContent sx={{ p: 4 }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField
                  select
                  label="Game Type"
                  value={gameType}
                  onChange={(e) => setGameType(e.target.value)}
                  fullWidth
                >
                  {GAME_TYPES.map((g) => (
                    <MenuItem key={g.value} value={g.value}>{g.label}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Game Number"
                  value={gameNumber}
                  onChange={(e) => setGameNumber(e.target.value)}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Button variant="contained" color="primary" onClick={addRow} fullWidth>Add Number</Button>
              </Grid>
            </Grid>
            <Box sx={{ mt: 3 }}>
              {numbers.map((n, idx) => (
                <Grid container spacing={2} alignItems="center" key={idx} sx={{ mb: 1 }}>
                  <Grid item xs={12} md={3}>
                    <TextField
                      label={`Number #${idx + 1}`}
                      value={n.number}
                      onChange={(e) => handleNumberChange(idx, 'number', e.target.value)}
                      fullWidth
                      inputProps={{ maxLength: GAME_TYPES.find((g) => g.value === gameType)?.numberLength || 6 }}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField
                      label="Straight"
                      value={n.straight}
                      onChange={(e) => handleNumberChange(idx, 'straight', e.target.value)}
                      fullWidth
                      type="number"
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField
                      label="Rumble"
                      value={n.rumble}
                      onChange={(e) => handleNumberChange(idx, 'rumble', e.target.value)}
                      fullWidth
                      type="number"
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Button color="error" onClick={() => removeRow(idx)} disabled={numbers.length === 1} fullWidth>Remove</Button>
                  </Grid>
                </Grid>
              ))}
            </Box>
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1">Total Payable: <b>₹{totalPayable()}</b></Typography>
            </Box>
            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button type="submit" variant="contained" color="success" size="large" disabled={submitting}>
                {submitting ? <CircularProgress size={24} /> : 'Play Now'}
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
};

export default PlayLotteryGame; 