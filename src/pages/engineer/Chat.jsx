import { useState, useEffect } from "react";
import { Camera, Paperclip, Phone, Video, Send } from "lucide-react";
import chatMessages from "@/data/chatMessages.json";

export default function EngineerChat() {
  const authUser = JSON.parse(localStorage.getItem("authUser"));

  const [messagesData, setMessagesData] = useState([]);
  const [input, setInput] = useState("");
  const [activeProject, setActiveProject] = useState("proj-1");
  useEffect(() => {
  const stored = localStorage.getItem("chatMessages");
  if (stored) {
    setMessagesData(JSON.parse(stored));
  } else {
    localStorage.setItem(
      "chatMessages",
      JSON.stringify(chatMessages)
    );
    setMessagesData(chatMessages);
  }
}, []);


  // Group chats by project (left panel)
  const projects = Object.values(
  messagesData.reduce((acc, msg) => {
    if (
      !acc[msg.projectId] ||
      new Date(msg.createdAt) > new Date(acc[msg.projectId].createdAt)
    ) {
      acc[msg.projectId] = msg; // keep latest msg per project
    }
    return acc;
  }, {})
);


  const messages = messagesData.filter(
  m => m.projectId === activeProject
);
const sendMessage = () => {
  if (!input.trim()) return;

  const newMessage = {
    id: `msg-${Date.now()}`,
    projectId: activeProject,
    projectName: messages[0]?.projectName || "Project",

    sender: {
      id: authUser.id,
      role: authUser.role,
      name: authUser.name || "Engineer",
    },
    receiver: {
      id: messages[0]?.sender.id || "owner-1",
      role: "OWNER",
      name: "Project Owner",
    },

    message: input,
    type: "TEXT",
    createdAt: new Date().toISOString(),
    status: "SENT",
  };

  const updated = [...messagesData, newMessage];
  setMessagesData(updated);
  localStorage.setItem("chatMessages", JSON.stringify(updated));

  setInput("");
};



  return (
    <div className="h-full flex bg-white rounded-xl border overflow-hidden">

      {/* LEFT: PROJECT CHAT LIST */}
      <div className="w-72 border-r bg-gray-50">
        <div className="p-4 font-semibold text-gray-700">
          Project Chats
        </div>

        {projects.map(p => (
          <div
            key={p.projectId}
            onClick={() => setActiveProject(p.projectId)}
            className={`px-4 py-3 cursor-pointer border-b hover:bg-orange-50
              ${activeProject === p.projectId
                ? "bg-orange-100"
                : ""
              }`}
          >
            <p className="font-medium">{p.projectName}</p>
            <p className="text-sm text-gray-500 truncate">
              {p.message}
            </p>
          </div>
        ))}
      </div>

      {/* RIGHT: CHAT AREA */}
      <div className="flex-1 flex flex-col">

        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center font-bold text-orange-600">
              AM
            </div>
            <div>
              <p className="font-semibold">
                Skyline Residency Site Chat
              </p>
              <p className="text-xs text-green-600 flex items-center gap-1">
                ● ONLINE
              </p>
            </div>
          </div>

          <div className="flex gap-4 text-orange-600">
            <Phone className="cursor-pointer" />
            <Video className="cursor-pointer" />
          </div>
        </div>

        {/* MESSAGES */}
        <div className="flex-1 p-6 overflow-y-auto bg-gray-50 space-y-4">
          {messages.map(msg => {
            const isMe = msg.sender.id === authUser.id;

            return (
              <div
                key={msg.id}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] px-4 py-3 rounded-xl shadow
                    ${isMe
                      ? "bg-blue-900 text-white rounded-br-none"
                      : "bg-white text-gray-800 rounded-bl-none"
                    }`}
                >
                  {!isMe && (
                    <p className="text-sm font-semibold text-orange-600">
                      {msg.sender.name}
                    </p>
                  )}
                  <p className="text-sm mt-1">
                    {msg.message}
                  </p>
                  <p className="text-xs text-right opacity-70 mt-2">
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* INPUT */}
        <div className="px-4 py-3 border-t flex items-center gap-3">
          <Camera className="text-orange-600 cursor-pointer" />
          <Paperclip className="text-orange-600 cursor-pointer" />

          <input
  value={input}
  onChange={e => setInput(e.target.value)}
  onKeyDown={e => e.key === "Enter" && sendMessage()}
  placeholder="Type message to site engineer..."
  className="flex-1 border rounded-full px-4 py-2 text-sm"
/>


          <button
  onClick={sendMessage}
  className="bg-orange-600 text-white p-2 rounded-full"
>
  <Send size={16} />
</button>

        </div>
      </div>
    </div>
  );
}
