// User Types
export interface User {
  _id: string;
  userId: string;
  appId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  gender?: string;
  userRole: number;
  isEmailVerified: boolean;
  isAgentVerified: boolean;
  isChangedDefaultPassword: boolean;
  activeStatus: boolean;
  blockedByAdmin: boolean;
  allowedSpecialDiscount: boolean;
  availableAmount?: number;
  referralCount?: number;
  address?: Address;
  createdDateTime: string;
  updatedDateTime: string;
}

export interface Address {
  latitude?: string;
  longitude?: string;
  city?: string;
  state?: string;
  country?: string;
  formattedAddress?: string;
}

// Auth Types
export interface AuthResponse {
  success: boolean;
  token: string;
  tokenExpiration: number;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
  referredBy?: string;
  latitude?: number;
  longitude?: number;
}

export interface AgentSignUpRequest extends SignUpRequest {
  firstName: string;
  lastName: string;
  gender: string;
}

// Lottery Game Types
export interface LotteryNumber {
  number: string;
  straight: number;
  rumble: number;
}

export interface LotteryGamePlay {
  _id: string;
  lotteryGameType: number;
  userId: string;
  numbers: LotteryNumber[];
  played_at: string;
  playedAmount: number;
  discount: number;
  paidAmount: number;
  isOriginalTicket: boolean;
  playingGameType: string;
  gameNumber: string;
  ticketNumber: string;
  user?: User;
}

export interface LotteryGameSetting {
  _id: string;
  lotteryGameType: number;
  gameStopHour: string;
  gameDiscountStopHour: string;
  minimumAmountForPlay: number;
  maximumAmountForPlay: number;
  isGameRunning: boolean;
  lotteryGameDrawDates?: string;
}

export interface LotteryGamePermission {
  _id: string;
  lotteryGameType: number;
  canPlayLotteryGame: boolean;
  showGameWinnersListScroll: boolean;
  showGameWinnersList: boolean;
  showGameResults: boolean;
  showGameHistory: boolean;
}

export interface LotteryGameBoard {
  _id: string;
  lotteryGameType: number;
  gameNumber: string;
  drawDate: string;
  isActive: boolean;
  isCompleted: boolean;
}

export interface LotteryGameResult {
  _id: string;
  lotteryGameType: number;
  gameNumber: string;
  result: string;
  drawDate: string;
  winners: {
    details: WinnerDetail[];
  };
}

export interface WinnerDetail {
  _id: string;
  ticketNumber: string;
  grossWinningAmount: number;
  finalWinningAmount: number;
  commission: number;
}

// Game Play Request
export interface PlayLotteryGameRequest {
  lotteryGameType: number;
  playingGameType: string;
  gameNumber: string;
  numbers: LotteryNumber[];
  playedAmount: number;
  isOriginalTicket: boolean;
}

// Financial Types
export interface Recharge {
  _id: string;
  userId: string;
  amount: number;
  paymentMethod: string;
  status: string;
  transactionId?: string;
  createdDateTime: string;
  user?: User;
}

export interface Withdraw {
  _id: string;
  userId: string;
  amount: number;
  bankCardId: string;
  status: string;
  createdDateTime: string;
  user?: User;
  bankCard?: BankCard;
}

export interface BankCard {
  _id: string;
  userId: string;
  cardType: string;
  cardNumber: string;
  cardHolderName: string;
  bankName: string;
  ifscCode: string;
  accountNumber: string;
  isDefault: boolean;
  createdDateTime: string;
}

// Game Settings
export interface GameSetting {
  _id: string;
  isServerDown: boolean;
  isLocationBasedApp: boolean;
  agentWhatsapp?: string;
  superAdmins?: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: any[];
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

// Store Types
export interface AppState {
  // Auth
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Game Data
  gameSettings: GameSetting | null;
  lotteryGameSettings: LotteryGameSetting[];
  lotteryGamePermissions: LotteryGamePermission[];
  lotteryGameBoards: LotteryGameBoard[];
  lotteryGameResults: LotteryGameResult[];
  
  // User Data
  userGameHistory: LotteryGamePlay[];
  userRecharges: Recharge[];
  userWithdrawals: Withdraw[];
  userBankCards: BankCard[];
  
  // UI State
  notifications: Notification[];
  modals: ModalState;
}

export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

export interface ModalState {
  isOpen: boolean;
  type: string;
  data?: any;
} 