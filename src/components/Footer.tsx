import React from 'react';
import { Box, Typography, Container } from '@mui/material';

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'grey.900',
        color: 'white',
        borderTop: '1px solid',
        borderColor: 'grey.700',
        py: 2,
        mb: { xs: 7, sm: 6 },
        position: 'relative',
        zIndex: 999,
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography variant="body2" color="grey.400">
            © {new Date().getFullYear()} GulfLotto. All Rights Reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 
