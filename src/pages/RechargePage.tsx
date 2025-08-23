import React, { useState } from 'react';
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
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  ArrowBack,
  AccountBalance,
  CreditCard,
  Payment,
  CheckCircle,
} from '@mui/icons-material';
import { useStore } from '../store/useStore';
import apiService from '../services/api';

const RechargePage: React.FC = () => {
  const navigate = useNavigate();
  const { addNotification, setLoading } = useStore();

  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const paymentMethods = [
    {
      id: 'upi',
      name: 'UPI Payment',
      icon: <Payment sx={{ fontSize: 32, color: 'primary.main' }} />,
      description: 'Pay using UPI apps like Google Pay, PhonePe, Paytm',
      minAmount: 100,
      maxAmount: 50000,
    },
    {
      id: 'bank_transfer',
      name: 'Bank Transfer',
      icon: <AccountBalance sx={{ fontSize: 32, color: 'success.main' }} />,
      description: 'Direct bank transfer to our account',
      minAmount: 500,
      maxAmount: 100000,
    },
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: <CreditCard sx={{ fontSize: 32, color: 'secondary.main' }} />,
      description: 'Pay using credit or debit card',
      minAmount: 100,
      maxAmount: 25000,
    },
  ];

  const quickAmounts = [100, 500, 1000, 2000, 5000, 10000];

  const handleAmountChange = (value: string) => {
    setAmount(value);
    if (!value) {
      setPaymentMethod('');
    }
    if (error) setError('');
    if (success) setSuccess(false);
  };

  const handleQuickAmount = (quickAmount: number) => {
    setAmount(quickAmount.toString());
    if (error) setError('');
    if (success) setSuccess(false);
  };

  const validateForm = () => {
    const numAmount = parseFloat(amount);
    
    if (!amount || numAmount <= 0) {
      setError('Please enter a valid amount');
      return false;
    }

    if (!paymentMethod) {
      setError('Please select a payment method');
      return false;
    }

    const selectedMethod = paymentMethods.find(m => m.id === paymentMethod);
    if (selectedMethod) {
      if (numAmount < selectedMethod.minAmount) {
        setError(`Minimum amount for ${selectedMethod.name} is ₹${selectedMethod.minAmount}`);
        return false;
      }
      if (numAmount > selectedMethod.maxAmount) {
        setError(`Maximum amount for ${selectedMethod.name} is ₹${selectedMethod.maxAmount}`);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setShowConfirmDialog(true);
  };

  const confirmRecharge = async () => {
    setShowConfirmDialog(false);
    setIsLoading(true);
    setLoading(true);
    setError('');

    try {
      await apiService.createRecharge({
        amount: parseFloat(amount),
        paymentMethod,
      });
      
      setSuccess(true);
      addNotification({
        message: `Recharge request of ₹${amount} created successfully!`,
        type: 'success',
      });
      
      // Clear form
      setAmount('');
      setPaymentMethod('');
      
    } catch (error: any) {
      // Error will be handled by API service and shown as snackbar automatically
      console.error('Recharge error:', error);
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
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
          Recharge Account
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Add money to your account to play lottery games
        </Typography>
      </Box>

      <Box>
        {/* Recharge Form */}
        <Box>
          <Card elevation={4}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                Recharge Amount
              </Typography>

              {success && (
                <Alert 
                  severity="success" 
                  sx={{ mb: 3 }}
                  icon={<CheckCircle />}
                >
                  Recharge request submitted successfully! You will receive a confirmation shortly.
                </Alert>
              )}

              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom>
                  Quick Amount Selection
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {quickAmounts.map((quickAmount) => (
                    <Chip
                      key={quickAmount}
                      label={`₹${quickAmount}`}
                      onClick={() => handleQuickAmount(quickAmount)}
                      variant={amount === quickAmount.toString() ? 'filled' : 'outlined'}
                      color={amount === quickAmount.toString() ? 'primary' : 'default'}
                      sx={{ cursor: 'pointer' }}
                    />
                  ))}
                </Box>
              </Box>

              <TextField
                label="Amount (₹)"
                variant="outlined"
                fullWidth
                required
                type="number"
                value={amount}
                onChange={(e) => handleAmountChange(e.target.value)}
                InputProps={{
                  startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography>,
                }}
                sx={{ mb: 4 }}
              />

              {amount && parseFloat(amount) > 0 && (
                <>
                  <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                    Select Payment Method
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}>
                    {paymentMethods.map((method) => (
                      <Card
                        key={method.id}
                        variant="outlined"
                        sx={{
                          cursor: 'pointer',
                          border: paymentMethod === method.id ? 2 : 1,
                          borderColor: paymentMethod === method.id ? 'primary.main' : 'divider',
                          '&:hover': {
                            borderColor: 'primary.main',
                          },
                        }}
                        onClick={() => setPaymentMethod(method.id)}
                      >
                        <CardContent sx={{ p: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            {method.icon}
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                {method.name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {method.description}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Min: ₹{method.minAmount} | Max: ₹{method.maxAmount}
                              </Typography>
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                </>
              )}

              <Button
                variant="contained"
                size="large"
                fullWidth
                disabled={isLoading || !amount || !paymentMethod}
                onClick={handleSubmit}
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  py: 1.5,
                  fontWeight: 'bold',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                  },
                }}
              >
                {isLoading ? 'Processing...' : 'Proceed to Recharge'}
              </Button>
            </CardContent>
          </Card>
        </Box>

      </Box>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onClose={() => setShowConfirmDialog(false)}>
        <DialogTitle>Confirm Recharge</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to recharge ₹{amount} using {paymentMethods.find(m => m.id === paymentMethod)?.name}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowConfirmDialog(false)}>Cancel</Button>
          <Button onClick={confirmRecharge} variant="contained">Confirm</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default RechargePage; 
