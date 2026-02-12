import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";
import { JusticeCognitive } from "@/components/JusticeCognitive";
import { buildIdentityRegistry } from "@/lib/opacity-engine";
import { generateExitManifest } from "@/lib/opacity-engine";
import { Download, Shield, Users, Database, Eye, EyeOff, FileJson, BookOpen, Cloud } from "lucide-react";
import { useState } from "react";

const members = [
  { id: "m1", name: "Aïcha M." },
  { id: "m2", name: "Karim B." },
  { id: "m3", name: "Leïla S." },
  { id: "m4", name: "Omar T." },
  { id: "m5", name: "Nadia R." },
  { id: "m6", name: "Youssef D." },
];

const roles = [
  { id: "r1", name: "Gestion Numérique", currentMemberId: "m3" },
  { id: "r2", name: "Cuisine Collective", currentMemberId: "m4" },
  { id: "r3", name: "Accueil & Médiation", currentMemberId: "m5" },
  { id: "r4", name: "Maintenance Habitat", currentMemberId: "m6" },
  { id: "r5", name: "Gestion des Stocks", currentMemberId: "m1" },
  { id: "r6", name: "Comptabilité Commune", currentMemberId: "m2" },
];

const cloudDeps = [
  { service: "HUMAN∞OS (cette app)", critical: true, selfHostable: true, status: "safe" as const },
  { service: "Serveur électrique (solaire)", critical: true, selfHostable: true, status: "safe" as const },
  { service: "Email (Gmail)", critical: false, selfHostable: false, status: "warning" as const },
  { service: "Cartographie (Google Maps)", critical: false, selfHostable: false, status: "warning" as const },
];

const downloadJSON = (data: object, filename: string) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

