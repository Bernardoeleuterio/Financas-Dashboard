"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowDownLeft, ArrowUpRight, Goal, Wallet } from "lucide-react";
import { BudgetsPanel } from "@/components/dashboard/BudgetsPanel";
import { CategoryChart } from "@/components/dashboard/CategoryChart";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { MonthlyChart } from "@/components/dashboard/MonthlyChart";
import { NewTransactionModal } from "@/components/dashboard/NewTransactionModal";
import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { TransactionsList } from "@/components/dashboard/TransactionsList";
import { getSavedFinancialProfile } from "@/lib/financialProfileStorage";
import { hasSupabaseConfig, supabase } from "@/lib/supabaseClient";
import type {
  Budget,
  FinancialProfile,
  NewTransactionInput,
  SummaryCard,
  Transaction,
} from "@/components/dashboard/types";

const initialCategories = [
  "Alimentacao",
  "Moradia",
  "Transporte",
  "Lazer",
  "Receita",
];

const initialTransactions: Transaction[] = [];
const budgets: Budget[] = [];
const categoryColors = ["#2563eb", "#16a34a", "#f59e0b", "#e11d48", "#7c3aed"];

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

function buildSummaryCards(profile: FinancialProfile | null): SummaryCard[] {
  const currentBalance = profile?.currentBalance ?? 8420.9;
  const monthlyIncome = profile?.monthlyIncome ?? 6750;
  const monthlyExpenses = profile?.monthlyExpenses ?? 0;
  const monthlySavingGoal = profile?.monthlySavingGoal ?? 0;
  const freeIncome = Math.max(monthlyIncome - monthlyExpenses, 0);
  const hasExpenses = profile?.monthlyExpenses !== null && profile?.monthlyExpenses !== undefined;
  const hasSavingGoal =
    profile?.monthlySavingGoal !== null &&
    profile?.monthlySavingGoal !== undefined;
  const expensePercentage =
    monthlyIncome > 0 && hasExpenses
      ? Math.round((monthlyExpenses / monthlyIncome) * 100)
      : 0;

  return [
    {
      label: "Saldo atual",
      value: currencyFormatter.format(currentBalance),
      change: profile ? profile.financialGoal : "+12,4% este mes",
      icon: Wallet,
      tone: "bg-emerald-100 text-emerald-700",
    },
    {
      label: "Receitas",
      value: currencyFormatter.format(monthlyIncome),
      change: "Renda mensal informada",
      icon: ArrowUpRight,
      tone: "bg-sky-100 text-sky-700",
    },
    {
      label: "Despesas",
      value: hasExpenses ? currencyFormatter.format(monthlyExpenses) : "A definir",
      change: hasExpenses ? `${expensePercentage}% da receita` : "Informe quando souber",
      icon: ArrowDownLeft,
      tone: "bg-rose-100 text-rose-700",
    },
    {
      label: "Meta mensal",
      value: hasSavingGoal
        ? currencyFormatter.format(monthlySavingGoal)
        : "A definir",
      change: hasSavingGoal
        ? `${currencyFormatter.format(freeIncome)} livre previsto`
        : "Voce pode ajustar depois",
      icon: Goal,
      tone: "bg-amber-100 text-amber-700",
    },
  ];
}

function buildMonthlyData(transactions: Transaction[]) {
  const currentMonth = new Date().toLocaleDateString("pt-BR", {
    month: "short",
  });

  return [
    {
      month: currentMonth.replace(".", ""),
      receitas: transactions
        .filter((transaction) => transaction.type === "income")
        .reduce((total, transaction) => total + transaction.numericAmount, 0),
      despesas: transactions
        .filter((transaction) => transaction.type === "expense")
        .reduce((total, transaction) => total + transaction.numericAmount, 0),
    },
  ];
}

function buildCategoryData(transactions: Transaction[]) {
  const totalsByCategory = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce<Record<string, number>>((totals, transaction) => {
      totals[transaction.category] =
        (totals[transaction.category] ?? 0) + transaction.numericAmount;

      return totals;
    }, {});

  return Object.entries(totalsByCategory).map(([name, value], index) => ({
    name,
    value,
    color: categoryColors[index % categoryColors.length],
  }));
}

export function DashboardView() {
  const router = useRouter();
  const [chartsReady, setChartsReady] = useState(false);
  const [categories, setCategories] = useState(initialCategories);
  const [financialProfile, setFinancialProfile] =
    useState<FinancialProfile | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactions, setTransactions] = useState(initialTransactions);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(async () => {
      setChartsReady(true);

      let currentUserId: string | null = null;

      if (hasSupabaseConfig) {
        const { data } = await supabase.auth.getUser();
        currentUserId = data.user?.id ?? null;
        setIsAuthenticated(Boolean(currentUserId));
      }

      const savedProfile = getSavedFinancialProfile(currentUserId);

      if (savedProfile) {
        setFinancialProfile(savedProfile);
        return;
      }

      if (currentUserId) {
        router.push("/onboarding");
        return;
      }
    });

    return () => cancelAnimationFrame(frame);
  }, [router]);

  function handleCreateTransaction(transaction: NewTransactionInput) {
    const signal = transaction.type === "income" ? "+" : "-";

    setTransactions((currentTransactions) => [
      {
        title: transaction.title,
        category: transaction.category,
        date: formatTransactionDate(transaction.date),
        rawDate: transaction.date,
        amount: `${signal} ${currencyFormatter.format(transaction.amount)}`,
        numericAmount: transaction.amount,
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
        <DashboardHeader
          isAuthenticated={isAuthenticated}
          onNewTransaction={() => setIsModalOpen(true)}
        />
        <SummaryCards cards={buildSummaryCards(financialProfile)} />

        <div className="grid gap-6 xl:grid-cols-[1.45fr_0.85fr]">
          <MonthlyChart data={buildMonthlyData(transactions)} isReady={chartsReady} />
          <CategoryChart data={buildCategoryData(transactions)} isReady={chartsReady} />
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
