import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  useTheme,
  useMediaQuery,
  Tabs,
  Tab,
} from '@mui/material';
import {
  EmojiEvents,
  CalendarToday,
  TrendingUp,
  History,
} from '@mui/icons-material';

const Results: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Sample results data
  const recentResults = [
    {
      date: '2024-01-16',
      drawNumber: '001/2024',
      numbers: ['123456', '234567', '345678', '456789', '567890'],
      status: 'Completed',
    },
    {
      date: '2024-01-01',
      drawNumber: '002/2024',
      numbers: ['111111', '222222', '333333', '444444', '555555'],
      status: 'Completed',
    },
    {
      date: '2024-12-16',
      drawNumber: '003/2023',
      numbers: ['999999', '888888', '777777', '666666', '555555'],
      status: 'Completed',
    },
  ];

  const upcomingDraws = [
    {
      date: '2024-02-01',
      drawNumber: '004/2024',
      time: '14:30',
      status: 'Upcoming',
    },
    {
      date: '2024-02-16',
      drawNumber: '005/2024',
      time: '14:30',
      status: 'Upcoming',
    },
  ];

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header Section */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography 
          variant={isMobile ? "h3" : "h2"} 
          component="h1" 
          gutterBottom
          sx={{ 
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #667eea, #764ba2)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2
          }}
        >
          Lottery Results
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          Check the latest lottery results and upcoming draws
        </Typography>
      </Box>

      {/* Latest Result Highlight */}
      <Card elevation={4} sx={{ mb: 4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <EmojiEvents sx={{ fontSize: 40, mr: 2 }} />
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                Latest Draw Result
              </Typography>
              <Typography variant="body1">
                January 16, 2024 • Draw #001/2024
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(5, 1fr)' }, gap: 2 }}>
            {['123456', '234567', '345678', '456789', '567890'].map((number, index) => (
              <Box
                key={index}
                sx={{
                  background: 'rgba(255,255,255,0.2)',
                  borderRadius: 2,
                  p: 2,
                  textAlign: 'center',
                  border: '2px solid rgba(255,255,255,0.3)',
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {number}
                </Typography>
                <Typography variant="caption">
                  Prize {index + 1}
                </Typography>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Tabs for Results and Upcoming */}
      <Paper elevation={3} sx={{ mb: 4 }}>
        <Tabs value={selectedTab} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab 
            icon={<History />} 
            label="Recent Results" 
            iconPosition="start"
            sx={{ fontWeight: 'bold' }}
          />
          <Tab 
            icon={<CalendarToday />} 
            label="Upcoming Draws" 
            iconPosition="start"
            sx={{ fontWeight: 'bold' }}
          />
        </Tabs>

        {/* Recent Results Tab */}
        {selectedTab === 0 && (
          <Box sx={{ p: 3 }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Draw Date</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Draw Number</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Winning Numbers</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentResults.map((result, index) => (
                    <TableRow key={index} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <CalendarToday sx={{ mr: 1, fontSize: 16 }} />
                          {new Date(result.date).toLocaleDateString()}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {result.drawNumber}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                          {result.numbers.slice(0, 3).map((num, idx) => (
                            <Chip 
                              key={idx} 
                              label={num} 
                              size="small" 
                              color="primary"
                              variant="outlined"
                            />
                          ))}
                          {result.numbers.length > 3 && (
                            <Chip 
                              label={`+${result.numbers.length - 3} more`} 
                              size="small" 
                              color="secondary"
                            />
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={result.status} 
                          color="success" 
                          size="small"
                          icon={<EmojiEvents />}
                        />
                      </TableCell>
                      <TableCell>
                        <Button variant="outlined" size="small">
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {/* Upcoming Draws Tab */}
        {selectedTab === 1 && (
          <Box sx={{ p: 3 }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Draw Date</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Draw Number</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Time</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {upcomingDraws.map((draw, index) => (
                    <TableRow key={index} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <CalendarToday sx={{ mr: 1, fontSize: 16 }} />
                          {new Date(draw.date).toLocaleDateString()}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {draw.drawNumber}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {draw.time}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={draw.status} 
                          color="warning" 
                          size="small"
                          icon={<TrendingUp />}
                        />
                      </TableCell>
                      <TableCell>
                        <Button variant="contained" size="small" color="primary">
                          Set Reminder
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </Paper>

      {/* Statistics */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
        <Card elevation={3} sx={{ p: 3, textAlign: 'center' }}>
          <EmojiEvents sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
            24
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Draws This Year
          </Typography>
        </Card>

        <Card elevation={3} sx={{ p: 3, textAlign: 'center' }}>
          <TrendingUp sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
            1,250+
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Total Winners
          </Typography>
        </Card>

        <Card elevation={3} sx={{ p: 3, textAlign: 'center' }}>
          <History sx={{ fontSize: 48, color: 'secondary.main', mb: 2 }} />
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
            150+
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Years of History
          </Typography>
        </Card>
      </Box>
    </Container>
  );
};

export default Results; 