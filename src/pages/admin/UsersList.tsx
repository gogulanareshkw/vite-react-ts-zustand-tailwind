import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Pagination,
  Switch,
  Tooltip,
} from '@mui/material';
import {
  ArrowBack,
  Search,
  Visibility,
  Block,
  CheckCircle,
  Edit,
  Delete,
  Add,
  Refresh,
  FilterList,
} from '@mui/icons-material';
import { useStore } from '../../store/useStore';
import apiService from '../../services/api';

interface AdminUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  userRole: number;
  isEmailVerified: boolean;
  isAgentVerified: boolean;
  isBlocked: boolean;
  availableAmount: number;
  createdAt: string;
  lastLoginAt?: string;
}

const UsersList: React.FC = () => {
  const navigate = useNavigate();
  const { addNotification } = useStore();

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [showUserDialog, setShowUserDialog] = useState(false);
  const [showBlockDialog, setShowBlockDialog] = useState(false);

  const pageSize = 10;

  useEffect(() => {
    loadUsers();
  }, [page, searchTerm, filterRole, filterStatus]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAllUsers(page, pageSize);
      setUsers(response.data || []);
      setTotalPages(Math.ceil((response.totalCount || 0) / pageSize));
    } catch (error: any) {
      addNotification({
        message: 'Failed to load users',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBlockUser = async (userId: string, blocked: boolean) => {
    try {
      setLoading(true);
      await apiService.blockUserByAdmin(userId, blocked);
      
      addNotification({
        message: `User ${blocked ? 'blocked' : 'unblocked'} successfully`,
        type: 'success',
      });
      
      loadUsers();
    } catch (error: any) {
      addNotification({
        message: 'Failed to update user status',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const getRoleLabel = (role: number) => {
    switch (role) {
      case 1:
        return { label: 'User', color: 'default' as const };
      case 2:
        return { label: 'Agent', color: 'primary' as const };
      case 3:
        return { label: 'Staff', color: 'secondary' as const };
      case 4:
        return { label: 'Admin', color: 'error' as const };
      case 5:
        return { label: 'Super Admin', color: 'warning' as const };
      default:
        return { label: 'Unknown', color: 'default' as const };
    }
  };

  const getStatusChip = (user: AdminUser) => {
    if (user.isBlocked) {
      return <Chip label="Blocked" color="error" size="small" />;
    }
    if (!user.isEmailVerified) {
      return <Chip label="Email Pending" color="warning" size="small" />;
    }
    if (!user.isAgentVerified && user.userRole === 2) {
      return <Chip label="Agent Pending" color="warning" size="small" />;
    }
    return <Chip label="Active" color="success" size="small" />;
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phoneNumber.includes(searchTerm);
    
    const matchesRole = filterRole === 'all' || user.userRole.toString() === filterRole;
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'blocked' && user.isBlocked) ||
      (filterStatus === 'active' && !user.isBlocked) ||
      (filterStatus === 'pending' && !user.isEmailVerified);

    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={() => navigate('/dashboard')}
          sx={{ mb: 2 }}
        >
          Back to Dashboard
        </Button>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
              Users Management
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Manage all registered users and their accounts
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Refresh />}
            onClick={loadUsers}
            disabled={loading}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      {/* Filters */}
      <Card elevation={3} sx={{ mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <TextField
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: 250 }}
            />
            
            <TextField
              select
              label="Role"
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              sx={{ minWidth: 120 }}
            >
              <option value="all">All Roles</option>
              <option value="1">User</option>
              <option value="2">Agent</option>
              <option value="3">Staff</option>
              <option value="4">Admin</option>
              <option value="5">Super Admin</option>
            </TextField>
            
            <TextField
              select
              label="Status"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              sx={{ minWidth: 120 }}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="blocked">Blocked</option>
              <option value="pending">Pending</option>
            </TextField>
          </Box>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card elevation={3}>
        <CardContent sx={{ p: 0 }}>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'primary.main' }}>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>User</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Contact</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Role</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Balance</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Joined</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user._id} hover>
                    <TableCell>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                          {user.firstName} {user.lastName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          ID: {user._id.slice(-8)}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">{user.email}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {user.phoneNumber}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getRoleLabel(user.userRole).label}
                        color={getRoleLabel(user.userRole).color}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {getStatusChip(user)}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        ₹{user.availableAmount?.toFixed(2) || '0.00'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(user.createdAt).toLocaleTimeString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="View Details">
                          <IconButton
                            size="small"
                            onClick={() => {
                              setSelectedUser(user);
                              setShowUserDialog(true);
                            }}
                          >
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                        
                        <Tooltip title={user.isBlocked ? 'Unblock User' : 'Block User'}>
                          <IconButton
                            size="small"
                            color={user.isBlocked ? 'success' : 'error'}
                            onClick={() => {
                              setSelectedUser(user);
                              setShowBlockDialog(true);
                            }}
                          >
                            {user.isBlocked ? <CheckCircle /> : <Block />}
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Pagination */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(_, newPage) => setPage(newPage)}
          color="primary"
        />
      </Box>

      {/* User Details Dialog */}
      <Dialog open={showUserDialog} onClose={() => setShowUserDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>User Details</DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Box sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                {selectedUser.firstName} {selectedUser.lastName}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Email: {selectedUser.email}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Phone: {selectedUser.phoneNumber}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Role: {getRoleLabel(selectedUser.userRole).label}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Balance: ₹{selectedUser.availableAmount?.toFixed(2) || '0.00'}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Joined: {new Date(selectedUser.createdAt).toLocaleString()}
              </Typography>
              {selectedUser.lastLoginAt && (
                <Typography variant="body2" color="text.secondary" paragraph>
                  Last Login: {new Date(selectedUser.lastLoginAt).toLocaleString()}
                </Typography>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowUserDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Block/Unblock Dialog */}
      <Dialog open={showBlockDialog} onClose={() => setShowBlockDialog(false)}>
        <DialogTitle>
          {selectedUser?.isBlocked ? 'Unblock User' : 'Block User'}
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to {selectedUser?.isBlocked ? 'unblock' : 'block'} 
            {selectedUser?.firstName} {selectedUser?.lastName}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowBlockDialog(false)}>Cancel</Button>
          <Button
            onClick={() => {
              if (selectedUser) {
                handleBlockUser(selectedUser._id, !selectedUser.isBlocked);
                setShowBlockDialog(false);
              }
            }}
            color={selectedUser?.isBlocked ? 'success' : 'error'}
            variant="contained"
          >
            {selectedUser?.isBlocked ? 'Unblock' : 'Block'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UsersList; 