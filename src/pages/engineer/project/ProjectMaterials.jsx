import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import materialSeed from "@/data/materials.json";
import projects from "@/data/projects.json";

const statusColor = {
  PENDING: "bg-yellow-100 text-yellow-700",
  APPROVED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
};

export default function EngineerMaterials() {
  const { projectId } = useParams();
  const authUser = JSON.parse(localStorage.getItem("authUser"));

  const [filter, setFilter] = useState("ALL");
  const [materials, setMaterials] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    materialName: "",
    quantity: "",
    unit: "",
    remarks: "",
  });

  // 🔥 auto project resolve
  const project = projects.find(p => p.id === projectId);

  // ---------- PROJECT MATERIALS ----------
  const projectMaterials = materials.filter(
    m => m.projectId === projectId
  );

  // ---------- STATUS FILTER ----------
  const filteredProjectMaterials = projectMaterials.filter(item => {
    if (filter === "ALL") return true;
    return item.status === filter;
  });


  // ---------- LOAD ----------
  useEffect(() => {
    const stored = localStorage.getItem("materials");
    if (stored) {
      setMaterials(JSON.parse(stored));
    } else {
      localStorage.setItem("materials", JSON.stringify(materialSeed));
      setMaterials(materialSeed);
    }
  }, []);

  // ---------- SAVE ----------
  const saveData = (data) => {
    setMaterials(data);
    localStorage.setItem("materials", JSON.stringify(data));
  };

  // ---------- SUBMIT ----------
  const handleSubmit = () => {
    if (!form.materialName || !form.quantity || !form.unit) {
      alert("Please fill all required fields");
      return;
    }

    const newRequest = {
      id: `mt-${Date.now()}`,
      projectId: project.id,
      projectName: project.name,

      materialId: `mat-${Date.now()}`,
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
          <h1 className="text-2xl font-semibold">Materials</h1>
          <p className="text-sm text-gray-500">
            Project: {project?.name}
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 rounded-md bg-blue-600 text-white"
        >
          + Add Request
        </button>
      </div>

      {/* FORM */}
      {showForm && (
        <div className="rounded-xl border bg-white p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
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
        {filteredProjectMaterials.map(item => (
          <div
            key={item.id}
            className="rounded-xl border bg-white p-4 shadow-sm"
          >
            <div className="flex justify-between items-start">
              <h3 className="font-medium">{item.materialName}</h3>

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

        {filteredProjectMaterials.length === 0 && (
          <p className="text-sm text-gray-500">
            No material requests yet
          </p>
        )}
      </div>
    </div>
  );
}
