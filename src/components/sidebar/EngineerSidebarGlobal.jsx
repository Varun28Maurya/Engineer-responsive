import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  ClipboardList,
  Truck,
  MessageSquare
} from "lucide-react";

export default function EngineerSidebarGlobal() {
  const navigate = useNavigate();

  const menu = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/engineer/dashboard" },
    { label: "Projects", icon: FolderKanban, path: "/engineer/projects" },
    { label: "Tasks", icon: ClipboardList, path: "/engineer/tasks" },
    { label: "Materials", icon: Truck, path: "/engineer/materials" },
    { label: "Chat", icon: MessageSquare, path: "/engineer/chat" },
  ];

  return (
    <div className="p-6 space-y-2">
      <h1 className="text-xl font-black mb-6">SiteSetu</h1>

      {menu.map(item => (
        <button
          key={item.label}
          onClick={() => navigate(item.path)}
          className="w-full flex gap-3 px-4 py-3 rounded-lg hover:bg-white/10"
        >
          <item.icon size={18} />
          {item.label}
        </button>
      ))}
    </div>
  );
}
