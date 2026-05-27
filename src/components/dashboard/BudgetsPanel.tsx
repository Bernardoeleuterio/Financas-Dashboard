import { currencyFormatter } from "./formatters";
import type { Budget } from "./types";

type BudgetsPanelProps = {
  budgets: Budget[];
};

export function BudgetsPanel({ budgets }: BudgetsPanelProps) {
  return (
    <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-950">Orcamentos</h2>
      <p className="mt-1 text-sm text-slate-500">
        Limites definidos por categoria.
      </p>

      {budgets.length > 0 ? (
        <div className="mt-6 space-y-5">
        {budgets.map((budget) => {
          const percentage = Math.round((budget.spent / budget.limit) * 100);

          return (
            <div key={budget.name}>
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="font-medium text-slate-700">{budget.name}</span>
                <span className="text-slate-500">{percentage}%</span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full ${budget.color}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <p className="mt-2 text-sm text-slate-500">
                {currencyFormatter.format(budget.spent)} de{" "}
                {currencyFormatter.format(budget.limit)}
              </p>
            </div>
          );
        })}
        </div>
      ) : (
        <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-5 text-sm leading-6 text-slate-500">
          Nenhum orcamento cadastrado ainda. Em breve voce podera definir
          limites por categoria.
        </div>
      )}
    </aside>
  );
}
