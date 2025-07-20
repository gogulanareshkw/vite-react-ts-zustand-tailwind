import React, { useEffect, useState } from 'react';
import { Container, Typography, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, CircularProgress, Alert, Chip } from '@mui/material';
import { useStore } from '../store/useStore';

interface Referral {
  _id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  isEmailVerified: boolean;
  isAgentVerified: boolean;
  createdDateTime: string;
}

const UserReferralsHistory: React.FC = () => {
  const { api } = useStore();
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    fetchReferrals();
    // eslint-disable-next-line
  }, [page]);

  const fetchReferrals = async () => {
    setLoading(true);
    setError(null);
    try {
      const allReferrals = await api.getMyReferralsHistory();
      setReferrals(allReferrals || []);
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to load referrals history.');
    } finally {
      setLoading(false);
    }
  };

  // Pagination logic
  const paginatedReferrals = referrals.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(referrals.length / pageSize);

  const getStatusChip = (ref: Referral) => {
    if (!ref.isEmailVerified) {
      return <Chip label="Email Pending" color="warning" size="small" />;
    }
    if (!ref.isAgentVerified) {
      return <Chip label="Agent Pending" color="info" size="small" />;
    }
    return <Chip label="Active" color="success" size="small" />;
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center' }}>
        Referrals History
      </Typography>
      <Card elevation={3} sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6">
              Total Referrals: <b>{referrals.length}</b>
            </Typography>
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
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedReferrals.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center">No referrals found.</TableCell>
                    </TableRow>
                  ) : (
                    paginatedReferrals.map(ref => (
                      <TableRow key={ref._id}>
                        <TableCell>{new Date(ref.createdDateTime).toLocaleString()}</TableCell>
                        <TableCell>{ref.firstName || ''} {ref.lastName || ''}</TableCell>
                        <TableCell>{ref.email}</TableCell>
                        <TableCell>{getStatusChip(ref)}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            {totalPages > 1 && (
              <Box>
                <Typography variant="body2" sx={{ mr: 2, display: 'inline' }}>
                  Page {page} of {totalPages}
                </Typography>
                <button onClick={() => setPage(page - 1)} disabled={page === 1} style={{ marginRight: 8 }}>
                  Prev
                </button>
                <button onClick={() => setPage(page + 1)} disabled={page === totalPages}>
                  Next
                </button>
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default UserReferralsHistory; 
