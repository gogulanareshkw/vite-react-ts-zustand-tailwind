import React from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Paper,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  useTheme,
  useMediaQuery,
  Alert,
} from '@mui/material';
import {
  Casino,
  EmojiEvents,
  Security,
  AccountCircle,
  Payment,
  CheckCircle,
} from '@mui/icons-material';

const HowToPlay: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const steps = [
    {
      label: 'Create Account',
      description: 'Sign up for a free GulfLotto account with your email and personal details.',
      icon: <AccountCircle />,
    },
    {
      label: 'Choose Numbers',
      description: 'Select your 6-digit lottery numbers or use our quick pick feature for random selection.',
      icon: <Casino />,
    },
    {
      label: 'Make Payment',
      description: 'Pay securely using our multiple payment options including credit cards and digital wallets.',
      icon: <Payment />,
    },
    {
      label: 'Wait for Draw',
      description: 'Draws are held on the 1st and 16th of every month at 2:30 PM Thailand time.',
      icon: <EmojiEvents />,
    },
    {
      label: 'Check Results',
      description: 'Results are announced immediately after the draw. Check if you\'re a winner!',
      icon: <CheckCircle />,
    },
  ];

  const rules = [
    'You must be 18 years or older to participate',
    'Each ticket costs ฿80 (Thai Baht)',
    'Numbers range from 000000 to 999999',
    'Prizes are awarded for matching digits from right to left',
    'All prizes are tax-free and paid in Thai Baht',
    'Winners are notified immediately after the draw',
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
          How to Play
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          Learn how to play Thai National Lottery online in 5 simple steps
        </Typography>
      </Box>

      {/* Step-by-Step Guide */}
      <Paper elevation={3} sx={{ p: 4, mb: 6 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
          Step-by-Step Guide
        </Typography>
        
        <Stepper orientation={isMobile ? "vertical" : "horizontal"} activeStep={-1}>
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel 
                icon={step.icon}
                sx={{ 
                  '& .MuiStepLabel-label': { 
                    fontWeight: 'bold',
                    fontSize: isMobile ? '1rem' : '1.1rem'
                  }
                }}
              >
                {step.label}
              </StepLabel>
              {isMobile && (
                <StepContent>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {step.description}
                  </Typography>
                </StepContent>
              )}
            </Step>
          ))}
        </Stepper>

        {!isMobile && (
          <Box sx={{ mt: 4 }}>
            {steps.map((step, index) => (
              <Box key={index} sx={{ mb: 3, pl: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 1 }}>
                  Step {index + 1}: {step.label}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {step.description}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </Paper>

      {/* Game Rules */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 4, mb: 6 }}>
        <Card elevation={3} sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
            Game Rules
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {rules.map((rule, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <CheckCircle sx={{ color: 'success.main', mt: 0.5, fontSize: 20 }} />
                <Typography variant="body1">
                  {rule}
                </Typography>
              </Box>
            ))}
          </Box>
        </Card>

        <Card elevation={3} sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
            Prize Structure
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body1">1st Prize (6 digits):</Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                ฿6,000,000
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body1">2nd Prize (5 digits):</Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'secondary.main' }}>
                ฿200,000
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body1">3rd Prize (4 digits):</Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                ฿80,000
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body1">4th Prize (3 digits):</Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'info.main' }}>
                ฿40,000
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body1">5th Prize (2 digits):</Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'warning.main' }}>
                ฿20,000
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body1">6th Prize (1 digit):</Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'error.main' }}>
                ฿10,000
              </Typography>
            </Box>
          </Box>
        </Card>
      </Box>

      {/* Security & Trust */}
      <Card elevation={4} sx={{ p: 4, mb: 4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Security sx={{ fontSize: 40, mr: 2 }} />
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            Security & Trust
          </Typography>
        </Box>
        <Typography variant="body1" paragraph>
          GulfLotto is operated under strict government regulations and uses advanced encryption technology 
          to ensure your personal and financial information is completely secure. All transactions are 
          monitored and verified by the Government Lottery Office.
        </Typography>
        <Typography variant="body1">
          Our platform is licensed and regulated, providing you with a safe and fair gaming experience 
          with guaranteed payouts for all winners.
        </Typography>
      </Card>

      {/* Call to Action */}
      <Alert severity="info" sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
          Ready to Play?
        </Typography>
        <Typography variant="body1" paragraph>
          Join millions of players and start your journey to winning life-changing prizes. 
          Create your account today and get ready for the next draw!
        </Typography>
        <Button variant="contained" size="large" sx={{ mt: 2 }}>
          Start Playing Now
        </Button>
      </Alert>

      {/* Important Notes */}
      <Paper elevation={2} sx={{ p: 3, background: 'rgba(255, 193, 7, 0.1)', border: '1px solid #ffc107' }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'warning.main' }}>
          Important Notes
        </Typography>
        <Typography variant="body2" paragraph>
          • Draws are held twice monthly on the 1st and 16th at 2:30 PM Thailand time
        </Typography>
        <Typography variant="body2" paragraph>
          • Results are announced immediately after each draw
        </Typography>
        <Typography variant="body2" paragraph>
          • All prizes are paid within 24 hours of the draw
        </Typography>
        <Typography variant="body2">
          • For support, contact our customer service team 24/7
        </Typography>
      </Paper>
    </Container>
  );
};

export default HowToPlay; 
