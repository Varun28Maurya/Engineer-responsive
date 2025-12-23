import { useNavigate, useParams } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  Truck,
  MessageSquare,
  ArrowLeft
} from "lucide-react";

export default function EngineerSidebarProject() {
  const navigate = useNavigate();
  const { projectId } = useParams();

  const menu = [
    { label: "Dashboard", icon: LayoutDashboard, path: "" },
    { label: "Attendance", icon: Users, path: "attendance" },
    { label: "Tasks", icon: ClipboardList, path: "tasks" },
    { label: "Materials", icon: Truck, path: "materials" },
    { label: "Chat", icon: MessageSquare, path: "chat" },
  ];

  return (
    <div className="p-6 space-y-2">
      <button
        onClick={() => navigate("/engineer/dashboard")}
        className="flex items-center gap-2 text-sm mb-6 text-slate-300 hover:text-white"
      >
        <ArrowLeft size={16} />
        Back to Projects
      </button>

      <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
        Project Workspace
      </h2>

      {menu.map(item => (
        <button
          key={item.label}
          onClick={() =>
            navigate(`/engineer/projects/${projectId}/${item.path}`)
          }
          className="w-full flex gap-3 px-4 py-3 rounded-lg hover:bg-white/10 text-left"
        >
          <item.icon size={18} />
          {item.label}
        </button>
      ))}
    </div>
  );
}
