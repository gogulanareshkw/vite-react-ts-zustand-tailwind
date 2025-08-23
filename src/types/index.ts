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
  isAvailableLotteryGame: boolean;
  showGameWinnersListScroll?: boolean;
  showGameWinnersList?: boolean;
  showGameResults?: boolean;
  showGameHistory?: boolean;
  enableLastDayDiscounts?: boolean;
  isAvailableSingleDigitGame?: boolean;
  isAvailableGameTotal?: boolean;
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

// Extended Bank Card interface for the component usage
export interface ExtendedBankCard {
  _id: string;
  userId?: string;
  type: 'UPI' | 'BANK';
  upiId?: string;
  phoneNumber: string;
  accountNumber?: string;
  accountHolderName?: string;
  ifscCode?: string;
  isActive?: boolean;
  createdDateTime?: string;
}

// Game Settings
export interface GameSetting {
  _id: string;
  canRecharge: boolean;
  canWithDraw: boolean;
  isDisabledRechargeForm: boolean;
  canDownloadMobileApp: boolean;
  isAvailableGames: boolean;
  bonusAmountByReferralPlayInPercent: number;
  joiningBonus: number;
  minimumRecharge: number;
  maximumRecharge: number;
  minimumWithdraw: number;
  maximumWithdraw: number;
  transactionFeeInPercent: number;
  agentWhatsapp: string;
  agentTelegram: string;
  whatsAppLink: string;
  youtubeLink: string;
  telegramLink: string;
  facebookLink: string;
  instagramLink: string;
  twitterLink: string;
  emailLink: string;
  homePageLotteryUrl: string;
  mobileVersionCode: number;
  mobileVersionName: string;
  mobileApkUrl: string;
  dbDataExistFrom: string;
  blockedLocations: string;
  locationAccessSkipVal: string;
  canClearCollectionFrom: number;
  wishesModelHead: string;
  wishesModelTitle: string;
  wishesModelImageUrl: string;
  isLocationBasedApp: boolean;
  canProceedWithSkipVal: boolean;
  hideSecretInfo: boolean;
  canOpenWishesModel: boolean;
  isThaiLanguage: boolean;
  isAvailableThaiFullTicket: boolean;
  isRequiredMobileData: boolean;
  isRequiredMobileContacts: boolean;
  isRequiredMobileCalls: boolean;
  isRequiredMobileSms: boolean;
  isRequiredLocation: boolean;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: any[];
}

// Bank Cards API Response
export interface BankCardsResponse {
  success: boolean;
  message?: string;
  bankCards?: ExtendedBankCard[];
  errors?: any[];
}

// Specific API Response Types
export interface UserInfoResponse {
  success: boolean;
  userInfo: User;
}

export interface GameSettingsResponse {
  success: boolean;
  gameSettings: GameSetting;
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
  
  // User Data
  userBankCards: ExtendedBankCard[];
  
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