import { appConfig } from "../../config/appConfig";
import type { NewTaskInput, Task, TaskUpdate } from "./taskTypes";

const TASKS_URL = `${appConfig.apiUrl}/tasks`;

async function ensureSuccess(response: Response) {
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
}

export async function fetchTasks(): Promise<Task[]> {
  const response = await fetch(TASKS_URL);
  await ensureSuccess(response);
  return response.json();
}

export async function createTask(input: NewTaskInput): Promise<Task> {
  const response = await fetch(TASKS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });
  await ensureSuccess(response);
  return response.json();
}

export async function updateTask(id: number, input: TaskUpdate): Promise<Task> {
  const response = await fetch(`${TASKS_URL}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  await ensureSuccess(response);
  return response.json();
}

export async function deleteTask(id: number): Promise<void> {
  const response = await fetch(`${TASKS_URL}/${id}`, {
    method: "DELETE",
  });

  await ensureSuccess(response);
}
