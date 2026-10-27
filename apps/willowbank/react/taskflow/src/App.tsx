async function createTask(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();

  if (!title) {
    return;
  }

  console.log("Creating:", title);
}

export default function TaskForm() {
  return (
    <form action={createTask}>
      <input name="title" required />
      <button type="submit">Add Task</button>
    </form>
  );
}
