import { Pencil } from "lucide-react";
import type { SummaryCard } from "./types";

type SummaryCardsProps = {
  cards: SummaryCard[];
  onEditBalance?: () => void;
};

export function SummaryCards({
  cards,
  onEditBalance,
}: SummaryCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <article
            className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
            key={card.label}
          >
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm font-medium text-slate-500">
                {card.label}
              </span>
              <div className="flex items-center gap-2">
                {card.editable && onEditBalance ? (
                  <button
                    aria-label="Editar saldo atual"
                    className="inline-flex size-9 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 transition hover:border-emerald-300 hover:text-emerald-700"
                    onClick={onEditBalance}
                    title="Editar saldo"
                    type="button"
                  >
                    <Pencil className="size-4" />
                  </button>
                ) : null}
                <span
                  className={`inline-flex size-10 items-center justify-center rounded-md ${card.tone}`}
                >
                  <Icon className="size-5" />
                </span>
              </div>
            </div>
            <strong className="mt-5 block text-2xl font-semibold tracking-normal text-slate-950">
              {card.value}
            </strong>
            <span className="mt-2 block text-sm text-slate-500">
              {card.change}
            </span>
          </article>
        );
      })}
    </div>
  );
}
