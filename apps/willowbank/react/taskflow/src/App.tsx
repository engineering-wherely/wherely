type Task = {
  id: number;
  title: string;
  completed: boolean;
};

const tasks: Task[] = [
  { id: 1, title: "Learn React fundamentals", completed: false },
  { id: 2, title: "Practice TypeScript", completed: true },
];

export default function App() {
  return (
    <main>
      <h1>TaskFlow</h1>
      <p>Build better habits, one task a time.</p>

      <h2>My Tasks</h2>

      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            {task.title}
            {task.completed ? " ✓" : ""}
          </li>
        ))}
      </ul>
    </main>
  );
}
