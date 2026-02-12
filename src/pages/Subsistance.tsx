import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";
import { JusticeCognitive } from "@/components/JusticeCognitive";
import { ArrowRight, ArrowLeft, Package, AlertTriangle, TrendingDown, TrendingUp } from "lucide-react";
import { useMemo } from "react";

interface FlowEntry {
  id: string;
  type: "entrée" | "sortie";
  resource: string;
  quantityNum: number;
  quantityUnit: string;
  source: string;
  date: string;
}

const mockFlows: FlowEntry[] = [
  { id: "1", type: "entrée", resource: "Légumes bio", quantityNum: 45, quantityUnit: "kg", source: "Ferme Bel-Air", date: "12 fév" },
  { id: "2", type: "entrée", resource: "Farine", quantityNum: 10, quantityUnit: "kg", source: "Coopérative locale", date: "11 fév" },
  { id: "3", type: "sortie", resource: "Consommation collective", quantityNum: 30, quantityUnit: "kg", source: "Cuisine collective", date: "11 fév" },
  { id: "4", type: "entrée", resource: "Eau potable", quantityNum: 200, quantityUnit: "L", source: "Source communale", date: "10 fév" },
  { id: "5", type: "sortie", resource: "Consommation eau", quantityNum: 280, quantityUnit: "L", source: "Usage quotidien", date: "10 fév" },
  { id: "6", type: "entrée", resource: "Médicaments de base", quantityNum: 1, quantityUnit: "kit", source: "Pharmacie solidaire", date: "9 fév" },
  { id: "7", type: "sortie", resource: "Bois de chauffe", quantityNum: 50, quantityUnit: "kg", source: "Chauffage collectif", date: "9 fév" },
];

const mockStock = [
  { resource: "Eau potable", quantity: "500 L", autonomy: "5 jours", autonomyDays: 5, status: "danger" as const },
  { resource: "Céréales & Légumineuses", quantity: "85 kg", autonomy: "23 jours", autonomyDays: 23, status: "safe" as const },
  { resource: "Légumes frais", quantity: "45 kg", autonomy: "8 jours", autonomyDays: 8, status: "warning" as const },
  { resource: "Bois / Combustible", quantity: "200 kg", autonomy: "15 jours", autonomyDays: 15, status: "safe" as const },
  { resource: "Pharmacie", quantity: "3 kits", autonomy: "30 jours", autonomyDays: 30, status: "safe" as const },
];

const statusDot: Record<string, string> = {
  safe: "bg-safe",
  warning: "bg-warning",
  danger: "bg-destructive",
};

