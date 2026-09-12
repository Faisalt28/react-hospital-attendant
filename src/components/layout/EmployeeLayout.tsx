import { Outlet, useLocation, useNavigate } from "react-router-dom"
import { EmployeeHeader } from "./EmployeeHeader"
import { EmployeeBottomNav } from "./EmployeeBottomNav"
import { Home, CalendarDays, ArrowLeftRight, FileText, History } from "lucide-react"

const DESKTOP_NAV = [
  { icon: Home,           label: "Beranda & Absensi",  path: "/employee/dashboard" },
  { icon: CalendarDays,   label: "Jadwal Dinas Saya",  path: "/employee/schedule" },
  { icon: ArrowLeftRight, label: "Tukar Shift",        path: "/employee/swap" },
  { icon: FileText,       label: "Cuti & Izin",        path: "/employee/leaves" },
  { icon: History,        label: "Riwayat Presensi",   path: "/employee/history" },
]

export const EmployeeLayout = () => {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex flex-col pb-20 md:pb-6">
      <EmployeeHeader />

      <div className="flex-1 max-w-6xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-6 md:grid md:grid-cols-12 md:gap-6">
        {/* Desktop Sidebar Navigation */}
        <aside className="hidden md:block md:col-span-3">
          <div className="sticky top-22 bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-3 shadow-xs space-y-1">
            <p className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-gray-400">
              Menu Staf
            </p>
            {DESKTOP_NAV.map((item) => {
              const isActive = location.pathname === item.path
              const Icon = item.icon
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center gap-3 w-full px-3.5 py-2.5 rounded-2xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-semibold shadow-xs"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="md:col-span-9 min-w-0">
          <Outlet />
        </main>
      </div>

      {/* Bottom Nav for Mobile */}
      <div className="md:hidden">
        <EmployeeBottomNav />
      </div>
    </div>
  )
}
