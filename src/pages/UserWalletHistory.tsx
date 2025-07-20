import React, { useEffect, useState } from 'react';
import { Container, Typography, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, TextField, MenuItem, Pagination, CircularProgress, Alert } from '@mui/material';
import { useStore } from '../store/useStore';

interface WalletTransaction {
  _id: string;
  type: string;
  amount: number;
  description: string;
  createdDateTime: string;
  balanceAfter: number;
}

const TRANSACTION_TYPES = [
  { value: '', label: 'All Types' },
  { value: 'credit', label: 'Credit' },
  { value: 'debit', label: 'Debit' },
  { value: 'bonus', label: 'Bonus' },
];

const UserWalletHistory: React.FC = () => {
  const { api } = useStore();
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [typeFilter, setTypeFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const pageSize = 10;

  useEffect(() => {
    fetchTransactions();
    // eslint-disable-next-line
  }, [page, typeFilter]);

  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);
    try {
      // Only type filter is supported by backend for now
      const response = await api.getWalletHistory(page, pageSize, typeFilter);
      setTransactions(response.walletHistory || []);
      setTotalPages(response.totalPages || 1);
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to load wallet history.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center' }}>
        Wallet History
      </Typography>
      <Card elevation={3} sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
            <TextField
              select
              label="Type"
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
              sx={{ minWidth: 120 }}
            >
              {TRANSACTION_TYPES.map(opt => (
                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </TextField>
          </Box>
          {error && <Alert severity="error">{error}</Alert>}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell align="right">Balance After</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center">No transactions found.</TableCell>
                    </TableRow>
                  ) : (
                    transactions.map(txn => (
                      <TableRow key={txn._id}>
                        <TableCell>{new Date(txn.createdDateTime).toLocaleString()}</TableCell>
                        <TableCell>{txn.description}</TableCell>
                        <TableCell align="right" style={{ color: txn.amount >= 0 ? 'green' : 'red' }}>
                          {txn.amount >= 0 ? '+' : ''}{txn.amount.toLocaleString()}
                        </TableCell>
                        <TableCell align="right">{txn.balanceAfter?.toLocaleString?.() ?? '-'}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, value) => setPage(value)}
              color="primary"
            />
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default UserWalletHistory; 
