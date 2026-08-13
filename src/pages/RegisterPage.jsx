import React, { useState } from "react";
import mssnLogo from "../assets/MSSN_logo.jpg";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import {
  User,
  Mail,
  Building,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  X,
} from "lucide-react";

export default function RegisterPage() {
  const navigate = useNavigate();

  // Form State Variables
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [password, setPassword] = useState("");

  // UI Helper States
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Notification Modal State
  const [modal, setModal] = useState({
    isOpen: false,
    type: "", // 'success' or 'error'
    title: "",
    message: "",
  });

  // Helper function to close modal
  const closeModal = () => {
    setModal({ isOpen: false, type: "", title: "", message: "" });
    if (modal.type === "success") {
      navigate("/login");
    }
  };

  // Sign Up Handler
  const handleRegister = async (e) => {
    e.preventDefault();

    // Basic Client-side Validation
    if (!fullName || !email || !department || !password) {
      setModal({
        isOpen: true,
        type: "error",
        title: "Missing Information",
        message: "Please fill in all fields before submitting.",
      });
      return;
    }

    setLoading(true);

    try {
      // Step 1: Sign up user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email,
        password: password,
      });

      if (authError) throw authError;

      // Step 2: Insert additional user profile data into 'profiles' table
      if (authData.user) {
        const { error: profileError } = await supabase.from("profiles").insert([
          {
            id: authData.user.id,
            full_name: fullName,
            email: email,
            department: department,
            is_admin: false,
            is_exco: false,
          },
        ]);

        if (profileError) throw profileError;
      }

      // Step 3: Trigger Success Feedback
      setModal({
        isOpen: true,
        type: "success",
        title: "Registration Successful!",
        message:
          "Your account has been created successfully. You can now proceed to log in.",
      });
    } catch (error) {
      // Catch and display any error (Auth or Database)
      setModal({
        isOpen: true,
        type: "error",
        title: "Registration Failed",
        message:
          error.message || "An unexpected error occurred. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col justify-between selection:bg-emerald-200 selection:text-emerald-900 relative overflow-hidden">
      {/* Background Soft Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-emerald-100/70 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-lime-100/60 blur-3xl" />
      </div>

      {/* Top Header / Back Link */}
      <header className="relative z-10 max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
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
        </Link>
        <Link
          to="/login"
          className="text-sm font-semibold text-emerald-700 hover:text-emerald-900 transition-colors"
        >
          Already have an account? <span className="underline">Sign In</span>
        </Link>
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
              Create your account to access event announcements, lecture
              materials, and branch broadcasts
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleRegister} className="space-y-5">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Full Name
              </label>
              <div className="relative">
                <User
                  className="absolute left-3.5 top-3.5 text-slate-400"
                  size={18}
                />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Abubakar Fatima Bello"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all bg-white"
                />
              </div>
            </div>

            {/* Email Address */}
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@udusok.edu.ng"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all bg-white"
                />
              </div>
            </div>

            {/* Department */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Department
              </label>
              <div className="relative">
                <Building
                  className="absolute left-3.5 top-3.5 text-slate-400"
                  size={18}
                />
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="e.g. Computer Science"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all bg-white"
                />
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
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
              disabled={loading}
              className="w-full py-3.5 px-6 text-slate-950 font-bold bg-gradient-to-r from-emerald-400 via-emerald-400 to-lime-300 rounded-xl shadow-md shadow-emerald-500/10 hover:shadow-lg hover:shadow-emerald-500/20 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 text-sm"
            >
              {loading ? "Creating Account..." : "Create Account"}{" "}
              <ArrowRight size={18} />
            </button>
          </form>
        </div>
      </main>

      {/* Response Modal (Success / Error) */}
      {modal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 relative space-y-4 text-center">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
            >
              <X size={18} />
            </button>

            {modal.type === "success" ? (
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 size={28} />
              </div>
            ) : (
              <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
                <AlertCircle size={28} />
              </div>
            )}

            <div>
              <h3 className="text-base font-bold text-slate-900">
                {modal.title}
              </h3>
              <p className="text-xs text-slate-500 mt-1">{modal.message}</p>
            </div>

            <button
              onClick={closeModal}
              className={`w-full py-2.5 rounded-xl text-xs font-bold text-white transition-all ${
                modal.type === "success"
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "bg-slate-800 hover:bg-slate-900"
              }`}
            >
              {modal.type === "success" ? "Proceed to Sign In" : "Try Again"}
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="relative z-10 py-6 text-center text-xs text-slate-400">
        &copy; {new Date().getFullYear()} MSSN UDUS. All rights reserved.
      </footer>
    </div>
  );
}
