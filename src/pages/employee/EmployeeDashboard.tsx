import { useState, useMemo } from "react"
import {
  Clock, CalendarDays, FileText, CheckCircle2,
  ArrowLeftRight, Check, X, History,
  Building2, Sparkles, MapPin, Camera, AlertCircle
} from "lucide-react"
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import {
  SEED_EMPLOYEES, SEED_SCHEDULES, SEED_SHIFTS, SEED_ATTENDANCE,
  SEED_LEAVES, SEED_SWAPS, SEED_DEPARTMENTS,
} from "@/data/seed"
import { AttendanceModal } from "@/components/attendance/AttendanceModal"
import { POSISI_OPTIONS } from "@/data/options"
import type { ShiftSwapRequest } from "@/types"

export const EmployeeDashboard = () => {

  const [userSession] = useLocalStorage<any>("user", {})
  const [employees]   = useLocalStorage("employees",   SEED_EMPLOYEES)
  const [departments] = useLocalStorage("departments", SEED_DEPARTMENTS)
  const [schedules]   = useLocalStorage("schedules",   SEED_SCHEDULES)
  const [shifts]      = useLocalStorage("shifts",      SEED_SHIFTS)
  const [attendance]  = useLocalStorage("attendance",  SEED_ATTENDANCE)
  const [leaves]      = useLocalStorage("leaves",      SEED_LEAVES)
  const [swaps, setSwaps] = useLocalStorage<ShiftSwapRequest[]>("swaps", SEED_SWAPS)

  // Modal State
  const [modalOpen, setModalOpen] = useState(false)
  const [modalType, setModalType] = useState<"clock-in" | "clock-out">("clock-in")

  // Current logged in employee
  const currentEmp = employees.find((e) => e.id === userSession?.id || e.nip === userSession?.nip) || userSession || employees[0]
  const dept = departments.find((d) => d.id === currentEmp?.departmentId)
  const posisiLabel = POSISI_OPTIONS.find((p) => p.value === currentEmp?.posisi)?.label || "Staf Medis"

  const todayStr = new Date().toISOString().split("T")[0]
  const todayDisplay = new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })

  // Cuti / Izin Aktif Hari Ini (yang di-ACC)
  const todayActiveLeave = useMemo(() => {
    return leaves.find(
      (l) =>
        l.employeeId === currentEmp?.id &&
        l.status === "approved" &&
        todayStr >= l.startDate &&
        todayStr <= l.endDate
    )
  }, [leaves, currentEmp?.id, todayStr])

  // Shift Hari Ini (Hanya jika supervisor sudah membuat jadwal untuk tanggal hari ini)
  const todaySchedule = useMemo(() => {
    return schedules.find(
      (s) => s.employeeId === currentEmp?.id && s.date === todayStr
    )
  }, [schedules, currentEmp?.id, todayStr])

  const isSchedulePublished = todaySchedule ? todaySchedule.status === "published" : false
  const isScheduleLeave = todaySchedule?.status === "leave" || !!todayActiveLeave
  const hasValidSchedule = !!todaySchedule && isSchedulePublished && !isScheduleLeave

  const todayShift = useMemo(() => {
    if (!todaySchedule) return null
    return shifts.find((sh) => sh.id === todaySchedule.shiftId) || null
  }, [shifts, todaySchedule])

  // Presensi Hari Ini
  const todayAttendance = useMemo(() => {
    return attendance.find((a) => a.employeeId === currentEmp?.id && a.date === todayStr)
  }, [attendance, currentEmp?.id, todayStr])

  // Upcoming Shifts (3 hari berikutnya)
  const upcomingSchedules = useMemo(() => {
    return schedules
      .filter((s) => s.employeeId === currentEmp?.id && s.date > todayStr)
      .slice(0, 3)
      .map((s) => {
        const sh = shifts.find((item) => item.id === s.shiftId) || shifts[0]
        return { ...s, shift: sh }
      })
  }, [schedules, currentEmp, shifts, todayStr])

  // Swaps requiring my approval (where targetId === currentEmp.id and peerStatus === 'pending')
  const pendingSwapRequestsForMe = useMemo(() => {
    return swaps.filter((sw) => sw.targetId === currentEmp?.id && sw.peerStatus === "pending")
  }, [swaps, currentEmp])

  // Stats calculation
  const myLeaves = leaves.filter((l) => l.employeeId === currentEmp?.id)
  const remainingLeave = (currentEmp?.annualLeaveQuota ?? 12) - (currentEmp?.usedLeave ?? 0)
  const myTotalHadir = attendance.filter((a) => a.employeeId === currentEmp?.id && a.status !== "absent").length
  const myTotalHours = attendance
    .filter((a) => a.employeeId === currentEmp?.id)
    .reduce((sum, a) => sum + (a.totalHours || 0), 0)

  // Handle Swap Peer Approval / Rejection
  const handlePeerSwapAction = (swapId: string, action: "approved" | "rejected") => {
    setSwaps((prev) =>
      prev.map((sw) => (sw.id === swapId ? { ...sw, peerStatus: action } : sw))
    )
  }

  const openClockIn = () => {
    setModalType("clock-in")
    setModalOpen(true)
  }

  const openClockOut = () => {
    setModalType("clock-out")
    setModalOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* ── Greeting & Top Banner ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Halo, {currentEmp?.name} 👋
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {posisiLabel} · Unit {dept?.name ?? "Pelayanan RS"} · {todayDisplay}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isScheduleLeave ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              Bebas Dinas (Cuti / Izin)
            </span>
          ) : !hasValidSchedule ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
              <span className="h-2 w-2 rounded-full bg-gray-400" />
              Belum Ada Jadwal
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Shift Aktif ({todayShift?.name})
            </span>
          )}
        </div>
      </div>

      {/* ── Incoming Swap Alert (Jika Ada Permohonan Masuk) ── */}
      {pendingSwapRequestsForMe.length > 0 && (
        <div className="p-4 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-2xl bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 shrink-0">
              <ArrowLeftRight className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-amber-900 dark:text-amber-200">
                Ada {pendingSwapRequestsForMe.length} Permohonan Tukar Dinas Masuk
              </p>
              <p className="text-[11px] text-amber-700 dark:text-amber-400">
                Rekan kerja membutuhkan konfirmasi persetujuan dari Anda.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              type="button"
              onClick={() => handlePeerSwapAction(pendingSwapRequestsForMe[0].id, "approved")}
              className="px-3 py-1.5 bg-green-600 hover:bg-green-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
            >
              <Check className="h-3.5 w-3.5" /> Setujui
            </button>
            <button
              type="button"
              onClick={() => handlePeerSwapAction(pendingSwapRequestsForMe[0].id, "rejected")}
              className="px-3 py-1.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer border border-amber-200 dark:border-amber-800"
            >
              <X className="h-3.5 w-3.5" /> Tolak
            </button>
          </div>
        </div>
      )}

      {/* ── Bento Grid Template Layout ── */}
      <BentoGrid className="lg:grid-rows-3 auto-rows-auto md:auto-rows-[20rem]">
        {/* 1. Presensi Live GPS & Selfie (Hero Card) */}
        <BentoCard
          name={
            isScheduleLeave
              ? `Bebas Dinas: Cuti / Izin (${todayActiveLeave?.type ? todayActiveLeave.type.toUpperCase() : "CUTI"})`
              : !hasValidSchedule
              ? "Presensi Dinas: Belum Ada Jadwal"
              : `Presensi Dinas: ${todayShift?.name || "Shift Hari Ini"}`
          }
          Icon={isScheduleLeave ? FileText : !hasValidSchedule ? AlertCircle : Clock}
          className={`lg:col-start-1 lg:col-end-3 lg:row-start-1 lg:row-end-3 bg-gradient-to-br ${
            isScheduleLeave
              ? "from-amber-50/50 via-white to-orange-50/30 dark:from-amber-950/20 dark:via-gray-900 dark:to-orange-950/10"
              : !hasValidSchedule
              ? "from-gray-50/70 via-white to-slate-50/40 dark:from-gray-900 dark:via-gray-900 dark:to-slate-900/40"
              : "from-emerald-50/50 via-white to-teal-50/30 dark:from-emerald-950/20 dark:via-gray-900 dark:to-teal-950/10"
          }`}
          cta={
            isScheduleLeave
              ? "Sedang Cuti / Izin"
              : !hasValidSchedule
              ? "Belum Terjadwal Hari Ini"
              : !todayAttendance?.clockInTime
              ? "Clock-In Masuk Sekarang"
              : !todayAttendance?.clockOutTime
              ? "Clock-Out Pulang"
              : "Presensi Hari Ini Selesai"
          }
          onClick={
            isScheduleLeave || !hasValidSchedule
              ? undefined
              : !todayAttendance?.clockInTime
              ? openClockIn
              : !todayAttendance?.clockOutTime
              ? openClockOut
              : undefined
          }
          href={
            isScheduleLeave
              ? "/employee/leaves"
              : !hasValidSchedule
              ? undefined
              : todayAttendance?.clockOutTime
              ? "/employee/history"
              : undefined
          }
          background={
            <div className={`absolute right-0 top-0 w-80 h-80 rounded-full blur-3xl ${
              isScheduleLeave
                ? "bg-gradient-to-br from-amber-400/10 to-orange-500/10"
                : !hasValidSchedule
                ? "bg-gradient-to-br from-gray-400/10 to-slate-500/10"
                : "bg-gradient-to-br from-emerald-400/10 to-teal-500/10"
            }`} />
          }
          description={
            <div className="space-y-4 pt-1">
              <div>
                <p className="text-base font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-emerald-600" />
                  {isScheduleLeave
                    ? `Unit ${dept?.name ?? "RS"} · Sedang Bebas Dinas`
                    : !hasValidSchedule
                    ? `Unit ${dept?.name ?? "RS"} · Tidak Ada Jadwal Aktif`
                    : `Ruang ${dept?.name ?? "RS"} · ${todayShift?.startTime} – ${todayShift?.endTime} (${todayShift?.durationHours} Jam)`}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {isScheduleLeave
                    ? `Pengajuan cuti/izin Anda telah disetujui untuk tanggal ${todayActiveLeave?.startDate || todayStr} s/d ${todayActiveLeave?.endDate || todayStr}.`
                    : !hasValidSchedule
                    ? "Supervisor belum mengatur jadwal dinas Anda untuk hari ini. Silakan hubungi Kepala Ruangan / Supervisor Anda."
                    : "Validasi lokasi otomatis dengan Geofencing GPS & Kamera Selfie Wajah."}
                </p>
              </div>

              {/* Status Pill Live */}
              <div className="p-3.5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/60 shadow-xs flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  {isScheduleLeave ? (
                    <div className="p-2 rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                  ) : !hasValidSchedule ? (
                    <div className="p-2 rounded-xl bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                      <AlertCircle className="h-4 w-4 text-amber-500" />
                    </div>
                  ) : todayAttendance?.clockOutTime ? (
                    <div className="p-2 rounded-xl bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                  ) : todayAttendance?.clockInTime ? (
                    <div className="p-2 rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                      <Clock className="h-4 w-4" />
                    </div>
                  ) : (
                    <div className="p-2 rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                      <Sparkles className="h-4 w-4" />
                    </div>
                  )}

                  <div>
                    <p className="text-xs font-bold text-gray-900 dark:text-gray-100">
                      {isScheduleLeave
                        ? "Bebas Dinas (Cuti Disetujui)"
                        : !hasValidSchedule
                        ? "Belum Ada Jadwal Dinas"
                        : todayAttendance?.clockOutTime
                        ? "Dinas Selesai Tercatat"
                        : todayAttendance?.clockInTime
                        ? "Sedang Berdinas (Clocked-In)"
                        : "Belum Melakukan Presensi"}
                    </p>
                    <p className="text-[11px] text-gray-400">
                      {isScheduleLeave
                        ? (todayActiveLeave?.reason ? `Keperluan: ${todayActiveLeave.reason}` : "Tidak perlu absensi hari ini")
                        : !hasValidSchedule
                        ? "Menunggu pengaturan roster oleh Supervisor"
                        : todayAttendance?.clockOutTime
                        ? `Masuk: ${todayAttendance.clockInTime} · Pulang: ${todayAttendance.clockOutTime} (${todayAttendance.totalHours} jam)`
                        : todayAttendance?.clockInTime
                        ? `Masuk pukul ${todayAttendance.clockInTime} · Status: ${todayAttendance.status === "on-time" ? "Tepat Waktu" : "Terlambat"}`
                        : "Batas toleransi keterlambatan aktif"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
                  <MapPin className="h-3.5 w-3.5" /> GPS Siap
                </div>
              </div>
            </div>
          }
        />

        {/* 2. Jadwal Dinas Saya & Shift Mendatang */}
        <BentoCard
          name="Jadwal Dinas"
          Icon={CalendarDays}
          className="lg:col-start-3 lg:col-end-4 lg:row-start-1 lg:row-end-3"
          cta="Buka Kalender Shift"
          href="/employee/schedule"
          background={
            <div className="absolute -right-10 -top-10 w-48 h-48 bg-blue-500/5 rounded-full blur-2xl" />
          }
          description={
            <div className="space-y-3 pt-1">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Shift dinas terjadwal untuk hari-hari mendatang di Unit {dept?.name}:
              </p>

              <div className="space-y-2">
                {upcomingSchedules.map((sch) => (
                  <div
                    key={sch.id}
                    className="p-2.5 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-gray-900 dark:text-gray-100">
                        {sch.date.split("-")[2]} Sep
                      </span>
                      <span className="text-gray-500 dark:text-gray-400">
                        {sch.shift.name}
                      </span>
                    </div>
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                      {sch.shift.startTime}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          }
        />

        {/* 3. Tukar Dinas (Swap Shift) */}
        <BentoCard
          name="Tukar Shift"
          Icon={ArrowLeftRight}
          className="lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4"
          cta="Kelola Tukar Shift"
          href="/employee/swap"
          background={
            <div className="absolute right-0 bottom-0 w-36 h-36 bg-amber-500/5 rounded-full blur-xl" />
          }
          description={
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Tukar jadwal dinas dengan rekan kerja se-unit dengan persetujuan rekan & supervisor.
            </p>
          }
        />

        {/* 4. Cuti & Izin Online */}
        <BentoCard
          name="Cuti & Izin"
          Icon={FileText}
          className="lg:col-start-2 lg:col-end-3 lg:row-start-3 lg:row-end-4"
          cta="Ajukan Cuti / Izin"
          href="/employee/leaves"
          background={
            <div className="absolute right-0 bottom-0 w-36 h-36 bg-purple-500/5 rounded-full blur-xl" />
          }
          description={
            <div className="space-y-1">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Sisa kuota tahunan: <strong className="text-emerald-600 dark:text-emerald-400 font-bold">{remainingLeave} hari</strong> dari {currentEmp?.annualLeaveQuota ?? 12} hari.
              </p>
              <p className="text-[11px] text-gray-400">
                {myLeaves.filter((l) => l.status === "pending").length} pengajuan menunggu review.
              </p>
            </div>
          }
        />

        {/* 5. Riwayat Kehadiran & Foto Selfie */}
        <BentoCard
          name="Riwayat Presensi"
          Icon={History}
          className="lg:col-start-3 lg:col-end-4 lg:row-start-3 lg:row-end-4"
          cta="Lihat Riwayat & Foto"
          href="/employee/history"
          background={
            <div className="absolute right-0 bottom-0 w-36 h-36 bg-emerald-500/5 rounded-full blur-xl" />
          }
          description={
            <div className="space-y-1">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Akumulasi: <strong className="text-gray-900 dark:text-gray-100">{myTotalHours.toFixed(1)} jam</strong> ({myTotalHadir} hari hadir).
              </p>
              <p className="text-[11px] text-gray-400 flex items-center gap-1">
                <Camera className="h-3 w-3 text-blue-500" /> Log foto verifikasi selfie tersimpan.
              </p>
            </div>
          }
        />
      </BentoGrid>

      {/* ── Attendance Modal ── */}
      <AttendanceModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        type={modalType}
        employeeId={currentEmp?.id || "emp-1"}
        shiftName={todayShift?.name || "Shift Kerja"}
        shiftStartTime={todayShift?.startTime || "07:00"}
        shiftEndTime={todayShift?.endTime || "15:00"}
        existingRecord={todayAttendance}
      />
    </div>
  )
}
