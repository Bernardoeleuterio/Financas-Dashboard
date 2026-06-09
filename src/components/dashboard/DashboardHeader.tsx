import { ArrowRight, CalendarDays } from "lucide-react";
import Link from "next/link";

export function DashboardHeader() {
  const currentMonth = new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <header className="flex flex-col gap-4 border-b border-slate-200 pb-5 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <p className="text-sm font-medium text-emerald-700">Visao geral</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-normal text-slate-950">
          Seu painel financeiro
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
          Acompanhe o que importa e navegue pelos detalhes na barra lateral.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span
          className="inline-flex h-10 items-center gap-2 rounded-md border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          <CalendarDays className="size-4" />
          {currentMonth}
        </span>
        <Link
          className="inline-flex h-10 items-center gap-2 rounded-md bg-emerald-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
          href="/transacoes"
        >
          Ver transacoes
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </header>
  );
}
