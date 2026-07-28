import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import About from "./pages/About";
import FeedbackPage from "./pages/Feedback";
import Media from "./pages/Media";
import ResourcesPage from "./pages/Resources";
import EventsPage from "./pages/Events";
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/feedback" element={<FeedbackPage />} />
        <Route path="/media" element={<Media />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/resources" element={<ResourcesPage />} />
      </Routes>
    </Router>
  );
};
export default App;
