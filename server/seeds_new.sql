-- ================================================================
-- RS MediTrack: New Seed Script (All Passwords = 'test123')
-- 7 Departemen (HRD, IGD, ICU, Rawat Inap, Farmasi, Laboratorium, Radiologi)
-- Masing-masing 5 orang (Total 35 pegawai)
-- ================================================================

-- 1. Hapus semua data lama
DELETE FROM employees;
DELETE FROM departments;
DELETE FROM shifts;
DELETE FROM schedules;
DELETE FROM attendance;
DELETE FROM leaves;
DELETE FROM swaps;

-- 2. Tambahkan 7 Departemen
INSERT INTO departments (id, name, supervisor_id) VALUES
  ('dept-hrd', 'HRD & Personalia', 'emp-1'),
  ('dept-igd', 'IGD (Instalasi Gawat Darurat)', 'emp-igd-1'),
  ('dept-icu', 'ICU (Intensive Care Unit)', 'emp-icu-1'),
  ('dept-rwi', 'Instalasi Rawat Inap', 'emp-rwi-1'),
  ('dept-far', 'Instalasi Farmasi', 'emp-far-1'),
  ('dept-lab', 'Laboratorium Klinik', 'emp-lab-1'),
  ('dept-rad', 'Instalasi Radiologi', 'emp-rad-1');

-- 3. Tambahkan 35 Pegawai (Password semua = 'test123')

-- ── 3.1 HRD & PERSONALIA ──
INSERT INTO employees (id, nip, name, email, posisi, jabatan, department_id, role, annual_leave_quota, used_leave, phone, join_date, is_active, password, is_first_login) VALUES
  ('emp-1', 'HRD-2020-001', 'Admin HRD', 'admin@rsmeditrack.com', 'admin_hrd', 'kepala_divisi', 'dept-hrd', 'admin', 12, 0, '081234567890', '2026-01-01', 1, 'test123', 0),
  ('emp-hrd-2', 'HRD-2020-002', 'Maya Anggraini, S.Psi', 'maya.anggraini@rsmeditrack.com', 'staf_hrd', 'staf_senior', 'dept-hrd', 'employee', 12, 0, '081234567891', '2026-01-01', 1, 'test123', 0),
  ('emp-hrd-3', 'HRD-2020-003', 'Dimas Wicaksono, S.M', 'dimas.wicaksono@rsmeditrack.com', 'staf_hrd', 'staf_senior', 'dept-hrd', 'employee', 12, 0, '081234567892', '2026-01-01', 1, 'test123', 0),
  ('emp-hrd-4', 'HRD-2020-004', 'Rina Anggraini, S.Kom', 'rina.anggraini@rsmeditrack.com', 'staf_hrd', 'staf_junior', 'dept-hrd', 'employee', 12, 0, '081234567893', '2026-01-01', 1, 'test123', 0),
  ('emp-hrd-5', 'HRD-2020-005', 'Surya Pratama, A.Md', 'surya.pratama@rsmeditrack.com', 'staf_hrd', 'staf_junior', 'dept-hrd', 'employee', 12, 0, '081234567894', '2026-01-01', 1, 'test123', 0);

-- ── 3.2 IGD (INSTALASI GAWAT DARURAT) ──
INSERT INTO employees (id, nip, name, email, posisi, jabatan, department_id, role, annual_leave_quota, used_leave, phone, join_date, is_active, password, is_first_login) VALUES
  ('emp-igd-1', 'IGD-2020-001', 'dr. Hendra Pratama, Sp.EM', 'hendra.pratama@rsmeditrack.com', 'dokter_spesialis', 'supervisor', 'dept-igd', 'supervisor', 12, 0, '081211110001', '2026-01-01', 1, 'test123', 0),
  ('emp-igd-2', 'IGD-2020-002', 'Ns. Siti Nurhaliza, S.Kep', 'siti.nurhaliza@rsmeditrack.com', 'perawat', 'staf_senior', 'dept-igd', 'employee', 12, 0, '081211110002', '2026-01-01', 1, 'test123', 0),
  ('emp-igd-3', 'IGD-2020-003', 'Ns. Bambang Wijaya, S.Kep', 'bambang.wijaya@rsmeditrack.com', 'perawat', 'staf_senior', 'dept-igd', 'employee', 12, 0, '081211110003', '2026-01-01', 1, 'test123', 0),
  ('emp-igd-4', 'IGD-2020-004', 'Ahmad Fauzi, A.Md.Kep', 'ahmad.fauzi@rsmeditrack.com', 'perawat', 'staf_junior', 'dept-igd', 'employee', 12, 0, '081211110004', '2026-01-01', 1, 'test123', 0),
  ('emp-igd-5', 'IGD-2020-005', 'Dewi Anggraini, A.Md.Kep', 'dewi.anggraini@rsmeditrack.com', 'perawat', 'staf_junior', 'dept-igd', 'employee', 12, 0, '081211110005', '2026-01-01', 1, 'test123', 0);

