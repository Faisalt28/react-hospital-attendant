import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Moon, Sun, LogOut, Hospital, ChevronDown } from "lucide-react"
import { useTheme } from "@/contexts/ThemeContext"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import { SEED_EMPLOYEES } from "@/data/seed"
import { POSISI_OPTIONS } from "@/data/options"

export const EmployeeHeader = () => {
  const navigate = useNavigate()
  const { isDark, toggleDark } = useTheme()
  const [showProfile, setShowProfile] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)

  const [userSession] = useLocalStorage<any>("user", {})
  const [employees] = useLocalStorage("employees", SEED_EMPLOYEES)

  const currentEmp = employees.find((e) => e.id === userSession?.id || e.nip === userSession?.nip) || userSession
  const posisiLabel = POSISI_OPTIONS.find((p) => p.value === currentEmp?.posisi)?.label || "Staf Medis"

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfile(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("user")
    navigate("/login")
  }

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between shadow-xs">
      {/* Brand & Logo */}
      <div className="flex items-center gap-3">
        <div className="size-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-200/50 dark:shadow-none shrink-0">
          <Hospital className="h-5 w-5" />
        </div>
        <div>
          <span className="block text-sm font-bold text-gray-900 dark:text-gray-100 leading-tight">
            RS MediTrack
          </span>
          <span className="block text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            Portal Pegawai
          </span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        {/* Dark mode */}
        <button
          onClick={toggleDark}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          title={isDark ? "Mode Terang" : "Mode Gelap"}
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        {/* If user is Supervisor or Admin, show quick switch back to Supervisor / Admin Panel */}
        {currentEmp?.role === "supervisor" && (
          <button
            onClick={() => navigate("/supervisor/dashboard")}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-xs font-semibold transition-colors cursor-pointer"
            title="Kembali ke Panel Supervisor Ruangan"
          >
            <Hospital className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Panel Supervisor</span>
          </button>
        )}

        {(currentEmp?.role === "admin" || currentEmp?.role === "hrd") && (
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-xs font-semibold transition-colors cursor-pointer"
            title="Kembali ke Dashboard Admin HRD"
          >
            <Hospital className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
            <span>Panel Admin</span>
          </button>
        )}

        {/* Profile */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => setShowProfile((p) => !p)}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
          >
            <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-xs font-bold">
              {currentEmp?.name ? currentEmp.name.charAt(0) : "P"}
            </div>
            <div className="text-left hidden sm:block max-w-[130px]">
              <p className="text-xs font-semibold text-gray-900 dark:text-gray-100 truncate">
                {currentEmp?.name || "Pegawai"}
              </p>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 truncate">
                {posisiLabel}
              </p>
            </div>
            <ChevronDown className={`h-3.5 w-3.5 text-gray-400 transition-transform ${showProfile ? "rotate-180" : ""}`} />
          </button>

          {showProfile && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{currentEmp?.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">{currentEmp?.nip}</p>
                <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-medium rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
                  {posisiLabel}
                </span>
              </div>
              <div className="p-1">
                {currentEmp?.role === "supervisor" && (
                  <button
                    onClick={() => navigate("/supervisor/dashboard")}
                    className="flex items-center gap-2.5 w-full px-3 py-2 text-xs font-semibold text-indigo-700 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded-xl transition-colors cursor-pointer"
                  >
                    <Hospital className="h-4 w-4" />
                    Panel Supervisor Ruangan
                  </button>
                )}
                {(currentEmp?.role === "admin" || currentEmp?.role === "hrd") && (
                  <button
                    onClick={() => navigate("/admin/dashboard")}
                    className="flex items-center gap-2.5 w-full px-3 py-2 text-xs font-semibold text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-colors cursor-pointer"
                  >
                    <Hospital className="h-4 w-4" />
                    Panel Admin HRD
                  </button>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2.5 w-full px-3 py-2 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  Keluar Akun
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
