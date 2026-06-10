import { X } from "lucide-react";
import type { Debt, Transaction } from "@/components/dashboard/types";
import styles from "@/styles/DebtModal.module.css";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

type DebtDetailsModalProps = {
  debt: Debt;
  invoiceTransactions: Transaction[];
  monthLabel: string;
  selectedMonth: string;
  onClose: () => void;
};

export function DebtDetailsModal({
  debt,
  invoiceTransactions,
  monthLabel,
  selectedMonth,
  onClose,
}: DebtDetailsModalProps) {
  const openingAmount =
    debt.openingInvoiceMonth?.slice(0, 7) === selectedMonth
      ? debt.openingInvoiceAmount ?? 0
      : 0;
  const invoiceTotal =
    openingAmount +
    invoiceTransactions.reduce(
      (total, transaction) => total + transaction.numericAmount,
      0,
    );
  const remaining =
    debt.totalInstallments !== null && debt.paidInstallments !== null
      ? debt.totalInstallments - debt.paidInstallments
      : null;

  return (
    <div className={styles.overlay}>
      <section className={styles.modal} role="dialog">
        <header className={styles.header}>
          <div>
            <h2 className={styles.title}>{debt.creditor}</h2>
            <p className={styles.description}>{debt.description}</p>
          </div>
          <button
            aria-label="Fechar"
            className={styles.close}
            onClick={onClose}
            type="button"
          >
            <X size={18} />
          </button>
        </header>

        <div className={styles.details}>
          {debt.debtType === "credit_card" ? (
            <>
              <div className={styles.detailsGrid}>
                <div className={styles.detailItem}>
                  <p className={styles.detailLabel}>Fatura de {monthLabel}</p>
                  <strong className={styles.detailValue}>
                    {currencyFormatter.format(invoiceTotal)}
                  </strong>
                </div>
                <div className={styles.detailItem}>
                  <p className={styles.detailLabel}>Vencimento</p>
                  <strong className={styles.detailValue}>
                    Dia {debt.dueDay}
                  </strong>
                </div>
                <div className={styles.detailItem}>
                  <p className={styles.detailLabel}>Valor inicial informado</p>
                  <strong className={styles.detailValue}>
                    {currencyFormatter.format(openingAmount)}
                  </strong>
                </div>
              </div>

              <div>
                <p className={styles.label}>Compras desta fatura</p>
                {invoiceTransactions.length > 0 ? (
                  <div className={styles.purchaseList}>
                    {invoiceTransactions.map((transaction) => (
                      <div className={styles.purchase} key={transaction.id}>
                        <div>
                          <strong>{transaction.title}</strong>
                          <p className={styles.description}>
                            {transaction.category} | {transaction.date}
                          </p>
                        </div>
                        <strong>
                          {currencyFormatter.format(transaction.numericAmount)}
                        </strong>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className={styles.description}>
                    Nenhuma compra vinculada a este cartao no mes.
                  </p>
                )}
              </div>
            </>
          ) : (
            <div className={styles.detailsGrid}>
              <div className={styles.detailItem}>
                <p className={styles.detailLabel}>Valor total</p>
                <strong className={styles.detailValue}>
                  {currencyFormatter.format(debt.totalAmount ?? 0)}
                </strong>
              </div>
              <div className={styles.detailItem}>
                <p className={styles.detailLabel}>Valor da parcela</p>
                <strong className={styles.detailValue}>
                  {currencyFormatter.format(debt.installmentAmount ?? 0)}
                </strong>
              </div>
              <div className={styles.detailItem}>
                <p className={styles.detailLabel}>Parcelas pagas</p>
                <strong className={styles.detailValue}>
                  {debt.paidInstallments ?? 0} de {debt.totalInstallments ?? 0}
                </strong>
              </div>
              <div className={styles.detailItem}>
                <p className={styles.detailLabel}>Parcelas restantes</p>
                <strong className={styles.detailValue}>{remaining ?? 0}</strong>
              </div>
              <div className={styles.detailItem}>
                <p className={styles.detailLabel}>Proximo vencimento</p>
                <strong className={styles.detailValue}>
                  {debt.nextDueDate
                    ? new Date(`${debt.nextDueDate}T00:00:00`).toLocaleDateString(
                        "pt-BR",
                      )
                    : "Nao informado"}
                </strong>
              </div>
              <div className={styles.detailItem}>
                <p className={styles.detailLabel}>Observacoes</p>
                <strong className={styles.detailValue}>
                  {debt.notes || "Nenhuma"}
                </strong>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
