import { AlertTriangle, Shield } from "lucide-react";

interface CompassAlert {
  id: string;
  indicator: string;
  message: string;
  severity: "info" | "warning" | "critical";
}

interface EthicalCompassProps {
  alerts: CompassAlert[];
  captureIndex: number;
}

export function EthicalCompass({ alerts, captureIndex }: EthicalCompassProps) {
  const getCaptureColor = (index: number) => {
    if (index <= 20) return "text-safe";
    if (index <= 50) return "text-warning";
    return "text-destructive";
  };

  const getCaptureLabel = (index: number) => {
    if (index <= 20) return "Faible — Système ouvert";
    if (index <= 50) return "Modéré — Vigilance requise";
    return "Élevé — Risque de capture";
  };

  return (
    <div className="glass-card p-4">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">Boussole Éthique</h3>
      </div>

      {/* Capture Index */}
      <div className="mb-4 p-3 rounded-md bg-muted/50">
        <span className="data-label">Indice de Capture</span>
        <div className="mt-2 flex items-baseline gap-2">
          <span className={`text-3xl font-mono font-semibold ${getCaptureColor(captureIndex)}`}>
            {captureIndex}
          </span>
          <span className="text-sm text-muted-foreground">/ 100</span>
        </div>
        <div className="mt-2 w-full bg-muted rounded-full h-1.5">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              captureIndex <= 20 ? "bg-safe" : captureIndex <= 50 ? "bg-warning" : "bg-destructive"
            }`}
            style={{ width: `${captureIndex}%` }}
          />
        </div>
        <p className={`text-xs mt-1.5 ${getCaptureColor(captureIndex)}`}>
          {getCaptureLabel(captureIndex)}
        </p>
      </div>

      {/* Alerts */}
      {alerts.length > 0 ? (
        <div className="space-y-2">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`flex items-start gap-2 p-2 rounded text-xs ${
                alert.severity === "critical"
                  ? "bg-destructive/10 text-destructive"
                  : alert.severity === "warning"
                  ? "bg-warning/10 text-warning"
                  : "bg-info/10 text-info"
              }`}
            >
              <AlertTriangle className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">{alert.indicator}</p>
                <p className="opacity-80">{alert.message}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-safe flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-safe" />
          Aucune concentration de pouvoir détectée
        </p>
      )}
    </div>
  );
}
