import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Box,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Avatar,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  LocalOffer as OfferIcon,
  CheckCircle as CheckIcon,
  Close as CloseIcon,
  Info as InfoIcon,
  CalendarToday as CalendarIcon,
  AttachMoney as MoneyIcon
} from '@mui/icons-material';
import { useStore } from '../store/useStore';
import { format } from 'date-fns';

interface Offer {
  _id: string;
  title: string;
  description: string;
  type: 'welcome' | 'recharge' | 'referral' | 'lottery' | 'special';
  discountPercentage?: number;
  discountAmount?: number;
  minAmount?: number;
  maxAmount?: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  isClaimed: boolean;
  terms: string[];
  imageUrl?: string;
  code?: string;
}

const Offers: React.FC = () => {
  const { notification, api } = useStore();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [claimDialogOpen, setClaimDialogOpen] = useState(false);
  const [claimLoading, setClaimLoading] = useState(false);
  const [claimAmount, setClaimAmount] = useState('');

  useEffect(() => {
    loadOffers();
  }, []);

  const loadOffers = async () => {
    try {
      setLoading(true);
      const response = await api.getAllOffers();
      if (response.success) {
        setOffers(response.data || []);
      } else {
        setError('Failed to load offers');
      }
    } catch (err) {
      setError('Failed to load offers');
      console.error('Error loading offers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClaimOffer = async () => {
    if (!selectedOffer || !claimAmount) return;

    try {
      setClaimLoading(true);
      // This would be implemented based on your backend API
      // const response = await api.claimOffer(selectedOffer._id, parseFloat(claimAmount));
      
      notification.show('Offer claimed successfully!', 'success');
      setClaimDialogOpen(false);
      setSelectedOffer(null);
      setClaimAmount('');
      loadOffers(); // Refresh offers
    } catch (err) {
      notification.show('Failed to claim offer', 'error');
    } finally {
      setClaimLoading(false);
    }
  };

  const getOfferTypeColor = (type: string) => {
    switch (type) {
      case 'welcome': return 'primary';
      case 'recharge': return 'success';
      case 'referral': return 'info';
      case 'lottery': return 'warning';
      case 'special': return 'error';
      default: return 'default';
    }
  };

  const getOfferTypeLabel = (type: string) => {
    switch (type) {
      case 'welcome': return 'Welcome';
      case 'recharge': return 'Recharge';
      case 'referral': return 'Referral';
      case 'lottery': return 'Lottery';
      case 'special': return 'Special';
      default: return type;
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  const isOfferExpired = (endDate: string) => {
    return new Date(endDate) < new Date();
  };

  const isOfferAvailable = (offer: Offer) => {
    return offer.isActive && !offer.isClaimed && !isOfferExpired(offer.endDate);
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

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={loadOffers}>
          Retry
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          <OfferIcon sx={{ mr: 2, verticalAlign: 'middle' }} />
          Available Offers
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Discover amazing offers and boost your lottery experience
        </Typography>
      </Box>

      {offers.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <OfferIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No Offers Available
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Check back later for exciting offers and promotions
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {offers.map((offer) => (
            <Grid item xs={12} sm={6} md={4} key={offer._id}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4
                  }
                }}
              >
                {offer.imageUrl && (
                  <Box
                    sx={{
                      height: 140,
                      backgroundImage: `url(${offer.imageUrl})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      position: 'relative'
                    }}
                  />
                )}

                {offer.isClaimed && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      zIndex: 1
                    }}
                  >
                    <Chip
                      icon={<CheckIcon />}
                      label="Claimed"
                      color="success"
                      size="small"
                    />
                  </Box>
                )}

                {isOfferExpired(offer.endDate) && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 8,
                      left: 8,
                      zIndex: 1
                    }}
                  >
                    <Chip
                      label="Expired"
                      color="error"
                      size="small"
                    />
                  </Box>
                )}

                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Chip
                      label={getOfferTypeLabel(offer.type)}
                      color={getOfferTypeColor(offer.type) as any}
                      size="small"
                      sx={{ mr: 1 }}
                    />
                    {offer.code && (
                      <Chip
                        label={`Code: ${offer.code}`}
                        variant="outlined"
                        size="small"
                      />
                    )}
                  </Box>

                  <Typography variant="h6" component="h2" gutterBottom>
                    {offer.title}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {offer.description}
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    {offer.discountPercentage && (
                      <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                        <MoneyIcon sx={{ fontSize: 16, mr: 0.5 }} />
                        {offer.discountPercentage}% discount
                      </Typography>
                    )}
                    {offer.discountAmount && (
                      <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                        <MoneyIcon sx={{ fontSize: 16, mr: 0.5 }} />
                        ₹{offer.discountAmount} off
                      </Typography>
                    )}
                    {offer.minAmount && (
                      <Typography variant="body2" color="text.secondary">
                        Min. amount: ₹{offer.minAmount}
                      </Typography>
                    )}
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CalendarIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                    <Typography variant="caption" color="text.secondary">
                      Valid until {formatDate(offer.endDate)}
                    </Typography>
                  </Box>
                </CardContent>

                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button
                    size="small"
                    startIcon={<InfoIcon />}
                    onClick={() => {
                      setSelectedOffer(offer);
                      setClaimDialogOpen(true);
                    }}
                    disabled={!isOfferAvailable(offer)}
                    fullWidth
                    variant={isOfferAvailable(offer) ? 'contained' : 'outlined'}
                  >
                    {offer.isClaimed ? 'Already Claimed' : 
                     isOfferExpired(offer.endDate) ? 'Expired' : 'View Details'}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Claim Offer Dialog */}
      <Dialog 
        open={claimDialogOpen} 
        onClose={() => setClaimDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">
              Claim Offer: {selectedOffer?.title}
            </Typography>
            <IconButton onClick={() => setClaimDialogOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedOffer && (
            <Box>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {selectedOffer.description}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" gutterBottom>
                Terms & Conditions:
              </Typography>
              <Box component="ul" sx={{ pl: 2, mb: 3 }}>
                {selectedOffer.terms.map((term, index) => (
                  <Typography component="li" key={index} variant="body2" sx={{ mb: 0.5 }}>
                    {term}
                  </Typography>
                ))}
              </Box>

              {selectedOffer.minAmount && (
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <TextField
                    label="Amount"
                    type="number"
                    value={claimAmount}
                    onChange={(e) => setClaimAmount(e.target.value)}
                    inputProps={{ min: selectedOffer.minAmount }}
                    helperText={`Minimum amount: ₹${selectedOffer.minAmount}`}
                  />
                </FormControl>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setClaimDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleClaimOffer}
            variant="contained"
            disabled={claimLoading || !claimAmount}
            startIcon={claimLoading ? <CircularProgress size={16} /> : <CheckIcon />}
          >
            {claimLoading ? 'Claiming...' : 'Claim Offer'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Offers; 
