import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import {
  Home,
  Users,
  Building2,
  ClipboardList,
  BarChart3,
  Settings,
  LogOut,
  ChevronDown,
  ChevronsRight,
  Hospital,
} from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

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

// ─── Nav Items ────────────────────────────────────────────────────────────────

const MAIN_NAV: NavItem[] = [
  { icon: Home,          title: "Dashboard",            path: "/admin/dashboard" },
  { icon: Users,         title: "Master Data Pegawai",  path: "/admin/employees" },
  { icon: Building2,     title: "Master Departemen",    path: "/admin/departments" },
  { icon: ClipboardList, title: "Monitoring Presensi",  path: "/admin/attendance" },
  { icon: BarChart3,     title: "Laporan & Export",     path: "/admin/reports" },
]

const BOTTOM_NAV: NavItem[] = [
  { icon: Settings, title: "Pengaturan", path: "/admin/settings" },
]

// ─── Sub-components ───────────────────────────────────────────────────────────

interface NavOptionProps extends OptionProps {
  onMobileClose?: () => void
}

const NavOption = ({ icon: Icon, title, path, open, notifs, onMobileClose }: NavOptionProps) => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const isSelected = pathname === path

  const handleClick = () => {
    navigate(path)
    if (onMobileClose) {
      onMobileClose()
    }
  }

  return (
    <button
      onClick={handleClick}
      title={!open ? title : undefined}
      className={`relative flex h-11 w-full items-center rounded-xl transition-all duration-200 group cursor-pointer
        ${isSelected
          ? "bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 shadow-sm border-l-2 border-blue-500 font-semibold"
          : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200"
        }`}
    >
      <div className="grid h-full w-12 place-content-center shrink-0">
        <Icon className="h-4 w-4" />
      </div>

      {open && (
        <span className="text-sm font-medium truncate transition-opacity duration-200 opacity-100">
          {title}
        </span>
      )}

      {/* Tooltip when collapsed */}
      {!open && (
        <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-md
          opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 whitespace-nowrap z-50">
          {title}
        </div>
      )}

      {notifs !== undefined && open && (
        <span className="absolute right-3 flex h-5 min-w-5 items-center justify-center rounded-full
          bg-blue-500 dark:bg-blue-600 text-xs text-white font-medium px-1">
          {notifs}
        </span>
      )}

      {notifs !== undefined && !open && (
        <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-blue-500" />
      )}
    </button>
  )
}

const TitleSection = ({ open, onMobileClose }: { open: boolean; onMobileClose?: () => void }) => (
  <div className="mb-4 border-b border-gray-200 dark:border-gray-800 pb-4">
    <div className="flex items-center justify-between rounded-md p-1.5">
      <div className="flex items-center gap-3">
        {/* Logo */}
        <div className="grid size-10 shrink-0 place-content-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-md">
          <Hospital className="h-5 w-5 text-white" />
        </div>

        {open && (
          <div className="transition-opacity duration-200 opacity-100 overflow-hidden">
            <span className="block text-sm font-bold text-gray-900 dark:text-gray-100 leading-tight">
              RS MediTrack
            </span>
            <span className="block text-xs text-blue-500 dark:text-blue-400 font-medium">
              Admin HRD
            </span>
          </div>
        )}
      </div>

      {onMobileClose ? (
        <button
          onClick={onMobileClose}
          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
          title="Tutup Menu"
        >
          <ChevronsRight className="h-5 w-5 rotate-180" />
        </button>
      ) : open ? (
        <ChevronDown className="h-4 w-4 text-gray-400 dark:text-gray-500 shrink-0" />
      ) : null}
    </div>
  </div>
)

const ToggleClose = ({ open, setOpen }: { open: boolean; setOpen: (v: boolean) => void }) => (
  <button
    onClick={() => setOpen(!open)}
    className="absolute bottom-0 left-0 right-0 border-t border-gray-200 dark:border-gray-800
      transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
  >
    <div className="flex items-center p-3">
      <div className="grid size-10 place-content-center shrink-0">
        <ChevronsRight
          className={`h-4 w-4 transition-transform duration-300 text-gray-500 dark:text-gray-400
            ${open ? "rotate-180" : ""}`}
        />
      </div>
      {open && (
        <span className="text-sm font-medium text-gray-600 dark:text-gray-300 transition-opacity duration-200 opacity-100">
          Sembunyikan
        </span>
      )}
    </div>
  </button>
)

// ─── Main Sidebar ─────────────────────────────────────────────────────────────

interface AdminSidebarProps {
  mobileOpen?: boolean
  onMobileClose?: () => void
}

const AdminSidebar = ({ mobileOpen = false, onMobileClose }: AdminSidebarProps) => {
  const navigate = useNavigate()
  const [open, setOpen] = useState(true)

  const handleLogout = () => {
    localStorage.removeItem("user")
    if (onMobileClose) onMobileClose()
    navigate("/login")
  }

  const renderContent = (isMobileView: boolean) => (
    <>
      <TitleSection open={isMobileView ? true : open} onMobileClose={isMobileView ? onMobileClose : undefined} />

      {/* Main nav */}
      <div className="space-y-1 flex-1 overflow-y-auto overflow-x-hidden pb-16">
        {(isMobileView || open) && (
          <p className="px-3 py-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
            Menu Utama
          </p>
        )}
        {MAIN_NAV.map((item) => (
          <NavOption
            key={item.path}
            {...item}
            open={isMobileView ? true : open}
            onMobileClose={isMobileView ? onMobileClose : undefined}
          />
        ))}

        <div className="border-t border-gray-200 dark:border-gray-800 my-2 pt-2">
          {(isMobileView || open) && (
            <p className="px-3 py-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
              Sistem
            </p>
          )}
          {BOTTOM_NAV.map((item) => (
            <NavOption
              key={item.path}
              {...item}
              open={isMobileView ? true : open}
              onMobileClose={isMobileView ? onMobileClose : undefined}
            />
          ))}

          {/* Logout */}
          <button
            onClick={handleLogout}
            title={!isMobileView && !open ? "Keluar" : undefined}
            className="relative flex h-11 w-full items-center rounded-xl transition-all duration-200 group cursor-pointer
              text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600"
          >
            <div className="grid h-full w-12 place-content-center shrink-0">
              <LogOut className="h-4 w-4" />
            </div>
            {(isMobileView || open) && <span className="text-sm font-medium">Keluar</span>}
            {!isMobileView && !open && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-md
                opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 whitespace-nowrap z-50">
                Keluar
              </div>
            )}
          </button>
        </div>
      </div>

      {!isMobileView && <ToggleClose open={open} setOpen={setOpen} />}
    </>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <nav
        className={`hidden md:flex sticky top-0 h-screen shrink-0 border-r transition-all duration-300 ease-in-out flex-col
          ${open ? "w-64" : "w-16"}
          border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-2 shadow-sm`}
      >
        {renderContent(false)}
      </nav>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={onMobileClose}
          />
          <nav className="fixed inset-y-0 left-0 w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 p-3 shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
            {renderContent(true)}
          </nav>
        </div>
      )}
    </>
  )
}

export { AdminSidebar }
