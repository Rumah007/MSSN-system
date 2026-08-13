import { useState } from "react";
import {
  FileText,
  Upload,
  Search,
  Trash2,
  Download,
  FileCode,
  Music,
  BookOpen,

  Menu,
  Plus,
  X,
} from "lucide-react";
import ExcoSidebar from "./components/ExcoSidebar";

export default function ExcoResources() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Sample Resource Data
  const [resources, setResources] = useState([
    {
      id: 1,
      title: "CSC 301 - Data Structures & Algorithms Past Questions",
      category: "Past Questions",
      courseCode: "CSC 301",
      department: "Computer Science",
      level: "300L",
      fileType: "PDF",
      fileSize: "2.4 MB",
      uploadedBy: "Academic Wing",
      dateAdded: "2026-07-20",
      downloads: 142,
    },
    {
      id: 2,
      title: "Friday Khutbah Audio - Principles of Moral Integrity",
      category: "Audio Lecture",
      courseCode: "GEN",
      department: "General",
      level: "All Levels",
      fileType: "MP3",
      fileSize: "18.5 MB",
      uploadedBy: "Media Unit",
      dateAdded: "2026-07-25",
      downloads: 89,
    },
    {
      id: 3,
      title: "MTH 201 - Linear Algebra Lecture Notes & Practice Problems",
      category: "Lecture Notes",
      courseCode: "MTH 201",
      department: "Mathematics",
      level: "200L",
      fileType: "PDF",
      fileSize: "4.1 MB",
      uploadedBy: "Academic Wing",
      dateAdded: "2026-07-18",
      downloads: 215,
    },
    {
      id: 4,
      title: "GST 101 - Use of English Examination Guide",
      category: "Study Guide",
      courseCode: "GST 101",
      department: "General Studies",
      level: "100L",
      fileType: "PDF",
      fileSize: "1.2 MB",
      uploadedBy: "Secretariat",
      dateAdded: "2026-07-10",
      downloads: 310,
    },
  ]);

  // Form State for New Upload
  const [formData, setFormData] = useState({
    title: "",
    category: "Past Questions",
    courseCode: "",
    department: "Computer Science",
    level: "100L",
    file: null,
  });

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!formData.title) return;

    const newEntry = {
      id: Date.now(),
      title: formData.title,
      category: formData.category,
      courseCode: formData.courseCode || "GEN",
      department: formData.department,
      level: formData.level,
      fileType: formData.category === "Audio Lecture" ? "MP3" : "PDF",
      fileSize: "3.5 MB",
      uploadedBy: "Executive Member",
      dateAdded: new Date().toISOString().split("T")[0],
      downloads: 0,
    };

    setResources([newEntry, ...resources]);
    setShowUploadModal(false);
    setFormData({
      title: "",
      category: "Past Questions",
      courseCode: "",
      department: "Computer Science",
      level: "100L",
      file: null,
    });
  };

  const handleDelete = (id) => {
    setResources(resources.filter((item) => item.id !== id));
  };

  // Filtered list based on search and category tab
  const filteredResources = resources.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.courseCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.department.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const getFileIcon = (type) => {
    if (type === "MP3") return <Music className="text-purple-600" size={18} />;
    if (type === "PDF") return <FileText className="text-rose-600" size={18} />;
    return <FileCode className="text-teal-600" size={18} />;
  };

  return (
    <div className="min-h-screen bg-slate-100 flex text-slate-800 font-sans">
      {/* Reusable Matching Sidebar */}
      <ExcoSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Top Header Bar for Mobile */}
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

        {/* Body Content */}
        <main className="p-4 sm:p-8 space-y-6 max-w-6xl mx-auto w-full">
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">
                Academic & Media Library
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Upload and manage lecture notes, past questions, and audio
                recordings for students.
              </p>
            </div>
            <button
              onClick={() => setShowUploadModal(true)}
              className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors shrink-0"
            >
              <Upload size={16} />
              <span>Upload New File</span>
            </button>
          </div>

          {/* Search and Category Filters */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              {/* Search Bar */}
              <div className="relative flex-1 w-full">
                <Search
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Search by course code, title, or department..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-teal-500 text-slate-800 placeholder:text-slate-400"
                />
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                {[
                  "All",
                  "Past Questions",
                  "Lecture Notes",
                  "Audio Lecture",
                  "Study Guide",
                ].map((cat) => (
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
                ))}
              </div>
            </div>
          </div>

          {/* Resource Listing Table / Cards */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <span className="font-bold text-slate-800 text-sm">
                Files ({filteredResources.length})
              </span>
              <span className="text-xs text-slate-400 font-medium">
                Sorted by latest uploaded
              </span>
            </div>

            {filteredResources.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <BookOpen className="mx-auto text-slate-300" size={40} />
                <p className="text-sm font-bold text-slate-600">
                  No resources found
                </p>
                <p className="text-xs text-slate-400">
                  Try adjusting your search or select a different category
                  filter.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      <th className="py-3 px-4">Resource Details</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Level & Dept</th>
                      <th className="py-3 px-4">Downloads</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {filteredResources.map((res) => (
                      <tr
                        key={res.id}
                        className="hover:bg-slate-50/80 transition-colors"
                      >
                        <td className="py-3.5 px-4 min-w-[240px]">
                          <div className="flex items-start gap-3">
                            <div className="p-2 rounded-xl bg-slate-100 border border-slate-200 shrink-0 mt-0.5">
                              {getFileIcon(res.fileType)}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 line-clamp-1">
                                {res.title}
                              </p>
                              <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                                <span className="font-bold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded-md border border-teal-100">
                                  {res.courseCode}
                                </span>
                                <span>{res.fileSize}</span>
                                <span>• Uploaded by {res.uploadedBy}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-slate-700 whitespace-nowrap">
                          {res.category}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                          <div>
                            <p className="font-semibold text-slate-800">
                              {res.level}
                            </p>
                            <p className="text-[10px] text-slate-400">
                              {res.department}
                            </p>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-slate-700 whitespace-nowrap">
                          {res.downloads}
                        </td>
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              title="Download preview"
                              className="p-1.5 text-slate-500 hover:text-teal-600 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                              <Download size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(res.id)}
                              title="Delete file"
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

      {/* Modal for Uploading New Resource */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <Upload size={18} className="text-teal-600" />
                <span>Upload New Resource</span>
              </h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Resource Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CSC 301 Data Structures Midterm Questions"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-hidden focus:ring-2 focus:ring-teal-500 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-hidden focus:ring-2 focus:ring-teal-500 text-slate-800 font-medium"
                  >
                    <option value="Past Questions">Past Questions</option>
                    <option value="Lecture Notes">Lecture Notes</option>
                    <option value="Audio Lecture">Audio Lecture</option>
                    <option value="Study Guide">Study Guide</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Course Code
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. CSC 301"
                    value={formData.courseCode}
                    onChange={(e) =>
                      setFormData({ ...formData, courseCode: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-hidden focus:ring-2 focus:ring-teal-500 text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Target Level
                  </label>
                  <select
                    value={formData.level}
                    onChange={(e) =>
                      setFormData({ ...formData, level: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-hidden focus:ring-2 focus:ring-teal-500 text-slate-800 font-medium"
                  >
                    <option value="100L">100L</option>
                    <option value="200L">200L</option>
                    <option value="300L">300L</option>
                    <option value="400L">400L</option>
                    <option value="All Levels">All Levels</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) =>
                      setFormData({ ...formData, department: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-hidden focus:ring-2 focus:ring-teal-500 text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Attach File (PDF, MP3, DOCX)
                </label>
                <div className="border-2 border-dashed border-slate-200 p-4 rounded-xl text-center bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer">
                  <Upload className="mx-auto text-slate-400 mb-1" size={24} />
                  <p className="text-xs font-semibold text-slate-600">
                    Click to select file or drag & drop
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Maximum file size: 50MB
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl"
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
