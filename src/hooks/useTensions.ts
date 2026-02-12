import { useState, useCallback } from "react";

export type TensionPhase = "clarification" | "reaction" | "objection" | "resolved" | "abandoned";

export interface TensionComment {
  id: string;
  memberId: string;
  memberName: string;
  phase: TensionPhase;
  content: string;
  timestamp: string;
}

export interface Tension {
  id: string;
  title: string;
  description: string;
  /** What is vs what could be */
  currentState: string;
  desiredState: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  phase: TensionPhase;
  comments: TensionComment[];
  /** Which SOCLE invariant does the objection target (if any) */
  objectionInvariant?: string;
  objectionReason?: string;
}

const MOCK_TENSIONS: Tension[] = [
  {
    id: "t1",
    title: "Accès au local de stockage",
    description: "Le local de stockage n'est accessible qu'avec le code détenu par 2 personnes.",
    currentState: "Seuls Karim et Leïla connaissent le code du local.",
    desiredState: "Tous les membres volontaires ont accès au local via un système de clé tournante.",
    authorId: "m5",
    authorName: "Nadia R.",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    phase: "reaction",
    comments: [
      { id: "c1", memberId: "m1", memberName: "Aïcha M.", phase: "clarification", content: "Est-ce que le code a été partagé volontairement ou par oubli ?", timestamp: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000).toISOString() },
      { id: "c2", memberId: "m5", memberName: "Nadia R.", phase: "clarification", content: "Par oubli lors de la dernière rotation. Pas d'intention de concentration.", timestamp: new Date(Date.now() - 1.4 * 24 * 60 * 60 * 1000).toISOString() },
      { id: "c3", memberId: "m4", memberName: "Omar T.", phase: "reaction", content: "Je pense qu'un système de clé tournante intégré au module de rotation serait idéal.", timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
    ],
  },
  {
    id: "t2",
    title: "Rythme des réunions plénières",
    description: "Les réunions hebdomadaires semblent trop fréquentes pour certains membres.",
    currentState: "Réunion plénière chaque lundi, 1h30.",
    desiredState: "Réunion bimensuelle avec des micro-bilans asynchrones entre les sessions.",
    authorId: "m6",
    authorName: "Youssef D.",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    phase: "clarification",
    comments: [
      { id: "c4", memberId: "m2", memberName: "Karim B.", phase: "clarification", content: "Combien de membres ont exprimé cette difficulté ?", timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() },
    ],
  },
  {
    id: "t3",
    title: "Documentation cuisine collective",
    description: "Les recettes et procédures de la cuisine ne sont pas documentées.",
    currentState: "Seul Omar connaît l'organisation de la cuisine.",
    desiredState: "Un guide opérationnel est disponible dans les Savoirs pour quiconque prend le rôle.",
    authorId: "m1",
    authorName: "Aïcha M.",
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    phase: "resolved",
    comments: [
      { id: "c5", memberId: "m4", memberName: "Omar T.", phase: "clarification", content: "Bonne idée. Je peux rédiger la base cette semaine.", timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() },
      { id: "c6", memberId: "m3", memberName: "Leïla S.", phase: "reaction", content: "Essentiel pour la justice cognitive. Sans doc, le savoir est captif.", timestamp: new Date(Date.now() - 6.5 * 24 * 60 * 60 * 1000).toISOString() },
      { id: "c7", memberId: "m5", memberName: "Nadia R.", phase: "objection", content: "Aucune objection de sécurité. Le guide respecte tous les invariants SOCLE.", timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString() },
    ],
  },
];

export function useTensions() {
  const [tensions, setTensions] = useState<Tension[]>(MOCK_TENSIONS);

  const addTension = useCallback((tension: Omit<Tension, "id" | "createdAt" | "phase" | "comments">) => {
    setTensions(prev => [{
      ...tension,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      phase: "clarification",
      comments: [],
    }, ...prev]);
  }, []);

  const addComment = useCallback((tensionId: string, comment: Omit<TensionComment, "id" | "timestamp">) => {
    setTensions(prev => prev.map(t =>
      t.id === tensionId
        ? { ...t, comments: [...t.comments, { ...comment, id: crypto.randomUUID(), timestamp: new Date().toISOString() }] }
        : t
    ));
  }, []);

  const advancePhase = useCallback((tensionId: string) => {
    const order: TensionPhase[] = ["clarification", "reaction", "objection", "resolved"];
    setTensions(prev => prev.map(t => {
      if (t.id !== tensionId) return t;
      const idx = order.indexOf(t.phase);
      if (idx < 0 || idx >= order.length - 1) return t;
      return { ...t, phase: order[idx + 1] };
    }));
  }, []);

  const setObjection = useCallback((tensionId: string, invariant: string, reason: string) => {
    setTensions(prev => prev.map(t =>
      t.id === tensionId
        ? { ...t, objectionInvariant: invariant, objectionReason: reason, phase: "abandoned" }
        : t
    ));
  }, []);

  const openCount = tensions.filter(t => t.phase !== "resolved" && t.phase !== "abandoned").length;

  return { tensions, addTension, addComment, advancePhase, setObjection, openCount };
}
