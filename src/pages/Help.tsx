import React, { useState, useEffect } from 'react';
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
  ListItemIcon,
  ListItemText,
  Divider,
  Chip,
} from '@mui/material';
import {
  ExpandMore,
  ArrowBack,
  Help as HelpIcon,
  Support,
  Email,
  Phone,
  WhatsApp,
  QuestionAnswer,
  Info,
  Security,
  Payment,
  Casino,
} from '@mui/icons-material';
import { useStore } from '../store/useStore';
import apiService from '../services/api';

interface HelpLink {
  _id: string;
  title: string;
  description: string;
  link: string;
  category: string;
  isActive: boolean;
}

const Help: React.FC = () => {
  const navigate = useNavigate();
  const { addNotification } = useStore();

  const [helpLinks, setHelpLinks] = useState<HelpLink[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadHelpLinks();
  }, []);

  const loadHelpLinks = async () => {
    setIsLoading(true);
    try {
      const response = await apiService.getAllHelpLinks();
      if (response.success) {
        setHelpLinks(response.data || []);
      }
    } catch (error) {
      console.error('Failed to load help links:', error);
      addNotification({
        message: 'Failed to load help information',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const faqData = [
    {
      category: 'Getting Started',
      icon: <Casino />,
      questions: [
        {
          question: 'How do I create an account?',
          answer: 'Click on the "Sign Up" button and fill in your details including email, password, and phone number. Verify your email to activate your account.'
        },
        {
          question: 'How do I verify my email?',
          answer: 'After signing up, check your email for a verification link. Click the link or enter the OTP code to verify your account.'
        },
        {
          question: 'What if I forgot my password?',
          answer: 'Click on "Forgot Password" on the login page, enter your email, and follow the instructions to reset your password.'
        }
      ]
    },
    {
      category: 'Account & Security',
      icon: <Security />,
      questions: [
        {
          question: 'How do I change my password?',
          answer: 'Go to your Profile page and click on "Change Password". Enter your current password and new password to update it.'
        },
        {
          question: 'How do I update my profile information?',
          answer: 'Navigate to your Profile page and click "Edit Profile" to update your personal information.'
        },
        {
          question: 'Is my personal information secure?',
          answer: 'Yes, we use industry-standard encryption and security measures to protect your personal and financial information.'
        }
      ]
    },
    {
      category: 'Payment & Transactions',
      icon: <Payment />,
      questions: [
        {
          question: 'How do I add money to my account?',
          answer: 'Go to the Recharge page and select your preferred payment method. Enter the amount and follow the payment instructions.'
        },
        {
          question: 'How do I withdraw my winnings?',
          answer: 'First add a bank card in your profile, then go to the Withdraw page, enter the amount, and submit your withdrawal request.'
        },
        {
          question: 'How long do withdrawals take?',
          answer: 'Withdrawals are typically processed within 24-48 hours. You will receive a confirmation email once processed.'
        },
        {
          question: 'What payment methods are accepted?',
          answer: 'We accept UPI payments, bank transfers, and credit/debit cards for recharges.'
        }
      ]
    },
    {
      category: 'Lottery Games',
      icon: <Casino />,
      questions: [
        {
          question: 'How do I play lottery games?',
          answer: 'Go to the Lottery Games page, select a game, choose your numbers, and purchase tickets using your account balance.'
        },
        {
          question: 'When are the results announced?',
          answer: 'Results are announced at the scheduled draw time. You can check the Results page for the latest winning numbers.'
        },
        {
          question: 'How do I know if I won?',
          answer: 'Check the Results page or your ticket history. Winners are automatically notified and prizes are credited to their accounts.'
        },
        {
          question: 'What are the minimum and maximum bet amounts?',
          answer: 'Minimum bet amounts vary by game type. Check the game details for specific limits.'
        }
      ]
    }
  ];

  const supportInfo = [
    {
      title: 'Email Support',
      description: 'Send us an email for general inquiries',
      icon: <Email />,
      value: 'support@wahlotto.com',
      action: () => window.open('mailto:support@wahlotto.com')
    },
    {
      title: 'Phone Support',
      description: 'Call us for urgent assistance',
      icon: <Phone />,
      value: '+91 1800-XXX-XXXX',
      action: () => window.open('tel:+911800XXXXXXX')
    },
    {
      title: 'WhatsApp Support',
      description: 'Chat with us on WhatsApp',
      icon: <WhatsApp />,
      value: '+91 98765-43210',
      action: () => window.open('https://wa.me/919876543210')
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Help & Support
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Find answers to common questions and get support
        </Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
                      onClick={() => navigate('/my-profile')}
        >
          Back to My Profile
        </Button>
      </Box>

      {/* Quick Support Cards */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
          Quick Support
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
          {supportInfo.map((support, index) => (
            <Card key={index} elevation={4} sx={{ flex: 1 }}>
              <CardContent sx={{ p: 3, textAlign: 'center' }}>
                <Box sx={{ color: 'primary.main', mb: 2 }}>
                  {support.icon}
                </Box>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  {support.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {support.description}
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 2 }}>
                  {support.value}
                </Typography>
                <Button
                  variant="contained"
                  onClick={support.action}
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                    },
                  }}
                >
                  Contact
                </Button>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>

      {/* FAQ Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
          Frequently Asked Questions
        </Typography>
        
        {faqData.map((category, categoryIndex) => (
          <Card key={categoryIndex} elevation={4} sx={{ mb: 3 }}>
            <CardContent sx={{ p: 0 }}>
              <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ color: 'primary.main' }}>
                    {category.icon}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {category.category}
                  </Typography>
                </Box>
              </Box>
              
              {category.questions.map((faq, faqIndex) => (
                <Accordion key={faqIndex} elevation={0}>
                  <AccordionSummary
                    expandIcon={<ExpandMore />}
                    sx={{ px: 3 }}
                  >
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      {faq.question}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ px: 3, pb: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      {faq.answer}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Help Links */}
      {helpLinks.length > 0 && (
        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
            Additional Resources
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {helpLinks.filter(link => link.isActive).map((link) => (
              <Card key={link._id} elevation={2}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                        {link.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {link.description}
                      </Typography>
                      <Chip label={link.category} size="small" color="primary" variant="outlined" />
                    </Box>
                    <Button
                      variant="outlined"
                      onClick={() => window.open(link.link, '_blank')}
                    >
                      View
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>
      )}

      {/* Contact Information */}
      <Card elevation={4}>
        <CardContent sx={{ p: 4, textAlign: 'center' }}>
          <Support sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
            Still Need Help?
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Our support team is available 24/7 to help you with any questions or issues.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              startIcon={<Email />}
              onClick={() => window.open('mailto:support@wahlotto.com')}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                },
              }}
            >
              Email Support
            </Button>
            <Button
              variant="outlined"
              startIcon={<WhatsApp />}
              onClick={() => window.open('https://wa.me/919876543210')}
            >
              WhatsApp Chat
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Help; 
