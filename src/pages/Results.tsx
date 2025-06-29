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
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
} from '@mui/material';
import {
  EmojiEvents,
  Casino,
  ArrowBack,
  Search,
  FilterList,
  TrendingUp,
} from '@mui/icons-material';
import { useStore } from '../store/useStore';
import apiService from '../services/api';
import type { LotteryGameResult, WinnerDetail } from '../types';

const Results: React.FC = () => {
  const navigate = useNavigate();
  const { addNotification } = useStore();

  const [results, setResults] = useState<LotteryGameResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedGameType, setSelectedGameType] = useState('all');
  const [selectedTab, setSelectedTab] = useState(0);
  const [gameTypes, setGameTypes] = useState<string[]>([]);

  useEffect(() => {
    loadResults();
    loadGameTypes();
  }, []);

  const loadResults = async () => {
    setIsLoading(true);
    try {
      // Load results for all game types (using type 1 as default)
      const response = await apiService.getLotteryGameResults(1);
      if (response.success) {
        setResults(response.data || []);
      }
    } catch (error) {
      console.error('Failed to load results:', error);
      addNotification({
        message: 'Failed to load lottery results',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadGameTypes = async () => {
    try {
      const response = await apiService.getLotteryGameBoards();
      if (response.success) {
        const types = [...new Set(response.data?.map((game: any) => game.lotteryGameType) || [])];
        setGameTypes(types.map(String));
      }
    } catch (error) {
      console.error('Failed to load game types:', error);
    }
  };

  const filteredResults = results.filter(result => {
    if (selectedGameType === 'all') return true;
    return result.lotteryGameType.toString() === selectedGameType;
  });

  const recentResults = filteredResults.slice(0, 10);
  const topWinners = filteredResults
    .flatMap(result => result.winners?.details || [])
    .sort((a, b) => b.finalWinningAmount - a.finalWinningAmount)
    .slice(0, 10);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'success';
      case 'pending': return 'warning';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `${rank}`;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Lottery Results
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Check the latest lottery results and winners
        </Typography>
      </Box>

      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={() => navigate('/dashboard')}
        >
          Back to Dashboard
        </Button>

        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Filter by Game Type</InputLabel>
          <Select
            value={selectedGameType}
            onChange={(e) => setSelectedGameType(e.target.value)}
            label="Filter by Game Type"
          >
            <MenuItem value="all">All Games</MenuItem>
            {gameTypes.map((type) => (
              <MenuItem key={type} value={type}>
                Game Type {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={selectedTab} onChange={(e, newValue) => setSelectedTab(newValue)}>
          <Tab label="Recent Results" />
          <Tab label="Top Winners" />
        </Tabs>
      </Box>

      {selectedTab === 0 && (
        <Box>
          {recentResults.length === 0 ? (
            <Card elevation={4}>
              <CardContent sx={{ p: 6, textAlign: 'center' }}>
                <EmojiEvents sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  No Results Found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  No lottery results available for the selected criteria.
                </Typography>
              </CardContent>
            </Card>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {recentResults.map((result) => (
                <Card elevation={4} key={result._id}>
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                      <Box>
                        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                          Game Type {result.lotteryGameType}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Game Number: {result.gameNumber} • Draw Date: {formatDate(result.drawDate)}
                        </Typography>
                      </Box>
                      <Chip
                        label="Completed"
                        color="success"
                        size="small"
                      />
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                        Winning Result
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Chip
                          label={result.result}
                          color="primary"
                          variant="outlined"
                          sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}
                        />
                      </Box>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                        Game Statistics
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            Game Number
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            {result.gameNumber}
                          </Typography>
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            Draw Date
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            {formatDate(result.drawDate)}
                          </Typography>
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            Winners
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            {result.winners?.details?.length || 0}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    {result.winners?.details && result.winners.details.length > 0 && (
                      <Box>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                          Winners
                        </Typography>
                        <TableContainer component={Paper} variant="outlined">
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>Rank</TableCell>
                                <TableCell>Ticket Number</TableCell>
                                <TableCell>Gross Amount</TableCell>
                                <TableCell>Commission</TableCell>
                                <TableCell align="right">Final Amount</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {result.winners.details.slice(0, 5).map((winner, index) => (
                                <TableRow key={winner._id}>
                                  <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      <span style={{ fontSize: '1.2rem' }}>
                                        {getRankIcon(index + 1)}
                                      </span>
                                      <Typography variant="body2">
                                        {index + 1}
                                      </Typography>
                                    </Box>
                                  </TableCell>
                                  <TableCell>
                                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                      #{winner.ticketNumber}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography variant="body2" color="text.secondary">
                                      ₹{winner.grossWinningAmount?.toLocaleString()}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography variant="body2" color="text.secondary">
                                      ₹{winner.commission?.toLocaleString()}
                                    </Typography>
                                  </TableCell>
                                  <TableCell align="right">
                                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                                      ₹{winner.finalWinningAmount?.toLocaleString()}
                                    </Typography>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                        {result.winners.details.length > 5 && (
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
                            And {result.winners.details.length - 5} more winners...
                          </Typography>
                        )}
                      </Box>
                    )}
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
        </Box>
      )}

      {selectedTab === 1 && (
        <Box>
          <Card elevation={4}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                Top Winners
              </Typography>

              {topWinners.length === 0 ? (
                <Typography variant="body2" color="text.secondary" textAlign="center">
                  No winners found for the selected criteria.
                </Typography>
              ) : (
                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Rank</TableCell>
                        <TableCell>Ticket Number</TableCell>
                        <TableCell>Gross Amount</TableCell>
                        <TableCell>Commission</TableCell>
                        <TableCell align="right">Final Amount</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {topWinners.map((winner, index) => (
                        <TableRow key={winner._id}>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <span style={{ fontSize: '1.2rem' }}>
                                {getRankIcon(index + 1)}
                              </span>
                              <Typography variant="body2">
                                {index + 1}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                              #{winner.ticketNumber}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary">
                              ₹{winner.grossWinningAmount?.toLocaleString()}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary">
                              ₹{winner.commission?.toLocaleString()}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                              ₹{winner.finalWinningAmount?.toLocaleString()}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Box>
      )}

      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Button
          variant="outlined"
          onClick={() => navigate('/lottery-game')}
        >
          Play Lottery Games
        </Button>
      </Box>
    </Container>
  );
};

export default Results; 