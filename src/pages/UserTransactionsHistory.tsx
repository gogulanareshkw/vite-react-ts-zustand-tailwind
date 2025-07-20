import React, { useEffect, useState } from 'react';
import { Container, Typography, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, TextField, MenuItem, Pagination, CircularProgress, Alert, Chip } from '@mui/material';
import { useStore } from '../store/useStore';

interface Transaction {
  _id: string;
  type: string;
  amount: number;
  status: string;
  description: string;
  createdDateTime: string;
}

const TRANSACTION_TYPES = [
  { value: '', label: 'All Types' },
  { value: 'recharge', label: 'Recharge' },
  { value: 'withdraw', label: 'Withdraw' },
  { value: 'play', label: 'Play' },
  { value: 'bonus', label: 'Bonus' },
];

const STATUS_TYPES = [
  { value: '', label: 'All Statuses' },
  { value: 'success', label: 'Success' },
  { value: 'pending', label: 'Pending' },
  { value: 'failed', label: 'Failed' },
];

const UserTransactionsHistory: React.FC = () => {
  const { api } = useStore();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const pageSize = 10;

  useEffect(() => {
    fetchTransactions();
    // eslint-disable-next-line
  }, [page, typeFilter, statusFilter]);

  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);
    try {
      // Only type and status filter are supported for now
      const params: any = { type: typeFilter, status: statusFilter };
      const response = await api.getUserTransactionsHistory(page, pageSize, params);
      setTransactions(response.transactions || []);
      setTotalPages(response.totalPages || 1);
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to load transactions history.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusChip = (status: string) => {
    switch (status.toLowerCase()) {
      case 'success':
        return <Chip label="Success" color="success" size="small" />;
      case 'pending':
        return <Chip label="Pending" color="warning" size="small" />;
      case 'failed':
        return <Chip label="Failed" color="error" size="small" />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center' }}>
        Transactions History
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
            <TextField
              select
              label="Status"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              sx={{ minWidth: 120 }}
            >
              {STATUS_TYPES.map(opt => (
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
                    <TableCell>Type</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell align="right">Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">No transactions found.</TableCell>
                    </TableRow>
                  ) : (
                    transactions.map(txn => (
                      <TableRow key={txn._id}>
                        <TableCell>{new Date(txn.createdDateTime).toLocaleString()}</TableCell>
                        <TableCell>{txn.type}</TableCell>
                        <TableCell>{txn.description}</TableCell>
                        <TableCell align="right" style={{ color: txn.amount >= 0 ? 'green' : 'red' }}>
                          {txn.amount >= 0 ? '+' : ''}{txn.amount.toLocaleString()}
                        </TableCell>
                        <TableCell align="right">{getStatusChip(txn.status)}</TableCell>
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

export default UserTransactionsHistory; 
