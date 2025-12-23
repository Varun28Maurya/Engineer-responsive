import { Users, Clock, ShieldCheck, ChevronRight } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import projects from "../../data/projects.json";
import ProjectMap from "../../components/maps/ProjectMap";


export default function ProjectDetails() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const project = projects.find((p) => p.id === projectId);

  if (!project) {
    return (
      <p className="text-red-500 font-bold">
        Project not found
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-white rounded-full"
        >
          <ChevronRight size={20} className="rotate-180" />
        </button>

        <h2 className="text-2xl font-bold text-slate-800">
          {project.name}
        </h2>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* LEFT: DPR */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold">
                Daily Progress Reports
              </h3>
              <button className="text-sm text-blue-600">
                Export All
              </button>
            </div>

            {[
              {
                date: "Today, Oct 24",
                work: "Column casting for 4th floor. 40 cubic meters poured.",
                labor: 18,
                delay: "None",
              },
              {
                date: "Yesterday, Oct 23",
                work: "Rebar binding for 4th floor columns. Inspection completed.",
                labor: 15,
                delay: "2 hrs (Material arrival delay)",
              },
            ].map((dpr, idx) => (
              <div
                key={idx}
                className="p-4 bg-slate-50 rounded-xl border border-slate-100 mb-6"
              >
                <div className="flex justify-between items-center mb-2">
                  <p className="font-bold text-sm text-slate-800">
                    {dpr.date}
                  </p>
                  <span className="text-xs font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded">
                    SUBMITTED
                  </span>
                </div>

                <p className="text-sm text-slate-600 mb-3">
                  {dpr.work}
                </p>

                <div className="flex gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Users size={14} />
                    {dpr.labor} Workers Present
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={14} />
                    Delay: {dpr.delay}
                  </span>
                </div>

                <div className="mt-4 flex gap-2">
                  {[1, 2, 3].map((img) => (
                    <div
                      key={img}
                      className="w-16 h-16 bg-slate-200 rounded-lg flex items-center justify-center text-[10px] text-slate-400 border"
                    >
                      Photo {img}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="space-y-6">

          {/* Attendance */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-bold mb-4">
              Attendance Summary
            </h3>

            {["Manoj Yadav", "Prakash Singh", "Amit Kumar", "Rohit Das"].map(
              (worker) => (
                <div
                  key={worker}
                  className="flex justify-between items-center text-sm py-2 border-b last:border-0"
                >
                  <span className="font-medium text-slate-700">
                    {worker}
                  </span>
                  <span className="text-emerald-500 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[10px]">
                    P (08:30 AM)
                  </span>
                </div>
              )
            )}
          </div>

          {/* Trust Score */}
          <div className="bg-[#0B3C5D] rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold">
                Trust Score Breakdown
              </h3>
              <ShieldCheck size={20} className="text-orange-400" />
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">
                    DPR Consistency
                  </span>
                  <span className="font-bold">95%</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full">
                  <div className="h-full bg-emerald-400 w-[95%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">
                    Material Accuracy
                  </span>
                  <span className="font-bold">82%</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full">
                  <div className="h-full bg-orange-400 w-[82%]" />
                </div>
              </div>
            </div>

            <p className="text-[10px] mt-6 text-slate-400 italic">
              Calculated automatically based on site activity,
              daily reports, and material handling accuracy.
            </p>
          </div>

        </div>
      </div>
      {/* MAP SECTION (FULL WIDTH AT BOTTOM) */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-bold text-slate-800 mb-4">
          Site Location & Work Radius
        </h3>

        <ProjectMap
          lat={project.lat}
          lng={project.lng}
          radius={project.radius}
        />
      </div>

    </div>
  );
}
