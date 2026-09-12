import { useState, useMemo } from "react"
import {
  Users, Plus, Search, Pencil, Trash2, X, Check,
  ChevronDown, Phone, Mail, Calendar, AlertTriangle,
  BadgeCheck, Copy, CheckCheck, KeyRound, LockKeyhole,
  Eye, EyeOff, ShieldAlert,
} from "lucide-react"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import { SEED_EMPLOYEES, SEED_DEPARTMENTS } from "@/data/seed"
import { POSISI_OPTIONS, JABATAN_OPTIONS } from "@/data/options"
import type { Employee, Role } from "@/types"

// ─── Constants ────────────────────────────────────────────────────────────────

const DEFAULT_PASSWORD = "RS-2026"

const ROLE_OPTIONS: { value: Role; label: string }[] = [
  { value: "admin",      label: "Admin HRD (Full Access)" },
  { value: "hrd",        label: "Staf HRD" },
  { value: "supervisor", label: "Supervisor / Kepala Ruangan" },
  { value: "employee",   label: "Pegawai" },
]

const ROLE_BADGE: Record<Role, string> = {
  admin:      "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  hrd:        "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
  supervisor: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  employee:   "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
}

const ROLE_LABEL: Record<Role, string> = {
  admin: "Admin HRD", hrd: "Staf HRD", supervisor: "Supervisor", employee: "Pegawai",
}

const EMPTY_FORM: Omit<Employee, "id" | "password" | "isFirstLogin" | "usedLeave"> = {
  nip: "", name: "", email: "", posisi: "", jabatan: "", departmentId: "",
  role: "employee", annualLeaveQuota: 12, phone: "",
  joinDate: new Date().toISOString().split("T")[0], isActive: true,
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const Badge = ({ role }: { role: Role }) => (
  <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${ROLE_BADGE[role]}`}>
    {ROLE_LABEL[role]}
  </span>
)

const Avatar = ({ name }: { name: string }) => {
  const initials = name.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase()
  const colors = ["from-blue-500 to-blue-600", "from-violet-500 to-purple-600",
    "from-emerald-500 to-green-600", "from-orange-500 to-amber-600",
    "from-pink-500 to-rose-600", "from-cyan-500 to-teal-600"]
  const color = colors[(name.charCodeAt(0) || 0) % colors.length]
  return (
    <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white text-sm font-semibold shrink-0`}>
      {initials || "?"}
    </div>
  )
}

// ─── Credential Dialog (shown after Add) ─────────────────────────────────────

const CredentialDialog = ({ nip, name, onClose }: { nip: string; name: string; onClose: () => void }) => {
  const [copied, setCopied] = useState<"nip" | "pass" | null>(null)

  const copy = (text: string, type: "nip" | "pass") => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(type)
      setTimeout(() => setCopied(null), 2000)
    })
  }

  const CopyBtn = ({ text, type }: { text: string; type: "nip" | "pass" }) => (
    <button onClick={() => copy(text, type)}
      className="ml-2 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
      {copied === type ? <CheckCheck className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 mx-auto mb-4">
          <KeyRound className="h-6 w-6 text-green-500" />
        </div>
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 text-center mb-1">
          Akun Berhasil Dibuat!
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-5">
          Sampaikan kredensial berikut kepada <strong className="text-gray-900 dark:text-gray-100">{name}</strong>:
        </p>

        {/* Credentials */}
        <div className="space-y-3 mb-5">
          <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <div>
              <p className="text-xs text-gray-400 mb-0.5">NIP (untuk login)</p>
              <p className="font-mono font-semibold text-gray-900 dark:text-gray-100">{nip}</p>
            </div>
            <CopyBtn text={nip} type="nip" />
          </div>
          <div className="flex items-center justify-between px-4 py-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-700">
            <div>
              <p className="text-xs text-amber-600 dark:text-amber-400 mb-0.5">Password Default</p>
              <p className="font-mono font-semibold text-amber-800 dark:text-amber-300">{DEFAULT_PASSWORD}</p>
            </div>
            <CopyBtn text={DEFAULT_PASSWORD} type="pass" />
          </div>
        </div>

        <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800 mb-4">
          <span className="text-blue-500 text-sm shrink-0">ℹ</span>
          <p className="text-xs text-blue-700 dark:text-blue-400">
            Pegawai <strong>wajib mengganti password</strong> saat login pertama kali.
          </p>
        </div>

        <button onClick={onClose}
          className="w-full py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 rounded-xl transition-all">
          Tutup
        </button>
      </div>
    </div>
  )
}

