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
  amount: string;
  type: "income" | "expense";
};

export type Budget = {
  name: string;
  spent: number;
  limit: number;
  color: string;
};
