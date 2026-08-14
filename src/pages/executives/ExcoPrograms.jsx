import { useState, useEffect } from "react";
import {
  Calendar,
  Plus,
  Search,
  MapPin,
  Clock,
  Menu,
  ChevronRight,
  Sparkles,
  X,
  Loader2,
  Video,
  Eye,
  EyeOff,
} from "lucide-react";
import ExcoSidebar from "./components/ExcoSidebar";
import { supabase } from "../../supabaseClient";

export default function ExcoPrograms() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Upcoming");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form State for New Event
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    venue: "",
    event_date: "",
    start_time: "",
    end_time: "",
    category: "Academic",
    capacity: "",
    is_virtual: false,
    meeting_link: "",
    is_published: true,
  });

  // Fetch Events from Supabase
  const fetchEvents = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("event_date", { ascending: true });

      if (error) throw error;
      setPrograms(data || []);
    } catch (err) {
      console.error("Error fetching events:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Handle Create Event
  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        title: formData.title,
        description: formData.description || null,
        venue: formData.venue,
        event_date: formData.event_date,
        start_time: formData.start_time,
        end_time: formData.end_time || null,
        category: formData.category || null,
        capacity: formData.capacity ? parseInt(formData.capacity, 10) : null,
        is_virtual: formData.is_virtual,
        meeting_link: formData.meeting_link || null,
        is_published: formData.is_published,
      };

      const { error } = await supabase.from("events").insert([payload]);

      if (error) throw error;

      // Reset form and refresh list
      setFormData({
        title: "",
        description: "",
        venue: "",
        event_date: "",
        start_time: "",
        end_time: "",
        category: "Academic",
        capacity: "",
        is_virtual: false,
        meeting_link: "",
        is_published: true,
      });
      setShowCreateModal(false);
      fetchEvents();
    } catch (err) {
      console.error("Error creating event:", err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Helper to determine event status (Upcoming vs Past)
  const getEventStatus = (eventDate) => {
    if (!eventDate) return "Upcoming";
    const today = new Date().toISOString().split("T")[0];
    return eventDate >= today ? "Upcoming" : "Completed";
  };

  // Filtering Logic
  const filteredPrograms = programs.filter((prog) => {
    const status = getEventStatus(prog.event_date);
    const matchesTab = activeTab === "All" || status === activeTab;
    const matchesSearch =
      prog.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prog.venue?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prog.category?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  const upcomingCount = programs.filter(
    (p) => getEventStatus(p.event_date) === "Upcoming",
  ).length;
  const completedCount = programs.filter(
    (p) => getEventStatus(p.event_date) === "Completed",
  ).length;

  return (
    <div className="min-h-screen bg-slate-100 flex text-slate-800 font-sans">
      {/* Shared Exco Sidebar */}
      <ExcoSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
            >
              <Menu size={20} />
            </button>
            <span className="font-bold text-slate-900 text-sm">
              Event & Program Planner
            </span>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-teal-50 text-teal-700 border border-teal-100">
            Exco Desk
          </span>
        </header>

        {/* Body Container */}
        <main className="p-4 sm:p-8 space-y-6 max-w-6xl mx-auto w-full">
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">
                Programs & Event Coordination
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Schedule departmental events, track venues, and manage session
                logistics.
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs transition-colors shadow-xs cursor-pointer"
            >
              <Plus size={16} />
              <span>Create New Program</span>
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-slate-400 text-[11px] font-medium block">
                Total Scheduled
              </span>
              <p className="text-xl font-extrabold text-slate-900 mt-1">
                {programs.length}
              </p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-slate-400 text-[11px] font-medium block">
                Upcoming Events
              </span>
              <p className="text-xl font-extrabold text-teal-600 mt-1">
                {upcomingCount}
              </p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs col-span-2 md:col-span-1">
              <span className="text-slate-400 text-[11px] font-medium block">
                Completed Events
              </span>
              <p className="text-xl font-extrabold text-emerald-600 mt-1">
                {completedCount}
              </p>
            </div>
          </div>

          {/* Controls & Search */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              {/* Filter Tabs */}
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
                {["Upcoming", "Completed", "All"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex-1 sm:flex-none text-center cursor-pointer ${
                      activeTab === tab
                        ? "bg-white text-slate-900 shadow-xs"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-72">
                <Search
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  size={15}
                />
                <input
                  type="text"
                  placeholder="Search program or venue..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-teal-500 text-slate-800 placeholder:text-slate-400"
                />
              </div>
            </div>
          </div>

          {/* Programs Grid */}
          {loading ? (
            <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 flex flex-col items-center justify-center gap-2 text-slate-400">
              <Loader2 className="animate-spin text-teal-600" size={24} />
              <span className="text-xs font-semibold">Loading events...</span>
            </div>
          ) : filteredPrograms.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 space-y-3">
              <Calendar className="mx-auto text-slate-300" size={40} />
              <p className="text-sm font-bold text-slate-700">
                No programs found
              </p>
              <p className="text-xs text-slate-400">
                Try adjusting your search criteria or switch tabs.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredPrograms.map((prog) => {
                const status = getEventStatus(prog.event_date);

                return (
                  <div
                    key={prog.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 uppercase tracking-wider">
                          {prog.category || "General"}
                        </span>
                        <div className="flex items-center gap-1.5">
                          {!prog.is_published && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-100 flex items-center gap-1">
                              <EyeOff size={10} /> Draft
                            </span>
                          )}
                          <span
                            className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                              status === "Upcoming"
                                ? "bg-teal-50 text-teal-700 border-teal-100"
                                : "bg-slate-50 text-slate-600 border-slate-200"
                            }`}
                          >
                            {status}
                          </span>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-extrabold text-slate-900 text-base leading-snug">
                          {prog.title}
                        </h3>
                        {prog.description && (
                          <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                            {prog.description}
                          </p>
                        )}
                      </div>

                      <div className="space-y-1.5 text-xs text-slate-600 pt-1">
                        <div className="flex items-center gap-2">
                          <Calendar
                            size={14}
                            className="text-teal-600 shrink-0"
                          />
                          <span>{prog.event_date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock
                            size={14}
                            className="text-slate-400 shrink-0"
                          />
                          <span>
                            {prog.start_time}
                            {prog.end_time ? ` - ${prog.end_time}` : ""}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {prog.is_virtual ? (
                            <Video
                              size={14}
                              className="text-teal-600 shrink-0"
                            />
                          ) : (
                            <MapPin
                              size={14}
                              className="text-slate-400 shrink-0"
                            />
                          )}
                          <span className="truncate">{prog.venue}</span>
                        </div>
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-slate-700">
                        {prog.capacity
                          ? `${prog.capacity} Seats`
                          : "Open Limit"}
                      </span>
                      <button
                        onClick={() => setSelectedProgram(prog)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-xl text-xs transition-colors inline-flex items-center gap-1 cursor-pointer"
                      >
                        <span>View Details</span>
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* Program Details Modal */}
      {selectedProgram && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-teal-600" />
                <h3 className="font-extrabold text-slate-900 text-base">
                  Program Details & Logistics
                </h3>
              </div>
              <button
                onClick={() => setSelectedProgram(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <span className="text-[10px] font-bold text-teal-700 bg-teal-50 border border-teal-100 px-2.5 py-0.5 rounded-md">
                  {selectedProgram.category || "General"}
                </span>
                <h4 className="font-extrabold text-base text-slate-900 mt-2">
                  {selectedProgram.title}
                </h4>
                {selectedProgram.description && (
                  <p className="text-slate-600 mt-1 leading-relaxed">
                    {selectedProgram.description}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <div>
                  <span className="text-[10px] text-slate-400 block">
                    Date & Time
                  </span>
                  <span className="font-bold text-slate-800">
                    {selectedProgram.event_date}
                  </span>
                  <span className="block text-[10px] text-slate-500">
                    {selectedProgram.start_time}
                    {selectedProgram.end_time
                      ? ` - ${selectedProgram.end_time}`
                      : ""}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">
                    Venue
                  </span>
                  <span className="font-bold text-slate-800">
                    {selectedProgram.venue}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">
                    Event Type
                  </span>
                  <span className="font-bold text-slate-800">
                    {selectedProgram.is_virtual
                      ? "Virtual Session"
                      : "Physical Session"}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">
                    Cap Capacity
                  </span>
                  <span className="font-bold text-slate-800">
                    {selectedProgram.capacity
                      ? `${selectedProgram.capacity} Seats`
                      : "Unlimited"}
                  </span>
                </div>
              </div>

              {selectedProgram.meeting_link && (
                <div className="p-3 bg-teal-50 border border-teal-100 rounded-xl space-y-1">
                  <span className="text-[10px] text-teal-700 font-bold block">
                    Virtual Meeting Access
                  </span>
                  <a
                    href={selectedProgram.meeting_link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-teal-800 font-semibold underline truncate block"
                  >
                    {selectedProgram.meeting_link}
                  </a>
                </div>
              )}
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={() => setSelectedProgram(null)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl transition-colors text-xs cursor-pointer"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Program Creation Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base">
                Create New Event / Program
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Program Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="E.g., Tech Quiz Competition"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Event details or notes..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="Academic">Academic</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Sports">Sports</option>
                    <option value="Social">Social</option>
                    <option value="Leadership">Leadership</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Capacity Limit
                  </label>
                  <input
                    type="number"
                    placeholder="100"
                    value={formData.capacity}
                    onChange={(e) =>
                      setFormData({ ...formData, capacity: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Venue / Location *
                </label>
                <input
                  type="text"
                  required
                  placeholder="E.g. PTDF Theatre or Google Meet"
                  value={formData.venue}
                  onChange={(e) =>
                    setFormData({ ...formData, venue: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.event_date}
                    onChange={(e) =>
                      setFormData({ ...formData, event_date: e.target.value })
                    }
                    className="w-full px-2 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Start Time *
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.start_time}
                    onChange={(e) =>
                      setFormData({ ...formData, start_time: e.target.value })
                    }
                    className="w-full px-2 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={formData.end_time}
                    onChange={(e) =>
                      setFormData({ ...formData, end_time: e.target.value })
                    }
                    className="w-full px-2 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={formData.is_virtual}
                    onChange={(e) =>
                      setFormData({ ...formData, is_virtual: e.target.checked })
                    }
                    className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                  />
                  <span>Is Virtual Event</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={formData.is_published}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        is_published: e.target.checked,
                      })
                    }
                    className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                  />
                  <span>Publish Immediately</span>
                </label>
              </div>

              {formData.is_virtual && (
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Meeting Link
                  </label>
                  <input
                    type="url"
                    placeholder="https://meet.google.com/..."
                    value={formData.meeting_link}
                    onChange={(e) =>
                      setFormData({ ...formData, meeting_link: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              )}

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2 bg-teal-600 text-white font-bold rounded-xl text-xs hover:bg-teal-700 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {submitting && <Loader2 size={14} className="animate-spin" />}
                  <span>Save Program</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
