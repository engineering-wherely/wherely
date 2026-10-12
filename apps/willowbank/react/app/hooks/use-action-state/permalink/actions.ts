"use server";

export async function submitComment(
  previousState: { message: string; submissions: number },
  formData: FormData,
) {
  const comment = formData.get("comment");
  const submissions = previousState.submissions + 1;

  if (typeof comment !== "string" || comment.trim() === "") {
    return { message: "Please enter a comment.", submissions };
  }

  // This learning demo returns feedback without storing any data.
  return { message: `Server received: ${comment.trim()}`, submissions };
}
