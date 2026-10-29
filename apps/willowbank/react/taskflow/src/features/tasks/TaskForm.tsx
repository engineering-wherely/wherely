import { useState, type FormEvent } from "react";
import type { NewTaskInput, TaskPriority } from "./taskTypes";

type TaskFormProps = {
  onCreate: (input: NewTaskInput) => Promise<void>;
};

export function TaskForm({ onCreate }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");

  const [error, setError] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanTitle = title.trim();
    if (cleanTitle.length < 3) {
      setError("Task title must contain at least 3 characters.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      await onCreate({ title: cleanTitle, priority });

      setTitle("");
      setPriority("medium");
    } catch {
      setError("Unable to create the task.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="task-title">Task title</label>

      <input
        id="task-title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? "task-error" : undefined}
      />

      <label htmlFor="task-priority">Priority</label>

      <select
        id="task-priority"
        value={priority}
        onChange={(event) => setPriority(event.target.value as TaskPriority)}
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>

      {error && (
        <p id="task-error" role="alert">
          {error}
        </p>
      )}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Adding..." : "Add Task"}
      </button>
    </form>
  );
}
