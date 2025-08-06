import { useEffect, useRef } from "react";
import { useLiveQuery, type Collection } from "@tanstack/react-db";

import { messagesCollection, type Message } from "@/collections";

function useStreamConnection(
  url: string,
  collection: Collection<any, any, any>
) {
  const loadedRef = useRef(false);

  useEffect(() => {
    const fetchData = async () => {
      if (loadedRef.current) return;
      loadedRef.current = true;

      const response = await fetch(url);
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
          collection.insert(JSON.parse(chunk));
        }
      }
    };
    fetchData();
  }, []);
}

export function useChat() {
  useStreamConnection("/api/chat", messagesCollection);

  const sendMessage = (message: string, user: string) => {
    fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({ text: message.trim(), user: user.trim() }),
    });
  };

  return { sendMessage };
}

export function useMessages() {
  const { data: messages } = useLiveQuery((q) =>
    q.from({ message: messagesCollection }).select(({ message }) => ({
      ...message,
    }))
  );

  return messages as Message[];
}
