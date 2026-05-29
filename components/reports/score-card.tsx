interface ScoreCardProps {
  metric: string;
  cityAName: string;
  cityBName: string;
  scoreA: number;
  scoreB: number;
  /** When true, a lower score is better (risk). Color coding is inverted. */
  isRisk?: boolean;
}

function scoreStyle(score: number, isRisk: boolean) {
  const effective = isRisk ? 11 - score : score;
  if (effective >= 7) return { text: "text-green-700", bar: "bg-green-500" };
  if (effective >= 4) return { text: "text-amber-700", bar: "bg-amber-400" };
  return { text: "text-red-700", bar: "bg-red-500" };
}

function ScoreRow({
  name,
  score,
  barColor,
  style,
}: {
  name: string;
  score: number;
  barColor: string;
  style: ReturnType<typeof scoreStyle>;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm text-foreground truncate max-w-[60%]">{name}</span>
        <span className={`text-sm font-bold tabular-nums ${style.text}`}>
          {score}
          <span className="text-xs font-normal text-muted-foreground">/10</span>
        </span>
      </div>
      <div className="h-2 rounded-full bg-secondary overflow-hidden">
        <div
          className={`h-full rounded-full ${barColor}`}
          style={{ width: `${(score / 10) * 100}%` }}
        />
      </div>
    </div>
  );
}

export default function ScoreCard({
  metric,
  cityAName,
  cityBName,
  scoreA,
  scoreB,
  isRisk = false,
}: ScoreCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 print:break-inside-avoid">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-4">
        {metric}
        {isRisk && (
          <span className="ml-1.5 font-normal normal-case tracking-normal text-muted-foreground/70">
            (lower is better)
          </span>
        )}
      </p>
      <div className="space-y-3">
        <ScoreRow
          name={cityAName}
          score={scoreA}
          barColor="bg-blue-500"
          style={scoreStyle(scoreA, isRisk)}
        />
        <ScoreRow
          name={cityBName}
          score={scoreB}
          barColor="bg-amber-400"
          style={scoreStyle(scoreB, isRisk)}
        />
      </div>
    </div>
  );
}
