// Script to push seed data directly to Cloudflare D1 via backend Worker API
const departments = [
  { id: "dept-hrd", name: "HRD & Personalia", supervisorId: "emp-1" },
  { id: "dept-igd", name: "IGD (Instalasi Gawat Darurat)", supervisorId: "emp-igd-1" },
  { id: "dept-icu", name: "ICU (Intensive Care Unit)", supervisorId: "emp-icu-1" },
  { id: "dept-rwi", name: "Instalasi Rawat Inap", supervisorId: "emp-rwi-1" },
  { id: "dept-far", name: "Instalasi Farmasi", supervisorId: "emp-far-1" },
  { id: "dept-lab", name: "Laboratorium Klinik", supervisorId: "emp-lab-1" },
  { id: "dept-rad", name: "Instalasi Radiologi", supervisorId: "emp-rad-1" },
];

const employees = [
  // ── HRD & Personalia ──
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
];

const BASE_URL = "https://rs-meditrack-backend.faisal-artupairt28.workers.dev";

async function pushData() {
  console.log("=== PUSHING NEW SEEDS TO CLOUDFLARE D1 ===");

  // 1. Departments
  console.log("Pushing departments...");
  let res = await fetch(`${BASE_URL}/api/sync/departments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(departments),
  });
  console.log("Departments response:", await res.json());

  // 2. Employees
  console.log("Pushing employees...");
  res = await fetch(`${BASE_URL}/api/sync/employees`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(employees),
  });
  console.log("Employees response:", await res.json());

  // 3. Shifts (empty)
  console.log("Clearing shifts...");
  res = await fetch(`${BASE_URL}/api/sync/shifts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify([]),
  });
  console.log("Shifts response:", await res.json());

  // 4. Schedules (empty)
  console.log("Clearing schedules...");
  res = await fetch(`${BASE_URL}/api/sync/schedules`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify([]),
  });
  console.log("Schedules response:", await res.json());

  // 5. Attendance (empty)
  console.log("Clearing attendance...");
  res = await fetch(`${BASE_URL}/api/sync/attendance`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify([]),
  });
  console.log("Attendance response:", await res.json());

  // 6. Leaves (empty)
  console.log("Clearing leaves...");
  res = await fetch(`${BASE_URL}/api/sync/leaves`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify([]),
  });
  console.log("Leaves response:", await res.json());

  // 7. Swaps (empty)
  console.log("Clearing swaps...");
  res = await fetch(`${BASE_URL}/api/sync/swaps`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify([]),
  });
  console.log("Swaps response:", await res.json());

  // Verify
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

  // Verify sample employee password
  const emp1 = syncJson.data.employees.find(e => e.id === "emp-1");
  const empIgd1 = syncJson.data.employees.find(e => e.id === "emp-igd-1");
  console.log("Sample checks:", {
    admin: { nip: emp1?.nip, password: emp1?.password, isFirstLogin: emp1?.isFirstLogin },
    igd_spv: { nip: empIgd1?.nip, password: empIgd1?.password, isFirstLogin: empIgd1?.isFirstLogin },
  });
}

pushData().catch(err => {
  console.error("Error pushing data:", err);
  process.exit(1);
});
