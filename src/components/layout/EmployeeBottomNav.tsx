import { useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Home, CalendarDays, ArrowLeftRight, FileText, History } from "lucide-react"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import { SEED_SWAPS, SEED_EMPLOYEES } from "@/data/seed"
import type { ShiftSwapRequest, Employee } from "@/types"

export const EmployeeBottomNav = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const [userSession] = useLocalStorage<any>("user", {})
  const [employees] = useLocalStorage<Employee[]>("employees", SEED_EMPLOYEES)
  const [swaps] = useLocalStorage<ShiftSwapRequest[]>("swaps", SEED_SWAPS)
  const [seenEmpSwapIds, setSeenEmpSwapIds] = useLocalStorage<string[]>("employee_seen_swap_ids", [])

  const currentEmp = employees.find((e) => e.id === userSession?.id || e.nip === userSession?.nip) || userSession

  // Incoming swap requests targeted to this employee waiting for their confirmation
  const incomingSwaps = swaps.filter(
    (s) => s.targetId === currentEmp?.id && s.peerStatus === "pending"
  )

  // When visiting /employee/swap, mark them as seen
  useEffect(() => {
    if (location.pathname === "/employee/swap") {
      const incomingIds = incomingSwaps.map((s) => s.id)
      const allSeen = Array.from(new Set([...seenEmpSwapIds, ...incomingIds]))
      if (allSeen.length !== seenEmpSwapIds.length) {
        setSeenEmpSwapIds(allSeen)
      }
    }
  }, [location.pathname, incomingSwaps, seenEmpSwapIds, setSeenEmpSwapIds])

  const unreadSwapCount = location.pathname === "/employee/swap"
    ? 0
    : incomingSwaps.filter((s) => !seenEmpSwapIds.includes(s.id)).length

  const navItems = [
    { icon: Home,           label: "Beranda",     path: "/employee/dashboard" },
    { icon: CalendarDays,   label: "Jadwal",      path: "/employee/schedule" },
    { icon: ArrowLeftRight, label: "Tukar Shift", path: "/employee/swap", notifs: unreadSwapCount },
    { icon: FileText,       label: "Cuti & Izin", path: "/employee/leaves" },
    { icon: History,        label: "Riwayat",     path: "/employee/history" },
  ]

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 px-2 py-1.5 shadow-lg">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          const Icon = item.icon
          const hasNotif = (item.notifs ?? 0) > 0

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`relative flex flex-col items-center py-1 px-3 rounded-2xl transition-all cursor-pointer ${
                isActive
                  ? "text-emerald-600 dark:text-emerald-400 font-semibold"
                  : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              }`}
            >
              <div
                className={`relative p-1 rounded-xl transition-transform ${
                  isActive ? "bg-emerald-50 dark:bg-emerald-950/50 scale-110" : ""
                }`}
              >
                <Icon className="h-5 w-5" />
                {hasNotif && (
                  <span className="absolute -top-1 -right-1 h-3.5 w-3.5 bg-rose-500 rounded-full text-[9px] text-white font-bold flex items-center justify-center ring-2 ring-white dark:ring-gray-900 animate-pulse">
                    {item.notifs}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
