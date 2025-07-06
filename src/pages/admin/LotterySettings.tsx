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
  Switch,
  FormControlLabel,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Divider,
  Chip,
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
  Paper
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Save as SaveIcon,
  Refresh as RefreshIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Info as InfoIcon,
  Casino as GameIcon,
  Schedule as ScheduleIcon,
  AttachMoney as MoneyIcon
} from '@mui/icons-material';
import { useStore } from '../../store/useStore';

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

interface LotterySetting {
  _id: string;
  lotteryGameType: number;
  lotteryGameTypeName: string;
  isActive: boolean;
  drawTime: string;
  drawDays: string[];
  ticketPrice: number;
  maxTicketsPerUser: number;
  maxNumbersPerTicket: number;
  minNumbersPerTicket: number;
  prizeBreakdown: {
    category: string;
    percentage: number;
    description: string;
  }[];
  rules: string[];
  terms: string[];
  createdAt: string;
  updatedAt: string;
}

const LotterySettings: React.FC = () => {
  const { notification, api } = useStore();
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<LotterySetting[]>([]);
  const [selectedSetting, setSelectedSetting] = useState<LotterySetting | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [newSettingDialogOpen, setNewSettingDialogOpen] = useState(false);

  // Form state for editing
  const [formData, setFormData] = useState({
    lotteryGameTypeName: '',
    isActive: true,
    drawTime: '18:00',
    drawDays: [] as string[],
    ticketPrice: 100,
    maxTicketsPerUser: 10,
    maxNumbersPerTicket: 6,
    minNumbersPerTicket: 3,
    rules: [] as string[],
    terms: [] as string[]
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = await api.getLotteryGameSettings();
      if (response.success) {
        setSettings(response.data || []);
      } else {
        setError('Failed to load lottery settings');
      }
    } catch (err) {
      setError('Failed to load lottery settings');
      console.error('Error loading settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleEditSetting = (setting: LotterySetting) => {
    setSelectedSetting(setting);
    setFormData({
      lotteryGameTypeName: setting.lotteryGameTypeName,
      isActive: setting.isActive,
      drawTime: setting.drawTime,
      drawDays: setting.drawDays,
      ticketPrice: setting.ticketPrice,
      maxTicketsPerUser: setting.maxTicketsPerUser,
      maxNumbersPerTicket: setting.maxNumbersPerTicket,
      minNumbersPerTicket: setting.minNumbersPerTicket,
      rules: setting.rules,
      terms: setting.terms
    });
    setEditDialogOpen(true);
  };

  const handleSaveSetting = async () => {
    try {
      setSaving(true);
      if (selectedSetting) {
        const response = await api.updateLotteryGameSetting(selectedSetting._id, formData);
        if (response.success) {
          notification.show('Setting updated successfully', 'success');
          setEditDialogOpen(false);
          loadSettings();
        } else {
          notification.show('Failed to update setting', 'error');
        }
      }
    } catch (err) {
      notification.show('Failed to update setting', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (setting: LotterySetting) => {
    try {
      const response = await api.updateLotteryGameSetting(setting._id, {
        isActive: !setting.isActive
      });
      if (response.success) {
        notification.show(`Game ${setting.isActive ? 'deactivated' : 'activated'} successfully`, 'success');
        loadSettings();
      } else {
        notification.show('Failed to update setting', 'error');
      }
    } catch (err) {
      notification.show('Failed to update setting', 'error');
    }
  };

  const handleAddRule = () => {
    setFormData(prev => ({
      ...prev,
      rules: [...prev.rules, '']
    }));
  };

  const handleRemoveRule = (index: number) => {
    setFormData(prev => ({
      ...prev,
      rules: prev.rules.filter((_, i) => i !== index)
    }));
  };

  const handleUpdateRule = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      rules: prev.rules.map((rule, i) => i === index ? value : rule)
    }));
  };

  const handleAddTerm = () => {
    setFormData(prev => ({
      ...prev,
      terms: [...prev.terms, '']
    }));
  };

  const handleRemoveTerm = (index: number) => {
    setFormData(prev => ({
      ...prev,
      terms: prev.terms.filter((_, i) => i !== index)
    }));
  };

  const handleUpdateTerm = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      terms: prev.terms.map((term, i) => i === index ? value : term)
    }));
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'success' : 'error';
  };

  const getStatusLabel = (isActive: boolean) => {
    return isActive ? 'Active' : 'Inactive';
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
          <SettingsIcon sx={{ mr: 2, verticalAlign: 'middle' }} />
          Lottery Settings
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage lottery game configurations, rules, and settings
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={handleTabChange} aria-label="lottery settings tabs">
            <Tab label="Game Settings" />
            <Tab label="Rules & Terms" />
            <Tab label="Prize Breakdown" />
          </Tabs>
        </Box>

        <TabPanel value={activeTab} index={0}>
          <Box sx={{ mb: 3 }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setNewSettingDialogOpen(true)}
            >
              Add New Game
            </Button>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Game Type</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Draw Time</TableCell>
                  <TableCell>Ticket Price</TableCell>
                  <TableCell>Max Tickets</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {settings.map((setting) => (
                  <TableRow key={setting._id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <GameIcon sx={{ mr: 1 }} />
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                          {setting.lotteryGameTypeName}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusLabel(setting.isActive)}
                        color={getStatusColor(setting.isActive) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <ScheduleIcon sx={{ mr: 0.5, fontSize: 16 }} />
                        {setting.drawTime}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <MoneyIcon sx={{ mr: 0.5, fontSize: 16 }} />
                        ₹{setting.ticketPrice}
                      </Box>
                    </TableCell>
                    <TableCell>{setting.maxTicketsPerUser}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Edit Settings">
                          <IconButton
                            size="small"
                            onClick={() => handleEditSetting(setting)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={setting.isActive ? 'Deactivate' : 'Activate'}>
                          <IconButton
                            size="small"
                            onClick={() => handleToggleActive(setting)}
                          >
                            <Switch
                              checked={setting.isActive}
                              size="small"
                              color="success"
                            />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          <Typography variant="h6" gutterBottom>
            Game Rules & Terms
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Configure rules and terms for all lottery games
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    General Rules
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<AddIcon />}
                      onClick={handleAddRule}
                    >
                      Add Rule
                    </Button>
                  </Box>
                  {formData.rules.map((rule, index) => (
                    <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                      <TextField
                        fullWidth
                        size="small"
                        value={rule}
                        onChange={(e) => handleUpdateRule(index, e.target.value)}
                        placeholder="Enter rule..."
                      />
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveRule(index)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Terms & Conditions
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<AddIcon />}
                      onClick={handleAddTerm}
                    >
                      Add Term
                    </Button>
                  </Box>
                  {formData.terms.map((term, index) => (
                    <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                      <TextField
                        fullWidth
                        size="small"
                        value={term}
                        onChange={(e) => handleUpdateTerm(index, e.target.value)}
                        placeholder="Enter term..."
                      />
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveTerm(index)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={activeTab} index={2}>
          <Typography variant="h6" gutterBottom>
            Prize Breakdown Configuration
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Configure prize distribution for different lottery games
          </Typography>
          
          <Grid container spacing={3}>
            {settings.map((setting) => (
              <Grid item xs={12} md={6} key={setting._id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {setting.lotteryGameTypeName}
                    </Typography>
                    
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Category</TableCell>
                            <TableCell>Percentage</TableCell>
                            <TableCell>Description</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {setting.prizeBreakdown.map((prize, index) => (
                            <TableRow key={index}>
                              <TableCell>{prize.category}</TableCell>
                              <TableCell>{prize.percentage}%</TableCell>
                              <TableCell>{prize.description}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>
      </Card>

      {/* Edit Setting Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6">
            Edit Lottery Setting
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Game Type Name"
                value={formData.lotteryGameTypeName}
                onChange={(e) => setFormData(prev => ({ ...prev, lotteryGameTypeName: e.target.value }))}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Draw Time"
                type="time"
                value={formData.drawTime}
                onChange={(e) => setFormData(prev => ({ ...prev, drawTime: e.target.value }))}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Ticket Price"
                type="number"
                value={formData.ticketPrice}
                onChange={(e) => setFormData(prev => ({ ...prev, ticketPrice: Number(e.target.value) }))}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Max Tickets Per User"
                type="number"
                value={formData.maxTicketsPerUser}
                onChange={(e) => setFormData(prev => ({ ...prev, maxTicketsPerUser: Number(e.target.value) }))}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Max Numbers Per Ticket"
                type="number"
                value={formData.maxNumbersPerTicket}
                onChange={(e) => setFormData(prev => ({ ...prev, maxNumbersPerTicket: Number(e.target.value) }))}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Min Numbers Per Ticket"
                type="number"
                value={formData.minNumbersPerTicket}
                onChange={(e) => setFormData(prev => ({ ...prev, minNumbersPerTicket: Number(e.target.value) }))}
              />
            </Grid>
            
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isActive}
                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  />
                }
                label="Active"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSaveSetting}
            variant="contained"
            disabled={saving}
            startIcon={saving ? <CircularProgress size={16} /> : <SaveIcon />}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default LotterySettings; 