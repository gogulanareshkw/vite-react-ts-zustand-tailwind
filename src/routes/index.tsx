import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { USER_ROLES } from '../config/navigation';

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
import AgentVerification from '../pages/AgentVerification';
import Offers from '../pages/Offers';
import ExchangeRates from '../pages/ExchangeRates';
import LotteryHistory from '../pages/LotteryHistory';
import TransactionInfo from '../pages/TransactionInfo';
import LotteryTicketInfo from '../pages/LotteryTicketInfo';
import TestNotifications from '../pages/TestNotifications';

// Admin Pages
import UsersList from '../pages/admin/UsersList';
import AdminDashboard from '../pages/admin/AdminDashboard';
import OffersManagement from '../pages/admin/OffersManagement';
import GameSettings from '../pages/admin/GameSettings';
import ApplicationLogs from '../pages/admin/ApplicationLogs';
import DatabaseHistory from '../pages/admin/DatabaseHistory';
import SystemMonitor from '../pages/admin/SystemMonitor';
import LotterySettings from '../pages/admin/LotterySettings';
import SearchTransactions from '../pages/admin/SearchTransactions';
import ApplicationAgents from '../pages/admin/ApplicationAgents';
import TransactionManagement from '../pages/admin/TransactionManagement';
import Feedbacks from '../pages/admin/Feedbacks';
import MediaManagement from '../pages/admin/MediaManagement';
import BankDetails from '../pages/admin/BankDetails';

