import React, { useState } from "react";
import NavBar from "../components/NavBar";
import {
  Calendar,
  MapPin,
  Clock,
  UserCheck,
  CheckCircle2,
  Tag,
  Search,
  Sparkles,
} from "lucide-react";

export default function EventsPage() {
  const [filter, setFilter] = useState("upcoming"); // 'upcoming' | 'past'
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Sample Events Data
  const events = [
    {
      id: 1,
      title: "Annual Islamic Orientation for Freshers",
      category: "Orientation",
      date: "Aug 12, 2026",
      time: "09:00 AM - 01:00 PM",
      location: "Convocation Arena, Main Campus",
      speaker: "Ustadh Abdullahi Musa & Panel",
      description:
        "An introductory session designed to help new students navigate campus life, balance academics with spirituality, and build brotherhood.",
      isUpcoming: true,
      seatsLeft: 45,
    },
    {
      id: 2,
      title: "Academic Excellence Seminar & CGPA Workshop",
      category: "Academic",
      date: "Aug 28, 2026",
      time: "04:00 PM - 06:30 PM",
      location: "MH1 Lecture Hall",
      speaker: "Dr. Farooq Umar & First Class Alumni",
      description:
        "Learn proven study strategies, exam techniques, time management, and course registration tips tailored for UDUS faculties.",
      isUpcoming: true,
      seatsLeft: 12,
    },
    {
      id: 3,
      title: "Sisters' Annual Circle & Empowerment Summit",
      category: "Sisters Circle",
      date: "Sep 15, 2026",
      time: "10:00 AM - 02:00 PM",
      location: "Auditorium B, City Campus",
      speaker: "Dr. Zainab Al-Ghazali",
      description:
        "A dedicated gathering addressing female student welfare, health, Islamic modesty, and career progression.",
      isUpcoming: true,
      seatsLeft: 80,
    },
    {
      id: 4,
      title: "Special Pre-Exam Halqah & Supplication Hour",
      category: "Halqah",
      date: "Feb 10, 2026",
      time: "04:30 PM - 06:00 PM",
      location: "UDUS Central Mosque",
      speaker: "Sheikh Kabiru Dan-Tsoho",
      description:
        "A spiritual refresher focused on exam anxiety management, ethics of test taking, and collective dua.",
      isUpcoming: false,
      seatsLeft: 0,
    },
  ];

  const handleRegister = (eventId) => {
    if (registeredEvents.includes(eventId)) {
      setRegisteredEvents(registeredEvents.filter((id) => id !== eventId));
    } else {
      setRegisteredEvents([...registeredEvents, eventId]);
    }
  };

  const filteredEvents = events.filter((ev) => {
    const matchesFilter =
      filter === "upcoming" ? ev.isUpcoming : !ev.isUpcoming;
    const matchesSearch =
      ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.category.toLowerCase().includes(searchQuery.toLowerCase());
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
            orientation sessions, and workshops.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2 p-1 bg-slate-200/60 rounded-xl w-full sm:w-auto">
            <button
              onClick={() => setFilter("upcoming")}
              className={`flex-1 sm:flex-none px-5 py-2 rounded-lg text-xs font-bold transition-all ${
                filter === "upcoming"
                  ? "bg-white text-emerald-800 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Upcoming Programs
            </button>
            <button
              onClick={() => setFilter("past")}
              className={`flex-1 sm:flex-none px-5 py-2 rounded-lg text-xs font-bold transition-all ${
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

        {/* Events List */}
        {filteredEvents.length > 0 ? (
          <div className="space-y-6">
            {filteredEvents.map((event) => {
              const isRegistered = registeredEvents.includes(event.id);

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

                    {/* Metadata */}
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
                        onClick={() => handleRegister(event.id)}
                        className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                          isRegistered
                            ? "bg-emerald-900 text-white"
                            : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                        }`}
                      >
                        {isRegistered ? (
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
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
            <p className="text-sm font-semibold text-slate-600">
              No events found
            </p>
            <p className="text-xs text-slate-400 mt-1">
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
