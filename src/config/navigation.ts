import {
  Dashboard,
  People,
  Settings,
  Receipt,
  Casino,
  Security,
  Notifications,
  Logout,
  Home,
  LocalOffer,
  AccountCircle,
  Payment,
  History,
  Assessment,
  Storage,
  Build,
  Monitor,
  Feedback,
  PhotoLibrary,
  AccountBalance,
  Search,
  Business,
  Support,
  EmojiEvents,
  Help,
  Info,
  ContactSupport,
  TrendingUp,
  Wallet,
  CreditCard,
  Gamepad,
  Timeline,
  Analytics,
  AdminPanelSettings,
  Assignment,
  MonetizationOn,
  BugReport,
  SystemUpdate,
  Backup,
  PersonAdd,
  Money,
} from '@mui/icons-material';

// User Roles
export const USER_ROLES = {
  SUPER_ADMIN: 1,
  ADMIN: 2,
  USER: 3,
  AGENT: 4,
  STAFF: 5,
} as const;

// Navigation Menu Items Configuration
export const NAVIGATION_CONFIG = {
  // Public Navigation (Header)
  public: [
    { title: 'Home', path: '/', icon: 'Home' },
    { title: 'Prizes', path: '/prizes', icon: 'EmojiEvents' },
    { title: 'Results', path: '/results', icon: 'Assessment' },
    { title: 'How to Play', path: '/how-to-play', icon: 'Help' },
    { title: 'About Us', path: '/about', icon: 'Info' },
    { title: 'Contact Us', path: '/contact', icon: 'ContactSupport' },
    { title: 'Help', path: '/help', icon: 'Support' },
  ],

  // User Dashboard Navigation
  user: [
    { title: 'My Profile', path: '/dashboard', icon: 'Dashboard' },
    { title: 'Profile', path: '/profile', icon: 'AccountCircle' },
    { title: 'Wallet', path: '/wallet', icon: 'Wallet' },
    { title: 'Recharge', path: '/recharge', icon: 'Payment' },
    { title: 'Withdraw', path: '/withdraw', icon: 'Money' },
    { title: 'Bank Cards', path: '/bank-cards', icon: 'CreditCard' },
    { title: 'Play Lottery', path: '/lottery-game', icon: 'Gamepad' },
    { title: 'Game History', path: '/lottery-history', icon: 'History' },
    { title: 'Results', path: '/results', icon: 'Assessment' },
    { title: 'Offers', path: '/offers', icon: 'LocalOffer' },
    { title: 'Exchange Rates', path: '/exchange-rates', icon: 'TrendingUp' },
    { title: 'Change Password', path: '/change-password', icon: 'Security' },
  ],

  // Agent Navigation
  agent: [
    { title: 'My Profile', path: '/dashboard', icon: 'Dashboard' },
    { title: 'Profile', path: '/profile', icon: 'AccountCircle' },
    { title: 'Wallet', path: '/wallet', icon: 'Wallet' },
    { title: 'Recharge', path: '/recharge', icon: 'Payment' },
    { title: 'Withdraw', path: '/withdraw', icon: 'Money' },
    { title: 'Bank Cards', path: '/bank-cards', icon: 'CreditCard' },
    { title: 'Play Lottery', path: '/lottery-game', icon: 'Gamepad' },
    { title: 'Game History', path: '/lottery-history', icon: 'History' },
    { title: 'Results', path: '/results', icon: 'Assessment' },
    { title: 'Offers', path: '/offers', icon: 'LocalOffer' },
    { title: 'Exchange Rates', path: '/exchange-rates', icon: 'TrendingUp' },
    { title: 'Change Password', path: '/change-password', icon: 'Security' },
    // Agent-specific features
    { title: 'Agent Dashboard', path: '/agent/dashboard', icon: 'Business' },
    { title: 'My Referrals', path: '/agent/referrals', icon: 'People' },
    { title: 'Commission', path: '/agent/commission', icon: 'MonetizationOn' },
  ],

  // Staff Navigation
  staff: [
    { title: 'My Profile', path: '/dashboard', icon: 'Dashboard' },
    { title: 'Profile', path: '/profile', icon: 'AccountCircle' },
    { title: 'Wallet', path: '/wallet', icon: 'Wallet' },
    { title: 'Recharge', path: '/recharge', icon: 'Payment' },
    { title: 'Withdraw', path: '/withdraw', icon: 'Money' },
    { title: 'Bank Cards', path: '/bank-cards', icon: 'CreditCard' },
    { title: 'Play Lottery', path: '/lottery-game', icon: 'Gamepad' },
    { title: 'Game History', path: '/lottery-history', icon: 'History' },
    { title: 'Results', path: '/results', icon: 'Assessment' },
    { title: 'Offers', path: '/offers', icon: 'LocalOffer' },
    { title: 'Exchange Rates', path: '/exchange-rates', icon: 'TrendingUp' },
    { title: 'Change Password', path: '/change-password', icon: 'Security' },
    // Staff-specific features
    { title: 'Staff Dashboard', path: '/staff/dashboard', icon: 'Assignment' },
    { title: 'User Support', path: '/staff/support', icon: 'Support' },
    { title: 'Basic Reports', path: '/staff/reports', icon: 'Assessment' },
  ],

  // Admin Navigation
  admin: [
    // Dashboard & Overview
    { title: 'Dashboard', path: '/admin/dashboard', icon: 'Dashboard' },
    { title: 'Analytics', path: '/admin/analytics', icon: 'Analytics' },
    { title: 'System Monitor', path: '/admin/system-monitor', icon: 'Monitor' },
    
    // User Management
    { title: 'Users Management', path: '/admin/users', icon: 'People' },
    { title: 'Application Agents', path: '/admin/application-agents', icon: 'PersonAdd' },
    { title: 'User Support', path: '/admin/user-support', icon: 'Support' },
    
    // Financial Management
    { title: 'Transaction Management', path: '/admin/transaction-management', icon: 'Receipt' },
    { title: 'Search Transactions', path: '/admin/search-transactions', icon: 'Search' },
    { title: 'Bank Details', path: '/admin/bank-details', icon: 'AccountBalance' },
    { title: 'Recharge Management', path: '/admin/recharge-management', icon: 'Payment' },
    { title: 'Withdrawal Management', path: '/admin/withdrawal-management', icon: 'Money' },
    
    // Game Management (Admin can view but not play)
    { title: 'Lottery Settings', path: '/admin/lottery-settings', icon: 'Casino' },
    { title: 'Game Settings', path: '/admin/game-settings', icon: 'Settings' },
    { title: 'Lottery Results', path: '/admin/lottery-results', icon: 'Assessment' },
    
    // Content Management
    { title: 'Offers Management', path: '/admin/offers', icon: 'LocalOffer' },
    { title: 'Media Management', path: '/admin/media', icon: 'PhotoLibrary' },
    { title: 'Feedbacks', path: '/admin/feedbacks', icon: 'Feedback' },
    
    // System Management
    { title: 'Application Logs', path: '/admin/application-logs', icon: 'BugReport' },
    { title: 'Database History', path: '/admin/database-history', icon: 'Storage' },
    { title: 'System Settings', path: '/admin/system-settings', icon: 'Build' },
  ],

  // Super Admin Navigation (includes all admin features plus advanced ones)
  superAdmin: [
    // Dashboard & Overview
    { title: 'Dashboard', path: '/admin/dashboard', icon: 'Dashboard' },
    { title: 'Analytics', path: '/admin/analytics', icon: 'Analytics' },
    { title: 'System Monitor', path: '/admin/system-monitor', icon: 'Monitor' },
    
    // User Management
    { title: 'Users Management', path: '/admin/users', icon: 'People' },
    { title: 'Application Agents', path: '/admin/application-agents', icon: 'PersonAdd' },
    { title: 'User Support', path: '/admin/user-support', icon: 'Support' },
    { title: 'Admin Management', path: '/admin/admin-management', icon: 'AdminPanelSettings' },
    
    // Financial Management
    { title: 'Transaction Management', path: '/admin/transaction-management', icon: 'Receipt' },
    { title: 'Search Transactions', path: '/admin/search-transactions', icon: 'Search' },
    { title: 'Bank Details', path: '/admin/bank-details', icon: 'AccountBalance' },
    { title: 'Recharge Management', path: '/admin/recharge-management', icon: 'Payment' },
    { title: 'Withdrawal Management', path: '/admin/withdrawal-management', icon: 'Money' },
    { title: 'Financial Reports', path: '/admin/financial-reports', icon: 'Assessment' },
    
    // Game Management
    { title: 'Lottery Settings', path: '/admin/lottery-settings', icon: 'Casino' },
    { title: 'Game Settings', path: '/admin/game-settings', icon: 'Settings' },
    { title: 'Lottery Results', path: '/admin/lottery-results', icon: 'Assessment' },
    { title: 'Lottery Plays', path: '/admin/lottery-plays', icon: 'Gamepad' },
    { title: 'Game Permissions', path: '/admin/game-permissions', icon: 'Security' },
    
    // Content Management
    { title: 'Offers Management', path: '/admin/offers', icon: 'LocalOffer' },
    { title: 'Media Management', path: '/admin/media', icon: 'PhotoLibrary' },
    { title: 'Feedbacks', path: '/admin/feedbacks', icon: 'Feedback' },
    
    // Advanced System Management
    { title: 'Application Logs', path: '/admin/application-logs', icon: 'BugReport' },
    { title: 'Database History', path: '/admin/database-history', icon: 'Storage' },
    { title: 'System Settings', path: '/admin/system-settings', icon: 'Build' },
    { title: 'Backup & Restore', path: '/admin/backup-restore', icon: 'Backup' },
    { title: 'System Updates', path: '/admin/system-updates', icon: 'SystemUpdate' },
    { title: 'API Management', path: '/admin/api-management', icon: 'Build' },
    { title: 'Security Settings', path: '/admin/security-settings', icon: 'Security' },
    { title: 'Audit Trail', path: '/admin/audit-trail', icon: 'Timeline' },
  ],
};

