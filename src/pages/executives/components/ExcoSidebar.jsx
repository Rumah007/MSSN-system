import { useLocation, Link } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Calendar,
  QrCode,
  Megaphone,
  LogOut,
  X,
  GraduationCap,
} from "lucide-react";

export default function ExcoSidebar({ sidebarOpen, setSidebarOpen }) {
  const location = useLocation();

  const navItems = [
    {
      label: "Overview",
      icon: LayoutDashboard,
      href: "/exco/dashboard",
    },
    {
      label: "Member Directory",
      icon: Users,
      href: "/exco/directory",
    },
    {
      label: "Programs & Events",
      icon: Calendar,
      href: "/exco/programs",
    },
    {
      label: "Pass Scanner",
      icon: QrCode,
      href: "/exco/attendance",
    },
    {
      label: "Announcements",
      icon: Megaphone,
      href: "/exco/announcements",
    },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 md:hidden"
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 flex flex-col justify-between transition-transform duration-200 ease-in-out shrink-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Top Header */}
        <div className="p-5 border-b border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center text-white font-bold shadow-xs">
                <GraduationCap size={20} />
              </div>
              <div>
                <h1 className="font-extrabold text-white text-sm tracking-tight leading-none">
                  Exco Portal
                </h1>
                <p className="text-[10px] text-teal-400 font-semibold mt-1">
                  UDUS CS Association
                </p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="px-3 py-4 flex-1 space-y-1">
          <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
            Executive Controls
          </span>
          {navItems.map((item) => {
            const Icon = item.icon;
            // Check if current URL path matches item href
            const isActive = location.pathname === item.href;

            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-teal-600/20 text-teal-300 font-bold border border-teal-500/30"
                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                }`}
              >
                <Icon
                  size={16}
                  className={isActive ? "text-teal-400" : "text-slate-400"}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Footer / Profile */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 text-teal-400 flex items-center justify-center font-bold text-xs shrink-0">
                EX
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-white truncate">
                  Exco Desk
                </p>
                <p className="text-[10px] text-slate-500 truncate">
                  Officer Account
                </p>
              </div>
            </div>
            <button className="text-slate-400 hover:text-rose-400 p-1.5 rounded-lg hover:bg-slate-800 transition-colors">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
