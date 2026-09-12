import { useState, useMemo } from "react"
import {
  FileText, Plus, Calendar, Clock, CheckCircle2,
  XCircle, Upload, X
} from "lucide-react"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import {
  SEED_EMPLOYEES, SEED_LEAVES, SEED_DEPARTMENTS
} from "@/data/seed"
import type { LeaveRequest, LeaveType } from "@/types"

export const EmployeeLeavesPage = () => {
  const [userSession] = useLocalStorage<any>("user", {})
  const [employees]   = useLocalStorage("employees",   SEED_EMPLOYEES)
  const [departments] = useLocalStorage("departments", SEED_DEPARTMENTS)
  const [leaves, setLeaves] = useLocalStorage<LeaveRequest[]>("leaves", SEED_LEAVES)

  const currentEmp = employees.find((e) => e.id === userSession?.id || e.nip === userSession?.nip) || employees[2]
  const dept = departments.find((d) => d.id === currentEmp?.departmentId)

  const [isModalOpen, setIsModalOpen] = useState(false)

  // Form State
  const [formType, setFormType]           = useState<LeaveType>("cuti")
  const [formStartDate, setFormStartDate] = useState("")
  const [formEndDate, setFormEndDate]     = useState("")
  const [formReason, setFormReason]       = useState("")
  const [formFile, setFormFile]           = useState<string | null>(null)
  const [formError, setFormError]         = useState("")

  // My leave requests
  const myLeaves = useMemo(() => {
    return leaves
      .filter((l) => l.employeeId === currentEmp?.id)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  }, [leaves, currentEmp])

  // Leave quota stats
  const totalQuota = currentEmp?.annualLeaveQuota ?? 12
  const usedQuota  = currentEmp?.usedLeave ?? 0
  const remaining  = totalQuota - usedQuota

  // Calculate days difference
  const calculatedDays = useMemo(() => {
    if (!formStartDate || !formEndDate) return 1
    const s = new Date(formStartDate)
    const e = new Date(formEndDate)
    const diffTime = e.getTime() - s.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
    return diffDays > 0 ? diffDays : 1
  }, [formStartDate, formEndDate])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormFile(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmitLeave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formStartDate || !formEndDate || !formReason.trim()) {
      setFormError("Harap lengkapi semua bidang yang wajib diisi.")
      return
    }

    if (formType === "cuti" && calculatedDays > remaining) {
      setFormError(`Sisa kuota cuti tahunan Anda tidak mencukupi (${remaining} hari tersisa).`)
      return
    }

    const newLeave: LeaveRequest = {
      id: `leave-${Date.now()}`,
      employeeId: currentEmp.id,
      supervisorId: dept?.supervisorId ?? "emp-2",
      departmentId: currentEmp.departmentId,
      type: formType,
      startDate: formStartDate,
      endDate: formEndDate,
      totalDays: calculatedDays,
      reason: formReason.trim(),
      attachmentBase64: formFile ?? undefined,
      status: "pending",
      createdAt: new Date().toISOString(),
    }

    setLeaves((prev) => [newLeave, ...prev])
    setIsModalOpen(false)
    setFormStartDate("")
    setFormEndDate("")
    setFormReason("")
    setFormFile(null)
    setFormError("")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Cuti & Izin</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Pengajuan cuti tahunan, izin keperluan, dan izin sakit
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-semibold text-xs rounded-xl shadow-md shadow-emerald-200 dark:shadow-none transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Ajukan Cuti / Izin
        </button>
      </div>

      {/* Quota Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="p-4 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xs flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xs text-gray-400">Total Kuota Tahunan</span>
            <p className="text-xl font-bold text-gray-900 dark:text-gray-100">{totalQuota} Hari</p>
          </div>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xs flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-900/30 text-amber-600">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xs text-gray-400">Cuti Terpakai</span>
            <p className="text-xl font-bold text-amber-600 dark:text-amber-400">{usedQuota} Hari</p>
          </div>
        </div>

        <div className="p-4 rounded-3xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 shadow-xs flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xs text-emerald-700 dark:text-emerald-300">Sisa Kuota Tersedia</span>
            <p className="text-xl font-bold text-emerald-900 dark:text-emerald-100">{remaining} Hari</p>
          </div>
        </div>
      </div>

      {/* History List */}
      <div className="space-y-3">
        <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100">Riwayat Pengajuan Saya</h3>

        {myLeaves.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 space-y-2">
            <FileText className="h-10 w-10 text-gray-300 mx-auto" />
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Belum ada pengajuan cuti</p>
            <p className="text-xs text-gray-400">Gunakan tombol "Ajukan Cuti / Izin" untuk membuat permohonan baru.</p>
          </div>
        ) : (
          myLeaves.map((leave) => {
            const typeLabel = leave.type === "cuti" ? "Cuti Tahunan" : leave.type === "sakit" ? "Izin Sakit" : "Izin Keperluan"

            return (
              <div
                key={leave.id}
                className="p-5 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      leave.type === "cuti" ? "bg-blue-100 text-blue-700" : leave.type === "sakit" ? "bg-red-100 text-red-700" : "bg-purple-100 text-purple-700"
                    }`}>
                      {typeLabel}
                    </span>
                    <span className="text-xs font-bold text-gray-900 dark:text-gray-100">
                      {leave.startDate} {leave.startDate !== leave.endDate ? `s/d ${leave.endDate}` : ""} ({leave.totalDays} hari)
                    </span>
                  </div>

                  <p className="text-xs text-gray-600 dark:text-gray-300">
                    Alasan: <strong className="text-gray-900 dark:text-gray-100">{leave.reason}</strong>
                  </p>

                  {leave.reviewNote && (
                    <p className="text-xs text-gray-400 italic">
                      Catatan Reviewer: "{leave.reviewNote}"
                    </p>
                  )}
                </div>

                <div className="self-end sm:self-center">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                    leave.status === "approved" ? "bg-green-100 text-green-700" : leave.status === "rejected" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                  }`}>
                    {leave.status === "approved" ? <CheckCircle2 className="h-3.5 w-3.5" /> : leave.status === "rejected" ? <XCircle className="h-3.5 w-3.5" /> : <Clock className="h-3.5 w-3.5" />}
                    {leave.status === "approved" ? "Disetujui" : leave.status === "rejected" ? "Ditolak" : "Menunggu Review"}
                  </span>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* ── Modal Form Pengajuan ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />

          <div className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-lg border border-gray-200 dark:border-gray-700 p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
              <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
                Formulir Pengajuan Cuti / Izin
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            {formError && (
              <p className="p-2.5 rounded-xl bg-red-50 text-red-600 text-xs">{formError}</p>
            )}

            <form onSubmit={handleSubmitLeave} className="space-y-4">
              {/* Jenis Pengajuan */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Jenis Pengajuan *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { type: "cuti" as LeaveType, label: "Cuti Tahunan" },
                    { type: "izin" as LeaveType, label: "Izin Pribadi" },
                    { type: "sakit" as LeaveType, label: "Izin Sakit" },
                  ].map((t) => (
                    <button
                      key={t.type}
                      type="button"
                      onClick={() => setFormType(t.type)}
                      className={`py-2 text-xs font-semibold rounded-xl border transition-all ${
                        formType === t.type
                          ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                          : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tanggal Mulai & Selesai */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Tanggal Mulai *
                  </label>
                  <input
                    type="date"
                    value={formStartDate}
                    onChange={(e) => setFormStartDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Tanggal Selesai *
                  </label>
                  <input
                    type="date"
                    value={formEndDate}
                    onChange={(e) => setFormEndDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
                    required
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-xs text-emerald-800 dark:text-emerald-300 flex justify-between items-center">
                <span>Total Durasi: <strong>{calculatedDays} Hari</strong></span>
                {formType === "cuti" && <span>Sisa Kuota: <strong>{remaining} Hari</strong></span>}
              </div>

              {/* Alasan */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Alasan / Keterangan *
                </label>
                <textarea
                  rows={3}
                  value={formReason}
                  onChange={(e) => setFormReason(e.target.value)}
                  placeholder="Jelaskan alasan pengajuan cuti atau izin..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
                  required
                />
              </div>

              {/* Upload Surat Dokter (khusus sakit) */}
              {formType === "sakit" && (
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Lampiran Surat Keterangan Dokter
                  </label>
                  <label className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <Upload className="h-6 w-6 text-gray-400 mb-1" />
                    <span className="text-xs text-gray-600 dark:text-gray-300">
                      {formFile ? "Foto surat dokter terlampir ✅" : "Pilih foto surat keterangan dokter (JPG/PNG)"}
                    </span>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
              )}

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
                  Kirim Pengajuan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
