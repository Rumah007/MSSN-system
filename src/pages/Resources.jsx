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
} from "lucide-react";

export default function ResourcesPage() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = [
    "All",
    "General",
    "Constitution",
    "Academic Guides",
    "Halqah Material",
    "Publications",
  ];

  useEffect(() => {
    async function fetchPDFResources() {
      try {
        setLoading(true);
        setError(null);

        // Strictly fetch published PDF resources
        let query = supabase
          .from("resources")
          .select("*")
          .eq("is_published", true)
          // Adjust case to match your Postgres enum if needed (e.g., 'PDF' or 'pdf')
          .eq("type", "pdf")
          .order("created_at", { ascending: false });

        // Apply Category Filter
        if (selectedCategory !== "All") {
          query = query.eq("category", selectedCategory);
        }

        // Apply Search Filter
        if (searchQuery.trim() !== "") {
          query = query.or(
            `title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`,
          );
        }

        const { data, error: fetchError } = await query;

        if (fetchError) throw fetchError;

        setResources(data || []);
      } catch (err) {
        console.error("Error fetching PDF resources:", err.message);
        setError("Failed to load PDF documents. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(() => {
      fetchPDFResources();
    }, 300);

    return () => clearTimeout(timer);
  }, [selectedCategory, searchQuery]);

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
          <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto shadow-xs">
            <BookOpen size={24} />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            PDF Library & <span className="text-emerald-700">Publications</span>
          </h1>
          <p className="text-slate-600 text-sm leading-relaxed">
            Access official PDF documents, constitutions, academic handbooks,
            and publications.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3.5 top-3 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search PDFs by title or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all"
            />
          </div>

          {/* Category Filter */}
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
              Fetching PDFs...
            </p>
          </div>
        ) : error ? (
          <div className="text-center py-12 bg-red-50 rounded-2xl border border-red-100 text-red-600 space-y-2">
            <AlertCircle size={32} className="mx-auto text-red-500" />
            <p className="text-sm font-semibold">{error}</p>
          </div>
        ) : resources.length > 0 ? (
          <div className="grid sm:grid-cols-2 gap-5">
            {resources.map((item) => (
              <div
                key={item.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  {/* Header Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-bold rounded-full border border-slate-200">
                      {item.category}
                    </span>
                    <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full border bg-emerald-50 text-emerald-700 border-emerald-100">
                      PDF Document
                    </span>
                  </div>

                  {/* Document Title & Icon */}
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 shrink-0 group-hover:bg-emerald-50 transition-colors">
                      <FileText
                        size={20}
                        className="text-emerald-600 shrink-0"
                      />
                    </div>
                    <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-emerald-800 transition-colors">
                      {item.title}
                    </h3>
                  </div>

                  {/* Description */}
                  {item.description && (
                    <p className="text-xs text-slate-600 leading-relaxed pl-0.5">
                      {item.description}
                    </p>
                  )}
                </div>

                {/* Card Footer */}
                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 text-[11px]">
                    Published: {formatDate(item.created_at)}
                  </span>

                  <a
                    href={item.file_url}
                    target="_blank"
                    rel="noreferrer"
                    download
                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-semibold rounded-xl transition-all"
                  >
                    <Download size={14} />
                    <span>Download PDF</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 space-y-2">
            <FileCheck size={36} className="text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-600">
              No PDFs found
            </p>
            <p className="text-xs text-slate-400">
              Try adjusting your search query or selected category.
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
