import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const MAX = 3;

export const useCompareStore = create(
  persist(
    (set, get) => ({
      tractors: [],
      toggle: (tractor) => {
        const { tractors } = get();
        const exists = tractors.find((t) => t.id === tractor.id);
        if (exists) {
          set({ tractors: tractors.filter((t) => t.id !== tractor.id) });
          return;
        }
        if (tractors.length >= MAX) return;
        set({ tractors: [...tractors, tractor] });
      },
      remove: (id) => set({ tractors: get().tractors.filter((t) => t.id !== id) }),
      clear: () => set({ tractors: [] })
    }),
    { name: 'khetihub-compare' }
  )
);
