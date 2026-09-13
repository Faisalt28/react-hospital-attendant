import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { SignIn } from "@/components/ui/sign-in"
import { loginViaD1, syncFromD1 } from "@/api/client"

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

    // Jika Cloudflare D1 mengembalikan pesan error (NIP tidak ditemukan atau kata sandi salah)
    if (d1Result.data?.error) {
      setError(d1Result.data.error)
      setIsLoading(false)
      return
    }

    // Jika terjadi kegagalan jaringan atau server backend offline
    if (!d1Result.ok) {
      setError(d1Result.error || "Gagal terhubung ke Cloudflare D1. Pastikan koneksi internet aktif.")
      setIsLoading(false)
      return
    }

    setError("Autentikasi gagal. Silakan coba lagi.")
    setIsLoading(false)
  }

  return <SignIn onSignIn={handleSignIn} isLoading={isLoading} error={error} />
}

export { LoginPage }
