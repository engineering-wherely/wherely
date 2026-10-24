import CommentForm from "@/app/hooks/use-action-state/permalink/CommentForm";

export default function PermalinkDemo() {
  return (
    <main className="mx-auto max-w-4xl space-y-6 p-6">
      <h1 className="text-3xl font-bold">Permalink demo: the feed</h1>
      <p>Current page: /hooks/use-action-state/permalink</p>
      <ol className="list-decimal space-y-2 pl-6">
        <li>With JavaScript enabled, submit either form. Both update here.</li>
        <li>In browser DevTools, disable JavaScript, then reload this page.</li>
        <li>Submit the form without a permalink. You stay on this feed.</li>
        <li>
          Submit the form with a permalink. You arrive at the post page with the
          server response preserved.
        </li>
      </ol>
      <p>
        Watch the address bar and the submission count. Clear the comment to try
        server validation. This demo does not save comments.
      </p>
      <div className="grid gap-6 md:grid-cols-2">
        <CommentForm withPermalink={false} />
        <CommentForm withPermalink />
      </div>
      <a
        className="inline-block underline"
        href="/hooks/use-action-state/permalink/post"
      >
        Open the post directly (starts with fresh form state)
      </a>
    </main>
  );
}
