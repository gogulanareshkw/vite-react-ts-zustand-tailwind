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
  Avatar,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Receipt as TicketIcon,
  EmojiEvents as PrizeIcon,
  CheckCircle as CheckIcon,
  Schedule as PendingIcon,
  Cancel as CancelIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  Info as InfoIcon,
  Close as CloseIcon,
  CalendarToday as DateIcon,
  AttachMoney as MoneyIcon,
  Casino as GameIcon,
  TrendingUp as WinIcon,
  TrendingDown as LoseIcon
} from '@mui/icons-material';
import { useStore } from '../store/useStore';
import { format } from 'date-fns';

interface LotteryTicket {
  _id: string;
  ticketNumber: string;
  userId: string;
  lotteryGameType: number;
  lotteryGameTypeName: string;
  playAmount: number;
  playNumbers: string[];
  playDate: string;
  drawDate: string;
  status: 'active' | 'expired' | 'cancelled' | 'won' | 'lost';
  prizeAmount?: number;
  prizeCategory?: string;
  winningNumbers?: string[];
  matchedNumbers?: string[];
  matchedCount?: number;
  agentId?: string;
  agentName?: string;
  commission?: number;
  createdAt: string;
  updatedAt: string;
  resultDate?: string;
}

const LotteryTicketInfo: React.FC = () => {
  const { ticketId } = useParams<{ ticketId: string }>();
  const navigate = useNavigate();
  const { notification, api } = useStore();
  const [ticket, setTicket] = useState<LotteryTicket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);

  useEffect(() => {
    if (ticketId) {
      loadTicket();
    }
  }, [ticketId]);

  const loadTicket = async () => {
    try {
      setLoading(true);
      // This would be implemented based on your backend API
      // const response = await api.getTicketById(ticketId!);
      
      // Mock data for demonstration
      const mockTicket: LotteryTicket = {
        _id: ticketId!,
        ticketNumber: `TKT${ticketId?.slice(-6)}`,
        userId: 'user123',
        lotteryGameType: 1,
        lotteryGameTypeName: 'Thai Lottery',
        playAmount: 100,
        playNumbers: ['123', '456', '789', '012', '345'],
        playDate: new Date().toISOString(),
        drawDate: new Date(Date.now() + 86400000).toISOString(),
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        agentId: 'agent123',
        agentName: 'John Agent',
        commission: 5
      };
      
      setTicket(mockTicket);
    } catch (err) {
      setError('Failed to load ticket details');
      console.error('Error loading ticket:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'won': return 'success';
      case 'lost': return 'error';
      case 'active': return 'primary';
      case 'expired': return 'warning';
      case 'cancelled': return 'default';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'won': return <WinIcon />;
      case 'lost': return <LoseIcon />;
      case 'active': return <PendingIcon />;
      case 'expired': return <CancelIcon />;
      case 'cancelled': return <CancelIcon />;
      default: return <InfoIcon />;
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy HH:mm:ss');
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString()}`;
  };

  const isTicketExpired = () => {
    if (!ticket) return false;
    return new Date(ticket.drawDate) < new Date();
  };

  const isTicketWon = () => {
    return ticket?.status === 'won';
  };

  const isTicketLost = () => {
    return ticket?.status === 'lost';
  };

  const isTicketActive = () => {
    return ticket?.status === 'active' && !isTicketExpired();
  };

  const handleDownloadTicket = () => {
    notification.show('Ticket download started', 'info');
  };

  const handleShareTicket = () => {
    setShareDialogOpen(true);
  };

  const getPrizeBreakdown = () => {
    if (!ticket?.prizeAmount) return [];
    
    return [
      { category: 'First Prize', amount: ticket.prizeAmount * 0.5, description: 'Exact match' },
      { category: 'Second Prize', amount: ticket.prizeAmount * 0.3, description: 'Partial match' },
      { category: 'Third Prize', amount: ticket.prizeAmount * 0.2, description: 'Consolation' }
    ];
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

  if (error || !ticket) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || 'Ticket not found'}
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

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
            <BackIcon />
          </IconButton>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
            Lottery Ticket Details
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={handleDownloadTicket}
          >
            Download Ticket
          </Button>
          <Button
            variant="outlined"
            startIcon={<ShareIcon />}
            onClick={handleShareTicket}
          >
            Share
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Ticket Summary */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Ticket Information
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Ticket Number
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                    {ticket.ticketNumber}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Game Type
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <GameIcon sx={{ mr: 1 }} />
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                      {ticket.lotteryGameTypeName}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Play Amount
                  </Typography>
                  <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold', mb: 2 }}>
                    {formatCurrency(ticket.playAmount)}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Status
                  </Typography>
                  <Chip
                    icon={getStatusIcon(ticket.status)}
                    label={ticket.status.toUpperCase()}
                    color={getStatusColor(ticket.status) as any}
                    sx={{ mb: 2 }}
                  />
                </Grid>

                {ticket.prizeAmount && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Prize Amount
                    </Typography>
                    <Typography variant="h5" color="success.main" sx={{ fontWeight: 'bold', mb: 2 }}>
                      {formatCurrency(ticket.prizeAmount)}
                    </Typography>
                  </Grid>
                )}

                {ticket.commission && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Commission
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {formatCurrency(ticket.commission)}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>

          {/* Play Numbers */}
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Play Numbers
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                {ticket.playNumbers.map((number, index) => (
                  <Chip
                    key={index}
                    label={number}
                    size="large"
                    color={ticket.matchedNumbers?.includes(number) ? 'success' : 'default'}
                    variant={ticket.matchedNumbers?.includes(number) ? 'filled' : 'outlined'}
                    sx={{ fontSize: '1.1rem', fontWeight: 'bold' }}
                  />
                ))}
              </Box>

              {ticket.matchedCount && (
                <Typography variant="body2" color="text.secondary">
                  Matched {ticket.matchedCount} out of {ticket.playNumbers.length} numbers
                </Typography>
              )}
            </CardContent>
          </Card>

          {/* Winning Numbers (if available) */}
          {ticket.winningNumbers && ticket.winningNumbers.length > 0 && (
            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Winning Numbers
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                  {ticket.winningNumbers.map((number, index) => (
                    <Chip
                      key={index}
                      label={number}
                      size="large"
                      color="success"
                      sx={{ fontSize: '1.1rem', fontWeight: 'bold' }}
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>
          )}

          {/* Prize Breakdown */}
          {ticket.prizeAmount && (
            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Prize Breakdown
                </Typography>
                
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Category</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell align="right">Amount</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {getPrizeBreakdown().map((prize, index) => (
                        <TableRow key={index}>
                          <TableCell>{prize.category}</TableCell>
                          <TableCell>{prize.description}</TableCell>
                          <TableCell align="right">
                            {formatCurrency(prize.amount)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          )}

          {/* Ticket Status Timeline */}
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Ticket Timeline
              </Typography>
              
              <List>
                <ListItem>
                  <ListItemIcon>
                    <CheckIcon color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Ticket Purchased"
                    secondary={formatDate(ticket.playDate)}
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <DateIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Draw Date"
                    secondary={formatDate(ticket.drawDate)}
                  />
                </ListItem>
                
                {ticket.resultDate && (
                  <ListItem>
                    <ListItemIcon>
                      <PrizeIcon color="secondary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Results Declared"
                      secondary={formatDate(ticket.resultDate)}
                    />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          {/* Agent Information */}
          {ticket.agentId && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Agent Information
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ mr: 2 }}>
                    {ticket.agentName?.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                      {ticket.agentName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Agent ID: {ticket.agentId}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          )}

          {/* Timestamps */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Timestamps
              </Typography>
              
              <List dense>
                <ListItem>
                  <ListItemText
                    primary="Play Date"
                    secondary={formatDate(ticket.playDate)}
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemText
                    primary="Draw Date"
                    secondary={formatDate(ticket.drawDate)}
                  />
                </ListItem>
                
                {ticket.resultDate && (
                  <ListItem>
                    <ListItemText
                      primary="Result Date"
                      secondary={formatDate(ticket.resultDate)}
                    />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => navigate(`/lottery-game?type=${ticket.lotteryGameType}`)}
                >
                  Play Again
                </Button>
                
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => navigate('/lottery-history')}
                >
                  View History
                </Button>
                
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => navigate('/results')}
                >
                  View Results
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Share Dialog */}
      <Dialog open={shareDialogOpen} onClose={() => setShareDialogOpen(false)}>
        <DialogTitle>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">Share Ticket</Typography>
            <IconButton onClick={() => setShareDialogOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Share this ticket with others
          </Typography>
          <TextField
            fullWidth
            value={`Ticket Number: ${ticket.ticketNumber}`}
            InputProps={{ readOnly: true }}
            sx={{ mb: 2 }}
          />
          <Button
            fullWidth
            variant="contained"
            onClick={() => {
              navigator.clipboard.writeText(`Ticket Number: ${ticket.ticketNumber}`);
              notification.show('Ticket number copied to clipboard', 'success');
              setShareDialogOpen(false);
            }}
          >
            Copy Ticket Number
          </Button>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default LotteryTicketInfo; 
