import { Outlet } from "react-router-dom"
import { AdminSidebar } from "./AdminSidebar"
import { TopBar } from "./TopBar"

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen w-full bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <AdminSidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export { AdminLayout }
