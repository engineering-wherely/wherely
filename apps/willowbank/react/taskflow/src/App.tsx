import { startTransition, useState, ViewTransition } from "react";

type Task = {
  id: number;
  title: string;
};

export function TaskPreview({ task }: { task: Task }) {
  const [open, setOpen] = useState(false);

  function toggleDetails() {
    startTransition(() => {
      setOpen((current) => !current);
    });
  }

  return (
    <>
      <button onClick={toggleDetails}>
        {open ? "Hide Details" : "Show Details"}
      </button>

      {open && (
        <ViewTransition enter="auto" exit="auto">
          <article>
            <h2>{task.title}</h2>
            <p>Task details appear here.</p>
          </article>
        </ViewTransition>
      )}

      {/* {open && (
        <article>
          <h2>{task.title}</h2>
          <p>Task details appear here.</p>
        </article>
      )} */}
    </>
  );
}

export default function App() {
  return <TaskPreview task={{ id: 1, title: "Learn React 19 features" }} />;
}
