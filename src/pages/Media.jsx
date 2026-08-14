import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import { supabase } from "../supabaseClient";
import {
  Headphones,
  Image as ImageIcon,
  Play,
  Pause,
  Download,
  Search,
  Mic,
  Radio,
  Calendar,
  Video,
  Loader2,
  AlertCircle,
  FileCheck,
  X,
  Volume2,
} from "lucide-react";

export default function MediaPage() {
  const [activeTab, setActiveTab] = useState("audio"); // 'audio' | 'video' | 'photos'
  const [searchQuery, setSearchQuery] = useState("");
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);

  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all published media (audio, video, image)
  useEffect(() => {
    async function fetchMedia() {
      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from("resources")
          .select("*")
          .eq("is_published", true)
          .in("type", ["audio", "video", "image"])
          .order("created_at", { ascending: false });

        if (fetchError) throw fetchError;
        setMedia(data || []);
      } catch (err) {
        console.error("Error fetching media:", err.message);
        setError("Failed to load media content. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchMedia();
  }, []);

  const formatDate = (isoString) => {
    if (!isoString) return "N/A";
    return new Date(isoString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Categorize data based on type
  const allAudio = media.filter((item) => item.type === "audio");
  const allVideo = media.filter((item) => item.type === "video");
  const allPhotos = media.filter((item) => item.type === "image");

  // Filter Active Tab Data by Search Query
  const getFilteredData = (dataList) => {
    if (!searchQuery) return dataList;
    return dataList.filter(
      (item) =>
        item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category?.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  };

  const filteredAudio = getFilteredData(allAudio);
  const filteredVideo = getFilteredData(allVideo);
  const filteredPhotos = getFilteredData(allPhotos);

  const activePlayingItem = media.find((item) => item.id === currentlyPlaying);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      <NavBar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* Header Section */}
        <div className="relative text-center space-y-4 max-w-2xl mx-auto pt-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-800 text-xs font-semibold shadow-2xs">
            <Radio size={14} className="animate-pulse text-emerald-600" />
            <span>MSSN UDUS Resource Center</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Media &{" "}
            <span className="text-emerald-700 underline decoration-emerald-200 underline-offset-8">
              Audio Hub
            </span>
          </h1>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Stream recorded Halqahs, watch event highlights, and explore our
            community archives anytime.
          </p>
        </div>

        {/* Tab Selector Bar */}
        <div className="bg-white p-2 sm:p-2.5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Navigation Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100/80 rounded-xl w-full sm:w-auto">
            <button
              onClick={() => {
                setActiveTab("audio");
                setSearchQuery("");
              }}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                activeTab === "audio"
                  ? "bg-white text-emerald-800 shadow-xs border border-slate-200/50"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
              }`}
            >
              <Headphones size={15} />
              <span>Audio Halqahs</span>
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-50 text-emerald-700 font-semibold border border-emerald-100">
                {allAudio.length}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab("video");
                setSearchQuery("");
              }}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                activeTab === "video"
                  ? "bg-white text-emerald-800 shadow-xs border border-slate-200/50"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
              }`}
            >
              <Video size={15} />
              <span>Videos</span>
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-slate-200 text-slate-700 font-semibold">
                {allVideo.length}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab("photos");
                setSearchQuery("");
              }}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                activeTab === "photos"
                  ? "bg-white text-emerald-800 shadow-xs border border-slate-200/50"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
              }`}
            >
              <ImageIcon size={15} />
              <span>Gallery</span>
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-slate-200 text-slate-700 font-semibold">
                {allPhotos.length}
              </span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 transition-all placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Global States */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-3 bg-white rounded-3xl border border-slate-200/60 shadow-2xs">
            <Loader2 size={32} className="animate-spin text-emerald-600" />
            <p className="text-sm font-medium text-slate-500">
              Retrieving media resources...
            </p>
          </div>
        ) : error ? (
          <div className="text-center py-12 px-6 bg-red-50/80 rounded-3xl border border-red-100 text-red-600 space-y-3">
            <AlertCircle size={32} className="mx-auto text-red-500" />
            <p className="text-sm font-semibold">{error}</p>
          </div>
        ) : (
          <>
            {/* --- AUDIO TAB CONTENT --- */}
            {activeTab === "audio" && (
              <div className="space-y-3">
                {filteredAudio.length > 0 ? (
                  filteredAudio.map((lecture) => {
                    const isPlaying = currentlyPlaying === lecture.id;
                    return (
                      <div
                        key={lecture.id}
                        className={`group bg-white p-5 rounded-2xl border transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                          isPlaying
                            ? "border-emerald-500 ring-2 ring-emerald-500/10 shadow-md"
                            : "border-slate-200/80 hover:border-emerald-300 shadow-xs hover:shadow-md"
                        }`}
                      >
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-800 text-[10px] font-bold tracking-wide rounded-md border border-emerald-200/50">
                              {lecture.category || "General"}
                            </span>
                            <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                              <Calendar size={13} className="text-slate-400" />
                              {formatDate(lecture.created_at)}
                            </span>
                          </div>

                          <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-emerald-900 transition-colors">
                            {lecture.title}
                          </h3>

                          {lecture.description && (
                            <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 max-w-3xl">
                              {lecture.description}
                            </p>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 pt-3 sm:pt-0 border-t sm:border-0 border-slate-100 shrink-0">
                          <button
                            onClick={() =>
                              setCurrentlyPlaying(isPlaying ? null : lecture.id)
                            }
                            className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 shadow-2xs ${
                              isPlaying
                                ? "bg-slate-900 text-white hover:bg-slate-800"
                                : "bg-emerald-700 text-white hover:bg-emerald-800"
                            }`}
                          >
                            {isPlaying ? (
                              <>
                                <Pause size={15} />
                                <span>Pause</span>
                              </>
                            ) : (
                              <>
                                <Play size={15} fill="currentColor" />
                                <span>Listen</span>
                              </>
                            )}
                          </button>

                          <a
                            href={lecture.file_url}
                            target="_blank"
                            rel="noreferrer"
                            download
                            className="p-2.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-all border border-slate-200/80 hover:border-emerald-200"
                            title="Download Audio"
                          >
                            <Download size={15} />
                          </a>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <EmptyState message="No audio recordings match your criteria" />
                )}
              </div>
            )}

            {/* --- VIDEO TAB CONTENT --- */}
            {activeTab === "video" && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVideo.length > 0 ? (
                  filteredVideo.map((video) => (
                    <div
                      key={video.id}
                      className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-lg hover:border-emerald-300 transition-all duration-300 group flex flex-col"
                    >
                      {/* Thumbnail Container */}
                      <div className="relative aspect-video bg-slate-950 flex items-center justify-center overflow-hidden">
                        {video.file_url ? (
                          <video
                            src={video.file_url}
                            className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                            muted
                            preload="metadata"
                          />
                        ) : (
                          <Video size={36} className="text-slate-700" />
                        )}

                        <div className="absolute inset-0 bg-slate-900/30 group-hover:bg-slate-900/10 transition-colors flex items-center justify-center">
                          <a
                            href={video.file_url}
                            target="_blank"
                            rel="noreferrer"
                            className="w-12 h-12 bg-emerald-600/90 rounded-full flex items-center justify-center text-white backdrop-blur-md shadow-lg group-hover:scale-110 transition-transform duration-200"
                          >
                            <Play
                              size={20}
                              fill="currentColor"
                              className="ml-1"
                            />
                          </a>
                        </div>
                      </div>

                      {/* Content Card */}
                      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-bold rounded-md border border-slate-200/60">
                              {video.category || "Video"}
                            </span>
                            <span className="text-[10px] font-medium text-slate-400">
                              {formatDate(video.created_at)}
                            </span>
                          </div>

                          <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-emerald-800 transition-colors">
                            {video.title}
                          </h3>

                          {video.description && (
                            <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                              {video.description}
                            </p>
                          )}
                        </div>

                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                          <a
                            href={video.file_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1.5 transition-colors"
                          >
                            <span>Watch Now</span>
                            <Play size={12} fill="currentColor" />
                          </a>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full">
                    <EmptyState message="No videos match your search query" />
                  </div>
                )}
              </div>
            )}

            {/* --- PHOTO GALLERY TAB CONTENT --- */}
            {activeTab === "photos" && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-5">
                {filteredPhotos.length > 0 ? (
                  filteredPhotos.map((photo) => (
                    <div
                      key={photo.id}
                      className="group relative aspect-square bg-slate-100 rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-300"
                    >
                      <img
                        src={photo.file_url}
                        alt={photo.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />

                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-4">
                        <span className="text-[10px] text-emerald-300 font-bold tracking-wider uppercase mb-1">
                          {photo.category || "Event"}
                        </span>
                        <h3 className="font-bold text-white text-sm leading-tight line-clamp-2 mb-2">
                          {photo.title}
                        </h3>

                        <div className="flex items-center justify-between pt-2 border-t border-white/10">
                          <span className="text-[10px] text-slate-300">
                            {formatDate(photo.created_at)}
                          </span>
                          <a
                            href={photo.file_url}
                            target="_blank"
                            rel="noreferrer"
                            download
                            className="p-1.5 bg-white/20 hover:bg-white text-white hover:text-slate-900 rounded-lg backdrop-blur-md transition-all"
                            title="Download Image"
                          >
                            <Download size={13} />
                          </a>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full">
                    <EmptyState message="No photos found in gallery" />
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>

      {/* Floating Bottom Audio Player */}
      {currentlyPlaying && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-4 z-50 text-xs w-[92%] max-w-lg border border-slate-800 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-inner">
            <Volume2 size={18} className="animate-pulse" />
          </div>

          <div className="flex-1 truncate space-y-0.5">
            <p className="font-bold truncate text-white">
              {activePlayingItem?.title || "Playing Audio..."}
            </p>
            <p className="text-[10px] text-slate-400 font-medium">
              MSSN UDUS Audio Stream
            </p>
          </div>

          <button
            onClick={() => setCurrentlyPlaying(null)}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Footer */}
      <footer className="py-8 border-t border-slate-200/80 text-center text-xs text-slate-400 mt-16">
        &copy; {new Date().getFullYear()} MSSN UDUS. All rights reserved.
      </footer>
    </div>
  );
}

// Sub-component for consistent empty states
function EmptyState({ message }) {
  return (
    <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80 space-y-3">
      <FileCheck size={40} className="text-slate-300 mx-auto" />
      <p className="text-sm font-semibold text-slate-600">{message}</p>
    </div>
  );
}
