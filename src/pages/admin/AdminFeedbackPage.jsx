import { useState } from "react";
import AdminSidebar from "../admin/components/AdminSidebar";
import {
  MessageSquare,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Trash2,
  Menu,
  Mail,
  User,
  AlertCircle,
  CornerUpLeft,
  X,
  Send,
} from "lucide-react";

export default function AdminFeedbackPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");

  // Sample Feedback & Contact Messages Data
  const [feedbackList, setFeedbackList] = useState([
    {
      id: "FB-101",
      senderName: "Kabir Abubakar",
      senderEmail: "kabir.a@student.udus.edu.ng",
      matricNo: "UDUS/CS/2022/0045",
      category: "Academic Query",
      subject: "Issue accessing 200L CS lecture PDFs",
      message:
        "Assalamu Alaikum, I tried downloading the 200L Computer Science Past Questions PDF from the resources tab, but the drive link gives a 404 error. Could you please update the link?",
      status: "Pending",
      dateSent: "2026-07-28 14:30",
    },
    {
      id: "FB-102",
      senderName: "Zainab Usman",
      senderEmail: "zainab.u@student.udus.edu.ng",
      matricNo: "UDUS/BCH/2021/0112",
      category: "Event Inquiry",
      subject: "Registration confirmation for Islamic Leadership Seminar",
      message:
        "Ma'asalam. I filled out the registration form for the upcoming leadership seminar but haven't received an email confirmation yet. Please verify if my spot is reserved.",
      status: "Resolved",
      dateSent: "2026-07-26 09:15",
    },
    {
      id: "FB-103",
      senderName: "Anonymous Student",
      senderEmail: "anon@student.udus.edu.ng",
      matricNo: "N/A",
      category: "Portal Suggestion",
      subject: "Dark Mode toggle for night reading",
      message:
        "It would be really helpful if the student dashboard had a Dark Mode toggle! Reading course guides late at night gets bright on the eyes.",
      status: "Pending",
      dateSent: "2026-07-24 22:00",
    },
    {
      id: "FB-104",
      senderName: "Ibrahim Sani",
      senderEmail: "ibrahim.s@student.udus.edu.ng",
      matricNo: "UDUS/PHY/2023/0089",
      category: "General Inquiry",
      subject: "Halqah schedule clarification",
      message:
        "Are the weekly Halqah sessions held at the Central Mosque or the Faculty Mosque during exam week? Thanks!",
      status: "Resolved",
      dateSent: "2026-07-20 16:45",
    },
  ]);

  // Filter Logic
  const filteredFeedback = feedbackList.filter((item) => {
    const matchesSearch =
      item.senderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.senderEmail.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      categoryFilter === "All" || item.category === categoryFilter;
    const matchesStatus =
      statusFilter === "All" || item.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const toggleStatus = (id) => {
    setFeedbackList((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: item.status === "Pending" ? "Resolved" : "Pending",
            }
          : item,
      ),
    );
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this message?")) {
      setFeedbackList((prev) => prev.filter((item) => item.id !== id));
      if (selectedFeedback?.id === id) setSelectedFeedback(null);
    }
  };

  const handleSendReply = (e) => {
    e.preventDefault();
    if (!replyMessage) return;
    alert(`Reply sent to ${selectedFeedback.senderEmail}!`);
    toggleStatus(selectedFeedback.id);
    setReplyMessage("");
    setSelectedFeedback(null);
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
              Student Inquiries
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
                <span>Student Feedback & Inquiries</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Review messages, resolve student complaints, and manage portal
                suggestions.
              </p>
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <p className="text-xs text-slate-500 font-medium">
                Total Messages
              </p>
              <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                {feedbackList.length}
              </h3>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <p className="text-xs text-slate-500 font-medium">
                Pending Action
              </p>
              <h3 className="text-xl font-extrabold text-amber-600 mt-1">
                {feedbackList.filter((f) => f.status === "Pending").length}
              </h3>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <p className="text-xs text-slate-500 font-medium">Resolved</p>
              <h3 className="text-xl font-extrabold text-emerald-600 mt-1">
                {feedbackList.filter((f) => f.status === "Resolved").length}
              </h3>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <p className="text-xs text-slate-500 font-medium">
                Filtered Results
              </p>
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
                placeholder="Search by sender, subject, or contents..."
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
                className="w-full md:w-44 px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-medium"
              >
                <option value="All">All Categories</option>
                <option value="Academic Query">Academic Query</option>
                <option value="Event Inquiry">Event Inquiry</option>
                <option value="Portal Suggestion">Portal Suggestion</option>
                <option value="General Inquiry">General Inquiry</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full md:w-32 px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-medium"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
          </div>

          {/* Feedback Items List */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden divide-y divide-slate-100">
            {filteredFeedback.length === 0 ? (
              <div className="p-10 text-center text-slate-400 text-xs">
                No inquiries or messages match your criteria.
              </div>
            ) : (
              filteredFeedback.map((item) => (
                <div
                  key={item.id}
                  className="p-4 sm:p-5 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-start justify-between gap-4"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="font-bold text-slate-900">
                        {item.senderName}
                      </span>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-500 text-[11px] font-mono">
                        {item.matricNo}
                      </span>
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-600 font-bold text-[10px] rounded-md">
                        {item.category}
                      </span>
                    </div>

                    <h3 className="font-extrabold text-slate-900 text-sm">
                      {item.subject}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {item.message}
                    </p>

                    <div className="flex items-center gap-4 text-[10px] text-slate-400 pt-1">
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {item.dateSent}
                      </span>
                      <span className="flex items-center gap-1">
                        <Mail size={12} />
                        {item.senderEmail}
                      </span>
                    </div>
                  </div>

                  {/* Status & Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-start">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        item.status === "Resolved"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                          : "bg-amber-50 text-amber-700 border-amber-100"
                      }`}
                    >
                      {item.status === "Resolved" ? (
                        <CheckCircle2 size={12} />
                      ) : (
                        <AlertCircle size={12} />
                      )}
                      {item.status}
                    </span>

                    <button
                      onClick={() => setSelectedFeedback(item)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 transition-colors cursor-pointer"
                    >
                      View & Reply
                    </button>

                    <button
                      onClick={() => toggleStatus(item.id)}
                      className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                      title={
                        item.status === "Pending"
                          ? "Mark as Resolved"
                          : "Mark as Pending"
                      }
                    >
                      <CheckCircle2 size={16} />
                    </button>

                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete Message"
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

      {/* View & Reply Drawer Modal */}
      {selectedFeedback && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-5 shadow-xl border border-slate-100 relative">
            <button
              onClick={() => setSelectedFeedback(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
            >
              <X size={18} />
            </button>

            <div className="space-y-1 pr-6">
              <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 font-bold text-[10px] rounded-full border border-emerald-100">
                {selectedFeedback.category}
              </span>
              <h3 className="font-extrabold text-slate-900 text-lg">
                {selectedFeedback.subject}
              </h3>
              <p className="text-xs text-slate-400">
                From{" "}
                <strong className="text-slate-700">
                  {selectedFeedback.senderName}
                </strong>{" "}
                ({selectedFeedback.senderEmail}) on {selectedFeedback.dateSent}
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-700 leading-relaxed max-h-48 overflow-y-auto">
              {selectedFeedback.message}
            </div>

            {/* Quick Reply Form */}
            <form onSubmit={handleSendReply} className="space-y-3 pt-2">
              <label className="block text-xs font-bold text-slate-800">
                Send Reply / Response
              </label>
              <textarea
                rows="3"
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                placeholder="Type your response to send directly to the student's email..."
                className="w-full p-3 text-xs rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              />

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => toggleStatus(selectedFeedback.id)}
                  className="text-xs font-bold text-slate-600 hover:text-emerald-700 cursor-pointer"
                >
                  {selectedFeedback.status === "Pending"
                    ? "Mark Resolved without email"
                    : "Mark as Pending"}
                </button>

                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
                >
                  <Send size={14} />
                  <span>Send Reply</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
