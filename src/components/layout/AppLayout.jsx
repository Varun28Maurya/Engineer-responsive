import { Menu, Bell, Wifi, WifiOff } from "lucide-react";
import { Outlet, useLocation } from "react-router-dom";

import OwnerSidebar from "../sidebar/OwnerSidebar";
import EngineerSidebarGlobal from "../sidebar/EngineerSidebarGlobal";
import EngineerSidebarProject from "../sidebar/EngineerSidebarProject";
import OwnerBottomNav from "../sidebar/OwnerSidebarMobile";
import SiteSaarthiLogo from "../../assets/SiteSaarthiLogo.png";
import EngineerSidebarGlobalMobile from "../sidebar/EngineerSidebarGlobalMobile";
import EngineerSidebarProjectMobile from "../sidebar/EngineerSidebarProjectMobile";
export default function AppLayout({
  isOffline = false,
  toggleOffline = () => { },
}) {
  const location = useLocation();

  const isEngineer = location.pathname.startsWith("/engineer");
  const isProjectWorkspace = location.pathname.includes("/engineer/projects/");
  const isOwner = location.pathname.startsWith("/owner");

  const renderSidebar = () => {
    if (isOwner) return <OwnerSidebar />;

    if (isEngineer) {
      return isProjectWorkspace
        ? <EngineerSidebarProject />
        : <EngineerSidebarGlobal />;
    }

    return null;
  };

  return (
    <div className="min-h-screen flex bg-[#F8FAFC]">

      {/* Desktop Sidebar */}
      <aside className="w-64 bg-[#0B3C5D] text-white hidden lg:block">
        {renderSidebar()}
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col">

        {/* Header */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-4 lg:px-6">

          {/* LEFT: App Identity */}
          <div className="flex items-center gap-3">
            <img
              src={SiteSaarthiLogo}
              alt="SiteSaarthi"
              className="h-9 w-auto"
            />


            <h1 className="text-lg font-semibold text-slate-900">
              SiteSetu
            </h1>
          </div>

          {/* RIGHT: Status + Notifications */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleOffline}
              className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2
        ${isOffline
                  ? "bg-rose-50 text-rose-600"
                  : "bg-emerald-50 text-emerald-600"}`}
            >
              {isOffline ? <WifiOff size={14} /> : <Wifi size={14} />}
              {isOffline ? "OFFLINE" : "ONLINE"}
            </button>

            <button className="relative p-2">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>

        </header>


        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6 pb-20 lg:pb-6">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      {isOwner && <OwnerBottomNav />}
      {isEngineer && !isProjectWorkspace && <EngineerSidebarGlobalMobile />}
      {isEngineer && isProjectWorkspace && <EngineerSidebarProjectMobile />}
    </div>
  );
}
