import { useState, useMemo, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  Users, CheckCircle2, Clock, FileText, ArrowLeftRight,
  ChevronRight, Check, X, CalendarDays, Camera, MapPin,
} from "lucide-react"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import {
  SEED_EMPLOYEES, SEED_DEPARTMENTS, SEED_ATTENDANCE,
  SEED_LEAVES, SEED_SWAPS, SEED_SCHEDULES, SEED_SHIFTS
} from "@/data/seed"
import { POSISI_OPTIONS } from "@/data/options"
import { DEFAULT_SETTINGS } from "@/data/settings"
import { calculateDistanceMeters, formatDistance } from "@/utils/geo"
import { AttendanceModal } from "@/components/attendance/AttendanceModal"
import type { ShiftSwapRequest, LeaveRequest, AppSettings } from "@/types"

export const SupervisorDashboard = () => {
  const navigate = useNavigate()

  const [userSession] = useLocalStorage<any>("user", {})
  const [employees, setEmployees]   = useLocalStorage("employees",   SEED_EMPLOYEES)
  const [departments]               = useLocalStorage("departments", SEED_DEPARTMENTS)
  const [schedules]                 = useLocalStorage("schedules",   SEED_SCHEDULES)
  const [shifts]                    = useLocalStorage("shifts",      SEED_SHIFTS)
  const [attendance]                = useLocalStorage("attendance",  SEED_ATTENDANCE)
  const [leaves, setLeaves]         = useLocalStorage<LeaveRequest[]>("leaves", SEED_LEAVES)
  const [swaps, setSwaps]           = useLocalStorage<ShiftSwapRequest[]>("swaps", SEED_SWAPS)
  const [settings]                  = useLocalStorage<AppSettings>("app_settings", DEFAULT_SETTINGS)

  // Attendance Modal state for Supervisor
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false)
  const [modalType, setModalType] = useState<"clock-in" | "clock-out">("clock-in")

  // Live clock
  const [nowTime, setNowTime] = useState(
    new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
  )
  useEffect(() => {
    const timer = setInterval(() => {
      setNowTime(new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" }))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Live GPS Distance
  const [distance, setDistance] = useState<number | null>(null)
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const d = calculateDistanceMeters(
            pos.coords.latitude,
            pos.coords.longitude,
            settings.latitude,
            settings.longitude
          )
          setDistance(d)
        },
        () => {
          // Fallback simulation distance
          setDistance(42)
        },
        { enableHighAccuracy: true, timeout: 5000 }
      )
    } else {
      setDistance(42)
    }
  }, [settings])

  // Current logged in supervisor & room
  const currentSupervisor = employees.find((e) => e.id === userSession?.id || e.nip === userSession?.nip) || employees[1] // Dr. Rina Susanti (IGD)
  const myDeptId = currentSupervisor?.departmentId ?? "dept-1"
  const dept = departments.find((d) => d.id === myDeptId)

  // Unit Staff Members (including supervisor if assigned to this unit)
  const unitEmployees = useMemo(() => {
    return employees.filter((e) => e.departmentId === myDeptId && e.isActive)
  }, [employees, myDeptId])

  const todayStr = new Date().toISOString().split("T")[0]
  const todayDisplay = new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })

  // Supervisor's own schedule & attendance today
  const myTodaySchedule = useMemo(() => {
    return schedules.find((s) => s.employeeId === currentSupervisor?.id && s.date === todayStr)
  }, [schedules, currentSupervisor, todayStr])

  const myTodayShift = useMemo(() => {
    return shifts.find((sh) => sh.id === myTodaySchedule?.shiftId) || shifts[0] || { name: "Shift Reguler", startTime: "08:00", endTime: "16:00", durationHours: 8 }
  }, [shifts, myTodaySchedule])

  const myTodayAttendance = useMemo(() => {
    return attendance.find((a) => a.employeeId === currentSupervisor?.id && a.date === todayStr)
  }, [attendance, currentSupervisor, todayStr])

  // Staf yang terjadwal dinas hari ini di unit
  const todayUnitSchedules = useMemo(() => {
    return schedules.filter((s) => s.departmentId === myDeptId && s.date === todayStr)
  }, [schedules, myDeptId, todayStr])

  // Presensi staf unit hari ini
  const unitAttendanceToday = useMemo(() => {
    return unitEmployees.map((emp) => {
      const sch = todayUnitSchedules.find((s) => s.employeeId === emp.id)
      const shift = shifts.find((sh) => sh.id === sch?.shiftId)
      const att = attendance.find((a) => a.employeeId === emp.id && a.date === todayStr)
      const onLeave = leaves.find((l) => l.employeeId === emp.id && l.status === "approved" && l.startDate <= todayStr && l.endDate >= todayStr)

      let statusDisplay = "OFF / Libur"
      let statusColor = "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"

      if (onLeave) {
        statusDisplay = onLeave.type === "sakit" ? "Izin Sakit" : "Cuti Tahunan"
        statusColor = "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
      } else if (att?.clockOutTime) {
        statusDisplay = `Selesai (${att.clockInTime} – ${att.clockOutTime})`
        statusColor = "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300"
      } else if (att?.clockInTime) {
        statusDisplay = att.status === "late" ? `Hadir Telat (${att.clockInTime})` : `Hadir (${att.clockInTime})`
        statusColor = att.status === "late" ? "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300" : "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
      } else if (sch) {
        statusDisplay = `Belum Presensi (${shift?.name ?? "Dinas"})`
        statusColor = "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
      }

      return {
        emp,
        sch,
        shift,
        att,
        onLeave,
        statusDisplay,
        statusColor,
      }
    })
  }, [unitEmployees, todayUnitSchedules, shifts, attendance, leaves, todayStr])

  // Pending Approvals in this Unit
  const pendingSwaps = useMemo(() => {
    return swaps.filter((s) => s.departmentId === myDeptId && s.peerStatus === "approved" && s.supervisorStatus === "pending")
  }, [swaps, myDeptId])

  const pendingLeaves = useMemo(() => {
    return leaves.filter((l) => l.departmentId === myDeptId && l.status === "pending")
  }, [leaves, myDeptId])

  // Quick Action Handlers for Supervisor
  const handleApproveSwap = (id: string) => {
    setSwaps((prev) =>
      prev.map((s) => (s.id === id ? { ...s, supervisorStatus: "approved" } : s))
    )
  }

  const handleRejectSwap = (id: string) => {
    setSwaps((prev) =>
      prev.map((s) => (s.id === id ? { ...s, supervisorStatus: "rejected" } : s))
    )
  }

  const handleApproveLeave = (id: string) => {
    const target = leaves.find((l) => l.id === id)
    setLeaves((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: "approved", reviewedAt: new Date().toISOString() } : l))
    )
    if (target && target.type === "cuti") {
      setEmployees((prev) =>
        prev.map((e) => (e.id === target.employeeId ? { ...e, usedLeave: e.usedLeave + target.totalDays } : e))
      )
    }
  }

  const handleRejectLeave = (id: string) => {
    setLeaves((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: "rejected", reviewedAt: new Date().toISOString() } : l))
    )
  }

  const getPosisiLabel = (v: string) => POSISI_OPTIONS.find((p) => p.value === v)?.label || v

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* ── Greeting & Top Banner ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Dashboard Kepala Ruangan ({dept?.name})
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Monitoring operasional harian, presensi jaga, dan persetujuan staf ruangan · {todayDisplay}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/supervisor/roster")}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-md shadow-indigo-200 dark:shadow-none transition-all cursor-pointer"
          >
            <CalendarDays className="h-4 w-4" />
            Susun Roster Shift
          </button>
        </div>
      </div>

      {/* ── Direct Attendance Card for Supervisor (Presensi Mandiri Langsung) ── */}
      <div className="rounded-3xl bg-gradient-to-br from-emerald-50/80 via-white to-teal-50/60 dark:from-emerald-950/30 dark:via-gray-900 dark:to-teal-950/20 text-gray-900 dark:text-gray-100 p-6 shadow-sm border border-emerald-200/80 dark:border-emerald-800/40 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700/50">
                Presensi Mandiri Kepala Ruangan
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> {nowTime}
              </span>
            </div>

            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              {currentSupervisor?.name}
            </h2>

            <div className="text-xs text-gray-600 dark:text-gray-300 flex flex-wrap items-center gap-3">
              <span>
                Sif Hari Ini: <strong className="text-emerald-700 dark:text-emerald-400">{myTodayShift?.name} ({myTodayShift?.startTime} – {myTodayShift?.endTime})</strong>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                {distance !== null ? (
                  <span>
                    Jarak ke RS: <strong className="text-gray-900 dark:text-white">{formatDistance(distance)}</strong> (
                    <span className={distance <= settings.geofenceRadiusMeters ? "text-emerald-600 dark:text-emerald-400 font-semibold" : "text-rose-600 dark:text-rose-400 font-semibold"}>
                      {distance <= settings.geofenceRadiusMeters ? "Dalam Radius" : "Luar Radius"}
                    </span>
                    )
                  </span>
                ) : (
                  "Mendeteksi GPS..."
                )}
              </span>
            </div>
          </div>

          {/* Quick Action Button for Clock-In / Clock-Out */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {!myTodayAttendance?.clockInTime ? (
              <button
                onClick={() => {
                  setModalType("clock-in")
                  setIsAttendanceModalOpen(true)
                }}
                className="px-5 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-2xl text-xs font-bold flex items-center gap-2 shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                <span>Absen Masuk (Clock In)</span>
              </button>
            ) : !myTodayAttendance?.clockOutTime ? (
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold block">
                    Masuk: {myTodayAttendance.clockInTime}
                  </span>
                  <span className="text-[10px] text-gray-500 dark:text-gray-400 block">
                    {myTodayAttendance.status === "late" ? "Terlambat" : "Tepat Waktu"}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setModalType("clock-out")
                    setIsAttendanceModalOpen(true)
                  }}
                  className="px-5 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white rounded-2xl text-xs font-bold flex items-center gap-2 shadow-md shadow-amber-500/20 transition-all cursor-pointer"
                >
                  <Camera className="w-4 h-4" />
                  <span>Absen Pulang (Clock Out)</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div>
                  <p className="font-bold text-emerald-900 dark:text-emerald-200">Selesai Dinas Hari Ini</p>
                  <p className="text-[10px] text-emerald-700 dark:text-emerald-400">
                    Masuk: {myTodayAttendance.clockInTime} • Pulang: {myTodayAttendance.clockOutTime}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Ambient Glow */}
        <div className="pointer-events-none absolute -right-12 -bottom-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />
      </div>

      {/* ── 4 KPI Stats Unit ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-gray-400 font-semibold">Total Staf Unit</span>
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-gray-900 dark:text-gray-100">{unitEmployees.length} Orang</p>
          <p className="text-[11px] text-gray-400 mt-0.5">Staf aktif di Unit {dept?.name}</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-gray-400 font-semibold">Hadir Hari Ini</span>
            <div className="p-2 rounded-xl bg-green-50 dark:bg-green-900/30 text-green-600">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-green-600 dark:text-green-400">
            {unitAttendanceToday.filter((item) => item.att?.clockInTime).length} / {todayUnitSchedules.length}
          </p>
          <p className="text-[11px] text-gray-400 mt-0.5">Staf hadir dari jadwal hari ini</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-gray-400 font-semibold">Tukar Sif Menunggu</span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-900/30 text-amber-600">
              <ArrowLeftRight className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-amber-600 dark:text-amber-400">{pendingSwaps.length}</p>
          <p className="text-[11px] text-gray-400 mt-0.5">Menunggu approval Anda</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-gray-400 font-semibold">Cuti/Izin Menunggu</span>
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-900/30 text-purple-600">
              <FileText className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-purple-600 dark:text-purple-400">{pendingLeaves.length}</p>
          <p className="text-[11px] text-gray-400 mt-0.5">Permohonan staf unit</p>
        </div>
      </div>

      {/* ── Pending Approvals Section (Swap & Leaves) ── */}
      {(pendingSwaps.length > 0 || pendingLeaves.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Pending Swaps */}
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-amber-200 dark:border-amber-800/60 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
              <div className="flex items-center gap-2">
                <ArrowLeftRight className="h-4 w-4 text-amber-600" />
                <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100">
                  Persetujuan Tukar Sif ({pendingSwaps.length})
                </h3>
              </div>
              <button
                onClick={() => navigate("/supervisor/swaps")}
                className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
              >
                Lihat Semua
              </button>
            </div>

            <div className="space-y-3">
              {pendingSwaps.slice(0, 3).map((swap) => {
                const reqEmp = employees.find((e) => e.id === swap.requesterId)
                const tarEmp = employees.find((e) => e.id === swap.targetId)

                return (
                  <div
                    key={swap.id}
                    className="p-3.5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="text-xs space-y-1">
                      <p className="font-bold text-gray-900 dark:text-gray-100">
                        {reqEmp?.name} ⇄ {tarEmp?.name}
                      </p>
                      <p className="text-gray-500 dark:text-gray-400">
                        {swap.requesterDate} ⇄ {swap.targetDate} · <em>"{swap.reason}"</em>
                      </p>
                      <span className="inline-block px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] font-semibold">
                        Disetujui Kedua Staf ✅
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleApproveSwap(swap.id)}
                        className="px-3 py-1.5 bg-green-600 hover:bg-green-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                      >
                        <Check className="h-3.5 w-3.5" /> Approve
                      </button>
                      <button
                        onClick={() => handleRejectSwap(swap.id)}
                        className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 text-gray-600 dark:text-gray-400 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                      >
                        <X className="h-3.5 w-3.5" /> Reject
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Pending Leaves */}
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-purple-200 dark:border-purple-800/60 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-purple-600" />
                <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100">
                  Persetujuan Cuti & Izin ({pendingLeaves.length})
                </h3>
              </div>
              <button
                onClick={() => navigate("/supervisor/leaves")}
                className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
              >
                Lihat Semua
              </button>
            </div>

            <div className="space-y-3">
              {pendingLeaves.slice(0, 3).map((leave) => {
                const emp = employees.find((e) => e.id === leave.employeeId)
                const typeLabel = leave.type === "cuti" ? "Cuti Tahunan" : leave.type === "sakit" ? "Izin Sakit" : "Izin Dinas/Pribadi"

                return (
                  <div
                    key={leave.id}
                    className="p-3.5 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200/60 dark:border-purple-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="text-xs space-y-1">
                      <p className="font-bold text-gray-900 dark:text-gray-100">
                        {emp?.name} — <span className="font-normal text-purple-700 dark:text-purple-300">{typeLabel} ({leave.totalDays} hari)</span>
                      </p>
                      <p className="text-gray-500 dark:text-gray-400">
                        {leave.startDate} s/d {leave.endDate} · <em>"{leave.reason}"</em>
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleApproveLeave(leave.id)}
                        className="px-3 py-1.5 bg-green-600 hover:bg-green-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                      >
                        <Check className="h-3.5 w-3.5" /> Setujui
                      </button>
                      <button
                        onClick={() => handleRejectLeave(leave.id)}
                        className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 text-gray-600 dark:text-gray-400 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                      >
                        <X className="h-3.5 w-3.5" /> Tolak
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── Real-Time Unit Attendance Table ── */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">
              Status Presensi Staf Ruangan Hari Ini
            </h2>
            <p className="text-xs text-gray-400">
              Monitoring langsung staf medis di Unit {dept?.name} per tanggal {todayDisplay}
            </p>
          </div>

          <button
            onClick={() => navigate("/supervisor/reports")}
            className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline flex items-center gap-1 self-start sm:self-center"
          >
            Unduh Rekap Unit <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Nama Staf</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Posisi / Jabatan</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Jadwal Shift</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status Presensi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {unitAttendanceToday.map(({ emp, shift, statusDisplay, statusColor }) => (
                <tr key={emp.id} className="hover:bg-gray-50/60 dark:hover:bg-gray-800/40 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 flex items-center justify-center text-xs font-bold shrink-0">
                        {emp.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">{emp.name}</p>
                        <p className="text-[11px] text-gray-400 font-mono">{emp.nip}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-3.5">
                    <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      {getPosisiLabel(emp.posisi)}
                    </p>
                    <p className="text-[10px] text-gray-400 capitalize">{emp.jabatan.replace("_", " ")}</p>
                  </td>

                  <td className="px-5 py-3.5">
                    {shift ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-gray-800 dark:text-gray-200">
                        <Clock className="h-3.5 w-3.5 text-indigo-500" />
                        {shift.name} ({shift.startTime} – {shift.endTime})
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">Tidak Terjadwal</span>
                    )}
                  </td>

                  <td className="px-5 py-3.5">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${statusColor}`}>
                      {statusDisplay}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Live Attendance Modal with Selfie Camera & GPS for Supervisor ── */}
      <AttendanceModal
        isOpen={isAttendanceModalOpen}
        onClose={() => setIsAttendanceModalOpen(false)}
        type={modalType}
        employeeId={currentSupervisor?.id}
        shiftName={myTodayShift?.name}
        shiftStartTime={myTodayShift?.startTime}
        shiftEndTime={myTodayShift?.endTime}
        existingRecord={myTodayAttendance}
      />
    </div>
  )
}
