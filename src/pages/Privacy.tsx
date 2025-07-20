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
} from '@mui/material';
import {
  ArrowBack,
  ExpandMore,
  Security,
  PrivacyTip,
  DataUsage,
  Cookie,
  Shield,
  CheckCircle,
  Info,
} from '@mui/icons-material';

const Privacy: React.FC = () => {
  const navigate = useNavigate();

  const privacySections = [
    {
      title: 'Information We Collect',
      icon: <DataUsage sx={{ fontSize: 24, color: 'primary.main' }} />,
      content: [
        'Personal information (name, email, phone number)',
        'Banking information for withdrawals',
        'Game play history and transaction records',
        'Device information and IP address',
        'Usage data and preferences',
      ]
    },
    {
      title: 'How We Use Your Information',
      icon: <Info sx={{ fontSize: 24, color: 'info.main' }} />,
      content: [
        'To provide and maintain our lottery services',
        'To process payments and withdrawals',
        'To verify your identity and prevent fraud',
        'To send important notifications and updates',
        'To improve our services and user experience',
      ]
    },
    {
      title: 'Data Security',
      icon: <Security sx={{ fontSize: 24, color: 'success.main' }} />,
      content: [
        'All data is encrypted using industry-standard protocols',
        'Secure servers with regular security audits',
        'Access controls and authentication measures',
        'Regular backups and disaster recovery procedures',
        'Compliance with data protection regulations',
      ]
    },
    {
      title: 'Data Sharing',
      icon: <PrivacyTip sx={{ fontSize: 24, color: 'warning.main' }} />,
      content: [
        'We do not sell your personal information',
        'Information may be shared with payment processors',
        'Legal authorities when required by law',
        'Service providers who assist in operations',
        'With your explicit consent only',
      ]
    },
    {
      title: 'Your Rights',
      icon: <Shield sx={{ fontSize: 24, color: 'secondary.main' }} />,
      content: [
        'Access your personal information',
        'Request correction of inaccurate data',
        'Request deletion of your account',
        'Opt-out of marketing communications',
        'File complaints with regulatory authorities',
      ]
    },
    {
      title: 'Cookies and Tracking',
      icon: <Cookie sx={{ fontSize: 24, color: 'error.main' }} />,
      content: [
        'Essential cookies for website functionality',
        'Analytics cookies to improve services',
        'Security cookies to protect your account',
        'You can control cookie settings in your browser',
        'Third-party cookies for payment processing',
      ]
    },
  ];

  const dataRetention = [
    {
      category: 'Account Information',
      retention: 'Until account deletion or 7 years after last activity',
      purpose: 'Legal compliance and fraud prevention'
    },
    {
      category: 'Transaction Records',
      retention: '7 years from transaction date',
      purpose: 'Financial reporting and audit requirements'
    },
    {
      category: 'Game Play History',
      retention: '3 years from last game',
      purpose: 'Customer support and dispute resolution'
    },
    {
      category: 'Communication Logs',
      retention: '2 years from last communication',
      purpose: 'Customer service improvement'
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
          Privacy Policy
        </Typography>
        <Typography variant="h6" color="text.secondary">
          How we collect, use, and protect your personal information
        </Typography>
      </Box>

      {/* Introduction */}
      <Card elevation={4} sx={{ mb: 4, background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)' }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <PrivacyTip sx={{ fontSize: 32, color: 'primary.main', mr: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Your Privacy Matters
            </Typography>
          </Box>
          <Typography variant="body1" paragraph>
            At WahLotto, we are committed to protecting your privacy and ensuring the security of your personal information. 
            This policy explains how we collect, use, and safeguard your data.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Last updated: {new Date().toLocaleDateString()}
          </Typography>
        </CardContent>
      </Card>

      {/* Privacy Sections */}
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        Privacy Overview
      </Typography>

      {privacySections.map((section, index) => (
        <Accordion key={index} elevation={2} sx={{ mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {section.icon}
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {section.title}
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <List>
              {section.content.map((item, idx) => (
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

      {/* Data Retention */}
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3, mt: 6 }}>
        Data Retention Policy
      </Typography>

      <Card elevation={3} sx={{ mb: 4 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
            How Long We Keep Your Data
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {dataRetention.map((item, index) => (
              <Box key={index} sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                  {item.category}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 'medium', mb: 1 }}>
                  Retention Period: {item.retention}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Purpose: {item.purpose}
                </Typography>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Security Measures */}
      <Card elevation={3} sx={{ mb: 4 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
            Security Measures
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              • SSL/TLS encryption for all data transmission
            </Typography>
            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              • Multi-factor authentication for account access
            </Typography>
            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              • Regular security audits and penetration testing
            </Typography>
            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              • Secure data centers with 24/7 monitoring
            </Typography>
            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              • Employee background checks and security training
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card elevation={3} sx={{ mb: 4 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
            Privacy Questions?
          </Typography>
          <Typography variant="body2" paragraph>
            If you have any questions about our privacy policy or how we handle your data, please contact us:
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="body2">
              • Email: privacy@wahlotto.com
            </Typography>
            <Typography variant="body2">
              • Phone: +91 1800-XXX-XXXX
            </Typography>
            <Typography variant="body2">
              • Address: WahLotto Headquarters, Mumbai, Maharashtra, India
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Updates */}
      <Card elevation={2} sx={{ background: 'linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%)' }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
            Policy Updates
          </Typography>
          <Typography variant="body2" paragraph>
            We may update this privacy policy from time to time. We will notify you of any material changes 
            by posting the new policy on our website and updating the "Last updated" date.
          </Typography>
          <Typography variant="body2">
            Your continued use of our services after any changes constitutes acceptance of the updated policy.
          </Typography>
        </CardContent>
      </Card>

      {/* Acknowledgment */}
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Chip
          label="By using our services, you agree to this privacy policy"
          color="primary"
          variant="outlined"
          sx={{ p: 2 }}
        />
      </Box>
    </Container>
  );
};

export default Privacy; 
