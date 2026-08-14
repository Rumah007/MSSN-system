import { useState, useEffect, useMemo } from "react";
import {
  FileText,
  Upload,
  Search,
  Trash2,
  Download,
  FileCode,
  Music,
  Video,
  Image as ImageIcon,
  BookOpen,
  Menu,
  Plus,
  X,
  Eye,
  EyeOff,
  Loader2,
  Filter,
} from "lucide-react";
import ExcoSidebar from "./components/ExcoSidebar";
import { supabase } from "../../supabaseClient";

const CATEGORIES = ["All", "Academic", "Media", "General"];
const TYPES = ["All", "pdf", "image", "video", "audio", "doc"];

export default function ExcoResources() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Upload Form States
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Academic",
    type: "pdf",
    is_published: true,
  });

  // 1. Fetch Resources
  const fetchResources = async () => {
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
  };

  useEffect(() => {
    fetchResources();
  }, []);

  // Helper to infer resource type based on extension
  const detectFileType = (fileName) => {
    const ext = fileName.split(".").pop().toLowerCase();
    if (["pdf"].includes(ext)) return "pdf";
    if (["mp3", "wav", "aac", "ogg"].includes(ext)) return "audio";
    if (["mp4", "webm", "mkv", "mov"].includes(ext)) return "video";
    if (["jpg", "jpeg", "png", "webp", "gif", "svg"].includes(ext))
      return "image";
    return "doc";
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    const detectedType = detectFileType(file.name);
    setFormData((prev) => ({
      ...prev,
      type: detectedType,
      title: prev.title || file.name.replace(/\.[^/.]+$/, ""), // Auto-fill title if empty
    }));
  };

  const resetForm = () => {
    setSelectedFile(null);
    setFormData({
      title: "",
      description: "",
      category: "Academic",
      type: "pdf",
      is_published: true,
    });
  };

  const handleCloseModal = () => {
    if (uploading) return;
    setShowUploadModal(false);
    resetForm();
  };

  // 2. Upload File + Insert Record
  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile || !formData.title.trim()) return;

    setUploading(true);
    try {
      const fileExt = selectedFile.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("resources")
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("resources")
        .getPublicUrl(filePath);

      const publicUrl = urlData.publicUrl;

      const { data: insertedData, error: dbError } = await supabase
        .from("resources")
        .insert([
          {
            title: formData.title.trim(),
            description: formData.description.trim(),
            category: formData.category,
            type: formData.type,
            file_url: publicUrl,
            is_published: formData.is_published,
          },
        ])
        .select();

      if (dbError) throw dbError;

      if (insertedData) {
        setResources((prev) => [insertedData[0], ...prev]);
      }

      handleCloseModal();
    } catch (err) {
      console.error("Upload failed:", err);
      alert(`Upload failed: ${err.message || "An unexpected error occurred."}`);
    } finally {
      setUploading(false);
    }
  };

  // 3. Toggle Published Status
  const togglePublishedStatus = async (id, currentStatus) => {
    const nextStatus = !currentStatus;

    setResources((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, is_published: nextStatus } : item,
      ),
    );

    const { error } = await supabase
      .from("resources")
      .update({ is_published: nextStatus })
      .eq("id", id);

    if (error) {
      console.error("Error updating publish status:", error.message);
      fetchResources();
    }
  };

  // 4. Delete Resource
  const handleDelete = async (id, fileUrl) => {
    if (!window.confirm("Are you sure you want to delete this resource?"))
      return;

    setResources((prev) => prev.filter((item) => item.id !== id));

    try {
      const { error: dbError } = await supabase
        .from("resources")
        .delete()
        .eq("id", id);

      if (dbError) throw dbError;

      if (fileUrl) {
        const urlParts = fileUrl.split("/resources/");
        if (urlParts.length > 1) {
          const filePath = urlParts[1];
          await supabase.storage.from("resources").remove([filePath]);
        }
      }
    } catch (error) {
      console.error("Error deleting record:", error.message);
      fetchResources();
    }
  };

  // 5. Functional Frontend Filters
  const filteredResources = useMemo(() => {
    return resources.filter((item) => {
      const matchesSearch =
        item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" || item.category === selectedCategory;

      const matchesType =
        selectedType === "All" ||
        item.type?.toLowerCase() === selectedType.toLowerCase();

      const matchesStatus =
        selectedStatus === "All" ||
        (selectedStatus === "Published" && item.is_published) ||
        (selectedStatus === "Draft" && !item.is_published);

      return matchesSearch && matchesCategory && matchesType && matchesStatus;
    });
  }, [resources, searchQuery, selectedCategory, selectedType, selectedStatus]);

  const getFileIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "audio":
        return <Music className="text-purple-600" size={18} />;
      case "video":
        return <Video className="text-blue-600" size={18} />;
      case "image":
        return <ImageIcon className="text-emerald-600" size={18} />;
      case "pdf":
        return <FileText className="text-rose-600" size={18} />;
      case "doc":
      default:
        return <FileCode className="text-teal-600" size={18} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex text-slate-800 font-sans">
      <ExcoSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

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
              Resources Management
            </span>
          </div>
          <button
            onClick={() => setShowUploadModal(true)}
            className="p-1.5 bg-teal-600 text-white rounded-lg flex items-center gap-1 text-xs font-bold"
          >
            <Plus size={16} />
            <span>Upload</span>
          </button>
        </header>

        <main className="p-4 sm:p-8 space-y-6 max-w-6xl mx-auto w-full">
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">
                Resource Library
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Upload and manage public and internal documents, media, and
                files.
              </p>
            </div>
            <button
              onClick={() => setShowUploadModal(true)}
              className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl transition-colors shrink-0"
            >
              <Upload size={16} />
              <span>Upload Resource</span>
            </button>
          </div>

          {/* Search & Comprehensive Filters */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row items-center gap-3">
              {/* Search Bar */}
              <div className="relative flex-1 w-full">
                <Search
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Search resources by title or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-teal-500 text-slate-800 placeholder:text-slate-400"
                />
              </div>

              {/* Type Dropdown Filter */}
              <div className="flex items-center gap-2 w-full md:w-auto">
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-1/2 md:w-auto px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-teal-500"
                >
                  <option value="All">All Types</option>
                  {TYPES.filter((t) => t !== "All").map((t) => (
                    <option key={t} value={t}>
                      {t.toUpperCase()}
                    </option>
                  ))}
                </select>

                {/* Status Dropdown Filter */}
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-1/2 md:w-auto px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-teal-500"
                >
                  <option value="All">All Status</option>
                  <option value="Published">Published</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>
            </div>

            {/* Category Badges */}
            <div className="flex items-center gap-1.5 overflow-x-auto pt-1 border-t border-slate-100">
              <span className="text-xs text-slate-400 font-semibold mr-1 flex items-center gap-1">
                <Filter size={12} /> Category:
              </span>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                    selectedCategory === cat
                      ? "bg-teal-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <span className="font-bold text-slate-800 text-sm">
                Files ({filteredResources.length})
              </span>
              {(searchQuery ||
                selectedCategory !== "All" ||
                selectedType !== "All" ||
                selectedStatus !== "All") && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All");
                    setSelectedType("All");
                    setSelectedStatus("All");
                  }}
                  className="text-xs font-semibold text-teal-600 hover:underline"
                >
                  Clear Filters
                </button>
              )}
            </div>

            {loading ? (
              <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
                <Loader2 className="animate-spin text-teal-600" size={24} />
                <span className="text-xs font-semibold">
                  Loading resources...
                </span>
              </div>
            ) : filteredResources.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <BookOpen className="mx-auto text-slate-300" size={40} />
                <p className="text-sm font-bold text-slate-600">
                  No resources found
                </p>
                <p className="text-xs text-slate-400">
                  Try adjusting your search criteria or filter selections.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      <th className="py-3 px-4">Preview / Info</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Type</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {filteredResources.map((res) => (
                      <tr
                        key={res.id}
                        className="hover:bg-slate-50/80 transition-colors"
                      >
                        <td className="py-3.5 px-4 min-w-[280px]">
                          <div className="flex items-center gap-3">
                            {/* Image Preview or Icon */}
                            {res.type === "image" && res.file_url ? (
                              <div className="h-10 w-10 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
                                <img
                                  src={res.file_url}
                                  alt={res.title}
                                  className="h-full w-full object-cover"
                                  onError={(e) => {
                                    // Fallback if image load fails
                                    e.currentTarget.style.display = "none";
                                  }}
                                />
                              </div>
                            ) : (
                              <div className="p-2.5 rounded-xl bg-slate-100 border border-slate-200 shrink-0">
                                {getFileIcon(res.type)}
                              </div>
                            )}

                            <div>
                              <p className="font-bold text-slate-900 line-clamp-1">
                                {res.title}
                              </p>
                              {res.description && (
                                <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                                  {res.description}
                                </p>
                              )}
                              <span className="text-[10px] text-slate-400 block mt-1">
                                Added:{" "}
                                {new Date(res.created_at).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-slate-700 whitespace-nowrap">
                          {res.category}
                        </td>
                        <td className="py-3.5 px-4 uppercase text-[10px] font-extrabold whitespace-nowrap">
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md border border-slate-200">
                            {res.type}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                              res.is_published
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-amber-50 text-amber-700 border border-amber-200"
                            }`}
                          >
                            {res.is_published ? "Published" : "Draft"}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() =>
                                togglePublishedStatus(res.id, res.is_published)
                              }
                              title={res.is_published ? "Unpublish" : "Publish"}
                              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                              {res.is_published ? (
                                <EyeOff size={16} />
                              ) : (
                                <Eye size={16} />
                              )}
                            </button>
                            <a
                              href={res.file_url}
                              target="_blank"
                              rel="noreferrer"
                              title="View/Download File"
                              className="p-1.5 text-slate-500 hover:text-teal-600 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                              <Download size={16} />
                            </a>
                            <button
                              onClick={() => handleDelete(res.id, res.file_url)}
                              title="Delete Resource"
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <Upload size={18} className="text-teal-600" />
                <span>Upload Resource</span>
              </h3>
              <button
                onClick={handleCloseModal}
                disabled={uploading}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg disabled:opacity-50"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Select File *
                </label>
                <input
                  type="file"
                  required
                  onChange={handleFileChange}
                  disabled={uploading}
                  className="w-full text-slate-600 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 border border-slate-200 rounded-xl p-1 bg-slate-50 disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Resource Title"
                  value={formData.title}
                  disabled={uploading}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-teal-500 text-slate-800 disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Brief context or summary..."
                  value={formData.description}
                  disabled={uploading}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-teal-500 text-slate-800 disabled:opacity-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    disabled={uploading}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-teal-500 text-slate-800 font-medium disabled:opacity-50"
                  >
                    <option value="Academic">Academic</option>
                    <option value="Media">Media</option>
                    <option value="General">General</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Type *
                  </label>
                  <select
                    value={formData.type}
                    disabled={uploading}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-teal-500 text-slate-800 font-medium disabled:opacity-50"
                  >
                    <option value="pdf">pdf</option>
                    <option value="doc">doc</option>
                    <option value="audio">audio</option>
                    <option value="video">video</option>
                    <option value="image">image</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="is_published"
                  checked={formData.is_published}
                  disabled={uploading}
                  onChange={(e) =>
                    setFormData({ ...formData, is_published: e.target.checked })
                  }
                  className="rounded-md border-slate-300 text-teal-600 focus:ring-teal-500 disabled:opacity-50"
                />
                <label
                  htmlFor="is_published"
                  className="font-bold text-slate-700 select-none"
                >
                  Publish Immediately
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  disabled={uploading}
                  onClick={handleCloseModal}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl flex items-center gap-2 disabled:opacity-50"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="animate-spin" size={14} />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <span>Publish Resource</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
