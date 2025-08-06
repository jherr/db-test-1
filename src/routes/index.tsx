import { createFileRoute } from "@tanstack/react-router";
import { createCollection, useLiveQuery } from "@tanstack/react-db";
import { createLiveQueryCollection } from "@tanstack/db";
import { z } from "zod";

const todosCollection = createCollection({
  getKey: (todo) => todo.id,
  schema: z.object({
    id: z.number(),
    text: z.string(),
    finished: z.boolean(),
  }),
  startSync: true,
  sync: {
    sync: ({}) => {},
  },
  onInsert: (data) => Promise.resolve(data),
});

todosCollection.insert(
  {
    id: 10,
    text: "foo",
    finished: false,
  },
  {
    optimistic: true,
  }
);

todosCollection.startSyncImmediate();

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  const { data } = useLiveQuery(
    createLiveQueryCollection((q) =>
      q.from({ todo: todosCollection }).select(({ todo }) => ({
        ...todo,
      }))
    )
  );

  return <div>{JSON.stringify(data, null, 2)}</div>;
}
