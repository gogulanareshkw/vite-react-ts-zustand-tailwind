import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  useTheme,
  useMediaQuery,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  ExpandMore,
  Help,
  Security,
  Payment,
  AccountCircle,
  EmojiEvents,
  Support,
  Book,
  VideoLibrary,
  Download,
} from '@mui/icons-material';

const Help: React.FC = () => {
  const [expanded, setExpanded] = useState<string | false>(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const faqData = [
    {
      category: 'Account & Registration',
      questions: [
        {
          question: 'How do I create a GulfLotto account?',
          answer: 'To create an account, click the "Sign Up" button in the header, fill in your personal details including name, email, and password. You\'ll receive a verification email to activate your account. Make sure to provide accurate information as it will be used for prize distribution.',
        },
        {
          question: 'What documents do I need for account verification?',
          answer: 'For account verification, you\'ll need to provide a valid government-issued ID (passport, national ID, or driver\'s license) and proof of address. This is required for security and to ensure compliance with government regulations.',
        },
        {
          question: 'I forgot my password. How can I reset it?',
          answer: 'Click on the "Forgot Password" link on the login page. Enter your registered email address and you\'ll receive a password reset link. Follow the instructions in the email to create a new password.',
        },
      ],
    },
    {
      category: 'Playing & Rules',
      questions: [
        {
          question: 'How do I select lottery numbers?',
          answer: 'You can either manually select your 6-digit numbers (000000-999999) or use our "Quick Pick" feature for random selection. You can choose multiple numbers for the same draw to increase your chances of winning.',
        },
        {
          question: 'What are the winning combinations?',
          answer: 'Prizes are awarded for matching digits from right to left: 1st Prize (6 digits): ฿6,000,000, 2nd Prize (5 digits): ฿200,000, 3rd Prize (4 digits): ฿80,000, 4th Prize (3 digits): ฿40,000, 5th Prize (2 digits): ฿20,000, 6th Prize (1 digit): ฿10,000.',
        },
        {
          question: 'When are the draws held?',
          answer: 'Draws are held twice monthly on the 1st and 16th of every month at 2:30 PM Thailand time. Results are announced immediately after each draw.',
        },
      ],
    },
    {
      category: 'Payment & Withdrawals',
      questions: [
        {
          question: 'What payment methods are accepted?',
          answer: 'We accept credit cards, debit cards, bank transfers, and digital wallets including PayPal, Alipay, WeChat Pay, and LINE Pay. All transactions are secure and encrypted.',
        },
        {
          question: 'How long does it take to receive my winnings?',
          answer: 'All prizes are paid within 24 hours of the draw. You\'ll receive an email notification and the funds will be credited to your account balance immediately.',
        },
        {
          question: 'Are there any fees for withdrawals?',
          answer: 'There are no fees for prize withdrawals. However, some payment methods may have their own processing fees. Check with your payment provider for details.',
        },
      ],
    },
    {
      category: 'Security & Privacy',
      questions: [
        {
          question: 'Is my personal information secure?',
          answer: 'Yes, we use bank-level SSL encryption and follow strict security protocols to protect your personal and financial information. We never share your data with third parties without your consent.',
        },
        {
          question: 'How do I know the lottery is fair?',
          answer: 'GulfLotto is licensed and regulated by the Government Lottery Office of Thailand. All draws are conducted under strict supervision and use certified random number generators.',
        },
        {
          question: 'What happens if I win a large prize?',
          answer: 'For large prizes, we may require additional verification and documentation. Our team will contact you directly to arrange secure prize collection and provide guidance on tax implications.',
        },
      ],
    },
  ];

  const helpResources = [
    {
      icon: <Book sx={{ fontSize: 32, color: 'primary.main' }} />,
      title: 'User Guide',
      description: 'Complete step-by-step guide to using GulfLotto',
      action: 'Read Guide',
    },
    {
      icon: <VideoLibrary sx={{ fontSize: 32, color: 'secondary.main' }} />,
      title: 'Video Tutorials',
      description: 'Watch helpful videos on how to play and win',
      action: 'Watch Videos',
    },
    {
      icon: <Download sx={{ fontSize: 32, color: 'success.main' }} />,
      title: 'Download Rules',
      description: 'Download official lottery rules and regulations',
      action: 'Download PDF',
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
          Help Center
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          Find answers to common questions and get the support you need
        </Typography>
      </Box>

      {/* Quick Help Resources */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3, mb: 6 }}>
        {helpResources.map((resource, index) => (
          <Card key={index} elevation={3} sx={{ p: 3, textAlign: 'center' }}>
            <Box sx={{ mb: 2 }}>
              {resource.icon}
            </Box>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              {resource.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {resource.description}
            </Typography>
            <Button variant="outlined" color="primary">
              {resource.action}
            </Button>
          </Card>
        ))}
      </Box>

      {/* Search Section */}
      <Card elevation={3} sx={{ p: 4, mb: 6, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <Box sx={{ textAlign: 'center' }}>
          <Help sx={{ fontSize: 48, mb: 2 }} />
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
            Can't find what you're looking for?
          </Typography>
          <Typography variant="body1" paragraph>
            Our support team is available 24/7 to help you with any questions or issues.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button variant="contained" size="large" sx={{ bgcolor: 'white', color: 'primary.main', '&:hover': { bgcolor: 'grey.100' } }}>
              Contact Support
            </Button>
            <Button variant="outlined" size="large" sx={{ color: 'white', borderColor: 'white', '&:hover': { borderColor: 'grey.300' } }}>
              Live Chat
            </Button>
          </Box>
        </Box>
      </Card>

      {/* FAQ Section */}
      <Paper elevation={3} sx={{ p: 4, mb: 6 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
          Frequently Asked Questions
        </Typography>
        
        {faqData.map((category, categoryIndex) => (
          <Box key={categoryIndex} sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 2 }}>
              {category.category}
            </Typography>
            {category.questions.map((item, itemIndex) => (
              <Accordion
                key={itemIndex}
                expanded={expanded === `panel${categoryIndex}-${itemIndex}`}
                onChange={handleChange(`panel${categoryIndex}-${itemIndex}`)}
                sx={{ mb: 1 }}
              >
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    {item.question}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2" color="text.secondary">
                    {item.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        ))}
      </Paper>

      {/* Quick Actions */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 4 }}>
        <Card elevation={3} sx={{ p: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
            Common Issues & Solutions
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <AccountCircle color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Account Verification Issues" 
                secondary="Complete your profile and upload required documents"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Payment color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Payment Problems" 
                secondary="Check your payment method and try again"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <EmojiEvents color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Prize Collection" 
                secondary="Verify your account and provide banking details"
              />
            </ListItem>
          </List>
        </Card>

        <Card elevation={3} sx={{ p: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
            Contact Information
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Support color="primary" />
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                  Customer Support
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Available 24/7
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Security color="primary" />
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                  Security Team
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  For account security issues
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Payment color="primary" />
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                  Payment Support
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  For payment and withdrawal issues
                </Typography>
              </Box>
            </Box>
          </Box>
        </Card>
      </Box>

      {/* Emergency Contact */}
      <Paper elevation={2} sx={{ p: 4, mt: 4, background: 'rgba(255, 193, 7, 0.1)', border: '1px solid #ffc107' }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'warning.main' }}>
          Need Immediate Assistance?
        </Typography>
        <Typography variant="body1" paragraph>
          If you're experiencing urgent issues or need immediate help, contact our emergency support line:
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Chip label="Emergency: +66 2 123 4567" color="warning" variant="outlined" />
          <Chip label="Email: emergency@gulflotto.com" color="warning" variant="outlined" />
          <Chip label="Live Chat: Available 24/7" color="warning" variant="outlined" />
        </Box>
      </Paper>
    </Container>
  );
};

export default Help; 