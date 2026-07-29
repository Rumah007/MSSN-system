import { useState } from "react";
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
} from "lucide-react";
import ExcoSidebar from "./components/ExcoSidebar";

export default function ExcoPrograms() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Upcoming");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Sample Programs Data
  const programs = [
    {
      id: 1,
      title: "Annual Tech Orientation & Workshop",
      category: "Academic",
      date: "August 15, 2026",
      time: "10:00 AM - 02:00 PM",
      venue: "PTDF Lecture Theatre",
      capacity: 350,
      registeredCount: 284,
      status: "Upcoming",
      wing: "Academic Wing",
      budget: "₦150,000",
      description:
        "Comprehensive welcome event for freshers and returning students featuring industry speaker sessions, Git/GitHub workshops, and career pathing guidance.",
    },
    {
      id: 2,
      title: "Cybersecurity Hands-on Bootcamp",
      category: "Workshop",
      date: "August 22, 2026",
      time: "11:00 AM - 04:00 PM",
      venue: "Computer Lab 2",
      capacity: 80,
      registeredCount: 80,
      status: "Upcoming",
      wing: "Academic Wing",
      budget: "₦45,000",
      description:
        "Practical introduction to ethical hacking, network analysis, and web security basics. Limited seat availability due to lab capacity.",
    },
    {
      id: 3,
      title: "Inter-Level Football & Sports Fiesta",
      category: "Sports",
      date: "July 20, 2026",
      time: "08:00 AM - 05:00 PM",
      venue: "Main Campus Sports Complex",
      capacity: 500,
      registeredCount: 412,
      status: "Completed",
      wing: "Sports & Welfare",
      budget: "₦210,000",
      description:
        "Annual inter-class tournament aimed at fostering community engagement and sportsmanship across all academic levels.",
    },
    {
      id: 4,
      title: "Exco Quarterly Leadership Strategy Summit",
      category: "Leadership",
      date: "July 05, 2026",
      time: "02:00 PM - 05:00 PM",
      venue: "Faculty Boardroom",
      capacity: 30,
      registeredCount: 28,
      status: "Completed",
      wing: "Secretariat",
      budget: "₦30,000",
      description:
        "Internal executive retreat to evaluate semester progress, review budget expenditures, and finalize upcoming events roadmap.",
    },
  ];

  // Filtering Logic
  const filteredPrograms = programs.filter((prog) => {
    const matchesTab = activeTab === "All" || prog.status === activeTab;
    const matchesSearch =
      prog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prog.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prog.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

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
              className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
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
                Schedule departmental events, track student registration counts,
                and manage event logistics.
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs transition-colors shadow-xs"
            >
              <Plus size={16} />
              <span>Create New Program</span>
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                {programs.filter((p) => p.status === "Upcoming").length}
              </p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-slate-400 text-[11px] font-medium block">
                Total Registrations
              </span>
              <p className="text-xl font-extrabold text-slate-900 mt-1">
                {programs.reduce((acc, curr) => acc + curr.registeredCount, 0)}
              </p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-slate-400 text-[11px] font-medium block">
                Completed Events
              </span>
              <p className="text-xl font-extrabold text-emerald-600 mt-1">
                {programs.filter((p) => p.status === "Completed").length}
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
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex-1 sm:flex-none text-center ${
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPrograms.length === 0 ? (
              <div className="col-span-full bg-white p-12 text-center rounded-2xl border border-slate-200 space-y-3">
                <Calendar className="mx-auto text-slate-300" size={40} />
                <p className="text-sm font-bold text-slate-700">
                  No programs found
                </p>
                <p className="text-xs text-slate-400">
                  Try adjusting your search criteria or switch tabs.
                </p>
              </div>
            ) : (
              filteredPrograms.map((prog) => {
                const fillPercentage = Math.round(
                  (prog.registeredCount / prog.capacity) * 100,
                );

                return (
                  <div
                    key={prog.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 uppercase tracking-wider">
                          {prog.category}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                            prog.status === "Upcoming"
                              ? "bg-teal-50 text-teal-700 border-teal-100"
                              : "bg-slate-50 text-slate-600 border-slate-200"
                          }`}
                        >
                          {prog.status}
                        </span>
                      </div>

                      <div>
                        <h3 className="font-extrabold text-slate-900 text-base leading-snug">
                          {prog.title}
                        </h3>
                        <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                          {prog.description}
                        </p>
                      </div>

                      <div className="space-y-1.5 text-xs text-slate-600 pt-1">
                        <div className="flex items-center gap-2">
                          <Calendar
                            size={14}
                            className="text-teal-600 shrink-0"
                          />
                          <span>{prog.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock
                            size={14}
                            className="text-slate-400 shrink-0"
                          />
                          <span>{prog.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin
                            size={14}
                            className="text-slate-400 shrink-0"
                          />
                          <span>{prog.venue}</span>
                        </div>
                      </div>
                    </div>

                    {/* Progress & Actions */}
                    <div className="pt-3 border-t border-slate-100 space-y-3">
                      <div>
                        <div className="flex justify-between text-[11px] font-semibold text-slate-600 mb-1">
                          <span>Registrations</span>
                          <span>
                            {prog.registeredCount} / {prog.capacity} (
                            {fillPercentage}%)
                          </span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              fillPercentage >= 100
                                ? "bg-amber-500"
                                : "bg-teal-600"
                            }`}
                            style={{
                              width: `${Math.min(fillPercentage, 100)}%`,
                            }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-slate-700">
                          {prog.budget}{" "}
                          <span className="text-[10px] font-normal text-slate-400">
                            Budget
                          </span>
                        </span>
                        <button
                          onClick={() => setSelectedProgram(prog)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-xl text-xs transition-colors inline-flex items-center gap-1"
                        >
                          <span>Manage Program</span>
                          <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
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
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <span className="text-[10px] font-bold text-teal-700 bg-teal-50 border border-teal-100 px-2.5 py-0.5 rounded-md">
                  {selectedProgram.category} • {selectedProgram.wing}
                </span>
                <h4 className="font-extrabold text-base text-slate-900 mt-2">
                  {selectedProgram.title}
                </h4>
                <p className="text-slate-600 mt-1 leading-relaxed">
                  {selectedProgram.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <div>
                  <span className="text-[10px] text-slate-400 block">
                    Date & Time
                  </span>
                  <span className="font-bold text-slate-800">
                    {selectedProgram.date}
                  </span>
                  <span className="block text-[10px] text-slate-500">
                    {selectedProgram.time}
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
                    Allocation Budget
                  </span>
                  <span className="font-bold text-slate-800">
                    {selectedProgram.budget}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">
                    Cap Capacity
                  </span>
                  <span className="font-bold text-slate-800">
                    {selectedProgram.capacity} Seats
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={() => setSelectedProgram(null)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl transition-colors text-xs"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Program Creation Placeholder Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base">
                Create New Event / Program
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Program Title
                </label>
                <input
                  type="text"
                  placeholder="E.g., Tech Quiz Competition"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Category
                  </label>
                  <select className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-hidden focus:ring-2 focus:ring-teal-500">
                    <option>Academic</option>
                    <option>Workshop</option>
                    <option>Sports</option>
                    <option>Social</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Capacity
                  </label>
                  <input
                    type="number"
                    placeholder="100"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 flex gap-2">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 py-2 bg-teal-600 text-white font-bold rounded-xl text-xs hover:bg-teal-700"
              >
                Save Program
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
