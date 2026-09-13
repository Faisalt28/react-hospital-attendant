// Konfigurasi URL backend Cloudflare Workers & D1 Database
export const API_BASE_URL: string =
  (import.meta.env.VITE_API_BASE_URL as string) ||
  "https://rs-meditrack-backend.faisal-artupairt28.workers.dev"

export interface SyncResponse {
  success: boolean
  data?: {
    departments: any[]
    shifts: any[]
    employees: any[]
    schedules: any[]
    attendance: any[]
    leaves: any[]
    swaps: any[]
    app_settings: any
  }
  error?: string
}

/**
 * Unduh seluruh dataset terbaru dari Cloudflare D1
 */
export async function fetchAllFromD1(): Promise<SyncResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/sync`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return await res.json()
  } catch (err: any) {
    console.warn("[D1 Client] Gagal fetch data dari Cloudflare D1:", err.message)
    return { success: false, error: err.message }
  }
}

/**
 * Sinkronisasi data dari Cloudflare D1 ke LocalStorage browser secara reaktif
 */
export async function syncFromD1(): Promise<boolean> {
  const res = await fetchAllFromD1()
  if (res.success && res.data) {
    const d = res.data
    const syncKeys: Record<string, any> = {
      departments: d.departments,
      shifts: d.shifts,
      employees: d.employees,
      schedules: d.schedules,
      attendance: d.attendance,
      leaves: d.leaves,
      swaps: d.swaps,
      app_settings: d.app_settings,
    }

    Object.entries(syncKeys).forEach(([k, val]) => {
      if (val !== undefined && val !== null) {
        const current = localStorage.getItem(k)
        const incoming = JSON.stringify(val)
        // Hanya update dan broadcast jika ada data baru dari cloud
        if (current !== incoming) {
          localStorage.setItem(k, incoming)
          window.dispatchEvent(new CustomEvent("local-storage-sync", { detail: { key: k } }))
        }
      }
    })
    return true
  }
  return false
}

/**
 * Kirim perubahan entitas (departments, employees, dsb) secara asynchronous ke Cloudflare D1
 */
export async function pushSyncToD1(key: string, data: any): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/sync/${key}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    return res.ok
  } catch (err: any) {
    console.warn(`[D1 Client] Background sync failed for ${key}:`, err.message)
    return false
  }
}

/**
 * Login langsung ke Cloudflare D1
 */
export async function loginViaD1(nip: string, password: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nip, password }),
    })
    const data = await res.json()
    return { ok: res.ok, status: res.status, data }
  } catch (err: any) {
    return { ok: false, error: err.message }
  }
}

/**
 * Ganti kata sandi di Cloudflare D1
 */
export async function changePasswordViaD1(userId: string, nip: string, newPassword: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/change-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, nip, newPassword }),
    })
    const data = await res.json()
    return { ok: res.ok, data }
  } catch (err: any) {
    return { ok: false, error: err.message }
  }
}
