import { useState } from "react";

export function TaskForm() {
  const [title, setTitle] = useState("");

  return (
    <form>
      <label htmlFor="title">Task title</label>

      <input
        id="title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />

      <p>{title}</p>
    </form>
  );
}
