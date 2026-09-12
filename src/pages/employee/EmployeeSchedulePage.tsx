import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import {
  CalendarDays, Clock, Users,
  ArrowLeftRight
} from "lucide-react"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import {
  SEED_EMPLOYEES, SEED_SCHEDULES, SEED_SHIFTS, SEED_DEPARTMENTS
} from "@/data/seed"

export const EmployeeSchedulePage = () => {
  const navigate = useNavigate()

  const [userSession] = useLocalStorage<any>("user", {})
  const [employees]   = useLocalStorage("employees",   SEED_EMPLOYEES)
  const [departments] = useLocalStorage("departments", SEED_DEPARTMENTS)
  const [schedules]   = useLocalStorage("schedules",   SEED_SCHEDULES)
  const [shifts]      = useLocalStorage("shifts",      SEED_SHIFTS)

  const currentEmp = employees.find((e) => e.id === userSession?.id || e.nip === userSession?.nip) || employees[2]
  const dept = departments.find((d) => d.id === currentEmp?.departmentId)

  const [selectedMonth, setSelectedMonth] = useState("2025-09")
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list")

  // Filter my schedules for selected month
  const myMonthlySchedules = useMemo(() => {
    return schedules
      .filter((s) => s.employeeId === currentEmp?.id && s.date.startsWith(selectedMonth))
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((s) => {
        const sh = shifts.find((item) => item.id === s.shiftId) || shifts[0]
        // Coworkers on duty in the same department and date
        const coworkers = schedules
          .filter((other) => other.departmentId === s.departmentId && other.date === s.date && other.employeeId !== currentEmp?.id)
          .map((c) => {
            const emp = employees.find((e) => e.id === c.employeeId)
            const cShift = shifts.find((item) => item.id === c.shiftId)
            return { name: emp?.name ?? "Rekan", shift: cShift?.name ?? "" }
          })
        return { ...s, shift: sh, coworkers }
      })
  }, [schedules, currentEmp, selectedMonth, shifts, employees])

  const totalHours = myMonthlySchedules.reduce((acc, curr) => acc + curr.shift.durationHours, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Jadwal Dinas Saya</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Unit: <strong>{dept?.name}</strong> · Total {myMonthlySchedules.length} hari dinas ({totalHours} jam kerja)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 font-medium cursor-pointer"
          />
          <div className="flex rounded-xl bg-gray-100 dark:bg-gray-800 p-1 border border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                viewMode === "list" ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow-xs" : "text-gray-500"
              }`}
            >
              Daftar
            </button>
            <button
              onClick={() => setViewMode("calendar")}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                viewMode === "calendar" ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow-xs" : "text-gray-500"
              }`}
            >
              Kalender
            </button>
          </div>
        </div>
      </div>

      {/* List View */}
      {viewMode === "list" ? (
        <div className="space-y-3">
          {myMonthlySchedules.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 space-y-2">
              <CalendarDays className="h-10 w-10 text-gray-300 mx-auto" />
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Tidak ada jadwal dinas</p>
              <p className="text-xs text-gray-400">Belum ada jadwal yang dipublikasikan untuk periode ini.</p>
            </div>
          ) : (
            myMonthlySchedules.map((item) => {
              const dayName = new Date(item.date).toLocaleDateString("id-ID", { weekday: "long" })
              const dateFormatted = new Date(item.date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })

              return (
                <div
                  key={item.id}
                  className="p-5 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xs hover:border-emerald-300 dark:hover:border-emerald-800 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    {/* Date Block */}
                    <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-100 dark:border-emerald-900 flex flex-col items-center justify-center text-center shrink-0">
                      <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400">
                        {dayName.slice(0, 3)}
                      </span>
                      <span className="text-lg font-black text-emerald-950 dark:text-emerald-100 leading-none">
                        {item.date.split("-")[2]}
                      </span>
                    </div>

                    {/* Shift & Time Details */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-base text-gray-900 dark:text-gray-100">
                          {item.shift.name}
                        </h3>
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-medium">
                          {item.status}
                        </span>
                      </div>

                      <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-gray-400" />
                        {item.shift.startTime} – {item.shift.endTime} ({item.shift.durationHours} Jam) · {dateFormatted}
                      </p>

                      {/* Coworkers */}
                      {item.coworkers.length > 0 && (
                        <p className="text-[11px] text-gray-400 flex items-center gap-1 mt-1">
                          <Users className="h-3 w-3" /> Rekan se-ruangan:{" "}
                          <span className="text-gray-600 dark:text-gray-300 font-medium">
                            {item.coworkers.map((c) => `${c.name} (${c.shift})`).join(", ")}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end md:self-center">
                    <button
                      onClick={() => navigate("/employee/swap")}
                      className="px-4 py-2 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 rounded-xl transition-all flex items-center gap-1.5"
                    >
                      <ArrowLeftRight className="h-3.5 w-3.5" />
                      Ajukan Tukar
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>
      ) : (
        /* Calendar Grid View */
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-6 shadow-xs space-y-4">
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-gray-400 pb-2 border-b border-gray-100 dark:border-gray-800">
            {["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"].map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 30 }, (_, i) => {
              const day = (i + 1).toString().padStart(2, "0")
              const dateStr = `${selectedMonth}-${day}`
              const sch = myMonthlySchedules.find((s) => s.date === dateStr)

              return (
                <div
                  key={day}
                  className={`min-h-[85px] p-2 rounded-2xl border transition-all flex flex-col justify-between ${
                    sch
                      ? "bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800"
                      : "bg-gray-50/40 dark:bg-gray-800/20 border-gray-100 dark:border-gray-800/60"
                  }`}
                >
                  <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{i + 1}</span>
                  {sch ? (
                    <div className="p-1.5 rounded-xl bg-white dark:bg-gray-900 shadow-xs border border-emerald-100 dark:border-emerald-900">
                      <p className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 truncate">
                        {sch.shift.name}
                      </p>
                      <p className="text-[9px] text-gray-400">{sch.shift.startTime}</p>
                    </div>
                  ) : (
                    <span className="text-[9px] text-gray-300 dark:text-gray-600">Off</span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
