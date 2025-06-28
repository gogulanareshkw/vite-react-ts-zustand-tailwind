import { create } from 'zustand';

interface CounterState {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
}

interface ApiState {
  data: any;
  loading: boolean;
  error: string | null;
  fetchData: () => Promise<void>;
}

interface AppState extends CounterState, ApiState {}

export const useStore = create<AppState>((set, get) => ({
  // Counter state
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),

  // API state
  data: null,
  loading: false,
  error: null,
  fetchData: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch('https://api.github.com/users/octocat');
      const data = await response.json();
      set({ data, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch data', loading: false });
    }
  },
})); 