import React from 'react';
import { Box } from '@mui/material';
import type { BoxProps } from '@mui/material';

interface PageContainerProps extends BoxProps {
  children: React.ReactNode;
}

const PageContainer: React.FC<PageContainerProps> = ({ children, ...props }) => {
  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: '1200px',
        mx: 'auto',
        px: { xs: 2, sm: 3 },
        ...props.sx
      }}
      {...props}
    >
      {children}
    </Box>
  );
};

export default PageContainer; 