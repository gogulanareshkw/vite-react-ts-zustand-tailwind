import React from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  Code as CodeIcon,
  Palette as PaletteIcon,
  Storage as StorageIcon,
  Router as RouterIcon,
  Api as ApiIcon,
} from '@mui/icons-material';

const About: React.FC = () => {
  const technologies = [
    {
      name: 'React 19',
      description: 'Latest version with concurrent features and improved performance',
      icon: <CodeIcon color="primary" />,
    },
    {
      name: 'TypeScript',
      description: 'Static type checking for better development experience',
      icon: <CodeIcon color="secondary" />,
    },
    {
      name: 'Material-UI',
      description: 'Comprehensive component library following Material Design',
      icon: <PaletteIcon color="success" />,
    },
    {
      name: 'Zustand',
      description: 'Lightweight state management with minimal boilerplate',
      icon: <StorageIcon color="info" />,
    },
    {
      name: 'React Router',
      description: 'Declarative routing for single-page applications',
      icon: <RouterIcon color="warning" />,
    },
    {
      name: 'Axios',
      description: 'Promise-based HTTP client for API requests',
      icon: <ApiIcon color="error" />,
    },
  ];

  const features = [
    'Responsive design that works on all devices',
    'Modern UI with Material Design principles',
    'State management with Zustand',
    'Type-safe development with TypeScript',
    'API integration with error handling',
    'Routing with React Router DOM',
    'Utility-first styling with Tailwind CSS',
    'Component-based architecture',
    'Hot reload development experience',
    'Production-ready build configuration',
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center" className="mb-8">
        About This Project
      </Typography>
      
      <Typography variant="h6" color="text.secondary" align="center" className="mb-12">
        A modern React application showcasing best practices and popular technologies
      </Typography>

      <Grid container spacing={4}>
        {/* Project Overview */}
        <Grid item xs={12} md={6}>
          <Card elevation={2} className="h-full">
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                Project Overview
              </Typography>
              
              <Typography variant="body1" paragraph>
                This is a comprehensive React application that demonstrates modern web development practices. 
                It serves as a template for building scalable, maintainable React applications with a focus 
                on developer experience and user interface quality.
              </Typography>
              
              <Typography variant="body1" paragraph>
                The application includes state management, routing, API integration, and a beautiful, 
                responsive user interface. It's built with TypeScript for type safety and uses the latest 
                React features for optimal performance.
              </Typography>
              
              <Typography variant="body1">
                Whether you're building a small project or a large-scale application, this template 
                provides a solid foundation that you can extend and customize according to your needs.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Key Features */}
        <Grid item xs={12} md={6}>
          <Card elevation={2} className="h-full">
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                Key Features
              </Typography>
              
              <List>
                {features.map((feature, index) => (
                  <React.Fragment key={index}>
                    <ListItem>
                      <ListItemIcon>
                        <CheckIcon color="success" />
                      </ListItemIcon>
                      <ListItemText primary={feature} />
                    </ListItem>
                    {index < features.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Technologies Used */}
      <Box mt={8}>
        <Typography variant="h4" component="h2" gutterBottom align="center" className="mb-6">
          Technologies Used
        </Typography>
        
        <Grid container spacing={3}>
          {technologies.map((tech, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card elevation={1} className="h-full hover:shadow-lg transition-shadow">
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    {tech.icon}
                    <Typography variant="h6" component="h3" sx={{ ml: 1 }}>
                      {tech.name}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {tech.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Getting Started */}
      <Box mt={8}>
        <Card elevation={2}>
          <CardContent>
            <Typography variant="h5" component="h2" gutterBottom>
              Getting Started
            </Typography>
            
            <Typography variant="body1" paragraph>
              To get started with this project:
            </Typography>
            
            <Box component="ol" sx={{ pl: 2 }}>
              <Typography component="li" variant="body1" paragraph>
                Clone the repository and install dependencies with <code>npm install</code>
              </Typography>
              <Typography component="li" variant="body1" paragraph>
                Start the development server with <code>npm run dev</code>
              </Typography>
              <Typography component="li" variant="body1" paragraph>
                Open your browser and navigate to <code>http://localhost:5173</code>
              </Typography>
              <Typography component="li" variant="body1" paragraph>
                Explore the codebase and customize it for your needs
              </Typography>
            </Box>
            
            <Typography variant="body1" sx={{ mt: 3 }}>
              The application is now running in development mode. You can test the counter functionality, 
              API integration, and navigation between pages. The development server will automatically 
              reload when you make changes to the code.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default About; 