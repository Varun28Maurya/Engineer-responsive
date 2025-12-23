import { NavLink, useParams } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  Truck,
  MessageSquare
} from "lucide-react";

export default function EngineerBottomNavProject() {
  const { projectId } = useParams();

  const navItems = [
    {
      to: `/engineer/projects/${projectId}`,
      label: "Home",
      icon: LayoutDashboard,
      end: true
    },
    {
      to: `/engineer/projects/${projectId}/attendance`,
      label: "Attend",
      icon: Users
    },
    {
      to: `/engineer/projects/${projectId}/tasks`,
      label: "Tasks",
      icon: ClipboardList
    },
    {
      to: `/engineer/projects/${projectId}/materials`,
      label: "Material",
      icon: Truck
    },
    {
      to: `/engineer/projects/${projectId}/chat`,
      label: "Chat",
      icon: MessageSquare
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t lg:hidden">
      <nav className="flex justify-around">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
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
