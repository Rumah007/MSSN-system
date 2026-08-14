import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import ExcoSidebar from "./components/ExcoSidebar";
import {
  Calendar,
  Megaphone,
  FileText,
  Users,
  Clock,
  Menu,
  ChevronRight,
  Award,
  Loader2,
  MessageSquare,
} from "lucide-react";
import { supabase } from "../../supabaseClient"; // Adjust path to match your setup

export default function ExcoDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Dynamic Dashboard States
  const [userProfile, setUserProfile] = useState(null);
  const [stats, setStats] = useState({
    upcomingEventTitle: "No Active Events",
    eventCount: 0,
    announcementCount: 0,
    resourceCount: 0,
    excoCount: 0,
  });
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  // Fetch Exco Profile & Operational Metrics based strictly on Schema
  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Fetch current user profile
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, exco_role")
          .eq("id", user.id)
          .single();

        if (profile) setUserProfile(profile);
      }

      // 2. Fetch Total Published Resources Count
      const { count: totalResources } = await supabase
        .from("resources")
        .select("*", { count: "exact", head: true });

      // 3. Fetch Total Active Exco Count
      const { count: totalExcos } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .eq("is_exco", true);

      // 4. Fetch Published Announcements Count
      const { count: totalAnnouncements } = await supabase
        .from("announcements")
        .select("*", { count: "exact", head: true });

      // 5. Fetch Upcoming Published Events
      const today = new Date().toISOString().split("T")[0];
      const { data: nextEvents, count: totalEvents } = await supabase
        .from("events")
        .select("*", { count: "exact" })
        .eq("is_published", true)
        .gte("event_date", today)
        .order("event_date", { ascending: true })
        .limit(3);

      const nextEvent =
        nextEvents && nextEvents.length > 0 ? nextEvents[0] : null;

      // Update state matrix
      setStats({
        upcomingEventTitle: nextEvent ? nextEvent.title : "No Active Events",
        eventCount: totalEvents || 0,
        announcementCount: totalAnnouncements || 0,
        resourceCount: totalResources || 0,
        excoCount: totalExcos || 0,
      });

      setUpcomingEvents(nextEvents || []);
    } catch (error) {
      console.error("Error loading dashboard metrics:", error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Operational Exco Cards Data Mapping
  const excoStats = [
    {
      title: "Upcoming Events",
      value: `${stats.eventCount} Events`,
      change: stats.upcomingEventTitle,
      icon: Calendar,
      color: "bg-teal-50 text-teal-700 border-teal-100",
    },
    {
      title: "Announcements",
      value: `${stats.announcementCount} Posts`,
      change: "Published broadcast notes",
      icon: Megaphone,
      color: "bg-blue-50 text-blue-700 border-blue-100",
    },
    {
      title: "Academic Resources",
      value: `${stats.resourceCount} Files`,
      change: "Published in portal",
      icon: FileText,
      color: "bg-amber-50 text-amber-700 border-amber-100",
    },
    {
      title: "Executive Body",
      value: `${stats.excoCount} Excos`,
      change: "Active committee profiles",
      icon: Users,
      color: "bg-indigo-50 text-indigo-700 border-indigo-100",
    },
  ];

  const currentDateFormatted = new Date().toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-slate-100 flex text-slate-800 font-sans">
      {/* Reusable Exco Sidebar */}
      <ExcoSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activePath="dashboard"
      />

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
              Executive Workspace
            </span>
          </div>
          <span className="text-xs px-2.5 py-1 bg-teal-50 text-teal-700 font-bold rounded-full border border-teal-100">
            {userProfile?.exco_role || "Exco"}
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
                Assalamu Alaikum, {userProfile?.full_name || "Officer"}
              </h2>
              <p className="text-xs sm:text-sm text-teal-200 max-w-xl leading-relaxed">
                {userProfile?.exco_role
                  ? `Logged in as ${userProfile.exco_role}. Manage scheduled events, announcements, academic resources, and student feedback.`
                  : "Manage scheduled events, announcements, academic resources, and student feedback."}
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
                    {loading ? (
                      <div className="h-7 w-20 bg-slate-100 rounded-md animate-pulse my-1" />
                    ) : (
                      <h3 className="text-2xl font-extrabold text-slate-900">
                        {stat.value}
                      </h3>
                    )}
                    <p className="text-[11px] font-medium text-slate-400 mt-0.5 truncate">
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
                to="/exco/announcements"
                className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-teal-300 hover:shadow-md transition-all group space-y-3"
              >
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition-colors">
                  <Megaphone size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm flex items-center justify-between">
                    <span>Announcements</span>
                    <ChevronRight
                      size={14}
                      className="text-slate-400 group-hover:text-teal-600 transition-colors"
                    />
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Create and publish organization broadcast updates.
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
                    Upload and publish academic documents and files.
                  </p>
                </div>
              </Link>

              <Link
                to="/exco/events"
                className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-teal-300 hover:shadow-md transition-all group space-y-3"
              >
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition-colors">
                  <Calendar size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm flex items-center justify-between">
                    <span>Events Management</span>
                    <ChevronRight
                      size={14}
                      className="text-slate-400 group-hover:text-teal-600 transition-colors"
                    />
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Schedule, publish, and track departmental events.
                  </p>
                </div>
              </Link>

              <Link
                to="/exco/feedback"
                className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-teal-300 hover:shadow-md transition-all group space-y-3"
              >
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition-colors">
                  <MessageSquare size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm flex items-center justify-between">
                    <span>Student Feedback</span>
                    <ChevronRight
                      size={14}
                      className="text-slate-400 group-hover:text-teal-600 transition-colors"
                    />
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Review incoming student feedback and support requests.
                  </p>
                </div>
              </Link>
            </div>
          </div>

          {/* Upcoming Event Operations Schedule */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">
                Upcoming Scheduled Events
              </h3>
              <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-100">
                {currentDateFormatted}
              </span>
            </div>

            {loading ? (
              <div className="py-8 text-center text-slate-400 flex items-center justify-center gap-2">
                <Loader2 className="animate-spin text-teal-600" size={20} />
                <span className="text-xs font-medium">
                  Fetching active schedules...
                </span>
              </div>
            ) : upcomingEvents.length === 0 ? (
              <div className="py-8 text-center text-slate-400 space-y-1">
                <p className="text-xs font-semibold text-slate-600">
                  No upcoming events scheduled
                </p>
                <p className="text-[11px]">
                  Use Events Management to schedule new sessions.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {upcomingEvents.map((evt) => (
                  <div
                    key={evt.id}
                    className="py-3 flex items-center justify-between text-xs"
                  >
                    <div className="space-y-1">
                      <p className="font-bold text-slate-800 text-sm">
                        {evt.title}
                      </p>
                      <div className="flex items-center gap-3 text-slate-500">
                        <span className="flex items-center gap-1">
                          <Clock size={12} className="text-teal-600" />
                          {evt.start_time || "TBD"}
                        </span>
                        <span className="font-semibold text-slate-600">
                          •{" "}
                          {evt.venue ||
                            (evt.is_virtual ? "Virtual Meeting" : "Main Hall")}
                        </span>
                      </div>
                    </div>

                    <div>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-100 capitalize">
                        {evt.category || "Scheduled"}
                      </span>
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
