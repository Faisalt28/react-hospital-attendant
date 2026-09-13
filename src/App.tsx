import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { ThemeProvider } from "@/contexts/ThemeContext"

// Auth pages
import { LoginPage }          from "@/pages/LoginPage"
import { ChangePasswordPage } from "@/pages/ChangePasswordPage"

// Guards & Layouts
import { ProtectedRoute }  from "@/components/ProtectedRoute"
import { AdminLayout }     from "@/components/layout/AdminLayout"
import { EmployeeLayout }  from "@/components/layout/EmployeeLayout"

// Admin pages
import { AdminDashboard }  from "@/pages/admin/AdminDashboard"
import { EmployeesPage }   from "@/pages/admin/EmployeesPage"
import { DepartmentsPage } from "@/pages/admin/DepartmentsPage"
import { SchedulePage }    from "@/pages/admin/SchedulePage"
import { AttendancePage }  from "@/pages/admin/AttendancePage"
import { LeavePage }       from "@/pages/admin/LeavePage"
import { ReportsPage }     from "@/pages/admin/ReportsPage"
import { SettingsPage }    from "@/pages/admin/SettingsPage"

// Employee pages
import { EmployeeDashboard }    from "@/pages/employee/EmployeeDashboard"
import { EmployeeSchedulePage } from "@/pages/employee/EmployeeSchedulePage"
import { EmployeeSwapPage }     from "@/pages/employee/EmployeeSwapPage"
import { EmployeeLeavesPage }   from "@/pages/employee/EmployeeLeavesPage"
import { EmployeeHistoryPage }  from "@/pages/employee/EmployeeHistoryPage"

// Supervisor pages & Layout
import { SupervisorLayout }             from "@/components/layout/SupervisorLayout"
import { SupervisorDashboard }          from "@/pages/supervisor/SupervisorDashboard"
import { SupervisorRosterPage }         from "@/pages/supervisor/SupervisorRosterPage"
import { SupervisorShiftsPage }         from "@/pages/supervisor/SupervisorShiftsPage"
import { SupervisorSwapApprovalsPage }  from "@/pages/supervisor/SupervisorSwapApprovalsPage"
import { SupervisorLeaveApprovalsPage } from "@/pages/supervisor/SupervisorLeaveApprovalsPage"
import { SupervisorUnitReportsPage }    from "@/pages/supervisor/SupervisorUnitReportsPage"

// Public Landing Page
import { LandingPage } from "@/pages/LandingPage"

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* ── Public ── */}
          <Route path="/"                element={<LandingPage />} />
          <Route path="/login"           element={<LoginPage />} />
          <Route path="/change-password" element={<ChangePasswordPage />} />

          {/* ── Admin (nested layout) ── */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin", "hrd"]}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard"   element={<AdminDashboard />} />
            <Route path="employees"   element={<EmployeesPage />} />
            <Route path="departments" element={<DepartmentsPage />} />
            <Route path="shifts"      element={<SupervisorShiftsPage />} />
            <Route path="schedule"    element={<SchedulePage />} />
            <Route path="attendance"  element={<AttendancePage />} />
            <Route path="leaves"      element={<LeavePage />} />
            <Route path="reports"     element={<ReportsPage />} />
            <Route path="settings"    element={<SettingsPage />} />
          </Route>

          {/* ── Employee Portal (nested layout) ── */}
          <Route
            path="/employee"
            element={
              <ProtectedRoute allowedRoles={["employee", "supervisor", "admin", "hrd"]}>
                <EmployeeLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<EmployeeDashboard />} />
            <Route path="schedule"  element={<EmployeeSchedulePage />} />
            <Route path="swap"      element={<EmployeeSwapPage />} />
            <Route path="leaves"    element={<EmployeeLeavesPage />} />
            <Route path="history"   element={<EmployeeHistoryPage />} />
          </Route>

          {/* ── Supervisor (nested layout) ── */}
          <Route
            path="/supervisor"
            element={
              <ProtectedRoute allowedRoles={["supervisor"]}>
                <SupervisorLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<SupervisorDashboard />} />
            <Route path="roster"    element={<SupervisorRosterPage />} />
            <Route path="shifts"    element={<SupervisorShiftsPage />} />
            <Route path="swaps"     element={<SupervisorSwapApprovalsPage />} />
            <Route path="leaves"    element={<SupervisorLeaveApprovalsPage />} />
            <Route path="reports"   element={<SupervisorUnitReportsPage />} />
          </Route>

          {/* ── Catch-all ── */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
