import { Navigate, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProgressPage from './pages/ProgressPage';
import QuizPage from './pages/QuizPage';
import ResultPage from './pages/ResultPage';
import ReviewPage from './pages/ReviewPage';
import SetupPage from './pages/SetupPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/setup" element={<SetupPage />} />
      <Route path="/progress" element={<ProgressPage />} />
      <Route path="/quiz" element={<QuizPage />} />
      <Route path="/result" element={<ResultPage />} />
      <Route path="/review" element={<ReviewPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
