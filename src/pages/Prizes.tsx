import React from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Paper,
  Grid,
  Chip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  EmojiEvents,
  Star,
  TrendingUp,
  AccountBalance,
} from '@mui/icons-material';

const Prizes: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const prizeTiers = [
    {
      tier: '1st Prize',
      amount: '฿6,000,000',
      description: 'Match all 6 digits in exact order',
      color: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
      icon: <EmojiEvents sx={{ fontSize: 40, color: 'white' }} />,
    },
    {
      tier: '2nd Prize',
      amount: '฿200,000',
      description: 'Match last 5 digits in exact order',
      color: 'linear-gradient(135deg, #C0C0C0 0%, #A0A0A0 100%)',
      icon: <Star sx={{ fontSize: 40, color: 'white' }} />,
    },
    {
      tier: '3rd Prize',
      amount: '฿80,000',
      description: 'Match last 4 digits in exact order',
      color: 'linear-gradient(135deg, #CD7F32 0%, #B8860B 100%)',
      icon: <TrendingUp sx={{ fontSize: 40, color: 'white' }} />,
    },
    {
      tier: '4th Prize',
      amount: '฿40,000',
      description: 'Match last 3 digits in exact order',
      color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      icon: <AccountBalance sx={{ fontSize: 40, color: 'white' }} />,
    },
    {
      tier: '5th Prize',
      amount: '฿20,000',
      description: 'Match last 2 digits in exact order',
      color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      icon: <Star sx={{ fontSize: 40, color: 'white' }} />,
    },
    {
      tier: '6th Prize',
      amount: '฿10,000',
      description: 'Match last 1 digit in exact order',
      color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      icon: <EmojiEvents sx={{ fontSize: 40, color: 'white' }} />,
    },
  ];

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
          Lottery Prizes
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          Discover the exciting prize structure of Thai National Lottery
        </Typography>
      </Box>

      {/* Prize Tiers */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3, mb: 6 }}>
        {prizeTiers.map((prize, index) => (
          <Card 
            key={index}
            elevation={4} 
            sx={{ 
              height: '100%',
              transition: 'transform 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 12px 30px rgba(0,0,0,0.2)',
              }
            }}
          >
            <Box
              sx={{
                background: prize.color,
                p: 3,
                textAlign: 'center',
                color: 'white',
                borderRadius: '8px 8px 0 0',
              }}
            >
              {prize.icon}
              <Typography variant="h5" sx={{ fontWeight: 'bold', mt: 1 }}>
                {prize.tier}
              </Typography>
            </Box>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 2 }}>
                {prize.amount}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {prize.description}
              </Typography>
              <Chip 
                label="Monthly Draw" 
                color="primary" 
                size="small"
                sx={{ fontWeight: 'bold' }}
              />
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Prize Information */}
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
          Prize Information
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
          <Box>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              How Prizes Work
            </Typography>
            <Typography variant="body1" paragraph>
              The Thai National Lottery uses a 6-digit number system. Prizes are awarded based on matching 
              digits from right to left. The more digits you match in the correct order, the higher your prize.
            </Typography>
            <Typography variant="body1" paragraph>
              All prizes are tax-free and paid in Thai Baht (฿). Winners are announced immediately after 
              each draw on the 1st and 16th of every month.
            </Typography>
          </Box>
          <Box>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              Prize Distribution
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2">1st Prize Winners:</Typography>
                <Chip label="1 Winner" size="small" color="primary" />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2">2nd Prize Winners:</Typography>
                <Chip label="2 Winners" size="small" color="secondary" />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2">3rd Prize Winners:</Typography>
                <Chip label="5 Winners" size="small" color="success" />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2">4th-6th Prizes:</Typography>
                <Chip label="Multiple Winners" size="small" color="info" />
              </Box>
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Total Prize Pool */}
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          textAlign: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
          Total Prize Pool
        </Typography>
        <Typography variant="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
          ฿50,000,000+
        </Typography>
        <Typography variant="h6">
          Distributed every month across all prize tiers
        </Typography>
      </Paper>
    </Container>
  );
};

export default Prizes; 