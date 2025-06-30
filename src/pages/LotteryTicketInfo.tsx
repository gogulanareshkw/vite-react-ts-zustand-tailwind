import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Card, CardContent, Button, CircularProgress, Alert, Divider, Chip, Grid } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowBack, ConfirmationNumber } from '@mui/icons-material';
import { useStore } from '../store/useStore';
import type { LotteryGamePlay, LotteryNumber } from '../types';

const LotteryTicketInfo: React.FC = () => {
  const navigate = useNavigate();
  const { ticketId } = useParams();
  const { api } = useStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ticket, setTicket] = useState<LotteryGamePlay | null>(null);

  useEffect(() => {
    if (ticketId) fetchTicket(ticketId);
    // eslint-disable-next-line
  }, [ticketId]);

  const fetchTicket = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getLotteryPlayById(id);
      if (res.success && res.data) {
        setTicket(res.data);
      } else {
        setError(res.message || 'Failed to fetch ticket info');
      }
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to fetch ticket info');
    } finally {
      setLoading(false);
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
          Lottery Ticket Info
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Ticket ID: {ticketId}
        </Typography>
      </Box>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : ticket ? (
        <Card elevation={3}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <ConfirmationNumber sx={{ fontSize: 48, color: 'primary.main' }} />
              <Typography variant="h5" fontWeight="bold">Ticket Details</Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">Game Type</Typography>
                <Typography variant="body1">{ticket.lotteryGameType}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">Game Number</Typography>
                <Typography variant="body1">{ticket.gameNumber}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">Draw Date</Typography>
                <Typography variant="body1">{ticket.played_at ? new Date(ticket.played_at).toLocaleString() : '-'}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">Ticket Number</Typography>
                <Typography variant="body1">{ticket.ticketNumber}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">Played Amount</Typography>
                <Typography variant="body1" color="error">₹{ticket.playedAmount.toLocaleString()}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">Paid Amount</Typography>
                <Typography variant="body1" color="success.main">₹{ticket.paidAmount.toLocaleString()}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">Discount</Typography>
                <Typography variant="body1" color="info.main">₹{ticket.discount.toLocaleString()}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">Original Ticket</Typography>
                <Typography variant="body1">{ticket.isOriginalTicket ? 'Yes' : 'No'}</Typography>
              </Grid>
            </Grid>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>Numbers Played</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {ticket.numbers.map((num: LotteryNumber, idx: number) => (
                <Chip
                  key={idx}
                  label={`#${num.number} (Straight: ${num.straight}, Rumble: ${num.rumble})`}
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Box>
          </CardContent>
        </Card>
      ) : (
        <Alert severity="info">No ticket details found.</Alert>
      )}
    </Container>
  );
};

export default LotteryTicketInfo; 