// ─── Change My Password Modal ────────────────────────────────────────────────

const getStrength = (p: string) => {
  let s = 0
  if (p.length >= 8) s++
  if (/[A-Z]/.test(p)) s++
  if (/[0-9]/.test(p)) s++
  if (/[^A-Za-z0-9]/.test(p)) s++
  return s
}
const STRENGTH_LABELS = ["Lemah", "Cukup", "Baik", "Kuat"]
const STRENGTH_COLORS = ["bg-red-400", "bg-orange-400", "bg-blue-400", "bg-green-500"]
const STRENGTH_TEXT   = ["text-red-500", "text-orange-500", "text-blue-500", "text-green-600"]

const ChangeMyPasswordModal = ({ onSave, onClose }: {
  onSave: (currentPw: string, newPw: string) => string | null
  onClose: () => void
}) => {
  const [currentPw, setCurrentPw] = useState("")
  const [newPw,     setNewPw]     = useState("")
  const [confirmPw, setConfirmPw] = useState("")
  const [showCur,   setShowCur]   = useState(false)
  const [showNew,   setShowNew]   = useState(false)
  const [showConf,  setShowConf]  = useState(false)
  const [error,     setError]     = useState("")
  const [success,   setSuccess]   = useState(false)

  const strength = getStrength(newPw)
  const match = confirmPw.length > 0 && newPw === confirmPw

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (newPw.length < 8) { setError("Password minimal 8 karakter."); return }
    if (newPw !== confirmPw) { setError("Konfirmasi password tidak cocok."); return }
    if (newPw === DEFAULT_PASSWORD) { setError("Password baru tidak boleh sama dengan password default."); return }
    const err = onSave(currentPw, newPw)
    if (err) { setError(err); return }
    setSuccess(true)
    setTimeout(onClose, 1200)
  }

  const inputBase = "w-full px-3 py-2.5 pl-10 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <LockKeyhole className="h-4 w-4 text-blue-500" />
            <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">Ubah Password Saya</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors"><X className="h-4 w-4" /></button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {success ? (
            <div className="text-center py-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 mb-3">
                <Check className="h-6 w-6 text-green-500" />
              </div>
              <p className="font-semibold text-gray-900 dark:text-gray-100">Password berhasil diubah!</p>
            </div>
          ) : (
            <>
              {error && (
                <div className="flex items-start gap-2 px-3 py-2.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-600 dark:text-red-400">
                  <span className="shrink-0">⚠</span>{error}
                </div>
              )}

              {/* Current password */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">Password Saat Ini *</label>
                <div className="relative">
                  <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  <input type={showCur ? "text" : "password"} placeholder="Password lama" value={currentPw}
                    onChange={e => setCurrentPw(e.target.value)} required
                    className={`${inputBase} pr-10`} />
                  <button type="button" onClick={() => setShowCur(s => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                    {showCur ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* New password */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">Password Baru *</label>
                <div className="relative">
                  <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  <input type={showNew ? "text" : "password"} placeholder="Minimal 8 karakter" value={newPw}
                    onChange={e => setNewPw(e.target.value)} required
                    className={`${inputBase} pr-10`} />
                  <button type="button" onClick={() => setShowNew(s => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                    {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {newPw.length > 0 && (
                  <div className="mt-2 space-y-1">
                    <div className="flex gap-1">
                      {[1,2,3,4].map(lvl => (
                        <div key={lvl} className={`flex-1 h-1.5 rounded-full transition-colors ${strength >= lvl ? STRENGTH_COLORS[strength-1] : "bg-gray-100 dark:bg-gray-800"}`} />
                      ))}
                    </div>
                    <p className={`text-xs font-medium ${STRENGTH_TEXT[strength-1] ?? ""}`}>
                      Kekuatan: {STRENGTH_LABELS[strength-1] ?? ""}
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">Konfirmasi Password *</label>
                <div className="relative">
                  <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  <input type={showConf ? "text" : "password"} placeholder="Ulangi password baru" value={confirmPw}
                    onChange={e => setConfirmPw(e.target.value)} required
                    className={`${inputBase} pr-10 ${confirmPw.length > 0 ? match ? "border-green-400" : "border-red-400" : ""}`} />
                  <button type="button" onClick={() => setShowConf(s => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                    {showConf ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {confirmPw.length > 0 && !match && <p className="text-xs text-red-500 mt-1">Password tidak cocok</p>}
              </div>

              <div className="flex gap-3 pt-1">
                <button type="button" onClick={onClose}
                  className="flex-1 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-colors">
                  Batal
                </button>
                <button type="submit" disabled={!currentPw || !match || newPw.length < 8}
                  className="flex-1 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 disabled:from-blue-300 disabled:to-blue-300 dark:disabled:from-blue-900 dark:disabled:to-blue-900 rounded-xl transition-all flex items-center justify-center gap-2 disabled:cursor-not-allowed">
                  <LockKeyhole className="h-3.5 w-3.5" />
                  Simpan Password
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  )
}

// ─── Employee Modal (Add / Edit) ─────────────────────────────────────────────

type FormData = Omit<Employee, "id" | "password" | "isFirstLogin" | "usedLeave">

const inputCls = "w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-700 focus:border-blue-400 transition-all"
const labelCls = "block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5"

const FieldSelect = ({ label, value, options, onChange, error }: {
  label: string; value: string
  options: readonly { value: string; label: string }[]
  onChange: (v: string) => void; error?: string
}) => (
  <div>
    <label className={labelCls}>{label}</label>
    <div className="relative">
      <select value={value} onChange={e => onChange(e.target.value)}
        className={`${inputCls} pr-8 appearance-none cursor-pointer ${error ? "border-red-400" : ""}`}>
        <option value="">— Pilih —</option>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
    </div>
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
)

interface ModalProps {
  mode: "add" | "edit"
  form: FormData
  departments: { id: string; name: string }[]
  onChange: (field: keyof FormData, value: string | number | boolean) => void
  onSave: () => void
  onClose: () => void
  errors: Partial<Record<keyof Employee, string>>
}

const EmployeeModal = ({ mode, form, departments, onChange, onSave, onClose, errors }: ModalProps) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
    <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 sticky top-0 bg-white dark:bg-gray-900 z-10">
        <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
          {mode === "add" ? "Tambah Pegawai Baru" : "Edit Data Pegawai"}
        </h2>
        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="px-6 py-5 space-y-4">
        {/* NIP */}
        <div>
          <label className={labelCls}>NIP (Nomor Induk Pegawai) *</label>
          <div className="relative">
            <BadgeCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            <input className={`${inputCls} pl-10 font-mono ${errors.nip ? "border-red-400" : ""}`}
              placeholder="contoh: IGD-2024-001"
              value={form.nip} onChange={e => onChange("nip", e.target.value.toUpperCase())} />
          </div>
          {errors.nip && <p className="text-xs text-red-500 mt-1">{errors.nip}</p>}
          {mode === "add" && (
            <p className="text-xs text-gray-400 mt-1">
              Format bebas, contoh: IGD-2024-001 atau P20240001. Digunakan sebagai username login.
            </p>
          )}
        </div>

        {/* Name */}
        <div>
          <label className={labelCls}>Nama Lengkap *</label>
          <input className={`${inputCls} ${errors.name ? "border-red-400" : ""}`}
            placeholder="contoh: Budi Santoso"
            value={form.name} onChange={e => onChange("name", e.target.value)} />
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
        </div>

        {/* Email + Phone */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
              <input type="email" className={`${inputCls} pl-9`} placeholder="email@rs.com"
                value={form.email} onChange={e => onChange("email", e.target.value)} />
            </div>
          </div>
          <div>
            <label className={labelCls}>No. Telepon</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
              <input type="tel" className={`${inputCls} pl-9`} placeholder="08xxxxxxxxxx"
                value={form.phone ?? ""} onChange={e => onChange("phone", e.target.value)} />
            </div>
          </div>
        </div>

        {/* Posisi + Jabatan */}
        <div className="grid grid-cols-2 gap-3">
          <FieldSelect label="Posisi Fungsional *" value={form.posisi} options={POSISI_OPTIONS}
            onChange={v => onChange("posisi", v)} error={errors.posisi} />
          <FieldSelect label="Jabatan Struktural *" value={form.jabatan} options={JABATAN_OPTIONS}
            onChange={v => onChange("jabatan", v)} error={errors.jabatan} />
        </div>

        {/* Dept + Role */}
        <div className="grid grid-cols-2 gap-3">
          <FieldSelect label="Departemen *" value={form.departmentId}
            options={departments.map(d => ({ value: d.id, label: d.name }))}
            onChange={v => onChange("departmentId", v)} error={errors.departmentId} />
          <FieldSelect label="Role Sistem *" value={form.role} options={ROLE_OPTIONS}
            onChange={v => onChange("role", v as Role)} />
        </div>

        {/* Join Date + Leave Quota */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Tanggal Bergabung</label>
            <input type="date" className={inputCls}
              value={form.joinDate} onChange={e => onChange("joinDate", e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Jatah Cuti (hari/tahun)</label>
            <input type="number" min={0} max={30} className={inputCls}
              value={form.annualLeaveQuota} onChange={e => onChange("annualLeaveQuota", Number(e.target.value))} />
          </div>
        </div>

        {/* Default password notice (add mode only) */}
        {mode === "add" && (
          <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-700">
            <KeyRound className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-amber-700 dark:text-amber-400">Password Default: <span className="font-mono">{DEFAULT_PASSWORD}</span></p>
              <p className="text-xs text-amber-600 dark:text-amber-500 mt-0.5">
                Pegawai wajib mengganti saat login pertama. Anda bisa melihat kredensial lengkap setelah menyimpan.
              </p>
            </div>
          </div>
        )}

        {/* Status toggle */}
        <div className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <button type="button" onClick={() => onChange("isActive", !form.isActive)}
            className={`relative inline-flex h-5 w-9 rounded-full transition-colors duration-200 ${form.isActive ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"}`}>
            <span className={`inline-block h-4 w-4 mt-0.5 rounded-full bg-white shadow transition-transform duration-200 ${form.isActive ? "translate-x-4" : "translate-x-0.5"}`} />
          </button>
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{form.isActive ? "Pegawai Aktif" : "Pegawai Nonaktif"}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{form.isActive ? "Dapat login dan muncul di jadwal" : "Tidak dapat login dan disembunyikan"}</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex gap-3 px-6 py-4 border-t border-gray-100 dark:border-gray-800 sticky bottom-0 bg-white dark:bg-gray-900">
        <button onClick={onClose}
          className="flex-1 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-colors">
          Batal
        </button>
        <button onClick={onSave}
          className="flex-1 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 rounded-xl transition-all shadow-md shadow-blue-200 dark:shadow-none flex items-center justify-center gap-2">
          <Check className="h-4 w-4" />
          {mode === "add" ? "Tambah Pegawai" : "Simpan Perubahan"}
        </button>
      </div>
    </div>
  </div>
)

// ─── Delete Confirm ───────────────────────────────────────────────────────────

const DeleteConfirm = ({ name, onConfirm, onClose }: { name: string; onConfirm: () => void; onClose: () => void }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
    <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 mx-auto mb-4">
        <AlertTriangle className="h-6 w-6 text-red-500" />
      </div>
      <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 text-center mb-2">Hapus Pegawai?</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
        Data <strong className="text-gray-900 dark:text-gray-100">{name}</strong> akan dihapus permanen.
      </p>
      <div className="flex gap-3">
        <button onClick={onClose} className="flex-1 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 rounded-xl transition-colors">Batal</button>
        <button onClick={onConfirm} className="flex-1 py-2 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors">Ya, Hapus</button>
      </div>
    </div>
  </div>
)

// ─── Reset Password Confirm ───────────────────────────────────────────────────

const ResetPasswordConfirm = ({ name, onConfirm, onClose }: { name: string; onConfirm: () => void; onClose: () => void }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
    <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 mx-auto mb-4">
        <KeyRound className="h-6 w-6 text-amber-500" />
      </div>
      <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 text-center mb-2">Reset Password?</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-2">
        Password <strong className="text-gray-900 dark:text-gray-100">{name}</strong> akan dikembalikan ke password default:
      </p>
      <p className="text-center font-mono font-bold text-amber-600 dark:text-amber-400 text-lg mb-5">{DEFAULT_PASSWORD}</p>
      <div className="flex gap-3">
        <button onClick={onClose} className="flex-1 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 rounded-xl transition-colors">Batal</button>
        <button onClick={onConfirm} className="flex-1 py-2 text-sm font-semibold text-white bg-amber-500 hover:bg-amber-600 rounded-xl transition-colors">Reset Password</button>
      </div>
    </div>
  </div>
)

// ─── Main Page ────────────────────────────────────────────────────────────────

const EmployeesPage = () => {
  const [employees, setEmployees] = useLocalStorage("employees", SEED_EMPLOYEES)
  const [departments]             = useLocalStorage("departments", SEED_DEPARTMENTS)

  const [search,     setSearch]     = useState("")
  const [filterDept, setFilterDept] = useState("")
  const [filterRole, setFilterRole] = useState("")
  const [modal,      setModal]      = useState<{ open: boolean; mode: "add" | "edit"; id?: string }>({ open: false, mode: "add" })
  const [form,       setForm]       = useState<FormData>(EMPTY_FORM)
  const [errors,     setErrors]     = useState<Partial<Record<keyof Employee, string>>>({})
  const [deleteTarget,     setDeleteTarget]     = useState<Employee | null>(null)
  const [resetTarget,      setResetTarget]      = useState<Employee | null>(null)
  const [credential,       setCredential]       = useState<{ nip: string; name: string } | null>(null)
  const [changePwOpen,     setChangePwOpen]     = useState(false)

  // Ambil user yang sedang login dari session
  const currentUser = (() => {
    try { return JSON.parse(localStorage.getItem("user") ?? "{}") } catch { return {} }
  })()

  // Guard: cegah hapus jika ini satu-satunya admin
  const isLastAdmin = (emp: Employee) =>
    emp.role === "admin" && employees.filter(e => e.role === "admin" && e.isActive).length === 1

  const filtered = useMemo(() => employees.filter(emp => {
    const q = search.toLowerCase()
    const matchSearch = !q || emp.name.toLowerCase().includes(q) || emp.nip.toLowerCase().includes(q) || emp.email.toLowerCase().includes(q)
    const matchDept = !filterDept || emp.departmentId === filterDept
    const matchRole = !filterRole || emp.role === filterRole
    return matchSearch && matchDept && matchRole
  }), [employees, search, filterDept, filterRole])

  const getDeptName   = (id: string) => departments.find(d => d.id === id)?.name ?? "—"
  const getPosisiLabel = (v: string) => POSISI_OPTIONS.find(o => o.value === v)?.label ?? v

  const validate = (f: FormData, currentId?: string) => {
    const e: Partial<Record<keyof Employee, string>> = {}
    if (!f.nip.trim())  e.nip  = "NIP wajib diisi"
    else if (employees.some(emp => emp.nip === f.nip && emp.id !== currentId))
      e.nip = "NIP sudah digunakan pegawai lain"
    if (!f.name.trim()) e.name = "Nama wajib diisi"
    if (!f.posisi)      e.posisi = "Pilih posisi"
    if (!f.jabatan)     e.jabatan = "Pilih jabatan"
    if (!f.departmentId) e.departmentId = "Pilih departemen"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const openAdd  = () => { setForm(EMPTY_FORM); setErrors({}); setModal({ open: true, mode: "add" }) }
  const openEdit = (emp: Employee) => {
    const { id: _id, password: _pw, isFirstLogin: _fl, usedLeave: _ul, ...rest } = emp
    setForm(rest); setErrors({}); setModal({ open: true, mode: "edit", id: emp.id })
  }

  const handleSave = () => {
    if (!validate(form, modal.id)) return
    if (modal.mode === "add") {
      const newEmp: Employee = {
        ...form, id: `emp-${Date.now()}`, usedLeave: 0,
        password: DEFAULT_PASSWORD, isFirstLogin: true,
      }
      setEmployees(prev => [...prev, newEmp])
      setModal({ open: false, mode: "add" })
      setCredential({ nip: form.nip, name: form.name })
    } else {
      setEmployees(prev => prev.map(e =>
        e.id === modal.id
          ? { ...e, ...form }
          : e
      ))
      setModal({ open: false, mode: "add" })
    }
  }

  const handleDelete = () => {
    if (!deleteTarget) return
    setEmployees(prev => prev.filter(e => e.id !== deleteTarget.id))
    setDeleteTarget(null)
  }

  const handleResetPassword = () => {
    if (!resetTarget) return
    setEmployees(prev => prev.map(e =>
      e.id === resetTarget.id ? { ...e, password: DEFAULT_PASSWORD, isFirstLogin: true } : e
    ))
    setResetTarget(null)
    setCredential({ nip: resetTarget.nip, name: resetTarget.name })
  }

  // Ubah password sendiri (verifikasi password lama dulu)
  const handleChangeMyPassword = (currentPw: string, newPw: string): string | null => {
    const me = employees.find(e => e.id === currentUser.id)
    if (!me) return "Akun tidak ditemukan."
    if (me.password !== currentPw) return "Password saat ini salah."
    setEmployees(prev => prev.map(e => e.id === currentUser.id ? { ...e, password: newPw } : e))
    return null
  }

  const changeForm = (field: keyof FormData, value: string | number | boolean) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field as keyof Employee]) setErrors(prev => ({ ...prev, [field]: undefined }))
  }

  const stats = {
    total:      employees.length,
    active:     employees.filter(e => e.isActive).length,
    supervisor: employees.filter(e => e.role === "supervisor").length,
    firstLogin: employees.filter(e => e.isFirstLogin).length,
  }

  return (
    <div className="p-3 sm:p-6 space-y-5 max-w-screen-2xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">Data Pegawai</h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">Kelola akun dan data seluruh pegawai rumah sakit</p>
        </div>
        <button onClick={openAdd}
          className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white text-sm font-semibold rounded-xl shadow-md shadow-blue-200 dark:shadow-none transition-all active:scale-[0.98] shrink-0">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Tambah Pegawai</span>
          <span className="sm:hidden">Tambah</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Pegawai",   value: stats.total,      color: "text-blue-600 dark:text-blue-400",    bg: "bg-blue-50 dark:bg-blue-900/20" },
          { label: "Aktif",           value: stats.active,     color: "text-green-600 dark:text-green-400",  bg: "bg-green-50 dark:bg-green-900/20" },
          { label: "Supervisor",      value: stats.supervisor, color: "text-purple-600 dark:text-purple-400",bg: "bg-purple-50 dark:bg-purple-900/20" },
          { label: "Belum Aktivasi",  value: stats.firstLogin, color: "text-amber-600 dark:text-amber-400",  bg: "bg-amber-50 dark:bg-amber-900/20" },
        ].map(s => (
          <div key={s.label} className={`${s.bg} rounded-xl p-4 border border-gray-100 dark:border-gray-800`}>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input placeholder="Cari nama, NIP, atau email..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all" />
        </div>
        <div className="flex gap-2">
          {[
            { value: filterDept, setter: setFilterDept, options: departments.map(d => ({ value: d.id, label: d.name })), placeholder: "Semua Dept." },
            { value: filterRole, setter: setFilterRole, options: ROLE_OPTIONS, placeholder: "Semua Role" },
          ].map((f, i) => (
            <div key={i} className="relative flex-1">
              <select value={f.value} onChange={e => f.setter(e.target.value)}
                className="w-full pl-3 pr-8 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300 appearance-none cursor-pointer">
                <option value="">{f.placeholder}</option>
                {f.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
            </div>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-800">
                {["Pegawai & NIP", "Posisi", "Departemen", "Role", "Status Akun", "Cuti Sisa", "Aksi"].map(h => (
                  <th key={h} className={`px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide ${
                    h === "Aksi" ? "text-right" : "text-left"
                  } ${
                    h === "Posisi" || h === "Cuti Sisa" ? "hidden md:table-cell" : ""
                  } ${
                    h === "Departemen" ? "hidden lg:table-cell" : ""
                  }`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center">
                    <Users className="h-10 w-10 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">Tidak ada pegawai ditemukan</p>
                  </td>
                </tr>
              ) : filtered.map(emp => (
                <tr key={emp.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={emp.name} />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{emp.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="flex items-center gap-1 text-xs font-mono text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-1.5 py-0.5 rounded">
                            <BadgeCheck className="h-3 w-3" />{emp.nip}
                          </span>
                          {emp.email && (
                            <span className="flex items-center gap-1 text-xs text-gray-400">
                              <Mail className="h-3 w-3" />{emp.email}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-gray-900 dark:text-gray-100 text-sm">{getPosisiLabel(emp.posisi)}</p>
                    <p className="text-xs text-gray-400">{JABATAN_OPTIONS.find(j => j.value === emp.jabatan)?.label ?? emp.jabatan}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300 text-sm hidden lg:table-cell">{getDeptName(emp.departmentId)}</td>
                  <td className="px-4 py-3"><Badge role={emp.role} /></td>
                  <td className="px-4 py-3">
                    {emp.isFirstLogin ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                        Belum Aktivasi
                      </span>
                    ) : emp.isActive ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                        Aktif
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500 dark:bg-gray-800">
                        <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
                        Nonaktif
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-gray-400" />
                      <span className="font-medium text-gray-700 dark:text-gray-300">{emp.annualLeaveQuota - emp.usedLeave}</span>
                      <span className="text-xs text-gray-400">/ {emp.annualLeaveQuota}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEdit(emp)} title="Edit"
                        className="p-1.5 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                        <Pencil className="h-3.5 w-3.5" />
                      </button>

                      {/* Ubah password: diri sendiri → modal ganti password, orang lain → reset ke default */}
                      {emp.id === currentUser.id ? (
                        <button onClick={() => setChangePwOpen(true)} title="Ubah Password Saya"
                          className="p-1.5 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                          <LockKeyhole className="h-3.5 w-3.5" />
                        </button>
                      ) : (
                        <button onClick={() => setResetTarget(emp)} title="Reset Password ke Default"
                          className="p-1.5 rounded-lg text-gray-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors">
                          <KeyRound className="h-3.5 w-3.5" />
                        </button>
                      )}

                      {/* Hapus: disabled jika satu-satunya admin */}
                      {isLastAdmin(emp) ? (
                        <div className="relative group/tip">
                          <button disabled title=""
                            className="p-1.5 rounded-lg text-gray-300 dark:text-gray-700 cursor-not-allowed">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                          <div className="absolute bottom-full right-0 mb-1.5 w-44 px-2.5 py-1.5 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg opacity-0 group-hover/tip:opacity-100 transition-opacity pointer-events-none whitespace-normal z-10">
                            <ShieldAlert className="inline h-3 w-3 mr-1 text-amber-400" />
                            Tidak bisa dihapus — satu-satunya Admin HRD
                          </div>
                        </div>
                      ) : (
                        <button onClick={() => setDeleteTarget(emp)} title="Hapus"
                          className="p-1.5 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/30">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Menampilkan <strong>{filtered.length}</strong> dari <strong>{employees.length}</strong> pegawai
          </p>
        </div>
      </div>

      {/* Modals */}
      {modal.open && (
        <EmployeeModal mode={modal.mode} form={form} departments={departments}
          onChange={changeForm} onSave={handleSave}
          onClose={() => setModal({ open: false, mode: "add" })} errors={errors} />
      )}
      {deleteTarget  && <DeleteConfirm name={deleteTarget.name} onConfirm={handleDelete} onClose={() => setDeleteTarget(null)} />}
      {resetTarget   && <ResetPasswordConfirm name={resetTarget.name} onConfirm={handleResetPassword} onClose={() => setResetTarget(null)} />}
      {credential    && <CredentialDialog nip={credential.nip} name={credential.name} onClose={() => setCredential(null)} />}
      {changePwOpen  && <ChangeMyPasswordModal onSave={handleChangeMyPassword} onClose={() => setChangePwOpen(false)} />}
    </div>
  )
}

export { EmployeesPage }
