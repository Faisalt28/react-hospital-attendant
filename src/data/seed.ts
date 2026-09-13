import type {
  Department,
  Employee,
  ShiftPattern,
  LeaveRequest,
  ShiftSwapRequest,
  AttendanceRecord,
  Schedule,
} from "@/types"

// ─── 1. Departemen Default (Hanya HRD & Personalia) ──────────────────────────
export const SEED_DEPARTMENTS: Department[] = [
  { id: "dept-hrd", name: "HRD & Personalia", supervisorId: "emp-1" },
]

// ─── 2. Pola Sif Dasar ───────────────────────────────────────────────────────
export const SEED_SHIFTS: ShiftPattern[] = [
  { id: "shift-1", name: "Shift Pagi",  startTime: "07:00", endTime: "15:00", color: "blue",   durationHours: 8,  isOvernight: false },
  { id: "shift-2", name: "Shift Siang", startTime: "14:00", endTime: "22:00", color: "orange", durationHours: 8,  isOvernight: false },
  { id: "shift-3", name: "Shift Malam", startTime: "21:00", endTime: "07:00", color: "indigo", durationHours: 10, isOvernight: true  },
  { id: "shift-4", name: "On-Call",     startTime: "00:00", endTime: "00:00", color: "green",  durationHours: 0,  isOvernight: false },
]

// ─── 3. Akun Admin HRD Default (Satu-satunya Akun Awal) ──────────────────────
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
    isFirstLogin: true,
  },
]

// ─── 4. Data Operasional Kosong (Bersih — Dikelola Live via Cloudflare D1) ───
export const SEED_LEAVES: LeaveRequest[] = []
export const SEED_SWAPS: ShiftSwapRequest[] = []
export const SEED_ATTENDANCE: AttendanceRecord[] = []
export const SEED_SCHEDULES: Schedule[] = []
