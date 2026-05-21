import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { currencyFormatter } from "./formatters";
import type { MonthlyFinance } from "./types";

type MonthlyChartProps = {
  data: MonthlyFinance[];
  isReady: boolean;
};

export function MonthlyChart({ data, isReady }: MonthlyChartProps) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-950">
            Receitas x despesas
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Comparativo dos ultimos seis meses.
          </p>
        </div>
        <div className="flex items-center gap-4 text-sm text-slate-600">
          <span className="inline-flex items-center gap-2">
            <span className="size-3 rounded-sm bg-emerald-500" />
            Receitas
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="size-3 rounded-sm bg-slate-800" />
            Despesas
          </span>
        </div>
      </div>

      <div className="h-80">
        {isReady ? (
          <ResponsiveContainer height="100%" width="100%">
            <BarChart data={data}>
              <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" />
              <XAxis
                axisLine={false}
                dataKey="month"
                tick={{ fill: "#64748b", fontSize: 12 }}
                tickLine={false}
              />
              <YAxis
                axisLine={false}
                tick={{ fill: "#64748b", fontSize: 12 }}
                tickFormatter={(value) => currencyFormatter.format(Number(value))}
                tickLine={false}
              />
              <Tooltip
                cursor={{ fill: "#f1f5f9" }}
                formatter={(value) => currencyFormatter.format(Number(value))}
              />
              <Bar dataKey="receitas" fill="#10b981" radius={[6, 6, 0, 0]} />
              <Bar dataKey="despesas" fill="#1e293b" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full rounded-md bg-slate-100" />
        )}
      </div>
    </section>
  );
}
