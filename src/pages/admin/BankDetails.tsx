import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Pagination,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider
} from '@mui/material';
import {
  AccountBalance as BankIcon,
  CheckCircle as VerifiedIcon,
  Cancel as UnverifiedIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  ExpandMore as ExpandMoreIcon,
  Security as SecurityIcon,
  History as HistoryIcon
} from '@mui/icons-material';
import { useStore } from '../../store/useStore';
import { format } from 'date-fns';

interface BankDetail {
  _id: string;
  userId: string;
  userName: string;
  userEmail: string;
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
  bankName: string;
  branchName?: string;
  accountType: 'savings' | 'current' | 'salary';
  status: 'pending' | 'verified' | 'rejected' | 'suspended';
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
  verifiedAt?: string;
  verifiedBy?: string;
  rejectionReason?: string;
  documents?: {
    passbook: string;
    cancelledCheque: string;
    aadharCard: string;
    panCard: string;
  };
  transactionHistory?: {
    _id: string;
    type: 'credit' | 'debit';
    amount: number;
    description: string;
    date: string;
    status: 'success' | 'failed' | 'pending';
  }[];
}

const BankDetails: React.FC = () => {
  const { notification, api } = useStore();
  const [loading, setLoading] = useState(true);
  const [bankDetails, setBankDetails] = useState<BankDetail[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [selectedBank, setSelectedBank] = useState<BankDetail | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [verificationDialogOpen, setVerificationDialogOpen] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [bankFilter, setBankFilter] = useState('');

  useEffect(() => {
    loadBankDetails();
  }, [currentPage, statusFilter, bankFilter]);

  const loadBankDetails = async () => {
    try {
      setLoading(true);
      // This would be implemented based on your backend API
      // const response = await api.getAllBankDetails(currentPage, 20);
      
      // Mock data for demonstration
      const mockData: BankDetail[] = [
        {
          _id: '1',
          userId: 'user123',
          userName: 'John Doe',
          userEmail: 'john@example.com',
          accountHolderName: 'John Doe',
          accountNumber: '1234567890',
          ifscCode: 'SBIN0001234',
          bankName: 'State Bank of India',
          branchName: 'Main Branch',
          accountType: 'savings',
          status: 'verified',
          isDefault: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          verifiedAt: new Date().toISOString(),
          verifiedBy: 'admin1',
          transactionHistory: [
            {
              _id: 'txn1',
              type: 'credit',
              amount: 5000,
              description: 'Withdrawal to bank account',
              date: new Date().toISOString(),
              status: 'success'
            }
          ]
        }
      ];
      
      setBankDetails(mockData);
      setTotalPages(1);
    } catch (err) {
      setError('Failed to load bank details');
      console.error('Error loading bank details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyBank = async () => {
    if (!selectedBank || !verificationStatus) return;

    try {
      // This would be implemented based on your backend API
      // const response = await api.verifyBankAccount(selectedBank._id, verificationStatus, rejectionReason);
      
      notification.show('Bank account status updated successfully', 'success');
      setVerificationDialogOpen(false);
      setVerificationStatus('');
      setRejectionReason('');
      loadBankDetails();
    } catch (err) {
      notification.show('Failed to update bank account status', 'error');
    }
  };

  const handleDeleteBank = async (bankId: string) => {
    if (!window.confirm('Are you sure you want to delete this bank account?')) return;

    try {
      // This would be implemented based on your backend API
      // const response = await api.deleteBankAccount(bankId);
      
      notification.show('Bank account deleted successfully', 'success');
      loadBankDetails();
    } catch (err) {
      notification.show('Failed to delete bank account', 'error');
    }
  };

  const handleViewDetails = (bank: BankDetail) => {
    setSelectedBank(bank);
    setDetailsDialogOpen(true);
  };

  const handleOpenVerification = (bank: BankDetail) => {
    setSelectedBank(bank);
    setVerificationStatus('');
    setRejectionReason('');
    setVerificationDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'success';
      case 'rejected': return 'error';
      case 'pending': return 'warning';
      case 'suspended': return 'default';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return <VerifiedIcon />;
      case 'rejected': return <UnverifiedIcon />;
      case 'pending': return <UnverifiedIcon />;
      case 'suspended': return <UnverifiedIcon />;
      default: return <UnverifiedIcon />;
    }
  };

  const getAccountTypeColor = (type: string) => {
    switch (type) {
      case 'savings': return 'primary';
      case 'current': return 'secondary';
      case 'salary': return 'success';
      default: return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString()}`;
  };

  const maskAccountNumber = (accountNumber: string) => {
    if (accountNumber.length <= 4) return accountNumber;
    return `****${accountNumber.slice(-4)}`;
  };

  const filteredBanks = bankDetails.filter(bank => {
    const matchesSearch = bank.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bank.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bank.bankName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bank.accountHolderName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || bank.status === statusFilter;
    const matchesBank = !bankFilter || bank.bankName === bankFilter;
    
    return matchesSearch && matchesStatus && matchesBank;
  });

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
          <BankIcon sx={{ mr: 2, verticalAlign: 'middle' }} />
          Bank Details Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage user bank accounts, verification, and transaction history
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Search Bank Details"
                placeholder="Search by user name, email, bank name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <SearchIcon />
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  label="Status"
                >
                  <MenuItem value="">All Status</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="verified">Verified</MenuItem>
                  <MenuItem value="rejected">Rejected</MenuItem>
                  <MenuItem value="suspended">Suspended</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={2}>
              <FormControl fullWidth>
                <InputLabel>Bank</InputLabel>
                <Select
                  value={bankFilter}
                  onChange={(e) => setBankFilter(e.target.value)}
                  label="Bank"
                >
                  <MenuItem value="">All Banks</MenuItem>
                  <MenuItem value="State Bank of India">SBI</MenuItem>
                  <MenuItem value="HDFC Bank">HDFC</MenuItem>
                  <MenuItem value="ICICI Bank">ICICI</MenuItem>
                  <MenuItem value="Axis Bank">Axis</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={2}>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={loadBankDetails}
                fullWidth
              >
                Refresh
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Bank Details Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Bank Accounts ({filteredBanks.length})
          </Typography>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Bank Details</TableCell>
                  <TableCell>Account Type</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Added Date</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredBanks.map((bank) => (
                  <TableRow key={bank._id} hover>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {bank.userName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {bank.userEmail}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {bank.bankName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          A/C: {maskAccountNumber(bank.accountNumber)} | IFSC: {bank.ifscCode}
                        </Typography>
                        <Typography variant="caption" display="block" color="text.secondary">
                          {bank.accountHolderName}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={bank.accountType}
                        color={getAccountTypeColor(bank.accountType) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getStatusIcon(bank.status)}
                        label={bank.status}
                        color={getStatusColor(bank.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(bank.createdAt)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="View Details">
                          <IconButton
                            size="small"
                            onClick={() => handleViewDetails(bank)}
                          >
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Verify/Reject">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleOpenVerification(bank)}
                          >
                            <SecurityIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteBank(bank._id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {filteredBanks.length === 0 && (
            <Box textAlign="center" py={4}>
              <Typography color="text.secondary">
                No bank details found
              </Typography>
            </Box>
          )}

          {totalPages > 1 && (
            <Box display="flex" justifyContent="center" mt={3}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(e, page) => setCurrentPage(page)}
                color="primary"
              />
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Bank Details Dialog */}
      <Dialog
        open={detailsDialogOpen}
        onClose={() => setDetailsDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6">
            Bank Account Details
          </Typography>
        </DialogTitle>
        <DialogContent>
          {selectedBank && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  User Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  User Name
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {selectedBank.userName}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Email
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {selectedBank.userEmail}
                </Typography>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Bank Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Bank Name
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {selectedBank.bankName}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Branch Name
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {selectedBank.branchName || 'N/A'}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Account Holder Name
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {selectedBank.accountHolderName}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Account Number
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {maskAccountNumber(selectedBank.accountNumber)}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  IFSC Code
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {selectedBank.ifscCode}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Account Type
                </Typography>
                <Chip
                  label={selectedBank.accountType}
                  color={getAccountTypeColor(selectedBank.accountType) as any}
                  sx={{ mb: 2 }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Status
                </Typography>
                <Chip
                  icon={getStatusIcon(selectedBank.status)}
                  label={selectedBank.status}
                  color={getStatusColor(selectedBank.status) as any}
                  sx={{ mb: 2 }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Default Account
                </Typography>
                <Chip
                  label={selectedBank.isDefault ? 'Yes' : 'No'}
                  color={selectedBank.isDefault ? 'success' : 'default'}
                  sx={{ mb: 2 }}
                />
              </Grid>
              
              {selectedBank.verifiedAt && (
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Verified At
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {formatDate(selectedBank.verifiedAt)}
                  </Typography>
                </Grid>
              )}
              
              {selectedBank.verifiedBy && (
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Verified By
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {selectedBank.verifiedBy}
                  </Typography>
                </Grid>
              )}
              
              {selectedBank.rejectionReason && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Rejection Reason
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {selectedBank.rejectionReason}
                  </Typography>
                </Grid>
              )}
              
              {selectedBank.transactionHistory && selectedBank.transactionHistory.length > 0 && (
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Transaction History
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Type</TableCell>
                          <TableCell>Amount</TableCell>
                          <TableCell>Description</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Date</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedBank.transactionHistory.map((txn) => (
                          <TableRow key={txn._id}>
                            <TableCell>
                              <Chip
                                label={txn.type}
                                color={txn.type === 'credit' ? 'success' : 'warning'}
                                size="small"
                              />
                            </TableCell>
                            <TableCell>{formatCurrency(txn.amount)}</TableCell>
                            <TableCell>{txn.description}</TableCell>
                            <TableCell>
                              <Chip
                                label={txn.status}
                                color={txn.status === 'success' ? 'success' : txn.status === 'failed' ? 'error' : 'warning'}
                                size="small"
                              />
                            </TableCell>
                            <TableCell>{formatDate(txn.date)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsDialogOpen(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Verification Dialog */}
      <Dialog
        open={verificationDialogOpen}
        onClose={() => setVerificationDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6">
            Verify Bank Account
          </Typography>
        </DialogTitle>
        <DialogContent>
          {selectedBank && (
            <Box>
              <Typography variant="body1" gutterBottom>
                Bank: {selectedBank.bankName}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Account: {maskAccountNumber(selectedBank.accountNumber)}
              </Typography>
              
              <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
                <InputLabel>Verification Status</InputLabel>
                <Select
                  value={verificationStatus}
                  onChange={(e) => setVerificationStatus(e.target.value)}
                  label="Verification Status"
                >
                  <MenuItem value="verified">Verified</MenuItem>
                  <MenuItem value="rejected">Rejected</MenuItem>
                  <MenuItem value="suspended">Suspended</MenuItem>
                </Select>
              </FormControl>
              
              {verificationStatus === 'rejected' && (
                <TextField
                  fullWidth
                  label="Rejection Reason"
                  multiline
                  rows={3}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  sx={{ mb: 2 }}
                />
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setVerificationDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleVerifyBank}
            variant="contained"
            disabled={!verificationStatus}
          >
            Update Status
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default BankDetails; 