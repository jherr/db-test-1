import { createServerFileRoute } from "@tanstack/react-start/server";

export const ServerRoute = createServerFileRoute("/api/demo-names").methods({
  GET: () => {
    const stream = new ReadableStream({
      start(controller) {
        const names = ["Alice", "Bob", "Charlie", "David", "Eve"];
        let i = 0;
        const interval = setInterval(() => {
          if (i < names.length) {
            controller.enqueue(
              JSON.stringify({
                id: i + 1,
                text: `Talk to ${names[i]}`,
                finished: false,
              }) + "\n"
            );
            i++;
          } else {
            clearInterval(interval);
            controller.close();
          }
        }, 200);
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "application/x-ndjson",
      },
    });
  },
});