// Icon mapping for dynamic icon rendering
export const ICON_MAP = {
  Dashboard,
  People,
  Settings,
  Receipt,
  Casino,
  Security,
  Notifications,
  Logout,
  Home,
  LocalOffer,
  AccountCircle,
  Payment,
  History,
  Assessment,
  Storage,
  Build,
  Monitor,
  Feedback,
  PhotoLibrary,
  AccountBalance,
  Search,
  Business,
  Support,
  EmojiEvents,
  Help,
  Info,
  ContactSupport,
  TrendingUp,
  Wallet,
  CreditCard,
  Gamepad,
  Timeline,
  Analytics,
  AdminPanelSettings,
  Assignment,
  MonetizationOn,
  BugReport,
  SystemUpdate,
  Backup,
  PersonAdd,
  Money,
} as const;

// Helper function to get navigation items based on user role
export const getNavigationItems = (userRole: number) => {
  switch (userRole) {
    case USER_ROLES.SUPER_ADMIN:
      return NAVIGATION_CONFIG.superAdmin;
    case USER_ROLES.ADMIN:
      return NAVIGATION_CONFIG.admin;
    case USER_ROLES.AGENT:
      return NAVIGATION_CONFIG.agent;
    case USER_ROLES.STAFF:
      return NAVIGATION_CONFIG.staff;
    case USER_ROLES.USER:
    default:
      return NAVIGATION_CONFIG.user;
  }
};

