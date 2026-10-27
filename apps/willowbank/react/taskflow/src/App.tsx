import { Link, Route, Routes } from "react-router";
import HomePage from "./HomePage";
import TasksPage from "./TasksPage";
import SettingsPage from "./SettingsPage";

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

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </>
  );
}
