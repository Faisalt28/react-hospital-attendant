import { useState, useRef, useCallback, useEffect } from "react"
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion"
import {
  Search,
  Navigation,
  MapPin,
  X,
  Loader2,
  Globe,
  Minimize2,
} from "lucide-react"

export interface GeofenceMapPickerProps {
  latitude: number
  longitude: number
  radius: number
  hospitalName?: string
  address?: string
  onLocationChange: (lat: number, lng: number) => void
  onRadiusChange: (radius: number) => void
  onHospitalNameChange?: (name: string) => void
  onAddressChange?: (address: string) => void
}

interface SearchResult {
  place_id: number
  display_name: string
  lat: string
  lon: string
}

// ─── Format Koordinat: e.g. 6.2088° S, 106.8456° E ─────────────────────────
const formatCoordinates = (lat: number, lng: number) => {
  const latDir = lat >= 0 ? "N" : "S"
  const lngDir = lng >= 0 ? "E" : "W"
  return `${Math.abs(lat).toFixed(4)}° ${latDir}, ${Math.abs(lng).toFixed(4)}° ${lngDir}`
}

// ─── Custom Draggable Radius Slider ──────────────────────────────────────────
const RadiusSlider = ({
  value,
  min = 20,
  max = 500,
  onChange,
}: {
  value: number
  min?: number
  max?: number
  onChange: (v: number) => void
}) => {
  const trackRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const pct = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100))

  const getValueFromClientX = useCallback(
    (clientX: number) => {
      if (!trackRef.current) return value
      const rect = trackRef.current.getBoundingClientRect()
      const raw = ((clientX - rect.left) / rect.width) * (max - min) + min
      return Math.round(Math.min(max, Math.max(min, raw)) / 10) * 10
    },
    [min, max, value]
  )

  const handleTrackClick = (e: React.MouseEvent) => {
    onChange(getValueFromClientX(e.clientX))
  }

  const handleThumbMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true
    e.preventDefault()
    e.stopPropagation()
  }

  const handleThumbTouchStart = (e: React.TouchEvent) => {
    isDragging.current = true
    e.stopPropagation()
  }

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (isDragging.current) onChange(getValueFromClientX(e.clientX))
    }
    const onTouchMove = (e: TouchEvent) => {
      if (isDragging.current) onChange(getValueFromClientX(e.touches[0].clientX))
    }
    const onUp = () => {
      isDragging.current = false
    }

    window.addEventListener("mousemove", onMove)
    window.addEventListener("mouseup", onUp)
    window.addEventListener("touchmove", onTouchMove, { passive: true })
    window.addEventListener("touchend", onUp)
    return () => {
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("mouseup", onUp)
      window.removeEventListener("touchmove", onTouchMove)
      window.removeEventListener("touchend", onUp)
    }
  }, [getValueFromClientX, onChange])

  const ticks = [20, 50, 100, 200, 300, 500]

  return (
    <div className="select-none space-y-2">
      {/* Track */}
      <div
        ref={trackRef}
        className="relative h-6 flex items-center cursor-pointer"
        onClick={handleTrackClick}
      >
        {/* Background */}
        <div className="absolute left-0 right-0 h-2 rounded-full bg-gray-200 dark:bg-gray-800" />
        {/* Fill */}
        <div
          className="absolute left-0 h-2 rounded-full bg-gradient-to-r from-emerald-400 via-teal-500 to-blue-600 pointer-events-none transition-all duration-75"
          style={{ width: `${pct}%` }}
        />
        {/* Tick markers */}
        {ticks.map((t) => {
          const tp = ((t - min) / (max - min)) * 100
          const isPassed = t <= value
          return (
            <div
              key={t}
              className={`absolute w-2 h-2 rounded-full -translate-x-1/2 pointer-events-none transition-colors ${
                isPassed ? "bg-white border-2 border-emerald-500" : "bg-gray-300 dark:bg-gray-700"
              }`}
              style={{ left: `${tp}%` }}
            />
          )
        })}
        {/* Thumb */}
        <motion.div
          className="absolute w-5 h-5 rounded-full bg-white dark:bg-gray-100 border-2 border-emerald-500 shadow-lg cursor-grab active:cursor-grabbing z-10 touch-none -translate-x-1/2"
          style={{ left: `${pct}%` }}
          whileHover={{ scale: 1.25 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          onMouseDown={handleThumbMouseDown}
          onTouchStart={handleThumbTouchStart}
        />
      </div>

      {/* Preset Buttons */}
      <div className="flex items-center justify-between gap-1 pt-1">
        {ticks.map((tick) => (
          <button
            key={tick}
            type="button"
            onClick={() => onChange(tick)}
            className={`px-2 py-1 text-[11px] rounded-lg font-medium transition-all ${
              value === tick
                ? "bg-emerald-500 text-white shadow-sm shadow-emerald-500/30 font-bold"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            {tick}m
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Main Geofence Map Picker ─────────────────────────────────────────────────
export function GeofenceMapPicker({
  latitude,
  longitude,
  radius,
  hospitalName = "RSUD MediTrack Utama",
  address = "Jl. Kesehatan Raya No. 45, Jakarta Pusat",
  onLocationChange,
  onRadiusChange,
  onHospitalNameChange,
  onAddressChange,
}: GeofenceMapPickerProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [showLiveEmbed, setShowLiveEmbed] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [geoLoading, setGeoLoading] = useState(false)
  const [geoError, setGeoError] = useState("")
  const [showDropdown, setShowDropdown] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)

  // 3D Perspective Tilt Physics
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const rotateX = useTransform(mouseY, [-60, 60], [6, -6])
  const rotateY = useTransform(mouseX, [-60, 60], [-6, 6])
  const springRotateX = useSpring(rotateX, { stiffness: 320, damping: 30 })
  const springRotateY = useSpring(rotateY, { stiffness: 320, damping: 30 })

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!mapContainerRef.current || isExpanded) return
    const rect = mapContainerRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    mouseX.set(e.clientX - centerX)
    mouseY.set(e.clientY - centerY)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
    setIsHovered(false)
  }

  // OpenStreetMap Nominatim search
  const doSearch = useCallback(async (q: string) => {
    if (q.trim().length < 3) {
      setSearchResults([])
      setShowDropdown(false)
      return
    }
    setIsSearching(true)
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=5`,
        { headers: { "Accept-Language": "id" } }
      )
      const data: SearchResult[] = await res.json()
      setSearchResults(data)
      setShowDropdown(data.length > 0)
    } catch {
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }, [])

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => doSearch(e.target.value), 450)
  }

  const selectResult = (r: SearchResult) => {
    const lat = parseFloat(parseFloat(r.lat).toFixed(6))
    const lon = parseFloat(parseFloat(r.lon).toFixed(6))
    onLocationChange(lat, lon)
    const placeName = r.display_name.split(",")[0]
    if (onHospitalNameChange && placeName) {
      onHospitalNameChange(placeName)
    }
    if (onAddressChange) {
      onAddressChange(r.display_name.split(",").slice(1, 4).join(",").trim())
    }
    setSearchQuery("")
    setShowDropdown(false)
  }

  const getGPS = () => {
    if (!navigator.geolocation) {
      setGeoError("Browser tidak mendukung geolokasi.")
      return
    }
    setGeoLoading(true)
    setGeoError("")
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onLocationChange(
          parseFloat(pos.coords.latitude.toFixed(6)),
          parseFloat(pos.coords.longitude.toFixed(6))
        )
        setGeoLoading(false)
      },
      (err) => {
        setGeoLoading(false)
        setGeoError(
          err.code === err.PERMISSION_DENIED
            ? "Izin akses lokasi ditolak di browser."
            : "Gagal mendeteksi lokasi GPS: " + err.message
        )
      },
      { enableHighAccuracy: true, timeout: 12000 }
    )
  }

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const formattedCoord = formatCoordinates(latitude, longitude)
  const delta = radius > 300 ? 0.008 : radius > 100 ? 0.005 : 0.003
  const embedSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${longitude - delta},${latitude - delta},${longitude + delta},${latitude + delta}&layer=mapnik&marker=${latitude},${longitude}`

  return (
    <div className="space-y-4">
      {/* ── Responsive Layout: Desktop Sejajar (2 Kolom), Mobile Vertikal ke Bawah ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ── SISI KIRI: 3D Expandable Map Card (Template expand-map.tsx) ── */}
        <div className="lg:col-span-5 flex flex-col items-center w-full">
          <motion.div
            ref={mapContainerRef}
            className="relative cursor-pointer select-none w-full"
            style={{ perspective: 1000 }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
            onClick={(e) => {
              if (
                (e.target as HTMLElement).closest("button") ||
                (e.target as HTMLElement).closest("iframe")
              ) {
                return
              }
              setIsExpanded(!isExpanded)
            }}
          >
            <motion.div
              className="relative overflow-hidden rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-md hover:shadow-xl dark:shadow-none transition-shadow"
              style={{
                rotateX: isExpanded ? 0 : springRotateX,
                rotateY: isExpanded ? 0 : springRotateY,
                transformStyle: "preserve-3d",
              }}
              animate={{
                height: isExpanded ? 360 : 190,
              }}
              transition={{
                type: "spring",
                stiffness: 350,
                damping: 32,
              }}
            >
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/40 via-transparent to-blue-50/30 dark:from-emerald-950/20 dark:to-gray-900 pointer-events-none" />

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    className="absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35, delay: 0.05 }}
                  >
                    {showLiveEmbed ? (
                      /* Mode Live OpenStreetMap */
                      <div className="relative w-full h-full">
                        <iframe
                          src={embedSrc}
                          className="w-full h-full border-0 rounded-2xl"
                          title="Peta Interaktif Rumah Sakit"
                          key={`${latitude.toFixed(4)}-${longitude.toFixed(4)}`}
                        />
                        {/* Geofence Ring */}
                        <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
                          <motion.div
                            className="rounded-full border-2 border-emerald-500/60 bg-emerald-400/15"
                            animate={{
                              width: `${Math.max(25, Math.min(85, (radius / 500) * 100))}%`,
                              height: `${Math.max(25, Math.min(85, (radius / 500) * 100))}%`,
                            }}
                            transition={{ type: "spring", stiffness: 200, damping: 25 }}
                          />
                        </div>
                        {/* Switcher Button */}
                        <div className="absolute top-3 left-3 z-20">
                          <button
                            type="button"
                            onClick={() => setShowLiveEmbed(false)}
                            className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-lg shadow border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-white transition-colors cursor-pointer"
                          >
                            <Minimize2 className="h-3 w-3" />
                            Mode Vektor
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Mode Blueprint Stylized Vector Map */
                      <div className="absolute inset-0 bg-slate-50 dark:bg-gray-950 overflow-hidden">
                        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                          {/* Main roads */}
                          <motion.line
                            x1="0%"
                            y1="38%"
                            x2="100%"
                            y2="38%"
                            className="stroke-gray-300 dark:stroke-gray-700"
                            strokeWidth="5"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.8, delay: 0.15 }}
                          />
                          <motion.line
                            x1="0%"
                            y1="68%"
                            x2="100%"
                            y2="68%"
                            className="stroke-gray-300 dark:stroke-gray-700"
                            strokeWidth="4"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.8, delay: 0.25 }}
                          />

                          {/* Vertical roads */}
                          <motion.line
                            x1="32%"
                            y1="0%"
                            x2="32%"
                            y2="100%"
                            className="stroke-gray-300/80 dark:stroke-gray-700/80"
                            strokeWidth="4"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                          />
                          <motion.line
                            x1="68%"
                            y1="0%"
                            x2="68%"
                            y2="100%"
                            className="stroke-gray-300/80 dark:stroke-gray-700/80"
                            strokeWidth="4"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                          />

                          {/* Secondary streets */}
                          {[18, 52, 84].map((y, i) => (
                            <motion.line
                              key={`h-${i}`}
                              x1="0%"
                              y1={`${y}%`}
                              x2="100%"
                              y2={`${y}%`}
                              className="stroke-gray-200 dark:stroke-gray-800"
                              strokeWidth="2"
                              initial={{ pathLength: 0 }}
                              animate={{ pathLength: 1 }}
                              transition={{ duration: 0.5, delay: 0.45 + i * 0.1 }}
                            />
                          ))}
                          {[14, 48, 86].map((x, i) => (
                            <motion.line
                              key={`v-${i}`}
                              x1={`${x}%`}
                              y1="0%"
                              x2={`${x}%`}
                              y2="100%"
                              className="stroke-gray-200 dark:stroke-gray-800"
                              strokeWidth="2"
                              initial={{ pathLength: 0 }}
                              animate={{ pathLength: 1 }}
                              transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
                            />
                          ))}
                        </svg>

                        {/* Stylized Buildings */}
                        <motion.div
                          className="absolute top-[42%] left-[10%] w-[16%] h-[20%] rounded-md bg-blue-100/60 dark:bg-blue-900/30 border border-blue-200/50 dark:border-blue-800/40"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.4, delay: 0.4 }}
                        />
                        <motion.div
                          className="absolute top-[16%] left-[38%] w-[14%] h-[16%] rounded-md bg-emerald-100/60 dark:bg-emerald-900/30 border border-emerald-200/50 dark:border-emerald-800/40"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.4, delay: 0.45 }}
                        />
                        <motion.div
                          className="absolute top-[72%] left-[72%] w-[20%] h-[18%] rounded-md bg-indigo-100/60 dark:bg-indigo-900/30 border border-indigo-200/50 dark:border-indigo-800/40"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.4, delay: 0.5 }}
                        />

                        {/* Animated Geofence Radius Ring */}
                        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                          <motion.div
                            className="rounded-full border-2 border-dashed border-emerald-500/60 bg-emerald-400/10"
                            initial={{ scale: 0 }}
                            animate={{
                              scale: 1,
                              width: `${Math.max(70, Math.min(240, (radius / 500) * 240))}px`,
                              height: `${Math.max(70, Math.min(240, (radius / 500) * 240))}px`,
                            }}
                            transition={{ type: "spring", stiffness: 300, damping: 25, delay: 0.2 }}
                          />
                        </div>

                        {/* Center Pin Marker */}
                        <motion.div
                          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none"
                          initial={{ scale: 0, y: -25 }}
                          animate={{ scale: 1, y: 0 }}
                          transition={{ type: "spring", stiffness: 450, damping: 22, delay: 0.25 }}
                        >
                          <div className="relative flex flex-col items-center">
                            <div className="p-2 rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/50">
                              <MapPin className="h-5 w-5 fill-white" />
                            </div>
                            <div className="w-2 h-1 bg-black/30 rounded-full mt-0.5 blur-[1px]" />
                          </div>
                        </motion.div>

                        {/* Switch to Live OSM Button */}
                        <div className="absolute top-3 left-3 z-20">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              setShowLiveEmbed(true)
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors cursor-pointer"
                          >
                            <Globe className="h-3.5 w-3.5" />
                            Buka Peta Satelit / OSM
                          </button>
                        </div>

                        {/* Bottom Gradient for readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-transparent to-transparent dark:from-gray-900/95 pointer-events-none" />
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Grid pattern when collapsed */}
              <motion.div
                className="absolute inset-0 opacity-[0.05] dark:opacity-[0.08] pointer-events-none"
                animate={{ opacity: isExpanded ? 0 : 0.05 }}
                transition={{ duration: 0.3 }}
              >
                <svg width="100%" height="100%" className="absolute inset-0">
                  <defs>
                    <pattern id="grid-pattern" width="24" height="24" patternUnits="userSpaceOnUse">
                      <path
                        d="M 24 0 L 0 0 0 24"
                        fill="none"
                        className="stroke-gray-900 dark:stroke-white"
                        strokeWidth="0.75"
                      />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid-pattern)" />
                </svg>
              </motion.div>

              {/* Content Overlay */}
              <div className="relative z-10 h-full flex flex-col justify-between p-5 pointer-events-none">
                {/* Top Bar */}
                <div className="flex items-start justify-between">
                  <div className="relative pointer-events-auto">
                    <motion.div
                      animate={{
                        opacity: isExpanded && showLiveEmbed ? 0 : 1,
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <motion.div
                        className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/40 text-emerald-500 shadow-sm"
                        animate={{
                          boxShadow: isHovered
                            ? "0 0 16px rgba(52, 211, 153, 0.45)"
                            : "0 0 8px rgba(52, 211, 153, 0.2)",
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        <MapPin className="h-4 w-4" />
                      </motion.div>
                    </motion.div>
                  </div>

                  {/* Status & Radius Pill */}
                  <motion.div
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/85 dark:bg-gray-800/85 border border-gray-200/60 dark:border-gray-700/60 backdrop-blur-md pointer-events-auto shadow-sm"
                    animate={{ scale: isHovered ? 1.05 : 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[11px] font-bold text-gray-800 dark:text-gray-200 tracking-wide uppercase">
                      Radius {radius}m
                    </span>
                  </motion.div>
                </div>

                {/* Bottom Title & Coordinates */}
                <div className="space-y-0.5 pointer-events-auto">
                  <motion.h3
                    className="text-gray-900 dark:text-gray-100 font-bold text-sm sm:text-base tracking-tight leading-tight line-clamp-1"
                    animate={{ x: isHovered ? 3 : 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    {hospitalName || "RSUD MediTrack Utama"}
                  </motion.h3>

                  {address && (
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-1">
                      {address}
                    </p>
                  )}

                  <p className="text-emerald-600 dark:text-emerald-400 text-xs font-mono font-medium">
                    {formattedCoord}
                  </p>

                  {/* Animated underline */}
                  <motion.div
                    className="h-0.5 rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-transparent"
                    initial={{ scaleX: 0.4, originX: 0 }}
                    animate={{
                      scaleX: isHovered || isExpanded ? 1 : 0.4,
                    }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                  />
                </div>
              </div>
            </motion.div>

            {/* Click to expand hint */}
            <motion.p
              className="mt-2 text-center text-[11px] font-medium text-gray-400 dark:text-gray-500 whitespace-nowrap"
              initial={{ opacity: 0 }}
              animate={{
                opacity: isHovered && !isExpanded ? 1 : 0.75,
                y: isHovered ? 0 : 2,
              }}
              transition={{ duration: 0.2 }}
            >
              {isExpanded ? "Klik untuk memperkecil" : "Klik peta untuk memperluas / interaktif"}
            </motion.p>
          </motion.div>
        </div>

        {/* ── SISI KANAN: Keterangan & Kontrol Geofencing (Sejajar di Desktop) ── */}
        <div className="lg:col-span-7 space-y-4 w-full">
          {/* 1. Pencarian RS / Alamat & GPS button */}
          <div ref={searchRef} className="relative space-y-1.5">
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
              Pencarian Lokasi & Koordinat RS
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Cari nama RS, alamat, atau kota..."
                  value={searchQuery}
                  onChange={handleInput}
                  className="w-full pl-9 pr-8 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 dark:focus:ring-emerald-600 transition-all"
                />
                {isSearching ? (
                  <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500 animate-spin" />
                ) : searchQuery ? (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("")
                      setShowDropdown(false)
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                ) : null}
              </div>

              {/* GPS Lokasi Saya button */}
              <button
                type="button"
                onClick={getGPS}
                disabled={geoLoading}
                title="Gunakan lokasi GPS perangkat saat ini"
                className="flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 border border-emerald-200/60 dark:border-emerald-800/50 rounded-xl transition-all disabled:opacity-60 shrink-0 cursor-pointer shadow-xs"
              >
                {geoLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Navigation className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                )}
                <span className="hidden sm:inline">
                  {geoLoading ? "Mendeteksi..." : "Lokasi Saya"}
                </span>
              </button>
            </div>

            {/* Nominatim Search Results Dropdown */}
            <AnimatePresence>
              {showDropdown && searchResults.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden"
                >
                  {searchResults.map((r) => (
                    <button
                      key={r.place_id}
                      type="button"
                      onClick={() => selectResult(r)}
                      className="w-full text-left px-4 py-2.5 flex items-start gap-2.5 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors border-b border-gray-100 dark:border-gray-800 last:border-0 cursor-pointer"
                    >
                      <MapPin className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-gray-900 dark:text-gray-100 line-clamp-1">
                          {r.display_name.split(",")[0]}
                        </p>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-1 mt-0.5">
                          {r.display_name}
                        </p>
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {geoError && (
              <p className="text-xs text-red-500 bg-red-50 dark:bg-red-900/20 px-3 py-1.5 rounded-lg">
                ⚠ {geoError}
              </p>
            )}
          </div>

          {/* 2. Slider Radius Toleransi Geofencing */}
          <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-800/40 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-900 dark:text-gray-100">
                  Radius Toleransi Geofencing
                </p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">
                  Jarak maksimal pegawai dari titik pusat RS untuk diizinkan absen
                </p>
              </div>
              <div className="flex items-baseline gap-1 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/50 px-3 py-1 rounded-xl">
                <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                  {radius}
                </span>
                <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">meter</span>
              </div>
            </div>

            <RadiusSlider value={radius} min={20} max={500} onChange={onRadiusChange} />
          </div>

          {/* 3. Koordinat Latitude & Longitude Manual Display */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-gray-500 dark:text-gray-400 mb-1">
                Latitude (Garis Lintang)
              </label>
              <input
                type="number"
                step="any"
                value={latitude}
                onChange={(e) => onLocationChange(parseFloat(e.target.value) || 0, longitude)}
                className="w-full px-3 py-1.5 text-xs font-mono rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-gray-500 dark:text-gray-400 mb-1">
                Longitude (Garis Bujur)
              </label>
              <input
                type="number"
                step="any"
                value={longitude}
                onChange={(e) => onLocationChange(latitude, parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-1.5 text-xs font-mono rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
