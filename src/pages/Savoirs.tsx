import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";
import { BookOpen, ExternalLink } from "lucide-react";

const guides = [
  {
    category: "Principes fondateurs",
    items: [
      { title: "Qu'est-ce que l'Indice de Capture ?", summary: "L'Indice de Capture mesure le degré de dépendance structurelle d'un individu envers le système. Un indice bas signifie qu'une personne peut quitter le Lab sans perte vitale." },
      { title: "Le principe de Non-Capture", summary: "Un système est juste lorsqu'il est possible d'en sortir sans perdre l'accès aux ressources vitales (alimentation, logement, santé)." },
      { title: "Dignité Structurelle", summary: "La dignité n'est pas un droit déclaré mais une propriété architecturale : elle est garantie par la conception du système, pas par la bonne volonté de ses membres." },
    ],
  },
  {
    category: "Guides opérationnels",
    items: [
      { title: "Comment fonctionne la rotation des rôles", summary: "Les rôles sont assignés par tirage au sort ou file cyclique tous les 14 jours. Tout membre peut refuser et être réinscrit en fin de file. Un guide accompagne chaque rôle." },
      { title: "Gestion mutualisée des stocks", summary: "Les ressources sont comptabilisées en flux (entrées/sorties) et non en crédit/débit individuel. Personne ne 'doit' rien au Lab." },
      { title: "Exporter les données du Lab", summary: "Toutes les données peuvent être exportées à tout moment en format ouvert (JSON/CSV). Le Lab ne dépend d'aucune plateforme propriétaire." },
    ],
  },
  {
    category: "Architecture HUMAN∞OS",
    items: [
      { title: "Les 6 axiomes biomimétiques", summary: "Dissociation, Rotation, Subsidiarité, Transparence, Sortie libre, Minimum vital. Ces principes sont dérivés des systèmes vivants résilients." },
      { title: "Le Théorème de Sortie", summary: "Pour chaque membre M, il existe un chemin de sortie S tel que coût(S) < seuil vital. Si cette condition est violée, le système est en état de capture." },
    ],
  },
];

export default function Savoirs() {
  return (
    <Layout>
      <PageHeader
        title="Savoirs"
        subtitle="Justice cognitive : chaque membre doit pouvoir comprendre le fonctionnement de chaque outil."
        pedagogy="Cette section documente tous les mécanismes du Lab. Aucune connaissance n'est réservée. Aucun jargon n'est toléré sans explication. Si vous ne comprenez pas quelque chose, c'est un bug du système, pas le vôtre."
      />

      <div className="space-y-6">
        {guides.map((section, si) => (
          <div key={section.category} className="animate-fade-in" style={{ animationDelay: `${si * 100}ms` }}>
            <h2 className="data-label mb-3">{section.category}</h2>
            <div className="space-y-3">
              {section.items.map((item) => (
                <div key={item.title} className="glass-card p-4 group hover:border-primary/30 transition-colors cursor-pointer">
                  <div className="flex items-start gap-3">
                    <BookOpen className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-medium text-foreground">{item.title}</h3>
                        <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{item.summary}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}
