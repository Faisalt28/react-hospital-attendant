import { useState, useMemo } from "react"
import { Download, FileSpreadsheet, TrendingUp, Users, Clock, CalendarCheck, ChevronDown } from "lucide-react"
import * as XLSX from "xlsx"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import { SEED_ATTENDANCE, SEED_LEAVES, SEED_EMPLOYEES, SEED_DEPARTMENTS } from "@/data/seed"

// ─── Export helpers ───────────────────────────────────────────────────────────

const downloadXLSX = (data: Record<string, unknown>[], filename: string, sheetName = "Data") => {
  const ws = XLSX.utils.json_to_sheet(data)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, sheetName)
  XLSX.writeFile(wb, `${filename}.xlsx`)
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

const StatCard = ({ icon, label, value, sub, color }: {
  icon: React.ReactNode; label: string; value: string | number; sub?: string
  color: string
}) => (
  <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-5">
    <div className="flex items-start justify-between mb-4">
      <div className={`p-2.5 rounded-xl ${color}`}>{icon}</div>
    </div>
    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{label}</p>
    {sub && <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{sub}</p>}
  </div>
)

// ─── Export Card ──────────────────────────────────────────────────────────────

const ExportCard = ({ title, desc, icon, color, onClick, isLoading }: {
  title: string; desc: string; icon: React.ReactNode; color: string
  onClick: () => void; isLoading?: boolean
}) => (
  <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-5 hover:shadow-md transition-all duration-200">
    <div className={`inline-flex p-3 rounded-xl ${color} mb-4`}>{icon}</div>
    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{title}</h3>
    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{desc}</p>
    <button onClick={onClick} disabled={isLoading}
      className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 disabled:from-blue-300 disabled:to-blue-300 rounded-xl transition-all shadow-md shadow-blue-200/50 dark:shadow-none">
      {isLoading
        ? <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
        : <Download className="h-4 w-4" />}
      {isLoading ? "Menyiapkan..." : "Download .xlsx"}
    </button>
  </div>
)

// ─── Main Page ────────────────────────────────────────────────────────────────

