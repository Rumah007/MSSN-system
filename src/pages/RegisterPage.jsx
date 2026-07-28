import React, { useState } from "react";
import mssnLogo from "../assets/MSSN_logo.jpg";
import {
  User,
  Mail,
  Phone,
  BookOpen,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Info,
} from "lucide-react";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col justify-between selection:bg-emerald-200 selection:text-emerald-900 relative overflow-hidden">
      {/* Background Soft Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-emerald-100/70 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-lime-100/60 blur-3xl" />
      </div>

      {/* Top Header / Back Link */}
      <header className="relative z-10 max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between">
        <a href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl overflow-hidden border border-emerald-200 bg-white p-0.5 shadow-sm group-hover:border-emerald-400 transition-colors">
            <img
              src={mssnLogo}
              alt="MSSN Logo"
              className="w-full h-full object-contain rounded-lg"
            />
          </div>
          <span className="font-bold text-slate-900 tracking-wide text-sm group-hover:text-emerald-700 transition-colors">
            MSSN UDUS Portal
          </span>
        </a>
        <a
          href="/login"
          className="text-sm font-semibold text-emerald-700 hover:text-emerald-900 transition-colors"
        >
          Already have an account? <span className="underline">Sign In</span>
        </a>
      </header>

      {/* Main Form Container */}
      <main className="relative z-10 my-auto py-8 px-4 flex items-center justify-center">
        <div className="w-full max-w-xl bg-white/90 backdrop-blur-md rounded-3xl border border-emerald-100 shadow-xl shadow-emerald-950/5 p-8 sm:p-10 space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 mx-auto rounded-2xl border border-emerald-200 bg-white p-1 shadow-md shadow-emerald-500/10 flex items-center justify-center">
              <img
                src={mssnLogo}
                alt="MSSN UDUS Emblem"
                className="w-full h-full object-contain rounded-xl"
              />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight pt-1">
              Join MSSN UDUS Portal
            </h1>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              Create your account to access event registrations, study
              materials, and branch broadcasts
            </p>
          </div>

          {/* Form */}
          <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Full Name (Surname First)
              </label>
              <div className="relative">
                <User
                  className="absolute left-3.5 top-3.5 text-slate-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="e.g. Abubakar Fatima Bello"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all bg-white"
                />
              </div>
            </div>

            {/* Email & Phone (Grid) */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-3.5 top-3.5 text-slate-400"
                    size={18}
                  />
                  <input
                    type="email"
                    placeholder="student@udusok.edu.ng"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all bg-white"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Phone Number (WhatsApp)
                </label>
                <div className="relative">
                  <Phone
                    className="absolute left-3.5 top-3.5 text-slate-400"
                    size={18}
                  />
                  <input
                    type="tel"
                    placeholder="08012345678"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Reg Number & Faculty/Dept (Grid) */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Matric / Admission Number
                </label>
                <div className="relative">
                  <BookOpen
                    className="absolute left-3.5 top-3.5 text-slate-400"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="2110203001"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all bg-white"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Faculty / Level
                </label>
                <select className="w-full px-3.5 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all bg-white">
                  <option value="">Select Level</option>
                  <option value="100">100 Level</option>
                  <option value="200">200 Level</option>
                  <option value="300">300 Level</option>
                  <option value="400">400 Level</option>
                  <option value="500">500 Level+</option>
                  <option value="pg">Postgraduate / Staff</option>
                </select>
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Create Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3.5 top-3.5 text-slate-400"
                  size={18}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Minimum 8 characters"
                  className="w-full pl-10 pr-11 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              className="w-full py-3.5 px-6 text-slate-950 font-bold bg-gradient-to-r from-emerald-400 via-emerald-400 to-lime-300 rounded-xl shadow-md shadow-emerald-500/10 hover:shadow-lg hover:shadow-emerald-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 text-sm"
            >
              Create Account <ArrowRight size={18} />
            </button>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-6 text-center text-xs text-slate-400">
        &copy; {new Date().getFullYear()} MSSN UDUS. All rights reserved.
      </footer>
    </div>
  );
}
