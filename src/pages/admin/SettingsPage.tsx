import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  MapPin, Clock, ShieldAlert, Check, RotateCcw,
  Camera, Bell, Info, ShieldCheck, X, Navigation,
} from "lucide-react"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import { DEFAULT_SETTINGS } from "@/data/settings"
import type { AppSettings } from "@/types"
import { GeofenceMapPicker } from "@/components/ui/GeofenceMapPicker"
import { ToleranceSlider } from "@/components/ui/ToleranceSlider"
import { LocationMap } from "@/components/ui/expand-map"

const SettingsPage = () => {
  const [settings, setSettings] = useLocalStorage<AppSettings>("app_settings", DEFAULT_SETTINGS)
  const [form, setForm] = useState<AppSettings>(settings)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  const handleChange = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleLocationChange = (lat: number, lng: number) => {
    setForm((prev) => ({ ...prev, latitude: lat, longitude: lng }))
  }

  const handleRadiusChange = (radius: number) => {
    handleChange("geofenceRadiusMeters", radius)
  }

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setSettings(form)
    setShowSuccessModal(true)
  }

  const handleReset = () => {
    if (window.confirm("Kembalikan semua konfigurasi ke pengaturan default?")) {
      setForm(DEFAULT_SETTINGS)
      setSettings(DEFAULT_SETTINGS)
      setShowSuccessModal(true)
    }
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">Pengaturan Presensi</h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Konfigurasi radius geofencing lokasi rumah sakit dan batas toleransi keterlambatan
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-colors"
          >
            <RotateCcw className="h-4 w-4 shrink-0" />
            <span>Reset Default</span>
          </button>
          <button
            type="button"
            onClick={() => handleSave()}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 shadow-md shadow-blue-200 dark:shadow-none rounded-xl transition-all"
          >
            <Check className="h-4 w-4 shrink-0" />
            <span>Simpan Pengaturan</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* ── Card 1: Geofencing & Lokasi Rumah Sakit ── */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 shrink-0">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100">
                Konfigurasi Geofencing
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Pusat koordinat dan batas radius validasi absensi pegawai
              </p>
            </div>
          </div>

          <div className="p-4 sm:p-6">
            {/* Grid Container: Desktop sejajar (Left: 3D Map, Right: Form Controls), Mobile vertikal ke bawah */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* ── Kolom Kiri (Desktop): 3D Expand Map Card & Status Panel ── */}
              <div className="lg:col-span-5 flex flex-col items-center gap-4 bg-gradient-to-b from-gray-50/80 to-white dark:from-gray-800/40 dark:to-gray-900/60 p-4 sm:p-5 rounded-2xl border border-gray-100 dark:border-gray-800/80 shadow-xs">
                <div className="w-full flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Titik Lokasi RS
                    </span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 font-medium border border-emerald-200/50 dark:border-emerald-800/50">
                    Interaktif 3D
                  </span>
                </div>

                {/* 3D LocationMap Component */}
                <div className="py-2 flex justify-center w-full overflow-visible">
                  <LocationMap
                    location={form.hospitalName || "RSUD MediTrack"}
                    coordinates={`${Math.abs(form.latitude).toFixed(4)}° ${form.latitude >= 0 ? "N" : "S"}, ${Math.abs(form.longitude).toFixed(4)}° ${form.longitude >= 0 ? "E" : "W"}`}
                    radius={form.geofenceRadiusMeters}
                    statusText="Live GPS"
                  />
                </div>

                {/* Ringkasan Parameter Lokasi RS */}
                <div className="w-full space-y-2 pt-1">
                  <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-white dark:bg-gray-800/80 border border-gray-100 dark:border-gray-700/60">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Radius Toleransi</span>
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                      {form.geofenceRadiusMeters} meter
                    </span>
                  </div>
                  <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-white dark:bg-gray-800/80 border border-gray-100 dark:border-gray-700/60">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Status Validasi</span>
                    <span className={`text-xs font-semibold ${form.blockOutsideGeofence ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}>
                      {form.blockOutsideGeofence ? "Strict (Tolak Luar Radius)" : "Fleksibel"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-white dark:bg-gray-800/80 border border-gray-100 dark:border-gray-700/60 font-mono text-[11px]">
                    <span className="text-gray-500 dark:text-gray-400 font-sans">Koordinat GPS</span>
                    <span className="text-gray-700 dark:text-gray-300">
                      {form.latitude.toFixed(5)}, {form.longitude.toFixed(5)}
                    </span>
                  </div>
                </div>
              </div>

              {/* ── Kolom Kanan (Desktop): Form Input, Map Picker & Security Toggles ── */}
              <div className="lg:col-span-7 space-y-5">
                {/* Nama & Alamat RS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">
                      Nama Titik Lokasi Rumah Sakit *
                    </label>
                    <input
                      type="text"
                      value={form.hospitalName}
                      onChange={(e) => handleChange("hospitalName", e.target.value)}
                      className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-300"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">
                      Alamat Lengkap Rumah Sakit
                    </label>
                    <input
                      type="text"
                      value={form.address}
                      onChange={(e) => handleChange("address", e.target.value)}
                      className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                  </div>
                </div>

                {/* Geofence Map Picker (Peta Interaktif + Radius Slider) */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">
                    Pilih Lokasi & Atur Radius dari Peta
                  </label>
                  <GeofenceMapPicker
                    latitude={form.latitude}
                    longitude={form.longitude}
                    radius={form.geofenceRadiusMeters}
                    onLocationChange={handleLocationChange}
                    onRadiusChange={handleRadiusChange}
                  />
                </div>

                {/* Koordinat manual display (Responsive grid) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-gray-500 dark:text-gray-400 mb-1">
                      Latitude (terkoneksi dari peta)
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={form.latitude}
                      onChange={(e) => handleChange("latitude", parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-1.5 text-sm font-mono rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-gray-500 dark:text-gray-400 mb-1">
                      Longitude (terkoneksi dari peta)
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={form.longitude}
                      onChange={(e) => handleChange("longitude", parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-1.5 text-sm font-mono rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                  </div>
                </div>

                {/* Security Toggles for Geofencing */}
                <div className="pt-2 border-t border-gray-100 dark:border-gray-800 space-y-3">
                  <div className="flex items-center justify-between p-3 sm:p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/40 gap-3">
                    <div className="flex items-start gap-2.5 sm:gap-3 min-w-0 flex-1">
                      <ShieldAlert className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-100 leading-snug">
                          Wajib Berada di Dalam Radius (Strict Geofence)
                        </p>
                        <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          Jika aktif, sistem akan menolak absensi jika pegawai berada di luar radius {form.geofenceRadiusMeters}m.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleChange("blockOutsideGeofence", !form.blockOutsideGeofence)}
                      className={`relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ${
                        form.blockOutsideGeofence ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-700"
                      }`}
                    >
                      <span
                        className={`inline-block h-5 w-5 mt-0.5 rounded-full bg-white shadow transition-transform duration-200 ${
                          form.blockOutsideGeofence ? "translate-x-5" : "translate-x-0.5"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3 sm:p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/40 gap-3">
                    <div className="flex items-start gap-2.5 sm:gap-3 min-w-0 flex-1">
                      <ShieldCheck className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-100 leading-snug">
                          Anti Mock Location & Fake GPS Protection
                        </p>
                        <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          Mendeteksi dan memblokir aplikasi lokasi palsu pada perangkat pegawai.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleChange("antiFakeGps", !form.antiFakeGps)}
                      className={`relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ${
                        form.antiFakeGps ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-700"
                      }`}
                    >
                      <span
                        className={`inline-block h-5 w-5 mt-0.5 rounded-full bg-white shadow transition-transform duration-200 ${
                          form.antiFakeGps ? "translate-x-5" : "translate-x-0.5"
                        }`}
                      />
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* ── Card 2: Setting Toleransi Keterlambatan ── */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 shrink-0">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100">
                Toleransi Keterlambatan & Jam Kerja
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Aturan batas menit keterlambatan dan jendela waktu presensi masuk/pulang
              </p>
            </div>
          </div>

          <div className="p-4 sm:p-6 space-y-6">
            {/* Toleransi Keterlambatan Slider with accurate ticks & presets */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div>
                  <label className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Batas Toleransi Keterlambatan Masuk
                  </label>
                  <p className="text-[11px] text-gray-400">
                    Pegawai yang clock-in setelah jam shift + batas ini akan otomatis tercatat sebagai "Terlambat"
                  </p>
                </div>
                <div className="self-start sm:self-auto flex items-baseline gap-1.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/50 px-3 py-1 rounded-xl">
                  <span className="text-xl font-bold text-amber-600 dark:text-amber-400 tabular-nums">
                    {form.lateToleranceMinutes}
                  </span>
                  <span className="text-xs font-medium text-amber-700 dark:text-amber-300">menit</span>
                </div>
              </div>

              {/* Accurate Tolerance Slider */}
              <ToleranceSlider
                value={form.lateToleranceMinutes}
                onChange={(val) => handleChange("lateToleranceMinutes", val)}
                min={0}
                max={45}
                step={5}
              />
            </div>

            {/* Simulasi Ilustrasi Toleransi */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-amber-50/70 dark:bg-amber-900/10 border border-amber-200/80 dark:border-amber-800/50 flex items-start gap-3">
              <Info className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs text-gray-700 dark:text-gray-300 space-y-1 min-w-0 flex-1">
                <p className="font-semibold text-amber-800 dark:text-amber-300">Contoh Simulasi Shift Pagi (07:00):</p>
                <p className="leading-relaxed">
                  • Clock-in pukul <strong>07:00 – 07:{form.lateToleranceMinutes.toString().padStart(2, "0")}</strong> → Status <span className="text-green-600 dark:text-green-400 font-semibold">Tepat Waktu (On-Time)</span>
                </p>
                <p className="leading-relaxed">
                  • Clock-in pukul <strong>07:{form.lateToleranceMinutes + 1 > 59 ? "59" : (form.lateToleranceMinutes + 1).toString().padStart(2, "0")} ke atas</strong> → Status <span className="text-red-600 dark:text-red-400 font-semibold">Terlambat (Late)</span>
                </p>
              </div>
            </div>

            {/* Waktu Buka & Tutup Presensi */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">
                  Waktu Buka Presensi Masuk
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={15}
                    max={120}
                    step={5}
                    value={form.earlyClockInMinutes}
                    onChange={(e) => handleChange("earlyClockInMinutes", parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-300 pr-24"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none">
                    menit sblm shift
                  </span>
                </div>
                <p className="text-[10px] text-gray-400 mt-1">Pegawai dapat presensi masuk maksimal {form.earlyClockInMinutes} mnt sebelum shift</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">
                  Batas Maksimal Presensi Pulang
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={30}
                    max={240}
                    step={15}
                    value={form.maxClockOutMinutes}
                    onChange={(e) => handleChange("maxClockOutMinutes", parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-300 pr-24"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none">
                    menit stlh shift
                  </span>
                </div>
                <p className="text-[10px] text-gray-400 mt-1">Jendela checkout ditutup {form.maxClockOutMinutes} mnt setelah shift berakhir</p>
              </div>
            </div>

            {/* Additional verification settings */}
            <div className="pt-2 border-t border-gray-100 dark:border-gray-800 space-y-3">
              <div className="flex items-center justify-between p-3 sm:p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/40 gap-3">
                <div className="flex items-start gap-2.5 sm:gap-3 min-w-0 flex-1">
                  <Camera className="h-5 w-5 text-purple-500 shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-100 leading-snug">
                      Wajib Selfie Kamera Depan (Face Verification)
                    </p>
                    <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      Pegawai wajib mengambil foto selfie saat melakukan presensi masuk dan pulang.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleChange("requireSelfie", !form.requireSelfie)}
                  className={`relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ${
                    form.requireSelfie ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-700"
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 mt-0.5 rounded-full bg-white shadow transition-transform duration-200 ${
                      form.requireSelfie ? "translate-x-5" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-3 sm:p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/40 gap-3">
                <div className="flex items-start gap-2.5 sm:gap-3 min-w-0 flex-1">
                  <Bell className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-100 leading-snug">
                      Notifikasi Otomatis ke Supervisor Saat Keterlambatan
                    </p>
                    <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      Kirim pemberitahuan otomatis ke Kepala Ruangan jika ada staf yang belum hadir setelah batas toleransi.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleChange("notifySupervisorOnLate", !form.notifySupervisorOnLate)}
                  className={`relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ${
                    form.notifySupervisorOnLate ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-700"
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 mt-0.5 rounded-full bg-white shadow transition-transform duration-200 ${
                      form.notifySupervisorOnLate ? "translate-x-5" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Save Bar (Responsive buttons) */}
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={handleReset}
            className="w-full sm:w-auto px-5 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-colors text-center"
          >
            Batal / Reset
          </button>
          <button
            type="submit"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 shadow-md shadow-blue-200 dark:shadow-none rounded-xl transition-all text-center"
          >
            <Check className="h-4 w-4 shrink-0" />
            <span>Simpan Perubahan</span>
          </button>
        </div>
      </form>

      {/* ── Pop-Up Modal di Tengah Layar (Pengaturan Berhasil Disimpan) ── */}
      <AnimatePresence>
        {showSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop with Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSuccessModal(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 p-6 sm:p-7 overflow-hidden z-10"
            >
              {/* Close Button X */}
              <button
                type="button"
                onClick={() => setShowSuccessModal(false)}
                className="absolute top-4 right-4 p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Tutup"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Animated Icon & Title */}
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <motion.div
                    className="absolute inset-0 rounded-full bg-green-400/20"
                    animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  />
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-green-500 to-emerald-400 flex items-center justify-center text-white shadow-lg shadow-green-500/30">
                    <Check className="h-8 w-8 stroke-[2.5]" />
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Pengaturan Berhasil Disimpan!
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 max-w-xs leading-relaxed">
                  Konfigurasi geofencing dan aturan toleransi presensi telah diperbarui secara realtime ke seluruh sistem.
                </p>

                {/* Summary Box of Saved Settings */}
                <div className="w-full mt-5 p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/60 text-left space-y-2 text-xs">
                  <div className="flex items-center justify-between py-1 border-b border-gray-200/60 dark:border-gray-700/40">
                    <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-blue-500 shrink-0" /> Lokasi RS
                    </span>
                    <span className="font-semibold text-gray-800 dark:text-gray-200 truncate max-w-[180px]">
                      {form.hospitalName}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-gray-200/60 dark:border-gray-700/40">
                    <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                      <Navigation className="h-3.5 w-3.5 text-blue-500 shrink-0" /> Radius Geofence
                    </span>
                    <span className="font-semibold text-blue-600 dark:text-blue-400">
                      {form.geofenceRadiusMeters} meter
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-gray-200/60 dark:border-gray-700/40">
                    <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-amber-500 shrink-0" /> Toleransi Keterlambatan
                    </span>
                    <span className="font-semibold text-amber-600 dark:text-amber-400">
                      {form.lateToleranceMinutes} menit
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                      <ShieldAlert className="h-3.5 w-3.5 text-purple-500 shrink-0" /> Strict Geofence
                    </span>
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      {form.blockOutsideGeofence ? "Aktif (Wajib di Radius)" : "Non-aktif"}
                    </span>
                  </div>
                </div>

                {/* Primary Button */}
                <div className="w-full mt-6">
                  <button
                    type="button"
                    onClick={() => setShowSuccessModal(false)}
                    className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 shadow-md shadow-blue-500/25 transition-all"
                  >
                    Mengerti & Tutup
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export { SettingsPage }