// Helper function to get public navigation
export const getPublicNavigation = () => {
  return NAVIGATION_CONFIG.public;
};

// Helper function to check if user has access to a specific route
export const hasRouteAccess = (userRole: number, route: string) => {
  // Admin users cannot access lottery play and game history routes
  if (userRole === USER_ROLES.ADMIN) {
    const restrictedRoutes = [
      '/lottery-game',
      '/lottery-history',
      '/admin/lottery-plays',
      '/play-lottery',
      '/game-history'
    ];
    if (restrictedRoutes.includes(route)) {
      return false;
    }
  }

  const navigationItems = getNavigationItems(userRole);
  return navigationItems.some(item => item.path === route);
};

// Helper function to get user role display name
export const getUserRoleDisplayName = (userRole: number) => {
  switch (userRole) {
    case USER_ROLES.SUPER_ADMIN:
      return 'Super Admin';
    case USER_ROLES.ADMIN:
      return 'Admin';
    case USER_ROLES.AGENT:
      return 'Agent';
    case USER_ROLES.STAFF:
      return 'Staff';
    case USER_ROLES.USER:
    default:
      return 'User';
  }
};

// Helper function to get user role color
export const getUserRoleColor = (userRole: number) => {
  switch (userRole) {
    case USER_ROLES.SUPER_ADMIN:
      return 'error';
    case USER_ROLES.ADMIN:
      return 'warning';
    case USER_ROLES.AGENT:
      return 'info';
    case USER_ROLES.STAFF:
      return 'secondary';
    case USER_ROLES.USER:
    default:
      return 'default';
  }
}; 