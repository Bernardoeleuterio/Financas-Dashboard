import {
  ArrowUpRight,
  CreditCard,
  Pencil,
  Search,
  Trash2,
} from "lucide-react";
import type { Transaction } from "./types";

type TransactionsListProps = {
  transactions: Transaction[];
  onDelete?: (transaction: Transaction) => void;
  onEdit?: (transaction: Transaction) => void;
};

export function TransactionsList({
  transactions,
  onDelete,
  onEdit,
}: TransactionsListProps) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-950">
            Transacoes recentes
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Ultimos lancamentos registrados.
          </p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <input
            className="h-10 w-full rounded-md border border-slate-300 bg-white pl-9 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            placeholder="Buscar transacao"
            type="search"
          />
        </div>
      </div>

      {transactions.length > 0 ? (
        <div className="divide-y divide-slate-100">
          {transactions.map((transaction) => (
          <div
            className="grid gap-3 p-5 sm:grid-cols-[1fr_auto] sm:items-center"
            key={transaction.id}
          >
            <div className="flex items-center gap-3">
              <span
                className={`inline-flex size-11 items-center justify-center rounded-md ${
                  transaction.type === "income"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-slate-100 text-slate-700"
                }`}
              >
                {transaction.type === "income" ? (
                  <ArrowUpRight className="size-5" />
                ) : (
                  <CreditCard className="size-5" />
                )}
              </span>
              <div>
                <h3 className="font-medium text-slate-950">
                  {transaction.title}
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  {transaction.category} | {transaction.paymentMethod} |{" "}
                  {transaction.date}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between gap-3 sm:justify-end">
              <strong
                className={`text-sm font-semibold ${
                  transaction.type === "income"
                    ? "text-emerald-700"
                    : "text-slate-950"
                }`}
              >
                {transaction.amount}
              </strong>
              {onEdit || onDelete ? (
                <div className="flex items-center gap-1">
                  {onEdit ? (
                    <button
                      aria-label={`Editar ${transaction.title}`}
                      className="inline-flex size-9 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 transition hover:border-emerald-300 hover:text-emerald-700"
                      onClick={() => onEdit(transaction)}
                      title="Editar transacao"
                      type="button"
                    >
                      <Pencil className="size-4" />
                    </button>
                  ) : null}
                  {onDelete ? (
                    <button
                      aria-label={`Excluir ${transaction.title}`}
                      className="inline-flex size-9 items-center justify-center rounded-md border border-rose-200 bg-white text-rose-600 transition hover:bg-rose-50"
                      onClick={() => onDelete(transaction)}
                      title="Excluir transacao"
                      type="button"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center text-sm leading-6 text-slate-500">
          Nenhuma transacao cadastrada ainda. Use o botao Nova transacao para
          comecar.
        </div>
      )}
    </section>
  );
}
