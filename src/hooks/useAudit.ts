import { useState, useCallback } from "react";

export interface SOCLECheck {
  id: string;
  label: string;
  invariant: string;
  checked: boolean | null; // null = not evaluated, true = ok, false = non-compliant
  comment: string;
}

export interface AuditRecord {
  id: string;
  code: string;
  labSource: string;
  auditorAlias: string;
  createdAt: string;
  validatedAt: string | null;
  status: "pending" | "in_progress" | "validated";
  checks: SOCLECheck[];
  observations: string;
}

const DEFAULT_CHECKS: Omit<SOCLECheck, "id">[] = [
  { label: "La rotation des rôles est-elle effective ?", invariant: "Non-Capture", checked: null, comment: "" },
  { label: "Le Manifeste de Sortie est-il à jour ?", invariant: "Sortie Libre", checked: null, comment: "" },
  { label: "La dissociation survie/performance est-elle respectée ?", invariant: "Dissociation", checked: null, comment: "" },
  { label: "Les stocks de subsistance sont-ils au-dessus du seuil de sécurité ?", invariant: "Minimum Vital", checked: null, comment: "" },
  { label: "Le Mur de Transparence est-il accessible à tous les membres ?", invariant: "Transparence", checked: null, comment: "" },
  { label: "Les tensions sont-elles traitées via le protocole de médiation ?", invariant: "Non-Capture Émotionnelle", checked: null, comment: "" },
  { label: "Les données personnelles sont-elles protégées (pseudonymes) ?", invariant: "Opacité", checked: null, comment: "" },
  { label: "Aucun service critique ne dépend d'un tiers centralisé unique ?", invariant: "Souveraineté Numérique", checked: null, comment: "" },
];

function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "AUDIT-";
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

function createChecks(): SOCLECheck[] {
  return DEFAULT_CHECKS.map((c, i) => ({ ...c, id: `check-${i}` }));
}

// Simulated last audit date (for demo — 14 months ago)
const LAST_AUDIT_DATE = new Date();
LAST_AUDIT_DATE.setMonth(LAST_AUDIT_DATE.getMonth() - 14);

const AUDIT_INTERVAL_MONTHS = 18;

export function useAudit() {
  const [audits, setAudits] = useState<AuditRecord[]>([
    {
      id: "audit-demo",
      code: "AUDIT-K7M3X9",
      labSource: "Lab-Beta",
      auditorAlias: "Auditeur_Ext_1",
      createdAt: LAST_AUDIT_DATE.toISOString(),
      validatedAt: LAST_AUDIT_DATE.toISOString(),
      status: "validated",
      checks: DEFAULT_CHECKS.map((c, i) => ({ ...c, id: `demo-${i}`, checked: true })),
      observations: "Le Lab respecte les invariants SOCLE. La rotation des rôles est bien documentée. Recommandation : renforcer l'autonomie énergétique.",
    },
  ]);

  const lastValidatedAudit = audits.find((a) => a.status === "validated");
  const lastAuditDate = lastValidatedAudit ? new Date(lastValidatedAudit.validatedAt!) : null;

  const nextAuditDeadline = lastAuditDate
    ? new Date(lastAuditDate.getFullYear(), lastAuditDate.getMonth() + AUDIT_INTERVAL_MONTHS, lastAuditDate.getDate())
    : new Date(); // overdue if never audited

  const now = new Date();
  const daysUntilDeadline = Math.ceil((nextAuditDeadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const isOverdue = daysUntilDeadline <= 0;
  const monthsRemaining = Math.max(0, Math.round(daysUntilDeadline / 30));

  const generateAuditCode = useCallback(() => {
    const code = generateCode();
    const newAudit: AuditRecord = {
      id: `audit-${Date.now()}`,
      code,
      labSource: "",
      auditorAlias: "",
      createdAt: new Date().toISOString(),
      validatedAt: null,
      status: "pending",
      checks: createChecks(),
      observations: "",
    };
    setAudits((prev) => [newAudit, ...prev]);
    return code;
  }, []);

  const startAudit = useCallback((auditId: string, labSource: string, auditorAlias: string) => {
    setAudits((prev) =>
      prev.map((a) =>
        a.id === auditId ? { ...a, labSource, auditorAlias, status: "in_progress" as const } : a
      )
    );
  }, []);

  const updateCheck = useCallback((auditId: string, checkId: string, value: boolean, comment: string) => {
    setAudits((prev) =>
      prev.map((a) =>
        a.id === auditId
          ? {
              ...a,
              checks: a.checks.map((c) => (c.id === checkId ? { ...c, checked: value, comment } : c)),
            }
          : a
      )
    );
  }, []);

  const submitObservations = useCallback((auditId: string, observations: string) => {
    setAudits((prev) =>
      prev.map((a) =>
        a.id === auditId ? { ...a, observations, validatedAt: new Date().toISOString(), status: "validated" as const } : a
      )
    );
  }, []);

  return {
    audits,
    lastAuditDate,
    nextAuditDeadline,
    daysUntilDeadline,
    monthsRemaining,
    isOverdue,
    generateAuditCode,
    startAudit,
    updateCheck,
    submitObservations,
  };
}
