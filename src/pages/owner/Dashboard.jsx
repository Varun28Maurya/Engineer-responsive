import projects from "../../data/projects.json";

export default function OwnerDashboard() {
  const user = JSON.parse(localStorage.getItem("authUser"));

  const ownerProjects = projects.filter(
    (project) => project.ownerId === user.id
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">
        My Projects
      </h1>

      {ownerProjects.length === 0 && (
        <p className="text-gray-500">No projects found</p>
      )}

      <div className="grid gap-4">
        {ownerProjects.map((project) => (
          <div
            key={project.id}
            className="bg-white p-4 rounded-xl border shadow-sm"
          >
            <h2 className="font-bold">{project.name}</h2>
            <p className="text-sm text-gray-500">
              Project ID: {project.id}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
