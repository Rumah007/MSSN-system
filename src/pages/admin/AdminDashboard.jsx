import { useState } from "react";
import { Link } from "react-router-dom";
import AdminSidebar from "../admin/components/AdminSidebar";
import {
  Users,
  Calendar,
  FileText,
  MessageSquare,
  PlusCircle,
  Upload,
  UserCheck,
  Menu,
  ChevronRight,
} from "lucide-react";

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Sample analytics metrics
  const stats = [
    {
      title: "Total Registered Members",
      value: "1,248",
      change: "+12% this month",
      icon: Users,
      color: "bg-blue-50 text-blue-700 border-blue-100",
    },
    {
      title: "Active Events / RSVPs",
      value: "3 / 137",
      change: "Next: Aug 12",
      icon: Calendar,
      color: "bg-emerald-50 text-emerald-700 border-emerald-100",
    },
    {
      title: "Resources & Publications",
      value: "24 Files",
      change: "2 added this week",
      icon: FileText,
      color: "bg-purple-50 text-purple-700 border-purple-100",
    },
    {
      title: "Pending Inquiries",
      value: "5 Unread",
      change: "Requires response",
      icon: MessageSquare,
      color: "bg-amber-50 text-amber-700 border-amber-100",
    },
  ];

  // Sample recent registrations
  const recentMembers = [
    {
      id: 1,
      name: "Fatima Ibrahim",
      matric: "19/67CS/1042",
      dept: "Computer Science",
      level: "400L",
    },
    {
      id: 2,
      name: "Usman Abubakar",
      matric: "21/47BC/0821",
      dept: "Biochemistry",
      level: "300L",
    },
    {
      id: 3,
      name: "Zainab Maryam",
      matric: "22/31LL/0112",
      dept: "Law",
      level: "200L",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex text-slate-800 font-sans">
      {/* Reusable Admin Sidebar (Sticky 100vh with independent scroll) */}
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

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
              Executive Dashboard
            </span>
          </div>
          <span className="text-xs px-2.5 py-1 bg-emerald-50 text-emerald-700 font-bold rounded-full border border-emerald-100">
            Exco
          </span>
        </header>

        {/* Dashboard Body */}
        <main className="p-4 sm:p-8 space-y-8 max-w-6xl mx-auto w-full">
          {/* Welcome Banner */}
          <div className="bg-emerald-900 text-white p-6 sm:p-8 rounded-3xl shadow-xs space-y-3 relative overflow-hidden">
            <div className="relative z-10 space-y-1">
              <span className="px-3 py-1 bg-emerald-800 text-emerald-200 text-[11px] font-bold rounded-full border border-emerald-700 inline-block">
                Admin Console
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold">
                Assalamu Alaikum, Executive
              </h2>
              <p className="text-xs sm:text-sm text-emerald-200 max-w-xl leading-relaxed">
                Welcome to the MSSN UDUS management workspace. Access member
                databases, manage upcoming programs, and upload administrative
                documents.
              </p>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, idx) => {
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

          {/* Quick Actions */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Quick Actions</h3>
            <div className="grid sm:grid-cols-3 gap-4">
              <Link
                to="/admin/members"
                className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all group space-y-3"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <UserCheck size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm flex items-center justify-between">
                    <span>Manage Members</span>
                    <ChevronRight
                      size={14}
                      className="text-slate-400 group-hover:text-emerald-600 transition-colors"
                    />
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    View full student roster, assign executive roles, and verify
                    new signups.
                  </p>
                </div>
              </Link>

              <Link
                to="/admin/events"
                className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all group space-y-3"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <PlusCircle size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm flex items-center justify-between">
                    <span>Create Programs</span>
                    <ChevronRight
                      size={14}
                      className="text-slate-400 group-hover:text-emerald-600 transition-colors"
                    />
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Post upcoming seminars, workshops, and track attendance
                    lists.
                  </p>
                </div>
              </Link>

              <Link
                to="/admin/content"
                className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all group space-y-3"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <Upload size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm flex items-center justify-between">
                    <span>Upload Content</span>
                    <ChevronRight
                      size={14}
                      className="text-slate-400 group-hover:text-emerald-600 transition-colors"
                    />
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Upload constitutional PDFs, academic guides, and audio
                    lectures.
                  </p>
                </div>
              </Link>
            </div>
          </div>

          {/* Recent Registrations Table */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">
                Recently Registered Members
              </h3>
              <Link
                to="/admin/members"
                className="text-xs font-semibold text-emerald-700 hover:underline"
              >
                View All
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {recentMembers.map((member) => (
                <div
                  key={member.id}
                  className="py-3 flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <p className="font-bold text-slate-800 text-sm">
                      {member.name}
                    </p>
                    <p className="text-slate-500 font-mono">{member.matric}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-700">
                      {member.dept}
                    </p>
                    <p className="text-slate-400">{member.level}</p>
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
