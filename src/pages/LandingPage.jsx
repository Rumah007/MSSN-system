import React, { useState } from "react";
import mssnLogo from "../assets/MSSN_logo.jpg";
import NavBar from "../components/NavBar";
import {
  Users,
  Megaphone,
  Calendar,
  FileText,
  Video,
  MessageSquare,
  ChevronRight,
  BookOpen,
  Shield,
  Menu,
  X,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans selection:bg-emerald-200 selection:text-emerald-900">
      {/* Soft Background Accent Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-emerald-100/70 blur-3xl" />
        <div className="absolute top-1/30987890 -left-40 w-96 h-96 rounded-full bg-lime-100/60 blur-3xl" />
        <div className="absolute -bottom-40 right-1/3 w-96 h-96 rounded-full bg-green-100/50 blur-3xl" />
      </div>

      {/* Navigation Header */}
      <NavBar />

      {/* Hero Section */}
      <section className="relative z-10 pt-16 pb-24 lg:pt-20 lg:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          {/* Hero Emblem & Pill */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-20 h-20 rounded-2xl overflow-hidden border border-emerald-200 p-1 bg-white shadow-lg shadow-emerald-500/10">
              <img
                src={mssnLogo}
                alt="MSSN UDUS Emblem"
                className="w-full h-full object-contain rounded-xl"
              />
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Empowering the Ummah Through{" "}
            <span className="bg-linear-to-r from-emerald-600 via-green-600 to-emerald-500 bg-clip-text text-transparent">
              Digital Unity
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            A unified digital ecosystem connecting members, executives, and
            administrators. Seamlessly manage operations, register for events,
            and access Islamic learning resources.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="w-full sm:w-auto px-8 py-4 text-slate-950 bg-linear-to-r from-emerald-400 via-emerald-400 to-lime-300 font-bold rounded-xl shadow-lg shadow-emerald-500/10 hover:shadow-xl hover:shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2">
              Explore Portal <ArrowRight size={18} />
            </button>
            <button className="w-full sm:w-auto px-8 py-4 text-emerald-800 bg-emerald-50 border border-emerald-200 font-semibold rounded-xl hover:bg-emerald-100 transition-all duration-200">
              View Announcements
            </button>
          </div>
        </div>

        {/* Floating Metric Stats Banner */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto p-4 rounded-2xl bg-white/80 border border-emerald-100 shadow-xl shadow-emerald-950/5 backdrop-blur-sm">
          {[
            { label: "Active Members", value: "2,500+" },
            { label: "Events Hosted", value: "150+" },
            { label: "Learning Resources", value: "500+" },
            { label: "Execs & Admins", value: "40+" },
          ].map((stat, index) => (
            <div key={index} className="text-center p-3">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600">
                {stat.value}
              </div>
              <div className="text-xs text-slate-500 mt-1 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Core Features Grid */}
      <section
        id="features"
        className="relative z-10 py-20 bg-slate-50/80 border-y border-slate-100"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
              Designed for <span className="text-emerald-600">Admins</span> &{" "}
              <span className="text-emerald-800">Members</span>
            </h2>
            <p className="text-slate-600 mt-3">
              Everything you need to streamline organizational management and
              elevate member experience in one platform.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Users className="text-emerald-600" size={24} />,
                title: "Member & Executive Management",
                desc: "Efficient tracking of general membership, executive rolls, profiles, and administrative responsibilities.",
              },
              {
                icon: <Megaphone className="text-emerald-600" size={24} />,
                title: "Broadcast Announcements",
                desc: "Stay updated with real-time official statements, notifications, and important updates straight from leadership.",
              },
              {
                icon: <Calendar className="text-emerald-600" size={24} />,
                title: "Event Registrations",
                desc: "Browse upcoming Islamic lectures, programs, and workshops. Register effortlessly online.",
              },
              {
                icon: <FileText className="text-emerald-600" size={24} />,
                title: "Document Library",
                desc: "Access official MSSN UDUS documents, constitutions, guides, and published literature seamlessly.",
              },
              {
                icon: <Video className="text-emerald-600" size={24} />,
                title: "Multimedia Hub",
                desc: "Stream and download audio lectures, event photo galleries, and video recordings from past events.",
              },
              {
                icon: <MessageSquare className="text-emerald-600" size={24} />,
                title: "Feedback & Enquiries",
                desc: "Direct communication channel for members to share feedback, ask questions, and suggest improvements.",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="group p-8 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-950/5 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-emerald-100 transition-all">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dual Perspective Highlight Section */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Admin Control Preview */}
          <div className="p-8 rounded-3xl bg-emerald-50/50 border border-emerald-100 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-100 text-emerald-800 text-xs font-semibold">
              <Shield size={14} /> For Administrators & Executives
            </div>
            <h3 className="text-2xl font-bold text-slate-900">
              Full Operational Control
            </h3>
            <ul className="space-y-4 text-slate-700 text-sm">
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-200 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                  ✓
                </div>
                Manage executive profiles and assign administrative permissions.
              </li>
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-200 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                  ✓
                </div>
                Publish multimedia, documents, and news announcements instantly.
              </li>
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-200 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                  ✓
                </div>
                Monitor member event attendance and process user feedback
                responses.
              </li>
            </ul>
          </div>

          {/* Member Experience Preview */}
          <div className="p-8 rounded-3xl bg-lime-50/40 border border-lime-200/60 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-lime-100 text-lime-900 text-xs font-semibold">
              <BookOpen size={14} /> For MSSN UDUS Members
            </div>
            <h3 className="text-2xl font-bold text-slate-900">
              Interactive Member Portal
            </h3>
            <ul className="space-y-4 text-slate-700 text-sm">
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-lime-200 text-lime-900 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                  ✓
                </div>
                Register for upcoming seminars, Islamic week activities, and
                programs.
              </li>
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-lime-200 text-lime-900 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                  ✓
                </div>
                Stream audio Halqahs, event videos, and download reading
                materials.
              </li>
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-lime-200 text-lime-900 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                  ✓
                </div>
                Direct access to branch executive leadership through integrated
                feedback.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA Callout */}
      <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div className="p-10 rounded-3xl bg-linear-to-r from-emerald-900 via-emerald-800 to-green-900 text-white space-y-6 shadow-xl shadow-emerald-950/10">
          <h2 className="text-3xl font-extrabold">
            Ready to connect with MSSN UDUS?
          </h2>
          <p className="text-emerald-100 max-w-xl mx-auto text-sm sm:text-base">
            Create an account today to stay updated on branch activities, manage
            your event registrations, and access exclusive learning materials.
          </p>
          <button className="px-8 py-3.5 text-slate-950 bg-linear-to-r from-emerald-400 to-lime-300 font-bold rounded-xl shadow-lg hover:scale-105 transition-all">
            Get Started Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-200 bg-slate-50 text-slate-600 text-xs py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <img
                src={mssnLogo}
                alt="MSSN Logo"
                className="w-7 h-7 object-contain rounded-md"
              />
              <span className="font-bold text-emerald-800 text-base">
                MSSN UDUS
              </span>
              <span className="text-slate-300">|</span>
              <span className="text-emerald-600 font-mono font-medium">
                Central Management System
              </span>
            </div>
            <p className="text-slate-500">
              Muslim Students' Society of Nigeria, Usmanu Danfodiyo University
              Sokoto Chapter.
            </p>
          </div>

          <div className="flex gap-6 text-slate-600">
            <a href="#" className="hover:text-emerald-700 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-emerald-700 transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-emerald-700 transition-colors">
              Support
            </a>
          </div>

          <div className="text-slate-400">
            &copy; {new Date().getFullYear()} MSSN UDUS. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
