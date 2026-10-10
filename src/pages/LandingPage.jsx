import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import mssnLogo from "../assets/MSSN_logo.jpg";
import NavBar from "../components/NavBar";
import { useAuth } from "../AuthContext";
import { supabase } from "../supabaseClient";
import {
  Megaphone,
  ArrowRight,
  Clock,
  X,
  ChevronRight,
  UserCheck,
  LogOut,
  Calendar,
  MapPin,
  Video,
  FileText,
  Image as ImageIcon,
  ExternalLink,
  Music,
  Play,
  ShieldAlert,
  LayoutDashboard,
} from "lucide-react";

export default function LandingPage() {
  const [showAlertBanner, setShowAlertBanner] = useState(true);
  const { user, profile, loading: authLoading, signOut } = useAuth();

  // Dynamic Data States
  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(true);

  const [resources, setResources] = useState([]);
  const [resourcesLoading, setResourcesLoading] = useState(true);

  const [announcements, setAnnouncements] = useState([]);
  const [announcementsLoading, setAnnouncementsLoading] = useState(true);

  // Fetch Announcements from Supabase
  useEffect(() => {
    async function fetchAnnouncements() {
      try {
        const { data, error } = await supabase
          .from("announcements")
          .select("*")
          .eq("is_published", true)
          .order("created_at", { ascending: false })
          .limit(3);

        if (!error && data) {
          setAnnouncements(data);
        }
      } catch (err) {
        console.error("Error fetching announcements:", err);
      } finally {
        setAnnouncementsLoading(false);
      }
    }

    fetchAnnouncements();
  }, []);

  // Fetch Events from Supabase
  useEffect(() => {
    async function fetchEvents() {
      try {
        const { data, error } = await supabase
          .from("events")
          .select("*")
          .eq("is_published", true)
          .order("event_date", { ascending: true })
          .limit(3);

        if (!error && data) {
          setEvents(data);
        }
      } catch (err) {
        console.error("Error fetching events:", err);
      } finally {
        setEventsLoading(false);
      }
    }

    fetchEvents();
  }, []);

  // Fetch Resources from Supabase
  useEffect(() => {
    async function fetchResources() {
      try {
        const { data, error } = await supabase
          .from("resources")
          .select("*")
          .eq("is_published", true)
          .order("created_at", { ascending: false })
          .limit(3);

        if (!error && data) {
          setResources(data);
        }
      } catch (err) {
        console.error("Error fetching resources:", err);
      } finally {
        setResourcesLoading(false);
      }
    }

    fetchResources();
  }, []);

  // Format Helpers
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return "";
    const [hours, minutes] = timeStr.split(":");
    const h = parseInt(hours, 10);
    const ampm = h >= 12 ? "PM" : "AM";
    const formattedHours = h % 12 || 12;
    return `${formattedHours}:${minutes} ${ampm}`;
  };

  const getResourceIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "video":
        return <Video size={28} />;
      case "image":
        return <ImageIcon size={28} />;
      case "audio":
        return <Music size={28} />;
      default:
        return <FileText size={28} />;
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority?.toLowerCase()) {
      case "urgent":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
            Urgent
          </span>
        );
      case "normal":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Notice
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
            Info
          </span>
        );
    }
  };

  const urgentAnnouncement = announcements.find(
    (a) => a.priority?.toLowerCase() === "urgent",
  );

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans selection:bg-emerald-200 selection:text-emerald-900 flex flex-col justify-between">
      {/* Background Accent Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-emerald-100/70 blur-3xl" />
        <div className="absolute bottom-10 -left-40 w-96 h-96 rounded-full bg-lime-100/60 blur-3xl" />
      </div>

      <div>
        {/* Urgent Announcement Alert Banner */}
        {showAlertBanner && urgentAnnouncement && (
          <div className="bg-emerald-900 text-emerald-50 px-4 py-2.5 text-xs sm:text-sm relative z-50 flex items-center justify-between border-b border-emerald-800">
            <div className="max-w-7xl mx-auto flex items-center gap-2.5 font-medium truncate pr-6">
              <span className="bg-rose-500 text-white font-bold px-2 py-0.5 rounded text-[10px] uppercase tracking-wider shrink-0">
                Urgent
              </span>
              <span className="truncate">{urgentAnnouncement.title} —</span>
              <a
                href="#announcements"
                className="underline text-emerald-200 hover:text-white shrink-0 font-semibold"
              >
                Read Details
              </a>
            </div>
            <button
              onClick={() => setShowAlertBanner(false)}
              className="text-emerald-300 hover:text-white p-1 rounded-md transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>
        )}

        <NavBar />

        {/* Role-Based Return Navigation Banner */}
        {user && (profile?.is_admin || profile?.is_exco) && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-4 py-2 relative z-20">
            <div className="max-w-5xl mx-auto flex items-center justify-between text-xs sm:text-sm">
              <div className="flex items-center gap-2 text-emerald-900 font-medium">
                <ShieldAlert size={16} className="text-emerald-700 shrink-0" />
                <span>
                  You are logged in as an{" "}
                  <strong>
                    {profile.is_admin ? "Administrator" : "Executive"}
                  </strong>
                  .
                </span>
              </div>
              <Link
                to={profile.is_admin ? "/admin/dashboard" : "/exco/dashboard"}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-xs transition-colors"
              >
                <LayoutDashboard size={14} />
                <span>Go to Dashboard</span>
              </Link>
            </div>
          </div>
        )}

        {/* Hero Section */}
        <section className="relative z-10 pt-12 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-2xl border border-emerald-200 p-1 bg-white shadow-md">
              <img
                src={mssnLogo}
                alt="MSSN UDUS Emblem"
                className="w-full h-full object-contain rounded-xl"
              />
            </div>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
            MSSN UDUS Portal
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
            {user ? (
              <>
                Welcome back,{" "}
                <span className="font-semibold text-emerald-700">
                  {profile?.full_name || user.email}
                </span>
                ! Browse upcoming events, announcements, and resources below.
              </>
            ) : (
              "Welcome to the official central platform. Sign in to access member services, academic resources, and event registrations."
            )}
          </p>

          {/* Conditional Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            {authLoading ? (
              <div className="h-12 w-48 bg-slate-100 animate-pulse rounded-xl" />
            ) : user ? (
              <button
                onClick={signOut}
                className="w-full sm:w-auto px-6 py-3.5 text-slate-700 bg-slate-100 border border-slate-200 font-semibold rounded-xl hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogOut size={16} /> Sign Out
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="w-full sm:w-auto px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  Sign In <ArrowRight size={18} />
                </Link>
                <Link
                  to="/register"
                  className="w-full sm:w-auto px-8 py-3.5 text-slate-700 bg-slate-100 border border-slate-200 font-semibold rounded-xl hover:bg-slate-200 transition-all text-center"
                >
                  Create Account
                </Link>
              </>
            )}
          </div>

          {/* Session Status Tag */}
          {user && (
            <div className="pt-1 flex items-center justify-center gap-1.5 text-xs text-slate-500">
              <UserCheck size={14} className="text-emerald-600" />
              <span>
                Signed in as{" "}
                <strong className="text-slate-700">{user.email}</strong>
              </span>
            </div>
          )}
        </section>

        {/* Public Announcements Broadcast */}
        <section
          id="announcements"
          className="relative z-10 py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-slate-100"
        >
          <div className="flex items-center gap-2 mb-6">
            <Megaphone className="text-emerald-600" size={18} />
            <h2 className="text-xl font-bold text-slate-900">
              Official Broadcasts & Memos
            </h2>
          </div>

          {announcementsLoading ? (
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-44 bg-slate-100 animate-pulse rounded-xl border border-slate-200"
                />
              ))}
            </div>
          ) : announcements.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-xs italic bg-slate-50 rounded-xl border border-dashed border-slate-200">
              No published announcements found.
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {announcements.map((item) => (
                <div
                  key={item.id}
                  className={`p-5 rounded-xl bg-white border transition-all flex flex-col justify-between space-y-4 ${
                    item.priority?.toLowerCase() === "urgent"
                      ? "border-rose-200 ring-1 ring-rose-100"
                      : "border-slate-200 hover:border-emerald-300"
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      {getPriorityBadge(item.priority)}
                      <div className="flex items-center gap-1 text-[11px] text-slate-400">
                        <Clock size={12} />
                        {formatDate(item.created_at)}
                      </div>
                    </div>

                    <h3 className="font-bold text-slate-900 text-base leading-snug">
                      {item.title}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                      {item.content}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-slate-500 bg-slate-50 px-2 py-0.5 rounded capitalize">
                      {item.category || "General"}
                    </span>
                    <span className="text-xs font-bold text-emerald-700 inline-flex items-center gap-0.5">
                      Details <ChevronRight size={14} />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Upcoming Events Section */}
        <section
          id="events"
          className="relative z-10 py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-slate-100"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="text-emerald-600" size={18} />
              <h2 className="text-xl font-bold text-slate-900">
                Upcoming Events & Programs
              </h2>
            </div>
          </div>

          {eventsLoading ? (
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-44 bg-slate-100 animate-pulse rounded-xl border border-slate-200"
                />
              ))}
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-xs italic bg-slate-50 rounded-xl border border-dashed border-slate-200">
              No upcoming published events found.
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {events.map((ev) => (
                <div
                  key={ev.id}
                  className="p-5 rounded-xl bg-white border border-slate-200 hover:border-emerald-300 transition-all flex flex-col justify-between space-y-4 shadow-xs"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                        {ev.category || "General"}
                      </span>
                      <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                        <Clock size={12} /> {formatTime(ev.start_time)}
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-base leading-snug">
                      {ev.title}
                    </h3>

                    <div className="space-y-1.5 text-xs text-slate-600 pt-1">
                      <div className="flex items-center gap-1.5">
                        <Calendar
                          size={13}
                          className="text-emerald-600 shrink-0"
                        />
                        <span>{formatDate(ev.event_date)}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin
                          size={13}
                          className="text-emerald-600 shrink-0"
                        />
                        <span className="truncate">{ev.venue}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex justify-end">
                    <Link
                      to="/events"
                      className="text-xs font-bold text-emerald-700 hover:text-emerald-900 inline-flex items-center gap-0.5"
                    >
                      Register / Info <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Media & Resources Highlights */}
        <section
          id="media"
          className="relative z-10 py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-slate-100"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Video className="text-emerald-600" size={18} />
              <h2 className="text-xl font-bold text-slate-900">
                Media & Library Highlights
              </h2>
            </div>
          </div>

          {resourcesLoading ? (
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-48 bg-slate-100 animate-pulse rounded-xl border border-slate-200"
                />
              ))}
            </div>
          ) : resources.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-xs italic bg-slate-50 rounded-xl border border-dashed border-slate-200">
              No published resources uploaded yet.
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {resources.map((item) => {
                const type = item.type?.toLowerCase();

                return (
                  <div
                    key={item.id}
                    className="rounded-xl border border-slate-200 overflow-hidden bg-white hover:border-emerald-300 transition-all flex flex-col justify-between"
                  >
                    <div className="h-40 bg-slate-900 flex items-center justify-center relative overflow-hidden group">
                      {type === "image" ? (
                        <img
                          src={item.file_url}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : type === "video" ? (
                        <div className="w-full h-full relative flex items-center justify-center bg-black">
                          <video
                            src={item.file_url}
                            preload="metadata"
                            className="w-full h-full object-cover opacity-80"
                          />
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/10 transition-colors">
                            <div className="w-10 h-10 rounded-full bg-emerald-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                              <Play size={20} className="ml-0.5" />
                            </div>
                          </div>
                        </div>
                      ) : type === "audio" ? (
                        <div className="w-full h-full bg-gradient-to-br from-slate-900 to-emerald-950 flex flex-col items-center justify-center text-emerald-400 p-4 text-center">
                          <div className="w-12 h-12 rounded-full bg-emerald-900/60 border border-emerald-700/50 flex items-center justify-center mb-1">
                            <Music size={24} />
                          </div>
                          <span className="text-[11px] text-emerald-300 font-medium">
                            Audio Recording
                          </span>
                        </div>
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex flex-col items-center justify-center text-slate-300 p-4 text-center">
                          <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center mb-1">
                            <FileText size={24} className="text-emerald-400" />
                          </div>
                          <span className="text-[11px] text-slate-400 font-medium">
                            Document / PDF
                          </span>
                        </div>
                      )}

                      <span className="absolute bottom-2 right-2 text-[10px] bg-black/70 backdrop-blur-xs text-white px-2 py-0.5 rounded font-mono uppercase tracking-wider flex items-center gap-1 border border-white/10 z-10">
                        {getResourceIcon(type)}
                        {item.type}
                      </span>
                    </div>

                    <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {formatDate(item.created_at)}
                        </span>
                        <h3 className="font-bold text-slate-900 text-sm leading-snug mt-0.5 line-clamp-2">
                          {item.title}
                        </h3>
                      </div>

                      <div className="pt-3 flex items-center justify-between border-t border-slate-100">
                        <span className="text-[11px] text-emerald-700 font-semibold capitalize">
                          {item.category || "General"}
                        </span>
                        <a
                          href={item.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-bold text-emerald-700 hover:text-emerald-900 inline-flex items-center gap-1"
                        >
                          View <ExternalLink size={12} />
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-200 bg-slate-50 text-slate-500 text-xs py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <div className="flex items-center gap-2">
            <img src={mssnLogo} alt="MSSN Logo" className="w-5 h-5 rounded" />
            <span className="font-bold text-slate-700">MSSN UDUS Portal</span>
          </div>

          <div>
            &copy; {new Date().getFullYear()} Muslim Students' Society of
            Nigeria, UDUS Branch.
          </div>
        </div>
      </footer>
    </div>
  );
}
