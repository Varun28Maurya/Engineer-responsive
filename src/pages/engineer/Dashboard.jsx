import React, { useEffect, useState, useMemo } from "react";
import projectsSeed from "../../data/projects.json";
import {
  LayoutGrid,
  AlertTriangle,
  CheckCircle,
  Settings,
  Clock,
} from "lucide-react";

const ENGINEER_ID = "eng-1";

const StatCard = ({ title, value, icon: Icon, colorClass }) => (
  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
    <div className={`p-3 rounded-lg ${colorClass}`}>
      <Icon size={24} />
    </div>
    <div>
      <p className="text-slate-500 text-sm font-medium">{title}</p>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
    </div>
  </div>
);

export default function EngineerDashboard() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const existing = localStorage.getItem("projects");
    if (!existing) {
      localStorage.setItem("projects", JSON.stringify(projectsSeed));
    }
    setProjects(JSON.parse(localStorage.getItem("projects")));
  }, []);

  const dashboardProjects = useMemo(() => {
    return projects
      .filter(p => p.engineerId === ENGINEER_ID)
      .map(p => {
        const dpr = localStorage.getItem(`dpr-${p.id}`);
        const materials = JSON.parse(
          localStorage.getItem(`materials-${p.id}`) || "[]"
        );
        return {
          ...p,
          status:
            !dpr || materials.length > 3
              ? "Attention Needed"
              : "On Track",
        };
      });
  }, [projects]);

  const stats = {
    total: dashboardProjects.length,
    attention: dashboardProjects.filter(p => p.status === "Attention Needed").length,
    onTrack: dashboardProjects.filter(p => p.status === "On Track").length,
  };

  return (
    <div className="max-w-7xl mx-auto px-8 py-8">

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold mb-2">Engineer Dashboard</h1>
        <p className="text-slate-500 flex items-center gap-2">
          <Clock size={16} />
          Shift started at 08:30 AM
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Assigned Projects"
          value={stats.total}
          icon={LayoutGrid}
          colorClass="bg-blue-50 text-blue-600"
        />
        <StatCard
          title="Needs Attention"
          value={stats.attention}
          icon={AlertTriangle}
          colorClass="bg-amber-50 text-amber-600"
        />
        <StatCard
          title="On Track"
          value={stats.onTrack}
          icon={CheckCircle}
          colorClass="bg-emerald-50 text-emerald-600"
        />
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-5 rounded-xl text-white shadow-lg flex flex-col justify-between">
          <span className="text-sm opacity-90">Overall Utilization</span>
          <div>
            <p className="text-2xl font-bold">92%</p>
            <div className="w-full bg-white/20 h-1.5 rounded-full mt-2">
              <div className="bg-white h-full w-[92%]" />
            </div>
          </div>
        </div>
      </div>
      {/* ATTENTION RADAR */}
<div className="mt-12">
  <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
    🚨 Attention Radar
  </h2>

  <div className="bg-white border rounded-xl divide-y">
    {dashboardProjects.map(project => {
      const today = new Date().toISOString().split("T")[0];

      const dprToday = localStorage.getItem(`dpr-${project.id}-${today}`);
      const attendanceToday = localStorage.getItem(`attendance-${project.id}-${today}`);
      const materials = JSON.parse(
        localStorage.getItem("materials") || "[]"
      ).filter(
        m => m.projectId === project.id && m.status === "PENDING"
      );
      const chats = JSON.parse(
        localStorage.getItem("chatMessages") || "[]"
      ).filter(m => m.projectId === project.id);

      let reasons = [];
      let riskScore = 0;

      if (!dprToday) {
        riskScore += 30;
        reasons.push("DPR not submitted today");
      }

      if (!attendanceToday) {
        riskScore += 25;
        reasons.push("Attendance not marked today");
      }

      if (materials.length > 0) {
        riskScore += materials.length * 10;
        reasons.push(`${materials.length} material request(s) pending`);
      }

      if (
        chats.length === 0 ||
        Date.now() - new Date(chats[chats.length - 1].createdAt).getTime() >
          24 * 60 * 60 * 1000
      ) {
        riskScore += 15;
        reasons.push("No communication in last 24h");
      }

      let level = "LOW";
      let color = "emerald";

      if (riskScore > 50) {
        level = "HIGH";
        color = "red";
      } else if (riskScore > 20) {
        level = "MEDIUM";
        color = "amber";
      }

      return (
        <div
          key={project.id}
          className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <p className="font-semibold text-slate-900">
              {project.name}
            </p>

            {reasons.length > 0 ? (
              <ul className="mt-2 text-sm text-slate-600 list-disc list-inside">
                {reasons.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-slate-500">
                All activities normal
              </p>
            )}
          </div>

          <span
            className={`self-start sm:self-center px-3 py-1 rounded-full text-xs font-semibold
              bg-${color}-100 text-${color}-700`}
          >
            {level} RISK
          </span>
        </div>
      );
    })}

    {dashboardProjects.length === 0 && (
      <p className="p-5 text-sm text-slate-500">
        No assigned projects to analyze
      </p>
    )}
  </div>
</div>

    </div>
  );
}
