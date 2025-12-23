import { Outlet } from "react-router-dom";

export default function ProjectWorkspace() {
  return (
    <main className="flex-1 overflow-y-auto p-6">
      <Outlet />
    </main>
  );
}
