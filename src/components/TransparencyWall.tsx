interface TransparencyEntry {
  id: string;
  timestamp: string;
  type: "décision" | "ressource" | "alerte" | "rotation";
  description: string;
  author: string;
}

interface TransparencyWallProps {
  entries: TransparencyEntry[];
}

const typeStyles: Record<string, string> = {
  décision: "bg-primary/10 text-primary",
  ressource: "bg-safe/10 text-safe",
  alerte: "bg-warning/10 text-warning",
  rotation: "bg-info/10 text-info",
};

export function TransparencyWall({ entries }: TransparencyWallProps) {
  return (
    <div className="glass-card overflow-hidden">
      <div className="px-4 py-3 border-b border-border/50">
        <h3 className="text-sm font-semibold text-foreground">Mur de Transparence</h3>
        <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mt-0.5">
          Journal immuable · Temps réel
        </p>
      </div>
      <div className="divide-y divide-border/30 max-h-96 overflow-y-auto">
        {entries.map((entry, i) => (
          <div
            key={entry.id}
            className="px-4 py-3 flex items-start gap-3 animate-fade-in"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 mt-2 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${typeStyles[entry.type] || "bg-muted text-muted-foreground"}`}>
                  {entry.type}
                </span>
                <span className="text-[10px] font-mono text-muted-foreground">{entry.timestamp}</span>
              </div>
              <p className="text-sm text-foreground mt-1">{entry.description}</p>
              <p className="text-xs text-muted-foreground mt-0.5">— {entry.author}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
