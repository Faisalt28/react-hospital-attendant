import { useState } from "react"
import {
  MapPin, Clock, ShieldAlert, Check, RotateCcw,
  Navigation, Camera, Bell, Info, ShieldCheck,
} from "lucide-react"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import { DEFAULT_SETTINGS } from "@/data/settings"
import type { AppSettings } from "@/types"

const SettingsPage = () => {
  const [settings, setSettings] = useLocalStorage<AppSettings>("app_settings", DEFAULT_SETTINGS)
  const [form, setForm] = useState<AppSettings>(settings)
  const [isSaved, setIsSaved] = useState(false)
  const [geoLoading, setGeoLoading] = useState(false)
  const [geoError, setGeoError] = useState("")

  const handleChange = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    setIsSaved(false)
  }

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      setGeoError("Browser Anda tidak mendukung geolokasi.")
      return
    }

    setGeoLoading(true)
    setGeoError("")

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setForm((prev) => ({
          ...prev,
          latitude: parseFloat(position.coords.latitude.toFixed(6)),
          longitude: parseFloat(position.coords.longitude.toFixed(6)),
        }))
        setGeoLoading(false)
      },
      (error) => {
        setGeoLoading(false)
        if (error.code === error.PERMISSION_DENIED) {
          setGeoError("Izin lokasi ditolak oleh browser.")
        } else {
          setGeoError("Gagal mendeteksi lokasi: " + error.message)
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSettings(form)
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 3000)
  }

  const handleReset = () => {
    if (window.confirm("Kembalikan semua konfigurasi ke pengaturan default?")) {
      setForm(DEFAULT_SETTINGS)
      setSettings(DEFAULT_SETTINGS)
      setIsSaved(true)
      setTimeout(() => setIsSaved(false), 3000)
    }
  }

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Pengaturan Presensi</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Konfigurasi radius geofencing lokasi rumah sakit dan batas toleransi keterlambatan
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            Reset Default
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 shadow-md shadow-blue-200 dark:shadow-none rounded-xl transition-all"
          >
            <Check className="h-4 w-4" />
            Simpan Pengaturan
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {isSaved && (
        <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 flex items-center gap-3 animate-in fade-in duration-200">
          <div className="h-8 w-8 rounded-lg bg-green-100 dark:bg-green-800/40 flex items-center justify-center text-green-600 dark:text-green-400 shrink-0">
            <Check className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-green-800 dark:text-green-300">Pengaturan Berhasil Disimpan!</p>
            <p className="text-xs text-green-700 dark:text-green-400">
              Konfigurasi geofencing dan aturan keterlambatan telah diterapkan ke seluruh sistem.
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* ── Card 1: Geofencing & Lokasi Rumah Sakit ── */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">Konfigurasi Geofencing</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Pusat koordinat dan batas radius validasi absensi pegawai
              </p>
            </div>
          </div>

          <div className="p-6 space-y-5">
            {/* Nama & Alamat RS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            {/* Koordinat GPS */}
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                  Koordinat Titik Pusat RS (Latitude & Longitude)
                </span>
                <button
                  type="button"
                  onClick={handleGetCurrentLocation}
                  disabled={geoLoading}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  <Navigation className={`h-3.5 w-3.5 ${geoLoading ? "animate-spin" : ""}`} />
                  {geoLoading ? "Mengambil GPS..." : "Gunakan Lokasi Saya Saat Ini"}
                </button>
              </div>

              {geoError && (
                <p className="text-xs text-red-500 bg-red-50 dark:bg-red-900/20 p-2 rounded-lg">{geoError}</p>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-gray-500 dark:text-gray-400 mb-1">Latitude</label>
                  <input
                    type="number"
                    step="any"
                    value={form.latitude}
                    onChange={(e) => handleChange("latitude", parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 text-sm font-mono rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-gray-500 dark:text-gray-400 mb-1">Longitude</label>
                  <input
                    type="number"
                    step="any"
                    value={form.longitude}
                    onChange={(e) => handleChange("longitude", parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 text-sm font-mono rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Radius Geofencing Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <div>
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                    Radius Toleransi Geofencing
                  </label>
                  <p className="text-[11px] text-gray-400">
                    Jarak maksimum pegawai dari titik pusat RS agar presensi diakui dalam area
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {form.geofenceRadiusMeters}
                  </span>
                  <span className="text-xs text-gray-400">meter</span>
                </div>
              </div>

              <input
                type="range"
                min={20}
                max={500}
                step={10}
                value={form.geofenceRadiusMeters}
                onChange={(e) => handleChange("geofenceRadiusMeters", parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                <span>20 m (Sangat Ketat)</span>
                <span>100 m (Standar RS)</span>
                <span>250 m</span>
                <span>500 m (Area Luas)</span>
              </div>
            </div>

            {/* Security Toggles for Geofencing */}
            <div className="pt-2 border-t border-gray-100 dark:border-gray-800 space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/40">
                <div className="flex items-start gap-3">
                  <ShieldAlert className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Wajib Berada di Dalam Radius (Strict Geofence)
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
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

              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/40">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Anti Mock Location & Fake GPS Protection
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
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

        {/* ── Card 2: Setting Toleransi Keterlambatan ── */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">Toleransi Keterlambatan & Jam Kerja</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Aturan batas menit keterlambatan dan jendela waktu presensi masuk/pulang
              </p>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Toleransi Keterlambatan Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <div>
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                    Batas Toleransi Keterlambatan Masuk
                  </label>
                  <p className="text-[11px] text-gray-400">
                    Pegawai yang clock-in setelah jam shift + batas ini akan otomatis tercatat sebagai "Terlambat"
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xl font-bold text-amber-600 dark:text-amber-400">
                    {form.lateToleranceMinutes}
                  </span>
                  <span className="text-xs text-gray-400">menit</span>
                </div>
              </div>

              <input
                type="range"
                min={0}
                max={45}
                step={5}
                value={form.lateToleranceMinutes}
                onChange={(e) => handleChange("lateToleranceMinutes", parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                <span>0 m (Tanpa Toleransi)</span>
                <span>15 m (Standar)</span>
                <span>30 m</span>
                <span>45 m</span>
              </div>
            </div>

            {/* Simulasi Ilustrasi Toleransi */}
            <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-900/10 border border-amber-200/80 dark:border-amber-800/50 flex items-start gap-3">
              <Info className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs text-gray-700 dark:text-gray-300 space-y-1">
                <p className="font-semibold text-amber-800 dark:text-amber-300">Contoh Simulasi Shift Pagi (07:00):</p>
                <p>• Clock-in pukul <strong>07:00 – 07:{form.lateToleranceMinutes.toString().padStart(2, "0")}</strong> → Status <span className="text-green-600 font-semibold">Tepat Waktu (On-Time)</span></p>
                <p>• Clock-in pukul <strong>07:{form.lateToleranceMinutes + 1 > 59 ? "59" : (form.lateToleranceMinutes + 1).toString().padStart(2, "0")} ke atas</strong> → Status <span className="text-red-600 font-semibold">Terlambat (Late)</span></p>
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
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
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
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                    menit stlh shift
                  </span>
                </div>
                <p className="text-[10px] text-gray-400 mt-1">Jendela checkout ditutup {form.maxClockOutMinutes} mnt setelah shift berakhir</p>
              </div>
            </div>

            {/* Additional verification settings */}
            <div className="pt-2 border-t border-gray-100 dark:border-gray-800 space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/40">
                <div className="flex items-start gap-3">
                  <Camera className="h-5 w-5 text-purple-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Wajib Selfie Kamera Depan (Face Verification)
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
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

              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/40">
                <div className="flex items-start gap-3">
                  <Bell className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Notifikasi Otomatis ke Supervisor Saat Keterlambatan
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
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

        {/* Bottom Save Bar */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={handleReset}
            className="px-5 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-colors"
          >
            Batal / Reset
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 shadow-md shadow-blue-200 dark:shadow-none rounded-xl transition-all"
          >
            <Check className="h-4 w-4" />
            Simpan Perubahan
          </button>
        </div>
      </form>
    </div>
  )
}

export { SettingsPage }
