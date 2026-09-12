import { useState } from "react"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import {
  SEED_EMPLOYEES,
  SEED_DEPARTMENTS,
  SEED_SHIFTS,
  SEED_SCHEDULES,
  SEED_SWAPS,
} from "@/data/seed"
import type {
  Employee,
  Department,
  ShiftPattern,
  Schedule,
  ShiftSwapRequest,
  ApprovalStatus,
} from "@/types"
import {
  ArrowLeftRight,
  CheckCircle2,
  XCircle,
  Clock,
  UserCheck,
  Search,
  Filter,
  MessageSquare,
} from "lucide-react"

export const SupervisorSwapApprovalsPage = () => {
  const [userSession] = useLocalStorage<any>("user", {})
  const [employees] = useLocalStorage<Employee[]>("employees", SEED_EMPLOYEES)
  const [departments] = useLocalStorage<Department[]>("departments", SEED_DEPARTMENTS)
  const [shifts] = useLocalStorage<ShiftPattern[]>("shifts", SEED_SHIFTS)
  const [schedules, setSchedules] = useLocalStorage<Schedule[]>("schedules", SEED_SCHEDULES)
  const [swaps, setSwaps] = useLocalStorage<ShiftSwapRequest[]>("swaps", SEED_SWAPS)

  const currentSupervisor =
    employees.find((e) => e.id === userSession?.id || e.nip === userSession?.nip) || userSession
  const supervisorDeptId = currentSupervisor?.departmentId ?? "dept-1"
  const currentDept = departments.find((d) => d.id === supervisorDeptId)

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved" | "rejected">("all")
  const [selectedRequest, setSelectedRequest] = useState<ShiftSwapRequest | null>(null)
  const [actionNote, setActionNote] = useState("")
  const [actionModal, setActionModal] = useState<"approve" | "reject" | null>(null)

  // Filter requests that belong to this supervisor's department
  const unitSwapRequests = swaps.filter((req) => req.departmentId === supervisorDeptId)

  // Filter by search and status
  const filteredRequests = unitSwapRequests.filter((req) => {
    const requester = employees.find((e) => e.id === req.requesterId)
    const target = employees.find((e) => e.id === req.targetId)
    const reqName = requester?.name || ""
    const targetName = target?.name || ""

    const matchesSearch =
      reqName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      targetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.reason.toLowerCase().includes(searchTerm.toLowerCase())

    if (!matchesSearch) return false

    if (statusFilter === "all") return true
    if (statusFilter === "pending") return req.supervisorStatus === "pending"
    if (statusFilter === "approved") return req.supervisorStatus === "approved"
    if (statusFilter === "rejected") return req.supervisorStatus === "rejected"

    return true
  })

  const getShiftName = (shiftId: string) => {
    const s = shifts.find((item) => item.id === shiftId)
    return s ? `${s.name} (${s.startTime}-${s.endTime})` : "Sif"
  }

  const handleApprove = (request: ShiftSwapRequest) => {
    // 1. Update Shift Swap Request status
    const updatedSwaps = swaps.map((r) => {
      if (r.id === request.id) {
        return {
          ...r,
          supervisorStatus: "approved" as ApprovalStatus,
        }
      }
      return r
    })

    // 2. Perform actual swap in Schedules
    const updatedSchedules = [...schedules]

    const reqSchedIdx = updatedSchedules.findIndex(
      (s) => s.employeeId === request.requesterId && s.date === request.requesterDate
    )
    const targetSchedIdx = updatedSchedules.findIndex(
      (s) => s.employeeId === request.targetId && s.date === request.targetDate
    )

    if (reqSchedIdx >= 0 && targetSchedIdx >= 0) {
      const tempShiftId = updatedSchedules[reqSchedIdx].shiftId
      updatedSchedules[reqSchedIdx] = {
        ...updatedSchedules[reqSchedIdx],
        shiftId: updatedSchedules[targetSchedIdx].shiftId,
        status: "swapped",
      }
      updatedSchedules[targetSchedIdx] = {
        ...updatedSchedules[targetSchedIdx],
        shiftId: tempShiftId,
        status: "swapped",
      }
    } else if (reqSchedIdx >= 0) {
      updatedSchedules[reqSchedIdx] = {
        ...updatedSchedules[reqSchedIdx],
        shiftId: request.targetShiftId,
        status: "swapped",
      }
    }

    setSchedules(updatedSchedules)
    setSwaps(updatedSwaps)
    setActionModal(null)
    setSelectedRequest(null)
    setActionNote("")
  }

  const handleReject = (request: ShiftSwapRequest) => {
    const updatedSwaps = swaps.map((r) => {
      if (r.id === request.id) {
        return {
          ...r,
          supervisorStatus: "rejected" as ApprovalStatus,
        }
      }
      return r
    })

    setSwaps(updatedSwaps)
    setActionModal(null)
    setSelectedRequest(null)
    setActionNote("")
  }

  // Counts
  const pendingSupervisorCount = unitSwapRequests.filter(
    (r) => r.peerStatus === "approved" && r.supervisorStatus === "pending"
  ).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              {currentDept?.name || "Unit Ruangan"}
            </span>
            <span className="text-xs text-gray-500 font-medium">Operasional Sif</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
            Persetujuan Tukar Sif
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Validasi dan setujui permohonan pertukaran sif antar rekan kerja di unit Anda
          </p>
        </div>

        {pendingSupervisorCount > 0 && (
          <div className="flex items-center gap-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 px-4 py-2.5 rounded-xl">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-700 dark:text-amber-400 font-bold">
              {pendingSupervisorCount}
            </div>
            <div>
              <p className="text-xs font-bold text-amber-900 dark:text-amber-200">
                Menunggu Persetujuan
              </p>
              <p className="text-[11px] text-amber-700 dark:text-amber-400">
                Perlu tindakan supervisor
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama pemohon atau alasan..."
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
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium cursor-pointer"
          >
            <option value="all">Semua Status</option>
            <option value="pending">Menunggu Keputusan</option>
            <option value="approved">Disetujui</option>
            <option value="rejected">Ditolak</option>
          </select>
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-3">
        {filteredRequests.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-12 text-center shadow-sm">
            <ArrowLeftRight className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
            <p className="text-base font-semibold text-gray-800 dark:text-gray-200">
              Tidak ada pengajuan tukar sif
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Permohonan tukar sif dari staf di ruangan ini akan muncul di sini.
            </p>
          </div>
        ) : (
          filteredRequests.map((req) => {
            const requester = employees.find((e) => e.id === req.requesterId)
            const target = employees.find((e) => e.id === req.targetId)

            const isPeerApproved = req.peerStatus === "approved"
            const isPendingSupervisor = isPeerApproved && req.supervisorStatus === "pending"
            const isFinalApproved = req.supervisorStatus === "approved"
            const isFinalRejected = req.supervisorStatus === "rejected" || req.peerStatus === "rejected"

            return (
              <div
                key={req.id}
                className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left: Details */}
                  <div className="space-y-3 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                        {req.requesterDate}
                      </span>

                      {isFinalApproved ? (
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Disetujui Penuh
                        </span>
                      ) : isFinalRejected ? (
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 flex items-center gap-1">
                          <XCircle className="w-3 h-3" /> Ditolak
                        </span>
                      ) : (
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Menunggu Persetujuan Supervisor
                        </span>
                      )}

                      {isPeerApproved && (
                        <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 flex items-center gap-1">
                          <UserCheck className="w-3 h-3" /> Rekan Setuju
                        </span>
                      )}
                    </div>

                    {/* Swap Match Box */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-gray-50/70 dark:bg-gray-800/40 p-3 rounded-xl border border-gray-100 dark:border-gray-800">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold flex items-center justify-center text-xs">
                          A
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-900 dark:text-gray-100">
                            {requester?.name || "Pemohon"}
                          </p>
                          <p className="text-[11px] text-gray-500 dark:text-gray-400">
                            Sif Asal:{" "}
                            <span className="font-semibold text-gray-700 dark:text-gray-300">
                              {getShiftName(req.requesterShiftId)}
                            </span>{" "}
                            ({req.requesterDate})
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 font-bold flex items-center justify-center text-xs">
                          B
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-900 dark:text-gray-100">
                            {target?.name || "Target Pegawai"}
                          </p>
                          <p className="text-[11px] text-gray-500 dark:text-gray-400">
                            Sif Dituju:{" "}
                            <span className="font-semibold text-gray-700 dark:text-gray-300">
                              {getShiftName(req.targetShiftId)}
                            </span>{" "}
                            ({req.targetDate})
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Reason */}
                    <div className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-300">
                      <MessageSquare className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" />
                      <p>
                        <span className="font-semibold text-gray-700 dark:text-gray-200">
                          Alasan:
                        </span>{" "}
                        {req.reason}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  {isPendingSupervisor && (
                    <div className="flex sm:flex-col lg:flex-row gap-2 items-center justify-end border-t lg:border-t-0 pt-3 lg:pt-0">
                      <button
                        onClick={() => {
                          setSelectedRequest(req)
                          setActionModal("approve")
                        }}
                        className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition-colors shadow-xs cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Setujui Sif
                      </button>
                      <button
                        onClick={() => {
                          setSelectedRequest(req)
                          setActionModal("reject")
                        }}
                        className="flex items-center gap-1.5 px-4 py-2 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                      >
                        <XCircle className="w-4 h-4" />
                        Tolak
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Action Modal */}
      {actionModal && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-md w-full p-6 shadow-xl border border-gray-100 dark:border-gray-800 space-y-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
              {actionModal === "approve"
                ? "Konfirmasi Persetujuan Tukar Sif"
                : "Tolak Permohonan Tukar Sif"}
            </h3>

            <p className="text-xs text-gray-600 dark:text-gray-300">
              {actionModal === "approve"
                ? `Setujui pertukaran sif ini? Jadwal kedua staf pada roster unit akan otomatis tertukar.`
                : `Apakah Anda yakin ingin menolak permohonan tukar sif ini?`}
            </p>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Catatan Tambahan (Opsional)
              </label>
              <textarea
                value={actionNote}
                onChange={(e) => setActionNote(e.target.value)}
                placeholder="Berikan catatan atau instruksi jika ada..."
                className="w-full text-xs p-3 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 h-20"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  setActionModal(null)
                  setSelectedRequest(null)
                  setActionNote("")
                }}
                className="px-4 py-2 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  if (actionModal === "approve") {
                    handleApprove(selectedRequest)
                  } else {
                    handleReject(selectedRequest)
                  }
                }}
                className={`px-4 py-2 text-xs font-semibold text-white rounded-xl transition-colors shadow-xs cursor-pointer ${
                  actionModal === "approve"
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "bg-rose-600 hover:bg-rose-700"
                }`}
              >
                {actionModal === "approve" ? "Ya, Setujui & Tukar" : "Ya, Tolak Permohonan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
