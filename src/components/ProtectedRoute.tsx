import { Navigate } from "react-router-dom"

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: string[]
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const stored = localStorage.getItem("user")

  if (!stored) {
    return <Navigate to="/login" replace />
  }

  const user = JSON.parse(stored) as {
    id: string; nip: string; name: string; email: string
    role: string; departmentId: string; isFirstLogin: boolean
  }

  // First login — force change password before accessing any dashboard
  if (user.isFirstLogin) {
    return <Navigate to="/change-password" replace />
  }

  // Role guard — redirect to correct dashboard if wrong role
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const roleRedirects: Record<string, string> = {
      admin:      "/admin/dashboard",
      hrd:        "/admin/dashboard",
      supervisor: "/supervisor/dashboard",
      employee:   "/employee/dashboard",
    }
    return <Navigate to={roleRedirects[user.role] ?? "/login"} replace />
  }

  return <>{children}</>
}

export { ProtectedRoute }
