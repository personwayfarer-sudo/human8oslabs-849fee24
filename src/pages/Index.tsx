import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";
import { MetricCard } from "@/components/MetricCard";
import { TransparencyWall } from "@/components/TransparencyWall";
import { EthicalCompass } from "@/components/EthicalCompass";
import { Apple, Zap, Banknote, Home } from "lucide-react";

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
          detail="Au-dessus du seuil de 14j"
        />
        <MetricCard
          label="Autonomie Énergétique"
          value={67}
          unit="%"
          status="safe"
          icon={<Zap className="h-4 w-4" />}
          detail="Solaire + batterie"
        />
        <MetricCard
          label="Fonds de Secours"
          value="2.4k"
          unit="€"
          status="warning"
          icon={<Banknote className="h-4 w-4" />}
          detail="En dessous du seuil 3k€"
        />
        <MetricCard
          label="Eau Potable"
          value={5}
          unit="jours"
          status="danger"
          icon={<Home className="h-4 w-4" />}
          detail="Réapprovisionnement urgent"
        />
      </div>

      {/* Two columns: Compass + Wall */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1">
          <EthicalCompass captureIndex={18} alerts={mockAlerts} />
        </div>
        <div className="lg:col-span-2">
          <TransparencyWall entries={mockEntries} />
        </div>
      </div>
    </Layout>
  );
};

export default Index;
