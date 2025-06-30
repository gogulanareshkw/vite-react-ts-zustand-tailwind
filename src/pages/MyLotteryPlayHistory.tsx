import React, { useEffect, useState } from 'react';
import { Container, Typography, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, TextField, MenuItem, Pagination, CircularProgress, Alert } from '@mui/material';
import { useStore } from '../store/useStore';
import type { LotteryGamePlay, LotteryGameSetting } from '../types';

const MyLotteryPlayHistory: React.FC = () => {
  const { api } = useStore();
  const [gameTypes, setGameTypes] = useState<LotteryGameSetting[]>([]);
  const [selectedGameType, setSelectedGameType] = useState<number | null>(null);
  const [history, setHistory] = useState<LotteryGamePlay[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    fetchGameTypes();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (selectedGameType) {
      fetchHistory();
    }
    // eslint-disable-next-line
  }, [selectedGameType, page]);

  const fetchGameTypes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.getLotteryGameSettings();
      setGameTypes(response.data || []);
      if (response.data && response.data.length > 0) {
        setSelectedGameType(response.data[0].lotteryGameType);
      }
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to load game types.');
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.getUserGameHistory(selectedGameType!, page, pageSize);
      setHistory(response.data || []);
      setTotalPages(response.totalPages || 1);
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to load play history.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center' }}>
        My Lottery Play History
      </Typography>
      <Card elevation={3} sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
            <TextField
              select
              label="Game Type"
              value={selectedGameType ?? ''}
              onChange={e => setSelectedGameType(Number(e.target.value))}
              sx={{ minWidth: 200 }}
            >
              {gameTypes.map(gt => (
                <MenuItem key={gt.lotteryGameType} value={gt.lotteryGameType}>
                  {gt.lotteryGameType} {/* Replace with gt.name or displayName if available */}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          {error && <Alert severity="error">{error}</Alert>}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Game Number</TableCell>
                    <TableCell>Ticket Number</TableCell>
                    <TableCell>Numbers</TableCell>
                    <TableCell align="right">Played Amount</TableCell>
                    <TableCell align="right">Discount</TableCell>
                    <TableCell align="right">Paid Amount</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {history.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center">No plays found.</TableCell>
                    </TableRow>
                  ) : (
                    history.map(play => (
                      <TableRow key={play._id}>
                        <TableCell>{new Date(play.played_at).toLocaleString()}</TableCell>
                        <TableCell>{play.gameNumber}</TableCell>
                        <TableCell>{play.ticketNumber}</TableCell>
                        <TableCell>
                          {play.numbers.map(n => `${n.number} (S:${n.straight}, R:${n.rumble})`).join(', ')}
                        </TableCell>
                        <TableCell align="right">{play.playedAmount.toLocaleString()}</TableCell>
                        <TableCell align="right">{play.discount.toLocaleString()}</TableCell>
                        <TableCell align="right">{play.paidAmount.toLocaleString()}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, value) => setPage(value)}
              color="primary"
            />
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default MyLotteryPlayHistory; 