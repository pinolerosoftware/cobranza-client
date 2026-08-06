import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { LoanItem } from '@/types/loan';

interface LoanState {
  loans: LoanItem[];
  addLoan: (loan: LoanItem) => void;
  removeLoan: (id: number) => void;
}

export const useLoanStore = create<LoanState>()(
  persist(
    (set) => ({
      loans: [],
      addLoan: (loan) => set((state) => ({ loans: [loan, ...state.loans] })),
      removeLoan: (id) => set((state) => ({ loans: state.loans.filter((loan) => loan.id !== id) })),
    }),
    {
      name: 'loan-store',
    }
  )
);
