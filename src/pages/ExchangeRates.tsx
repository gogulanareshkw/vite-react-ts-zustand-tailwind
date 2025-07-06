import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Chip,
  Divider,
  IconButton,
  Tooltip,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  CurrencyExchange as ExchangeIcon,
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Info as InfoIcon,
  Calculate as CalculateIcon
} from '@mui/icons-material';
import { useStore } from '../store/useStore';

interface ExchangeRate {
  currency: string;
  code: string;
  rate: number;
  change24h: number;
  lastUpdated: string;
  symbol: string;
}

interface Currency {
  code: string;
  name: string;
  symbol: string;
}

const ExchangeRates: React.FC = () => {
  const { notification, api } = useStore();
  const [rates, setRates] = useState<ExchangeRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [showCalculator, setShowCalculator] = useState(false);
  const [fromCurrency, setFromCurrency] = useState('INR');
  const [toCurrency, setToCurrency] = useState('USD');
  const [amount, setAmount] = useState('1');
  const [convertedAmount, setConvertedAmount] = useState('');

  const currencies: Currency[] = [
    { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
    { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
    { code: 'THB', name: 'Thai Baht', symbol: '฿' }
  ];

  useEffect(() => {
    loadExchangeRates();
  }, []);

  useEffect(() => {
    calculateConversion();
  }, [amount, fromCurrency, toCurrency, rates]);

  const loadExchangeRates = async () => {
    try {
      setLoading(true);
      const response = await api.getExchangeRates();
      if (response.success) {
        setRates(response.data || []);
        setLastUpdated(new Date().toLocaleString());
      } else {
        setError('Failed to load exchange rates');
      }
    } catch (err) {
      setError('Failed to load exchange rates');
      console.error('Error loading exchange rates:', err);
      // Fallback to mock data for demo
      setRates(getMockRates());
      setLastUpdated(new Date().toLocaleString());
    } finally {
      setLoading(false);
    }
  };

  const getMockRates = (): ExchangeRate[] => {
    return [
      { currency: 'US Dollar', code: 'USD', rate: 0.012, change24h: 0.5, lastUpdated: new Date().toISOString(), symbol: '$' },
      { currency: 'Euro', code: 'EUR', rate: 0.011, change24h: -0.3, lastUpdated: new Date().toISOString(), symbol: '€' },
      { currency: 'British Pound', code: 'GBP', rate: 0.0095, change24h: 0.2, lastUpdated: new Date().toISOString(), symbol: '£' },
      { currency: 'Japanese Yen', code: 'JPY', rate: 1.78, change24h: -0.1, lastUpdated: new Date().toISOString(), symbol: '¥' },
      { currency: 'Australian Dollar', code: 'AUD', rate: 0.018, change24h: 0.8, lastUpdated: new Date().toISOString(), symbol: 'A$' },
      { currency: 'Canadian Dollar', code: 'CAD', rate: 0.016, change24h: 0.4, lastUpdated: new Date().toISOString(), symbol: 'C$' },
      { currency: 'Swiss Franc', code: 'CHF', rate: 0.0105, change24h: -0.2, lastUpdated: new Date().toISOString(), symbol: 'CHF' },
      { currency: 'Chinese Yuan', code: 'CNY', rate: 0.086, change24h: 0.1, lastUpdated: new Date().toISOString(), symbol: '¥' },
      { currency: 'Thai Baht', code: 'THB', rate: 0.42, change24h: 0.6, lastUpdated: new Date().toISOString(), symbol: '฿' }
    ];
  };

  const calculateConversion = () => {
    if (!amount || !fromCurrency || !toCurrency) {
      setConvertedAmount('');
      return;
    }

    const fromRate = rates.find(r => r.code === fromCurrency)?.rate || 1;
    const toRate = rates.find(r => r.code === toCurrency)?.rate || 1;
    
    const converted = (parseFloat(amount) * toRate) / fromRate;
    setConvertedAmount(converted.toFixed(4));
  };

  const getCurrencyName = (code: string) => {
    return currencies.find(c => c.code === code)?.name || code;
  };

  const getCurrencySymbol = (code: string) => {
    return currencies.find(c => c.code === code)?.symbol || code;
  };

  const formatChange = (change: number) => {
    const isPositive = change >= 0;
    return (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {isPositive ? (
          <TrendingUpIcon sx={{ color: 'success.main', fontSize: 16, mr: 0.5 }} />
        ) : (
          <TrendingDownIcon sx={{ color: 'error.main', fontSize: 16, mr: 0.5 }} />
        )}
        <Typography
          variant="body2"
          color={isPositive ? 'success.main' : 'error.main'}
          sx={{ fontWeight: 'bold' }}
        >
          {isPositive ? '+' : ''}{change.toFixed(2)}%
        </Typography>
      </Box>
    );
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          <ExchangeIcon sx={{ mr: 2, verticalAlign: 'middle' }} />
          Exchange Rates
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          Real-time currency exchange rates and conversion calculator
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Last updated: {lastUpdated}
          </Typography>
          <Button
            startIcon={<RefreshIcon />}
            onClick={loadExchangeRates}
            size="small"
            variant="outlined"
          >
            Refresh
          </Button>
        </Box>

        <FormControlLabel
          control={
            <Switch
              checked={showCalculator}
              onChange={(e) => setShowCalculator(e.target.checked)}
            />
          }
          label="Show Currency Calculator"
        />
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {showCalculator && (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <CalculateIcon sx={{ mr: 1 }} />
              Currency Converter
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  InputProps={{
                    startAdornment: <Typography sx={{ mr: 1 }}>{getCurrencySymbol(fromCurrency)}</Typography>
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>From Currency</InputLabel>
                  <Select
                    value={fromCurrency}
                    onChange={(e) => setFromCurrency(e.target.value)}
                    label="From Currency"
                  >
                    {currencies.map((currency) => (
                      <MenuItem key={currency.code} value={currency.code}>
                        {currency.code} - {currency.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>To Currency</InputLabel>
                  <Select
                    value={toCurrency}
                    onChange={(e) => setToCurrency(e.target.value)}
                    label="To Currency"
                  >
                    {currencies.map((currency) => (
                      <MenuItem key={currency.code} value={currency.code}>
                        {currency.code} - {currency.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            {convertedAmount && (
              <Box sx={{ mt: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                <Typography variant="h6" color="primary">
                  {amount} {fromCurrency} = {convertedAmount} {toCurrency}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Exchange rate: 1 {fromCurrency} = {(rates.find(r => r.code === toCurrency)?.rate || 1) / (rates.find(r => r.code === fromCurrency)?.rate || 1)} {toCurrency}
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Currency</TableCell>
              <TableCell align="right">Code</TableCell>
              <TableCell align="right">Rate (INR)</TableCell>
              <TableCell align="right">24h Change</TableCell>
              <TableCell align="right">Last Updated</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rates.map((rate) => (
              <TableRow key={rate.code} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                      {rate.symbol} {rate.currency}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <Chip label={rate.code} size="small" variant="outlined" />
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    ₹{rate.rate.toFixed(4)}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  {formatChange(rate.change24h)}
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2" color="text.secondary">
                    {new Date(rate.lastUpdated).toLocaleTimeString()}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
        <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
          <InfoIcon sx={{ mr: 1, fontSize: 16 }} />
          Exchange rates are updated every 5 minutes. Rates may vary slightly during high volatility periods.
        </Typography>
      </Box>
    </Container>
  );
};

export default ExchangeRates; 