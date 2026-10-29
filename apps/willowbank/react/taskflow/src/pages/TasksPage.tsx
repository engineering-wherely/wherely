import { useEffect, useState } from "react";
import {
  createTask,
  deleteTask,
  fetchTasks,
  updateTask,
} from "../features/tasks/taskApi";
import { TaskForm } from "../features/tasks/TaskForm";
import { TaskList } from "../features/tasks/TaskList";
import type { NewTaskInput, Task } from "../features/tasks/taskTypes";

type LoadStatus = "loading" | "success" | "error";

export function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);

  const [status, setStatus] = useState<LoadStatus>("loading");

  useEffect(() => {
    let ignore = false;

    async function loadTasks() {
      try {
        const data = await fetchTasks();
        if (!ignore) {
          setTasks(data);
          setStatus("success");
        }
      } catch {
        if (!ignore) {
          setStatus("error");
        }
      }
    }

    loadTasks();

    return () => {
      ignore = true;
    };
  }, []);

  async function handleCreate(input: NewTaskInput) {
    const created = await createTask(input);
    setTasks((current) => [...current, created]);
  }

  async function handleToggle(task: Task) {
    const updated = await updateTask(task.id, {
      completed: !task.completed,
    });

    setTasks((current) =>
      current.map((item) => (item.id === updated.id ? updated : item)),
    );
  }

  async function handleDelete(id: number) {
    await deleteTask(id);

    setTasks((current) => current.filter((task) => task.id !== id));
  }

  if (status === "loading") {
    return <p>Loading tasks...</p>;
  }

  if (status === "error") {
    return <p>Unable to load tasks.</p>;
  }

  return (
    <>
      <h1>Tasks</h1>
      <TaskForm onCreate={handleCreate} />
      <TaskList tasks={tasks} onToggle={handleToggle} onDelete={handleDelete} />
    </>
  );
}
