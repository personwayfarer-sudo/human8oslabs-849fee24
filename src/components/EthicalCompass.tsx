import { AlertTriangle, Shield } from "lucide-react";
import { CaptureGauge } from "@/components/CaptureGauge";
import { JusticeCognitive } from "@/components/JusticeCognitive";
import { calculateCaptureIndex } from "@/lib/capture-index";
import { useMemo } from "react";

interface CompassAlert {
  id: string;
  indicator: string;
  message: string;
  severity: "info" | "warning" | "critical";
}

interface EthicalCompassProps {
  alerts: CompassAlert[];
  /** Role count per member */
  rolesPerMember: Record<string, number>;
  /** Stock autonomy days */
  stockDays: number[];
  /** Security threshold */
  securityThreshold: number;
  /** On-time rotations */
  onTimeRotations: number;
  /** Total expected rotations */
  totalRotations: number;
}

export function EthicalCompass({
  alerts,
  rolesPerMember,
  stockDays,
  securityThreshold,
  onTimeRotations,
  totalRotations,
}: EthicalCompassProps) {
  const { score, factors } = useMemo(() =>
    calculateCaptureIndex({
      rolesPerMember,
      stockAutonomyDays: stockDays,
      securityThresholdDays: securityThreshold,
      onTimeRotations,
      totalRotations,
    }),
    [rolesPerMember, stockDays, securityThreshold, onTimeRotations, totalRotations]
  );

  return (
    <div className="glass-card p-4">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">Boussole de Capture</h3>
        <JusticeCognitive
          invariant="Non-Extraction du Pouvoir"
          explanation="La Boussole de Capture agrège trois facteurs structurels : la concentration des rôles (une personne cumule-t-elle trop de responsabilités ?), le niveau des stocks vitaux (le Lab est-il en situation de dépendance ?), et la régularité des rotations (le pouvoir circule-t-il ?). Elle ne mesure pas la performance individuelle — elle mesure la santé architecturale du système."
        />
      </div>

      {/* Radial Gauge */}
      <CaptureGauge score={score} factors={factors} />

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="mt-4 space-y-2">
          <span className="data-label">Alertes actives</span>
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
      )}
    </div>
  );
}
