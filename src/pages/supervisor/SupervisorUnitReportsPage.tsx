import { useState, useMemo } from "react"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import {
  SEED_EMPLOYEES,
  SEED_DEPARTMENTS,
  SEED_ATTENDANCE,
} from "@/data/seed"
import type { Employee, Department, AttendanceRecord } from "@/types"
import * as XLSX from "xlsx"
import {
  Download,
  Filter,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  UserX,
} from "lucide-react"

export const SupervisorUnitReportsPage = () => {
  const [userSession] = useLocalStorage<any>("user", {})
  const [employees] = useLocalStorage<Employee[]>("employees", SEED_EMPLOYEES)
  const [departments] = useLocalStorage<Department[]>("departments", SEED_DEPARTMENTS)
  const [attendance] = useLocalStorage<AttendanceRecord[]>("attendance", SEED_ATTENDANCE)

  const currentSupervisor =
    employees.find((e) => e.id === userSession?.id || e.nip === userSession?.nip) || userSession
  const supervisorDeptId = currentSupervisor?.departmentId ?? "dept-1"
  const currentDept = departments.find((d) => d.id === supervisorDeptId)

  const [selectedMonth, setSelectedMonth] = useState<string>(
    new Date().toISOString().slice(0, 7)
  )
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  // Staff in supervisor's unit (both staff and supervisor)
  const unitStaffIds = useMemo(() => {
    return new Set(
      employees
        .filter(
          (u) =>
            u.departmentId === supervisorDeptId &&
            (u.role === "employee" || u.role === "supervisor")
        )
        .map((u) => u.id)
    )
  }, [employees, supervisorDeptId])

  // Filter attendance records by supervisor's unit and selected month
  const unitRecords = useMemo(() => {
    return attendance.filter((rec) => {
      const isUnit = unitStaffIds.has(rec.employeeId)
      const isMonth = rec.date.startsWith(selectedMonth)
      return isUnit && isMonth
    })
  }, [attendance, unitStaffIds, selectedMonth])

  // Filter by search & status
  const filteredRecords = useMemo(() => {
    return unitRecords.filter((rec) => {
      const emp = employees.find((e) => e.id === rec.employeeId)
      const empName = emp?.name || ""
      const matchesSearch =
        empName.toLowerCase().includes(searchTerm.toLowerCase()) || rec.date.includes(searchTerm)
      if (!matchesSearch) return false
      if (statusFilter !== "all" && rec.status !== statusFilter) return false
      return true
    })
  }, [unitRecords, employees, searchTerm, statusFilter])

  // Stats calculation
  const stats = useMemo(() => {
    const total = unitRecords.length
    const hadir = unitRecords.filter((r) => r.status === "on-time").length
    const terlambat = unitRecords.filter((r) => r.status === "late").length
    const pulangAwal = unitRecords.filter((r) => r.status === "early-leave").length
    const alpa = unitRecords.filter((r) => r.status === "absent").length

    return { total, hadir, terlambat, pulangAwal, alpa }
  }, [unitRecords])

  // Export to Excel (.xlsx)
  const handleExportExcel = () => {
    const exportData = filteredRecords.map((r, idx) => {
      const emp = employees.find((e) => e.id === r.employeeId)
      let statusLabel = "Tepat Waktu"
      if (r.status === "late") statusLabel = "Terlambat"
      if (r.status === "early-leave") statusLabel = "Pulang Cepat"
      if (r.status === "absent") statusLabel = "Tidak Hadir (Alpa)"

      return {
        No: idx + 1,
        "Nama Pegawai": emp?.name || "Pegawai",
        NIP: emp?.nip || "-",
        Departemen: currentDept?.name || "Unit Ruangan",
        Tanggal: r.date,
        "Jam Masuk": r.clockInTime || "-",
        "Jam Pulang": r.clockOutTime || "-",
        "Status Presensi": statusLabel,
        Lokasi: r.location === "inside" ? "Dalam Radius RS" : "Luar Radius",
      }
    })

    const worksheet = XLSX.utils.json_to_sheet(exportData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, `Rekap Unit ${selectedMonth}`)

    const fileName = `Rekap_Presensi_${(currentDept?.name || "Unit").replace(/\s+/g, "_")}_${selectedMonth}.xlsx`
    XLSX.writeFile(workbook, fileName)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              {currentDept?.name || "Unit Ruangan"}
            </span>
            <span className="text-xs text-gray-500 font-medium">Laporan Rekapitulasi</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
            Laporan Kehadiran Unit
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Pantau dan unduh rekapitulasi kehadiran staf ruangan per periode bulanan
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="text-xs font-semibold bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          />

          <button
            onClick={handleExportExcel}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition-colors shadow-xs cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Ekspor Excel (.xlsx)</span>
          </button>
        </div>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Tepat Waktu</p>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
              {stats.hadir}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Terlambat</p>
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">
              {stats.terlambat}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Pulang Awal</p>
            <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">
              {stats.pulangAwal}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Tanpa Keterangan</p>
            <p className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-1">
              {stats.alpa}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/40 flex items-center justify-center text-rose-600 dark:text-rose-400">
            <UserX className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama staf atau tanggal..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-gray-400" />
          <span className="text-xs text-gray-500 font-medium">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium cursor-pointer"
          >
            <option value="all">Semua Presensi</option>
            <option value="on-time">Tepat Waktu</option>
            <option value="late">Terlambat</option>
            <option value="early-leave">Pulang Awal</option>
            <option value="absent">Alpa</option>
          </select>
        </div>
      </div>

      {/* Recap Table */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-gray-50/75 dark:bg-gray-800/60 text-gray-600 dark:text-gray-300 border-b border-gray-100 dark:border-gray-800">
              <tr>
                <th className="p-3.5 font-semibold">Nama Staf</th>
                <th className="p-3.5 font-semibold">Tanggal</th>
                <th className="p-3.5 font-semibold">Jam Masuk</th>
                <th className="p-3.5 font-semibold">Jam Pulang</th>
                <th className="p-3.5 font-semibold">Lokasi Geofence</th>
                <th className="p-3.5 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-400">
                    Tidak ada data presensi pada periode bulan yang dipilih.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((record) => {
                  const emp = employees.find((e) => e.id === record.employeeId)

                  return (
                    <tr
                      key={record.id}
                      className="hover:bg-gray-50/60 dark:hover:bg-gray-800/40 transition-colors"
                    >
                      <td className="p-3.5 font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center font-bold text-indigo-700 dark:text-indigo-300 text-xs">
                          {emp?.name?.charAt(0) || "P"}
                        </div>
                        <span>{emp?.name || "Pegawai"}</span>
                      </td>
                      <td className="p-3.5 text-gray-600 dark:text-gray-300">{record.date}</td>
                      <td className="p-3.5 font-semibold text-gray-800 dark:text-gray-200">
                        {record.clockInTime || "-"}
                      </td>
                      <td className="p-3.5 font-semibold text-gray-800 dark:text-gray-200">
                        {record.clockOutTime || "-"}
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                            record.location === "inside"
                              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                              : "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300"
                          }`}
                        >
                          {record.location === "inside" ? "Dalam Radius RS" : "Luar Radius"}
                        </span>
                      </td>
                      <td className="p-3.5">
                        {record.status === "on-time" && (
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                            Tepat Waktu
                          </span>
                        )}
                        {record.status === "late" && (
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                            Terlambat
                          </span>
                        )}
                        {record.status === "early-leave" && (
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                            Pulang Awal
                          </span>
                        )}
                        {record.status === "absent" && (
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                            Alpa
                          </span>
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
    </div>
  )
}
