import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  Button,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Receipt as ReceiptIcon,
  AccountBalance as BankIcon,
  Payment as PaymentIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Pending as PendingIcon,
  Cancel as CancelIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  Info as InfoIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { useStore } from '../store/useStore';
import { format } from 'date-fns';

interface Transaction {
  _id: string;
  transactionId: string;
  userId: string;
  type: 'recharge' | 'withdraw' | 'lottery_play' | 'prize' | 'refund' | 'commission';
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled' | 'processing';
  paymentMethod?: string;
  bankDetails?: {
    accountNumber: string;
    ifscCode: string;
    bankName: string;
    accountHolderName: string;
  };
  description: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  failureReason?: string;
  referenceNumber?: string;
  gatewayResponse?: any;
  fees?: number;
  netAmount?: number;
  metadata?: {
    lotteryGameType?: number;
    lotteryGameTypeName?: string;
    ticketNumber?: string;
    playNumbers?: string[];
    prizeAmount?: number;
    agentId?: string;
    agentName?: string;
  };
}

const TransactionInfo: React.FC = () => {
  const { txnId } = useParams<{ txnId: string }>();
  const navigate = useNavigate();
  const { notification, api } = useStore();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);

  useEffect(() => {
    if (txnId) {
      loadTransaction();
    }
  }, [txnId]);

  const loadTransaction = async () => {
    try {
      setLoading(true);
      const response = await api.getTransactionById(txnId!);
      if (response.success) {
        setTransaction(response.data);
      } else {
        setError('Transaction not found');
      }
    } catch (err) {
      setError('Failed to load transaction details');
      console.error('Error loading transaction:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'failed': return 'error';
      case 'pending': return 'warning';
      case 'processing': return 'info';
      case 'cancelled': return 'default';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckIcon />;
      case 'failed': return <ErrorIcon />;
      case 'pending': return <PendingIcon />;
      case 'processing': return <ScheduleIcon />;
      case 'cancelled': return <CancelIcon />;
      default: return <InfoIcon />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'recharge': return 'Recharge';
      case 'withdraw': return 'Withdrawal';
      case 'lottery_play': return 'Lottery Play';
      case 'prize': return 'Prize';
      case 'refund': return 'Refund';
      case 'commission': return 'Commission';
      default: return type;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'recharge': return <PaymentIcon />;
      case 'withdraw': return <BankIcon />;
      case 'lottery_play': return <ReceiptIcon />;
      case 'prize': return <ReceiptIcon />;
      case 'refund': return <ReceiptIcon />;
      case 'commission': return <ReceiptIcon />;
      default: return <ReceiptIcon />;
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy HH:mm:ss');
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString()}`;
  };

  const getTransactionSteps = (transaction: Transaction) => {
    const steps = [
      {
        label: 'Transaction Initiated',
        description: `Transaction created on ${formatDate(transaction.createdAt)}`,
        completed: true
      }
    ];

    if (transaction.status === 'processing' || transaction.status === 'completed') {
      steps.push({
        label: 'Processing',
        description: 'Transaction is being processed',
        completed: transaction.status === 'completed'
      });
    }

    if (transaction.status === 'completed') {
      steps.push({
        label: 'Completed',
        description: `Transaction completed on ${transaction.completedAt ? formatDate(transaction.completedAt) : formatDate(transaction.updatedAt)}`,
        completed: true
      });
    }

    if (transaction.status === 'failed') {
      steps.push({
        label: 'Failed',
        description: transaction.failureReason || 'Transaction failed',
        completed: false
      });
    }

    if (transaction.status === 'cancelled') {
      steps.push({
        label: 'Cancelled',
        description: 'Transaction was cancelled',
        completed: false
      });
    }

    return steps;
  };

  const handleDownloadReceipt = () => {
    // Implementation for downloading receipt
    notification.show('Receipt download started', 'info');
  };

  const handleShareTransaction = () => {
    setShareDialogOpen(true);
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

  if (error || !transaction) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || 'Transaction not found'}
        </Alert>
        <Button
          variant="contained"
          startIcon={<BackIcon />}
          onClick={() => navigate(-1)}
        >
          Go Back
        </Button>
      </Container>
    );
  }

  const steps = getTransactionSteps(transaction);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
            <BackIcon />
          </IconButton>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
            Transaction Details
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={handleDownloadReceipt}
          >
            Download Receipt
          </Button>
          <Button
            variant="outlined"
            startIcon={<ShareIcon />}
            onClick={handleShareTransaction}
          >
            Share
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Transaction Summary */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Transaction Summary
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Transaction ID
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 2 }}>
                    {transaction.transactionId}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Type
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    {getTypeIcon(transaction.type)}
                    <Typography variant="body1" sx={{ fontWeight: 'bold', ml: 1 }}>
                      {getTypeLabel(transaction.type)}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Amount
                  </Typography>
                  <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold', mb: 2 }}>
                    {formatCurrency(transaction.amount)}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Status
                  </Typography>
                  <Chip
                    icon={getStatusIcon(transaction.status)}
                    label={transaction.status.toUpperCase()}
                    color={getStatusColor(transaction.status) as any}
                    sx={{ mb: 2 }}
                  />
                </Grid>

                {transaction.fees && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Fees
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {formatCurrency(transaction.fees)}
                    </Typography>
                  </Grid>
                )}

                {transaction.netAmount && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Net Amount
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 2 }}>
                      {formatCurrency(transaction.netAmount)}
                    </Typography>
                  </Grid>
                )}

                {transaction.referenceNumber && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Reference Number
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {transaction.referenceNumber}
                    </Typography>
                  </Grid>
                )}

                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Description
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {transaction.description}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Transaction Timeline */}
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Transaction Timeline
              </Typography>
              
              <Stepper orientation="vertical">
                {steps.map((step, index) => (
                  <Step key={index} active={step.completed} completed={step.completed}>
                    <StepLabel>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        {step.label}
                      </Typography>
                    </StepLabel>
                    <StepContent>
                      <Typography variant="body2" color="text.secondary">
                        {step.description}
                      </Typography>
                    </StepContent>
                  </Step>
                ))}
              </Stepper>
            </CardContent>
          </Card>

          {/* Lottery Details (if applicable) */}
          {transaction.metadata?.lotteryGameType && (
            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Lottery Details
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Game Type
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {transaction.metadata.lotteryGameTypeName}
                    </Typography>
                  </Grid>
                  
                  {transaction.metadata.ticketNumber && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Ticket Number
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 2 }}>
                        {transaction.metadata.ticketNumber}
                      </Typography>
                    </Grid>
                  )}

                  {transaction.metadata.playNumbers && (
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Play Numbers
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                        {transaction.metadata.playNumbers.map((num, index) => (
                          <Chip key={index} label={num} size="small" />
                        ))}
                      </Box>
                    </Grid>
                  )}

                  {transaction.metadata.prizeAmount && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Prize Amount
                      </Typography>
                      <Typography variant="h6" color="success.main" sx={{ fontWeight: 'bold' }}>
                        {formatCurrency(transaction.metadata.prizeAmount)}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>
          )}
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          {/* Payment Details */}
          {transaction.paymentMethod && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Payment Details
                </Typography>
                
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <PaymentIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Payment Method"
                      secondary={transaction.paymentMethod}
                    />
                  </ListItem>
                  
                  {transaction.bankDetails && (
                    <>
                      <ListItem>
                        <ListItemIcon>
                          <BankIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary="Bank Name"
                          secondary={transaction.bankDetails.bankName}
                        />
                      </ListItem>
                      
                      <ListItem>
                        <ListItemText
                          primary="Account Number"
                          secondary={`****${transaction.bankDetails.accountNumber.slice(-4)}`}
                        />
                      </ListItem>
                      
                      <ListItem>
                        <ListItemText
                          primary="IFSC Code"
                          secondary={transaction.bankDetails.ifscCode}
                        />
                      </ListItem>
                    </>
                  )}
                </List>
              </CardContent>
            </Card>
          )}

          {/* Timestamps */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Timestamps
              </Typography>
              
              <List dense>
                <ListItem>
                  <ListItemText
                    primary="Created"
                    secondary={formatDate(transaction.createdAt)}
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemText
                    primary="Last Updated"
                    secondary={formatDate(transaction.updatedAt)}
                  />
                </ListItem>
                
                {transaction.completedAt && (
                  <ListItem>
                    <ListItemText
                      primary="Completed"
                      secondary={formatDate(transaction.completedAt)}
                    />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Share Dialog */}
      <Dialog open={shareDialogOpen} onClose={() => setShareDialogOpen(false)}>
        <DialogTitle>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">Share Transaction</Typography>
            <IconButton onClick={() => setShareDialogOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Share this transaction with others
          </Typography>
          <TextField
            fullWidth
            value={`Transaction ID: ${transaction.transactionId}`}
            InputProps={{ readOnly: true }}
            sx={{ mb: 2 }}
          />
          <Button
            fullWidth
            variant="contained"
            onClick={() => {
              navigator.clipboard.writeText(`Transaction ID: ${transaction.transactionId}`);
              notification.show('Transaction ID copied to clipboard', 'success');
              setShareDialogOpen(false);
            }}
          >
            Copy Transaction ID
          </Button>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default TransactionInfo; 
