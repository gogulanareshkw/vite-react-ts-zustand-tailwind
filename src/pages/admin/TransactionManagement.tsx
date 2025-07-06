import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Pagination,
  Tooltip,
  Grid,
} from '@mui/material';
import {
  ArrowBack,
  Search,
  Visibility,
  CheckCircle,
  Cancel,
  Refresh,
  FilterList,
  Receipt,
  TrendingUp,
  TrendingDown,
} from '@mui/icons-material';
import { useStore } from '../../store/useStore';
import apiService from '../../services/api';

interface Transaction {
  _id: string;
  userId: string;
  type: 'recharge' | 'withdraw' | 'game_play' | 'winning';
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  paymentMethod?: string;
  bankCardId?: string;
  transactionId?: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

const TransactionManagement: React.FC = () => {
  const navigate = useNavigate();
  const { addNotification } = useStore();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoadingState] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [showTransactionDialog, setShowTransactionDialog] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [newStatus, setNewStatus] = useState('');

  const pageSize = 10;

  useEffect(() => {
    loadTransactions();
  }, [page, searchTerm, filterType, filterStatus]);

  const loadTransactions = async () => {
    try {
      setIsLoadingState(true);
      const response = await apiService.getAllTransactions(page, pageSize);
      setTransactions(response.data || []);
      setTotalPages(Math.ceil((response.totalCount || 0) / pageSize));
    } catch (error: any) {
      addNotification({
        message: 'Failed to load transactions',
        type: 'error',
      });
    } finally {
      setIsLoadingState(false);
    }
  };

  const handleUpdateStatus = async (transactionId: string, status: string) => {
    try {
      setIsLoadingState(true);
      await apiService.updateTransactionStatus(transactionId, status);
      
      addNotification({
        message: `Transaction status updated to ${status}`,
        type: 'success',
      });
      
      loadTransactions();
      setShowStatusDialog(false);
    } catch (error: any) {
      addNotification({
        message: 'Failed to update transaction status',
        type: 'error',
      });
    } finally {
      setIsLoadingState(false);
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'recharge':
        return { label: 'Recharge', color: 'success' as const, icon: <TrendingUp /> };
      case 'withdraw':
        return { label: 'Withdrawal', color: 'warning' as const, icon: <TrendingDown /> };
      case 'game_play':
        return { label: 'Game Play', color: 'primary' as const, icon: <Receipt /> };
      case 'winning':
        return { label: 'Winning', color: 'secondary' as const, icon: <CheckCircle /> };
      default:
        return { label: 'Unknown', color: 'default' as const, icon: <Receipt /> };
    }
  };

