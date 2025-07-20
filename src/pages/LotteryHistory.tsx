import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Pagination,
  InputAdornment
} from '@mui/material';
import {
  History as HistoryIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Visibility as ViewIcon,
  Receipt as TicketIcon,
  EmojiEvents as PrizeIcon,
  CalendarToday as DateIcon,
  AttachMoney as MoneyIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { useStore } from '../store/useStore';
import { format } from 'date-fns';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`lottery-tabpanel-${index}`}
      aria-labelledby={`lottery-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

interface LotteryPlay {
  _id: string;
  lotteryGameType: number;
  lotteryGameTypeName: string;
  playAmount: number;
  playNumbers: string[];
  playDate: string;
  status: 'pending' | 'won' | 'lost' | 'cancelled';
  prizeAmount?: number;
  ticketNumber: string;
  drawDate: string;
}

interface LotteryResult {
  _id: string;
  lotteryGameType: number;
  lotteryGameTypeName: string;
  drawDate: string;
  winningNumbers: string[];
  prizeBreakdown: {
    prize: string;
    amount: number;
    winners: number;
  }[];
  totalWinners: number;
  totalPrizeAmount: number;
}

interface LotteryTicket {
  _id: string;
  ticketNumber: string;
  lotteryGameType: number;
  lotteryGameTypeName: string;
  purchaseDate: string;
  drawDate: string;
  amount: number;
  status: 'active' | 'expired' | 'cancelled';
  playNumbers: string[];
}

const LotteryHistory: React.FC = () => {
  const { notification, api } = useStore();
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Plays state
  const [plays, setPlays] = useState<LotteryPlay[]>([]);
  const [playsLoading, setPlaysLoading] = useState(false);
  const [playsPage, setPlaysPage] = useState(1);
  const [playsTotalPages, setPlaysTotalPages] = useState(1);
  
  // Results state
  const [results, setResults] = useState<LotteryResult[]>([]);
  const [resultsLoading, setResultsLoading] = useState(false);
  
  // Tickets state
  const [tickets, setTickets] = useState<LotteryTicket[]>([]);
  const [ticketsLoading, setTicketsLoading] = useState(false);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [gameTypeFilter, setGameTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  
  // Dialog state
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 0) {
      loadPlays();
    } else if (activeTab === 1) {
      loadResults();
    } else if (activeTab === 2) {
      loadTickets();
    }
  }, [activeTab, playsPage, searchTerm, gameTypeFilter, statusFilter, dateFilter]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 0) {
        await loadPlays();
      } else if (activeTab === 1) {
        await loadResults();
      } else if (activeTab === 2) {
        await loadTickets();
      }
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const loadPlays = async () => {
    try {
      setPlaysLoading(true);
      const response = await api.getUserGameHistory(1, playsPage, 10);
      if (response.success) {
        setPlays(response.data || []);
        setPlaysTotalPages(response.totalPages || 1);
      }
    } catch (err) {
      console.error('Error loading plays:', err);
    } finally {
      setPlaysLoading(false);
    }
  };

  const loadResults = async () => {
    try {
      setResultsLoading(true);
      const response = await api.getLotteryGameResults(1);
      if (response.success) {
        setResults(response.data || []);
      }
    } catch (err) {
      console.error('Error loading results:', err);
    } finally {
      setResultsLoading(false);
    }
  };

  const loadTickets = async () => {
    try {
      setTicketsLoading(true);
      // This would be implemented based on your backend API
      // const response = await api.getUserTickets();
      // Mock data for now
      setTickets([
        {
          _id: '1',
          ticketNumber: 'TKT001',
          lotteryGameType: 1,
          lotteryGameTypeName: 'Thai Lottery',
          purchaseDate: new Date().toISOString(),
          drawDate: new Date(Date.now() + 86400000).toISOString(),
          amount: 100,
          status: 'active',
          playNumbers: ['123', '456', '789']
        }
      ]);
    } catch (err) {
      console.error('Error loading tickets:', err);
    } finally {
      setTicketsLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleViewDetails = (item: any) => {
    setSelectedItem(item);
    setDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'won': return 'success';
      case 'lost': return 'error';
      case 'pending': return 'warning';
      case 'cancelled': return 'default';
      case 'active': return 'success';
      case 'expired': return 'error';
      default: return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'won': return 'Won';
      case 'lost': return 'Lost';
      case 'pending': return 'Pending';
      case 'cancelled': return 'Cancelled';
      case 'active': return 'Active';
      case 'expired': return 'Expired';
      default: return status;
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString()}`;
  };

  const filteredPlays = plays.filter(play => {
    const matchesSearch = play.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         play.lotteryGameTypeName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGameType = !gameTypeFilter || play.lotteryGameType.toString() === gameTypeFilter;
    const matchesStatus = !statusFilter || play.status === statusFilter;
    return matchesSearch && matchesGameType && matchesStatus;
  });

  const filteredResults = results.filter(result => {
    const matchesSearch = result.lotteryGameTypeName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGameType = !gameTypeFilter || result.lotteryGameType.toString() === gameTypeFilter;
    return matchesSearch && matchesGameType;
  });

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.lotteryGameTypeName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGameType = !gameTypeFilter || ticket.lotteryGameType.toString() === gameTypeFilter;
    const matchesStatus = !statusFilter || ticket.status === statusFilter;
    return matchesSearch && matchesGameType && matchesStatus;
  });

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          <HistoryIcon sx={{ mr: 2, verticalAlign: 'middle' }} />
          Lottery History
        </Typography>
        <Typography variant="body1" color="text.secondary">
          View your lottery plays, results, and ticket history
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={handleTabChange} aria-label="lottery history tabs">
            <Tab label="My Plays" />
            <Tab label="Results" />
            <Tab label="My Tickets" />
          </Tabs>
        </Box>

        {/* Filters */}
        <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                placeholder="Search by ticket number or game type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <FormControl fullWidth>
                <InputLabel>Game Type</InputLabel>
                <Select
                  value={gameTypeFilter}
                  onChange={(e) => setGameTypeFilter(e.target.value)}
                  label="Game Type"
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="1">Thai Lottery</MenuItem>
                  <MenuItem value="2">Power Ball</MenuItem>
                  <MenuItem value="3">Mega Millions</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={2}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  label="Status"
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="won">Won</MenuItem>
                  <MenuItem value="lost">Lost</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="expired">Expired</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={2}>
              <TextField
                fullWidth
                type="date"
                label="Date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<FilterIcon />}
                onClick={() => {
                  setSearchTerm('');
                  setGameTypeFilter('');
                  setStatusFilter('');
                  setDateFilter('');
                }}
              >
                Clear
              </Button>
            </Grid>
          </Grid>
        </Box>

        {/* Tab Panels */}
        <TabPanel value={activeTab} index={0}>
          {playsLoading ? (
            <Box display="flex" justifyContent="center" p={3}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Ticket</TableCell>
                      <TableCell>Game Type</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Play Date</TableCell>
                      <TableCell>Draw Date</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredPlays.map((play) => (
                      <TableRow key={play._id} hover>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            {play.ticketNumber}
                          </Typography>
                        </TableCell>
                        <TableCell>{play.lotteryGameTypeName}</TableCell>
                        <TableCell>{formatCurrency(play.playAmount)}</TableCell>
                        <TableCell>
                          <Chip
                            label={getStatusLabel(play.status)}
                            color={getStatusColor(play.status) as any}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{formatDate(play.playDate)}</TableCell>
                        <TableCell>{formatDate(play.drawDate)}</TableCell>
                        <TableCell>
                          <Tooltip title="View Details">
                            <IconButton
                              size="small"
                              onClick={() => handleViewDetails(play)}
                            >
                              <ViewIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              
              {filteredPlays.length === 0 && (
                <Box textAlign="center" py={4}>
                  <Typography color="text.secondary">
                    No plays found
                  </Typography>
                </Box>
              )}

              {playsTotalPages > 1 && (
                <Box display="flex" justifyContent="center" p={2}>
                  <Pagination
                    count={playsTotalPages}
                    page={playsPage}
                    onChange={(e, page) => setPlaysPage(page)}
                    color="primary"
                  />
                </Box>
              )}
            </>
          )}
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          {resultsLoading ? (
            <Box display="flex" justifyContent="center" p={3}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Game Type</TableCell>
                      <TableCell>Draw Date</TableCell>
                      <TableCell>Winning Numbers</TableCell>
                      <TableCell>Total Winners</TableCell>
                      <TableCell>Total Prize</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredResults.map((result) => (
                      <TableRow key={result._id} hover>
                        <TableCell>{result.lotteryGameTypeName}</TableCell>
                        <TableCell>{formatDate(result.drawDate)}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            {result.winningNumbers.map((num, index) => (
                              <Chip key={index} label={num} size="small" />
                            ))}
                          </Box>
                        </TableCell>
                        <TableCell>{result.totalWinners}</TableCell>
                        <TableCell>{formatCurrency(result.totalPrizeAmount)}</TableCell>
                        <TableCell>
                          <Tooltip title="View Details">
                            <IconButton
                              size="small"
                              onClick={() => handleViewDetails(result)}
                            >
                              <ViewIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              
              {filteredResults.length === 0 && (
                <Box textAlign="center" py={4}>
                  <Typography color="text.secondary">
                    No results found
                  </Typography>
                </Box>
              )}
            </>
          )}
        </TabPanel>

        <TabPanel value={activeTab} index={2}>
          {ticketsLoading ? (
            <Box display="flex" justifyContent="center" p={3}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Ticket Number</TableCell>
                      <TableCell>Game Type</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Purchase Date</TableCell>
                      <TableCell>Draw Date</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredTickets.map((ticket) => (
                      <TableRow key={ticket._id} hover>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            {ticket.ticketNumber}
                          </Typography>
                        </TableCell>
                        <TableCell>{ticket.lotteryGameTypeName}</TableCell>
                        <TableCell>{formatCurrency(ticket.amount)}</TableCell>
                        <TableCell>
                          <Chip
                            label={getStatusLabel(ticket.status)}
                            color={getStatusColor(ticket.status) as any}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{formatDate(ticket.purchaseDate)}</TableCell>
                        <TableCell>{formatDate(ticket.drawDate)}</TableCell>
                        <TableCell>
                          <Tooltip title="View Details">
                            <IconButton
                              size="small"
                              onClick={() => handleViewDetails(ticket)}
                            >
                              <ViewIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              
              {filteredTickets.length === 0 && (
                <Box textAlign="center" py={4}>
                  <Typography color="text.secondary">
                    No tickets found
                  </Typography>
                </Box>
              )}
            </>
          )}
        </TabPanel>
      </Card>

      {/* Details Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">
              {selectedItem?.ticketNumber || selectedItem?.lotteryGameTypeName} Details
            </Typography>
            <IconButton onClick={() => setDialogOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedItem && (
            <Box>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Ticket Number
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {selectedItem.ticketNumber || 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Game Type
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {selectedItem.lotteryGameTypeName}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Amount
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {formatCurrency(selectedItem.playAmount || selectedItem.amount)}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Status
                  </Typography>
                  <Chip
                    label={getStatusLabel(selectedItem.status)}
                    color={getStatusColor(selectedItem.status) as any}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                {selectedItem.playNumbers && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Play Numbers
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                      {selectedItem.playNumbers.map((num: string, index: number) => (
                        <Chip key={index} label={num} size="small" />
                      ))}
                    </Box>
                  </Grid>
                )}
                {selectedItem.winningNumbers && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Winning Numbers
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                      {selectedItem.winningNumbers.map((num: string, index: number) => (
                        <Chip key={index} label={num} size="small" color="success" />
                      ))}
                    </Box>
                  </Grid>
                )}
                {selectedItem.prizeAmount && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Prize Amount
                    </Typography>
                    <Typography variant="h6" color="success.main" sx={{ mb: 2 }}>
                      {formatCurrency(selectedItem.prizeAmount)}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default LotteryHistory; 
