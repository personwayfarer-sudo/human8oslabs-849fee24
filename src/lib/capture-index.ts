/**
 * Calcul dynamique de l'Indice de Capture.
 *
 * Le score augmente (mauvais) si :
 * - Une personne occupe 2+ rôles critiques
 * - Les stocks descendent sous le seuil de sécurité (30 jours)
 * - Des tensions sont ouvertes (capture émotionnelle)
 * - Des ressources vitales dépendent de services tiers centralisés (dépendance cloud)
 *
 * Le score diminue (bon) si :
 * - Les rotations sont effectuées à temps
 */

interface CloudDependency {
  service: string;
  critical: boolean;
  selfHostable: boolean;
}

interface CaptureInput {
  rolesPerMember: Record<string, number>;
  stockAutonomyDays: number[];
  securityThresholdDays: number;
  onTimeRotations: number;
  totalRotations: number;
  openTensions: number;
  tensionThreshold: number;
  /** Cloud dependencies — centralized services the Lab relies on */
  cloudDependencies?: CloudDependency[];
  /** Whether the 18-month audit deadline has been exceeded */
  auditOverdue?: boolean;
  /** Whether there is an active resident from another Lab */
  hasActiveResident?: boolean;
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

  // Factor 1: Concentration des rôles (0-30 points)
  const maxRoles = Math.max(0, ...Object.values(input.rolesPerMember));
  const membersWithMultiple = Object.values(input.rolesPerMember).filter(n => n >= 2).length;

  if (membersWithMultiple > 0) {
    const roleConcentration = Math.min(30, membersWithMultiple * 12 + (maxRoles - 1) * 8);
    score += roleConcentration;
    factors.push({ label: `${membersWithMultiple} membre(s) cumulent 2+ rôles`, contribution: roleConcentration, status: "negative" });
  } else {
    factors.push({ label: "Aucune concentration de rôles", contribution: 6, status: "positive" });
  }

  // Factor 2: Stocks sous seuil de sécurité (0-25 points)
  const belowThreshold = input.stockAutonomyDays.filter(d => d < input.securityThresholdDays).length;
  const totalStocks = input.stockAutonomyDays.length;

  if (belowThreshold > 0) {
    const stockPenalty = Math.min(25, Math.round((belowThreshold / totalStocks) * 25));
    score += stockPenalty;
    factors.push({ label: `${belowThreshold}/${totalStocks} stocks sous ${input.securityThresholdDays}j`, contribution: stockPenalty, status: "negative" });
  } else {
    factors.push({ label: `Stocks au-dessus de ${input.securityThresholdDays}j`, contribution: 10, status: "positive" });
  }

  // Factor 3: Tensions ouvertes (0-15 points)
  if (input.openTensions > 0) {
    const tensionPenalty = Math.min(15, input.openTensions * (input.openTensions > input.tensionThreshold ? 6 : 3));
    score += tensionPenalty;
    factors.push({ label: `${input.openTensions} tension(s) ouverte(s)${input.openTensions > input.tensionThreshold ? " (seuil)" : ""}`, contribution: tensionPenalty, status: "negative" });
  } else {
    factors.push({ label: "Aucune tension ouverte", contribution: 4, status: "positive" });
  }

  // Factor 4: Dépendance Cloud (0-20 points)
  const deps = input.cloudDependencies || [];
  const criticalCentralized = deps.filter(d => d.critical && !d.selfHostable).length;
  const nonCriticalCentralized = deps.filter(d => !d.critical && !d.selfHostable).length;

  if (criticalCentralized > 0) {
    const cloudPenalty = Math.min(20, criticalCentralized * 10 + nonCriticalCentralized * 3);
    score += cloudPenalty;
    factors.push({ label: `${criticalCentralized} service(s) critique(s) centralisé(s)`, contribution: cloudPenalty, status: "negative" });
  } else if (nonCriticalCentralized > 0) {
    const cloudPenalty = Math.min(10, nonCriticalCentralized * 3);
    score += cloudPenalty;
    factors.push({ label: `${nonCriticalCentralized} service(s) non-critique(s) centralisé(s)`, contribution: cloudPenalty, status: "negative" });
  } else {
    factors.push({ label: "Aucune dépendance cloud critique", contribution: 8, status: "positive" });
  }

  // Factor 5: Rotations à temps (0-18 points de réduction)
  if (input.totalRotations > 0) {
    const rotationRate = input.onTimeRotations / input.totalRotations;
    const rotationBonus = Math.round(rotationRate * 18);
    score -= rotationBonus;
    factors.push({ label: `${input.onTimeRotations}/${input.totalRotations} rotations à temps`, contribution: rotationBonus, status: "positive" });
  }

  // Factor 6: Audit overdue (0 or 20 points)
  if (input.auditOverdue) {
    score += 20;
    factors.push({ label: "Audit croisé en retard (>18 mois)", contribution: 20, status: "negative" });
  } else {
    factors.push({ label: "Audit croisé à jour", contribution: 5, status: "positive" });
  }

  // Factor 7: Resident diversity bonus (-5 points)
  if (input.hasActiveResident) {
    score -= 5;
    factors.push({ label: "Résident actif — regard extérieur", contribution: 5, status: "positive" });
  }

  score = Math.max(0, Math.min(100, score));
  return { score, factors };
}
