// Script to push full seed data (Shifts, Schedules, Attendance, Leaves, Swaps) to Cloudflare D1
const BASE_URL = "https://rs-meditrack-backend.faisal-artupairt28.workers.dev";

const PHOTO_SVG = "data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 rx=%2220%22 fill=%22%230284c7%22/><circle cx=%2250%22 cy=%2238%22 r=%2218%22 fill=%22%23ffffff%22/><path d=%22M22 86c0-15 12-26 28-26s28 11 28 26%22 fill=%22%23ffffff%22/></svg>";

// 1. Pola Sif (Master Shifts)
const shifts = [
  { id: "shift-1", name: "Shift Pagi",  startTime: "07:00", endTime: "15:00", color: "blue",   durationHours: 8,  isOvernight: false },
  { id: "shift-2", name: "Shift Siang", startTime: "14:00", endTime: "22:00", color: "orange", durationHours: 8,  isOvernight: false },
  { id: "shift-3", name: "Shift Malam", startTime: "21:00", endTime: "07:00", color: "indigo", durationHours: 10, isOvernight: true  },
  { id: "shift-4", name: "On-Call",     startTime: "00:00", endTime: "00:00", color: "green",  durationHours: 0,  isOvernight: false },
];

// 2. Jadwal (Schedules untuk November 2026: 2026-11-01 s/d 2026-11-07)
const schedules = [];
const depts = [
  { id: "dept-hrd", spv: "emp-1", emps: ["emp-1", "emp-hrd-2", "emp-hrd-3", "emp-hrd-4", "emp-hrd-5"] },
  { id: "dept-igd", spv: "emp-igd-1", emps: ["emp-igd-1", "emp-igd-2", "emp-igd-3", "emp-igd-4", "emp-igd-5"] },
  { id: "dept-icu", spv: "emp-icu-1", emps: ["emp-icu-1", "emp-icu-2", "emp-icu-3", "emp-icu-4", "emp-icu-5"] },
  { id: "dept-rwi", spv: "emp-rwi-1", emps: ["emp-rwi-1", "emp-rwi-2", "emp-rwi-3", "emp-rwi-4", "emp-rwi-5"] },
  { id: "dept-far", spv: "emp-far-1", emps: ["emp-far-1", "emp-far-2", "emp-far-3", "emp-far-4", "emp-far-5"] },
  { id: "dept-lab", spv: "emp-lab-1", emps: ["emp-lab-1", "emp-lab-2", "emp-lab-3", "emp-lab-4", "emp-lab-5"] },
  { id: "dept-rad", spv: "emp-rad-1", emps: ["emp-rad-1", "emp-rad-2", "emp-rad-3", "emp-rad-4", "emp-rad-5"] },
];

const shiftCycle = ["shift-1", "shift-2", "shift-3", "OFF"];

for (let day = 1; day <= 14; day++) {
  const dateStr = `2026-11-${String(day).padStart(2, "0")}`;
  depts.forEach(d => {
    d.emps.forEach((empId, empIdx) => {
      // Rotasi bertahap
      const shiftType = shiftCycle[(empIdx + day - 1) % shiftCycle.length];
      if (shiftType !== "OFF") {
        schedules.push({
          id: `sched-${empId}-${dateStr}`,
          employeeId: empId,
          departmentId: d.id,
          shiftId: shiftType,
          date: dateStr,
          status: "published",
          createdBy: d.spv,
        });
      }
    });
  });
}

// 3. Cuti (Leaves)
const leaves = [
  {
    id: "leave-1",
    employeeId: "emp-igd-3",
    supervisorId: "emp-igd-1",
    departmentId: "dept-igd",
    type: "cuti",
    startDate: "2026-11-04",
    endDate: "2026-11-06",
    totalDays: 3,
    reason: "Cuti tahunan - Acara keluarga di luar kota",
    attachmentBase64: null,
    status: "approved",
    reviewNote: "Disetujui. Pastikan koordinasi tugas dengan Ns. Siti.",
    createdAt: "2026-10-28T08:30:00.000Z",
    reviewedAt: "2026-10-29T10:00:00.000Z",
  },
  {
    id: "leave-2",
    employeeId: "emp-icu-4",
    supervisorId: "emp-icu-1",
    departmentId: "dept-icu",
    type: "sakit",
    startDate: "2026-11-01",
    endDate: "2026-11-02",
    totalDays: 2,
    reason: "Demam tifoid dan rekomendasi istirahat dokter",
    attachmentBase64: null,
    status: "approved",
    reviewNote: "Disetujui. Lekas sembuh, surat dokter telah diverifikasi.",
    createdAt: "2026-10-31T14:00:00.000Z",
    reviewedAt: "2026-11-01T07:15:00.000Z",
  },
  {
    id: "leave-3",
    employeeId: "emp-rwi-4",
    supervisorId: "emp-rwi-1",
    departmentId: "dept-rwi",
    type: "izin",
    startDate: "2026-11-08",
    endDate: "2026-11-09",
    totalDays: 2,
    reason: "Menghadiri wisuda adik kandung",
    attachmentBase64: null,
    status: "pending",
    reviewNote: null,
    createdAt: "2026-11-01T09:00:00.000Z",
    reviewedAt: null,
  },
];

