import { NavLink } from "react-router-dom";
import {
  MessageSquare,
  BookOpen,
  FileText,
  Calendar,
  Settings,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

const navItems = [
  { to: "/", icon: MessageSquare, label: "AI Tutor" },
  { to: "/quiz", icon: BookOpen, label: "Quiz & Cards" },
  { to: "/documents", icon: FileText, label: "Documents" },
  { to: "/planner", icon: Calendar, label: "Study Plan" },
  { to: "/settings", icon: Settings, label: "Settings" },
];

export function Sidebar() {
  return (
    <aside className="flex h-full w-64 flex-col border-r bg-card">
      <div className="flex h-14 items-center gap-2 border-b px-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <Sparkles className="h-5 w-5 text-primary-foreground" />
        </div>
        <span className="text-lg font-semibold">Synapse</span>
      </div>

      <nav className="flex-1 space-y-1 p-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )
            }
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t p-4">
        <div className="rounded-lg bg-muted p-3">
          <p className="text-xs text-muted-foreground">
            Powered by your AI API keys
          </p>
          <p className="mt-1 text-xs font-medium">Data stays local</p>
        </div>
      </div>
    </aside>
  );
}
