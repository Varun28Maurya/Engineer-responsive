import { Plus, Share2 } from "lucide-react";
import { useState } from "react";
import projectsData from "../../data/projects.json";
import { Link } from "react-router-dom";

export default function OwnerProjects() {
  const user = JSON.parse(localStorage.getItem("authUser"));
  const [showAddProject, setShowAddProject] = useState(false);

  // 🔥 Filter projects by logged-in owner
  const projects = projectsData.filter(
    (p) => p.ownerId === user.id
  );

  return (
    <div className="space-y-6">

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-800">
          Project Management
        </h1>

        <button
          onClick={() => setShowAddProject(true)}
          className="flex items-center gap-2 bg-[#0B3C5D] text-white px-4 py-2 rounded-lg shadow-md"
        >
          <Plus size={18} />
          Add New Project
        </button>
      </div>

      {/* ✅ PROJECTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {projects.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >

            {/* Header */}
            <div className="p-5 border-b border-gray-50 flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded uppercase">
                  Active
                </span>

                <h3 className="text-lg font-bold text-slate-800 mt-2">
                  {p.name}
                </h3>

                <p className="text-sm text-slate-500">
                  {p.location}
                </p>
              </div>

              {/* Completion */}
              <div className="text-right">
                <p className="text-[10px] uppercase text-gray-400 font-bold">
                  Completion
                </p>
                <p className="font-bold text-slate-800">
                  {p.progress ?? 0}%
                </p>
              </div>
            </div>

            {/* Body */}
            <div className="p-5 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Budget</span>
                <span className="font-semibold">
                  {p.budgetSlab ?? "—"}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Project Code</span>
                <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded">
                  {p.code ?? p.id}
                </span>
              </div>

              {/* Progress bar */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-500">Progress</span>
                  <span className="font-bold">
                    {p.progress ?? 0}%
                  </span>
                </div>

                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#0B3C5D]"
                    style={{ width: `${p.progress ?? 0}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-4 bg-gray-50 flex gap-2">
              <Link
                to={`/owner/projects/${p.id}`}
                className="flex-1 text-sm font-semibold text-[#0B3C5D] py-2 bg-white border rounded-lg text-center hover:bg-gray-100"
              >
                View Details
              </Link>

              <button className="p-2 text-slate-400 bg-white border rounded-lg hover:text-slate-600">
                <Share2 size={18} />
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* Modal placeholder */}
      {showAddProject && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl">
            <h2 className="font-bold mb-4">Add Project (Coming Soon)</h2>
            <button
              onClick={() => setShowAddProject(false)}
              className="px-4 py-2 bg-[#0B3C5D] text-white rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
