import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { 
  AppState, 
  User, 
  GameSetting, 
  LotteryGameSetting, 
  LotteryGamePermission, 
  LotteryGameBoard, 
  LotteryGameResult, 
  LotteryGamePlay, 
  Recharge, 
  Withdraw, 
  BankCard, 
  Notification, 
  ModalState 
} from '../types';
import apiService from '../services/api';

interface LotteryStore extends AppState {
  // Auth Actions
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setAuthenticated: (isAuthenticated: boolean) => void;
  logout: () => void;
  
  // Loading Actions
  setLoading: (isLoading: boolean) => void;
  
  // Game Data Actions
  setGameSettings: (settings: GameSetting | null) => void;
  setLotteryGameSettings: (settings: LotteryGameSetting[]) => void;
  setLotteryGamePermissions: (permissions: LotteryGamePermission[]) => void;
  setLotteryGameBoards: (boards: LotteryGameBoard[]) => void;
  setLotteryGameResults: (results: LotteryGameResult[]) => void;
  
  // User Data Actions
  setUserGameHistory: (history: LotteryGamePlay[]) => void;
  setUserRecharges: (recharges: Recharge[]) => void;
  setUserWithdrawals: (withdrawals: Withdraw[]) => void;
  setUserBankCards: (cards: BankCard[]) => void;
  
  // UI Actions
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  openModal: (type: string, data?: any) => void;
  closeModal: () => void;
  
  // Utility Actions
  updateUserBalance: (amount: number) => void;

  // Utility getters with defaults
  getUserBalance: () => number;
  getUserReferralCount: () => number;
  getUserDisplayName: () => string;

  api: typeof apiService;
  notification: {
    show: (message: string, type: 'success' | 'error' | 'warning' | 'info', duration?: number) => void;
  };
}

export const useStore = create<LotteryStore>()(
  persist(
    (set, get) => {
      // Create notification callback
      const notificationCallback = (message: string, type: 'success' | 'error' | 'warning' | 'info', duration = 5000) => {
        get().addNotification({ message, type, duration });
      };

      // Set up API service with notification callback
      apiService.setNotificationCallback(notificationCallback);

      return {
        // Initial State
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        
        gameSettings: null,
        lotteryGameSettings: [],
        lotteryGamePermissions: [],
        lotteryGameBoards: [],
        lotteryGameResults: [],
        
        userGameHistory: [],
        userRecharges: [],
        userWithdrawals: [],
        userBankCards: [],
        
        notifications: [],
        modals: {
          isOpen: false,
          type: '',
          data: null,
        },

        api: apiService,
        notification: {
          show: (message: string, type: 'success' | 'error' | 'warning' | 'info', duration = 5000) => {
            get().addNotification({ message, type, duration });
          },
        },

        // Auth Actions
        setUser: (user) => set({ user: user ? { ...user, availableAmount: Number(user.availableAmount) || 0 } : null }),
        setToken: (token) => set({ token }),
        setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
        logout: () => {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            userGameHistory: [],
            userRecharges: [],
            userWithdrawals: [],
            userBankCards: [],
          });
        },

        // Loading Actions
        setLoading: (isLoading) => set({ isLoading }),

        // Game Data Actions
        setGameSettings: (settings) => set({ gameSettings: settings }),
        setLotteryGameSettings: (settings) => set({ lotteryGameSettings: settings }),
        setLotteryGamePermissions: (permissions) => set({ lotteryGamePermissions: permissions }),
        setLotteryGameBoards: (boards) => set({ lotteryGameBoards: boards }),
        setLotteryGameResults: (results) => set({ lotteryGameResults: results }),

        // User Data Actions
        setUserGameHistory: (history) => set({ userGameHistory: history }),
        setUserRecharges: (recharges) => set({ userRecharges: recharges }),
        setUserWithdrawals: (withdrawals) => set({ userWithdrawals: withdrawals }),
        setUserBankCards: (cards) => set({ userBankCards: cards }),

        // UI Actions
        addNotification: (notification) => {
          const id = Date.now().toString();
          const duration = notification.duration ?? 5000;
          const newNotification: Notification = {
            id,
            ...notification,
            duration,
          };
          
          set((state) => ({
            notifications: [...state.notifications, newNotification],
          }));

          // Auto remove notification after duration
          if (duration > 0) {
            setTimeout(() => {
              get().removeNotification(id);
            }, duration);
          }
        },

        removeNotification: (id) =>
          set((state) => ({
            notifications: state.notifications.filter((n) => n.id !== id),
          })),

        clearNotifications: () => set({ notifications: [] }),

        openModal: (type, data) =>
          set({
            modals: {
              isOpen: true,
              type,
              data,
            },
          }),

        closeModal: () =>
          set({
            modals: {
              isOpen: false,
              type: '',
              data: null,
            },
          }),

        // Utility Actions
        updateUserBalance: (amount) =>
          set((state) => ({
            user: state.user ? { ...state.user, availableAmount: amount } : null,
          })),

        // Utility getters with defaults
        getUserBalance: () => {
          const state = get();
          return state.user?.availableAmount || 0;
        },

        getUserReferralCount: () => {
          const state = get();
          return state.user?.referralCount || 0;
        },

        getUserDisplayName: () => {
          const state = get();
          if (!state.user) return '';
          return state.user.firstName && state.user.lastName 
            ? `${state.user.firstName} ${state.user.lastName}`
            : state.user.email;
        },
      };
    },
    {
      name: 'lottery-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        gameSettings: state.gameSettings,
        lotteryGameSettings: state.lotteryGameSettings,
        lotteryGamePermissions: state.lotteryGamePermissions,
        lotteryGameBoards: state.lotteryGameBoards,
      }),
    }
  )
); 