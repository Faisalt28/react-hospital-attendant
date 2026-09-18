import { useState, useMemo } from "react"
import { ClipboardList, Search, ChevronDown, ArrowUpDown, ArrowUp, ArrowDown, X, Camera } from "lucide-react"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import { SEED_ATTENDANCE, SEED_EMPLOYEES, SEED_DEPARTMENTS } from "@/data/seed"
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/cnippet-table"
import type { AttendanceStatus } from "@/types"

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<AttendanceStatus, { label: string; cls: string }> = {
  "on-time":    { label: "Tepat Waktu", cls: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  "late":       { label: "Terlambat",   cls: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  "early-leave":{ label: "Pulang Awal", cls: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" },
  "absent":     { label: "Tidak Hadir", cls: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
}

type SortKey = "date" | "name" | "clockInTime" | "totalHours" | "status"
type SortDir = "asc" | "desc"

const SortIcon = ({ col, sortKey, sortDir }: { col: SortKey; sortKey: SortKey; sortDir: SortDir }) => {
  if (col !== sortKey) return <ArrowUpDown className="h-3 w-3 opacity-40" />
  return sortDir === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
}

const ThSort = ({
  k,
  label,
  align = "left",
  sortKey,
  sortDir,
  onToggle,
}: {
  k: SortKey
  label: string
  align?: string
  sortKey: SortKey
  sortDir: SortDir
  onToggle: (key: SortKey) => void
}) => (
  <TableHead
    className={`cursor-pointer select-none hover:text-gray-900 dark:hover:text-gray-100 transition-colors ${align === "right" ? "text-right" : ""}`}
    onClick={() => onToggle(k)}
  >
    <span className={`inline-flex items-center gap-1 ${align === "right" ? "flex-row-reverse" : ""}`}>
      {label}
      <SortIcon col={k} sortKey={sortKey} sortDir={sortDir} />
    </span>
  </TableHead>
)

// ─── Main Page ────────────────────────────────────────────────────────────────

const AttendancePage = () => {
  const [attendance] = useLocalStorage("attendance", SEED_ATTENDANCE)
  const [employees]  = useLocalStorage("employees",  SEED_EMPLOYEES)
  const [departments]= useLocalStorage("departments", SEED_DEPARTMENTS)

  const [search,      setSearch]      = useState("")
  const [filterDept,  setFilterDept]  = useState("")
  const [filterStatus,setFilterStatus]= useState("")
  const [filterFrom,  setFilterFrom]  = useState(() => {
    const d = new Date()
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`
  })
  const [filterTo,    setFilterTo]    = useState(() => {
    const d = new Date()
    const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate()
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`
  })
  const [sortKey,     setSortKey]     = useState<SortKey>("date")
  const [sortDir,     setSortDir]     = useState<SortDir>("desc")
  const [previewPhoto, setPreviewPhoto] = useState<{ url: string; title: string; time?: string } | null>(null)

  // Fast lookups
  const empMap = useMemo(() => new Map(employees.map(e => [e.id, e])), [employees])
  const deptMap = useMemo(() => new Map(departments.map(d => [d.id, d])), [departments])

  // Enrich records
  const enriched = useMemo(() => attendance.map(att => {
    const emp = empMap.get(att.employeeId)
    const dept = emp?.departmentId ? deptMap.get(emp.departmentId) : undefined
    return {
      ...att,
      empName: emp?.name ?? "—",
      empNip:  emp?.nip  ?? "—",
      deptName:dept?.name ?? "—",
      departmentId: emp?.departmentId ?? "",
    }
  }), [attendance, empMap, deptMap])

  const filtered = useMemo(() => {
    let data = enriched
    if (search) {
      const q = search.toLowerCase()
      data = data.filter(r => r.empName.toLowerCase().includes(q) || r.empNip.toLowerCase().includes(q))
    }
    if (filterDept)   data = data.filter(r => r.departmentId === filterDept)
    if (filterStatus) data = data.filter(r => r.status === filterStatus)
    if (filterFrom)   data = data.filter(r => r.date >= filterFrom)
    if (filterTo)     data = data.filter(r => r.date <= filterTo)
    return [...data].sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1
      if (sortKey === "date")        return dir * a.date.localeCompare(b.date)
      if (sortKey === "name")        return dir * a.empName.localeCompare(b.empName)
      if (sortKey === "clockInTime") return dir * (a.clockInTime ?? "").localeCompare(b.clockInTime ?? "")
      if (sortKey === "totalHours")  return dir * ((a.totalHours ?? 0) - (b.totalHours ?? 0))
      if (sortKey === "status")      return dir * a.status.localeCompare(b.status)
      return 0
    })
  }, [enriched, search, filterDept, filterStatus, filterFrom, filterTo, sortKey, sortDir])

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc")
    else { setSortKey(key); setSortDir("desc") }
  }


  // Summary stats
  const total     = filtered.length
  const onTime    = filtered.filter(r => r.status === "on-time").length
  const late      = filtered.filter(r => r.status === "late").length
  const absent    = filtered.filter(r => r.status === "absent").length
  const rate      = total > 0 ? Math.round(((onTime + late) / total) * 100) : 0

  const selectCls = "pl-3 pr-8 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300 appearance-none cursor-pointer"

  return (
    <div className="p-3 sm:p-6 space-y-5 max-w-screen-2xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">Rekap Kehadiran</h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">Data presensi harian seluruh pegawai</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Presensi", value: total,   color: "text-blue-600 dark:text-blue-400",   bg: "bg-blue-50 dark:bg-blue-900/20" },
          { label: "Tepat Waktu",    value: onTime,   color: "text-green-600 dark:text-green-400", bg: "bg-green-50 dark:bg-green-900/20" },
          { label: "Terlambat",      value: late,     color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-900/20" },
          { label: "Tingkat Hadir",  value: `${rate}%`,color: "text-purple-600 dark:text-purple-400",bg: "bg-purple-50 dark:bg-purple-900/20" },
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
          <input placeholder="Cari nama atau NIP..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all" />
        </div>
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          <input type="date" value={filterFrom} onChange={e => setFilterFrom(e.target.value)}
            className={`${selectCls} flex-1 sm:flex-none sm:min-w-[130px] text-sm`} />
          <span className="text-gray-400 text-sm">—</span>
          <input type="date" value={filterTo} onChange={e => setFilterTo(e.target.value)}
            className={`${selectCls} flex-1 sm:flex-none sm:min-w-[130px] text-sm`} />
        </div>
        <div className="relative flex-1 min-w-[130px]">
          <select value={filterDept} onChange={e => setFilterDept(e.target.value)} className={`${selectCls} w-full pr-8`}>
            <option value="">Semua Dept.</option>
            {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
        </div>
        <div className="relative flex-1 min-w-[130px]">
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className={`${selectCls} w-full pr-8`}>
            <option value="">Semua Status</option>
            {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
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
        <div className="overflow-x-auto">
          <Table className="min-w-[640px]">
          <TableHeader>
            <TableRow className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/60">
              <ThSort k="date"        label="Tanggal"   sortKey={sortKey} sortDir={sortDir} onToggle={toggleSort} />
              <ThSort k="name"        label="Pegawai"   sortKey={sortKey} sortDir={sortDir} onToggle={toggleSort} />
              <TableHead className="hidden md:table-cell">Departemen</TableHead>
              <ThSort k="clockInTime" label="Jam Masuk" sortKey={sortKey} sortDir={sortDir} onToggle={toggleSort} />
              <TableHead className="hidden sm:table-cell">Jam Keluar</TableHead>
              <ThSort k="totalHours"  label="Durasi"    sortKey={sortKey} sortDir={sortDir} onToggle={toggleSort} align="right" />
              <ThSort k="status"      label="Status"    sortKey={sortKey} sortDir={sortDir} onToggle={toggleSort} />
              <TableHead className="hidden sm:table-cell">Lokasi</TableHead>
              <TableHead className="text-center">Foto Selfie</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-12">
                  <ClipboardList className="h-10 w-10 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
                  <p className="text-gray-400">Tidak ada data kehadiran</p>
                </TableCell>
              </TableRow>
            ) : filtered.map(rec => {
              const statusCfg = STATUS_CONFIG[rec.status]
              const photoIn = rec.photoInBase64 || rec.photoBase64
              const photoOut = rec.photoOutBase64

              return (
                <TableRow key={rec.id}>
                  <TableCell className="font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">
                    {new Date(rec.date).toLocaleDateString("id-ID", { weekday: "short", day: "numeric", month: "short" })}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{rec.empName}</p>
                      <p className="text-xs text-gray-400 font-mono">{rec.empNip}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-400 hidden md:table-cell">{rec.deptName}</TableCell>
                  <TableCell className="font-mono font-medium">{rec.clockInTime ?? "—"}</TableCell>
                  <TableCell className="font-mono hidden sm:table-cell">{rec.clockOutTime ?? "—"}</TableCell>
                  <TableCell className="text-right">
                    {rec.totalHours ? <span className="font-medium">{rec.totalHours.toFixed(1)} jam</span> : "—"}
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusCfg.cls}`}>
                      {statusCfg.label}
                    </span>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <span className={`text-xs font-medium ${rec.location === "inside" ? "text-green-600 dark:text-green-400" : "text-red-500 dark:text-red-400"}`}>
                      {rec.location === "inside" ? "✓ Dalam RS" : "✗ Luar RS"}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      {photoIn ? (
                        <button
                          type="button"
                          onClick={() => setPreviewPhoto({ url: photoIn, title: `Foto Masuk: ${rec.empName}`, time: rec.clockInTime })}
                          className="px-2 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 text-blue-600 dark:text-blue-400 text-xs flex items-center gap-1 cursor-pointer font-medium"
                          title="Lihat Foto Masuk"
                        >
                          <Camera className="h-3.5 w-3.5" />
                          <span className="hidden xl:inline text-[11px]">Masuk</span>
                        </button>
                      ) : null}
                      {photoOut ? (
                        <button
                          type="button"
                          onClick={() => setPreviewPhoto({ url: photoOut, title: `Foto Pulang: ${rec.empName}`, time: rec.clockOutTime })}
                          className="px-2 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-1 cursor-pointer font-medium"
                          title="Lihat Foto Pulang"
                        >
                          <Camera className="h-3.5 w-3.5" />
                          <span className="hidden xl:inline text-[11px]">Pulang</span>
                        </button>
                      ) : null}
                      {!photoIn && !photoOut && <span className="text-gray-400 text-xs">—</span>}
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
        </div>
        <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/30">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Menampilkan <strong>{filtered.length}</strong> dari <strong>{attendance.length}</strong> rekaman · Tidak hadir: <strong className="text-red-500">{absent}</strong>
          </p>
        </div>
      </div>

      {/* ── Photo Preview Modal ── */}
      {previewPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setPreviewPhoto(null)} />
          <div className="relative bg-white dark:bg-gray-900 rounded-3xl overflow-hidden max-w-sm w-full border border-gray-200 dark:border-gray-800 p-4 space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-xs font-bold text-gray-900 dark:text-gray-100">{previewPhoto.title}</h4>
                {previewPhoto.time && (
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">Pukul {previewPhoto.time} WIB</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setPreviewPhoto(null)}
                className="text-xs font-semibold text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 cursor-pointer"
              >
                Tutup
              </button>
            </div>
            <img src={previewPhoto.url} alt={previewPhoto.title} className="w-full aspect-square object-cover rounded-2xl" />
          </div>
        </div>
      )}
    </div>
  )
}

export { AttendancePage }
