import { useState } from "react";
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";
import { JusticeCognitive } from "@/components/JusticeCognitive";
import { useTensions, Tension, TensionPhase } from "@/hooks/useTensions";
import {
  MessageCircle,
  Plus,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  CheckCircle,
  XCircle,
  Circle,
  AlertTriangle,
  Users,
  ShieldAlert,
} from "lucide-react";

const phaseConfig: Record<TensionPhase, { label: string; color: string; bgColor: string; icon: typeof Circle }> = {
  clarification: { label: "Clarification", color: "text-info", bgColor: "bg-info/10", icon: MessageCircle },
  reaction: { label: "Réaction", color: "text-accent", bgColor: "bg-accent/10", icon: Users },
  objection: { label: "Objection de Sécurité", color: "text-warning", bgColor: "bg-warning/10", icon: ShieldAlert },
  resolved: { label: "Résolue", color: "text-safe", bgColor: "bg-safe/10", icon: CheckCircle },
  abandoned: { label: "Objection retenue", color: "text-destructive", bgColor: "bg-destructive/10", icon: XCircle },
};

const SOCLE_INVARIANTS = [
  "Dissociation",
  "Rotation",
  "Subsidiarité",
  "Transparence",
  "Sortie Libre",
  "Minimum Vital",
];

export default function Mediation() {
  const { tensions, addTension, addComment, advancePhase, setObjection, openCount } = useTensions();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showObjectionForm, setShowObjectionForm] = useState<string | null>(null);

  // New tension form
  const [formTitle, setFormTitle] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formCurrent, setFormCurrent] = useState("");
  const [formDesired, setFormDesired] = useState("");

  // Comment form
  const [commentText, setCommentText] = useState("");

  // Objection form
  const [objInvariant, setObjInvariant] = useState(SOCLE_INVARIANTS[0]);
  const [objReason, setObjReason] = useState("");

  const handleSubmitTension = () => {
    if (!formTitle.trim() || !formCurrent.trim() || !formDesired.trim()) return;
    addTension({
      title: formTitle.trim(),
      description: formDesc.trim(),
      currentState: formCurrent.trim(),
      desiredState: formDesired.trim(),
      authorId: "m1",
      authorName: "Membre actif",
    });
    setFormTitle("");
    setFormDesc("");
    setFormCurrent("");
    setFormDesired("");
    setShowForm(false);
  };

  const handleComment = (tensionId: string, phase: TensionPhase) => {
    if (!commentText.trim()) return;
    addComment(tensionId, {
      memberId: "m1",
      memberName: "Membre actif",
      phase,
      content: commentText.trim(),
    });
    setCommentText("");
  };

  const handleObjection = (tensionId: string) => {
    if (!objReason.trim()) return;
    setObjection(tensionId, objInvariant, objReason.trim());
    setShowObjectionForm(null);
    setObjReason("");
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
  };

  return (
    <Layout>
      <PageHeader
        title="Médiation"
        subtitle="Protocole de tension — signaler un écart entre ce qui est et ce qui pourrait être."
        pedagogy="La médiation ne sert pas à punir les individus mais à protéger la structure. Une « tension » n'est pas une plainte : c'est l'identification d'un écart structurel. Le parcours en 3 étapes (Clarification → Réaction → Objection de Sécurité) garantit qu'on n'adopte pas la « meilleure » idée, mais celle qui ne met pas en danger les invariants SOCLE du Lab."
      />

      {/* Open tensions counter */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`px-3 py-1.5 rounded-md text-sm font-mono flex items-center gap-2 ${
            openCount > 3 ? "bg-destructive/10 text-destructive" : openCount > 0 ? "bg-warning/10 text-warning" : "bg-safe/10 text-safe"
          }`}>
            <AlertTriangle className="h-3.5 w-3.5" />
            {openCount} tension(s) ouverte(s)
          </div>
          <JusticeCognitive
            invariant="Non-Capture Émotionnelle"
            explanation="Les tensions non résolues sont une forme de capture émotionnelle. Si trop de tensions s'accumulent, l'Indice de Capture augmente car le collectif perd sa capacité à s'autoréguler. Ce compteur alimente directement la Boussole de Capture du Dashboard."
          />
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Déposer une tension
        </button>
      </div>

      {/* New tension form */}
      {showForm && (
        <div className="glass-card p-5 mb-6 animate-fade-in">
          <h3 className="text-sm font-semibold text-foreground mb-1">Nouvelle Tension</h3>
          <p className="text-xs text-muted-foreground mb-4">
            Ce n'est pas une plainte contre une personne. C'est un signalement d'écart structurel.
          </p>
          <div className="space-y-3">
            <div>
              <label className="data-label mb-1 block">Titre de la tension</label>
              <input
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-background border border-input text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                placeholder="Ex: Accès limité au local de stockage"
                maxLength={120}
              />
            </div>
            <div>
              <label className="data-label mb-1 block">Description (optionnel)</label>
              <textarea
                value={formDesc}
                onChange={(e) => setFormDesc(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-background border border-input text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none"
                rows={2}
                placeholder="Contexte supplémentaire..."
                maxLength={500}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="data-label mb-1 block">Ce qui est (état actuel)</label>
                <textarea
                  value={formCurrent}
                  onChange={(e) => setFormCurrent(e.target.value)}
                  className="w-full px-3 py-2 rounded-md bg-background border border-input text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none"
                  rows={2}
                  placeholder="Décrivez la situation actuelle..."
                  maxLength={300}
                />
              </div>
              <div>
                <label className="data-label mb-1 block">Ce qui pourrait être (état désiré)</label>
                <textarea
                  value={formDesired}
                  onChange={(e) => setFormDesired(e.target.value)}
                  className="w-full px-3 py-2 rounded-md bg-background border border-input text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none"
                  rows={2}
                  placeholder="Décrivez la proposition..."
                  maxLength={300}
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setShowForm(false)} className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                Annuler
              </button>
              <button
                onClick={handleSubmitTension}
                disabled={!formTitle.trim() || !formCurrent.trim() || !formDesired.trim()}
                className="px-4 py-1.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Déposer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Resolution flow legend */}
      <div className="glass-card p-3 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="data-label">Parcours de résolution</span>
          <JusticeCognitive
            invariant="Transparence"
            explanation="Le parcours de résolution est transparent et identique pour tous. Personne ne peut court-circuiter les étapes. L'Objection de Sécurité garantit qu'aucune décision ne viole les invariants SOCLE, même si elle est populaire."
          />
        </div>
        <div className="flex items-center gap-1 flex-wrap">
          {(["clarification", "reaction", "objection", "resolved"] as TensionPhase[]).map((phase, i) => {
            const config = phaseConfig[phase];
            const Icon = config.icon;
            return (
              <div key={phase} className="flex items-center gap-1">
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded flex items-center gap-1 ${config.bgColor} ${config.color}`}>
                  <Icon className="h-3 w-3" />
                  {config.label}
                </span>
                {i < 3 && <ArrowRight className="h-3 w-3 text-muted-foreground/40" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Tensions list */}
      <div className="space-y-3">
        {tensions.map((tension, ti) => {
          const isExpanded = expanded === tension.id;
          const config = phaseConfig[tension.phase];
          const Icon = config.icon;
          const isOpen = tension.phase !== "resolved" && tension.phase !== "abandoned";

          return (
            <div
              key={tension.id}
              className="glass-card overflow-hidden animate-fade-in"
              style={{ animationDelay: `${ti * 60}ms` }}
            >
              {/* Header */}
              <button
                onClick={() => setExpanded(isExpanded ? null : tension.id)}
                className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-muted/20 transition-colors"
              >
                <Icon className={`h-4 w-4 flex-shrink-0 ${config.color}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-medium text-foreground">{tension.title}</h3>
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${config.bgColor} ${config.color}`}>
                      {config.label}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    par {tension.authorName} · {formatDate(tension.createdAt)} · {tension.comments.length} contribution(s)
                  </p>
                </div>
                {isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
              </button>

              {/* Expanded content */}
              {isExpanded && (
                <div className="px-4 pb-4 border-t border-border/30 pt-3">
                  {/* Écart */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    <div className="p-3 rounded-md bg-destructive/5 border border-destructive/10">
                      <span className="data-label text-destructive">Ce qui est</span>
                      <p className="text-sm text-foreground mt-1">{tension.currentState}</p>
                    </div>
                    <div className="p-3 rounded-md bg-safe/5 border border-safe/10">
                      <span className="data-label text-safe">Ce qui pourrait être</span>
                      <p className="text-sm text-foreground mt-1">{tension.desiredState}</p>
                    </div>
                  </div>

                  {tension.description && (
                    <p className="text-sm text-muted-foreground mb-4">{tension.description}</p>
                  )}

                  {/* Phase progress */}
                  <div className="flex items-center gap-0.5 mb-4">
                    {(["clarification", "reaction", "objection"] as TensionPhase[]).map((p, i) => {
                      const pConfig = phaseConfig[p];
                      const order = ["clarification", "reaction", "objection"];
                      const currentIdx = order.indexOf(tension.phase);
                      const thisIdx = order.indexOf(p);
                      const isDone = tension.phase === "resolved" || thisIdx < currentIdx;
                      const isCurrent = thisIdx === currentIdx && isOpen;
                      return (
                        <div key={p} className="flex items-center gap-0.5 flex-1">
                          <div className={`h-1.5 flex-1 rounded-full transition-all ${
                            isDone ? "bg-safe" : isCurrent ? pConfig.color.replace("text-", "bg-") : "bg-muted"
                          }`} />
                          {i < 2 && <div className="w-0.5" />}
                        </div>
                      );
                    })}
                  </div>

                  {/* Comments timeline */}
                  {tension.comments.length > 0 && (
                    <div className="space-y-2 mb-4">
                      {tension.comments.map((c) => {
                        const cConfig = phaseConfig[c.phase];
                        return (
                          <div key={c.id} className="flex items-start gap-2">
                            <span className="w-6 h-6 rounded-full bg-primary/15 text-primary text-[10px] font-mono flex items-center justify-center flex-shrink-0 mt-0.5">
                              {c.memberName.charAt(0)}
                            </span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-xs font-medium text-foreground">{c.memberName}</span>
                                <span className={`text-[9px] font-mono px-1 py-0.5 rounded ${cConfig.bgColor} ${cConfig.color}`}>
                                  {cConfig.label}
                                </span>
                                <span className="text-[10px] text-muted-foreground">{formatDate(c.timestamp)}</span>
                              </div>
                              <p className="text-sm text-muted-foreground mt-0.5">{c.content}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Objection result */}
                  {tension.phase === "abandoned" && tension.objectionInvariant && (
                    <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 mb-4">
                      <div className="flex items-center gap-2 mb-1">
                        <ShieldAlert className="h-4 w-4 text-destructive" />
                        <span className="text-xs font-semibold text-destructive">
                          Objection de sécurité retenue — Invariant : {tension.objectionInvariant}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">{tension.objectionReason}</p>
                    </div>
                  )}

                  {/* Actions for open tensions */}
                  {isOpen && (
                    <div className="space-y-3">
                      {/* Add comment */}
                      <div className="flex gap-2">
                        <input
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          className="flex-1 px-3 py-1.5 rounded-md bg-background border border-input text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                          placeholder={
                            tension.phase === "clarification" ? "Poser une question d'information..."
                            : tension.phase === "reaction" ? "Donner votre avis (sans débat)..."
                            : "Commentaire..."
                          }
                          maxLength={500}
                          onKeyDown={(e) => { if (e.key === "Enter") handleComment(tension.id, tension.phase); }}
                        />
                        <button
                          onClick={() => handleComment(tension.id, tension.phase)}
                          disabled={!commentText.trim()}
                          className="px-3 py-1.5 rounded-md bg-primary/10 text-primary text-sm hover:bg-primary/20 transition-colors disabled:opacity-40"
                        >
                          Ajouter
                        </button>
                      </div>

                      {/* Phase actions */}
                      <div className="flex items-center gap-2 flex-wrap">
                        {tension.phase !== "objection" && (
                          <button
                            onClick={() => advancePhase(tension.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors"
                          >
                            <ArrowRight className="h-3.5 w-3.5" />
                            Passer à : {tension.phase === "clarification" ? "Réaction" : "Objection de Sécurité"}
                          </button>
                        )}

                        {tension.phase === "objection" && (
                          <>
                            <button
                              onClick={() => advancePhase(tension.id)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-safe text-safe-foreground text-xs font-medium hover:bg-safe/90 transition-colors"
                            >
                              <CheckCircle className="h-3.5 w-3.5" />
                              Aucune objection — Adopter
                            </button>
                            <button
                              onClick={() => setShowObjectionForm(showObjectionForm === tension.id ? null : tension.id)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-destructive/10 text-destructive text-xs font-medium hover:bg-destructive/20 transition-colors"
                            >
                              <ShieldAlert className="h-3.5 w-3.5" />
                              Objection de sécurité
                            </button>
                          </>
                        )}
                      </div>

                      {/* Objection form */}
                      {showObjectionForm === tension.id && (
                        <div className="p-3 rounded-md bg-destructive/5 border border-destructive/15 space-y-2 animate-fade-in">
                          <p className="text-xs font-semibold text-destructive">
                            Objection de Sécurité SOCLE
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            Une objection ne porte pas sur la qualité de l'idée, mais sur le danger qu'elle représente pour un invariant structurel.
                          </p>
                          <div>
                            <label className="data-label mb-1 block">Invariant menacé</label>
                            <select
                              value={objInvariant}
                              onChange={(e) => setObjInvariant(e.target.value)}
                              className="w-full px-3 py-1.5 rounded-md bg-background border border-input text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                            >
                              {SOCLE_INVARIANTS.map(inv => (
                                <option key={inv} value={inv}>{inv}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="data-label mb-1 block">Explication du danger</label>
                            <textarea
                              value={objReason}
                              onChange={(e) => setObjReason(e.target.value)}
                              className="w-full px-3 py-2 rounded-md bg-background border border-input text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none"
                              rows={2}
                              placeholder="En quoi cette proposition met-elle en danger cet invariant ?"
                              maxLength={500}
                            />
                          </div>
                          <div className="flex gap-2 justify-end">
                            <button onClick={() => setShowObjectionForm(null)} className="text-xs text-muted-foreground hover:text-foreground">
                              Annuler
                            </button>
                            <button
                              onClick={() => handleObjection(tension.id)}
                              disabled={!objReason.trim()}
                              className="px-3 py-1 rounded-md bg-destructive text-destructive-foreground text-xs font-medium hover:bg-destructive/90 disabled:opacity-40"
                            >
                              Confirmer l'objection
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Layout>
  );
}
