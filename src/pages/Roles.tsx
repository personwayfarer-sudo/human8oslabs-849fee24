import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";
import { RefreshCw, User, Calendar } from "lucide-react";

const members = [
  { name: "Aïcha M.", avatar: "A" },
  { name: "Karim B.", avatar: "K" },
  { name: "Leïla S.", avatar: "L" },
  { name: "Omar T.", avatar: "O" },
  { name: "Nadia R.", avatar: "N" },
  { name: "Youssef D.", avatar: "Y" },
];

const roles = [
  { role: "Gestion Numérique", current: "Leïla S.", since: "11 fév", nextRotation: "25 fév", daysLeft: 13 },
  { role: "Cuisine Collective", current: "Omar T.", since: "8 fév", nextRotation: "22 fév", daysLeft: 10 },
  { role: "Accueil & Médiation", current: "Nadia R.", since: "5 fév", nextRotation: "19 fév", daysLeft: 7 },
  { role: "Maintenance Habitat", current: "Youssef D.", since: "1 fév", nextRotation: "15 fév", daysLeft: 3 },
  { role: "Gestion des Stocks", current: "Aïcha M.", since: "10 fév", nextRotation: "24 fév", daysLeft: 12 },
  { role: "Comptabilité Commune", current: "Karim B.", since: "6 fév", nextRotation: "20 fév", daysLeft: 8 },
];

export default function Roles() {
  return (
    <Layout>
      <PageHeader
        title="Rotation des Rôles"
        subtitle="Aucun rôle n'est fixe. Les responsabilités tournent pour empêcher la concentration de pouvoir."
        pedagogy="Ce module assigne automatiquement les tâches de gestion par tirage au sort ou file d'attente cyclique. Chaque membre peut refuser une rotation et être replacé dans la file. Aucune compétence n'est prérequise — chaque rôle dispose d'un guide."
      />

      {/* Members pool */}
      <div className="glass-card p-4 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <User className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold">Membres volontaires</h3>
          <span className="text-xs font-mono text-muted-foreground ml-auto">{members.length} actifs</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {members.map((m) => (
            <div key={m.name} className="flex items-center gap-2 bg-muted/50 rounded-md px-3 py-1.5">
              <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-mono flex items-center justify-center">
                {m.avatar}
              </span>
              <span className="text-sm text-foreground">{m.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Rotation calendar */}
      <div className="glass-card overflow-hidden">
        <div className="px-4 py-3 border-b border-border/50 flex items-center gap-2">
          <Calendar className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold">Calendrier de Rotation</h3>
        </div>
        <div className="divide-y divide-border/20">
          {roles.map((r, i) => (
            <div
              key={r.role}
              className="px-4 py-3 flex items-center gap-4 animate-fade-in"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
                <RefreshCw className={`h-4 w-4 text-primary ${r.daysLeft <= 3 ? "animate-spin" : ""}`} style={r.daysLeft <= 3 ? { animationDuration: "3s" } : {}} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{r.role}</p>
                <p className="text-xs text-muted-foreground">
                  Assigné à <span className="font-medium text-foreground">{r.current}</span> depuis le {r.since}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className={`text-sm font-mono ${r.daysLeft <= 3 ? "text-warning font-medium" : "text-muted-foreground"}`}>
                  {r.daysLeft}j
                </p>
                <p className="text-[10px] text-muted-foreground">avant rotation</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
