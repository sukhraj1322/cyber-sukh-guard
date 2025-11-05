import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Card {
  id: string;
  name: string;
  number: string;
  expiry: string;
  cvv: string;
  type: 'Visa' | 'Master' | 'RuPay';
  blocked: boolean;
}

export interface Transaction {
  id: string;
  type: 'debit' | 'credit';
  amount: number;
  recipient: string;
  recipientAccount: string;
  date: Date;
  category: string;
  status: 'completed' | 'pending' | 'failed';
  safetyScore?: number;
  description?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  balance: number;
  walletName: string;
}

interface BankingContextType {
  user: User | null;
  isAuthenticated: boolean;
  twoFactorEnabled: boolean;
  biometricEnabled: boolean;
  cards: Card[];
  transactions: Transaction[];
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => void;
  addCard: (card: Omit<Card, 'id'>) => void;
  toggleCardBlock: (cardId: string) => void;
  updateBalance: (amount: number) => void;
  enableTwoFactor: () => void;
  enableBiometric: () => void;
}

const BankingContext = createContext<BankingContextType | undefined>(undefined);

export function BankingProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [cards, setCards] = useState<Card[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Load from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('sukh_bank_user');
    const storedCards = localStorage.getItem('sukh_bank_cards');
    const storedTransactions = localStorage.getItem('sukh_bank_transactions');
    const stored2FA = localStorage.getItem('sukh_bank_2fa');
    const storedBio = localStorage.getItem('sukh_bank_biometric');

    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
    if (storedCards) setCards(JSON.parse(storedCards));
    if (storedTransactions) {
      const parsed = JSON.parse(storedTransactions);
      setTransactions(parsed.map((t: any) => ({ ...t, date: new Date(t.date) })));
    }
    if (stored2FA) setTwoFactorEnabled(JSON.parse(stored2FA));
    if (storedBio) setBiometricEnabled(JSON.parse(storedBio));
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('sukh_bank_user', JSON.stringify(user));
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('sukh_bank_cards', JSON.stringify(cards));
  }, [cards]);

  useEffect(() => {
    localStorage.setItem('sukh_bank_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('sukh_bank_2fa', JSON.stringify(twoFactorEnabled));
  }, [twoFactorEnabled]);

  useEffect(() => {
    localStorage.setItem('sukh_bank_biometric', JSON.stringify(biometricEnabled));
  }, [biometricEnabled]);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate login
    if (email && password) {
      const newUser: User = {
        id: '1',
        name: 'Sukh',
        email: email,
        mobile: '+91 98765 43210',
        balance: 125000.50,
        walletName: 'Sukh Wallet'
      };
      
      setUser(newUser);
      setIsAuthenticated(true);

      // Initialize default cards if none exist
      if (cards.length === 0) {
        const defaultCards: Card[] = [
          {
            id: '1',
            name: 'Sukh Card',
            number: '4532 1234 5678 9010',
            expiry: '12/26',
            cvv: '123',
            type: 'Visa',
            blocked: false
          },
          {
            id: '2',
            name: 'Sukh Premium',
            number: '5412 9876 5432 1098',
            expiry: '09/27',
            cvv: '456',
            type: 'Master',
            blocked: false
          }
        ];
        setCards(defaultCards);
      }

      // Initialize sample transactions
      if (transactions.length === 0) {
        const sampleTransactions: Transaction[] = [
          {
            id: '1',
            type: 'credit',
            amount: 25000,
            recipient: 'Salary',
            recipientAccount: 'COMPANY001',
            date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
            category: 'Income',
            status: 'completed',
            safetyScore: 100
          },
          {
            id: '2',
            type: 'debit',
            amount: 1200,
            recipient: 'Amazon',
            recipientAccount: 'amazon@upi',
            date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            category: 'Shopping',
            status: 'completed',
            safetyScore: 95
          },
          {
            id: '3',
            type: 'debit',
            amount: 500,
            recipient: 'Swiggy',
            recipientAccount: 'swiggy@paytm',
            date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            category: 'Food',
            status: 'completed',
            safetyScore: 98
          }
        ];
        setTransactions(sampleTransactions);
      }

      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('sukh_bank_user');
  };

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'date'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
      date: new Date()
    };
    
    setTransactions(prev => [newTransaction, ...prev]);
    
    // Update balance
    if (transaction.type === 'debit') {
      updateBalance(-transaction.amount);
    } else {
      updateBalance(transaction.amount);
    }
  };

  const addCard = (card: Omit<Card, 'id'>) => {
    const newCard: Card = {
      ...card,
      id: Date.now().toString()
    };
    setCards(prev => [...prev, newCard]);
  };

  const toggleCardBlock = (cardId: string) => {
    setCards(prev =>
      prev.map(card =>
        card.id === cardId ? { ...card, blocked: !card.blocked } : card
      )
    );
  };

  const updateBalance = (amount: number) => {
    setUser(prev => prev ? { ...prev, balance: prev.balance + amount } : null);
  };

  const enableTwoFactor = () => {
    setTwoFactorEnabled(true);
  };

  const enableBiometric = () => {
    setBiometricEnabled(true);
  };

  return (
    <BankingContext.Provider
      value={{
        user,
        isAuthenticated,
        twoFactorEnabled,
        biometricEnabled,
        cards,
        transactions,
        login,
        logout,
        addTransaction,
        addCard,
        toggleCardBlock,
        updateBalance,
        enableTwoFactor,
        enableBiometric
      }}
    >
      {children}
    </BankingContext.Provider>
  );
}

export function useBanking() {
  const context = useContext(BankingContext);
  if (context === undefined) {
    throw new Error('useBanking must be used within a BankingProvider');
  }
  return context;
}
