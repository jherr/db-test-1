import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useLiveQuery } from "@tanstack/react-db";

import { messagesCollection } from "@/collections";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  const loadedRef = useRef(false);
  useEffect(() => {
    const fetchData = async () => {
      if (loadedRef.current) return;
      loadedRef.current = true;

      const response = await fetch("/api/chat");
      const reader = response.body?.getReader();
      if (!reader) {
        return;
      }

      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        for (const chunk of decoder
          .decode(value, { stream: true })
          .split("\n")
          .filter((chunk) => chunk.length > 0)) {
          messagesCollection.insert(JSON.parse(chunk));
        }
      }
    };
    fetchData();
  }, []);

  const { data } = useLiveQuery((q) =>
    q.from({ message: messagesCollection }).select(({ message }) => ({
      ...message,
    }))
  );

  const [message, setMessage] = useState("");
  const [user, setUser] = useState("Alice");

  return (
    <div>
      <div>{JSON.stringify(data, null, 2)}</div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <select value={user} onChange={(e) => setUser(e.target.value)}>
        <option value="Alice">Alice</option>
        <option value="Bob">Bob</option>
      </select>
      <button
        onClick={() => {
          fetch("/api/chat", {
            method: "POST",
            body: JSON.stringify({ text: message, user }),
          });
          setMessage("");
        }}
      >
        Send
      </button>
    </div>
  );
}
