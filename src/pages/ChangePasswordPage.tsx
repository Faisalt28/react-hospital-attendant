import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Lock, Eye, EyeOff, ShieldCheck, Hospital, CheckCircle2 } from "lucide-react"
import type { Employee } from "@/types"
import { SEED_EMPLOYEES } from "@/data/seed"

// Password strength calculator
const getStrength = (p: string) => {
  if (!p) return 0
  let s = 0
  if (p.length >= 8) s++
  if (/[A-Z]/.test(p)) s++
  if (/[0-9]/.test(p)) s++
  if (/[^A-Za-z0-9]/.test(p)) s++
  return s
}

const STRENGTH_CONFIG = [
  { label: "Lemah",   color: "bg-red-400",    text: "text-red-500" },
  { label: "Cukup",   color: "bg-orange-400", text: "text-orange-500" },
  { label: "Baik",    color: "bg-blue-400",   text: "text-blue-500" },
  { label: "Kuat",    color: "bg-green-500",  text: "text-green-600" },
]

const ChangePasswordPage = () => {
  const navigate = useNavigate()
  const [newPassword, setNewPassword]     = useState("")
  const [confirmPass, setConfirmPass]     = useState("")
  const [showNew, setShowNew]             = useState(false)
  const [showConfirm, setShowConfirm]     = useState(false)
  const [error, setError]                 = useState("")
  const [isLoading, setIsLoading]         = useState(false)
  const [done, setDone]                   = useState(false)

  const user = (() => {
    try { return JSON.parse(localStorage.getItem("user") ?? "{}") } catch { return {} }
  })()

  // If not logged in or not first-login, redirect
  if (!user?.id) {
    navigate("/login")
    return null
  }

  const strength = getStrength(newPassword)
  const strengthCfg = strength > 0 ? STRENGTH_CONFIG[strength - 1] : null
  const passwordsMatch = confirmPass.length > 0 && newPassword === confirmPass

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (newPassword.length < 8) {
      setError("Password minimal 8 karakter.")
      return
    }
    if (newPassword !== confirmPass) {
      setError("Konfirmasi password tidak cocok.")
      return
    }
    if (newPassword === "RS-2026") {
      setError("Password baru tidak boleh sama dengan password default.")
      return
    }

    setIsLoading(true)
    await new Promise((r) => setTimeout(r, 800))

    // Update employee password in localStorage
    let employees: Employee[] = []
    try {
      const stored = localStorage.getItem("employees")
      employees = stored ? JSON.parse(stored) : SEED_EMPLOYEES
    } catch {
      employees = SEED_EMPLOYEES
    }

    const updated = employees.map((emp) =>
      emp.id === user.id
        ? { ...emp, password: newPassword, isFirstLogin: false }
        : emp
    )
    localStorage.setItem("employees", JSON.stringify(updated))

    // Update session
    localStorage.setItem("user", JSON.stringify({ ...user, isFirstLogin: false }))

    setIsLoading(false)
    setDone(true)

    // Redirect after 1.5s
    setTimeout(() => {
      const roleRoutes: Record<string, string> = {
        admin:      "/admin/dashboard",
        supervisor: "/supervisor/dashboard",
        employee:   "/employee/dashboard",
      }
      navigate(roleRoutes[user.role] ?? "/login")
    }, 1500)
  }

  const inputBase =
    "w-full px-4 py-3 pl-11 text-sm bg-white/60 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-700 focus:border-blue-400 transition-all"

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 p-4">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-blue-100 dark:bg-blue-900/20 blur-3xl opacity-60" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-indigo-100 dark:bg-indigo-900/20 blur-3xl opacity-60" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-blue-100/50 dark:shadow-none border border-white/50 dark:border-gray-700/50 p-8">

          {/* Logo */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg shadow-blue-200 dark:shadow-blue-900/50 mb-3">
              <Hospital className="h-7 w-7 text-white" />
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-full mb-3">
              <ShieldCheck className="h-3.5 w-3.5 text-amber-500" />
              <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">Aktivasi Akun</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Buat Password Baru</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Halo, <strong>{user.name}</strong>! Ini adalah login pertama Anda.<br />
              Buat password baru untuk mengamankan akun Anda.
            </p>
          </div>

          {/* Success state */}
          {done ? (
            <div className="text-center py-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
                <CheckCircle2 className="h-8 w-8 text-green-500" />
              </div>
              <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-1">Password berhasil diubah!</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Mengalihkan ke dashboard...</p>
              <div className="mt-4 h-1 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full animate-[grow_1.5s_ease-in-out_forwards]" />
              </div>
            </div>
          ) : (
            <>
              {/* Error */}
              {error && (
                <div className="mb-4 flex items-start gap-2 px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-700 dark:text-red-400">
                  <span className="shrink-0">⚠</span>{error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* New Password */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">
                    Password Baru *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    <input
                      type={showNew ? "text" : "password"}
                      placeholder="Minimal 8 karakter"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      className={`${inputBase} pr-11`}
                    />
                    <button type="button" onClick={() => setShowNew((s) => !s)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                      {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>

                  {/* Strength bar */}
                  {newPassword.length > 0 && (
                    <div className="mt-2 space-y-1">
                      <div className="flex gap-1">
                        {[1,2,3,4].map((lvl) => (
                          <div key={lvl}
                            className={`flex-1 h-1.5 rounded-full transition-colors duration-300
                              ${strength >= lvl ? strengthCfg?.color ?? "bg-gray-200" : "bg-gray-100 dark:bg-gray-800"}`}
                          />
                        ))}
                      </div>
                      {strengthCfg && (
                        <p className={`text-xs font-medium ${strengthCfg.text}`}>
                          Kekuatan: {strengthCfg.label}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">
                    Konfirmasi Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    <input
                      type={showConfirm ? "text" : "password"}
                      placeholder="Ulangi password baru"
                      value={confirmPass}
                      onChange={(e) => setConfirmPass(e.target.value)}
                      required
                      className={`${inputBase} pr-11 ${
                        confirmPass.length > 0
                          ? passwordsMatch
                            ? "border-green-400 focus:ring-green-300"
                            : "border-red-400 focus:ring-red-200"
                          : ""
                      }`}
                    />
                    <button type="button" onClick={() => setShowConfirm((s) => !s)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                      {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {confirmPass.length > 0 && !passwordsMatch && (
                    <p className="text-xs text-red-500 mt-1">Password tidak cocok</p>
                  )}
                </div>

                {/* Requirements */}
                <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 space-y-1.5">
                  {[
                    { check: newPassword.length >= 8,          label: "Minimal 8 karakter" },
                    { check: /[A-Z]/.test(newPassword),         label: "Mengandung huruf besar" },
                    { check: /[0-9]/.test(newPassword),         label: "Mengandung angka" },
                    { check: newPassword !== "RS-2026",          label: "Berbeda dari password default" },
                  ].map(({ check, label }) => (
                    <div key={label} className="flex items-center gap-2">
                      <div className={`h-4 w-4 rounded-full flex items-center justify-center shrink-0 transition-colors
                        ${check ? "bg-green-500" : "bg-gray-200 dark:bg-gray-700"}`}>
                        {check && <CheckCircle2 className="h-3 w-3 text-white" />}
                      </div>
                      <span className={`text-xs ${check ? "text-green-700 dark:text-green-400" : "text-gray-500 dark:text-gray-400"}`}>
                        {label}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading || !passwordsMatch || newPassword.length < 8}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 disabled:from-blue-300 disabled:to-blue-300 dark:disabled:from-blue-900 dark:disabled:to-blue-900 text-white font-semibold text-sm rounded-xl shadow-lg shadow-blue-200 dark:shadow-none transition-all active:scale-[0.98] disabled:cursor-not-allowed">
                  {isLoading ? (
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  ) : (
                    <ShieldCheck className="h-4 w-4" />
                  )}
                  {isLoading ? "Menyimpan..." : "Aktifkan Akun"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export { ChangePasswordPage }
