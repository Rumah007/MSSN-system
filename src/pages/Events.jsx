import React, { useState, useEffect, useCallback } from "react";
import NavBar from "../components/NavBar";
import { supabase } from "../supabaseClient"; // Adjust path if needed
import {
  Calendar,
  MapPin,
  Clock,
  UserCheck,
  CheckCircle2,
  Tag,
  Search,
  Sparkles,
  Loader2,
} from "lucide-react";

export default function EventsPage() {
  const [filter, setFilter] = useState("upcoming"); // 'upcoming' | 'past'
  const [events, setEvents] = useState([]);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [user, setUser] = useState(null);

  // Fetch events and existing RSVPs for current user
  const fetchEventsData = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Get Current User Session
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();
      setUser(currentUser);

      // 2. Fetch Events
      const { data: eventsData, error: eventsErr } = await supabase
        .from("events")
        .select("*")
        .order("event_date", { ascending: true });

      if (eventsErr) throw eventsErr;

      // 3. Fetch User's RSVPs if logged in
      if (currentUser) {
        const { data: rsvpData, error: rsvpErr } = await supabase
          .from("event_rsvps")
          .select("event_id")
          .eq("user_id", currentUser.id);

        if (!rsvpErr && rsvpData) {
          setRegisteredEvents(rsvpData.map((item) => item.event_id));
        }
      }

      if (eventsData) {
        const formattedEvents = eventsData.map((ev) => {
          const eventDateObj = new Date(ev.event_date);
          const now = new Date();

          return {
            id: ev.id,
            title: ev.title,
            category: ev.category || "General",
            date: eventDateObj.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            }),
            time:
              ev.event_time ||
              eventDateObj.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              }),
            location: ev.location || "UDUS Campus",
            speaker: ev.speaker || "Guest Speaker",
            description: ev.description || "",
            isUpcoming: eventDateObj >= now,
            seatsLeft: ev.seats_left ?? 0,
            rawDate: eventDateObj,
          };
        });

        setEvents(formattedEvents);
      }
    } catch (err) {
      console.error("Error fetching events:", err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEventsData();
  }, [fetchEventsData]);

  // Handle RSVP toggle in Supabase
  const handleRegister = async (eventId, seatsLeft) => {
    if (!user) {
      alert("Please log in to reserve a seat for this program.");
      return;
    }

    setActionLoadingId(eventId);
    const isRegistered = registeredEvents.includes(eventId);

    try {
      if (isRegistered) {
        // Cancel RSVP
        const { error: cancelErr } = await supabase
          .from("event_rsvps")
          .delete()
          .eq("event_id", eventId)
          .eq("user_id", user.id);

        if (cancelErr) throw cancelErr;

        // Restore seat count in database
        await supabase
          .from("events")
          .update({ seats_left: seatsLeft + 1 })
          .eq("id", eventId);

        setRegisteredEvents((prev) => prev.filter((id) => id !== eventId));
        setEvents((prev) =>
          prev.map((ev) =>
            ev.id === eventId ? { ...ev, seatsLeft: ev.seatsLeft + 1 } : ev,
          ),
        );
      } else {
        // Check seat availability
        if (seatsLeft <= 0) {
          alert("Sorry, no seats remaining for this program.");
          return;
        }

        // Add RSVP
        const { error: rsvpErr } = await supabase
          .from("event_rsvps")
          .insert([{ event_id: eventId, user_id: user.id }]);

        if (rsvpErr) throw rsvpErr;

        // Decrement seat count in database
        await supabase
          .from("events")
          .update({ seats_left: Math.max(0, seatsLeft - 1) })
          .eq("id", eventId);

        setRegisteredEvents((prev) => [...prev, eventId]);
        setEvents((prev) =>
          prev.map((ev) =>
            ev.id === eventId
              ? { ...ev, seatsLeft: Math.max(0, ev.seatsLeft - 1) }
              : ev,
          ),
        );
      }
    } catch (err) {
      console.error("Error updating RSVP:", err.message);
      alert("Failed to update reservation. Please try again.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const filteredEvents = events.filter((ev) => {
    const matchesFilter =
      filter === "upcoming" ? ev.isUpcoming : !ev.isUpcoming;
    const matchesSearch =
      ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.speaker.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      <NavBar />

      <main className="max-w-5xl mx-auto px-4 py-10 space-y-8">
        {/* Header */}
        <div className="text-center space-y-3 max-w-xl mx-auto">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto">
            <Calendar size={24} />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">
            Programs & <span className="text-emerald-700">Events</span>
          </h1>
          <p className="text-slate-600 text-sm leading-relaxed">
            Stay updated with upcoming Islamic lectures, academic seminars,
            orientation sessions, and workshops across UDUS campuses.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2 p-1 bg-slate-200/60 rounded-xl w-full sm:w-auto">
            <button
              onClick={() => setFilter("upcoming")}
              className={`flex-1 sm:flex-none px-5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filter === "upcoming"
                  ? "bg-white text-emerald-800 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Upcoming Programs
            </button>
            <button
              onClick={() => setFilter("past")}
              className={`flex-1 sm:flex-none px-5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filter === "past"
                  ? "bg-white text-emerald-800 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Past Events
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search
              size={16}
              className="absolute left-3 top-3 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search programs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-emerald-600 transition-all"
            />
          </div>
        </div>

        {/* Dynamic Events List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3 bg-white rounded-2xl border border-slate-200">
            <Loader2 className="animate-spin text-emerald-600" size={28} />
            <p className="text-xs font-medium">
              Fetching scheduled programs...
            </p>
          </div>
        ) : filteredEvents.length > 0 ? (
          <div className="space-y-6">
            {filteredEvents.map((event) => {
              const isRegistered = registeredEvents.includes(event.id);
              const isProcessing = actionLoadingId === event.id;

              return (
                <div
                  key={event.id}
                  className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row justify-between gap-6 hover:border-emerald-200 transition-all"
                >
                  {/* Event Info */}
                  <div className="space-y-3 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-full border border-emerald-100 flex items-center gap-1">
                        <Tag size={10} />
                        {event.category}
                      </span>
                      {event.isUpcoming && (
                        <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full font-semibold border border-amber-100">
                          {event.seatsLeft} seats left
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-slate-900 text-lg leading-snug">
                      {event.title}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {event.description}
                    </p>

                    {/* Metadata Grid */}
                    <div className="grid sm:grid-cols-2 gap-2 text-xs text-slate-500 pt-2 border-t border-slate-100">
                      <div className="flex items-center gap-1.5">
                        <Calendar
                          size={14}
                          className="text-emerald-600 shrink-0"
                        />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock
                          size={14}
                          className="text-emerald-600 shrink-0"
                        />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin
                          size={14}
                          className="text-emerald-600 shrink-0"
                        />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <UserCheck
                          size={14}
                          className="text-emerald-600 shrink-0"
                        />
                        <span>{event.speaker}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Column */}
                  {event.isUpcoming && (
                    <div className="flex md:flex-col justify-between md:justify-center items-center md:items-end gap-3 md:border-l md:border-slate-100 md:pl-6 pt-4 md:pt-0 border-t border-slate-100 shrink-0">
                      <button
                        disabled={isProcessing}
                        onClick={() =>
                          handleRegister(event.id, event.seatsLeft)
                        }
                        className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                          isRegistered
                            ? "bg-emerald-900 text-white hover:bg-emerald-950"
                            : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                        } ${isProcessing ? "opacity-75 cursor-not-allowed" : ""}`}
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 size={14} className="animate-spin" />
                            <span>Updating...</span>
                          </>
                        ) : isRegistered ? (
                          <>
                            <CheckCircle2 size={14} />
                            <span>Registered</span>
                          </>
                        ) : (
                          <>
                            <Sparkles size={14} />
                            <span>Reserve Seat</span>
                          </>
                        )}
                      </button>

                      {isRegistered && (
                        <p className="text-[10px] text-emerald-700 font-semibold text-right">
                          Pass saved to your profile
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 space-y-1">
            <p className="text-sm font-semibold text-slate-700">
              No events found
            </p>
            <p className="text-xs text-slate-400">
              Check back soon for new program announcements.
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
