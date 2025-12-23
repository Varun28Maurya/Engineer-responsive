import { useState } from "react";
import tasksData from "@/data/tasks.json";

const priorityColor = {
  HIGH: "bg-red-100 text-red-700",
  MEDIUM: "bg-yellow-100 text-yellow-700",
  LOW: "bg-green-100 text-green-700",
};

export default function EngineerTasks() {
  const authUser = JSON.parse(localStorage.getItem("authUser"));
  const engineerId = authUser?.id;

  const [filter, setFilter] = useState("ALL");
  const [tasks, setTasks] = useState(
    tasksData.filter(t => t.assignedTo === engineerId)
  );

  // ---- FILTER LOGIC ----
  const filteredTasks = tasks.filter(task => {
    if (filter === "ALL") return true;
    if (filter === "PENDING") return task.status === "PENDING";
    if (filter === "COMPLETED") return task.status === "COMPLETED";
    if (filter === "TODAY") {
      const today = new Date().toISOString().split("T")[0];
      return task.dueDate === today;
    }
    return true;
  });

  // ---- GROUP BY PROJECT ----
  const groupedTasks = filteredTasks.reduce((acc, task) => {
    acc[task.projectName] = acc[task.projectName] || [];
    acc[task.projectName].push(task);
    return acc;
  }, {});

  // ---- ACTION ----
  const markDone = (taskId) => {
    setTasks(tasks.map(t =>
      t.id === taskId ? { ...t, status: "COMPLETED" } : t
    ));
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold">My Tasks</h1>
        <p className="text-sm text-gray-500">
          Tasks across all assigned projects
        </p>
      </div>

      {/* FILTER TABS */}
      <div className="flex gap-2">
        {["ALL", "TODAY", "PENDING", "COMPLETED"].map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3 py-1 text-sm rounded-full border
              ${filter === tab
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* TASKS BY PROJECT */}
      {Object.keys(groupedTasks).length === 0 && (
        <p className="text-gray-500 text-sm">No tasks found</p>
      )}

      <div className="space-y-8">
        {Object.entries(groupedTasks).map(([projectName, projectTasks]) => (
          <div key={projectName} className="space-y-3">

            {/* PROJECT TITLE */}
            <h2 className="text-sm font-semibold text-gray-600 uppercase">
              Project: {projectName}
            </h2>

            {/* TASK CARDS */}
            {projectTasks.map(task => (
              <div
                key={task.id}
                className="rounded-xl border bg-white p-4 shadow-sm"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">
                      {task.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Due: {task.dueDate}
                    </p>
                  </div>

                  <span
                    className={`text-xs px-2 py-1 rounded-full ${priorityColor[task.priority]}`}
                  >
                    {task.priority}
                  </span>
                </div>

                <div className="mt-3 flex justify-between items-center">
                  <span className="text-sm text-blue-600">
                    ● {task.status.replace("_", " ")}
                  </span>

                  {task.status !== "COMPLETED" && (
                    <button
                      onClick={() => markDone(task.id)}
                      className="text-sm px-3 py-1 rounded-md bg-green-600 text-white hover:bg-green-700"
                    >
                      Mark Done
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
