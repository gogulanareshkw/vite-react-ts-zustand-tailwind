import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Alert,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Chip,
  Divider,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  AccountBalance,
  CreditCard,
  Payment,
  ArrowBack,
  Add,
  Warning,
} from '@mui/icons-material';
import { useStore } from '../store/useStore';
import apiService from '../services/api';

const WithDrawPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, addNotification, setLoading, getUserBalance } = useStore();

  const [amount, setAmount] = useState('');
  const [selectedCard, setSelectedCard] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [withdrawalHistory, setWithdrawalHistory] = useState<any[]>([]);
  const [bankCards, setBankCards] = useState<any[]>([]);
  const [showAddCardDialog, setShowAddCardDialog] = useState(false);

  useEffect(() => {
    loadBankCards();
    loadWithdrawalHistory();
  }, []);

  const loadBankCards = async () => {
    try {
      const response = await apiService.getUserBankCards();
      if (response.success) {
        setBankCards(response.data || []);
        if (response.data?.length > 0) {
          setSelectedCard(response.data[0]._id);
        }
      }
    } catch (error) {
      console.error('Failed to load bank cards:', error);
    }
  };

  const loadWithdrawalHistory = async () => {
    try {
      const response = await apiService.getUserWithdrawals(1, 5);
      if (response.success) {
        setWithdrawalHistory(response.data || []);
      }
    } catch (error) {
      console.error('Failed to load withdrawal history:', error);
    }
  };

  const handleAmountChange = (value: string) => {
    const numValue = parseFloat(value);
    const currentBalance = getUserBalance();
    
    if (value === '' || (numValue >= 0 && numValue <= currentBalance)) {
      setAmount(value);
      if (error) setError('');
    } else if (numValue > currentBalance) {
      setError('Amount cannot exceed your available balance');
    }
  };

  const handleCardChange = (cardId: string) => {
    setSelectedCard(cardId);
    if (error) setError('');
  };

  const validateForm = () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return false;
    }

    const amountNum = parseFloat(amount);
    const currentBalance = getUserBalance();

    if (amountNum > currentBalance) {
      setError('Amount cannot exceed your available balance');
      return false;
    }

    if (amountNum < 100) {
      setError('Minimum withdrawal amount is ₹100');
      return false;
    }

    if (amountNum > 50000) {
      setError('Maximum withdrawal amount is ₹50,000');
      return false;
    }

    if (!selectedCard) {
      setError('Please select a bank card');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setLoading(true);
    setError('');

    try {
      const response = await apiService.createWithdraw({
        amount: parseFloat(amount),
        bankCardId: selectedCard,
      });
      
      if (response.success) {
        setSuccess(true);
        addNotification({
          message: 'Withdrawal request submitted successfully!',
          type: 'success',
        });
        
        // Clear form
        setAmount('');
        
        // Reload history
        loadWithdrawalHistory();
      } else {
        setError('Failed to create withdrawal request. Please try again.');
      }
    } catch (error) {
      const errorMessage = apiService.handleError(error);
      setError(errorMessage);
      addNotification({
        message: errorMessage,
        type: 'error',
      });
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'success';
      case 'pending': return 'warning';
      case 'failed': return 'error';
      default: return 'default';
    }
  };

  const formatCardNumber = (cardNumber: string) => {
    if (!cardNumber) return '';
    return `**** **** **** ${cardNumber.slice(-4)}`;
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Withdraw Funds
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Transfer money from your WahLotto account to your bank
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 3 }}>
        {/* Withdrawal Form */}
        <Box sx={{ flex: 1 }}>
          <Card elevation={4}>
            <CardContent sx={{ p: 4 }}>
              {success && (
                <Alert severity="success" sx={{ mb: 3 }}>
                  Withdrawal request submitted successfully! You will receive the funds within 24-48 hours.
                </Alert>
              )}

              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                  Available Balance: ₹{getUserBalance().toFixed(2)}
                </Typography>

                <TextField
                  label="Withdrawal Amount (₹)"
                  type="number"
                  value={amount}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  fullWidth
                  required
                  sx={{ mb: 3 }}
                  InputProps={{
                    startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography>,
                  }}
                />

                <FormControl component="fieldset" sx={{ mb: 3, width: '100%' }}>
                  <FormLabel component="legend" sx={{ fontWeight: 'bold', mb: 2 }}>
                    Select Bank Card
                  </FormLabel>
                  
                  {bankCards.length === 0 ? (
                    <Alert severity="info" sx={{ mb: 2 }}>
                      No bank cards found. Please add a bank card first.
                    </Alert>
                  ) : (
                    <RadioGroup
                      value={selectedCard}
                      onChange={(e) => handleCardChange(e.target.value)}
                    >
                      {bankCards.map((card) => (
                        <Card key={card._id} sx={{ mb: 2, border: selectedCard === card._id ? 2 : 1, borderColor: selectedCard === card._id ? 'primary.main' : 'divider' }}>
                          <CardContent sx={{ p: 2 }}>
                            <FormControlLabel
                              value={card._id}
                              control={<Radio />}
                              label={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                  <Box sx={{ color: 'primary.main' }}>
                                    <CreditCard />
                                  </Box>
                                  <Box>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                      {card.bankName} - {card.cardType}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                      {formatCardNumber(card.cardNumber)}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                      {card.cardHolderName}
                                    </Typography>
                                  </Box>
                                </Box>
                              }
                              sx={{ width: '100%', m: 0 }}
                            />
                          </CardContent>
                        </Card>
                      ))}
                    </RadioGroup>
                  )}

                  <Button
                    variant="outlined"
                    startIcon={<Add />}
                    onClick={() => setShowAddCardDialog(true)}
                    sx={{ mt: 2 }}
                  >
                    Add New Bank Card
                  </Button>
                </FormControl>

                <Alert severity="info" sx={{ mb: 3 }}>
                  <Typography variant="body2">
                    <strong>Processing Time:</strong> 24-48 hours<br />
                    <strong>Minimum Amount:</strong> ₹100<br />
                    <strong>Maximum Amount:</strong> ₹50,000 per transaction
                  </Typography>
                </Alert>

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  disabled={isLoading || bankCards.length === 0}
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    py: 1.5,
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                    },
                  }}
                >
                  {isLoading ? 'Processing...' : 'Submit Withdrawal Request'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Recent Withdrawals */}
        <Box sx={{ width: { xs: '100%', lg: 400 } }}>
          <Card elevation={4}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                Recent Withdrawals
              </Typography>

              {withdrawalHistory.length === 0 ? (
                <Typography variant="body2" color="text.secondary" textAlign="center">
                  No recent withdrawal transactions
                </Typography>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {withdrawalHistory.map((transaction) => (
                    <Box key={transaction._id} sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                          ₹{transaction.amount?.toFixed(2)}
                        </Typography>
                        <Chip
                          label={transaction.status}
                          color={getStatusColor(transaction.status)}
                          size="small"
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {transaction.bankCard?.bankName || 'Bank Transfer'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(transaction.createdDateTime).toLocaleDateString()}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}

              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/transactions/' + user?.userId)}
                  size="small"
                >
                  View All Transactions
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Add Bank Card Dialog */}
      <Dialog open={showAddCardDialog} onClose={() => setShowAddCardDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Bank Card</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Please add your bank card details to enable withdrawals.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            You can add bank cards from your profile settings.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddCardDialog(false)}>Cancel</Button>
          <Button onClick={() => {
            setShowAddCardDialog(false);
            navigate('/bank-cards');
          }} variant="contained">
            Go to Bank Cards
          </Button>
        </DialogActions>
      </Dialog>

      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={() => navigate('/dashboard')}
        >
          Back to Dashboard
        </Button>
      </Box>
    </Container>
  );
};

export default WithDrawPage; 