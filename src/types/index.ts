// ─── Core Types ───────────────────────────────────────────────────────────────

export type Role = "admin" | "hrd" | "supervisor" | "employee"

export type ShiftColor =
  | "blue" | "indigo" | "violet" | "green" | "emerald"
  | "orange" | "red" | "pink" | "yellow" | "cyan"

export interface Department {
  id: string
  name: string
  supervisorId?: string
}

export interface ShiftPattern {
  id: string
  name: string
  startTime: string   // "07:00"
  endTime: string     // "15:00"
  color: ShiftColor
  durationHours: number
  isOvernight: boolean
}

export interface Employee {
  id: string
  nip: string           // Nomor Induk Pegawai — dipakai untuk login
  name: string
  email: string
  posisi: string
  jabatan: string
  departmentId: string
  role: Role
  annualLeaveQuota: number
  usedLeave: number
  phone?: string
  joinDate: string
  isActive: boolean
  password: string      // default: "RS-2026", diganti saat isFirstLogin
  isFirstLogin: boolean // true = paksa ganti password saat login pertama
}

export type AttendanceStatus = "on-time" | "late" | "early-leave" | "absent"
export type LeaveType = "cuti" | "izin" | "sakit"
export type ApprovalStatus = "pending" | "approved" | "rejected"

export interface AttendanceRecord {
  id: string
  employeeId: string
  scheduleId?: string
  date: string          // "2025-09-10"
  clockInTime?: string  // "07:05"
  clockOutTime?: string
  photoBase64?: string  // selfie sebagai base64
  location: "inside" | "outside"
  status: AttendanceStatus
  totalHours?: number
  overtimeHours?: number
}

export interface LeaveRequest {
  id: string
  employeeId: string
  supervisorId: string
  departmentId: string
  type: LeaveType
  startDate: string
  endDate: string
  totalDays: number
  reason: string
  attachmentBase64?: string
  status: ApprovalStatus
  reviewNote?: string
  createdAt: string
  reviewedAt?: string
}

export interface ShiftSwapRequest {
  id: string
  requesterId: string
  targetId: string
  requesterDate: string
  targetDate: string
  requesterShiftId: string
  targetShiftId: string
  reason: string
  departmentId: string
  peerStatus: ApprovalStatus   // target employee approve dulu
  supervisorStatus: ApprovalStatus
  createdAt: string
}

export interface Schedule {
  id: string
  employeeId: string
  departmentId: string
  shiftId: string
  date: string
  status: "draft" | "published" | "swapped" | "leave"
  createdBy: string
}

export interface AppSettings {
  hospitalName: string
  address: string
  latitude: number
  longitude: number
  geofenceRadiusMeters: number
  blockOutsideGeofence: boolean
  antiFakeGps: boolean
  lateToleranceMinutes: number
  earlyClockInMinutes: number
  maxClockOutMinutes: number
  requireSelfie: boolean
  requireHighAccuracyGps: boolean
  notifySupervisorOnLate: boolean
}
