import { useState, useMemo } from "react"
import {
  History, MapPin, Camera
} from "lucide-react"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import {
  SEED_EMPLOYEES, SEED_ATTENDANCE
} from "@/data/seed"
import type { AttendanceStatus, AttendanceRecord } from "@/types"

const STATUS_CONFIG: Record<AttendanceStatus, { label: string; cls: string }> = {
  "on-time":     { label: "Tepat Waktu", cls: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  "late":        { label: "Terlambat",   cls: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  "early-leave": { label: "Pulang Awal", cls: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" },
  "absent":      { label: "Tidak Hadir", cls: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
}

export const EmployeeHistoryPage = () => {
  const [userSession] = useLocalStorage<any>("user", {})
  const [employees]   = useLocalStorage("employees",   SEED_EMPLOYEES)
  const [attendance]  = useLocalStorage<AttendanceRecord[]>("attendance", SEED_ATTENDANCE)

  const currentEmp = employees.find((e) => e.id === userSession?.id || e.nip === userSession?.nip) || employees[2]

  const [selectedMonth, setSelectedMonth] = useState("2025-09")
  const [previewPhoto, setPreviewPhoto]   = useState<string | null>(null)

  // My attendance records for the selected month
  const myRecords = useMemo(() => {
    return attendance
      .filter((a) => a.employeeId === currentEmp?.id && a.date.startsWith(selectedMonth))
      .sort((a, b) => b.date.localeCompare(a.date))
  }, [attendance, currentEmp, selectedMonth])

  // Summary
  const hadirCount = myRecords.filter((a) => a.status !== "absent").length
  const lateCount  = myRecords.filter((a) => a.status === "late").length
  const totalHours = myRecords.reduce((acc, curr) => acc + (curr.totalHours || 0), 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Riwayat Presensi</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Log kehadiran, jam dinas, status lokasi, dan verifikasi selfie Anda
          </p>
        </div>

        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="px-3 py-1.5 text-xs rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 font-medium cursor-pointer"
        />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-4 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xs">
          <span className="text-xs text-gray-400">Total Hadir</span>
          <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{hadirCount} Hari</p>
        </div>
        <div className="p-4 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xs">
          <span className="text-xs text-gray-400">Terlambat</span>
          <p className="text-xl font-bold text-amber-600 dark:text-amber-400">{lateCount} Kali</p>
        </div>
        <div className="p-4 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xs">
          <span className="text-xs text-gray-400">Akumulasi Jam</span>
          <p className="text-xl font-bold text-gray-900 dark:text-gray-100">{totalHours.toFixed(1)} Jam</p>
        </div>
      </div>

      {/* Attendance List */}
      <div className="space-y-3">
        {myRecords.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 space-y-2">
            <History className="h-10 w-10 text-gray-300 mx-auto" />
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Tidak ada log presensi</p>
            <p className="text-xs text-gray-400">Belum ada data presensi yang tercatat untuk periode ini.</p>
          </div>
        ) : (
          myRecords.map((rec) => {
            const statusCfg = STATUS_CONFIG[rec.status]
            const dayName = new Date(rec.date).toLocaleDateString("id-ID", { weekday: "long" })
            const dateStr = new Date(rec.date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })

            return (
              <div
                key={rec.id}
                className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  {/* Date Badge */}
                  <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center shrink-0">
                    <span className="text-[10px] uppercase font-bold text-gray-400">{dayName.slice(0, 3)}</span>
                    <span className="text-sm font-black text-gray-900 dark:text-gray-100">{rec.date.split("-")[2]}</span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-gray-900 dark:text-gray-100">{dateStr}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${statusCfg.cls}`}>
                        {statusCfg.label}
                      </span>
                    </div>

                    <div className="text-xs text-gray-500 dark:text-gray-400 flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span>Masuk: <strong className="text-gray-900 dark:text-gray-200">{rec.clockInTime ?? "—"}</strong></span>
                      <span>Pulang: <strong className="text-gray-900 dark:text-gray-200">{rec.clockOutTime ?? "—"}</strong></span>
                      {rec.totalHours && <span>Total: <strong>{rec.totalHours} jam</strong></span>}
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-gray-400 pt-0.5">
                      <MapPin className="h-3 w-3" />
                      <span>{rec.location === "inside" ? "Dalam Radius RS" : "Di Luar Radius RS"}</span>
                    </div>
                  </div>
                </div>

                {/* Selfie Photo Preview (if exists) */}
                {rec.photoBase64 && (
                  <div className="self-end sm:self-center flex items-center gap-2">
                    <button
                      onClick={() => setPreviewPhoto(rec.photoBase64!)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 text-xs font-medium text-gray-700 dark:text-gray-300 transition-colors"
                    >
                      <Camera className="h-3.5 w-3.5 text-blue-500" />
                      Lihat Selfie
                    </button>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>

      {/* ── Photo Preview Modal ── */}
      {previewPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setPreviewPhoto(null)} />
          <div className="relative bg-white dark:bg-gray-900 rounded-3xl overflow-hidden max-w-sm w-full border border-gray-200 dark:border-gray-800 p-4 space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-bold text-gray-900 dark:text-gray-100">Foto Selfie Presensi</h4>
              <button onClick={() => setPreviewPhoto(null)} className="text-xs text-gray-400 hover:text-gray-600">
                Tutup
              </button>
            </div>
            <img src={previewPhoto} alt="Selfie" className="w-full aspect-square object-cover rounded-2xl" />
          </div>
        </div>
      )}
    </div>
  )
}
