import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from '../store/useStore';

// Existing Pages
import Home from '../pages/Home';
import About from '../pages/About';
import Contact from '../pages/Contact';
import Help from '../pages/Help';
import Login from '../pages/Login';
import SignUp from '../pages/SignUp';
import VerifyEmail from '../pages/VerifyEmail';
import Dashboard from '../pages/Dashboard';
import Profile from '../pages/Profile';

// Placeholder Components
const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => (
  <div style={{ padding: '2rem', textAlign: 'center' }}>
    <h1>{title}</h1>
    <p>This page is under development.</p>
  </div>
);

// Protected Route Component
const ProtectedRoute: React.FC<{ 
  children: React.ReactNode; 
  requireEmailVerified?: boolean;
  requireAgentVerified?: boolean;
  allowedRoles?: number[];
}> = ({ 
  children, 
  requireEmailVerified = false, 
  requireAgentVerified = false, 
  allowedRoles = [] 
}) => {
  const { isAuthenticated, user } = useStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireEmailVerified && !user?.isEmailVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  if (requireAgentVerified && !user?.isAgentVerified) {
    return <Navigate to="/verify-agent" replace />;
  }

  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.userRole)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/help" element={<Help />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/verify-email" element={<VerifyEmail />} />

      {/* Protected Routes */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute requireEmailVerified={true} requireAgentVerified={true}>
            <Dashboard />
          </ProtectedRoute>
        } 
      />

      {/* Placeholder Routes */}
      <Route path="/forgot-password" element={<PlaceholderPage title="Forgot Password" />} />
      <Route path="/reset-password" element={<PlaceholderPage title="Reset Password" />} />
      <Route path="/rules" element={<PlaceholderPage title="Rules & Conditions" />} />
      <Route path="/privacy" element={<PlaceholderPage title="Privacy Policy" />} />
      <Route path="/agent-registration" element={<PlaceholderPage title="Agent Registration" />} />
      <Route path="/verify-agent" element={<PlaceholderPage title="Agent Verification" />} />
      <Route path="/change-password" element={<PlaceholderPage title="Change Password" />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/profile-settings" element={<PlaceholderPage title="Profile Settings" />} />
      <Route path="/game-options" element={<PlaceholderPage title="Game Options" />} />
      <Route path="/play-lottery/:lotteryGameType" element={<PlaceholderPage title="Play Lottery" />} />
      <Route path="/buy-lottery-ticket" element={<PlaceholderPage title="Buy Lottery Ticket" />} />
      <Route path="/recharge" element={<PlaceholderPage title="Recharge" />} />
      <Route path="/withdraw" element={<PlaceholderPage title="Withdraw" />} />
      <Route path="/lottery-history" element={<PlaceholderPage title="Lottery History" />} />
      <Route path="/bank-cards" element={<PlaceholderPage title="Bank Cards" />} />
      <Route path="/offers" element={<PlaceholderPage title="Offers" />} />
      <Route path="/transactions/:userId" element={<PlaceholderPage title="Transactions" />} />
      <Route path="/referrals/:userId" element={<PlaceholderPage title="Referrals" />} />
      <Route path="/wallet/:userId" element={<PlaceholderPage title="Wallet" />} />
      <Route path="/transaction-info/:txnId" element={<PlaceholderPage title="Transaction Info" />} />
      <Route path="/ticket-info/:ticketId" element={<PlaceholderPage title="Ticket Info" />} />
      <Route path="/lottery-results" element={<PlaceholderPage title="Lottery Results" />} />
      <Route path="/exchange-rates" element={<PlaceholderPage title="Exchange Rates" />} />

      {/* Admin Routes */}
      <Route path="/admin/users" element={<PlaceholderPage title="Users List" />} />
      <Route path="/admin/user/:userId" element={<PlaceholderPage title="User Information" />} />
      <Route path="/admin/game-settings" element={<PlaceholderPage title="Game Settings" />} />
      <Route path="/admin/lottery-settings" element={<PlaceholderPage title="Lottery Settings" />} />
      <Route path="/admin/search-transactions" element={<PlaceholderPage title="Search Transactions" />} />
      <Route path="/admin/payment-transactions" element={<PlaceholderPage title="Payment Transactions" />} />
      <Route path="/admin/filter-transactions" element={<PlaceholderPage title="Filter Transactions" />} />
      <Route path="/admin/lottery-summary" element={<PlaceholderPage title="Lottery Summary" />} />
      <Route path="/admin/lottery-plays" element={<PlaceholderPage title="Lottery Plays" />} />
      <Route path="/admin/application-agents" element={<PlaceholderPage title="Application Agents" />} />
      <Route path="/admin/feedbacks" element={<PlaceholderPage title="Feedbacks" />} />
      <Route path="/admin/media" element={<PlaceholderPage title="Manage Media" />} />
      <Route path="/admin/bank-details" element={<PlaceholderPage title="Bank Details" />} />
      <Route path="/admin/email-summary" element={<PlaceholderPage title="Email Summary" />} />
      <Route path="/admin/filter-mobile-data" element={<PlaceholderPage title="Filter Mobile Data" />} />
      <Route path="/admin/application-logs" element={<PlaceholderPage title="Application Logs" />} />
      <Route path="/admin/update-tickets" element={<PlaceholderPage title="Update Tickets" />} />
      <Route path="/admin/user-mobile-data/:userId" element={<PlaceholderPage title="User Mobile Data" />} />
      <Route path="/admin/user-mobile-data-new/:userId" element={<PlaceholderPage title="User Mobile Data New" />} />
      <Route path="/admin/mobile-users" element={<PlaceholderPage title="Mobile Users" />} />
      <Route path="/admin/recharge-user" element={<PlaceholderPage title="Recharge User" />} />
      <Route path="/admin/recharge-list/:userId" element={<PlaceholderPage title="Recharge List" />} />

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes; 