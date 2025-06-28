import React from 'react';
import { Box, Typography, Container, Link } from '@mui/material';
import { GitHub, LinkedIn, Twitter } from '@mui/icons-material';

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'grey.100',
        borderTop: '1px solid',
        borderColor: 'grey.300',
        mt: 'auto',
        py: 3,
      }}
      className="mt-auto"
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} Modern React App. Built with React, Material-UI, and Tailwind CSS.
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Link
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              color="inherit"
              sx={{ '&:hover': { color: 'primary.main' } }}
            >
              <GitHub />
            </Link>
            <Link
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              color="inherit"
              sx={{ '&:hover': { color: 'primary.main' } }}
            >
              <LinkedIn />
            </Link>
            <Link
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              color="inherit"
              sx={{ '&:hover': { color: 'primary.main' } }}
            >
              <Twitter />
            </Link>
          </Box>
        </Box>
        
        <Typography 
          variant="caption" 
          color="text.secondary" 
          sx={{ display: 'block', textAlign: 'center', mt: 2 }}
        >
          Features: Zustand State Management • Material-UI Components • React Router • API Integration • Responsive Design
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer; 