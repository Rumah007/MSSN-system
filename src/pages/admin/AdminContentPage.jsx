import { useState } from "react";
import AdminSidebar from "../admin/components/AdminSidebar";
import {
  Upload,
  FileText,
  Headphones,
  Image as ImageIcon,
  PlusCircle,
  Trash2,
  Menu,
  CheckCircle2,
  Search,
  ExternalLink,
} from "lucide-react";

export default function AdminContentPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("documents"); // "documents" | "audio" | "gallery"
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Sample Documents Data
  const [documents, setDocuments] = useState([
    {
      id: 1,
      title: "MSSN UDUS Bye-Laws & Constitution (Revised)",
      category: "Constitutional",
      fileType: "PDF",
      fileSize: "2.4 MB",
      uploadedDate: "2026-06-10",
      downloadUrl: "#",
    },
    {
      id: 2,
      title: "100L Computer Science Academic Course Guide & CGPA Manual",
      category: "Academic",
      fileType: "PDF",
      fileSize: "1.8 MB",
      uploadedDate: "2026-07-02",
      downloadUrl: "#",
    },
  ]);

  // Sample Audio Data
  const [audioItems, setAudioItems] = useState([
    {
      id: 1,
      title: "Lessons from Surah An-Nisa (Weekly Tafseer)",
      lecturer: "Dr. Ahmad Abubakar",
      duration: "45 mins",
      uploadedDate: "2026-07-24",
      fileSize: "18.2 MB",
    },
    {
      id: 2,
      title: "Navigating University Life with Islamic Ethics",
      lecturer: "Ustadh Muhammad Bello",
      duration: "32 mins",
      uploadedDate: "2026-07-18",
      fileSize: "14.5 MB",
    },
  ]);

  // Sample Gallery Data
  const [galleryItems, setGalleryItems] = useState([
    {
      id: 1,
      title: "Annual Orientation Ceremony 2026",
      category: "Events",
      uploadedDate: "2026-06-15",
      imageUrl:
        "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&q=80&w=600",
    },
    {
      id: 2,
      title: "Weekly Halqah Gathering at Central Mosque",
      category: "Halqah",
      uploadedDate: "2026-07-10",
      imageUrl:
        "https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&q=80&w=600",
    },
  ]);

  // Form State for New Item
  const [formData, setFormData] = useState({
    title: "",
    category: "Academic",
    lecturer: "",
    fileUrl: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!formData.title) return;

    if (activeTab === "documents") {
      setDocuments([
        {
          id: Date.now(),
          title: formData.title,
          category: formData.category,
          fileType: "PDF",
          fileSize: "2.0 MB",
          uploadedDate: new Date().toISOString().split("T")[0],
          downloadUrl: formData.fileUrl || "#",
        },
        ...documents,
      ]);
    } else if (activeTab === "audio") {
      setAudioItems([
        {
          id: Date.now(),
          title: formData.title,
          lecturer: formData.lecturer || "Guest Speaker",
          duration: "40 mins",
          uploadedDate: new Date().toISOString().split("T")[0],
          fileSize: "15.0 MB",
        },
        ...audioItems,
      ]);
    } else {
      setGalleryItems([
        {
          id: Date.now(),
          title: formData.title,
          category: formData.category,
          uploadedDate: new Date().toISOString().split("T")[0],
          imageUrl:
            formData.fileUrl ||
            "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&q=80&w=600",
        },
        ...galleryItems,
      ]);
    }

    setFormData({ title: "", category: "Academic", lecturer: "", fileUrl: "" });
    setShowAddModal(false);
  };

  const handleDeleteDocument = (id) => {
    if (confirm("Are you sure you want to delete this document?")) {
      setDocuments(documents.filter((doc) => doc.id !== id));
    }
  };

  const handleDeleteAudio = (id) => {
    if (confirm("Are you sure you want to delete this audio file?")) {
      setAudioItems(audioItems.filter((item) => item.id !== id));
    }
  };

  const handleDeleteGallery = (id) => {
    if (confirm("Are you sure you want to delete this photo?")) {
      setGalleryItems(galleryItems.filter((item) => item.id !== id));
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
              Upload & Media Manager
            </span>
          </div>
          <span className="text-xs px-2.5 py-1 bg-emerald-50 text-emerald-700 font-bold rounded-full border border-emerald-100">
            Exco
          </span>
        </header>

        {/* Content Body */}
        <main className="p-4 sm:p-8 space-y-6 max-w-6xl mx-auto w-full">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                <Upload className="text-emerald-600" size={24} />
                <span>Resources & Media Uploads</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Upload academic PDFs, constitutional files, lecture audio
                recordings, and gallery photos.
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer"
            >
              <PlusCircle size={16} />
              <span>
                Upload New{" "}
                {activeTab === "documents"
                  ? "Document"
                  : activeTab === "audio"
                    ? "Audio"
                    : "Photo"}
              </span>
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <button
              onClick={() => setActiveTab("documents")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "documents"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-white text-slate-600 hover:bg-slate-200 border border-slate-200"
              }`}
            >
              <FileText size={16} />
              <span>PDF Documents ({documents.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("audio")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "audio"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-white text-slate-600 hover:bg-slate-200 border border-slate-200"
              }`}
            >
              <Headphones size={16} />
              <span>Audio Lectures ({audioItems.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("gallery")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "gallery"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-white text-slate-600 hover:bg-slate-200 border border-slate-200"
              }`}
            >
              <ImageIcon size={16} />
              <span>Photo Gallery ({galleryItems.length})</span>
            </button>
          </div>

          {/* TAB 1: DOCUMENTS */}
          {activeTab === "documents" && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="divide-y divide-slate-100">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 shrink-0">
                        <FileText size={20} />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-600 font-bold text-[10px] rounded-md">
                            {doc.category}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            {doc.fileType} • {doc.fileSize}
                          </span>
                        </div>
                        <h3 className="font-bold text-slate-900 text-sm">
                          {doc.title}
                        </h3>
                        <p className="text-[11px] text-slate-400">
                          Uploaded on {doc.uploadedDate}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <button
                        onClick={() => handleDeleteDocument(doc.id)}
                        className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                        title="Delete File"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: AUDIO */}
          {activeTab === "audio" && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="divide-y divide-slate-100">
                {audioItems.map((audio) => (
                  <div
                    key={audio.id}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-3 bg-purple-50 text-purple-700 rounded-xl border border-purple-100 shrink-0">
                        <Headphones size={20} />
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-bold text-slate-900 text-sm">
                          {audio.title}
                        </h3>
                        <p className="text-xs text-slate-600 font-semibold">
                          {audio.lecturer}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {audio.duration} • {audio.fileSize} • Uploaded{" "}
                          {audio.uploadedDate}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <button
                        onClick={() => handleDeleteAudio(audio.id)}
                        className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                        title="Delete Audio"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: GALLERY */}
          {activeTab === "gallery" && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {galleryItems.map((photo) => (
                <div
                  key={photo.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden group"
                >
                  <div className="h-44 bg-slate-200 overflow-hidden relative">
                    <img
                      src={photo.imageUrl}
                      alt={photo.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-3 left-3 px-2.5 py-1 bg-slate-900/70 text-white font-bold text-[10px] rounded-full backdrop-blur-xs">
                      {photo.category}
                    </span>
                  </div>
                  <div className="p-4 flex items-center justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-slate-900 text-xs">
                        {photo.title}
                      </h3>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        Uploaded {photo.uploadedDate}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteGallery(photo.id)}
                      className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Add Content Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                <Upload size={20} className="text-emerald-600" />
                <span>
                  Upload{" "}
                  {activeTab === "documents"
                    ? "PDF Document"
                    : activeTab === "audio"
                      ? "Audio Lecture"
                      : "Gallery Photo"}
                </span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleAddItem} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Title *</label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="e.g. 100L Physics Course Manual"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
              </div>

              {activeTab === "audio" ? (
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">
                    Lecturer / Speaker *
                  </label>
                  <input
                    type="text"
                    name="lecturer"
                    placeholder="e.g. Dr. Ahmad Abubakar"
                    value={formData.lecturer}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  />
                </div>
              ) : (
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 bg-white"
                  >
                    <option value="Academic">Academic</option>
                    <option value="Constitutional">Constitutional</option>
                    <option value="General">General</option>
                    <option value="Events">Events</option>
                  </select>
                </div>
              )}

              <div className="space-y-1">
                <label className="font-bold text-slate-700">
                  File Link / Drive URL
                </label>
                <input
                  type="url"
                  name="fileUrl"
                  placeholder="https://drive.google.com/file/..."
                  value={formData.fileUrl}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
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
                  Publish Resource
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
