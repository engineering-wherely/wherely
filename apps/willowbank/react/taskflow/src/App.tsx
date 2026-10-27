import { useState } from "react";

export default function TaskForm() {
  const [title, setTitle] = useState("");

  const remaining = 80 - title.length;
  const canSubmit = title.trim().length >= 3 && remaining >= 0;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSubmit) {
      return;
    }

    console.log("Creating task:", title.trim());
    setTitle("");
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="task-title">Task title</label>

      <input
        id="task-title"
        name="title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        required
      />

      <p>{remaining} characters remaining</p>

      <button type="submit" disabled={!canSubmit}>
        Add Task
      </button>
    </form>
  );
}
