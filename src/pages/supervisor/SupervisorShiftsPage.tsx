import { useState } from "react"
import { Clock, Plus, Pencil, Trash2, X, Check, AlertTriangle, Moon, Sun, Sunset } from "lucide-react"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import { SEED_SHIFTS } from "@/data/seed"
import type { ShiftPattern, ShiftColor } from "@/types"

// ─── Color Palette ────────────────────────────────────────────────────────────

const COLOR_OPTIONS: { value: ShiftColor; bg: string; text: string; ring: string; label: string }[] = [
  { value: "blue",    bg: "bg-blue-500",    text: "text-blue-700",    ring: "ring-blue-400",    label: "Biru" },
  { value: "indigo",  bg: "bg-indigo-500",  text: "text-indigo-700",  ring: "ring-indigo-400",  label: "Indigo" },
  { value: "violet",  bg: "bg-violet-500",  text: "text-violet-700",  ring: "ring-violet-400",  label: "Ungu" },
  { value: "green",   bg: "bg-green-500",   text: "text-green-700",   ring: "ring-green-400",   label: "Hijau" },
  { value: "emerald", bg: "bg-emerald-500", text: "text-emerald-700", ring: "ring-emerald-400", label: "Zamrud" },
  { value: "orange",  bg: "bg-orange-500",  text: "text-orange-700",  ring: "ring-orange-400",  label: "Oranye" },
  { value: "red",     bg: "bg-red-500",     text: "text-red-700",     ring: "ring-red-400",     label: "Merah" },
  { value: "pink",    bg: "bg-pink-500",    text: "text-pink-700",    ring: "ring-pink-400",    label: "Pink" },
  { value: "yellow",  bg: "bg-yellow-400",  text: "text-yellow-700",  ring: "ring-yellow-400",  label: "Kuning" },
  { value: "cyan",    bg: "bg-cyan-500",    text: "text-cyan-700",    ring: "ring-cyan-400",    label: "Cyan" },
]

const getColor = (c: ShiftColor) => COLOR_OPTIONS.find(o => o.value === c) ?? COLOR_OPTIONS[0]

// ─── Duration Calculator ──────────────────────────────────────────────────────

function calcDuration(start: string, end: string, overnight: boolean): number {
  if (!start || !end) return 0
  const [sh, sm] = start.split(":").map(Number)
  const [eh, em] = end.split(":").map(Number)
  let mins = (eh * 60 + em) - (sh * 60 + sm)
  if (overnight || mins <= 0) mins += 24 * 60
  return Math.round(mins / 60 * 10) / 10
}

// ─── Empty Form ───────────────────────────────────────────────────────────────

const EMPTY: Omit<ShiftPattern, "id"> = {
  name: "", startTime: "07:00", endTime: "15:00",
  color: "indigo", durationHours: 8, isOvernight: false,
}

// ─── Shift Card ───────────────────────────────────────────────────────────────

