import { useState, useEffect, useCallback } from "react";
import {
  Megaphone,
  Plus,
  Search,
  Menu,
  Clock,
  Trash2,
  X,
  Send,
  Loader2,
  AlertCircle,
} from "lucide-react";
import ExcoSidebar from "./components/ExcoSidebar";
import { supabase } from "../../supabaseClient"; // Adjust path to match your project

export default function ExcoAnnouncements() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Data States
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentExco, setCurrentExco] = useState(null);

  // Form State matching the database `announcements` table
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "General",
    priority: "normal",
    is_published: true,
  });

  // Fetch current user details from `profiles`
  const fetchUserProfile = useCallback(async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, exco_role")
          .eq("id", user.id)
          .single();

        if (profile) setCurrentExco(profile);
      }
    } catch (err) {
      console.error("Error fetching user profile:", err.message);
    }
  }, []);

  // Fetch announcements from Supabase
  const fetchAnnouncements = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("announcements")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setAnnouncements(data || []);
    } catch (error) {
      console.error("Error fetching announcements:", error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserProfile();
    fetchAnnouncements();
  }, [fetchUserProfile, fetchAnnouncements]);

  // Form Field Handler
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Publish Announcement
  const handlePublish = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) return;

    setSubmitting(true);
    try {
      const payload = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        category: formData.category,
        priority: formData.priority,
        is_published: formData.is_published,
      };

      const { data, error } = await supabase
        .from("announcements")
        .insert([payload])
        .select();

      if (error) throw error;

      if (data && data.length > 0) {
        setAnnouncements((prev) => [data[0], ...prev]);
      }

      // Reset state
      setFormData({
        title: "",
        content: "",
        category: "General",
        priority: "normal",
        is_published: true,
      });
      setShowCreateModal(false);
    } catch (error) {
      alert("Failed to publish announcement: " + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Announcement
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this announcement?")) return;

    try {
      const { error } = await supabase
        .from("announcements")
        .delete()
        .eq("id", id);

      if (error) throw error;
      setAnnouncements((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      alert("Error deleting announcement: " + error.message);
    }
  };

  // Filter Logic
  const filtered = announcements.filter((item) => {
    const matchesCat =
      selectedCategory === "All"
        ? true
        : item.category?.toLowerCase() === selectedCategory.toLowerCase();

    const matchesSearch =
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCat && matchesSearch;
  });

  const renderPriorityBadge = (priority) => {
    switch (priority) {
      case "urgent":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md">
            <AlertCircle size={10} /> Urgent
          </span>
        );
      case "high":
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200">
            High Priority
          </span>
        );
      default:
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
            Normal
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex text-slate-800 font-sans">
      {/* Sidebar */}
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
              className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
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
              <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                <Megaphone className="text-teal-600" size={24} />
                <span>Broadcast & Announcements</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Post official notices, broadcast updates, and dispatch student
                feed alerts.
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs transition-colors shadow-xs cursor-pointer shrink-0"
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
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800 placeholder:text-slate-400"
                />
              </div>

              {/* Category Filters */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                {["All", "General", "Academic", "Events", "Halqah"].map(
                  (cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
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
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-slate-200 text-slate-400">
              <Loader2 className="animate-spin mb-2 text-teal-600" size={28} />
              <p className="text-xs font-medium">Fetching broadcasts...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 space-y-3">
              <Megaphone className="mx-auto text-slate-300" size={40} />
              <p className="text-sm font-bold text-slate-700">
                No announcements found
              </p>
              <p className="text-xs text-slate-400">
                Try adjusting your search query or post a new announcement.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs transition-all hover:border-slate-300"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 capitalize">
                          {item.category || "General"}
                        </span>
                        {renderPriorityBadge(item.priority)}
                        {!item.is_published && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200">
                            Draft
                          </span>
                        )}
                      </div>
                      <h3 className="font-extrabold text-slate-900 text-base mt-2 leading-snug">
                        {item.title}
                      </h3>
                    </div>

                    <button
                      onClick={() => handleDelete(item.id)}
                      title="Delete notice"
                      className="p-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-400 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition-colors cursor-pointer shrink-0"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <p className="text-slate-600 text-xs mt-3 leading-relaxed whitespace-pre-line">
                    {item.content}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-medium text-slate-500">
                      Author:{" "}
                      <strong className="text-slate-700">
                        {currentExco?.full_name
                          ? `${currentExco.full_name} (${currentExco.exco_role || "Exco"})`
                          : "Executive Committee"}
                      </strong>
                    </span>
                    <div className="flex items-center gap-1">
                      <Clock size={12} />
                      <span>
                        {new Date(item.created_at).toLocaleDateString(
                          undefined,
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Create Announcement Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handlePublish}
            className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full p-6 space-y-4"
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
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Title / Subject *
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="E.g., Important update on lecture timetable..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium text-slate-800 capitalize"
                  >
                    <option value="General">General</option>
                    <option value="Academic">Academic</option>
                    <option value="Events">Events</option>
                    <option value="Halqah">Halqah</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Priority Level
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium text-slate-800"
                  >
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Announcement Content *
                </label>
                <textarea
                  name="content"
                  rows={4}
                  required
                  value={formData.content}
                  onChange={handleInputChange}
                  placeholder="Write full announcement description here..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium text-slate-800 resize-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="is_published"
                  name="is_published"
                  checked={formData.is_published}
                  onChange={handleInputChange}
                  className="rounded-md text-teal-600 focus:ring-teal-500 h-4 w-4 border-slate-300 cursor-pointer"
                />
                <label
                  htmlFor="is_published"
                  className="font-bold text-slate-700 text-xs cursor-pointer select-none"
                >
                  Publish immediately to student feed
                </label>
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting && <Loader2 className="animate-spin" size={14} />}
                <span>
                  {submitting ? "Publishing..." : "Publish Broadcast"}
                </span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
