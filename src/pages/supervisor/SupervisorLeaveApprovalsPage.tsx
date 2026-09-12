import { useState } from "react"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import {
  SEED_EMPLOYEES,
  SEED_DEPARTMENTS,
  SEED_LEAVES,
  SEED_SCHEDULES,
} from "@/data/seed"
import type {
  Employee,
  Department,
  LeaveRequest,
  Schedule,
  ApprovalStatus,
  LeaveType,
} from "@/types"
import {
  CalendarDays,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Filter,
  Eye,
  Paperclip,
  Check,
  X,
} from "lucide-react"

export const SupervisorLeaveApprovalsPage = () => {
  const [userSession] = useLocalStorage<any>("user", {})
  const [employees, setEmployees] = useLocalStorage<Employee[]>("employees", SEED_EMPLOYEES)
  const [departments] = useLocalStorage<Department[]>("departments", SEED_DEPARTMENTS)
  const [leaves, setLeaves] = useLocalStorage<LeaveRequest[]>("leaves", SEED_LEAVES)
  const [schedules, setSchedules] = useLocalStorage<Schedule[]>("schedules", SEED_SCHEDULES)

  const currentSupervisor =
    employees.find((e) => e.id === userSession?.id || e.nip === userSession?.nip) || userSession
  const supervisorDeptId = currentSupervisor?.departmentId ?? "dept-1"
  const currentDept = departments.find((d) => d.id === supervisorDeptId)

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved" | "rejected">("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [selectedLeave, setSelectedLeave] = useState<LeaveRequest | null>(null)
  const [previewAttachment, setPreviewAttachment] = useState<string | null>(null)
  const [actionNote, setActionNote] = useState("")
  const [actionModal, setActionModal] = useState<"approve" | "reject" | null>(null)

  // Filter leaves belonging to this supervisor's unit
  const unitLeaves = leaves.filter((l) => l.departmentId === supervisorDeptId)

  const filteredLeaves = unitLeaves.filter((l) => {
    const emp = employees.find((e) => e.id === l.employeeId)
    const empName = emp?.name || ""

    const matchesSearch =
      empName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.reason.toLowerCase().includes(searchTerm.toLowerCase())

    if (!matchesSearch) return false
    if (statusFilter !== "all" && l.status !== statusFilter) return false
    if (typeFilter !== "all" && l.type !== typeFilter) return false

    return true
  })

  const getLeaveTypeLabel = (type: LeaveType) => {
    if (type === "cuti") return "Cuti Tahunan"
    if (type === "sakit") return "Izin Sakit"
    return "Izin Pribadi"
  }

  const handleApprove = (leaveReq: LeaveRequest) => {
    // 1. Update Leave status
    const updatedLeaves = leaves.map((l) => {
      if (l.id === leaveReq.id) {
        return {
          ...l,
          status: "approved" as ApprovalStatus,
          reviewedAt: new Date().toISOString(),
          reviewNote: actionNote || undefined,
        }
      }
      return l
    })

    // 2. Update employee usedLeave quota if cuti
    if (leaveReq.type === "cuti") {
      const updatedEmployees = employees.map((emp) => {
        if (emp.id === leaveReq.employeeId) {
          return {
            ...emp,
            usedLeave: (emp.usedLeave || 0) + leaveReq.totalDays,
          }
        }
        return emp
      })
      setEmployees(updatedEmployees)
    }

    // 3. Mark schedule as leave for those dates
    const updatedSchedules = [...schedules]
    const start = new Date(leaveReq.startDate)
    const end = new Date(leaveReq.endDate)

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split("T")[0]
      const schedIdx = updatedSchedules.findIndex(
        (s) => s.employeeId === leaveReq.employeeId && s.date === dateStr
      )

      if (schedIdx >= 0) {
        updatedSchedules[schedIdx] = {
          ...updatedSchedules[schedIdx],
          status: "leave",
        }
      }
    }

    setSchedules(updatedSchedules)
    setLeaves(updatedLeaves)
    setActionModal(null)
    setSelectedLeave(null)
    setActionNote("")
  }

  const handleReject = (leaveReq: LeaveRequest) => {
    const updatedLeaves = leaves.map((l) => {
      if (l.id === leaveReq.id) {
        return {
          ...l,
          status: "rejected" as ApprovalStatus,
          reviewedAt: new Date().toISOString(),
          reviewNote: actionNote || "Ditolak oleh Supervisor Ruangan",
        }
      }
      return l
    })

    setLeaves(updatedLeaves)
    setActionModal(null)
    setSelectedLeave(null)
    setActionNote("")
  }

  const pendingLeavesCount = unitLeaves.filter((l) => l.status === "pending").length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              {currentDept?.name || "Unit Ruangan"}
            </span>
            <span className="text-xs text-gray-500 font-medium">Izin & Absensi Staf</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
            Persetujuan Cuti & Izin Sakit
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Tinjau, periksa bukti surat dokter, dan setujui permohonan staf ruangan
          </p>
        </div>

        {pendingLeavesCount > 0 && (
          <div className="flex items-center gap-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 px-4 py-2.5 rounded-xl">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-700 dark:text-amber-400 font-bold">
              {pendingLeavesCount}
            </div>
            <div>
              <p className="text-xs font-bold text-amber-900 dark:text-amber-200">
                Permohonan Menunggu
              </p>
              <p className="text-[11px] text-amber-700 dark:text-amber-400">
                Perlu ditindaklanjuti
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Filter Bar */}
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

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-xs text-gray-500 font-medium">Tipe:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium cursor-pointer"
            >
              <option value="all">Semua Tipe</option>
              <option value="cuti">Cuti Tahunan</option>
              <option value="sakit">Izin Sakit</option>
              <option value="izin">Izin Pribadi</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs text-gray-500 font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium cursor-pointer"
            >
              <option value="all">Semua Status</option>
              <option value="pending">Menunggu</option>
              <option value="approved">Disetujui</option>
              <option value="rejected">Ditolak</option>
            </select>
          </div>
        </div>
      </div>

      {/* Leaves Cards List */}
      <div className="space-y-3">
        {filteredLeaves.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-12 text-center shadow-sm">
            <CalendarDays className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
            <p className="text-base font-semibold text-gray-800 dark:text-gray-200">
              Tidak ada pengajuan cuti atau izin
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Pengajuan cuti dan izin dari staf di ruangan Anda akan muncul di sini.
            </p>
          </div>
        ) : (
          filteredLeaves.map((leave) => {
            const emp = employees.find((e) => e.id === leave.employeeId)
            const remainingQuota = (emp?.annualLeaveQuota || 12) - (emp?.usedLeave || 0)

            return (
              <div
                key={leave.id}
                className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left content */}
                  <div className="space-y-3 flex-1">
                    {/* User profile & status header */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold flex items-center justify-center text-xs shrink-0">
                          {emp?.name?.charAt(0) || "P"}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 dark:text-gray-100 text-sm">
                            {emp?.name || "Pegawai"}
                          </h4>
                          <p className="text-[11px] text-gray-400">
                            {emp?.posisi || emp?.jabatan || "Staf Medis"} • Sisa Jatah Cuti:{" "}
                            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                              {remainingQuota} hari
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                            leave.type === "sakit"
                              ? "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800"
                              : "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800"
                          }`}
                        >
                          {getLeaveTypeLabel(leave.type)}
                        </span>

                        {leave.status === "approved" ? (
                          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Disetujui
                          </span>
                        ) : leave.status === "rejected" ? (
                          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 flex items-center gap-1">
                            <XCircle className="w-3 h-3" /> Ditolak
                          </span>
                        ) : (
                          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Menunggu
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Date range and Duration Box */}
                    <div className="bg-gray-50/70 dark:bg-gray-800/40 p-3 rounded-xl border border-gray-100 dark:border-gray-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <CalendarDays className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span>
                          <strong className="text-gray-900 dark:text-gray-100">
                            {leave.startDate}
                          </strong>{" "}
                          s/d{" "}
                          <strong className="text-gray-900 dark:text-gray-100">
                            {leave.endDate}
                          </strong>
                        </span>
                      </div>
                      <div className="font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-100/70 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg">
                        Durasi: {leave.totalDays} Hari Kerja
                      </div>
                    </div>

                    {/* Reason */}
                    <div className="text-xs text-gray-600 dark:text-gray-300">
                      <span className="font-semibold text-gray-700 dark:text-gray-200">
                        Keterangan:
                      </span>{" "}
                      {leave.reason}
                    </div>

                    {/* Attachment / Doctor Note */}
                    {leave.attachmentBase64 && (
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => setPreviewAttachment(leave.attachmentBase64 || null)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                        >
                          <Paperclip className="w-3.5 h-3.5 text-gray-500" />
                          <span>Lihat Surat Dokter / Lampiran</span>
                          <Eye className="w-3.5 h-3.5 ml-1 text-gray-400" />
                        </button>
                      </div>
                    )}

                    {leave.reviewNote && (
                      <p className="text-xs text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 p-2 rounded-lg border border-rose-100 dark:border-rose-900/40">
                        <strong>Catatan Review:</strong> {leave.reviewNote}
                      </p>
                    )}
                  </div>

                  {/* Actions for Pending */}
                  {leave.status === "pending" && (
                    <div className="flex sm:flex-col lg:flex-row gap-2 items-center justify-end border-t lg:border-t-0 pt-3 lg:pt-0">
                      <button
                        onClick={() => {
                          setSelectedLeave(leave)
                          setActionModal("approve")
                        }}
                        className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition-colors shadow-xs cursor-pointer"
                      >
                        <Check className="w-4 h-4" />
                        Setujui Cuti
                      </button>
                      <button
                        onClick={() => {
                          setSelectedLeave(leave)
                          setActionModal("reject")
                        }}
                        className="flex items-center gap-1.5 px-4 py-2 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                      >
                        <X className="w-4 h-4" />
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

      {/* Document Attachment Preview Modal */}
      {previewAttachment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-lg w-full p-5 shadow-2xl border border-gray-100 dark:border-gray-800 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-800">
              <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm flex items-center gap-2">
                <Paperclip className="w-4 h-4 text-emerald-600" />
                Lampiran Dokumen / Surat Dokter
              </h3>
              <button
                onClick={() => setPreviewAttachment(null)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex items-center justify-center min-h-[250px]">
              <img
                src={previewAttachment}
                alt="Bukti Lampiran"
                className="max-h-[350px] w-auto object-contain"
              />
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setPreviewAttachment(null)}
                className="px-4 py-2 text-xs font-semibold bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl cursor-pointer"
              >
                Tutup Pratinjau
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Action Modal (Approve / Reject) */}
      {actionModal && selectedLeave && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-md w-full p-6 shadow-xl border border-gray-100 dark:border-gray-800 space-y-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
              {actionModal === "approve"
                ? "Konfirmasi Persetujuan Cuti"
                : "Tolak Pengajuan Cuti"}
            </h3>

            <p className="text-xs text-gray-600 dark:text-gray-300">
              {actionModal === "approve"
                ? `Setujui permohonan ${getLeaveTypeLabel(selectedLeave.type)} (${selectedLeave.totalDays} hari)? Jadwal kerja staf pada roster akan ditandai cuti/libur.`
                : `Apakah Anda yakin ingin menolak permohonan ini?`}
            </p>

            {actionModal === "reject" && (
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Alasan Penolakan <span className="text-rose-500">*</span>
                </label>
                <textarea
                  value={actionNote}
                  onChange={(e) => setActionNote(e.target.value)}
                  placeholder="Misal: Kuota staf yang bertugas pada tanggal tersebut kurang..."
                  className="w-full text-xs p-3 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 h-20"
                />
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  setActionModal(null)
                  setSelectedLeave(null)
                  setActionNote("")
                }}
                className="px-4 py-2 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  if (actionModal === "approve") {
                    handleApprove(selectedLeave)
                  } else {
                    handleReject(selectedLeave)
                  }
                }}
                className={`px-4 py-2 text-xs font-semibold text-white rounded-xl transition-colors shadow-xs cursor-pointer ${
                  actionModal === "approve"
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "bg-rose-600 hover:bg-rose-700"
                }`}
              >
                {actionModal === "approve" ? "Ya, Setujui Permohonan" : "Ya, Tolak Permohonan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
