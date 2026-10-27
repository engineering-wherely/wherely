import { useReducer } from "react";

type Task = {
  id: number;
  title: string;
  completed: boolean;
};

type TaskAction =
  | {
      type: "added";
      task: Task;
    }
  | {
      type: "toggled";
      id: number;
    }
  | {
      type: "deleted";
      id: number;
    };

function tasksReducer(tasks: Task[], action: TaskAction): Task[] {
  switch (action.type) {
    case "added":
      return [...tasks, action.task];
    case "toggled":
      return tasks.map((task) =>
        task.id === action.id ? { ...task, completed: !task.completed } : task,
      );
    case "deleted":
      return tasks.filter((task) => task.id !== action.id);
  }
}

const initialTasks: Task[] = [
  {
    id: 1,
    title: "Learn useReducer",
    completed: false,
  },
];

export default function App() {
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);

  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          <button onClick={() => dispatch({ type: "toggled", id: task.id })}>
            {task.completed ? "✓ " : ""}
            {task.title}
          </button>
        </li>
      ))}
    </ul>
  );
}
