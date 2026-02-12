import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";
import { useRotation } from "@/hooks/useRotation";
import { RefreshCw, User, Calendar, Shuffle, Clock, ShieldCheck, History, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

export default function Roles() {
  const { state, rotate, rotateAll, setMaxWeeks, getRoleInfo, logs } = useRotation();
  const [expandedRole, setExpandedRole] = useState<string | null>(null);
  const [showLogs, setShowLogs] = useState(false);

  const overdueCount = state.roles.filter(r => {
    const info = getRoleInfo(r.id);
    return info?.mustRotate;
  }).length;

  return (
    <Layout>
      <PageHeader
        title="Rotation des Rôles"
        subtitle="Aucun rôle n'est fixe. Les responsabilités tournent pour empêcher la concentration de pouvoir."
        pedagogy="Ce module assigne les tâches par tirage au sort pondéré. Chaque membre a une période de refroidissement après un mandat : il ne peut pas reprendre le même rôle avant X semaines. Si personne n'est éligible, l'algorithme lève le refroidissement par ancienneté (le membre le plus ancien dans la file revient)."
      />

      {/* Members pool */}
      <div className="glass-card p-4 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <User className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold">Membres volontaires</h3>
          <span className="text-xs font-mono text-muted-foreground ml-auto">{state.members.length} actifs</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {state.members.map((m) => {
            const currentRole = state.roles.find(r => r.currentMemberId === m.id);
            return (
              <div key={m.id} className="flex items-center gap-2 bg-muted/50 rounded-md px-3 py-1.5">
                <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-mono flex items-center justify-center">
                  {m.avatar}
                </span>
                <div>
                  <span className="text-sm text-foreground">{m.name}</span>
                  {currentRole && (
                    <p className="text-[10px] text-muted-foreground leading-tight">{currentRole.name}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Rotate all button */}
      {overdueCount > 0 && (
        <div className="mb-4 p-3 rounded-md bg-warning/10 border border-warning/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-warning" />
            <span className="text-sm text-foreground">
              <span className="font-semibold">{overdueCount} rôle(s)</span> en dépassement de mandat
            </span>
          </div>
          <button
            onClick={rotateAll}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-warning text-warning-foreground text-xs font-medium hover:bg-warning/90 transition-colors"
          >
            <Shuffle className="h-3.5 w-3.5" />
            Rotation automatique
          </button>
        </div>
      )}

      {/* Rotation calendar */}
      <div className="glass-card overflow-hidden mb-6">
        <div className="px-4 py-3 border-b border-border/50 flex items-center gap-2">
          <Calendar className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold">Calendrier de Rotation</h3>
        </div>
        <div className="divide-y divide-border/20">
          {state.roles.map((role, i) => {
            const info = getRoleInfo(role.id);
            if (!info) return null;
            const isExpanded = expandedRole === role.id;

            return (
              <div key={role.id} className="animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
                {/* Role row */}
                <div className="px-4 py-3 flex items-center gap-4">
                  <div className={`w-8 h-8 rounded flex items-center justify-center flex-shrink-0 ${
                    info.mustRotate ? "bg-warning/20" : "bg-primary/10"
                  }`}>
                    <RefreshCw className={`h-4 w-4 ${
                      info.mustRotate ? "text-warning animate-spin" : "text-primary"
                    }`} style={info.mustRotate ? { animationDuration: "3s" } : {}} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-foreground">{role.name}</p>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                        max {role.maxWeeks} sem.
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {info.currentMember
                        ? <>Assigné à <span className="font-medium text-foreground">{info.currentMember.name}</span></>
                        : "Non assigné"
                      }
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {/* Days left */}
                    <div className="text-right mr-2">
                      <p className={`text-sm font-mono ${
                        info.mustRotate ? "text-warning font-semibold" :
                        info.daysLeft <= 3 ? "text-warning font-medium" : "text-muted-foreground"
                      }`}>
                        {info.mustRotate ? "⚠ Échu" : `${info.daysLeft}j`}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {info.mustRotate ? "rotation requise" : "avant rotation"}
                      </p>
                    </div>

                    {/* Rotate single */}
                    <button
                      onClick={() => rotate(role.id)}
                      className="p-1.5 rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                      title="Tirage au sort"
                    >
                      <Shuffle className="h-3.5 w-3.5" />
                    </button>

                    {/* Expand */}
                    <button
                      onClick={() => setExpandedRole(isExpanded ? null : role.id)}
                      className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground"
                    >
                      {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-0 ml-12 space-y-3 border-t border-border/10 pt-3">
                    {/* Max weeks config */}
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground">Durée max :</span>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4].map(w => (
                          <button
                            key={w}
                            onClick={() => setMaxWeeks(role.id, w)}
                            className={`px-2 py-1 text-xs font-mono rounded transition-colors ${
                              role.maxWeeks === w
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground hover:bg-muted/80"
                            }`}
                          >
                            {w}s
                          </button>
                        ))}
                      </div>
                      <span className="text-[10px] text-muted-foreground">
                        (refroidissement = {role.maxWeeks} sem.)
                      </span>
                    </div>

                    {/* Eligible members */}
                    <div>
                      <span className="text-xs text-muted-foreground flex items-center gap-1 mb-1.5">
                        <ShieldCheck className="h-3 w-3" />
                        Éligibles au prochain tirage ({info.eligible.length})
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {info.eligible.map(m => (
                          <span key={m.id} className="text-xs bg-safe/10 text-safe px-2 py-0.5 rounded font-mono">
                            {m.name}
                          </span>
                        ))}
                        {info.eligible.length === 0 && (
                          <span className="text-xs text-warning">Aucun — levée de refroidissement par ancienneté</span>
                        )}
                      </div>
                    </div>

                    {/* Past holders */}
                    {info.pastHolders.length > 0 && (
                      <div>
                        <span className="text-xs text-muted-foreground flex items-center gap-1 mb-1.5">
                          <History className="h-3 w-3" />
                          Historique récent
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {info.pastHolders.map((h, idx) => (
                            <span key={idx} className="text-xs bg-muted/50 text-muted-foreground px-2 py-0.5 rounded font-mono">
                              {h.member}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Rotation logs */}
      {logs.length > 0 && (
        <div className="glass-card overflow-hidden">
          <button
            onClick={() => setShowLogs(!showLogs)}
            className="w-full px-4 py-3 border-b border-border/50 flex items-center gap-2 hover:bg-muted/30 transition-colors"
          >
            <History className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold">Journal des Rotations</h3>
            <span className="text-xs font-mono text-muted-foreground ml-auto">{logs.length} entrées</span>
            {showLogs ? <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" /> : <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />}
          </button>
          {showLogs && (
            <div className="divide-y divide-border/20 max-h-64 overflow-y-auto">
              {logs.map(log => (
                <div key={log.id} className="px-4 py-2.5 flex items-start gap-3">
                  <Shuffle className="h-3.5 w-3.5 text-primary mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">
                      <span className="font-medium">{log.roleName}</span>
                      {log.fromMember && <> : {log.fromMember} →</>} <span className="text-primary font-medium">{log.toMember}</span>
                    </p>
                    <p className="text-[10px] text-muted-foreground">{log.reason}</p>
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground flex-shrink-0">{log.timestamp}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </Layout>
  );
}
