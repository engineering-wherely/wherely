import { Link, Route, Routes } from "react-router";
import HomePage from "./HomePage";
import SettingsPage from "./SettingsPage";
import TasksPage from "./TasksPage";
import { ErrorBoundary } from "./ErrorBoundary";

export default function App() {
  return (
    <>
      <nav>
        <Link to="/">Home</Link>
        {"|"}
        <Link to="/tasks">Tasks</Link>
        {"|"}
        <Link to="/settings">Settings</Link>
      </nav>

      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </ErrorBoundary>
    </>
  );
}
