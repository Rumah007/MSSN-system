import { useState, useEffect } from "react";
import AdminSidebar from "../admin/components/AdminSidebar";
import { supabase } from "../../supabaseClient";
import {
  Calendar,
  PlusCircle,
  Clock,
  MapPin,
  Trash2,
  Menu,
  Search,
  AlertCircle,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
} from "lucide-react";

export default function AdminEventsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Database Data State
  const [events, setEvents] = useState([]);

  // Modal Notification States
  const [feedbackModal, setFeedbackModal] = useState({
    isOpen: false,
    type: "success", // 'success' | 'error'
    title: "",
    message: "",
  });

  const [deleteConfirmModal, setDeleteConfirmModal] = useState({
    isOpen: false,
    eventId: null,
    title: "",
  });

  // Form State matching Postgres Schema
  const [formData, setFormData] = useState({
    title: "",
    category: "Academic",
    event_date: "",
    start_time: "",
    end_time: "",
    venue: "",
    description: "",
  });

  // Helper Feedback Functions
  const showFeedback = (type, title, message) => {
    setFeedbackModal({
      isOpen: true,
      type,
      title,
      message,
    });
  };

  const closeFeedbackModal = () => {
    setFeedbackModal((prev) => ({ ...prev, isOpen: false }));
  };

  // Fetch Events from Supabase
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setEvents(data || []);
    } catch (err) {
      console.error("Error fetching events:", err);
      showFeedback(
        "error",
        "Fetch Failed",
        err.message || "Could not load events from the database.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Add Event Handler (Exact Column Names)
  const handleAddEvent = async (e) => {
    e.preventDefault();
    if (
      !formData.title ||
      !formData.event_date ||
      !formData.venue ||
      !formData.start_time
    )
      return;

    try {
      setSubmitting(true);
      const newEventData = {
        title: formData.title,
        category: formData.category,
        event_date: formData.event_date,
        start_time: formData.start_time,
        end_time: formData.end_time || null,
        venue: formData.venue,
        description: formData.description,
        is_published: true,
      };

      const { data, error } = await supabase
        .from("events")
        .insert([newEventData])
        .select();

      if (error) throw error;

      if (data && data.length > 0) {
        setEvents((prev) => [data[0], ...prev]);
      } else {
        await fetchEvents();
      }

      setFormData({
        title: "",
        category: "Academic",
        event_date: "",
        start_time: "",
        end_time: "",
        venue: "",
        description: "",
      });
      setShowAddModal(false);
      showFeedback(
        "success",
        "Event Published",
        "The event has been successfully saved.",
      );
    } catch (err) {
      console.error("Error inserting event:", err);
      showFeedback(
        "error",
        "Publish Failed",
        err.message || "Failed to publish new event.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Trigger Delete Confirmation
  const promptDeleteEvent = (id, title) => {
    setDeleteConfirmModal({
      isOpen: true,
      eventId: id,
      title,
    });
  };

  // Confirm Delete Action
  const confirmDeleteEvent = async () => {
    const { eventId } = deleteConfirmModal;
    if (!eventId) return;

    try {
      setDeleteConfirmModal({ isOpen: false, eventId: null, title: "" });
      const { error } = await supabase
        .from("events")
        .delete()
        .eq("id", eventId);

      if (error) throw error;

      setEvents((prev) => prev.filter((event) => event.id !== eventId));
      showFeedback(
        "success",
        "Event Deleted",
        "The event has been permanently removed.",
      );
    } catch (err) {
      console.error("Error deleting event:", err);
      showFeedback(
        "error",
        "Delete Failed",
        err.message || "Unable to delete event.",
      );
    }
  };

  const filteredEvents = events.filter(
    (event) =>
      event.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.venue?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.category?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-slate-100 flex text-slate-800 font-sans">
      {/* Sidebar */}
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Mobile Header Bar */}
        <header className="md:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              <Menu size={20} />
            </button>
            <span className="font-bold text-slate-900 text-sm">
              Event Management
            </span>
          </div>
          <span className="text-xs px-2.5 py-1 bg-emerald-50 text-emerald-700 font-bold rounded-full border border-emerald-100">
            Exco
          </span>
        </header>

        {/* Content Body */}
        <main className="p-4 sm:p-8 space-y-6 max-w-6xl mx-auto w-full">
          {/* Header Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                <Calendar className="text-emerald-600" size={24} />
                <span>Events & Programs</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Create and manage upcoming department seminars, orientation, and
                workshops.
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm shrink-0 cursor-pointer"
            >
              <PlusCircle size={16} />
              <span>Add New Event</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Search events by title, category, or venue..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              />
            </div>
          </div>

          {/* Events List */}
          {loading ? (
            <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 flex flex-col items-center justify-center space-y-3">
              <Loader2 size={32} className="animate-spin text-emerald-600" />
              <p className="text-xs font-semibold text-slate-500">
                Fetching events...
              </p>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-400 space-y-2">
              <AlertCircle size={32} className="mx-auto text-slate-300" />
              <p className="text-sm font-semibold">No events found</p>
              <p className="text-xs">
                Try adjusting your search query or add a new event.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredEvents.map((event) => (
                <div
                  key={event.id}
                  className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 hover:border-slate-300 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 font-bold text-[10px] rounded-full border border-emerald-100">
                          {event.category || "General"}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 font-bold text-[10px] rounded-full border ${
                            event.is_published
                              ? "bg-blue-50 text-blue-700 border-blue-100"
                              : "bg-amber-50 text-amber-700 border-amber-100"
                          }`}
                        >
                          {event.is_published ? "Published" : "Draft"}
                        </span>
                      </div>
                      <h3 className="font-extrabold text-slate-900 text-base sm:text-lg leading-snug">
                        {event.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => promptDeleteEvent(event.id, event.title)}
                        className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors border border-transparent hover:border-rose-100 cursor-pointer"
                        title="Delete Event"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
                    {event.description}
                  </p>

                  {/* Metadata Bar */}
                  <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={14} className="text-emerald-600" />
                      <span className="font-semibold text-slate-700">
                        {event.event_date}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock size={14} className="text-emerald-600" />
                      <span>
                        {event.start_time}
                        {event.end_time ? ` - ${event.end_time}` : ""}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin size={14} className="text-emerald-600" />
                      <span>{event.venue}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Add Event Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                <PlusCircle size={20} className="text-emerald-600" />
                <span>Publish New Event</span>
              </h3>
              <button
                onClick={() => !submitting && setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleAddEvent} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">
                  Event Title *
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="e.g. Annual Academic Seminar"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 bg-white"
                  >
                    <option value="Academic">Academic</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Welfare">Welfare</option>
                    <option value="Orientation">Orientation</option>
                    <option value="General">General</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">
                    Event Date *
                  </label>
                  <input
                    type="date"
                    name="event_date"
                    required
                    value={formData.event_date}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">
                    Start Time *
                  </label>
                  <input
                    type="time"
                    name="start_time"
                    required
                    value={formData.start_time}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">End Time</label>
                  <input
                    type="time"
                    name="end_time"
                    value={formData.end_time}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Venue *</label>
                <input
                  type="text"
                  name="venue"
                  placeholder="e.g. CS Lab 1 / Auditorium"
                  required
                  value={formData.venue}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Description</label>
                <textarea
                  name="description"
                  rows="3"
                  placeholder="Provide brief details about what students should expect..."
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold cursor-pointer transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold cursor-pointer transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50"
                >
                  {submitting && <Loader2 size={14} className="animate-spin" />}
                  <span>{submitting ? "Saving..." : "Save & Publish"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-xl border border-slate-100">
            <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle size={24} />
            </div>
            <div className="space-y-1">
              <h3 className="font-extrabold text-slate-900 text-base">
                Delete Event?
              </h3>
              <p className="text-xs text-slate-500">
                Are you sure you want to delete "{deleteConfirmModal.title}"?
                This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() =>
                  setDeleteConfirmModal({
                    isOpen: false,
                    eventId: null,
                    title: "",
                  })
                }
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs rounded-xl font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteEvent}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs rounded-xl font-bold transition-colors shadow-sm cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success / Error Feedback Modal */}
      {feedbackModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-xl border border-slate-100">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto ${
                feedbackModal.type === "success"
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-rose-50 text-rose-600"
              }`}
            >
              {feedbackModal.type === "success" ? (
                <CheckCircle2 size={24} />
              ) : (
                <XCircle size={24} />
              )}
            </div>
            <div className="space-y-1">
              <h3 className="font-extrabold text-slate-900 text-base">
                {feedbackModal.title}
              </h3>
              <p className="text-xs text-slate-500">{feedbackModal.message}</p>
            </div>
            <button
              onClick={closeFeedbackModal}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs rounded-xl font-bold transition-colors shadow-sm cursor-pointer"
            >
              Okay, got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
