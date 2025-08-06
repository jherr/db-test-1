import { createServerFileRoute } from "@tanstack/react-start/server";

const messages = [
  {
    id: 1,
    user: "Alice",
    text: "Hello, how are you?",
  },
  {
    id: 2,
    user: "Bob",
    text: "I'm fine, thank you!",
  },
];

let subscribers: ((message: any) => void)[] = [];
const subscribe = (fn: (message: any) => void) => {
  subscribers.push(fn);
  return () => {
    subscribers = subscribers.filter((f) => f !== fn);
  };
};

const sendMessage = (message: any) => {
  messages.push(message);
  subscribers.forEach((fn) => fn(message));
};

export const ServerRoute = createServerFileRoute("/api/chat").methods({
  GET: () => {
    const stream = new ReadableStream({
      start(controller) {
        for (const message of messages) {
          controller.enqueue(JSON.stringify(message) + "\n");
        }
        subscribe((message) => {
          controller.enqueue(JSON.stringify(message) + "\n");
        });
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "application/x-ndjson",
      },
    });
  },
  POST: async ({ request }) => {
    const { text, user } = await request.json();
    sendMessage({
      id: messages.length + 1,
      user,
      text,
    });
  },
});
