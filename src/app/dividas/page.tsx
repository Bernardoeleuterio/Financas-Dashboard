"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type {
  Debt,
  NewDebtInput,
  Transaction,
} from "@/components/dashboard/types";
import { DebtDetailsModal } from "@/components/debts/DebtDetailsModal";
import { NewDebtModal } from "@/components/debts/NewDebtModal";
import { AppShell } from "@/components/layout/AppShell";
import {
  createDebt,
  deleteDebt,
  getDebts,
  getTransactions,
  payDebtInstallment,
  updateDebt,
} from "@/lib/financeRepository";
import { supabase } from "@/lib/supabaseClient";
import styles from "@/styles/FinancePages.module.css";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

function monthDifference(startMonth: string, targetMonth: string) {
  const [startYear, startValue] = startMonth.split("-").map(Number);
  const [targetYear, targetValue] = targetMonth.split("-").map(Number);

  return (targetYear - startYear) * 12 + targetValue - startValue;
}

function isInstallmentDueInMonth(debt: Debt, selectedMonth: string) {
  if (
    debt.debtType !== "installment" ||
    debt.status === "paid" ||
    !debt.nextDueDate ||
    debt.totalInstallments === null ||
    debt.paidInstallments === null
  ) {
    return false;
  }

  const remaining = debt.totalInstallments - debt.paidInstallments;
  const difference = monthDifference(
    debt.nextDueDate.slice(0, 7),
    selectedMonth,
  );

  return difference >= 0 && difference < remaining;
}

