import { useState } from "react";

import { useSearch } from "@/hooks/useChat";

import Messages from "./messages";

export default function ChatSearch() {
  const [term, setTerm] = useState("");
  const messages = useSearch(term);

  return (
    <div className="p-4">
      <input
        type="text"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder="Search"
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <div className="mt-4">
        <Messages messages={messages} user={""} />
      </div>
    </div>
  );
}
