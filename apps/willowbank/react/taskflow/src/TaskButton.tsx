type TaskButtonProps = {
  completed: boolean;
  onToggle: () => void;
};

export function TaskButton({ completed, onToggle }: TaskButtonProps) {
  return (
    <button type="button" onClick={onToggle}>
      {completed ? "Mark Incomplete" : "Complete Task"}
    </button>
  );
}
