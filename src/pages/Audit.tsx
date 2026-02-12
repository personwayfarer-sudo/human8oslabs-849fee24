import { useState } from "react";
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";
import { JusticeCognitive } from "@/components/JusticeCognitive";
import { useAudit } from "@/hooks/useAudit";
import { ClipboardCheck, Clock, Copy, Eye, Plus, Send, ShieldCheck } from "lucide-react";

const Audit = () => {
  const {
    audits,
    lastAuditDate,
    daysUntilDeadline,
    monthsRemaining,
    isOverdue,
    generateAuditCode,
    startAudit,
    updateCheck,
    submitObservations,
  } = useAudit();

  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [selectedAuditId, setSelectedAuditId] = useState<string | null>(null);
  const [auditorForm, setAuditorForm] = useState({ labSource: "", alias: "" });
  const [observationsText, setObservationsText] = useState("");
  const [copied, setCopied] = useState(false);

  const selectedAudit = audits.find((a) => a.id === selectedAuditId);

  const handleGenerate = () => {
    const code = generateAuditCode();
    setGeneratedCode(code);
  };

  const handleCopy = () => {
    if (generatedCode) {
      navigator.clipboard.writeText(generatedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleStartAudit = () => {
    if (!selectedAudit || !auditorForm.labSource || !auditorForm.alias) return;
    startAudit(selectedAudit.id, auditorForm.labSource, auditorForm.alias);
  };

  const handleSubmitObservations = () => {
    if (!selectedAudit || !observationsText.trim()) return;
    const allChecked = selectedAudit.checks.every((c) => c.checked !== null);
    if (!allChecked) return;
    submitObservations(selectedAudit.id, observationsText);
    setObservationsText("");
    setSelectedAuditId(null);
  };

  const pendingAudit = audits.find((a) => a.status === "pending");
  const activeAudit = audits.find((a) => a.status === "in_progress");

  return (
    <Layout>
      <PageHeader
        title="Audit Croisé Inter-Labs"
        subtitle="Protocole de vérification mutuelle entre Labs — protection contre la cécité organisationnelle."
        pedagogy="L'audit croisé n'est pas un jugement externe. C'est un acte de solidarité structurelle : un autre Lab vérifie que vos invariants SOCLE sont toujours respectés. Si aucun audit n'est réalisé en 18 mois, l'Indice de Capture augmente automatiquement."
      />

      {/* Countdown + Code Generation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* 18-Month Countdown */}
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-3">
            <Clock className={`h-4 w-4 ${isOverdue ? "text-destructive" : daysUntilDeadline < 90 ? "text-warning" : "text-safe"}`} />
            <h3 className="text-sm font-semibold text-foreground">Protocole des 18 Mois</h3>
            <JusticeCognitive
              invariant="Regard Extérieur"
              explanation="Sans audit externe régulier, un Lab peut développer une 'cécité organisationnelle' : les membres ne voient plus les dérives car ils y sont habitués. Le protocole des 18 mois garantit qu'un regard neuf vérifie les invariants SOCLE."
            />
          </div>

          <div className="flex items-end gap-4">
            <div className="flex-1">
              <p className="data-label mb-1">Dernier audit validé</p>
              <p className="text-sm text-foreground">
                {lastAuditDate ? lastAuditDate.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }) : "Aucun"}
              </p>
            </div>
            <div className="text-right">
              {isOverdue ? (
                <div className="px-3 py-1.5 rounded bg-destructive/10 text-destructive text-sm font-semibold">
                  ⚠ EN RETARD — +20 pts Capture
                </div>
              ) : (
                <div className={`px-3 py-1.5 rounded text-sm font-mono font-semibold ${daysUntilDeadline < 90 ? "bg-warning/10 text-warning" : "bg-safe/10 text-safe"}`}>
                  {monthsRemaining} mois restants ({daysUntilDeadline}j)
                </div>
              )}
            </div>
          </div>

          {/* Visual bar */}
          <div className="mt-3 h-2 rounded-full bg-muted overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${isOverdue ? "bg-destructive" : daysUntilDeadline < 90 ? "bg-warning" : "bg-safe"}`}
              style={{ width: `${Math.max(2, Math.min(100, ((18 * 30 - daysUntilDeadline) / (18 * 30)) * 100))}%` }}
            />
          </div>
        </div>

        {/* Code Generation */}
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Connexion Inter-Labs</h3>
          </div>

          <p className="text-xs text-muted-foreground mb-4">
            Générez un code d'audit temporaire à partager avec un Lab partenaire. Ce code permet à un auditeur externe de se connecter.
          </p>

          {generatedCode ? (
            <div className="flex items-center gap-2">
              <div className="flex-1 px-4 py-3 rounded bg-muted font-mono text-lg text-foreground tracking-widest text-center">
                {generatedCode}
              </div>
              <button onClick={handleCopy} className="p-2 rounded bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                <Copy className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleGenerate}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Générer un Code d'Audit
            </button>
          )}
          {copied && <p className="text-xs text-safe mt-2 text-center">Code copié !</p>}
        </div>
      </div>

      {/* Audit List + Active Audit */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Audit history */}
        <div className="glass-card overflow-hidden">
          <div className="px-4 py-3 border-b border-border/50">
            <h3 className="text-sm font-semibold text-foreground">Historique des Audits</h3>
            <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mt-0.5">
              Registre immuable
            </p>
          </div>
          <div className="divide-y divide-border/30 max-h-96 overflow-y-auto">
            {audits.map((audit) => (
              <button
                key={audit.id}
                onClick={() => setSelectedAuditId(audit.id)}
                className={`w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors ${selectedAuditId === audit.id ? "bg-muted/70" : ""}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-xs text-foreground">{audit.code}</span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                    audit.status === "validated" ? "bg-safe/10 text-safe" :
                    audit.status === "in_progress" ? "bg-warning/10 text-warning" :
                    "bg-muted text-muted-foreground"
                  }`}>
                    {audit.status === "validated" ? "validé" : audit.status === "in_progress" ? "en cours" : "en attente"}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {audit.labSource || "Lab non assigné"} · {audit.auditorAlias || "Auditeur non assigné"}
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {new Date(audit.createdAt).toLocaleDateString("fr-FR")}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Active detail panel */}
        <div className="lg:col-span-2">
          {selectedAudit ? (
            <div className="glass-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <ClipboardCheck className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">
                  Grille d'Évaluation SOCLE — {selectedAudit.code}
                </h3>
                <JusticeCognitive
                  invariant="Non-Jugement"
                  explanation="L'audit croisé évalue les invariants structurels, jamais les personnes. L'auditeur vérifie que l'architecture du Lab protège ses membres. Ce n'est pas un jugement de performance, mais une maintenance préventive du système."
                />
              </div>

              {/* Auditor assignment for pending */}
              {selectedAudit.status === "pending" && (
                <div className="mb-6 p-4 rounded bg-muted/50 border border-border/50">
                  <p className="data-label mb-3">Assignation de l'auditeur</p>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Lab d'origine</label>
                      <input
                        type="text"
                        value={auditorForm.labSource}
                        onChange={(e) => setAuditorForm((f) => ({ ...f, labSource: e.target.value }))}
                        placeholder="Ex: Lab-Beta"
                        className="w-full px-3 py-2 rounded bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Pseudonyme auditeur</label>
                      <input
                        type="text"
                        value={auditorForm.alias}
                        onChange={(e) => setAuditorForm((f) => ({ ...f, alias: e.target.value }))}
                        placeholder="Ex: Auditeur_Ext_1"
                        className="w-full px-3 py-2 rounded bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground"
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleStartAudit}
                    disabled={!auditorForm.labSource || !auditorForm.alias}
                    className="px-4 py-2 rounded bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-40"
                  >
                    Démarrer l'audit
                  </button>
                </div>
              )}

              {/* SOCLE Checklist */}
              <div className="space-y-3 mb-6">
                {selectedAudit.checks.map((check) => (
                  <div key={check.id} className="p-3 rounded border border-border/50 bg-background/50">
                    <div className="flex items-start gap-3">
                      <div className="flex gap-1.5 mt-0.5">
                        {selectedAudit.status === "validated" ? (
                          <span className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold ${
                            check.checked ? "bg-safe/15 text-safe" : "bg-destructive/15 text-destructive"
                          }`}>
                            {check.checked ? "✓" : "✗"}
                          </span>
                        ) : selectedAudit.status === "in_progress" ? (
                          <>
                            <button
                              onClick={() => updateCheck(selectedAudit.id, check.id, true, check.comment)}
                              className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold transition-colors ${
                                check.checked === true ? "bg-safe/20 text-safe" : "bg-muted text-muted-foreground hover:bg-safe/10"
                              }`}
                            >
                              ✓
                            </button>
                            <button
                              onClick={() => updateCheck(selectedAudit.id, check.id, false, check.comment)}
                              className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold transition-colors ${
                                check.checked === false ? "bg-destructive/20 text-destructive" : "bg-muted text-muted-foreground hover:bg-destructive/10"
                              }`}
                            >
                              ✗
                            </button>
                          </>
                        ) : (
                          <span className="w-5 h-5 rounded bg-muted flex items-center justify-center text-[10px] text-muted-foreground">—</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-foreground">{check.label}</p>
                        <p className="text-[10px] font-mono text-muted-foreground mt-0.5">
                          Invariant : {check.invariant}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Observations — immutable once submitted */}
              {selectedAudit.status === "validated" && selectedAudit.observations && (
                <div className="p-4 rounded bg-muted/50 border border-border/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Eye className="h-3.5 w-3.5 text-primary" />
                    <p className="data-label">Regard Extérieur — Observations (immuable)</p>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">{selectedAudit.observations}</p>
                  <p className="text-[10px] text-muted-foreground mt-2 font-mono">
                    Soumis par {selectedAudit.auditorAlias} ({selectedAudit.labSource}) · {new Date(selectedAudit.validatedAt!).toLocaleDateString("fr-FR")}
                  </p>
                </div>
              )}

              {selectedAudit.status === "in_progress" && (
                <div className="p-4 rounded bg-muted/50 border border-border/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Eye className="h-3.5 w-3.5 text-primary" />
                    <p className="data-label">Observations de l'Auditeur</p>
                  </div>
                  <textarea
                    value={observationsText}
                    onChange={(e) => setObservationsText(e.target.value)}
                    rows={4}
                    placeholder="Ce texte sera publié sur le Mur de Transparence et sera immuable une fois soumis..."
                    className="w-full px-3 py-2 rounded bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground resize-none mb-3"
                  />
                  <button
                    onClick={handleSubmitObservations}
                    disabled={!observationsText.trim() || selectedAudit.checks.some((c) => c.checked === null)}
                    className="flex items-center gap-2 px-4 py-2 rounded bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-40"
                  >
                    <Send className="h-3.5 w-3.5" />
                    Soumettre (immuable)
                  </button>
                  {selectedAudit.checks.some((c) => c.checked === null) && (
                    <p className="text-[10px] text-warning mt-2">Tous les points de la grille doivent être évalués avant soumission.</p>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="glass-card p-8 flex flex-col items-center justify-center text-center min-h-[300px]">
              <ClipboardCheck className="h-8 w-8 text-muted-foreground/40 mb-3" />
              <p className="text-sm text-muted-foreground">Sélectionnez un audit dans l'historique ou générez un nouveau code.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Audit;
