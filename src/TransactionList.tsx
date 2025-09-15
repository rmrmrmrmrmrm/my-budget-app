// src/TransactionList.tsx
import React from "react";
import type { Transaction } from "./types";

interface TransactionListProps {
  transactions: Transaction[];
}

const getEmojiForCategory = (cat: string) => {
  if (cat.includes("食費")) return "🍔";
  if (cat.includes("交通費")) return "🚃";
  if (cat.includes("給料")) return "💰";
  return "📝"; // その他
};

export const TransactionList: React.FC<TransactionListProps> = ({ transactions }) => {
  return (
    <ul className="space-y-2">
      {transactions.map((transaction, index) => (
        <li
          key={index}
          className={`border p-2 rounded-lg flex justify-between items-center ${
            transaction.isExpense ? "border-red-400" : "border-green-400"
          }`}
        >
          <div>
            <span>{transaction.date}</span>
            ：
            <span className="mr-2">{getEmojiForCategory(transaction.category)}</span>
            <span className="font-semibold">{transaction.category}</span>
            ：
            <span
              className={`font-bold ${
                transaction.isExpense ? "text-red-600" : "text-green-600"
              }`}
            >
              {transaction.amount}円
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
};
