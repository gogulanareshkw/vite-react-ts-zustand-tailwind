import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Card, CardContent, Button, TextField, MenuItem, Grid, Alert, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ArrowBack, ConfirmationNumber } from '@mui/icons-material';
import { useStore } from '../store/useStore';
import type { LotteryGameSetting, LotteryGamePermission, PlayLotteryGameRequest } from '../types';

const GAME_TYPES = [
  { value: 1, label: 'Thailand Lottery' },
  { value: 2, label: 'Bangkok Weekly' },
  { value: 3, label: 'Dubai Daily' },
  { value: 4, label: 'London Weekly' },
  { value: 5, label: 'Mexico Monthly' },
];

const BuyFullLotteryTicket: React.FC = () => {
  const navigate = useNavigate();
  const { api, notification, user } = useStore();
  const [selectedGameType, setSelectedGameType] = useState(1);
  const [settings, setSettings] = useState<LotteryGameSetting | null>(null);
  const [permissions, setPermissions] = useState<LotteryGamePermission | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [ticketNumber, setTicketNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [gameNumber, setGameNumber] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadGameData();
    // eslint-disable-next-line
  }, [selectedGameType]);

  const loadGameData = async () => {
    setLoading(true);
    try {
      const [settingsRes, permissionsRes] = await Promise.all([
        api.getLotteryGameSettings(),
        api.getLotteryGamePermissions()
      ]);
      setSettings(settingsRes.data?.find((s: LotteryGameSetting) => s.lotteryGameType === selectedGameType) || null);
      setPermissions(permissionsRes.data?.find((p: LotteryGamePermission) => p.lotteryGameType === selectedGameType) || null);
    } catch (e) {
      setError('Failed to load game settings.');
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    setError(null);
    if (!gameNumber || gameNumber.length < 3) return 'Game number is required (min 3 chars).';
    if (!ticketNumber || ticketNumber.length !== 6) return 'Ticket number must be 6 digits.';
    if (!amount || isNaN(Number(amount)) || Number(amount) < (settings?.minimumAmountForPlay || 0)) return `Minimum amount is ${settings?.minimumAmountForPlay || 0}.`;
    if (!permissions?.canPlayLotteryGame || !permissions?.isAvailableLotteryGame) return 'Lottery game is not available.';
    if (user && Number(user.availableAmount) < Number(amount)) return 'Insufficient balance.';
    return null;
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
        lotteryGameType: selectedGameType,
        playingGameType: 'FirstPrize',
        gameNumber,
        numbers: [{ number: ticketNumber, straight: Number(amount), rumble: 0 }],
        playedAmount: Number(amount),
        isOriginalTicket: true,
      };
      await api.playLotteryGame(req);
      setSuccess('Your full ticket has been purchased!');
      setTicketNumber('');
      setAmount('');
      setGameNumber('');
      notification.show('Full lottery ticket purchased successfully!', 'success');
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to buy full ticket.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}><CircularProgress /></Box>;
  }

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
        <CardContent sx={{ p: 4 }}>
          <form onSubmit={handleSubmit}>
            <Box sx={{ mt: 2 }}>
              <TextField
                select
                label="Lottery Game Type"
                value={selectedGameType}
                onChange={(e) => setSelectedGameType(Number(e.target.value))}
                fullWidth
              >
                {GAME_TYPES.map((g) => (
                  <MenuItem key={g.value} value={g.value}>{g.label}</MenuItem>
                ))}
              </TextField>
            </Box>
            <Box sx={{ mt: 2 }}>
              <TextField
                label="Game Number"
                value={gameNumber}
                onChange={(e) => setGameNumber(e.target.value)}
                fullWidth
                required
              />
            </Box>
            <Box sx={{ mt: 2 }}>
              <TextField
                label="Ticket Number (6 digits)"
                value={ticketNumber}
                onChange={(e) => setTicketNumber(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                fullWidth
                required
                inputProps={{ maxLength: 6 }}
              />
            </Box>
            <Box sx={{ mt: 2 }}>
              <TextField
                label="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
                fullWidth
                required
                type="number"
                inputProps={{ min: settings?.minimumAmountForPlay || 0 }}
              />
            </Box>
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1">Total Payable: <b>₹{amount || 0}</b></Typography>
            </Box>
            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button type="submit" variant="contained" color="success" size="large" disabled={submitting}>
                {submitting ? <CircularProgress size={24} /> : 'Buy Ticket'}
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
};

export default BuyFullLotteryTicket; 