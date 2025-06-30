import axios from 'axios';
import type { AxiosInstance, AxiosResponse } from 'axios';
import { API_URL, APP_KEY } from '../config/constants';
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

class ApiService {
  private api: AxiosInstance;

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
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth APIs
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.api.post(
      `/user/public/login?appkey=${APP_KEY}`,
      data
    );
    return response.data;
  }

  async signUp(data: SignUpRequest): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.api.post(
      `/user/public/create?appkey=${APP_KEY}`,
      data
    );
    return response.data;
  }

  async agentSignUp(data: AgentSignUpRequest): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.api.post(
      `/user/public/createAgent?appkey=${APP_KEY}`,
      data
    );
    return response.data;
  }

  async verifyEmail(OTP: string): Promise<ApiResponse<User>> {
    const response: AxiosResponse<ApiResponse<User>> = await this.api.post(
      '/user/verifyEmailOtp',
      { OTP }
    );
    return response.data;
  }

  async sendActivationMail(): Promise<ApiResponse> {
    const response: AxiosResponse<ApiResponse> = await this.api.get('/user/sendActivationMail');
    return response.data;
  }

  async forgotPassword(email: string): Promise<ApiResponse<{ userId: string }>> {
    const response: AxiosResponse<ApiResponse<{ userId: string }>> = await this.api.post(
      `/user/public/forgotPassword?appkey=${APP_KEY}`,
      { email }
    );
    return response.data;
  }

  async resetPassword(userId: string, OTP: string, newPassword: string): Promise<ApiResponse> {
    const response: AxiosResponse<ApiResponse> = await this.api.post(
      `/user/public/resetPassword?appkey=${APP_KEY}`,
      { userId, OTP, newPassword }
    );
    return response.data;
  }

  async changePassword(currPassword: string, newPassword: string): Promise<ApiResponse<User>> {
    const response: AxiosResponse<ApiResponse<User>> = await this.api.post(
      '/user/changePassword',
      { currPassword, newPassword }
    );
    return response.data;
  }

  async getUserInfo(): Promise<ApiResponse<User>> {
    const response: AxiosResponse<ApiResponse<User>> = await this.api.get('/user/getUserInfo');
    return response.data;
  }

  async updateUserProfile(data: Partial<User>): Promise<ApiResponse<User>> {
    const response: AxiosResponse<ApiResponse<User>> = await this.api.put('/user/updateProfile', data);
    return response.data;
  }

  // Game Settings APIs
  async getGameSettings(): Promise<ApiResponse<GameSetting>> {
    const response: AxiosResponse<ApiResponse<GameSetting>> = await this.api.get('/gameSettings/getBasicGameSettings');
    return response.data;
  }

  async getLotteryGameSettings(): Promise<ApiResponse<LotteryGameSetting[]>> {
    const response: AxiosResponse<ApiResponse<LotteryGameSetting[]>> = await this.api.get('/lotteryGameSetting/getAllLotteryGameSettings');
    return response.data;
  }

  async getLotteryGamePermissions(): Promise<ApiResponse<LotteryGamePermission[]>> {
    const response: AxiosResponse<ApiResponse<LotteryGamePermission[]>> = await this.api.get('/lotteryGamePermission/getAllLotteryGamePermissions');
    return response.data;
  }

  async getLotteryGameBoards(): Promise<ApiResponse<LotteryGameBoard[]>> {
    const response: AxiosResponse<ApiResponse<LotteryGameBoard[]>> = await this.api.get('/lotteryGameBoard/getAllLotteryGameBoards');
    return response.data;
  }

  async getLotteryGameResults(lotteryGameType: number): Promise<ApiResponse<LotteryGameResult[]>> {
    const response: AxiosResponse<ApiResponse<LotteryGameResult[]>> = await this.api.get(
      `/lotteryGameResultSummery/getLastLotteryGameWinners/${lotteryGameType}`
    );
    return response.data;
  }

  // Lottery Game Play APIs
  async playLotteryGame(data: PlayLotteryGameRequest): Promise<ApiResponse<LotteryGamePlay>> {
    const response: AxiosResponse<ApiResponse<LotteryGamePlay>> = await this.api.post(
      '/lotteryGamePlay/playLotteryGame',
      data
    );
    return response.data;
  }

  async getUserGameHistory(lotteryGameType: number, pageNumber = 1, pageSize = 10): Promise<PaginatedResponse<LotteryGamePlay>> {
    const response: AxiosResponse<PaginatedResponse<LotteryGamePlay>> = await this.api.get(
      `/lotteryGamePlay/getlotteryGamePlayShotsHistorybyUserID/${lotteryGameType}?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
    return response.data;
  }

  // Financial APIs
  async createRecharge(data: { amount: number; paymentMethod: string }): Promise<ApiResponse<Recharge>> {
    const response: AxiosResponse<ApiResponse<Recharge>> = await this.api.post('/recharge/createRecharge', data);
    return response.data;
  }

  async getUserRecharges(pageNumber = 1, pageSize = 10): Promise<PaginatedResponse<Recharge>> {
    const response: AxiosResponse<PaginatedResponse<Recharge>> = await this.api.get(
      `/recharge/getUserRechargeHistory?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
    return response.data;
  }

  async createWithdraw(data: { amount: number; bankCardId: string }): Promise<ApiResponse<Withdraw>> {
    const response: AxiosResponse<ApiResponse<Withdraw>> = await this.api.post('/withdraw/createWithdraw', data);
    return response.data;
  }

  async getUserWithdrawals(pageNumber = 1, pageSize = 10): Promise<PaginatedResponse<Withdraw>> {
    const response: AxiosResponse<PaginatedResponse<Withdraw>> = await this.api.get(
      `/withdraw/getUserWithdrawHistory?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
    return response.data;
  }

  async createBankCard(data: Partial<BankCard>): Promise<ApiResponse<BankCard>> {
    const response: AxiosResponse<ApiResponse<BankCard>> = await this.api.post('/bankcard/createBankCard', data);
    return response.data;
  }

  async getUserBankCards(): Promise<ApiResponse<BankCard[]>> {
    const response: AxiosResponse<ApiResponse<BankCard[]>> = await this.api.get('/bankcard/getUserBankCards');
    return response.data;
  }

  async deleteBankCard(bankCardId: string): Promise<ApiResponse> {
    const response: AxiosResponse<ApiResponse> = await this.api.delete(`/bankcard/deleteBankCard/${bankCardId}`);
    return response.data;
  }

  // Admin APIs
  async getAllUsers(pageNumber = 1, pageSize = 10): Promise<PaginatedResponse<User>> {
    const response: AxiosResponse<PaginatedResponse<User>> = await this.api.get(
      `/user/getAllUsers?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
    return response.data;
  }

  async getUserById(userId: string): Promise<ApiResponse<User>> {
    const response: AxiosResponse<ApiResponse<User>> = await this.api.get(`/user/getUserById/${userId}`);
    return response.data;
  }

  async updateUserStatus(userId: string, status: boolean): Promise<ApiResponse> {
    const response: AxiosResponse<ApiResponse> = await this.api.put(`/user/updateUserStatus/${userId}`, { status });
    return response.data;
  }

  async blockUserByAdmin(userId: string, blocked: boolean): Promise<ApiResponse> {
    const response: AxiosResponse<ApiResponse> = await this.api.put(`/user/blockUserByAdmin/${userId}`, { blocked });
    return response.data;
  }

  async deductUserMoney(userId: string, amount: number): Promise<ApiResponse> {
    const response: AxiosResponse<ApiResponse> = await this.api.post(`/user/deductUserMoney/${userId}`, { amount });
    return response.data;
  }

  async rechargeUserMoney(userId: string, amount: number): Promise<ApiResponse> {
    const response: AxiosResponse<ApiResponse> = await this.api.post(`/user/rechargeUserMoney/${userId}`, { amount });
    return response.data;
  }

  // Transaction APIs
  async getAllTransactions(pageNumber = 1, pageSize = 10): Promise<PaginatedResponse<any>> {
    const response: AxiosResponse<PaginatedResponse<any>> = await this.api.get(
      `/recharge/getAllRechargeTransactions?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
    return response.data;
  }

  async getTransactionById(transactionId: string): Promise<ApiResponse<any>> {
    const response: AxiosResponse<ApiResponse<any>> = await this.api.get(`/recharge/getRechargeTransactionById/${transactionId}`);
    return response.data;
  }

  async updateTransactionStatus(transactionId: string, status: string): Promise<ApiResponse> {
    const response: AxiosResponse<ApiResponse> = await this.api.put(`/recharge/updateRechargeTransactionStatus/${transactionId}`, { status });
    return response.data;
  }

  // Lottery Game APIs
  async getAllLotteryPlays(pageNumber = 1, pageSize = 10): Promise<PaginatedResponse<LotteryGamePlay>> {
    const response: AxiosResponse<PaginatedResponse<LotteryGamePlay>> = await this.api.get(
      `/lotteryGamePlay/getAllLotteryGamePlays?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
    return response.data;
  }

  async getLotteryPlayById(playId: string): Promise<ApiResponse<LotteryGamePlay>> {
    const response: AxiosResponse<ApiResponse<LotteryGamePlay>> = await this.api.get(`/lotteryGamePlay/getLotteryGamePlayById/${playId}`);
    return response.data;
  }

  // Feedback APIs
  async createFeedback(data: { message: string; rating: number }): Promise<ApiResponse> {
    const response: AxiosResponse<ApiResponse> = await this.api.post('/feedback/createFeedback', data);
    return response.data;
  }

  async getAllFeedbacks(pageNumber = 1, pageSize = 10): Promise<PaginatedResponse<any>> {
    const response: AxiosResponse<PaginatedResponse<any>> = await this.api.get(
      `/feedback/getAllFeedbacks?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
    return response.data;
  }

  // Offer APIs
  async getAllOffers(): Promise<ApiResponse<any[]>> {
    const response: AxiosResponse<ApiResponse<any[]>> = await this.api.get('/offer/getAllOffers');
    return response.data;
  }

  // Help APIs
  async getAllHelpLinks(): Promise<ApiResponse<any[]>> {
    const response: AxiosResponse<ApiResponse<any[]>> = await this.api.get('/helpLink/getAllHelpLinks');
    return response.data;
  }

  // Media APIs
  async uploadMedia(file: File): Promise<ApiResponse<{ url: string }>> {
    const formData = new FormData();
    formData.append('file', file);
    const response: AxiosResponse<ApiResponse<{ url: string }>> = await this.api.post('/media/uploadMedia', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async getAllMedia(): Promise<ApiResponse<any[]>> {
    const response: AxiosResponse<ApiResponse<any[]>> = await this.api.get('/media/getAllMedia');
    return response.data;
  }

  async deleteMedia(mediaId: string): Promise<ApiResponse> {
    const response: AxiosResponse<ApiResponse> = await this.api.delete(`/media/deleteMedia/${mediaId}`);
    return response.data;
  }

  // Application Agent APIs
  async createApplicationAgent(data: any): Promise<ApiResponse> {
    const response: AxiosResponse<ApiResponse> = await this.api.post('/applicationAgent/createApplicationAgent', data);
    return response.data;
  }

  async getAllApplicationAgents(pageNumber = 1, pageSize = 10): Promise<PaginatedResponse<any>> {
    const response: AxiosResponse<PaginatedResponse<any>> = await this.api.get(
      `/applicationAgent/getAllApplicationAgents?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
    return response.data;
  }

  async updateApplicationAgentStatus(agentId: string, status: string): Promise<ApiResponse> {
    const response: AxiosResponse<ApiResponse> = await this.api.put(`/applicationAgent/updateApplicationAgentStatus/${agentId}`, { status });
    return response.data;
  }

  // Mobile Data APIs
  async getUserMobileData(userId: string): Promise<ApiResponse<any>> {
    const response: AxiosResponse<ApiResponse<any>> = await this.api.get(`/mobileData/getUserMobileData/${userId}`);
    return response.data;
  }

  async getAllMobileDataUsers(pageNumber = 1, pageSize = 10): Promise<PaginatedResponse<any>> {
    const response: AxiosResponse<PaginatedResponse<any>> = await this.api.get(
      `/mobileData/getAllMobileDataUsers?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
    return response.data;
  }

  // Currency APIs
  async getExchangeRates(): Promise<ApiResponse<any>> {
    const response: AxiosResponse<ApiResponse<any>> = await this.api.get('/currency/getExchangeRates');
    return response.data;
  }

  // Game Settings Management APIs
  async updateGameSettings(data: Partial<GameSetting>): Promise<ApiResponse<GameSetting>> {
    const response: AxiosResponse<ApiResponse<GameSetting>> = await this.api.put('/gameSettings/updateBasicGameSettings', data);
    return response.data;
  }

  async updateLotteryGameSetting(settingId: string, data: Partial<LotteryGameSetting>): Promise<ApiResponse<LotteryGameSetting>> {
    const response: AxiosResponse<ApiResponse<LotteryGameSetting>> = await this.api.put(`/lotteryGameSetting/updateLotteryGameSetting/${settingId}`, data);
    return response.data;
  }

  async updateLotteryGamePermission(permissionId: string, data: Partial<LotteryGamePermission>): Promise<ApiResponse<LotteryGamePermission>> {
    const response: AxiosResponse<ApiResponse<LotteryGamePermission>> = await this.api.put(
      `/lotteryGamePermission/updatePermission`,
      { permissionId, ...data }
    );
    return response.data;
  }

  // Advanced Admin APIs
  async getApplicationLogs(pageNumber = 1, pageSize = 50): Promise<PaginatedResponse<any>> {
    const response: AxiosResponse<PaginatedResponse<any>> = await this.api.get(
      `/applicationLog?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
    return response.data;
  }

  async deleteApplicationLogs(): Promise<ApiResponse> {
    const response: AxiosResponse<ApiResponse> = await this.api.delete('/applicationLog');
    return response.data;
  }

  async getDatabaseHistory(pageNumber = 1, pageSize = 50, filters?: any): Promise<PaginatedResponse<any>> {
    const params = new URLSearchParams({
      pageNumber: pageNumber.toString(),
      pageSize: pageSize.toString(),
      ...filters
    });
    const response: AxiosResponse<PaginatedResponse<any>> = await this.api.get(
      `/dbHistory/history?${params}`
    );
    return response.data;
  }

  async cleanupCollection(collectionType: string, startDate: string, endDate: string): Promise<ApiResponse> {
    const response: AxiosResponse<ApiResponse> = await this.api.post('/dbHistory/cleanupCollection', {
      type: collectionType,
      startDate,
      endDate
    });
    return response.data;
  }

  async getCollectionCount(collectionType: string, startDate: string, endDate: string): Promise<ApiResponse<{ collectionCount: number }>> {
    const response: AxiosResponse<ApiResponse<{ collectionCount: number }>> = await this.api.post('/dbHistory/collectionCount', {
      type: collectionType,
      startDate,
      endDate
    });
    return response.data;
  }

  async initializeLotterySettings(lotteryGameType: number): Promise<ApiResponse> {
    const response: AxiosResponse<ApiResponse> = await this.api.post(
      `/lotteryGameSetting/${lotteryGameType}`
    );
    return response.data;
  }

  async initializeLotteryPermissions(lotteryGameType: number): Promise<ApiResponse> {
    const response: AxiosResponse<ApiResponse> = await this.api.post(
      `/lotteryGamePermission/${lotteryGameType}`
    );
    return response.data;
  }

  async getSystemStatus(): Promise<ApiResponse<any>> {
    const response: AxiosResponse<ApiResponse<any>> = await this.api.get('/system/status');
    return response.data;
  }

  async getCronJobs(): Promise<ApiResponse<any[]>> {
    const response: AxiosResponse<ApiResponse<any[]>> = await this.api.get('/system/cronjobs');
    return response.data;
  }

  // Wallet History APIs
  async getWalletHistory(pageNumber = 1, pageSize = 10, type = ""): Promise<{ walletHistory: any[]; totalCount: number; totalPages: number }> {
    const params = new URLSearchParams({
      pageNumber: pageNumber.toString(),
      pageSize: pageSize.toString(),
      type: type || ""
    });
    const response = await this.api.get(`/dbHistory/walletHistory?${params}`);
    return response.data;
  }

  async getUserWalletHistory(userId: string, pageNumber = 1, pageSize = 10, type = ""): Promise<{ walletHistory: any[]; totalCount: number; totalPages: number }> {
    const params = new URLSearchParams({
      pageNumber: pageNumber.toString(),
      pageSize: pageSize.toString(),
      type: type || ""
    });
    const response = await this.api.get(`/dbHistory/walletHistory/${userId}?${params}`);
    return response.data;
  }

  // User Transactions History API
  async getUserTransactionsHistory(pageNumber = 1, pageSize = 10, filters?: any): Promise<{ transactions: any[]; totalCount: number; totalPages: number }> {
    const params = new URLSearchParams({
      pageNumber: pageNumber.toString(),
      pageSize: pageSize.toString(),
      ...(filters?.type ? { type: filters.type } : {}),
      ...(filters?.status ? { status: filters.status } : {})
    });
    const response = await this.api.get(`/dbHistory/usertransactionsHistory?${params}`);
    return response.data;
  }

  // User Referrals History API
  async getMyReferralsHistory(): Promise<any[]> {
    const response = await this.api.get('/user/ref');
    return response.data.referrals || [];
  }

  // Utility method for error handling
  handleError(error: any): string {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    if (error.response?.data?.errors?.[0]?.msg) {
      return error.response.data.errors[0].msg;
    }
    return error.message || 'An error occurred';
  }
}

const api = new ApiService();
export default api;
export { api }; 