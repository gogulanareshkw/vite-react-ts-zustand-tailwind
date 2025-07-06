import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Pagination
} from '@mui/material';
import {
  People as AgentsIcon,
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Visibility as ViewIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { useStore } from '../../store/useStore';
import { format } from 'date-fns';

interface ApplicationAgent {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: 'pending' | 'approved' | 'rejected';
  applicationDate: string;
  reviewedDate?: string;
  reviewedBy?: string;
  rejectionReason?: string;
  documents: {
    idProof: string;
    addressProof: string;
    bankStatement: string;
  };
  bankDetails?: {
    accountNumber: string;
    ifscCode: string;
    bankName: string;
    accountHolderName: string;
  };
  commission: number;
  experience: string;
  reason: string;
}

const ApplicationAgents: React.FC = () => {
  const { notification, api } = useStore();
  const [loading, setLoading] = useState(true);
  const [agents, setAgents] = useState<ApplicationAgent[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<ApplicationAgent | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    loadAgents();
  }, [currentPage, statusFilter]);

  const loadAgents = async () => {
    try {
      setLoading(true);
      const response = await api.getAllApplicationAgents(currentPage, 20);
      if (response.success) {
        setAgents(response.data || []);
        setTotalPages(response.totalPages || 1);
      } else {
        setError('Failed to load agent applications');
      }
    } catch (err) {
      setError('Failed to load agent applications');
      console.error('Error loading agents:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveAgent = async (agentId: string) => {
    try {
      const response = await api.updateApplicationAgentStatus(agentId, 'approved');
      if (response.success) {
        notification.show('Agent approved successfully', 'success');
        loadAgents();
      } else {
        notification.show('Failed to approve agent', 'error');
      }
    } catch (err) {
      notification.show('Failed to approve agent', 'error');
    }
  };

  const handleRejectAgent = async (agentId: string) => {
    try {
      const response = await api.updateApplicationAgentStatus(agentId, 'rejected');
      if (response.success) {
        notification.show('Agent rejected successfully', 'success');
        loadAgents();
      } else {
        notification.show('Failed to reject agent', 'error');
      }
    } catch (err) {
      notification.show('Failed to reject agent', 'error');
    }
  };

  const handleViewDetails = (agent: ApplicationAgent) => {
    setSelectedAgent(agent);
    setDetailsDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'success';
      case 'rejected': return 'error';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
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

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          <AgentsIcon sx={{ mr: 2, verticalAlign: 'middle' }} />
          Agent Applications
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage agent applications and approvals
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Status Filter</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  label="Status Filter"
                >
                  <MenuItem value="">All Status</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="approved">Approved</MenuItem>
                  <MenuItem value="rejected">Rejected</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={loadAgents}
              >
                Refresh
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Agents Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Agent Applications
          </Typography>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Application Date</TableCell>
                  <TableCell>Commission</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {agents.map((agent) => (
                  <TableRow key={agent._id} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {agent.firstName} {agent.lastName}
                      </Typography>
                    </TableCell>
                    <TableCell>{agent.email}</TableCell>
                    <TableCell>{agent.phone}</TableCell>
                    <TableCell>
                      <Chip
                        label={agent.status.toUpperCase()}
                        color={getStatusColor(agent.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{formatDate(agent.applicationDate)}</TableCell>
                    <TableCell>{agent.commission}%</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="View Details">
                          <IconButton
                            size="small"
                            onClick={() => handleViewDetails(agent)}
                          >
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                        {agent.status === 'pending' && (
                          <>
                            <Tooltip title="Approve">
                              <IconButton
                                size="small"
                                color="success"
                                onClick={() => handleApproveAgent(agent._id)}
                              >
                                <ApproveIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Reject">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleRejectAgent(agent._id)}
                              >
                                <RejectIcon />
                              </IconButton>
                            </Tooltip>
                          </>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {agents.length === 0 && (
            <Box textAlign="center" py={4}>
              <Typography color="text.secondary">
                No agent applications found
              </Typography>
            </Box>
          )}

          {totalPages > 1 && (
            <Box display="flex" justifyContent="center" mt={3}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(e, page) => setCurrentPage(page)}
                color="primary"
              />
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Agent Details Dialog */}
      <Dialog
        open={detailsDialogOpen}
        onClose={() => setDetailsDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6">
            Agent Application Details
          </Typography>
        </DialogTitle>
        <DialogContent>
          {selectedAgent && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Full Name
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {selectedAgent.firstName} {selectedAgent.lastName}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Email
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {selectedAgent.email}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Phone
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {selectedAgent.phone}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Commission
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {selectedAgent.commission}%
                </Typography>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">
                  Experience
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {selectedAgent.experience}
                </Typography>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">
                  Reason for Application
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {selectedAgent.reason}
                </Typography>
              </Grid>
              
              {selectedAgent.bankDetails && (
                <>
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>
                      Bank Details
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Bank Name
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {selectedAgent.bankDetails.bankName}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Account Number
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      ****{selectedAgent.bankDetails.accountNumber.slice(-4)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      IFSC Code
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {selectedAgent.bankDetails.ifscCode}
                    </Typography>
                  </Grid>
                </>
              )}
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Application Date
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {formatDate(selectedAgent.applicationDate)}
                </Typography>
              </Grid>
              
              {selectedAgent.reviewedDate && (
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Reviewed Date
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {formatDate(selectedAgent.reviewedDate)}
                  </Typography>
                </Grid>
              )}
              
              {selectedAgent.rejectionReason && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Rejection Reason
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {selectedAgent.rejectionReason}
                  </Typography>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsDialogOpen(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ApplicationAgents; 