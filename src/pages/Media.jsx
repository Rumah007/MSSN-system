import React, { useState } from "react";
import NavBar from "../components/NavBar";
import {
  Headphones,
  Image as ImageIcon,
  Play,
  Download,
  Search,
  Mic,
  Radio,
  Calendar,
  User,
} from "lucide-react";

export default function MediaPage() {
  const [activeTab, setActiveTab] = useState("audio"); // 'audio' | 'photos'
  const [searchQuery, setSearchQuery] = useState("");
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);

  // Sample Audio Data (Halqahs & Lectures)
  const audioLectures = [
    {
      id: 1,
      title: "Understanding Adab in Seeking Knowledge",
      speaker: "Dr. Ahmad Al-Hassan",
      date: "Oct 14, 2025",
      duration: "45 mins",
      category: "Halqah Series",
      audioUrl: "#",
    },
    {
      id: 2,
      title: "Navigating Academic Life as a Conscious Muslim Student",
      speaker: "Ustadh Ibrahim Bello",
      date: "Nov 02, 2025",
      duration: "58 mins",
      category: "Islamic Week '25",
      audioUrl: "#",
    },
    {
      id: 3,
      title: "Tafseer Surah Al-Kahf - Lessons for Youth",
      speaker: "Sheikh Umar Farooq",
      date: "Dec 18, 2025",
      duration: "1 hr 12 mins",
      category: "Weekly Tafseer",
      audioUrl: "#",
    },
    {
      id: 4,
      title: "Building Brotherhood & Moral Leadership",
      speaker: "Dr. Usman Jabir",
      date: "Jan 10, 2026",
      duration: "38 mins",
      category: "Special Lecture",
      audioUrl: "#",
    },
  ];

  // Sample Gallery Data
  const photoAlbums = [
    {
      id: 1,
      title: "Orientation Program 2025/2026",
      date: "Nov 2025",
      count: "18 Photos",
      coverImage:
        "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=600",
    },
    {
      id: 2,
      title: "Annual Islamic Vocation Course (IVC)",
      date: "Dec 2025",
      count: "32 Photos",
      coverImage:
        "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&q=80&w=600",
    },
    {
      id: 3,
      title: "Campus Clean-up & Welfare Outreach",
      date: "Jan 2026",
      count: "12 Photos",
      coverImage:
        "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=600",
    },
    {
      id: 4,
      title: "Executive Handover & Dinner",
      date: "Feb 2026",
      count: "24 Photos",
      coverImage:
        "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=600",
    },
  ];

  const filteredAudio = audioLectures.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.speaker.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      <NavBar />

      <main className="max-w-5xl mx-auto px-4 py-10 space-y-8">
        {/* Page Header */}
        <div className="text-center space-y-3 max-w-xl mx-auto">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto">
            <Radio size={24} />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">
            Media & <span className="text-emerald-700">Audio Hub</span>
          </h1>
          <p className="text-slate-600 text-sm leading-relaxed">
            Listen to recorded Halqahs, downloadable Islamic lectures, and
            browse photos from campus activities.
          </p>
        </div>

        {/* Tab Selector & Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 pb-4">
          {/* Tabs */}
          <div className="flex items-center gap-2 p-1 bg-slate-200/60 rounded-xl w-full sm:w-auto">
            <button
              onClick={() => setActiveTab("audio")}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === "audio"
                  ? "bg-white text-emerald-800 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Headphones size={16} />
              <span>Audio Halqahs</span>
            </button>
            <button
              onClick={() => setActiveTab("photos")}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === "photos"
                  ? "bg-white text-emerald-800 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <ImageIcon size={16} />
              <span>Photo Archives</span>
            </button>
          </div>

          {/* Search Box */}
          {activeTab === "audio" && (
            <div className="relative w-full sm:w-64">
              <Search
                size={16}
                className="absolute left-3 top-3 text-slate-400"
              />
              <input
                type="text"
                placeholder="Search lectures or speakers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-emerald-600 transition-all"
              />
            </div>
          )}
        </div>

        {/* --- AUDIO TAB CONTENT --- */}
        {activeTab === "audio" && (
          <div className="space-y-4">
            {filteredAudio.length > 0 ? (
              filteredAudio.map((lecture) => (
                <div
                  key={lecture.id}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-emerald-200 transition-all"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-full border border-emerald-100">
                        {lecture.category}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Calendar size={12} /> {lecture.date}
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-base leading-snug">
                      {lecture.title}
                    </h3>

                    <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
                      <span className="flex items-center gap-1">
                        <User size={13} className="text-emerald-600" />{" "}
                        {lecture.speaker}
                      </span>
                      <span>•</span>
                      <span>{lecture.duration}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-0 border-slate-100">
                    <button
                      onClick={() =>
                        setCurrentlyPlaying(
                          currentlyPlaying === lecture.id ? null : lecture.id,
                        )
                      }
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                        currentlyPlaying === lecture.id
                          ? "bg-slate-900 text-white"
                          : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                      }`}
                    >
                      <Play
                        size={14}
                        fill={
                          currentlyPlaying === lecture.id
                            ? "currentColor"
                            : "none"
                        }
                      />
                      <span>
                        {currentlyPlaying === lecture.id ? "Pause" : "Listen"}
                      </span>
                    </button>

                    <a
                      href={lecture.audioUrl}
                      download
                      className="p-2.5 text-slate-500 hover:text-emerald-700 hover:bg-slate-100 rounded-xl transition-all border border-slate-200"
                      title="Download Audio MP3"
                    >
                      <Download size={15} />
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-slate-500 text-sm bg-white rounded-2xl border border-slate-200">
                No lectures found matching your search.
              </div>
            )}
          </div>
        )}

        {/* --- PHOTO GALLERY TAB CONTENT --- */}
        {activeTab === "photos" && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6">
            {photoAlbums.map((album) => (
              <div
                key={album.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all group cursor-pointer"
              >
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  <img
                    src={album.coverImage}
                    alt={album.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 px-2.5 py-1 bg-black/60 backdrop-blur-md text-white text-[10px] font-medium rounded-full">
                    {album.count}
                  </div>
                </div>

                <div className="p-5 space-y-1">
                  <span className="text-[11px] text-emerald-700 font-semibold">
                    {album.date}
                  </span>
                  <h3 className="font-bold text-slate-900 text-base">
                    {album.title}
                  </h3>
                  <p className="text-xs text-slate-500 pt-1">
                    Click to view full photo album from this event.
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Mini Bottom Player Indicator (When active) */}
      {currentlyPlaying && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-4 z-50 text-xs w-[90%] max-w-md border border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center shrink-0">
            <Mic size={16} />
          </div>
          <div className="flex-1 truncate">
            <p className="font-semibold truncate">Playing Halqah Audio...</p>
            <p className="text-[10px] text-slate-400">MSSN UDUS Audio Server</p>
          </div>
          <button
            onClick={() => setCurrentlyPlaying(null)}
            className="text-slate-400 hover:text-white font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Footer */}
      <footer className="py-6 border-t border-slate-200 text-center text-xs text-slate-400 mt-12">
        &copy; {new Date().getFullYear()} MSSN UDUS. All rights reserved.
      </footer>
    </div>
  );
}
