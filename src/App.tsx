import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "@/components/layout";
import { ChatView } from "@/features/chat";
import { QuizPage } from "@/features/quiz";
import { DocumentsPage } from "@/features/documents";
import { PlannerPage } from "@/features/planner";
import { SettingsPage } from "@/features/settings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<ChatView />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/documents" element={<DocumentsPage />} />
          <Route path="/planner" element={<PlannerPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
