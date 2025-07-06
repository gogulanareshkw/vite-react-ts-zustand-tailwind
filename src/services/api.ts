import axios from 'axios';
import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { 
  API_URL, 
  APP_KEY, 
  API_ENDPOINTS, 
  CACHE_CONFIG, 
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
  PlayLotteryGameRequest
} from '../types';

// Extend axios config to include metadata
interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  metadata?: {
    startTime: Date;
    showErrorNotification?: boolean;
  };
}

// Cache interface
interface CacheItem {
  data: any;
  timestamp: number;
  ttl: number;
}

// Retry configuration
interface RetryConfig {
  retries: number;
  retryDelay: number;
  retryCondition: (error: any) => boolean;
}

class ApiService {
  private api: AxiosInstance;
  private cache: Map<string, CacheItem> = new Map();
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

  // Cache management
  private getCacheKey(url: string, params?: any): string {
    const paramString = params ? JSON.stringify(params) : '';
    return `${url}${paramString}`;
  }

  private getFromCache(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) return null;
    
    const now = Date.now();
    if (now - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }

  private setCache(key: string, data: any, ttl: number = 5 * 60 * 1000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  private clearCache(pattern?: string): void {
    if (pattern) {
      for (const key of this.cache.keys()) {
        if (key.includes(pattern)) {
          this.cache.delete(key);
        }
      }
    } else {
      this.cache.clear();
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

  // Enhanced request method with caching and retry
  private async enhancedRequest<T>(
    method: 'get' | 'post' | 'put' | 'delete',
    url: string,
    data?: any,
    options: {
      cache?: boolean;
      ttl?: number;
      retry?: Partial<RetryConfig>;
      params?: any;
    } = {}
  ): Promise<T> {
    const cacheKey = options.cache ? this.getCacheKey(url, options.params) : null;
    
    // Try cache first for GET requests
    if (method === 'get' && options.cache && cacheKey) {
      const cachedData = this.getFromCache(cacheKey);
      if (cachedData) {
        return cachedData;
      }
    }

    const requestFn = () => this.api[method](url, data, { params: options.params });
    
    const response = await this.retryRequest(requestFn, options.retry);
    
    // Cache successful GET responses
    if (method === 'get' && options.cache && cacheKey && response.data) {
      this.setCache(cacheKey, response.data, options.ttl);
    }
    
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

  async getUserInfo(userId?: string): Promise<ApiResponse<User>> {
    const endpoint = userId ? `${API_ENDPOINTS.USER_BY_ID}/${userId}` : API_ENDPOINTS.GET_USER_INFO;
    return this.enhancedRequest<ApiResponse<User>>('get', endpoint, undefined, { cache: true, ttl: CACHE_CONFIG.USER_INFO });
  }

  async updateUserProfile(data: Partial<User>): Promise<ApiResponse<User>> {
    const response = await this.enhancedRequest<ApiResponse<User>>('put', API_ENDPOINTS.UPDATE_PROFILE, data);
    // Clear user cache
    this.clearCache('getUserInfo');
    return response;
  }

  // Game Settings APIs with caching
  async getGameSettings(): Promise<ApiResponse<GameSetting>> {
    return this.enhancedRequest<ApiResponse<GameSetting>>('get', this.appendAppKey(API_ENDPOINTS.GAME_SETTINGS), undefined, { 
      cache: true, 
      ttl: CACHE_CONFIG.GAME_SETTINGS
    });
  }

  async getLotteryGameSettings(): Promise<ApiResponse<LotteryGameSetting[]>> {
    return this.enhancedRequest<ApiResponse<LotteryGameSetting[]>>('get', this.appendAppKey(API_ENDPOINTS.LOTTERY_SETTINGS), undefined, { 
      cache: true, 
      ttl: CACHE_CONFIG.LOTTERY_SETTINGS
    });
  }

  async getLotteryGamePermissions(): Promise<ApiResponse<LotteryGamePermission[]>> {
    return this.enhancedRequest<ApiResponse<LotteryGamePermission[]>>('get', this.appendAppKey(API_ENDPOINTS.LOTTERY_PERMISSIONS), undefined, { 
      cache: true, 
      ttl: CACHE_CONFIG.LOTTERY_SETTINGS
    });
  }

  async getLotteryGameBoards(): Promise<ApiResponse<LotteryGameBoard[]>> {
    return this.enhancedRequest<ApiResponse<LotteryGameBoard[]>>('get', this.appendAppKey(API_ENDPOINTS.LOTTERY_BOARDS), undefined, { 
      cache: true, 
      ttl: CACHE_CONFIG.LOTTERY_SETTINGS
    });
  }

  async getLotteryGameResults(lotteryGameType: number): Promise<ApiResponse<LotteryGameResult[]>> {
    return this.enhancedRequest<ApiResponse<LotteryGameResult[]>>('get', this.appendAppKey(API_ENDPOINTS.LOTTERY_RESULTS), undefined, { 
      cache: true, 
      ttl: CACHE_CONFIG.LOTTERY_RESULTS
    });
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

  // Lottery Game Play APIs
  async playLotteryGame(data: PlayLotteryGameRequest): Promise<ApiResponse<LotteryGamePlay>> {
    const response = await this.enhancedRequest<ApiResponse<LotteryGamePlay>>('post', API_ENDPOINTS.PLAY_LOTTERY, data);
    return response;
  }

  async getUserGameHistory(lotteryGameType: number, pageNumber = 1, pageSize = 10): Promise<PaginatedResponse<LotteryGamePlay>> {
    return this.enhancedRequest<PaginatedResponse<LotteryGamePlay>>('get', 
      `${API_ENDPOINTS.GAME_HISTORY}/${lotteryGameType}?pageNumber=${pageNumber}&pageSize=${pageSize}`,
      undefined,
      { cache: true, ttl: CACHE_CONFIG.TRANSACTIONS }
    );
  }

  // Financial APIs
  async createRecharge(data: { amount: number; paymentMethod: string }): Promise<ApiResponse<Recharge>> {
    const response = await this.enhancedRequest<ApiResponse<Recharge>>('post', API_ENDPOINTS.CREATE_RECHARGE, data);
    return response;
  }

  async getUserRecharges(pageNumber = 1, pageSize = 10): Promise<PaginatedResponse<Recharge>> {
    return this.enhancedRequest<PaginatedResponse<Recharge>>('get', 
      `${API_ENDPOINTS.USER_RECHARGES}?pageNumber=${pageNumber}&pageSize=${pageSize}`,
      undefined,
      { cache: true, ttl: CACHE_CONFIG.TRANSACTIONS }
    );
  }

  async createWithdraw(data: { amount: number; bankCardId: string }): Promise<ApiResponse<Withdraw>> {
    const response = await this.enhancedRequest<ApiResponse<Withdraw>>('post', API_ENDPOINTS.CREATE_WITHDRAW, data);
    return response;
  }

  async getUserWithdrawals(pageNumber = 1, pageSize = 10): Promise<PaginatedResponse<Withdraw>> {
    return this.enhancedRequest<PaginatedResponse<Withdraw>>('get', 
      `${API_ENDPOINTS.USER_WITHDRAWALS}?pageNumber=${pageNumber}&pageSize=${pageSize}`,
      undefined,
      { cache: true, ttl: CACHE_CONFIG.TRANSACTIONS }
    );
  }

  // Bank Card APIs
  async createBankCard(data: Partial<BankCard>): Promise<ApiResponse<BankCard>> {
    const response = await this.enhancedRequest<ApiResponse<BankCard>>('post', API_ENDPOINTS.CREATE_BANK_CARD, data);
    return response;
  }

  async getUserBankCards(): Promise<ApiResponse<BankCard[]>> {
    return this.enhancedRequest<ApiResponse<BankCard[]>>('get', API_ENDPOINTS.USER_BANK_CARDS, undefined, { 
      cache: true, 
      ttl: CACHE_CONFIG.MEDIA
    });
  }

  async deleteBankCard(bankCardId: string): Promise<ApiResponse> {
    const response = await this.enhancedRequest<ApiResponse>('delete', `${API_ENDPOINTS.DELETE_BANK_CARD}/${bankCardId}`);
    return response;
  }

  // Admin APIs
  async getAllUsers(pageNumber = 1, pageSize = 10): Promise<PaginatedResponse<User>> {
    return this.enhancedRequest<PaginatedResponse<User>>('get', 
      `${API_ENDPOINTS.ALL_USERS}?pageNumber=${pageNumber}&pageSize=${pageSize}`,
      undefined,
      { cache: true, ttl: CACHE_CONFIG.USER_INFO }
    );
  }

  async getUserById(userId: string): Promise<ApiResponse<User>> {
    return this.enhancedRequest<ApiResponse<User>>('get', `${API_ENDPOINTS.USER_BY_ID}/${userId}`, undefined, { cache: true });
  }

  async updateUserStatus(userId: string, status: boolean): Promise<ApiResponse> {
    const response = await this.enhancedRequest<ApiResponse>('put', `${API_ENDPOINTS.UPDATE_USER_STATUS}/${userId}`, { status });
    // Clear user cache
    this.clearCache(`user/${userId}`);
    return response;
  }

  async blockUserByAdmin(userId: string, blocked: boolean): Promise<ApiResponse> {
    const response = await this.enhancedRequest<ApiResponse>('put', `${API_ENDPOINTS.BLOCK_USER}/${userId}`, { blocked });
    // Clear user cache
    this.clearCache(`user/${userId}`);
    return response;
  }

  async deductUserMoney(userId: string, amount: number): Promise<ApiResponse> {
    const response = await this.enhancedRequest<ApiResponse>('put', `${API_ENDPOINTS.DEDUCT_USER_MONEY}/${userId}`, { amount });
    // Clear user cache
    this.clearCache(`user/${userId}`);
    return response;
  }

  async rechargeUserMoney(userId: string, amount: number): Promise<ApiResponse> {
    const response = await this.enhancedRequest<ApiResponse>('put', `${API_ENDPOINTS.RECHARGE_USER_MONEY}/${userId}`, { amount });
    // Clear user cache
    this.clearCache(`user/${userId}`);
    return response;
  }

  // Transaction APIs
  async getAllTransactions(pageNumber = 1, pageSize = 10): Promise<PaginatedResponse<any>> {
    return this.enhancedRequest<PaginatedResponse<any>>('get', 
      `${API_ENDPOINTS.ALL_TRANSACTIONS}?pageNumber=${pageNumber}&pageSize=${pageSize}`,
      undefined,
      { cache: true, ttl: CACHE_CONFIG.TRANSACTIONS }
    );
  }

  async getTransactionById(transactionId: string): Promise<ApiResponse<any>> {
    return this.enhancedRequest<ApiResponse<any>>('get', `${API_ENDPOINTS.TRANSACTION_BY_ID}/${transactionId}`, undefined, { cache: true });
  }

  async updateTransactionStatus(transactionId: string, status: string): Promise<ApiResponse> {
    const response = await this.enhancedRequest<ApiResponse>('put', `${API_ENDPOINTS.UPDATE_TRANSACTION_STATUS}/${transactionId}`, { status });
    // Clear transaction cache
    this.clearCache(`transaction/${transactionId}`);
    return response;
  }

  // Lottery Play APIs
  async getAllLotteryPlays(pageNumber = 1, pageSize = 10): Promise<PaginatedResponse<LotteryGamePlay>> {
    return this.enhancedRequest<PaginatedResponse<LotteryGamePlay>>('get', 
      `${API_ENDPOINTS.ALL_LOTTERY_PLAYS}?pageNumber=${pageNumber}&pageSize=${pageSize}`,
      undefined,
      { cache: true, ttl: CACHE_CONFIG.TRANSACTIONS }
    );
  }

  async getLotteryPlayById(playId: string): Promise<ApiResponse<LotteryGamePlay>> {
    return this.enhancedRequest<ApiResponse<LotteryGamePlay>>('get', `${API_ENDPOINTS.LOTTERY_PLAY_BY_ID}/${playId}`, undefined, { cache: true });
  }

  // Feedback APIs
  async createFeedback(data: { type: string; message: string; rating?: number }): Promise<ApiResponse> {
    const response = await this.enhancedRequest<ApiResponse>('post', API_ENDPOINTS.CREATE_FEEDBACK, data);
    this.showSuccessNotification('Feedback submitted successfully! Thank you for your input.');
    return response;
  }

  async getAllFeedbacks(): Promise<ApiResponse<any[]>> {
    return this.enhancedRequest<ApiResponse<any[]>>('get', API_ENDPOINTS.ALL_FEEDBACKS, undefined, { cache: true });
  }

  // Offers and Help APIs
  async getAllOffers(): Promise<ApiResponse<any[]>> {
    return this.enhancedRequest<ApiResponse<any[]>>('get', this.appendAppKey(API_ENDPOINTS.ALL_OFFERS), undefined, { 
      cache: true, 
      ttl: CACHE_CONFIG.OFFERS
    });
  }

  async getAllHelpLinks(): Promise<ApiResponse<any[]>> {
    return this.enhancedRequest<ApiResponse<any[]>>('get', this.appendAppKey(API_ENDPOINTS.ALL_HELP_LINKS), undefined, { 
      cache: true, 
      ttl: CACHE_CONFIG.HELP_LINKS
    });
  }

  // Media APIs
  async uploadMedia(file: File): Promise<ApiResponse<{ url: string }>> {
    const formData = new FormData();
    formData.append('media', file);
    
    const response = await this.enhancedRequest<ApiResponse<{ url: string }>>('post', API_ENDPOINTS.UPLOAD_MEDIA, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      cache: false
    });
    this.showSuccessNotification('Media uploaded successfully!');
    return response;
  }

  async getAllMedia(): Promise<ApiResponse<any[]>> {
    return this.enhancedRequest<ApiResponse<any[]>>('get', API_ENDPOINTS.ALL_MEDIA, undefined, { cache: true });
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
      { cache: true, ttl: CACHE_CONFIG.TRANSACTIONS }
    );
  }

  async updateApplicationAgentStatus(agentId: string, status: string): Promise<ApiResponse> {
    const response = await this.enhancedRequest<ApiResponse>('put', `${API_ENDPOINTS.UPDATE_AGENT_STATUS}/${agentId}`, { status });
    // Clear agents cache
    this.clearCache('getAllApplicationAgents');
    return response;
  }

  // Mobile Data APIs
  async storeMobileData(data: any): Promise<ApiResponse> {
    return this.enhancedRequest<ApiResponse>('post', this.appendAppKey(API_ENDPOINTS.USER_MOBILE_DATA), data);
  }

  async getUserMobileData(): Promise<ApiResponse<any>> {
    return this.enhancedRequest<ApiResponse<any>>('get', API_ENDPOINTS.USER_MOBILE_DATA, undefined, { cache: true });
  }

  async getAllMobileDataUsers(): Promise<ApiResponse<any[]>> {
    return this.enhancedRequest<ApiResponse<any[]>>('get', API_ENDPOINTS.ALL_MOBILE_DATA_USERS, undefined, { cache: true });
  }

  // Exchange Rates API
  async getExchangeRates(): Promise<ApiResponse<any>> {
    return this.enhancedRequest<ApiResponse<any>>('get', this.appendAppKey(API_ENDPOINTS.EXCHANGE_RATES), undefined, { 
      cache: true, 
      ttl: CACHE_CONFIG.EXCHANGE_RATES
    });
  }

  // Game Settings Management APIs
  async updateGameSettings(data: Partial<GameSetting>): Promise<ApiResponse<GameSetting>> {
    const response = await this.enhancedRequest<ApiResponse<GameSetting>>('put', API_ENDPOINTS.UPDATE_GAME_SETTINGS, data);
    // Clear game settings cache
    this.clearCache('getGameSettings');
    return response;
  }

  async updateLotteryGameSetting(settingId: string, data: Partial<LotteryGameSetting>): Promise<ApiResponse<LotteryGameSetting>> {
    const response = await this.enhancedRequest<ApiResponse<LotteryGameSetting>>('put', `${API_ENDPOINTS.UPDATE_LOTTERY_SETTING}/${settingId}`, data);
    // Clear lottery settings cache
    this.clearCache('getLotteryGameSettings');
    return response;
  }

  async updateLotteryGamePermission(permissionId: string, data: Partial<LotteryGamePermission>): Promise<ApiResponse<LotteryGamePermission>> {
    const response = await this.enhancedRequest<ApiResponse<LotteryGamePermission>>('put', `${API_ENDPOINTS.UPDATE_LOTTERY_PERMISSION}/${permissionId}`, data);
    // Clear permissions cache
    this.clearCache('getLotteryGamePermissions');
    return response;
  }

  // System Management APIs
  async getApplicationLogs(pageNumber = 1, pageSize = 50): Promise<PaginatedResponse<any>> {
    return this.enhancedRequest<PaginatedResponse<any>>('get', 
      `${API_ENDPOINTS.APPLICATION_LOGS}?pageNumber=${pageNumber}&pageSize=${pageSize}`,
      undefined,
      { cache: true, ttl: CACHE_CONFIG.TRANSACTIONS }
    );
  }

  async deleteApplicationLogs(): Promise<ApiResponse> {
    const response = await this.enhancedRequest<ApiResponse>('delete', API_ENDPOINTS.DELETE_APPLICATION_LOGS);
    // Clear logs cache
    this.clearCache('getApplicationLogs');
    return response;
  }

  async getDatabaseHistory(pageNumber = 1, pageSize = 50, filters?: any): Promise<PaginatedResponse<any>> {
    return this.enhancedRequest<PaginatedResponse<any>>('get', 
      `${API_ENDPOINTS.DATABASE_HISTORY}?pageNumber=${pageNumber}&pageSize=${pageSize}`,
      undefined,
      { 
        cache: true, 
        ttl: CACHE_CONFIG.TRANSACTIONS,
        params: filters
      }
    );
  }

  async cleanupCollection(collectionType: string, startDate: string, endDate: string): Promise<ApiResponse> {
    const response = await this.enhancedRequest<ApiResponse>('delete', API_ENDPOINTS.CLEANUP_COLLECTION, {
      collectionType,
      startDate,
      endDate
    });
    // Clear database history cache
    this.clearCache('getDatabaseHistory');
    return response;
  }

  async getCollectionCount(collectionType: string, startDate: string, endDate: string): Promise<ApiResponse<{ collectionCount: number }>> {
    return this.enhancedRequest<ApiResponse<{ collectionCount: number }>>('get', 
      `${API_ENDPOINTS.COLLECTION_COUNT}?collectionType=${collectionType}&startDate=${startDate}&endDate=${endDate}`,
      undefined,
      { cache: true, ttl: CACHE_CONFIG.MEDIA }
    );
  }

  // Lottery Management APIs
  async initializeLotterySettings(lotteryGameType: number): Promise<ApiResponse> {
    const response = await this.enhancedRequest<ApiResponse>('post', `${API_ENDPOINTS.INITIALIZE_LOTTERY_SETTINGS}/${lotteryGameType}`);
    // Clear lottery settings cache
    this.clearCache('getLotteryGameSettings');
    return response;
  }

  async initializeLotteryPermissions(lotteryGameType: number): Promise<ApiResponse> {
    const response = await this.enhancedRequest<ApiResponse>('post', `${API_ENDPOINTS.INITIALIZE_LOTTERY_PERMISSIONS}/${lotteryGameType}`);
    // Clear permissions cache
    this.clearCache('getLotteryGamePermissions');
    return response;
  }

  // System Status APIs
  async getSystemStatus(): Promise<ApiResponse<any>> {
    return this.enhancedRequest<ApiResponse<any>>('get', API_ENDPOINTS.SYSTEM_STATUS, undefined, { cache: true });
  }

  async getCronJobs(): Promise<ApiResponse<any>> {
    return this.enhancedRequest<ApiResponse<any>>('get', API_ENDPOINTS.CRON_JOBS, undefined, { cache: true });
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
      { cache: true, ttl: CACHE_CONFIG.TRANSACTIONS }
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
      { cache: true, ttl: CACHE_CONFIG.TRANSACTIONS }
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
      { cache: true, ttl: CACHE_CONFIG.TRANSACTIONS }
    );
  }

  // Referral APIs
  async getMyReferralsHistory(): Promise<any[]> {
    return this.enhancedRequest<any[]>('get', API_ENDPOINTS.MY_REFERRALS_HISTORY, undefined, { cache: true, ttl: CACHE_CONFIG.MEDIA });
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
      cache?: boolean;
      ttl?: number;
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

  // Cache management methods
  clearAllCache(): void {
    this.cache.clear();
  }

  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
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