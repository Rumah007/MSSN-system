import { useState } from "react";
import AdminSidebar from "../admin/components/AdminSidebar";
import {
  Calendar,
  PlusCircle,
  Clock,
  MapPin,
  Tag,
  Trash2,
  Edit2,
  Menu,
  Search,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function AdminEventsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    category: "Academic",
    date: "",
    time: "",
    venue: "",
    description: "",
  });

  // Sample Events Data
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Freshers' Academic Orientation & Survival Guide Presentation",
      category: "Academic",
      date: "2026-08-12",
      time: "10:00 AM",
      venue: "Main Campus Auditorium, UDUS",
      description:
        "An essential guidance session for newly admitted students covering course registrations, CGPA calculation, and campus life.",
      status: "Upcoming",
    },
    {
      title: "Weekly Tafseer & Halqah Session",
      id: 2,
      category: "Spiritual",
      date: "2026-08-15",
      time: "04:30 PM",
      venue: "MSSN UDUS Central Mosque",
      description:
        "Weekly interactive Islamic study circle covering Surah An-Nisa with guest speaker Dr. Ahmad Abubakar.",
      status: "Upcoming",
    },
    {
      id: 3,
      title: "Skill Acquisition & Tech Empowerment Workshop",
      category: "Workshop",
      date: "2026-07-20",
      time: "09:00 AM",
      venue: "Faculty of Science Computer Lab",
      description:
        "Hands-on training session covering web design fundamentals, graphics design, and digital literacy.",
      status: "Completed",
    },
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddEvent = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.date || !formData.venue) return;

    const newEvent = {
      id: Date.now(),
      ...formData,
      status: "Upcoming",
    };

    setEvents([newEvent, ...events]);
    setFormData({
      title: "",
      category: "Academic",
      date: "",
      time: "",
      venue: "",
      description: "",
    });
    setShowAddModal(false);
  };

  const handleDeleteEvent = (id) => {
    if (confirm("Are you sure you want to delete this event?")) {
      setEvents(events.filter((event) => event.id !== id));
    }
  };

  const filteredEvents = events.filter(
    (event) =>
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.category.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-slate-100 flex text-slate-800 font-sans">
      {/* Reusable Sidebar */}
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content Area */}
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
          {/* Top Title & Quick Action */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                <Calendar className="text-emerald-600" size={24} />
                <span>Events & Programs</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Create and manage upcoming campus seminars, Halqahs, and
                workshops.
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer"
            >
              <PlusCircle size={16} />
              <span>Add New Event</span>
            </button>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
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
          <div className="space-y-4">
            {filteredEvents.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-400 space-y-2">
                <AlertCircle size={32} className="mx-auto text-slate-300" />
                <p className="text-sm font-semibold">No events found</p>
                <p className="text-xs">
                  Try adjusting your search query or add a new event.
                </p>
              </div>
            ) : (
              filteredEvents.map((event) => (
                <div
                  key={event.id}
                  className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 hover:border-slate-300 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 font-bold text-[10px] rounded-full border border-emerald-100">
                          {event.category}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 font-bold text-[10px] rounded-full border ${
                            event.status === "Upcoming"
                              ? "bg-blue-50 text-blue-700 border-blue-100"
                              : "bg-slate-100 text-slate-600 border-slate-200"
                          }`}
                        >
                          {event.status}
                        </span>
                      </div>
                      <h3 className="font-extrabold text-slate-900 text-base sm:text-lg leading-snug">
                        {event.title}
                      </h3>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleDeleteEvent(event.id)}
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
                        {event.date}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock size={14} className="text-emerald-600" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin size={14} className="text-emerald-600" />
                      <span>{event.venue}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>

      {/* Add Event Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                <PlusCircle size={20} className="text-emerald-600" />
                <span>Publish New Event</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
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
                  placeholder="e.g. Annual Islamic Career Orientation"
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
                    <option value="Spiritual">Spiritual</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Welfare">Welfare</option>
                    <option value="Orientation">Orientation</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">
                    Event Date *
                  </label>
                  <input
                    type="date"
                    name="date"
                    required
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Time *</label>
                  <input
                    type="text"
                    name="time"
                    placeholder="e.g. 04:30 PM"
                    required
                    value={formData.time}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Venue *</label>
                  <input
                    type="text"
                    name="venue"
                    placeholder="e.g. Central Mosque Hall"
                    required
                    value={formData.venue}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  />
                </div>
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
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold cursor-pointer transition-colors shadow-xs"
                >
                  Save & Publish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
