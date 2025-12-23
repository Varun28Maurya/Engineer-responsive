import { useState } from "react";
import { useParams } from "react-router-dom";
import tasksData from "@/data/tasks.json";

const priorityColor = {
  HIGH: "bg-red-100 text-red-700",
  MEDIUM: "bg-yellow-100 text-yellow-700",
  LOW: "bg-green-100 text-green-700",
};

export default function ProjectTasks() {
  const { projectId } = useParams();

  // only tasks of THIS project
  const [tasks, setTasks] = useState(
    tasksData.filter(task => task.projectId === projectId)
  );

  const markDone = (taskId) => {
    setTasks(tasks.map(t =>
      t.id === taskId ? { ...t, status: "COMPLETED" } : t
    ));
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold">Project Tasks</h1>
        <p className="text-sm text-gray-500">
          Tasks for this project only
        </p>
      </div>

      {/* TASK LIST */}
      {tasks.length === 0 && (
        <p className="text-gray-500 text-sm">
          No tasks for this project
        </p>
      )}

      <div className="space-y-4">
        {tasks.map(task => (
          <div
            key={task.id}
            className="rounded-xl border bg-white p-4 shadow-sm"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{task.title}</h3>
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
    </div>
  );
}
