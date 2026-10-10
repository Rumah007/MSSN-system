import React, { useState } from "react";
import mssnLogo from "../assets/MSSN_logo.jpg";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { Eye, EyeOff, AlertCircle, X, Globe, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();

  // Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // UI State
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Modal State for Error/Feedback
  const [modal, setModal] = useState({
    isOpen: false,
    title: "",
    message: "",
  });

  const closeModal = () => {
    setModal({ isOpen: false, title: "", message: "" });
  };

  // Login Handler
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setModal({
        isOpen: true,
        title: "Missing Credentials",
        message: "Please enter both your email address and password.",
      });
      return;
    }

    setLoading(true);

    try {
      // 1. Supabase Authentication Call
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.session) {
        // 2. Fetch the user's profile to check role (.maybeSingle avoids 406 errors)
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("is_admin, is_exco")
          .eq("id", data.session.user.id)
          .maybeSingle();

        if (profileError) throw profileError;

        // 3. Conditional Redirect based on role (fallback to root if profile row is missing)
        if (profile?.is_admin) {
          navigate("/admin/dashboard");
        } else if (profile?.is_exco) {
          navigate("/exco/dashboard");
        } else {
          navigate("/"); // Regular member or default redirect
        }
      }
    } catch (error) {
      // Catch specific Supabase auth error for unconfirmed emails
      if (error.message?.includes("Email not confirmed")) {
        setModal({
          isOpen: true,
          title: "Email Verification Required",
          message:
            "Please check your email inbox and verify your address before logging in.",
        });
      } else {
        setModal({
          isOpen: true,
          title: "Authentication Failed",
          message:
            error.message ||
            "Invalid login credentials. Please check your email and password.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans flex flex-col justify-between selection:bg-emerald-100 selection:text-emerald-900">
      {/* Clean Top Navigation Bar */}
      <header className="max-w-6xl mx-auto w-full px-6 py-6 flex items-center justify-between border-b border-slate-50">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 cursor-pointer hover:text-slate-800 transition-colors">
          <Globe size={15} />
          <span>English</span>
        </div>

        {/* Brand Logo & Name */}
        <Link to="/" className="flex items-center gap-2.5">
          <img
            src={mssnLogo}
            alt="MSSN Logo"
            className="w-7 h-7 object-contain rounded-md"
          />
          <span className="font-extrabold text-slate-900 tracking-tight text-base">
            MSSN UDUS
          </span>
        </Link>

        {/* Link to Portal Explore */}
        <Link
          to="/"
          className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors flex items-center gap-1"
        >
          <span>Explore Portal</span>
          <ArrowRight size={14} />
        </Link>
      </header>

      {/* Main Centered Minimal Form */}
      <main className="my-auto py-10 px-4 flex items-center justify-center">
        <div className="w-full max-w-sm space-y-8">
          {/* Page Title */}
          <div className="text-center">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Sign in
            </h1>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Floating Container */}
            <div className="relative border border-slate-200 rounded-2xl p-2.5 bg-slate-50/50 focus-within:bg-white focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500 transition-all">
              <label className="block text-[10px] font-extrabold text-slate-600 uppercase tracking-wider px-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@udusok.edu.ng"
                className="w-full px-1 py-0.5 text-xs font-semibold text-slate-900 bg-transparent outline-none placeholder:text-slate-300"
              />
            </div>

            {/* Password Floating Container */}
            <div className="relative border border-slate-200 rounded-2xl p-2.5 bg-slate-50/50 focus-within:bg-white focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500 transition-all">
              <div className="flex items-center justify-between px-1">
                <label className="block text-[10px] font-extrabold text-slate-600 uppercase tracking-wider">
                  Password
                </label>
                <a
                  href="#forgot"
                  className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
                >
                  Forgot?
                </a>
              </div>
              <div className="flex items-center justify-between pr-1">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-1 py-0.5 text-xs font-semibold text-slate-900 bg-transparent outline-none placeholder:text-slate-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Keep Signed In Checkbox */}
            <div className="flex items-center justify-between px-1 pt-0.5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-3.5 h-3.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-xs font-medium text-slate-500">
                  Keep me signed in
                </span>
              </label>
            </div>

            {/* Primary Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 font-bold text-xs text-white bg-emerald-500 hover:bg-emerald-600 rounded-2xl shadow-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer mt-2"
            >
              {loading ? "Signing In..." : "Sign in"}
            </button>
          </form>

          {/* Registration Redirection Link */}
          <div className="text-center pt-2">
            <p className="text-xs font-medium text-slate-500">
              Need an account?{" "}
              <Link
                to="/register"
                className="font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
              >
                Register
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Response Modal */}
      {modal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 relative space-y-3 text-center">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-50 transition-colors"
            >
              <X size={16} />
            </button>

            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle size={24} />
            </div>

            <div>
              <h3 className="text-sm font-extrabold text-slate-900">
                {modal.title}
              </h3>
              <p className="text-xs text-slate-500 mt-1">{modal.message}</p>
            </div>

            <button
              onClick={closeModal}
              className="w-full py-3 rounded-2xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-all cursor-pointer"
            >
              Try Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
