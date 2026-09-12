import { useState, useMemo } from "react"
import { CalendarDays, Search, ChevronDown, X } from "lucide-react"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import { SEED_SCHEDULES, SEED_EMPLOYEES, SEED_DEPARTMENTS, SEED_SHIFTS } from "@/data/seed"
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/cnippet-table"

type ScheduleStatus = "draft" | "published" | "swapped" | "leave"

const STATUS_CFG: Record<ScheduleStatus, { label: string; cls: string }> = {
  published: { label: "Published",  cls: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  draft:     { label: "Draft",      cls: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400" },
  swapped:   { label: "Swap",       cls: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  leave:     { label: "Cuti/Izin",  cls: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
}

// ─── Shift Badge ──────────────────────────────────────────────────────────────

const SHIFT_COLORS: Record<string, string> = {
  blue:    "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  indigo:  "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
  green:   "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  orange:  "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  violet:  "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
  red:     "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  pink:    "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
  yellow:  "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  cyan:    "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
  emerald: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const SchedulePage = () => {
  const [schedules]   = useLocalStorage("schedules",   SEED_SCHEDULES)
  const [employees]   = useLocalStorage("employees",   SEED_EMPLOYEES)
  const [departments] = useLocalStorage("departments", SEED_DEPARTMENTS)
  const [shifts]      = useLocalStorage("shifts",      SEED_SHIFTS)

  const [search,       setSearch]       = useState("")
  const [filterDept,   setFilterDept]   = useState("")
  const [filterStatus, setFilterStatus] = useState("")
  const [filterMonth,  setFilterMonth]  = useState(() => {
    const d = new Date()
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
  })

  const getEmp   = (id: string) => employees.find(e => e.id === id)
  const getDept  = (id: string) => departments.find(d => d.id === id)
  const getShift = (id: string) => shifts.find(s => s.id === id)

  // Enrich records
  const enriched = useMemo(() => schedules.map(sch => {
    const emp   = getEmp(sch.employeeId)
    const dept  = getDept(sch.departmentId)
    const shift = getShift(sch.shiftId)
    return { ...sch, empName: emp?.name ?? "—", empNip: emp?.nip ?? "—", deptName: dept?.name ?? "—", shift }
  }), [schedules, employees, departments, shifts])

  const filtered = useMemo(() => {
    let data = enriched
    if (filterMonth)  data = data.filter(r => r.date.startsWith(filterMonth))
    if (search)       data = data.filter(r => r.empName.toLowerCase().includes(search.toLowerCase()) || r.empNip.includes(search))
    if (filterDept)   data = data.filter(r => r.departmentId === filterDept)
    if (filterStatus) data = data.filter(r => r.status === filterStatus)
    return [...data].sort((a, b) => a.date.localeCompare(b.date))
  }, [enriched, search, filterDept, filterStatus, filterMonth])

  const stats = {
    total:     filtered.length,
    published: filtered.filter(r => r.status === "published").length,
    draft:     filtered.filter(r => r.status === "draft").length,
    depts:     new Set(filtered.map(r => r.departmentId)).size,
  }

  const selectCls = "pl-3 pr-8 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300 appearance-none cursor-pointer"

  return (
    <div className="p-6 space-y-5 max-w-screen-2xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Semua Jadwal</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          Tampilan global jadwal seluruh departemen · Hanya baca (editing oleh Supervisor)
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Jadwal",    value: stats.total,     color: "text-blue-600 dark:text-blue-400",   bg: "bg-blue-50 dark:bg-blue-900/20" },
          { label: "Published",       value: stats.published, color: "text-green-600 dark:text-green-400", bg: "bg-green-50 dark:bg-green-900/20" },
          { label: "Draft",           value: stats.draft,     color: "text-gray-600 dark:text-gray-400",   bg: "bg-gray-100 dark:bg-gray-800" },
          { label: "Dept Terjadwal",  value: stats.depts,     color: "text-purple-600 dark:text-purple-400",bg: "bg-purple-50 dark:bg-purple-900/20" },
        ].map(s => (
          <div key={s.label} className={`${s.bg} rounded-xl p-4 border border-gray-100 dark:border-gray-800`}>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Notice */}
      <div className="flex items-start gap-3 px-4 py-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl">
        <CalendarDays className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
        <p className="text-sm text-blue-700 dark:text-blue-400">
          Halaman ini menampilkan jadwal yang dibuat oleh Supervisor dari semua departemen.
          Untuk membuat atau mengedit jadwal, Supervisor dapat mengakses menu <strong>Roster</strong> di dashboard mereka.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input placeholder="Cari nama atau NIP..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all" />
        </div>
        <div className="relative">
          <input type="month" value={filterMonth} onChange={e => setFilterMonth(e.target.value)}
            className={`${selectCls} min-w-[160px]`} />
        </div>
        <div className="relative">
          <select value={filterDept} onChange={e => setFilterDept(e.target.value)} className={`${selectCls} pr-8 min-w-[160px]`}>
            <option value="">Semua Dept.</option>
            {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
        </div>
        <div className="relative">
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className={`${selectCls} pr-8 min-w-[150px]`}>
            <option value="">Semua Status</option>
            {(Object.entries(STATUS_CFG) as [ScheduleStatus, { label: string; cls: string }][]).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
        </div>
        {(search || filterDept || filterStatus) && (
          <button onClick={() => { setSearch(""); setFilterDept(""); setFilterStatus("") }}
            className="flex items-center gap-1 px-3 py-2 text-sm text-gray-500 hover:text-gray-700 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-colors">
            <X className="h-3.5 w-3.5" /> Reset
          </button>
        )}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-800">
              <TableHead>Tanggal</TableHead>
              <TableHead>Pegawai</TableHead>
              <TableHead>Departemen</TableHead>
              <TableHead>Shift</TableHead>
              <TableHead>Jam</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Dibuat oleh</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12">
                  <CalendarDays className="h-10 w-10 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
                  <p className="text-gray-400">Belum ada jadwal untuk periode ini</p>
                  <p className="text-xs text-gray-400 mt-1">Jadwal dibuat oleh Supervisor di masing-masing departemen</p>
                </TableCell>
              </TableRow>
            ) : filtered.map(rec => {
              const statusCfg = STATUS_CFG[rec.status as ScheduleStatus]
              const shiftColor = SHIFT_COLORS[rec.shift?.color ?? "blue"]
              const creator = getEmp(rec.createdBy)
              return (
                <TableRow key={rec.id}>
                  <TableCell className="font-medium text-gray-900 dark:text-gray-100">
                    {new Date(rec.date).toLocaleDateString("id-ID", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{rec.empName}</p>
                      <p className="text-xs text-gray-400 font-mono">{rec.empNip}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-400">{rec.deptName}</TableCell>
                  <TableCell>
                    {rec.shift ? (
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${shiftColor}`}>
                        {rec.shift.name}
                      </span>
                    ) : "—"}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-gray-600 dark:text-gray-400">
                    {rec.shift ? `${rec.shift.startTime} – ${rec.shift.endTime}` : "—"}
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${statusCfg.cls}`}>
                      {statusCfg.label}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs text-gray-400">{creator?.name ?? "—"}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
        <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/30">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Menampilkan <strong>{filtered.length}</strong> jadwal · {stats.published} published · {stats.draft} draft
          </p>
        </div>
      </div>
    </div>
  )
}

export { SchedulePage }
