import { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import AdminSidebar from "../admin/components/AdminSidebar";
import {
  Users,
  Search,
  Filter,
  Download,
  Mail,
  Phone,
  Menu,
  ShieldCheck,
  Trash2,
  AlertTriangle,
  Settings,
  X,
  Loader2,
} from "lucide-react";

export default function AdminMembersPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  // Management Modal State (Replaces cluttered inline actions)
  const [actionMember, setActionMember] = useState(null);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);

  // Modal State for Promoting Member to Exco
  const [excoRoleInput, setExcoRoleInput] = useState("");
  const [isPromoteModalOpen, setIsPromoteModalOpen] = useState(false);

  // Modal State for Deleting Member
  const [memberToDelete, setMemberToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

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
    if (!actionMember || !excoRoleInput.trim()) return;

    setUpdatingId(actionMember.id);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          is_exco: true,
          exco_role: excoRoleInput.trim(),
        })
        .eq("id", actionMember.id);

      if (error) throw error;

      setMembers((prev) =>
        prev.map((m) =>
          m.id === actionMember.id
            ? { ...m, is_exco: true, exco_role: excoRoleInput.trim() }
            : m,
        ),
      );
      closePromoteModal();
      closeActionModal();
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
      closeActionModal();
    } catch (err) {
      console.error("Failed to revoke Exco role:", err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  // Delete Member from database
  const handleDeleteMember = async () => {
    if (!memberToDelete) return;

    setDeletingId(memberToDelete.id);
    try {
      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", memberToDelete.id);

      if (error) throw error;

      setMembers((prev) => prev.filter((m) => m.id !== memberToDelete.id));
      closeDeleteModal();
    } catch (err) {
      console.error("Failed to delete member:", err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const openActionModal = (member) => {
    setActionMember(member);
    setIsActionModalOpen(true);
  };

  const closeActionModal = () => {
    setActionMember(null);
    setIsActionModalOpen(false);
  };

  const openPromoteModal = () => {
    setExcoRoleInput(actionMember?.exco_role || "");
    setIsActionModalOpen(false);
    setIsPromoteModalOpen(true);
  };

  const closePromoteModal = () => {
    setExcoRoleInput("");
    setIsPromoteModalOpen(false);
  };

  const openDeleteModalFromAction = () => {
    setMemberToDelete(actionMember);
    setIsActionModalOpen(false);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setMemberToDelete(null);
    setIsDeleteModalOpen(false);
  };

  // Filtering Logic (Search + Department)
  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      (member.full_name || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (member.email || "").toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDept =
      departmentFilter === "All" || member.department === departmentFilter;

    return matchesSearch && matchesDept;
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
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <p className="text-xs text-slate-500 font-medium">
                Total Profiles
              </p>
              <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                {members.length}
              </h3>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <p className="text-xs text-slate-500 font-medium">Active Excos</p>
              <h3 className="text-xl font-extrabold text-emerald-600 mt-1">
                {members.filter((m) => m.is_exco).length}
              </h3>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <p className="text-xs text-slate-500 font-medium">
                General Students
              </p>
              <h3 className="text-xl font-extrabold text-slate-700 mt-1">
                {members.filter((m) => !m.is_exco).length}
              </h3>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <p className="text-xs text-slate-500 font-medium">
                Filtered Result
              </p>
              <h3 className="text-xl font-extrabold text-slate-700 mt-1">
                {filteredMembers.length}
              </h3>
            </div>
          </div>

          {/* Search & Filtering Control Bar */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex flex-col md:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
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
                  className="w-full md:w-56 px-3 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-medium"
                >
                  <option value="All">All Departments</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Biochemistry">Biochemistry</option>
                  <option value="Physics">Physics</option>
                  <option value="Medicine & Surgery">Medicine & Surgery</option>
                  <option value="Economics">Economics</option>
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
                    <th className="px-6 py-4">Student Info</th>
                    <th className="px-6 py-4">Department</th>
                    <th className="px-6 py-4">Contact</th>
                    <th className="px-6 py-4">Role / Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-6 py-12 text-center text-slate-400"
                      >
                        <div className="flex justify-center items-center gap-2">
                          <Loader2
                            size={18}
                            className="animate-spin text-emerald-600"
                          />
                          <span>Loading database roster...</span>
                        </div>
                      </td>
                    </tr>
                  ) : filteredMembers.length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-6 py-12 text-center text-slate-400"
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
                        <td className="px-6 py-4.5">
                          <div>
                            <p className="font-extrabold text-slate-900 text-sm">
                              {member.full_name || "Unnamed"}
                            </p>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              Registered{" "}
                              {new Date(member.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </td>

                        <td className="px-6 py-4.5">
                          <p className="font-medium text-slate-800">
                            {member.department || "Unassigned"}
                          </p>
                        </td>

                        <td className="px-6 py-4.5 max-w-xs sm:max-w-sm">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-slate-600">
                              <Mail
                                size={13}
                                className="text-slate-400 shrink-0"
                              />
                              <span className="break-all">{member.email}</span>
                            </div>
                            {member.phone && (
                              <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                                <Phone
                                  size={13}
                                  className="text-slate-400 shrink-0"
                                />
                                <span>{member.phone}</span>
                              </div>
                            )}
                          </div>
                        </td>

                        <td className="px-6 py-4.5">
                          {member.is_exco ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border bg-emerald-50 text-emerald-700 border-emerald-100">
                              <ShieldCheck size={13} />
                              {member.exco_role || "Executive"}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold border bg-slate-50 text-slate-600 border-slate-200">
                              Student Member
                            </span>
                          )}
                        </td>

                        <td className="px-6 py-4.5 text-right">
                          <button
                            onClick={() => openActionModal(member)}
                            className="px-3.5 py-2 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 border border-slate-200 text-slate-700 font-semibold rounded-xl transition-all text-xs inline-flex items-center gap-1.5 cursor-pointer"
                          >
                            <Settings size={13} />
                            <span>Manage</span>
                          </button>
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

      {/* Action Hub Modal */}
      {isActionModalOpen && actionMember && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-sm w-full p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm">
                  Manage Member
                </h3>
                <p className="text-[11px] text-slate-500 truncate max-w-[220px]">
                  {actionMember.full_name || actionMember.email}
                </p>
              </div>
              <button
                onClick={closeActionModal}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-2.5">
              {actionMember.is_exco ? (
                <button
                  onClick={() => handleRevokeExco(actionMember.id)}
                  disabled={updatingId === actionMember.id}
                  className="w-full py-2.5 px-4 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {updatingId === actionMember.id ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <ShieldCheck size={14} />
                  )}
                  <span>Revoke Executive Status</span>
                </button>
              ) : (
                <button
                  onClick={openPromoteModal}
                  className="w-full py-2.5 px-4 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShieldCheck size={14} />
                  <span>Promote to Executive</span>
                </button>
              )}

              <button
                onClick={openDeleteModalFromAction}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 text-slate-700 font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Trash2 size={14} />
                <span>Delete Member Profile</span>
              </button>
            </div>

            <div className="pt-2">
              <button
                onClick={closeActionModal}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Exco Promotion Modal */}
      {isPromoteModalOpen && actionMember && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <ShieldCheck className="text-emerald-600" size={18} />
                Assign Executive Role
              </h3>
              <button
                onClick={closePromoteModal}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-600">
                You are setting{" "}
                <strong className="text-slate-900">
                  {actionMember.full_name}
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
                  className="w-full px-3 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-medium"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={closePromoteModal}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handlePromoteToExco}
                disabled={
                  !excoRoleInput.trim() || updatingId === actionMember.id
                }
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                {updatingId === actionMember.id ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <span>Confirm Promotion</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && memberToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-rose-600 text-base flex items-center gap-2">
                <AlertTriangle size={18} />
                Delete Member Profile
              </h3>
              <button
                onClick={closeDeleteModal}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <p className="text-slate-600">
                Are you sure you want to delete{" "}
                <strong className="text-slate-900">
                  {memberToDelete.full_name || memberToDelete.email}
                </strong>
                ? This action is permanent and removes their profile record from
                the system.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={closeDeleteModal}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteMember}
                disabled={deletingId === memberToDelete.id}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                {deletingId === memberToDelete.id ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Yes, Delete Member</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
