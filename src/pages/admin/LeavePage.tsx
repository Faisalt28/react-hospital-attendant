import { useState, useMemo } from "react"
import {
  FileText, Search, ChevronDown, CheckCircle2, XCircle,
  Clock, X, MessageSquare, Calendar,
} from "lucide-react"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import { SEED_LEAVES, SEED_EMPLOYEES, SEED_DEPARTMENTS } from "@/data/seed"
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/cnippet-table"
import type { LeaveRequest, ApprovalStatus, LeaveType } from "@/types"

// ─── Config ───────────────────────────────────────────────────────────────────

const TYPE_CONFIG: Record<LeaveType, { label: string; cls: string }> = {
  cuti:  { label: "Cuti Tahunan", cls: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  izin:  { label: "Izin",         cls: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" },
  sakit: { label: "Sakit",        cls: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
}

const STATUS_CONFIG: Record<ApprovalStatus, { label: string; cls: string; icon: React.ReactNode }> = {
  pending:  { label: "Menunggu",  cls: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",  icon: <Clock className="h-3 w-3" /> },
  approved: { label: "Disetujui", cls: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400", icon: <CheckCircle2 className="h-3 w-3" /> },
  rejected: { label: "Ditolak",   cls: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",         icon: <XCircle className="h-3 w-3" /> },
}

// ─── Detail Modal ─────────────────────────────────────────────────────────────

const DetailModal = ({ leave, empName, deptName, onClose, onApprove, onReject }: {
  leave: LeaveRequest; empName: string; deptName: string
  onClose: () => void
  onApprove: (note: string) => void
  onReject:  (note: string) => void
}) => {
  const [note, setNote] = useState(leave.reviewNote ?? "")
  const type = TYPE_CONFIG[leave.type]
  const status = STATUS_CONFIG[leave.status]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">Detail Pengajuan</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="px-6 py-5 space-y-4">
          {/* Employee */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm">
              {empName.charAt(0)}
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100">{empName}</p>
              <p className="text-xs text-gray-400">{deptName}</p>
            </div>
            <div className="ml-auto flex gap-2">
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${type.cls}`}>{type.label}</span>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${status.cls}`}>{status.icon}{status.label}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
              <p className="text-xs text-gray-400 mb-1">Tanggal Mulai</p>
              <p className="font-semibold text-gray-900 dark:text-gray-100">{leave.startDate}</p>
            </div>
            <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
              <p className="text-xs text-gray-400 mb-1">Tanggal Selesai</p>
              <p className="font-semibold text-gray-900 dark:text-gray-100">{leave.endDate}</p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
            <p className="text-xs text-blue-500 mb-1">Durasi</p>
            <p className="font-bold text-blue-700 dark:text-blue-400">{leave.totalDays} hari kerja</p>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">Alasan</p>
            <p className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 rounded-xl px-3 py-2.5">{leave.reason}</p>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 flex items-center gap-1">
              <MessageSquare className="h-3 w-3" /> Catatan Reviewer
            </label>
            <textarea rows={2} value={note} onChange={e => setNote(e.target.value)}
              disabled={leave.status !== "pending"}
              placeholder={leave.status === "pending" ? "Tambahkan catatan (opsional)..." : "—"}
              className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none disabled:opacity-60" />
          </div>
        </div>

        {leave.status === "pending" && (
          <div className="flex gap-3 px-6 py-4 border-t border-gray-100 dark:border-gray-800">
            <button onClick={() => onReject(note)}
              className="flex-1 py-2 text-sm font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-xl transition-colors flex items-center justify-center gap-2">
              <XCircle className="h-4 w-4" /> Tolak
            </button>
            <button onClick={() => onApprove(note)}
              className="flex-1 py-2 text-sm font-semibold text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 rounded-xl transition-all flex items-center justify-center gap-2">
              <CheckCircle2 className="h-4 w-4" /> Setujui
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const LeavePage = () => {
  const [leaves,      setLeaves]      = useLocalStorage("leaves",      SEED_LEAVES)
  const [employees,   setEmployees]   = useLocalStorage("employees",   SEED_EMPLOYEES)
  const [departments]                 = useLocalStorage("departments", SEED_DEPARTMENTS)

  const [search,       setSearch]       = useState("")
  const [filterDept,   setFilterDept]   = useState("")
  const [filterType,   setFilterType]   = useState("")
  const [filterStatus, setFilterStatus] = useState("")
  const [selected,     setSelected]     = useState<LeaveRequest | null>(null)

  const getEmp  = (id: string) => employees.find(e => e.id === id)
  const getDept = (id: string) => departments.find(d => d.id === id)

  const enriched = useMemo(() => leaves.map(l => ({
    ...l,
    empName:  getEmp(l.employeeId)?.name ?? "—",
    empNip:   getEmp(l.employeeId)?.nip ?? "—",
    deptName: getDept(l.departmentId)?.name ?? "—",
  })), [leaves, employees, departments])

  const filtered = useMemo(() => {
    let data = enriched
    if (search)       data = data.filter(r => r.empName.toLowerCase().includes(search.toLowerCase()))
    if (filterDept)   data = data.filter(r => r.departmentId === filterDept)
    if (filterType)   data = data.filter(r => r.type === filterType)
    if (filterStatus) data = data.filter(r => r.status === filterStatus)
    return [...data].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  }, [enriched, search, filterDept, filterType, filterStatus])

  const handleApprove = (note: string) => {
    if (!selected) return
    setLeaves(prev => prev.map(l => l.id === selected.id
      ? { ...l, status: "approved", reviewNote: note, reviewedAt: new Date().toISOString() } : l))
    if (selected.type === "cuti") {
      setEmployees(prev => prev.map(emp =>
        emp.id === selected.employeeId
          ? { ...emp, usedLeave: emp.usedLeave + selected.totalDays }
          : emp
      ))
    }
    setSelected(null)
  }
  const handleReject = (note: string) => {
    if (!selected) return
    setLeaves(prev => prev.map(l => l.id === selected.id
      ? { ...l, status: "rejected", reviewNote: note, reviewedAt: new Date().toISOString() } : l))
    setSelected(null)
  }

  const stats = {
    total:    leaves.length,
    pending:  leaves.filter(l => l.status === "pending").length,
    approved: leaves.filter(l => l.status === "approved").length,
    rejected: leaves.filter(l => l.status === "rejected").length,
  }

  const selectCls = "pl-3 pr-8 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300 appearance-none cursor-pointer"

  return (
    <div className="p-3 sm:p-6 space-y-5 max-w-screen-2xl mx-auto">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">Cuti &amp; Izin</h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">Rekap semua pengajuan cuti, izin, dan sakit</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Pengajuan", value: stats.total,    color: "text-blue-600 dark:text-blue-400",   bg: "bg-blue-50 dark:bg-blue-900/20" },
          { label: "Menunggu",        value: stats.pending,  color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-900/20" },
          { label: "Disetujui",       value: stats.approved, color: "text-green-600 dark:text-green-400", bg: "bg-green-50 dark:bg-green-900/20" },
          { label: "Ditolak",         value: stats.rejected, color: "text-red-600 dark:text-red-400",     bg: "bg-red-50 dark:bg-red-900/20" },
        ].map(s => (
          <div key={s.label} className={`${s.bg} rounded-xl p-4 border border-gray-100 dark:border-gray-800`}>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <div className="relative w-full sm:flex-1 sm:min-w-[180px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input placeholder="Cari nama pegawai..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all" />
        </div>
        {[
          { val: filterDept,   set: setFilterDept,   opts: departments.map(d => ({ v: d.id, l: d.name })),    ph: "Semua Dept." },
          { val: filterType,   set: setFilterType,   opts: Object.entries(TYPE_CONFIG).map(([v,c]) => ({ v, l: c.label })), ph: "Semua Jenis" },
          { val: filterStatus, set: setFilterStatus, opts: Object.entries(STATUS_CONFIG).map(([v,c]) => ({ v, l: c.label })), ph: "Semua Status" },
        ].map((f, i) => (
          <div key={i} className="relative flex-1 min-w-[120px]">
            <select value={f.val} onChange={e => f.set(e.target.value)} className={`${selectCls} w-full pr-8`}>
              <option value="">{f.ph}</option>
              {f.opts.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table className="min-w-[600px]">
          <TableHeader>
            <TableRow className="bg-gray-50 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-800">
              <TableHead>Pegawai</TableHead>
              <TableHead className="hidden md:table-cell">Departemen</TableHead>
              <TableHead>Jenis</TableHead>
              <TableHead className="hidden sm:table-cell">Tanggal</TableHead>
              <TableHead className="text-center hidden sm:table-cell">Hari</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden lg:table-cell">Pengajuan</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12">
                  <FileText className="h-10 w-10 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
                  <p className="text-gray-400">Tidak ada data pengajuan</p>
                </TableCell>
              </TableRow>
            ) : filtered.map(rec => {
              const typeCfg   = TYPE_CONFIG[rec.type]
              const statusCfg = STATUS_CONFIG[rec.status]
              return (
                <TableRow key={rec.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{rec.empName}</p>
                      <p className="text-xs text-gray-400 font-mono">{rec.empNip}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-400 hidden md:table-cell">{rec.deptName}</TableCell>
                  <TableCell>
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${typeCfg.cls}`}>{typeCfg.label}</span>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <div className="flex items-center gap-1 text-xs">
                      <Calendar className="h-3 w-3 text-gray-400" />
                      <span>{rec.startDate}</span>
                      {rec.startDate !== rec.endDate && <><span className="text-gray-400">→</span><span>{rec.endDate}</span></>}
                    </div>
                  </TableCell>
                  <TableCell className="text-center font-semibold text-gray-900 dark:text-gray-100 hidden sm:table-cell">{rec.totalDays}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusCfg.cls}`}>
                      {statusCfg.icon}{statusCfg.label}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs text-gray-400 hidden lg:table-cell">
                    {new Date(rec.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </TableCell>
                  <TableCell className="text-right">
                    <button onClick={() => setSelected(rec as unknown as LeaveRequest)}
                      className="px-3 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors">
                      {rec.status === "pending" ? "Tinjau" : "Lihat"}
                    </button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
          </Table>
          </div>
        <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/30">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Menampilkan <strong>{filtered.length}</strong> dari <strong>{leaves.length}</strong> pengajuan
          </p>
        </div>
      </div>

      {selected && (
        <DetailModal
          leave={selected}
          empName={enriched.find(e => e.id === selected.id)?.empName ?? "—"}
          deptName={enriched.find(e => e.id === selected.id)?.deptName ?? "—"}
          onClose={() => setSelected(null)}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </div>
  )
}

export { LeavePage }
