import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { SignIn } from "@/components/ui/sign-in"
import { SEED_EMPLOYEES } from "@/data/seed"
import { loginViaD1, syncFromD1 } from "@/api/client"
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

    // 1. Coba login langsung ke backend Cloudflare D1
    const d1Result = await loginViaD1(nip, password)
    if (d1Result.ok && d1Result.data?.success && d1Result.data?.user) {
      const user = d1Result.data.user
      localStorage.setItem("user", JSON.stringify(user))

      // Sinkronkan seluruh data terbaru dari D1 ke perangkat ini
      await syncFromD1()

      // First login → force change password
      if (user.isFirstLogin) {
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
      navigate(roleRoutes[user.role] ?? "/admin/dashboard")
      setIsLoading(false)
      return
    }

    // Jika D1 mengembalikan error autentikasi yang jelas (bukan network error)
    if (d1Result.data?.error) {
      setError(d1Result.data.error)
      setIsLoading(false)
      return
    }

    // 2. Fallback offline jika koneksi ke Cloudflare terputus
    let employees: Employee[] = []
    try {
      const stored = localStorage.getItem("employees")
      employees = stored ? JSON.parse(stored) : SEED_EMPLOYEES
    } catch {
      employees = SEED_EMPLOYEES
    }

    const emp = employees.find(
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

    if (emp.isFirstLogin) {
      navigate("/change-password")
      setIsLoading(false)
      return
    }

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
