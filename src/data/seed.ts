import type {
  Department,
  Employee,
  ShiftPattern,
  LeaveRequest,
  ShiftSwapRequest,
  AttendanceRecord,
  Schedule,
} from "@/types"

// ─── 1. Departemen Rumah Sakit (HRD + 6 Departemen = 7 Departemen) ─────────
export const SEED_DEPARTMENTS: Department[] = [
  { id: "dept-hrd", name: "HRD & Personalia", supervisorId: "emp-1" },
  { id: "dept-igd", name: "IGD (Instalasi Gawat Darurat)", supervisorId: "emp-igd-1" },
  { id: "dept-icu", name: "ICU (Intensive Care Unit)", supervisorId: "emp-icu-1" },
  { id: "dept-rwi", name: "Instalasi Rawat Inap", supervisorId: "emp-rwi-1" },
  { id: "dept-far", name: "Instalasi Farmasi", supervisorId: "emp-far-1" },
  { id: "dept-lab", name: "Laboratorium Klinik", supervisorId: "emp-lab-1" },
  { id: "dept-rad", name: "Instalasi Radiologi", supervisorId: "emp-rad-1" },
]

// ─── 2. Pola Sif (Kosong - Dibuat oleh Supervisor masing-masing) ─────────────
export const SEED_SHIFTS: ShiftPattern[] = [
  {
    "id": "shift-1",
    "name": "Shift Pagi",
    "startTime": "07:00",
    "endTime": "15:00",
    "color": "blue",
    "durationHours": 8,
    "isOvernight": false
  },
  {
    "id": "shift-2",
    "name": "Shift Siang",
    "startTime": "14:00",
    "endTime": "22:00",
    "color": "orange",
    "durationHours": 8,
    "isOvernight": false
  },
  {
    "id": "shift-3",
    "name": "Shift Malam",
    "startTime": "21:00",
    "endTime": "07:00",
    "color": "indigo",
    "durationHours": 10,
    "isOvernight": true
  },
  {
    "id": "shift-4",
    "name": "On-Call",
    "startTime": "00:00",
    "endTime": "00:00",
    "color": "green",
    "durationHours": 0,
    "isOvernight": false
  }
]


// ─── 3. Akun Pegawai (Masing-masing Departemen 5 Orang, Total 35 Orang) ─────
export const SEED_EMPLOYEES: Employee[] = [
  // ── HRD & PERSONALIA ──
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
    password: "test123",
    isFirstLogin: false,
  },
  {
    id: "emp-hrd-2",
    nip: "HRD-2020-002",
    name: "Maya Anggraini, S.Psi",
    email: "maya.anggraini@rsmeditrack.com",
    posisi: "staf_hrd",
    jabatan: "staf_senior",
    departmentId: "dept-hrd",
    role: "employee",
    annualLeaveQuota: 12,
    usedLeave: 0,
    phone: "081234567891",
    joinDate: "2026-01-01",
    isActive: true,
    password: "test123",
    isFirstLogin: false,
  },
  {
    id: "emp-hrd-3",
    nip: "HRD-2020-003",
    name: "Dimas Wicaksono, S.M",
    email: "dimas.wicaksono@rsmeditrack.com",
    posisi: "staf_hrd",
    jabatan: "staf_senior",
    departmentId: "dept-hrd",
    role: "employee",
    annualLeaveQuota: 12,
    usedLeave: 0,
    phone: "081234567892",
    joinDate: "2026-01-01",
    isActive: true,
    password: "test123",
    isFirstLogin: false,
  },
  {
    id: "emp-hrd-4",
    nip: "HRD-2020-004",
    name: "Rina Anggraini, S.Kom",
    email: "rina.anggraini@rsmeditrack.com",
    posisi: "staf_hrd",
    jabatan: "staf_junior",
    departmentId: "dept-hrd",
    role: "employee",
    annualLeaveQuota: 12,
    usedLeave: 0,
    phone: "081234567893",
    joinDate: "2026-01-01",
    isActive: true,
    password: "test123",
    isFirstLogin: false,
  },
  {
    id: "emp-hrd-5",
    nip: "HRD-2020-005",
    name: "Surya Pratama, A.Md",
    email: "surya.pratama@rsmeditrack.com",
    posisi: "staf_hrd",
    jabatan: "staf_junior",
    departmentId: "dept-hrd",
    role: "employee",
    annualLeaveQuota: 12,
    usedLeave: 0,
    phone: "081234567894",
    joinDate: "2026-01-01",
    isActive: true,
    password: "test123",
    isFirstLogin: false,
  },

  // ── IGD ──
  { id: "emp-igd-1", nip: "IGD-2020-001", name: "dr. Hendra Pratama, Sp.EM", email: "hendra.pratama@rsmeditrack.com", posisi: "dokter_spesialis", jabatan: "supervisor", departmentId: "dept-igd", role: "supervisor", annualLeaveQuota: 12, usedLeave: 0, phone: "081211110001", joinDate: "2026-01-01", isActive: true, password: "test123", isFirstLogin: false },
  { id: "emp-igd-2", nip: "IGD-2020-002", name: "Ns. Siti Nurhaliza, S.Kep", email: "siti.nurhaliza@rsmeditrack.com", posisi: "perawat", jabatan: "staf_senior", departmentId: "dept-igd", role: "employee", annualLeaveQuota: 12, usedLeave: 0, phone: "081211110002", joinDate: "2026-01-01", isActive: true, password: "test123", isFirstLogin: false },
  { id: "emp-igd-3", nip: "IGD-2020-003", name: "Ns. Bambang Wijaya, S.Kep", email: "bambang.wijaya@rsmeditrack.com", posisi: "perawat", jabatan: "staf_senior", departmentId: "dept-igd", role: "employee", annualLeaveQuota: 12, usedLeave: 0, phone: "081211110003", joinDate: "2026-01-01", isActive: true, password: "test123", isFirstLogin: false },
  { id: "emp-igd-4", nip: "IGD-2020-004", name: "Ahmad Fauzi, A.Md.Kep", email: "ahmad.fauzi@rsmeditrack.com", posisi: "perawat", jabatan: "staf_junior", departmentId: "dept-igd", role: "employee", annualLeaveQuota: 12, usedLeave: 0, phone: "081211110004", joinDate: "2026-01-01", isActive: true, password: "test123", isFirstLogin: false },
  { id: "emp-igd-5", nip: "IGD-2020-005", name: "Dewi Anggraini, A.Md.Kep", email: "dewi.anggraini@rsmeditrack.com", posisi: "perawat", jabatan: "staf_junior", departmentId: "dept-igd", role: "employee", annualLeaveQuota: 12, usedLeave: 0, phone: "081211110005", joinDate: "2026-01-01", isActive: true, password: "test123", isFirstLogin: false },

  // ── ICU ──
  { id: "emp-icu-1", nip: "ICU-2020-001", name: "dr. Rina Kurniasih, Sp.An", email: "rina.kurniasih@rsmeditrack.com", posisi: "dokter_spesialis", jabatan: "supervisor", departmentId: "dept-icu", role: "supervisor", annualLeaveQuota: 12, usedLeave: 0, phone: "081222220001", joinDate: "2026-01-01", isActive: true, password: "test123", isFirstLogin: false },
  { id: "emp-icu-2", nip: "ICU-2020-002", name: "Ns. Tri Wahyuni, S.Kep", email: "tri.wahyuni@rsmeditrack.com", posisi: "perawat", jabatan: "staf_senior", departmentId: "dept-icu", role: "employee", annualLeaveQuota: 12, usedLeave: 0, phone: "081222220002", joinDate: "2026-01-01", isActive: true, password: "test123", isFirstLogin: false },
  { id: "emp-icu-3", nip: "ICU-2020-003", name: "Ns. Doni Prasetyo, S.Kep", email: "doni.prasetyo@rsmeditrack.com", posisi: "perawat", jabatan: "staf_senior", departmentId: "dept-icu", role: "employee", annualLeaveQuota: 12, usedLeave: 0, phone: "081222220003", joinDate: "2026-01-01", isActive: true, password: "test123", isFirstLogin: false },
  { id: "emp-icu-4", nip: "ICU-2020-004", name: "Riska Handayani, A.Md.Kep", email: "riska.handayani@rsmeditrack.com", posisi: "perawat", jabatan: "staf_junior", departmentId: "dept-icu", role: "employee", annualLeaveQuota: 12, usedLeave: 0, phone: "081222220004", joinDate: "2026-01-01", isActive: true, password: "test123", isFirstLogin: false },
  { id: "emp-icu-5", nip: "ICU-2020-005", name: "Faisal Akbar, A.Md.Kep", email: "faisal.akbar@rsmeditrack.com", posisi: "perawat", jabatan: "staf_junior", departmentId: "dept-icu", role: "employee", annualLeaveQuota: 12, usedLeave: 0, phone: "081222220005", joinDate: "2026-01-01", isActive: true, password: "test123", isFirstLogin: false },

  // ── Rawat Inap ──
  { id: "emp-rwi-1", nip: "RWI-2020-001", name: "Ns. Maya Safitri, S.Kep", email: "maya.safitri@rsmeditrack.com", posisi: "perawat", jabatan: "supervisor", departmentId: "dept-rwi", role: "supervisor", annualLeaveQuota: 12, usedLeave: 0, phone: "081233330001", joinDate: "2026-01-01", isActive: true, password: "test123", isFirstLogin: false },
  { id: "emp-rwi-2", nip: "RWI-2020-002", name: "Ns. Dian Permatasari, S.Kep", email: "dian.permatasari@rsmeditrack.com", posisi: "perawat", jabatan: "staf_senior", departmentId: "dept-rwi", role: "employee", annualLeaveQuota: 12, usedLeave: 0, phone: "081233330002", joinDate: "2026-01-01", isActive: true, password: "test123", isFirstLogin: false },
  { id: "emp-rwi-3", nip: "RWI-2020-003", name: "Ns. Arif Gunawan, S.Kep", email: "arif.gunawan@rsmeditrack.com", posisi: "perawat", jabatan: "staf_senior", departmentId: "dept-rwi", role: "employee", annualLeaveQuota: 12, usedLeave: 0, phone: "081233330003", joinDate: "2026-01-01", isActive: true, password: "test123", isFirstLogin: false },
  { id: "emp-rwi-4", nip: "RWI-2020-004", name: "Fitriani, A.Md.Kep", email: "fitriani@rsmeditrack.com", posisi: "perawat", jabatan: "staf_junior", departmentId: "dept-rwi", role: "employee", annualLeaveQuota: 12, usedLeave: 0, phone: "081233330004", joinDate: "2026-01-01", isActive: true, password: "test123", isFirstLogin: false },
  { id: "emp-rwi-5", nip: "RWI-2020-005", name: "Bagus Setiawan, A.Md.Kep", email: "bagus.setiawan@rsmeditrack.com", posisi: "perawat", jabatan: "staf_junior", departmentId: "dept-rwi", role: "employee", annualLeaveQuota: 12, usedLeave: 0, phone: "081233330005", joinDate: "2026-01-01", isActive: true, password: "test123", isFirstLogin: false },

  // ── Farmasi ──
  { id: "emp-far-1", nip: "FAR-2020-001", name: "apt. Budi Santoso, S.Farm", email: "budi.santoso@rsmeditrack.com", posisi: "apoteker", jabatan: "supervisor", departmentId: "dept-far", role: "supervisor", annualLeaveQuota: 12, usedLeave: 0, phone: "081244440001", joinDate: "2026-01-01", isActive: true, password: "test123", isFirstLogin: false },
  { id: "emp-far-2", nip: "FAR-2020-002", name: "apt. Indah Puspita, S.Farm", email: "indah.puspita@rsmeditrack.com", posisi: "apoteker", jabatan: "staf_senior", departmentId: "dept-far", role: "employee", annualLeaveQuota: 12, usedLeave: 0, phone: "081244440002", joinDate: "2026-01-01", isActive: true, password: "test123", isFirstLogin: false },
  { id: "emp-far-3", nip: "FAR-2020-003", name: "Reza Pahlevi, A.Md.Farm", email: "reza.pahlevi@rsmeditrack.com", posisi: "apoteker", jabatan: "staf_senior", departmentId: "dept-far", role: "employee", annualLeaveQuota: 12, usedLeave: 0, phone: "081244440003", joinDate: "2026-01-01", isActive: true, password: "test123", isFirstLogin: false },
  { id: "emp-far-4", nip: "FAR-2020-004", name: "Nur Aini, A.Md.Farm", email: "nur.aini@rsmeditrack.com", posisi: "apoteker", jabatan: "staf_junior", departmentId: "dept-far", role: "employee", annualLeaveQuota: 12, usedLeave: 0, phone: "081244440004", joinDate: "2026-01-01", isActive: true, password: "test123", isFirstLogin: false },
  { id: "emp-far-5", nip: "FAR-2020-005", name: "Ilham Ramadhan, A.Md.Farm", email: "ilham.ramadhan@rsmeditrack.com", posisi: "apoteker", jabatan: "staf_junior", departmentId: "dept-far", role: "employee", annualLeaveQuota: 12, usedLeave: 0, phone: "081244440005", joinDate: "2026-01-01", isActive: true, password: "test123", isFirstLogin: false },

  // ── Laboratorium ──
  { id: "emp-lab-1", nip: "LAB-2020-001", name: "dr. Eko Prasetyo, Sp.PK", email: "eko.prasetyo@rsmeditrack.com", posisi: "dokter_spesialis", jabatan: "supervisor", departmentId: "dept-lab", role: "supervisor", annualLeaveQuota: 12, usedLeave: 0, phone: "081255550001", joinDate: "2026-01-01", isActive: true, password: "test123", isFirstLogin: false },
  { id: "emp-lab-2", nip: "LAB-2020-002", name: "Agus Supriyadi, A.Md.AK", email: "agus.supriyadi@rsmeditrack.com", posisi: "analis_lab", jabatan: "staf_senior", departmentId: "dept-lab", role: "employee", annualLeaveQuota: 12, usedLeave: 0, phone: "081255550002", joinDate: "2026-01-01", isActive: true, password: "test123", isFirstLogin: false },
  { id: "emp-lab-3", nip: "LAB-2020-003", name: "Ratna Sari, A.Md.AK", email: "ratna.sari@rsmeditrack.com", posisi: "analis_lab", jabatan: "staf_senior", departmentId: "dept-lab", role: "employee", annualLeaveQuota: 12, usedLeave: 0, phone: "081255550003", joinDate: "2026-01-01", isActive: true, password: "test123", isFirstLogin: false },
  { id: "emp-lab-4", nip: "LAB-2020-004", name: "Putri Lestari, A.Md.AK", email: "putri.lestari@rsmeditrack.com", posisi: "analis_lab", jabatan: "staf_junior", departmentId: "dept-lab", role: "employee", annualLeaveQuota: 12, usedLeave: 0, phone: "081255550004", joinDate: "2026-01-01", isActive: true, password: "test123", isFirstLogin: false },
  { id: "emp-lab-5", nip: "LAB-2020-005", name: "Dedi Kurniawan, A.Md.AK", email: "dedi.kurniawan@rsmeditrack.com", posisi: "analis_lab", jabatan: "staf_junior", departmentId: "dept-lab", role: "employee", annualLeaveQuota: 12, usedLeave: 0, phone: "081255550005", joinDate: "2026-01-01", isActive: true, password: "test123", isFirstLogin: false },

  // ── Radiologi ──
  { id: "emp-rad-1", nip: "RAD-2020-001", name: "dr. Lukman Hakim, Sp.Rad", email: "lukman.hakim@rsmeditrack.com", posisi: "dokter_spesialis", jabatan: "supervisor", departmentId: "dept-rad", role: "supervisor", annualLeaveQuota: 12, usedLeave: 0, phone: "081266660001", joinDate: "2026-01-01", isActive: true, password: "test123", isFirstLogin: false },
  { id: "emp-rad-2", nip: "RAD-2020-002", name: "Haryanto, S.Tr.Rad", email: "haryanto@rsmeditrack.com", posisi: "radiografer", jabatan: "staf_senior", departmentId: "dept-rad", role: "employee", annualLeaveQuota: 12, usedLeave: 0, phone: "081266660002", joinDate: "2026-01-01", isActive: true, password: "test123", isFirstLogin: false },
  { id: "emp-rad-3", nip: "RAD-2020-003", name: "Wulan Dari, A.Md.Rad", email: "wulan.dari@rsmeditrack.com", posisi: "radiografer", jabatan: "staf_senior", departmentId: "dept-rad", role: "employee", annualLeaveQuota: 12, usedLeave: 0, phone: "081266660003", joinDate: "2026-01-01", isActive: true, password: "test123", isFirstLogin: false },
  { id: "emp-rad-4", nip: "RAD-2020-004", name: "Rian Hidayat, A.Md.Rad", email: "rian.hidayat@rsmeditrack.com", posisi: "radiografer", jabatan: "staf_junior", departmentId: "dept-rad", role: "employee", annualLeaveQuota: 12, usedLeave: 0, phone: "081266660004", joinDate: "2026-01-01", isActive: true, password: "test123", isFirstLogin: false },
  { id: "emp-rad-5", nip: "RAD-2020-005", name: "Nadia Utami, A.Md.Rad", email: "nadia.utami@rsmeditrack.com", posisi: "radiografer", jabatan: "staf_junior", departmentId: "dept-rad", role: "employee", annualLeaveQuota: 12, usedLeave: 0, phone: "081266660005", joinDate: "2026-01-01", isActive: true, password: "test123", isFirstLogin: false },
]


