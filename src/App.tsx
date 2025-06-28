import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import { theme } from './theme';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';

// Placeholder components for other pages
const Prizes: React.FC = () => (
  <Box sx={{ p: 4, textAlign: 'center' }}>
    <h1>Prizes</h1>
    <p>Prize information will be displayed here.</p>
  </Box>
);

const Results: React.FC = () => (
  <Box sx={{ p: 4, textAlign: 'center' }}>
    <h1>Results</h1>
    <p>Lottery results will be displayed here.</p>
  </Box>
);

const HowToPlay: React.FC = () => (
  <Box sx={{ p: 4, textAlign: 'center' }}>
    <h1>How to Play</h1>
    <p>Instructions on how to play the lottery will be displayed here.</p>
  </Box>
);

const Contact: React.FC = () => (
  <Box sx={{ p: 4, textAlign: 'center' }}>
    <h1>Contact Us</h1>
    <p>Contact information will be displayed here.</p>
  </Box>
);

const Help: React.FC = () => (
  <Box sx={{ p: 4, textAlign: 'center' }}>
    <h1>Help</h1>
    <p>Help and support information will be displayed here.</p>
  </Box>
);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
          }}
        >
          <Header />
          <Box component="main" sx={{ flexGrow: 1 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/prizes" element={<Prizes />} />
              <Route path="/results" element={<Results />} />
              <Route path="/how-to-play" element={<HowToPlay />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/help" element={<Help />} />
            </Routes>
          </Box>
          <Footer />
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
