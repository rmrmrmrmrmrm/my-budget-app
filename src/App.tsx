import React, { useState, FormEvent } from 'react';

// 型はひとまずany
interface Transaction {
  category: string;
  amount: number;
  date: string;
  isExpense: boolean;//出費かどうか
}

function App() {
  //家計簿の取引を管理
  const [transactions, setTransactions] = useState<any[]>([]);
  //入力フォームの値を管理
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState(0);
  const [date, setDate] = useState('');

  //追加ボタンの挙動
  const handleAddTransaction = (e: FormEvent) => {
    e.preventDefault();//デフォルト送信防止
    
    //カテゴリと金額がセットされているか
    if(!category || amount === 0) {
      alert('カテゴリと金額がセットしてください。');
      return;
    }

    //新しい取引オブジェクトを作成
    const newTransaction: Transaction = {
      category,
      amount,
      date,
      isExpense: amount < 0,//金額がマイナスなら支出
    }

    //既存のリストに新しい取引を追加
    setTransactions([...transactions, newTransaction]);

    //フォームをリセット
    setCategory('');
    setAmount(0);
    setDate('');
  };

  //カテゴリ
  const getEmojiForCategory = (cat: string) => {
    if (cat.includes('食費')) return '🍔';
    if (cat.includes('交通費')) return '🚃';
    if (cat.includes('給料')) return '💰';
    return '📝'; // その他
  };



  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">家計簿</h1>

      {/* 入力フォーム */}
      <form onSubmit={handleAddTransaction} className="mb-4 space-y-2">
        <input
          type="text"
          placeholder="カテゴリ"
          className="border p-2 w-full"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <input
          type="number"
          placeholder="金額"
          className="border p-2 w-full"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />
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

      {/* リスト */}
      <ul className="space-y-2">
        {transactions.map((transaction, index) => (
          <li
            key={index} // リストのアイテムには一意のキーが必要
            className={`border p-2 rounded-lg flex justify-between items-center ${
              transaction.isExpense ? 'border-red-400' : 'border-green-400'
            }`}
          >
            <div>
              <span className="mr-2">{getEmojiForCategory(transaction.category)}</span>
              <span className="font-semibold">{transaction.category}</span>
            </div>
            <span className={`font-bold ${
              transaction.isExpense ? 'text-red-600' : 'text-green-600'
            }`}>
              {transaction.amount}円
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