export default function Subsistance() {
  // Calculate flow balance
  const flowBalance = useMemo(() => {
    const inflow = mockFlows.filter(f => f.type === "entrée").reduce((s, f) => s + f.quantityNum, 0);
    const outflow = mockFlows.filter(f => f.type === "sortie").reduce((s, f) => s + f.quantityNum, 0);
    return { inflow, outflow, deficit: outflow > inflow };
  }, []);

  return (
    <Layout>
      <PageHeader
        title="Subsistance"
        subtitle="Gestion mutualisée des ressources vitales — logique de flux, pas de dette individuelle."
        pedagogy="Ce module gère les ressources partagées sans lier de crédit ou de dette à un individu. Les ressources circulent : elles entrent, elles sortent. Personne n'est débiteur. On ne parle pas de « dépense » mais de « consommation de flux » — la résilience se mesure en jours d'autonomie, pas en monnaie."
      />

      {/* Flow balance alert */}
      {flowBalance.deficit && (
        <div className="mb-6 p-4 rounded-md bg-destructive/10 border border-destructive/20 flex items-start gap-3 animate-fade-in">
          <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-destructive">Alerte : Flux de sortie supérieur au flux d'entrée</p>
            <p className="text-xs text-muted-foreground mt-1">
              Les consommations de flux ({flowBalance.outflow} unités) dépassent les entrées ({flowBalance.inflow} unités) sur la période récente.
              Sans réapprovisionnement, l'autonomie du Lab diminue. Action collective recommandée.
            </p>
          </div>
        </div>
      )}

      {/* Flow rate summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="glass-card p-4">
          <div className="flex items-center gap-1.5 mb-2">
            <span className="data-label">Flux Entrant</span>
            <JusticeCognitive
              invariant="Dissociation"
              explanation="Le flux entrant mesure les ressources qui arrivent dans le Lab. Il n'est jamais attribué à un individu — c'est le système qui reçoit, pas la personne. Cela protège contre la dette morale."
            />
          </div>
          <div className="flex items-baseline gap-2">
            <TrendingUp className="h-4 w-4 text-safe" />
            <span className="text-xl font-mono font-semibold text-foreground">{flowBalance.inflow}</span>
            <span className="text-xs text-muted-foreground">unités</span>
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-1.5 mb-2">
            <span className="data-label">Consommation de Flux</span>
            <JusticeCognitive
              invariant="Non-Capture"
              explanation="La consommation de flux remplace la notion de « dépense ». On ne gère pas de l'argent, on gère de la résilience. La consommation est collective et ne crée aucune dette individuelle."
            />
          </div>
          <div className="flex items-baseline gap-2">
            <TrendingDown className={`h-4 w-4 ${flowBalance.deficit ? "text-destructive" : "text-accent"}`} />
            <span className="text-xl font-mono font-semibold text-foreground">{flowBalance.outflow}</span>
            <span className="text-xs text-muted-foreground">unités</span>
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-1.5 mb-2">
            <span className="data-label">Balance</span>
            <JusticeCognitive
              invariant="Minimum Vital"
              explanation="La balance des flux indique si le Lab consomme plus qu'il ne reçoit. Un déficit prolongé menace le seuil de sécurité. Ce n'est pas un indicateur de performance — c'est un indicateur de survie collective."
            />
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-xl font-mono font-semibold ${flowBalance.deficit ? "text-destructive" : "text-safe"}`}>
              {flowBalance.deficit ? "−" : "+"}{Math.abs(flowBalance.inflow - flowBalance.outflow)}
            </span>
            <span className="text-xs text-muted-foreground">unités</span>
          </div>
          {flowBalance.deficit && (
            <p className="text-[10px] text-destructive mt-1 font-mono">DÉFICIT — Action requise</p>
          )}
        </div>
      </div>

      {/* Stock overview */}
      <div className="glass-card mb-6 overflow-hidden">
        <div className="px-4 py-3 border-b border-border/50 flex items-center gap-2">
          <Package className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold">Stock Commun</h3>
          <JusticeCognitive
            invariant="Dissociation"
            explanation="Le stock commun appartient au Lab, pas aux individus. Aucun membre ne peut revendiquer une part personnelle. Les ressources sont comptabilisées en autonomie (jours), pas en valeur marchande."
          />
          <span className="text-[10px] font-mono text-muted-foreground ml-auto">
            Seuil de sécurité : 30 jours
          </span>
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
                  <td className="px-4 py-2.5 font-mono text-muted-foreground">
                    {item.autonomy}
                    {item.autonomyDays < 30 && (
                      <span className="ml-1.5 text-[10px] text-warning font-mono">(&lt; seuil)</span>
                    )}
                  </td>
                  <td className="px-4 py-2.5">
                    <span className="inline-flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${statusDot[item.status]}`} />
                      <span className="text-xs text-muted-foreground">
                        {item.status === "safe" ? "OK" : item.status === "warning" ? "Bas" : "Critique"}
                      </span>
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
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold">Journal des Flux</h3>
            <JusticeCognitive
              invariant="Transparence"
              explanation="Le journal des flux enregistre chaque entrée et sortie de ressource. Il est accessible à tous les membres en temps réel. Aucun mouvement ne peut être caché. C'est le principe de transparence appliqué à la subsistance."
            />
          </div>
          <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mt-0.5">
            Entrées & Consommations de Flux · Sans dette
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
                flow.type === "entrée" ? "bg-safe/10" : "bg-destructive/10"
              }`}>
                {flow.type === "entrée"
                  ? <ArrowRight className="h-3.5 w-3.5 text-safe" />
                  : <ArrowLeft className="h-3.5 w-3.5 text-destructive" />
                }
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground font-medium">{flow.resource}</p>
                <p className="text-xs text-muted-foreground">{flow.source}</p>
              </div>
              <span className="text-sm font-mono text-muted-foreground">
                {flow.type === "sortie" ? "−" : "+"}{flow.quantityNum} {flow.quantityUnit}
              </span>
              <span className="text-xs text-muted-foreground">{flow.date}</span>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
