import type { Task } from "./taskTypes";
import { TaskItem } from "./TaskItem";

type TaskListProps = {
  tasks: Task[];
  onToggle: (task: Task) => void;
  onDelete: (id: number) => void;
};

export function TaskList({ tasks, onToggle, onDelete }: TaskListProps) {
  if (tasks.length === 0) {
    return <p>No tasks yet.</p>;
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
