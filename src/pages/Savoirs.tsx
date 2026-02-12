import { useState } from "react";
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";
import { JusticeCognitive } from "@/components/JusticeCognitive";
import { useResidence } from "@/hooks/useResidence";
import { BookOpen, ExternalLink, Stamp, UserCheck, FileText, Clock, ShieldAlert, Copy, Plus } from "lucide-react";

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
  const [tab, setTab] = useState<"savoirs" | "residents">("savoirs");
  const { residents, activeResidents, generatedToken, generateToken, acceptResident, submitReport } = useResidence();

  const [tokenForm, setTokenForm] = useState({ pseudonym: "", labOrigin: "", roles: "", validations: "" });
  const [acceptForm, setAcceptForm] = useState({ duration: 2 as 1 | 2 | 3 });
  const [reportText, setReportText] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerateToken = () => {
    if (!tokenForm.pseudonym || !tokenForm.labOrigin) return;
    generateToken(
      tokenForm.pseudonym,
      tokenForm.labOrigin,
      tokenForm.roles.split(",").map((s) => s.trim()).filter(Boolean),
      tokenForm.validations.split(",").map((s) => s.trim()).filter(Boolean)
    );
    setTokenForm({ pseudonym: "", labOrigin: "", roles: "", validations: "" });
  };

  const handleCopyToken = () => {
    if (generatedToken) {
      navigator.clipboard.writeText(JSON.stringify(generatedToken, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Layout>
      <PageHeader
        title="Savoirs & Résidence"
        subtitle="Justice cognitive et programme d'essaimage inter-Labs."
        pedagogy="Cette section documente tous les mécanismes du Lab et gère le programme de résidence. Un résident est un membre d'un autre Lab qui vient observer et apprendre, sans pouvoir de décision structurel."
      />

      {/* Tabs */}
      <div className="flex gap-1 mb-6 p-1 rounded-md bg-muted/50 w-fit">
        <button
          onClick={() => setTab("savoirs")}
          className={`px-4 py-2 rounded text-sm font-medium transition-colors ${tab === "savoirs" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
        >
          <BookOpen className="h-3.5 w-3.5 inline mr-1.5" />
          Savoirs
        </button>
        <button
          onClick={() => setTab("residents")}
          className={`px-4 py-2 rounded text-sm font-medium transition-colors ${tab === "residents" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
        >
          <Stamp className="h-3.5 w-3.5 inline mr-1.5" />
          Résidents
          {activeResidents.length > 0 && (
            <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-primary/15 text-primary text-[10px] font-mono">
              {activeResidents.length}
            </span>
          )}
        </button>
      </div>

      {tab === "savoirs" && (
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
      )}

      {tab === "residents" && (
        <div className="space-y-6">
          {/* Token Generation */}
          <div className="glass-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Stamp className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">Passeport de Résidence</h3>
              <JusticeCognitive
                invariant="Essaimage"
                explanation="Le jeton de résidence permet à un membre de se présenter à un autre Lab sans révéler son identité civile. Il porte uniquement l'historique des rôles occupés et les compétences validées. L'objectif est la pollinisation croisée entre Labs, pas la surveillance."
              />
            </div>

            <p className="text-xs text-muted-foreground mb-4">
              Générez un jeton contenant votre historique de rôles et vos validations de Justice Cognitive, sous pseudonyme.
            </p>

            {generatedToken ? (
              <div className="space-y-3">
                {/* Visa-style token card */}
                <div className="relative p-5 rounded border-2 border-dashed border-primary/30 bg-primary/5">
                  <div className="absolute top-2 right-2 opacity-20">
                    <Stamp className="h-12 w-12 text-primary" />
                  </div>
                  <p className="data-label mb-1">Jeton de Résidence</p>
                  <p className="font-mono text-lg text-foreground tracking-widest mb-3">{generatedToken.code}</p>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <p className="text-muted-foreground">Pseudonyme</p>
                      <p className="text-foreground font-medium">{generatedToken.pseudonym}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Lab d'origine</p>
                      <p className="text-foreground font-medium">{generatedToken.labOrigin}</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <p className="text-muted-foreground text-[10px] uppercase tracking-widest mb-1">Historique des rôles</p>
                    <div className="flex flex-wrap gap-1.5">
                      {generatedToken.roleHistory.map((r, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-muted text-[10px] font-mono text-foreground">{r}</span>
                      ))}
                    </div>
                  </div>
                  <div className="mt-3">
                    <p className="text-muted-foreground text-[10px] uppercase tracking-widest mb-1">Validations cognitives</p>
                    <div className="flex flex-wrap gap-1.5">
                      {generatedToken.cognitiveValidations.map((v, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-safe/10 text-[10px] font-mono text-safe">{v}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={handleCopyToken} className="flex items-center gap-1.5 px-3 py-2 rounded bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors">
                    <Copy className="h-3.5 w-3.5" />
                    {copied ? "Copié !" : "Copier le jeton (JSON)"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Pseudonyme de rôle</label>
                  <input
                    type="text"
                    value={tokenForm.pseudonym}
                    onChange={(e) => setTokenForm((f) => ({ ...f, pseudonym: e.target.value }))}
                    placeholder="Ex: Gardien_C"
                    className="w-full px-3 py-2 rounded bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Lab d'origine</label>
                  <input
                    type="text"
                    value={tokenForm.labOrigin}
                    onChange={(e) => setTokenForm((f) => ({ ...f, labOrigin: e.target.value }))}
                    placeholder="Ex: Lab-Alpha"
                    className="w-full px-3 py-2 rounded bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-muted-foreground mb-1 block">Historique des rôles (séparés par virgule)</label>
                  <input
                    type="text"
                    value={tokenForm.roles}
                    onChange={(e) => setTokenForm((f) => ({ ...f, roles: e.target.value }))}
                    placeholder="Intendant (3 cycles), Nourricier (2 cycles)"
                    className="w-full px-3 py-2 rounded bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-muted-foreground mb-1 block">Validations cognitives (séparées par virgule)</label>
                  <input
                    type="text"
                    value={tokenForm.validations}
                    onChange={(e) => setTokenForm((f) => ({ ...f, validations: e.target.value }))}
                    placeholder="Gestion des stocks, Protocole de médiation"
                    className="w-full px-3 py-2 rounded bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                <div className="col-span-2">
                  <button
                    onClick={handleGenerateToken}
                    disabled={!tokenForm.pseudonym || !tokenForm.labOrigin}
                    className="flex items-center gap-2 px-4 py-2.5 rounded bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-40"
                  >
                    <Plus className="h-4 w-4" />
                    Générer le Jeton de Résidence
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Residents List */}
          <div className="glass-card overflow-hidden">
            <div className="px-4 py-3 border-b border-border/50 flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">Résidents Accueillis</h3>
              <JusticeCognitive
                invariant="Non-Capture Externe"
                explanation="Un résident a un accès lecture seule sur les flux et archives. Il peut occuper des rôles de Soutien mais jamais être Médiateur ou Auditeur. Cette restriction empêche qu'un regard extérieur temporaire ne prenne un pouvoir structurel sur le Lab."
              />
            </div>

            {residents.length === 0 ? (
              <div className="p-8 text-center">
                <Stamp className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Aucun résident pour le moment.</p>
              </div>
            ) : (
              <div className="divide-y divide-border/30">
                {residents.map((resident) => {
                  const daysRemaining = resident.endDate
                    ? Math.max(0, Math.ceil((new Date(resident.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
                    : 0;

                  return (
                    <div key={resident.id} className="p-4">
                      {/* Visa-style header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded border-2 border-dashed border-primary/30 flex items-center justify-center bg-primary/5">
                            <Stamp className="h-5 w-5 text-primary/60" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground">{resident.token.pseudonym}</p>
                            <p className="text-[10px] font-mono text-muted-foreground">
                              {resident.token.labOrigin} · {resident.token.code}
                            </p>
                          </div>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                          resident.status === "active" ? "bg-safe/10 text-safe" :
                          resident.status === "completed" ? "bg-muted text-muted-foreground" :
                          "bg-warning/10 text-warning"
                        }`}>
                          {resident.status === "active" ? "en résidence" : resident.status === "completed" ? "terminé" : "en attente"}
                        </span>
                      </div>

                      {/* Details grid */}
                      <div className="grid grid-cols-3 gap-3 text-xs mb-3">
                        <div>
                          <p className="text-muted-foreground">Durée</p>
                          <p className="text-foreground">{resident.durationMonths} mois</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Accès</p>
                          <p className="text-foreground">{resident.accessLevel}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Jours restants</p>
                          <p className={`font-mono ${daysRemaining < 14 ? "text-warning" : "text-foreground"}`}>
                            {resident.status === "active" ? `${daysRemaining}j` : "—"}
                          </p>
                        </div>
                      </div>

                      {/* Allowed/Forbidden roles */}
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {resident.allowedRoles.map((r) => (
                          <span key={r} className="px-1.5 py-0.5 rounded bg-safe/10 text-[10px] font-mono text-safe">✓ {r}</span>
                        ))}
                        {resident.forbiddenRoles.map((r) => (
                          <span key={r} className="px-1.5 py-0.5 rounded bg-destructive/10 text-[10px] font-mono text-destructive">✗ {r}</span>
                        ))}
                      </div>

                      {/* Report section */}
                      {resident.status === "active" && (
                        <div className="mt-3 p-3 rounded bg-muted/50 border border-border/50">
                          <div className="flex items-center gap-2 mb-2">
                            <FileText className="h-3.5 w-3.5 text-primary" />
                            <p className="data-label">Rapport d'Essaimage</p>
                          </div>
                          <textarea
                            value={reportText}
                            onChange={(e) => setReportText(e.target.value)}
                            rows={3}
                            placeholder="Décrivez les différences d'usage constatées entre votre Lab d'origine et ce Lab d'accueil..."
                            className="w-full px-3 py-2 rounded bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground resize-none mb-2"
                          />
                          <button
                            onClick={() => { submitReport(resident.id, reportText); setReportText(""); }}
                            disabled={!reportText.trim()}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors disabled:opacity-40"
                          >
                            <FileText className="h-3 w-3" />
                            Soumettre le rapport
                          </button>
                        </div>
                      )}

                      {resident.status === "completed" && resident.report && (
                        <div className="mt-3 p-3 rounded bg-muted/50 border border-border/50">
                          <div className="flex items-center gap-2 mb-2">
                            <FileText className="h-3.5 w-3.5 text-primary" />
                            <p className="data-label">Rapport d'Essaimage (publié)</p>
                          </div>
                          <p className="text-sm text-foreground leading-relaxed">{resident.report}</p>
                          <p className="text-[10px] text-muted-foreground mt-2 font-mono">
                            Soumis le {new Date(resident.reportSubmittedAt!).toLocaleDateString("fr-FR")}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
}