// 4. Tukar Sif (Shift Swaps)
const swaps = [
  {
    id: "swap-1",
    requesterId: "emp-igd-2",
    targetId: "emp-igd-4",
    requesterDate: "2026-11-03",
    targetDate: "2026-11-03",
    requesterShiftId: "shift-1",
    targetShiftId: "shift-2",
    reason: "Ada keperluan keluarga penting di pagi hari, siap tukar ke sif siang",
    departmentId: "dept-igd",
    peerStatus: "approved",
    supervisorStatus: "approved",
    createdAt: "2026-10-30T10:00:00.000Z",
  },
  {
    id: "swap-2",
    requesterId: "emp-icu-2",
    targetId: "emp-icu-3",
    requesterDate: "2026-11-05",
    targetDate: "2026-11-05",
    requesterShiftId: "shift-1",
    targetShiftId: "shift-2",
    reason: "Jadwal kontrol dokter anak di pagi hari",
    departmentId: "dept-icu",
    peerStatus: "approved",
    supervisorStatus: "pending",
    createdAt: "2026-11-01T08:00:00.000Z",
  },
];

// 5. Absensi (Attendance)
// Hari ini 2026-11-01: sebagian besar on-time, ada yang telat dikit
const attendance = [
  // ── IGD ──
  {
    id: "att-emp-igd-1-2026-11-01",
    employeeId: "emp-igd-1",
    scheduleId: "sched-emp-igd-1-2026-11-01",
    date: "2026-11-01",
    clockInTime: "06:48",
    clockOutTime: "15:05",
    photoBase64: PHOTO_SVG,
    location: "inside",
    status: "on-time",
    totalHours: 8.28,
    overtimeHours: 0.1,
  },
  {
    id: "att-emp-igd-2-2026-11-01",
    employeeId: "emp-igd-2",
    scheduleId: "sched-emp-igd-2-2026-11-01",
    date: "2026-11-01",
    clockInTime: "07:22", // Telat dikit (lewat toleransi 15 menit)
    clockOutTime: "15:15",
    photoBase64: PHOTO_SVG,
    location: "inside",
    status: "late",
    totalHours: 7.88,
    overtimeHours: 0,
  },
  {
    id: "att-emp-igd-3-2026-11-01",
    employeeId: "emp-igd-3",
    scheduleId: "sched-emp-igd-3-2026-11-01",
    date: "2026-11-01",
    clockInTime: "13:50",
    clockOutTime: "22:05",
    photoBase64: PHOTO_SVG,
    location: "inside",
    status: "on-time",
    totalHours: 8.25,
    overtimeHours: 0.1,
  },
  {
    id: "att-emp-igd-5-2026-11-01",
    employeeId: "emp-igd-5",
    scheduleId: "sched-emp-igd-5-2026-11-01",
    date: "2026-11-01",
    clockInTime: "06:55",
    clockOutTime: "15:02",
    photoBase64: PHOTO_SVG,
    location: "inside",
    status: "on-time",
    totalHours: 8.12,
    overtimeHours: 0,
  },

  // ── ICU ──
  {
    id: "att-emp-icu-1-2026-11-01",
    employeeId: "emp-icu-1",
    scheduleId: "sched-emp-icu-1-2026-11-01",
    date: "2026-11-01",
    clockInTime: "06:45",
    clockOutTime: "15:10",
    photoBase64: PHOTO_SVG,
    location: "inside",
    status: "on-time",
    totalHours: 8.42,
    overtimeHours: 0.15,
  },
  {
    id: "att-emp-icu-2-2026-11-01",
    employeeId: "emp-icu-2",
    scheduleId: "sched-emp-icu-2-2026-11-01",
    date: "2026-11-01",
    clockInTime: "06:52",
    clockOutTime: "15:04",
    photoBase64: PHOTO_SVG,
    location: "inside",
    status: "on-time",
    totalHours: 8.2,
    overtimeHours: 0,
  },
  {
    id: "att-emp-icu-3-2026-11-01",
    employeeId: "emp-icu-3",
    scheduleId: "sched-emp-icu-3-2026-11-01",
    date: "2026-11-01",
    clockInTime: "13:55",
    clockOutTime: "22:08",
    photoBase64: PHOTO_SVG,
    location: "inside",
    status: "on-time",
    totalHours: 8.22,
    overtimeHours: 0.1,
  },

  // ── Rawat Inap ──
  {
    id: "att-emp-rwi-1-2026-11-01",
    employeeId: "emp-rwi-1",
    scheduleId: "sched-emp-rwi-1-2026-11-01",
    date: "2026-11-01",
    clockInTime: "06:56",
    clockOutTime: "15:03",
    photoBase64: PHOTO_SVG,
    location: "inside",
    status: "on-time",
    totalHours: 8.12,
    overtimeHours: 0,
  },
  {
    id: "att-emp-rwi-2-2026-11-01",
    employeeId: "emp-rwi-2",
    scheduleId: "sched-emp-rwi-2-2026-11-01",
    date: "2026-11-01",
    clockInTime: "06:50",
    clockOutTime: "15:01",
    photoBase64: PHOTO_SVG,
    location: "inside",
    status: "on-time",
    totalHours: 8.18,
    overtimeHours: 0,
  },

  // ── Farmasi ──
  {
    id: "att-emp-far-1-2026-11-01",
    employeeId: "emp-far-1",
    scheduleId: "sched-emp-far-1-2026-11-01",
    date: "2026-11-01",
    clockInTime: "06:50",
    clockOutTime: "15:05",
    photoBase64: PHOTO_SVG,
    location: "inside",
    status: "on-time",
    totalHours: 8.25,
    overtimeHours: 0,
  },
  {
    id: "att-emp-far-3-2026-11-01",
    employeeId: "emp-far-3",
    scheduleId: "sched-emp-far-3-2026-11-01",
    date: "2026-11-01",
    clockInTime: "07:20", // Telat dikit (lewat toleransi 15 menit)
    clockOutTime: "15:10",
    photoBase64: PHOTO_SVG,
    location: "inside",
    status: "late",
    totalHours: 7.83,
    overtimeHours: 0,
  },

  // ── Laboratorium ──
  {
    id: "att-emp-lab-1-2026-11-01",
    employeeId: "emp-lab-1",
    scheduleId: "sched-emp-lab-1-2026-11-01",
    date: "2026-11-01",
    clockInTime: "06:54",
    clockOutTime: "15:02",
    photoBase64: PHOTO_SVG,
    location: "inside",
    status: "on-time",
    totalHours: 8.13,
    overtimeHours: 0,
  },

  // ── Radiologi ──
  {
    id: "att-emp-rad-1-2026-11-01",
    employeeId: "emp-rad-1",
    scheduleId: "sched-emp-rad-1-2026-11-01",
    date: "2026-11-01",
    clockInTime: "06:47",
    clockOutTime: "15:06",
    photoBase64: PHOTO_SVG,
    location: "inside",
    status: "on-time",
    totalHours: 8.32,
    overtimeHours: 0.1,
  },

  // ── HRD ──
  {
    id: "att-emp-1-2026-11-01",
    employeeId: "emp-1",
    scheduleId: "sched-emp-1-2026-11-01",
    date: "2026-11-01",
    clockInTime: "06:53",
    clockOutTime: "15:04",
    photoBase64: PHOTO_SVG,
    location: "inside",
    status: "on-time",
    totalHours: 8.18,
    overtimeHours: 0,
  },
];

