import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import {
  LayoutDashboard,
  CalendarDays,
  ArrowLeftRight,
  FileCheck2,
  FileSpreadsheet,
  LogOut,
  ChevronsRight,
  Hospital,
} from "lucide-react"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import { SEED_SWAPS, SEED_LEAVES, SEED_EMPLOYEES } from "@/data/seed"

interface NavItem {
  icon: React.ElementType
  title: string
  path: string
  notifs?: number
}

interface OptionProps {
  icon: React.ElementType
  title: string
  path: string
  open: boolean
  notifs?: number
}

const NavOption = ({ icon: Icon, title, path, open, notifs }: OptionProps) => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const isSelected = pathname === path

  return (
    <button
      onClick={() => navigate(path)}
      title={!open ? title : undefined}
      className={`relative flex h-11 w-full items-center rounded-2xl transition-all duration-200 group cursor-pointer
        ${
          isSelected
            ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold shadow-xs"
            : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200 font-medium"
        }`}
    >
      <div className="grid h-full w-12 place-content-center shrink-0">
        <Icon className={`h-4.5 w-4.5 ${isSelected ? "text-indigo-600 dark:text-indigo-400" : ""}`} />
      </div>

      {open && (
        <span className="text-sm truncate transition-opacity duration-200 opacity-100">
          {title}
        </span>
      )}

      {/* Tooltip when collapsed */}
      {!open && (
        <div className="absolute left-full ml-2 px-2.5 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 whitespace-nowrap z-50 shadow-lg">
          {title}
        </div>
      )}

      {notifs !== undefined && notifs > 0 && open && (
        <span className="absolute right-3 flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-600 dark:bg-indigo-500 text-[11px] text-white font-bold px-1.5 shadow-xs animate-fade-in">
          {notifs}
        </span>
      )}

      {notifs !== undefined && notifs > 0 && !open && (
        <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-indigo-600 ring-2 ring-white dark:ring-gray-900 animate-pulse" />
      )}
    </button>
  )
}

export const SupervisorSidebar = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [open, setOpen] = useState(true)

  const [userSession] = useLocalStorage<any>("user", {})
  const [employees] = useLocalStorage("employees", SEED_EMPLOYEES)
  const [swaps]     = useLocalStorage("swaps", SEED_SWAPS)
  const [leaves]    = useLocalStorage("leaves", SEED_LEAVES)

  // Tracking viewed notifications so pin disappears once page is opened
  const [seenSwapIds, setSeenSwapIds] = useLocalStorage<string[]>("supervisor_seen_swap_ids", [])
  const [seenLeaveIds, setSeenLeaveIds] = useLocalStorage<string[]>("supervisor_seen_leave_ids", [])

  const currentSupervisor = employees.find((e) => e.id === userSession?.id || e.nip === userSession?.nip) || userSession
  const supervisorDeptId = currentSupervisor?.departmentId ?? "dept-1"

  // Pending requests for this supervisor's department
  const pendingSwapsList = swaps.filter(
    (s) => s.departmentId === supervisorDeptId && s.peerStatus === "approved" && s.supervisorStatus === "pending"
  )
  const pendingLeavesList = leaves.filter(
    (l) => l.departmentId === supervisorDeptId && l.status === "pending"
  )

  // Mark swaps as seen when user visits /supervisor/swaps
  useEffect(() => {
    if (pathname === "/supervisor/swaps") {
      const currentPendingIds = pendingSwapsList.map((s) => s.id)
      const allSeen = Array.from(new Set([...seenSwapIds, ...currentPendingIds]))
      if (allSeen.length !== seenSwapIds.length) {
        setSeenSwapIds(allSeen)
      }
    }
  }, [pathname, pendingSwapsList, seenSwapIds])

  // Mark leaves as seen when user visits /supervisor/leaves
  useEffect(() => {
    if (pathname === "/supervisor/leaves") {
      const currentPendingIds = pendingLeavesList.map((l) => l.id)
      const allSeen = Array.from(new Set([...seenLeaveIds, ...currentPendingIds]))
      if (allSeen.length !== seenLeaveIds.length) {
        setSeenLeaveIds(allSeen)
      }
    }
  }, [pathname, pendingLeavesList, seenLeaveIds])

  // Unseen pending counts (0 if user is currently on that page or has seen all of them)
  const unreadSwapsCount = pathname === "/supervisor/swaps"
    ? 0
    : pendingSwapsList.filter((s) => !seenSwapIds.includes(s.id)).length

  const unreadLeavesCount = pathname === "/supervisor/leaves"
    ? 0
    : pendingLeavesList.filter((l) => !seenLeaveIds.includes(l.id)).length

  const navItems: NavItem[] = [
    { icon: LayoutDashboard, title: "Dashboard Unit",       path: "/supervisor/dashboard" },
    { icon: CalendarDays,    title: "Roster Builder",       path: "/supervisor/roster" },
    { icon: ArrowLeftRight,  title: "Persetujuan Tukar Sif", path: "/supervisor/swaps",  notifs: unreadSwapsCount },
    { icon: FileCheck2,      title: "Persetujuan Cuti/Izin", path: "/supervisor/leaves", notifs: unreadLeavesCount },
    { icon: FileSpreadsheet, title: "Rekapitulasi Unit",    path: "/supervisor/reports" },
  ]

  const handleLogout = () => {
    localStorage.removeItem("user")
    navigate("/login")
  }

  return (
    <nav
      className={`sticky top-0 h-screen shrink-0 border-r transition-all duration-300 ease-in-out flex flex-col z-30
        ${open ? "w-64" : "w-18"}
        border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-3 shadow-xs`}
    >
      {/* Title & Brand */}
      <div className="mb-4 border-b border-gray-100 dark:border-gray-800 pb-3">
        <div className="flex items-center gap-3 p-1">
          <div className="size-10 shrink-0 rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-indigo-200 dark:shadow-none">
            <Hospital className="h-5 w-5" />
          </div>

          {open && (
            <div className="overflow-hidden">
              <span className="block text-sm font-bold text-gray-900 dark:text-gray-100 leading-tight">
                RS MediTrack
              </span>
              <span className="block text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
                Kepala Ruangan
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Nav List */}
      <div className="space-y-1 flex-1 overflow-y-auto overflow-x-hidden pb-16">
        {open && (
          <p className="px-3 py-1.5 text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
            Operasional Unit
          </p>
        )}
        {navItems.map((item) => (
          <NavOption key={item.path} {...item} open={open} />
        ))}

        <div className="border-t border-gray-100 dark:border-gray-800 my-3 pt-3">
          <button
            onClick={handleLogout}
            title={!open ? "Keluar" : undefined}
            className="relative flex h-11 w-full items-center rounded-2xl transition-all duration-200 group cursor-pointer text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600"
          >
            <div className="grid h-full w-12 place-content-center shrink-0">
              <LogOut className="h-4.5 w-4.5" />
            </div>
            {open && <span className="text-sm font-medium">Keluar Akun</span>}
            {!open && (
              <div className="absolute left-full ml-2 px-2.5 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 whitespace-nowrap z-50">
                Keluar
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="border-t border-gray-100 dark:border-gray-800 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 flex items-center justify-center rounded-xl transition-colors cursor-pointer"
      >
        <ChevronsRight
          className={`h-4 w-4 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
        {open && <span className="text-xs font-medium ml-2">Ciutkan Menu</span>}
      </button>
    </nav>
  )
}
