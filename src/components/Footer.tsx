import React from 'react';
import { Box, Typography, Container, Link } from '@mui/material';
import { EmojiEvents, Security, Star } from '@mui/icons-material';

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'grey.900',
        color: 'white',
        borderTop: '1px solid',
        borderColor: 'grey.700',
        mt: 'auto',
        py: 4,
      }}
      className="mt-auto"
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
            gap: 4,
            mb: 4,
          }}
        >
          {/* Company Info */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box
                sx={{
                  position: 'relative',
                  width: 45,
                  height: 45,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 2,
                  boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                }}
              >
                <EmojiEvents sx={{ fontSize: 24, color: 'white' }} />
                <Star 
                  sx={{ 
                    position: 'absolute', 
                    top: -3, 
                    right: -3, 
                    fontSize: 12, 
                    color: '#FFD700',
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                  }} 
                />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                GulfLotto
              </Typography>
            </Box>
            <Typography variant="body2" color="grey.300" paragraph>
              Official government-administered lottery platform providing secure and fair gaming experience.
            </Typography>
            <Typography variant="body2" color="grey.400">
              Licensed and regulated by the Government Lottery Office, Thailand.
            </Typography>
          </Box>

          {/* Quick Links */}
          <Box>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="/how-to-play" color="grey.300" sx={{ '&:hover': { color: 'primary.main' } }}>
                How to Play
              </Link>
              <Link href="/results" color="grey.300" sx={{ '&:hover': { color: 'primary.main' } }}>
                Results
              </Link>
              <Link href="/prizes" color="grey.300" sx={{ '&:hover': { color: 'primary.main' } }}>
                Prizes
              </Link>
              <Link href="/about" color="grey.300" sx={{ '&:hover': { color: 'primary.main' } }}>
                About Us
              </Link>
            </Box>
          </Box>

          {/* Support */}
          <Box>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Support
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="/contact" color="grey.300" sx={{ '&:hover': { color: 'primary.main' } }}>
                Contact Us
              </Link>
              <Link href="/help" color="grey.300" sx={{ '&:hover': { color: 'primary.main' } }}>
                Help Center
              </Link>
              <Link href="/terms" color="grey.300" sx={{ '&:hover': { color: 'primary.main' } }}>
                Terms & Conditions
              </Link>
              <Link href="/privacy" color="grey.300" sx={{ '&:hover': { color: 'primary.main' } }}>
                Privacy Policy
              </Link>
            </Box>
          </Box>
        </Box>

        {/* Security Notice */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          mb: 3,
          p: 2,
          bgcolor: 'rgba(255,255,255,0.05)',
          borderRadius: 1,
        }}>
          <Security sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="body2" color="grey.300">
            Secure transactions and data protection guaranteed
          </Typography>
        </Box>

        {/* Copyright */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
            pt: 3,
            borderTop: '1px solid',
            borderColor: 'grey.700',
          }}
        >
          <Typography variant="body2" color="grey.400">
            © {new Date().getFullYear()} GulfLotto. All Rights Reserved.
          </Typography>
          
          <Typography variant="caption" color="grey.500">
            Official Government Lottery Office • Thailand
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 