import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { SignIn } from "@/components/ui/sign-in"
import { SEED_EMPLOYEES } from "@/data/seed"
import type { Employee } from "@/types"

const LoginPage = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSignIn = async (rawNip: string, rawPassword: string) => {
    setIsLoading(true)
    setError("")

    const nip = rawNip.trim().toUpperCase()
    const password = rawPassword.trim()

    // Simulate short network delay
    await new Promise((r) => setTimeout(r, 400))

    // Load employees with robust fallback
    let employees: Employee[] = []
    try {
      const stored = localStorage.getItem("employees")
      if (stored) {
        const parsed = JSON.parse(stored) as Employee[]
        if (Array.isArray(parsed) && parsed.length > 0) {
          employees = parsed
        } else {
          employees = SEED_EMPLOYEES
          localStorage.setItem("employees", JSON.stringify(SEED_EMPLOYEES))
        }
      } else {
        employees = SEED_EMPLOYEES
        localStorage.setItem("employees", JSON.stringify(SEED_EMPLOYEES))
      }
    } catch {
      employees = SEED_EMPLOYEES
      localStorage.setItem("employees", JSON.stringify(SEED_EMPLOYEES))
    }

    // Pastikan akun master Admin HRD selalu terdaftar
    const hasAdmin = employees.some(
      (e) => (e.nip && e.nip.toUpperCase() === "HRD-2020-001") || e.id === "emp-1"
    )
    if (!hasAdmin) {
      employees = [SEED_EMPLOYEES[0], ...employees]
      localStorage.setItem("employees", JSON.stringify(employees))
    }

    // Cari akun berdasarkan NIP (case-insensitive) & password
    let emp = employees.find(
      (e) =>
        e.nip &&
        e.nip.trim().toUpperCase() === nip &&
        e.password === password &&
        e.isActive
    )


    if (!emp) {
      setError("NIP atau password tidak cocok. Pastikan NIP dan password sudah benar.")
      setIsLoading(false)
      return
    }

    // Save session
    localStorage.setItem(
      "user",
      JSON.stringify({
        id: emp.id,
        nip: emp.nip,
        name: emp.name,
        email: emp.email,
        role: emp.role,
        departmentId: emp.departmentId,
        isFirstLogin: emp.isFirstLogin,
      })
    )

    // First login → force change password
    if (emp.isFirstLogin) {
      navigate("/change-password")
      setIsLoading(false)
      return
    }

    // Redirect by role
    const roleRoutes: Record<string, string> = {
      admin:      "/admin/dashboard",
      hrd:        "/admin/dashboard",
      supervisor: "/supervisor/dashboard",
      employee:   "/employee/dashboard",
    }
    navigate(roleRoutes[emp.role] ?? "/admin/dashboard")
    setIsLoading(false)
  }

  return <SignIn onSignIn={handleSignIn} isLoading={isLoading} error={error} />
}

export { LoginPage }
