import { useState, useMemo } from "react"
import {
  ArrowLeftRight, Plus, Check, X,
  ChevronDown
} from "lucide-react"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import {
  SEED_EMPLOYEES, SEED_SCHEDULES, SEED_SHIFTS, SEED_SWAPS, SEED_DEPARTMENTS
} from "@/data/seed"
import type { ShiftSwapRequest } from "@/types"

export const EmployeeSwapPage = () => {
  const [userSession] = useLocalStorage<any>("user", {})
  const [employees]   = useLocalStorage("employees",   SEED_EMPLOYEES)
  const [departments] = useLocalStorage("departments", SEED_DEPARTMENTS)
  const [schedules]   = useLocalStorage("schedules",   SEED_SCHEDULES)
  const [shifts]      = useLocalStorage("shifts",      SEED_SHIFTS)
  const [swaps, setSwaps] = useLocalStorage<ShiftSwapRequest[]>("swaps", SEED_SWAPS)

  const currentEmp = employees.find((e) => e.id === userSession?.id || e.nip === userSession?.nip) || employees[2]
  const dept = departments.find((d) => d.id === currentEmp?.departmentId)

  // Tabs
  const [activeTab, setActiveTab] = useState<"incoming" | "outgoing">("incoming")
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Form State
  const [formMyScheduleId, setFormMyScheduleId] = useState("")
  const [formTargetEmpId, setFormTargetEmpId]   = useState("")
  const [formTargetScheduleId, setFormTargetScheduleId] = useState("")
  const [formReason, setFormReason] = useState("")
  const [formError, setFormError]   = useState("")

  // My Schedules for selection
  const mySchedules = useMemo(() => {
    return schedules.filter((s) => s.employeeId === currentEmp?.id)
  }, [schedules, currentEmp])

  // Coworkers in the same department
  const coworkers = useMemo(() => {
    return employees.filter((e) => e.departmentId === currentEmp?.departmentId && e.id !== currentEmp?.id && e.isActive)
  }, [employees, currentEmp])

  // Selected coworker's schedules
  const targetCoworkerSchedules = useMemo(() => {
    if (!formTargetEmpId) return []
    return schedules.filter((s) => s.employeeId === formTargetEmpId)
  }, [schedules, formTargetEmpId])

  // Incoming Swaps (Peer requests to me)
  const incomingSwaps = useMemo(() => {
    return swaps.filter((s) => s.targetId === currentEmp?.id)
  }, [swaps, currentEmp])

  // Outgoing Swaps (My requests to others)
  const outgoingSwaps = useMemo(() => {
    return swaps.filter((s) => s.requesterId === currentEmp?.id)
  }, [swaps, currentEmp])

  const handleAction = (swapId: string, action: "approved" | "rejected") => {
    setSwaps((prev) =>
      prev.map((sw) => (sw.id === swapId ? { ...sw, peerStatus: action } : sw))
    )
  }

  const handleSubmitSwap = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formMyScheduleId || !formTargetEmpId || !formTargetScheduleId || !formReason.trim()) {
      setFormError("Harap lengkapi semua bidang isian tukar dinas.")
      return
    }

    const mySch = schedules.find((s) => s.id === formMyScheduleId)
    const targetSch = schedules.find((s) => s.id === formTargetScheduleId)

    if (!mySch || !targetSch) {
      setFormError("Data jadwal tidak valid.")
      return
    }

    const newSwap: ShiftSwapRequest = {
      id: `swap-${Date.now()}`,
      requesterId: currentEmp.id,
      targetId: formTargetEmpId,
      requesterDate: mySch.date,
      targetDate: targetSch.date,
      requesterShiftId: mySch.shiftId,
      targetShiftId: targetSch.shiftId,
      reason: formReason.trim(),
      departmentId: currentEmp.departmentId,
      peerStatus: "pending",
      supervisorStatus: "pending",
      createdAt: new Date().toISOString(),
    }

    setSwaps((prev) => [newSwap, ...prev])
    setIsModalOpen(false)
    setFormMyScheduleId("")
    setFormTargetEmpId("")
    setFormTargetScheduleId("")
    setFormReason("")
    setFormError("")
    setActiveTab("outgoing")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Tukar Shift (Swap)</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Pengajuan dan konfirmasi tukar dinas dengan rekan se-ruangan di Unit {dept?.name}
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-semibold text-xs rounded-xl shadow-md shadow-emerald-200 dark:shadow-none transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Ajukan Tukar Shift
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-800 gap-6">
        <button
          onClick={() => setActiveTab("incoming")}
          className={`pb-3 text-sm font-semibold relative transition-colors ${
            activeTab === "incoming" ? "text-emerald-600 dark:text-emerald-400" : "text-gray-400 hover:text-gray-600"
          }`}
        >
          Permohonan Masuk
          {incomingSwaps.filter((s) => s.peerStatus === "pending").length > 0 && (
            <span className="ml-2 px-2 py-0.5 text-[10px] rounded-full bg-amber-500 text-white">
              {incomingSwaps.filter((s) => s.peerStatus === "pending").length}
            </span>
          )}
          {activeTab === "incoming" && (
            <span className="absolute bottom-0 inset-x-0 h-0.5 bg-emerald-600 dark:bg-emerald-400 rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab("outgoing")}
          className={`pb-3 text-sm font-semibold relative transition-colors ${
            activeTab === "outgoing" ? "text-emerald-600 dark:text-emerald-400" : "text-gray-400 hover:text-gray-600"
          }`}
        >
          Pengajuan Saya ({outgoingSwaps.length})
          {activeTab === "outgoing" && (
            <span className="absolute bottom-0 inset-x-0 h-0.5 bg-emerald-600 dark:bg-emerald-400 rounded-full" />
          )}
        </button>
      </div>

      {/* Content */}
      {activeTab === "incoming" ? (
        <div className="space-y-3">
          {incomingSwaps.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 space-y-2">
              <ArrowLeftRight className="h-10 w-10 text-gray-300 mx-auto" />
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Tidak ada permohonan masuk</p>
              <p className="text-xs text-gray-400">Belum ada rekan kerja yang mengajukan tukar dinas dengan Anda.</p>
            </div>
          ) : (
            incomingSwaps.map((swap) => {
              const reqEmp = employees.find((e) => e.id === swap.requesterId)
              const reqShift = shifts.find((sh) => sh.id === swap.requesterShiftId) || shifts[0]
              const targetShift = shifts.find((sh) => sh.id === swap.targetShiftId) || shifts[0]

              return (
                <div
                  key={swap.id}
                  className="p-5 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-xs font-bold">
                        {reqEmp?.name?.charAt(0) ?? "R"}
                      </div>
                      <span className="font-bold text-sm text-gray-900 dark:text-gray-100">
                        {reqEmp?.name}
                      </span>
                      <span className="text-xs text-gray-400 font-mono">({reqEmp?.nip})</span>
                    </div>

                    <div className="text-xs text-gray-600 dark:text-gray-300 grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 bg-gray-50 dark:bg-gray-800/40 rounded-2xl border border-gray-100 dark:border-gray-800">
                      <div>
                        <span className="text-gray-400 block text-[10px]">JADWAL ANDA DITUKAR:</span>
                        <strong className="text-gray-900 dark:text-gray-100">{swap.targetDate}</strong> · {targetShift.name}
                      </div>
                      <div>
                        <span className="text-gray-400 block text-[10px]">JADWAL PENGGANTI REKAN:</span>
                        <strong className="text-gray-900 dark:text-gray-100">{swap.requesterDate}</strong> · {reqShift.name}
                      </div>
                    </div>

                    <p className="text-xs text-gray-500 italic">"Alasan: {swap.reason}"</p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3 shrink-0">
                    {swap.peerStatus === "pending" ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleAction(swap.id, "approved")}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                          <Check className="h-4 w-4" /> Setujui Swap
                        </button>
                        <button
                          onClick={() => handleAction(swap.id, "rejected")}
                          className="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 text-gray-600 dark:text-gray-400 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                          <X className="h-4 w-4" /> Tolak
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-1 text-right">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                          swap.peerStatus === "approved" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        }`}>
                          {swap.peerStatus === "approved" ? "Anda Menyetujui" : "Anda Menolak"}
                        </span>
                        <p className="text-[10px] text-gray-400">
                          Status Supervisor: <strong>{swap.supervisorStatus}</strong>
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>
      ) : (
        /* Outgoing Swaps Tab */
        <div className="space-y-3">
          {outgoingSwaps.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 space-y-2">
              <ArrowLeftRight className="h-10 w-10 text-gray-300 mx-auto" />
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Belum ada pengajuan</p>
              <p className="text-xs text-gray-400">Anda belum pernah mengajukan permohonan tukar shift.</p>
            </div>
          ) : (
            outgoingSwaps.map((swap) => {
              const targetEmp = employees.find((e) => e.id === swap.targetId)
              const reqShift = shifts.find((sh) => sh.id === swap.requesterShiftId) || shifts[0]
              const targetShift = shifts.find((sh) => sh.id === swap.targetShiftId) || shifts[0]

              return (
                <div
                  key={swap.id}
                  className="p-5 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-500">
                      Kepada Rekan: <strong className="text-gray-900 dark:text-gray-100">{targetEmp?.name}</strong>
                    </span>
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        swap.peerStatus === "approved" ? "bg-green-100 text-green-700" : swap.peerStatus === "rejected" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                      }`}>
                        Persetujuan Rekan: {swap.peerStatus === "approved" ? "Disetujui" : swap.peerStatus === "rejected" ? "Ditolak" : "Menunggu"}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        swap.supervisorStatus === "approved" ? "bg-green-100 text-green-700" : swap.supervisorStatus === "rejected" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-600"
                      }`}>
                        Supervisor: {swap.supervisorStatus === "approved" ? "Disetujui" : swap.supervisorStatus === "rejected" ? "Ditolak" : "Menunggu"}
                      </span>
                    </div>
                  </div>

                  <div className="text-xs text-gray-600 dark:text-gray-300 grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 bg-gray-50 dark:bg-gray-800/40 rounded-2xl border border-gray-100 dark:border-gray-800">
                    <div>
                      <span className="text-gray-400 block text-[10px]">JADWAL SAYA:</span>
                      <strong>{swap.requesterDate}</strong> · {reqShift.name}
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px]">JADWAL REKAN DITUKAR:</span>
                      <strong>{swap.targetDate}</strong> · {targetShift.name}
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 italic">"Alasan: {swap.reason}"</p>
                </div>
              )
            })
          )}
        </div>
      )}

      {/* ── Modal Buat Swap ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />

          <div className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-lg border border-gray-200 dark:border-gray-700 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
              <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
                Formulir Tukar Shift Dinas
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            {formError && (
              <p className="p-2.5 rounded-xl bg-red-50 text-red-600 text-xs">{formError}</p>
            )}

            <form onSubmit={handleSubmitSwap} className="space-y-4">
              {/* 1. Pilih jadwal saya */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  1. Pilih Jadwal Dinas Anda yang Ingin Ditukar *
                </label>
                <div className="relative">
                  <select
                    value={formMyScheduleId}
                    onChange={(e) => setFormMyScheduleId(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 pr-8 appearance-none cursor-pointer"
                    required
                  >
                    <option value="">— Pilih Jadwal Anda —</option>
                    {mySchedules.map((sch) => {
                      const sh = shifts.find((item) => item.id === sch.shiftId)
                      return (
                        <option key={sch.id} value={sch.id}>
                          {sch.date} — {sh?.name} ({sh?.startTime} – {sh?.endTime})
                        </option>
                      )
                    })}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* 2. Pilih Rekan Se-ruangan */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  2. Pilih Rekan Kerja (Unit {dept?.name}) *
                </label>
                <div className="relative">
                  <select
                    value={formTargetEmpId}
                    onChange={(e) => {
                      setFormTargetEmpId(e.target.value)
                      setFormTargetScheduleId("")
                    }}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 pr-8 appearance-none cursor-pointer"
                    required
                  >
                    <option value="">— Pilih Rekan Kerja —</option>
                    {coworkers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.nip})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* 3. Pilih Jadwal Rekan yang Ingin Ditukar */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  3. Pilih Jadwal Dinas Rekan yang Anda Inginkan *
                </label>
                <div className="relative">
                  <select
                    value={formTargetScheduleId}
                    onChange={(e) => setFormTargetScheduleId(e.target.value)}
                    disabled={!formTargetEmpId}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 pr-8 appearance-none cursor-pointer disabled:opacity-50"
                    required
                  >
                    <option value="">— Pilih Jadwal Rekan —</option>
                    {targetCoworkerSchedules.map((sch) => {
                      const sh = shifts.find((item) => item.id === sch.shiftId)
                      return (
                        <option key={sch.id} value={sch.id}>
                          {sch.date} — {sh?.name} ({sh?.startTime} – {sh?.endTime})
                        </option>
                      )
                    })}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* 4. Alasan */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Alasan Penukaran Shift *
                </label>
                <textarea
                  rows={2}
                  value={formReason}
                  onChange={(e) => setFormReason(e.target.value)}
                  placeholder="Contoh: Keperluan keluarga, pemulihan pasca dinas malam..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2 text-xs font-semibold text-gray-600 bg-gray-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl"
                >
                  Kirim Permohonan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
