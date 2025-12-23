import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  Truck,
  FileText,
  MessageSquare
} from "lucide-react";

export default function OwnerSidebar() {
  const linkClass = ({ isActive }) =>
    `w-full flex gap-3 px-4 py-3 rounded-lg text-sm font-medium transition
     ${isActive ? "bg-white/10 text-orange-400" : "text-slate-300 hover:bg-white/5 hover:text-white"}`;

  return (
    <div className="p-6 space-y-2">
      <h1 className="text-xl font-bold mb-6">SiteSetu</h1>

      <NavLink to="/owner/dashboard" className={linkClass}>
        <LayoutDashboard size={18} /> Dashboard
      </NavLink>

      <NavLink to="/owner/projects" className={linkClass}>
        <Briefcase size={18} /> Projects
      </NavLink>

      <NavLink to="/owner/materials" className={linkClass}>
        <Truck size={18} /> Approvals
      </NavLink>

      <NavLink to="/owner/paperwork" className={linkClass}>
        <FileText size={18} /> Paperwork
      </NavLink>

      <NavLink to="/owner/chat" className={linkClass}>
        <MessageSquare size={18} /> Chat
      </NavLink>
    </div>
  );
}
