import React, { useState } from "react";
import NavBar from "../components/NavBar";
import { supabase } from "../supabaseClient";
import {
  Send,
  Mail,
  MapPin,
  Phone,
  CheckCircle2,
  MessageSquare,
  Sparkles,
  AlertTriangle,
  Lightbulb,
  HelpCircle,
  Loader2,
  ShieldCheck,
} from "lucide-react";

export default function FeedbackPage() {
  const [formData, setFormData] = useState({
    title: "",
    type: "suggestion",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const { error } = await supabase.from("feedback").insert([
        {
          title: formData.title,
          type: formData.type,
          message: formData.message,
          status: "new",
        },
      ]);

      if (error) throw error;

      setSubmitted(true);
    } catch (err) {
      console.error("Error submitting feedback:", err.message);
      setErrorMsg("Failed to send submission. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const typeOptions = [
    {
      id: "suggestion",
      label: "Suggestion",
      icon: Lightbulb,
      activeColor:
        "bg-amber-50 text-amber-800 border-amber-300 ring-2 ring-amber-500/10",
    },
    {
      id: "idea",
      label: "Idea",
      icon: Sparkles,
      activeColor:
        "bg-emerald-50 text-emerald-800 border-emerald-300 ring-2 ring-emerald-500/10",
    },
    {
      id: "complaint",
      label: "Complaint",
      icon: AlertTriangle,
      activeColor:
        "bg-rose-50 text-rose-800 border-rose-300 ring-2 ring-rose-500/10",
    },
    {
      id: "inquiry",
      label: "Inquiry",
      icon: HelpCircle,
      activeColor:
        "bg-sky-50 text-sky-800 border-sky-300 ring-2 ring-sky-500/10",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      <NavBar />

      <main className="max-w-5xl mx-auto px-4 py-10 space-y-10">
        {/* Header */}
        <div className="text-center space-y-3 max-w-xl mx-auto">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto shadow-2xs">
            <MessageSquare size={24} />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Virtual <span className="text-emerald-700">Suggestion Box</span>
          </h1>
          <p className="text-slate-600 text-sm leading-relaxed">
            Have an idea, general enquiry, or complaint? Share your thoughts
            directly with the MSSN UDUS Executive Committee.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-start">
          {/* Secretariat Contact Card */}
          <div className="md:col-span-1 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Reach Us Directly
            </h2>

            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3 text-slate-600">
                <MapPin
                  size={18}
                  className="text-emerald-600 shrink-0 mt-0.5"
                />
                <div>
                  <p className="font-semibold text-slate-800 text-xs">
                    Secretariat
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    MSSN Secretariat, UDUS Main Campus, Sokoto, Nigeria.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-slate-600">
                <Mail size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-800 text-xs">Email</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    info@mssnudus.org
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-slate-600">
                <Phone size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-800 text-xs">
                    Phone & WhatsApp
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    +234 (0) 800 000 0000
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/60 text-xs text-slate-600 leading-relaxed flex items-start gap-2.5">
              <ShieldCheck
                size={18}
                className="text-emerald-600 shrink-0 mt-0.5"
              />
              <span>
                <strong>100% Anonymous:</strong> Submissions are private and
                reviewed solely by Executive Officers.
              </span>
            </div>
          </div>

          {/* Form Area */}
          <div className="md:col-span-2 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <CheckCircle2
                  size={48}
                  className="text-emerald-600 mx-auto animate-bounce"
                />
                <h2 className="text-2xl font-bold text-slate-900">
                  Jazakallah Khair!
                </h2>
                <p className="text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
                  Your entry has been dropped into the suggestion box. The
                  Executive Committee will review it shortly.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({
                      title: "",
                      type: "suggestion",
                      message: "",
                    });
                  }}
                  className="px-5 py-2.5 bg-emerald-700 text-white rounded-xl text-xs font-semibold hover:bg-emerald-800 transition-colors shadow-2xs"
                >
                  Submit Another Feedback
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                  Submit Feedback
                </h2>

                {errorMsg && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl">
                    {errorMsg}
                  </div>
                )}

                {/* Feedback Type Selection */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700">
                    Submission Type
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {typeOptions.map((opt) => {
                      const IconComponent = opt.icon;
                      const isSelected = formData.type === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() =>
                            setFormData({ ...formData, type: opt.id })
                          }
                          className={`flex items-center justify-center gap-1.5 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                            isSelected
                              ? opt.activeColor
                              : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          <IconComponent size={14} />
                          <span>{opt.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Title Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Subject / Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    placeholder="e.g. Suggestion for Friday Halqah timing"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 transition-all placeholder:text-slate-400"
                  />
                </div>

                {/* Message Body */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Details / Message
                  </label>
                  <textarea
                    name="message"
                    rows={5}
                    required
                    placeholder="Explain your suggestion, idea, or issue in detail..."
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 transition-all resize-none placeholder:text-slate-400"
                  ></textarea>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm rounded-xl shadow-2xs transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      <span>Send Submission</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-slate-200 text-center text-xs text-slate-400 mt-12">
        &copy; {new Date().getFullYear()} MSSN UDUS. All rights reserved.
      </footer>
    </div>
  );
}