const ReportsPage = () => {
  const [attendance]  = useLocalStorage("attendance",  SEED_ATTENDANCE)
  const [leaves]      = useLocalStorage("leaves",      SEED_LEAVES)
  const [employees]   = useLocalStorage("employees",   SEED_EMPLOYEES)
  const [departments] = useLocalStorage("departments", SEED_DEPARTMENTS)

  const [filterMonth, setFilterMonth] = useState(() => {
    const d = new Date()
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
  })
  const [loading, setLoading] = useState<string | null>(null)

  const getEmp  = (id: string) => employees.find(e => e.id === id)
  const getDept = (id: string) => departments.find(d => d.id === id)

  // Filter by month
  const monthAtt = useMemo(() =>
    attendance.filter(a => a.date.startsWith(filterMonth))
  , [attendance, filterMonth])

  const monthLeaves = useMemo(() =>
    leaves.filter(l => l.startDate.startsWith(filterMonth) || l.endDate.startsWith(filterMonth))
  , [leaves, filterMonth])

  // Stats
  const totalHadir = monthAtt.filter(a => a.status !== "absent").length
  const totalAbsen = monthAtt.filter(a => a.status === "absent").length
  const totalLate  = monthAtt.filter(a => a.status === "late").length
  const rateHadir  = monthAtt.length > 0 ? Math.round((totalHadir / monthAtt.length) * 100) : 0
  const avgJam     = monthAtt.filter(a => a.totalHours).reduce((s, a) => s + (a.totalHours ?? 0), 0) /
                     (monthAtt.filter(a => a.totalHours).length || 1)

  // Per-dept summary
  const deptSummary = useMemo(() => departments.map(dept => {
    const deptEmps = employees.filter(e => e.departmentId === dept.id)
    const deptAtt  = monthAtt.filter(a => deptEmps.some(e => e.id === a.employeeId))
    const hadir    = deptAtt.filter(a => a.status !== "absent").length
    const rate     = deptAtt.length > 0 ? Math.round((hadir / deptAtt.length) * 100) : 0
    return { dept, total: deptAtt.length, hadir, late: deptAtt.filter(a => a.status === "late").length, rate }
  }), [departments, employees, monthAtt])

  const doExport = (type: "attendance" | "leaves" | "summary") => {
    setLoading(type)
    setTimeout(() => {
      if (type === "attendance") {
        const data = monthAtt.map(a => {
          const emp = getEmp(a.employeeId)
          const dept = getDept(emp?.departmentId ?? "")
          return {
            "Tanggal":        a.date,
            "NIP":            emp?.nip ?? "—",
            "Nama Pegawai":   emp?.name ?? "—",
            "Departemen":     dept?.name ?? "—",
            "Jam Masuk":      a.clockInTime ?? "—",
            "Jam Keluar":     a.clockOutTime ?? "—",
            "Total Jam":      a.totalHours ? `${a.totalHours.toFixed(1)} jam` : "—",
            "Status":         a.status === "on-time" ? "Tepat Waktu" : a.status === "late" ? "Terlambat" : a.status === "absent" ? "Tidak Hadir" : "Pulang Awal",
            "Lokasi":         a.location === "inside" ? "Dalam RS" : "Luar RS",
          }
        })
        downloadXLSX(data, `Rekap_Kehadiran_${filterMonth}`, "Kehadiran")
      } else if (type === "leaves") {
        const data = monthLeaves.map(l => {
          const emp  = getEmp(l.employeeId)
          const dept = getDept(l.departmentId)
          return {
            "Tanggal Pengajuan": l.createdAt.split("T")[0],
            "NIP":               emp?.nip ?? "—",
            "Nama Pegawai":      emp?.name ?? "—",
            "Departemen":        dept?.name ?? "—",
            "Jenis":             l.type === "cuti" ? "Cuti Tahunan" : l.type === "sakit" ? "Sakit" : "Izin",
            "Mulai":             l.startDate,
            "Selesai":           l.endDate,
            "Jumlah Hari":       l.totalDays,
            "Alasan":            l.reason,
            "Status":            l.status === "approved" ? "Disetujui" : l.status === "rejected" ? "Ditolak" : "Menunggu",
            "Catatan Reviewer":  l.reviewNote ?? "—",
          }
        })
        downloadXLSX(data, `Rekap_Cuti_${filterMonth}`, "Cuti & Izin")
      } else if (type === "summary") {
        const data = employees.filter(e => e.role === "employee" || e.role === "supervisor").map(emp => {
          const empAtt  = monthAtt.filter(a => a.employeeId === emp.id)
          const empLeave = monthLeaves.filter(l => l.employeeId === emp.id && l.status === "approved")
          const dept = getDept(emp.departmentId)
          return {
            "NIP":              emp.nip,
            "Nama Pegawai":     emp.name,
            "Departemen":       dept?.name ?? "—",
            "Total Hadir":      empAtt.filter(a => a.status !== "absent").length,
            "Tidak Hadir":      empAtt.filter(a => a.status === "absent").length,
            "Terlambat":        empAtt.filter(a => a.status === "late").length,
            "Total Jam Kerja":  empAtt.reduce((s, a) => s + (a.totalHours ?? 0), 0).toFixed(1),
            "Hari Cuti Diambil":empLeave.reduce((s, l) => s + l.totalDays, 0),
            "Sisa Cuti":        emp.annualLeaveQuota - emp.usedLeave,
          }
        })
        downloadXLSX(data, `Rekap_Pegawai_${filterMonth}`, "Summary Pegawai")
      }
      setLoading(null)
    }, 600)
  }

  return (
    <div className="p-6 space-y-6 max-w-screen-xl mx-auto">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Laporan & Export</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Rekap dan unduh laporan dalam format Excel</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">Periode:</span>
          <div className="relative">
            <input type="month" value={filterMonth} onChange={e => setFilterMonth(e.target.value)}
              className="pl-3 pr-8 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-300 cursor-pointer" />
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Overview stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard icon={<CalendarCheck className="h-5 w-5 text-green-600" />} label="Tingkat Kehadiran" value={`${rateHadir}%`}
          sub={`${totalHadir} hadir, ${totalLate} telat, ${totalAbsen} absen`} color="bg-green-50 dark:bg-green-900/20" />
        <StatCard icon={<Users className="h-5 w-5 text-blue-600" />} label="Total Pegawai Aktif" value={employees.filter(e => e.isActive).length}
          sub={`${departments.length} departemen`} color="bg-blue-50 dark:bg-blue-900/20" />
        <StatCard icon={<Clock className="h-5 w-5 text-amber-600" />} label="Rata-rata Jam Kerja" value={`${avgJam.toFixed(1)} jam`}
          sub={`Bulan ${filterMonth}`} color="bg-amber-50 dark:bg-amber-900/20" />
        <StatCard icon={<TrendingUp className="h-5 w-5 text-purple-600" />} label="Pengajuan Cuti" value={monthLeaves.length}
          sub={`${monthLeaves.filter(l => l.status === "pending").length} menunggu persetujuan`} color="bg-purple-50 dark:bg-purple-900/20" />
      </div>

      {/* Per-dept summary table */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <h2 className="font-semibold text-gray-900 dark:text-gray-100">Ringkasan per Departemen</h2>
          <p className="text-xs text-gray-400 mt-0.5">Periode: {filterMonth}</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/60 border-b border-gray-100 dark:border-gray-800">
                {["Departemen","Total Presensi","Hadir","Terlambat","Tidak Hadir","Tingkat Hadir"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {deptSummary.map(({ dept, total, hadir, late, rate }) => (
                <tr key={dept.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">{dept.name}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{total}</td>
                  <td className="px-4 py-3 text-green-600 dark:text-green-400 font-medium">{hadir}</td>
                  <td className="px-4 py-3 text-amber-600 dark:text-amber-400">{late}</td>
                  <td className="px-4 py-3 text-red-500 dark:text-red-400">{total - hadir}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden max-w-[80px]">
                        <div className={`h-full rounded-full ${rate >= 90 ? "bg-green-500" : rate >= 70 ? "bg-amber-400" : "bg-red-400"}`}
                          style={{ width: `${rate}%` }} />
                      </div>
                      <span className={`text-xs font-semibold ${rate >= 90 ? "text-green-600 dark:text-green-400" : rate >= 70 ? "text-amber-600 dark:text-amber-400" : "text-red-500"}`}>
                        {rate}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Export cards */}
      <div>
        <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5 text-green-600" />
          Unduh Laporan Excel
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <ExportCard
            title="Rekap Kehadiran"
            desc={`Data presensi harian semua pegawai bulan ${filterMonth}. Termasuk jam masuk, jam keluar, durasi, dan status.`}
            icon={<CalendarCheck className="h-6 w-6 text-green-600" />}
            color="bg-green-50 dark:bg-green-900/20"
            onClick={() => doExport("attendance")}
            isLoading={loading === "attendance"}
          />
          <ExportCard
            title="Rekap Cuti & Izin"
            desc={`Semua pengajuan cuti, izin, dan sakit beserta status persetujuan bulan ${filterMonth}.`}
            icon={<FileSpreadsheet className="h-6 w-6 text-purple-600" />}
            color="bg-purple-50 dark:bg-purple-900/20"
            onClick={() => doExport("leaves")}
            isLoading={loading === "leaves"}
          />
          <ExportCard
            title="Summary Pegawai"
            desc={`Ringkasan per-pegawai: total hadir, terlambat, jam kerja, dan sisa cuti. Cocok untuk payroll.`}
            icon={<TrendingUp className="h-6 w-6 text-blue-600" />}
            color="bg-blue-50 dark:bg-blue-900/20"
            onClick={() => doExport("summary")}
            isLoading={loading === "summary"}
          />
        </div>
      </div>
    </div>
  )
}

export { ReportsPage }
