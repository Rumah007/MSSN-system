import { useState, useEffect, useCallback } from "react";
import AdminSidebar from "../admin/components/AdminSidebar";
import { supabase } from "../../supabaseClient"; // Adjust path if needed
import {
  Upload,
  FileText,
  Headphones,
  Image as ImageIcon,
  Video,
  PlusCircle,
  Trash2,
  Menu,
  Search,
  ExternalLink,
  Loader2,
} from "lucide-react";

export default function AdminContentPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("documents"); // "documents" | "audio" | "gallery" | "videos"
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // File state
  const [selectedFile, setSelectedFile] = useState(null);

  // Form State matching the Supabase `resources` table
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Academic",
    is_published: true,
  });

  // Fetch resources from Supabase
  const fetchResources = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("resources")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setResources(data || []);
    } catch (error) {
      console.error("Error fetching resources:", error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // Determine resource `type` based on active tab
  const getResourceTypeFromTab = () => {
    if (activeTab === "documents") return "pdf";
    if (activeTab === "audio") return "audio";
    if (activeTab === "videos") return "video";
    return "image";
  };

  // Restrict file pickers based on tab context
  const getAcceptedFileTypes = () => {
    if (activeTab === "documents") return ".pdf,.doc,.docx";
    if (activeTab === "audio") return "audio/*";
    if (activeTab === "videos") return "video/*";
    return "image/*";
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!formData.title || !selectedFile) {
      alert("Please enter a title and select a file to upload.");
      return;
    }

    setSubmitting(true);
    try {
      // 1. Sanitize file name and build a unique storage path
      const fileExt = selectedFile.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const filePath = `${getResourceTypeFromTab()}s/${fileName}`;

      // 2. Upload file to 'resources' bucket
      const { error: uploadError } = await supabase.storage
        .from("resources")
        .upload(filePath, selectedFile, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // 3. Obtain the Public URL of the uploaded file
      const { data: urlData } = supabase.storage
        .from("resources")
        .getPublicUrl(filePath);

      const publicUrl = urlData.publicUrl;

      // 4. Insert metadata record into the Database table
      const newResource = {
        title: formData.title,
        description: formData.description || null,
        category: formData.category,
        type: getResourceTypeFromTab(),
        file_url: publicUrl,
        is_published: formData.is_published,
      };

      const { data, error: insertError } = await supabase
        .from("resources")
        .insert([newResource])
        .select();

      if (insertError) throw insertError;

      if (data) {
        setResources((prev) => [data[0], ...prev]);
      }

      // Reset states and close modal
      setFormData({
        title: "",
        description: "",
        category: "Academic",
        is_published: true,
      });
      setSelectedFile(null);
      setShowAddModal(false);
    } catch (error) {
      alert("Failed to publish resource: " + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteResource = async (id) => {
    if (!confirm("Are you sure you want to delete this resource?")) return;

    try {
      const { error } = await supabase.from("resources").delete().eq("id", id);
      if (error) throw error;

      setResources((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      alert("Error deleting resource: " + error.message);
    }
  };

  // Filter resources by Tab and Search Query
  const filteredResources = resources.filter((item) => {
    const matchesTab =
      activeTab === "documents"
        ? item.type === "pdf" || item.type === "doc"
        : activeTab === "audio"
          ? item.type === "audio"
          : activeTab === "videos"
            ? item.type === "video"
            : item.type === "image";

    const matchesSearch =
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  const getTabCounts = (types) =>
    resources.filter((r) => types.includes(r.type)).length;

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
                Manage PDFs, audio recordings, gallery photos, and videos
                directly on Supabase.
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
                    : activeTab === "videos"
                      ? "Video"
                      : "Photo"}
              </span>
            </button>
          </div>

          {/* Navigation & Search Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setActiveTab("documents")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "documents"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "bg-white text-slate-600 hover:bg-slate-200 border border-slate-200"
                }`}
              >
                <FileText size={16} />
                <span>PDF Documents ({getTabCounts(["pdf", "doc"])})</span>
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
                <span>Audio Lectures ({getTabCounts(["audio"])})</span>
              </button>

              <button
                onClick={() => setActiveTab("videos")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "videos"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "bg-white text-slate-600 hover:bg-slate-200 border border-slate-200"
                }`}
              >
                <Video size={16} />
                <span>Videos ({getTabCounts(["video"])})</span>
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
                <span>Photo Gallery ({getTabCounts(["image"])})</span>
              </button>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search
                className="absolute left-3 top-2.5 text-slate-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              />
            </div>
          </div>

          {/* Loading Indicator */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-slate-200 text-slate-400">
              <Loader2 className="animate-spin mb-2" size={28} />
              <p className="text-xs font-medium">Loading resources...</p>
            </div>
          ) : filteredResources.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 text-slate-400">
              <p className="text-sm font-semibold">No resources found</p>
              <p className="text-xs mt-1">
                Try tweaking your search or upload a new item.
              </p>
            </div>
          ) : (
            <>
              {/* TAB 1: DOCUMENTS */}
              {activeTab === "documents" && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                  <div className="divide-y divide-slate-100">
                    {filteredResources.map((doc) => (
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
                                {doc.category || "General"}
                              </span>
                              <span className="text-[10px] font-mono text-slate-400">
                                {doc.type?.toUpperCase()}
                              </span>
                              {!doc.is_published && (
                                <span className="px-2 py-0.5 bg-amber-50 text-amber-700 font-bold text-[10px] rounded-md">
                                  Draft
                                </span>
                              )}
                            </div>
                            <h3 className="font-bold text-slate-900 text-sm">
                              {doc.title}
                            </h3>
                            {doc.description && (
                              <p className="text-xs text-slate-500 line-clamp-1">
                                {doc.description}
                              </p>
                            )}
                            <p className="text-[11px] text-slate-400">
                              Uploaded on{" "}
                              {new Date(doc.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                          {doc.file_url && (
                            <a
                              href={doc.file_url}
                              target="_blank"
                              rel="noreferrer"
                              className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                              title="Open File"
                            >
                              <ExternalLink size={16} />
                            </a>
                          )}
                          <button
                            onClick={() => handleDeleteResource(doc.id)}
                            className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                            title="Delete Document"
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
                    {filteredResources.map((audio) => (
                      <div
                        key={audio.id}
                        className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div className="p-3 bg-purple-50 text-purple-700 rounded-xl border border-purple-100 shrink-0">
                            <Headphones size={20} />
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 bg-purple-50 text-purple-700 font-bold text-[10px] rounded-md">
                                {audio.category || "Lecture"}
                              </span>
                            </div>
                            <h3 className="font-bold text-slate-900 text-sm">
                              {audio.title}
                            </h3>
                            {audio.description && (
                              <p className="text-xs text-slate-600 font-medium">
                                {audio.description}
                              </p>
                            )}
                            <p className="text-[10px] text-slate-400">
                              Uploaded{" "}
                              {new Date(audio.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                          {audio.file_url && (
                            <a
                              href={audio.file_url}
                              target="_blank"
                              rel="noreferrer"
                              className="p-2 text-purple-600 hover:bg-purple-50 rounded-xl transition-colors"
                              title="Listen / Download"
                            >
                              <ExternalLink size={16} />
                            </a>
                          )}
                          <button
                            onClick={() => handleDeleteResource(audio.id)}
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

              {/* TAB 3: VIDEOS */}
              {activeTab === "videos" && (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredResources.map((video) => (
                    <div
                      key={video.id}
                      className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden group flex flex-col"
                    >
                      <div className="h-48 bg-slate-900 relative">
                        <video
                          src={video.file_url}
                          controls
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-3 left-3 px-2.5 py-1 bg-slate-900/70 text-white font-bold text-[10px] rounded-full backdrop-blur-xs pointer-events-none">
                          {video.category || "Video"}
                        </span>
                      </div>
                      <div className="p-4 flex items-center justify-between gap-2 flex-1">
                        <div>
                          <h3 className="font-bold text-slate-900 text-xs">
                            {video.title}
                          </h3>
                          {video.description && (
                            <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                              {video.description}
                            </p>
                          )}
                          <p className="text-[10px] text-slate-400 mt-1">
                            Uploaded{" "}
                            {new Date(video.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <a
                            href={video.file_url}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Open Video"
                          >
                            <ExternalLink size={16} />
                          </a>
                          <button
                            onClick={() => handleDeleteResource(video.id)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Video"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 4: GALLERY */}
              {activeTab === "gallery" && (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredResources.map((photo) => (
                    <div
                      key={photo.id}
                      className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden group"
                    >
                      <div className="h-44 bg-slate-200 overflow-hidden relative">
                        <img
                          src={photo.file_url}
                          alt={photo.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <span className="absolute top-3 left-3 px-2.5 py-1 bg-slate-900/70 text-white font-bold text-[10px] rounded-full backdrop-blur-xs">
                          {photo.category || "Gallery"}
                        </span>
                      </div>
                      <div className="p-4 flex items-center justify-between gap-2">
                        <div>
                          <h3 className="font-bold text-slate-900 text-xs">
                            {photo.title}
                          </h3>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            Uploaded{" "}
                            {new Date(photo.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDeleteResource(photo.id)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
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
                      : activeTab === "videos"
                        ? "Video"
                        : "Gallery Photo"}
                </span>
              </h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setSelectedFile(null);
                }}
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
                  placeholder="e.g. Course Intro Video"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">
                  Description / Details
                </label>
                <input
                  type="text"
                  name="description"
                  placeholder="e.g. Recorded overview session"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
              </div>

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
                  <option value="Halqah">Halqah</option>
                  <option value="General">General</option>
                  <option value="Events">Events</option>
                </select>
              </div>

              {/* File Input Field */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700">
                  Select File from Device *
                </label>
                <input
                  type="file"
                  required
                  accept={getAcceptedFileTypes()}
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="is_published"
                  name="is_published"
                  checked={formData.is_published}
                  onChange={handleInputChange}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <label
                  htmlFor="is_published"
                  className="font-semibold text-slate-700 cursor-pointer"
                >
                  Publish immediately
                </label>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setSelectedFile(null);
                  }}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold cursor-pointer transition-colors shadow-xs flex items-center gap-2 disabled:opacity-50"
                >
                  {submitting && <Loader2 className="animate-spin" size={14} />}
                  <span>
                    {submitting ? "Uploading..." : "Publish Resource"}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
