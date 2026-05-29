import type { CitySummary, ReportPurpose } from "@/lib/reports/report-dto";

interface ReportHeaderProps {
  cityA: CitySummary;
  cityB: CitySummary;
  purpose: ReportPurpose;
  generatedAt: string;
  overallA: number;
  overallB: number;
}

const PURPOSE_LABELS: Record<ReportPurpose, string> = {
  move: "Relocation",
  primary_home: "Primary Home",
  rental_investment: "Rental Investment",
  long_term_investment: "Long-Term Investment",
};

export default function ReportHeader({
  cityA,
  cityB,
  purpose,
  generatedAt,
  overallA,
  overallB,
}: ReportHeaderProps) {
  const date = new Date(generatedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-6">
      {/* Demo banner */}
      <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 flex items-center gap-2.5 print:border-gray-300 print:bg-gray-50">
        <span className="text-amber-600 text-sm">★</span>
        <p className="text-sm text-amber-800">
          <span className="font-semibold">Sample Report</span> — This is demo data for illustration
          purposes. Real reports are generated from live U.S. city datasets.
        </p>
      </div>

      {/* Title row */}
      <div>
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
            {PURPOSE_LABELS[purpose]}
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight">
          {cityA.name}, {cityA.state}
          <span className="text-muted-foreground font-normal mx-3">vs</span>
          {cityB.name}, {cityB.state}
        </h1>
        {(cityA.metroName || cityB.metroName) && (
          <p className="text-sm text-muted-foreground mt-1">
            {cityA.metroName} · {cityB.metroName}
          </p>
        )}
        <p className="text-xs text-muted-foreground mt-1">Generated {date}</p>
      </div>

      {/* Overall scores */}
      <div className="grid grid-cols-3 gap-3 sm:gap-6">
        <OverallScoreCard
          name={cityA.name}
          state={cityA.state}
          score={overallA}
          colorClass="text-blue-600"
          bgClass="bg-blue-50 border-blue-100"
        />
        <div className="flex items-center justify-center">
          <span className="text-xl font-bold text-muted-foreground/50">vs</span>
        </div>
        <OverallScoreCard
          name={cityB.name}
          state={cityB.state}
          score={overallB}
          colorClass="text-amber-600"
          bgClass="bg-amber-50 border-amber-100"
        />
      </div>
    </div>
  );
}

function OverallScoreCard({
  name,
  state,
  score,
  colorClass,
  bgClass,
}: {
  name: string;
  state: string;
  score: number;
  colorClass: string;
  bgClass: string;
}) {
  return (
    <div className={`rounded-xl border p-4 sm:p-6 text-center ${bgClass}`}>
      <p className="text-xs sm:text-sm font-semibold text-foreground truncate">
        {name}, {state}
      </p>
      <div className={`text-4xl sm:text-5xl font-bold my-2 sm:my-3 tabular-nums ${colorClass}`}>
        {score}
      </div>
      <p className="text-xs text-muted-foreground">Overall Score / 10</p>
    </div>
  );
}
