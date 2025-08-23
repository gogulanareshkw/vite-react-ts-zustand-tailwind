import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useStore } from '../store/useStore';
import { useParams } from 'react-router-dom';
import { usePageData } from '../hooks/usePageData';
import type { ExtendedBankCard, BankCardsResponse } from '../types';

const BankCards: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const {
    userBankCards,
    setUserBankCards,
    api,
    notification,
  } = useStore();

  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCardId, setEditingCardId] = useState<string>('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [cardToDelete, setCardToDelete] = useState<string>('');
  const [form, setForm] = useState<{
    type: 'UPI' | 'BANK' | '';
    upiId: string;
    phoneNumber: string;
    accountNumber: string;
    accountHolderName: string;
    ifscCode: string;
  }>({
    type: '',
    upiId: '',
    phoneNumber: '',
    accountNumber: '',
    accountHolderName: '',
    ifscCode: '',
  });

  const [loading, setLocalLoading] = useState(false);

  // Use the custom hook for data fetching - always fetch on page visit
  const { isLoading: isPageLoading, refreshData } = usePageData({
    pageName: 'BankCards',
    fetchFunction: async () => {
      const res = await api.getUserBankCards() as BankCardsResponse;
      console.log('BankCards: API response:', res);
      if (res.success && res.bankCards) {
        setUserBankCards(res.bankCards);
      } else {
        notification.show(res.message || 'Failed to fetch bank cards', 'error');
      }
    },
    dependencies: [] // Empty array - only run once on mount, but will run on every page visit
  });

  const handleOpen = () => {
    setIsEditing(false);
    setEditingCardId('');
    setForm({
      type: '',
      upiId: '',
      phoneNumber: '',
      accountNumber: '',
      accountHolderName: '',
      ifscCode: '',
    });
    setOpen(true);
  };

  const handleEdit = (card: ExtendedBankCard) => {
    setIsEditing(true);
    setEditingCardId(card._id);
    setForm({
      type: card.type,
      upiId: card.upiId || '',
      phoneNumber: card.phoneNumber || '',
      accountNumber: card.accountNumber || '',
      accountHolderName: card.accountHolderName || '',
      ifscCode: card.ifscCode || '',
    });
    setOpen(true);
  };
  
  const handleClose = () => {
    setOpen(false);
    setIsEditing(false);
    setEditingCardId('');
    setForm({
      type: '',
      upiId: '',
      phoneNumber: '',
      accountNumber: '',
      accountHolderName: '',
      ifscCode: '',
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name as string]: value });
  };

  const handleAdd = async () => {
    setLocalLoading(true);
    try {
      // Basic validation based on type
      if (!form.type) {
        notification.show('Please select a type.', 'error');
        setLocalLoading(false);
        return;
      }

      if (form.type === 'UPI') {
        if (!form.upiId || !form.phoneNumber) {
          notification.show('Please fill all required fields for UPI.', 'error');
          setLocalLoading(false);
          return;
        }
      } else if (form.type === 'BANK') {
        if (!form.accountNumber || !form.accountHolderName || !form.ifscCode || !form.phoneNumber) {
          notification.show('Please fill all required fields for Bank.', 'error');
          setLocalLoading(false);
          return;
        }
      }

      // Prepare payload based on type
      let payload;
      if (form.type === 'UPI') {
        payload = {
          upiId: form.upiId,
          phoneNumber: form.phoneNumber,
          type: 'UPI'
        };
      } else {
        payload = {
          accountNumber: form.accountNumber,
          accountHolderName: form.accountHolderName,
          ifscCode: form.ifscCode,
          phoneNumber: form.phoneNumber,
          type: 'BANK'
        };
      }

      let res;
      if (isEditing) {
        // Update existing bank card
        res = await api.updateBankCard(editingCardId, payload as any);
      } else {
        res = await api.createBankCard(payload as any);
      }

      console.log('API Response:', res); // Debug log

      if (res.success) {
        if (isEditing) {
          notification.show('Bank details updated successfully', 'success');
        } else {
          notification.show('Bank details added successfully', 'success');
        }
        // Always close the modal on success
        handleClose();
        // Refresh data to show the latest information
        await refreshData();
      } else {
        notification.show(res.message || `Failed to ${isEditing ? 'update' : 'add'} bank details`, 'error');
      }
    } catch (e: any) {
      console.error('Error in handleAdd:', e); // Debug log
      notification.show(e?.response?.data?.message || `Failed to ${isEditing ? 'update' : 'add'} bank details`, 'error');
    } finally {
      setLocalLoading(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    setCardToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const res = await api.deleteBankCard(cardToDelete);
      if (res.success) {
        notification.show('Bank card deleted successfully', 'success');
        // Refresh data to show the latest information
        await refreshData();
      } else {
        notification.show(res.message || 'Failed to delete card', 'error');
      }
    } catch (e: any) {
      notification.show(e?.response?.data?.message || 'Failed to delete card', 'error');
    } finally {
      setDeleteDialogOpen(false);
      setCardToDelete('');
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setCardToDelete('');
  };

  const handleSetDefault = async (id: string) => {
    try {
      const res = await api.setDefaultBankCard(id);
      if (res.success) {
        notification.show('Default bank card updated', 'success');
        // Refresh data to show the latest information
        await refreshData();
      } else {
        notification.show(res.message || 'Failed to set default card', 'error');
      }
    } catch (e: any) {
      notification.show(e?.response?.data?.message || 'Failed to set default card', 'error');
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
        <Typography variant="h4" fontWeight="bold">Bank Cards</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpen}>
          Add Card
        </Button>
      </Box>
      {/* isLoading && <Box display="flex" justifyContent="center" my={4}><CircularProgress /></Box> */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 3 }}>
        {userBankCards.length === 0 && !isPageLoading && (
          <Box sx={{ gridColumn: '1 / -1' }}>
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" color="text.secondary">
                  No bank cards found
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Add your first bank card to get started
                </Typography>
              </CardContent>
            </Card>
          </Box>
        )}
        {userBankCards.map((card) => (
          <Card 
            key={card._id} 
            sx={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              borderRadius: 2,
              position: 'relative',
              overflow: 'hidden',
              aspectRatio: '1.6',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.15) 0%, transparent 60%)',
                pointerEvents: 'none'
              }
            }}
          >
            <CardContent sx={{ p: 3, position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column' }}>
              {/* Header */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box 
                    sx={{ 
                      width: 32, 
                      height: 32, 
                      border: '2px solid white', 
                      borderRadius: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.1)'
                      }
                    }}
                    onClick={() => handleSetDefault(card._id)}
                  >
                    {card.isActive ? '✓' : ''}
                  </Box>

                </Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                  {card.type === 'UPI' ? 'UPI' : 'BANK'}
                </Typography>
              </Box>

              {/* Main Content */}
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                {card.type === 'UPI' ? (
                  <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1, wordBreak: 'break-all' }}>
                    {card.upiId}
                  </Typography>
                ) : (
                  <>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {card.accountNumber}
                    </Typography>
                    <Typography variant="h6" sx={{ mb: 1, opacity: 0.9 }}>
                      {card.accountHolderName}
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.8 }}>
                      IFSC : {card.ifscCode}
                    </Typography>
                  </>
                )}
              </Box>

              {/* Footer */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 16, height: 16, bgcolor: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>
                    📞
                  </Box>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    {card.phoneNumber}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton
                    size="small"
                    onClick={() => handleEdit(card)}
                    sx={{ 
                      color: 'white', 
                      bgcolor: 'rgba(255,255,255,0.1)',
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }
                    }}
                  >
                    ✏️
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteClick(card._id)}
                    sx={{ 
                      color: 'white', 
                      bgcolor: 'rgba(255,255,255,0.1)',
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }
                    }}
                  >
                    🗑️
                  </IconButton>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
      {/* Add Bank Details Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{isEditing ? 'Edit Bank Details' : 'Add New Bank Details'}</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                name="type"
                value={form.type}
                label="Type"
                onChange={handleChange}
                required
              >
                <MenuItem value="UPI">UPI</MenuItem>
                <MenuItem value="BANK">Bank</MenuItem>
              </Select>
            </FormControl>

            {form.type === 'UPI' && (
              <>
                <TextField
                  label="UPI ID"
                  name="upiId"
                  value={form.upiId}
                  onChange={handleChange}
                  required
                  placeholder="UPI ID"
                />
                <TextField
                  label="Phone Number"
                  name="phoneNumber"
                  value={form.phoneNumber}
                  onChange={handleChange}
                  required
                  placeholder="Phone Number"
                />
              </>
            )}

            {form.type === 'BANK' && (
              <>
                <TextField
                  label="Account Number"
                  name="accountNumber"
                  value={form.accountNumber}
                  onChange={handleChange}
                  required
                  placeholder="Account Number"
                />
                <TextField
                  label="Account Holder Name"
                  name="accountHolderName"
                  value={form.accountHolderName}
                  onChange={handleChange}
                  required
                  placeholder="Account Holder Name"
                />
                <TextField
                  label="IFSC Code"
                  name="ifscCode"
                  value={form.ifscCode}
                  onChange={handleChange}
                  required
                  placeholder="IFSC Code"
                />
                <TextField
                  label="Phone Number"
                  name="phoneNumber"
                  value={form.phoneNumber}
                  onChange={handleChange}
                  required
                  placeholder="Phone Number"
                />
              </>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading} sx={{ color: 'orange' }}>Cancel</Button>
                      <Button onClick={handleAdd} variant="contained" disabled={loading} sx={{ bgcolor: 'darkgreen' }}>
              {loading ? <CircularProgress size={24} /> : (isEditing ? 'Update' : 'Save')}
            </Button>
                  </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ color: 'error.main', fontWeight: 'bold' }}>
            Delete Bank Card
          </DialogTitle>
          <DialogContent>
            <Typography variant="body1" sx={{ mt: 1 }}>
              Are you sure you want to delete this bank card? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteCancel} disabled={loading} sx={{ color: 'text.secondary' }}>
              Cancel
            </Button>
            <Button 
              onClick={handleDeleteConfirm} 
              variant="contained" 
              disabled={loading} 
              sx={{ bgcolor: 'error.main', '&:hover': { bgcolor: 'error.dark' } }}
            >
              {loading ? <CircularProgress size={24} /> : 'Delete'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    );
  };

export default BankCards; 
