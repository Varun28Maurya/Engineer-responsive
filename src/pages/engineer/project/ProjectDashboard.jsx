import React, { useState,useEffect } from "react";
import { useParams } from "react-router-dom";
import projects from "@/data/projects.json";

import {
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Camera,
  Navigation,
  Plus
} from "lucide-react";

function getDistanceInMeters(lat1, lon1, lat2, lon2) {

  const R = 6371e3; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) *
    Math.cos(φ2) *
    Math.sin(Δλ / 2) *
    Math.sin(Δλ / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // distance in meters
}

export default function ProjectDashboard({  }) {
  const { projectId } = useParams();

const project = projects.find(p => p.id === projectId);

  if (!project) {
  return (
    <div className="p-6 text-sm text-slate-500">
      Loading project dashboard…
    </div>
  );
}

  const [checkingLocation, setCheckingLocation] = useState(false);
  const [gpsStatus, setGpsStatus] = useState("NOT_VERIFIED");
  // NOT_VERIFIED | VERIFIED | FAILED
  const [distanceFromSite, setDistanceFromSite] = useState(null);

  const [attendance, setAttendance] = useState({
    self: false,
    workers: 18
  });
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const saved = localStorage.getItem(
      `attendance-${project.id}-${today}`
    );

    if (saved) {
      const data = JSON.parse(saved);
      setAttendance(prev => ({ ...prev, self: true }));
      setGpsStatus("VERIFIED");
      setDistanceFromSite(
        Math.round(
          getDistanceInMeters(
            data.lat,
            data.lng,
            project.lat,
            project.lng
          )
        )
      );
    }
  }, [project]);


  const [dprSubmitted, setDprSubmitted] = useState(false);

  const tasks = [
    { id: 1, title: "Column Casting – 4th Floor", priority: "High" },
    { id: 2, title: "Electrical Conduit Layout", priority: "Medium" },
    { id: 3, title: "Plastering – Wing A", priority: "Low" }
  ];
  const handleSelfCheckIn = () => {
    if (attendance.self) return;

    if (!navigator.geolocation) {
      alert("GPS not supported");
      return;
    }

    setCheckingLocation(true);

    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;

        const distance = getDistanceInMeters(
          latitude,
          longitude,
          project.lat,
          project.lng
        );

        if (distance <= project.radius) {
          const today = new Date().toISOString().split("T")[0];

          localStorage.setItem(
            `attendance-${project.id}-${today}`,
            JSON.stringify({
              engineerId: project.engineerId,
              lat: latitude,
              lng: longitude,
              markedAt: new Date().toISOString()
            })
          );

          setAttendance(prev => ({ ...prev, self: true }));
          setGpsStatus("VERIFIED");
          setDistanceFromSite(Math.round(distance));
        } else {
          setGpsStatus("FAILED");
          alert(`You are ${Math.round(distance)}m away from site`);
        }

        setCheckingLocation(false);
      },
      () => {
        setCheckingLocation(false);
        setGpsStatus("FAILED");
        alert("Location access denied");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };


  const materialsPending = 2;

  return (
    <div className="space-y-8">

      {/* ===== Attendance & Summary ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Attendance */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border shadow-sm flex gap-6">
          <div className="flex-1 space-y-4">
            <h3 className="text-xs font-black uppercase text-slate-400">
              Attendance Status
            </h3>

            <div className="flex gap-4">
              <button
                onClick={handleSelfCheckIn}
                disabled={attendance.self || checkingLocation}

                className={`flex-1 p-6 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all
    ${attendance.self
                    ? "bg-emerald-50 border-emerald-500 text-emerald-700 cursor-not-allowed"
                    : "bg-slate-50 border-slate-200 text-slate-400 hover:border-emerald-400"
                  }`}
              >

                <CheckCircle2 size={32} />
                <span className="text-sm font-black uppercase">
                  {checkingLocation
                    ? "Checking GPS..."
                    : attendance.self
                      ? "Checked In"
                      : "Self Check-in"}
                </span>

              </button>

              <div className="flex-1 p-6 rounded-2xl bg-[#0B3C5D] text-white flex flex-col items-center justify-center">
                <span className="text-4xl font-black">
                  {attendance.workers}
                </span>
                <span className="text-[10px] uppercase text-slate-300">
                  Workers Present
                </span>
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center gap-4">
            <div className="p-4 bg-orange-50 rounded-xl border flex gap-3">
              <AlertTriangle size={20} className="text-orange-500" />
              <p className="text-[11px] font-bold text-orange-700 uppercase">
                {attendance.self
                  ? "Attendance logged. DPR unlocked."
                  : "Mark attendance to enable DPR"}
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold">
              <Navigation
                size={14}
                className={
                  gpsStatus === "VERIFIED"
                    ? "text-emerald-600"
                    : gpsStatus === "FAILED"
                      ? "text-red-500"
                      : "text-slate-400"
                }
              />

              {checkingLocation && (
                <span className="text-slate-500">
                  Checking GPS location…
                </span>
              )}

              {!checkingLocation && gpsStatus === "VERIFIED" && (
                <span className="text-emerald-600">
                  GPS Verified • {distanceFromSite}m from site
                </span>
              )}

              {!checkingLocation && gpsStatus === "FAILED" && (
                <span className="text-red-600">
                  GPS verification failed
                </span>
              )}

              {!checkingLocation && gpsStatus === "NOT_VERIFIED" && (
                <span className="text-slate-500">
                  GPS not verified
                </span>
              )}
            </div>


          </div>
        </div>

        {/* Summary */}
        <div className="bg-white rounded-2xl p-6 border shadow-sm">
          <h3 className="text-xs font-black uppercase text-slate-400 mb-6">
            Execution Summary
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-xl border">
              <p className="text-2xl font-black text-blue-700">
                {tasks.length}
              </p>
              <p className="text-[10px] uppercase text-blue-500">
                Tasks Pending
              </p>
            </div>

            <div className="p-4 bg-amber-50 rounded-xl border">
              <p className="text-2xl font-black text-amber-700">
                {materialsPending}
              </p>
              <p className="text-[10px] uppercase text-amber-500">
                Material Requests
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Tasks & Quick Actions ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Tasks Preview */}
        <div className="bg-white rounded-2xl border shadow-sm">
          <div className="p-6 border-b flex justify-between items-center">
            <h3 className="text-sm font-black uppercase">
              Today’s Priority Tasks
            </h3>
            <span className="text-xs text-blue-600 font-bold cursor-pointer">
              View All
            </span>
          </div>

          {tasks.map(task => (
            <div
              key={task.id}
              className="p-4 flex justify-between items-center hover:bg-slate-50"
            >
              <div>
                <p className="font-bold text-slate-700">
                  {task.title}
                </p>
                <p className="text-[10px] uppercase text-slate-400">
                  {task.priority} Priority
                </p>
              </div>
              <ChevronRight size={16} className="text-slate-300" />
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">

          {/* DPR */}
          <div className="bg-gradient-to-br from-[#0B3C5D] to-[#07243b] rounded-2xl p-8 text-white">
            <h3 className="text-xl font-black uppercase">
              Daily Site Progress
            </h3>
            <p className="text-xs text-slate-300">
              Capture today’s work & photos
            </p>

            <button
              disabled={!attendance.self || checkingLocation || dprSubmitted}
  onClick={() => setDprSubmitted(true)}
              className={`mt-6 px-6 py-3 rounded-xl font-black uppercase text-sm
                ${dprSubmitted
                  ? "bg-emerald-500"
                  : "bg-orange-500 hover:bg-orange-600"
                }`}
            >
              {dprSubmitted ? "DPR Submitted" : "Start DPR"}
            </button>
          </div>

          {/* Material Request */}
          <div className="bg-white rounded-2xl p-6 border shadow-sm">
            <h3 className="text-xs font-black uppercase text-slate-400 mb-2">
              Urgent Materials
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Raise request for cement, steel, sand, etc.
            </p>

            <button className="w-full py-4 bg-slate-100 rounded-xl font-black uppercase text-xs flex items-center justify-center gap-2">
              <Plus size={16} /> Raise Material Request
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
