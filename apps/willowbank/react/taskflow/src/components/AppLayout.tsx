import { NavLink, Outlet } from "react-router";

export function AppLayout() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <NavLink to="/" className="brand">
          TaskFlow
        </NavLink>

        <nav aria-label="Main navigation">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/tasks">Tasks</NavLink>
        </nav>
      </header>

      <main className="app-content">
        <Outlet />
      </main>
    </div>
  );
}
