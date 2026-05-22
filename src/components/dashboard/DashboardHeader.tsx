import { Bell, CalendarDays, Plus } from "lucide-react";

type DashboardHeaderProps = {
  onNewTransaction: () => void;
};

export function DashboardHeader({ onNewTransaction }: DashboardHeaderProps) {
  return (
    <header className="flex flex-col gap-4 border-b border-slate-200 pb-5 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <p className="text-sm font-medium text-emerald-700">FinTrack</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-normal text-slate-950">
          Dashboard financeiro
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
          Acompanhe receitas, despesas, metas e orcamentos em uma unica visao.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          className="inline-flex h-10 items-center gap-2 rounded-md border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
          type="button"
        >
          <CalendarDays className="size-4" />
          Maio 2026
        </button>
        <button
          aria-label="Notificacoes"
          className="inline-flex size-10 items-center justify-center rounded-md border border-slate-300 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50"
          title="Notificacoes"
          type="button"
        >
          <Bell className="size-4" />
        </button>
        <button
          className="inline-flex h-10 items-center gap-2 rounded-md bg-emerald-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
          onClick={onNewTransaction}
          type="button"
        >
          <Plus className="size-4" />
          Nova transacao
        </button>
      </div>
    </header>
  );
}
