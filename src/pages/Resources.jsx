import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import { supabase } from "../supabaseClient";
import {
  FileText,
  Download,
  Search,
  BookOpen,
  FileCheck,
  Loader2,
  AlertCircle,
  Image as ImageIcon,
  Video,
  FileCode,
  Music,
  Play,
} from "lucide-react";

export default function ResourcesPage() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedType, setSelectedType] = useState("All");

  const categories = [
    "All",
    "General",
    "Constitution",
    "Academic Guides",
    "Halqah Material",
    "Publications",
  ];

  const resourceTypes = ["All", "pdf", "image", "video", "audio"];

  const getTypeBadge = (type = "") => {
    const normalizedType = type.toLowerCase();
    switch (normalizedType) {
      case "pdf":
        return {
          icon: (
            <FileText size={18} className="text-emerald-600 shrink-0 mt-0.5" />
          ),
          label: "PDF",
          badgeBg: "bg-emerald-50 text-emerald-700 border-emerald-100",
        };
      case "image":
        return {
          icon: (
            <ImageIcon size={18} className="text-blue-600 shrink-0 mt-0.5" />
          ),
          label: "Image",
          badgeBg: "bg-blue-50 text-blue-700 border-blue-100",
        };
      case "video":
        return {
          icon: <Video size={18} className="text-rose-600 shrink-0 mt-0.5" />,
          label: "Video",
          badgeBg: "bg-rose-50 text-rose-700 border-rose-100",
        };
      case "audio":
        return {
          icon: <Music size={18} className="text-amber-600 shrink-0 mt-0.5" />,
          label: "Audio",
          badgeBg: "bg-amber-50 text-amber-700 border-amber-100",
        };
      default:
        return {
          icon: (
            <FileCode size={18} className="text-slate-600 shrink-0 mt-0.5" />
          ),
          label: type.toUpperCase() || "File",
          badgeBg: "bg-slate-100 text-slate-700 border-slate-200",
        };
    }
  };

  useEffect(() => {
    async function fetchResources() {
      try {
        setLoading(true);
        setError(null);

        let query = supabase
          .from("resources")
          .select("*")
          .eq("is_published", true)
          .order("created_at", { ascending: false });

        if (selectedCategory !== "All") {
          query = query.eq("category", selectedCategory);
        }

        if (selectedType !== "All") {
          query = query.eq("type", selectedType.toLowerCase());
        }

        if (searchQuery.trim() !== "") {
          query = query.or(
            `title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`,
          );
        }

        const { data, error: fetchError } = await query;

        if (fetchError) throw fetchError;

        setResources(data || []);
      } catch (err) {
        console.error("Error fetching resources:", err.message);
        setError("Failed to load resources. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(() => {
      fetchResources();
    }, 300);

    return () => clearTimeout(timer);
  }, [selectedCategory, selectedType, searchQuery]);

  const formatDate = (isoString) => {
    if (!isoString) return "N/A";
    return new Date(isoString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      <NavBar />

      <main className="max-w-5xl mx-auto px-4 py-10 space-y-8">
        {/* Page Header */}
        <div className="text-center space-y-3 max-w-xl mx-auto">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto">
            <BookOpen size={24} />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">
            Resource Library &{" "}
            <span className="text-emerald-700">Documents</span>
          </h1>
          <p className="text-slate-600 text-sm leading-relaxed">
            Access official publications, audio lectures, videos, and academic
            files.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3.5 top-3 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search documents by title or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-3 scrollbar-none border-b border-slate-100">
            <span className="text-xs font-semibold text-slate-400 shrink-0 mr-1">
              Type:
            </span>
            {resourceTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition-all ${
                  selectedType === type
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs font-semibold text-slate-400 shrink-0 mr-1">
              Category:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? "bg-emerald-700 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-3">
            <Loader2 size={32} className="animate-spin text-emerald-600" />
            <p className="text-sm font-medium text-slate-500">
              Loading library resources...
            </p>
          </div>
        ) : error ? (
          <div className="text-center py-12 bg-red-50 rounded-2xl border border-red-100 text-red-600 space-y-2">
            <AlertCircle size={32} className="mx-auto text-red-500" />
            <p className="text-sm font-semibold">{error}</p>
          </div>
        ) : resources.length > 0 ? (
          <div className="grid sm:grid-cols-2 gap-5">
            {resources.map((item) => {
              const typeDetails = getTypeBadge(item.type);
              const isImage = item.type === "image";
              const isVideo = item.type === "video";
              const isAudio = item.type === "audio";

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-200 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
                >
                  <div>
                    {/* Media Previews */}
                    {isImage && item.file_url && (
                      <div className="relative aspect-video bg-slate-100 overflow-hidden border-b border-slate-100">
                        <img
                          src={item.file_url}
                          alt={item.title}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}

                    {isVideo && item.file_url && (
                      <div className="relative aspect-video bg-slate-900 overflow-hidden border-b border-slate-100 group/video">
                        <video
                          src={`${item.file_url}#t=0.5`}
                          preload="metadata"
                          className="w-full h-full object-cover opacity-90"
                        />
                        <a
                          href={item.file_url}
                          target="_blank"
                          rel="noreferrer"
                          className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover/video:bg-black/20 transition-all"
                        >
                          <div className="w-11 h-11 bg-white/90 text-rose-600 rounded-full flex items-center justify-center shadow-lg transform group-hover/video:scale-110 transition-transform pl-0.5">
                            <Play size={20} className="fill-rose-600" />
                          </div>
                        </a>
                      </div>
                    )}

                    <div className="p-5 space-y-3">
                      {/* Badges */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-bold rounded-full border border-slate-200">
                            {item.category}
                          </span>
                          <span
                            className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${typeDetails.badgeBg}`}
                          >
                            {typeDetails.label}
                          </span>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="font-bold text-slate-900 text-base leading-snug flex items-start gap-2">
                        {!isImage && !isVideo && typeDetails.icon}
                        <span>{item.title}</span>
                      </h3>

                      {/* Audio Player Inline */}
                      {isAudio && item.file_url && (
                        <div className="pt-1">
                          <audio
                            controls
                            className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50"
                          >
                            <source src={item.file_url} />
                            Your browser does not support audio playback.
                          </audio>
                        </div>
                      )}

                      {/* Description */}
                      {item.description && (
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="p-5 pt-0">
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-400 text-[11px]">
                        Added: {formatDate(item.created_at)}
                      </span>

                      <a
                        href={item.file_url}
                        target="_blank"
                        rel="noreferrer"
                        download
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-semibold rounded-xl transition-all"
                      >
                        <Download size={14} />
                        <span>
                          {isVideo || isAudio ? "Open / Save" : "Download"}
                        </span>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 space-y-2">
            <FileCheck size={36} className="text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-600">
              No resources found
            </p>
            <p className="text-xs text-slate-400">
              Try adjusting your search query, type filter, or category.
            </p>
          </div>
        )}
      </main>

      <footer className="py-6 border-t border-slate-200 text-center text-xs text-slate-400 mt-12">
        &copy; {new Date().getFullYear()} MSSN UDUS. All rights reserved.
      </footer>
    </div>
  );
}
