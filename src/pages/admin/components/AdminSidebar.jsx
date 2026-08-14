import { Link, useLocation } from "react-router-dom";
import {
  Users,
  Calendar,
  MessageSquare,
  Upload,
  ShieldAlert,
  LayoutDashboard,
  LogOut,
  X,
  BookOpen,
  Megaphone,
} from "lucide-react";

export default function AdminSidebar({ sidebarOpen, setSidebarOpen }) {
  const location = useLocation();

  const navItems = [
    {
      name: "Dashboard Overview",
      path: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    { name: "Member Management", path: "/admin/members", icon: Users },
    { name: "Events Management", path: "/admin/events", icon: Calendar },
    { name: "Uploads & Media", path: "/admin/content", icon: Upload },
    { name: "Student Feedback", path: "/admin/feedback", icon: MessageSquare },
    {
      name: "Announcements",
      path: "/admin/announcements",
      icon: Megaphone,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Fixed Full-Height Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 flex flex-col justify-between transition-transform duration-300 md:sticky md:top-0 h-screen md:translate-x-0 shrink-0 overflow-y-auto ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-5 space-y-6">
          {/* Header & Logo */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-emerald-600 text-white rounded-xl flex items-center justify-center font-bold shrink-0">
                <ShieldAlert size={20} />
              </div>
              <div>
                <h1 className="font-extrabold text-white text-sm leading-none">
                  MSSN UDUS
                </h1>
                <span className="text-[10px] text-emerald-400 font-semibold tracking-wider">
                  EXECUTIVE PORTAL
                </span>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden text-slate-400 hover:text-white p-1"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                  }`}
                >
                  <Icon size={16} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 space-y-1">
          <Link
            to="/"
            className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
          >
            <BookOpen size={16} />
            <span>Go to Student Portal</span>
          </Link>
          <Link
            to="/login"
            className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-950/40 rounded-xl transition-all"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
