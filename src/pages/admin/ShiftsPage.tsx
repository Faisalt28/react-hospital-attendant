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
  color: "blue", durationHours: 8, isOvernight: false,
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
            <div className={`p-2.5 rounded-xl ${color.bg} bg-opacity-15`}>
              {shift.isOvernight
                ? <Moon className={`h-5 w-5 ${color.text}`} />
                : isOncall
                ? <Sunset className={`h-5 w-5 ${color.text}`} />
                : <Sun className={`h-5 w-5 ${color.text}`} />
              }
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">{shift.name}</h3>
              {shift.isOvernight && (
                <span className="text-xs bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 px-1.5 py-0.5 rounded-full font-medium">
                  Lintas Tengah Malam
                </span>
              )}
            </div>
          </div>

          {/* Actions — show on hover */}
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={onEdit}
              className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
              <Pencil className="h-3.5 w-3.5" />
            </button>
            <button onClick={onDelete}
              className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Time display */}
        <div className="flex items-center gap-3 mb-4">
          {isOncall ? (
            <div className="flex-1 text-center py-2 px-3 rounded-xl bg-gray-50 dark:bg-gray-800">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Jadwal Fleksibel</p>
              <p className="text-xs text-gray-400">Sesuai kebutuhan</p>
            </div>
          ) : (
            <>
              <div className="flex-1 text-center py-2 px-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                <p className="text-xs text-gray-400 mb-0.5">Mulai</p>
                <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{shift.startTime}</p>
              </div>
              <div className="text-gray-300 dark:text-gray-600 text-xl font-light">→</div>
              <div className="flex-1 text-center py-2 px-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                <p className="text-xs text-gray-400 mb-0.5">Selesai</p>
                <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{shift.endTime}</p>
              </div>
            </>
          )}
        </div>

        {/* Duration badge */}
        {!isOncall && (
          <div className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg ${color.bg} bg-opacity-10`}>
            <Clock className={`h-3.5 w-3.5 ${color.text}`} />
            <span className={`text-sm font-semibold ${color.text}`}>{shift.durationHours} jam</span>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Modal ────────────────────────────────────────────────────────────────────

const inputCls = "w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
const labelCls = "block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5"

interface ShiftModalProps {
  mode: "add" | "edit"
  form: Omit<ShiftPattern, "id">
  onChange: (f: Partial<Omit<ShiftPattern, "id">>) => void
  onSave: () => void
  onClose: () => void
  error: string
}

const ShiftModal = ({ mode, form, onChange, onSave, onClose, error }: ShiftModalProps) => {
  const duration = calcDuration(form.startTime, form.endTime, form.isOvernight)
  const isOncall = form.startTime === "00:00" && form.endTime === "00:00"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            {mode === "add" ? "Tambah Pola Shift" : "Edit Pola Shift"}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {/* Name */}
          <div>
            <label className={labelCls}>Nama Shift *</label>
            <input className={inputCls} placeholder="contoh: Shift Pagi"
              value={form.name} onChange={e => onChange({ name: e.target.value })} />
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
          </div>

          {/* Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Jam Mulai</label>
              <input type="time" className={inputCls} value={form.startTime}
                onChange={e => onChange({ startTime: e.target.value, durationHours: calcDuration(e.target.value, form.endTime, form.isOvernight) })} />
            </div>
            <div>
              <label className={labelCls}>Jam Selesai</label>
              <input type="time" className={inputCls} value={form.endTime}
                onChange={e => onChange({ endTime: e.target.value, durationHours: calcDuration(form.startTime, e.target.value, form.isOvernight) })} />
            </div>
          </div>

          {/* Duration preview */}
          {!isOncall && (
            <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
              <Clock className="h-4 w-4 text-blue-500 shrink-0" />
              <p className="text-sm text-blue-700 dark:text-blue-400">
                Durasi: <strong>{duration} jam</strong>
                {form.isOvernight && " (lintas tengah malam)"}
              </p>
            </div>
          )}

          {/* Overnight toggle */}
          <div className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <button type="button"
              onClick={() => onChange({ isOvernight: !form.isOvernight, durationHours: calcDuration(form.startTime, form.endTime, !form.isOvernight) })}
              className={`relative inline-flex h-5 w-9 rounded-full transition-colors duration-200
                ${form.isOvernight ? "bg-indigo-500" : "bg-gray-300 dark:bg-gray-600"}`}>
              <span className={`inline-block h-4 w-4 mt-0.5 rounded-full bg-white shadow transition-transform duration-200
                ${form.isOvernight ? "translate-x-4" : "translate-x-0.5"}`} />
            </button>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Shift Lintas Tengah Malam</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Aktifkan jika shift melewati pukul 00:00</p>
            </div>
          </div>

          {/* Color picker */}
          <div>
            <label className={labelCls}>Warna Kalender</label>
            <div className="flex flex-wrap gap-2">
              {COLOR_OPTIONS.map(c => (
                <button key={c.value} type="button" onClick={() => onChange({ color: c.value })}
                  title={c.label}
                  className={`h-8 w-8 rounded-lg ${c.bg} transition-all duration-150
                    ${form.color === c.value ? `ring-2 ring-offset-2 ${c.ring} scale-110` : "hover:scale-105"}`}
                />
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-1.5">
              Dipilih: <span className="font-medium">{getColor(form.color).label}</span>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-gray-100 dark:border-gray-800">
          <button onClick={onClose}
            className="flex-1 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-colors">
            Batal
          </button>
          <button onClick={onSave}
            className="flex-1 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 rounded-xl transition-all shadow-md shadow-blue-200 dark:shadow-none flex items-center justify-center gap-2">
            <Check className="h-4 w-4" />
            {mode === "add" ? "Tambah Shift" : "Simpan"}
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
      <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 text-center mb-2">Hapus Shift?</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
        Pola shift <strong className="text-gray-900 dark:text-gray-100">"{name}"</strong> akan dihapus. Jadwal yang menggunakan shift ini mungkin terpengaruh.
      </p>
      <div className="flex gap-3">
        <button onClick={onClose} className="flex-1 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 rounded-xl transition-colors">Batal</button>
        <button onClick={onConfirm} className="flex-1 py-2 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors">Hapus</button>
      </div>
    </div>
  </div>
)

// ─── Main Page ────────────────────────────────────────────────────────────────

const ShiftsPage = () => {
  const [shifts, setShifts] = useLocalStorage("shifts", SEED_SHIFTS)
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
    if (!form.name.trim()) { setError("Nama shift wajib diisi"); return }
    setError("")
    if (modal.mode === "add") {
      setShifts(prev => [...prev, { ...form, id: `shift-${Date.now()}` }])
    } else {
      setShifts(prev => prev.map(s => s.id === modal.id ? { ...form, id: modal.id! } : s))
    }
    setModal({ open: false, mode: "add" })
  }

  return (
    <div className="p-6 space-y-5 max-w-screen-xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Master Shift</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Kelola pola shift kerja yang digunakan dalam penjadwalan</p>
        </div>
        <button onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white text-sm font-semibold rounded-xl shadow-md shadow-blue-200 dark:shadow-none transition-all active:scale-[0.98]">
          <Plus className="h-4 w-4" />
          Tambah Shift
        </button>
      </div>

      {/* Info box */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
        <Clock className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-blue-700 dark:text-blue-400">Tentang Master Shift</p>
          <p className="text-xs text-blue-600 dark:text-blue-500 mt-0.5">
            Pola shift yang didefinisikan di sini akan digunakan oleh Supervisor saat menyusun roster jadwal bulanan.
            Warna yang dipilih akan muncul di kalender jadwal.
          </p>
        </div>
      </div>

      {/* Cards grid */}
      {shifts.length === 0 ? (
        <div className="text-center py-16 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800">
          <Clock className="h-12 w-12 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400 font-medium mb-1">Belum ada pola shift</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mb-4">Tambahkan pola shift pertama untuk memulai penjadwalan</p>
          <button onClick={openAdd} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors">
            <Plus className="h-4 w-4" /> Tambah Shift
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {shifts.map(shift => (
            <ShiftCard key={shift.id} shift={shift}
              onEdit={() => openEdit(shift)}
              onDelete={() => setDeleteTarget(shift)} />
          ))}

          {/* Add new card */}
          <button onClick={openAdd}
            className="rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all duration-200 min-h-[200px] flex flex-col items-center justify-center gap-2 text-gray-400 dark:text-gray-600 hover:text-blue-500 dark:hover:text-blue-400 group">
            <div className="h-10 w-10 rounded-xl border-2 border-dashed border-current flex items-center justify-center group-hover:scale-110 transition-transform">
              <Plus className="h-5 w-5" />
            </div>
            <p className="text-sm font-medium">Tambah Shift</p>
          </button>
        </div>
      )}

      {/* Modals */}
      {modal.open && (
        <ShiftModal mode={modal.mode} form={form}
          onChange={partial => setForm(prev => ({ ...prev, ...partial }))}
          onSave={handleSave} onClose={() => setModal({ open: false, mode: "add" })} error={error} />
      )}
      {deleteTarget && (
        <DeleteConfirm name={deleteTarget.name}
          onConfirm={() => { setShifts(prev => prev.filter(s => s.id !== deleteTarget.id)); setDeleteTarget(null) }}
          onClose={() => setDeleteTarget(null)} />
      )}
    </div>
  )
}

export { ShiftsPage }