-- ── 3.3 ICU (INTENSIVE CARE UNIT) ──
INSERT INTO employees (id, nip, name, email, posisi, jabatan, department_id, role, annual_leave_quota, used_leave, phone, join_date, is_active, password, is_first_login) VALUES
  ('emp-icu-1', 'ICU-2020-001', 'dr. Rina Kurniasih, Sp.An', 'rina.kurniasih@rsmeditrack.com', 'dokter_spesialis', 'supervisor', 'dept-icu', 'supervisor', 12, 0, '081222220001', '2026-01-01', 1, 'test123', 0),
  ('emp-icu-2', 'ICU-2020-002', 'Ns. Tri Wahyuni, S.Kep', 'tri.wahyuni@rsmeditrack.com', 'perawat', 'staf_senior', 'dept-icu', 'employee', 12, 0, '081222220002', '2026-01-01', 1, 'test123', 0),
  ('emp-icu-3', 'ICU-2020-003', 'Ns. Doni Prasetyo, S.Kep', 'doni.prasetyo@rsmeditrack.com', 'perawat', 'staf_senior', 'dept-icu', 'employee', 12, 0, '081222220003', '2026-01-01', 1, 'test123', 0),
  ('emp-icu-4', 'ICU-2020-004', 'Riska Handayani, A.Md.Kep', 'riska.handayani@rsmeditrack.com', 'perawat', 'staf_junior', 'dept-icu', 'employee', 12, 0, '081222220004', '2026-01-01', 1, 'test123', 0),
  ('emp-icu-5', 'ICU-2020-005', 'Faisal Akbar, A.Md.Kep', 'faisal.akbar@rsmeditrack.com', 'perawat', 'staf_junior', 'dept-icu', 'employee', 12, 0, '081222220005', '2026-01-01', 1, 'test123', 0);

-- ── 3.4 RAWAT INAP ──
INSERT INTO employees (id, nip, name, email, posisi, jabatan, department_id, role, annual_leave_quota, used_leave, phone, join_date, is_active, password, is_first_login) VALUES
  ('emp-rwi-1', 'RWI-2020-001', 'Ns. Maya Safitri, S.Kep', 'maya.safitri@rsmeditrack.com', 'perawat', 'supervisor', 'dept-rwi', 'supervisor', 12, 0, '081233330001', '2026-01-01', 1, 'test123', 0),
  ('emp-rwi-2', 'RWI-2020-002', 'Ns. Dian Permatasari, S.Kep', 'dian.permatasari@rsmeditrack.com', 'perawat', 'staf_senior', 'dept-rwi', 'employee', 12, 0, '081233330002', '2026-01-01', 1, 'test123', 0),
  ('emp-rwi-3', 'RWI-2020-003', 'Ns. Arif Gunawan, S.Kep', 'arif.gunawan@rsmeditrack.com', 'perawat', 'staf_senior', 'dept-rwi', 'employee', 12, 0, '081233330003', '2026-01-01', 1, 'test123', 0),
  ('emp-rwi-4', 'RWI-2020-004', 'Fitriani, A.Md.Kep', 'fitriani@rsmeditrack.com', 'perawat', 'staf_junior', 'dept-rwi', 'employee', 12, 0, '081233330004', '2026-01-01', 1, 'test123', 0),
  ('emp-rwi-5', 'RWI-2020-005', 'Bagus Setiawan, A.Md.Kep', 'bagus.setiawan@rsmeditrack.com', 'perawat', 'staf_junior', 'dept-rwi', 'employee', 12, 0, '081233330005', '2026-01-01', 1, 'test123', 0);