  const getStatusChip = (status: string) => {
    switch (status) {
      case 'completed':
        return <Chip label="Completed" color="success" size="small" />;
      case 'pending':
        return <Chip label="Pending" color="warning" size="small" />;
      case 'failed':
        return <Chip label="Failed" color="error" size="small" />;
      case 'cancelled':
        return <Chip label="Cancelled" color="default" size="small" />;
      default:
        return <Chip label="Unknown" color="default" size="small" />;
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = 
      transaction.user?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.user?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.transactionId?.includes(searchTerm) ||
      transaction._id.includes(searchTerm);
    
    const matchesType = filterType === 'all' || transaction.type === filterType;
    const matchesStatus = filterStatus === 'all' || transaction.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  const getTotalAmount = (type: string) => {
    return transactions
      .filter(t => t.type === type && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={() => navigate('/dashboard')}
          sx={{ mb: 2 }}
        >
          Back to Dashboard
        </Button>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
              Transaction Management
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Monitor and manage all financial transactions
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Refresh />}
            onClick={loadTransactions}
            disabled={isLoading}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3} sx={{ background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)', color: 'white' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h6" gutterBottom>Total Recharges</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    ₹{getTotalAmount('recharge').toFixed(2)}
                  </Typography>
                </Box>
                <TrendingUp sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3} sx={{ background: 'linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)', color: 'white' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h6" gutterBottom>Total Withdrawals</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    ₹{getTotalAmount('withdraw').toFixed(2)}
                  </Typography>
                </Box>
                <TrendingDown sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3} sx={{ background: 'linear-gradient(135deg, #2196f3 0%, #64b5f6 100%)', color: 'white' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h6" gutterBottom>Game Plays</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    ₹{getTotalAmount('game_play').toFixed(2)}
                  </Typography>
                </Box>
                <Receipt sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3} sx={{ background: 'linear-gradient(135deg, #9c27b0 0%, #ba68c8 100%)', color: 'white' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h6" gutterBottom>Winnings Paid</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    ₹{getTotalAmount('winning').toFixed(2)}
                  </Typography>
                </Box>
                <CheckCircle sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Card elevation={3} sx={{ mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <TextField
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: 250 }}
            />
            
            <TextField
              select
              label="Type"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              sx={{ minWidth: 120 }}
            >
              <option value="all">All Types</option>
              <option value="recharge">Recharge</option>
              <option value="withdraw">Withdrawal</option>
              <option value="game_play">Game Play</option>
              <option value="winning">Winning</option>
            </TextField>
            
            <TextField
              select
              label="Status"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              sx={{ minWidth: 120 }}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
              <option value="cancelled">Cancelled</option>
            </TextField>
          </Box>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card elevation={3}>
        <CardContent sx={{ p: 0 }}>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'primary.main' }}>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Transaction</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>User</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Type</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Amount</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Date</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTransactions.map((transaction) => (
                  <TableRow key={transaction._id} hover>
                    <TableCell>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                          {transaction.transactionId || transaction._id.slice(-8)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          ID: {transaction._id.slice(-8)}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">
                          {transaction.user?.firstName} {transaction.user?.lastName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {transaction.user?.email}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {getTypeLabel(transaction.type).icon}
                        <Chip
                          label={getTypeLabel(transaction.type).label}
                          color={getTypeLabel(transaction.type).color}
                          size="small"
                        />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        ₹{transaction.amount.toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {getStatusChip(transaction.status)}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(transaction.createdAt).toLocaleTimeString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="View Details">
                          <IconButton
                            size="small"
                            onClick={() => {
                              setSelectedTransaction(transaction);
                              setShowTransactionDialog(true);
                            }}
                          >
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                        
                        {transaction.status === 'pending' && (
                          <Tooltip title="Update Status">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => {
                                setSelectedTransaction(transaction);
                                setShowStatusDialog(true);
                              }}
                            >
                              <CheckCircle />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Pagination */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(_, newPage) => setPage(newPage)}
          color="primary"
        />
      </Box>

      {/* Transaction Details Dialog */}
      <Dialog open={showTransactionDialog} onClose={() => setShowTransactionDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Transaction Details</DialogTitle>
        <DialogContent>
          {selectedTransaction && (
            <Box sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Transaction ID: {selectedTransaction.transactionId || selectedTransaction._id}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Type: {getTypeLabel(selectedTransaction.type).label}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Amount: ₹{selectedTransaction.amount.toFixed(2)}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Status: {selectedTransaction.status}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Created: {new Date(selectedTransaction.createdAt).toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Updated: {new Date(selectedTransaction.updatedAt).toLocaleString()}
              </Typography>
              {selectedTransaction.paymentMethod && (
                <Typography variant="body2" color="text.secondary" paragraph>
                  Payment Method: {selectedTransaction.paymentMethod}
                </Typography>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowTransactionDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog open={showStatusDialog} onClose={() => setShowStatusDialog(false)}>
        <DialogTitle>Update Transaction Status</DialogTitle>
        <DialogContent>
          <TextField
            select
            label="New Status"
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            fullWidth
            sx={{ mt: 2 }}
          >
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
            <option value="cancelled">Cancelled</option>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowStatusDialog(false)}>Cancel</Button>
          <Button
            onClick={() => {
              if (selectedTransaction && newStatus) {
                handleUpdateStatus(selectedTransaction._id, newStatus);
              }
            }}
            variant="contained"
            disabled={!newStatus}
          >
            Update Status
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TransactionManagement; 