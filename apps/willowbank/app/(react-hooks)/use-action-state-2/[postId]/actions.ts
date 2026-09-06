"use server";

export type CommentState = {
  error?: string;
  message?: string;
};

export async function createComment(
  previousState: CommentState,
  formData: FormData,
): Promise<CommentState> {
  const postId = String(formData.get("postId"));
  const text = String(formData.get("text") ?? "");

  if (!text.trim()) {
    return { error: "Comment can not be empty." };
  }

  return { message: `Comment added to post ${postId}.` };
}
