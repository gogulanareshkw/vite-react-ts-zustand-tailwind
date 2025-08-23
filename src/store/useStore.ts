import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { 
  AppState, 
  User, 
  ExtendedBankCard, 
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
  
  // User Data Actions
  setUserBankCards: (cards: ExtendedBankCard[]) => void;
  
  // UI Actions
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  
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
      return {
        // Initial State
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        
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
            userBankCards: [],
          });
        },

        // Loading Actions
        setLoading: (isLoading) => set({ isLoading }),

        // User Data Actions
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
        userBankCards: state.userBankCards,
      }),
    }
  )
); 