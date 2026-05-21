import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { currencyFormatter } from "./formatters";
import type { CategoryExpense } from "./types";

type CategoryChartProps = {
  data: CategoryExpense[];
  isReady: boolean;
};

export function CategoryChart({ data, isReady }: CategoryChartProps) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-slate-950">
          Gastos por categoria
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Distribuicao das despesas do mes.
        </p>
      </div>

      <div className="h-56">
        {isReady ? (
          <ResponsiveContainer height="100%" width="100%">
            <PieChart>
              <Pie
                cx="50%"
                cy="50%"
                data={data}
                dataKey="value"
                innerRadius={58}
                outerRadius={88}
                paddingAngle={3}
              >
                {data.map((entry) => (
                  <Cell fill={entry.color} key={entry.name} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => currencyFormatter.format(Number(value))}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full rounded-md bg-slate-100" />
        )}
      </div>

      <div className="mt-4 space-y-3">
        {data.map((category) => (
          <div
            className="flex items-center justify-between gap-3 text-sm"
            key={category.name}
          >
            <span className="inline-flex items-center gap-2 text-slate-600">
              <span
                className="size-3 rounded-sm"
                style={{ backgroundColor: category.color }}
              />
              {category.name}
            </span>
            <strong className="font-semibold text-slate-950">
              {currencyFormatter.format(category.value)}
            </strong>
          </div>
        ))}
      </div>
    </section>
  );
}
