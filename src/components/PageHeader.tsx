import { ReactNode } from "react";
import { Info } from "lucide-react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  pedagogy?: string;
  children?: ReactNode;
}

export function PageHeader({ title, subtitle, pedagogy, children }: PageHeaderProps) {
  return (
    <div className="mb-8 animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
        {children}
      </div>
      {pedagogy && (
        <div className="mt-4 flex items-start gap-2 p-3 rounded-md bg-info/10 border border-info/20">
          <Info className="h-4 w-4 text-info mt-0.5 flex-shrink-0" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            <span className="font-medium text-foreground">Pédagogie :</span> {pedagogy}
          </p>
        </div>
      )}
    </div>
  );
}
