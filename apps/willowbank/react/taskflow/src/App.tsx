import { Route, Routes } from "react-router";
import { AppLayout } from "./components/AppLayout";
import { HomePage } from "./pages/HomePage";
import { TasksPage } from "./pages/TasksPage";
import { NotFoundPage } from "./pages/NotFoundPage";

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="tasks" element={<TasksPage />} />
        <Route path="" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
