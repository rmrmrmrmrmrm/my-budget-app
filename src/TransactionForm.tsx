// src/TransactionForm.tsx
import type { FormEvent } from 'react';

interface TransactionFormProps {
  category: string;
  setCategory: (value: string) => void;
  amount: number;
  setAmount: (value: number) => void;
  date: string;
  setDate: (value: string) => void;
  isExpense: boolean;
  setIsExpense: (value: boolean) => void;
  onAddTransaction: (e: FormEvent) => void;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
  category,
  setCategory,
  amount,
  setAmount,
  date,
  setDate,
  isExpense,
  setIsExpense,
  onAddTransaction,
}) => {
  return (
    <form onSubmit={onAddTransaction} className="mb-4 space-y-2">
      <select
        className="border p-2 w-full rounded-md"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="" disabled>
          カテゴリを選択
        </option>
        <option value="食費">食費</option>
        <option value="交通費">交通費</option>
        <option value="給料">給料</option>
        <option value="その他">その他</option>
      </select>

      <input
        type="number"
        placeholder="金額"
        className="border p-2 w-full rounded-md spin_erase"
        value={amount === 0 ? "" : amount}
        onChange={(e) => setAmount(Number(e.target.value))}
      />

      <div className="flex items-center space-x-2">
        <input
          type="radio"
          id="expense"
          name="type"
          checked={isExpense}
          onChange={() => setIsExpense(true)}
          className="form-radio text-red-500 h-4 w-4"
        />
        <label htmlFor="expense" className="text-sm font-medium text-gray-700">
          支出
        </label>
        <input
          type="radio"
          id="income"
          name="type"
          checked={!isExpense}
          onChange={() => setIsExpense(false)}
          className="form-radio text-green-500 h-4 w-4"
        />
        <label htmlFor="income" className="text-sm font-medium text-gray-700">
          収入
        </label>
      </div>

      <input
        type="date"
        className="border p-2 w-full"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded w-full"
      >
        追加
      </button>
    </form>
  );
};
