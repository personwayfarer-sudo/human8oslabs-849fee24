import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";
import { ArrowRight, ArrowLeft, Package } from "lucide-react";

const mockFlows = [
  { id: "1", type: "entrée", resource: "Légumes bio", quantity: "45 kg", source: "Ferme Bel-Air", date: "12 fév" },
  { id: "2", type: "entrée", resource: "Farine", quantity: "10 kg", source: "Coopérative locale", date: "11 fév" },
  { id: "3", type: "sortie", resource: "Repas préparés", quantity: "30 portions", source: "Cuisine collective", date: "11 fév" },
  { id: "4", type: "entrée", resource: "Eau potable", quantity: "200 L", source: "Source communale", date: "10 fév" },
  { id: "5", type: "sortie", resource: "Bois de chauffe", quantity: "50 kg", source: "Stock commun", date: "10 fév" },
  { id: "6", type: "entrée", resource: "Médicaments de base", quantity: "1 kit", source: "Pharmacie solidaire", date: "9 fév" },
];

const mockStock = [
  { resource: "Eau potable", quantity: "500 L", autonomy: "5 jours", status: "danger" as const },
  { resource: "Céréales & Légumineuses", quantity: "85 kg", autonomy: "23 jours", status: "safe" as const },
  { resource: "Légumes frais", quantity: "45 kg", autonomy: "8 jours", status: "warning" as const },
  { resource: "Bois / Combustible", quantity: "200 kg", autonomy: "15 jours", status: "safe" as const },
  { resource: "Pharmacie", quantity: "3 kits", autonomy: "30 jours", status: "safe" as const },
];

const statusDot: Record<string, string> = {
  safe: "bg-safe",
  warning: "bg-warning",
  danger: "bg-destructive",
};

export default function Subsistance() {
  return (
    <Layout>
      <PageHeader
        title="Subsistance"
        subtitle="Gestion mutualisée des ressources vitales — logique de flux, pas de dette individuelle."
        pedagogy="Ce module gère les ressources partagées sans lier de crédit ou de dette à un individu. Les ressources circulent : elles entrent, elles sortent. Personne n'est débiteur."
      />

      {/* Stock overview */}
      <div className="glass-card mb-6 overflow-hidden">
        <div className="px-4 py-3 border-b border-border/50 flex items-center gap-2">
          <Package className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold">Stock Commun</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/30">
                <th className="text-left px-4 py-2 data-label">Ressource</th>
                <th className="text-left px-4 py-2 data-label">Quantité</th>
                <th className="text-left px-4 py-2 data-label">Autonomie</th>
                <th className="text-left px-4 py-2 data-label">État</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {mockStock.map((item) => (
                <tr key={item.resource} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-2.5 font-medium text-foreground">{item.resource}</td>
                  <td className="px-4 py-2.5 font-mono text-muted-foreground">{item.quantity}</td>
                  <td className="px-4 py-2.5 font-mono text-muted-foreground">{item.autonomy}</td>
                  <td className="px-4 py-2.5">
                    <span className={`inline-flex items-center gap-1.5`}>
                      <span className={`w-2 h-2 rounded-full ${statusDot[item.status]}`} />
                      <span className="text-xs text-muted-foreground capitalize">{item.status === "safe" ? "OK" : item.status === "warning" ? "Bas" : "Critique"}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Flow log */}
      <div className="glass-card overflow-hidden">
        <div className="px-4 py-3 border-b border-border/50">
          <h3 className="text-sm font-semibold">Journal des Flux</h3>
          <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mt-0.5">
            Entrées & Sorties · Sans dette
          </p>
        </div>
        <div className="divide-y divide-border/20">
          {mockFlows.map((flow, i) => (
            <div
              key={flow.id}
              className="px-4 py-3 flex items-center gap-3 animate-fade-in"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className={`w-7 h-7 rounded flex items-center justify-center flex-shrink-0 ${
                flow.type === "entrée" ? "bg-safe/10" : "bg-accent/10"
              }`}>
                {flow.type === "entrée"
                  ? <ArrowRight className="h-3.5 w-3.5 text-safe" />
                  : <ArrowLeft className="h-3.5 w-3.5 text-accent" />
                }
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground font-medium">{flow.resource}</p>
                <p className="text-xs text-muted-foreground">{flow.source}</p>
              </div>
              <span className="text-sm font-mono text-muted-foreground">{flow.quantity}</span>
              <span className="text-xs text-muted-foreground">{flow.date}</span>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
