import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import AdminSidebar from "../admin/components/AdminSidebar";
import { supabase } from "../../supabaseClient"; // Adjust path if needed
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
  Loader2,
} from "lucide-react";

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Real Database Metrics
  const [metrics, setMetrics] = useState({
    totalMembers: 0,
    activeEventsCount: 0,
    totalRsvps: 0,
    nextEventDate: "None scheduled",
    totalResources: 0,
    pendingInquiries: 0,
  });

  const [recentMembers, setRecentMembers] = useState([]);

  // Fetch real data from Supabase
  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Fetch Total Members Count
      const { count: memberCount, error: memberErr } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

      // 2. Fetch Recent Registered Members (limit 5)
      const { data: recentData, error: recentErr } = await supabase
        .from("profiles")
        .select("id, full_name, matric_number, department, level, created_at")
        .order("created_at", { ascending: false })
        .limit(5);

      // 3. Fetch Events Data
      const { data: eventsData, error: eventsErr } = await supabase
        .from("events")
        .select("id, event_date")
        .gte("event_date", new Date().toISOString())
        .order("event_date", { ascending: true });

      // Fetch total RSVPs across all events
      const { count: rsvpCount } = await supabase
        .from("event_rsvps")
        .select("*", { count: "exact", head: true });

      // 4. Fetch Resources Count
      const { count: resourceCount, error: resourceErr } = await supabase
        .from("resources")
        .select("*", { count: "exact", head: true });

      // 5. Fetch Pending Inquiries Count
      // (Adjust table name 'inquiries' or 'contact_messages' if different in your schema)
      const { count: inquiryCount, error: inquiryErr } = await supabase
        .from("inquiries")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending");

      // Calculate Next Event Display Date
      let nextEventStr = "No upcoming events";
      if (eventsData && eventsData.length > 0) {
        const nextDate = new Date(eventsData[0].event_date);
        nextEventStr = `Next: ${nextDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })}`;
      }

      setMetrics({
        totalMembers: memberCount || 0,
        activeEventsCount: eventsData ? eventsData.length : 0,
        totalRsvps: rsvpCount || 0,
        nextEventDate: nextEventStr,
        totalResources: resourceCount || 0,
        pendingInquiries: inquiryCount || 0,
      });

      if (recentData) {
        setRecentMembers(recentData);
      }
    } catch (err) {
      console.error("Error fetching admin dashboard data:", err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Stat Card Configs based on Live Metrics
  const stats = [
    {
      title: "Total Registered Members",
      value: loading ? "..." : metrics.totalMembers.toLocaleString(),
      change: "Active user roster",
      icon: Users,
      color: "bg-blue-50 text-blue-700 border-blue-100",
    },
    {
      title: "Active Events / RSVPs",
      value: loading
        ? "..."
        : `${metrics.activeEventsCount} / ${metrics.totalRsvps}`,
      change: metrics.nextEventDate,
      icon: Calendar,
      color: "bg-emerald-50 text-emerald-700 border-emerald-100",
    },
    {
      title: "Resources & Media",
      value: loading ? "..." : `${metrics.totalResources} Files`,
      change: "PDFs, Audio & Videos",
      icon: FileText,
      color: "bg-purple-50 text-purple-700 border-purple-100",
    },
    {
      title: "Pending Inquiries",
      value: loading ? "..." : `${metrics.pendingInquiries} Unread`,
      change:
        metrics.pendingInquiries > 0
          ? "Requires executive action"
          : "All caught up",
      icon: MessageSquare,
      color: "bg-amber-50 text-amber-700 border-amber-100",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex text-slate-800 font-sans">
      {/* Reusable Admin Sidebar */}
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Scrollable Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Top Header Bar for Mobile */}
        <header className="md:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
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
                Welcome to your management workspace. Track real-time student
                registrations, handle active events, and upload executive
                content.
              </p>
            </div>
          </div>

          {/* Key Metrics Grid */}
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
                    <h3 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                      {loading ? (
                        <Loader2
                          className="animate-spin text-slate-400"
                          size={20}
                        />
                      ) : (
                        stat.value
                      )}
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
                    Upload constitutional PDFs, academic guides, and media
                    files.
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

            {loading ? (
              <div className="flex items-center justify-center py-8 text-slate-400 gap-2">
                <Loader2 className="animate-spin" size={20} />
                <span className="text-xs font-medium">
                  Loading recent members...
                </span>
              </div>
            ) : recentMembers.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">
                No registered members found yet.
              </p>
            ) : (
              <div className="divide-y divide-slate-100">
                {recentMembers.map((member) => (
                  <div
                    key={member.id}
                    className="py-3 flex items-center justify-between text-xs hover:bg-slate-50 px-2 rounded-xl transition-colors"
                  >
                    <div className="space-y-0.5">
                      <p className="font-bold text-slate-800 text-sm">
                        {member.full_name || "Unnamed Student"}
                      </p>
                      <p className="text-slate-500 font-mono">
                        {member.matric_number || "No Matric"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-slate-700">
                        {member.department || "General"}
                      </p>
                      <p className="text-slate-400">{member.level || "N/A"}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
