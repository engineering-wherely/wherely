import CommentForm from "@/app/hooks/use-action-state/permalink/CommentForm";

export default function PostPage() {
  return (
    <main className="mx-auto max-w-2xl space-y-6 p-6">
      <h1 className="text-3xl font-bold">Permalink demo: the post</h1>
      <p>Current page: /hooks/use-action-state/permalink/post</p>
      <p>
        This is the permanent destination. The same form, Server Action, and
        permalink let React preserve the Action result across the navigation.
      </p>
      <CommentForm withPermalink />
      <a
        className="inline-block underline"
        href="/hooks/use-action-state/permalink"
      >
        Back to the feed
      </a>
    </main>
  );
}
