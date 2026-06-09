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
  id: string;
  debtId: string | null;
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
  debtId: string | null;
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

export type Debt = {
  id: string;
  debtType: "installment" | "credit_card";
  creditor: string;
  description: string;
  totalAmount: number | null;
  installmentAmount: number | null;
  totalInstallments: number | null;
  paidInstallments: number | null;
  dueDay: number | null;
  nextDueDate: string | null;
  status: "active" | "paid" | "overdue";
  notes: string | null;
};

export type NewDebtInput = Omit<Debt, "id" | "status">;
