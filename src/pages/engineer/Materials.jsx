import { useEffect, useState } from "react";
import projects from "@/data/projects.json";

const statusColor = {
  PENDING: "bg-yellow-100 text-yellow-700",
  APPROVED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
};

export default function EngineerMaterials() {
  const [filter, setFilter] = useState("ALL");

  const authUser = JSON.parse(localStorage.getItem("authUser"));
  const engineerId = authUser?.id;

  const [materials, setMaterials] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    projectId: "",
    materialName: "",
    quantity: "",
    unit: "",
    remarks: "",
  });

  // only engineer-assigned projects
  const myProjects = projects.filter(
    p => p.engineerId === engineerId
  );

  // ✅ FILTER AFTER materials exists
  const filteredMaterials = materials.filter(item => {
    if (filter === "ALL") return true;
    return item.status === filter;
  });

  // ---------- LOAD FROM localStorage ----------
  useEffect(() => {
    const stored = localStorage.getItem("materials");
    if (stored) {
      setMaterials(JSON.parse(stored));
    }
  }, []);

  // ---------- SAVE ----------
  const saveData = (data) => {
    setMaterials(data);
    localStorage.setItem("materials", JSON.stringify(data));
  };

  // ---------- SUBMIT ----------
  const handleSubmit = () => {
    if (!form.projectId || !form.materialName || !form.quantity || !form.unit) {
      alert("Please fill all required fields");
      return;
    }

    const project = myProjects.find(p => p.id === form.projectId);

    const newRequest = {
      id: `mt-${Date.now()}`,
      projectId: project.id,
      projectName: project.name,

      materialName: form.materialName,
      quantity: Number(form.quantity),
      unit: form.unit,

      sender: {
        id: authUser.id,
        role: authUser.role,
        name: authUser.name || "Site Engineer",
      },
      receiver: {
        id: project.ownerId || "owner-1",
        role: "OWNER",
        name: "Project Owner",
      },

      status: "PENDING",
      requestedOn: new Date().toISOString().split("T")[0],
      remarks: form.remarks,
    };

    const updated = [newRequest, ...materials];
    saveData(updated);

    setForm({
      projectId: "",
      materialName: "",
      quantity: "",
      unit: "",
      remarks: "",
    });

    setShowForm(false);
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Material Requests</h1>
          <p className="text-sm text-gray-500">
            Create and track material requests
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          + Add Request
        </button>
      </div>

      {/* FORM */}
      {showForm && (
        <div className="rounded-xl border bg-white p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">

            {/* PROJECT SELECT */}
            <select
              className="border p-2 rounded col-span-2"
              value={form.projectId}
              onChange={e =>
                setForm({ ...form, projectId: e.target.value })
              }
            >
              <option value="">Select Project</option>
              {myProjects.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.id})
                </option>
              ))}
            </select>

            <input
              placeholder="Material Name"
              className="border p-2 rounded"
              value={form.materialName}
              onChange={e =>
                setForm({ ...form, materialName: e.target.value })
              }
            />

            <input
              placeholder="Quantity"
              type="number"
              className="border p-2 rounded"
              value={form.quantity}
              onChange={e =>
                setForm({ ...form, quantity: e.target.value })
              }
            />

            <input
              placeholder="Unit (Bags / Kg / Ton)"
              className="border p-2 rounded col-span-2"
              value={form.unit}
              onChange={e =>
                setForm({ ...form, unit: e.target.value })
              }
            />
          </div>

          <textarea
            placeholder="Remarks (optional)"
            className="border p-2 rounded w-full"
            value={form.remarks}
            onChange={e =>
              setForm({ ...form, remarks: e.target.value })
            }
          />

          <div className="flex gap-2">
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              Submit
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
      {/* FILTER TABS */}
<div className="flex gap-2">
  {["ALL", "PENDING", "APPROVED", "REJECTED"].map(tab => (
    <button
      key={tab}
      onClick={() => setFilter(tab)}
      className={`px-3 py-1 text-sm rounded-full border transition
        ${
          filter === tab
            ? "bg-blue-600 text-white"
            : "bg-white text-gray-600 hover:bg-gray-100"
        }
      `}
    >
      {tab}
    </button>
  ))}
</div>


      {/* LIST */}
      <div className="space-y-4">
  {filteredMaterials.map(item => (
    <div
      key={item.id}
      className="rounded-xl border bg-white p-4 shadow-sm"
    >
      <div className="flex justify-between">
        <div>
          <h3 className="font-medium">{item.materialName}</h3>
          <p className="text-sm text-gray-500">
            Project: {item.projectName}
          </p>
        </div>

        <span
          className={`text-xs px-2 py-1 rounded-full ${statusColor[item.status]}`}
        >
          {item.status}
        </span>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-4 text-sm text-gray-600">
        <div><b>Qty:</b> {item.quantity} {item.unit}</div>
        <div><b>Date:</b> {item.requestedOn}</div>
        <div><b>From:</b> {item.sender.name}</div>
        <div><b>To:</b> {item.receiver.name}</div>
      </div>

      {item.remarks && (
        <div className="mt-3 text-sm text-gray-500 italic">
          “{item.remarks}”
        </div>
      )}
    </div>
  ))}

  {filteredMaterials.length === 0 && (
    <p className="text-sm text-gray-500">
      No material requests found
    </p>
  )}
</div>
      </div>
  );
}
