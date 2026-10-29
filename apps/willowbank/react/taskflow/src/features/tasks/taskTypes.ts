export type TaskPriority = "low" | "medium" | "high";

export type Task = {
  id: number;
  title: string;
  completed: boolean;
  priority: TaskPriority;
};

export type NewTaskInput = {
  title: string;
  priority: TaskPriority;
};

export type TaskUpdate = {
  title?: string;
  completed?: boolean;
  priority?: TaskPriority;
};
