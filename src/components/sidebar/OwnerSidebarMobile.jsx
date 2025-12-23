import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  Truck,
  FileText,
  MessageSquare
} from "lucide-react";

const navItems = [
  { to: "/owner/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/owner/projects", label: "Tasks", icon: Briefcase },
  { to: "/owner/materials", label: "Material", icon: Truck },
  { to: "/owner/chat", label: "Chat", icon: MessageSquare },
  { to: "/owner/paperwork", label: "Docs", icon: FileText }
];

export default function OwnerBottomNav() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t lg:hidden">
      <nav className="flex justify-around">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center py-2 text-xs
               ${isActive ? "text-blue-600 font-semibold" : "text-slate-400"}`
            }
          >
            <Icon size={20} />
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
