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
import ChangePassword from '../pages/ChangePassword';
import RechargePage from '../pages/RechargePage';
import WithDrawPage from '../pages/WithDrawPage';
import BankCards from '../pages/BankCards';
import LotteryGame from '../pages/LotteryGame';
import Results from '../pages/Results';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';
import HowToPlay from '../pages/HowToPlay';
import Prizes from '../pages/Prizes';
import RulesConditions from '../pages/RulesConditions';
import Privacy from '../pages/Privacy';

// Admin Pages
import UsersList from '../pages/admin/UsersList';
import AdminDashboard from '../pages/admin/AdminDashboard';
import OffersManagement from '../pages/admin/OffersManagement';
import GameSettings from '../pages/admin/GameSettings';
import ApplicationLogs from '../pages/admin/ApplicationLogs';
import DatabaseHistory from '../pages/admin/DatabaseHistory';
import SystemMonitor from '../pages/admin/SystemMonitor';

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
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/how-to-play" element={<HowToPlay />} />
      <Route path="/prizes" element={<Prizes />} />
      <Route path="/rules" element={<RulesConditions />} />
      <Route path="/privacy" element={<Privacy />} />

      {/* Protected User Routes */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute requireEmailVerified={true} requireAgentVerified={true}>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route path="/profile" element={<Profile />} />
      <Route path="/change-password" element={<ChangePassword />} />
      <Route path="/recharge" element={<RechargePage />} />
      <Route path="/withdraw" element={<WithDrawPage />} />
      <Route path="/bank-cards" element={<BankCards />} />
      <Route path="/lottery-game" element={<LotteryGame />} />
      <Route path="/results" element={<Results />} />

      {/* Admin Routes */}
      <Route 
        path="/admin/dashboard" 
        element={
          <ProtectedRoute allowedRoles={[4, 5]}>
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/users" 
        element={
          <ProtectedRoute allowedRoles={[4, 5]}>
            <UsersList />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/offers" 
        element={
          <ProtectedRoute allowedRoles={[4, 5]}>
            <OffersManagement />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/game-settings" 
        element={
          <ProtectedRoute allowedRoles={[4, 5]}>
            <GameSettings />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/application-logs" 
        element={
          <ProtectedRoute allowedRoles={[4, 5]}>
            <ApplicationLogs />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/database-history" 
        element={
          <ProtectedRoute allowedRoles={[4, 5]}>
            <DatabaseHistory />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/system-monitor" 
        element={
          <ProtectedRoute allowedRoles={[4, 5]}>
            <SystemMonitor />
          </ProtectedRoute>
        } 
      />

      {/* Placeholder Routes - Consolidated */}
      <Route path="/agent-registration" element={<PlaceholderPage title="Agent Registration" />} />
      <Route path="/verify-agent" element={<PlaceholderPage title="Agent Verification" />} />
      <Route path="/profile-settings" element={<PlaceholderPage title="Profile Settings" />} />
      <Route path="/game-options" element={<PlaceholderPage title="Game Options" />} />
      <Route path="/play-lottery/:lotteryGameType" element={<PlaceholderPage title="Play Lottery" />} />
      <Route path="/buy-lottery-ticket" element={<PlaceholderPage title="Buy Lottery Ticket" />} />
      <Route path="/lottery-history" element={<PlaceholderPage title="Lottery History" />} />
      <Route path="/offers" element={<PlaceholderPage title="Offers" />} />
      <Route path="/transactions/:userId" element={<PlaceholderPage title="Transactions" />} />
      <Route path="/referrals/:userId" element={<PlaceholderPage title="Referrals" />} />
      <Route path="/wallet/:userId" element={<PlaceholderPage title="Wallet" />} />
      <Route path="/transaction-info/:txnId" element={<PlaceholderPage title="Transaction Info" />} />
      <Route path="/ticket-info/:ticketId" element={<PlaceholderPage title="Ticket Info" />} />
      <Route path="/lottery-results" element={<PlaceholderPage title="Lottery Results" />} />
      <Route path="/exchange-rates" element={<PlaceholderPage title="Exchange Rates" />} />

      {/* Admin Placeholder Routes */}
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