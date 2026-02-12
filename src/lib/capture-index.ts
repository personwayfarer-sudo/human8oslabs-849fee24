/**
 * Calcul dynamique de l'Indice de Capture.
 *
 * Le score augmente (mauvais) si :
 * - Une personne occupe 2+ rôles critiques
 * - Les stocks descendent sous le seuil de sécurité (30 jours)
 *
 * Le score diminue (bon) si :
 * - Les rotations sont effectuées à temps
 */

interface CaptureInput {
  /** Map memberId → nombre de rôles actuellement occupés */
  rolesPerMember: Record<string, number>;
  /** Autonomie en jours pour chaque stock */
  stockAutonomyDays: number[];
  /** Seuil de sécurité en jours */
  securityThresholdDays: number;
  /** Nombre de rotations effectuées à temps */
  onTimeRotations: number;
  /** Nombre total de rotations prévues */
  totalRotations: number;
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

  // Factor 1: Concentration des rôles (0-40 points)
  const maxRoles = Math.max(0, ...Object.values(input.rolesPerMember));
  const membersWithMultiple = Object.values(input.rolesPerMember).filter(n => n >= 2).length;

  if (membersWithMultiple > 0) {
    const roleConcentration = Math.min(40, membersWithMultiple * 15 + (maxRoles - 1) * 10);
    score += roleConcentration;
    factors.push({
      label: `${membersWithMultiple} membre(s) cumulent 2+ rôles`,
      contribution: roleConcentration,
      status: "negative",
    });
  } else {
    factors.push({
      label: "Aucune concentration de rôles",
      contribution: 10,
      status: "positive",
    });
  }

  // Factor 2: Stocks sous seuil de sécurité (0-35 points)
  const belowThreshold = input.stockAutonomyDays.filter(d => d < input.securityThresholdDays).length;
  const totalStocks = input.stockAutonomyDays.length;

  if (belowThreshold > 0) {
    const stockPenalty = Math.min(35, Math.round((belowThreshold / totalStocks) * 35));
    score += stockPenalty;
    factors.push({
      label: `${belowThreshold}/${totalStocks} stocks sous ${input.securityThresholdDays}j`,
      contribution: stockPenalty,
      status: "negative",
    });
  } else {
    factors.push({
      label: `Tous les stocks au-dessus de ${input.securityThresholdDays}j`,
      contribution: 15,
      status: "positive",
    });
  }

  // Factor 3: Rotations à temps (0-25 points de réduction)
  if (input.totalRotations > 0) {
    const rotationRate = input.onTimeRotations / input.totalRotations;
    const rotationBonus = Math.round(rotationRate * 25);
    score -= rotationBonus;
    factors.push({
      label: `${input.onTimeRotations}/${input.totalRotations} rotations à temps`,
      contribution: rotationBonus,
      status: "positive",
    });
  }

  // Clamp
  score = Math.max(0, Math.min(100, score));

  return { score, factors };
}
