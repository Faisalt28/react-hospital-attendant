// Konfigurasi URL backend Cloudflare Workers
// Jika environment variable VITE_API_BASE_URL diset di Cloudflare Pages, gunakan itu.
// Default fallback ke URL worker produksi.

export const API_BASE_URL: string =
  (import.meta.env.VITE_API_BASE_URL as string) ||
  "https://rs-meditrack-api.faisal-artupairt28.workers.dev"

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
