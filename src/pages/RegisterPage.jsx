import React, { useState, useEffect } from "react";
import mssnLogo from "../assets/MSSN_logo.jpg";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import {
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  X,
  Globe,
  ArrowRight,
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

  // Password Strength State
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    label: "",
    color: "",
  });

  // Notification Modal State
  const [modal, setModal] = useState({
    isOpen: false,
    type: "",
    title: "",
    message: "",
  });

  // Calculate Password Strength Logic
  useEffect(() => {
    const calculateStrength = (pass) => {
      let score = 0;
      if (pass.length >= 8) score += 1;
      if (/\d/.test(pass)) score += 1;
      if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) score += 1;
      if (/[^A-Za-z0-9]/.test(pass)) score += 1;

      switch (score) {
        case 0:
          return { score: 0, label: "", color: "bg-slate-200" };
        case 1:
          return { score: 1, label: "Weak", color: "bg-red-500" };
        case 2:
          return { score: 2, label: "Fair", color: "bg-orange-500" };
        case 3:
          return { score: 3, label: "Good", color: "bg-blue-500" };
        case 4:
          return { score: 4, label: "Strong", color: "bg-emerald-500" };
        default:
          return { score: 0, label: "", color: "bg-slate-200" };
      }
    };
    setPasswordStrength(calculateStrength(password));
  }, [password]);

  const closeModal = () => {
    setModal({ isOpen: false, type: "", title: "", message: "" });
    if (modal.type === "success") {
      navigate("/login");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!fullName || !email || !department || !password) {
      setModal({
        isOpen: true,
        type: "error",
        title: "Missing Information",
        message: "Please fill in all required fields before submitting.",
      });
      return;
    }

    if (passwordStrength.score < 3) {
      setModal({
        isOpen: true,
        type: "error",
        title: "Weak Password",
        message:
          "Please choose a stronger password (at least 8 chars, mix of letters, numbers & symbols).",
      });
      return;
    }

    setLoading(true);

    try {
      // Pass metadata directly inside options.data
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            full_name: fullName,
            department: department,
          },
        },
      });

      if (authError) throw authError;
      console.log(authData);

      // Detect if user already exists (identities array will be empty)
      if (authData.user && authData.user.identities?.length === 0) {
        setModal({
          isOpen: true,
          type: "error",
          title: "Account Already Exists",
          message:
            "An account with this email already exists. Please try logging in instead.",
        });
        return;
      }

      setModal({
        isOpen: true,
        type: "success",
        title: "Registration Successful!",
        message:
          "Your account has been created. Please check your email inbox to verify your address before logging in.",
      });
    } catch (error) {
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

        {/* Link back to guest/portal preview */}
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
              Sign up
            </h1>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            {/* Full Name Floating Container */}
            <div className="relative border border-slate-200 rounded-2xl p-2.5 bg-slate-50/50 focus-within:bg-white focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500 transition-all">
              <label className="block text-[10px] font-extrabold text-slate-600 uppercase tracking-wider px-1">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Fatima Abubakar"
                className="w-full px-1 py-0.5 text-xs font-semibold text-slate-900 bg-transparent outline-none placeholder:text-slate-300"
              />
            </div>

            {/* Email Address Floating Container */}
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

            {/* Department Floating Container */}
            <div className="relative border border-slate-200 rounded-2xl p-2.5 bg-slate-50/50 focus-within:bg-white focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500 transition-all">
              <label className="block text-[10px] font-extrabold text-slate-600 uppercase tracking-wider px-1">
                Department
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g. Computer Science"
                className="w-full px-1 py-0.5 text-xs font-semibold text-slate-900 bg-transparent outline-none placeholder:text-slate-300"
              />
            </div>

            {/* Password Floating Container */}
            <div className="relative border border-slate-200 rounded-2xl p-2.5 bg-slate-50/50 focus-within:bg-white focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500 transition-all">
              <label className="block text-[10px] font-extrabold text-slate-600 uppercase tracking-wider px-1">
                Password
              </label>
              <div className="flex items-center justify-between pr-1">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
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

              {/* Password Strength Indicator */}
              {password && (
                <div className="mt-2 px-1 space-y-1">
                  <div className="flex justify-between items-center text-[10px] font-bold">
                    <span className="text-slate-400">Strength</span>
                    <span
                      className={
                        passwordStrength.score === 1
                          ? "text-red-500"
                          : passwordStrength.score === 2
                            ? "text-orange-500"
                            : passwordStrength.score === 3
                              ? "text-blue-500"
                              : passwordStrength.score === 4
                                ? "text-emerald-500"
                                : "text-slate-400"
                      }
                    >
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ease-out ${passwordStrength.color}`}
                      style={{
                        width: `${(passwordStrength.score / 4) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Primary Submit Button */}
            <button
              type="submit"
              disabled={loading || passwordStrength.score < 3}
              className="w-full py-3.5 px-6 font-bold text-xs text-white bg-emerald-500 hover:bg-emerald-600 rounded-2xl shadow-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer mt-2"
            >
              {loading ? "Creating Account..." : "Sign up"}
            </button>
          </form>

          {/* Login Redirection Link */}
          <div className="text-center pt-2">
            <p className="text-xs font-medium text-slate-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
              >
                Login Now
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

            {modal.type === "success" ? (
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 size={24} />
              </div>
            ) : (
              <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
                <AlertCircle size={24} />
              </div>
            )}

            <div>
              <h3 className="text-sm font-extrabold text-slate-900">
                {modal.title}
              </h3>
              <p className="text-xs text-slate-500 mt-1">{modal.message}</p>
            </div>

            <button
              onClick={closeModal}
              className={`w-full py-3 rounded-2xl text-xs font-bold text-white transition-all cursor-pointer ${
                modal.type === "success"
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "bg-slate-900 hover:bg-slate-800"
              }`}
            >
              {modal.type === "success" ? "Proceed to Sign In" : "Try Again"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
