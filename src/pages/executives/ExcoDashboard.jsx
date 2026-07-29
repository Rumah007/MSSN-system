import { useState } from "react";
import { Link } from "react-router-dom";
import ExcoSidebar from "./components/ExcoSidebar";
import {
  Calendar,
  CheckSquare,
  FileText,
  Users,
  Clock,
  Menu,
  ChevronRight,
  Award,
} from "lucide-react";

export default function ExcoDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Operational Exco Metrics
  const excoStats = [
    {
      title: "Today's Event Capacity",
      value: "84 Seats",
      change: "Halqah at 4:30 PM",
      icon: Calendar,
      color: "bg-teal-50 text-teal-700 border-teal-100",
    },
    {
      title: "Checked-in Attendees",
      value: "52 Verified",
      change: "61% arrival rate",
      icon: CheckSquare,
      color: "bg-blue-50 text-blue-700 border-blue-100",
    },
    {
      title: "Academic Resources",
      value: "128 Files",
      change: "12 added this week",
      icon: FileText,
      color: "bg-amber-50 text-amber-700 border-amber-100",
    },
    {
      title: "Executive Body",
      value: "18 Excos",
      change: "Active in 5 wings",
      icon: Users,
      color: "bg-indigo-50 text-indigo-700 border-indigo-100",
    },
  ];

  // Daily Operational Checklist for Excos
  const todayTasks = [
    {
      id: 1,
      title: "Setup Hall A audio for Weekly Halqah",
      time: "03:30 PM",
      assignedTo: "Publicity Wing",
      status: "In Progress",
    },
    {
      id: 2,
      title: "Upload Past Questions for 300L CS Exams",
      time: "05:00 PM",
      assignedTo: "Academic Wing",
      status: "Pending",
    },
    {
      id: 3,
      title: "Review Freshers Academic Orientation Budget",
      time: "06:00 PM",
      assignedTo: "Secretariat",
      status: "Pending",
    },
    {
      id: 4,
      title: "Upload Audio Recording of Last Friday Khutbah",
      time: "08:00 PM",
      assignedTo: "Media Unit",
      status: "Completed",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex text-slate-800 font-sans">
      {/* Reusable Exco Sidebar */}
      <ExcoSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Scrollable Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Top Header Bar for Mobile */}
        <header className="md:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              <Menu size={20} />
            </button>
            <span className="font-bold text-slate-900 text-sm">
              Executive Workspace
            </span>
          </div>
          <span className="text-xs px-2.5 py-1 bg-teal-50 text-teal-700 font-bold rounded-full border border-teal-100">
            Exco
          </span>
        </header>

        {/* Dashboard Body */}
        <main className="p-4 sm:p-8 space-y-8 max-w-6xl mx-auto w-full">
          {/* Welcome Banner */}
          <div className="bg-teal-900 text-white p-6 sm:p-8 rounded-3xl shadow-xs space-y-3 relative overflow-hidden">
            <div className="relative z-10 space-y-1">
              <span className="px-3 py-1 bg-teal-800 text-teal-200 text-[11px] font-bold rounded-full border border-teal-700 inline-block">
                Operations, Resources & Secretariat Desk
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold">
                Assalamu Alaikum, Officer
              </h2>
              <p className="text-xs sm:text-sm text-teal-200 max-w-xl leading-relaxed">
                Manage event check-ins, publish academic resources, and
                coordinate executive committee operations.
              </p>
            </div>
            <div className="absolute right-4 bottom-0 opacity-10 pointer-events-none hidden md:block">
              <Award size={180} />
            </div>
          </div>

          {/* Key Operational Metrics */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {excoStats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div
                  key={idx}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500">
                      {stat.title}
                    </span>
                    <div className={`p-2 rounded-xl border ${stat.color}`}>
                      <Icon size={18} />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-extrabold text-slate-900">
                      {stat.value}
                    </h3>
                    <p className="text-[11px] font-medium text-slate-400 mt-0.5">
                      {stat.change}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Exco Duty Shortcuts */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900">
              Executive Duty Shortcuts
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link
                to="/exco/attendance"
                className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-teal-300 hover:shadow-md transition-all group space-y-3"
              >
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition-colors">
                  <CheckSquare size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm flex items-center justify-between">
                    <span>Scan / Attendance</span>
                    <ChevronRight
                      size={14}
                      className="text-slate-400 group-hover:text-teal-600 transition-colors"
                    />
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Verify passes and log attendance for active programs.
                  </p>
                </div>
              </Link>

              <Link
                to="/exco/resources"
                className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-teal-300 hover:shadow-md transition-all group space-y-3"
              >
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition-colors">
                  <FileText size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm flex items-center justify-between">
                    <span>Manage Resources</span>
                    <ChevronRight
                      size={14}
                      className="text-slate-400 group-hover:text-teal-600 transition-colors"
                    />
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Upload and organize lecture notes, audio, and past
                    questions.
                  </p>
                </div>
              </Link>

              <Link
                to="/exco/programs"
                className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-teal-300 hover:shadow-md transition-all group space-y-3"
              >
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition-colors">
                  <Calendar size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm flex items-center justify-between">
                    <span>Program Coordination</span>
                    <ChevronRight
                      size={14}
                      className="text-slate-400 group-hover:text-teal-600 transition-colors"
                    />
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Organize logistics, schedules, and wings for upcoming
                    events.
                  </p>
                </div>
              </Link>

              <Link
                to="/exco/directory"
                className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-teal-300 hover:shadow-md transition-all group space-y-3"
              >
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition-colors">
                  <Users size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm flex items-center justify-between">
                    <span>Member Directory</span>
                    <ChevronRight
                      size={14}
                      className="text-slate-400 group-hover:text-teal-600 transition-colors"
                    />
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Search student records and manage executive committee roles.
                  </p>
                </div>
              </Link>
            </div>
          </div>

          {/* Today's Tasks & Committee Schedule */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">
                Today's Executive Checklist
              </h3>
              <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-100">
                July 29, 2026
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {todayTasks.map((task) => (
                <div
                  key={task.id}
                  className="py-3 flex items-center justify-between text-xs"
                >
                  <div className="space-y-1">
                    <p className="font-bold text-slate-800 text-sm">
                      {task.title}
                    </p>
                    <div className="flex items-center gap-3 text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock size={12} className="text-teal-600" />
                        {task.time}
                      </span>
                      <span className="font-semibold text-slate-600">
                        • {task.assignedTo}
                      </span>
                    </div>
                  </div>

                  <div>
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        task.status === "Completed"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                          : task.status === "In Progress"
                            ? "bg-amber-50 text-amber-700 border-amber-100"
                            : "bg-slate-100 text-slate-600 border-slate-200"
                      }`}
                    >
                      {task.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
