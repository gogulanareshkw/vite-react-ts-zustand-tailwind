import React, { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { Container, Typography, Box, Card, CardContent, Table, TableHead, TableRow, TableCell, TableBody, TablePagination, Select, MenuItem, InputLabel, FormControl, Chip, CircularProgress, TextField } from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CasinoIcon from '@mui/icons-material/Casino';
import { format } from 'date-fns';
import type { LotteryGamePlay } from '../types';

const GAME_TYPE_LABELS: Record<number, string> = {
  1: 'Thailand',
  2: 'Bangkok Weekly',
  3: 'Dubai Daily',
  4: 'London Weekly',
  5: 'Mexico Monthly',
};

const MyLotteryPlayHistory: React.FC = () => {
  const { api, user } = useStore();
  const [history, setHistory] = useState<LotteryGamePlay[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [gameType, setGameType] = useState<number>(1);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadHistory();
    // eslint-disable-next-line
  }, [gameType, page, rowsPerPage]);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const type = Number(gameType) || 1;
      const res = await api.getUserGameHistory(type, page + 1, rowsPerPage);
      setHistory(res.data || []);
    } catch (e) {
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredHistory = history.filter((h) =>
    !search ||
    h.ticketNumber.toLowerCase().includes(search.toLowerCase()) ||
    h.numbers.some((n) => n.number.includes(search))
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          My Lottery Play History
        </Typography>
        <Typography variant="h6" color="text.secondary">
          View all your past lottery plays and tickets.
        </Typography>
      </Box>
      <Card elevation={3}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
            <FormControl sx={{ minWidth: 180 }}>
              <InputLabel>Game Type</InputLabel>
              <Select
                value={gameType}
                label="Game Type"
                onChange={(e) => setGameType(Number(e.target.value))}
              >
                <MenuItem value={1}>All</MenuItem>
                {Object.entries(GAME_TYPE_LABELS).map(([k, v]) => (
                  <MenuItem key={k} value={Number(k)}>{v}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Search Ticket/Number"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ minWidth: 220 }}
            />
          </Box>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
              <CircularProgress />
            </Box>
          ) : filteredHistory.length === 0 ? (
            <Typography sx={{ textAlign: 'center', py: 6 }} color="text.secondary">
              No play history found.
            </Typography>
          ) : (
            <Box sx={{ overflowX: 'auto' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Game</TableCell>
                    <TableCell>Ticket</TableCell>
                    <TableCell>Numbers</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredHistory.map((row) => (
                    <TableRow key={row._id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CasinoIcon color="primary" />
                          {GAME_TYPE_LABELS[row.lotteryGameType] || row.lotteryGameType}
                        </Box>
                      </TableCell>
                      <TableCell>{row.ticketNumber}</TableCell>
                      <TableCell>
                        {row.numbers.map((n, i) => (
                          <Chip key={i} label={n.number} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                        ))}
                      </TableCell>
                      <TableCell>₹{row.playedAmount.toFixed(2)}</TableCell>
                      <TableCell>{format(new Date(row.played_at), 'dd MMM yyyy, hh:mm a')}</TableCell>
                      <TableCell>
                        {/* Placeholder for status, can be enhanced with real result info */}
                        <Chip icon={<EmojiEventsIcon />} label={row.paidAmount > row.playedAmount ? 'Won' : 'Played'} color={row.paidAmount > row.playedAmount ? 'success' : 'info'} size="small" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <TablePagination
                component="div"
                count={1000} // TODO: Replace with real total count if available
                page={page}
                onPageChange={(_, newPage) => setPage(newPage)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
                rowsPerPageOptions={[10, 20, 50]}
              />
            </Box>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default MyLotteryPlayHistory; 