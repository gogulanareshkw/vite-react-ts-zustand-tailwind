import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Switch,
  FormControlLabel,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Divider,
  Grid,
} from '@mui/material';
import {
  AccountBalanceWallet,
  Download,
  FilterList,
  TrendingUp,
  TrendingDown,
} from '@mui/icons-material';
import { useStore } from '../store/useStore';
import { useParams } from 'react-router-dom';

interface WalletTransaction {
  _id: string;
  amount: number;
  createdDate: string;
  description: string;
  type: 'credit' | 'debit';
  isBonus?: boolean;
}

const WalletHistory: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user, api, notification } = useStore();
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showOnlyBonus, setShowOnlyBonus] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchWalletHistory();
    }
  }, [userId]);

  useEffect(() => {
    if (showOnlyBonus) {
      setFilteredTransactions(transactions.filter(tx => tx.isBonus));
    } else {
      setFilteredTransactions(transactions);
    }
  }, [showOnlyBonus, transactions]);

  const fetchWalletHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Mock data for now - replace with actual API call
      const mockTransactions: WalletTransaction[] = [
        {
          _id: '1',
          amount: 100.00,
          createdDate: '2024-01-15T10:30:00Z',
          description: 'Recharge from Bank Card',
          type: 'credit',
          isBonus: false,
        },
        {
          _id: '2',
          amount: 25.00,
          createdDate: '2024-01-14T15:45:00Z',
          description: 'Referral Bonus',
          type: 'credit',
          isBonus: true,
        },
        {
          _id: '3',
          amount: 50.00,
          createdDate: '2024-01-13T09:20:00Z',
          description: 'Lottery Game Purchase',
          type: 'debit',
          isBonus: false,
        },
        {
          _id: '4',
          amount: 15.00,
          createdDate: '2024-01-12T14:15:00Z',
          description: 'Welcome Bonus',
          type: 'credit',
          isBonus: true,
        },
        {
          _id: '5',
          amount: 75.00,
          createdDate: '2024-01-11T11:30:00Z',
          description: 'Agent Commission',
          type: 'credit',
          isBonus: false,
        },
      ];

      setTransactions(mockTransactions);
      setFilteredTransactions(mockTransactions);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch wallet history');
      notification.show('Failed to fetch wallet history', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      setDownloading(true);
      
      // Create CSV content
      const csvContent = [
        ['Amount', 'Created Date', 'Description'],
        ...filteredTransactions.map(tx => [
          tx.amount.toFixed(2),
          new Date(tx.createdDate).toLocaleDateString(),
          tx.description
        ])
      ].map(row => row.join(',')).join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `wallet_history_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      notification.show('Wallet history downloaded successfully!', 'success');
    } catch (err: any) {
      notification.show('Failed to download wallet history', 'error');
    } finally {
      setDownloading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatAmount = (amount: number) => {
    return `฿${amount.toFixed(2)}`;
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1, color: 'primary.main' }}>
          Wallet History
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track your wallet transactions and balance
        </Typography>
      </Box>

      {/* Available Balance Card */}
      <Card sx={{ mb: 4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <CardContent sx={{ p: 4 }}>
          <Grid container alignItems="center" spacing={3}>
            <Grid item>
              <AccountBalanceWallet sx={{ fontSize: 60, opacity: 0.9 }} />
            </Grid>
            <Grid item xs>
              <Typography variant="h6" sx={{ opacity: 0.9, mb: 1 }}>
                Available Balance
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                {formatAmount(user?.availableAmount || 0)}
              </Typography>
            </Grid>
            <Grid item>
              <Chip
                label={`${filteredTransactions.length} Transactions`}
                sx={{ 
                  bgcolor: 'rgba(255,255,255,0.2)', 
                  color: 'white',
                  fontSize: '1rem',
                  py: 1
                }}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Controls Section */}
      <Card sx={{ mb: 4 }}>
        <CardContent sx={{ p: 3 }}>
          <Grid container alignItems="center" justifyContent="space-between" spacing={2}>
            <Grid item>
              <FormControlLabel
                control={
                  <Switch
                    checked={showOnlyBonus}
                    onChange={(e) => setShowOnlyBonus(e.target.checked)}
                    color="primary"
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FilterList color="primary" />
                    <Typography variant="body1" fontWeight={500}>
                      Show Only Bonus History
                    </Typography>
                  </Box>
                }
              />
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                startIcon={downloading ? <CircularProgress size={20} /> : <Download />}
                onClick={handleDownload}
                disabled={downloading || filteredTransactions.length === 0}
                sx={{ minWidth: 150 }}
              >
                {downloading ? 'Downloading...' : 'Download CSV'}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Transaction History
              {showOnlyBonus && (
                <Chip
                  label="Bonus Only"
                  color="secondary"
                  size="small"
                  sx={{ ml: 2 }}
                />
              )}
            </Typography>
          </Box>
          
          {filteredTransactions.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary">
                {showOnlyBonus ? 'No bonus transactions found' : 'No transactions found'}
              </Typography>
            </Box>
          ) : (
            <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'background.default' }}>
                    <TableCell sx={{ fontWeight: 'bold' }}>Amount</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Created Date</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredTransactions.map((transaction) => (
                    <TableRow key={transaction._id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {transaction.type === 'credit' ? (
                            <TrendingUp color="success" fontSize="small" />
                          ) : (
                            <TrendingDown color="error" fontSize="small" />
                          )}
                          <Typography
                            variant="body1"
                            sx={{
                              fontWeight: 'bold',
                              color: transaction.type === 'credit' ? 'success.main' : 'error.main'
                            }}
                          >
                            {transaction.type === 'credit' ? '+' : '-'}{formatAmount(transaction.amount)}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatDate(transaction.createdDate)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ maxWidth: 300 }}>
                          {transaction.description}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default WalletHistory; 