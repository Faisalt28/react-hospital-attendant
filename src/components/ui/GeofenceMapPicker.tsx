import { useState, useRef, useCallback, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Navigation, MapPin, X, Loader2, ChevronDown, ChevronUp } from "lucide-react"

interface GeofenceMapPickerProps {
  latitude: number
  longitude: number
  radius: number
  onLocationChange: (lat: number, lng: number) => void
  onRadiusChange: (radius: number) => void
}

interface SearchResult {
  place_id: number
  display_name: string
  lat: string
  lon: string
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
  const pct = ((value - min) / (max - min)) * 100

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
    const onUp = () => { isDragging.current = false }

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

  const ticks = [20, 100, 200, 300, 400, 500]

  return (
    <div className="select-none space-y-2">
      {/* Track */}
      <div
        ref={trackRef}
        className="relative h-6 flex items-center cursor-pointer"
        onClick={handleTrackClick}
      >
        {/* Background */}
        <div className="absolute left-0 right-0 h-2 rounded-full bg-gray-200 dark:bg-gray-700" />
        {/* Fill */}
        <div
          className="absolute left-0 h-2 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 pointer-events-none"
          style={{ width: `${pct}%` }}
        />
        {/* Thumb */}
        <motion.div
          className="absolute w-5 h-5 rounded-full bg-white border-2 border-blue-500 shadow-md cursor-grab active:cursor-grabbing z-10 touch-none"
          style={{ left: `calc(${pct}% - 10px)` }}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          onMouseDown={handleThumbMouseDown}
          onTouchStart={handleThumbTouchStart}
        />
      </div>

      {/* Tick labels */}
      <div className="relative h-4">
        {ticks.map((tick) => {
          const tp = ((tick - min) / (max - min)) * 100
          return (
            <button
              key={tick}
              type="button"
              onClick={() => onChange(tick)}
              className={`absolute text-[10px] -translate-x-1/2 transition-colors ${
                value === tick
                  ? "text-blue-600 dark:text-blue-400 font-bold"
                  : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              }`}
              style={{ left: `${tp}%` }}
            >
              {tick}m
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─── OpenStreetMap Iframe Embed ───────────────────────────────────────────────
const MapEmbed = ({ lat, lng, radius }: { lat: number; lng: number; radius: number }) => {
  const delta = radius > 300 ? 0.008 : radius > 100 ? 0.005 : 0.003
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - delta},${lat - delta},${lng + delta},${lat + delta}&layer=mapnik&marker=${lat},${lng}`

  return (
    <div className="relative w-full h-full">
      <iframe
        src={src}
        className="w-full h-full border-0 rounded-xl"
        title="Peta Lokasi Rumah Sakit"
        key={`${lat.toFixed(4)}-${lng.toFixed(4)}`}
      />
      {/* Radius ring overlay */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center rounded-xl overflow-hidden">
        <motion.div
          className="rounded-full border-2 border-blue-500/50 bg-blue-400/10"
          animate={{
            width: `${Math.max(20, Math.min(88, (radius / 500) * 100))}%`,
            height: `${Math.max(20, Math.min(88, (radius / 500) * 100))}%`,
          }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
        />
      </div>
      {/* Radius badge */}
      <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/60 backdrop-blur-sm rounded-md text-white text-[11px] font-mono">
        r = {radius} m
      </div>
    </div>
  )
}

// ─── Main Geofence Map Picker ─────────────────────────────────────────────────
const GeofenceMapPicker = ({
  latitude,
  longitude,
  radius,
  onLocationChange,
  onRadiusChange,
}: GeofenceMapPickerProps) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [geoLoading, setGeoLoading] = useState(false)
  const [geoError, setGeoError] = useState("")
  const [showDropdown, setShowDropdown] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const hasCoords = latitude !== 0 || longitude !== 0

  // Nominatim search (OpenStreetMap, no API key)
  const doSearch = useCallback(async (q: string) => {
    if (q.trim().length < 3) { setSearchResults([]); setShowDropdown(false); return }
    setIsSearching(true)
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=5`,
        { headers: { "Accept-Language": "id" } }
      )
      const data: SearchResult[] = await res.json()
      setSearchResults(data)
      setShowDropdown(data.length > 0)
    } catch { setSearchResults([]) }
    finally { setIsSearching(false) }
  }, [])

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => doSearch(e.target.value), 500)
  }

  const selectResult = (r: SearchResult) => {
    onLocationChange(parseFloat(r.lat), parseFloat(r.lon))
    setSearchQuery(r.display_name.split(",").slice(0, 3).join(","))
    setShowDropdown(false)
  }

  const getGPS = () => {
    if (!navigator.geolocation) { setGeoError("Browser tidak mendukung geolokasi."); return }
    setGeoLoading(true); setGeoError("")
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
        setGeoError(err.code === err.PERMISSION_DENIED
          ? "Izin lokasi ditolak. Aktifkan lokasi di browser."
          : "Gagal mendeteksi GPS: " + err.message)
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node))
        setShowDropdown(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/30">
            <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {hasCoords ? "Titik Pusat Lokasi RS" : "Belum ada koordinat"}
            </p>
            {hasCoords && (
              <p className="text-[11px] font-mono text-gray-400">
                {latitude.toFixed(5)}°, {longitude.toFixed(5)}°
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {hasCoords && (
            <motion.div
              className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-full bg-green-50 dark:bg-green-900/20"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ repeat: Infinity, duration: 2.5 }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
              <span className="text-[10px] font-medium text-green-700 dark:text-green-400 uppercase tracking-wide">Live</span>
            </motion.div>
          )}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-800/40 rounded-lg transition-colors"
          >
            {isExpanded
              ? <><ChevronUp className="h-3.5 w-3.5" /> Tutup</>
              : <><ChevronDown className="h-3.5 w-3.5" /> Buka Peta</>
            }
          </button>
        </div>
      </div>

      {/* ── Collapsed preview ── */}
      {!isExpanded && (
        <div className="px-4 py-3">
          <div className="relative h-[72px] rounded-xl overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-100 dark:border-blue-900/30">
            {/* Grid */}
            <svg className="absolute inset-0 w-full h-full opacity-20" preserveAspectRatio="none">
              {[25, 50, 75].map(y => <line key={y} x1="0%" y1={`${y}%`} x2="100%" y2={`${y}%`} className="stroke-blue-400" strokeWidth="1" />)}
              {[20, 40, 60, 80].map(x => <line key={x} x1={`${x}%`} y1="0%" x2={`${x}%`} y2="100%" className="stroke-blue-400" strokeWidth="1" />)}
            </svg>
            {/* Center pulse */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <motion.div
                  className="absolute rounded-full bg-blue-400/30 border border-blue-400/40"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  style={{ width: 32, height: 32, top: -7, left: -7 }}
                />
                <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400 relative z-10" />
              </div>
            </div>
            {/* Info */}
            <div className="absolute bottom-1.5 left-2 text-[10px] font-mono text-blue-500">
              {hasCoords ? `${latitude.toFixed(4)}, ${longitude.toFixed(4)}` : "Klik 'Buka Peta' untuk set koordinat"}
            </div>
            <div className="absolute top-1.5 left-2 px-2 py-0.5 rounded-full bg-blue-600/80 text-white text-[10px] font-medium">
              r: {radius}m
            </div>
          </div>
        </div>
      )}

      {/* ── Expanded map panel ── */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 280, damping: 28 }}
            className="overflow-hidden"
          >
            <div className="p-4 space-y-4">

              {/* Search + GPS */}
              <div ref={searchRef} className="relative">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Cari nama RS, alamat, atau kota..."
                      value={searchQuery}
                      onChange={handleInput}
                      className="w-full pl-9 pr-8 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
                    />
                    {isSearching
                      ? <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-blue-500 animate-spin" />
                      : searchQuery
                        ? <button type="button" onClick={() => { setSearchQuery(""); setShowDropdown(false) }} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"><X className="h-3.5 w-3.5" /></button>
                        : null
                    }
                  </div>
                  <button
                    type="button"
                    onClick={getGPS}
                    disabled={geoLoading}
                    title="Gunakan lokasi GPS saat ini"
                    className="flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-800/40 rounded-xl transition-colors disabled:opacity-60 shrink-0"
                  >
                    {geoLoading
                      ? <Loader2 className="h-4 w-4 animate-spin" />
                      : <Navigation className="h-4 w-4" />
                    }
                    <span className="hidden sm:inline">{geoLoading ? "Mendeteksi..." : "Lokasi Saya"}</span>
                  </button>
                </div>

                {/* Dropdown results */}
                <AnimatePresence>
                  {showDropdown && searchResults.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 right-12 sm:right-0 mt-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden"
                    >
                      {searchResults.map((r) => (
                        <button
                          key={r.place_id}
                          type="button"
                          onClick={() => selectResult(r)}
                          className="w-full text-left px-4 py-2.5 flex items-start gap-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors border-b border-gray-50 dark:border-gray-800 last:border-0"
                        >
                          <MapPin className="h-3.5 w-3.5 text-blue-500 shrink-0 mt-0.5" />
                          <span className="text-xs text-gray-700 dark:text-gray-300 line-clamp-2">{r.display_name}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {geoError && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-red-500 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg"
                >
                  ⚠ {geoError}
                </motion.p>
              )}

              {/* Map */}
              {hasCoords ? (
                <motion.div
                  key={`${latitude.toFixed(3)}-${longitude.toFixed(3)}`}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="h-60 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700"
                >
                  <MapEmbed lat={latitude} lng={longitude} radius={radius} />
                </motion.div>
              ) : (
                <div className="h-48 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center gap-2 text-gray-400">
                  <MapPin className="h-8 w-8 opacity-25" />
                  <p className="text-xs text-center px-4">
                    Cari nama rumah sakit di atas atau klik "Lokasi Saya" untuk menentukan titik pusat RS
                  </p>
                </div>
              )}

              {/* Radius slider */}
              <div className="pt-2 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">Radius Toleransi</p>
                    <p className="text-[11px] text-gray-400">Jarak maksimum dari titik pusat RS</p>
                  </div>
                  <div className="flex items-baseline gap-1 bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-xl min-w-[72px] justify-center">
                    <motion.span
                      key={radius}
                      initial={{ scale: 1.25 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 20 }}
                      className="text-xl font-bold text-blue-600 dark:text-blue-400 tabular-nums"
                    >
                      {radius}
                    </motion.span>
                    <span className="text-xs text-gray-400">m</span>
                  </div>
                </div>
                <RadiusSlider value={radius} min={20} max={500} onChange={onRadiusChange} />
                <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                  <span>Sangat ketat</span>
                  <span>Standar RS (~100m)</span>
                  <span>Area luas</span>
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export { GeofenceMapPicker }
