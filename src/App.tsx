import { useState, FormEvent } from 'react';
import './App.css'

interface Transaction {
  category: string;
  amount: number;
  date: string;
  isExpense: boolean;//出費かどうか
}

function App() {
  //家計簿の取引を管理
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  //入力フォームの値を管理
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState(0);
  const [date, setDate] = useState('');
  //収入か支出かを管理
  const [isExpense, setIsExpense] = useState(true);//デフォは支出
  //合計金額の管理
  const [totalBalance, setTotalBalance] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);

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

    //フォームをリセット
    setCategory('');
    setAmount(0);
    setDate('');

    //合計金額の更新
    if(isExpense) {
      setTotalExpenses(prev => prev +Math.abs(amount));
      setTotalBalance(prev => prev +Math.abs(amount));
    } else {
      setTotalIncome(prev => prev +Math.abs(amount));
      setTotalBalance(prev => prev +Math.abs(amount));
    }
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
      <form onSubmit={handleAddTransaction} className="mb-4 space-y-2">
        <select
          className="border p-2 w-full rounded-md"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="" disabled>カテゴリを選択</option>
          <option value="食費">食費</option>
          <option value="交通費">交通費</option>
          <option value="給料">給料</option>
          <option value="その他">その他</option>
        </select>


          <input
            type="number"
            placeholder="金額"
            className="border p-2 w-full rounded-md spin_erase"
            value={amount === 0 ? '' : amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />
          {/* 収入/支出のラジオボタン */}
          <div className="flex items-center space-x-2">
            <input
              type="radio"
              id="expense"
              name="type"
              checked={isExpense}
              onChange={() => setIsExpense(true)}
              className="form-radio text-red-500 h-4 w-4"
            />
            <label htmlFor="expense" className="text-sm font-medium text-gray-700">支出</label>
            <input
              type="radio"
              id="income"
              name="type"
              checked={!isExpense}
              onChange={() => setIsExpense(false)}
              className="form-radio text-green-500 h-4 w-4"
            />
            <label htmlFor="income" className="text-sm font-medium text-gray-700">収入</label>
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
              <span>{transaction.date}</span>
              ：
              <span className="mr-2">{getEmojiForCategory(transaction.category)}</span>
              <span className="font-semibold">{transaction.category}</span>
              ：
              <span className={`font-bold ${
                transaction.isExpense ? 'text-red-600' : 'text-green-600'
              }`}>
                {transaction.amount}円
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
