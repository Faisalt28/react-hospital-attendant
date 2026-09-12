import { useState } from "react"
import { Eye, EyeOff, LogIn, Lock, BadgeCheck, Hospital } from "lucide-react"

interface SignInProps {
  onSignIn: (nip: string, password: string) => void
  isLoading?: boolean
  error?: string
}

const SignIn = ({ onSignIn, isLoading, error }: SignInProps) => {
  const [nip, setNip] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (nip.trim() && password) onSignIn(nip.trim(), password)
  }

  const inputBase =
    "w-full px-4 py-3 pl-11 text-sm bg-white/60 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-700 focus:border-blue-400 transition-all backdrop-blur-sm"

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-blue-100 dark:bg-blue-900/20 blur-3xl opacity-60" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-indigo-100 dark:bg-indigo-900/20 blur-3xl opacity-60" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-blue-100/50 dark:shadow-none border border-white/50 dark:border-gray-700/50 p-8">

          {/* Logo & Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg shadow-blue-200 dark:shadow-blue-900/50 mb-4">
              <Hospital className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">RS MediTrack</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Sistem Manajemen Absensi Rumah Sakit
            </p>
          </div>

          {/* Error alert */}
          {error && (
            <div className="mb-5 flex items-start gap-3 px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-700 dark:text-red-400">
              <span className="text-red-500 shrink-0 mt-0.5">⚠</span>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* NIP Field */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">
                NIP (Nomor Induk Pegawai)
              </label>
              <div className="relative">
                <BadgeCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="contoh: IGD-2021-001"
                  value={nip}
                  onChange={(e) => setNip(e.target.value)}
                  autoComplete="username"
                  required
                  className={inputBase}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  className={`${inputBase} pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Default password hint */}
            <div className="flex items-center gap-2 px-3 py-2.5 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 rounded-xl">
              <span className="text-amber-500 text-sm">💡</span>
              <p className="text-xs text-amber-700 dark:text-amber-400">
                Login pertama kali? Password default Anda adalah <strong>RS-2026</strong>
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading || !nip.trim() || !password}
              className="w-full flex items-center justify-center gap-2 py-3 px-6 mt-2
                bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600
                disabled:from-blue-300 disabled:to-blue-300 dark:disabled:from-blue-900 dark:disabled:to-blue-900
                text-white font-semibold text-sm rounded-xl shadow-lg shadow-blue-200 dark:shadow-none
                transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <LogIn className="h-4 w-4" />
              )}
              {isLoading ? "Memverifikasi..." : "Masuk"}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-xs text-gray-400 dark:text-gray-600 mt-6">
            Akun dibuat oleh Admin HRD. Hubungi HRD jika mengalami kendala login.
          </p>
        </div>

        {/* Bottom note */}
        <p className="text-center text-xs text-gray-400 dark:text-gray-600 mt-4">
          RS MediTrack v1.0 · Sistem Internal Rumah Sakit
        </p>
      </div>
    </div>
  )
}

export { SignIn }
