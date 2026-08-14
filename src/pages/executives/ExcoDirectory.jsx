import { useState, useEffect } from "react";
import {
  Users,
  Search,
  Menu,
  GraduationCap,
  Mail,
  Info,
  X,
  Building,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import ExcoSidebar from "./components/ExcoSidebar";
import { supabase } from "../../supabaseClient";

export default function ExcoDirectory() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Profiles from Supabase
  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setMembers(data || []);
    } catch (err) {
      console.error("Error fetching profiles:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  // Filtering Logic
  const filteredMembers = members.filter((member) => {
    const nameMatch = member.full_name
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());
    const deptMatch = member.department
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());
    const emailMatch = member.email
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesSearch = nameMatch || deptMatch || emailMatch;

    // Optional level filtering if level field exists, otherwise pass through
    const matchesLevel =
      selectedLevel === "All" || member.level === selectedLevel;

    return matchesSearch && matchesLevel;
  });

  return (
    <div className="min-h-screen bg-slate-100 flex text-slate-800 font-sans">
      {/* Reusable Sidebar */}
      <ExcoSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Top Mobile Header */}
        <header className="md:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
            >
              <Menu size={20} />
            </button>
            <span className="font-bold text-slate-900 text-sm">
              Member Directory
            </span>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-teal-50 text-teal-700 border border-teal-100">
            View-Only
          </span>
        </header>

        {/* Body Content */}
        <main className="p-4 sm:p-8 space-y-6 max-w-6xl mx-auto w-full">
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">
                Student Member Directory
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Lookup registered profiles, verify membership, and review
                executive roles.
              </p>
            </div>
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-slate-600 text-xs font-semibold shrink-0">
              <Info size={14} className="text-teal-600" />
              <span>Executive Verification Desk</span>
            </div>
          </div>

          {/* Search & Filter Controls */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              {/* Search Bar */}
              <div className="relative flex-1 w-full">
                <Search
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Search by student name, department, or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-teal-500 text-slate-800 placeholder:text-slate-400"
                />
              </div>

              {/* Level Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                {["All", "100L", "200L", "300L", "400L"].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setSelectedLevel(lvl)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                      selectedLevel === lvl
                        ? "bg-teal-600 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Members Listing Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <span className="font-bold text-slate-800 text-sm">
                Registered Profiles ({filteredMembers.length})
              </span>
              <span className="text-xs text-slate-400 font-medium">
                Real-time Database
              </span>
            </div>

            {loading ? (
              <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
                <Loader2 className="animate-spin text-teal-600" size={24} />
                <span className="text-xs font-semibold">
                  Loading student profiles...
                </span>
              </div>
            ) : filteredMembers.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <Users className="mx-auto text-slate-300" size={40} />
                <p className="text-sm font-bold text-slate-600">
                  No student records match your query
                </p>
                <p className="text-xs text-slate-400">
                  Try adjusting search parameters or clearing filters.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      <th className="py-3 px-4">Student</th>
                      <th className="py-3 px-4">Department</th>
                      <th className="py-3 px-4">Role</th>
                      <th className="py-3 px-4">Executive Status</th>
                      <th className="py-3 px-4 text-right">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {filteredMembers.map((member) => (
                      <tr
                        key={member.id}
                        className="hover:bg-slate-50/80 transition-colors"
                      >
                        <td className="py-3.5 px-4 min-w-[200px]">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center shrink-0 text-xs">
                              {(member.full_name || member.email || "U")
                                .charAt(0)
                                .toUpperCase()}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900">
                                {member.full_name || "N/A"}
                              </p>
                              <p className="text-[10px] text-slate-400">
                                {member.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <p className="font-semibold text-slate-800">
                            {member.department || "Not Specified"}
                          </p>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="font-medium text-slate-600">
                            {member.exco_role ||
                              (member.is_exco ? "Exco Officer" : "Member")}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1 border ${
                              member.is_exco
                                ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                : "bg-slate-50 text-slate-600 border-slate-200"
                            }`}
                          >
                            {member.is_exco ? (
                              <>
                                <ShieldCheck size={10} /> Exco
                              </>
                            ) : (
                              <>Member</>
                            )}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <button
                            onClick={() => setSelectedStudent(member)}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors text-xs cursor-pointer"
                          >
                            View Record
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Student Details View Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <GraduationCap size={18} className="text-teal-600" />
                <h3 className="font-extrabold text-slate-900 text-base">
                  Student Profile
                </h3>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-sm text-slate-900">
                    {selectedStudent.full_name || "N/A"}
                  </h4>
                  {selectedStudent.is_admin && (
                    <span className="font-mono text-xs text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100">
                      System Admin
                    </span>
                  )}
                </div>
                <p className="text-slate-500 font-medium">
                  {selectedStudent.department || "No Department Assigned"}
                </p>
              </div>

              <div className="space-y-2.5">
                <div className="flex items-center gap-3 text-slate-600">
                  <Mail size={16} className="text-slate-400 shrink-0" />
                  <span>{selectedStudent.email || "No email available"}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                  <Building size={16} className="text-slate-400 shrink-0" />
                  <span>
                    Department:{" "}
                    <strong>{selectedStudent.department || "N/A"}</strong>
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block">
                    Exco Designation
                  </span>
                  <span className="font-bold text-slate-800">
                    {selectedStudent.exco_role ||
                      (selectedStudent.is_exco ? "Executive" : "None")}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">
                    System Access
                  </span>
                  <span className="font-bold text-teal-700">
                    {selectedStudent.is_admin
                      ? "Admin"
                      : selectedStudent.is_exco
                        ? "Exco"
                        : "General Member"}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setSelectedStudent(null)}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl transition-colors text-xs cursor-pointer"
              >
                Close Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
