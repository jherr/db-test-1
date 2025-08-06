import { useEffect, useRef } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useLiveQuery } from "@tanstack/react-db";
import { createLiveQueryCollection } from "@tanstack/db";

import { todosCollection } from "@/collections";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  const loadedRef = useRef(false);
  useEffect(() => {
    const fetchData = async () => {
      if (loadedRef.current) return;
      loadedRef.current = true;

      const response = await fetch("/api/demo-names");
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
          todosCollection.insert(JSON.parse(chunk));
        }
      }
    };
    fetchData();
  }, []);

  const { data } = useLiveQuery((q) =>
    q.from({ todo: todosCollection }).select(({ todo }) => ({
      ...todo,
    }))
  );

  return <div>{JSON.stringify(data, null, 2)}</div>;
}
