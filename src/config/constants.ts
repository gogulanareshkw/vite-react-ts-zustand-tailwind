// Environment-based API configuration
const isDevelopment = import.meta.env.DEV;
const isProduction = import.meta.env.PROD;

// API Configuration
export const API_URL = isDevelopment 
  ? 'http://localhost:3001/api'
  : 'https://a2zlotto.com/api';

export const APP_KEY = isDevelopment
  ? '68c1b935-1c1f-4c10-b16b-3fd6e3cba270'  // Development app key
  : 'f58eae17-4345-47e4-bfd2-2e6fc64240be'; // Production app key

// App Configuration
export const APP_CONFIG = {
  name: 'A2ZLotto',
  version: '1.0.0',
  description: 'A2ZLotto - Premium Lottery Gaming Platform',
  supportEmail: 'support@a2zlotto.com',
  adminEmail: 'admin@a2zlotto.com',
} as const;

// User Roles
export const USER_ROLES = {
  SUPER: 1,
  ADMIN: 2,
  USER: 3,
  AGENT: 4,
  STAFF: 5,
} as const;

// Lottery Game Types
export const LOTTERY_GAME_TYPES = {
  THAILAND: 1,
  BANGKOK_WEEKLY: 2,
  DUBAI_DAILY: 3,
  LONDON_WEEKLY: 4,
  MEXICO_MONTHLY: 5,
} as const;

// Game Play Types
export const GAME_PLAY_TYPES = {
  FIRST_PRIZE: 'FirstPrize',
  THREE_UP: 'ThreeUp',
  TWO_UP: 'TwoUp',
  TWO_DOWN: 'TwoDown',
  THREE_UP_SINGLE: 'ThreeUpSingle',
  TWO_UP_SINGLE: 'TwoUpSingle',
  TWO_DOWN_SINGLE: 'TwoDownSingle',
  THREE_UP_TOTAL: 'ThreeUpTotal',
  TWO_UP_TOTAL: 'TwoUpTotal',
  TWO_DOWN_TOTAL: 'TwoDownTotal',
} as const;

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  DECLINED: 'DECLINED',
} as const;

// Feedback Types
export const FEEDBACK_TYPES = {
  GENERAL: 'GENERAL',
  COMPLAINT: 'COMPLAINT',
  COMPLIMENT: 'COMPLIMENT',
  SUGGESTION: 'SUGGESTION',
  HELP: 'HELP',
} as const;

