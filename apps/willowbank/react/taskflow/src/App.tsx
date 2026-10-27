import { useState } from "react";

export default function TaskForm() {
  const [title, setTitle] = useState("");

  return (
    <form>
      <label htmlFor="title">Task title</label>
      <input
        id="title"
        name="title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />
      <p>{title.length} characters</p>
    </form>
  );
}
