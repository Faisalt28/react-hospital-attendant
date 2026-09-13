/**
 * RS MediTrack: Cloudflare Workers & D1 API Client
 */

// URL Backend Cloudflare Worker Anda (bisa diset via env VITE_API_URL atau fallback)
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://rs-meditrack-api.workers.dev"

/**
 * Memuat data awal dari Cloudflare D1 ke dalam browser
 */
export async function syncFromRemote(): Promise<boolean> {
  if (!API_BASE_URL || API_BASE_URL.includes("workers.dev") === false) {
    return false
  }

  try {
    const res = await fetch(`${API_BASE_URL}/api/sync`, {
      headers: { Accept: "application/json" },
    })

    if (!res.ok) return false

    const json = await res.json()
    if (json.success && json.data) {
      const {
        departments,
        shifts,
        employees,
        schedules,
        attendance,
        leaves,
        swaps,
        app_settings,
      } = json.data

      if (departments?.length) localStorage.setItem("departments", JSON.stringify(departments))
      if (shifts?.length) localStorage.setItem("shifts", JSON.stringify(shifts))
      if (employees?.length) localStorage.setItem("employees", JSON.stringify(employees))
      if (schedules) localStorage.setItem("schedules", JSON.stringify(schedules))
      if (attendance) localStorage.setItem("attendance", JSON.stringify(attendance))
      if (leaves) localStorage.setItem("leaves", JSON.stringify(leaves))
      if (swaps) localStorage.setItem("swaps", JSON.stringify(swaps))
      if (app_settings) localStorage.setItem("app_settings", JSON.stringify(app_settings))

      return true
    }
    return false
  } catch (err) {
    console.warn("[Cloudflare D1 Sync] Gagal sinkronisasi data remote:", err)
    return false
  }
}

/**
 * Mengirim perubahan data dari browser ke Cloudflare D1 secara background
 */
export async function syncToRemote(key: string, data: any): Promise<void> {
  if (!API_BASE_URL || API_BASE_URL.includes("workers.dev") === false) {
    return
  }

  try {
    await fetch(`${API_BASE_URL}/api/sync/${key}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
  } catch (err) {
    console.warn(`[Cloudflare D1 Sync] Gagal push data untuk ${key}:`, err)
  }
}