// Environment Configuration
export const ENV_CONFIG = {
  isDevelopment,
  isProduction,
  isLocalhost: window.location.hostname === 'localhost',
  isStaging: window.location.hostname.includes('staging'),
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/user/public/login',
  SIGNUP: '/user/public/create',
  AGENT_SIGNUP: '/user/public/createAgent',
  VERIFY_EMAIL: '/user/verifyEmailOtp',
  FORGOT_PASSWORD: '/user/public/forgotPassword',
  RESET_PASSWORD: '/user/public/resetPassword',
  CHANGE_PASSWORD: '/user/changePassword',
  GET_USER_INFO: '/user/getUserInfo',
  UPDATE_PROFILE: '/user/updateProfile',
  
  // Game Settings
  GAME_SETTINGS: '/gameSettings/getBasicGameSettings',
  LOTTERY_SETTINGS: '/lotteryGameSetting/getAllLotteryGameSettings',
  LOTTERY_PERMISSIONS: '/lotteryGamePermission/public',
  LOTTERY_BOARDS: '/lotteryGameBoard/public/all',
  LOTTERY_RESULTS: '/lotteryGameResultSummery/public/lastGameWinners',
  
  // Game Play
  PLAY_LOTTERY: '/lotteryGamePlay/playLotteryGame',
  GAME_HISTORY: '/lotteryGamePlay/getlotteryGamePlayShotsHistorybyUserID',
  
  // Financial
  CREATE_RECHARGE: '/recharge/createRecharge',
  USER_RECHARGES: '/recharge/getUserRechargeHistory',
  CREATE_WITHDRAW: '/withdraw/createWithdraw',
  USER_WITHDRAWALS: '/withdraw/getUserWithdrawHistory',
  CREATE_BANK_CARD: '/bankCard/createBankCard',
  USER_BANK_CARDS: '/bankCard/getUserBankCards',
  DELETE_BANK_CARD: '/bankCard/deleteBankCard',
  
  // Admin
  ALL_USERS: '/user/getAllUsers',
  USER_BY_ID: '/user',
  UPDATE_USER_STATUS: '/user/updateUserStatus',
  BLOCK_USER: '/user/blockUserByAdmin',
  DEDUCT_USER_MONEY: '/user/deductUserMoney',
  RECHARGE_USER_MONEY: '/user/rechargeUserMoney',
  
  // Transactions
  ALL_TRANSACTIONS: '/transaction/getAllTransactions',
  TRANSACTION_BY_ID: '/transaction/getTransactionById',
  UPDATE_TRANSACTION_STATUS: '/transaction/updateTransactionStatus',
  
  // Lottery Plays
  ALL_LOTTERY_PLAYS: '/lotteryGamePlay/getAllLotteryPlays',
  LOTTERY_PLAY_BY_ID: '/lotteryGamePlay/getLotteryPlayById',
  
  // Content
  CREATE_FEEDBACK: '/feedback/createFeedback',
  ALL_FEEDBACKS: '/feedback/getAllFeedbacks',
  ALL_OFFERS: '/offer/public',
  ALL_HELP_LINKS: '/helpLink/public',
  
  // Media
  UPLOAD_MEDIA: '/media/uploadMedia',
  ALL_MEDIA: '/media/getAllMedia',
  DELETE_MEDIA: '/media/deleteMedia',
  
  // Application Agents
  CREATE_APPLICATION_AGENT: '/applicationAgent/createApplicationAgent',
  ALL_APPLICATION_AGENTS: '/applicationAgent/getAllApplicationAgents',
  UPDATE_AGENT_STATUS: '/applicationAgent/updateApplicationAgentStatus',
  
  // Mobile Data
  USER_MOBILE_DATA: '/mobileData/getUserMobileData',
  ALL_MOBILE_DATA_USERS: '/mobileData/getAllMobileDataUsers',
  
  // System
  EXCHANGE_RATES: '/currency/public',
  UPDATE_GAME_SETTINGS: '/gameSettings/updateGameSettings',
  UPDATE_LOTTERY_SETTING: '/lotteryGameSetting/updateLotteryGameSetting',
  UPDATE_LOTTERY_PERMISSION: '/lotteryGamePermission/updateLotteryGamePermission',
  APPLICATION_LOGS: '/applicationLog/getApplicationLogs',
  DELETE_APPLICATION_LOGS: '/applicationLog/deleteApplicationLogs',
  DATABASE_HISTORY: '/dbHistory/getDatabaseHistory',
  CLEANUP_COLLECTION: '/dbHistory/cleanupCollection',
  COLLECTION_COUNT: '/dbHistory/getCollectionCount',
  INITIALIZE_LOTTERY_SETTINGS: '/lotteryGameSetting/initializeLotterySettings',
  INITIALIZE_LOTTERY_PERMISSIONS: '/lotteryGamePermission/initializeLotteryPermissions',
  SYSTEM_STATUS: '/system/status',
  CRON_JOBS: '/system/cronJobs',
  WALLET_HISTORY: '/wallet/getWalletHistory',
  USER_WALLET_HISTORY: '/wallet/getUserWalletHistory',
  USER_TRANSACTIONS_HISTORY: '/transaction/getUserTransactionsHistory',
  MY_REFERRALS_HISTORY: '/referral/getMyReferralsHistory',
} as const;

// Cache Configuration
export const CACHE_CONFIG = {
  // Cache TTL in milliseconds
  USER_INFO: 2 * 60 * 1000,        // 2 minutes
  GAME_SETTINGS: 10 * 60 * 1000,   // 10 minutes
  LOTTERY_SETTINGS: 5 * 60 * 1000, // 5 minutes
  LOTTERY_RESULTS: 1 * 60 * 1000,  // 1 minute
  EXCHANGE_RATES: 30 * 60 * 1000,  // 30 minutes
  OFFERS: 10 * 60 * 1000,          // 10 minutes
  HELP_LINKS: 30 * 60 * 1000,      // 30 minutes
  TRANSACTIONS: 2 * 60 * 1000,     // 2 minutes
  MEDIA: 5 * 60 * 1000,            // 5 minutes
} as const;

// Retry Configuration
export const RETRY_CONFIG = {
  DEFAULT_RETRIES: 3,
  DEFAULT_DELAY: 1000,
  MAX_DELAY: 10000,
} as const;

// Polling Configuration
export const POLLING_CONFIG = {
  LOTTERY_RESULTS: 30000,  // 30 seconds
  SYSTEM_STATUS: 60000,    // 1 minute
  USER_BALANCE: 30000,     // 30 seconds
} as const; 