// ─── 4. Data Operasional Awal (November 2026) ──────────────────────────────
export const SEED_LEAVES: LeaveRequest[] = [
  {
    "id": "leave-1",
    "employeeId": "emp-igd-3",
    "supervisorId": "emp-igd-1",
    "departmentId": "dept-igd",
    "type": "cuti",
    "startDate": "2026-11-04",
    "endDate": "2026-11-06",
    "totalDays": 3,
    "reason": "Cuti tahunan - Acara keluarga di luar kota",
    "status": "approved",
    "reviewNote": "Disetujui. Pastikan koordinasi tugas dengan Ns. Siti.",
    "createdAt": "2026-10-28T08:30:00.000Z",
    "reviewedAt": "2026-10-29T10:00:00.000Z"
  },
  {
    "id": "leave-2",
    "employeeId": "emp-icu-4",
    "supervisorId": "emp-icu-1",
    "departmentId": "dept-icu",
    "type": "sakit",
    "startDate": "2026-11-01",
    "endDate": "2026-11-02",
    "totalDays": 2,
    "reason": "Demam tifoid dan rekomendasi istirahat dokter",
    "status": "approved",
    "reviewNote": "Disetujui. Lekas sembuh, surat dokter telah diverifikasi.",
    "createdAt": "2026-10-31T14:00:00.000Z",
    "reviewedAt": "2026-11-01T07:15:00.000Z"
  },
  {
    "id": "leave-3",
    "employeeId": "emp-rwi-4",
    "supervisorId": "emp-rwi-1",
    "departmentId": "dept-rwi",
    "type": "izin",
    "startDate": "2026-11-08",
    "endDate": "2026-11-09",
    "totalDays": 2,
    "reason": "Menghadiri wisuda adik kandung",
    "status": "pending",
    "createdAt": "2026-11-01T09:00:00.000Z"
  }
]

export const SEED_SWAPS: ShiftSwapRequest[] = [
  {
    "id": "swap-1",
    "requesterId": "emp-igd-2",
    "targetId": "emp-igd-4",
    "requesterDate": "2026-11-03",
    "targetDate": "2026-11-03",
    "requesterShiftId": "shift-1",
    "targetShiftId": "shift-2",
    "reason": "Ada keperluan keluarga penting di pagi hari, siap tukar ke sif siang",
    "departmentId": "dept-igd",
    "peerStatus": "approved",
    "supervisorStatus": "approved",
    "createdAt": "2026-10-30T10:00:00.000Z"
  },
  {
    "id": "swap-2",
    "requesterId": "emp-icu-2",
    "targetId": "emp-icu-3",
    "requesterDate": "2026-11-05",
    "targetDate": "2026-11-05",
    "requesterShiftId": "shift-1",
    "targetShiftId": "shift-2",
    "reason": "Jadwal kontrol dokter anak di pagi hari",
    "departmentId": "dept-icu",
    "peerStatus": "approved",
    "supervisorStatus": "pending",
    "createdAt": "2026-11-01T08:00:00.000Z"
  }
]

export const SEED_ATTENDANCE: AttendanceRecord[] = [
  {
    "id": "att-emp-igd-1-2026-11-01",
    "employeeId": "emp-igd-1",
    "scheduleId": "sched-emp-igd-1-2026-11-01",
    "date": "2026-11-01",
    "clockInTime": "06:48",
    "clockOutTime": "15:05",
    "photoBase64": "data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 rx=%2220%22 fill=%22%230284c7%22/><circle cx=%2250%22 cy=%2238%22 r=%2218%22 fill=%22%23ffffff%22/><path d=%22M22 86c0-15 12-26 28-26s28 11 28 26%22 fill=%22%23ffffff%22/></svg>",
    "photoInBase64": "data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 rx=%2220%22 fill=%22%230284c7%22/><circle cx=%2250%22 cy=%2238%22 r=%2218%22 fill=%22%23ffffff%22/><path d=%22M22 86c0-15 12-26 28-26s28 11 28 26%22 fill=%22%23ffffff%22/></svg>",
    "photoOutBase64": "data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 rx=%2220%22 fill=%22%230284c7%22/><circle cx=%2250%22 cy=%2238%22 r=%2218%22 fill=%22%23ffffff%22/><path d=%22M22 86c0-15 12-26 28-26s28 11 28 26%22 fill=%22%23ffffff%22/></svg>",
    "location": "inside",
    "status": "on-time",
    "totalHours": 8.28,
    "overtimeHours": 0.1
  },
  {
    "id": "att-emp-igd-2-2026-11-01",
    "employeeId": "emp-igd-2",
    "scheduleId": "sched-emp-igd-2-2026-11-01",
    "date": "2026-11-01",
    "clockInTime": "07:22",
    "clockOutTime": "15:15",
    "photoBase64": "data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 rx=%2220%22 fill=%22%230284c7%22/><circle cx=%2250%22 cy=%2238%22 r=%2218%22 fill=%22%23ffffff%22/><path d=%22M22 86c0-15 12-26 28-26s28 11 28 26%22 fill=%22%23ffffff%22/></svg>",
    "photoInBase64": "data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 rx=%2220%22 fill=%22%230284c7%22/><circle cx=%2250%22 cy=%2238%22 r=%2218%22 fill=%22%23ffffff%22/><path d=%22M22 86c0-15 12-26 28-26s28 11 28 26%22 fill=%22%23ffffff%22/></svg>",
    "photoOutBase64": "data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 rx=%2220%22 fill=%22%230284c7%22/><circle cx=%2250%22 cy=%2238%22 r=%2218%22 fill=%22%23ffffff%22/><path d=%22M22 86c0-15 12-26 28-26s28 11 28 26%22 fill=%22%23ffffff%22/></svg>",
    "location": "inside",
    "status": "late",
    "totalHours": 7.88,
    "overtimeHours": 0
  },
  {
    "id": "att-emp-igd-3-2026-11-01",
    "employeeId": "emp-igd-3",
    "scheduleId": "sched-emp-igd-3-2026-11-01",
    "date": "2026-11-01",
    "clockInTime": "13:50",
    "clockOutTime": "22:05",
    "photoBase64": "data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 rx=%2220%22 fill=%22%230284c7%22/><circle cx=%2250%22 cy=%2238%22 r=%2218%22 fill=%22%23ffffff%22/><path d=%22M22 86c0-15 12-26 28-26s28 11 28 26%22 fill=%22%23ffffff%22/></svg>",
    "photoInBase64": "data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 rx=%2220%22 fill=%22%230284c7%22/><circle cx=%2250%22 cy=%2238%22 r=%2218%22 fill=%22%23ffffff%22/><path d=%22M22 86c0-15 12-26 28-26s28 11 28 26%22 fill=%22%23ffffff%22/></svg>",
    "photoOutBase64": "data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 rx=%2220%22 fill=%22%230284c7%22/><circle cx=%2250%22 cy=%2238%22 r=%2218%22 fill=%22%23ffffff%22/><path d=%22M22 86c0-15 12-26 28-26s28 11 28 26%22 fill=%22%23ffffff%22/></svg>",
    "location": "inside",
    "status": "on-time",
    "totalHours": 8.25,
    "overtimeHours": 0.1
  },
  {
    "id": "att-emp-igd-5-2026-11-01",
    "employeeId": "emp-igd-5",
    "scheduleId": "sched-emp-igd-5-2026-11-01",
    "date": "2026-11-01",
    "clockInTime": "06:55",
    "clockOutTime": "15:02",
    "photoBase64": "data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 rx=%2220%22 fill=%22%230284c7%22/><circle cx=%2250%22 cy=%2238%22 r=%2218%22 fill=%22%23ffffff%22/><path d=%22M22 86c0-15 12-26 28-26s28 11 28 26%22 fill=%22%23ffffff%22/></svg>",
    "photoInBase64": "data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 rx=%2220%22 fill=%22%230284c7%22/><circle cx=%2250%22 cy=%2238%22 r=%2218%22 fill=%22%23ffffff%22/><path d=%22M22 86c0-15 12-26 28-26s28 11 28 26%22 fill=%22%23ffffff%22/></svg>",
    "photoOutBase64": "data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 rx=%2220%22 fill=%22%230284c7%22/><circle cx=%2250%22 cy=%2238%22 r=%2218%22 fill=%22%23ffffff%22/><path d=%22M22 86c0-15 12-26 28-26s28 11 28 26%22 fill=%22%23ffffff%22/></svg>",
    "location": "inside",
    "status": "on-time",
    "totalHours": 8.12,
    "overtimeHours": 0
  },
  {
    "id": "att-emp-icu-1-2026-11-01",
    "employeeId": "emp-icu-1",
    "scheduleId": "sched-emp-icu-1-2026-11-01",
    "date": "2026-11-01",
    "clockInTime": "06:45",
    "clockOutTime": "15:10",
    "photoBase64": "data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 rx=%2220%22 fill=%22%230284c7%22/><circle cx=%2250%22 cy=%2238%22 r=%2218%22 fill=%22%23ffffff%22/><path d=%22M22 86c0-15 12-26 28-26s28 11 28 26%22 fill=%22%23ffffff%22/></svg>",
    "photoInBase64": "data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 rx=%2220%22 fill=%22%230284c7%22/><circle cx=%2250%22 cy=%2238%22 r=%2218%22 fill=%22%23ffffff%22/><path d=%22M22 86c0-15 12-26 28-26s28 11 28 26%22 fill=%22%23ffffff%22/></svg>",
    "photoOutBase64": "data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 rx=%2220%22 fill=%22%230284c7%22/><circle cx=%2250%22 cy=%2238%22 r=%2218%22 fill=%22%23ffffff%22/><path d=%22M22 86c0-15 12-26 28-26s28 11 28 26%22 fill=%22%23ffffff%22/></svg>",
    "location": "inside",
    "status": "on-time",
    "totalHours": 8.42,
    "overtimeHours": 0.15
  },
  {
    "id": "att-emp-icu-2-2026-11-01",
    "employeeId": "emp-icu-2",
    "scheduleId": "sched-emp-icu-2-2026-11-01",
    "date": "2026-11-01",
    "clockInTime": "06:52",
    "clockOutTime": "15:04",
    "photoBase64": "data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 rx=%2220%22 fill=%22%230284c7%22/><circle cx=%2250%22 cy=%2238%22 r=%2218%22 fill=%22%23ffffff%22/><path d=%22M22 86c0-15 12-26 28-26s28 11 28 26%22 fill=%22%23ffffff%22/></svg>",
    "photoInBase64": "data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 rx=%2220%22 fill=%22%230284c7%22/><circle cx=%2250%22 cy=%2238%22 r=%2218%22 fill=%22%23ffffff%22/><path d=%22M22 86c0-15 12-26 28-26s28 11 28 26%22 fill=%22%23ffffff%22/></svg>",
    "photoOutBase64": "data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 rx=%2220%22 fill=%22%230284c7%22/><circle cx=%2250%22 cy=%2238%22 r=%2218%22 fill=%22%23ffffff%22/><path d=%22M22 86c0-15 12-26 28-26s28 11 28 26%22 fill=%22%23ffffff%22/></svg>",
    "location": "inside",
    "status": "on-time",
    "totalHours": 8.2,
    "overtimeHours": 0
  },
  {
    "id": "att-emp-icu-3-2026-11-01",
    "employeeId": "emp-icu-3",
    "scheduleId": "sched-emp-icu-3-2026-11-01",
    "date": "2026-11-01",
    "clockInTime": "13:55",
    "clockOutTime": "22:08",
    "photoBase64": "data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 rx=%2220%22 fill=%22%230284c7%22/><circle cx=%2250%22 cy=%2238%22 r=%2218%22 fill=%22%23ffffff%22/><path d=%22M22 86c0-15 12-26 28-26s28 11 28 26%22 fill=%22%23ffffff%22/></svg>",
    "photoInBase64": "data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 rx=%2220%22 fill=%22%230284c7%22/><circle cx=%2250%22 cy=%2238%22 r=%2218%22 fill=%22%23ffffff%22/><path d=%22M22 86c0-15 12-26 28-26s28 11 28 26%22 fill=%22%23ffffff%22/></svg>",
    "photoOutBase64": "data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 rx=%2220%22 fill=%22%230284c7%22/><circle cx=%2250%22 cy=%2238%22 r=%2218%22 fill=%22%23ffffff%22/><path d=%22M22 86c0-15 12-26 28-26s28 11 28 26%22 fill=%22%23ffffff%22/></svg>",
    "location": "inside",
    "status": "on-time",
    "totalHours": 8.22,
    "overtimeHours": 0.1
  },
  {
    "id": "att-emp-rwi-1-2026-11-01",
    "employeeId": "emp-rwi-1",
    "scheduleId": "sched-emp-rwi-1-2026-11-01",
    "date": "2026-11-01",
    "clockInTime": "06:56",
    "clockOutTime": "15:03",
    "photoBase64": "data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 rx=%2220%22 fill=%22%230284c7%22/><circle cx=%2250%22 cy=%2238%22 r=%2218%22 fill=%22%23ffffff%22/><path d=%22M22 86c0-15 12-26 28-26s28 11 28 26%22 fill=%22%23ffffff%22/></svg>",
    "photoInBase64": "data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 rx=%2220%22 fill=%22%230284c7%22/><circle cx=%2250%22 cy=%2238%22 r=%2218%22 fill=%22%23ffffff%22/><path d=%22M22 86c0-15 12-26 28-26s28 11 28 26%22 fill=%22%23ffffff%22/></svg>",
    "photoOutBase64": "data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 rx=%2220%22 fill=%22%230284c7%22/><circle cx=%2250%22 cy=%2238%22 r=%2218%22 fill=%22%23ffffff%22/><path d=%22M22 86c0-15 12-26 28-26s28 11 28 26%22 fill=%22%23ffffff%22/></svg>",
    "location": "inside",
    "status": "on-time",
    "totalHours": 8.12,
    "overtimeHours": 0
  },
  {
    "id": "att-emp-rwi-2-2026-11-01",
    "employeeId": "emp-rwi-2",
    "scheduleId": "sched-emp-rwi-2-2026-11-01",
    "date": "2026-11-01",
    "clockInTime": "06:50",
    "clockOutTime": "15:01",
    "photoBase64": "data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 rx=%2220%22 fill=%22%230284c7%22/><circle cx=%2250%22 cy=%2238%22 r=%2218%22 fill=%22%23ffffff%22/><path d=%22M22 86c0-15 12-26 28-26s28 11 28 26%22 fill=%22%23ffffff%22/></svg>",
    "photoInBase64": "data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 rx=%2220%22 fill=%22%230284c7%22/><circle cx=%2250%22 cy=%2238%22 r=%2218%22 fill=%22%23ffffff%22/><path d=%22M22 86c0-15 12-26 28-26s28 11 28 26%22 fill=%22%23ffffff%22/></svg>",
    "photoOutBase64": "data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 rx=%2220%22 fill=%22%230284c7%22/><circle cx=%2250%22 cy=%2238%22 r=%2218%22 fill=%22%23ffffff%22/><path d=%22M22 86c0-15 12-26 28-26s28 11 28 26%22 fill=%22%23ffffff%22/></svg>",
    "location": "inside",
    "status": "on-time",
    "totalHours": 8.18,
    "overtimeHours": 0
  },
  {
    "id": "att-emp-far-1-2026-11-01",
    "employeeId": "emp-far-1",
    "scheduleId": "sched-emp-far-1-2026-11-01",
    "date": "2026-11-01",
    "clockInTime": "06:50",
    "clockOutTime": "15:05",
    "photoBase64": "data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 rx=%2220%22 fill=%22%230284c7%22/><circle cx=%2250%22 cy=%2238%22 r=%2218%22 fill=%22%23ffffff%22/><path d=%22M22 86c0-15 12-26 28-26s28 11 28 26%22 fill=%22%23ffffff%22/></svg>",
    "photoInBase64": "data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 rx=%2220%22 fill=%22%230284c7%22/><circle cx=%2250%22 cy=%2238%22 r=%2218%22 fill=%22%23ffffff%22/><path d=%22M22 86c0-15 12-26 28-26s28 11 28 26%22 fill=%22%23ffffff%22/></svg>",
    "photoOutBase64": "data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 rx=%2220%22 fill=%22%230284c7%22/><circle cx=%2250%22 cy=%2238%22 r=%2218%22 fill=%22%23ffffff%22/><path d=%22M22 86c0-15 12-26 28-26s28 11 28 26%22 fill=%22%23ffffff%22/></svg>",
    "location": "inside",
    "status": "on-time",
    "totalHours": 8.25,
    "overtimeHours": 0
  },
  {
    "id": "att-emp-far-3-2026-11-01",
    "employeeId": "emp-far-3",
    "scheduleId": "sched-emp-far-3-2026-11-01",
    "date": "2026-11-01",
    "clockInTime": "07:20",
    "clockOutTime": "15:10",
    "photoBase64": "data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 rx=%2220%22 fill=%22%230284c7%22/><circle cx=%2250%22 cy=%2238%22 r=%2218%22 fill=%22%23ffffff%22/><path d=%22M22 86c0-15 12-26 28-26s28 11 28 26%22 fill=%22%23ffffff%22/></svg>",
    "photoInBase64": "data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 rx=%2220%22 fill=%22%230284c7%22/><circle cx=%2250%22 cy=%2238%22 r=%2218%22 fill=%22%23ffffff%22/><path d=%22M22 86c0-15 12-26 28-26s28 11 28 26%22 fill=%22%23ffffff%22/></svg>",
    "photoOutBase64": "data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 rx=%2220%22 fill=%22%230284c7%22/><circle cx=%2250%22 cy=%2238%22 r=%2218%22 fill=%22%23ffffff%22/><path d=%22M22 86c0-15 12-26 28-26s28 11 28 26%22 fill=%22%23ffffff%22/></svg>",
    "location": "inside",
    "status": "late",
    "totalHours": 7.83,
    "overtimeHours": 0
  },
  {
    "id": "att-emp-lab-1-2026-11-01",
    "employeeId": "emp-lab-1",
    "scheduleId": "sched-emp-lab-1-2026-11-01",
    "date": "2026-11-01",
    "clockInTime": "06:54",
    "clockOutTime": "15:02",
    "photoBase64": "data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 rx=%2220%22 fill=%22%230284c7%22/><circle cx=%2250%22 cy=%2238%22 r=%2218%22 fill=%22%23ffffff%22/><path d=%22M22 86c0-15 12-26 28-26s28 11 28 26%22 fill=%22%23ffffff%22/></svg>",
    "photoInBase64": "data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 rx=%2220%22 fill=%22%230284c7%22/><circle cx=%2250%22 cy=%2238%22 r=%2218%22 fill=%22%23ffffff%22/><path d=%22M22 86c0-15 12-26 28-26s28 11 28 26%22 fill=%22%23ffffff%22/></svg>",
    "photoOutBase64": "data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 rx=%2220%22 fill=%22%230284c7%22/><circle cx=%2250%22 cy=%2238%22 r=%2218%22 fill=%22%23ffffff%22/><path d=%22M22 86c0-15 12-26 28-26s28 11 28 26%22 fill=%22%23ffffff%22/></svg>",
    "location": "inside",
    "status": "on-time",
    "totalHours": 8.13,
    "overtimeHours": 0
  },
  {
    "id": "att-emp-rad-1-2026-11-01",
    "employeeId": "emp-rad-1",
    "scheduleId": "sched-emp-rad-1-2026-11-01",
    "date": "2026-11-01",
    "clockInTime": "06:47",
    "clockOutTime": "15:06",
    "photoBase64": "data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 rx=%2220%22 fill=%22%230284c7%22/><circle cx=%2250%22 cy=%2238%22 r=%2218%22 fill=%22%23ffffff%22/><path d=%22M22 86c0-15 12-26 28-26s28 11 28 26%22 fill=%22%23ffffff%22/></svg>",
    "photoInBase64": "data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 rx=%2220%22 fill=%22%230284c7%22/><circle cx=%2250%22 cy=%2238%22 r=%2218%22 fill=%22%23ffffff%22/><path d=%22M22 86c0-15 12-26 28-26s28 11 28 26%22 fill=%22%23ffffff%22/></svg>",
    "photoOutBase64": "data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 rx=%2220%22 fill=%22%230284c7%22/><circle cx=%2250%22 cy=%2238%22 r=%2218%22 fill=%22%23ffffff%22/><path d=%22M22 86c0-15 12-26 28-26s28 11 28 26%22 fill=%22%23ffffff%22/></svg>",
    "location": "inside",
    "status": "on-time",
    "totalHours": 8.32,
    "overtimeHours": 0.1
  },
  {
    "id": "att-emp-1-2026-11-01",
    "employeeId": "emp-1",
    "scheduleId": "sched-emp-1-2026-11-01",
    "date": "2026-11-01",
    "clockInTime": "06:53",
    "clockOutTime": "15:04",
    "photoBase64": "data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 rx=%2220%22 fill=%22%230284c7%22/><circle cx=%2250%22 cy=%2238%22 r=%2218%22 fill=%22%23ffffff%22/><path d=%22M22 86c0-15 12-26 28-26s28 11 28 26%22 fill=%22%23ffffff%22/></svg>",
    "photoInBase64": "data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 rx=%2220%22 fill=%22%230284c7%22/><circle cx=%2250%22 cy=%2238%22 r=%2218%22 fill=%22%23ffffff%22/><path d=%22M22 86c0-15 12-26 28-26s28 11 28 26%22 fill=%22%23ffffff%22/></svg>",
    "photoOutBase64": "data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 rx=%2220%22 fill=%22%230284c7%22/><circle cx=%2250%22 cy=%2238%22 r=%2218%22 fill=%22%23ffffff%22/><path d=%22M22 86c0-15 12-26 28-26s28 11 28 26%22 fill=%22%23ffffff%22/></svg>",
    "location": "inside",
    "status": "on-time",
    "totalHours": 8.18,
    "overtimeHours": 0
  }
]

