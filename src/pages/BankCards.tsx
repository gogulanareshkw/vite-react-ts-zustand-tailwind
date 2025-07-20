import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useStore } from '../store/useStore';
import type { BankCard } from '../types';

const BankCards: React.FC = () => {
  const {
    userBankCards,
    setUserBankCards,
    api,
    isLoading,
    setLoading,
    notification,
  } = useStore();

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Partial<BankCard>>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLocalLoading] = useState(false);

  // Fetch cards on mount
  useEffect(() => {
    const fetchCards = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.getUserBankCards();
        if (res.success && res.data) {
          setUserBankCards(res.data);
        } else {
          setError(res.message || 'Failed to fetch bank cards');
        }
      } catch (e: any) {
        setError(e?.response?.data?.message || 'Failed to fetch bank cards');
      } finally {
        setLoading(false);
      }
    };
    fetchCards();
    // eslint-disable-next-line
  }, []);

  const handleOpen = () => {
    setForm({});
    setError(null);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setForm({});
    setError(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = async () => {
    setLocalLoading(true);
    setError(null);
    try {
      // Basic validation
      if (!form.cardType || !form.cardNumber || !form.cardHolderName || !form.bankName || !form.accountNumber) {
        setError('Please fill all required fields.');
        setLocalLoading(false);
        return;
      }
      const res = await api.createBankCard(form);
      if (res.success && res.data) {
        setUserBankCards([res.data, ...userBankCards]);
        notification.show('Bank card added successfully', 'success');
        handleClose();
      } else {
        setError(res.message || 'Failed to add card');
      }
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to add card');
    } finally {
      setLocalLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this card?')) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.deleteBankCard(id);
      if (res.success) {
        setUserBankCards(userBankCards.filter((c) => c._id !== id));
        notification.show('Bank card deleted', 'success');
      } else {
        setError(res.message || 'Failed to delete card');
      }
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to delete card');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
        <Typography variant="h4" fontWeight="bold">Bank Cards</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpen}>
          Add Card
        </Button>
      </Box>
      {isLoading && <Box display="flex" justifyContent="center" my={4}><CircularProgress /></Box>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Grid container spacing={3}>
        {userBankCards.length === 0 && !isLoading && (
          <Grid item xs={12}>
            <Typography color="text.secondary">No bank cards found. Add your first card.</Typography>
          </Grid>
        )}
        {userBankCards.map((card) => (
          <Grid item xs={12} sm={6} md={4} key={card._id}>
            <Card>
              <CardContent>
                <Typography variant="subtitle1" fontWeight="bold">{card.cardType} ({card.bankName})</Typography>
                <Typography variant="body2" color="text.secondary">
                  **** **** **** {card.cardNumber.slice(-4)}
                </Typography>
                <Typography variant="body2">Holder: {card.cardHolderName}</Typography>
                <Typography variant="body2">Account: ****{card.accountNumber.slice(-4)}</Typography>
                {card.isDefault && <Typography color="primary" fontWeight="bold">Default</Typography>}
              </CardContent>
              <CardActions>
                <IconButton color="error" onClick={() => handleDelete(card._id)}>
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      {/* Add Card Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Add Bank Card</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField
              label="Card Type"
              name="cardType"
              value={form.cardType || ''}
              onChange={handleChange}
              required
              placeholder="Visa, MasterCard, etc."
            />
            <TextField
              label="Card Number"
              name="cardNumber"
              value={form.cardNumber || ''}
              onChange={handleChange}
              required
              inputProps={{ maxLength: 16 }}
              placeholder="1234 5678 9012 3456"
            />
            <TextField
              label="Card Holder Name"
              name="cardHolderName"
              value={form.cardHolderName || ''}
              onChange={handleChange}
              required
            />
            <TextField
              label="Bank Name"
              name="bankName"
              value={form.bankName || ''}
              onChange={handleChange}
              required
            />
            <TextField
              label="Account Number"
              name="accountNumber"
              value={form.accountNumber || ''}
              onChange={handleChange}
              required
              inputProps={{ maxLength: 20 }}
            />
            <TextField
              label="IFSC Code"
              name="ifscCode"
              value={form.ifscCode || ''}
              onChange={handleChange}
              placeholder="(optional)"
            />
            {error && <Alert severity="error">{error}</Alert>}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>Cancel</Button>
          <Button onClick={handleAdd} variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Add Card'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default BankCards; 
