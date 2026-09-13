import { useState, useEffect, useCallback } from "react"
import { pushSyncToD1 } from "@/api/client"

const SYNC_EVENT = "local-storage-sync"

const SYNC_KEYS = [
  "app_settings",
  "employees",
  "departments",
  "shifts",
  "schedules",
  "attendance",
  "leaves",
  "swaps",
]

/**
 * Hook shared untuk membaca dan menulis data state aplikasi.
 * Terhubung langsung ke Cloudflare D1 (Cloud-First) dengan caching reaktif di browser.
 */
export function useLocalStorage<T>(key: string, defaultValue: T) {
  const readValue = useCallback((): T => {
    try {
      const stored = localStorage.getItem(key)
      if (stored !== null) {
        return JSON.parse(stored) as T
      }
      return defaultValue
    } catch {
      return defaultValue
    }
  }, [key, defaultValue])

  const [data, setDataState] = useState<T>(readValue)

  // Listen perubahan sinkronisasi dari Cloudflare D1 atau komponen lain
  useEffect(() => {
    const handleSync = (e: Event) => {
      const customEvent = e as CustomEvent<{ key?: string }>
      if (!customEvent.detail?.key || customEvent.detail.key === key) {
        setDataState(readValue())
      }
    }

    const handleStorage = (e: StorageEvent) => {
      if (!e.key || e.key === key) {
        setDataState(readValue())
      }
    }

    window.addEventListener(SYNC_EVENT, handleSync)
    window.addEventListener("storage", handleStorage)

    return () => {
      window.removeEventListener(SYNC_EVENT, handleSync)
      window.removeEventListener("storage", handleStorage)
    }
  }, [key, readValue])

  const setData = useCallback(
    (value: T | ((prev: T) => T)) => {
      setDataState((prev) => {
        const nextValue = typeof value === "function" ? (value as (prev: T) => T)(prev) : value
        try {
          localStorage.setItem(key, JSON.stringify(nextValue))

          // Sinkronisasi otomatis ke Cloudflare D1
          if (SYNC_KEYS.includes(key)) {
            pushSyncToD1(key, nextValue)
          }

          // Defer broadcast agar tidak memicu setState di komponen lain saat render cycle sedang berjalan
          setTimeout(() => {
            // Auto-sync session "user" jika data employee yang diedit adalah user yang sedang login
            if (key === "employees" && Array.isArray(nextValue)) {
              const rawUser = localStorage.getItem("user")
              if (rawUser) {
                try {
                  const currentUser = JSON.parse(rawUser)
                  const matchedEmp = nextValue.find((e: any) => e.id === currentUser.id)
                  if (matchedEmp) {
                    const updatedUser = {
                      ...currentUser,
                      name: matchedEmp.name,
                      email: matchedEmp.email,
                      nip: matchedEmp.nip,
                      role: matchedEmp.role,
                      posisi: matchedEmp.posisi,
                      jabatan: matchedEmp.jabatan,
                      departmentId: matchedEmp.departmentId,
                    }
                    localStorage.setItem("user", JSON.stringify(updatedUser))
                    window.dispatchEvent(new CustomEvent(SYNC_EVENT, { detail: { key: "user" } }))
                  }
                } catch (err) {
                  console.error("Error syncing current user", err)
                }
              }
            }

            // Broadcast ke seluruh hook yang mendengarkan key ini
            window.dispatchEvent(new CustomEvent(SYNC_EVENT, { detail: { key } }))
          }, 0)
        } catch (error) {
          console.error(`Error saving key "${key}":`, error)
        }
        return nextValue
      })
    },
    [key]
  )

  return [data, setData] as const
}
