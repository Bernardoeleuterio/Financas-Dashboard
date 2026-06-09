"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowDownLeft, ArrowUpRight, Goal, Wallet } from "lucide-react";
import { BudgetsPanel } from "@/components/dashboard/BudgetsPanel";
import { CategoryChart } from "@/components/dashboard/CategoryChart";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { MonthlyChart } from "@/components/dashboard/MonthlyChart";
import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { TransactionsList } from "@/components/dashboard/TransactionsList";
import { AppShell } from "@/components/layout/AppShell";
import {
  getFinancialProfile,
  getTransactions,
} from "@/lib/financeRepository";
import { hasSupabaseConfig, supabase } from "@/lib/supabaseClient";
import type {
  Budget,
  FinancialProfile,
  SummaryCard,
  Transaction,
} from "@/components/dashboard/types";

const initialTransactions: Transaction[] = [];
const budgets: Budget[] = [];
const categoryColors = ["#2563eb", "#16a34a", "#f59e0b", "#e11d48", "#7c3aed"];

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

function buildSummaryCards(profile: FinancialProfile | null): SummaryCard[] {
  const currentBalance = profile?.currentBalance ?? 0;
  const monthlyIncome = profile?.monthlyIncome ?? 0;
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
  const [financialProfile, setFinancialProfile] =
    useState<FinancialProfile | null>(null);
  const [transactions, setTransactions] = useState(initialTransactions);

  useEffect(() => {
    const frame = requestAnimationFrame(async () => {
      setChartsReady(true);

      if (!hasSupabaseConfig) {
        return;
      }

      const { data } = await supabase.auth.getUser();
      const currentUserId = data.user?.id ?? null;

      if (!currentUserId) {
        router.push("/auth/login");
        return;
      }

      const profile = await getFinancialProfile(currentUserId);

      if (!profile) {
        router.push("/onboarding");
        return;
      }

      setFinancialProfile(profile);
      setTransactions(await getTransactions(currentUserId));
    });

    return () => cancelAnimationFrame(frame);
  }, [router]);

  return (
    <AppShell>
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-5 sm:px-6 lg:px-8">
        <DashboardHeader />
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
    </AppShell>
  );
}
