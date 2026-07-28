import { useState } from "react";
import { Link } from "react-router-dom";
import mssnLogo from "../assets/MSSN_logo.jpg";
import { Menu, X } from "lucide-react";

const NavBar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-emerald-100 bg-white/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo / Brand Name */}
        <Link to="/" onClick={closeMenu} className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl overflow-hidden border border-emerald-200 shadow-xs bg-white p-0.5 flex items-center justify-center shrink-0">
            <img
              src={mssnLogo}
              alt="MSSN Logo"
              className="w-full h-full object-contain rounded-lg"
            />
          </div>
          <div>
            <span className="font-bold text-lg text-emerald-900 tracking-wide block leading-none">
              MSSN UDUS
            </span>
            <span className="text-xs text-emerald-600 font-medium font-mono">
              Digital Portal
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <Link to="/" className="hover:text-emerald-600 transition-colors">
            Home
          </Link>
          <Link
            to="/events"
            className="hover:text-emerald-600 transition-colors"
          >
            Events
          </Link>
          <Link
            to="/resources"
            className="hover:text-emerald-600 transition-colors"
          >
            Resources
          </Link>
          <Link
            to="/media"
            className="hover:text-emerald-600 transition-colors"
          >
            Media
          </Link>
          <Link
            to="/about"
            className="hover:text-emerald-600 transition-colors"
          >
            About
          </Link>
          <Link
            to="/feedback"
            className="hover:text-emerald-600 transition-colors"
          >
            Feedback
          </Link>
        </div>

        {/* Desktop Call To Actions */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            className="px-4 py-2 text-sm font-semibold text-emerald-700 hover:text-emerald-900 transition-colors"
            to="/login"
          >
            Sign In
          </Link>
          <Link
            className="px-5 py-2.5 text-sm font-semibold text-slate-900 bg-gradient-to-r from-emerald-400 to-lime-300 rounded-xl shadow-xs hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            to="/register"
          >
            Join Portal
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-600 hover:text-emerald-600 transition-colors"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-emerald-100 bg-white px-4 pt-2 pb-6 space-y-3">
          <Link
            to="/"
            onClick={closeMenu}
            className="block py-2 text-slate-600 hover:text-emerald-600 font-medium"
          >
            Home
          </Link>
          <Link
            to="/events"
            onClick={closeMenu}
            className="block py-2 text-slate-600 hover:text-emerald-600 font-medium"
          >
            Events
          </Link>
          <Link
            to="/resources"
            onClick={closeMenu}
            className="block py-2 text-slate-600 hover:text-emerald-600 font-medium"
          >
            Resources
          </Link>
          <Link
            to="/media"
            onClick={closeMenu}
            className="block py-2 text-slate-600 hover:text-emerald-600 font-medium"
          >
            Media
          </Link>
          <Link
            to="/about"
            onClick={closeMenu}
            className="block py-2 text-slate-600 hover:text-emerald-600 font-medium"
          >
            About
          </Link>
          <Link
            to="/feedback"
            onClick={closeMenu}
            className="block py-2 text-slate-600 hover:text-emerald-600 font-medium"
          >
            Feedback
          </Link>

          {/* Mobile CTAs */}
          <div className="pt-4 flex flex-col gap-2">
            <Link
              onClick={closeMenu}
              className="w-full py-2.5 text-center text-emerald-700 border border-emerald-200 rounded-xl font-medium"
              to="/login"
            >
              Sign In
            </Link>
            <Link
              onClick={closeMenu}
              className="w-full py-2.5 text-center text-slate-900 bg-gradient-to-r from-emerald-400 to-lime-300 rounded-xl font-semibold"
              to="/register"
            >
              Join Portal
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
