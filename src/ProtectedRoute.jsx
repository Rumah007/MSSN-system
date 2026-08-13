import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute({
  requireExco = false,
  requireAdmin = false,
}) {
  const { user, profile, loading } = useAuth();

  // Show a lightweight spinner or empty state while restoring session
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  // 1. Not logged in -> Redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 2. Role checks (using profile data)
  if (requireAdmin && !profile?.is_admin) {
    return <Navigate to="/" replace />;
  }

  if (requireExco && !profile?.is_exco && !profile?.is_admin) {
    return <Navigate to="/" replace />;
  }

  // Render child routes
  return <Outlet />;
}
