import type { SummaryCard } from "./types";

type SummaryCardsProps = {
  cards: SummaryCard[];
};

export function SummaryCards({ cards }: SummaryCardsProps) {
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
              <span
                className={`inline-flex size-10 items-center justify-center rounded-md ${card.tone}`}
              >
                <Icon className="size-5" />
              </span>
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
