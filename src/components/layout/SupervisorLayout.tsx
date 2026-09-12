import { Outlet } from "react-router-dom"
import { SupervisorSidebar } from "./SupervisorSidebar"
import { SupervisorTopBar } from "./SupervisorTopBar"

export const SupervisorLayout = () => {
  return (
    <div className="flex min-h-screen w-full bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <SupervisorSidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <SupervisorTopBar />
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
