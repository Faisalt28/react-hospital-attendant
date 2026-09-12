import { useMemo } from "react"
import { useNavigate } from "react-router-dom"
import {
  Users, CheckCircle2, Clock, FileText, TrendingUp, TrendingDown,
  AlertCircle, ChevronRight, UserCheck, Building2, Check, X,
} from "lucide-react"
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell,
} from "recharts"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import {
  SEED_EMPLOYEES, SEED_DEPARTMENTS, SEED_ATTENDANCE, SEED_LEAVES,
} from "@/data/seed"
import { POSISI_OPTIONS } from "@/data/options"
import type { ApprovalStatus, LeaveRequest } from "@/types"

// ─── Status Badge ─────────────────────────────────────────────────────────────

const StatusBadge = ({ status }: { status: ApprovalStatus }) => {
  const map: Record<ApprovalStatus, string> = {
    pending:  "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    approved: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    rejected: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  }
  const label: Record<ApprovalStatus, string> = {
    pending: "Menunggu", approved: "Disetujui", rejected: "Ditolak",
  }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${map[status] ?? ""}`}>
      {label[status] ?? status}
    </span>
  )
}

// Custom Tooltip for LineChart
const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string }>; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3 shadow-lg text-xs">
        <p className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{label}</p>
        {payload.map((p) => (
          <p key={p.name} className="text-gray-600 dark:text-gray-400">
            {p.name === "hadir" ? "Hadir" : "Target"}: <span className="font-medium text-gray-900 dark:text-gray-100">{p.value}</span>
          </p>
        ))}
      </div>
    )
  }
  return null
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

const AdminDashboard = () => {
  const navigate = useNavigate()

  const [userSession]  = useLocalStorage<any>("user", { name: "Admin HRD", email: "admin@rsmeditrack.com", role: "admin" })
  const [employees, setEmployees]    = useLocalStorage("employees", SEED_EMPLOYEES)
  const [departments]                = useLocalStorage("departments", SEED_DEPARTMENTS)
  const [attendance]                 = useLocalStorage("attendance", SEED_ATTENDANCE)
  const [leaves, setLeaves]          = useLocalStorage<LeaveRequest[]>("leaves", SEED_LEAVES)

  // SINKRONISASI NAMA USER DARI DAFTAR PEGAWAI TERBARU
  const currentEmp = employees.find((e) => e.id === userSession?.id || e.nip === userSession?.nip) || userSession

  const today = new Date().toLocaleDateString("id-ID", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  })

  const todayDateStr = useMemo(() => new Date().toISOString().split("T")[0], [])

  // ─── Dynamic Calculations ─────────────────────────────────────────────────
  const activeEmployees = useMemo(() => employees.filter((e) => e.isActive), [employees])

  // Presensi hari ini
  const todayAttendance = useMemo(() => attendance.filter((a) => a.date === todayDateStr), [attendance, todayDateStr])
  const hadirList = useMemo(() => todayAttendance.filter((a) => a.status !== "absent"), [todayAttendance])
  const lateList  = useMemo(() => todayAttendance.filter((a) => a.status === "late"), [todayAttendance])
  const pendingLeaves = useMemo(() => leaves.filter((l) => l.status === "pending"), [leaves])

  const totalHadir = hadirList.length
  const totalLate  = lateList.length
  const totalLeavesPending = pendingLeaves.length

  const attendanceRate = activeEmployees.length > 0 ? Math.round((totalHadir / activeEmployees.length) * 100) : 0

  // Trend data dinamis 7 hari terakhir berdasarkan data presensi aktual
  const attendanceTrend = useMemo(() => {
    const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"]
    const trend = []
    const now = new Date()

    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(now.getDate() - i)
      const dateKey = d.toISOString().split("T")[0]
      const label = dayNames[d.getDay()]
      const countHadir = attendance.filter((a) => a.date === dateKey && a.status !== "absent").length

      trend.push({
        hari: label,
        date: dateKey,
        hadir: countHadir,
        target: activeEmployees.length,
      })
    }
    return trend
  }, [attendance, activeEmployees.length])

  // Dept presence chart data dinamis dan sinkron 100% dengan pegawai & departemen aktual
  const deptChartData = useMemo(() => {
    const colors = ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444", "#06b6d4", "#ec4899", "#14b8a6"]
    return departments.map((dept, i) => {
      const deptEmps = activeEmployees.filter((e) => e.departmentId === dept.id)
      const deptAtt = todayAttendance.filter((a) => deptEmps.some((e) => e.id === a.employeeId))
      const hadirCount = deptAtt.filter((a) => a.status !== "absent").length
      return {
        name: dept.name,
        hadir: hadirCount,
        total: deptEmps.length,
        fill: colors[i % colors.length],
      }
    })
  }, [departments, activeEmployees, todayAttendance])

  // Dynamic late employees list hari ini
  const lateEmployeesDisplay = useMemo(() => {
    return lateList.slice(0, 4).map((att) => {
      const emp = employees.find((e) => e.id === att.employeeId)
      const dept = departments.find((d) => d.id === emp?.departmentId)
      return {
        id: att.id,
        nama: emp?.name ?? "Pegawai",
        dept: dept?.name ?? "Umum",
        shift: "Dinas",
        jamMasuk: att.clockInTime ?? "—",
      }
    })
  }, [lateList, employees, departments])

  // Dynamic KPI Stats Cards
  const stats = [
    {
      title: "Total Pegawai",
      value: String(activeEmployees.length),
      subtitle: `${departments.length} departemen terdaftar`,
      icon: Users,
      trend: `${activeEmployees.length} staf aktif`,
      up: true,
      iconBg: "bg-blue-50 dark:bg-blue-900/20",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
    {
      title: "Hadir Hari Ini",
      value: String(totalHadir),
      subtitle: `${activeEmployees.length} target pegawai`,
      icon: CheckCircle2,
      trend: `${attendanceRate}% tingkat kehadiran`,
      up: attendanceRate >= 80,
      iconBg: "bg-green-50 dark:bg-green-900/20",
      iconColor: "text-green-600 dark:text-green-400",
    },
    {
      title: "Terlambat",
      value: String(totalLate),
      subtitle: "Presensi hari ini",
      icon: Clock,
      trend: totalLate === 0 ? "Nihil keterlambatan" : `${totalLate} staf terlambat`,
      up: totalLate === 0,
      iconBg: "bg-orange-50 dark:bg-orange-900/20",
      iconColor: "text-orange-600 dark:text-orange-400",
    },
    {
      title: "Pengajuan Cuti & Izin",
      value: String(totalLeavesPending),
      subtitle: `${leaves.length} total riwayat pengajuan`,
      icon: FileText,
      trend: totalLeavesPending === 0 ? "Semua tertinjau" : `${totalLeavesPending} perlu verifikasi`,
      up: totalLeavesPending === 0,
      iconBg: "bg-purple-50 dark:bg-purple-900/20",
      iconColor: "text-purple-600 dark:text-purple-400",
    },
  ]

  // Handle Quick Approve/Reject from dashboard
  const handleReviewLeave = (id: string, newStatus: "approved" | "rejected") => {
    const targetLeave = leaves.find((l) => l.id === id)
    if (!targetLeave) return

    setLeaves((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: newStatus, reviewedAt: new Date().toISOString() } : l))
    )

    // Update usedLeave if approved
    if (newStatus === "approved" && targetLeave.type === "cuti") {
      setEmployees((prev) =>
        prev.map((emp) =>
          emp.id === targetLeave.employeeId
            ? { ...emp, usedLeave: emp.usedLeave + targetLeave.totalDays }
            : emp
        )
      )
    }
  }

  const getPosisiLabel = (v: string) => POSISI_OPTIONS.find((o) => o.value === v)?.label ?? v

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6 max-w-screen-2xl mx-auto">
      {/* ── Page Header ── */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 truncate">
            Selamat datang, {currentEmp?.name || "Admin"} 👋
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">{today}</p>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 shrink-0">
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[11px] sm:text-xs font-medium text-green-700 dark:text-green-400">Sistem Aktif</span>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-xs hover:shadow-md transition-shadow duration-200 cursor-default"
          >
            <div className="flex items-center justify-between mb-2 sm:mb-4">
              <div className={`p-2 sm:p-2.5 rounded-xl ${stat.iconBg}`}>
                <stat.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${stat.iconColor}`} />
              </div>
              {stat.up ? (
                <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-400" />
              )}
            </div>
            <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 mb-0.5 sm:mb-1 truncate">{stat.title}</p>
            <p className="text-xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</p>
            <p className={`text-[10px] sm:text-xs mt-1 sm:mt-1.5 font-medium truncate ${stat.up ? "text-green-600 dark:text-green-400" : "text-orange-500 dark:text-orange-400"}`}>
              {stat.trend}
            </p>
            <p className="text-[10px] sm:text-xs text-gray-400 dark:text-gray-500 mt-0.5 truncate hidden sm:block">{stat.subtitle}</p>
          </div>
        ))}
      </div>

      {/* ── Charts Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Line Chart: Attendance Trend */}
        <div className="lg:col-span-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 sm:p-5 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">Tren Kehadiran</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">7 hari terakhir</p>
            </div>
            <span className="text-xs px-2.5 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full font-medium">
              Minggu ini
            </span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={attendanceTrend} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" className="dark:[&>line]:stroke-gray-800" />
              <XAxis dataKey="hari" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="target"
                stroke="#e5e7eb"
                strokeWidth={2}
                dot={false}
                strokeDasharray="4 4"
                name="target"
              />
              <Line
                type="monotone"
                dataKey="hadir"
                stroke="#3b82f6"
                strokeWidth={2.5}
                dot={{ fill: "#3b82f6", r: 4, strokeWidth: 0 }}
                activeDot={{ r: 6, fill: "#2563eb" }}
                name="hadir"
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-4 mt-2 justify-end">
            <span className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className="inline-block w-4 h-0.5 bg-blue-500 rounded" />
              Hadir ({totalHadir})
            </span>
            <span className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className="inline-block w-4 h-0.5 bg-gray-300 rounded border-dashed" />
              Target ({activeEmployees.length})
            </span>
          </div>
        </div>

        {/* Bar Chart: Per Departemen */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 sm:p-5 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">Kehadiran per Dept.</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">Unit pelayanan RS ({departments.length} unit)</p>
            </div>
          </div>

          {departments.length === 0 ? (
            <div className="h-48 flex flex-col items-center justify-center text-center p-4">
              <Building2 className="h-8 w-8 text-gray-300 dark:text-gray-600 mb-2" />
              <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">Belum Ada Departemen</p>
              <p className="text-[11px] text-gray-400 mt-1">Tambahkan unit di menu Departemen</p>
              <button
                onClick={() => navigate("/admin/departments")}
                className="mt-3 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-semibold rounded-lg hover:bg-blue-100 transition-colors cursor-pointer"
              >
                + Tambah Departemen
              </button>
            </div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={deptChartData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }} barSize={14}>
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      background: "var(--tooltip-bg, white)",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      fontSize: "11px",
                    }}
                    formatter={(value, name) => [value, name === "hadir" ? "Hadir" : "Total Staf"]}
                  />
                  <Bar dataKey="total" fill="#f3f4f6" radius={[4, 4, 0, 0]} name="total" />
                  <Bar dataKey="hadir" radius={[4, 4, 0, 0]} name="hadir">
                    {deptChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              {/* Legend */}
              <div className="mt-3 space-y-1.5 max-h-24 overflow-y-auto">
                {deptChartData.map((d) => (
                  <div key={d.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <div className="h-2 w-2 rounded-full" style={{ backgroundColor: d.fill }} />
                      <span className="text-gray-600 dark:text-gray-400">{d.name}</span>
                    </div>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {d.hadir}/{d.total}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Bottom Tables ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Leave Requests Table */}
        <div className="lg:col-span-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
            <div>
              <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">Pengajuan Cuti & Izin</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {totalLeavesPending} menunggu persetujuan
              </p>
            </div>
            <button
              onClick={() => navigate("/admin/leaves")}
              className="text-xs text-blue-600 dark:text-blue-400 font-medium hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              Lihat semua <ChevronRight className="h-3 w-3" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px]">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/50">
                  {["Pegawai", "Tipe", "Tanggal", "Status", "Aksi"].map((h) => (
                    <th
                      key={h}
                      className={`px-4 py-2.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide ${
                        h === "Tanggal" ? "hidden sm:table-cell" : ""
                      }`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                {leaves.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-xs text-gray-400">
                      Belum ada permohonan cuti atau izin staf yang masuk.
                    </td>
                  </tr>
                ) : (
                  leaves.slice(0, 5).map((req) => {
                    const emp = employees.find((e) => e.id === req.employeeId)
                    const dept = departments.find((d) => d.id === req.departmentId)
                    const typeLabel = req.type === "cuti" ? "Cuti Tahunan" : req.type === "sakit" ? "Izin Sakit" : "Izin Keperluan"

                    return (
                      <tr key={req.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                        <td className="px-4 py-3">
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{emp?.name ?? "Pegawai"}</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">
                            {getPosisiLabel(emp?.posisi ?? "")} · {dept?.name ?? "—"}
                          </p>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{typeLabel}</td>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap hidden sm:table-cell">
                          {req.startDate} {req.startDate !== req.endDate ? `s/d ${req.endDate}` : ""}
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={req.status} />
                        </td>
                        <td className="px-4 py-3">
                          {req.status === "pending" ? (
                            <div className="flex gap-1.5">
                              <button
                                onClick={() => handleReviewLeave(req.id, "approved")}
                                title="Setujui"
                                className="px-2.5 py-1 text-xs font-medium bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                              >
                                <Check className="h-3 w-3" /> Setuju
                              </button>
                              <button
                                onClick={() => handleReviewLeave(req.id, "rejected")}
                                title="Tolak"
                                className="px-2.5 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                              >
                                <X className="h-3 w-3" /> Tolak
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400">Selesai</span>
                          )}
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Late Employees + Quick Summary */}
        <div className="space-y-4">
          {/* Late Today */}
          <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">Terlambat Hari Ini</h2>
              <span className="flex items-center gap-1 text-xs text-orange-600 dark:text-orange-400 font-medium">
                <AlertCircle className="h-3.5 w-3.5" />
                {lateEmployeesDisplay.length} orang
              </span>
            </div>
            <div className="space-y-3">
              {lateEmployeesDisplay.length === 0 ? (
                <p className="text-xs text-gray-400 py-3 text-center">Tidak ada pegawai terlambat hari ini 🎉</p>
              ) : (
                lateEmployeesDisplay.map((emp) => (
                  <div
                    key={emp.id}
                    className="flex items-center gap-3 p-2.5 rounded-lg bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/30"
                  >
                    <div className="h-8 w-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center shrink-0">
                      <Clock className="h-4 w-4 text-orange-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{emp.nama}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {emp.dept}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-semibold text-orange-600 dark:text-orange-400">{emp.jamMasuk}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Summary */}
          <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">Ringkasan Sistem</h2>
            <div className="space-y-3">
              {[
                { label: "Tingkat Kehadiran", value: `${attendanceRate}%`, pct: attendanceRate, color: "bg-green-500" },
                {
                  label: "Tingkat Keterlambatan",
                  value: `${attendance.length > 0 ? Math.round((totalLate / attendance.length) * 100) : 0}%`,
                  pct: attendance.length > 0 ? Math.round((totalLate / attendance.length) * 100) : 0,
                  color: "bg-orange-400",
                },
                {
                  label: "Pengajuan Terproses",
                  value: `${leaves.filter((l) => l.status !== "pending").length} / ${leaves.length}`,
                  pct: leaves.length > 0 ? Math.round(((leaves.length - totalLeavesPending) / leaves.length) * 100) : 100,
                  color: "bg-purple-500",
                },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-600 dark:text-gray-400">{item.label}</span>
                    <span className="text-xs font-semibold text-gray-900 dark:text-gray-100">{item.value}</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full transition-all duration-700 ${item.color}`}
                      style={{ width: `${item.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 grid grid-cols-2 gap-3">
              {[
                { icon: UserCheck, label: "Pegawai Aktif", val: String(activeEmployees.length), color: "text-blue-600 dark:text-blue-400" },
                { icon: Building2, label: "Departemen",    val: String(departments.length),     color: "text-purple-600 dark:text-purple-400" },
              ].map(({ icon: Icon, label, val, color }) => (
                <div key={label} className="text-center p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <Icon className={`h-5 w-5 ${color} mx-auto mb-1`} />
                  <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{val}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export { AdminDashboard }
