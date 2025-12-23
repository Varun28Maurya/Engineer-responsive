import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  ClipboardList,
  Truck,
  MessageSquare
} from "lucide-react";

const navItems = [
  { to: "/engineer/dashboard", label: "Home", icon: LayoutDashboard },
  { to: "/engineer/projects", label: "Projects", icon: FolderKanban },
  { to: "/engineer/tasks", label: "Tasks", icon: ClipboardList },
  { to: "/engineer/materials", label: "Material", icon: Truck },
  { to: "/engineer/chat", label: "Chat", icon: MessageSquare }
];

export default function EngineerBottomNavGlobal() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t lg:hidden">
      <nav className="flex justify-around">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center py-2 text-xs transition
               ${isActive
                 ? "text-blue-600 font-semibold"
                 : "text-slate-400"}`
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
