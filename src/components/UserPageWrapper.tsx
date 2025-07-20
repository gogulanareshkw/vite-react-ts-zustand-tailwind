import React from 'react';
import { Typography, Box } from '@mui/material';

interface UserPageWrapperProps {
  children: React.ReactNode;
  title?: string;
}

const UserPageWrapper: React.FC<UserPageWrapperProps> = ({ children, title }) => {
  return (
    <>
      {title && (
        <Box sx={{ p: 2, pb: 1 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
            {title}
          </Typography>
        </Box>
      )}
      {children}
    </>
  );
};

export default UserPageWrapper; 
