"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { NewTransactionModal } from "@/components/dashboard/NewTransactionModal";
import { TransactionsList } from "@/components/dashboard/TransactionsList";
import type {
  NewTransactionInput,
  Transaction,
} from "@/components/dashboard/types";
import { AppShell } from "@/components/layout/AppShell";
import {
  createCategory,
  createTransaction,
  getCategories,
  getDebts,
  getTransactions,
  type FinanceCategory,
} from "@/lib/financeRepository";
import { supabase } from "@/lib/supabaseClient";
import styles from "@/styles/FinancePages.module.css";

export default function TransactionsPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<FinanceCategory[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [creditCards, setCreditCards] = useState<
    { id: string; name: string }[]
  >([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        router.push("/auth/login");
        return;
      }

      setUserId(data.user.id);
      const [savedCategories, savedTransactions, savedDebts] = await Promise.all([
        getCategories(data.user.id),
        getTransactions(data.user.id),
        getDebts(data.user.id),
      ]);
      setCategories(savedCategories);
      setTransactions(savedTransactions);
      setCreditCards(
        savedDebts
          .filter((debt) => debt.debtType === "credit_card")
          .map((debt) => ({ id: debt.id, name: debt.creditor })),
      );
    }

    loadData();
  }, [router]);

  async function handleCreateTransaction(transaction: NewTransactionInput) {
    if (!userId) return;

    const category = categories.find(
      (item) => item.name === transaction.category,
    );

    if (!category) return;

    await createTransaction(userId, category.id, transaction);
    setTransactions(await getTransactions(userId));
  }

  async function handleCreateCategory(name: string) {
    if (!userId) return null;

    const existing = categories.find(
      (category) => category.name.toLowerCase() === name.toLowerCase(),
    );

    if (existing) return existing.name;

    const category = await createCategory(userId, name);
    setCategories((current) => [...current, category]);
    return category.name;
  }

  const income = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce((total, transaction) => total + transaction.numericAmount, 0);
  const expenses = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((total, transaction) => total + transaction.numericAmount, 0);

  return (
    <AppShell>
      <div className={styles.page}>
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>Movimentacoes</p>
            <h1 className={styles.title}>Transacoes</h1>
            <p className={styles.description}>
              Registre e acompanhe tudo que entrou e saiu da sua conta.
            </p>
          </div>
          <button
            className={styles.primaryButton}
            onClick={() => setIsModalOpen(true)}
            type="button"
          >
            <Plus size={17} />
            Nova transacao
          </button>
        </header>

        <div className={styles.summaryGrid}>
          <article className={styles.summaryItem}>
            <p className={styles.summaryLabel}>Receitas registradas</p>
            <strong className={styles.summaryValue}>
              {income.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </strong>
          </article>
          <article className={styles.summaryItem}>
            <p className={styles.summaryLabel}>Despesas registradas</p>
            <strong className={styles.summaryValue}>
              {expenses.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </strong>
          </article>
          <article className={styles.summaryItem}>
            <p className={styles.summaryLabel}>Quantidade</p>
            <strong className={styles.summaryValue}>
              {transactions.length}
            </strong>
          </article>
        </div>

        <TransactionsList transactions={transactions} />
      </div>

      {isModalOpen ? (
        <NewTransactionModal
          categories={categories.map((category) => category.name)}
          creditCards={creditCards}
          onClose={() => setIsModalOpen(false)}
          onCreate={handleCreateTransaction}
          onCreateCategory={handleCreateCategory}
        />
      ) : null}
    </AppShell>
  );
}
