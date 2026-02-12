import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";
import { Download, Shield, Users, Database } from "lucide-react";

export default function Parametres() {
  const handleExport = () => {
    const data = {
      exportDate: new Date().toISOString(),
      lab: "Lab Demo",
      version: "HUMAN∞OS v1.0",
      note: "Export complet — données fictives de démonstration.",
      modules: {
        resilience: { captureIndex: 18, foodDays: 23, energyPct: 67, emergencyFund: 2400, waterDays: 5 },
        members: ["Aïcha M.", "Karim B.", "Leïla S.", "Omar T.", "Nadia R.", "Youssef D."],
        roles: [
          { role: "Gestion Numérique", current: "Leïla S.", nextRotation: "25 fév" },
          { role: "Cuisine Collective", current: "Omar T.", nextRotation: "22 fév" },
        ],
      },
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `humanos-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Layout>
      <PageHeader
        title="Paramètres du Lab"
        subtitle="Configuration, exportation et transparence du système."
        pedagogy="Les paramètres sont accessibles à tous les membres. L'exportation garantit que vos données ne sont jamais captives de la plateforme."
      />

      <div className="space-y-4 max-w-2xl">
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
              <span className="font-medium font-mono">6</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Version OS</span>
              <span className="font-medium font-mono">HUMAN∞OS v1.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Durée du cycle de rotation</span>
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
            ].map((inv) => (
              <div key={inv} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-safe mt-1.5 flex-shrink-0" />
                <span>{inv}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Export */}
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <Database className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold">Exportation des Données</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            Les données appartiennent au Lab. Exportez l'intégralité en format JSON ouvert pour garantir la non-dépendance à la plateforme.
          </p>
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <Download className="h-4 w-4" />
            Exporter toutes les données
          </button>
        </div>
      </div>
    </Layout>
  );
}
