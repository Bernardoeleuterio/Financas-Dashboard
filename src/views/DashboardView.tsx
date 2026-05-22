"use client";

import { useEffect, useState } from "react";
import { ArrowDownLeft, ArrowUpRight, Goal, Wallet } from "lucide-react";
import { BudgetsPanel } from "@/components/dashboard/BudgetsPanel";
import { CategoryChart } from "@/components/dashboard/CategoryChart";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { MonthlyChart } from "@/components/dashboard/MonthlyChart";
import { NewTransactionModal } from "@/components/dashboard/NewTransactionModal";
import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { TransactionsList } from "@/components/dashboard/TransactionsList";
import type {
  NewTransactionInput,
  Transaction,
} from "@/components/dashboard/types";

const summaryCards = [
  {
    label: "Saldo atual",
    value: "R$ 8.420,90",
    change: "+12,4% este mes",
    icon: Wallet,
    tone: "bg-emerald-100 text-emerald-700",
  },
  {
    label: "Receitas",
    value: "R$ 6.750,00",
    change: "+R$ 850 vs. abril",
    icon: ArrowUpRight,
    tone: "bg-sky-100 text-sky-700",
  },
  {
    label: "Despesas",
    value: "R$ 3.184,20",
    change: "47% da receita",
    icon: ArrowDownLeft,
    tone: "bg-rose-100 text-rose-700",
  },
  {
    label: "Meta guardada",
    value: "R$ 2.150,00",
    change: "72% da meta",
    icon: Goal,
    tone: "bg-amber-100 text-amber-700",
  },
];

const monthlyData = [
  { month: "Jan", receitas: 5200, despesas: 3100 },
  { month: "Fev", receitas: 5900, despesas: 3400 },
  { month: "Mar", receitas: 6100, despesas: 3980 },
  { month: "Abr", receitas: 5900, despesas: 3600 },
  { month: "Mai", receitas: 6750, despesas: 3184 },
  { month: "Jun", receitas: 6400, despesas: 3350 },
];

const categoryData = [
  { name: "Moradia", value: 1240, color: "#2563eb" },
  { name: "Alimentacao", value: 860, color: "#16a34a" },
  { name: "Transporte", value: 420, color: "#f59e0b" },
  { name: "Lazer", value: 330, color: "#e11d48" },
];

const initialCategories = [
  "Alimentacao",
  "Moradia",
  "Transporte",
  "Lazer",
  "Receita",
];

const initialTransactions: Transaction[] = [
  {
    title: "Salario",
    category: "Receita",
    date: "20 mai",
    amount: "+ R$ 5.800,00",
    paymentMethod: "Pix",
    type: "income" as const,
  },
  {
    title: "Mercado semanal",
    category: "Alimentacao",
    date: "19 mai",
    amount: "- R$ 286,40",
    paymentMethod: "Cartao",
    type: "expense" as const,
  },
  {
    title: "Internet",
    category: "Moradia",
    date: "18 mai",
    amount: "- R$ 119,90",
    paymentMethod: "Boleto",
    type: "expense" as const,
  },
  {
    title: "Freelance landing page",
    category: "Receita",
    date: "16 mai",
    amount: "+ R$ 950,00",
    paymentMethod: "Pix",
    type: "income" as const,
  },
];

const budgets = [
  { name: "Alimentacao", spent: 860, limit: 1200, color: "bg-emerald-500" },
  { name: "Transporte", spent: 420, limit: 650, color: "bg-amber-500" },
  { name: "Lazer", spent: 330, limit: 500, color: "bg-rose-500" },
];

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

function formatTransactionDate(date: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
  })
    .format(new Date(`${date}T00:00:00`))
    .replace(".", "");
}

export function DashboardView() {
  const [chartsReady, setChartsReady] = useState(false);
  const [categories, setCategories] = useState(initialCategories);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactions, setTransactions] = useState(initialTransactions);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setChartsReady(true));

    return () => cancelAnimationFrame(frame);
  }, []);

  function handleCreateTransaction(transaction: NewTransactionInput) {
    const signal = transaction.type === "income" ? "+" : "-";

    setTransactions((currentTransactions) => [
      {
        title: transaction.title,
        category: transaction.category,
        date: formatTransactionDate(transaction.date),
        amount: `${signal} ${currencyFormatter.format(transaction.amount)}`,
        paymentMethod: transaction.paymentMethod,
        type: transaction.type,
      },
      ...currentTransactions,
    ]);
  }

  function handleCreateCategory(category: string) {
    const formattedCategory = category.trim();

    if (!formattedCategory) {
      return;
    }

    setCategories((currentCategories) => {
      const categoryAlreadyExists = currentCategories.some(
        (currentCategory) =>
          currentCategory.toLowerCase() === formattedCategory.toLowerCase(),
      );

      if (categoryAlreadyExists) {
        return currentCategories;
      }

      return [...currentCategories, formattedCategory];
    });
  }

  return (
    <main className="min-h-screen bg-slate-100 text-slate-950">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-5 sm:px-6 lg:px-8">
        <DashboardHeader onNewTransaction={() => setIsModalOpen(true)} />
        <SummaryCards cards={summaryCards} />

        <div className="grid gap-6 xl:grid-cols-[1.45fr_0.85fr]">
          <MonthlyChart data={monthlyData} isReady={chartsReady} />
          <CategoryChart data={categoryData} isReady={chartsReady} />
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          <TransactionsList transactions={transactions} />
          <BudgetsPanel budgets={budgets} />
        </div>
      </section>

      {isModalOpen ? (
        <NewTransactionModal
          categories={categories}
          onClose={() => setIsModalOpen(false)}
          onCreateCategory={handleCreateCategory}
          onCreate={handleCreateTransaction}
        />
      ) : null}
    </main>
  );
}
