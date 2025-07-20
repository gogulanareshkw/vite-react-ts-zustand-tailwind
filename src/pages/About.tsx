import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Grid,
  Chip,
} from '@mui/material';
import {
  ArrowBack,
  Security,
  Speed,
  Support,
  EmojiEvents,
  Payment,
  Casino,
  VerifiedUser,
  TrendingUp,
  Group,
} from '@mui/icons-material';

const About: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Security />,
      title: 'Secure & Safe',
      description: 'Bank-level security with SSL encryption to protect your data and transactions.',
      color: 'primary.main'
    },
    {
      icon: <Speed />,
      title: 'Fast & Reliable',
      description: 'Instant ticket purchases and real-time results with 99.9% uptime guarantee.',
      color: 'success.main'
    },
    {
      icon: <Support />,
      title: '24/7 Support',
      description: 'Round-the-clock customer support through email, phone, and WhatsApp.',
      color: 'info.main'
    },
    {
      icon: <EmojiEvents />,
      title: 'Big Prizes',
      description: 'Huge prize pools with multiple winning categories and instant payouts.',
      color: 'warning.main'
    },
    {
      icon: <Payment />,
      title: 'Easy Payments',
      description: 'Multiple payment options including UPI, cards, and bank transfers.',
      color: 'secondary.main'
    },
    {
      icon: <Casino />,
      title: 'Multiple Games',
      description: 'Various lottery games with different odds and prize structures.',
      color: 'error.main'
    }
  ];

  const stats = [
    { label: 'Active Users', value: '50,000+', icon: <Group /> },
    { label: 'Games Played', value: '1M+', icon: <Casino /> },
    { label: 'Prizes Awarded', value: '₹10Cr+', icon: <EmojiEvents /> },
    { label: 'Success Rate', value: '99.9%', icon: <TrendingUp /> }
  ];

  const team = [
    {
      name: 'Rahul Sharma',
      role: 'CEO & Founder',
      description: '10+ years in gaming industry with expertise in lottery systems.',
      image: '/api/placeholder/150/150'
    },
    {
      name: 'Priya Patel',
      role: 'CTO',
      description: 'Technology leader with experience in scalable gaming platforms.',
      image: '/api/placeholder/150/150'
    },
    {
      name: 'Amit Kumar',
      role: 'Head of Operations',
      description: 'Operations expert ensuring smooth day-to-day lottery operations.',
      image: '/api/placeholder/150/150'
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          About WahLotto
        </Typography>
        <Typography variant="h6" color="text.secondary">
          India's most trusted online lottery platform
        </Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
                      onClick={() => navigate('/my-profile')}
        >
          Back to My Profile
        </Button>
      </Box>

      {/* Hero Section */}
      <Card elevation={4} sx={{ mb: 6, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <CardContent sx={{ p: 6, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
            Welcome to WahLotto
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            WahLotto is India's premier online lottery platform, offering secure, fair, and exciting lottery games to players across the country. 
            Our mission is to provide a safe and entertaining gaming experience while giving players the chance to win life-changing prizes.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Chip label="Licensed & Regulated" color="primary" variant="outlined" sx={{ color: 'white', borderColor: 'white' }} />
            <Chip label="SSL Secured" color="primary" variant="outlined" sx={{ color: 'white', borderColor: 'white' }} />
            <Chip label="24/7 Support" color="primary" variant="outlined" sx={{ color: 'white', borderColor: 'white' }} />
          </Box>
        </CardContent>
      </Card>

      {/* Mission & Vision */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 4, textAlign: 'center' }}>
          Our Mission & Vision
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
          <Card elevation={4} sx={{ flex: 1 }}>
            <CardContent sx={{ p: 4, textAlign: 'center' }}>
              <VerifiedUser sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                Our Mission
              </Typography>
              <Typography variant="body1" color="text.secondary">
                To provide a secure, fair, and entertaining lottery platform that gives players the opportunity to win life-changing prizes while maintaining the highest standards of integrity and customer service.
              </Typography>
            </CardContent>
          </Card>
          <Card elevation={4} sx={{ flex: 1 }}>
            <CardContent sx={{ p: 4, textAlign: 'center' }}>
              <TrendingUp sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                Our Vision
              </Typography>
              <Typography variant="body1" color="text.secondary">
                To become India's most trusted and preferred online lottery platform, known for innovation, transparency, and exceptional player experience.
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Features */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 4, textAlign: 'center' }}>
          Why Choose WahLotto?
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {features.map((feature, index) => (
            <Card key={index} elevation={4}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Box sx={{ color: feature.color }}>
                    {feature.icon}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>

      {/* Statistics */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 4, textAlign: 'center' }}>
          WahLotto in Numbers
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3 }}>
          {stats.map((stat, index) => (
            <Card key={index} elevation={4} sx={{ flex: 1 }}>
              <CardContent sx={{ p: 4, textAlign: 'center' }}>
                <Box sx={{ color: 'primary.main', mb: 2 }}>
                  {stat.icon}
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {stat.value}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {stat.label}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>

      {/* Team */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 4, textAlign: 'center' }}>
          Our Leadership Team
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
          {team.map((member, index) => (
            <Card key={index} elevation={4} sx={{ flex: 1 }}>
              <CardContent sx={{ p: 4, textAlign: 'center' }}>
                <Box
                  sx={{
                    width: 120,
                    height: 120,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    margin: '0 auto 2rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '2rem',
                    fontWeight: 'bold'
                  }}
                >
                  {member.name.split(' ').map(n => n[0]).join('')}
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {member.name}
                </Typography>
                <Typography variant="body2" color="primary" sx={{ fontWeight: 'bold', mb: 2 }}>
                  {member.role}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {member.description}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>

      {/* Values */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 4, textAlign: 'center' }}>
          Our Core Values
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Card elevation={4}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: 'primary.main' }}>
                Integrity & Transparency
              </Typography>
              <Typography variant="body1" color="text.secondary">
                We believe in complete transparency in all our operations. Every draw is conducted fairly and results are published immediately. 
                Our random number generators are certified and audited regularly to ensure fairness.
              </Typography>
            </CardContent>
          </Card>
          <Card elevation={4}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: 'success.main' }}>
                Customer First
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Our customers are at the heart of everything we do. We provide 24/7 support, secure transactions, 
                and a user-friendly platform designed to enhance your gaming experience.
              </Typography>
            </CardContent>
          </Card>
          <Card elevation={4}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: 'warning.main' }}>
                Innovation & Excellence
              </Typography>
              <Typography variant="body1" color="text.secondary">
                We continuously innovate to provide the best lottery experience. Our platform uses cutting-edge technology 
                to ensure security, speed, and reliability while maintaining the highest standards of excellence.
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Call to Action */}
      <Card elevation={4} sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <CardContent sx={{ p: 6, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
            Ready to Start Playing?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Join thousands of players who trust WahLotto for their lottery entertainment. 
            Create your account today and start your journey to winning big!
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/lottery-game')}
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                fontWeight: 'bold',
                '&:hover': {
                  bgcolor: 'grey.100'
                }
              }}
            >
              Play Now
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/help')}
              sx={{
                color: 'white',
                borderColor: 'white',
                fontWeight: 'bold',
                '&:hover': {
                  borderColor: 'grey.300'
                }
              }}
            >
              Learn More
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default About; 
