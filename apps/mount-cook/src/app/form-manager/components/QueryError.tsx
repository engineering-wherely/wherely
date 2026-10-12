const buttonClass =
  'rounded border border-slate-200 px-3 py-1.5 text-sm hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-indigo-600';

export default function QueryError({
  error,
  retry,
}: {
  error: Error;
  retry: () => void;
}) {
  return (
    <div role="alert" className="space-y-3 p-4 text-sm text-red-700">
      <p>{error.message}</p>
      <button className={buttonClass} onClick={retry}>
        Try again
      </button>
    </div>
  );
}
