import { useState, useMemo } from "react"
import {
  Building2, Plus, Pencil, Trash2, X, Check, AlertTriangle,
  Users, ChevronDown, Search,
} from "lucide-react"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import { SEED_DEPARTMENTS, SEED_EMPLOYEES } from "@/data/seed"
import type { Department } from "@/types"

const inputCls = "w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
const labelCls = "block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5"

const EMPTY: Omit<Department, "id"> = { name: "", supervisorId: "" }

// ─── Modal ────────────────────────────────────────────────────────────────────

const DeptModal = ({ mode, form, supervisors, onChange, onSave, onClose, error }: {
  mode: "add" | "edit"
  form: Omit<Department, "id">
  supervisors: { id: string; name: string }[]
  onChange: (f: Partial<Omit<Department, "id">>) => void
  onSave: () => void
  onClose: () => void
  error: string
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
    <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
        <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
          {mode === "add" ? "Tambah Departemen" : "Edit Departemen"}
        </h2>
        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors">
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="px-6 py-5 space-y-4">
        <div>
          <label className={labelCls}>Nama Departemen *</label>
          <input className={`${inputCls} ${error ? "border-red-400" : ""}`}
            placeholder="contoh: IGD, ICU, Farmasi..."
            value={form.name} onChange={e => onChange({ name: e.target.value })} />
          {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
        <div>
          <label className={labelCls}>Kepala Ruangan / Supervisor</label>
          <div className="relative">
            <select value={form.supervisorId ?? ""} onChange={e => onChange({ supervisorId: e.target.value })}
              className={`${inputCls} pr-8 appearance-none cursor-pointer`}>
              <option value="">— Belum ditentukan —</option>
              {supervisors.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>
      <div className="flex gap-3 px-6 py-4 border-t border-gray-100 dark:border-gray-800">
        <button onClick={onClose} className="flex-1 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-colors">Batal</button>
        <button onClick={onSave} className="flex-1 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 rounded-xl transition-all shadow-md shadow-blue-200 dark:shadow-none flex items-center justify-center gap-2">
          <Check className="h-4 w-4" />
          {mode === "add" ? "Tambah" : "Simpan"}
        </button>
      </div>
    </div>
  </div>
)

const DeleteConfirm = ({ name, count, onConfirm, onClose }: { name: string; count: number; onConfirm: () => void; onClose: () => void }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
    <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 mx-auto mb-4">
        <AlertTriangle className="h-6 w-6 text-red-500" />
      </div>
      <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 text-center mb-2">Hapus Departemen?</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-1">
        Departemen <strong className="text-gray-900 dark:text-gray-100">{name}</strong> akan dihapus.
      </p>
      {count > 0 && (
        <p className="text-xs text-amber-600 dark:text-amber-400 text-center mb-4 bg-amber-50 dark:bg-amber-900/20 py-2 px-3 rounded-lg">
          ⚠ Masih ada <strong>{count} pegawai</strong> di departemen ini. Data pegawai tidak akan terhapus, namun departemen mereka akan kosong.
        </p>
      )}
      <div className="flex gap-3 mt-4">
        <button onClick={onClose} className="flex-1 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 rounded-xl transition-colors">Batal</button>
        <button onClick={onConfirm} className="flex-1 py-2 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors">Hapus</button>
      </div>
    </div>
  </div>
)

// ─── Main Page ────────────────────────────────────────────────────────────────

const DepartmentsPage = () => {
  const [departments, setDepartments] = useLocalStorage("departments", SEED_DEPARTMENTS)
  const [employees]                   = useLocalStorage("employees", SEED_EMPLOYEES)

  const [search,  setSearch]  = useState("")
  const [modal,   setModal]   = useState<{ open: boolean; mode: "add" | "edit"; id?: string }>({ open: false, mode: "add" })
  const [form,    setForm]    = useState<Omit<Department, "id">>(EMPTY)
  const [error,   setError]   = useState("")
  const [delTarget, setDelTarget] = useState<Department | null>(null)

  const supervisors = employees.filter(e => e.role === "supervisor" || e.role === "admin" || e.role === "hrd")

  const filtered = useMemo(() =>
    departments.filter(d => !search || d.name.toLowerCase().includes(search.toLowerCase()))
  , [departments, search])

  const empCount = (deptId: string) => employees.filter(e => e.departmentId === deptId).length
  const getSupervisorName = (id?: string) => supervisors.find(s => s.id === id)?.name ?? "—"

  const openAdd  = () => { setForm(EMPTY); setError(""); setModal({ open: true, mode: "add" }) }
  const openEdit = (d: Department) => { const { id: _, ...rest } = d; setForm(rest); setError(""); setModal({ open: true, mode: "edit", id: d.id }) }

  const handleSave = () => {
    if (!form.name.trim()) { setError("Nama departemen wajib diisi"); return }
    if (departments.some(d => d.name.toLowerCase() === form.name.toLowerCase() && d.id !== modal.id))
      { setError("Nama departemen sudah ada"); return }
    setError("")
    if (modal.mode === "add") {
      setDepartments(prev => [...prev, { ...form, id: `dept-${Date.now()}` }])
    } else {
      setDepartments(prev => prev.map(d => d.id === modal.id ? { ...form, id: modal.id! } : d))
    }
    setModal({ open: false, mode: "add" })
  }

  return (
    <div className="p-6 space-y-5 max-w-screen-xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Departemen</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Kelola unit dan departemen rumah sakit</p>
        </div>
        <button onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white text-sm font-semibold rounded-xl shadow-md shadow-blue-200 dark:shadow-none transition-all active:scale-[0.98]">
          <Plus className="h-4 w-4" />
          Tambah Departemen
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          { label: "Total Departemen", value: departments.length,                                         color: "text-blue-600 dark:text-blue-400",   bg: "bg-blue-50 dark:bg-blue-900/20" },
          { label: "Total Pegawai",    value: employees.filter(e => e.isActive).length,                   color: "text-green-600 dark:text-green-400", bg: "bg-green-50 dark:bg-green-900/20" },
          { label: "Tanpa Supervisor", value: departments.filter(d => !d.supervisorId).length,            color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-900/20" },
        ].map(s => (
          <div key={s.label} className={`${s.bg} rounded-xl p-4 border border-gray-100 dark:border-gray-800`}>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input placeholder="Cari departemen..." value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all" />
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(dept => {
          const count = empCount(dept.id)
          const supName = getSupervisorName(dept.supervisorId)
          return (
            <div key={dept.id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-200 group overflow-hidden">
              <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 to-blue-600" />
              <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/20">
                      <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">{dept.name}</h3>
                      <p className="text-xs text-gray-400 mt-0.5">ID: {dept.id}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEdit(dept)} className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => setDelTarget(dept)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Kepala Ruangan</span>
                    <span className={`text-xs font-medium ${dept.supervisorId ? "text-gray-900 dark:text-gray-100" : "text-gray-400 italic"}`}>
                      {supName}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <Users className="h-3 w-3" /> Jumlah Pegawai
                    </span>
                    <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-full">
                      {count} orang
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}

        {/* Add card */}
        <button onClick={openAdd}
          className="rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all duration-200 min-h-[160px] flex flex-col items-center justify-center gap-2 text-gray-400 dark:text-gray-600 hover:text-blue-500 dark:hover:text-blue-400 group">
          <div className="h-10 w-10 rounded-xl border-2 border-dashed border-current flex items-center justify-center group-hover:scale-110 transition-transform">
            <Plus className="h-5 w-5" />
          </div>
          <p className="text-sm font-medium">Tambah Departemen</p>
        </button>
      </div>

      {modal.open && (
        <DeptModal mode={modal.mode} form={form} supervisors={supervisors}
          onChange={p => setForm(prev => ({ ...prev, ...p }))}
          onSave={handleSave} onClose={() => setModal({ open: false, mode: "add" })} error={error} />
      )}
      {delTarget && (
        <DeleteConfirm name={delTarget.name} count={empCount(delTarget.id)}
          onConfirm={() => { setDepartments(prev => prev.filter(d => d.id !== delTarget.id)); setDelTarget(null) }}
          onClose={() => setDelTarget(null)} />
      )}
    </div>
  )
}

export { DepartmentsPage }
