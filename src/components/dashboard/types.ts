import type { LucideIcon } from "lucide-react";

export type SummaryCard = {
  label: string;
  value: string;
  change: string;
  icon: LucideIcon;
  tone: string;
};

export type MonthlyFinance = {
  month: string;
  receitas: number;
  despesas: number;
};

export type CategoryExpense = {
  name: string;
  value: number;
  color: string;
};

export type Transaction = {
  title: string;
  category: string;
  date: string;
  rawDate: string;
  amount: string;
  numericAmount: number;
  paymentMethod: string;
  type: "income" | "expense";
};

export type NewTransactionInput = {
  title: string;
  category: string;
  date: string;
  amount: number;
  paymentMethod: string;
  type: "income" | "expense";
};

export type FinancialProfile = {
  fullName: string;
  occupation: string;
  age: number;
  currentBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number | null;
  monthlySavingGoal: number | null;
  financialGoal: string;
};

export type Budget = {
  name: string;
  spent: number;
  limit: number;
  color: string;
};
