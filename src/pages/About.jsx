import NavBar from "../components/NavBar";
import mssnLogo from "../assets/MSSN_logo.jpg";
import { BookOpen, Users, Heart, Award, Target, Compass } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Top Navigation */}
      <NavBar />

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 py-12 space-y-12">
        {/* Page Hero Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <img
            src={mssnLogo}
            alt="MSSN UDUS Emblem"
            className="w-20 h-20 mx-auto object-contain rounded-2xl border border-emerald-100 p-1 bg-white shadow-sm"
          />
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            About <span className="text-emerald-700">MSSN UDUS</span>
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Muslim Students' Society of Nigeria, Usmanu Danfodiyo University
            Sokoto Branch. Dedicated to fostering Islamic unity, academic
            excellence, and moral guidance.
          </p>
        </div>

        {/* Mission & Vision Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Target size={22} />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Our Mission</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              To establish an inclusive environment that nurtures Muslim
              students spiritually, academically, and socially while providing
              moral leadership across campus.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Compass size={22} />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Our Vision</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              To serve as a premier student body that empowers members to become
              upright, knowledgeable, and impactful leaders within the campus
              community and society at large.
            </p>
          </div>
        </div>

        {/* Core Objectives Section */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-2xl font-bold text-slate-900 text-center">
            What We Stand For
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-semibold text-slate-900 text-base">
                <BookOpen size={18} className="text-emerald-600" />
                <span>Islamic Education</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Organizing Halqahs, lectures, and Islamic Week programs to
                increase beneficial knowledge.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 font-semibold text-slate-900 text-base">
                <Award size={18} className="text-emerald-600" />
                <span>Academic Excellence</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Supporting students with tutorials, guidance, and resources to
                excel in their degree programs.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 font-semibold text-slate-900 text-base">
                <Users size={18} className="text-emerald-600" />
                <span>Unity & Brotherhood</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Building a tight-knit community where every member feels
                welcomed and supported.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 font-semibold text-slate-900 text-base">
                <Heart size={18} className="text-emerald-600" />
                <span>Welfare & Support</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Providing practical welfare assistance to students in need
                throughout their academic stay.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="p-8 rounded-2xl bg-emerald-900 text-white text-center space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold">
            Get Involved with MSSN UDUS
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-xl mx-auto leading-relaxed">
            Whether you are a new student looking to connect or a returning
            student wanting to participate, the MSSN family welcomes you.
          </p>
          <div className="pt-2">
            <a
              href="/register"
              className="inline-block px-6 py-3 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-sm rounded-xl transition-colors"
            >
              Join the Portal Today
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-slate-200 text-center text-xs text-slate-400">
        &copy; {new Date().getFullYear()} MSSN UDUS. All rights reserved.
      </footer>
    </div>
  );
}
