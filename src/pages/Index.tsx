import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";
import { MetricCard } from "@/components/MetricCard";
import { TransparencyWall } from "@/components/TransparencyWall";
import { EthicalCompass } from "@/components/EthicalCompass";
import { Apple, Zap, Banknote, Droplets, HeartHandshake, ClipboardCheck, Stamp } from "lucide-react";
import { JusticeCognitive } from "@/components/JusticeCognitive";

const mockEntries = [
  { id: "1", timestamp: "12 fév 15:42", type: "décision" as const, description: "Réunion plénière : vote pour mutualiser le stock alimentaire excédentaire avec le Lab voisin.", author: "Assemblée (consensus)" },
  { id: "2", timestamp: "12 fév 10:15", type: "ressource" as const, description: "Réception de 45kg de légumes (circuit court — ferme Bel-Air).", author: "Aïcha M." },
  { id: "3", timestamp: "11 fév 18:00", type: "rotation" as const, description: "Rotation des rôles effectuée : gestion numérique transférée de Karim à Leïla.", author: "Système" },
  { id: "4", timestamp: "11 fév 09:30", type: "alerte" as const, description: "Stock d'eau potable en dessous du seuil de 7 jours. Réapprovisionnement planifié.", author: "Module Subsistance" },
  { id: "5", timestamp: "10 fév 14:00", type: "décision" as const, description: "Adoption du protocole d'accueil des nouveaux membres (période d'intégration : 2 semaines).", author: "Assemblée (majorité 8/10)" },
];

const mockAlerts = [
  { id: "1", indicator: "Accès Numérique", message: "Karim gère seul les accès depuis 12 jours — rotation recommandée.", severity: "warning" as const },
];

// Simulated data
const stockDays = [23, 5, 8, 15, 30]; // food, water, vegetables, wood, pharmacy
const rolesPerMember: Record<string, number> = {
  "Aïcha": 1, "Karim": 1, "Leïla": 1, "Omar": 1, "Nadia": 1, "Youssef": 1,
};
const openTensions = 2;
const cloudDeps = [
  { service: "HUMAN∞OS", critical: true, selfHostable: true },
  { service: "Serveur solaire", critical: true, selfHostable: true },
  { service: "Email (Gmail)", critical: false, selfHostable: false },
  { service: "Cartographie", critical: false, selfHostable: false },
];

