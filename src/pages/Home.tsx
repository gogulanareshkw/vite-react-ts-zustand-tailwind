import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Paper,
  Alert,
  IconButton,
  useTheme,
  useMediaQuery,
  Divider,
} from '@mui/material';
import {
  KeyboardArrowLeft,
  KeyboardArrowRight,
  KeyboardArrowUp,
  Casino,
  EmojiEvents,
  TrendingUp,
  Security,
  History,
  Public,
} from '@mui/icons-material';

const Home: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Sample lottery images (you can replace with actual lottery images)
  const slides = [
    {
      id: 1,
      title: "Win Big with GulfLotto",
      description: "Join millions of players for your chance to win life-changing prizes",
      image: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=800&h=400&fit=crop",
      color: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    },
    {
      id: 2,
      title: "Monthly Draws",
      description: "Draws held on the 1st and 16th of every month",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=400&fit=crop",
      color: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
    },
    {
      id: 3,
      title: "Secure & Trusted",
      description: "Government-administered lottery with guaranteed security",
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=400&fit=crop",
      color: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box sx={{ minHeight: '100vh' }}>
      {/* Hero Section with Image Slides */}
      <Box sx={{ position: 'relative', height: { xs: '60vh', md: '70vh' }, overflow: 'hidden' }}>
        {slides.map((slide, index) => (
          <Box
            key={slide.id}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              opacity: index === currentSlide ? 1 : 0,
              transition: 'opacity 0.8s ease-in-out',
              background: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${slide.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Container maxWidth="lg">
              <Box sx={{ textAlign: 'center', color: 'white' }}>
                <Typography 
                  variant={isMobile ? "h3" : "h2"} 
                  component="h1" 
                  gutterBottom
                  sx={{ 
                    fontWeight: 'bold',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                    mb: 2
                  }}
                >
                  {slide.title}
                </Typography>
                <Typography 
                  variant={isMobile ? "h6" : "h5"} 
                  sx={{ 
                    textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                    mb: 4
                  }}
                >
                  {slide.description}
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    background: slide.color,
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Play Now
                </Button>
              </Box>
            </Container>
          </Box>
        ))}

        {/* Slide Navigation */}
        <IconButton
          onClick={prevSlide}
          sx={{
            position: 'absolute',
            left: 16,
            top: '50%',
            transform: 'translateY(-50%)',
            bgcolor: 'rgba(255,255,255,0.2)',
            color: 'white',
            '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
          }}
        >
          <KeyboardArrowLeft />
        </IconButton>
        <IconButton
          onClick={nextSlide}
          sx={{
            position: 'absolute',
            right: 16,
            top: '50%',
            transform: 'translateY(-50%)',
            bgcolor: 'rgba(255,255,255,0.2)',
            color: 'white',
            '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
          }}
        >
          <KeyboardArrowRight />
        </IconButton>

        {/* Slide Indicators */}
        <Box sx={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 1 }}>
          {slides.map((_, index) => (
            <Box
              key={index}
              onClick={() => setCurrentSlide(index)}
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                bgcolor: index === currentSlide ? 'white' : 'rgba(255,255,255,0.5)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.8)' },
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Official Notice Section */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Alert 
          severity="info" 
          sx={{ 
            mb: 4,
            fontSize: '1.1rem',
            '& .MuiAlert-message': { fontSize: '1.1rem' }
          }}
          icon={<Security sx={{ fontSize: 28 }} />}
        >
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
            OFFICIAL NOTICE
          </Typography>
          <Typography variant="body1">
            OFFICIAL NATIONAL LOTTERY IS ADMINISTERED BY THE GOVERNMENT LOTTERY OFFICE. 
            THAILAND NATIONAL LOTTERY IS DRAWN ON FIRST AND THE SIXTEENTH OF EVERY MONTH.
          </Typography>
        </Alert>

        {/* Thai Lottery Information Section */}
        <Box sx={{ mb: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <History sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
            <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold' }}>
              Thai Lottery History & Information
            </Typography>
          </Box>
          
          <Card elevation={3} sx={{ p: 4, mb: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              Play Thai Lottery Online Through GulfLotto
            </Typography>
            <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
              Experience the excitement of Thai Lottery online through our secure platform GulfLotto by registering your account in just a few clicks. 
              The Thai Lottery is the official national lottery in Thailand, administered by the Government Lottery Office (GLO) and is extremely popular 
              not only in Thailand but also in Saudi Arabia, Kuwait, Pakistan, and many other countries.
            </Typography>
            
            <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
              The Thai Lottery draws are held twice monthly on the 1st and 16th of every month, providing regular opportunities for players to win 
              life-changing prizes. Our platform ensures secure transactions and fair play, maintaining the integrity of this historic lottery system.
            </Typography>
          </Card>

          <Card elevation={3} sx={{ p: 4, background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Public sx={{ fontSize: 32, color: 'secondary.main', mr: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'secondary.main' }}>
                Historical Background
              </Typography>
            </Box>
            
            <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
              The history of lottery issuance in Thailand dates back to the reign of King Chulalongkorn (Rama V). The first lottery was introduced 
              by an Englishman named 'Teacher Al Baster' who was instrumental in bringing European lottery systems to Thailand. In 1874, 
              King Chulalongkorn graciously granted royal permission to the Royal Thai Army Department to issue the first official lottery in Thailand.
            </Typography>
            
            <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
              The original purpose was to support foreign merchants who brought products to exhibit in the museum at the Khong Khadod building 
              in the Grand Palace. This marked the beginning of what would become one of the most popular and trusted lottery systems in Southeast Asia.
            </Typography>
            
            <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
              Today, the Thai Lottery continues this rich tradition under the administration of the Government Lottery Office, maintaining the same 
              level of trust and integrity established over a century ago.
            </Typography>
          </Card>
        </Box>

        {/* Features Section */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ mb: 4, fontWeight: 'bold' }}>
            Why Choose GulfLotto?
          </Typography>
          
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
            gap: 3 
          }}>
            <Card elevation={3} sx={{ p: 3, textAlign: 'center' }}>
              <Casino sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Easy to Play
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Simple number selection process with multiple ways to play and win
              </Typography>
            </Card>

            <Card elevation={3} sx={{ p: 3, textAlign: 'center' }}>
              <EmojiEvents sx={{ fontSize: 48, color: 'secondary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Big Prizes
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Life-changing jackpots and multiple prize tiers for every draw
              </Typography>
            </Card>

            <Card elevation={3} sx={{ p: 3, textAlign: 'center' }}>
              <TrendingUp sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Regular Draws
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Monthly draws on the 1st and 16th with instant results
              </Typography>
            </Card>
          </Box>
        </Box>

        {/* Quick Stats */}
        <Paper elevation={2} sx={{ p: 4, textAlign: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
            Lottery Statistics
          </Typography>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
            gap: 3 
          }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>2</Typography>
              <Typography variant="body2">Draws per Month</Typography>
            </Box>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>1M+</Typography>
              <Typography variant="body2">Active Players</Typography>
            </Box>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>฿50M</Typography>
              <Typography variant="body2">Total Prizes</Typography>
            </Box>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>99%</Typography>
              <Typography variant="body2">Satisfaction Rate</Typography>
            </Box>
          </Box>
        </Paper>
      </Container>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <IconButton
          onClick={handleScrollTop}
          sx={{
            position: 'fixed',
            bottom: { xs: 80, sm: 70 },
            right: 20,
            bgcolor: 'primary.main',
            color: 'white',
            width: 56,
            height: 56,
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            '&:hover': {
              bgcolor: 'primary.dark',
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 20px rgba(0,0,0,0.4)',
            },
            transition: 'all 0.3s ease',
            zIndex: 1000,
          }}
        >
          <KeyboardArrowUp />
        </IconButton>
      )}
    </Box>
  );
};

export default Home; 
