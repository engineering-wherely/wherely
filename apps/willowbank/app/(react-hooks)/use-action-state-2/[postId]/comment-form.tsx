"use client";

import { useActionState } from "react";
import { createComment, type CommentState } from "./actions";

const initialState: CommentState = {};

export function CommentForm({ postId }: { postId: string }) {
  // const permalink = `/use-action-state-2/${postId}`;
  const permalink = "/use-action-state";

  const [state, formAction, isPending] = useActionState(
    createComment,
    initialState,
    permalink,
  );

  return (
    <form action={formAction}>
      <input type="hidden" name="postId" value={postId} />

      <textarea name="text" />

      {state.error && <p>{state.error}</p>}
      {state.message && <p>{state.message}</p>}

      <button disabled={isPending}>
        {isPending ? "Pending..." : "Post comment"}
      </button>
    </form>
  );
}
