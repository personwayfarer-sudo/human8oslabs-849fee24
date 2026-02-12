import { ReactNode } from "react";
import { JusticeCognitive } from "@/components/JusticeCognitive";

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  status?: "safe" | "warning" | "danger";
  icon?: ReactNode;
  detail?: string;
  invariant?: string;
  invariantExplanation?: string;
}

export function MetricCard({ label, value, unit, status = "safe", icon, detail, invariant, invariantExplanation }: MetricCardProps) {
  const statusStyles = {
    safe: "border-safe/30 pulse-safe",
    warning: "border-warning/30 pulse-warning",
    danger: "border-destructive/30 pulse-danger",
  };

  const dotStyles = {
    safe: "bg-safe",
    warning: "bg-warning",
    danger: "bg-destructive",
  };

  return (
    <div className={`glass-card p-4 ${statusStyles[status]}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-1.5">
          <span className="data-label">{label}</span>
          {invariant && invariantExplanation && (
            <JusticeCognitive invariant={invariant} explanation={invariantExplanation} />
          )}
        </div>
        {icon && <span className="text-muted-foreground">{icon}</span>}
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl font-semibold font-mono text-foreground">{value}</span>
        {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
      </div>
      <div className="mt-2 flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${dotStyles[status]}`} />
        <span className="text-xs text-muted-foreground">
          {detail || (status === "safe" ? "Stable" : status === "warning" ? "Attention" : "Critique")}
        </span>
      </div>
    </div>
  );
}
