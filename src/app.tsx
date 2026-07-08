import { Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import CoursewarePage from "@/pages/Courseware/CoursewarePage";
import NotFoundPage from "@/pages/NotFoundPage/NotFoundPage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<CoursewarePage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
