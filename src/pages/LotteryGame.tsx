import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Alert,
  Grid,
  Chip,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Casino,
  Timer,
  Payment,
  ArrowBack,
  PlayArrow,
  EmojiEvents,
  Info,
} from '@mui/icons-material';
import { useStore } from '../store/useStore';
import apiService from '../services/api';

interface LotteryGame {
  _id: string;
  gameName: string;
  gameType: string;
  ticketPrice: number;
  maxTickets: number;
  currentTickets: number;
  startTime: string;
  endTime: string;
  drawTime: string;
  status: string;
  prizePool: number;
  description: string;
}

const LotteryGame: React.FC = () => {
  const navigate = useNavigate();
  const { user, addNotification, setLoading, getUserBalance } = useStore();

  const [games, setGames] = useState<LotteryGame[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedGame, setSelectedGame] = useState<LotteryGame | null>(null);
  const [showPurchaseDialog, setShowPurchaseDialog] = useState(false);
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [userTickets, setUserTickets] = useState<any[]>([]);

  useEffect(() => {
    loadGames();
    loadUserTickets();
  }, []);

  const loadGames = async () => {
    try {
      const response = await apiService.getLotteryGames();
      if (response.success) {
        setGames(response.data || []);
      }
    } catch (error) {
      console.error('Failed to load games:', error);
      addNotification({
        message: 'Failed to load lottery games',
        type: 'error',
      });
    }
  };

  const loadUserTickets = async () => {
    try {
      const response = await apiService.getUserLotteryTickets(1, 10);
      if (response.success) {
        setUserTickets(response.data || []);
      }
    } catch (error) {
      console.error('Failed to load user tickets:', error);
    }
  };

  const handlePurchaseTicket = (game: LotteryGame) => {
    setSelectedGame(game);
    setTicketQuantity(1);
    setShowPurchaseDialog(true);
  };

  const handleQuantityChange = (quantity: number) => {
    if (quantity >= 1 && quantity <= 10) {
      setTicketQuantity(quantity);
    }
  };

  const calculateTotalPrice = () => {
    if (!selectedGame) return 0;
    return selectedGame.ticketPrice * ticketQuantity;
  };

  const validatePurchase = () => {
    if (!selectedGame) return false;
    
    const totalPrice = calculateTotalPrice();
    const userBalance = getUserBalance();
    
    if (totalPrice > userBalance) {
      addNotification({
        message: 'Insufficient balance. Please recharge your account.',
        type: 'error',
      });
      return false;
    }
    
    if (ticketQuantity > 10) {
      addNotification({
        message: 'Maximum 10 tickets can be purchased at once.',
        type: 'error',
      });
      return false;
    }
    
    return true;
  };

  const handlePurchase = async () => {
    if (!selectedGame || !validatePurchase()) return;

    setIsLoading(true);
    setLoading(true);

    try {
      const response = await apiService.purchaseLotteryTicket({
        gameId: selectedGame._id,
        quantity: ticketQuantity,
        amount: calculateTotalPrice(),
      });
      
      if (response.success) {
        addNotification({
          message: `Successfully purchased ${ticketQuantity} ticket(s)!`,
          type: 'success',
        });
        
        setShowPurchaseDialog(false);
        setSelectedGame(null);
        loadGames();
        loadUserTickets();
      } else {
        addNotification({
          message: 'Failed to purchase ticket. Please try again.',
          type: 'error',
        });
      }
    } catch (error) {
      const errorMessage = apiService.handleError(error);
      addNotification({
        message: errorMessage,
        type: 'error',
      });
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };

  const getGameStatus = (game: LotteryGame) => {
    const now = new Date();
    const startTime = new Date(game.startTime);
    const endTime = new Date(game.endTime);
    const drawTime = new Date(game.drawTime);

    if (now < startTime) return { status: 'upcoming', color: 'info', text: 'Upcoming' };
    if (now >= startTime && now <= endTime) return { status: 'active', color: 'success', text: 'Active' };
    if (now > endTime && now < drawTime) return { status: 'closed', color: 'warning', text: 'Closed' };
    return { status: 'drawn', color: 'default', text: 'Drawn' };
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const calculateProgress = (game: LotteryGame) => {
    return (game.currentTickets / game.maxTickets) * 100;
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'won': return 'success';
      case 'pending': return 'warning';
      case 'lost': return 'error';
      default: return 'default';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Lottery Games
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Play and win exciting lottery games
        </Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={() => navigate('/dashboard')}
        >
          Back to Dashboard
        </Button>
      </Box>

      {games.length === 0 ? (
        <Card elevation={4}>
          <CardContent sx={{ p: 6, textAlign: 'center' }}>
            <Casino sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              No Games Available
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Check back later for new lottery games.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {games.map((game) => {
            const gameStatus = getGameStatus(game);
            const progress = calculateProgress(game);
            
            return (
              <Grid item xs={12} md={6} lg={4} key={game._id}>
                <Card elevation={4} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {game.gameName}
                      </Typography>
                      <Chip
                        label={gameStatus.text}
                        color={gameStatus.color as any}
                        size="small"
                      />
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {game.description}
                    </Typography>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Ticket Price:</strong> ₹{game.ticketPrice}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Prize Pool:</strong> ₹{game.prizePool?.toLocaleString()}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Tickets Sold:</strong> {game.currentTickets}/{game.maxTickets}
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Progress:</strong>
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={progress}
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        {progress.toFixed(1)}% filled
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Start Time:</strong> {formatTime(game.startTime)}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>End Time:</strong> {formatTime(game.endTime)}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Draw Time:</strong> {formatTime(game.drawTime)}
                      </Typography>
                    </Box>

                    <Box sx={{ mt: 'auto' }}>
                      {gameStatus.status === 'active' ? (
                        <Button
                          variant="contained"
                          fullWidth
                          startIcon={<PlayArrow />}
                          onClick={() => handlePurchaseTicket(game)}
                          disabled={game.currentTickets >= game.maxTickets}
                          sx={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            '&:hover': {
                              background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                            },
                          }}
                        >
                          {game.currentTickets >= game.maxTickets ? 'Sold Out' : 'Buy Ticket'}
                        </Button>
                      ) : (
                        <Button
                          variant="outlined"
                          fullWidth
                          disabled
                        >
                          {gameStatus.text}
                        </Button>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Purchase Dialog */}
      <Dialog open={showPurchaseDialog} onClose={() => setShowPurchaseDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Purchase Lottery Ticket</DialogTitle>
        <DialogContent>
          {selectedGame && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                {selectedGame.gameName}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {selectedGame.description}
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body2">
                  <strong>Ticket Price:</strong> ₹{selectedGame.ticketPrice}
                </Typography>
                <Typography variant="body2">
                  <strong>Available Balance:</strong> ₹{getUserBalance().toFixed(2)}
                </Typography>
              </Box>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Number of Tickets</InputLabel>
                <Select
                  value={ticketQuantity}
                  onChange={(e) => handleQuantityChange(e.target.value as number)}
                  label="Number of Tickets"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <MenuItem key={num} value={num}>
                      {num} ticket{num > 1 ? 's' : ''} (₹{selectedGame.ticketPrice * num})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  <strong>Total Amount:</strong> ₹{calculateTotalPrice()}<br />
                  <strong>Maximum tickets per purchase:</strong> 10
                </Typography>
              </Alert>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPurchaseDialog(false)}>
            Cancel
          </Button>
          <Button
            onClick={handlePurchase}
            variant="contained"
            disabled={isLoading}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
              },
            }}
          >
            {isLoading ? 'Processing...' : `Purchase for ₹${calculateTotalPrice()}`}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Recent Tickets */}
      {userTickets.length > 0 && (
        <Box sx={{ mt: 6 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
            My Recent Tickets
          </Typography>
          <Grid container spacing={2}>
            {userTickets.slice(0, 6).map((ticket) => (
              <Grid item xs={12} sm={6} md={4} key={ticket._id}>
                <Card elevation={2}>
                  <CardContent sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                        {ticket.lotteryGame?.gameName}
                      </Typography>
                      <Chip
                        label={ticket.status}
                        color={getStatusColor(ticket.status)}
                        size="small"
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Ticket #{ticket.ticketNumber}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(ticket.createdDateTime).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/my-tickets')}
            >
              View All My Tickets
            </Button>
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default LotteryGame; 