import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { api } from '../services/api';

type Transaction = {
  id: number;
  title: string;
  amount: number;
  category: string;
  type: string;
  createdAt: string;
};

type Summary = {
  deposit: number;
  withdraw: number;
  total: number;
};

type TransactionInput = Omit<Transaction, 'id' | 'createdAt'>;

interface TransactionsProviderProps {
  children: ReactNode;
}

interface TransactionsContextDate {
  transactions: Array<Transaction>;
  summary: Summary;
  createTransaction: (transaction: TransactionInput) => Promise<void>;
}

const TransactionsContext = createContext<TransactionsContextDate>(
  {} as TransactionsContextDate,
);

export function TransactionsProvider({ children }: TransactionsProviderProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const summary = useMemo(() => {
    const summaryTemp = transactions.reduce(
      (acc: Summary, transaction) => {
        if (transaction.type === 'deposit') {
          acc.deposit += transaction.amount;
          acc.total += transaction.amount;
        } else {
          acc.withdraw += transaction.amount;
          acc.total -= transaction.amount;
        }
        return acc;
      },
      {
        deposit: 0,
        withdraw: 0,
        total: 0,
      },
    );

    return summaryTemp;
  }, [transactions]);

  useEffect(() => {
    api.get('/transactions').then(response => {
      setTransactions(response.data.transactions);
    });
  }, []);

  async function createTransaction(transactionInput: TransactionInput) {
    try {
      const response = await api.post('/transactions', {
        ...transactionInput,
        createdAt: new Date(),
      });

      const { transaction } = response.data;
      setTransactions([...transactions, transaction]);
    } catch (err) {}
  }

  return (
    <TransactionsContext.Provider
      value={{ transactions, summary, createTransaction }}
    >
      {children}
    </TransactionsContext.Provider>
  );
}

export function useTransactions() {
  const context = useContext(TransactionsContext);

  return context;
}
