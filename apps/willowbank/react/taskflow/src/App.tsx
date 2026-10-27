import { useOptimistic } from "react";
import { useFormStatus } from "react-dom";
import { useState } from "react";

type Task = {
  id: number;
  title: string;
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? "Adding..." : "Add Task"}
    </button>
  );
}

async function saveTask(title: string) {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  console.log(`Saved: ${title}`);
}

function TaskList({ tasks }: { tasks: Task[] }) {
  const [optimisticTasks, addOptimisticTask] = useOptimistic(
    tasks,
    (current, newTask: Task) => [...current, newTask],
  );

  async function addTaskAction(formData: FormData) {
    const title = String(formData.get("title") ?? "").trim();

    if (!title) {
      return;
    }

    addOptimisticTask({ id: Date.now(), title });

    await saveTask(title);
  }

  return (
    <>
      <form action={addTaskAction}>
        <input name="title" required placeholder="New task" />
        <SubmitButton />
        <ul>
          {optimisticTasks.map((task) => (
            <li key={task.id}>{task.title}</li>
          ))}
        </ul>
      </form>
    </>
  );
}

export default function App() {
  const [tasks] = useState<Task[]>([
    {
      id: 1,
      title: "Learn React 19 form",
    },
  ]);

  return <TaskList tasks={tasks} />;
}
