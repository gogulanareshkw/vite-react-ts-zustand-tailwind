import axios from 'axios';
import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { 
  API_URL, 
  APP_KEY, 
  API_ENDPOINTS, 
  RETRY_CONFIG, 
  POLLING_CONFIG,
  ENV_CONFIG 
} from '../config/constants';
import type { 
  AuthResponse, 
  LoginRequest, 
  SignUpRequest, 
  AgentSignUpRequest,
  ApiResponse,
  PaginatedResponse,
  User,
  LotteryGamePlay,
  LotteryGameSetting,
  LotteryGamePermission,
  LotteryGameBoard,
  LotteryGameResult,
  Recharge,
  Withdraw,
  BankCard,
  GameSetting,
  PlayLotteryGameRequest,
  UserInfoResponse,
  GameSettingsResponse
} from '../types';

// Extend axios config to include metadata
interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  metadata?: {
    startTime: Date;
    showErrorNotification?: boolean;
  };
}

// Retry configuration
interface RetryConfig {
  retries: number;
  retryDelay: number;
  retryCondition: (error: any) => boolean;
}

class ApiService {
  private api: AxiosInstance;
  private defaultRetryConfig: RetryConfig = {
    retries: RETRY_CONFIG.DEFAULT_RETRIES,
    retryDelay: RETRY_CONFIG.DEFAULT_DELAY,
    retryCondition: (error) => {
      return error.response?.status >= 500 || error.code === 'NETWORK_ERROR';
    }
  };
  private notificationCallback?: (message: string, type: 'success' | 'error' | 'warning' | 'info', duration?: number) => void;

  constructor() {
    this.api = axios.create({
      baseURL: API_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.api.interceptors.request.use(
      (config: ExtendedAxiosRequestConfig) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        
        // Add request timestamp for caching
        config.metadata = { 
          startTime: new Date(),
          showErrorNotification: true // Default to showing error notifications
        };
        
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => {
        // Log response time
        const endTime = new Date();
        const startTime = (response.config as ExtendedAxiosRequestConfig).metadata?.startTime;
        if (startTime) {
          const duration = endTime.getTime() - startTime.getTime();
          if (ENV_CONFIG.isDevelopment) {
            console.log(`API Request to ${response.config.url} took ${duration}ms`);
          }
        }
        return response;
      },
      (error) => {
        // Handle authentication errors - but don't redirect if already on login page
        if (error.response?.status === 401) {
          const currentPath = window.location.pathname;
          const isAuthEndpoint = error.config?.url?.includes('/login') || 
                                error.config?.url?.includes('/signup') || 
                                error.config?.url?.includes('/verify-email') ||
                                error.config?.url?.includes('/forgot-password') ||
                                error.config?.url?.includes('/reset-password');
          
          // Only redirect if not already on login page and not an auth endpoint
          if (currentPath !== '/login' && !isAuthEndpoint) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
          }
        }

        // Show error notification if enabled
        const config = error.config as ExtendedAxiosRequestConfig;
        if (config?.metadata?.showErrorNotification !== false) {
          this.showErrorNotification(error);
        }

        return Promise.reject(error);
      }
    );
  }

  // Set notification callback from store
  setNotificationCallback(callback: (message: string, type: 'success' | 'error' | 'warning' | 'info', duration?: number) => void) {
    this.notificationCallback = callback;
  }

  // Show error notification
  private showErrorNotification(error: any) {
    if (this.notificationCallback) {
      const errorMessage = this.handleError(error);
      this.notificationCallback(errorMessage, 'error', 6000);
    }
  }

  // Show success notification
  private showSuccessNotification(message: string, duration = 4000) {
    if (this.notificationCallback) {
      this.notificationCallback(message, 'success', duration);
    }
  }

  // Show warning notification
  private showWarningNotification(message: string, duration = 5000) {
    if (this.notificationCallback) {
      this.notificationCallback(message, 'warning', duration);
    }
  }

  // Show info notification
  private showInfoNotification(message: string, duration = 4000) {
    if (this.notificationCallback) {
      this.notificationCallback(message, 'info', duration);
    }
  }

  // Retry logic
  private async retryRequest<T>(
    requestFn: () => Promise<T>,
    config: Partial<RetryConfig> = {}
  ): Promise<T> {
    const retryConfig = { ...this.defaultRetryConfig, ...config };
    let lastError: any;

    for (let attempt = 0; attempt <= retryConfig.retries; attempt++) {
      try {
        return await requestFn();
      } catch (error) {
        lastError = error;
        
        if (attempt === retryConfig.retries || !retryConfig.retryCondition(error)) {
          throw error;
        }
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, retryConfig.retryDelay * (attempt + 1)));
      }
    }
    
