import { useState, useMemo } from "react"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import {
  SEED_EMPLOYEES,
  SEED_DEPARTMENTS,
  SEED_SHIFTS,
  SEED_SCHEDULES,
} from "@/data/seed"
import type { Employee, Department, ShiftPattern, Schedule } from "@/types"
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Users,
  AlertCircle,
  Sparkles,
  Undo2,
  Trash2,
  SlidersHorizontal,
  X,
  Plus,
} from "lucide-react"

export const SupervisorRosterPage = () => {
  const [userSession] = useLocalStorage<any>("user", {})
  const [employees] = useLocalStorage<Employee[]>("employees", SEED_EMPLOYEES)
  const [departments] = useLocalStorage<Department[]>("departments", SEED_DEPARTMENTS)
  const [shiftPatterns] = useLocalStorage<ShiftPattern[]>("shifts", SEED_SHIFTS)
  const [schedules, setSchedules] = useLocalStorage<Schedule[]>("schedules", SEED_SCHEDULES)

  const currentSupervisor =
    employees.find((e) => e.id === userSession?.id || e.nip === userSession?.nip) || userSession
  const supervisorDeptId = currentSupervisor?.departmentId ?? "dept-1"
  const currentDept = departments.find((d) => d.id === supervisorDeptId)

  // Month navigation (current month default)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [savedSuccess, setSavedSuccess] = useState(false)
  const [selectedStaff, setSelectedStaff] = useState<string>("all")

  // Undo Snapshot state
  const [undoSnapshot, setUndoSnapshot] = useState<Schedule[] | null>(null)
  const [toastMessage, setToastMessage] = useState<string>("")

  // Custom Pattern Modal state
  const [isPatternModalOpen, setIsPatternModalOpen] = useState(false)
  const [customPattern, setCustomPattern] = useState<string[]>([
    "shift-1", // Pagi
    "shift-2", // Siang
    "shift-3", // Malam
    "OFF",     // Libur
  ])
  const [applyScope, setApplyScope] = useState<"all" | "selected">("all")
  const [selectedTargetStaff, setSelectedTargetStaff] = useState<string[]>([])
  const [isStaggered, setIsStaggered] = useState(true)

  // Supervisor's department staff (includes both employees and supervisor in this department)
  const unitStaff = useMemo(() => {
    return employees.filter(
      (e) =>
        e.departmentId === supervisorDeptId &&
        (e.role === "employee" || e.role === "supervisor") &&
        e.isActive
    )
  }, [employees, supervisorDeptId])

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  // Days in current selected month
  const daysInMonth = useMemo(() => {
    const numDays = new Date(year, month + 1, 0).getDate()
    return Array.from({ length: numDays }, (_, i) => {
      const d = new Date(year, month, i + 1)
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(i + 1).padStart(2, "0")}`
      const dayName = d.toLocaleDateString("id-ID", { weekday: "short" })
      const isWeekend = d.getDay() === 0 || d.getDay() === 6
      return { dayNumber: i + 1, dateStr, dayName, isWeekend }
    })
  }, [year, month])

  // Find schedule for a user on a given date
  const getScheduleForUserAndDate = (empId: string, dateStr: string) => {
    return schedules.find((s) => s.employeeId === empId && s.date === dateStr)
  }

  // Change individual shift assignment
  const handleShiftChange = (empId: string, dateStr: string, shiftId: string) => {
    setSchedules((prev) => {
      const existingIndex = prev.findIndex((s) => s.employeeId === empId && s.date === dateStr)

      if (!shiftId) {
        return prev.filter((s) => !(s.employeeId === empId && s.date === dateStr))
      }

      if (existingIndex >= 0) {
        const updated = [...prev]
        updated[existingIndex] = {
          ...updated[existingIndex],
          shiftId,
          status: "published",
        }
        return updated
      } else {
        const newSched: Schedule = {
          id: `sched-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          employeeId: empId,
          departmentId: supervisorDeptId,
          shiftId,
          date: dateStr,
          status: "published",
          createdBy: currentSupervisor?.id || "supervisor",
        }
        return [...prev, newSched]
      }
    })

    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 2000)
  }

  // Apply Custom Rotation Pattern to Roster
  const handleApplyCustomPattern = () => {
    if (customPattern.length === 0) {
      alert("Harap tambahkan minimal 1 sif atau hari libur pada urutan pola.")
      return
    }

    // Save previous snapshot for undo
    setUndoSnapshot([...schedules])

    const targets = applyScope === "all"
      ? unitStaff
      : unitStaff.filter((s) => selectedTargetStaff.includes(s.id))

    if (targets.length === 0) {
      alert("Pilih minimal 1 staf sebagai target pengisian pola.")
      return
    }

    const newSchedules = [...schedules]

    targets.forEach((staff, staffIdx) => {
      daysInMonth.forEach((day, dayIdx) => {
        // Staggered pattern rotation offset or synchronized
        const patternIndex = isStaggered
          ? (staffIdx * 2 + dayIdx) % customPattern.length
          : dayIdx % customPattern.length

        const targetVal = customPattern[patternIndex]
        const shiftId = targetVal === "OFF" ? "" : targetVal

        const existingIdx = newSchedules.findIndex(
          (s) => s.employeeId === staff.id && s.date === day.dateStr
        )

        if (shiftId) {
          if (existingIdx >= 0) {
            newSchedules[existingIdx] = {
              ...newSchedules[existingIdx],
              shiftId,
              status: "published",
            }
          } else {
            newSchedules.push({
              id: `sched-auto-${staff.id}-${day.dateStr}`,
              employeeId: staff.id,
              departmentId: supervisorDeptId,
              shiftId,
              date: day.dateStr,
              status: "published",
              createdBy: currentSupervisor?.id || "supervisor",
            })
          }
        } else if (existingIdx >= 0) {
          newSchedules.splice(existingIdx, 1)
        }
      })
    })

    setSchedules(newSchedules)
    setIsPatternModalOpen(false)
    setToastMessage("Pola rotasi berhasil diterapkan! Anda dapat membatalkannya jika diperlukan.")
    setSavedSuccess(true)
    setTimeout(() => {
      setSavedSuccess(false)
      setToastMessage("")
    }, 4000)
  }

  // Undo / Batalkan Perubahan Terakhir
  const handleUndo = () => {
    if (undoSnapshot) {
      setSchedules(undoSnapshot)
      setUndoSnapshot(null)
      setToastMessage("Perubahan auto-fill berhasil dibatalkan (Undo)!")
      setSavedSuccess(true)
      setTimeout(() => {
        setSavedSuccess(false)
        setToastMessage("")
      }, 3000)
    }
  }

  // Kosongkan Jadwal Bulan Ini
  const handleClearMonth = () => {
    if (!confirm(`Apakah Anda yakin ingin mengosongkan semua jadwal sif unit ${currentDept?.name} pada bulan ${currentDate.toLocaleDateString("id-ID", { month: "long", year: "numeric" })}?`)) {
      return
    }

    setUndoSnapshot([...schedules])
    const monthPrefix = `${year}-${String(month + 1).padStart(2, "0")}`
    const staffIds = new Set(unitStaff.map((s) => s.id))

    const newSchedules = schedules.filter(
      (s) => !(staffIds.has(s.employeeId) && s.date.startsWith(monthPrefix))
    )

    setSchedules(newSchedules)
    setToastMessage("Jadwal bulan ini telah dikosongkan. Klik 'Batalkan' jika ingin mengembalikan.")
    setSavedSuccess(true)
    setTimeout(() => {
      setSavedSuccess(false)
      setToastMessage("")
    }, 4000)
  }

  // Presets for Custom Pattern
  const applyPreset = (presetType: "standard" | "dense" | "light" | "custom_off") => {
    if (presetType === "standard") {
      setCustomPattern(["shift-1", "shift-2", "shift-3", "OFF"])
    } else if (presetType === "dense") {
      setCustomPattern(["shift-1", "shift-1", "shift-2", "shift-2", "shift-3", "OFF", "OFF"])
    } else if (presetType === "light") {
      setCustomPattern(["shift-1", "shift-2", "OFF"])
    } else if (presetType === "custom_off") {
      setCustomPattern(["shift-1", "shift-1", "shift-1", "OFF", "OFF"])
    }
  }

  // Navigation handlers
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const filteredStaff =
    selectedStaff === "all" ? unitStaff : unitStaff.filter((s) => s.id === selectedStaff)

  const monthLabel = currentDate.toLocaleDateString("id-ID", { month: "long", year: "numeric" })

  const getShiftBadgeLabel = (idOrOff: string) => {
    if (idOrOff === "OFF") return "OFF (Libur)"
    const sp = shiftPatterns.find((s) => s.id === idOrOff)
    return sp ? `${sp.name.replace("Shift ", "")}` : idOrOff
  }

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              {currentDept?.name || "Unit Ruangan"}
            </span>
            <span className="text-xs text-gray-500 font-medium">Roster Builder Bulanan</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
            Pengaturan Jadwal Sif Unit
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Kelola, kustomisasi pola rotasi, dan publikasikan jadwal kerja sif staf di ruangan Anda
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Month Navigator */}
          <div className="flex items-center bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-1">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-600 dark:text-gray-300 shadow-xs cursor-pointer"
              title="Bulan Sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 text-sm font-semibold text-gray-800 dark:text-gray-200 min-w-[130px] text-center capitalize">
              {monthLabel}
            </span>
            <button
              onClick={handleNextMonth}
              className="p-1.5 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-600 dark:text-gray-300 shadow-xs cursor-pointer"
              title="Bulan Berikutnya"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Custom Rotation Auto-Fill Button */}
          <button
            onClick={() => {
              setSelectedTargetStaff(unitStaff.map((s) => s.id))
              setIsPatternModalOpen(true)
            }}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-sm transition-colors cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Kustomisasi Pola Rotasi</span>
          </button>

          {/* Undo Button (Active if undo snapshot exists) */}
          {undoSnapshot && (
            <button
              onClick={handleUndo}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700 hover:bg-amber-100 rounded-xl transition-all cursor-pointer animate-fade-in shadow-xs"
              title="Kembalikan ke susunan jadwal sebelum autofill"
            >
              <Undo2 className="w-3.5 h-3.5" />
              <span>Batalkan (Undo)</span>
            </button>
          )}

          {/* Clear Month Button */}
          <button
            onClick={handleClearMonth}
            className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl border border-transparent hover:border-rose-200 transition-colors cursor-pointer"
            title="Kosongkan semua jadwal bulan ini"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {savedSuccess && toastMessage && (
        <div className="flex items-center justify-between gap-2 p-3 text-xs font-medium text-emerald-800 dark:text-emerald-200 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          {undoSnapshot && (
            <button
              onClick={handleUndo}
              className="text-xs font-bold underline hover:text-emerald-900 cursor-pointer"
            >
              Undo Sekarang
            </button>
          )}
        </div>
      )}

      {/* Legend & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm text-xs">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="font-semibold text-gray-600 dark:text-gray-300">Pola Sif:</span>
          {shiftPatterns.map((st) => (
            <span
              key={st.id}
              className="px-2.5 py-1 rounded-lg border font-medium bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-700"
            >
              {st.name} ({st.startTime} - {st.endTime})
            </span>
          ))}
          <span className="px-2.5 py-1 rounded-lg border font-medium bg-gray-100 dark:bg-gray-800 text-gray-500 border-dashed border-gray-300 dark:border-gray-700">
            OFF (Libur)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-gray-500 font-medium">Filter Staf:</span>
          <select
            value={selectedStaff}
            onChange={(e) => setSelectedStaff(e.target.value)}
            className="text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium cursor-pointer"
          >
            <option value="all">Semua Staf ({unitStaff.length})</option>
            {unitStaff.map((staff) => (
              <option key={staff.id} value={staff.id}>
                {staff.name} {staff.role === "supervisor" ? "(Kepala Ruangan)" : ""}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Roster Matrix Table */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        {unitStaff.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
            <p className="text-base font-semibold text-gray-800 dark:text-gray-200">
              Tidak ada staf aktif di unit ini
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto mt-1">
              Pastikan pegawai telah dialokasikan ke departemen{" "}
              <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                {currentDept?.name}
              </span>{" "}
              oleh HRD pada Master Data Pegawai.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto max-h-[600px] relative">
            <table className="w-full border-collapse text-left text-xs">
              <thead className="bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 sticky top-0 z-20 shadow-sm">
                <tr>
                  <th className="p-3 font-semibold border-b border-r border-gray-200 dark:border-gray-700 min-w-[210px] sticky left-0 bg-gray-50 dark:bg-gray-800 z-30">
                    Nama Staf & Posisi
                  </th>
                  {daysInMonth.map((day) => (
                    <th
                      key={day.dayNumber}
                      className={`p-2 font-semibold border-b border-r border-gray-200 dark:border-gray-700 text-center min-w-[55px] ${
                        day.isWeekend
                          ? "bg-amber-50/60 dark:bg-amber-950/30 text-amber-900 dark:text-amber-300"
                          : ""
                      }`}
                    >
                      <div className="text-[10px] text-gray-400 uppercase">{day.dayName}</div>
                      <div className="text-xs font-bold text-gray-800 dark:text-gray-200">
                        {day.dayNumber}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {filteredStaff.map((staff) => (
                  <tr
                    key={staff.id}
                    className="hover:bg-gray-50/50 dark:hover:bg-gray-800/40 transition-colors"
                  >
                    {/* Fixed Left Header for Employee Name */}
                    <td className="p-3 border-r border-gray-200 dark:border-gray-700 sticky left-0 bg-white dark:bg-gray-900 z-10 shadow-[2px_0_5px_rgba(0,0,0,0.02)]">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold flex items-center justify-center text-xs shrink-0">
                          {staff.name.charAt(0)}
                        </div>
                        <div className="truncate">
                          <p className="font-semibold text-gray-900 dark:text-gray-100 truncate flex items-center gap-1">
                            {staff.name}
                            {staff.role === "supervisor" && (
                              <span className="text-[9px] px-1 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-semibold">
                                Spv
                              </span>
                            )}
                          </p>
                          <p className="text-[10px] text-gray-400">
                            {staff.posisi || staff.jabatan || "Staf Medis"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Shift Dropdowns for Each Day */}
                    {daysInMonth.map((day) => {
                      const currentSched = getScheduleForUserAndDate(staff.id, day.dateStr)
                      const shiftVal = currentSched ? currentSched.shiftId : ""

                      let cellColor = "bg-transparent"
                      if (shiftVal) {
                        cellColor =
                          "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-900 dark:text-indigo-200 border-indigo-200 dark:border-indigo-800 font-semibold"
                      }

                      return (
                        <td
                          key={day.dayNumber}
                          className={`p-1 border-r border-gray-100 dark:border-gray-800 text-center ${
                            day.isWeekend ? "bg-amber-50/20 dark:bg-amber-950/10" : ""
                          }`}
                        >
                          <select
                            value={shiftVal}
                            onChange={(e) => handleShiftChange(staff.id, day.dateStr, e.target.value)}
                            className={`w-full text-center text-[11px] py-1.5 px-0.5 rounded border transition-colors cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                              shiftVal
                                ? cellColor
                                : "border-dashed border-gray-200 dark:border-gray-700 text-gray-400 hover:border-gray-400"
                            }`}
                          >
                            <option value="">OFF</option>
                            {shiftPatterns.map((sp) => (
                              <option key={sp.id} value={sp.id}>
                                {sp.name.replace("Shift ", "")}
                              </option>
                            ))}
                          </select>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Roster Tips */}
      <div className="bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 rounded-xl p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
        <div className="text-xs text-indigo-900 dark:text-indigo-200 space-y-1">
          <p className="font-semibold">Informasi Fitur Rotasi Kustom & Undo</p>
          <p>
            Anda dapat menyesuaikan siklus pola kerja (misal: 2 Pagi, 2 Siang, 1 Malam, 2 Libur) melalui tombol <strong className="text-indigo-700 dark:text-indigo-300">"Kustomisasi Pola Rotasi"</strong>. Jika hasil rotasi otomatis belum sesuai, Anda dapat langsung menekan tombol <strong className="text-amber-700 dark:text-amber-300">"Batalkan (Undo)"</strong> untuk mengembalikan roster ke kondisi sebelumnya.
          </p>
        </div>
      </div>

      {/* ── Modal Kustomisasi Pola Rotasi ── */}
      {isPatternModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-gray-900 rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-gray-100 dark:border-gray-800 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                  <SlidersHorizontal className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
                    Kustomisasi Pola Rotasi Sif
                  </h3>
                  <p className="text-xs text-gray-400">
                    Susun urutan siklus kerja untuk bulan {monthLabel}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsPatternModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Template Presets */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                Pilihan Cepat Pola (Presets):
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => applyPreset("standard")}
                  className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-gray-50 dark:bg-gray-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 transition-colors cursor-pointer"
                >
                  P - S - M - OFF (4 Hari)
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset("dense")}
                  className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-gray-50 dark:bg-gray-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 transition-colors cursor-pointer"
                >
                  2P - 2S - 1M - 2OFF (7 Hari)
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset("light")}
                  className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-gray-50 dark:bg-gray-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 transition-colors cursor-pointer"
                >
                  P - S - OFF (3 Hari)
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset("custom_off")}
                  className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-gray-50 dark:bg-gray-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 transition-colors cursor-pointer"
                >
                  3P - 2OFF (5 Hari)
                </button>
              </div>
            </div>

            {/* Current Pattern Sequence */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                  Urutan Siklus Pola ({customPattern.length} Hari):
                </label>
                <button
                  type="button"
                  onClick={() => setCustomPattern([])}
                  className="text-[11px] text-rose-600 hover:underline cursor-pointer"
                >
                  Kosongkan Pola
                </button>
              </div>

              <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 min-h-[58px] flex flex-wrap items-center gap-2">
                {customPattern.length === 0 ? (
                  <span className="text-xs text-gray-400 italic">
                    Belum ada sif yang dipilih. Klik tombol sif di bawah untuk menambahkan urutan.
                  </span>
                ) : (
                  customPattern.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-xs text-xs font-semibold text-gray-800 dark:text-gray-200"
                    >
                      <span className="text-[10px] text-gray-400 font-mono">H{idx + 1}:</span>
                      <span>{getShiftBadgeLabel(item)}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...customPattern]
                          updated.splice(idx, 1)
                          setCustomPattern(updated)
                        }}
                        className="ml-1 p-0.5 hover:bg-rose-50 text-gray-400 hover:text-rose-600 rounded"
                        title="Hapus langkah ini"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Add Step Buttons */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                + Tambah Hari / Sif ke Urutan Pola:
              </label>
              <div className="flex flex-wrap gap-2">
                {shiftPatterns.map((sp) => (
                  <button
                    key={sp.id}
                    type="button"
                    onClick={() => setCustomPattern([...customPattern, sp.id])}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{sp.name}</span>
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setCustomPattern([...customPattern, "OFF"])}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-dashed border-gray-300 dark:border-gray-700 hover:bg-gray-200 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>OFF (Libur)</span>
                </button>
              </div>
            </div>

            {/* Target Scope & Staggered Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gray-100 dark:border-gray-800">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                  Terapkan Ke:
                </label>
                <select
                  value={applyScope}
                  onChange={(e) => setApplyScope(e.target.value as any)}
                  className="w-full text-xs p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 font-medium cursor-pointer"
                >
                  <option value="all">Semua Staf Unit ({unitStaff.length} Orang)</option>
                  <option value="selected">Pilih Staf Tertentu</option>
                </select>
              </div>

              <div className="space-y-1.5 flex flex-col justify-end">
                <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isStaggered}
                    onChange={(e) => setIsStaggered(e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                  />
                  <span>Rotasi Bergantian (Staggered Offset)</span>
                </label>
                <p className="text-[10px] text-gray-400 pl-6">
                  {isStaggered
                    ? "Jadwal staf akan dirotasi bertahap agar tidak semua staf libur di hari yang sama."
                    : "Pola akan diterapkan serentak pada tanggal yang sama untuk semua staf."}
                </p>
              </div>
            </div>

            {/* If specific staff selected */}
            {applyScope === "selected" && (
              <div className="space-y-1.5 max-h-36 overflow-y-auto p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Pilih Staf Target:
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {unitStaff.map((staff) => (
                    <label key={staff.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedTargetStaff.includes(staff.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedTargetStaff([...selectedTargetStaff, staff.id])
                          } else {
                            setSelectedTargetStaff(selectedTargetStaff.filter((id) => id !== staff.id))
                          }
                        }}
                        className="rounded text-indigo-600"
                      />
                      <span className="truncate">{staff.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100 dark:border-gray-800">
              <button
                type="button"
                onClick={() => setIsPatternModalOpen(false)}
                className="px-4 py-2.5 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleApplyCustomPattern}
                className="px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-md shadow-indigo-600/20 transition-all cursor-pointer flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Terapkan Pola ke Roster</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
