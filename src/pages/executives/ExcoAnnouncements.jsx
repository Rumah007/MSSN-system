import { useState } from "react";
import {
  Megaphone,
  Plus,
  Search,
  Pin,
  Menu,
  Clock,
  Trash2,
  X,
  AlertTriangle,
  Send,
  Users,
} from "lucide-react";
import ExcoSidebar from "./components/ExcoSidebar";

export default function ExcoAnnouncements() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Sample Announcements Data
  const [announcements, setAnnouncements] = useState([
    {
      id: 1,
      title: "Venue Change: Annual Tech Orientation Workshop",
      category: "Urgent",
      targetAudience: "All Students",
      author: "Public Relations Officer",
      date: "2026-07-28",
      time: "09:30 AM",
      isPinned: true,
      content:
        "Please note that the Annual Tech Orientation has been moved from Hall B to the PTDF Lecture Theatre due to high registration numbers. Timing remains 10:00 AM.",
    },
    {
      id: 2,
      title: "400L Project Submission & Clearance Guidelines",
      category: "Academic",
      targetAudience: "400L",
      author: "Academic Director",
      date: "2026-07-25",
      time: "02:15 PM",
      isPinned: true,
      content:
        "All final-year students are requested to complete their departmental clearance form online prior to submitting hard copies to the department coordinator.",
    },
    {
      id: 3,
      title: "Inter-Departmental Football Registration Open",
      category: "Sports",
      targetAudience: "All Students",
      author: "Sports Director",
      date: "2026-07-20",
      time: "11:00 AM",
      isPinned: false,
      content:
        "Level representatives should submit team player lists to the Sports Director by Friday evening. Match fixtures will be released shortly after.",
    },
    {
      id: 4,
      title: "Exco Executive Committee Meeting Briefing",
      category: "General",
      targetAudience: "Exco Officers",
      author: "General Secretary",
      date: "2026-07-15",
      time: "04:00 PM",
      isPinned: false,
      content:
        "Briefing document following the Q2 leadership summit is now available for review in the secretariat shared folder.",
    },
  ]);

  // Form State for New Announcement
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("General");
  const [newTarget, setNewTarget] = useState("All Students");
  const [newContent, setNewContent] = useState("");
  const [isPinned, setIsPinned] = useState(false);

  // Handle Publish
  const handlePublish = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const created = {
      id: Date.now(),
      title: newTitle,
      category: newCategory,
      targetAudience: newTarget,
      author: "Exco Officer",
      date: "2026-07-29",
      time: "11:42 AM",
      isPinned,
      content: newContent,
    };

    setAnnouncements([created, ...announcements]);
    setNewTitle("");
    setNewContent("");
    setIsPinned(false);
    setShowCreateModal(false);
  };

  // Toggle Pin
  const togglePin = (id) => {
    setAnnouncements(
      announcements.map((item) =>
        item.id === id ? { ...item, isPinned: !item.isPinned } : item,
      ),
    );
  };

  // Delete Announcement
  const handleDelete = (id) => {
    setAnnouncements(announcements.filter((item) => item.id !== id));
  };

  // Filter Logic
  const filtered = announcements.filter((item) => {
    const matchesCat =
      selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-100 flex text-slate-800 font-sans">
      {/* Shared Sidebar with 'announcements' set active */}
      <ExcoSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activePath="announcements"
      />

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
              Announcements
            </span>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-teal-50 text-teal-700 border border-teal-100">
            Broadcaster
          </span>
        </header>

        {/* Body Container */}
        <main className="p-4 sm:p-8 space-y-6 max-w-6xl mx-auto w-full">
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">
                Broadcast & Announcements
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Post official notices, send target level alerts, and manage
                student feed broadcasts.
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs transition-colors shadow-xs"
            >
              <Plus size={16} />
              <span>New Announcement</span>
            </button>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Search notices by keyword or title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-teal-500 text-slate-800 placeholder:text-slate-400"
                />
              </div>

              {/* Category Filters */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                {["All", "Urgent", "Academic", "Sports", "General"].map(
                  (cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                        selectedCategory === cat
                          ? "bg-teal-600 text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {cat}
                    </button>
                  ),
                )}
              </div>
            </div>
          </div>

          {/* Announcements Feed */}
          <div className="space-y-4">
            {filtered.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 space-y-3">
                <Megaphone className="mx-auto text-slate-300" size={40} />
                <p className="text-sm font-bold text-slate-700">
                  No announcements found
                </p>
                <p className="text-xs text-slate-400">
                  Try adjusting your search or category filter.
                </p>
              </div>
            ) : (
              filtered.map((item) => (
                <div
                  key={item.id}
                  className={`bg-white rounded-2xl border p-5 shadow-xs transition-all ${
                    item.isPinned
                      ? "border-teal-300 bg-teal-50/20"
                      : "border-slate-200"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        {item.isPinned && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-teal-700 bg-teal-100/70 border border-teal-200 px-2 py-0.5 rounded-md">
                            <Pin size={10} className="fill-teal-700" /> Pinned
                          </span>
                        )}
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            item.category === "Urgent"
                              ? "bg-rose-50 text-rose-700 border border-rose-200"
                              : item.category === "Academic"
                                ? "bg-sky-50 text-sky-700 border border-sky-200"
                                : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {item.category}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md inline-flex items-center gap-1">
                          <Users size={10} /> {item.targetAudience}
                        </span>
                      </div>
                      <h3 className="font-extrabold text-slate-900 text-base mt-2 leading-snug">
                        {item.title}
                      </h3>
                    </div>

                    {/* Quick Management Buttons */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => togglePin(item.id)}
                        title={item.isPinned ? "Unpin notice" : "Pin notice"}
                        className={`p-1.5 rounded-lg border text-xs transition-colors ${
                          item.isPinned
                            ? "bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100"
                            : "bg-slate-50 text-slate-400 border-slate-200 hover:text-slate-600"
                        }`}
                      >
                        <Pin size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        title="Delete notice"
                        className="p-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-400 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <p className="text-slate-600 text-xs mt-3 leading-relaxed whitespace-pre-line">
                    {item.content}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-medium text-slate-500">
                      Posted by:{" "}
                      <strong className="text-slate-700">{item.author}</strong>
                    </span>
                    <div className="flex items-center gap-1">
                      <Clock size={12} />
                      <span>
                        {item.date} • {item.time}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>

      {/* Create Announcement Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handlePublish}
            className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Send size={18} className="text-teal-600" />
                <h3 className="font-extrabold text-slate-900 text-base">
                  New Official Announcement
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Title / Subject
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="E.g., Important update on lecture timetable..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-hidden focus:ring-2 focus:ring-teal-500 font-medium text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-hidden focus:ring-2 focus:ring-teal-500 font-medium text-slate-800"
                  >
                    <option value="General">General</option>
                    <option value="Academic">Academic</option>
                    <option value="Urgent">Urgent</option>
                    <option value="Sports">Sports</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Target Audience
                  </label>
                  <select
                    value={newTarget}
                    onChange={(e) => setNewTarget(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-hidden focus:ring-2 focus:ring-teal-500 font-medium text-slate-800"
                  >
                    <option value="All Students">All Students</option>
                    <option value="100L">100L Only</option>
                    <option value="200L">200L Only</option>
                    <option value="300L">300L Only</option>
                    <option value="400L">400L Only</option>
                    <option value="Exco Officers">Exco Officers</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Announcement Details
                </label>
                <textarea
                  rows={4}
                  required
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Write full announcement description here..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-hidden focus:ring-2 focus:ring-teal-500 font-medium text-slate-800 resize-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="pinCheck"
                  checked={isPinned}
                  onChange={(e) => setIsPinned(e.target.checked)}
                  className="rounded-md text-teal-600 focus:ring-teal-500 h-4 w-4 border-slate-300"
                />
                <label
                  htmlFor="pinCheck"
                  className="font-bold text-slate-700 text-xs cursor-pointer select-none"
                >
                  Pin this announcement to top of student feeds
                </label>
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs transition-colors"
              >
                Publish Broadcast
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
