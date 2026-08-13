import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./AuthContext"; // Update path if placed elsewhere
import ProtectedRoute from "./ProtectedRoute"; // Update path if placed elsewhere

// Public Pages
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import About from "./pages/About";
import FeedbackPage from "./pages/Feedback";
import Media from "./pages/Media";
import ResourcesPage from "./pages/Resources";
import EventsPage from "./pages/Events";

// Admin Imports
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminContentPage from "./pages/admin/AdminContentPage";
import AdminFeedbackPage from "./pages/admin/AdminFeedbackPage";
import AdminMembersPage from "./pages/admin/AdminMembersPage";
import AdminEventsPage from "./pages/admin/AdminEventsPage";

// Executive (Exco) Imports
import ExcoDashboard from "./pages/executives/ExcoDashboard";
import ExcoDirectory from "./pages/executives/ExcoDirectory";
import ExcoPrograms from "./pages/executives/ExcoPrograms";
// import ExcoAttendance from "./pages/executives/ExcoAttendance";
import ExcoAnnouncements from "./pages/executives/ExcoAnnouncements";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/feedback" element={<FeedbackPage />} />
          <Route path="/media" element={<Media />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/resources" element={<ResourcesPage />} />

          {/* Admin Protected Routes */}
          <Route element={<ProtectedRoute requireAdmin={true} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/content" element={<AdminContentPage />} />
            <Route path="/admin/feedback" element={<AdminFeedbackPage />} />
            <Route path="/admin/members" element={<AdminMembersPage />} />
            <Route path="/admin/events" element={<AdminEventsPage />} />
          </Route>

          {/* Executive (Exco) Protected Routes */}
          <Route element={<ProtectedRoute requireExco={true} />}>
            <Route path="/exco/dashboard" element={<ExcoDashboard />} />
            <Route path="/exco/directory" element={<ExcoDirectory />} />
            <Route path="/exco/programs" element={<ExcoPrograms />} />
            {/* <Route path="/exco/attendance" element={<ExcoAttendance />} /> */}
            <Route path="/exco/announcements" element={<ExcoAnnouncements />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
