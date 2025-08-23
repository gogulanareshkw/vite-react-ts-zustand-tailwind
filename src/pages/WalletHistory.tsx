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
  Switch,
  FormControlLabel,
  Button,
  CircularProgress,
  Alert,
  Pagination,
  Select,
  MenuItem,
  FormControl,
} from '@mui/material';
import {
  AccountBalanceWallet,
  Download,
  FilterList,
} from '@mui/icons-material';
import { useStore } from '../store/useStore';

interface WalletTransaction {
  _id: string;
  fieldName: string;
  fieldValue: string;
  collectionName: string;
  updateType: string;
  updatedFor: string;
  updatedBy: string;
  description: string;
  createdDateTime: string;
  __v: number;
}



const WalletHistory: React.FC = () => {
  const { user, api, notification } = useStore();
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState<string | null>(null);
  const [showOnlyBonus, setShowOnlyBonus] = useState(false);
  const [downloading, setDownloading] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Fetch wallet history when component mounts or dependencies change
  useEffect(() => {
    fetchWalletHistory();
  }, [currentPage, pageSize, showOnlyBonus]);

  const fetchWalletHistory = async () => {
    try {
      setLoading(true);
      const typeParam = showOnlyBonus ? 'BONUS' : '';
      const response = await api.getUserWalletHistory(currentPage, pageSize, typeParam);
      
      if (response.success) {
        setTransactions(response.walletHistory || []);
        setTotalPages(response.totalPages || 1);
        setTotalCount(response.totalCount || 0);
      } else {
        setTransactions([]);
        setTotalPages(1);
        setTotalCount(0);
      }
    } catch (err: any) {
      notification.show(err?.response?.data?.message || 'Failed to fetch wallet history', 'error');
      setTransactions([]);
      setTotalPages(1);
      setTotalCount(0);
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
        ...transactions.map(tx => [
          tx.fieldValue,
          new Date(tx.createdDateTime).toLocaleDateString(),
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
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (event: { target: { value: unknown } }) => {
    const newPageSize = Number(event.target.value);
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when changing page size
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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <AccountBalanceWallet sx={{ fontSize: 60, opacity: 0.9 }} />
            <Box>
              <Typography variant="h6" sx={{ opacity: 0.9, mb: 1 }}>
                Available Balance
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                {user?.availableAmount?.toFixed(2) || '0.00'}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Controls Section */}
      <Card sx={{ mb: 4 }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { xs: 'stretch', md: 'center' }, justifyContent: 'space-between', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
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
            </Box>
            
                          <Button
                variant="contained"
                startIcon={downloading ? <CircularProgress size={20} /> : <Download />}
                onClick={handleDownload}
                disabled={downloading || transactions.length === 0}
                sx={{ minWidth: 150 }}
              >
              {downloading ? 'Downloading...' : 'Download CSV'}
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Pagination Controls - Above Table */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'stretch', sm: 'center' }, justifyContent: 'space-between', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Rows per page:
              </Typography>
              <FormControl size="small" sx={{ minWidth: 80 }}>
                <Select
                  value={pageSize}
                  onChange={handlePageSizeChange}
                  sx={{ height: 40 }}
                >
                  <MenuItem value={5}>5</MenuItem>
                  <MenuItem value={10}>10</MenuItem>
                  <MenuItem value={20}>20</MenuItem>
                  <MenuItem value={50}>50</MenuItem>
                </Select>
              </FormControl>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Page {currentPage} of {totalPages} ({totalCount} total)
              </Typography>
              <Pagination
                count={Math.max(totalPages, 1)}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                size="small"
                showFirstButton
                showLastButton
                disabled={totalPages <= 1}
              />
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'grey.50' }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>Amount</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Created Date</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} sx={{ textAlign: 'center', py: 4 }}>
                      <Typography variant="body1" color="text.secondary">
                        No transactions found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  transactions.map((transaction) => (
                    <TableRow key={transaction._id} hover>
                      <TableCell>
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            fontWeight: 'bold',
                            color: transaction.fieldValue.startsWith('+') ? 'success.main' : 'error.main'
                          }}
                        >
                          {transaction.fieldValue}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(transaction.createdDateTime)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {transaction.description}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>




    </Container>
  );
};

export default WalletHistory; 