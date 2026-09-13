-- ================================================================
-- RS MediTrack: Initial Seed Data for Cloudflare D1
-- ================================================================

-- Default Department
INSERT OR REPLACE INTO departments (id, name, supervisor_id)
VALUES ('dept-hrd', 'HRD & Personalia', 'emp-1');

-- Default Shifts
INSERT OR REPLACE INTO shifts (id, name, start_time, end_time, color, duration_hours, is_overnight)
VALUES 
  ('shift-1', 'Shift Pagi', '07:00', '15:00', 'blue', 8.0, 0),
  ('shift-2', 'Shift Siang', '14:00', '22:00', 'orange', 8.0, 0),
  ('shift-3', 'Shift Malam', '21:00', '07:00', 'indigo', 10.0, 1),
  ('shift-4', 'On-Call', '00:00', '00:00', 'green', 0.0, 0);

-- Default Admin HRD User (password: RS-2026, wajib ganti password di login pertama)
INSERT OR REPLACE INTO employees (
  id, nip, name, email, posisi, jabatan, department_id, role,
  annual_leave_quota, used_leave, phone, join_date, is_active, password, is_first_login
) VALUES (
  'emp-1',
  'HRD-2020-001',
  'Admin HRD',
  'admin@rsmeditrack.com',
  'admin_hrd',
  'kepala_divisi',
  'dept-hrd',
  'admin',
  12,
  0,
  '081234567890',
  '2026-01-01',
  1,
  'RS-2026',
  1
);

-- Default App Settings
INSERT OR REPLACE INTO app_settings (key, value)
VALUES ('app_settings', '{"hospitalName":"RSUD MediTrack Utama","address":"Jl. Kesehatan Raya No. 45, Jakarta Pusat","latitude":-6.2088,"longitude":106.8456,"geofenceRadiusMeters":100,"blockOutsideGeofence":true,"antiFakeGps":true,"lateToleranceMinutes":15,"earlyClockInMinutes":60,"maxClockOutMinutes":120,"requireSelfie":true,"requireHighAccuracyGps":true,"notifySupervisorOnLate":true}');
