import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Moon, Sun, ChevronDown, LogOut, Building2, Bell, CheckCheck, ArrowLeftRight, FileText, Menu } from "lucide-react"
import { useTheme } from "@/contexts/ThemeContext"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import { SEED_EMPLOYEES, SEED_DEPARTMENTS, SEED_SWAPS, SEED_LEAVES } from "@/data/seed"
import { POSISI_OPTIONS } from "@/data/options"
import type { ShiftSwapRequest, LeaveRequest } from "@/types"

interface SupervisorTopBarProps {
  onMenuClick?: () => void
}

export const SupervisorTopBar = ({ onMenuClick }: SupervisorTopBarProps) => {
  const navigate = useNavigate()
  const { isDark, toggleDark } = useTheme()
  const [showProfile, setShowProfile] = useState(false)
  const [showNotifs, setShowNotifs] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)
  const notifsRef = useRef<HTMLDivElement>(null)

  const [userSession] = useLocalStorage<any>("user", {})
  const [employees]   = useLocalStorage("employees", SEED_EMPLOYEES)
  const [departments] = useLocalStorage("departments", SEED_DEPARTMENTS)
  const [swaps]       = useLocalStorage<ShiftSwapRequest[]>("swaps", SEED_SWAPS)
  const [leaves]      = useLocalStorage<LeaveRequest[]>("leaves", SEED_LEAVES)
  const [readNotifIds, setReadNotifIds] = useLocalStorage<string[]>("supervisor_read_topbar_notifs", [])

  const currentSupervisor = employees.find((e) => e.id === userSession?.id || e.nip === userSession?.nip) || userSession
  const dept = departments.find((d) => d.id === currentSupervisor?.departmentId) || departments[0]
  const posisiLabel = POSISI_OPTIONS.find((p) => p.value === currentSupervisor?.posisi)?.label || "Kepala Ruangan"

  // Generate dynamic notification items from unit swaps & leaves
  const pendingSwaps = swaps.filter(
    (s) => s.departmentId === (currentSupervisor?.departmentId ?? "dept-1") && s.peerStatus === "approved" && s.supervisorStatus === "pending"
  )
  const pendingLeaves = leaves.filter(
    (l) => l.departmentId === (currentSupervisor?.departmentId ?? "dept-1") && l.status === "pending"
  )

  const notifItems = [
    ...pendingSwaps.map((s) => {
      const requester = employees.find((e) => e.id === s.requesterId)
      return {
        id: `swap-${s.id}`,
        title: "Permohonan Tukar Sif",
        desc: `${requester?.name || "Staf"} mengajukan tukar sif (${s.requesterDate})`,
        path: "/supervisor/swaps",
        type: "swap",
      }
    }),
    ...pendingLeaves.map((l) => {
      const emp = employees.find((e) => e.id === l.employeeId)
      return {
        id: `leave-${l.id}`,
        title: "Permohonan Cuti / Izin",
        desc: `${emp?.name || "Staf"} mengajukan ${l.type === "cuti" ? "cuti" : "izin"} (${l.totalDays} hari)`,
        path: "/supervisor/leaves",
        type: "leave",
      }
    }),
  ]

  const unreadItems = notifItems.filter((item) => !readNotifIds.includes(item.id))
  const unreadCount = unreadItems.length

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setShowProfile(false)
      if (notifsRef.current && !notifsRef.current.contains(e.target as Node)) setShowNotifs(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const handleToggleNotifs = () => {
    const nextState = !showNotifs
    setShowNotifs(nextState)
    setShowProfile(false)
    // Auto-clear pin when opened
    if (nextState && unreadCount > 0) {
      setReadNotifIds(notifItems.map((n) => n.id))
    }
  }

  const handleMarkAllRead = () => {
    setReadNotifIds(notifItems.map((n) => n.id))
  }

  const handleItemClick = (path: string, id: string) => {
    if (!readNotifIds.includes(id)) {
      setReadNotifIds([...readNotifIds, id])
    }
    setShowNotifs(false)
    navigate(path)
  }

  const handleLogout = () => {
    localStorage.removeItem("user")
    navigate("/login")
  }

  return (
    <header className="h-16 shrink-0 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex items-center justify-between px-3 sm:px-6 shadow-xs z-10">
      {/* Left: Hamburger (mobile) + Unit Room Badge */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="md:hidden flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
            title="Buka Menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}
        <div className="hidden sm:flex p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
          <Building2 className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <span className="text-xs font-bold text-gray-900 dark:text-gray-100 flex items-center gap-1.5 truncate">
            {dept?.name}
          </span>
          <p className="hidden sm:block text-[11px] text-gray-400">
            {new Date().toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
      </div>

      {/* Right: Controls */}
      <div className="flex items-center gap-2">
        {/* Dark mode */}
        <button
          onClick={toggleDark}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
          title={isDark ? "Mode Terang" : "Mode Gelap"}
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        {/* Notifications */}
        <div ref={notifsRef} className="relative">
          <button
            onClick={handleToggleNotifs}
            className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
            title="Notifikasi Operasional"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-4 min-w-4 px-1 flex items-center justify-center rounded-full bg-indigo-600 text-white text-[10px] font-bold ring-2 ring-white dark:ring-gray-900 animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifs && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl z-50 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Notifikasi Unit</h3>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 text-[10px] font-bold">
                      {unreadCount} baru
                    </span>
                  )}
                </div>
                <button
                  onClick={handleMarkAllRead}
                  className="text-xs text-indigo-600 dark:text-indigo-400 font-medium cursor-pointer hover:underline flex items-center gap-1"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  Tandai dibaca
                </button>
              </div>

              <div className="divide-y divide-gray-50 dark:divide-gray-800 max-h-72 overflow-y-auto">
                {notifItems.length === 0 ? (
                  <div className="p-6 text-center text-xs text-gray-400">
                    Tidak ada permohonan baru yang menunggu persetujuan 🎉
                  </div>
                ) : (
                  notifItems.map((n) => {
                    const isUnread = !readNotifIds.includes(n.id)
                    return (
                      <div
                        key={n.id}
                        onClick={() => handleItemClick(n.path, n.id)}
                        className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 ${
                          isUnread ? "bg-indigo-50/40 dark:bg-indigo-900/10" : ""
                        }`}
                      >
                        <div className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 mt-0.5">
                          {n.type === "swap" ? (
                            <ArrowLeftRight className="w-3.5 h-3.5" />
                          ) : (
                            <FileText className="w-3.5 h-3.5" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs ${isUnread ? "font-bold text-gray-900 dark:text-gray-100" : "font-medium text-gray-700 dark:text-gray-300"}`}>
                            {n.title}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">{n.desc}</p>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => {
              setShowProfile((p) => !p)
              setShowNotifs(false)
            }}
            className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
          >
            <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
              {currentSupervisor?.name?.charAt(0) || "S"}
            </div>
            <div className="text-left hidden sm:block max-w-[140px]">
              <p className="text-xs font-semibold text-gray-900 dark:text-gray-100 truncate">
                {currentSupervisor?.name || "Supervisor"}
              </p>
              <p className="text-[11px] text-indigo-600 dark:text-indigo-400 leading-tight truncate">
                {posisiLabel}
              </p>
            </div>
            <ChevronDown className={`h-3.5 w-3.5 text-gray-400 transition-transform duration-200 ${showProfile ? "rotate-180" : ""}`} />
          </button>

          {showProfile && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{currentSupervisor?.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{currentSupervisor?.email}</p>
                <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-medium rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300">
                  Kepala Ruangan ({dept?.name})
                </span>
              </div>
              <div className="p-1">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2.5 w-full px-3 py-2 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  Keluar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
