import { CommentForm } from "./comment-form";

export default async function PostPage({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const { postId } = await params;

  return (
    <>
      <p>
        I run Claude Code most of my day. agent loops firing all day, one after
        another. the usage screen tells me I'm at 26% of my weekly limit. it
        doesn't tell me what that 26% weighs anywhere else. it feels free.
      </p>
      <CommentForm postId={postId} />
    </>
  );
}
