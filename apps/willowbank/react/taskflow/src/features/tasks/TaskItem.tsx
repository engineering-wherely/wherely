import type { Task } from "./taskTypes";

type TaskItemProps = {
  task: Task;
  onToggle: (task: Task) => void;
  onDelete: (id: number) => void;
}

export function TaskItem({
  task,
  onToggle,
  onDelete
}: TaskItemProps) {
  return (
    <li className="task-item">
      <div>
        <strong>{task.title}</strong>
        <strong>{task.priority}</strong>
      </div>

      <div className="task-actions">
        <button type="button" onClick={() => onToggle(task)}>
          {task.completed ? "Mark Active" : "Complete"}
        </button>

        <button type="button" onClick={() => onDelete(task.id)}>
          Delete
        </button>
      </div>
    </li>
  )
}