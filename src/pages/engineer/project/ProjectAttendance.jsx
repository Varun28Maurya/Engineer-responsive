import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function ProjectAttendance() {
  const { projectId } = useParams();
  const authUser = JSON.parse(localStorage.getItem("authUser"));

  const today = new Date().toISOString().split("T")[0];

  const [date, setDate] = useState(today);
  const [attendance, setAttendance] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    workerName: "",
    role: "",
    wagePerDay: "",
  });

  // ---------- LOAD ----------
  useEffect(() => {
    const stored = localStorage.getItem("attendance");
    if (stored) {
      setAttendance(JSON.parse(stored));
    }
  }, []);

  // ---------- SAVE ----------
  const saveData = (data) => {
    setAttendance(data);
    localStorage.setItem("attendance", JSON.stringify(data));
  };

  // ---------- ADD WORKER ----------
  const addAttendance = () => {
    if (!form.workerName || !form.role || !form.wagePerDay) {
      alert("Please fill all fields");
      return;
    }

    const newEntry = {
      id: `att-${Date.now()}`,
      projectId,
      date,

      workerName: form.workerName,
      role: form.role,
      wagePerDay: Number(form.wagePerDay),

      status: "PRESENT",
      markedBy: authUser.id,
      markedAt: new Date().toISOString(),
    };

    saveData([newEntry, ...attendance]);

    setForm({
      workerName: "",
      role: "",
      wagePerDay: "",
    });

    setShowForm(false);
  };

  // ---------- FILTER FOR DAY ----------
  const todaysAttendance = attendance.filter(
    a => a.projectId === projectId && a.date === date
  );

  // ---------- TOTAL WAGES ----------
  const totalWages = todaysAttendance.reduce(
    (sum, w) => sum + w.wagePerDay,
    0
  );

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Attendance</h1>
          <p className="text-sm text-gray-500">
            Daily labour attendance & wages
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          + Add Worker
        </button>
      </div>

      {/* DATE SELECT */}
      <div className="flex items-center gap-3">
        <label className="text-sm font-medium">Date:</label>
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="border p-2 rounded"
        />
      </div>

      {/* FORM */}
      {showForm && (
        <div className="rounded-xl border bg-white p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <input
              placeholder="Worker Name"
              className="border p-2 rounded"
              value={form.workerName}
              onChange={e =>
                setForm({ ...form, workerName: e.target.value })
              }
            />
            <input
              placeholder="Role (Mason / Helper)"
              className="border p-2 rounded"
              value={form.role}
              onChange={e =>
                setForm({ ...form, role: e.target.value })
              }
            />
            <input
              placeholder="Wage per Day (₹)"
              type="number"
              className="border p-2 rounded col-span-2"
              value={form.wagePerDay}
              onChange={e =>
                setForm({ ...form, wagePerDay: e.target.value })
              }
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={addAttendance}
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              Mark Present
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2 bg-gray-200 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* LIST */}
      <div className="space-y-4">
        {todaysAttendance.map(w => (
          <div
            key={w.id}
            className="rounded-xl border bg-white p-4 flex justify-between items-center"
          >
            <div>
              <h3 className="font-medium">{w.workerName}</h3>
              <p className="text-sm text-gray-500">
                {w.role} • ₹{w.wagePerDay}/day
              </p>
            </div>

            <span className="text-green-600 font-semibold">
              PRESENT
            </span>
          </div>
        ))}

        {todaysAttendance.length === 0 && (
          <p className="text-sm text-gray-500">
            No workers marked for this day
          </p>
        )}
      </div>

      {/* SUMMARY */}
      <div className="rounded-xl bg-gray-50 p-4">
        <p className="text-sm text-gray-600">
          Total Workers: <b>{todaysAttendance.length}</b>
        </p>
        <p className="text-sm text-gray-600">
          Total Wages: <b>₹{totalWages}</b>
        </p>
      </div>
    </div>
  );
}
