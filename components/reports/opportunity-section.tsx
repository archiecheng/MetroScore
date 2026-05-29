import type { Opportunity } from "@/lib/reports/report-dto";

interface OpportunitySectionProps {
  opportunities: Opportunity[];
  cityAName: string;
  cityBName: string;
}

const CITY_A_COLOR = "bg-blue-50 text-blue-700 border-blue-200";
const CITY_B_COLOR = "bg-amber-50 text-amber-700 border-amber-200";

export default function OpportunitySection({
  opportunities,
  cityAName,
  cityBName,
}: OpportunitySectionProps) {
  return (
    <div>
      <h2 className="text-base font-semibold text-foreground mb-4">Opportunities</h2>
      <div className="space-y-3">
        {opportunities.map((opp, i) => {
          const isA = opp.city === "cityA";
          const cityLabel = isA ? cityAName : cityBName;
          const colorClass = isA ? CITY_A_COLOR : CITY_B_COLOR;
          return (
            <div
              key={i}
              className="rounded-xl border border-border bg-card p-5 print:break-inside-avoid"
            >
              <div className="flex items-start gap-3">
                <span className="mt-0.5 text-lg flex-shrink-0">✦</span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className="font-semibold text-sm text-foreground">{opp.title}</span>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full border ${colorClass}`}
                    >
                      {cityLabel}, {isA ? "CA" : "CO"}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {opp.explanation}
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