export default function DebtsPage() {
  const router = useRouter();
  const [debts, setDebts] = useState<Debt[]>([]);
  const [editingDebt, setEditingDebt] = useState<Debt | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDebt, setSelectedDebt] = useState<Debt | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7),
  );
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  async function refreshData(currentUserId: string) {
    const [savedDebts, savedTransactions] = await Promise.all([
      getDebts(currentUserId),
      getTransactions(currentUserId),
    ]);
    setDebts(savedDebts);
    setTransactions(savedTransactions);
  }

  useEffect(() => {
    async function loadData() {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        router.push("/auth/login");
        return;
      }

      setUserId(data.user.id);
      await refreshData(data.user.id);
    }

    loadData();
  }, [router]);

  function getInvoiceTransactions(debtId: string) {
    return transactions.filter(
      (transaction) =>
        transaction.debtId === debtId &&
        transaction.type === "expense" &&
        transaction.rawDate.startsWith(selectedMonth),
    );
  }

  function getInvoiceTotal(debtId: string) {
    return getInvoiceTransactions(debtId).reduce(
      (total, transaction) => total + transaction.numericAmount,
      0,
    );
  }

  async function handleSaveDebt(debt: NewDebtInput) {
    if (!userId) return;

    if (editingDebt) {
      await updateDebt(editingDebt.id, debt);
    } else {
      await createDebt(userId, debt);
    }

    setEditingDebt(null);
    await refreshData(userId);
  }

  async function handlePayInstallment(debt: Debt) {
    if (!userId) return;
    await payDebtInstallment(debt);
    await refreshData(userId);
  }

  async function handleDeleteDebt(debtId: string) {
    if (!userId) return;
    await deleteDebt(debtId);
    await refreshData(userId);
  }

  const visibleDebts = debts.filter(
    (debt) =>
      debt.debtType === "credit_card" ||
      isInstallmentDueInMonth(debt, selectedMonth),
  );
  const monthlyCommitment = visibleDebts.reduce((total, debt) => {
    if (debt.debtType === "credit_card") {
      return total + getInvoiceTotal(debt.id);
    }

    return total + (debt.installmentAmount ?? 0);
  }, 0);
  const totalDebt = debts
    .filter(
      (debt) => debt.debtType === "installment" && debt.status !== "paid",
    )
    .reduce(
      (total, debt) =>
        total +
        (debt.installmentAmount ?? 0) *
          ((debt.totalInstallments ?? 0) - (debt.paidInstallments ?? 0)),
      0,
    );
  const monthLabel = new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    year: "numeric",
  }).format(new Date(`${selectedMonth}-01T00:00:00`));

  return (
    <AppShell>
      <div className={styles.page}>
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>Planejamento</p>
            <h1 className={styles.title}>Dividas e faturas</h1>
            <p className={styles.description}>
              Acompanhe parcelas, faturas de cartao e tudo que vence em cada
              mes.
            </p>
          </div>
          <button
            className={styles.primaryButton}
            onClick={() => {
              setEditingDebt(null);
              setIsModalOpen(true);
            }}
            type="button"
          >
            <Plus size={17} />
            Adicionar
          </button>
        </header>

        <div className={styles.summaryGrid}>
          <article className={styles.summaryItem}>
            <p className={styles.summaryLabel}>Saldo parcelado restante</p>
            <strong className={styles.summaryValue}>
              {currencyFormatter.format(totalDebt)}
            </strong>
          </article>
          <article className={styles.summaryItem}>
            <p className={styles.summaryLabel}>A pagar em {monthLabel}</p>
            <strong className={styles.summaryValue}>
              {currencyFormatter.format(monthlyCommitment)}
            </strong>
          </article>
          <article className={styles.summaryItem}>
            <p className={styles.summaryLabel}>Compromissos no mes</p>
            <strong className={styles.summaryValue}>
              {visibleDebts.length}
            </strong>
          </article>
        </div>

        <section className={styles.panel}>
          <header className={styles.panelHeader}>
            <h2 className={styles.panelTitle}>Vencimentos e faturas</h2>
            <input
              aria-label="Selecionar mes"
              className={styles.monthInput}
              onChange={(event) => setSelectedMonth(event.target.value)}
              type="month"
              value={selectedMonth}
            />
          </header>

          {visibleDebts.length > 0 ? (
            <div className={styles.debtGrid}>
              {visibleDebts.map((debt) => {
                const isCard = debt.debtType === "credit_card";
                const remaining =
                  debt.totalInstallments !== null &&
                  debt.paidInstallments !== null
                    ? debt.totalInstallments - debt.paidInstallments
                    : 0;
                const progress =
                  debt.totalInstallments && debt.paidInstallments !== null
                    ? Math.round(
                        (debt.paidInstallments / debt.totalInstallments) * 100,
                      )
                    : 0;
                const displayedAmount = isCard
                  ? getInvoiceTotal(debt.id)
                  : debt.installmentAmount ?? 0;

                return (
                  <article className={styles.debtCard} key={debt.id}>
                    <div className={styles.debtTop}>
                      <div>
                        <h3 className={styles.debtCreditor}>{debt.creditor}</h3>
                        <p className={styles.debtDescription}>
                          {debt.description}
                        </p>
                      </div>
                      <span
                        className={`${styles.status} ${
                          debt.status === "paid" ? styles.statusPaid : ""
                        }`}
                      >
                        {isCard
                          ? "Fatura"
                          : debt.status === "paid"
                            ? "Quitada"
                            : "Parcela"}
                      </span>
                    </div>

                    <strong className={styles.debtAmount}>
                      {currencyFormatter.format(displayedAmount)}
                      <span className={styles.debtDescription}>
                        {isCard ? ` vence dia ${debt.dueDay}` : " neste mes"}
                      </span>
                    </strong>

                    {isCard ? (
                      <div className={styles.debtMeta}>
                        <span>
                          {getInvoiceTransactions(debt.id).length} compras
                        </span>
                        <span>{monthLabel}</span>
                      </div>
                    ) : (
                      <>
                        <div className={styles.debtMeta}>
                          <span>{remaining} parcelas restantes</span>
                          <span>{progress}% pago</span>
                        </div>
                        <div className={styles.progress}>
                          <div
                            className={styles.progressBar}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </>
                    )}

                    <div className={styles.cardActions}>
                      <button
                        className={styles.secondaryButton}
                        onClick={() => setSelectedDebt(debt)}
                        type="button"
                      >
                        Detalhes
                      </button>
                      <button
                        className={styles.secondaryButton}
                        onClick={() => {
                          setEditingDebt(debt);
                          setIsModalOpen(true);
                        }}
                        type="button"
                      >
                        Editar
                      </button>
                      {!isCard && debt.status !== "paid" ? (
                        <button
                          className={styles.secondaryButton}
                          onClick={() => handlePayInstallment(debt)}
                          type="button"
                        >
                          Marcar paga
                        </button>
                      ) : null}
                      <button
                        className={styles.dangerButton}
                        onClick={() => handleDeleteDebt(debt.id)}
                        type="button"
                      >
                        Excluir
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <p className={styles.empty}>
              Nenhum compromisso encontrado para {monthLabel}.
            </p>
          )}
        </section>
      </div>

      {isModalOpen ? (
        <NewDebtModal
          initialDebt={editingDebt}
          onClose={() => {
            setEditingDebt(null);
            setIsModalOpen(false);
          }}
          onSave={handleSaveDebt}
        />
      ) : null}

      {selectedDebt ? (
        <DebtDetailsModal
          debt={selectedDebt}
          invoiceTransactions={getInvoiceTransactions(selectedDebt.id)}
          monthLabel={monthLabel}
          onClose={() => setSelectedDebt(null)}
        />
      ) : null}
    </AppShell>
  );
}
