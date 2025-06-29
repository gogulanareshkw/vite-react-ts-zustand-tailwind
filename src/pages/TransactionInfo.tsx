import React from 'react';
import { Container, Typography, Box, Card, CardContent, Button } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowBack, Info } from '@mui/icons-material';

const TransactionInfo: React.FC = () => {
  const navigate = useNavigate();
  const { txnId } = useParams();

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          sx={{ mb: 2 }}
        >
          Back
        </Button>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Transaction Info
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Transaction ID: {txnId}
        </Typography>
      </Box>
      <Card elevation={3}>
        <CardContent sx={{ p: 4, textAlign: 'center' }}>
          <Info sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Transaction Details Coming Soon
          </Typography>
          <Typography variant="body1" color="text.secondary">
            The details of this transaction will be displayed here. Stay tuned!
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default TransactionInfo; 