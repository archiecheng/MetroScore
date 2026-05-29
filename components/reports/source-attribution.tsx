import type { DataSource } from "@/lib/reports/report-dto";

interface SourceAttributionProps {
  sources: DataSource[];
}

export default function SourceAttribution({ sources }: SourceAttributionProps) {
  return (
    <div>
      <h2 className="text-base font-semibold text-foreground mb-4">Data Sources</h2>
      <div className="rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-secondary/60 border-b border-border">
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Metric</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Source</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">
                Year
              </th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">
                Note
              </th>
            </tr>
          </thead>
          <tbody>
            {sources.map((s, i) => (
              <tr
                key={i}
                className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors"
              >
                <td className="px-4 py-3 text-foreground font-medium">{s.metric}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {s.sourceUrl ? (
                    <a
                      href={s.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {s.sourceName}
                    </a>
                  ) : (
                    s.sourceName
                  )}
                </td>
                <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
                  {s.year ?? "—"}
                </td>
                <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                  {s.note ?? "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
