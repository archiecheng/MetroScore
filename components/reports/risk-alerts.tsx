import type { RiskAlert } from "@/lib/reports/report-dto";

interface RiskAlertsProps {
  risks: RiskAlert[];
  cityAName: string;
  cityBName: string;
}

const SEVERITY_STYLES = {
  high: {
    badge: "bg-red-50 text-red-700 border-red-200",
    bar: "bg-red-500",
    icon: "⚠",
    label: "High Risk",
  },
  medium: {
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    bar: "bg-amber-400",
    icon: "▲",
    label: "Medium Risk",
  },
  low: {
    badge: "bg-blue-50 text-blue-700 border-blue-200",
    bar: "bg-blue-400",
    icon: "ℹ",
    label: "Low Risk",
  },
};

const CITY_A_STYLE = "bg-blue-50 text-blue-700 border-blue-200";
const CITY_B_STYLE = "bg-amber-50 text-amber-700 border-amber-200";
const BOTH_STYLE = "bg-secondary text-secondary-foreground border-border";

export default function RiskAlerts({ risks, cityAName, cityBName }: RiskAlertsProps) {
  return (
    <div>
      <h2 className="text-base font-semibold text-foreground mb-4">Risk Alerts</h2>
      <div className="space-y-3">
        {risks.map((risk, i) => {
          const s = SEVERITY_STYLES[risk.severity];
          const cityLabel =
            risk.city === "cityA" ? cityAName : risk.city === "cityB" ? cityBName : "Both Cities";
          const cityStyle =
            risk.city === "cityA" ? CITY_A_STYLE : risk.city === "cityB" ? CITY_B_STYLE : BOTH_STYLE;

          return (
            <div
              key={i}
              className="rounded-xl border border-border bg-card p-5 print:break-inside-avoid"
            >
              <div className="flex items-start gap-3">
                <span className={`text-lg flex-shrink-0 mt-0.5 ${s.badge.split(" ")[1]}`}>
                  {s.icon}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className="font-semibold text-sm text-foreground">{risk.title}</span>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full border ${s.badge}`}
                    >
                      {s.label}
                    </span>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full border ${cityStyle}`}
                    >
                      {cityLabel}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {risk.explanation}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