const ShiftCard = ({ shift, onEdit, onDelete }: {
  shift: ShiftPattern
  onEdit: () => void
  onDelete: () => void
}) => {
  const color = getColor(shift.color)
  const isOncall = shift.startTime === "00:00" && shift.endTime === "00:00"

  return (
    <div className={`relative group rounded-2xl border-2 border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 
      shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden`}>
      {/* Color stripe */}
      <div className={`h-2 w-full ${color.bg}`} />

      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${color.bg} bg-opacity-15 flex items-center justify-center shrink-0`}>
              {shift.isOvernight ? (
                <Moon className={`h-5 w-5 ${color.text}`} />
              ) : isOncall ? (
                <Sunset className={`h-5 w-5 ${color.text}`} />
              ) : (
                <Sun className={`h-5 w-5 ${color.text}`} />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-base leading-tight">{shift.name}</h3>
              <span className={`inline-block text-[11px] font-medium px-2 py-0.5 rounded-full mt-1 ${color.bg} bg-opacity-15 ${color.text}`}>
                {shift.durationHours} Jam Kerja
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={onEdit} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-gray-700 transition-colors" title="Edit">
              <Pencil className="h-4 w-4" />
            </button>
            <button onClick={onDelete} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 text-gray-400 hover:text-red-500 transition-colors" title="Hapus">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Time info */}
        <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-3 flex items-center justify-between">
          <div>
            <p className="text-[11px] text-gray-400 font-medium">JAM KERJA</p>
            <p className="text-sm font-bold text-gray-800 dark:text-gray-200 mt-0.5 font-mono">
              {shift.startTime} – {shift.endTime}
            </p>
          </div>
          {shift.isOvernight && (
            <span className="text-[10px] bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 font-medium px-2 py-1 rounded-lg">
              +1 Hari
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Shift Modal ──────────────────────────────────────────────────────────────

const ShiftModal = ({ mode, form, onChange, onSave, onClose, error }: {
  mode: "add" | "edit"
  form: Omit<ShiftPattern, "id">
  onChange: (partial: Partial<Omit<ShiftPattern, "id">>) => void
  onSave: () => void
  onClose: () => void
  error: string
}) => {
  const handleTimeChange = (field: "startTime" | "endTime", val: string) => {
    const duration = calcDuration(
      field === "startTime" ? val : form.startTime,
      field === "endTime" ? val : form.endTime,
      form.isOvernight
    )
    onChange({ [field]: val, durationHours: duration })
  }

  const handleOvernightToggle = (val: boolean) => {
    const duration = calcDuration(form.startTime, form.endTime, val)
    onChange({ isOvernight: val, durationHours: duration })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
              <Clock className="h-5 w-5" />
            </div>
            <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
              {mode === "add" ? "Tambah Pola Sif" : "Edit Pola Sif"}
            </h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-xs text-red-600 dark:text-red-400 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Nama Shift */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Nama Sif *</label>
            <input
              type="text"
              placeholder="Contoh: Sif Pagi, Sif Siang, IGD, Poli, ICU..."
              value={form.name}
              onChange={e => onChange({ name: e.target.value })}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all"
            />
          </div>

          {/* Jam Mulai & Selesai */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Jam Mulai *</label>
              <input
                type="time"
                value={form.startTime}
                onChange={e => handleTimeChange("startTime", e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-300 font-mono transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Jam Selesai *</label>
              <input
                type="time"
                value={form.endTime}
                onChange={e => handleTimeChange("endTime", e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-300 font-mono transition-all"
              />
            </div>
          </div>

          {/* Overnight & Durasi */}
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/60 rounded-xl">
            <div>
              <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">Sif Melewati Tengah Malam (+1 Hari)</p>
              <p className="text-[11px] text-gray-400">Aktifkan untuk dinas malam yang selesai keesokan paginya</p>
            </div>
            <button
              type="button"
              onClick={() => handleOvernightToggle(!form.isOvernight)}
              className={`relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ${
                form.isOvernight ? "bg-indigo-600" : "bg-gray-300 dark:bg-gray-700"
              }`}
            >
              <span className={`inline-block h-5 w-5 mt-0.5 rounded-full bg-white shadow transition-transform duration-200 ${
                form.isOvernight ? "translate-x-5" : "translate-x-0.5"
              }`} />
            </button>
          </div>

          {/* Durasi Terhitung */}
          <div className="flex items-center justify-between px-3 py-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl text-xs text-indigo-700 dark:text-indigo-300">
            <span>Estimasi Durasi Kerja:</span>
            <span className="font-bold text-sm font-mono">{form.durationHours} Jam</span>
          </div>

          {/* Pilihan Warna Label */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Warna Identitas Sif</label>
            <div className="grid grid-cols-5 gap-2">
              {COLOR_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onChange({ color: opt.value })}
                  className={`flex items-center gap-1.5 p-2 rounded-xl border text-xs font-medium transition-all ${
                    form.color === opt.value
                      ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold ring-2 ring-indigo-300"
                      : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
                  }`}
                >
                  <span className={`w-3 h-3 rounded-full ${opt.bg} shrink-0`} />
                  <span className="truncate">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 bg-gray-50 dark:bg-gray-800/60 border-t border-gray-100 dark:border-gray-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onSave}
            className="flex items-center gap-1.5 px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 shadow-md shadow-indigo-200 dark:shadow-none rounded-xl transition-all"
          >
            <Check className="h-4 w-4" />
            Simpan Sif
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Delete Confirm ───────────────────────────────────────────────────────────

const DeleteConfirm = ({ name, onConfirm, onClose }: { name: string; onConfirm: () => void; onClose: () => void }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
    <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 mx-auto mb-4">
        <AlertTriangle className="h-6 w-6 text-red-500" />
      </div>
      <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 text-center mb-2">Hapus Sif?</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
        Pola sif <strong className="text-gray-900 dark:text-gray-100">"{name}"</strong> akan dihapus. Roster jadwal yang menggunakan sif ini mungkin terpengaruh.
      </p>
      <div className="flex gap-3">
        <button onClick={onClose} className="flex-1 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 rounded-xl transition-colors">
          Batal
        </button>
        <button onClick={onConfirm} className="flex-1 py-2 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors">
          Hapus
        </button>
      </div>
    </div>
  </div>
)

// ─── Main Page ────────────────────────────────────────────────────────────────

export const SupervisorShiftsPage = () => {
  const [shifts, setShifts] = useLocalStorage<ShiftPattern[]>("shifts", SEED_SHIFTS)
  const [modal, setModal] = useState<{ open: boolean; mode: "add" | "edit"; id?: string }>({ open: false, mode: "add" })
  const [form, setForm] = useState<Omit<ShiftPattern, "id">>(EMPTY)
  const [error, setError] = useState("")
  const [deleteTarget, setDeleteTarget] = useState<ShiftPattern | null>(null)

  const openAdd = () => { setForm(EMPTY); setError(""); setModal({ open: true, mode: "add" }) }
  const openEdit = (s: ShiftPattern) => {
    const { id: _id, ...rest } = s
    setForm(rest); setError(""); setModal({ open: true, mode: "edit", id: s.id })
  }

  const handleSave = () => {
    if (!form.name.trim()) { setError("Nama sif wajib diisi"); return }
    setError("")
    if (modal.mode === "add") {
      setShifts(prev => [...prev, { ...form, id: `shift-${Date.now()}` }])
    } else {
      setShifts(prev => prev.map(s => s.id === modal.id ? { ...form, id: modal.id! } : s))
    }
    setModal({ open: false, mode: "add" })
  }

  return (
    <div className="p-4 sm:p-6 space-y-5 max-w-screen-xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">Pola Sif Unit</h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Kelola master pola sif dan jam dinas yang digunakan dalam penyusunan roster jadwal
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white text-sm font-semibold rounded-xl shadow-md shadow-indigo-200 dark:shadow-none transition-all active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" />
          <span>Tambah Sif</span>
        </button>
      </div>

      {/* Info box */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50">
        <Clock className="h-5 w-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-indigo-900 dark:text-indigo-300">Pengaturan Jam Dinas & Sif</p>
          <p className="text-xs text-indigo-700 dark:text-indigo-400 mt-0.5 leading-relaxed">
            Pola sif yang diatur di sini akan langsung tersedia di menu <strong>Roster Builder</strong> untuk dijadwalkan ke staf unit ruangan Anda.
            Warna sif akan muncul pada kalender jadwal dan kartu presensi pegawai.
          </p>
        </div>
      </div>

      {/* Cards grid */}
      {shifts.length === 0 ? (
        <div className="text-center py-16 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800">
          <Clock className="h-12 w-12 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400 font-medium mb-1">Belum ada pola sif</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mb-4">Tambahkan pola sif pertama untuk memulai penjadwalan roster</p>
          <button onClick={openAdd} className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-colors">
            <Plus className="h-4 w-4" /> Tambah Sif
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {shifts.map(shift => (
            <ShiftCard
              key={shift.id}
              shift={shift}
              onEdit={() => openEdit(shift)}
              onDelete={() => setDeleteTarget(shift)}
            />
          ))}

          {/* Add new card */}
          <button
            onClick={openAdd}
            className="rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800 hover:border-indigo-400 dark:hover:border-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 transition-all duration-200 min-h-[180px] flex flex-col items-center justify-center gap-2 text-gray-400 dark:text-gray-600 hover:text-indigo-600 dark:hover:text-indigo-400 group cursor-pointer"
          >
            <div className="h-10 w-10 rounded-xl border-2 border-dashed border-current flex items-center justify-center group-hover:scale-110 transition-transform">
              <Plus className="h-5 w-5" />
            </div>
            <p className="text-sm font-medium">Tambah Sif Baru</p>
          </button>
        </div>
      )}

      {/* Modals */}
      {modal.open && (
        <ShiftModal
          mode={modal.mode}
          form={form}
          onChange={partial => setForm(prev => ({ ...prev, ...partial }))}
          onSave={handleSave}
          onClose={() => setModal({ open: false, mode: "add" })}
          error={error}
        />
      )}
      {deleteTarget && (
        <DeleteConfirm
          name={deleteTarget.name}
          onConfirm={() => {
            setShifts(prev => prev.filter(s => s.id !== deleteTarget.id))
            setDeleteTarget(null)
          }}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </div>
  )
}

// Export alias for backward compatibility
export { SupervisorShiftsPage as ShiftsPage }
