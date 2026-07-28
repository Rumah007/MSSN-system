import React, { useState } from "react";
import NavBar from "../components/NavBar";
import {
  FileText,
  Download,
  Search,
  BookOpen,
  FileCheck,
  GraduationCap,
  Scale,
  Eye,
} from "lucide-react";

export default function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = [
    "All",
    "Constitution",
    "Academic Guides",
    "Halqah Material",
    "Publications",
  ];

  // Sample Resources Data
  const resources = [
    {
      id: 1,
      title: "MSSN UDUS Branch Constitution & Bye-Laws",
      category: "Constitution",
      fileType: "PDF",
      fileSize: "2.4 MB",
      dateAdded: "Jan 12, 2026",
      description:
        "Official governing document and constitutional guidelines for the MSSN UDUS branch.",
      downloadUrl: "#",
    },
    {
      id: 2,
      title: "Freshers' Survival & Academic Excellence Guide",
      category: "Academic Guides",
      fileType: "PDF",
      fileSize: "4.1 MB",
      dateAdded: "Oct 05, 2025",
      description:
        "Comprehensive handbook for new students navigating academic life, CGPA calculation, and campus ethics.",
      downloadUrl: "#",
    },
    {
      id: 3,
      title: "Compendium of Daily Supplications & Adhkar",
      category: "Halqah Material",
      fileType: "PDF",
      fileSize: "1.8 MB",
      dateAdded: "Nov 20, 2025",
      description:
        "Authentic Morning & Evening Adhkar and essential daily prayers compiled for students.",
      downloadUrl: "#",
    },
    {
      id: 4,
      title: "Annual Islamic Week Souvenir Publication 2025",
      category: "Publications",
      fileType: "PDF",
      fileSize: "8.5 MB",
      dateAdded: "Dec 15, 2025",
      description:
        "Articles, lectures, and executive reports published during the annual Islamic Awareness Week.",
      downloadUrl: "#",
    },
    {
      id: 5,
      title: "Sisters' Circle (FOMWAN / MSSN) Hygiene & Fiqh Booklet",
      category: "Halqah Material",
      fileType: "PDF",
      fileSize: "1.2 MB",
      dateAdded: "Jan 08, 2026",
      description:
        "Fiqh rulings regarding female purity, acts of worship, and character building in Islam.",
      downloadUrl: "#",
    },
    {
      id: 6,
      title: "UDUS Examination Conduct & Moral Guidelines",
      category: "Academic Guides",
      fileType: "PDF",
      fileSize: "950 KB",
      dateAdded: "Jan 22, 2026",
      description:
        "Official summary of university examination regulations, academic integrity rules, and conduct.",
      downloadUrl: "#",
    },
  ];

  // Filter Logic
  const filteredResources = resources.filter((item) => {
    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* Top Navbar */}
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
            Access official publications, academic survival guides, Islamic
            study materials, and constitution files.
          </p>
        </div>

        {/* Search & Category Filter Bar */}
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

          {/* Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
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

        {/* Resources Grid */}
        {filteredResources.length > 0 ? (
          <div className="grid sm:grid-cols-2 gap-5">
            {filteredResources.map((item) => (
              <div
                key={item.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-200 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  {/* Category & Badge */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-full border border-emerald-100">
                      {item.category}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400 font-semibold">
                      {item.fileType} • {item.fileSize}
                    </span>
                  </div>

                  {/* Document Title */}
                  <h3 className="font-bold text-slate-900 text-base leading-snug flex items-start gap-2">
                    <FileText
                      size={18}
                      className="text-emerald-600 shrink-0 mt-1"
                    />
                    <span>{item.title}</span>
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-slate-600 leading-relaxed pl-6">
                    {item.description}
                  </p>
                </div>

                {/* Footer / Download Action */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 text-[11px]">
                    Added: {item.dateAdded}
                  </span>

                  <div className="flex items-center gap-2">
                    <a
                      href={item.downloadUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-semibold rounded-xl transition-all"
                    >
                      <Download size={14} />
                      <span>Download</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 space-y-2">
            <FileCheck size={36} className="text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-600">
              No resources found
            </p>
            <p className="text-xs text-slate-400">
              Try adjusting your search query or selecting a different category.
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-slate-200 text-center text-xs text-slate-400 mt-12">
        &copy; {new Date().getFullYear()} MSSN UDUS. All rights reserved.
      </footer>
    </div>
  );
}