-- ── 3.5 FARMASI ──
INSERT INTO employees (id, nip, name, email, posisi, jabatan, department_id, role, annual_leave_quota, used_leave, phone, join_date, is_active, password, is_first_login) VALUES
  ('emp-far-1', 'FAR-2020-001', 'apt. Budi Santoso, S.Farm', 'budi.santoso@rsmeditrack.com', 'apoteker', 'supervisor', 'dept-far', 'supervisor', 12, 0, '081244440001', '2026-01-01', 1, 'test123', 0),
  ('emp-far-2', 'FAR-2020-002', 'apt. Indah Puspita, S.Farm', 'indah.puspita@rsmeditrack.com', 'apoteker', 'staf_senior', 'dept-far', 'employee', 12, 0, '081244440002', '2026-01-01', 1, 'test123', 0),
  ('emp-far-3', 'FAR-2020-003', 'Reza Pahlevi, A.Md.Farm', 'reza.pahlevi@rsmeditrack.com', 'apoteker', 'staf_senior', 'dept-far', 'employee', 12, 0, '081244440003', '2026-01-01', 1, 'test123', 0),
  ('emp-far-4', 'FAR-2020-004', 'Nur Aini, A.Md.Farm', 'nur.aini@rsmeditrack.com', 'apoteker', 'staf_junior', 'dept-far', 'employee', 12, 0, '081244440004', '2026-01-01', 1, 'test123', 0),
  ('emp-far-5', 'FAR-2020-005', 'Ilham Ramadhan, A.Md.Farm', 'ilham.ramadhan@rsmeditrack.com', 'apoteker', 'staf_junior', 'dept-far', 'employee', 12, 0, '081244440005', '2026-01-01', 1, 'test123', 0);

-- ── 3.6 LABORATORIUM ──
INSERT INTO employees (id, nip, name, email, posisi, jabatan, department_id, role, annual_leave_quota, used_leave, phone, join_date, is_active, password, is_first_login) VALUES
  ('emp-lab-1', 'LAB-2020-001', 'dr. Eko Prasetyo, Sp.PK', 'eko.prasetyo@rsmeditrack.com', 'dokter_spesialis', 'supervisor', 'dept-lab', 'supervisor', 12, 0, '081255550001', '2026-01-01', 1, 'test123', 0),
  ('emp-lab-2', 'LAB-2020-002', 'Agus Supriyadi, A.Md.AK', 'agus.supriyadi@rsmeditrack.com', 'analis_lab', 'staf_senior', 'dept-lab', 'employee', 12, 0, '081255550002', '2026-01-01', 1, 'test123', 0),
  ('emp-lab-3', 'LAB-2020-003', 'Ratna Sari, A.Md.AK', 'ratna.sari@rsmeditrack.com', 'analis_lab', 'staf_senior', 'dept-lab', 'employee', 12, 0, '081255550003', '2026-01-01', 1, 'test123', 0),
  ('emp-lab-4', 'LAB-2020-004', 'Putri Lestari, A.Md.AK', 'putri.lestari@rsmeditrack.com', 'analis_lab', 'staf_junior', 'dept-lab', 'employee', 12, 0, '081255550004', '2026-01-01', 1, 'test123', 0),
  ('emp-lab-5', 'LAB-2020-005', 'Dedi Kurniawan, A.Md.AK', 'dedi.kurniawan@rsmeditrack.com', 'analis_lab', 'staf_junior', 'dept-lab', 'employee', 12, 0, '081255550005', '2026-01-01', 1, 'test123', 0);

-- ── 3.7 RADIOLOGI ──
INSERT INTO employees (id, nip, name, email, posisi, jabatan, department_id, role, annual_leave_quota, used_leave, phone, join_date, is_active, password, is_first_login) VALUES
  ('emp-rad-1', 'RAD-2020-001', 'dr. Lukman Hakim, Sp.Rad', 'lukman.hakim@rsmeditrack.com', 'dokter_spesialis', 'supervisor', 'dept-rad', 'supervisor', 12, 0, '081266660001', '2026-01-01', 1, 'test123', 0),
  ('emp-rad-2', 'RAD-2020-002', 'Haryanto, S.Tr.Rad', 'haryanto@rsmeditrack.com', 'radiografer', 'staf_senior', 'dept-rad', 'employee', 12, 0, '081266660002', '2026-01-01', 1, 'test123', 0),
  ('emp-rad-3', 'RAD-2020-003', 'Wulan Dari, A.Md.Rad', 'wulan.dari@rsmeditrack.com', 'radiografer', 'staf_senior', 'dept-rad', 'employee', 12, 0, '081266660003', '2026-01-01', 1, 'test123', 0),
  ('emp-rad-4', 'RAD-2020-004', 'Rian Hidayat, A.Md.Rad', 'rian.hidayat@rsmeditrack.com', 'radiografer', 'staf_junior', 'dept-rad', 'employee', 12, 0, '081266660004', '2026-01-01', 1, 'test123', 0),
  ('emp-rad-5', 'RAD-2020-005', 'Nadia Utami, A.Md.Rad', 'nadia.utami@rsmeditrack.com', 'radiografer', 'staf_junior', 'dept-rad', 'employee', 12, 0, '081266660005', '2026-01-01', 1, 'test123', 0);
