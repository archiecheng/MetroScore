"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { TrendChartPoint } from "@/lib/reports/report-dto";

const CITY_A_COLOR = "#2563eb";
const CITY_B_COLOR = "#f59e0b";

export type TrendFormat = "price" | "population";

interface TrendChartProps {
  data: TrendChartPoint[];
  title: string;
  cityAName: string;
  cityBName: string;
  format: TrendFormat;
}

function formatValue(value: number, format: TrendFormat): string {
  if (format === "price") {
    return value >= 1000 ? `$${(value / 1000).toFixed(1)}M` : `$${value}k`;
  }
  return `${value}k`;
}

export default function TrendChart({ data, title, cityAName, cityBName, format }: TrendChartProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-4">
        {title}
      </p>
      <div style={{ height: 240 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 16, bottom: 5, left: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis
              dataKey="year"
              tick={{ fontSize: 11, fill: "#64748b" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tickFormatter={(v) => formatValue(v, format)}
              tick={{ fontSize: 11, fill: "#64748b" }}
              axisLine={false}
              tickLine={false}
              width={56}
            />
            <Tooltip
              formatter={(v) => [formatValue(Number(v), format), ""]}
              contentStyle={{
                fontSize: 12,
                borderRadius: 8,
                border: "1px solid #e2e8f0",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)",
              }}
            />
            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
            />
            <Line
              name={cityAName}
              type="monotone"
              dataKey="cityA"
              stroke={CITY_A_COLOR}
              strokeWidth={2.5}
              dot={{ r: 3.5, fill: CITY_A_COLOR, strokeWidth: 0 }}
              activeDot={{ r: 5 }}
            />
            <Line
              name={cityBName}
              type="monotone"
              dataKey="cityB"
              stroke={CITY_B_COLOR}
              strokeWidth={2.5}
              dot={{ r: 3.5, fill: CITY_B_COLOR, strokeWidth: 0 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