const Index = () => {
  return (
    <Layout>
      <PageHeader
        title="Tableau de Résilience"
        subtitle="Vue synthétique de l'autonomie et de la santé structurelle du Lab."
        pedagogy="Ce tableau montre les indicateurs vitaux du Lab. L'Indice de Capture mesure à quel point le système dépend d'une personne ou d'une ressource unique. Plus il est bas, plus le Lab est résilient."
      />

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard
          label="Stock Alimentaire"
          value={23}
          unit="jours"
          status="safe"
          icon={<Apple className="h-4 w-4" />}
          detail="Au-dessus du seuil de 30j"
          invariant="Dissociation"
          invariantExplanation="Le stock alimentaire est géré collectivement. Son niveau ne dépend pas de la contribution individuelle d'un membre. Si un membre quitte le Lab, le stock reste. Cet indicateur protège l'accès à la nourriture comme droit structurel."
        />
        <MetricCard
          label="Autonomie Énergétique"
          value={67}
          unit="%"
          status="safe"
          icon={<Zap className="h-4 w-4" />}
          detail="Solaire + batterie"
          invariant="Subsidiarité"
          invariantExplanation="L'énergie est produite localement (solaire, batterie). Plus ce pourcentage est élevé, moins le Lab dépend de fournisseurs extérieurs. L'objectif est l'autonomie, pas l'autarcie."
        />
        <MetricCard
          label="Fonds de Secours"
          value="2.4k"
          unit="€"
          status="warning"
          icon={<Banknote className="h-4 w-4" />}
          detail="En dessous du seuil 3k€"
          invariant="Sortie Libre"
          invariantExplanation="Le fonds de secours garantit qu'un membre en difficulté peut recevoir une aide d'urgence. Il n'est lié à aucune condition de performance. Son existence protège le droit de sortie : personne ne reste par nécessité financière."
        />
        <MetricCard
          label="Eau Potable"
          value={5}
          unit="jours"
          status="danger"
          icon={<Droplets className="h-4 w-4" />}
          detail="Réapprovisionnement urgent"
          invariant="Minimum Vital"
          invariantExplanation="L'eau potable est la ressource la plus critique. Descendre sous 7 jours d'autonomie déclenche une alerte. Ce seuil existe pour garantir que le Lab ne met jamais ses membres en danger vital par négligence structurelle."
        />
      </div>

      {/* Tension indicator */}
      <div className="glass-card p-4 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded flex items-center justify-center ${openTensions > 3 ? "bg-destructive/10" : openTensions > 0 ? "bg-warning/10" : "bg-safe/10"}`}>
            <HeartHandshake className={`h-4 w-4 ${openTensions > 3 ? "text-destructive" : openTensions > 0 ? "text-warning" : "text-safe"}`} />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              {openTensions} tension(s) ouverte(s)
            </p>
            <p className="text-[10px] text-muted-foreground">
              {openTensions > 3 ? "Seuil dépassé — capture émotionnelle détectée" : openTensions > 0 ? "En cours de médiation" : "Aucun conflit structurel"}
            </p>
          </div>
          <JusticeCognitive
            invariant="Non-Capture Émotionnelle"
            explanation="Les tensions non résolues sont une forme de capture : elles immobilisent le collectif et concentrent le pouvoir chez ceux qui 'tolèrent' le conflit. Cet indicateur alimente directement la Boussole de Capture."
          />
        </div>
        <a href="/mediation" className="text-xs text-primary font-medium hover:underline">
          Voir les tensions →
        </a>
      </div>

      {/* Audit countdown indicator */}
      <div className="glass-card p-4 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded flex items-center justify-center bg-warning/10">
            <ClipboardCheck className="h-4 w-4 text-warning" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              Prochain audit croisé dans ~4 mois
            </p>
            <p className="text-[10px] text-muted-foreground">
              Dernier audit validé il y a 14 mois · Protocole des 18 mois
            </p>
          </div>
          <JusticeCognitive
            invariant="Regard Extérieur"
            explanation="Sans audit externe régulier, un Lab développe une cécité organisationnelle. Le protocole des 18 mois garantit qu'un regard neuf vérifie les invariants. Si le délai est dépassé, l'Indice de Capture augmente de +20 pts."
          />
        </div>
        <a href="/audit" className="text-xs text-primary font-medium hover:underline">
          Voir les audits →
        </a>
      </div>

      {/* Resident indicator */}
      <div className="glass-card p-4 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded flex items-center justify-center bg-safe/10">
            <Stamp className="h-4 w-4 text-safe" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              1 résident actif — Gardien_C (Lab-Gamma)
            </p>
            <p className="text-[10px] text-muted-foreground">
              Regard extérieur continu · −5 pts Indice de Capture
            </p>
          </div>
          <JusticeCognitive
            invariant="Essaimage"
            explanation="La présence d'un résident d'un autre Lab réduit le score de capture car un regard extérieur constant empêche la cristallisation des habitudes et des rapports de pouvoir implicites."
          />
        </div>
        <a href="/savoirs" className="text-xs text-primary font-medium hover:underline">
          Voir les résidents →
        </a>
      </div>

      {/* Two columns: Compass + Wall */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1">
          <EthicalCompass
            alerts={mockAlerts}
            rolesPerMember={rolesPerMember}
            stockDays={stockDays}
            securityThreshold={30}
            onTimeRotations={4}
            totalRotations={5}
            openTensions={openTensions}
            tensionThreshold={3}
            cloudDependencies={cloudDeps}
            hasActiveResident={true}
          />
        </div>
        <div className="lg:col-span-2">
          <TransparencyWall entries={mockEntries} />
        </div>
      </div>
    </Layout>
  );
};

export default Index;
