/**
 * HUMAN∞OS — Système d'identité opaque
 * 
 * Les membres sont identifiés par des pseudonymes de rôle, pas par leur identité civile.
 * Privacy by Design : aucune donnée personnelle n'est stockée en clair.
 */

export interface MemberIdentity {
  /** Internal ID — never displayed */
  id: string;
  /** Role-based pseudonym visible to the system */
  pseudonym: string;
  /** Current role alias */
  roleAlias: string;
  /** Hash of personal data — never the data itself */
  identityHash: string;
  /** When the pseudonym was last rotated */
  pseudonymSince: string;
}

const ROLE_PREFIXES: Record<string, string> = {
  "Gestion Numérique": "Gardien",
  "Cuisine Collective": "Nourricier",
  "Accueil & Médiation": "Médiateur",
  "Maintenance Habitat": "Bâtisseur",
  "Gestion des Stocks": "Intendant",
  "Comptabilité Commune": "Comptable",
};

const SUFFIXES = ["A", "B", "C", "D", "E", "F", "G", "H"];

/**
 * Generate a role-based pseudonym from a role name and member index
 */
export function generatePseudonym(roleName: string, index: number): string {
  const prefix = ROLE_PREFIXES[roleName] || "Membre";
  const suffix = SUFFIXES[index % SUFFIXES.length];
  return `${prefix}_${suffix}`;
}

/**
 * Simulate hashing personal data (in production, use proper crypto)
 */
export function hashIdentity(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    const char = name.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return `0x${Math.abs(hash).toString(16).padStart(8, '0').toUpperCase()}`;
}

/**
 * Build the member identity registry with opacity
 */
export function buildIdentityRegistry(
  members: { id: string; name: string }[],
  roles: { id: string; name: string; currentMemberId: string | null }[]
): MemberIdentity[] {
  return members.map((member, idx) => {
    const currentRole = roles.find(r => r.currentMemberId === member.id);
    const roleAlias = currentRole
      ? generatePseudonym(currentRole.name, idx)
      : `Membre_${SUFFIXES[idx % SUFFIXES.length]}`;

    return {
      id: member.id,
      pseudonym: roleAlias,
      roleAlias: currentRole?.name || "Sans rôle actif",
      identityHash: hashIdentity(member.name),
      pseudonymSince: new Date(Date.now() - (idx + 1) * 3 * 24 * 60 * 60 * 1000).toISOString(),
    };
  });
}

/**
 * Generate the full Exit Manifest — everything a member needs to rebuild a Lab
 */
export function generateExitManifest() {
  const manifest = {
    meta: {
      type: "HUMAN∞OS — Manifeste de Sortie",
      version: "1.0",
      generatedAt: new Date().toISOString(),
      purpose: "Ce document contient l'intégralité des savoirs, protocoles et données nécessaires pour recréer un Lab autonome. Zéro perte vitale à la sortie.",
      license: "Domaine Public — Aucune restriction d'usage",
    },
    principes_SOCLE: {
      description: "Les 6 axiomes biomimétiques qui fondent l'architecture HUMAN∞OS",
      axiomes: [
        { nom: "Dissociation", regle: "Les ressources vitales ne dépendent jamais de la performance individuelle." },
        { nom: "Rotation", regle: "Aucun rôle n'est fixe au-delà du cycle configuré (défaut : 14 jours)." },
        { nom: "Subsidiarité", regle: "Les décisions sont prises au niveau le plus local possible." },
        { nom: "Transparence", regle: "Toutes les décisions et mouvements sont consignés dans le Mur de Transparence." },
        { nom: "Sortie Libre", regle: "Quitter le Lab ne coûte rien de vital. Ce manifeste en est la preuve." },
        { nom: "Minimum Vital", regle: "Un seuil de sécurité (30 jours) est maintenu pour chaque ressource essentielle." },
      ],
    },
    protocole_mediation: {
      description: "Processus de résolution des tensions structurelles",
      etapes: [
        { phase: "Clarification", regle: "Questions d'information uniquement. Pas de jugement." },
        { phase: "Réaction", regle: "Chaque membre exprime son avis. Pas de débat." },
        { phase: "Objection de Sécurité", regle: "On n'adopte pas la meilleure idée, mais celle qui ne viole aucun invariant SOCLE." },
      ],
    },
    protocole_rotation: {
      description: "Algorithme de rotation anti-capture",
      regles: [
        "Durée maximale par rôle configurable (défaut : 2 semaines).",
        "Période de refroidissement égale à la durée du mandat.",
        "Tirage au sort pondéré : ceux qui ont le moins occupé un rôle ont plus de chances.",
        "Sécurité de dernier recours : si tous en refroidissement, levée par ancienneté.",
      ],
    },
    guide_subsistance: {
      description: "Gestion des ressources vitales",
      principes: [
        "Logique de flux, pas de dette individuelle.",
        "Consommation de flux (pas de 'dépense').",
        "Seuil de sécurité : 30 jours d'autonomie minimum par ressource.",
        "Alerte automatique si le flux de sortie dépasse le flux d'entrée.",
      ],
    },
    etat_stocks: {
      description: "État actuel des stocks du Lab au moment de l'export",
      stocks: [
        { ressource: "Eau potable", quantite: "500 L", autonomie: "5 jours", etat: "critique" },
        { ressource: "Céréales & Légumineuses", quantite: "85 kg", autonomie: "23 jours", etat: "stable" },
        { ressource: "Légumes frais", quantite: "45 kg", autonomie: "8 jours", etat: "bas" },
        { ressource: "Bois / Combustible", quantite: "200 kg", autonomie: "15 jours", etat: "stable" },
        { ressource: "Pharmacie", quantite: "3 kits", autonomie: "30 jours", etat: "stable" },
      ],
    },
    boussole_capture: {
      description: "Facteurs de l'Indice de Capture",
      facteurs: [
        "Concentration des rôles (1 personne = 2+ rôles → +points)",
        "Stocks sous seuil de sécurité → +points",
        "Tensions ouvertes non résolues → +points",
        "Dépendance cloud / services centralisés → +points",
        "Rotations effectuées à temps → −points (bon signe)",
      ],
    },
    guide_creation_lab: {
      titre: "Comment créer un nouveau Lab à partir de ce manifeste",
      etapes: [
        "1. Réunir un minimum de 3 personnes volontaires.",
        "2. Adopter les 6 axiomes SOCLE comme constitution minimale.",
        "3. Identifier les ressources vitales disponibles et calculer l'autonomie en jours.",
        "4. Configurer la rotation des rôles (durée et refroidissement).",
        "5. Ouvrir un Mur de Transparence pour consigner toutes les décisions.",
        "6. Calculer l'Indice de Capture initial et fixer un objectif < 20%.",
        "7. Garantir la portabilité : chaque membre peut générer ce manifeste à tout moment.",
      ],
    },
    clause_finale: "Si ce document ne peut être quitté sans perte intellectuelle, alors il viole ce qu'il défend. Tout est amendable. Tout est contestable. Rien n'est sacré sauf la dignité.",
  };

  return manifest;
}
