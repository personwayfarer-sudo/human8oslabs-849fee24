import { useState } from "react";
import { X } from "lucide-react";

interface JusticeCognitiveProps {
  invariant: string;
  explanation: string;
}

/**
 * Bouton ∞ — Justice Cognitive
 * Ouvre une modale expliquant quel invariant est protégé par l'indicateur.
 */
export function JusticeCognitive({ invariant, explanation }: JusticeCognitiveProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold bg-primary/10 text-primary hover:bg-primary/20 transition-colors cursor-pointer"
        title="Justice Cognitive — En savoir plus"
        aria-label="Explication de cet indicateur"
      >
        ∞
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-foreground/30 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          {/* Modal */}
          <div className="relative bg-card border border-border rounded-lg shadow-xl max-w-md w-full p-6 animate-fade-in z-50">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 p-1 rounded hover:bg-muted transition-colors text-muted-foreground"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <span className="w-8 h-8 rounded-full bg-primary/15 text-primary flex items-center justify-center text-lg font-bold">
                ∞
              </span>
              <div>
                <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Justice Cognitive</p>
                <h3 className="text-sm font-semibold text-foreground">Invariant : {invariant}</h3>
              </div>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">
              {explanation}
            </p>

            <div className="mt-4 pt-3 border-t border-border/50">
              <p className="text-[10px] text-muted-foreground font-mono">
                Cet indicateur protège l'invariant de <span className="text-primary font-medium">{invariant}</span>. 
                Il empêche que la survie du groupe ne dépende de la performance individuelle.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
