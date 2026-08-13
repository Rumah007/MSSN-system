import { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient"; // Adjust path to match your project setup
import AdminSidebar from "../admin/components/AdminSidebar";
import {
  Users,
  Search,
  Filter,
  Download,
  Mail,
  Phone,
  Menu,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  UserPlus,
  X,
  Loader2,
} from "lucide-react";

export default function AdminMembersPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [levelFilter, setLevelFilter] = useState("All");

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  // Modal State for Promoting Member to Exco
  const [selectedMember, setSelectedMember] = useState(null);
  const [excoRoleInput, setExcoRoleInput] = useState("");
  const [isPromoteModalOpen, setIsPromoteModalOpen] = useState(false);

  // Fetch profiles from Supabase
  const fetchMembers = async () => {
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
    fetchMembers();
  }, []);

  // Update Exco status in Supabase
  const handlePromoteToExco = async () => {
    if (!selectedMember || !excoRoleInput.trim()) return;

    setUpdatingId(selectedMember.id);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          is_exco: true,
          exco_role: excoRoleInput.trim(),
        })
        .eq("id", selectedMember.id);

      if (error) throw error;

      setMembers((prev) =>
        prev.map((m) =>
          m.id === selectedMember.id
            ? { ...m, is_exco: true, exco_role: excoRoleInput.trim() }
            : m,
        ),
      );
      closePromoteModal();
    } catch (err) {
      console.error("Failed to promote user:", err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  // Revoke Exco status
  const handleRevokeExco = async (id) => {
    setUpdatingId(id);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          is_exco: false,
          exco_role: null,
        })
        .eq("id", id);

      if (error) throw error;

      setMembers((prev) =>
        prev.map((m) =>
          m.id === id ? { ...m, is_exco: false, exco_role: null } : m,
        ),
      );
    } catch (err) {
      console.error("Failed to revoke Exco role:", err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const openPromoteModal = (member) => {
    setSelectedMember(member);
    setExcoRoleInput(member.exco_role || "");
    setIsPromoteModalOpen(true);
  };

  const closePromoteModal = () => {
    setSelectedMember(null);
    setExcoRoleInput("");
    setIsPromoteModalOpen(false);
  };

  // Filtering Logic
  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      (member.full_name || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (member.matric_number || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (member.email || "").toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDept =
      departmentFilter === "All" || member.department === departmentFilter;
    const matchesLevel = levelFilter === "All" || member.level === levelFilter;

    return matchesSearch && matchesDept && matchesLevel;
  });

  return (
    <div className="min-h-screen bg-slate-100 flex text-slate-800 font-sans">
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
            >
              <Menu size={20} />
            </button>
            <span className="font-bold text-slate-900 text-sm">
              Members Directory
            </span>
          </div>
          <span className="text-xs px-2.5 py-1 bg-emerald-50 text-emerald-700 font-bold rounded-full border border-emerald-100">
            Admin Portal
          </span>
        </header>

        {/* Main Content Area */}
        <main className="p-4 sm:p-8 space-y-6 max-w-6xl mx-auto w-full">
          {/* Header Title & Export Action */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                <Users className="text-emerald-600" size={24} />
                <span>Student & Executive Roster</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Manage members, assign executive roles, and review profiles.
              </p>
            </div>
            <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer">
              <Download size={16} />
              <span>Export Roster (CSV)</span>
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <p className="text-xs text-slate-500 font-medium">
                Total Profiles
              </p>
              <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                {members.length}
              </h3>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <p className="text-xs text-slate-500 font-medium">Active Excos</p>
              <h3 className="text-xl font-extrabold text-emerald-600 mt-1">
                {members.filter((m) => m.is_exco).length}
              </h3>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <p className="text-xs text-slate-500 font-medium">
                General Students
              </p>
              <h3 className="text-xl font-extrabold text-slate-700 mt-1">
                {members.filter((m) => !m.is_exco).length}
              </h3>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <p className="text-xs text-slate-500 font-medium">
                Filtered Result
              </p>
              <h3 className="text-xl font-extrabold text-slate-700 mt-1">
                {filteredMembers.length}
              </h3>
            </div>
          </div>

          {/* Search & Filtering Control Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex flex-col md:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  placeholder="Search by name, matric number, or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto">
                <Filter
                  size={14}
                  className="text-slate-400 shrink-0 hidden sm:block"
                />
                <select
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  className="w-full md:w-48 px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-medium"
                >
                  <option value="All">All Departments</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Biochemistry">Biochemistry</option>
                  <option value="Physics">Physics</option>
                  <option value="Medicine & Surgery">Medicine & Surgery</option>
                  <option value="Economics">Economics</option>
                </select>

                <select
                  value={levelFilter}
                  onChange={(e) => setLevelFilter(e.target.value)}
                  className="w-full md:w-32 px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-medium"
                >
                  <option value="All">All Levels</option>
                  <option value="100L">100L</option>
                  <option value="200L">200L</option>
                  <option value="300L">300L</option>
                  <option value="400L">400L</option>
                  <option value="500L">500L</option>
                </select>
              </div>
            </div>
          </div>

          {/* Members Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200 text-[10px]">
                  <tr>
                    <th className="px-5 py-3.5">Student Info</th>
                    <th className="px-5 py-3.5">Matric No</th>
                    <th className="px-5 py-3.5">Dept & Level</th>
                    <th className="px-5 py-3.5">Contact</th>
                    <th className="px-5 py-3.5">Role / Status</th>
                    <th className="px-5 py-3.5 text-right">Exco Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-5 py-10 text-center text-slate-400"
                      >
                        <div className="flex justify-center items-center gap-2">
                          <Loader2
                            size={16}
                            className="animate-spin text-emerald-600"
                          />
                          <span>Loading database roster...</span>
                        </div>
                      </td>
                    </tr>
                  ) : filteredMembers.length === 0 ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-5 py-10 text-center text-slate-400"
                      >
                        No students found matching your criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredMembers.map((member) => (
                      <tr
                        key={member.id}
                        className="hover:bg-slate-50/80 transition-colors"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0">
                              {(member.full_name || "U").charAt(0)}
                            </div>
                            <div>
                              <p className="font-extrabold text-slate-900">
                                {member.full_name}
                              </p>
                              <p className="text-[10px] text-slate-400">
                                Registered{" "}
                                {new Date(
                                  member.created_at,
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4 font-mono font-semibold text-slate-700">
                          {member.matric_number || "N/A"}
                        </td>

                        <td className="px-5 py-4">
                          <p className="font-medium text-slate-800">
                            {member.department || "Unassigned"}
                          </p>
                          <span className="inline-block mt-0.5 px-2 py-0.2 bg-slate-100 text-slate-600 font-bold text-[10px] rounded-md">
                            {member.level || "N/A"}
                          </span>
                        </td>

                        <td className="px-5 py-4 space-y-0.5">
                          <div className="flex items-center gap-1.5 text-slate-600">
                            <Mail size={12} className="text-slate-400" />
                            <span>{member.email}</span>
                          </div>
                          {member.phone && (
                            <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                              <Phone size={12} className="text-slate-400" />
                              <span>{member.phone}</span>
                            </div>
                          )}
                        </td>

                        <td className="px-5 py-4">
                          {member.is_exco ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border bg-emerald-50 text-emerald-700 border-emerald-100">
                              <ShieldCheck size={12} />
                              {member.exco_role || "Executive"}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border bg-slate-50 text-slate-600 border-slate-200">
                              Student Member
                            </span>
                          )}
                        </td>

                        <td className="px-5 py-4 text-right">
                          {updatingId === member.id ? (
                            <Loader2
                              size={16}
                              className="animate-spin text-emerald-600 inline-block"
                            />
                          ) : member.is_exco ? (
                            <button
                              onClick={() => handleRevokeExco(member.id)}
                              className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 transition-all cursor-pointer"
                            >
                              Revoke Exco
                            </button>
                          ) : (
                            <button
                              onClick={() => openPromoteModal(member)}
                              className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-all cursor-pointer inline-flex items-center gap-1"
                            >
                              <UserPlus size={12} />
                              Make Exco
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Exco Promotion Modal */}
      {isPromoteModalOpen && selectedMember && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <ShieldCheck className="text-emerald-600" size={18} />
                Assign Executive Role
              </h3>
              <button
                onClick={closePromoteModal}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-600">
                You are setting{" "}
                <strong className="text-slate-900">
                  {selectedMember.full_name}
                </strong>{" "}
                as an executive member.
              </p>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Executive Role / Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. President, Director of Software, PRO"
                  value={excoRoleInput}
                  onChange={(e) => setExcoRoleInput(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-medium"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={closePromoteModal}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handlePromoteToExco}
                disabled={!excoRoleInput.trim()}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs transition-all flex items-center gap-1.5"
              >
                Confirm Promotion
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
