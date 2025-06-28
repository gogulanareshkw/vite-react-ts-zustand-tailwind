import React, { useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Avatar,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Refresh as RefreshIcon,
  Api as ApiIcon,
  Storage as StorageIcon,
} from '@mui/icons-material';
import { useStore } from '../store/useStore';
import moment from 'moment';

const Home: React.FC = () => {
  const { count, increment, decrement, reset, data, loading, error, fetchData } = useStore();

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center" className="mb-8">
        Welcome to Modern React App
      </Typography>
      
      <Typography variant="h6" color="text.secondary" align="center" className="mb-12">
        A comprehensive React application showcasing modern development practices
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
        {/* Counter Section */}
        <Box sx={{ flex: 1 }}>
          <Card elevation={2} className="h-full">
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <StorageIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h5" component="h2">
                  Zustand State Management
                </Typography>
              </Box>
              
              <Typography variant="body1" color="text.secondary" paragraph>
                This counter demonstrates Zustand state management. The state persists across component re-renders and can be accessed from anywhere in the app.
              </Typography>

              <Box display="flex" alignItems="center" justifyContent="center" mb={3}>
                <Typography variant="h2" component="div" color="primary.main" fontWeight="bold">
                  {count}
                </Typography>
              </Box>

              <Box display="flex" gap={2} justifyContent="center" flexWrap="wrap">
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={increment}
                  size="large"
                >
                  Increment
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<RemoveIcon />}
                  onClick={decrement}
                  size="large"
                >
                  Decrement
                </Button>
                <Button
                  variant="text"
                  startIcon={<RefreshIcon />}
                  onClick={reset}
                  size="large"
                >
                  Reset
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* API Integration Section */}
        <Box sx={{ flex: 1 }}>
          <Card elevation={2} className="h-full">
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <ApiIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h5" component="h2">
                  API Integration
                </Typography>
              </Box>
              
              <Typography variant="body1" color="text.secondary" paragraph>
                This section demonstrates external API integration using the GitHub API. The data is fetched and managed through Zustand state.
              </Typography>

              {loading && (
                <Box display="flex" justifyContent="center" my={3}>
                  <CircularProgress />
                </Box>
              )}

              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              {data && !loading && (
                <Box>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Avatar
                      src={data.avatar_url}
                      alt={data.login}
                      sx={{ width: 60, height: 60, mr: 2 }}
                    />
                    <Box>
                      <Typography variant="h6" fontWeight="bold">
                        {data.name || data.login}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        @{data.login}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Typography variant="body2" paragraph>
                    {data.bio || 'No bio available'}
                  </Typography>
                  
                  <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
                    <Chip label={`${data.public_repos} repos`} size="small" />
                    <Chip label={`${data.followers} followers`} size="small" />
                    <Chip label={`${data.following} following`} size="small" />
                  </Box>
                  
                  <Typography variant="caption" color="text.secondary">
                    Member since {moment(data.created_at).format('MMMM YYYY')}
                  </Typography>
                </Box>
              )}

              <Box mt={3}>
                <Button
                  variant="contained"
                  startIcon={<RefreshIcon />}
                  onClick={fetchData}
                  disabled={loading}
                  fullWidth
                >
                  {loading ? 'Loading...' : 'Refresh Data'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Features Section */}
      <Box mt={8}>
        <Typography variant="h4" component="h2" gutterBottom align="center" className="mb-6">
          Features
        </Typography>
        
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
          gap: 3 
        }}>
          {[
            {
              title: 'Modern React 19',
              description: 'Built with the latest React features including hooks and concurrent rendering',
              color: 'primary',
            },
            {
              title: 'TypeScript',
              description: 'Full TypeScript support for better development experience and type safety',
              color: 'secondary',
            },
            {
              title: 'Material-UI',
              description: 'Beautiful, accessible components following Material Design principles',
              color: 'success',
            },
            {
              title: 'Tailwind CSS',
              description: 'Utility-first CSS framework for rapid UI development',
              color: 'info',
            },
            {
              title: 'Zustand',
              description: 'Lightweight state management with minimal boilerplate',
              color: 'warning',
            },
            {
              title: 'React Router',
              description: 'Declarative routing for React applications',
              color: 'error',
            },
          ].map((feature, index) => (
            <Card key={index} elevation={1} className="h-full hover:shadow-lg transition-shadow">
              <CardContent>
                <Typography variant="h6" component="h3" gutterBottom color={`${feature.color}.main`}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>
    </Container>
  );
};

export default Home; 