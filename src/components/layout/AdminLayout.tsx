import { useState } from "react"
import { Outlet } from "react-router-dom"
import { AdminSidebar } from "./AdminSidebar"
import { TopBar } from "./TopBar"

const AdminLayout = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen w-full bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <AdminSidebar
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopBar onMenuClick={() => setMobileSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export { AdminLayout }
