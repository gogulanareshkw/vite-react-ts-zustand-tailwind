import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Paper,
} from '@mui/material';
import {
  Help,
  ContactSupport,
  Assessment,
  TrendingUp,
  School,
  Info,
  Rule,
  PersonAdd,
  Description,
  ChevronRight,
} from '@mui/icons-material';
import { useStore } from '../store/useStore';

const More: React.FC = () => {
  const navigate = useNavigate();


  const sections = [
    {
      title: 'Support & Information',
      items: [
        {
          title: 'Help',
          icon: <Help />,
          path: '/help',
          public: true,
        },
        {
          title: 'Contact Us',
          icon: <ContactSupport />,
          path: '/contact',
          public: true,
        },
        {
          title: 'About Us',
          icon: <Info />,
          path: '/about',
          public: true,
        },
        {
          title: 'How to Play',
          icon: <School />,
          path: '/how-to-play',
          public: true,
        },
        {
          title: 'Rules',
          icon: <Rule />,
          path: '/rules',
          public: true,
        },
        {
          title: 'Terms & Conditions',
          icon: <Description />,
          path: '/terms',
          public: true,
        },
      ],
    },
    {
      title: 'Lottery & Games',
      items: [
        {
          title: 'Lottery Results',
          icon: <Assessment />,
          path: '/results',
          public: true,
        },
        {
          title: 'Exchange Rates',
          icon: <TrendingUp />,
          path: '/exchange-rates',
          public: true,
        },
        {
          title: 'Agent SignUp',
          icon: <PersonAdd />,
          path: '/agent-registration',
          public: true,
        },
      ],
    },

  ];

  const renderSection = (section: any) => {
    const filteredItems = section.items.filter((item: any) => 
      item.public
    );

    if (filteredItems.length === 0) return null;

    return (
      <Box key={section.title} sx={{ mb: 4 }}>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 'bold', 
            mb: 2, 
            color: 'text.primary',
            fontSize: '1.1rem',
          }}
        >
          {section.title}
        </Typography>
        <Paper elevation={1} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <List sx={{ p: 0 }}>
            {filteredItems.map((item: any, index: number) => (
              <React.Fragment key={item.path}>
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => navigate(item.path)}
                    sx={{
                      py: 2.5,
                      px: 3,
                      '&:hover': {
                        backgroundColor: 'action.hover',
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40, color: 'text.primary' }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.title}
                      primaryTypographyProps={{
                        fontSize: '1rem',
                        fontWeight: 500,
                      }}
                    />
                    <ChevronRight sx={{ color: 'text.secondary' }} />
                  </ListItemButton>
                </ListItem>
                {index < filteredItems.length - 1 && (
                  <Divider sx={{ mx: 3 }} />
                )}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      </Box>
    );
  };

  return (
    <Container 
      maxWidth="md" 
      sx={{ 
        py: 3, 
        pb: 8,
        px: { xs: 2, sm: 3, md: 4 },
      }}
    >
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h4" 
          component="h1" 
          sx={{ 
            fontWeight: 'bold',
            textAlign: { xs: 'left', md: 'center' },
            mb: { xs: 2, md: 3 },
          }}
        >
          More
        </Typography>
      </Box>

      {/* Sections */}
      <Box sx={{ width: '100%' }}>
        {sections.map(renderSection)}
      </Box>
    </Container>
  );
};

export default More; 