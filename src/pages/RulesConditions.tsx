import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Grid,
} from '@mui/material';
import {
  ArrowBack,
  ExpandMore,
  Gavel,
  Security,
  Warning,
  CheckCircle,
  Info,
  Block,
} from '@mui/icons-material';

const RulesConditions: React.FC = () => {
  const navigate = useNavigate();

  const rules = [
    {
      title: 'General Rules',
      icon: <Gavel sx={{ fontSize: 24, color: 'primary.main' }} />,
      content: [
        'You must be 18 years or older to participate in lottery games',
        'Only one account per person is allowed',
        'All transactions are final and cannot be reversed',
        'WahLotto reserves the right to modify rules at any time',
        'Players are responsible for maintaining account security',
      ]
    },
    {
      title: 'Game Rules',
      icon: <Info sx={{ fontSize: 24, color: 'info.main' }} />,
      content: [
        'Each lottery game has specific rules and prize structures',
        'Tickets are non-refundable once purchased',
        'Draw results are final and binding',
        'Winning numbers are randomly generated and verified',
        'Prizes are paid within 24-48 hours of draw completion',
      ]
    },
    {
      title: 'Payment Rules',
      icon: <Security sx={{ fontSize: 24, color: 'success.main' }} />,
      content: [
        'Minimum recharge amount is ₹100',
        'Maximum daily recharge limit is ₹50,000',
        'Withdrawal minimum amount is ₹500',
        'Bank account must be in the same name as registered user',
        'All transactions are subject to verification',
      ]
    },
    {
      title: 'Prohibited Activities',
      icon: <Block sx={{ fontSize: 24, color: 'error.main' }} />,
      content: [
        'Creating multiple accounts',
        'Using fake or stolen payment methods',
        'Attempting to manipulate game results',
        'Sharing account credentials with others',
        'Using automated bots or scripts',
        'Participating from restricted jurisdictions',
      ]
    },
    {
      title: 'Account Security',
      icon: <Security sx={{ fontSize: 24, color: 'warning.main' }} />,
      content: [
        'Keep your login credentials secure',
        'Do not share OTP or verification codes',
        'Log out after each session',
        'Report suspicious activities immediately',
        'Enable two-factor authentication if available',
      ]
    },
  ];

  const conditions = [
    {
      title: 'Eligibility',
      items: [
        'Must be a legal resident of India',
        'Must be 18 years or older',
        'Must have a valid bank account',
        'Must provide accurate personal information',
        'Must comply with all applicable laws',
      ]
    },
    {
      title: 'Account Verification',
      items: [
        'Email verification is mandatory',
        'Phone number verification required',
        'KYC documents may be requested',
        'Bank account verification required for withdrawals',
        'Identity verification may be required',
      ]
    },
    {
      title: 'Prize Distribution',
      items: [
        'Prizes are automatically credited to account',
        'Taxes may apply to winnings',
        'Large prizes may require additional verification',
        'Prizes are paid in Indian Rupees only',
        'Unclaimed prizes expire after 90 days',
      ]
    },
    {
      title: 'Termination',
      items: [
        'Accounts may be suspended for rule violations',
        'Fraudulent activities result in permanent ban',
        'Unused balance may be forfeited',
        'Appeals must be submitted within 30 days',
        'WahLotto decision is final in all disputes',
      ]
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
                      onClick={() => navigate('/my-profile')}
          sx={{ mb: 2 }}
        >
          Back to My Profile
        </Button>
        
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Rules & Conditions
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Please read and understand all rules before participating
        </Typography>
      </Box>

      {/* Important Notice */}
      <Card elevation={4} sx={{ mb: 4, background: 'linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%)' }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Warning sx={{ fontSize: 32, color: 'warning.main', mr: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Important Notice
            </Typography>
          </Box>
          <Typography variant="body1" paragraph>
            By using WahLotto services, you agree to comply with all rules and conditions outlined below. 
            Violation of any rule may result in account suspension or permanent ban.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Last updated: {new Date().toLocaleDateString()}
          </Typography>
        </CardContent>
      </Card>

      {/* Rules Section */}
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        Game Rules
      </Typography>

      {rules.map((rule, index) => (
        <Accordion key={index} elevation={2} sx={{ mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {rule.icon}
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {rule.title}
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <List>
              {rule.content.map((item, idx) => (
                <ListItem key={idx} sx={{ py: 0.5 }}>
                  <ListItemIcon>
                    <CheckCircle sx={{ fontSize: 20, color: 'success.main' }} />
                  </ListItemIcon>
                  <ListItemText primary={item} />
                </ListItem>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
      ))}

      {/* Conditions Section */}
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3, mt: 6 }}>
        Terms & Conditions
      </Typography>

      <Grid container spacing={3}>
        {conditions.map((condition, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card elevation={3}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                  {condition.title}
                </Typography>
                <List sx={{ py: 0 }}>
                  {condition.items.map((item, idx) => (
                    <ListItem key={idx} sx={{ py: 0.5, px: 0 }}>
                      <ListItemIcon>
                        <CheckCircle sx={{ fontSize: 16, color: 'success.main' }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary={item} 
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Contact Information */}
      <Card elevation={3} sx={{ mt: 4 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
            Questions or Concerns?
          </Typography>
          <Typography variant="body2" paragraph>
            If you have any questions about these rules and conditions, please contact our support team:
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="body2">
              • Email: support@wahlotto.com
            </Typography>
            <Typography variant="body2">
              • Phone: +91 1800-XXX-XXXX
            </Typography>
            <Typography variant="body2">
              • WhatsApp: +91 98765-43210
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Acknowledgment */}
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Chip
          label="By using our services, you acknowledge that you have read and agree to these rules and conditions"
          color="primary"
          variant="outlined"
          sx={{ p: 2 }}
        />
      </Box>
    </Container>
  );
};

export default RulesConditions; 
