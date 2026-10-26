type Priority = "low" | "medium" | "high";

type Task = {
  id: number;
  title: string;
  completed: boolean;
  priority: Priority;
};

type TaskItemProps = {
  task: Task;
  showPriority?: boolean;
};

function TaskItem({ task, showPriority = true }: TaskItemProps) {
  return (
    <li>
      <strong>{task.title}</strong>

      {task.completed && <span>✓</span>}

      {showPriority && <small> Priority: {task.priority}</small>}
    </li>
  );
}

export default function App() {
  const task: Task = {
    id: 1,
    title: "Practice typed props",
    completed: false,
    priority: "high",
  };

  return (
    <main>
      <h1>TaskFlow</h1>
      <TaskItem task={task} showPriority={false} />
    </main>
  );
}
