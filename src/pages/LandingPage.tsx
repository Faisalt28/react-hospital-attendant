import { useNavigate } from "react-router-dom"
import {
  Hospital,
  ShieldCheck,
  MapPin,
  Camera,
  CalendarDays,
  ArrowRight,
  Sun,
  Moon,
  HeartPulse,
  Award,
  PhoneCall,
  UserCheck,
  Building2,
  Users,
  CheckCircle2,
} from "lucide-react"
import { useTheme } from "@/contexts/ThemeContext"
import { About3 } from "@/components/ui/about-3"
import { Button } from "@/components/ui/button"

export const LandingPage = () => {
  const navigate = useNavigate()
  const { isDark, toggleDark } = useTheme()

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors">
      {/* ── Top Navigation Bar ── */}
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
        <div className="container mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          {/* Logo & Brand */}
          <div
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer min-w-0"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <div className="size-9 sm:size-11 shrink-0 rounded-xl sm:rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
              <Hospital className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div className="min-w-0">
              <span className="block text-base sm:text-lg font-black tracking-tight text-gray-900 dark:text-white leading-none truncate">
                RS MediTrack
              </span>
              <span className="hidden sm:block text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5 truncate">
                Sistem Presensi & Manajemen SDM RS
              </span>
            </div>
          </div>

          {/* Center Nav Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600 dark:text-gray-300">
            <a href="#profil" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
              Profil RS
            </a>
            <a href="#keunggulan" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
              Fitur Presensi
            </a>
            <a href="#peran" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
              Portal Akses
            </a>
            <a href="#kontak" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
              Kontak Darurat
            </a>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={toggleDark}
              className="p-2 sm:p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
              title={isDark ? "Mode Terang" : "Mode Gelap"}
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            <Button
              onClick={() => navigate("/login")}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md shadow-emerald-600/20 px-3 sm:px-5 py-2 text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2 cursor-pointer h-9 sm:h-10"
            >
              <span>Masuk</span>
              <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* ── Hero Banner Section ── */}
      <section className="relative overflow-hidden pt-8 pb-14 sm:pt-14 sm:pb-20 lg:pt-20 lg:pb-28 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-b from-emerald-50/30 via-white to-white dark:from-gray-900 dark:via-gray-950 dark:to-gray-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-4 sm:space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-emerald-100/80 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-[11px] sm:text-xs font-bold shadow-xs max-w-full text-left sm:text-center">
              <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="truncate">Sistem Presensi RS Terintegrasi</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white tracking-tight leading-[1.18]">
              Pelayanan Medis Prima dengan <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Presensi Terpadu</span>
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Mendukung kedisiplinan dan koordinasi seluruh staf rumah sakit mulai dari Dokter, Perawat, Kepala Ruangan, hingga Manajemen HRD secara transparan dan akurat.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 pt-2 max-w-xs sm:max-w-none mx-auto">
              <Button
                onClick={() => navigate("/login")}
                size="lg"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl sm:rounded-2xl shadow-lg shadow-emerald-600/25 px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto"
              >
                <span>Login ke Portal</span>
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>

              <a
                href="#keunggulan"
                className="inline-flex items-center justify-center px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs sm:text-sm font-bold transition-colors shadow-xs w-full sm:w-auto text-center"
              >
                Lihat Fitur Sistem
              </a>
            </div>
          </div>
        </div>

        {/* Ambient Glow */}
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-tr from-emerald-200/20 via-teal-100/10 to-transparent dark:from-emerald-950/20 dark:via-teal-900/10 blur-3xl" />
      </section>

      {/* ── About Component Section (Template Integrated) ── */}
      <div id="profil">
        <About3 />
      </div>

      {/* ── Key System Features Showcase (Neutral) ── */}
      <section id="keunggulan" className="py-12 sm:py-20 lg:py-24 bg-gray-50/70 dark:bg-gray-900/50 border-y border-gray-100 dark:border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16 space-y-2 sm:space-y-3">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              Teknologi Presensi RS
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Keunggulan Sistem RS MediTrack
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-gray-500 dark:text-gray-400">
              Menghadirkan transparansi kehadiran dan koordinasi pelayanan medis yang tertata 24 jam nonstop
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-white dark:bg-gray-900 p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow space-y-3 sm:space-y-4">
              <div className="size-11 sm:size-12 rounded-xl sm:rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <MapPin className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">Geofencing Radius GPS</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Menghitung jarak otomatis menggunakan formula Haversine untuk memastikan presensi hanya dapat dilakukan di dalam area rumah sakit.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow space-y-3 sm:space-y-4">
              <div className="size-11 sm:size-12 rounded-xl sm:rounded-2xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Camera className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">Verifikasi Kamera Selfie</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Pengambilan foto wajah langsung secara real-time saat clock-in dan clock-out untuk menjamin keaslian data kehadiran.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow space-y-3 sm:space-y-4">
              <div className="size-11 sm:size-12 rounded-xl sm:rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <CalendarDays className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">Manajemen Jadwal Sif</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Distribusi jadwal dinas (Pagi, Siang, Malam, Off) yang tersinkronisasi langsung ke aplikasi masing-masing staf.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow space-y-3 sm:space-y-4">
              <div className="size-11 sm:size-12 rounded-xl sm:rounded-2xl bg-teal-50 dark:bg-teal-950/50 flex items-center justify-center text-teal-600 dark:text-teal-400">
                <HeartPulse className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">Tukar Sif & Cuti Terpadu</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Pengajuan cuti tahunan, izin sakit bersurat dokter, dan pertukaran sif antar rekan kerja dengan alur terstandarisasi.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── User Roles Showcase Section (Balanced & Neutral) ── */}
      <section id="peran" className="py-12 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16 space-y-2 sm:space-y-3">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              Hak Akses Terstruktur
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Tiga Portal Utama Sistem
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-gray-500 dark:text-gray-400">
              Dirancang untuk memenuhi kebutuhan operasional setiap jajaran tenaga kesehatan dan manajemen rumah sakit
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Card 1: Staf / Pegawai */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl sm:rounded-3xl border border-gray-200 dark:border-gray-800 p-5 sm:p-8 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-5 sm:space-y-6">
              <div className="space-y-3 sm:space-y-4">
                <div className="size-11 sm:size-12 rounded-xl sm:rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
                  <UserCheck className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Portal Staf Medis</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Untuk Dokter, Perawat, Bidan, Apoteker, dan Tenaga Kesehatan.
                </p>
                <ul className="space-y-2 sm:space-y-2.5 text-xs text-gray-600 dark:text-gray-300 pt-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Presensi live selfie & validasi radius GPS</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Bento Grid jadwal sif dinas harian & bulanan</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Pengajuan tukar sif ke rekan kerja</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Permohonan izin sakit & tracking kuota cuti</span>
                  </li>
                </ul>
              </div>
              <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                  Akses: Portal Staf
                </span>
              </div>
            </div>

            {/* Card 2: Kepala Ruangan / Supervisor */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl sm:rounded-3xl border border-gray-200 dark:border-gray-800 p-5 sm:p-8 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-5 sm:space-y-6">
              <div className="space-y-3 sm:space-y-4">
                <div className="size-11 sm:size-12 rounded-xl sm:rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 flex items-center justify-center">
                  <Building2 className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Panel Kepala Ruangan</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Untuk Kepala Unit IGD, ICU, Rawat Inap, Farmasi, Radiologi, dsb.
                </p>
                <ul className="space-y-2 sm:space-y-2.5 text-xs text-gray-600 dark:text-gray-300 pt-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" />
                    <span>Monitoring kehadiran staf unit secara real-time</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" />
                    <span>Roster Builder bulanan dengan rotasi otomatis</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" />
                    <span>Validasi dan persetujuan tukar sif staf unit</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" />
                    <span>Persetujuan cuti dan ekspor rekap presensi unit</span>
                  </li>
                </ul>
              </div>
              <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                  Akses: Panel Supervisor
                </span>
              </div>
            </div>

            {/* Card 3: Manajemen HRD / Admin */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl sm:rounded-3xl border border-gray-200 dark:border-gray-800 p-5 sm:p-8 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-5 sm:space-y-6">
              <div className="space-y-3 sm:space-y-4">
                <div className="size-11 sm:size-12 rounded-xl sm:rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 flex items-center justify-center">
                  <Users className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Dashboard HRD & Eksekutif</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Untuk Manajemen SDM, Personalia, dan Administrator Sistem.
                </p>
                <ul className="space-y-2 sm:space-y-2.5 text-xs text-gray-600 dark:text-gray-300 pt-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                    <span>Master Data Pegawai & pengelolaan akun</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                    <span>Master Departemen & alokasi Kepala Ruangan</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                    <span>Monitoring statistik kehadiran seluruh rumah sakit</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                    <span>Konfigurasi geofencing & ekspor payroll (.xlsx)</span>
                  </li>
                </ul>
              </div>
              <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                  Akses: Dashboard HRD
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Emergency & Contact Footer ── */}
      <footer id="kontak" className="bg-gray-900 text-white pt-12 pb-8 sm:pt-16 sm:pb-12 border-t border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 pb-8 sm:pb-12 border-b border-gray-800">
            {/* Column 1: Hospital Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-2xl bg-emerald-600 flex items-center justify-center text-white font-bold">
                  <Hospital className="h-5 w-5" />
                </div>
                <span className="text-lg font-extrabold tracking-tight">RS MediTrack</span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                Rumah Sakit Umum dengan layanan rujukan terpadu, terakreditasi KARS Paripurna dan standar keselamatan pasien internasional.
              </p>
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
                <Award className="h-4 w-4" />
                Akreditasi KARS Tingkat Paripurna
              </div>
            </div>

            {/* Column 2: Alamat & Lokasi */}
            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-300">Lokasi & Geofence RS</p>
              <p className="text-xs text-gray-400 leading-relaxed">
                Jl. Kesehatan Raya No. 45, Kompleks Pelayanan Medis Terpadu, Jakarta
              </p>
              <p className="text-xs text-gray-400">
                <strong>Radius Geofencing:</strong> 150 Meter dari titik pusat RS
              </p>
            </div>

            {/* Column 3: Jam Layanan & Unit */}
            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-300">Layanan Siaga</p>
              <ul className="text-xs text-gray-400 space-y-1.5">
                <li>• IGD & Trauma Center 24 Jam</li>
                <li>• ICU, ICCU & NICU Siaga</li>
                <li>• Laboratorium & Radiologi 24 Jam</li>
                <li>• Farmasi Rawat Inap 24 Jam</li>
              </ul>
            </div>

            {/* Column 4: Kontak Darurat */}
            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-rose-400">Hotline Gawat Darurat</p>
              <div className="flex items-center gap-2 p-3 rounded-2xl bg-rose-950/50 border border-rose-800 text-rose-300">
                <PhoneCall className="h-5 w-5 text-rose-400" />
                <div>
                  <p className="text-[10px] text-rose-300 font-semibold">Emergency Call (24 Jam)</p>
                  <p className="text-base font-black text-white">119 / (021) 555-9119</p>
                </div>
              </div>
              <Button
                onClick={() => navigate("/login")}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold py-2.5 cursor-pointer"
              >
                Masuk ke Portal Presensi
              </Button>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
            <p>© {new Date().getFullYear()} RS MediTrack Healthcare System. Seluruh hak cipta dilindungi.</p>
            <div className="flex items-center gap-6">
              <span>Kebijakan Privasi</span>
              <span>Syarat & Ketentuan</span>
              <span>Bantuan Teknis IT</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
