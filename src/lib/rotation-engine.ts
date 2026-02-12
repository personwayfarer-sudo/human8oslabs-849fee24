/**
 * HUMAN∞OS — Algorithme de Rotation Anti-Capture
 * 
 * Principe : Aucune personne ne peut occuper le même rôle plus de X semaines consécutives.
 * L'algorithme exclut du tirage au sort les membres ayant occupé ce rôle récemment
 * (période de "refroidissement"), garantissant la non-extraction du pouvoir.
 * 
 * Règles :
 * 1. Durée maximale par poste configurable (maxWeeks)
 * 2. Période de refroidissement = maxWeeks (un membre ne peut revenir sur le même rôle 
 *    avant que maxWeeks cycles supplémentaires se soient écoulés)
 * 3. Tirage au sort équitable parmi les éligibles
 * 4. Un membre peut refuser → réinscrit en fin de file
 * 5. Si aucun éligible, le refroidissement est levé par ancienneté
 */

export interface Member {
  id: string;
  name: string;
  avatar: string;
}

export interface RoleAssignment {
  roleId: string;
  memberId: string;
  startDate: string; // ISO
  endDate: string | null;
  wasRefused: boolean;
}

export interface Role {
  id: string;
  name: string;
  currentMemberId: string | null;
  assignedAt: string | null; // ISO date
  maxWeeks: number;
}

export interface RotationState {
  members: Member[];
  roles: Role[];
  history: RoleAssignment[];
  defaultMaxWeeks: number;
}

/**
 * Calcule le nombre de semaines écoulées depuis une date
 */
function weeksSince(dateISO: string): number {
  const diff = Date.now() - new Date(dateISO).getTime();
  return Math.floor(diff / (7 * 24 * 60 * 60 * 1000));
}

/**
 * Calcule les jours restants avant rotation obligatoire
 */
export function daysUntilRotation(assignedAt: string, maxWeeks: number): number {
  const deadline = new Date(assignedAt);
  deadline.setDate(deadline.getDate() + maxWeeks * 7);
  const diff = deadline.getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

/**
 * Détermine si un membre est en période de refroidissement pour un rôle donné.
 * Refroidissement = le membre a occupé ce rôle dans les (maxWeeks) dernières semaines
 * après sa dernière fin de mandat.
 */
export function isInCooldown(
  memberId: string,
  roleId: string,
  history: RoleAssignment[],
  maxWeeks: number
): boolean {
  const pastAssignments = history
    .filter(h => h.roleId === roleId && h.memberId === memberId && h.endDate)
    .sort((a, b) => new Date(b.endDate!).getTime() - new Date(a.endDate!).getTime());

  if (pastAssignments.length === 0) return false;

  const lastEnd = pastAssignments[0].endDate!;
  return weeksSince(lastEnd) < maxWeeks;
}

/**
 * Retourne la liste des membres éligibles pour un rôle donné :
 * - Pas actuellement affecté à ce rôle
 * - Pas en période de refroidissement
 */
export function getEligibleMembers(
  roleId: string,
  members: Member[],
  roles: Role[],
  history: RoleAssignment[],
  maxWeeks: number
): Member[] {
  const role = roles.find(r => r.id === roleId);
  
  // Exclure les membres déjà affectés à d'autres rôles ? Non — un membre peut
  // théoriquement tenir plusieurs rôles dans un petit Lab. Mais on exclut
  // le titulaire actuel et ceux en refroidissement.
  const eligible = members.filter(m => {
    if (role?.currentMemberId === m.id) return false;
    if (isInCooldown(m.id, roleId, history, maxWeeks)) return false;
    return true;
  });

  // Sécurité : si aucun éligible, lever le refroidissement par ancienneté
  if (eligible.length === 0) {
    const fallback = members
      .filter(m => role?.currentMemberId !== m.id)
      .sort((a, b) => {
        const aLast = history
          .filter(h => h.roleId === roleId && h.memberId === a.id && h.endDate)
          .sort((x, y) => new Date(x.endDate!).getTime() - new Date(y.endDate!).getTime())[0];
        const bLast = history
          .filter(h => h.roleId === roleId && h.memberId === b.id && h.endDate)
          .sort((x, y) => new Date(x.endDate!).getTime() - new Date(y.endDate!).getTime())[0];
        return (aLast ? new Date(aLast.endDate!).getTime() : 0) - (bLast ? new Date(bLast.endDate!).getTime() : 0);
      });
    return fallback.length > 0 ? [fallback[0]] : [];
  }

  return eligible;
}

/**
 * Tirage au sort équitable : sélection aléatoire parmi les éligibles,
 * avec pondération légère en faveur de ceux qui ont le moins occupé ce rôle.
 */
export function drawMember(eligible: Member[], roleId: string, history: RoleAssignment[]): Member | null {
  if (eligible.length === 0) return null;
  if (eligible.length === 1) return eligible[0];

  // Pondération : moins de mandats passés = plus de chances
  const weights = eligible.map(m => {
    const count = history.filter(h => h.roleId === roleId && h.memberId === m.id).length;
    return { member: m, weight: 1 / (count + 1) };
  });

  const totalWeight = weights.reduce((sum, w) => sum + w.weight, 0);
  let random = Math.random() * totalWeight;

  for (const w of weights) {
    random -= w.weight;
    if (random <= 0) return w.member;
  }

  return weights[weights.length - 1].member;
}

/**
 * Vérifie si une rotation est nécessaire (mandat dépassé)
 */
export function needsRotation(role: Role): boolean {
  if (!role.assignedAt || !role.currentMemberId) return true;
  return daysUntilRotation(role.assignedAt, role.maxWeeks) === 0;
}

/**
 * Exécute une rotation pour un rôle donné.
 * Retourne le nouveau state avec l'historique mis à jour.
 */
export function executeRotation(
  state: RotationState,
  roleId: string
): { newState: RotationState; assigned: Member | null; reason: string } {
  const role = state.roles.find(r => r.id === roleId);
  if (!role) return { newState: state, assigned: null, reason: "Rôle introuvable" };

  const eligible = getEligibleMembers(roleId, state.members, state.roles, state.history, role.maxWeeks);
  const selected = drawMember(eligible, roleId, state.history);

  if (!selected) {
    return { newState: state, assigned: null, reason: "Aucun membre éligible" };
  }

  const now = new Date().toISOString();

  // Close current assignment in history
  const updatedHistory = [...state.history];
  if (role.currentMemberId) {
    updatedHistory.push({
      roleId,
      memberId: role.currentMemberId,
      startDate: role.assignedAt || now,
      endDate: now,
      wasRefused: false,
    });
  }

  // Update role
  const updatedRoles = state.roles.map(r =>
    r.id === roleId ? { ...r, currentMemberId: selected.id, assignedAt: now } : r
  );

  return {
    newState: { ...state, roles: updatedRoles, history: updatedHistory },
    assigned: selected,
    reason: `${selected.name} sélectionné·e parmi ${eligible.length} éligible(s) par tirage au sort pondéré.`,
  };
}

/**
 * Compte le nombre de fois qu'un membre a occupé chaque rôle (pour transparence)
 */
export function getMemberRoleStats(
  memberId: string,
  history: RoleAssignment[]
): Record<string, number> {
  const stats: Record<string, number> = {};
  for (const h of history) {
    if (h.memberId === memberId) {
      stats[h.roleId] = (stats[h.roleId] || 0) + 1;
    }
  }
  return stats;
}
