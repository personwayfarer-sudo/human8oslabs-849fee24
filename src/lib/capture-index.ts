/**
 * Calcul dynamique de l'Indice de Capture.
 *
 * Le score augmente (mauvais) si :
 * - Une personne occupe 2+ rôles critiques
 * - Les stocks descendent sous le seuil de sécurité (30 jours)
 * - Des tensions sont ouvertes (capture émotionnelle)
 *
 * Le score diminue (bon) si :
 * - Les rotations sont effectuées à temps
 */

interface CaptureInput {
  rolesPerMember: Record<string, number>;
  stockAutonomyDays: number[];
  securityThresholdDays: number;
  onTimeRotations: number;
  totalRotations: number;
  /** Number of open (unresolved) tensions */
  openTensions: number;
  /** Threshold above which tensions become alarming */
  tensionThreshold: number;
}

export interface CaptureFactor {
  label: string;
  contribution: number;
  status: "positive" | "negative";
}

export interface CaptureResult {
  score: number;
  factors: CaptureFactor[];
}

export function calculateCaptureIndex(input: CaptureInput): CaptureResult {
  const factors: CaptureFactor[] = [];
  let score = 0;

  // Factor 1: Concentration des rôles (0-35 points)
  const maxRoles = Math.max(0, ...Object.values(input.rolesPerMember));
  const membersWithMultiple = Object.values(input.rolesPerMember).filter(n => n >= 2).length;

  if (membersWithMultiple > 0) {
    const roleConcentration = Math.min(35, membersWithMultiple * 15 + (maxRoles - 1) * 10);
    score += roleConcentration;
    factors.push({
      label: `${membersWithMultiple} membre(s) cumulent 2+ rôles`,
      contribution: roleConcentration,
      status: "negative",
    });
  } else {
    factors.push({
      label: "Aucune concentration de rôles",
      contribution: 8,
      status: "positive",
    });
  }

  // Factor 2: Stocks sous seuil de sécurité (0-30 points)
  const belowThreshold = input.stockAutonomyDays.filter(d => d < input.securityThresholdDays).length;
  const totalStocks = input.stockAutonomyDays.length;

  if (belowThreshold > 0) {
    const stockPenalty = Math.min(30, Math.round((belowThreshold / totalStocks) * 30));
    score += stockPenalty;
    factors.push({
      label: `${belowThreshold}/${totalStocks} stocks sous ${input.securityThresholdDays}j`,
      contribution: stockPenalty,
      status: "negative",
    });
  } else {
    factors.push({
      label: `Tous les stocks au-dessus de ${input.securityThresholdDays}j`,
      contribution: 12,
      status: "positive",
    });
  }

  // Factor 3: Tensions ouvertes — capture émotionnelle (0-20 points)
  if (input.openTensions > 0) {
    const tensionPenalty = Math.min(20, input.openTensions * (input.openTensions > input.tensionThreshold ? 8 : 4));
    score += tensionPenalty;
    factors.push({
      label: `${input.openTensions} tension(s) ouverte(s)${input.openTensions > input.tensionThreshold ? " (seuil dépassé)" : ""}`,
      contribution: tensionPenalty,
      status: "negative",
    });
  } else {
    factors.push({
      label: "Aucune tension ouverte",
      contribution: 5,
      status: "positive",
    });
  }

  // Factor 4: Rotations à temps (0-20 points de réduction)
  if (input.totalRotations > 0) {
    const rotationRate = input.onTimeRotations / input.totalRotations;
    const rotationBonus = Math.round(rotationRate * 20);
    score -= rotationBonus;
    factors.push({
      label: `${input.onTimeRotations}/${input.totalRotations} rotations à temps`,
      contribution: rotationBonus,
      status: "positive",
    });
  }

  score = Math.max(0, Math.min(100, score));
  return { score, factors };
}
