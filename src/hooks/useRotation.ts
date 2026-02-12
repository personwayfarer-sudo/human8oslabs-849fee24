import { useState, useCallback } from "react";
import {
  RotationState,
  Member,
  Role,
  RoleAssignment,
  executeRotation,
  daysUntilRotation,
  getEligibleMembers,
  needsRotation,
} from "@/lib/rotation-engine";

const MEMBERS: Member[] = [
  { id: "m1", name: "Aïcha M.", avatar: "A" },
  { id: "m2", name: "Karim B.", avatar: "K" },
  { id: "m3", name: "Leïla S.", avatar: "L" },
  { id: "m4", name: "Omar T.", avatar: "O" },
  { id: "m5", name: "Nadia R.", avatar: "N" },
  { id: "m6", name: "Youssef D.", avatar: "Y" },
];

const DEFAULT_MAX_WEEKS = 2;

function daysAgo(d: number): string {
  const date = new Date();
  date.setDate(date.getDate() - d);
  return date.toISOString();
}

const INITIAL_ROLES: Role[] = [
  { id: "r1", name: "Gestion Numérique", currentMemberId: "m3", assignedAt: daysAgo(3), maxWeeks: DEFAULT_MAX_WEEKS },
  { id: "r2", name: "Cuisine Collective", currentMemberId: "m4", assignedAt: daysAgo(6), maxWeeks: DEFAULT_MAX_WEEKS },
  { id: "r3", name: "Accueil & Médiation", currentMemberId: "m5", assignedAt: daysAgo(9), maxWeeks: DEFAULT_MAX_WEEKS },
  { id: "r4", name: "Maintenance Habitat", currentMemberId: "m6", assignedAt: daysAgo(12), maxWeeks: DEFAULT_MAX_WEEKS },
  { id: "r5", name: "Gestion des Stocks", currentMemberId: "m1", assignedAt: daysAgo(4), maxWeeks: DEFAULT_MAX_WEEKS },
  { id: "r6", name: "Comptabilité Commune", currentMemberId: "m2", assignedAt: daysAgo(8), maxWeeks: DEFAULT_MAX_WEEKS },
];

const INITIAL_HISTORY: RoleAssignment[] = [
  { roleId: "r1", memberId: "m2", startDate: daysAgo(28), endDate: daysAgo(14), wasRefused: false },
  { roleId: "r1", memberId: "m4", startDate: daysAgo(14), endDate: daysAgo(3), wasRefused: false },
  { roleId: "r4", memberId: "m1", startDate: daysAgo(26), endDate: daysAgo(12), wasRefused: false },
  { roleId: "r2", memberId: "m5", startDate: daysAgo(20), endDate: daysAgo(6), wasRefused: false },
  { roleId: "r3", memberId: "m6", startDate: daysAgo(23), endDate: daysAgo(9), wasRefused: false },
];

export interface RotationLog {
  id: string;
  timestamp: string;
  roleId: string;
  roleName: string;
  fromMember: string | null;
  toMember: string;
  reason: string;
}

export function useRotation() {
  const [state, setState] = useState<RotationState>({
    members: MEMBERS,
    roles: INITIAL_ROLES,
    history: INITIAL_HISTORY,
    defaultMaxWeeks: DEFAULT_MAX_WEEKS,
  });

  const [logs, setLogs] = useState<RotationLog[]>([]);

  const rotate = useCallback((roleId: string) => {
    setState(prev => {
      const role = prev.roles.find(r => r.id === roleId);
      if (!role) return prev;

      const { newState, assigned, reason } = executeRotation(prev, roleId);

      if (assigned) {
        const fromMember = prev.members.find(m => m.id === role.currentMemberId);
        setLogs(l => [{
          id: crypto.randomUUID(),
          timestamp: new Date().toLocaleString("fr-FR"),
          roleId,
          roleName: role.name,
          fromMember: fromMember?.name || null,
          toMember: assigned.name,
          reason,
        }, ...l]);
      }

      return newState;
    });
  }, []);

  const rotateAll = useCallback(() => {
    setState(prev => {
      let current = prev;
      const newLogs: RotationLog[] = [];

      for (const role of current.roles) {
        if (needsRotation(role)) {
          const fromMember = current.members.find(m => m.id === role.currentMemberId);
          const { newState, assigned, reason } = executeRotation(current, role.id);
          if (assigned) {
            newLogs.push({
              id: crypto.randomUUID(),
              timestamp: new Date().toLocaleString("fr-FR"),
              roleId: role.id,
              roleName: role.name,
              fromMember: fromMember?.name || null,
              toMember: assigned.name,
              reason,
            });
          }
          current = newState;
        }
      }

      if (newLogs.length > 0) {
        setLogs(l => [...newLogs, ...l]);
      }

      return current;
    });
  }, []);

  const setMaxWeeks = useCallback((roleId: string, weeks: number) => {
    setState(prev => ({
      ...prev,
      roles: prev.roles.map(r => r.id === roleId ? { ...r, maxWeeks: weeks } : r),
    }));
  }, []);

  const getRoleInfo = useCallback((roleId: string) => {
    const role = state.roles.find(r => r.id === roleId);
    if (!role) return null;

    const currentMember = state.members.find(m => m.id === role.currentMemberId);
    const days = role.assignedAt ? daysUntilRotation(role.assignedAt, role.maxWeeks) : 0;
    const mustRotate = needsRotation(role);
    const eligible = getEligibleMembers(roleId, state.members, state.roles, state.history, role.maxWeeks);
    const pastHolders = state.history
      .filter(h => h.roleId === roleId)
      .map(h => ({ member: state.members.find(m => m.id === h.memberId)?.name || "?", endDate: h.endDate }))
      .slice(-5);

    return { role, currentMember, daysLeft: days, mustRotate, eligible, pastHolders };
  }, [state]);

  return { state, rotate, rotateAll, setMaxWeeks, getRoleInfo, logs };
}
