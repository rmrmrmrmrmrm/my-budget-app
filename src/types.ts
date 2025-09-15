// src/types.ts
export interface Transaction {
  category: string;
  amount: number;
  date: string;
  isExpense: boolean;//出費かどうか
}