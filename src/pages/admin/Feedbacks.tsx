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
  Pagination,
  Rating,
  Avatar,
  Divider,
  TextareaAutosize
} from '@mui/material';
import {
  Feedback as FeedbackIcon,
  Reply as ReplyIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Star as StarIcon,
  Email as EmailIcon
} from '@mui/icons-material';
import { useStore } from '../../store/useStore';
import { format } from 'date-fns';

interface Feedback {
  _id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userAvatar?: string;
  rating: number;
  message: string;
  category: 'general' | 'technical' | 'payment' | 'game' | 'support';
  status: 'pending' | 'reviewed' | 'resolved' | 'closed';
  createdAt: string;
  updatedAt: string;
  adminResponse?: string;
  respondedBy?: string;
  respondedAt?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

const Feedbacks: React.FC = () => {
  const { notification, api } = useStore();
  const [loading, setLoading] = useState(true);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [adminReply, setAdminReply] = useState('');

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');

  useEffect(() => {
    loadFeedbacks();
  }, [currentPage, categoryFilter, statusFilter, priorityFilter, ratingFilter]);

  const loadFeedbacks = async () => {
    try {
      setLoading(true);
      const response = await api.getAllFeedbacks(currentPage, 20);
      if (response.success) {
        setFeedbacks(response.data || []);
        setTotalPages(response.totalPages || 1);
      } else {
        setError('Failed to load feedbacks');
      }
    } catch (err) {
      setError('Failed to load feedbacks');
      console.error('Error loading feedbacks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async () => {
    if (!selectedFeedback || !adminReply.trim()) return;

    try {
      // This would be implemented based on your backend API
      // const response = await api.replyToFeedback(selectedFeedback._id, adminReply);
      
      notification.show('Reply sent successfully', 'success');
      setReplyDialogOpen(false);
      setAdminReply('');
      loadFeedbacks();
    } catch (err) {
      notification.show('Failed to send reply', 'error');
    }
  };

  const handleUpdateStatus = async (feedbackId: string, status: string) => {
    try {
      // This would be implemented based on your backend API
      // const response = await api.updateFeedbackStatus(feedbackId, status);
      
      notification.show('Status updated successfully', 'success');
      loadFeedbacks();
    } catch (err) {
      notification.show('Failed to update status', 'error');
    }
  };

  const handleDeleteFeedback = async (feedbackId: string) => {
    if (!window.confirm('Are you sure you want to delete this feedback?')) return;

    try {
      // This would be implemented based on your backend API
      // const response = await api.deleteFeedback(feedbackId);
      
      notification.show('Feedback deleted successfully', 'success');
      loadFeedbacks();
    } catch (err) {
      notification.show('Failed to delete feedback', 'error');
    }
  };

  const handleViewDetails = (feedback: Feedback) => {
    setSelectedFeedback(feedback);
    setDetailsDialogOpen(true);
  };

  const handleOpenReply = (feedback: Feedback) => {
    setSelectedFeedback(feedback);
    setAdminReply('');
    setReplyDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'success';
      case 'reviewed': return 'info';
      case 'pending': return 'warning';
      case 'closed': return 'default';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'default';
      default: return 'default';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'technical': return 'error';
      case 'payment': return 'warning';
      case 'game': return 'info';
      case 'support': return 'primary';
      case 'general': return 'default';
      default: return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
  };

  const filteredFeedbacks = feedbacks.filter(feedback => {
    const matchesSearch = feedback.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         feedback.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         feedback.userEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || feedback.category === categoryFilter;
    const matchesStatus = !statusFilter || feedback.status === statusFilter;
    const matchesPriority = !priorityFilter || feedback.priority === priorityFilter;
    const matchesRating = !ratingFilter || feedback.rating === parseInt(ratingFilter);
    
    return matchesSearch && matchesCategory && matchesStatus && matchesPriority && matchesRating;
  });

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
          <FeedbackIcon sx={{ mr: 2, verticalAlign: 'middle' }} />
          User Feedbacks
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage user feedback, reviews, and support requests
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
              <TextField
                fullWidth
                label="Search Feedbacks"
                placeholder="Search by message, user name, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <SearchIcon />
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  label="Category"
                >
                  <MenuItem value="">All Categories</MenuItem>
                  <MenuItem value="general">General</MenuItem>
                  <MenuItem value="technical">Technical</MenuItem>
                  <MenuItem value="payment">Payment</MenuItem>
                  <MenuItem value="game">Game</MenuItem>
                  <MenuItem value="support">Support</MenuItem>
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
                  <MenuItem value="">All Status</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="reviewed">Reviewed</MenuItem>
                  <MenuItem value="resolved">Resolved</MenuItem>
                  <MenuItem value="closed">Closed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={2}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  label="Priority"
                >
                  <MenuItem value="">All Priorities</MenuItem>
                  <MenuItem value="urgent">Urgent</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="low">Low</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={2}>
              <FormControl fullWidth>
                <InputLabel>Rating</InputLabel>
                <Select
                  value={ratingFilter}
                  onChange={(e) => setRatingFilter(e.target.value)}
                  label="Rating"
                >
                  <MenuItem value="">All Ratings</MenuItem>
                  <MenuItem value="5">5 Stars</MenuItem>
                  <MenuItem value="4">4 Stars</MenuItem>
                  <MenuItem value="3">3 Stars</MenuItem>
                  <MenuItem value="2">2 Stars</MenuItem>
                  <MenuItem value="1">1 Star</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Feedbacks Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Feedback List
          </Typography>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Rating</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Priority</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredFeedbacks.map((feedback) => (
                  <TableRow key={feedback._id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ mr: 2, width: 32, height: 32 }}>
                          {feedback.userAvatar ? (
                            <img src={feedback.userAvatar} alt={feedback.userName} />
                          ) : (
                            feedback.userName.charAt(0)
                          )}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            {feedback.userName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {feedback.userEmail}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Rating value={feedback.rating} readOnly size="small" />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={feedback.category}
                        color={getCategoryColor(feedback.category) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={feedback.priority}
                        color={getPriorityColor(feedback.priority) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={feedback.status}
                        color={getStatusColor(feedback.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(feedback.createdAt)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="View Details">
                          <IconButton
                            size="small"
                            onClick={() => handleViewDetails(feedback)}
                          >
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Reply">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleOpenReply(feedback)}
                          >
                            <ReplyIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteFeedback(feedback._id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {filteredFeedbacks.length === 0 && (
            <Box textAlign="center" py={4}>
              <Typography color="text.secondary">
                No feedbacks found matching your criteria
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

      {/* Feedback Details Dialog */}
      <Dialog
        open={detailsDialogOpen}
        onClose={() => setDetailsDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6">
            Feedback Details
          </Typography>
        </DialogTitle>
        <DialogContent>
          {selectedFeedback && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ mr: 2 }}>
                    {selectedFeedback.userAvatar ? (
                      <img src={selectedFeedback.userAvatar} alt={selectedFeedback.userName} />
                    ) : (
                      selectedFeedback.userName.charAt(0)
                    )}
                  </Avatar>
                  <Box>
                    <Typography variant="h6">
                      {selectedFeedback.userName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedFeedback.userEmail}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Rating
                </Typography>
                <Rating value={selectedFeedback.rating} readOnly sx={{ mb: 2 }} />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Category
                </Typography>
                <Chip
                  label={selectedFeedback.category}
                  color={getCategoryColor(selectedFeedback.category) as any}
                  sx={{ mb: 2 }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Priority
                </Typography>
                <Chip
                  label={selectedFeedback.priority}
                  color={getPriorityColor(selectedFeedback.priority) as any}
                  sx={{ mb: 2 }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Status
                </Typography>
                <Chip
                  label={selectedFeedback.status}
                  color={getStatusColor(selectedFeedback.status) as any}
                  sx={{ mb: 2 }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">
                  Message
                </Typography>
                <Paper sx={{ p: 2, bgcolor: 'grey.50', mb: 2 }}>
                  <Typography variant="body1">
                    {selectedFeedback.message}
                  </Typography>
                </Paper>
              </Grid>
              
              {selectedFeedback.adminResponse && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Admin Response
                  </Typography>
                  <Paper sx={{ p: 2, bgcolor: 'primary.50', mb: 2 }}>
                    <Typography variant="body1">
                      {selectedFeedback.adminResponse}
                    </Typography>
                    {selectedFeedback.respondedBy && (
                      <Typography variant="caption" color="text.secondary">
                        - {selectedFeedback.respondedBy} on {selectedFeedback.respondedAt && formatDate(selectedFeedback.respondedAt)}
                      </Typography>
                    )}
                  </Paper>
                </Grid>
              )}
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Created At
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  {formatDate(selectedFeedback.createdAt)}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Updated At
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  {formatDate(selectedFeedback.updatedAt)}
                </Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsDialogOpen(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reply Dialog */}
      <Dialog
        open={replyDialogOpen}
        onClose={() => setReplyDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6">
            Reply to Feedback
          </Typography>
        </DialogTitle>
        <DialogContent>
          {selectedFeedback && (
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Original Feedback from {selectedFeedback.userName}:
              </Typography>
              <Paper sx={{ p: 2, bgcolor: 'grey.50', mb: 3 }}>
                <Typography variant="body1">
                  {selectedFeedback.message}
                </Typography>
              </Paper>
              
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Your Response:
              </Typography>
              <TextareaAutosize
                minRows={4}
                placeholder="Enter your response..."
                value={adminReply}
                onChange={(e) => setAdminReply(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  fontFamily: 'inherit',
                  fontSize: '14px'
                }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReplyDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleReply}
            variant="contained"
            disabled={!adminReply.trim()}
          >
            Send Reply
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Feedbacks; 