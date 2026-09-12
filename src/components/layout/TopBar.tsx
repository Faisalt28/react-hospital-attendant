import { useState, useRef, useEffect, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { Bell, Moon, Sun, User, ChevronDown, LogOut, Settings, CheckCheck, Menu } from "lucide-react"
import { useTheme } from "@/contexts/ThemeContext"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import { SEED_EMPLOYEES, SEED_LEAVES, SEED_SWAPS } from "@/data/seed"
import { POSISI_OPTIONS } from "@/data/options"
import type { LeaveRequest, ShiftSwapRequest } from "@/types"

// ─── TopBar ───────────────────────────────────────────────────────────────────

interface TopBarProps {
  onMenuClick?: () => void
}

const TopBar = ({ onMenuClick }: TopBarProps) => {
  const navigate = useNavigate()
  const { isDark, toggleDark } = useTheme()
  const [showNotifs, setShowNotifs] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const notifsRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)

  const [userSession] = useLocalStorage<any>("user", {
    name: "Admin HRD",
    email: "admin@rsmeditrack.com",
    role: "admin",
  })
  const [employees] = useLocalStorage("employees", SEED_EMPLOYEES)
  const [leaves]    = useLocalStorage<LeaveRequest[]>("leaves", SEED_LEAVES)
  const [swaps]     = useLocalStorage<ShiftSwapRequest[]>("swaps", SEED_SWAPS)
  const [readNotifIds, setReadNotifIds] = useLocalStorage<string[]>("read_notification_ids", [])

  // Ambil data profil terbaru dari daftar pegawai
  const currentEmp = employees.find((e) => e.id === userSession?.id || e.nip === userSession?.nip) || userSession

  // Dynamic notifications dari permohonan staf yang masuk
  const dynamicNotifs = useMemo(() => {
    const pendingLeaves = leaves.filter((l) => l.status === "pending")
    const pendingSwaps = swaps.filter((s) => s.supervisorStatus === "pending")
    return [
      ...pendingLeaves.map((l) => {
        const emp = employees.find((e) => e.id === l.employeeId)
        return {
          id: `leave-${l.id}`,
          title: `Pengajuan ${l.type === "cuti" ? "Cuti" : l.type === "sakit" ? "Sakit" : "Izin"}`,
          desc: `${emp?.name || "Staf"} mengajukan ${l.type} (${l.totalDays} hari)`,
          time: "Menunggu persetujuan",
          path: "/admin/leaves",
        }
      }),
      ...pendingSwaps.map((s) => {
        const emp = employees.find((e) => e.id === s.requesterId)
        return {
          id: `swap-${s.id}`,
          title: "Pengajuan Tukar Sif",
          desc: `${emp?.name || "Staf"} mengajukan tukar dinas`,
          time: "Menunggu persetujuan",
          path: "/admin/schedule",
        }
      }),
    ]
  }, [leaves, swaps, employees])

  const unreadNotifs = dynamicNotifs.filter((n) => !readNotifIds.includes(n.id))
  const unreadCount = unreadNotifs.length

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifsRef.current && !notifsRef.current.contains(e.target as Node)) setShowNotifs(false)
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setShowProfile(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const handleMarkAllAsRead = () => {
    setReadNotifIds(dynamicNotifs.map((n) => n.id))
  }

  const handleNotifClick = (item: { id: string; path?: string }) => {
    if (!readNotifIds.includes(item.id)) {
      setReadNotifIds([...readNotifIds, item.id])
    }
    if (item.path) {
      setShowNotifs(false)
      navigate(item.path)
    }
  }

  const handleToggleNotifs = () => {
    const nextState = !showNotifs
    setShowNotifs(nextState)
    setShowProfile(false)
    // Jika dibuka, otomatis tandai semua telah dilihat sehingga pin angka hilang
    if (nextState && unreadCount > 0) {
      setReadNotifIds(dynamicNotifs.map((n) => n.id))
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("user")
    navigate("/login")
  }

  const roleLabel =
    currentEmp?.role === "admin"
      ? "Admin HRD"
      : currentEmp?.role === "hrd"
      ? "Staf HRD"
      : currentEmp?.role === "supervisor"
      ? "Supervisor"
      : "Pegawai"

  const posisiLabel =
    POSISI_OPTIONS.find((p) => p.value === currentEmp?.posisi)?.label || roleLabel

  return (
    <header className="h-16 shrink-0 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex items-center justify-between px-3 sm:px-6 shadow-xs z-10">
      {/* Left: Hamburger (mobile) + Date / Title */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="md:hidden flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
            title="Buka Menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}
        <p className="hidden sm:block text-xs text-gray-400 dark:text-gray-500">
          {new Date().toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
        <span className="sm:hidden text-xs font-bold text-gray-800 dark:text-gray-200">
          Admin HRD
        </span>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Dark mode toggle */}
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
            title="Notifikasi"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-4 min-w-4 px-1 flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold ring-2 ring-white dark:ring-gray-900 animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifs && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl shadow-gray-200/50 dark:shadow-gray-900/50 z-50 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Notifikasi</h3>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.5 rounded-md bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 text-[10px] font-bold">
                      {unreadCount} baru
                    </span>
                  )}
                </div>
                {dynamicNotifs.length > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-xs text-blue-600 dark:text-blue-400 font-medium cursor-pointer hover:underline flex items-center gap-1"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    Tandai dibaca
                  </button>
                )}
              </div>
              <div className="divide-y divide-gray-50 dark:divide-gray-800 max-h-72 overflow-y-auto">
                {dynamicNotifs.length === 0 ? (
                  <div className="py-8 text-center text-xs text-gray-400">
                    Tidak ada notifikasi baru 🎉
                  </div>
                ) : (
                  dynamicNotifs.map((n) => {
                    const isUnread = !readNotifIds.includes(n.id)
                    return (
                      <div
                        key={n.id}
                        onClick={() => handleNotifClick(n)}
                        className={`flex gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 ${
                          isUnread ? "bg-blue-50/50 dark:bg-blue-900/10" : ""
                        }`}
                      >
                        <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${isUnread ? "bg-blue-500" : "bg-transparent"}`} />
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs ${isUnread ? "font-bold text-gray-900 dark:text-gray-100" : "font-medium text-gray-700 dark:text-gray-300"}`}>
                            {n.title}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">{n.desc}</p>
                          <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">{n.time}</p>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
              <div className="px-4 py-2.5 border-t border-gray-100 dark:border-gray-800 text-center bg-gray-50/50 dark:bg-gray-800/40">
                <span className="text-[11px] text-gray-400">
                  Notifikasi otomatis diperbarui
                </span>
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
            <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <User className="h-3.5 w-3.5 text-white" />
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-xs font-semibold text-gray-900 dark:text-gray-100 leading-tight truncate max-w-[120px]">
                {currentEmp?.name || "Admin HRD"}
              </p>
              <p className="text-[11px] text-blue-500 dark:text-blue-400 leading-tight truncate max-w-[120px]">
                {posisiLabel}
              </p>
            </div>
            <ChevronDown className={`h-3.5 w-3.5 text-gray-400 transition-transform duration-200 ${showProfile ? "rotate-180" : ""}`} />
          </button>

          {showProfile && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{currentEmp?.name || "Admin HRD"}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{currentEmp?.email}</p>
                <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-medium rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                  {posisiLabel} ({roleLabel})
                </span>
              </div>
              <div className="p-1">
                <button
                  onClick={() => navigate("/admin/settings")}
                  className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors cursor-pointer"
                >
                  <Settings className="h-4 w-4" />
                  Pengaturan
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors cursor-pointer"
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

export { TopBar }