    throw lastError;
  }

  // Enhanced request method
  private async enhancedRequest<T>(
    method: 'get' | 'post' | 'put' | 'delete',
    url: string,
    data?: any,
    options: {
      params?: any;
    } = {}
  ): Promise<T> {
    const response = await this.api[method](url, data, { params: options.params });
    return response.data;
  }

  // Real-time updates using polling
  private pollingCallbacks: Map<string, Set<(data: any) => void>> = new Map();
  private pollingIntervals: Map<string, number> = new Map();

  startPolling<T>(
    key: string,
    requestFn: () => Promise<T>,
    interval: number = 5000,
    callback: (data: T) => void
  ): () => void {
    if (!this.pollingCallbacks.has(key)) {
      this.pollingCallbacks.set(key, new Set());
    }
    this.pollingCallbacks.get(key)!.add(callback);

    if (!this.pollingIntervals.has(key)) {
      const intervalId = setInterval(async () => {
        try {
          const data = await requestFn();
          this.pollingCallbacks.get(key)?.forEach(cb => cb(data));
        } catch (error) {
          console.error(`Polling error for ${key}:`, error);
        }
      }, interval);
      this.pollingIntervals.set(key, intervalId);
    }

    // Return stop function
    return () => {
      const callbacks = this.pollingCallbacks.get(key);
      if (callbacks) {
        callbacks.delete(callback);
        if (callbacks.size === 0) {
          this.pollingCallbacks.delete(key);
          const intervalId = this.pollingIntervals.get(key);
          if (intervalId) {
            clearInterval(intervalId);
            this.pollingIntervals.delete(key);
          }
        }
      }
    };
  }

  // Batch requests
  async batchRequests<T>(requests: Array<() => Promise<T>>): Promise<T[]> {
    return Promise.all(requests.map(req => req()));
  }

  // Helper function to append appkey to URLs
  private appendAppKey(url: string): string {
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}appkey=${APP_KEY}`;
  }

  // Auth APIs
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await this.enhancedRequest<AuthResponse>('post', this.appendAppKey(API_ENDPOINTS.LOGIN), data);
    return response;
  }

  async signUp(data: SignUpRequest): Promise<AuthResponse> {
    const response = await this.enhancedRequest<AuthResponse>('post', this.appendAppKey(API_ENDPOINTS.SIGNUP), data);
    return response;
  }

  async agentSignUp(data: AgentSignUpRequest): Promise<AuthResponse> {
    const response = await this.enhancedRequest<AuthResponse>('post', this.appendAppKey(API_ENDPOINTS.AGENT_SIGNUP), data);
    return response;
  }

  async verifyEmail(OTP: string): Promise<ApiResponse<User>> {
    const response = await this.enhancedRequest<ApiResponse<User>>('post', API_ENDPOINTS.VERIFY_EMAIL, { OTP });
    return response;
  }

  async sendActivationMail(): Promise<ApiResponse> {
    const response = await this.enhancedRequest<ApiResponse>('get', API_ENDPOINTS.SEND_ACTIVATION_MAIL);
    return response;
  }

  async forgotPassword(email: string): Promise<ApiResponse<{ userId: string }>> {
    const response = await this.enhancedRequest<ApiResponse<{ userId: string }>>('post', this.appendAppKey(API_ENDPOINTS.FORGOT_PASSWORD), { email });
    return response;
  }

  async resetPassword(userId: string, OTP: string, newPassword: string): Promise<ApiResponse> {
    const response = await this.enhancedRequest<ApiResponse>('post', this.appendAppKey(API_ENDPOINTS.RESET_PASSWORD), { userId, OTP, newPassword });
    return response;
  }

  async changePassword(currPassword: string, newPassword: string): Promise<ApiResponse<User>> {
    const response = await this.enhancedRequest<ApiResponse<User>>('post', API_ENDPOINTS.CHANGE_PASSWORD, { currPassword, newPassword });
    return response;
  }

  // User APIs
  async getUserInfo(userId: string): Promise<UserInfoResponse> {
    const endpoint = `${API_ENDPOINTS.USER_BY_ID}/${userId}`;
    return this.enhancedRequest<UserInfoResponse>('get', endpoint);
  }

  async updateUserProfile(data: Partial<User>): Promise<ApiResponse<User>> {
    const response = await this.enhancedRequest<ApiResponse<User>>('put', API_ENDPOINTS.UPDATE_PROFILE, data);
    return response;
  }

  // Game Settings APIs
  async getGameSettings(): Promise<GameSettingsResponse> {
    return this.enhancedRequest<GameSettingsResponse>('get', this.appendAppKey(API_ENDPOINTS.GAME_SETTINGS));
  }

  async getLotteryGameSettings(): Promise<ApiResponse<LotteryGameSetting[]>> {
    return this.enhancedRequest<ApiResponse<LotteryGameSetting[]>>('get', this.appendAppKey(API_ENDPOINTS.LOTTERY_SETTINGS));
  }

  async getLotteryGamePermissions(): Promise<ApiResponse<LotteryGamePermission[]>> {
    return this.enhancedRequest<ApiResponse<LotteryGamePermission[]>>('get', this.appendAppKey(API_ENDPOINTS.LOTTERY_PERMISSIONS));
  }

  async getLotteryGameBoards(): Promise<ApiResponse<LotteryGameBoard[]>> {
    return this.enhancedRequest<ApiResponse<LotteryGameBoard[]>>('get', this.appendAppKey(API_ENDPOINTS.LOTTERY_BOARDS));
  }

  async getLotteryGameResults(lotteryGameType: number): Promise<ApiResponse<LotteryGameResult[]>> {
    return this.enhancedRequest<ApiResponse<LotteryGameResult[]>>('get', this.appendAppKey(API_ENDPOINTS.LOTTERY_RESULTS));
  }

  // Real-time lottery results polling
  startLotteryResultsPolling(callback: (data: LotteryGameResult[]) => void): () => void {
    return this.startPolling(
      'lottery-results',
      () => this.getLotteryGameResults(1),
      POLLING_CONFIG.LOTTERY_RESULTS,
      (response) => callback(response.data || [])
    );
  }

  // Game Play APIs
  async playLotteryGame(data: PlayLotteryGameRequest): Promise<ApiResponse<LotteryGamePlay>> {
    const response = await this.enhancedRequest<ApiResponse<LotteryGamePlay>>('post', API_ENDPOINTS.PLAY_LOTTERY, data);
    return response;
  }

  async getGameHistory(lotteryGameType: number, pageNumber = 1, pageSize = 10): Promise<PaginatedResponse<LotteryGamePlay>> {
    return this.enhancedRequest<PaginatedResponse<LotteryGamePlay>>('get',
      `${API_ENDPOINTS.GAME_HISTORY}/${lotteryGameType}?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
  }

  // Recharge APIs
  async createRecharge(data: Partial<Recharge>): Promise<ApiResponse<Recharge>> {
    const response = await this.enhancedRequest<ApiResponse<Recharge>>('post', API_ENDPOINTS.CREATE_RECHARGE, data);
    return response;
  }

  async getUserRecharges(pageNumber = 1, pageSize = 10): Promise<PaginatedResponse<Recharge>> {
    return this.enhancedRequest<PaginatedResponse<Recharge>>('get',
      `${API_ENDPOINTS.USER_RECHARGES}?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
  }

  // Withdraw APIs
  async createWithdraw(data: Partial<Withdraw>): Promise<ApiResponse<Withdraw>> {
    const response = await this.enhancedRequest<ApiResponse<Withdraw>>('post', API_ENDPOINTS.CREATE_WITHDRAW, data);
    return response;
  }

  async getUserWithdrawals(pageNumber = 1, pageSize = 10): Promise<PaginatedResponse<Withdraw>> {
    return this.enhancedRequest<PaginatedResponse<Withdraw>>('get',
      `${API_ENDPOINTS.USER_WITHDRAWALS}?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
  }

  // Bank Card APIs
  async createBankCard(data: Partial<BankCard>): Promise<ApiResponse<BankCard>> {
    const response = await this.enhancedRequest<ApiResponse<BankCard>>('post', API_ENDPOINTS.CREATE_BANK_CARD, data);
    return response;
  }

  async getUserBankCards(): Promise<ApiResponse<BankCard[]>> {
    return this.enhancedRequest<ApiResponse<BankCard[]>>('get', API_ENDPOINTS.USER_BANK_CARDS);
  }

  async deleteBankCard(bankCardId: string): Promise<ApiResponse> {
    const response = await this.enhancedRequest<ApiResponse>('delete', `${API_ENDPOINTS.DELETE_BANK_CARD}/${bankCardId}`);
    return response;
  }

  async updateBankCard(bankCardId: string, data: Partial<BankCard>): Promise<ApiResponse<BankCard>> {
    const response = await this.enhancedRequest<ApiResponse<BankCard>>('put', `${API_ENDPOINTS.UPDATE_BANK_CARD}/${bankCardId}`, data);
    return response;
  }

  async setDefaultBankCard(bankCardId: string): Promise<ApiResponse> {
    const response = await this.enhancedRequest<ApiResponse>('put', `${API_ENDPOINTS.MAKE_BANK_CARD_ACTIVE}/${bankCardId}/active`, {});
    return response;
  }

  // Admin APIs
  async getAllUsers(pageNumber = 1, pageSize = 10): Promise<PaginatedResponse<User>> {
    return this.enhancedRequest<PaginatedResponse<User>>('get', 
      `${API_ENDPOINTS.ALL_USERS}?pageNumber=${pageNumber}&pageSize=${pageSize}`,
      undefined,
      { params: { retry: { retries: 0, retryDelay: 0 } } }
    );
  }

  async getUserById(userId: string): Promise<ApiResponse<User>> {
    return this.enhancedRequest<ApiResponse<User>>('get', `${API_ENDPOINTS.USER_BY_ID}/${userId}`, undefined, { params: { retry: { retries: 0, retryDelay: 0 } } });
  }

  async updateUserStatus(userId: string, status: boolean): Promise<ApiResponse> {
    const response = await this.enhancedRequest<ApiResponse>('put', `${API_ENDPOINTS.UPDATE_USER_STATUS}/${userId}`, { status });
    // Clear user cache
    return response;
  }

  async blockUserByAdmin(userId: string, blocked: boolean): Promise<ApiResponse> {
    const response = await this.enhancedRequest<ApiResponse>('put', `${API_ENDPOINTS.BLOCK_USER}/${userId}`, { blocked });
    // Clear user cache
    return response;
  }

  async deductUserMoney(userId: string, amount: number): Promise<ApiResponse> {
    const response = await this.enhancedRequest<ApiResponse>('put', `${API_ENDPOINTS.DEDUCT_USER_MONEY}/${userId}`, { amount });
    // Clear user cache
    return response;
  }

  async rechargeUserMoney(userId: string, amount: number): Promise<ApiResponse> {
    const response = await this.enhancedRequest<ApiResponse>('put', `${API_ENDPOINTS.RECHARGE_USER_MONEY}/${userId}`, { amount });
    // Clear user cache
    return response;
  }

  // Transaction APIs
  async getAllTransactions(pageNumber = 1, pageSize = 10): Promise<PaginatedResponse<any>> {
    return this.enhancedRequest<PaginatedResponse<any>>('get', 
      `${API_ENDPOINTS.ALL_TRANSACTIONS}?pageNumber=${pageNumber}&pageSize=${pageSize}`,
      undefined,
      { params: { retry: { retries: 0, retryDelay: 0 } } }
    );
  }

  async getTransactionById(transactionId: string): Promise<ApiResponse<any>> {
    return this.enhancedRequest<ApiResponse<any>>('get', `${API_ENDPOINTS.TRANSACTION_BY_ID}/${transactionId}`, undefined, { params: { retry: { retries: 0, retryDelay: 0 } } });
  }

  async updateTransactionStatus(transactionId: string, status: string): Promise<ApiResponse> {
    const response = await this.enhancedRequest<ApiResponse>('put', `${API_ENDPOINTS.UPDATE_TRANSACTION_STATUS}/${transactionId}`, { status });
    // Clear transaction cache
    return response;
  }

  // Lottery Play APIs
  async getAllLotteryPlays(pageNumber = 1, pageSize = 10): Promise<PaginatedResponse<LotteryGamePlay>> {
    return this.enhancedRequest<PaginatedResponse<LotteryGamePlay>>('get', 
      `${API_ENDPOINTS.ALL_LOTTERY_PLAYS}?pageNumber=${pageNumber}&pageSize=${pageSize}`,
      undefined,
      { params: { retry: { retries: 0, retryDelay: 0 } } }
    );
  }

  async getLotteryPlayById(playId: string): Promise<ApiResponse<LotteryGamePlay>> {
    return this.enhancedRequest<ApiResponse<LotteryGamePlay>>('get', `${API_ENDPOINTS.LOTTERY_PLAY_BY_ID}/${playId}`, undefined, { params: { retry: { retries: 0, retryDelay: 0 } } });
  }

  // Feedback APIs
  async createFeedback(data: { type: string; message: string; rating?: number }): Promise<ApiResponse> {
    const response = await this.enhancedRequest<ApiResponse>('post', API_ENDPOINTS.CREATE_FEEDBACK, data);
    this.showSuccessNotification('Feedback submitted successfully! Thank you for your input.');
    return response;
  }

  async getAllFeedbacks(): Promise<ApiResponse<any[]>> {
    return this.enhancedRequest<ApiResponse<any[]>>('get', API_ENDPOINTS.ALL_FEEDBACKS, undefined, { params: { retry: { retries: 0, retryDelay: 0 } } });
  }

  // Offers and Help APIs
  async getAllOffers(): Promise<ApiResponse<any[]>> {
    return this.enhancedRequest<ApiResponse<any[]>>('get', this.appendAppKey(API_ENDPOINTS.ALL_OFFERS), undefined, { params: { retry: { retries: 0, retryDelay: 0 } } });
  }

  async getAllHelpLinks(): Promise<ApiResponse<any[]>> {
    return this.enhancedRequest<ApiResponse<any[]>>('get', this.appendAppKey(API_ENDPOINTS.ALL_HELP_LINKS), undefined, { params: { retry: { retries: 0, retryDelay: 0 } } });
  }

  // Media APIs
  async uploadMedia(formData: FormData): Promise<ApiResponse<{ url: string }>> {
    const response = await this.enhancedRequest<ApiResponse<{ url: string }>>('post', API_ENDPOINTS.UPLOAD_MEDIA, formData);
    this.showSuccessNotification('Media uploaded successfully!');
    return response;
  }

  async getAllMedia(): Promise<ApiResponse<any[]>> {
    return this.enhancedRequest<ApiResponse<any[]>>('get', API_ENDPOINTS.ALL_MEDIA, undefined, { params: { retry: { retries: 0, retryDelay: 0 } } });
  }

  async deleteMedia(mediaId: string): Promise<ApiResponse> {
    const response = await this.enhancedRequest<ApiResponse>('delete', `${API_ENDPOINTS.DELETE_MEDIA}/${mediaId}`);
    this.showSuccessNotification('Media deleted successfully!');
    return response;
  }

  // Application Agent APIs
  async createApplicationAgent(data: any): Promise<ApiResponse> {
    const response = await this.enhancedRequest<ApiResponse>('post', API_ENDPOINTS.CREATE_APPLICATION_AGENT, data);
    this.showSuccessNotification('Agent application submitted successfully! We will review it shortly.');
    return response;
  }

  async getAllApplicationAgents(pageNumber = 1, pageSize = 10): Promise<PaginatedResponse<any>> {
    return this.enhancedRequest<PaginatedResponse<any>>('get', 
      `${API_ENDPOINTS.ALL_APPLICATION_AGENTS}?pageNumber=${pageNumber}&pageSize=${pageSize}`,
      undefined,
      { params: { retry: { retries: 0, retryDelay: 0 } } }
    );
  }

  async updateApplicationAgentStatus(agentId: string, status: string): Promise<ApiResponse> {
    const response = await this.enhancedRequest<ApiResponse>('put', `${API_ENDPOINTS.UPDATE_AGENT_STATUS}/${agentId}`, { status });
    // Clear agents cache
    return response;
  }

  // Mobile Data APIs
  async storeMobileData(data: any): Promise<ApiResponse> {
    return this.enhancedRequest<ApiResponse>('post', this.appendAppKey(API_ENDPOINTS.USER_MOBILE_DATA), data);
  }

  async getUserMobileData(): Promise<ApiResponse<any>> {
    return this.enhancedRequest<ApiResponse<any>>('get', API_ENDPOINTS.USER_MOBILE_DATA, undefined, { params: { retry: { retries: 0, retryDelay: 0 } } });
  }

  async getAllMobileDataUsers(): Promise<ApiResponse<any[]>> {
    return this.enhancedRequest<ApiResponse<any[]>>('get', API_ENDPOINTS.ALL_MOBILE_DATA_USERS, undefined, { params: { retry: { retries: 0, retryDelay: 0 } } });
  }

  // Exchange Rates API
  async getExchangeRates(): Promise<ApiResponse<any>> {
    return this.enhancedRequest<ApiResponse<any>>('get', this.appendAppKey(API_ENDPOINTS.EXCHANGE_RATES), undefined, { params: { retry: { retries: 0, retryDelay: 0 } } });
  }

  // Game Settings Management APIs
  async updateGameSettings(data: Partial<GameSetting>): Promise<ApiResponse<GameSetting>> {
    const response = await this.enhancedRequest<ApiResponse<GameSetting>>('put', API_ENDPOINTS.UPDATE_GAME_SETTINGS, data);
    // Clear game settings cache
    return response;
  }

  async updateLotteryGameSetting(settingId: string, data: Partial<LotteryGameSetting>): Promise<ApiResponse<LotteryGameSetting>> {
    const response = await this.enhancedRequest<ApiResponse<LotteryGameSetting>>('put', `${API_ENDPOINTS.UPDATE_LOTTERY_SETTING}/${settingId}`, data);
    // Clear lottery settings cache
    return response;
  }

  async updateLotteryGamePermission(permissionId: string, data: Partial<LotteryGamePermission>): Promise<ApiResponse<LotteryGamePermission>> {
    const response = await this.enhancedRequest<ApiResponse<LotteryGamePermission>>('put', `${API_ENDPOINTS.UPDATE_LOTTERY_PERMISSION}/${permissionId}`, data);
    // Clear permissions cache
    return response;
  }

  // System Management APIs
  async getApplicationLogs(pageNumber = 1, pageSize = 50): Promise<PaginatedResponse<any>> {
    return this.enhancedRequest<PaginatedResponse<any>>('get', 
      `${API_ENDPOINTS.APPLICATION_LOGS}?pageNumber=${pageNumber}&pageSize=${pageSize}`,
      undefined,
      { params: { retry: { retries: 0, retryDelay: 0 } } }
    );
  }

  async deleteApplicationLogs(): Promise<ApiResponse> {
    const response = await this.enhancedRequest<ApiResponse>('delete', API_ENDPOINTS.DELETE_APPLICATION_LOGS);
    // Clear logs cache
    return response;
  }

  async getDatabaseHistory(pageNumber = 1, pageSize = 50, filters?: any): Promise<PaginatedResponse<any>> {
    return this.enhancedRequest<PaginatedResponse<any>>('get', 
      `${API_ENDPOINTS.DATABASE_HISTORY}?pageNumber=${pageNumber}&pageSize=${pageSize}`,
      undefined,
      { params: { retry: { retries: 0, retryDelay: 0 }, params: filters } }
    );
  }

  async cleanupCollection(collectionType: string, startDate: string, endDate: string): Promise<ApiResponse> {
    const response = await this.enhancedRequest<ApiResponse>('delete', API_ENDPOINTS.CLEANUP_COLLECTION, {
      collectionType,
      startDate,
      endDate
    });
    // Clear database history cache
    return response;
  }

  async getCollectionCount(collectionType: string, startDate: string, endDate: string): Promise<ApiResponse<{ collectionCount: number }>> {
    return this.enhancedRequest<ApiResponse<{ collectionCount: number }>>('get', 
      `${API_ENDPOINTS.COLLECTION_COUNT}?collectionType=${collectionType}&startDate=${startDate}&endDate=${endDate}`,
      undefined,
      { params: { retry: { retries: 0, retryDelay: 0 } } }
    );
  }

  // Lottery Management APIs
  async initializeLotterySettings(lotteryGameType: number): Promise<ApiResponse> {
    const response = await this.enhancedRequest<ApiResponse>('post', `${API_ENDPOINTS.INITIALIZE_LOTTERY_SETTINGS}/${lotteryGameType}`);
    // Clear lottery settings cache
    return response;
  }

  async initializeLotteryPermissions(lotteryGameType: number): Promise<ApiResponse> {
    const response = await this.enhancedRequest<ApiResponse>('post', `${API_ENDPOINTS.INITIALIZE_LOTTERY_PERMISSIONS}/${lotteryGameType}`);
    // Clear permissions cache
    return response;
  }

  // System Status APIs
  async getSystemStatus(): Promise<ApiResponse<any>> {
    return this.enhancedRequest<ApiResponse<any>>('get', API_ENDPOINTS.SYSTEM_STATUS, undefined, { params: { retry: { retries: 0, retryDelay: 0 } } });
  }

  async getCronJobs(): Promise<ApiResponse<any>> {
    return this.enhancedRequest<ApiResponse<any>>('get', API_ENDPOINTS.CRON_JOBS, undefined, { params: { retry: { retries: 0, retryDelay: 0 } } });
  }

  // Wallet History APIs
  async getWalletHistory(pageNumber = 1, pageSize = 10, type = ""): Promise<{ walletHistory: any[]; totalCount: number; totalPages: number }> {
    const params = new URLSearchParams({
      pageNumber: pageNumber.toString(),
      pageSize: pageSize.toString(),
      ...(type && { type })
    });
    
    return this.enhancedRequest<{ walletHistory: any[]; totalCount: number; totalPages: number }>('get', 
      `${API_ENDPOINTS.WALLET_HISTORY}?${params.toString()}`,
      undefined,
      { params: { retry: { retries: 0, retryDelay: 0 } } }
    );
  }

  async getUserWalletHistory(userId: string, pageNumber = 1, pageSize = 10, type = ""): Promise<{ walletHistory: any[]; totalCount: number; totalPages: number }> {
    const params = new URLSearchParams({
      pageNumber: pageNumber.toString(),
      pageSize: pageSize.toString(),
      ...(type && { type })
    });
    
    return this.enhancedRequest<{ walletHistory: any[]; totalCount: number; totalPages: number }>('get', 
      `${API_ENDPOINTS.USER_WALLET_HISTORY}/${userId}?${params.toString()}`,
      undefined,
      { params: { retry: { retries: 0, retryDelay: 0 } } }
    );
  }

  async getDBWalletHistory(pageNumber = 1, pageSize = 10, type = ""): Promise<{ walletHistory: any[]; totalCount: number; totalPages: number }> {
    const params = new URLSearchParams({
      pageNumber: pageNumber.toString(),
      pageSize: pageSize.toString(),
      ...(type && { type })
    });
    
    return this.enhancedRequest<{ walletHistory: any[]; totalCount: number; totalPages: number }>('get', 
      `${API_ENDPOINTS.DB_WALLET_HISTORY}?${params.toString()}`,
      undefined,
      { params: { retry: { retries: 0, retryDelay: 0 } } }
    );
  }

  // Transaction History APIs
  async getUserTransactionsHistory(pageNumber = 1, pageSize = 10, filters?: any): Promise<{ transactions: any[]; totalCount: number; totalPages: number }> {
    const params = new URLSearchParams({
      pageNumber: pageNumber.toString(),
      pageSize: pageSize.toString(),
      ...filters
    });
    
    return this.enhancedRequest<{ transactions: any[]; totalCount: number; totalPages: number }>('get', 
      `${API_ENDPOINTS.USER_TRANSACTIONS_HISTORY}?${params.toString()}`,
      undefined,
      { params: { retry: { retries: 0, retryDelay: 0 } } }
    );
  }

  // Referral APIs
  async getMyReferralsHistory(): Promise<any[]> {
    return this.enhancedRequest<any[]>('get', API_ENDPOINTS.MY_REFERRALS_HISTORY, undefined, { params: { retry: { retries: 0, retryDelay: 0 } } });
  }

  // Enhanced error handling
  handleError(error: any): string {
    // Handle specific API error responses
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    
    if (error.response?.data?.error) {
      return error.response.data.error;
    }
    
    // Handle HTTP status codes
    if (error.response?.status === 400) {
      return 'Bad request. Please check your input and try again.';
    }
    
    if (error.response?.status === 401) {
      return 'Authentication failed. Please log in again.';
    }
    
    if (error.response?.status === 403) {
      return 'Access denied. You do not have permission to perform this action.';
    }
    
    if (error.response?.status === 404) {
      return 'Resource not found. Please check the URL and try again.';
    }
    
    if (error.response?.status === 409) {
      return 'Conflict. This resource already exists or has been modified.';
    }
    
    if (error.response?.status === 422) {
      return 'Validation error. Please check your input and try again.';
    }
    
    if (error.response?.status === 429) {
      return 'Too many requests. Please wait a moment and try again.';
    }
    
    if (error.response?.status >= 500) {
      return 'Server error. Please try again later or contact support.';
    }
    
    // Handle network errors
    if (error.code === 'NETWORK_ERROR') {
      return 'Network error. Please check your internet connection and try again.';
    }
    
    if (error.code === 'ECONNABORTED') {
      return 'Request timeout. Please try again.';
    }
    
    if (error.code === 'ERR_NETWORK') {
      return 'Network error. Unable to connect to the server.';
    }
    
    // Handle axios errors
    if (error.message) {
      return error.message;
    }
    
    return 'An unexpected error occurred. Please try again.';
  }

  // Enhanced request method with success notifications
  private async enhancedRequestWithNotification<T>(
    method: 'get' | 'post' | 'put' | 'delete',
    url: string,
    data?: any,
    options: {
      retry?: Partial<RetryConfig>;
      params?: any;
      showSuccessNotification?: boolean;
      successMessage?: string;
      showErrorNotification?: boolean;
    } = {}
  ): Promise<T> {
    try {
      const result = await this.enhancedRequest<T>(method, url, data, options);
      
      // Show success notification if enabled
      if (options.showSuccessNotification && options.successMessage) {
        this.showSuccessNotification(options.successMessage);
      }
      
      return result;
    } catch (error) {
      // Error notification is handled by the response interceptor
      throw error;
    }
  }

  // Stop all polling
  stopAllPolling(): void {
    this.pollingIntervals.forEach(intervalId => clearInterval(intervalId));
    this.pollingIntervals.clear();
    this.pollingCallbacks.clear();
  }

  // Utility methods for testing notifications
  testErrorNotification(message: string = 'This is a test error message') {
    this.showErrorNotification({ message });
  }

  testSuccessNotification(message: string = 'This is a test success message') {
    this.showSuccessNotification(message);
  }

  testWarningNotification(message: string = 'This is a test warning message') {
    this.showWarningNotification(message);
  }

  testInfoNotification(message: string = 'This is a test info message') {
    this.showInfoNotification(message);
  }

  // Method to disable error notifications for specific requests
  disableErrorNotification() {
    return { showErrorNotification: false };
  }

  // Method to enable success notifications for specific requests
  enableSuccessNotification(message: string) {
    return { showSuccessNotification: true, successMessage: message };
  }
}

export default new ApiService(); 