import { useState,useEffect } from 'react';
import type { FormEvent } from 'react';
import './App.css'
import type { Transaction } from "./types";
import { TransactionList } from "./TransactionList";
import { TransactionForm } from "./TransactionForm";

function App() {
  //家計簿の取引を管理
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  //入力フォームの値を管理
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState(0);
  const [date, setDate] = useState('');
  //収入か支出かを管理
  const [isExpense, setIsExpense] = useState(true);//デフォは支出
  //年月を管理
  const [selectedMonth, setSelectedMonth] = useState<string>('');

  //初期表示時にローカルストレージのデータを読み込む
  useEffect(() => {
    const saved = localStorage.getItem("transactions");
    if (saved) {
      setTransactions(JSON.parse(saved));
    }
  }, []);

  //年月のフィルタリング
  const filteredTransactions = transactions.filter(tx => {
    if (!selectedMonth) return true; // 未選択なら全部表示
    const txDate = new Date(tx.date);
    const txYearMonth = `${txDate.getFullYear()}-${String(txDate.getMonth() + 1).padStart(2, '0')}`;
    return txYearMonth === selectedMonth;
  });
  //登録されているデータから年月リストを抽出
  const uniqueMonths = Array.from(
    new Set(
      transactions.map(tx => {
        const d = new Date(tx.date);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      })
    )
  ).sort((a, b) => b.localeCompare(a)); // 新しい月が上にくるようにソート
  // 合計を計算（フィルタ後）
  const totalIncome = filteredTransactions
    .filter(tx => !tx.isExpense)
    .reduce((sum, tx) => sum + tx.amount, 0);
  const totalExpenses = filteredTransactions
    .filter(tx => tx.isExpense)
    .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
  const totalBalance = totalIncome - totalExpenses;


  //追加ボタンの挙動
  const handleAddTransaction = (e: FormEvent) => {
    e.preventDefault();//デフォルト送信防止
    
    //カテゴリと金額がセットされているか
    if(!category || amount === 0 || !date) {
      alert('カテゴリと金額と日付をすべてセットしてください。');
      return;
    }

    //金額の符号をラジオボタンに応じて変更
    const finalAmount = isExpense ? -Math.abs(amount) : Math.abs(amount);

    //新しい取引オブジェクトを作成
    const newTransaction: Transaction = {
      category,
      date,
      isExpense,
      amount: finalAmount,
    }

    //既存のリストに新しい取引を追加
    setTransactions([...transactions, newTransaction]);
    //ローカルストレージに保存※文字列しか持たせられない
    localStorage.setItem("transactions", JSON.stringify([...transactions, newTransaction]));

    //フォームをリセット
    setCategory('');
    setAmount(0);
    setDate('');
  };



  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">家計簿</h1>

      {/* 合計金額の表示 */}
      <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600 font-medium">残高</span>
          <span className={`text-2xl font-bold ${totalBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {totalBalance.toLocaleString()}円
          </span>
        </div>
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>支出合計: <span className="text-red-500 font-semibold">{totalExpenses.toLocaleString()}円</span></span>
          <span>収入合計: <span className="text-green-500 font-semibold">{totalIncome.toLocaleString()}円</span></span>
        </div>
      </div>

      {/* 入力フォーム */}
      <TransactionForm
        category={category}
        setCategory={setCategory}
        amount={amount}
        setAmount={setAmount}
        date={date}
        setDate={setDate}
        isExpense={isExpense}
        setIsExpense={setIsExpense}
        onAddTransaction={handleAddTransaction}
      />

      <hr className='mt-4 mb-4' />

      {/* 年月のフィルタリング */}
      <div>
        <label className="block mb-1 text-sm font-medium">表示期間</label>
        <select
          className="border p-2 w-full mb-4"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          <option value="">全ての期間</option>
          {uniqueMonths.map(month => {
            const [year, m] = month.split("-");
            return (
              <option key={month} value={month}>
                {year}年{m}月
              </option>
            );
          })}
        </select>
      </div>

      {/* リスト */}
      <TransactionList transactions={filteredTransactions} />
    </div>
  );
}

export default App;
