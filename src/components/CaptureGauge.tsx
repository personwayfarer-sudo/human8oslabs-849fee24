import { useEffect, useState } from "react";

interface CaptureGaugeProps {
  /** Score 0–100 */
  score: number;
  /** Breakdown factors */
  factors: { label: string; contribution: number; status: "positive" | "negative" }[];
}

/**
 * Jauge radiale SVG pour l'Indice de Capture.
 * 0 = système ouvert, 100 = capture totale.
 */
export function CaptureGauge({ score, factors }: CaptureGaugeProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => setAnimatedScore(score), 100);
    return () => clearTimeout(timeout);
  }, [score]);

  const size = 180;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * Math.PI; // semi-circle
  const offset = circumference - (animatedScore / 100) * circumference;

  const getColor = (s: number) => {
    if (s <= 20) return { stroke: "hsl(145, 45%, 38%)", label: "Faible", sublabel: "Système ouvert" };
    if (s <= 50) return { stroke: "hsl(38, 70%, 50%)", label: "Modéré", sublabel: "Vigilance requise" };
    return { stroke: "hsl(0, 55%, 50%)", label: "Élevé", sublabel: "Risque de capture" };
  };

  const color = getColor(score);

  return (
    <div className="flex flex-col items-center">
      {/* SVG Gauge */}
      <div className="relative" style={{ width: size, height: size / 2 + 20 }}>
        <svg width={size} height={size / 2 + 20} viewBox={`0 0 ${size} ${size / 2 + 20}`}>
          {/* Background arc */}
          <path
            d={`M ${strokeWidth / 2} ${size / 2 + 10} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2 + 10}`}
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* Value arc */}
          <path
            d={`M ${strokeWidth / 2} ${size / 2 + 10} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2 + 10}`}
            fill="none"
            stroke={color.stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out"
          />
          {/* Tick marks */}
          {[0, 25, 50, 75, 100].map((tick) => {
            const angle = Math.PI - (tick / 100) * Math.PI;
            const x1 = size / 2 + (radius - 18) * Math.cos(angle);
            const y1 = size / 2 + 10 - (radius - 18) * Math.sin(angle);
            const x2 = size / 2 + (radius - 24) * Math.cos(angle);
            const y2 = size / 2 + 10 - (radius - 24) * Math.sin(angle);
            return (
              <line
                key={tick}
                x1={x1} y1={y1} x2={x2} y2={y2}
                stroke="hsl(var(--muted-foreground))"
                strokeWidth={1}
                opacity={0.4}
              />
            );
          })}
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-1">
          <span className="text-3xl font-mono font-bold" style={{ color: color.stroke }}>
            {score}%
          </span>
        </div>
      </div>

      {/* Label */}
      <div className="text-center mt-1">
        <p className="text-sm font-semibold" style={{ color: color.stroke }}>{color.label}</p>
        <p className="text-xs text-muted-foreground">{color.sublabel}</p>
      </div>

      {/* Factors breakdown */}
      <div className="w-full mt-4 space-y-1.5">
        {factors.map((f) => (
          <div key={f.label} className="flex items-center gap-2 text-xs">
            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
              f.status === "positive" ? "bg-safe" : "bg-destructive"
            }`} />
            <span className="text-muted-foreground flex-1">{f.label}</span>
            <span className={`font-mono ${f.status === "positive" ? "text-safe" : "text-destructive"}`}>
              {f.status === "positive" ? "−" : "+"}{f.contribution}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
