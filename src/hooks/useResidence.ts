import { useState, useCallback } from "react";

export interface ResidenceToken {
  id: string;
  code: string;
  pseudonym: string;
  labOrigin: string;
  roleHistory: string[];
  cognitiveValidations: string[];
  generatedAt: string;
}

export interface Resident {
  id: string;
  token: ResidenceToken;
  status: "pending" | "active" | "completed";
  startDate: string | null;
  endDate: string | null;
  durationMonths: 1 | 2 | 3;
  accessLevel: "read-only";
  allowedRoles: string[];
  forbiddenRoles: string[];
  report: string | null;
  reportSubmittedAt: string | null;
}

function generateTokenCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "RES-";
  for (let i = 0; i < 8; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

const DEMO_TOKEN: ResidenceToken = {
  id: "token-demo",
  code: "RES-K7M3X9AB",
  pseudonym: "Gardien_C",
  labOrigin: "Lab-Gamma",
  roleHistory: ["Intendant (3 cycles)", "Nourricier (2 cycles)", "Bâtisseur (1 cycle)"],
  cognitiveValidations: [
    "Gestion des stocks — flux entrants/sortants",
    "Rotation des rôles — algorithme anti-capture",
    "Protocole de médiation — 3 phases",
    "Export du Manifeste de Sortie",
  ],
  generatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
};

const DEMO_RESIDENT: Resident = {
  id: "resident-demo",
  token: DEMO_TOKEN,
  status: "active",
  startDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
  endDate: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000).toISOString(),
  durationMonths: 2,
  accessLevel: "read-only",
  allowedRoles: ["Soutien Cuisine", "Soutien Maintenance", "Soutien Stocks"],
  forbiddenRoles: ["Médiateur", "Auditeur", "Gardien Numérique"],
  report: null,
  reportSubmittedAt: null,
};

export function useResidence() {
  const [residents, setResidents] = useState<Resident[]>([DEMO_RESIDENT]);
  const [generatedToken, setGeneratedToken] = useState<ResidenceToken | null>(null);

  const activeResidents = residents.filter((r) => r.status === "active");
  const hasActiveResident = activeResidents.length > 0;

  const generateToken = useCallback(
    (pseudonym: string, labOrigin: string, roleHistory: string[], cognitiveValidations: string[]) => {
      const token: ResidenceToken = {
        id: `token-${Date.now()}`,
        code: generateTokenCode(),
        pseudonym,
        labOrigin,
        roleHistory,
        cognitiveValidations,
        generatedAt: new Date().toISOString(),
      };
      setGeneratedToken(token);
      return token;
    },
    []
  );

  const acceptResident = useCallback((token: ResidenceToken, durationMonths: 1 | 2 | 3) => {
    const start = new Date();
    const end = new Date();
    end.setMonth(end.getMonth() + durationMonths);

    const resident: Resident = {
      id: `resident-${Date.now()}`,
      token,
      status: "active",
      startDate: start.toISOString(),
      endDate: end.toISOString(),
      durationMonths,
      accessLevel: "read-only",
      allowedRoles: ["Soutien Cuisine", "Soutien Maintenance", "Soutien Stocks"],
      forbiddenRoles: ["Médiateur", "Auditeur", "Gardien Numérique"],
      report: null,
      reportSubmittedAt: null,
    };
    setResidents((prev) => [...prev, resident]);
  }, []);

  const submitReport = useCallback((residentId: string, report: string) => {
    setResidents((prev) =>
      prev.map((r) =>
        r.id === residentId
          ? { ...r, report, reportSubmittedAt: new Date().toISOString(), status: "completed" as const }
          : r
      )
    );
  }, []);

  return {
    residents,
    activeResidents,
    hasActiveResident,
    generatedToken,
    generateToken,
    acceptResident,
    submitReport,
  };
}
