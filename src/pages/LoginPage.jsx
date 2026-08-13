import { useState } from "react";
import mssnLogo from "../assets/MSSN_logo.jpg";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  X,
} from "lucide-react";

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
      // Supabase Authentication Call
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) throw error;

      // On success, redirect to dashboard or home
      if (data.session) {
        navigate("/");
      }
    } catch (error) {
      setModal({
        isOpen: true,
        title: "Authentication Failed",
        message:
          error.message ||
          "Invalid login credentials. Please check your email and password.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col justify-between selection:bg-emerald-200 selection:text-emerald-900 relative overflow-hidden">
      {/* Background Soft Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-emerald-100/70 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-lime-100/60 blur-3xl" />
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
          to="/register"
          className="text-sm font-semibold text-emerald-700 hover:text-emerald-900 transition-colors"
        >
          Need an account? <span className="underline">Register</span>
        </Link>
      </header>

      {/* Main Login Card Container */}
      <main className="relative z-10 my-auto py-8 px-4 flex items-center justify-center">
        <div className="w-full max-w-md bg-white/90 backdrop-blur-md rounded-3xl border border-emerald-100 shadow-xl shadow-emerald-950/5 p-8 sm:p-10 space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-16 h-16 mx-auto rounded-2xl border border-emerald-200 bg-white p-1 shadow-md shadow-emerald-500/10 flex items-center justify-center">
              <img
                src={mssnLogo}
                alt="MSSN UDUS Emblem"
                className="w-full h-full object-contain rounded-xl"
              />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight pt-2">
              Welcome Back
            </h1>
            <p className="text-sm text-slate-500 max-w-xs mx-auto">
              Sign in to access your member dashboard or executive tools
            </p>
          </div>

          {/* Form UI */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email Field */}
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
                  placeholder="e.g. student@udusok.edu.ng"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all bg-white"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-slate-700">
                  Password
                </label>
                <a
                  href="#forgot"
                  className="text-xs font-medium text-emerald-700 hover:underline"
                >
                  Forgot Password?
                </a>
              </div>
              <div className="relative">
                <Lock
                  className="absolute left-3.5 top-3.5 text-slate-400"
                  size={18}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
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

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-xs text-slate-600 font-medium">
                  Keep me signed in
                </span>
              </label>
            </div>

            {/* Primary CTA */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 text-slate-950 font-bold bg-gradient-to-r from-emerald-400 via-emerald-400 to-lime-300 rounded-xl shadow-md shadow-emerald-500/10 hover:shadow-lg hover:shadow-emerald-500/20 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 text-sm"
            >
              {loading ? "Signing In..." : "Sign In to Portal"}{" "}
              <ArrowRight size={18} />
            </button>
          </form>
        </div>
      </main>

      {/* Response Modal (Error) */}
      {modal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 relative space-y-4 text-center">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
            >
              <X size={18} />
            </button>

            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle size={28} />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900">
                {modal.title}
              </h3>
              <p className="text-xs text-slate-500 mt-1">{modal.message}</p>
            </div>

            <button
              onClick={closeModal}
              className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-slate-800 hover:bg-slate-900 transition-all"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Simple Footer */}
      <footer className="relative z-10 py-6 text-center text-xs text-slate-400">
        &copy; {new Date().getFullYear()} MSSN UDUS. All rights reserved.
      </footer>
    </div>
  );
}
