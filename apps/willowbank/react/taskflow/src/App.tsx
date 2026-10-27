import { useActionState } from "react";

type FormState = {
  message: string;
  success: boolean;
};

const initialState: FormState = {
  message: "",
  success: false,
};

async function createTask(
  _previousState: FormState,
  formData: FormData,
): Promise<FormState> {
  const title = String(formData.get("title") ?? "").trim();

  if (title.length < 3) {
    return {
      message: "Enter at least 3 characters",
      success: false,
    };
  }

  await new Promise((resolve) => setTimeout(resolve, 500));

  return {
    message: `Created: ${title}`,
    success: true,
  };
}

export default function TaskForm() {
  const [state, formAction, isPending] = useActionState(
    createTask,
    initialState,
  );

  return (
    <form action={formAction}>
      <label htmlFor="title">Task title</label>

      <input id="title" name="title" required minLength={3} />

      <button type="submit" disabled={isPending}>
        {isPending ? "Adding..." : "Add Task"}
      </button>

      {state.message && <p aria-live="polite">{state.message}</p>}
    </form>
  );
}
