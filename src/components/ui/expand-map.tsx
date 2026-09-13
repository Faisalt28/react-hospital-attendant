"use client"

import type React from "react"
import { useState, useRef } from "react"
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion"
import { MapPin, Globe, Minimize2 } from "lucide-react"

export interface LocationMapProps {
  location?: string
  coordinates?: string
  className?: string
  latitude?: number
  longitude?: number
  radius?: number
  interactive?: boolean
}

export function LocationMap({
  location = "RSUD MediTrack Utama",
  coordinates = "-6.2088° S, 106.8456° E",
  className = "",
  latitude = -6.2088,
  longitude = 106.8456,
  radius = 100,
  interactive = true,
}: LocationMapProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [showLiveEmbed, setShowLiveEmbed] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useTransform(mouseY, [-50, 50], [6, -6])
  const rotateY = useTransform(mouseX, [-50, 50], [-6, 6])

  const springRotateX = useSpring(rotateX, { stiffness: 300, damping: 30 })
  const springRotateY = useSpring(rotateY, { stiffness: 300, damping: 30 })

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current || isExpanded) return
    const rect = containerRef.current.getBoundingClientRect()
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

  const handleClick = (e: React.MouseEvent) => {
    // If clicked on an interactive button inside, don't toggle collapse
    if ((e.target as HTMLElement).closest("button") || (e.target as HTMLElement).closest("iframe")) {
      return
    }
    setIsExpanded(!isExpanded)
  }

  const delta = radius > 300 ? 0.008 : radius > 100 ? 0.005 : 0.003
  const embedSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${longitude - delta},${latitude - delta},${longitude + delta},${latitude + delta}&layer=mapnik&marker=${latitude},${longitude}`

  return (
    <motion.div
      ref={containerRef}
      className={`relative cursor-pointer select-none w-full ${className}`}
      style={{
        perspective: 1000,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <motion.div
        className="relative overflow-hidden rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-xl dark:shadow-none transition-shadow"
        style={{
          rotateX: isExpanded ? 0 : springRotateX,
          rotateY: isExpanded ? 0 : springRotateY,
          transformStyle: "preserve-3d",
        }}
        animate={{
          height: isExpanded ? 340 : 160,
        }}
        transition={{
          type: "spring",
          stiffness: 350,
          damping: 32,
        }}
      >
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/40 via-transparent to-indigo-50/30 dark:from-blue-950/20 dark:to-gray-900 pointer-events-none" />

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
                /* Live Interactive OpenStreetMap Embed */
                <div className="relative w-full h-full">
                  <iframe
                    src={embedSrc}
                    className="w-full h-full border-0 rounded-2xl"
                    title="Peta Interaktif Rumah Sakit"
                    key={`${latitude.toFixed(4)}-${longitude.toFixed(4)}`}
                  />
                  {/* Radius circle indicator */}
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
                    <motion.div
                      className="rounded-full border-2 border-emerald-500/60 bg-emerald-400/15"
                      animate={{
                        width: `${Math.max(22, Math.min(85, (radius / 500) * 100))}%`,
                        height: `${Math.max(22, Math.min(85, (radius / 500) * 100))}%`,
                      }}
                      transition={{ type: "spring", stiffness: 200, damping: 25 }}
                    />
                  </div>
                  {/* Top Switcher */}
                  <div className="absolute top-3 left-3 z-20">
                    <button
                      type="button"
                      onClick={() => setShowLiveEmbed(false)}
                      className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-lg shadow border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-white transition-colors"
                    >
                      <Minimize2 className="h-3 w-3" />
                      Mode Vektor
                    </button>
                  </div>
                </div>
              ) : (
                /* Sleek Blueprint Stylized Vector Map */
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

                    {/* Vertical main roads */}
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

                  {/* Buildings */}
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
                  <motion.div
                    className="absolute top-[22%] right-[8%] w-[12%] h-[24%] rounded-md bg-gray-200/60 dark:bg-gray-800/60 border border-gray-300/40 dark:border-gray-700/40"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.48 }}
                  />

                  {/* Geofence Radius Ring Animation */}
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <motion.div
                      className="rounded-full border-2 border-dashed border-emerald-500/50 bg-emerald-400/10"
                      initial={{ scale: 0 }}
                      animate={{
                        scale: 1,
                        width: `${Math.max(60, Math.min(220, (radius / 500) * 220))}px`,
                        height: `${Math.max(60, Math.min(220, (radius / 500) * 220))}px`,
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
                      <div className="p-2 rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/40">
                        <MapPin className="h-5 w-5 fill-white" />
                      </div>
                      <div className="w-2 h-1 bg-black/30 rounded-full mt-0.5 blur-[1px]" />
                    </div>
                  </motion.div>

                  {/* Mode switcher button */}
                  {interactive && (
                    <div className="absolute top-3 left-3 z-20">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          setShowLiveEmbed(true)
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50 transition-colors"
                      >
                        <Globe className="h-3.5 w-3.5" />
                        Buka Peta Satelit / OSM
                      </button>
                    </div>
                  )}

                  {/* Gradient shadow for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-transparent to-transparent dark:from-gray-900/90 pointer-events-none" />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Grid pattern - shown when collapsed */}
        <motion.div
          className="absolute inset-0 opacity-[0.05] dark:opacity-[0.08] pointer-events-none"
          animate={{ opacity: isExpanded ? 0 : 0.05 }}
          transition={{ duration: 0.3 }}
        >
          <svg width="100%" height="100%" className="absolute inset-0">
            <defs>
              <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
                <path d="M 24 0 L 0 0 0 24" fill="none" className="stroke-gray-900 dark:stroke-white" strokeWidth="0.75" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </motion.div>

        {/* Content Overlay */}
        <div className="relative z-10 h-full flex flex-col justify-between p-5 pointer-events-none">
          {/* Top section */}
          <div className="flex items-start justify-between">
            <div className="relative pointer-events-auto">
              <motion.div
                className="relative"
                animate={{
                  opacity: isExpanded && showLiveEmbed ? 0 : 1,
                }}
                transition={{ duration: 0.3 }}
              >
                {/* Animated Map Pin Icon */}
                <motion.div
                  className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/40 text-emerald-500"
                  animate={{
                    boxShadow: isHovered
                      ? "0 0 16px rgba(52, 211, 153, 0.4)"
                      : "0 0 8px rgba(52, 211, 153, 0.15)",
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <MapPin className="h-4 w-4" />
                </motion.div>
              </motion.div>
            </div>

            {/* Status indicator */}
            <motion.div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/80 dark:bg-gray-800/80 border border-gray-200/60 dark:border-gray-700/60 backdrop-blur-sm pointer-events-auto"
              animate={{
                scale: isHovered ? 1.05 : 1,
              }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-bold text-gray-700 dark:text-gray-300 tracking-wide uppercase">
                Radius {radius}m
              </span>
            </motion.div>
          </div>

          {/* Bottom section */}
          <div className="space-y-1.5 pointer-events-auto">
            <motion.h3
              className="text-gray-900 dark:text-gray-100 font-bold text-base tracking-tight leading-tight"
              animate={{
                x: isHovered ? 3 : 0,
              }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              {location}
            </motion.h3>

            <AnimatePresence>
              {isExpanded && (
                <motion.p
                  className="text-gray-600 dark:text-gray-400 text-xs font-mono font-medium"
                  initial={{ opacity: 0, y: -8, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -8, height: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  {coordinates}
                </motion.p>
              )}
            </AnimatePresence>

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

      {/* Click hint */}
      <motion.p
        className="absolute -bottom-5 left-1/2 text-[11px] font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap pointer-events-none"
        style={{ x: "-50%" }}
        initial={{ opacity: 0 }}
        animate={{
          opacity: isHovered && !isExpanded ? 1 : 0,
          y: isHovered ? 0 : 3,
        }}
        transition={{ duration: 0.2 }}
      >
        Klik untuk memperluas peta
      </motion.p>
    </motion.div>
  )
}
