import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Card, CardContent, Button, CircularProgress, Alert, Divider, Chip, Grid } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowBack, Info } from '@mui/icons-material';
import { useStore } from '../store/useStore';
import type { Recharge } from '../types';

const TransactionInfo: React.FC = () => {
  const navigate = useNavigate();
  const { txnId } = useParams();
  const { api } = useStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txn, setTxn] = useState<Recharge | null>(null);

  useEffect(() => {
    if (txnId) fetchTxn(txnId);
    // eslint-disable-next-line
  }, [txnId]);

  const fetchTxn = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getTransactionById(id);
      if (res.success && res.data) {
        setTxn(res.data);
      } else {
        setError(res.message || 'Failed to fetch transaction info');
      }
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to fetch transaction info');
    } finally {
      setLoading(false);
    }
  };

  const getStatusChip = (status: string) => {
    switch ((status || '').toLowerCase()) {
      case 'completed':
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
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          sx={{ mb: 2 }}
        >
          Back
        </Button>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Transaction Info
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Transaction ID: {txnId}
        </Typography>
      </Box>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : txn ? (
        <Card elevation={3}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Info sx={{ fontSize: 48, color: 'primary.main' }} />
              <Typography variant="h5" fontWeight="bold">Transaction Details</Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">Amount</Typography>
                <Typography variant="body1" color="primary">₹{txn.amount.toLocaleString()}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                {getStatusChip(txn.status)}
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">Payment Method</Typography>
                <Typography variant="body1">{txn.paymentMethod}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">Transaction Date</Typography>
                <Typography variant="body1">{txn.createdDateTime ? new Date(txn.createdDateTime).toLocaleString() : '-'}</Typography>
              </Grid>
              {txn.transactionId && (
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Bank/Ref ID</Typography>
                  <Typography variant="body1">{txn.transactionId}</Typography>
                </Grid>
              )}
            </Grid>
          </CardContent>
        </Card>
      ) : (
        <Alert severity="info">No transaction details found.</Alert>
      )}
    </Container>
  );
};

export default TransactionInfo; 