"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import type { RadarChartPoint } from "@/lib/reports/report-dto";

const CITY_A_COLOR = "#2563eb";
const CITY_B_COLOR = "#f59e0b";

interface ReportRadarChartProps {
  data: RadarChartPoint[];
  cityAName: string;
  cityBName: string;
}

export default function ReportRadarChart({ data, cityAName, cityBName }: ReportRadarChartProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-4">
        Score Comparison — Radar
      </p>
      <div style={{ height: 320 }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
            <PolarGrid gridType="polygon" stroke="#e2e8f0" />
            <PolarAngleAxis
              dataKey="metric"
              tick={{ fontSize: 11, fill: "#64748b" }}
            />
            <Radar
              name={cityAName}
              dataKey="cityA"
              stroke={CITY_A_COLOR}
              fill={CITY_A_COLOR}
              fillOpacity={0.15}
              strokeWidth={2}
            />
            <Radar
              name={cityBName}
              dataKey="cityB"
              stroke={CITY_B_COLOR}
              fill={CITY_B_COLOR}
              fillOpacity={0.15}
              strokeWidth={2}
            />
            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
            />
            <Tooltip
              contentStyle={{
                fontSize: 12,
                borderRadius: 8,
                border: "1px solid #e2e8f0",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)",
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-muted-foreground mt-3 text-center">
        All axes scaled 1–10. Higher = better. Safety is the inverse of risk.
      </p>
    </div>
  );
}
