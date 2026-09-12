import { useState, useRef, useEffect } from "react"
import {
  Camera, MapPin, CheckCircle2, AlertCircle, X, RefreshCw,
  ShieldCheck, ShieldAlert, Clock, Sparkles
} from "lucide-react"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import { calculateDistanceMeters, formatDistance } from "@/utils/geo"
import { DEFAULT_SETTINGS } from "@/data/settings"
import type { AttendanceRecord, AppSettings, AttendanceStatus } from "@/types"

interface AttendanceModalProps {
  isOpen: boolean
  onClose: () => void
  type: "clock-in" | "clock-out"
  employeeId: string
  shiftName?: string
  shiftStartTime?: string
  shiftEndTime?: string
  existingRecord?: AttendanceRecord | null
  onSuccess?: () => void
}

export const AttendanceModal = ({
  isOpen,
  onClose,
  type,
  employeeId,
  shiftName = "Shift Pagi",
  shiftStartTime = "07:00",
  existingRecord,
  onSuccess,
}: AttendanceModalProps) => {
  const [settings] = useLocalStorage<AppSettings>("app_settings", DEFAULT_SETTINGS)
  const [, setAttendance] = useLocalStorage<AttendanceRecord[]>("attendance", [])

  // Camera state
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [photo, setPhoto] = useState<string | null>(null)
  const [cameraError, setCameraError] = useState<string>("")
  const [cameraLoading, setCameraLoading] = useState<boolean>(true)

  // GPS state
  const [gpsLoading, setGpsLoading] = useState<boolean>(true)
  const [distance, setDistance] = useState<number | null>(null)

  // Processing state
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false)

  // Current live time
  const [nowTime, setNowTime] = useState(
    new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
  )

  useEffect(() => {
    const timer = setInterval(() => {
      setNowTime(new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" }))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Start Camera & GPS when modal opens
  useEffect(() => {
    if (!isOpen) {
      stopCamera()
      return
    }

    setPhoto(null)
    setSubmitSuccess(false)
    startCamera()
    getGpsLocation()

    return () => {
      stopCamera()
    }
  }, [isOpen])

  const startCamera = async () => {
    setCameraLoading(true)
    setCameraError("")
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false,
      })
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
      setCameraLoading(false)
    } catch (err: any) {
      console.warn("Camera access failed or unavailable:", err)
      setCameraError("Kamera tidak dapat diakses atau izin ditolak. Menggunakan simulasi kamera.")
      setCameraLoading(false)
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
  }

  const getGpsLocation = () => {
    setGpsLoading(true)

    if (!navigator.geolocation) {
      // Fallback simulasi lokasi dalam radius RS
      setDistance(15)
      setGpsLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const userLat = pos.coords.latitude
        const userLon = pos.coords.longitude
        const dist = calculateDistanceMeters(settings.latitude, settings.longitude, userLat, userLon)
        setDistance(dist)
        setGpsLoading(false)
      },
      (_err) => {
        // Jika gagal dapat GPS (misal di desktop tanpa GPS), fallback simulasi dalam radius RS
        const simulatedDist = 25
        setDistance(simulatedDist)
        setGpsLoading(false)
      },
      { enableHighAccuracy: settings.requireHighAccuracyGps, timeout: 8000 }
    )
  }

  // Capture Photo
  const handleCapture = () => {
    if (videoRef.current) {
      const video = videoRef.current
      const canvas = document.createElement("canvas")
      canvas.width = video.videoWidth || 640
      canvas.height = video.videoHeight || 480
      const ctx = canvas.getContext("2d")
      if (ctx) {
        // Mirror horizontally for selfie
        ctx.translate(canvas.width, 0)
        ctx.scale(-1, 1)
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        const dataUrl = canvas.toDataURL("image/jpeg", 0.85)
        setPhoto(dataUrl)
        stopCamera()
      }
    } else {
      // Mock selfie snapshot jika webcam tidak ada
      const mockCanvas = document.createElement("canvas")
      mockCanvas.width = 400
      mockCanvas.height = 400
      const ctx = mockCanvas.getContext("2d")
      if (ctx) {
        ctx.fillStyle = "#3b82f6"
        ctx.fillRect(0, 0, 400, 400)
        ctx.fillStyle = "#ffffff"
        ctx.font = "20px sans-serif"
        ctx.textAlign = "center"
        ctx.fillText("Selfie Verifikasi RS", 200, 200)
        setPhoto(mockCanvas.toDataURL("image/jpeg", 0.8))
      }
    }
  }

  const handleRetake = () => {
    setPhoto(null)
    startCamera()
  }

  // Cek apakah di dalam radius geofence
  const isInsideGeofence = distance !== null ? distance <= settings.geofenceRadiusMeters : true
  const canSubmitLocation = !settings.blockOutsideGeofence || isInsideGeofence

  // Hitung status ketepatan waktu
  const determineStatus = (): AttendanceStatus => {
    const today = new Date()
    const currentH = today.getHours()
    const currentM = today.getMinutes()
    const currentTotalMins = currentH * 60 + currentM

    const [sh, sm] = shiftStartTime.split(":").map(Number)
    const shiftStartTotalMins = sh * 60 + sm
    const lateThreshold = shiftStartTotalMins + settings.lateToleranceMinutes

    if (currentTotalMins > lateThreshold) {
      return "late"
    }
    return "on-time"
  }

  // Submit Presensi
  const handleSubmitAttendance = () => {
    if (!photo && settings.requireSelfie) return
    if (!canSubmitLocation) return

    setIsSubmitting(true)
    const todayDate = new Date().toISOString().split("T")[0]
    const currentTimeStr = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }).replace(".", ":")

    setTimeout(() => {
      if (type === "clock-in") {
        const calculatedStatus = determineStatus()
        const newRecord: AttendanceRecord = {
          id: `att-${Date.now()}`,
          employeeId,
          date: todayDate,
          clockInTime: currentTimeStr,
          photoBase64: photo ?? undefined,
          location: isInsideGeofence ? "inside" : "outside",
          status: calculatedStatus,
        }
        setAttendance((prev) => [newRecord, ...prev.filter((a) => !(a.employeeId === employeeId && a.date === todayDate))])
      } else {
        // Clock Out
        setAttendance((prev) =>
          prev.map((a) => {
            if (a.id === existingRecord?.id || (a.employeeId === employeeId && a.date === todayDate)) {
              const inTime = a.clockInTime || "07:00"
              const [inH, inM] = inTime.split(":").map(Number)
              const [outH, outM] = currentTimeStr.split(":").map(Number)
              let hours = (outH * 60 + outM - (inH * 60 + inM)) / 60
              if (hours < 0) hours += 24 // overnight
              return {
                ...a,
                clockOutTime: currentTimeStr,
                totalHours: parseFloat(hours.toFixed(1)),
              }
            }
            return a
          })
        )
      }

      setIsSubmitting(false)
      setSubmitSuccess(true)
      if (onSuccess) onSuccess()

      setTimeout(() => {
        onClose()
      }, 1500)
    }, 800)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={onClose} />

      <div className="relative bg-white dark:bg-gray-900 rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-lg border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col max-h-[96vh] sm:max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className={`p-2 rounded-xl shrink-0 ${type === "clock-in" ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600" : "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600"}`}>
              <Clock className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm sm:text-base font-bold text-gray-900 dark:text-gray-100 truncate">
                {type === "clock-in" ? "Presensi Masuk (Clock-In)" : "Presensi Pulang (Clock-Out)"}
              </h2>
              <p className="text-[11px] sm:text-xs text-gray-400 truncate">
                {shiftName} ({shiftStartTime}) · <strong className="text-gray-700 dark:text-gray-300">{nowTime}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 transition-colors shrink-0"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-3.5 sm:space-y-5 flex-1">
          {submitSuccess ? (
            <div className="py-6 sm:py-8 text-center space-y-3">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="h-8 w-8 sm:h-10 sm:w-10" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100">
                Presensi Berhasil Dicatat!
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                {type === "clock-in" ? "Selamat bertugas! Data presensi masuk telah tersimpan." : "Terima kasih atas dedikasi Anda hari ini! Data presensi pulang telah dicatat."}
              </p>
            </div>
          ) : (
            <>
              {/* Camera Preview / Captured Photo */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                    <Camera className="h-3.5 w-3.5 text-blue-500" />
                    Foto Selfie {settings.requireSelfie ? "(Wajib)" : "(Opsional)"}
                  </label>
                  {photo && (
                    <button
                      type="button"
                      onClick={handleRetake}
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                    >
                      <RefreshCw className="h-3 w-3" /> Ambil Ulang
                    </button>
                  )}
                </div>

                <div className="relative aspect-[4/3] max-h-[220px] sm:max-h-[280px] w-full bg-gray-900 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 flex items-center justify-center shadow-inner mx-auto">
                  {photo ? (
                    <img src={photo} alt="Selfie Presensi" className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover scale-x-[-1]"
                      />
                      {cameraLoading && (
                        <div className="absolute inset-0 bg-gray-900 flex items-center justify-center text-white text-xs gap-2">
                          <RefreshCw className="h-4 w-4 animate-spin text-blue-400" />
                          Menghubungkan kamera...
                        </div>
                      )}
                      {cameraError && (
                        <div className="absolute inset-0 bg-gray-900/90 p-4 flex flex-col items-center justify-center text-center text-xs text-gray-300 gap-2">
                          <AlertCircle className="h-6 w-6 text-amber-400" />
                          <p>{cameraError}</p>
                          <button
                            type="button"
                            onClick={handleCapture}
                            className="mt-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium text-xs flex items-center gap-1"
                          >
                            <Sparkles className="h-3.5 w-3.5" /> Gunakan Foto Verifikasi
                          </button>
                        </div>
                      )}

                      {!cameraLoading && !cameraError && (
                        <div className="absolute bottom-3 inset-x-0 flex justify-center">
                          <button
                            type="button"
                            onClick={handleCapture}
                            className="flex items-center gap-2 px-4 py-2 bg-white/90 hover:bg-white text-gray-900 font-semibold text-xs rounded-full shadow-lg backdrop-blur-sm transition-all active:scale-95 cursor-pointer"
                          >
                            <Camera className="h-4 w-4 text-blue-600" />
                            Ambil Foto Selfie
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Geolocation Verification Card */}
              <div className="p-3 sm:p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 space-y-2.5 sm:space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className={`p-1.5 rounded-lg shrink-0 ${isInsideGeofence ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400"}`}>
                      <MapPin className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-gray-900 dark:text-gray-100 truncate">
                        {settings.hospitalName}
                      </p>
                      <p className="text-[10px] sm:text-[11px] text-gray-500 dark:text-gray-400 truncate">
                        Maksimal radius: <strong>{settings.geofenceRadiusMeters} m</strong>
                      </p>
                    </div>
                  </div>

                  {gpsLoading ? (
                    <span className="text-[11px] text-gray-400 flex items-center gap-1 shrink-0">
                      <RefreshCw className="h-3 w-3 animate-spin" /> Cek GPS...
                    </span>
                  ) : distance !== null ? (
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[11px] sm:text-xs font-semibold shrink-0 ${isInsideGeofence ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400"}`}>
                      {isInsideGeofence ? <ShieldCheck className="h-3.5 w-3.5" /> : <ShieldAlert className="h-3.5 w-3.5" />}
                      {formatDistance(distance)} ({isInsideGeofence ? "Dalam Area" : "Luar Radius"})
                    </span>
                  ) : null}
                </div>

                {!isInsideGeofence && (
                  <div className="p-2.5 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-xs text-red-600 dark:text-red-400 flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                    <p>
                      {settings.blockOutsideGeofence
                        ? `Anda berada di luar radius rumah sakit (${formatDistance(distance ?? 0)}). Presensi terkunci oleh sistem geofencing.`
                        : `Peringatan: Anda berada di luar radius rumah sakit. Presensi akan tercatat sebagai "Luar RS".`}
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer Actions */}
        {!submitSuccess && (
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 flex gap-2.5 sm:gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 rounded-xl transition-colors"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleSubmitAttendance}
              disabled={(!photo && settings.requireSelfie) || !canSubmitLocation || isSubmitting}
              className={`flex-1 py-2.5 text-xs sm:text-sm font-semibold text-white rounded-xl transition-all flex items-center justify-center gap-1.5 sm:gap-2 shadow-md ${
                type === "clock-in"
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 shadow-blue-200 dark:shadow-none"
                  : "bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 shadow-emerald-200 dark:shadow-none"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" /> Menyimpan...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  {type === "clock-in" ? "Konfirmasi Masuk" : "Konfirmasi Pulang"}
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
