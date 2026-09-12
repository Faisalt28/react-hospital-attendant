import type { Department, Employee, ShiftPattern, LeaveRequest, ShiftSwapRequest, AttendanceRecord, Schedule } from "@/types"

// ─── Departments ─────────────────────────────────────────────────────────────
export const SEED_DEPARTMENTS: Department[] = [
  { id: "dept-hrd", name: "HRD & Personalia", supervisorId: "emp-1" },
]

// ─── Shift Patterns ───────────────────────────────────────────────────────────
export const SEED_SHIFTS: ShiftPattern[] = [
  { id: "shift-1", name: "Shift Pagi",  startTime: "07:00", endTime: "15:00", color: "blue",   durationHours: 8,  isOvernight: false },
  { id: "shift-2", name: "Shift Siang", startTime: "14:00", endTime: "22:00", color: "orange", durationHours: 8,  isOvernight: false },
  { id: "shift-3", name: "Shift Malam", startTime: "21:00", endTime: "07:00", color: "indigo", durationHours: 10, isOvernight: true  },
  { id: "shift-4", name: "On-Call",     startTime: "00:00", endTime: "00:00", color: "green",  durationHours: 0,  isOvernight: false },
]

// ─── Employees (Default Admin HRD Only) ────────────────────────────────────────
export const SEED_EMPLOYEES: Employee[] = [
  {
    id: "emp-1",
    nip: "HRD-2020-001",
    name: "Admin HRD",
    email: "admin@rsmeditrack.com",
    posisi: "admin_hrd",
    jabatan: "kepala_divisi",
    departmentId: "dept-hrd",
    role: "admin",
    annualLeaveQuota: 12,
    usedLeave: 0,
    phone: "081234567890",
    joinDate: "2026-01-01",
    isActive: true,
    password: "RS-2026",
    isFirstLogin: false,
  },
]

// ─── Dummy Data (Kosong — dibuat mandiri via CRUD Admin / Operasional) ────────
export const SEED_LEAVES: LeaveRequest[] = []
export const SEED_SWAPS: ShiftSwapRequest[] = []
export const SEED_ATTENDANCE: AttendanceRecord[] = []
export const SEED_SCHEDULES: Schedule[] = []

// ─── Auto Clean-Up / Migration from Old Dummy Storage ──────────────────────────
const SEED_VERSION_KEY = "rs_clean_crud_version"
const CURRENT_SEED_VERSION = "v4_clean_admin_hrd_2026"

if (typeof window !== "undefined") {
  try {
    const currentVer = localStorage.getItem(SEED_VERSION_KEY)
    if (currentVer !== CURRENT_SEED_VERSION) {
      localStorage.setItem("employees", JSON.stringify(SEED_EMPLOYEES))
      localStorage.setItem("departments", JSON.stringify(SEED_DEPARTMENTS))
      localStorage.setItem("leaves", JSON.stringify(SEED_LEAVES))
      localStorage.setItem("swaps", JSON.stringify(SEED_SWAPS))
      localStorage.setItem("attendance", JSON.stringify(SEED_ATTENDANCE))
      localStorage.setItem("schedules", JSON.stringify(SEED_SCHEDULES))
      localStorage.setItem("read_notification_ids", JSON.stringify([]))
      localStorage.setItem("supervisor_read_topbar_notifs", JSON.stringify([]))
      localStorage.setItem(SEED_VERSION_KEY, CURRENT_SEED_VERSION)
    }
  } catch {
    // Ignore storage errors in non-browser environments
  }
}

