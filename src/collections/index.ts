import {
  createCollection,
  localOnlyCollectionOptions,
} from "@tanstack/react-db";
import { z } from "zod";

export const todosCollection = createCollection(
  localOnlyCollectionOptions({
    getKey: (todo) => todo.id,
    schema: z.object({
      id: z.number(),
      text: z.string(),
      finished: z.boolean(),
    }),
  })
);

todosCollection.insert({
  id: 10,
  text: "foo",
  finished: false,
});
