import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { USER_ROLES } from '../config/navigation';

// Existing Pages
import Home from '../pages/Home';
import About from '../pages/About';
import Contact from '../pages/Contact';
import Help from '../pages/Help';
import More from '../pages/More';
import Login from '../pages/Login';
import SignUp from '../pages/SignUp';
import VerifyEmail from '../pages/VerifyEmail';
import MyProfile from '../pages/MyProfile';
import Profile from '../pages/Profile';
import ProfileSettings from '../pages/ProfileSettings';
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
import WalletHistory from '../pages/WalletHistory';

// Admin Pages


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
            return <Navigate to="/my-profile" replace />;
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
      <Route path="/more" element={<More />} />
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
        path="/my-profile" 
        element={
          <ProtectedRoute requireEmailVerified={true} requireAgentVerified={true}>
            <MyProfile />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute requireEmailVerified={true} requireAgentVerified={true}>
            <UserPageWrapper>
              <Profile />
            </UserPageWrapper>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/change-password" 
        element={
          <ProtectedRoute requireEmailVerified={true}>
            <UserPageWrapper>
              <ChangePassword />
            </UserPageWrapper>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/recharge" 
        element={
          <ProtectedRoute requireEmailVerified={true} requireAgentVerified={true}>
            <UserPageWrapper>
              <RechargePage />
            </UserPageWrapper>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/withdraw" 
        element={
          <ProtectedRoute requireEmailVerified={true} requireAgentVerified={true}>
            <UserPageWrapper>
              <WithDrawPage />
            </UserPageWrapper>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/bank-cards/:userId" 
        element={
          <ProtectedRoute requireEmailVerified={true} requireAgentVerified={true}>
            <UserPageWrapper>
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
            <UserPageWrapper>
              <LotteryGame />
            </UserPageWrapper>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/results" 
        element={
          <ProtectedRoute requireEmailVerified={true} requireAgentVerified={true}>
            <UserPageWrapper>
              <Results />
            </UserPageWrapper>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/offers" 
        element={
          <ProtectedRoute requireEmailVerified={true} requireAgentVerified={true}>
            <UserPageWrapper>
              <Offers />
            </UserPageWrapper>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/exchange-rates" 
        element={
          <ProtectedRoute requireEmailVerified={true} requireAgentVerified={true}>
            <UserPageWrapper>
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
            <UserPageWrapper>
              <LotteryHistory />
            </UserPageWrapper>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/verify-agent" 
        element={
          <ProtectedRoute requireEmailVerified={true}>
            <UserPageWrapper>
              <AgentVerification />
            </UserPageWrapper>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/transaction-info/:txnId" 
        element={
          <ProtectedRoute requireEmailVerified={true} requireAgentVerified={true}>
            <UserPageWrapper>
              <TransactionInfo />
            </UserPageWrapper>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/ticket-info/:ticketId" 
        element={
          <ProtectedRoute requireEmailVerified={true} requireAgentVerified={true}>
            <UserPageWrapper>
              <LotteryTicketInfo />
            </UserPageWrapper>
          </ProtectedRoute>
        } 
      />



      {/* Placeholder Routes - Consolidated */}
      <Route 
        path="/agent-registration" 
        element={
          <ProtectedRoute requireEmailVerified={true}>
            <UserPageWrapper>
              <PlaceholderPage title="Agent Registration" />
            </UserPageWrapper>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/profile-settings" 
        element={
          <ProtectedRoute requireEmailVerified={true} requireAgentVerified={true}>
            <UserPageWrapper>
              <ProfileSettings />
            </UserPageWrapper>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/game-options" 
        element={
          <ProtectedRoute requireEmailVerified={true} requireAgentVerified={true}>
            <UserPageWrapper>
              <PlaceholderPage title="Game Options" />
            </UserPageWrapper>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/play-lottery/:lotteryGameType" 
        element={
          <ProtectedRoute requireEmailVerified={true} requireAgentVerified={true}>
            <UserPageWrapper>
              <PlaceholderPage title="Play Lottery" />
            </UserPageWrapper>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/buy-lottery-ticket" 
        element={
          <ProtectedRoute requireEmailVerified={true} requireAgentVerified={true}>
            <UserPageWrapper>
              <PlaceholderPage title="Buy Lottery Ticket" />
            </UserPageWrapper>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/transactions/:userId" 
        element={
          <ProtectedRoute requireEmailVerified={true} requireAgentVerified={true}>
            <UserPageWrapper>
              <PlaceholderPage title="Transactions" />
            </UserPageWrapper>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/referrals/:userId" 
        element={
          <ProtectedRoute requireEmailVerified={true} requireAgentVerified={true}>
            <UserPageWrapper>
              <PlaceholderPage title="Referrals" />
            </UserPageWrapper>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/wallet/:userId" 
        element={
          <ProtectedRoute requireEmailVerified={true} requireAgentVerified={true}>
            <UserPageWrapper>
              <WalletHistory />
            </UserPageWrapper>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/lottery-results" 
        element={
          <ProtectedRoute requireEmailVerified={true} requireAgentVerified={true}>
            <UserPageWrapper>
              <PlaceholderPage title="Lottery Results" />
            </UserPageWrapper>
          </ProtectedRoute>
        } 
      />



      {/* Test Notifications Route */}
      <Route path="/test-notifications" element={<UserPageWrapper><TestNotifications /></UserPageWrapper>} />

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes; 
