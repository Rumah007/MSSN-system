import { useState, useEffect } from "react";
import AdminSidebar from "../admin/components/AdminSidebar";
import { supabase } from "../../supabaseClient";
import {
  MessageSquare,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Trash2,
  Menu,
  AlertCircle,
  X,
  Loader2,
  Eye,
  ShieldCheck,
  Lightbulb,
  Sparkles,
  AlertTriangle,
  HelpCircle,
} from "lucide-react";

export default function AdminFeedbackPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // Fetch Feedback from Supabase
  const fetchFeedback = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("feedback")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setFeedbackList(data || []);
    } catch (err) {
      console.error("Error fetching feedback:", err.message);
      setErrorMsg("Failed to load feedback entries.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  // Filter Logic
  const filteredFeedback = feedbackList.filter((item) => {
    const matchesSearch =
      (item.title &&
        item.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.message &&
        item.message.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      categoryFilter === "All" ||
      item.type?.toLowerCase() === categoryFilter.toLowerCase();

    const matchesStatus =
      statusFilter === "All" ||
      item.status?.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Toggle Status directly in Supabase
  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "resolved" ? "new" : "resolved";

    try {
      const { error } = await supabase
        .from("feedback")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;

      setFeedbackList((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: newStatus } : item,
        ),
      );

      if (selectedFeedback?.id === id) {
        setSelectedFeedback((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      console.error("Error updating status:", err.message);
      alert("Failed to update status. Please try again.");
    }
  };

  // Delete Feedback Row
  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this feedback entry?")) {
      try {
        const { error } = await supabase.from("feedback").delete().eq("id", id);

        if (error) throw error;

        setFeedbackList((prev) => prev.filter((item) => item.id !== id));
        if (selectedFeedback?.id === id) setSelectedFeedback(null);
      } catch (err) {
        console.error("Error deleting item:", err.message);
        alert("Failed to delete entry.");
      }
    }
  };

  // Helper function for rendering category badges
  const renderCategoryBadge = (type) => {
    switch (type?.toLowerCase()) {
      case "suggestion":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 font-bold text-[10px] rounded-md">
            <Lightbulb size={10} /> Suggestion
          </span>
        );
      case "idea":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[10px] rounded-md">
            <Sparkles size={10} /> Idea
          </span>
        );
      case "complaint":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 font-bold text-[10px] rounded-md">
            <AlertTriangle size={10} /> Complaint
          </span>
        );
      case "inquiry":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-sky-50 text-sky-700 border border-sky-200 font-bold text-[10px] rounded-md">
            <HelpCircle size={10} /> Inquiry
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 bg-slate-100 text-slate-600 font-bold text-[10px] rounded-md capitalize">
            {type || "General"}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex text-slate-800 font-sans">
      {/* Sidebar */}
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

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
              Suggestion Box Admin
            </span>
          </div>
          <span className="text-xs px-2.5 py-1 bg-emerald-50 text-emerald-700 font-bold rounded-full border border-emerald-100">
            Exco
          </span>
        </header>

        {/* Content Body */}
        <main className="p-4 sm:p-8 space-y-6 max-w-6xl mx-auto w-full">
          {/* Header Title */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                <MessageSquare className="text-emerald-600" size={24} />
                <span>Virtual Suggestion Box & Feedback</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Review anonymous submissions, handle complaints, and evaluate
                ideas submitted by students.
              </p>
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <p className="text-xs text-slate-500 font-medium">
                Total Feedback
              </p>
              <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                {feedbackList.length}
              </h3>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <p className="text-xs text-slate-500 font-medium">
                New / Unresolved
              </p>
              <h3 className="text-xl font-extrabold text-amber-600 mt-1">
                {feedbackList.filter((f) => f.status !== "resolved").length}
              </h3>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <p className="text-xs text-slate-500 font-medium">Resolved</p>
              <h3 className="text-xl font-extrabold text-emerald-600 mt-1">
                {feedbackList.filter((f) => f.status === "resolved").length}
              </h3>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <p className="text-xs text-slate-500 font-medium">Filtered</p>
              <h3 className="text-xl font-extrabold text-slate-700 mt-1">
                {filteredFeedback.length}
              </h3>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Search by title or message contents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <Filter
                size={14}
                className="text-slate-400 shrink-0 hidden sm:block"
              />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full md:w-40 px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-medium capitalize"
              >
                <option value="All">All Types</option>
                <option value="suggestion">Suggestions</option>
                <option value="idea">Ideas</option>
                <option value="complaint">Complaints</option>
                <option value="inquiry">Inquiries</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full md:w-32 px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-medium capitalize"
              >
                <option value="All">All Statuses</option>
                <option value="new">New</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
          </div>

          {/* Feedback Items List */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden divide-y divide-slate-100">
            {loading ? (
              <div className="p-12 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
                <Loader2 size={18} className="animate-spin text-emerald-600" />
                <span>Loading submissions...</span>
              </div>
            ) : errorMsg ? (
              <div className="p-10 text-center text-red-500 text-xs">
                {errorMsg}
              </div>
            ) : filteredFeedback.length === 0 ? (
              <div className="p-10 text-center text-slate-400 text-xs">
                No feedback submissions match your criteria.
              </div>
            ) : (
              filteredFeedback.map((item) => (
                <div
                  key={item.id}
                  className="p-4 sm:p-5 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-start justify-between gap-4"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      {renderCategoryBadge(item.type)}
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-500 text-[11px] font-medium flex items-center gap-1">
                        <ShieldCheck size={12} className="text-emerald-600" />
                        Anonymous Student
                      </span>
                    </div>

                    <h3 className="font-extrabold text-slate-900 text-sm">
                      {item.title}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {item.message}
                    </p>

                    <div className="flex items-center gap-4 text-[10px] text-slate-400 pt-1">
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {new Date(item.created_at).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Status & Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-start">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border capitalize ${
                        item.status === "resolved"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                          : "bg-amber-50 text-amber-700 border-amber-100"
                      }`}
                    >
                      {item.status === "resolved" ? (
                        <CheckCircle2 size={12} />
                      ) : (
                        <AlertCircle size={12} />
                      )}
                      {item.status || "new"}
                    </span>

                    <button
                      onClick={() => setSelectedFeedback(item)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Eye size={14} />
                      <span>View</span>
                    </button>

                    <button
                      onClick={() => toggleStatus(item.id, item.status)}
                      className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                      title={
                        item.status === "resolved"
                          ? "Mark as Unresolved"
                          : "Mark as Resolved"
                      }
                    >
                      <CheckCircle2 size={16} />
                    </button>

                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete Entry"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>

      {/* View Drawer Modal */}
      {selectedFeedback && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-5 shadow-xl border border-slate-100 relative">
            <button
              onClick={() => setSelectedFeedback(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="space-y-1.5 pr-6">
              <div>{renderCategoryBadge(selectedFeedback.type)}</div>
              <h3 className="font-extrabold text-slate-900 text-lg">
                {selectedFeedback.title}
              </h3>
              <p className="text-xs text-slate-400">
                Submitted anonymously on{" "}
                {new Date(selectedFeedback.created_at).toLocaleString()}
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-700 leading-relaxed max-h-60 overflow-y-auto whitespace-pre-wrap">
              {selectedFeedback.message}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() =>
                  toggleStatus(selectedFeedback.id, selectedFeedback.status)
                }
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedFeedback.status === "resolved"
                    ? "bg-amber-100 text-amber-800 hover:bg-amber-200"
                    : "bg-emerald-700 text-white hover:bg-emerald-800"
                }`}
              >
                <CheckCircle2 size={14} />
                <span>
                  {selectedFeedback.status === "resolved"
                    ? "Mark as Unresolved"
                    : "Mark as Resolved"}
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleDelete(selectedFeedback.id)}
                className="px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
              >
                <Trash2 size={14} />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
