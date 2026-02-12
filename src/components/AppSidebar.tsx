import { useState } from "react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Shield,
  Sprout,
  RefreshCw,
  BookOpen,
  Settings,
  Menu,
  X,
  Infinity,
} from "lucide-react";

const navItems = [
  { title: "Résilience", url: "/", icon: Shield },
  { title: "Subsistance", url: "/subsistance", icon: Sprout },
  { title: "Rôles", url: "/roles", icon: RefreshCw },
  { title: "Savoirs", url: "/savoirs", icon: BookOpen },
  { title: "Paramètres", url: "/parametres", icon: Settings },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <>
      {/* Mobile overlay */}
      {!collapsed && (
        <div
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setCollapsed(true)}
        />
      )}

      {/* Mobile toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-md bg-sidebar text-sidebar-foreground"
      >
        {collapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
      </button>

      <aside
        className={`
          fixed lg:sticky top-0 left-0 z-40 h-screen
          bg-sidebar text-sidebar-foreground
          border-r border-sidebar-border
          flex flex-col
          transition-all duration-300 ease-in-out
          ${collapsed ? "-translate-x-full lg:translate-x-0 lg:w-16" : "w-64"}
        `}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-6 border-b border-sidebar-border">
          <div className="flex items-center justify-center w-8 h-8 rounded bg-sidebar-primary/20">
            <Infinity className="h-5 w-5 text-sidebar-primary" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <h1 className="text-sm font-semibold tracking-wide text-sidebar-foreground">
                HUMAN∞OS
              </h1>
              <p className="text-[10px] font-mono text-sidebar-muted tracking-widest uppercase">
                v1.0 — Lab
              </p>
            </div>
          )}
        </div>

        {/* Desktop collapse */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex items-center justify-center py-2 text-sidebar-muted hover:text-sidebar-foreground transition-colors"
        >
          <Menu className="h-4 w-4" />
        </button>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.url;
            return (
              <NavLink
                key={item.url}
                to={item.url}
                end
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-md text-sm
                  transition-colors duration-150
                  ${isActive
                    ? "bg-sidebar-accent text-sidebar-primary font-medium"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                  }
                `}
                activeClassName=""
              >
                <item.icon className={`h-4 w-4 flex-shrink-0 ${isActive ? "text-sidebar-primary" : ""}`} />
                {!collapsed && <span>{item.title}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        {!collapsed && (
          <div className="px-4 py-4 border-t border-sidebar-border">
            <p className="text-[10px] font-mono text-sidebar-muted uppercase tracking-widest">
              Non-Capture · Dignité
            </p>
          </div>
        )}
      </aside>
    </>
  );
}