// Layout Components
import UserPageWrapper from '../components/UserPageWrapper';

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
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute requireEmailVerified={true} requireAgentVerified={true}>
            <UserPageWrapper title="Profile">
              <Profile />
            </UserPageWrapper>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/change-password" 
        element={
          <ProtectedRoute requireEmailVerified={true}>
            <UserPageWrapper title="Change Password">
              <ChangePassword />
            </UserPageWrapper>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/recharge" 
        element={
          <ProtectedRoute requireEmailVerified={true} requireAgentVerified={true}>
            <UserPageWrapper title="Recharge">
              <RechargePage />
            </UserPageWrapper>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/withdraw" 
        element={
          <ProtectedRoute requireEmailVerified={true} requireAgentVerified={true}>
            <UserPageWrapper title="Withdraw">
              <WithDrawPage />
            </UserPageWrapper>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/bank-cards" 
        element={
          <ProtectedRoute requireEmailVerified={true} requireAgentVerified={true}>
            <UserPageWrapper title="Bank Cards">
              <BankCards />
            </UserPageWrapper>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/lottery-game" 
        element={
          <ProtectedRoute 
            requireEmailVerified={true} 
            requireAgentVerified={true}
            allowedRoles={[USER_ROLES.USER, USER_ROLES.AGENT, USER_ROLES.STAFF, USER_ROLES.SUPER_ADMIN]}
          >
            <UserPageWrapper title="Lottery Game">
              <LotteryGame />
            </UserPageWrapper>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/results" 
        element={
          <ProtectedRoute requireEmailVerified={true} requireAgentVerified={true}>
            <UserPageWrapper title="Results">
              <Results />
            </UserPageWrapper>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/offers" 
        element={
          <ProtectedRoute requireEmailVerified={true} requireAgentVerified={true}>
            <UserPageWrapper title="Offers">
              <Offers />
            </UserPageWrapper>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/exchange-rates" 
        element={
          <ProtectedRoute requireEmailVerified={true} requireAgentVerified={true}>
            <UserPageWrapper title="Exchange Rates">
              <ExchangeRates />
            </UserPageWrapper>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/lottery-history" 
        element={
          <ProtectedRoute 
            requireEmailVerified={true} 
            requireAgentVerified={true}
            allowedRoles={[USER_ROLES.USER, USER_ROLES.AGENT, USER_ROLES.STAFF, USER_ROLES.SUPER_ADMIN]}
          >
            <UserPageWrapper title="Lottery History">
              <LotteryHistory />
            </UserPageWrapper>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/verify-agent" 
        element={
          <ProtectedRoute requireEmailVerified={true}>
            <UserPageWrapper title="Agent Verification">
              <AgentVerification />
            </UserPageWrapper>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/transaction-info/:txnId" 
        element={
          <ProtectedRoute requireEmailVerified={true} requireAgentVerified={true}>
            <UserPageWrapper title="Transaction Info">
              <TransactionInfo />
            </UserPageWrapper>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/ticket-info/:ticketId" 
        element={
          <ProtectedRoute requireEmailVerified={true} requireAgentVerified={true}>
            <UserPageWrapper title="Ticket Info">
              <LotteryTicketInfo />
            </UserPageWrapper>
          </ProtectedRoute>
        } 
      />

      {/* Admin Routes */}
      <Route 
        path="/admin/dashboard" 
        element={
          <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]}>
            <UserPageWrapper>
              <AdminDashboard />
            </UserPageWrapper>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/users" 
        element={
          <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]}>
            <UserPageWrapper>
              <UsersList />
            </UserPageWrapper>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/offers" 
        element={
          <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]}>
            <UserPageWrapper>
              <OffersManagement />
            </UserPageWrapper>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/game-settings" 
        element={
          <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]}>
            <UserPageWrapper>
              <GameSettings />
            </UserPageWrapper>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/application-logs" 
        element={
          <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]}>
            <UserPageWrapper>
              <ApplicationLogs />
            </UserPageWrapper>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/database-history" 
        element={
          <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]}>
            <UserPageWrapper>
              <DatabaseHistory />
            </UserPageWrapper>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/system-monitor" 
        element={
          <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]}>
            <UserPageWrapper>
              <SystemMonitor />
            </UserPageWrapper>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/lottery-settings" 
        element={
          <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]}>
            <UserPageWrapper>
              <LotterySettings />
            </UserPageWrapper>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/search-transactions" 
        element={
          <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]}>
            <UserPageWrapper>
              <SearchTransactions />
            </UserPageWrapper>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/application-agents" 
        element={
          <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]}>
            <UserPageWrapper>
              <ApplicationAgents />
            </UserPageWrapper>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/transaction-management" 
        element={
          <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]}>
            <UserPageWrapper>
              <TransactionManagement />
            </UserPageWrapper>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/feedbacks" 
        element={
          <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]}>
            <UserPageWrapper>
              <Feedbacks />
            </UserPageWrapper>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/media" 
        element={
          <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]}>
            <UserPageWrapper>
              <MediaManagement />
            </UserPageWrapper>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/bank-details" 
        element={
          <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]}>
            <UserPageWrapper>
              <BankDetails />
            </UserPageWrapper>
          </ProtectedRoute>
        } 
      />

      {/* Placeholder Routes - Consolidated */}
      <Route 
        path="/agent-registration" 
        element={
          <ProtectedRoute requireEmailVerified={true}>
            <UserPageWrapper title="Agent Registration">
              <PlaceholderPage title="Agent Registration" />
            </UserPageWrapper>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/profile-settings" 
        element={
          <ProtectedRoute requireEmailVerified={true} requireAgentVerified={true}>
            <UserPageWrapper title="Profile Settings">
              <PlaceholderPage title="Profile Settings" />
            </UserPageWrapper>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/game-options" 
        element={
          <ProtectedRoute requireEmailVerified={true} requireAgentVerified={true}>
            <UserPageWrapper title="Game Options">
              <PlaceholderPage title="Game Options" />
            </UserPageWrapper>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/play-lottery/:lotteryGameType" 
        element={
          <ProtectedRoute requireEmailVerified={true} requireAgentVerified={true}>
            <UserPageWrapper title="Play Lottery">
              <PlaceholderPage title="Play Lottery" />
            </UserPageWrapper>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/buy-lottery-ticket" 
        element={
          <ProtectedRoute requireEmailVerified={true} requireAgentVerified={true}>
            <UserPageWrapper title="Buy Lottery Ticket">
              <PlaceholderPage title="Buy Lottery Ticket" />
            </UserPageWrapper>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/transactions/:userId" 
        element={
          <ProtectedRoute requireEmailVerified={true} requireAgentVerified={true}>
            <UserPageWrapper title="Transactions">
              <PlaceholderPage title="Transactions" />
            </UserPageWrapper>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/referrals/:userId" 
        element={
          <ProtectedRoute requireEmailVerified={true} requireAgentVerified={true}>
            <UserPageWrapper title="Referrals">
              <PlaceholderPage title="Referrals" />
            </UserPageWrapper>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/wallet/:userId" 
        element={
          <ProtectedRoute requireEmailVerified={true} requireAgentVerified={true}>
            <UserPageWrapper title="Wallet">
              <PlaceholderPage title="Wallet" />
            </UserPageWrapper>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/lottery-results" 
        element={
          <ProtectedRoute requireEmailVerified={true} requireAgentVerified={true}>
            <UserPageWrapper title="Lottery Results">
              <PlaceholderPage title="Lottery Results" />
            </UserPageWrapper>
          </ProtectedRoute>
        } 
      />

      {/* Admin Placeholder Routes */}
      <Route path="/admin/payment-transactions" element={<UserPageWrapper><PlaceholderPage title="Payment Transactions" /></UserPageWrapper>} />
      <Route path="/admin/filter-transactions" element={<UserPageWrapper><PlaceholderPage title="Filter Transactions" /></UserPageWrapper>} />
      <Route path="/admin/lottery-summary" element={<UserPageWrapper><PlaceholderPage title="Lottery Summary" /></UserPageWrapper>} />
      <Route path="/admin/lottery-plays" element={<UserPageWrapper><PlaceholderPage title="Lottery Plays" /></UserPageWrapper>} />
      <Route path="/admin/filter-mobile-data" element={<UserPageWrapper><PlaceholderPage title="Filter Mobile Data" /></UserPageWrapper>} />
      <Route path="/admin/update-tickets" element={<UserPageWrapper><PlaceholderPage title="Update Tickets" /></UserPageWrapper>} />
      <Route path="/admin/user-mobile-data/:userId" element={<UserPageWrapper><PlaceholderPage title="User Mobile Data" /></UserPageWrapper>} />
      <Route path="/admin/user-mobile-data-new/:userId" element={<UserPageWrapper><PlaceholderPage title="User Mobile Data New" /></UserPageWrapper>} />
      <Route path="/admin/mobile-users" element={<UserPageWrapper><PlaceholderPage title="Mobile Users" /></UserPageWrapper>} />
      <Route path="/admin/recharge-user" element={<UserPageWrapper><PlaceholderPage title="Recharge User" /></UserPageWrapper>} />
      <Route path="/admin/recharge-list/:userId" element={<UserPageWrapper><PlaceholderPage title="Recharge List" /></UserPageWrapper>} />

      {/* Test Notifications Route */}
      <Route path="/test-notifications" element={<UserPageWrapper><TestNotifications /></UserPageWrapper>} />

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes; 