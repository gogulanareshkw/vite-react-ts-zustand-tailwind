export const API_URL = 'http://localhost:3002/api';
export const APP_KEY = '68c1b935-1c1f-4c10-b16b-3fd6e3cba270';

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