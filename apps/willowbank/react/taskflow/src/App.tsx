type Task = {
  id: number;
  title: string;
  completed: boolean;
};

const tasks: Task[] = [
  { id: 1, title: "Learn components", completed: true },
  { id: 2, title: "Practice JSX", completed: false },
];

function Header() {
  return (
    <header>
      <h1>TaskFlow</h1>
      <p>Manage your tasks clearly.</p>
    </header>
  );
}

function TaskSummary() {
  const completed = tasks.filter((task) => task.completed).length;

  return (
    <p>
      Completed {completed} of {tasks.length} tasks
    </p>
  );
}

export default function App() {
  return (
    <main>
      <Header />
      <TaskSummary />
    </main>
  );
}
