import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { Camera, Paperclip, Phone, Video, Send } from "lucide-react";
import projects from "@/data/projects.json";
import chatSeed from "@/data/chatMessages.json";

export default function ProjectChat() {
  const { projectId } = useParams();
  const authUser = JSON.parse(localStorage.getItem("authUser"));
  const messagesEndRef = useRef(null);

  const project = projects.find(p => p.id === projectId);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  // ---------- LOAD ----------
  useEffect(() => {
    const stored = localStorage.getItem("chatMessages");
    if (stored) {
      setMessages(JSON.parse(stored));
    } else {
      localStorage.setItem(
        "chatMessages",
        JSON.stringify(chatSeed)
      );
      setMessages(chatSeed);
    }
  }, []);

  // ---------- AUTO SCROLL ----------
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ---------- FILTER PROJECT MESSAGES ----------
  const projectMessages = messages.filter(
    m => m.projectId === projectId
  );

  // ---------- SEND ----------
  const sendMessage = () => {
    if (!input.trim()) return;

    const newMessage = {
      id: `msg-${Date.now()}`,
      projectId: project.id,
      projectName: project.name,

      sender: {
        id: authUser.id,
        role: authUser.role,
        name: authUser.name || "Engineer",
      },
      receiver: {
        id: project.ownerId || "owner-1",
        role: "OWNER",
        name: "Project Owner",
      },

      message: input,
      type: "TEXT",
      createdAt: new Date().toISOString(),
      status: "SENT",
    };

    const updated = [...messages, newMessage];
    setMessages(updated);
    localStorage.setItem("chatMessages", JSON.stringify(updated));
    setInput("");
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-xl border overflow-hidden">

      {/* HEADER */}
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center font-bold text-orange-600">
            {project?.name?.charAt(0)}
          </div>
          <div>
            <p className="font-semibold">
              {project?.name} – Site Chat
            </p>
            <p className="text-xs text-green-600">
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
      <div className="h-[calc(75vh-64px)] flex flex-col bg-white rounded-xl border overflow-hidden">


        {projectMessages.map(msg => {
          const isMe = msg.sender.id === authUser.id;

          return (
            <div
              key={msg.id}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] px-4 py-3 rounded-xl shadow
                  ${
                    isMe
                      ? "bg-blue-900 text-white rounded-br-none"
                      : "bg-white text-gray-800 rounded-bl-none"
                  }`}
              >
                {!isMe && (
                  <p className="text-sm font-semibold text-orange-600">
                    {msg.sender.name}
                  </p>
                )}
                <p className="text-sm mt-1">{msg.message}</p>
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

        <div ref={messagesEndRef} />
      </div>

      {/* INPUT */}
      <div className="px-4 py-3 border-t flex items-center gap-3">
        <Camera className="text-orange-600 cursor-pointer" />
        <Paperclip className="text-orange-600 cursor-pointer" />

        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
          placeholder="Type message..."
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
  );
}
