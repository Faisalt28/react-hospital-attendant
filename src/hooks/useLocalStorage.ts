import { useState, useEffect, useCallback } from "react"

const SYNC_EVENT = "local-storage-sync"

/**
 * Hook shared untuk semua data — pakai localStorage sebagai mock database reaktif.
 * Mendukung auto-sync real-time antar-komponen dalam 1 tab maupun multi-tab.
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

  // Listen perubahan dari komponen lain (dalam tab yang sama atau tab berbeda)
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

            // Broadcast ke seluruh hook useLocalStorage yang mendengarkan key ini
            window.dispatchEvent(new CustomEvent(SYNC_EVENT, { detail: { key } }))

            // Asynchronous push to Cloudflare Workers & D1 database
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
            if (SYNC_KEYS.includes(key)) {
              import("@/api/client").then(({ pushSyncToD1 }) => {
                pushSyncToD1(key, nextValue)
              })
            }
          }, 0)
        } catch (error) {
          console.error(`Error saving localStorage key "${key}":`, error)
        }
        return nextValue
      })
    },
    [key]
  )

  return [data, setData] as const
}
