import Link from "next/link";

export default function Page() {
  return (
    <div>
      <h1>Welcome to wherely's web app incubator</h1>
      <nav className="flex flex-col">
        <Link href="/push-notification">Push notification</Link>
        <Link href="/fetching-data">Fetching data</Link>
        <Link href="/use-transition-explained">Use transition explained</Link>
        <Link href="/use-action-state">Use action state</Link>
        <Link href="/use-action-state-2/123">Use action state(permalink)</Link>
        <Link href="/zustand">Zustand</Link>
      </nav>
    </div>
  );
}
