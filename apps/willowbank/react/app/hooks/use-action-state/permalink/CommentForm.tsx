"use client";

import { submitComment } from "@/app/hooks/use-action-state/permalink/actions";
import { useActionState, useEffect, useState } from "react";

export default function CommentForm({
  withPermalink,
}: {
  withPermalink: boolean;
}) {
  const [hydrated, setHydrated] = useState(false);
  const [state, formAction, isPending] = useActionState(
    submitComment,
    { message: "No submission yet.", submissions: 0 },
    withPermalink ? "/hooks/use-action-state/permalink/post" : undefined,
  );

  useEffect(() => {
    // The status deliberately distinguishes server HTML from hydrated UI.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHydrated(true);
  }, []);

  return (
    <form
      action={formAction}
      className="rounded-xl border border-slate-300 bg-white p-6 text-slate-900"
    >
      <h2 className="text-xl font-bold">
        {withPermalink ? "With permalink" : "Without permalink"}
      </h2>
      <p className="my-3 text-sm text-slate-600">
        {hydrated
          ? "JavaScript is active"
          : "JavaScript has not hydrated this form"}
      </p>
      <label className="block">
        Comment
        <textarea
          name="comment"
          className="mt-2 block w-full rounded border border-slate-400 p-2"
          defaultValue="Hello from the feed!"
        />
      </label>
      <button
        type="submit"
        disabled={isPending}
        className="my-4 rounded bg-blue-700 px-4 py-2 text-white disabled:opacity-50"
      >
        {isPending ? "Submitting…" : "Submit to server"}
      </button>
      <div aria-live="polite" className="rounded bg-slate-100 p-3">
        <p>{state.message}</p>
        <p>Submissions: {state.submissions}</p>
      </div>
    </form>
  );
}