export default function Parametres() {
  const identities = buildIdentityRegistry(members, roles);
  const [showHash, setShowHash] = useState(false);

  const handleExportData = () => {
    const data = {
      exportDate: new Date().toISOString(),
      lab: "Lab Démo",
      version: "HUMAN∞OS v1.0",
      note: "Export complet des données opérationnelles.",
      modules: {
        resilience: { captureIndex: 18, foodDays: 23, energyPct: 67, emergencyFund: 2400, waterDays: 5 },
        identities: identities.map(i => ({ pseudonym: i.pseudonym, role: i.roleAlias, hash: i.identityHash })),
        roles: roles.map(r => ({ role: r.name, holder: identities.find(i => i.id === r.currentMemberId)?.pseudonym })),
      },
    };
    downloadJSON(data, `humanos-export-${new Date().toISOString().slice(0, 10)}.json`);
  };

  const handleExitManifest = () => {
    const manifest = generateExitManifest();
    downloadJSON(manifest, `humanos-manifeste-sortie-${new Date().toISOString().slice(0, 10)}.json`);
  };

  return (
    <Layout>
      <PageHeader
        title="Paramètres du Lab"
        subtitle="Configuration, identité opaque, portabilité et transparence du système."
        pedagogy="Les paramètres sont accessibles à tous les membres. L'opacité protège les individus. La portabilité garantit la liberté de sortie. Aucune donnée n'est captive."
      />

      <div className="space-y-4 max-w-2xl">

        {/* Identity — Opacity */}
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 mb-1">
            <EyeOff className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold">Coffre-Fort d'Opacité</h3>
            <JusticeCognitive
              invariant="Opacité Structurelle"
              explanation="L'opacité n'est pas une dissimulation mais une protection. Les données personnelles ne sont jamais stockées en clair. Le système fonctionne sur des pseudonymes de rôle (ex: Gardien_A, Médiateur_B). Cela protège les membres contre la surveillance externe et empêche l'extraction de données personnelles comme levier de pouvoir."
            />
          </div>
          <p className="text-xs text-muted-foreground mb-4">
            Privacy by Design — Aucune identité civile stockée. Seuls les pseudonymes de rôle sont visibles.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/30">
                  <th className="text-left px-3 py-2 data-label">Pseudonyme</th>
                  <th className="text-left px-3 py-2 data-label">Rôle Actuel</th>
                  <th className="text-left px-3 py-2 data-label">
                    <button
                      onClick={() => setShowHash(!showHash)}
                      className="flex items-center gap-1 uppercase tracking-widest text-[10px]"
                    >
                      Empreinte
                      {showHash ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {identities.map((identity) => (
                  <tr key={identity.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-3 py-2.5">
                      <span className="font-mono text-primary font-medium">{identity.pseudonym}</span>
                    </td>
                    <td className="px-3 py-2.5 text-muted-foreground">{identity.roleAlias}</td>
                    <td className="px-3 py-2.5 font-mono text-xs text-muted-foreground">
                      {showHash ? identity.identityHash : "••••••••"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-3 p-2 rounded bg-info/10 border border-info/15">
            <p className="text-[10px] text-muted-foreground">
              <span className="font-medium text-info">∞ Opacité :</span> Les noms civils ne sont jamais transmis ni stockés. L'empreinte (hash) permet de vérifier l'identité sans la révéler.
            </p>
          </div>
        </div>

        {/* Cloud dependencies */}
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 mb-1">
            <Cloud className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold">Dépendances Numériques</h3>
            <JusticeCognitive
              invariant="Subsidiarité Numérique"
              explanation="Chaque service externe centralisé est un point de capture potentiel. Si le Lab dépend d'un service payant pour une fonction vitale, le fournisseur a un pouvoir structurel sur le collectif. Cet indicateur alimente la Boussole de Capture."
            />
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            Services dont le Lab dépend — les services auto-hébergeables ne comptent pas comme capture.
          </p>
          <div className="space-y-2">
            {cloudDeps.map((dep) => (
              <div key={dep.service} className="flex items-center gap-3 p-2 rounded bg-muted/30">
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  dep.selfHostable ? "bg-safe" : "bg-warning"
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">{dep.service}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {dep.critical ? "Critique" : "Non-critique"} · {dep.selfHostable ? "Auto-hébergeable" : "Centralisé"}
                  </p>
                </div>
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                  dep.selfHostable ? "bg-safe/10 text-safe" : "bg-warning/10 text-warning"
                }`}>
                  {dep.selfHostable ? "Libre" : "Captif"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Lab info */}
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <Users className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold">Identité du Lab</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Nom</span>
              <span className="font-medium font-mono">Lab Démo</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Membres actifs</span>
              <span className="font-medium font-mono">{members.length} (pseudonymisés)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Version OS</span>
              <span className="font-medium font-mono">HUMAN∞OS v1.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Cycle de rotation</span>
              <span className="font-medium font-mono">14 jours</span>
            </div>
          </div>
        </div>

        {/* Invariants */}
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold">Invariants actifs</h3>
          </div>
          <div className="space-y-2 text-xs text-muted-foreground">
            {[
              "Dissociation : ressources vitales ≠ performance individuelle",
              "Rotation automatique : aucun rôle fixe au-delà de 14 jours",
              "Justice cognitive : documentation obligatoire pour chaque module",
              "Local-First : exportation totale disponible à tout moment",
              "Sortie libre : quitter le Lab ne coûte rien de vital",
              "Opacité : aucune donnée personnelle en clair — pseudonymes de rôle uniquement",
            ].map((inv) => (
              <div key={inv} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-safe mt-1.5 flex-shrink-0" />
                <span>{inv}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Export Data */}
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <Database className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold">Exportation des Données</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            Les données appartiennent au Lab. Export en JSON ouvert — aucune dépendance à la plateforme.
          </p>
          <button
            onClick={handleExportData}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <Download className="h-4 w-4" />
            Exporter toutes les données
          </button>
        </div>

        {/* EXIT MANIFEST */}
        <div className="glass-card p-5 border-2 border-primary/30">
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="h-5 w-5 text-primary" />
            <h3 className="text-base font-semibold text-foreground">Manifeste de Sortie</h3>
            <JusticeCognitive
              invariant="Sortie Libre"
              explanation="Le Manifeste de Sortie est le document le plus important de HUMAN∞OS. Il contient l'intégralité des savoirs, protocoles et données nécessaires pour recréer un Lab autonome ailleurs. Son existence prouve que le système ne retient personne : quitter ne coûte rien de vital."
            />
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Générez un fichier contenant <strong>l'intégralité des savoirs</strong> du Lab : principes SOCLE, protocoles de médiation, 
            algorithme de rotation, guide de subsistance, état des stocks et guide de création d'un nouveau Lab.
          </p>
          <p className="text-xs text-muted-foreground mb-4 p-2 rounded bg-muted/50">
            <span className="font-medium text-foreground">Objectif :</span> Un membre peut quitter le Lab avec ce fichier et disposer de tout le savoir nécessaire pour recréer une cellule de résilience autonome. <strong>Zéro perte vitale à la sortie.</strong>
          </p>
          <button
            onClick={handleExitManifest}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors w-full justify-center"
          >
            <FileJson className="h-5 w-5" />
            Générer le Manifeste de Sortie
          </button>
        </div>
      </div>
    </Layout>
  );
}
