import { useRef, useCallback, useEffect } from "react"
import { motion } from "framer-motion"

interface ToleranceSliderProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
}

const MAJOR_TICKS = [
  { value: 0, label: "0 m", desc: "Ketat (0 mnt)" },
  { value: 15, label: "15 m", desc: "Standar RS (15 mnt)" },
  { value: 30, label: "30 m", desc: "Longgar (30 mnt)" },
  { value: 45, label: "45 m", desc: "Maksimal (45 mnt)" },
]

export const ToleranceSlider = ({
  value,
  onChange,
  min = 0,
  max = 45,
  step = 5,
}: ToleranceSliderProps) => {
  const trackRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)

  // Calculate percentage strictly clamped between 0 and 100
  const pct = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100))

  // Generate all step values for tick dots
  const allSteps: number[] = []
  for (let s = min; s <= max; s += step) {
    allSteps.push(s)
  }

  const getValueFromClientX = useCallback(
    (clientX: number) => {
      if (!trackRef.current) return value
      const rect = trackRef.current.getBoundingClientRect()
      const raw = ((clientX - rect.left) / rect.width) * (max - min) + min
      const clamped = Math.min(max, Math.max(min, raw))
      const stepped = Math.round(clamped / step) * step
      return stepped
    },
    [min, max, step, value]
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
      if (isDragging.current) {
        onChange(getValueFromClientX(e.clientX))
      }
    }
    const onTouchMove = (e: TouchEvent) => {
      if (isDragging.current && e.touches.length > 0) {
        onChange(getValueFromClientX(e.touches[0].clientX))
      }
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

  return (
    <div className="space-y-3 select-none">
      {/* ── Quick Preset Badges ── */}
      <div className="flex flex-wrap gap-1.5 sm:gap-2">
        {MAJOR_TICKS.map((tick) => {
          const isSelected = value === tick.value
          return (
            <button
              key={tick.value}
              type="button"
              onClick={() => onChange(tick.value)}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
                isSelected
                  ? "bg-amber-500 text-white shadow-sm shadow-amber-500/30 scale-105"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-amber-50 dark:hover:bg-amber-950/40 hover:text-amber-600"
              }`}
            >
              {tick.desc}
            </button>
          )
        })}
      </div>

      {/* ── Slider Bar with Track, Dots & Thumb ── */}
      <div className="pt-2 pb-1">
        <div
          ref={trackRef}
          onClick={handleTrackClick}
          className="relative h-7 flex items-center cursor-pointer group"
        >
          {/* Background Track */}
          <div className="absolute left-0 right-0 h-2.5 rounded-full bg-gray-200 dark:bg-gray-700 transition-colors" />

          {/* Active Fill Track */}
          <div
            className="absolute left-0 h-2.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 pointer-events-none"
            style={{ width: `${pct}%` }}
          />

          {/* Step tick dots on the track */}
          {allSteps.map((s) => {
            const stepPct = ((s - min) / (max - min)) * 100
            const isPassed = s <= value
            const isMajor = MAJOR_TICKS.some((t) => t.value === s)

            return (
              <div
                key={s}
                className={`absolute -translate-x-1/2 rounded-full pointer-events-none transition-all ${
                  isMajor
                    ? isPassed
                      ? "w-2.5 h-2.5 bg-white border border-amber-500 shadow-sm"
                      : "w-2.5 h-2.5 bg-gray-400 dark:bg-gray-600"
                    : isPassed
                    ? "w-1 h-1 bg-amber-200"
                    : "w-1 h-1 bg-gray-300 dark:bg-gray-600"
                }`}
                style={{ left: `${stepPct}%` }}
              />
            )
          })}

          {/* Draggable Thumb with Framer Motion */}
          <motion.div
            className="absolute w-6 h-6 rounded-full bg-white dark:bg-gray-100 border-[3px] border-amber-500 shadow-lg cursor-grab active:cursor-grabbing z-20 touch-none flex items-center justify-center -translate-x-1/2"
            style={{ left: `${pct}%` }}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 450, damping: 28 }}
            onMouseDown={handleThumbMouseDown}
            onTouchStart={handleThumbTouchStart}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          </motion.div>
        </div>

        {/* ── Precise Tick Labels Below Track ── */}
        <div className="relative h-6 mt-1 text-[11px]">
          {MAJOR_TICKS.map((tick) => {
            const tickPct = ((tick.value - min) / (max - min)) * 100
            const isSelected = value === tick.value

            // Alignment to ensure no mobile overflow at edges
            const isFirst = tick.value === min
            const isLast = tick.value === max

            return (
              <button
                key={tick.value}
                type="button"
                onClick={() => onChange(tick.value)}
                className={`absolute transition-colors flex flex-col items-center ${
                  isFirst
                    ? "left-0 items-start text-left"
                    : isLast
                    ? "right-0 items-end text-right"
                    : "-translate-x-1/2 items-center text-center"
                } ${
                  isSelected
                    ? "text-amber-600 dark:text-amber-400 font-bold"
                    : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                }`}
                style={
                  isFirst
                    ? { left: "0%" }
                    : isLast
                    ? { right: "0%" }
                    : { left: `${tickPct}%` }
                }
              >
                <span>{tick.label}</span>
                <span className="text-[9px] text-gray-400 dark:text-gray-500 hidden sm:inline">
                  {tick.value === 0 ? "(Tanpa toleransi)" : tick.value === 15 ? "(Standar)" : ""}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
