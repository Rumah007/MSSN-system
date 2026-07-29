import { useState } from "react";
import AdminSidebar from "../admin/components/AdminSidebar";
import {
  Users,
  Search,
  Filter,
  Download,
  Mail,
  Phone,
  GraduationCap,
  Menu,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  UserCheck,
} from "lucide-react";

export default function AdminMembersPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [levelFilter, setLevelFilter] = useState("All");

  // Sample Registered Students Roster
  const [members, setMembers] = useState([
    {
      id: "MEM-001",
      name: "Usman Ibrahim",
      matricNo: "UDUS/CS/2021/0104",
      department: "Computer Science",
      level: "400L",
      email: "usman.i@student.udus.edu.ng",
      phone: "+234 803 123 4567",
      status: "Active",
      joinedDate: "2024-11-12",
    },
    {
      id: "MEM-002",
      name: "Fatima Zainab Bello",
      matricNo: "UDUS/BCH/2022/0088",
      department: "Biochemistry",
      level: "300L",
      email: "zainab.b@student.udus.edu.ng",
      phone: "+234 814 987 6543",
      status: "Active",
      joinedDate: "2025-01-15",
    },
    {
      id: "MEM-003",
      name: "Ahmadu Abubakar",
      matricNo: "UDUS/PHY/2023/0019",
      department: "Physics",
      level: "200L",
      email: "ahmadu.p@student.udus.edu.ng",
      phone: "+234 902 334 5566",
      status: "Pending",
      joinedDate: "2026-02-01",
    },
    {
      id: "MEM-004",
      name: "Mariam Aliyu",
      matricNo: "UDUS/MBBS/2020/0052",
      department: "Medicine & Surgery",
      level: "500L",
      email: "m.aliyu@student.udus.edu.ng",
      phone: "+234 708 112 2334",
      status: "Active",
      joinedDate: "2024-09-05",
    },
    {
      id: "MEM-005",
      name: "Kabir Umar",
      matricNo: "UDUS/ECO/2022/0142",
      department: "Economics",
      level: "300L",
      email: "kabir.eco@student.udus.edu.ng",
      phone: "+234 811 554 6677",
      status: "Active",
      joinedDate: "2025-03-20",
    },
  ]);

  // Filtering Logic
  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.matricNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDept =
      departmentFilter === "All" || member.department === departmentFilter;
    const matchesLevel = levelFilter === "All" || member.level === levelFilter;

    return matchesSearch && matchesDept && matchesLevel;
  });

  const toggleMemberStatus = (id) => {
    setMembers(
      members.map((m) =>
        m.id === id
          ? { ...m, status: m.status === "Active" ? "Pending" : "Active" }
          : m,
      ),
    );
  };

  return (
    <div className="min-h-screen bg-slate-100 flex text-slate-800 font-sans">
      {/* Reusable Sidebar */}
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content Area */}
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
            Exco
          </span>
        </header>

        {/* Content Body */}
        <main className="p-4 sm:p-8 space-y-6 max-w-6xl mx-auto w-full">
          {/* Header Title & Export Action */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                <Users className="text-emerald-600" size={24} />
                <span>Student Directory</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                View registered members, check matric numbers, and verify
                student status.
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
                Total Registered
              </p>
              <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                {members.length}
              </h3>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <p className="text-xs text-slate-500 font-medium">
                Active Members
              </p>
              <h3 className="text-xl font-extrabold text-emerald-600 mt-1">
                {members.filter((m) => m.status === "Active").length}
              </h3>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <p className="text-xs text-slate-500 font-medium">
                Pending Review
              </p>
              <h3 className="text-xl font-extrabold text-amber-600 mt-1">
                {members.filter((m) => m.status === "Pending").length}
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
              {/* Search Bar */}
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

              {/* Department Dropdown */}
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

                {/* Level Dropdown */}
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
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredMembers.length === 0 ? (
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
                              {member.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-extrabold text-slate-900">
                                {member.name}
                              </p>
                              <p className="text-[10px] text-slate-400">
                                Joined {member.joinedDate}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4 font-mono font-semibold text-slate-700">
                          {member.matricNo}
                        </td>

                        <td className="px-5 py-4">
                          <p className="font-medium text-slate-800">
                            {member.department}
                          </p>
                          <span className="inline-block mt-0.5 px-2 py-0.2 bg-slate-100 text-slate-600 font-bold text-[10px] rounded-md">
                            {member.level}
                          </span>
                        </td>

                        <td className="px-5 py-4 space-y-0.5">
                          <div className="flex items-center gap-1.5 text-slate-600">
                            <Mail size={12} className="text-slate-400" />
                            <span>{member.email}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                            <Phone size={12} className="text-slate-400" />
                            <span>{member.phone}</span>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                              member.status === "Active"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                : "bg-amber-50 text-amber-700 border-amber-100"
                            }`}
                          >
                            {member.status === "Active" ? (
                              <CheckCircle2 size={12} />
                            ) : (
                              <XCircle size={12} />
                            )}
                            {member.status}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-right">
                          <button
                            onClick={() => toggleMemberStatus(member.id)}
                            className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 transition-all cursor-pointer"
                          >
                            {member.status === "Active"
                              ? "Set Pending"
                              : "Approve"}
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
    </div>
  );
}