export const SEED_SCHEDULES: Schedule[] = [
  {
    "id": "sched-emp-1-2026-11-01",
    "employeeId": "emp-1",
    "departmentId": "dept-hrd",
    "shiftId": "shift-1",
    "date": "2026-11-01",
    "status": "published",
    "createdBy": "emp-1"
  },
  {
    "id": "sched-emp-hrd-2-2026-11-01",
    "employeeId": "emp-hrd-2",
    "departmentId": "dept-hrd",
    "shiftId": "shift-2",
    "date": "2026-11-01",
    "status": "published",
    "createdBy": "emp-1"
  },
  {
    "id": "sched-emp-hrd-3-2026-11-01",
    "employeeId": "emp-hrd-3",
    "departmentId": "dept-hrd",
    "shiftId": "shift-3",
    "date": "2026-11-01",
    "status": "published",
    "createdBy": "emp-1"
  },
  {
    "id": "sched-emp-hrd-5-2026-11-01",
    "employeeId": "emp-hrd-5",
    "departmentId": "dept-hrd",
    "shiftId": "shift-1",
    "date": "2026-11-01",
    "status": "published",
    "createdBy": "emp-1"
  },
  {
    "id": "sched-emp-igd-1-2026-11-01",
    "employeeId": "emp-igd-1",
    "departmentId": "dept-igd",
    "shiftId": "shift-1",
    "date": "2026-11-01",
    "status": "published",
    "createdBy": "emp-igd-1"
  },
  {
    "id": "sched-emp-igd-2-2026-11-01",
    "employeeId": "emp-igd-2",
    "departmentId": "dept-igd",
    "shiftId": "shift-2",
    "date": "2026-11-01",
    "status": "published",
    "createdBy": "emp-igd-1"
  },
  {
    "id": "sched-emp-igd-3-2026-11-01",
    "employeeId": "emp-igd-3",
    "departmentId": "dept-igd",
    "shiftId": "shift-3",
    "date": "2026-11-01",
    "status": "published",
    "createdBy": "emp-igd-1"
  },
  {
    "id": "sched-emp-igd-5-2026-11-01",
    "employeeId": "emp-igd-5",
    "departmentId": "dept-igd",
    "shiftId": "shift-1",
    "date": "2026-11-01",
    "status": "published",
    "createdBy": "emp-igd-1"
  },
  {
    "id": "sched-emp-icu-1-2026-11-01",
    "employeeId": "emp-icu-1",
    "departmentId": "dept-icu",
    "shiftId": "shift-1",
    "date": "2026-11-01",
    "status": "published",
    "createdBy": "emp-icu-1"
  },
  {
    "id": "sched-emp-icu-2-2026-11-01",
    "employeeId": "emp-icu-2",
    "departmentId": "dept-icu",
    "shiftId": "shift-2",
    "date": "2026-11-01",
    "status": "published",
    "createdBy": "emp-icu-1"
  },
  {
    "id": "sched-emp-icu-3-2026-11-01",
    "employeeId": "emp-icu-3",
    "departmentId": "dept-icu",
    "shiftId": "shift-3",
    "date": "2026-11-01",
    "status": "published",
    "createdBy": "emp-icu-1"
  },
  {
    "id": "sched-emp-icu-5-2026-11-01",
    "employeeId": "emp-icu-5",
    "departmentId": "dept-icu",
    "shiftId": "shift-1",
    "date": "2026-11-01",
    "status": "published",
    "createdBy": "emp-icu-1"
  },
  {
    "id": "sched-emp-rwi-1-2026-11-01",
    "employeeId": "emp-rwi-1",
    "departmentId": "dept-rwi",
    "shiftId": "shift-1",
    "date": "2026-11-01",
    "status": "published",
    "createdBy": "emp-rwi-1"
  },
  {
    "id": "sched-emp-rwi-2-2026-11-01",
    "employeeId": "emp-rwi-2",
    "departmentId": "dept-rwi",
    "shiftId": "shift-2",
    "date": "2026-11-01",
    "status": "published",
    "createdBy": "emp-rwi-1"
  },
  {
    "id": "sched-emp-rwi-3-2026-11-01",
    "employeeId": "emp-rwi-3",
    "departmentId": "dept-rwi",
    "shiftId": "shift-3",
    "date": "2026-11-01",
    "status": "published",
    "createdBy": "emp-rwi-1"
  },
  {
    "id": "sched-emp-rwi-5-2026-11-01",
    "employeeId": "emp-rwi-5",
    "departmentId": "dept-rwi",
    "shiftId": "shift-1",
    "date": "2026-11-01",
    "status": "published",
    "createdBy": "emp-rwi-1"
  },
  {
    "id": "sched-emp-far-1-2026-11-01",
    "employeeId": "emp-far-1",
    "departmentId": "dept-far",
    "shiftId": "shift-1",
    "date": "2026-11-01",
    "status": "published",
    "createdBy": "emp-far-1"
  },
  {
    "id": "sched-emp-far-2-2026-11-01",
    "employeeId": "emp-far-2",
    "departmentId": "dept-far",
    "shiftId": "shift-2",
    "date": "2026-11-01",
    "status": "published",
    "createdBy": "emp-far-1"
  },
  {
    "id": "sched-emp-far-3-2026-11-01",
    "employeeId": "emp-far-3",
    "departmentId": "dept-far",
    "shiftId": "shift-3",
    "date": "2026-11-01",
    "status": "published",
    "createdBy": "emp-far-1"
  },
  {
    "id": "sched-emp-far-5-2026-11-01",
    "employeeId": "emp-far-5",
    "departmentId": "dept-far",
    "shiftId": "shift-1",
    "date": "2026-11-01",
    "status": "published",
    "createdBy": "emp-far-1"
  },
  {
    "id": "sched-emp-lab-1-2026-11-01",
    "employeeId": "emp-lab-1",
    "departmentId": "dept-lab",
    "shiftId": "shift-1",
    "date": "2026-11-01",
    "status": "published",
    "createdBy": "emp-lab-1"
  },
  {
    "id": "sched-emp-lab-2-2026-11-01",
    "employeeId": "emp-lab-2",
    "departmentId": "dept-lab",
    "shiftId": "shift-2",
    "date": "2026-11-01",
    "status": "published",
    "createdBy": "emp-lab-1"
  },
  {
    "id": "sched-emp-lab-3-2026-11-01",
    "employeeId": "emp-lab-3",
    "departmentId": "dept-lab",
    "shiftId": "shift-3",
    "date": "2026-11-01",
    "status": "published",
    "createdBy": "emp-lab-1"
  },
  {
    "id": "sched-emp-lab-5-2026-11-01",
    "employeeId": "emp-lab-5",
    "departmentId": "dept-lab",
    "shiftId": "shift-1",
    "date": "2026-11-01",
    "status": "published",
    "createdBy": "emp-lab-1"
  },
  {
    "id": "sched-emp-rad-1-2026-11-01",
    "employeeId": "emp-rad-1",
    "departmentId": "dept-rad",
    "shiftId": "shift-1",
    "date": "2026-11-01",
    "status": "published",
    "createdBy": "emp-rad-1"
  },
  {
    "id": "sched-emp-rad-2-2026-11-01",
    "employeeId": "emp-rad-2",
    "departmentId": "dept-rad",
    "shiftId": "shift-2",
    "date": "2026-11-01",
    "status": "published",
    "createdBy": "emp-rad-1"
  },
  {
    "id": "sched-emp-rad-3-2026-11-01",
    "employeeId": "emp-rad-3",
    "departmentId": "dept-rad",
    "shiftId": "shift-3",
    "date": "2026-11-01",
    "status": "published",
    "createdBy": "emp-rad-1"
  },
  {
    "id": "sched-emp-rad-5-2026-11-01",
    "employeeId": "emp-rad-5",
    "departmentId": "dept-rad",
    "shiftId": "shift-1",
    "date": "2026-11-01",
    "status": "published",
    "createdBy": "emp-rad-1"
  },
  {
    "id": "sched-emp-1-2026-11-02",
    "employeeId": "emp-1",
    "departmentId": "dept-hrd",
    "shiftId": "shift-2",
    "date": "2026-11-02",
    "status": "published",
    "createdBy": "emp-1"
  },
  {
    "id": "sched-emp-hrd-2-2026-11-02",
    "employeeId": "emp-hrd-2",
    "departmentId": "dept-hrd",
    "shiftId": "shift-3",
    "date": "2026-11-02",
    "status": "published",
    "createdBy": "emp-1"
  },
  {
    "id": "sched-emp-hrd-4-2026-11-02",
    "employeeId": "emp-hrd-4",
    "departmentId": "dept-hrd",
    "shiftId": "shift-1",
    "date": "2026-11-02",
    "status": "published",
    "createdBy": "emp-1"
  },
  {
    "id": "sched-emp-hrd-5-2026-11-02",
    "employeeId": "emp-hrd-5",
    "departmentId": "dept-hrd",
    "shiftId": "shift-2",
    "date": "2026-11-02",
    "status": "published",
    "createdBy": "emp-1"
  },
  {
    "id": "sched-emp-igd-1-2026-11-02",
    "employeeId": "emp-igd-1",
    "departmentId": "dept-igd",
    "shiftId": "shift-2",
    "date": "2026-11-02",
    "status": "published",
    "createdBy": "emp-igd-1"
  },
  {
    "id": "sched-emp-igd-2-2026-11-02",
    "employeeId": "emp-igd-2",
    "departmentId": "dept-igd",
    "shiftId": "shift-3",
    "date": "2026-11-02",
    "status": "published",
    "createdBy": "emp-igd-1"
  },
  {
    "id": "sched-emp-igd-4-2026-11-02",
    "employeeId": "emp-igd-4",
    "departmentId": "dept-igd",
    "shiftId": "shift-1",
    "date": "2026-11-02",
    "status": "published",
    "createdBy": "emp-igd-1"
  },
  {
    "id": "sched-emp-igd-5-2026-11-02",
    "employeeId": "emp-igd-5",
    "departmentId": "dept-igd",
    "shiftId": "shift-2",
    "date": "2026-11-02",
    "status": "published",
    "createdBy": "emp-igd-1"
  },
  {
    "id": "sched-emp-icu-1-2026-11-02",
    "employeeId": "emp-icu-1",
    "departmentId": "dept-icu",
    "shiftId": "shift-2",
    "date": "2026-11-02",
    "status": "published",
    "createdBy": "emp-icu-1"
  },
  {
    "id": "sched-emp-icu-2-2026-11-02",
    "employeeId": "emp-icu-2",
    "departmentId": "dept-icu",
    "shiftId": "shift-3",
    "date": "2026-11-02",
    "status": "published",
    "createdBy": "emp-icu-1"
  },
  {
    "id": "sched-emp-icu-4-2026-11-02",
    "employeeId": "emp-icu-4",
    "departmentId": "dept-icu",
    "shiftId": "shift-1",
    "date": "2026-11-02",
    "status": "published",
    "createdBy": "emp-icu-1"
  },
  {
    "id": "sched-emp-icu-5-2026-11-02",
    "employeeId": "emp-icu-5",
    "departmentId": "dept-icu",
    "shiftId": "shift-2",
    "date": "2026-11-02",
    "status": "published",
    "createdBy": "emp-icu-1"
  },
  {
    "id": "sched-emp-rwi-1-2026-11-02",
    "employeeId": "emp-rwi-1",
    "departmentId": "dept-rwi",
    "shiftId": "shift-2",
    "date": "2026-11-02",
    "status": "published",
    "createdBy": "emp-rwi-1"
  },
  {
    "id": "sched-emp-rwi-2-2026-11-02",
    "employeeId": "emp-rwi-2",
    "departmentId": "dept-rwi",
    "shiftId": "shift-3",
    "date": "2026-11-02",
    "status": "published",
    "createdBy": "emp-rwi-1"
  },
  {
    "id": "sched-emp-rwi-4-2026-11-02",
    "employeeId": "emp-rwi-4",
    "departmentId": "dept-rwi",
    "shiftId": "shift-1",
    "date": "2026-11-02",
    "status": "published",
    "createdBy": "emp-rwi-1"
  },
  {
    "id": "sched-emp-rwi-5-2026-11-02",
    "employeeId": "emp-rwi-5",
    "departmentId": "dept-rwi",
    "shiftId": "shift-2",
    "date": "2026-11-02",
    "status": "published",
    "createdBy": "emp-rwi-1"
  },
  {
    "id": "sched-emp-far-1-2026-11-02",
    "employeeId": "emp-far-1",
    "departmentId": "dept-far",
    "shiftId": "shift-2",
    "date": "2026-11-02",
    "status": "published",
    "createdBy": "emp-far-1"
  },
  {
    "id": "sched-emp-far-2-2026-11-02",
    "employeeId": "emp-far-2",
    "departmentId": "dept-far",
    "shiftId": "shift-3",
    "date": "2026-11-02",
    "status": "published",
    "createdBy": "emp-far-1"
  },
  {
    "id": "sched-emp-far-4-2026-11-02",
    "employeeId": "emp-far-4",
    "departmentId": "dept-far",
    "shiftId": "shift-1",
    "date": "2026-11-02",
    "status": "published",
    "createdBy": "emp-far-1"
  },
  {
    "id": "sched-emp-far-5-2026-11-02",
    "employeeId": "emp-far-5",
    "departmentId": "dept-far",
    "shiftId": "shift-2",
    "date": "2026-11-02",
    "status": "published",
    "createdBy": "emp-far-1"
  },
  {
    "id": "sched-emp-lab-1-2026-11-02",
    "employeeId": "emp-lab-1",
    "departmentId": "dept-lab",
    "shiftId": "shift-2",
    "date": "2026-11-02",
    "status": "published",
    "createdBy": "emp-lab-1"
  },
  {
    "id": "sched-emp-lab-2-2026-11-02",
    "employeeId": "emp-lab-2",
    "departmentId": "dept-lab",
    "shiftId": "shift-3",
    "date": "2026-11-02",
    "status": "published",
    "createdBy": "emp-lab-1"
  },
  {
    "id": "sched-emp-lab-4-2026-11-02",
    "employeeId": "emp-lab-4",
    "departmentId": "dept-lab",
    "shiftId": "shift-1",
    "date": "2026-11-02",
    "status": "published",
    "createdBy": "emp-lab-1"
  },
  {
    "id": "sched-emp-lab-5-2026-11-02",
    "employeeId": "emp-lab-5",
    "departmentId": "dept-lab",
    "shiftId": "shift-2",
    "date": "2026-11-02",
    "status": "published",
    "createdBy": "emp-lab-1"
  },
  {
    "id": "sched-emp-rad-1-2026-11-02",
    "employeeId": "emp-rad-1",
    "departmentId": "dept-rad",
    "shiftId": "shift-2",
    "date": "2026-11-02",
    "status": "published",
    "createdBy": "emp-rad-1"
  },
  {
    "id": "sched-emp-rad-2-2026-11-02",
    "employeeId": "emp-rad-2",
    "departmentId": "dept-rad",
    "shiftId": "shift-3",
    "date": "2026-11-02",
    "status": "published",
    "createdBy": "emp-rad-1"
  },
  {
    "id": "sched-emp-rad-4-2026-11-02",
    "employeeId": "emp-rad-4",
    "departmentId": "dept-rad",
    "shiftId": "shift-1",
    "date": "2026-11-02",
    "status": "published",
    "createdBy": "emp-rad-1"
  },
  {
    "id": "sched-emp-rad-5-2026-11-02",
    "employeeId": "emp-rad-5",
    "departmentId": "dept-rad",
    "shiftId": "shift-2",
    "date": "2026-11-02",
    "status": "published",
    "createdBy": "emp-rad-1"
  },
  {
    "id": "sched-emp-1-2026-11-03",
    "employeeId": "emp-1",
    "departmentId": "dept-hrd",
    "shiftId": "shift-3",
    "date": "2026-11-03",
    "status": "published",
    "createdBy": "emp-1"
  },
  {
    "id": "sched-emp-hrd-3-2026-11-03",
    "employeeId": "emp-hrd-3",
    "departmentId": "dept-hrd",
    "shiftId": "shift-1",
    "date": "2026-11-03",
    "status": "published",
    "createdBy": "emp-1"
  },
  {
    "id": "sched-emp-hrd-4-2026-11-03",
    "employeeId": "emp-hrd-4",
    "departmentId": "dept-hrd",
    "shiftId": "shift-2",
    "date": "2026-11-03",
    "status": "published",
    "createdBy": "emp-1"
  },
  {
    "id": "sched-emp-hrd-5-2026-11-03",
    "employeeId": "emp-hrd-5",
    "departmentId": "dept-hrd",
    "shiftId": "shift-3",
    "date": "2026-11-03",
    "status": "published",
    "createdBy": "emp-1"
  },
  {
    "id": "sched-emp-igd-1-2026-11-03",
    "employeeId": "emp-igd-1",
    "departmentId": "dept-igd",
    "shiftId": "shift-3",
    "date": "2026-11-03",
    "status": "published",
    "createdBy": "emp-igd-1"
  },
  {
    "id": "sched-emp-igd-3-2026-11-03",
    "employeeId": "emp-igd-3",
    "departmentId": "dept-igd",
    "shiftId": "shift-1",
    "date": "2026-11-03",
    "status": "published",
    "createdBy": "emp-igd-1"
  },
  {
    "id": "sched-emp-igd-4-2026-11-03",
    "employeeId": "emp-igd-4",
    "departmentId": "dept-igd",
    "shiftId": "shift-2",
    "date": "2026-11-03",
    "status": "published",
    "createdBy": "emp-igd-1"
  },
  {
    "id": "sched-emp-igd-5-2026-11-03",
    "employeeId": "emp-igd-5",
    "departmentId": "dept-igd",
    "shiftId": "shift-3",
    "date": "2026-11-03",
    "status": "published",
    "createdBy": "emp-igd-1"
  },
  {
    "id": "sched-emp-icu-1-2026-11-03",
    "employeeId": "emp-icu-1",
    "departmentId": "dept-icu",
    "shiftId": "shift-3",
    "date": "2026-11-03",
    "status": "published",
    "createdBy": "emp-icu-1"
  },
  {
    "id": "sched-emp-icu-3-2026-11-03",
    "employeeId": "emp-icu-3",
    "departmentId": "dept-icu",
    "shiftId": "shift-1",
    "date": "2026-11-03",
    "status": "published",
    "createdBy": "emp-icu-1"
  },
  {
    "id": "sched-emp-icu-4-2026-11-03",
    "employeeId": "emp-icu-4",
    "departmentId": "dept-icu",
    "shiftId": "shift-2",
    "date": "2026-11-03",
    "status": "published",
    "createdBy": "emp-icu-1"
  },
  {
    "id": "sched-emp-icu-5-2026-11-03",
    "employeeId": "emp-icu-5",
    "departmentId": "dept-icu",
    "shiftId": "shift-3",
    "date": "2026-11-03",
    "status": "published",
    "createdBy": "emp-icu-1"
  },
  {
    "id": "sched-emp-rwi-1-2026-11-03",
    "employeeId": "emp-rwi-1",
    "departmentId": "dept-rwi",
    "shiftId": "shift-3",
    "date": "2026-11-03",
    "status": "published",
    "createdBy": "emp-rwi-1"
  },
  {
    "id": "sched-emp-rwi-3-2026-11-03",
    "employeeId": "emp-rwi-3",
    "departmentId": "dept-rwi",
    "shiftId": "shift-1",
    "date": "2026-11-03",
    "status": "published",
    "createdBy": "emp-rwi-1"
  },
  {
    "id": "sched-emp-rwi-4-2026-11-03",
    "employeeId": "emp-rwi-4",
    "departmentId": "dept-rwi",
    "shiftId": "shift-2",
    "date": "2026-11-03",
    "status": "published",
    "createdBy": "emp-rwi-1"
  },
  {
    "id": "sched-emp-rwi-5-2026-11-03",
    "employeeId": "emp-rwi-5",
    "departmentId": "dept-rwi",
    "shiftId": "shift-3",
    "date": "2026-11-03",
    "status": "published",
    "createdBy": "emp-rwi-1"
  },
  {
    "id": "sched-emp-far-1-2026-11-03",
    "employeeId": "emp-far-1",
    "departmentId": "dept-far",
    "shiftId": "shift-3",
    "date": "2026-11-03",
    "status": "published",
    "createdBy": "emp-far-1"
  },
  {
    "id": "sched-emp-far-3-2026-11-03",
    "employeeId": "emp-far-3",
    "departmentId": "dept-far",
    "shiftId": "shift-1",
    "date": "2026-11-03",
    "status": "published",
    "createdBy": "emp-far-1"
  },
  {
    "id": "sched-emp-far-4-2026-11-03",
    "employeeId": "emp-far-4",
    "departmentId": "dept-far",
    "shiftId": "shift-2",
    "date": "2026-11-03",
    "status": "published",
    "createdBy": "emp-far-1"
  },
  {
    "id": "sched-emp-far-5-2026-11-03",
    "employeeId": "emp-far-5",
    "departmentId": "dept-far",
    "shiftId": "shift-3",
    "date": "2026-11-03",
    "status": "published",
    "createdBy": "emp-far-1"
  },
  {
    "id": "sched-emp-lab-1-2026-11-03",
    "employeeId": "emp-lab-1",
    "departmentId": "dept-lab",
    "shiftId": "shift-3",
    "date": "2026-11-03",
    "status": "published",
    "createdBy": "emp-lab-1"
  },
  {
    "id": "sched-emp-lab-3-2026-11-03",
    "employeeId": "emp-lab-3",
    "departmentId": "dept-lab",
    "shiftId": "shift-1",
    "date": "2026-11-03",
    "status": "published",
    "createdBy": "emp-lab-1"
  },
  {
    "id": "sched-emp-lab-4-2026-11-03",
    "employeeId": "emp-lab-4",
    "departmentId": "dept-lab",
    "shiftId": "shift-2",
    "date": "2026-11-03",
    "status": "published",
    "createdBy": "emp-lab-1"
  },
  {
    "id": "sched-emp-lab-5-2026-11-03",
    "employeeId": "emp-lab-5",
    "departmentId": "dept-lab",
    "shiftId": "shift-3",
    "date": "2026-11-03",
    "status": "published",
    "createdBy": "emp-lab-1"
  },
  {
    "id": "sched-emp-rad-1-2026-11-03",
    "employeeId": "emp-rad-1",
    "departmentId": "dept-rad",
    "shiftId": "shift-3",
    "date": "2026-11-03",
    "status": "published",
    "createdBy": "emp-rad-1"
  },
  {
    "id": "sched-emp-rad-3-2026-11-03",
    "employeeId": "emp-rad-3",
    "departmentId": "dept-rad",
    "shiftId": "shift-1",
    "date": "2026-11-03",
    "status": "published",
    "createdBy": "emp-rad-1"
  },
  {
    "id": "sched-emp-rad-4-2026-11-03",
    "employeeId": "emp-rad-4",
    "departmentId": "dept-rad",
    "shiftId": "shift-2",
    "date": "2026-11-03",
    "status": "published",
    "createdBy": "emp-rad-1"
  },
  {
    "id": "sched-emp-rad-5-2026-11-03",
    "employeeId": "emp-rad-5",
    "departmentId": "dept-rad",
    "shiftId": "shift-3",
    "date": "2026-11-03",
    "status": "published",
    "createdBy": "emp-rad-1"
  },
  {
    "id": "sched-emp-hrd-2-2026-11-04",
    "employeeId": "emp-hrd-2",
    "departmentId": "dept-hrd",
    "shiftId": "shift-1",
    "date": "2026-11-04",
    "status": "published",
    "createdBy": "emp-1"
  },
  {
    "id": "sched-emp-hrd-3-2026-11-04",
    "employeeId": "emp-hrd-3",
    "departmentId": "dept-hrd",
    "shiftId": "shift-2",
    "date": "2026-11-04",
    "status": "published",
    "createdBy": "emp-1"
  },
  {
    "id": "sched-emp-hrd-4-2026-11-04",
    "employeeId": "emp-hrd-4",
    "departmentId": "dept-hrd",
    "shiftId": "shift-3",
    "date": "2026-11-04",
    "status": "published",
    "createdBy": "emp-1"
  },
  {
    "id": "sched-emp-igd-2-2026-11-04",
    "employeeId": "emp-igd-2",
    "departmentId": "dept-igd",
    "shiftId": "shift-1",
    "date": "2026-11-04",
    "status": "published",
    "createdBy": "emp-igd-1"
  },
  {
    "id": "sched-emp-igd-3-2026-11-04",
    "employeeId": "emp-igd-3",
    "departmentId": "dept-igd",
    "shiftId": "shift-2",
    "date": "2026-11-04",
    "status": "published",
    "createdBy": "emp-igd-1"
  },
  {
    "id": "sched-emp-igd-4-2026-11-04",
    "employeeId": "emp-igd-4",
    "departmentId": "dept-igd",
    "shiftId": "shift-3",
    "date": "2026-11-04",
    "status": "published",
    "createdBy": "emp-igd-1"
  },
  {
    "id": "sched-emp-icu-2-2026-11-04",
    "employeeId": "emp-icu-2",
    "departmentId": "dept-icu",
    "shiftId": "shift-1",
    "date": "2026-11-04",
    "status": "published",
    "createdBy": "emp-icu-1"
  },
  {
    "id": "sched-emp-icu-3-2026-11-04",
    "employeeId": "emp-icu-3",
    "departmentId": "dept-icu",
    "shiftId": "shift-2",
    "date": "2026-11-04",
    "status": "published",
    "createdBy": "emp-icu-1"
  },
  {
    "id": "sched-emp-icu-4-2026-11-04",
    "employeeId": "emp-icu-4",
    "departmentId": "dept-icu",
    "shiftId": "shift-3",
    "date": "2026-11-04",
    "status": "published",
    "createdBy": "emp-icu-1"
  },
  {
    "id": "sched-emp-rwi-2-2026-11-04",
    "employeeId": "emp-rwi-2",
    "departmentId": "dept-rwi",
    "shiftId": "shift-1",
    "date": "2026-11-04",
    "status": "published",
    "createdBy": "emp-rwi-1"
  },
  {
    "id": "sched-emp-rwi-3-2026-11-04",
    "employeeId": "emp-rwi-3",
    "departmentId": "dept-rwi",
    "shiftId": "shift-2",
    "date": "2026-11-04",
    "status": "published",
    "createdBy": "emp-rwi-1"
  },
  {
    "id": "sched-emp-rwi-4-2026-11-04",
    "employeeId": "emp-rwi-4",
    "departmentId": "dept-rwi",
    "shiftId": "shift-3",
    "date": "2026-11-04",
    "status": "published",
    "createdBy": "emp-rwi-1"
  },
  {
    "id": "sched-emp-far-2-2026-11-04",
    "employeeId": "emp-far-2",
    "departmentId": "dept-far",
    "shiftId": "shift-1",
    "date": "2026-11-04",
    "status": "published",
    "createdBy": "emp-far-1"
  },
  {
    "id": "sched-emp-far-3-2026-11-04",
    "employeeId": "emp-far-3",
    "departmentId": "dept-far",
    "shiftId": "shift-2",
    "date": "2026-11-04",
    "status": "published",
    "createdBy": "emp-far-1"
  },
  {
    "id": "sched-emp-far-4-2026-11-04",
    "employeeId": "emp-far-4",
    "departmentId": "dept-far",
    "shiftId": "shift-3",
    "date": "2026-11-04",
    "status": "published",
    "createdBy": "emp-far-1"
  },
  {
    "id": "sched-emp-lab-2-2026-11-04",
    "employeeId": "emp-lab-2",
    "departmentId": "dept-lab",
    "shiftId": "shift-1",
    "date": "2026-11-04",
    "status": "published",
    "createdBy": "emp-lab-1"
  },
  {
    "id": "sched-emp-lab-3-2026-11-04",
    "employeeId": "emp-lab-3",
    "departmentId": "dept-lab",
    "shiftId": "shift-2",
    "date": "2026-11-04",
    "status": "published",
    "createdBy": "emp-lab-1"
  },
  {
    "id": "sched-emp-lab-4-2026-11-04",
    "employeeId": "emp-lab-4",
    "departmentId": "dept-lab",
    "shiftId": "shift-3",
    "date": "2026-11-04",
    "status": "published",
    "createdBy": "emp-lab-1"
  },
  {
    "id": "sched-emp-rad-2-2026-11-04",
    "employeeId": "emp-rad-2",
    "departmentId": "dept-rad",
    "shiftId": "shift-1",
    "date": "2026-11-04",
    "status": "published",
    "createdBy": "emp-rad-1"
  },
  {
    "id": "sched-emp-rad-3-2026-11-04",
    "employeeId": "emp-rad-3",
    "departmentId": "dept-rad",
    "shiftId": "shift-2",
    "date": "2026-11-04",
    "status": "published",
    "createdBy": "emp-rad-1"
  },
  {
    "id": "sched-emp-rad-4-2026-11-04",
    "employeeId": "emp-rad-4",
    "departmentId": "dept-rad",
    "shiftId": "shift-3",
    "date": "2026-11-04",
    "status": "published",
    "createdBy": "emp-rad-1"
  },
  {
    "id": "sched-emp-1-2026-11-05",
    "employeeId": "emp-1",
    "departmentId": "dept-hrd",
    "shiftId": "shift-1",
    "date": "2026-11-05",
    "status": "published",
    "createdBy": "emp-1"
  },
  {
    "id": "sched-emp-hrd-2-2026-11-05",
    "employeeId": "emp-hrd-2",
    "departmentId": "dept-hrd",
    "shiftId": "shift-2",
    "date": "2026-11-05",
    "status": "published",
    "createdBy": "emp-1"
  },
  {
    "id": "sched-emp-hrd-3-2026-11-05",
    "employeeId": "emp-hrd-3",
    "departmentId": "dept-hrd",
    "shiftId": "shift-3",
    "date": "2026-11-05",
    "status": "published",
    "createdBy": "emp-1"
  },
  {
    "id": "sched-emp-hrd-5-2026-11-05",
    "employeeId": "emp-hrd-5",
    "departmentId": "dept-hrd",
    "shiftId": "shift-1",
    "date": "2026-11-05",
    "status": "published",
    "createdBy": "emp-1"
  },
  {
    "id": "sched-emp-igd-1-2026-11-05",
    "employeeId": "emp-igd-1",
    "departmentId": "dept-igd",
    "shiftId": "shift-1",
    "date": "2026-11-05",
    "status": "published",
    "createdBy": "emp-igd-1"
  },
  {
    "id": "sched-emp-igd-2-2026-11-05",
    "employeeId": "emp-igd-2",
    "departmentId": "dept-igd",
    "shiftId": "shift-2",
    "date": "2026-11-05",
    "status": "published",
    "createdBy": "emp-igd-1"
  },
  {
    "id": "sched-emp-igd-3-2026-11-05",
    "employeeId": "emp-igd-3",
    "departmentId": "dept-igd",
    "shiftId": "shift-3",
    "date": "2026-11-05",
    "status": "published",
    "createdBy": "emp-igd-1"
  },
  {
    "id": "sched-emp-igd-5-2026-11-05",
    "employeeId": "emp-igd-5",
    "departmentId": "dept-igd",
    "shiftId": "shift-1",
    "date": "2026-11-05",
    "status": "published",
    "createdBy": "emp-igd-1"
  },
  {
    "id": "sched-emp-icu-1-2026-11-05",
    "employeeId": "emp-icu-1",
    "departmentId": "dept-icu",
    "shiftId": "shift-1",
    "date": "2026-11-05",
    "status": "published",
    "createdBy": "emp-icu-1"
  },
  {
    "id": "sched-emp-icu-2-2026-11-05",
    "employeeId": "emp-icu-2",
    "departmentId": "dept-icu",
    "shiftId": "shift-2",
    "date": "2026-11-05",
    "status": "published",
    "createdBy": "emp-icu-1"
  },
  {
    "id": "sched-emp-icu-3-2026-11-05",
    "employeeId": "emp-icu-3",
    "departmentId": "dept-icu",
    "shiftId": "shift-3",
    "date": "2026-11-05",
    "status": "published",
    "createdBy": "emp-icu-1"
  },
  {
    "id": "sched-emp-icu-5-2026-11-05",
    "employeeId": "emp-icu-5",
    "departmentId": "dept-icu",
    "shiftId": "shift-1",
    "date": "2026-11-05",
    "status": "published",
    "createdBy": "emp-icu-1"
  },
  {
    "id": "sched-emp-rwi-1-2026-11-05",
    "employeeId": "emp-rwi-1",
    "departmentId": "dept-rwi",
    "shiftId": "shift-1",
    "date": "2026-11-05",
    "status": "published",
    "createdBy": "emp-rwi-1"
  },
  {
    "id": "sched-emp-rwi-2-2026-11-05",
    "employeeId": "emp-rwi-2",
    "departmentId": "dept-rwi",
    "shiftId": "shift-2",
    "date": "2026-11-05",
    "status": "published",
    "createdBy": "emp-rwi-1"
  },
  {
    "id": "sched-emp-rwi-3-2026-11-05",
    "employeeId": "emp-rwi-3",
    "departmentId": "dept-rwi",
    "shiftId": "shift-3",
    "date": "2026-11-05",
    "status": "published",
    "createdBy": "emp-rwi-1"
  },
  {
    "id": "sched-emp-rwi-5-2026-11-05",
    "employeeId": "emp-rwi-5",
    "departmentId": "dept-rwi",
    "shiftId": "shift-1",
    "date": "2026-11-05",
    "status": "published",
    "createdBy": "emp-rwi-1"
  },
  {
    "id": "sched-emp-far-1-2026-11-05",
    "employeeId": "emp-far-1",
    "departmentId": "dept-far",
    "shiftId": "shift-1",
    "date": "2026-11-05",
    "status": "published",
    "createdBy": "emp-far-1"
  },
  {
    "id": "sched-emp-far-2-2026-11-05",
    "employeeId": "emp-far-2",
    "departmentId": "dept-far",
    "shiftId": "shift-2",
    "date": "2026-11-05",
    "status": "published",
    "createdBy": "emp-far-1"
  },
  {
    "id": "sched-emp-far-3-2026-11-05",
    "employeeId": "emp-far-3",
    "departmentId": "dept-far",
    "shiftId": "shift-3",
    "date": "2026-11-05",
    "status": "published",
    "createdBy": "emp-far-1"
  },
  {
    "id": "sched-emp-far-5-2026-11-05",
    "employeeId": "emp-far-5",
    "departmentId": "dept-far",
    "shiftId": "shift-1",
    "date": "2026-11-05",
    "status": "published",
    "createdBy": "emp-far-1"
  },
  {
    "id": "sched-emp-lab-1-2026-11-05",
    "employeeId": "emp-lab-1",
    "departmentId": "dept-lab",
    "shiftId": "shift-1",
    "date": "2026-11-05",
    "status": "published",
    "createdBy": "emp-lab-1"
  },
  {
    "id": "sched-emp-lab-2-2026-11-05",
    "employeeId": "emp-lab-2",
    "departmentId": "dept-lab",
    "shiftId": "shift-2",
    "date": "2026-11-05",
    "status": "published",
    "createdBy": "emp-lab-1"
  },
  {
    "id": "sched-emp-lab-3-2026-11-05",
    "employeeId": "emp-lab-3",
    "departmentId": "dept-lab",
    "shiftId": "shift-3",
    "date": "2026-11-05",
    "status": "published",
    "createdBy": "emp-lab-1"
  },
  {
    "id": "sched-emp-lab-5-2026-11-05",
    "employeeId": "emp-lab-5",
    "departmentId": "dept-lab",
    "shiftId": "shift-1",
    "date": "2026-11-05",
    "status": "published",
    "createdBy": "emp-lab-1"
  },
  {
    "id": "sched-emp-rad-1-2026-11-05",
    "employeeId": "emp-rad-1",
    "departmentId": "dept-rad",
    "shiftId": "shift-1",
    "date": "2026-11-05",
    "status": "published",
    "createdBy": "emp-rad-1"
  },
  {
    "id": "sched-emp-rad-2-2026-11-05",
    "employeeId": "emp-rad-2",
    "departmentId": "dept-rad",
    "shiftId": "shift-2",
    "date": "2026-11-05",
    "status": "published",
    "createdBy": "emp-rad-1"
  },
  {
    "id": "sched-emp-rad-3-2026-11-05",
    "employeeId": "emp-rad-3",
    "departmentId": "dept-rad",
    "shiftId": "shift-3",
    "date": "2026-11-05",
    "status": "published",
    "createdBy": "emp-rad-1"
  },
  {
    "id": "sched-emp-rad-5-2026-11-05",
    "employeeId": "emp-rad-5",
    "departmentId": "dept-rad",
    "shiftId": "shift-1",
    "date": "2026-11-05",
    "status": "published",
    "createdBy": "emp-rad-1"
  },
  {
    "id": "sched-emp-1-2026-11-06",
    "employeeId": "emp-1",
    "departmentId": "dept-hrd",
    "shiftId": "shift-2",
    "date": "2026-11-06",
    "status": "published",
    "createdBy": "emp-1"
  },
  {
    "id": "sched-emp-hrd-2-2026-11-06",
    "employeeId": "emp-hrd-2",
    "departmentId": "dept-hrd",
    "shiftId": "shift-3",
    "date": "2026-11-06",
    "status": "published",
    "createdBy": "emp-1"
  },
  {
    "id": "sched-emp-hrd-4-2026-11-06",
    "employeeId": "emp-hrd-4",
    "departmentId": "dept-hrd",
    "shiftId": "shift-1",
    "date": "2026-11-06",
    "status": "published",
    "createdBy": "emp-1"
  },
  {
    "id": "sched-emp-hrd-5-2026-11-06",
    "employeeId": "emp-hrd-5",
    "departmentId": "dept-hrd",
    "shiftId": "shift-2",
    "date": "2026-11-06",
    "status": "published",
    "createdBy": "emp-1"
  },
  {
    "id": "sched-emp-igd-1-2026-11-06",
    "employeeId": "emp-igd-1",
    "departmentId": "dept-igd",
    "shiftId": "shift-2",
    "date": "2026-11-06",
    "status": "published",
    "createdBy": "emp-igd-1"
  },
  {
    "id": "sched-emp-igd-2-2026-11-06",
    "employeeId": "emp-igd-2",
    "departmentId": "dept-igd",
    "shiftId": "shift-3",
    "date": "2026-11-06",
    "status": "published",
    "createdBy": "emp-igd-1"
  },
  {
    "id": "sched-emp-igd-4-2026-11-06",
    "employeeId": "emp-igd-4",
    "departmentId": "dept-igd",
    "shiftId": "shift-1",
    "date": "2026-11-06",
    "status": "published",
    "createdBy": "emp-igd-1"
  },
  {
    "id": "sched-emp-igd-5-2026-11-06",
    "employeeId": "emp-igd-5",
    "departmentId": "dept-igd",
    "shiftId": "shift-2",
    "date": "2026-11-06",
    "status": "published",
    "createdBy": "emp-igd-1"
  },
  {
    "id": "sched-emp-icu-1-2026-11-06",
    "employeeId": "emp-icu-1",
    "departmentId": "dept-icu",
    "shiftId": "shift-2",
    "date": "2026-11-06",
    "status": "published",
    "createdBy": "emp-icu-1"
  },
  {
    "id": "sched-emp-icu-2-2026-11-06",
    "employeeId": "emp-icu-2",
    "departmentId": "dept-icu",
    "shiftId": "shift-3",
    "date": "2026-11-06",
    "status": "published",
    "createdBy": "emp-icu-1"
  },
  {
    "id": "sched-emp-icu-4-2026-11-06",
    "employeeId": "emp-icu-4",
    "departmentId": "dept-icu",
    "shiftId": "shift-1",
    "date": "2026-11-06",
    "status": "published",
    "createdBy": "emp-icu-1"
  },
  {
    "id": "sched-emp-icu-5-2026-11-06",
    "employeeId": "emp-icu-5",
    "departmentId": "dept-icu",
    "shiftId": "shift-2",
    "date": "2026-11-06",
    "status": "published",
    "createdBy": "emp-icu-1"
  },
  {
    "id": "sched-emp-rwi-1-2026-11-06",
    "employeeId": "emp-rwi-1",
    "departmentId": "dept-rwi",
    "shiftId": "shift-2",
    "date": "2026-11-06",
    "status": "published",
    "createdBy": "emp-rwi-1"
  },
  {
    "id": "sched-emp-rwi-2-2026-11-06",
    "employeeId": "emp-rwi-2",
    "departmentId": "dept-rwi",
    "shiftId": "shift-3",
    "date": "2026-11-06",
    "status": "published",
    "createdBy": "emp-rwi-1"
  },
  {
    "id": "sched-emp-rwi-4-2026-11-06",
    "employeeId": "emp-rwi-4",
    "departmentId": "dept-rwi",
    "shiftId": "shift-1",
    "date": "2026-11-06",
    "status": "published",
    "createdBy": "emp-rwi-1"
  },
  {
    "id": "sched-emp-rwi-5-2026-11-06",
    "employeeId": "emp-rwi-5",
    "departmentId": "dept-rwi",
    "shiftId": "shift-2",
    "date": "2026-11-06",
    "status": "published",
    "createdBy": "emp-rwi-1"
  },
  {
    "id": "sched-emp-far-1-2026-11-06",
    "employeeId": "emp-far-1",
    "departmentId": "dept-far",
    "shiftId": "shift-2",
    "date": "2026-11-06",
    "status": "published",
    "createdBy": "emp-far-1"
  },
  {
    "id": "sched-emp-far-2-2026-11-06",
    "employeeId": "emp-far-2",
    "departmentId": "dept-far",
    "shiftId": "shift-3",
    "date": "2026-11-06",
    "status": "published",
    "createdBy": "emp-far-1"
  },
  {
    "id": "sched-emp-far-4-2026-11-06",
    "employeeId": "emp-far-4",
    "departmentId": "dept-far",
    "shiftId": "shift-1",
    "date": "2026-11-06",
    "status": "published",
    "createdBy": "emp-far-1"
  },
  {
    "id": "sched-emp-far-5-2026-11-06",
    "employeeId": "emp-far-5",
    "departmentId": "dept-far",
    "shiftId": "shift-2",
    "date": "2026-11-06",
    "status": "published",
    "createdBy": "emp-far-1"
  },
  {
    "id": "sched-emp-lab-1-2026-11-06",
    "employeeId": "emp-lab-1",
    "departmentId": "dept-lab",
    "shiftId": "shift-2",
    "date": "2026-11-06",
    "status": "published",
    "createdBy": "emp-lab-1"
  },
  {
    "id": "sched-emp-lab-2-2026-11-06",
    "employeeId": "emp-lab-2",
    "departmentId": "dept-lab",
    "shiftId": "shift-3",
    "date": "2026-11-06",
    "status": "published",
    "createdBy": "emp-lab-1"
  },
  {
    "id": "sched-emp-lab-4-2026-11-06",
    "employeeId": "emp-lab-4",
    "departmentId": "dept-lab",
    "shiftId": "shift-1",
    "date": "2026-11-06",
    "status": "published",
    "createdBy": "emp-lab-1"
  },
  {
    "id": "sched-emp-lab-5-2026-11-06",
    "employeeId": "emp-lab-5",
    "departmentId": "dept-lab",
    "shiftId": "shift-2",
    "date": "2026-11-06",
    "status": "published",
    "createdBy": "emp-lab-1"
  },
  {
    "id": "sched-emp-rad-1-2026-11-06",
    "employeeId": "emp-rad-1",
    "departmentId": "dept-rad",
    "shiftId": "shift-2",
    "date": "2026-11-06",
    "status": "published",
    "createdBy": "emp-rad-1"
  },
  {
    "id": "sched-emp-rad-2-2026-11-06",
    "employeeId": "emp-rad-2",
    "departmentId": "dept-rad",
    "shiftId": "shift-3",
    "date": "2026-11-06",
    "status": "published",
    "createdBy": "emp-rad-1"
  },
  {
    "id": "sched-emp-rad-4-2026-11-06",
    "employeeId": "emp-rad-4",
    "departmentId": "dept-rad",
    "shiftId": "shift-1",
    "date": "2026-11-06",
    "status": "published",
    "createdBy": "emp-rad-1"
  },
  {
    "id": "sched-emp-rad-5-2026-11-06",
    "employeeId": "emp-rad-5",
    "departmentId": "dept-rad",
    "shiftId": "shift-2",
    "date": "2026-11-06",
    "status": "published",
    "createdBy": "emp-rad-1"
  },
  {
    "id": "sched-emp-1-2026-11-07",
    "employeeId": "emp-1",
    "departmentId": "dept-hrd",
    "shiftId": "shift-3",
    "date": "2026-11-07",
    "status": "published",
    "createdBy": "emp-1"
  },
  {
    "id": "sched-emp-hrd-3-2026-11-07",
    "employeeId": "emp-hrd-3",
    "departmentId": "dept-hrd",
    "shiftId": "shift-1",
    "date": "2026-11-07",
    "status": "published",
    "createdBy": "emp-1"
  },
  {
    "id": "sched-emp-hrd-4-2026-11-07",
    "employeeId": "emp-hrd-4",
    "departmentId": "dept-hrd",
    "shiftId": "shift-2",
    "date": "2026-11-07",
    "status": "published",
    "createdBy": "emp-1"
  },
  {
    "id": "sched-emp-hrd-5-2026-11-07",
    "employeeId": "emp-hrd-5",
    "departmentId": "dept-hrd",
    "shiftId": "shift-3",
    "date": "2026-11-07",
    "status": "published",
    "createdBy": "emp-1"
  },
  {
    "id": "sched-emp-igd-1-2026-11-07",
    "employeeId": "emp-igd-1",
    "departmentId": "dept-igd",
    "shiftId": "shift-3",
    "date": "2026-11-07",
    "status": "published",
    "createdBy": "emp-igd-1"
  },
  {
    "id": "sched-emp-igd-3-2026-11-07",
    "employeeId": "emp-igd-3",
    "departmentId": "dept-igd",
    "shiftId": "shift-1",
    "date": "2026-11-07",
    "status": "published",
    "createdBy": "emp-igd-1"
  },
  {
    "id": "sched-emp-igd-4-2026-11-07",
    "employeeId": "emp-igd-4",
    "departmentId": "dept-igd",
    "shiftId": "shift-2",
    "date": "2026-11-07",
    "status": "published",
    "createdBy": "emp-igd-1"
  },
  {
    "id": "sched-emp-igd-5-2026-11-07",
    "employeeId": "emp-igd-5",
    "departmentId": "dept-igd",
    "shiftId": "shift-3",
    "date": "2026-11-07",
    "status": "published",
    "createdBy": "emp-igd-1"
  },
  {
    "id": "sched-emp-icu-1-2026-11-07",
    "employeeId": "emp-icu-1",
    "departmentId": "dept-icu",
    "shiftId": "shift-3",
    "date": "2026-11-07",
    "status": "published",
    "createdBy": "emp-icu-1"
  },
  {
    "id": "sched-emp-icu-3-2026-11-07",
    "employeeId": "emp-icu-3",
    "departmentId": "dept-icu",
    "shiftId": "shift-1",
    "date": "2026-11-07",
    "status": "published",
    "createdBy": "emp-icu-1"
  },
  {
    "id": "sched-emp-icu-4-2026-11-07",
    "employeeId": "emp-icu-4",
    "departmentId": "dept-icu",
    "shiftId": "shift-2",
    "date": "2026-11-07",
    "status": "published",
    "createdBy": "emp-icu-1"
  },
  {
    "id": "sched-emp-icu-5-2026-11-07",
    "employeeId": "emp-icu-5",
    "departmentId": "dept-icu",
    "shiftId": "shift-3",
    "date": "2026-11-07",
    "status": "published",
    "createdBy": "emp-icu-1"
  },
  {
    "id": "sched-emp-rwi-1-2026-11-07",
    "employeeId": "emp-rwi-1",
    "departmentId": "dept-rwi",
    "shiftId": "shift-3",
    "date": "2026-11-07",
    "status": "published",
    "createdBy": "emp-rwi-1"
  },
  {
    "id": "sched-emp-rwi-3-2026-11-07",
    "employeeId": "emp-rwi-3",
    "departmentId": "dept-rwi",
    "shiftId": "shift-1",
    "date": "2026-11-07",
    "status": "published",
    "createdBy": "emp-rwi-1"
  },
  {
    "id": "sched-emp-rwi-4-2026-11-07",
    "employeeId": "emp-rwi-4",
    "departmentId": "dept-rwi",
    "shiftId": "shift-2",
    "date": "2026-11-07",
    "status": "published",
    "createdBy": "emp-rwi-1"
  },
  {
    "id": "sched-emp-rwi-5-2026-11-07",
    "employeeId": "emp-rwi-5",
    "departmentId": "dept-rwi",
    "shiftId": "shift-3",
    "date": "2026-11-07",
    "status": "published",
    "createdBy": "emp-rwi-1"
  },
  {
    "id": "sched-emp-far-1-2026-11-07",
    "employeeId": "emp-far-1",
    "departmentId": "dept-far",
    "shiftId": "shift-3",
    "date": "2026-11-07",
    "status": "published",
    "createdBy": "emp-far-1"
  },
  {
    "id": "sched-emp-far-3-2026-11-07",
    "employeeId": "emp-far-3",
    "departmentId": "dept-far",
    "shiftId": "shift-1",
    "date": "2026-11-07",
    "status": "published",
    "createdBy": "emp-far-1"
  },
  {
    "id": "sched-emp-far-4-2026-11-07",
    "employeeId": "emp-far-4",
    "departmentId": "dept-far",
    "shiftId": "shift-2",
    "date": "2026-11-07",
    "status": "published",
    "createdBy": "emp-far-1"
  },
  {
    "id": "sched-emp-far-5-2026-11-07",
    "employeeId": "emp-far-5",
    "departmentId": "dept-far",
    "shiftId": "shift-3",
    "date": "2026-11-07",
    "status": "published",
    "createdBy": "emp-far-1"
  },
  {
    "id": "sched-emp-lab-1-2026-11-07",
    "employeeId": "emp-lab-1",
    "departmentId": "dept-lab",
    "shiftId": "shift-3",
    "date": "2026-11-07",
    "status": "published",
    "createdBy": "emp-lab-1"
  },
  {
    "id": "sched-emp-lab-3-2026-11-07",
    "employeeId": "emp-lab-3",
    "departmentId": "dept-lab",
    "shiftId": "shift-1",
    "date": "2026-11-07",
    "status": "published",
    "createdBy": "emp-lab-1"
  },
  {
    "id": "sched-emp-lab-4-2026-11-07",
    "employeeId": "emp-lab-4",
    "departmentId": "dept-lab",
    "shiftId": "shift-2",
    "date": "2026-11-07",
    "status": "published",
    "createdBy": "emp-lab-1"
  },
  {
    "id": "sched-emp-lab-5-2026-11-07",
    "employeeId": "emp-lab-5",
    "departmentId": "dept-lab",
    "shiftId": "shift-3",
    "date": "2026-11-07",
    "status": "published",
    "createdBy": "emp-lab-1"
  },
  {
    "id": "sched-emp-rad-1-2026-11-07",
    "employeeId": "emp-rad-1",
    "departmentId": "dept-rad",
    "shiftId": "shift-3",
    "date": "2026-11-07",
    "status": "published",
    "createdBy": "emp-rad-1"
  },
  {
    "id": "sched-emp-rad-3-2026-11-07",
    "employeeId": "emp-rad-3",
    "departmentId": "dept-rad",
    "shiftId": "shift-1",
    "date": "2026-11-07",
    "status": "published",
    "createdBy": "emp-rad-1"
  },
  {
    "id": "sched-emp-rad-4-2026-11-07",
    "employeeId": "emp-rad-4",
    "departmentId": "dept-rad",
    "shiftId": "shift-2",
    "date": "2026-11-07",
    "status": "published",
    "createdBy": "emp-rad-1"
  },
  {
    "id": "sched-emp-rad-5-2026-11-07",
    "employeeId": "emp-rad-5",
    "departmentId": "dept-rad",
    "shiftId": "shift-3",
    "date": "2026-11-07",
    "status": "published",
    "createdBy": "emp-rad-1"
  },
  {
    "id": "sched-emp-hrd-2-2026-11-08",
    "employeeId": "emp-hrd-2",
    "departmentId": "dept-hrd",
    "shiftId": "shift-1",
    "date": "2026-11-08",
    "status": "published",
    "createdBy": "emp-1"
  },
  {
    "id": "sched-emp-hrd-3-2026-11-08",
    "employeeId": "emp-hrd-3",
    "departmentId": "dept-hrd",
    "shiftId": "shift-2",
    "date": "2026-11-08",
    "status": "published",
    "createdBy": "emp-1"
  },
  {
    "id": "sched-emp-hrd-4-2026-11-08",
    "employeeId": "emp-hrd-4",
    "departmentId": "dept-hrd",
    "shiftId": "shift-3",
    "date": "2026-11-08",
    "status": "published",
    "createdBy": "emp-1"
  },
  {
    "id": "sched-emp-igd-2-2026-11-08",
    "employeeId": "emp-igd-2",
    "departmentId": "dept-igd",
    "shiftId": "shift-1",
    "date": "2026-11-08",
    "status": "published",
    "createdBy": "emp-igd-1"
  },
  {
    "id": "sched-emp-igd-3-2026-11-08",
    "employeeId": "emp-igd-3",
    "departmentId": "dept-igd",
    "shiftId": "shift-2",
    "date": "2026-11-08",
    "status": "published",
    "createdBy": "emp-igd-1"
  },
  {
    "id": "sched-emp-igd-4-2026-11-08",
    "employeeId": "emp-igd-4",
    "departmentId": "dept-igd",
    "shiftId": "shift-3",
    "date": "2026-11-08",
    "status": "published",
    "createdBy": "emp-igd-1"
  },
  {
    "id": "sched-emp-icu-2-2026-11-08",
    "employeeId": "emp-icu-2",
    "departmentId": "dept-icu",
    "shiftId": "shift-1",
    "date": "2026-11-08",
    "status": "published",
    "createdBy": "emp-icu-1"
  },
  {
    "id": "sched-emp-icu-3-2026-11-08",
    "employeeId": "emp-icu-3",
    "departmentId": "dept-icu",
    "shiftId": "shift-2",
    "date": "2026-11-08",
    "status": "published",
    "createdBy": "emp-icu-1"
  },
  {
    "id": "sched-emp-icu-4-2026-11-08",
    "employeeId": "emp-icu-4",
    "departmentId": "dept-icu",
    "shiftId": "shift-3",
    "date": "2026-11-08",
    "status": "published",
    "createdBy": "emp-icu-1"
  },
  {
    "id": "sched-emp-rwi-2-2026-11-08",
    "employeeId": "emp-rwi-2",
    "departmentId": "dept-rwi",
    "shiftId": "shift-1",
    "date": "2026-11-08",
    "status": "published",
    "createdBy": "emp-rwi-1"
  },
  {
    "id": "sched-emp-rwi-3-2026-11-08",
    "employeeId": "emp-rwi-3",
    "departmentId": "dept-rwi",
    "shiftId": "shift-2",
    "date": "2026-11-08",
    "status": "published",
    "createdBy": "emp-rwi-1"
  },
  {
    "id": "sched-emp-rwi-4-2026-11-08",
    "employeeId": "emp-rwi-4",
    "departmentId": "dept-rwi",
    "shiftId": "shift-3",
    "date": "2026-11-08",
    "status": "published",
    "createdBy": "emp-rwi-1"
  },
  {
    "id": "sched-emp-far-2-2026-11-08",
    "employeeId": "emp-far-2",
    "departmentId": "dept-far",
    "shiftId": "shift-1",
    "date": "2026-11-08",
    "status": "published",
    "createdBy": "emp-far-1"
  },
  {
    "id": "sched-emp-far-3-2026-11-08",
    "employeeId": "emp-far-3",
    "departmentId": "dept-far",
    "shiftId": "shift-2",
    "date": "2026-11-08",
    "status": "published",
    "createdBy": "emp-far-1"
  },
  {
    "id": "sched-emp-far-4-2026-11-08",
    "employeeId": "emp-far-4",
    "departmentId": "dept-far",
    "shiftId": "shift-3",
    "date": "2026-11-08",
    "status": "published",
    "createdBy": "emp-far-1"
  },
  {
    "id": "sched-emp-lab-2-2026-11-08",
    "employeeId": "emp-lab-2",
    "departmentId": "dept-lab",
    "shiftId": "shift-1",
    "date": "2026-11-08",
    "status": "published",
    "createdBy": "emp-lab-1"
  },
  {
    "id": "sched-emp-lab-3-2026-11-08",
    "employeeId": "emp-lab-3",
    "departmentId": "dept-lab",
    "shiftId": "shift-2",
    "date": "2026-11-08",
    "status": "published",
    "createdBy": "emp-lab-1"
  },
  {
    "id": "sched-emp-lab-4-2026-11-08",
    "employeeId": "emp-lab-4",
    "departmentId": "dept-lab",
    "shiftId": "shift-3",
    "date": "2026-11-08",
    "status": "published",
    "createdBy": "emp-lab-1"
  },
  {
    "id": "sched-emp-rad-2-2026-11-08",
    "employeeId": "emp-rad-2",
    "departmentId": "dept-rad",
    "shiftId": "shift-1",
    "date": "2026-11-08",
    "status": "published",
    "createdBy": "emp-rad-1"
  },
  {
    "id": "sched-emp-rad-3-2026-11-08",
    "employeeId": "emp-rad-3",
    "departmentId": "dept-rad",
    "shiftId": "shift-2",
    "date": "2026-11-08",
    "status": "published",
    "createdBy": "emp-rad-1"
  },
  {
    "id": "sched-emp-rad-4-2026-11-08",
    "employeeId": "emp-rad-4",
    "departmentId": "dept-rad",
    "shiftId": "shift-3",
    "date": "2026-11-08",
    "status": "published",
    "createdBy": "emp-rad-1"
  },
  {
    "id": "sched-emp-1-2026-11-09",
    "employeeId": "emp-1",
    "departmentId": "dept-hrd",
    "shiftId": "shift-1",
    "date": "2026-11-09",
    "status": "published",
    "createdBy": "emp-1"
  },
  {
    "id": "sched-emp-hrd-2-2026-11-09",
    "employeeId": "emp-hrd-2",
    "departmentId": "dept-hrd",
    "shiftId": "shift-2",
    "date": "2026-11-09",
    "status": "published",
    "createdBy": "emp-1"
  },
  {
    "id": "sched-emp-hrd-3-2026-11-09",
    "employeeId": "emp-hrd-3",
    "departmentId": "dept-hrd",
    "shiftId": "shift-3",
    "date": "2026-11-09",
    "status": "published",
    "createdBy": "emp-1"
  },
  {
    "id": "sched-emp-hrd-5-2026-11-09",
    "employeeId": "emp-hrd-5",
    "departmentId": "dept-hrd",
    "shiftId": "shift-1",
    "date": "2026-11-09",
    "status": "published",
    "createdBy": "emp-1"
  },
  {
    "id": "sched-emp-igd-1-2026-11-09",
    "employeeId": "emp-igd-1",
    "departmentId": "dept-igd",
    "shiftId": "shift-1",
    "date": "2026-11-09",
    "status": "published",
    "createdBy": "emp-igd-1"
  },
  {
    "id": "sched-emp-igd-2-2026-11-09",
    "employeeId": "emp-igd-2",
    "departmentId": "dept-igd",
    "shiftId": "shift-2",
    "date": "2026-11-09",
    "status": "published",
    "createdBy": "emp-igd-1"
  },
  {
    "id": "sched-emp-igd-3-2026-11-09",
    "employeeId": "emp-igd-3",
    "departmentId": "dept-igd",
    "shiftId": "shift-3",
    "date": "2026-11-09",
    "status": "published",
    "createdBy": "emp-igd-1"
  },
  {
    "id": "sched-emp-igd-5-2026-11-09",
    "employeeId": "emp-igd-5",
    "departmentId": "dept-igd",
    "shiftId": "shift-1",
    "date": "2026-11-09",
    "status": "published",
    "createdBy": "emp-igd-1"
  },
  {
    "id": "sched-emp-icu-1-2026-11-09",
    "employeeId": "emp-icu-1",
    "departmentId": "dept-icu",
    "shiftId": "shift-1",
    "date": "2026-11-09",
    "status": "published",
    "createdBy": "emp-icu-1"
  },
  {
    "id": "sched-emp-icu-2-2026-11-09",
    "employeeId": "emp-icu-2",
    "departmentId": "dept-icu",
    "shiftId": "shift-2",
    "date": "2026-11-09",
    "status": "published",
    "createdBy": "emp-icu-1"
  },
  {
    "id": "sched-emp-icu-3-2026-11-09",
    "employeeId": "emp-icu-3",
    "departmentId": "dept-icu",
    "shiftId": "shift-3",
    "date": "2026-11-09",
    "status": "published",
    "createdBy": "emp-icu-1"
  },
  {
    "id": "sched-emp-icu-5-2026-11-09",
    "employeeId": "emp-icu-5",
    "departmentId": "dept-icu",
    "shiftId": "shift-1",
    "date": "2026-11-09",
    "status": "published",
    "createdBy": "emp-icu-1"
  },
  {
    "id": "sched-emp-rwi-1-2026-11-09",
    "employeeId": "emp-rwi-1",
    "departmentId": "dept-rwi",
    "shiftId": "shift-1",
    "date": "2026-11-09",
    "status": "published",
    "createdBy": "emp-rwi-1"
  },
  {
    "id": "sched-emp-rwi-2-2026-11-09",
    "employeeId": "emp-rwi-2",
    "departmentId": "dept-rwi",
    "shiftId": "shift-2",
    "date": "2026-11-09",
    "status": "published",
    "createdBy": "emp-rwi-1"
  },
  {
    "id": "sched-emp-rwi-3-2026-11-09",
    "employeeId": "emp-rwi-3",
    "departmentId": "dept-rwi",
    "shiftId": "shift-3",
    "date": "2026-11-09",
    "status": "published",
    "createdBy": "emp-rwi-1"
  },
  {
    "id": "sched-emp-rwi-5-2026-11-09",
    "employeeId": "emp-rwi-5",
    "departmentId": "dept-rwi",
    "shiftId": "shift-1",
    "date": "2026-11-09",
    "status": "published",
    "createdBy": "emp-rwi-1"
  },
  {
    "id": "sched-emp-far-1-2026-11-09",
    "employeeId": "emp-far-1",
    "departmentId": "dept-far",
    "shiftId": "shift-1",
    "date": "2026-11-09",
    "status": "published",
    "createdBy": "emp-far-1"
  },
  {
    "id": "sched-emp-far-2-2026-11-09",
    "employeeId": "emp-far-2",
    "departmentId": "dept-far",
    "shiftId": "shift-2",
    "date": "2026-11-09",
    "status": "published",
    "createdBy": "emp-far-1"
  },
  {
    "id": "sched-emp-far-3-2026-11-09",
    "employeeId": "emp-far-3",
    "departmentId": "dept-far",
    "shiftId": "shift-3",
    "date": "2026-11-09",
    "status": "published",
    "createdBy": "emp-far-1"
  },
  {
    "id": "sched-emp-far-5-2026-11-09",
    "employeeId": "emp-far-5",
    "departmentId": "dept-far",
    "shiftId": "shift-1",
    "date": "2026-11-09",
    "status": "published",
    "createdBy": "emp-far-1"
  },
  {
    "id": "sched-emp-lab-1-2026-11-09",
    "employeeId": "emp-lab-1",
    "departmentId": "dept-lab",
    "shiftId": "shift-1",
    "date": "2026-11-09",
    "status": "published",
    "createdBy": "emp-lab-1"
  },
  {
    "id": "sched-emp-lab-2-2026-11-09",
    "employeeId": "emp-lab-2",
    "departmentId": "dept-lab",
    "shiftId": "shift-2",
    "date": "2026-11-09",
    "status": "published",
    "createdBy": "emp-lab-1"
  },
  {
    "id": "sched-emp-lab-3-2026-11-09",
    "employeeId": "emp-lab-3",
    "departmentId": "dept-lab",
    "shiftId": "shift-3",
    "date": "2026-11-09",
    "status": "published",
    "createdBy": "emp-lab-1"
  },
  {
    "id": "sched-emp-lab-5-2026-11-09",
    "employeeId": "emp-lab-5",
    "departmentId": "dept-lab",
    "shiftId": "shift-1",
    "date": "2026-11-09",
    "status": "published",
    "createdBy": "emp-lab-1"
  },
  {
    "id": "sched-emp-rad-1-2026-11-09",
    "employeeId": "emp-rad-1",
    "departmentId": "dept-rad",
    "shiftId": "shift-1",
    "date": "2026-11-09",
    "status": "published",
    "createdBy": "emp-rad-1"
  },
  {
    "id": "sched-emp-rad-2-2026-11-09",
    "employeeId": "emp-rad-2",
    "departmentId": "dept-rad",
    "shiftId": "shift-2",
    "date": "2026-11-09",
    "status": "published",
    "createdBy": "emp-rad-1"
  },
  {
    "id": "sched-emp-rad-3-2026-11-09",
    "employeeId": "emp-rad-3",
    "departmentId": "dept-rad",
    "shiftId": "shift-3",
    "date": "2026-11-09",
    "status": "published",
    "createdBy": "emp-rad-1"
  },
  {
    "id": "sched-emp-rad-5-2026-11-09",
    "employeeId": "emp-rad-5",
    "departmentId": "dept-rad",
    "shiftId": "shift-1",
    "date": "2026-11-09",
    "status": "published",
    "createdBy": "emp-rad-1"
  },
  {
    "id": "sched-emp-1-2026-11-10",
    "employeeId": "emp-1",
    "departmentId": "dept-hrd",
    "shiftId": "shift-2",
    "date": "2026-11-10",
    "status": "published",
    "createdBy": "emp-1"
  },
  {
    "id": "sched-emp-hrd-2-2026-11-10",
    "employeeId": "emp-hrd-2",
    "departmentId": "dept-hrd",
    "shiftId": "shift-3",
    "date": "2026-11-10",
    "status": "published",
    "createdBy": "emp-1"
  },
  {
    "id": "sched-emp-hrd-4-2026-11-10",
    "employeeId": "emp-hrd-4",
    "departmentId": "dept-hrd",
    "shiftId": "shift-1",
    "date": "2026-11-10",
    "status": "published",
    "createdBy": "emp-1"
  },
  {
    "id": "sched-emp-hrd-5-2026-11-10",
    "employeeId": "emp-hrd-5",
    "departmentId": "dept-hrd",
    "shiftId": "shift-2",
    "date": "2026-11-10",
    "status": "published",
    "createdBy": "emp-1"
  },
  {
    "id": "sched-emp-igd-1-2026-11-10",
    "employeeId": "emp-igd-1",
    "departmentId": "dept-igd",
    "shiftId": "shift-2",
    "date": "2026-11-10",
    "status": "published",
    "createdBy": "emp-igd-1"
  },
  {
    "id": "sched-emp-igd-2-2026-11-10",
    "employeeId": "emp-igd-2",
    "departmentId": "dept-igd",
    "shiftId": "shift-3",
    "date": "2026-11-10",
    "status": "published",
    "createdBy": "emp-igd-1"
  },
  {
    "id": "sched-emp-igd-4-2026-11-10",
    "employeeId": "emp-igd-4",
    "departmentId": "dept-igd",
    "shiftId": "shift-1",
    "date": "2026-11-10",
    "status": "published",
    "createdBy": "emp-igd-1"
  },
  {
    "id": "sched-emp-igd-5-2026-11-10",
    "employeeId": "emp-igd-5",
    "departmentId": "dept-igd",
    "shiftId": "shift-2",
    "date": "2026-11-10",
    "status": "published",
    "createdBy": "emp-igd-1"
  },
  {
    "id": "sched-emp-icu-1-2026-11-10",
    "employeeId": "emp-icu-1",
    "departmentId": "dept-icu",
    "shiftId": "shift-2",
    "date": "2026-11-10",
    "status": "published",
    "createdBy": "emp-icu-1"
  },
  {
    "id": "sched-emp-icu-2-2026-11-10",
    "employeeId": "emp-icu-2",
    "departmentId": "dept-icu",
    "shiftId": "shift-3",
    "date": "2026-11-10",
    "status": "published",
    "createdBy": "emp-icu-1"
  },
  {
    "id": "sched-emp-icu-4-2026-11-10",
    "employeeId": "emp-icu-4",
    "departmentId": "dept-icu",
    "shiftId": "shift-1",
    "date": "2026-11-10",
    "status": "published",
    "createdBy": "emp-icu-1"
  },
  {
    "id": "sched-emp-icu-5-2026-11-10",
    "employeeId": "emp-icu-5",
    "departmentId": "dept-icu",
    "shiftId": "shift-2",
    "date": "2026-11-10",
    "status": "published",
    "createdBy": "emp-icu-1"
  },
  {
    "id": "sched-emp-rwi-1-2026-11-10",
    "employeeId": "emp-rwi-1",
    "departmentId": "dept-rwi",
    "shiftId": "shift-2",
    "date": "2026-11-10",
    "status": "published",
    "createdBy": "emp-rwi-1"
  },
  {
    "id": "sched-emp-rwi-2-2026-11-10",
    "employeeId": "emp-rwi-2",
    "departmentId": "dept-rwi",
    "shiftId": "shift-3",
    "date": "2026-11-10",
    "status": "published",
    "createdBy": "emp-rwi-1"
  },
  {
    "id": "sched-emp-rwi-4-2026-11-10",
    "employeeId": "emp-rwi-4",
    "departmentId": "dept-rwi",
    "shiftId": "shift-1",
    "date": "2026-11-10",
    "status": "published",
    "createdBy": "emp-rwi-1"
  },
  {
    "id": "sched-emp-rwi-5-2026-11-10",
    "employeeId": "emp-rwi-5",
    "departmentId": "dept-rwi",
    "shiftId": "shift-2",
    "date": "2026-11-10",
    "status": "published",
    "createdBy": "emp-rwi-1"
  },
  {
    "id": "sched-emp-far-1-2026-11-10",
    "employeeId": "emp-far-1",
    "departmentId": "dept-far",
    "shiftId": "shift-2",
    "date": "2026-11-10",
    "status": "published",
    "createdBy": "emp-far-1"
  },
  {
    "id": "sched-emp-far-2-2026-11-10",
    "employeeId": "emp-far-2",
    "departmentId": "dept-far",
    "shiftId": "shift-3",
    "date": "2026-11-10",
    "status": "published",
    "createdBy": "emp-far-1"
  },
  {
    "id": "sched-emp-far-4-2026-11-10",
    "employeeId": "emp-far-4",
    "departmentId": "dept-far",
    "shiftId": "shift-1",
    "date": "2026-11-10",
    "status": "published",
    "createdBy": "emp-far-1"
  },
  {
    "id": "sched-emp-far-5-2026-11-10",
    "employeeId": "emp-far-5",
    "departmentId": "dept-far",
    "shiftId": "shift-2",
    "date": "2026-11-10",
    "status": "published",
    "createdBy": "emp-far-1"
  },
  {
    "id": "sched-emp-lab-1-2026-11-10",
    "employeeId": "emp-lab-1",
    "departmentId": "dept-lab",
    "shiftId": "shift-2",
    "date": "2026-11-10",
    "status": "published",
    "createdBy": "emp-lab-1"
  },
  {
    "id": "sched-emp-lab-2-2026-11-10",
    "employeeId": "emp-lab-2",
    "departmentId": "dept-lab",
    "shiftId": "shift-3",
    "date": "2026-11-10",
    "status": "published",
    "createdBy": "emp-lab-1"
  },
  {
    "id": "sched-emp-lab-4-2026-11-10",
    "employeeId": "emp-lab-4",
    "departmentId": "dept-lab",
    "shiftId": "shift-1",
    "date": "2026-11-10",
    "status": "published",
    "createdBy": "emp-lab-1"
  },
  {
    "id": "sched-emp-lab-5-2026-11-10",
    "employeeId": "emp-lab-5",
    "departmentId": "dept-lab",
    "shiftId": "shift-2",
    "date": "2026-11-10",
    "status": "published",
    "createdBy": "emp-lab-1"
  },
  {
    "id": "sched-emp-rad-1-2026-11-10",
    "employeeId": "emp-rad-1",
    "departmentId": "dept-rad",
    "shiftId": "shift-2",
    "date": "2026-11-10",
    "status": "published",
    "createdBy": "emp-rad-1"
  },
  {
    "id": "sched-emp-rad-2-2026-11-10",
    "employeeId": "emp-rad-2",
    "departmentId": "dept-rad",
    "shiftId": "shift-3",
    "date": "2026-11-10",
    "status": "published",
    "createdBy": "emp-rad-1"
  },
  {
    "id": "sched-emp-rad-4-2026-11-10",
    "employeeId": "emp-rad-4",
    "departmentId": "dept-rad",
    "shiftId": "shift-1",
    "date": "2026-11-10",
    "status": "published",
    "createdBy": "emp-rad-1"
  },
  {
    "id": "sched-emp-rad-5-2026-11-10",
    "employeeId": "emp-rad-5",
    "departmentId": "dept-rad",
    "shiftId": "shift-2",
    "date": "2026-11-10",
    "status": "published",
    "createdBy": "emp-rad-1"
  },
  {
    "id": "sched-emp-1-2026-11-11",
    "employeeId": "emp-1",
    "departmentId": "dept-hrd",
    "shiftId": "shift-3",
    "date": "2026-11-11",
    "status": "published",
    "createdBy": "emp-1"
  },
  {
    "id": "sched-emp-hrd-3-2026-11-11",
    "employeeId": "emp-hrd-3",
    "departmentId": "dept-hrd",
    "shiftId": "shift-1",
    "date": "2026-11-11",
    "status": "published",
    "createdBy": "emp-1"
  },
  {
    "id": "sched-emp-hrd-4-2026-11-11",
    "employeeId": "emp-hrd-4",
    "departmentId": "dept-hrd",
    "shiftId": "shift-2",
    "date": "2026-11-11",
    "status": "published",
    "createdBy": "emp-1"
  },
  {
    "id": "sched-emp-hrd-5-2026-11-11",
    "employeeId": "emp-hrd-5",
    "departmentId": "dept-hrd",
    "shiftId": "shift-3",
    "date": "2026-11-11",
    "status": "published",
    "createdBy": "emp-1"
  },
  {
    "id": "sched-emp-igd-1-2026-11-11",
    "employeeId": "emp-igd-1",
    "departmentId": "dept-igd",
    "shiftId": "shift-3",
    "date": "2026-11-11",
    "status": "published",
    "createdBy": "emp-igd-1"
  },
  {
    "id": "sched-emp-igd-3-2026-11-11",
    "employeeId": "emp-igd-3",
    "departmentId": "dept-igd",
    "shiftId": "shift-1",
    "date": "2026-11-11",
    "status": "published",
    "createdBy": "emp-igd-1"
  },
  {
    "id": "sched-emp-igd-4-2026-11-11",
    "employeeId": "emp-igd-4",
    "departmentId": "dept-igd",
    "shiftId": "shift-2",
    "date": "2026-11-11",
    "status": "published",
    "createdBy": "emp-igd-1"
  },
  {
    "id": "sched-emp-igd-5-2026-11-11",
    "employeeId": "emp-igd-5",
    "departmentId": "dept-igd",
    "shiftId": "shift-3",
    "date": "2026-11-11",
    "status": "published",
    "createdBy": "emp-igd-1"
  },
  {
    "id": "sched-emp-icu-1-2026-11-11",
    "employeeId": "emp-icu-1",
    "departmentId": "dept-icu",
    "shiftId": "shift-3",
    "date": "2026-11-11",
    "status": "published",
    "createdBy": "emp-icu-1"
  },
  {
    "id": "sched-emp-icu-3-2026-11-11",
    "employeeId": "emp-icu-3",
    "departmentId": "dept-icu",
    "shiftId": "shift-1",
    "date": "2026-11-11",
    "status": "published",
    "createdBy": "emp-icu-1"
  },
  {
    "id": "sched-emp-icu-4-2026-11-11",
    "employeeId": "emp-icu-4",
    "departmentId": "dept-icu",
    "shiftId": "shift-2",
    "date": "2026-11-11",
    "status": "published",
    "createdBy": "emp-icu-1"
  },
  {
    "id": "sched-emp-icu-5-2026-11-11",
    "employeeId": "emp-icu-5",
    "departmentId": "dept-icu",
    "shiftId": "shift-3",
    "date": "2026-11-11",
    "status": "published",
    "createdBy": "emp-icu-1"
  },
  {
    "id": "sched-emp-rwi-1-2026-11-11",
    "employeeId": "emp-rwi-1",
    "departmentId": "dept-rwi",
    "shiftId": "shift-3",
    "date": "2026-11-11",
    "status": "published",
    "createdBy": "emp-rwi-1"
  },
  {
    "id": "sched-emp-rwi-3-2026-11-11",
    "employeeId": "emp-rwi-3",
    "departmentId": "dept-rwi",
    "shiftId": "shift-1",
    "date": "2026-11-11",
    "status": "published",
    "createdBy": "emp-rwi-1"
  },
  {
    "id": "sched-emp-rwi-4-2026-11-11",
    "employeeId": "emp-rwi-4",
    "departmentId": "dept-rwi",
    "shiftId": "shift-2",
    "date": "2026-11-11",
    "status": "published",
    "createdBy": "emp-rwi-1"
  },
  {
    "id": "sched-emp-rwi-5-2026-11-11",
    "employeeId": "emp-rwi-5",
    "departmentId": "dept-rwi",
    "shiftId": "shift-3",
    "date": "2026-11-11",
    "status": "published",
    "createdBy": "emp-rwi-1"
  },
  {
    "id": "sched-emp-far-1-2026-11-11",
    "employeeId": "emp-far-1",
    "departmentId": "dept-far",
    "shiftId": "shift-3",
    "date": "2026-11-11",
    "status": "published",
    "createdBy": "emp-far-1"
  },
  {
    "id": "sched-emp-far-3-2026-11-11",
    "employeeId": "emp-far-3",
    "departmentId": "dept-far",
    "shiftId": "shift-1",
    "date": "2026-11-11",
    "status": "published",
    "createdBy": "emp-far-1"
  },
  {
    "id": "sched-emp-far-4-2026-11-11",
    "employeeId": "emp-far-4",
    "departmentId": "dept-far",
    "shiftId": "shift-2",
    "date": "2026-11-11",
    "status": "published",
    "createdBy": "emp-far-1"
  },
  {
    "id": "sched-emp-far-5-2026-11-11",
    "employeeId": "emp-far-5",
    "departmentId": "dept-far",
    "shiftId": "shift-3",
    "date": "2026-11-11",
    "status": "published",
    "createdBy": "emp-far-1"
  },
  {
    "id": "sched-emp-lab-1-2026-11-11",
    "employeeId": "emp-lab-1",
    "departmentId": "dept-lab",
    "shiftId": "shift-3",
    "date": "2026-11-11",
    "status": "published",
    "createdBy": "emp-lab-1"
  },
  {
    "id": "sched-emp-lab-3-2026-11-11",
    "employeeId": "emp-lab-3",
    "departmentId": "dept-lab",
    "shiftId": "shift-1",
    "date": "2026-11-11",
    "status": "published",
    "createdBy": "emp-lab-1"
  },
  {
    "id": "sched-emp-lab-4-2026-11-11",
    "employeeId": "emp-lab-4",
    "departmentId": "dept-lab",
    "shiftId": "shift-2",
    "date": "2026-11-11",
    "status": "published",
    "createdBy": "emp-lab-1"
  },
  {
    "id": "sched-emp-lab-5-2026-11-11",
    "employeeId": "emp-lab-5",
    "departmentId": "dept-lab",
    "shiftId": "shift-3",
    "date": "2026-11-11",
    "status": "published",
    "createdBy": "emp-lab-1"
  },
  {
    "id": "sched-emp-rad-1-2026-11-11",
    "employeeId": "emp-rad-1",
    "departmentId": "dept-rad",
    "shiftId": "shift-3",
    "date": "2026-11-11",
    "status": "published",
    "createdBy": "emp-rad-1"
  },
  {
    "id": "sched-emp-rad-3-2026-11-11",
    "employeeId": "emp-rad-3",
    "departmentId": "dept-rad",
    "shiftId": "shift-1",
    "date": "2026-11-11",
    "status": "published",
    "createdBy": "emp-rad-1"
  },
  {
    "id": "sched-emp-rad-4-2026-11-11",
    "employeeId": "emp-rad-4",
    "departmentId": "dept-rad",
    "shiftId": "shift-2",
    "date": "2026-11-11",
    "status": "published",
    "createdBy": "emp-rad-1"
  },
  {
    "id": "sched-emp-rad-5-2026-11-11",
    "employeeId": "emp-rad-5",
    "departmentId": "dept-rad",
    "shiftId": "shift-3",
    "date": "2026-11-11",
    "status": "published",
    "createdBy": "emp-rad-1"
  },
  {
    "id": "sched-emp-hrd-2-2026-11-12",
    "employeeId": "emp-hrd-2",
    "departmentId": "dept-hrd",
    "shiftId": "shift-1",
    "date": "2026-11-12",
    "status": "published",
    "createdBy": "emp-1"
  },
  {
    "id": "sched-emp-hrd-3-2026-11-12",
    "employeeId": "emp-hrd-3",
    "departmentId": "dept-hrd",
    "shiftId": "shift-2",
    "date": "2026-11-12",
    "status": "published",
    "createdBy": "emp-1"
  },
  {
    "id": "sched-emp-hrd-4-2026-11-12",
    "employeeId": "emp-hrd-4",
    "departmentId": "dept-hrd",
    "shiftId": "shift-3",
    "date": "2026-11-12",
    "status": "published",
    "createdBy": "emp-1"
  },
  {
    "id": "sched-emp-igd-2-2026-11-12",
    "employeeId": "emp-igd-2",
    "departmentId": "dept-igd",
    "shiftId": "shift-1",
    "date": "2026-11-12",
    "status": "published",
    "createdBy": "emp-igd-1"
  },
  {
    "id": "sched-emp-igd-3-2026-11-12",
    "employeeId": "emp-igd-3",
    "departmentId": "dept-igd",
    "shiftId": "shift-2",
    "date": "2026-11-12",
    "status": "published",
    "createdBy": "emp-igd-1"
  },
  {
    "id": "sched-emp-igd-4-2026-11-12",
    "employeeId": "emp-igd-4",
    "departmentId": "dept-igd",
    "shiftId": "shift-3",
    "date": "2026-11-12",
    "status": "published",
    "createdBy": "emp-igd-1"
  },
  {
    "id": "sched-emp-icu-2-2026-11-12",
    "employeeId": "emp-icu-2",
    "departmentId": "dept-icu",
    "shiftId": "shift-1",
    "date": "2026-11-12",
    "status": "published",
    "createdBy": "emp-icu-1"
  },
  {
    "id": "sched-emp-icu-3-2026-11-12",
    "employeeId": "emp-icu-3",
    "departmentId": "dept-icu",
    "shiftId": "shift-2",
    "date": "2026-11-12",
    "status": "published",
    "createdBy": "emp-icu-1"
  },
  {
    "id": "sched-emp-icu-4-2026-11-12",
    "employeeId": "emp-icu-4",
    "departmentId": "dept-icu",
    "shiftId": "shift-3",
    "date": "2026-11-12",
    "status": "published",
    "createdBy": "emp-icu-1"
  },
  {
    "id": "sched-emp-rwi-2-2026-11-12",
    "employeeId": "emp-rwi-2",
    "departmentId": "dept-rwi",
    "shiftId": "shift-1",
    "date": "2026-11-12",
    "status": "published",
    "createdBy": "emp-rwi-1"
  },
  {
    "id": "sched-emp-rwi-3-2026-11-12",
    "employeeId": "emp-rwi-3",
    "departmentId": "dept-rwi",
    "shiftId": "shift-2",
    "date": "2026-11-12",
    "status": "published",
    "createdBy": "emp-rwi-1"
  },
  {
    "id": "sched-emp-rwi-4-2026-11-12",
    "employeeId": "emp-rwi-4",
    "departmentId": "dept-rwi",
    "shiftId": "shift-3",
    "date": "2026-11-12",
    "status": "published",
    "createdBy": "emp-rwi-1"
  },
  {
    "id": "sched-emp-far-2-2026-11-12",
    "employeeId": "emp-far-2",
    "departmentId": "dept-far",
    "shiftId": "shift-1",
    "date": "2026-11-12",
    "status": "published",
    "createdBy": "emp-far-1"
  },
  {
    "id": "sched-emp-far-3-2026-11-12",
    "employeeId": "emp-far-3",
    "departmentId": "dept-far",
    "shiftId": "shift-2",
    "date": "2026-11-12",
    "status": "published",
    "createdBy": "emp-far-1"
  },
  {
    "id": "sched-emp-far-4-2026-11-12",
    "employeeId": "emp-far-4",
    "departmentId": "dept-far",
    "shiftId": "shift-3",
    "date": "2026-11-12",
    "status": "published",
    "createdBy": "emp-far-1"
  },
  {
    "id": "sched-emp-lab-2-2026-11-12",
    "employeeId": "emp-lab-2",
    "departmentId": "dept-lab",
    "shiftId": "shift-1",
    "date": "2026-11-12",
    "status": "published",
    "createdBy": "emp-lab-1"
  },
  {
    "id": "sched-emp-lab-3-2026-11-12",
    "employeeId": "emp-lab-3",
    "departmentId": "dept-lab",
    "shiftId": "shift-2",
    "date": "2026-11-12",
    "status": "published",
    "createdBy": "emp-lab-1"
  },
  {
    "id": "sched-emp-lab-4-2026-11-12",
    "employeeId": "emp-lab-4",
    "departmentId": "dept-lab",
    "shiftId": "shift-3",
    "date": "2026-11-12",
    "status": "published",
    "createdBy": "emp-lab-1"
  },
  {
    "id": "sched-emp-rad-2-2026-11-12",
    "employeeId": "emp-rad-2",
    "departmentId": "dept-rad",
    "shiftId": "shift-1",
    "date": "2026-11-12",
    "status": "published",
    "createdBy": "emp-rad-1"
  },
  {
    "id": "sched-emp-rad-3-2026-11-12",
    "employeeId": "emp-rad-3",
    "departmentId": "dept-rad",
    "shiftId": "shift-2",
    "date": "2026-11-12",
    "status": "published",
    "createdBy": "emp-rad-1"
  },
  {
    "id": "sched-emp-rad-4-2026-11-12",
    "employeeId": "emp-rad-4",
    "departmentId": "dept-rad",
    "shiftId": "shift-3",
    "date": "2026-11-12",
    "status": "published",
    "createdBy": "emp-rad-1"
  },
  {
    "id": "sched-emp-1-2026-11-13",
    "employeeId": "emp-1",
    "departmentId": "dept-hrd",
    "shiftId": "shift-1",
    "date": "2026-11-13",
    "status": "published",
    "createdBy": "emp-1"
  },
  {
    "id": "sched-emp-hrd-2-2026-11-13",
    "employeeId": "emp-hrd-2",
    "departmentId": "dept-hrd",
    "shiftId": "shift-2",
    "date": "2026-11-13",
    "status": "published",
    "createdBy": "emp-1"
  },
  {
    "id": "sched-emp-hrd-3-2026-11-13",
    "employeeId": "emp-hrd-3",
    "departmentId": "dept-hrd",
    "shiftId": "shift-3",
    "date": "2026-11-13",
    "status": "published",
    "createdBy": "emp-1"
  },
  {
    "id": "sched-emp-hrd-5-2026-11-13",
    "employeeId": "emp-hrd-5",
    "departmentId": "dept-hrd",
    "shiftId": "shift-1",
    "date": "2026-11-13",
    "status": "published",
    "createdBy": "emp-1"
  },
  {
    "id": "sched-emp-igd-1-2026-11-13",
    "employeeId": "emp-igd-1",
    "departmentId": "dept-igd",
    "shiftId": "shift-1",
    "date": "2026-11-13",
    "status": "published",
    "createdBy": "emp-igd-1"
  },
  {
    "id": "sched-emp-igd-2-2026-11-13",
    "employeeId": "emp-igd-2",
    "departmentId": "dept-igd",
    "shiftId": "shift-2",
    "date": "2026-11-13",
    "status": "published",
    "createdBy": "emp-igd-1"
  },
  {
    "id": "sched-emp-igd-3-2026-11-13",
    "employeeId": "emp-igd-3",
    "departmentId": "dept-igd",
    "shiftId": "shift-3",
    "date": "2026-11-13",
    "status": "published",
    "createdBy": "emp-igd-1"
  },
  {
    "id": "sched-emp-igd-5-2026-11-13",
    "employeeId": "emp-igd-5",
    "departmentId": "dept-igd",
    "shiftId": "shift-1",
    "date": "2026-11-13",
    "status": "published",
    "createdBy": "emp-igd-1"
  },
  {
    "id": "sched-emp-icu-1-2026-11-13",
    "employeeId": "emp-icu-1",
    "departmentId": "dept-icu",
    "shiftId": "shift-1",
    "date": "2026-11-13",
    "status": "published",
    "createdBy": "emp-icu-1"
  },
  {
    "id": "sched-emp-icu-2-2026-11-13",
    "employeeId": "emp-icu-2",
    "departmentId": "dept-icu",
    "shiftId": "shift-2",
    "date": "2026-11-13",
    "status": "published",
    "createdBy": "emp-icu-1"
  },
  {
    "id": "sched-emp-icu-3-2026-11-13",
    "employeeId": "emp-icu-3",
    "departmentId": "dept-icu",
    "shiftId": "shift-3",
    "date": "2026-11-13",
    "status": "published",
    "createdBy": "emp-icu-1"
  },
  {
    "id": "sched-emp-icu-5-2026-11-13",
    "employeeId": "emp-icu-5",
    "departmentId": "dept-icu",
    "shiftId": "shift-1",
    "date": "2026-11-13",
    "status": "published",
    "createdBy": "emp-icu-1"
  },
  {
    "id": "sched-emp-rwi-1-2026-11-13",
    "employeeId": "emp-rwi-1",
    "departmentId": "dept-rwi",
    "shiftId": "shift-1",
    "date": "2026-11-13",
    "status": "published",
    "createdBy": "emp-rwi-1"
  },
  {
    "id": "sched-emp-rwi-2-2026-11-13",
    "employeeId": "emp-rwi-2",
    "departmentId": "dept-rwi",
    "shiftId": "shift-2",
    "date": "2026-11-13",
    "status": "published",
    "createdBy": "emp-rwi-1"
  },
  {
    "id": "sched-emp-rwi-3-2026-11-13",
    "employeeId": "emp-rwi-3",
    "departmentId": "dept-rwi",
    "shiftId": "shift-3",
    "date": "2026-11-13",
    "status": "published",
    "createdBy": "emp-rwi-1"
  },
  {
    "id": "sched-emp-rwi-5-2026-11-13",
    "employeeId": "emp-rwi-5",
    "departmentId": "dept-rwi",
    "shiftId": "shift-1",
    "date": "2026-11-13",
    "status": "published",
    "createdBy": "emp-rwi-1"
  },
  {
    "id": "sched-emp-far-1-2026-11-13",
    "employeeId": "emp-far-1",
    "departmentId": "dept-far",
    "shiftId": "shift-1",
    "date": "2026-11-13",
    "status": "published",
    "createdBy": "emp-far-1"
  },
  {
    "id": "sched-emp-far-2-2026-11-13",
    "employeeId": "emp-far-2",
    "departmentId": "dept-far",
    "shiftId": "shift-2",
    "date": "2026-11-13",
    "status": "published",
    "createdBy": "emp-far-1"
  },
  {
    "id": "sched-emp-far-3-2026-11-13",
    "employeeId": "emp-far-3",
    "departmentId": "dept-far",
    "shiftId": "shift-3",
    "date": "2026-11-13",
    "status": "published",
    "createdBy": "emp-far-1"
  },
  {
    "id": "sched-emp-far-5-2026-11-13",
    "employeeId": "emp-far-5",
    "departmentId": "dept-far",
    "shiftId": "shift-1",
    "date": "2026-11-13",
    "status": "published",
    "createdBy": "emp-far-1"
  },
  {
    "id": "sched-emp-lab-1-2026-11-13",
    "employeeId": "emp-lab-1",
    "departmentId": "dept-lab",
    "shiftId": "shift-1",
    "date": "2026-11-13",
    "status": "published",
    "createdBy": "emp-lab-1"
  },
  {
    "id": "sched-emp-lab-2-2026-11-13",
    "employeeId": "emp-lab-2",
    "departmentId": "dept-lab",
    "shiftId": "shift-2",
    "date": "2026-11-13",
    "status": "published",
    "createdBy": "emp-lab-1"
  },
  {
    "id": "sched-emp-lab-3-2026-11-13",
    "employeeId": "emp-lab-3",
    "departmentId": "dept-lab",
    "shiftId": "shift-3",
    "date": "2026-11-13",
    "status": "published",
    "createdBy": "emp-lab-1"
  },
  {
    "id": "sched-emp-lab-5-2026-11-13",
    "employeeId": "emp-lab-5",
    "departmentId": "dept-lab",
    "shiftId": "shift-1",
    "date": "2026-11-13",
    "status": "published",
    "createdBy": "emp-lab-1"
  },
  {
    "id": "sched-emp-rad-1-2026-11-13",
    "employeeId": "emp-rad-1",
    "departmentId": "dept-rad",
    "shiftId": "shift-1",
    "date": "2026-11-13",
    "status": "published",
    "createdBy": "emp-rad-1"
  },
  {
    "id": "sched-emp-rad-2-2026-11-13",
    "employeeId": "emp-rad-2",
    "departmentId": "dept-rad",
    "shiftId": "shift-2",
    "date": "2026-11-13",
    "status": "published",
    "createdBy": "emp-rad-1"
  },
  {
    "id": "sched-emp-rad-3-2026-11-13",
    "employeeId": "emp-rad-3",
    "departmentId": "dept-rad",
    "shiftId": "shift-3",
    "date": "2026-11-13",
    "status": "published",
    "createdBy": "emp-rad-1"
  },
  {
    "id": "sched-emp-rad-5-2026-11-13",
    "employeeId": "emp-rad-5",
    "departmentId": "dept-rad",
    "shiftId": "shift-1",
    "date": "2026-11-13",
    "status": "published",
    "createdBy": "emp-rad-1"
  },
  {
    "id": "sched-emp-1-2026-11-14",
    "employeeId": "emp-1",
    "departmentId": "dept-hrd",
    "shiftId": "shift-2",
    "date": "2026-11-14",
    "status": "published",
    "createdBy": "emp-1"
  },
  {
    "id": "sched-emp-hrd-2-2026-11-14",
    "employeeId": "emp-hrd-2",
    "departmentId": "dept-hrd",
    "shiftId": "shift-3",
    "date": "2026-11-14",
    "status": "published",
    "createdBy": "emp-1"
  },
  {
    "id": "sched-emp-hrd-4-2026-11-14",
    "employeeId": "emp-hrd-4",
    "departmentId": "dept-hrd",
    "shiftId": "shift-1",
    "date": "2026-11-14",
    "status": "published",
    "createdBy": "emp-1"
  },
  {
    "id": "sched-emp-hrd-5-2026-11-14",
    "employeeId": "emp-hrd-5",
    "departmentId": "dept-hrd",
    "shiftId": "shift-2",
    "date": "2026-11-14",
    "status": "published",
    "createdBy": "emp-1"
  },
  {
    "id": "sched-emp-igd-1-2026-11-14",
    "employeeId": "emp-igd-1",
    "departmentId": "dept-igd",
    "shiftId": "shift-2",
    "date": "2026-11-14",
    "status": "published",
    "createdBy": "emp-igd-1"
  },
  {
    "id": "sched-emp-igd-2-2026-11-14",
    "employeeId": "emp-igd-2",
    "departmentId": "dept-igd",
    "shiftId": "shift-3",
    "date": "2026-11-14",
    "status": "published",
    "createdBy": "emp-igd-1"
  },
  {
    "id": "sched-emp-igd-4-2026-11-14",
    "employeeId": "emp-igd-4",
    "departmentId": "dept-igd",
    "shiftId": "shift-1",
    "date": "2026-11-14",
    "status": "published",
    "createdBy": "emp-igd-1"
  },
  {
    "id": "sched-emp-igd-5-2026-11-14",
    "employeeId": "emp-igd-5",
    "departmentId": "dept-igd",
    "shiftId": "shift-2",
    "date": "2026-11-14",
    "status": "published",
    "createdBy": "emp-igd-1"
  },
  {
    "id": "sched-emp-icu-1-2026-11-14",
    "employeeId": "emp-icu-1",
    "departmentId": "dept-icu",
    "shiftId": "shift-2",
    "date": "2026-11-14",
    "status": "published",
    "createdBy": "emp-icu-1"
  },
  {
    "id": "sched-emp-icu-2-2026-11-14",
    "employeeId": "emp-icu-2",
    "departmentId": "dept-icu",
    "shiftId": "shift-3",
    "date": "2026-11-14",
    "status": "published",
    "createdBy": "emp-icu-1"
  },
  {
    "id": "sched-emp-icu-4-2026-11-14",
    "employeeId": "emp-icu-4",
    "departmentId": "dept-icu",
    "shiftId": "shift-1",
    "date": "2026-11-14",
    "status": "published",
    "createdBy": "emp-icu-1"
  },
  {
    "id": "sched-emp-icu-5-2026-11-14",
    "employeeId": "emp-icu-5",
    "departmentId": "dept-icu",
    "shiftId": "shift-2",
    "date": "2026-11-14",
    "status": "published",
    "createdBy": "emp-icu-1"
  },
  {
    "id": "sched-emp-rwi-1-2026-11-14",
    "employeeId": "emp-rwi-1",
    "departmentId": "dept-rwi",
    "shiftId": "shift-2",
    "date": "2026-11-14",
    "status": "published",
    "createdBy": "emp-rwi-1"
  },
  {
    "id": "sched-emp-rwi-2-2026-11-14",
    "employeeId": "emp-rwi-2",
    "departmentId": "dept-rwi",
    "shiftId": "shift-3",
    "date": "2026-11-14",
    "status": "published",
    "createdBy": "emp-rwi-1"
  },
  {
    "id": "sched-emp-rwi-4-2026-11-14",
    "employeeId": "emp-rwi-4",
    "departmentId": "dept-rwi",
    "shiftId": "shift-1",
    "date": "2026-11-14",
    "status": "published",
    "createdBy": "emp-rwi-1"
  },
  {
    "id": "sched-emp-rwi-5-2026-11-14",
    "employeeId": "emp-rwi-5",
    "departmentId": "dept-rwi",
    "shiftId": "shift-2",
    "date": "2026-11-14",
    "status": "published",
    "createdBy": "emp-rwi-1"
  },
  {
    "id": "sched-emp-far-1-2026-11-14",
    "employeeId": "emp-far-1",
    "departmentId": "dept-far",
    "shiftId": "shift-2",
    "date": "2026-11-14",
    "status": "published",
    "createdBy": "emp-far-1"
  },
  {
    "id": "sched-emp-far-2-2026-11-14",
    "employeeId": "emp-far-2",
    "departmentId": "dept-far",
    "shiftId": "shift-3",
    "date": "2026-11-14",
    "status": "published",
    "createdBy": "emp-far-1"
  },
  {
    "id": "sched-emp-far-4-2026-11-14",
    "employeeId": "emp-far-4",
    "departmentId": "dept-far",
    "shiftId": "shift-1",
    "date": "2026-11-14",
    "status": "published",
    "createdBy": "emp-far-1"
  },
  {
    "id": "sched-emp-far-5-2026-11-14",
    "employeeId": "emp-far-5",
    "departmentId": "dept-far",
    "shiftId": "shift-2",
    "date": "2026-11-14",
    "status": "published",
    "createdBy": "emp-far-1"
  },
  {
    "id": "sched-emp-lab-1-2026-11-14",
    "employeeId": "emp-lab-1",
    "departmentId": "dept-lab",
    "shiftId": "shift-2",
    "date": "2026-11-14",
    "status": "published",
    "createdBy": "emp-lab-1"
  },
  {
    "id": "sched-emp-lab-2-2026-11-14",
    "employeeId": "emp-lab-2",
    "departmentId": "dept-lab",
    "shiftId": "shift-3",
    "date": "2026-11-14",
    "status": "published",
    "createdBy": "emp-lab-1"
  },
  {
    "id": "sched-emp-lab-4-2026-11-14",
    "employeeId": "emp-lab-4",
    "departmentId": "dept-lab",
    "shiftId": "shift-1",
    "date": "2026-11-14",
    "status": "published",
    "createdBy": "emp-lab-1"
  },
  {
    "id": "sched-emp-lab-5-2026-11-14",
    "employeeId": "emp-lab-5",
    "departmentId": "dept-lab",
    "shiftId": "shift-2",
    "date": "2026-11-14",
    "status": "published",
    "createdBy": "emp-lab-1"
  },
  {
    "id": "sched-emp-rad-1-2026-11-14",
    "employeeId": "emp-rad-1",
    "departmentId": "dept-rad",
    "shiftId": "shift-2",
    "date": "2026-11-14",
    "status": "published",
    "createdBy": "emp-rad-1"
  },
  {
    "id": "sched-emp-rad-2-2026-11-14",
    "employeeId": "emp-rad-2",
    "departmentId": "dept-rad",
    "shiftId": "shift-3",
    "date": "2026-11-14",
    "status": "published",
    "createdBy": "emp-rad-1"
  },
  {
    "id": "sched-emp-rad-4-2026-11-14",
    "employeeId": "emp-rad-4",
    "departmentId": "dept-rad",
    "shiftId": "shift-1",
    "date": "2026-11-14",
    "status": "published",
    "createdBy": "emp-rad-1"
  },
  {
    "id": "sched-emp-rad-5-2026-11-14",
    "employeeId": "emp-rad-5",
    "departmentId": "dept-rad",
    "shiftId": "shift-2",
    "date": "2026-11-14",
    "status": "published",
    "createdBy": "emp-rad-1"
  }
]
