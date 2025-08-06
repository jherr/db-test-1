import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

import ChatArea from "@/components/chat-area";
import ChatSearch from "@/components/chat-search";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  const [mode, setMode] = useState("chat");

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <h1 className="text-xl font-semibold text-gray-800">Chat Room</h1>
      </div>

      <div className="flex justify-center my-4">
        <div className="inline-flex rounded-lg bg-gray-200 p-1">
          <button
            onClick={() => setMode("chat")}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${
              mode === "chat"
                ? "bg-blue-500 text-white shadow"
                : "bg-transparent text-gray-700 hover:bg-gray-300"
            }`}
          >
            Chat
          </button>
          <button
            onClick={() => setMode("search")}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${
              mode === "search"
                ? "bg-blue-500 text-white shadow"
                : "bg-transparent text-gray-700 hover:bg-gray-300"
            }`}
          >
            Search
          </button>
        </div>
      </div>

      {mode === "chat" ? <ChatArea /> : <ChatSearch />}
    </div>
  );
}
