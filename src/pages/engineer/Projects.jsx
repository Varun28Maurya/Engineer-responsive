import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import projectsSeed from "../../data/projects.json";
import {
  MapPin,
  User,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Search,
  ClipboardCheck,
  Package,
} from "lucide-react";

const ENGINEER_ID = "eng-1";

const ProjectCard = ({ project, onEnter }) => {
  const isAttention = project.status === "Attention Needed";

  return (
    <div className="bg-white rounded-xl border shadow-sm flex flex-col">
      <div className={`h-1.5 ${isAttention ? "bg-amber-500" : "bg-emerald-500"}`} />

      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between mb-4">
          <h3 className="font-bold text-lg">{project.name}</h3>
          <span className={`text-xs px-2 py-1 rounded-full ${
            isAttention ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
          }`}>
            {project.status}
          </span>
        </div>

        <div className="space-y-2 text-sm text-slate-600 mb-6">
          <div className="flex gap-2">
            <MapPin size={14} /> {project.location}
          </div>
          <div className="flex gap-2">
            <User size={14} /> Private Client
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="p-3 bg-slate-50 rounded-lg text-xs">
            <ClipboardCheck size={14} />
            DPR: {project.dprPending ? "Pending" : "Done"}
          </div>
          <div className="p-3 bg-slate-50 rounded-lg text-xs">
            <Package size={14} />
            Materials: {project.materialsPending}
          </div>
        </div>

        <button
          onClick={() => onEnter(project.id)}
          className="mt-auto bg-slate-900 text-white py-2 rounded-lg flex justify-center items-center gap-2"
        >
          Enter Site <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default function EngineerProjects() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("projects");
    setProjects(stored ? JSON.parse(stored) : projectsSeed);
  }, []);

  const filtered = useMemo(() => {
    return projects
      .filter(p => p.engineerId === ENGINEER_ID)
      .filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.location.toLowerCase().includes(search.toLowerCase())
      );
  }, [projects, search]);

  return (
    <div className="max-w-7xl mx-auto px-8 py-8">

      <div className="flex justify-between mb-8">
        <h1 className="text-3xl font-extrabold">My Projects</h1>
        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            className="pl-10 pr-4 py-2 border rounded-lg w-full"
            placeholder="Search projects..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map(p => (
          <ProjectCard
            key={p.id}
            project={p}
            onEnter={id => navigate(`/engineer/projects/${id}`)}
          />
        ))}
      </div>
    </div>
  );
}