async function pushOperationalSeeds() {
  console.log("=== PUSHING OPERATIONAL SEEDS TO CLOUDFLARE D1 ===");

  // 1. Shifts
  console.log(`Pushing ${shifts.length} shifts...`);
  let res = await fetch(`${BASE_URL}/api/sync/shifts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(shifts),
  });
  console.log("Shifts response:", await res.json());

  // 2. Schedules
  console.log(`Pushing ${schedules.length} schedules...`);
  res = await fetch(`${BASE_URL}/api/sync/schedules`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(schedules),
  });
  console.log("Schedules response:", await res.json());

  // 3. Attendance
  console.log(`Pushing ${attendance.length} attendance records...`);
  res = await fetch(`${BASE_URL}/api/sync/attendance`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(attendance),
  });
  console.log("Attendance response:", await res.json());

  // 4. Leaves
  console.log(`Pushing ${leaves.length} leaves...`);
  res = await fetch(`${BASE_URL}/api/sync/leaves`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(leaves),
  });
  console.log("Leaves response:", await res.json());

  // 5. Swaps
  console.log(`Pushing ${swaps.length} swaps...`);
  res = await fetch(`${BASE_URL}/api/sync/swaps`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(swaps),
  });
  console.log("Swaps response:", await res.json());

  // Verification
  console.log("=== VERIFYING FINAL D1 STATE ===");
  const syncRes = await fetch(`${BASE_URL}/api/sync`);
  const syncJson = await syncRes.json();
  console.log("Verification summary:", {
    departments: syncJson.data.departments.length,
    employees: syncJson.data.employees.length,
    shifts: syncJson.data.shifts.length,
    schedules: syncJson.data.schedules.length,
    attendance: syncJson.data.attendance.length,
    leaves: syncJson.data.leaves.length,
    swaps: syncJson.data.swaps.length,
  });

  const lateRecords = syncJson.data.attendance.filter(a => a.status === "late");
  console.log("Late attendance count:", lateRecords.length, lateRecords.map(l => ({ empId: l.employeeId, in: l.clockInTime, status: l.status })));
  console.log("Leaves summary:", syncJson.data.leaves.map(l => ({ empId: l.employeeId, type: l.type, status: l.status })));
  console.log("Swaps summary:", syncJson.data.swaps.map(s => ({ from: s.requesterId, to: s.targetId, status: s.supervisorStatus })));
}

pushOperationalSeeds().catch(err => {
  console.error("Error pushing operational seeds:", err);
  process.exit(1);
});
