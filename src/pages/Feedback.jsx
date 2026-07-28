import React, { useState } from "react";
import NavBar from "../components/NavBar";
import {
  Send,
  Mail,
  MapPin,
  Phone,
  CheckCircle2,
  MessageSquare,
} from "lucide-react";

export default function FeedbackPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    category: "General Enquiry",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Front-end placeholder logic
    setSubmitted(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* Navigation */}
      <NavBar />

      <main className="max-w-5xl mx-auto px-4 py-10 space-y-10">
        {/* Header */}
        <div className="text-center space-y-3 max-w-xl mx-auto">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto">
            <MessageSquare size={24} />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">
            Contact & <span className="text-emerald-700">Feedback</span>
          </h1>
          <p className="text-slate-600 text-sm leading-relaxed">
            Have a question, suggestion, or issue? Reach out directly to the
            MSSN UDUS executive committee.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-start">
          {/* Contact Details Side Box */}
          <div className="md:col-span-1 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
              Reach Us Directly
            </h2>

            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3 text-slate-600">
                <MapPin
                  size={18}
                  className="text-emerald-600 shrink-0 mt-0.5"
                />
                <div>
                  <p className="font-semibold text-slate-800">Secretariat</p>
                  <p className="text-xs">
                    MSSN Secretariat, UDUS Main Campus, Sokoto, Nigeria.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-slate-600">
                <Mail size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-800">Email</p>
                  <p className="text-xs">info@mssnudus.org</p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-slate-600">
                <Phone size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-800">
                    Phone & WhatsApp
                  </p>
                  <p className="text-xs">+234 (0) 800 000 0000</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 text-xs text-emerald-800 leading-relaxed">
              <strong>Notice:</strong> For urgent academic or welfare concerns,
              visit the Secretariat during official hours (4:00 PM – 6:00 PM
              daily).
            </div>
          </div>

          {/* Form Area */}
          <div className="md:col-span-2 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <CheckCircle2 size={48} className="text-emerald-600 mx-auto" />
                <h2 className="text-2xl font-bold text-slate-900">
                  Jazakallah Khair!
                </h2>
                <p className="text-sm text-slate-600 max-w-sm mx-auto">
                  Your feedback has been received. An executive officer will
                  review it shortly.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({
                      name: "",
                      email: "",
                      category: "General Enquiry",
                      message: "",
                    });
                  }}
                  className="px-5 py-2.5 bg-emerald-700 text-white rounded-xl text-xs font-semibold hover:bg-emerald-800 transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
                  Send a Message
                </h2>

                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Name Input */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="e.g. Ahmad Usman"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all"
                    />
                  </div>

                  {/* Email Input */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="student@udus.edu.ng"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all"
                    />
                  </div>
                </div>

                {/* Category Selection */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all"
                  >
                    <option value="General Enquiry">General Enquiry</option>
                    <option value="Welfare Request">Welfare Request</option>
                    <option value="Event Feedback">Event Feedback</option>
                    <option value="Portal Support">Portal / Tech Issue</option>
                    <option value="Suggestion">Suggestion / Advice</option>
                  </select>
                </div>

                {/* Message Body */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Message
                  </label>
                  <textarea
                    name="message"
                    rows={5}
                    required
                    placeholder="Type your message or enquiry here..."
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all resize-none"
                  ></textarea>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
                >
                  <Send size={16} />
                  <span>Submit Feedback</span>
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
