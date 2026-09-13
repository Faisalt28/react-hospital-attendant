-- ================================================================
-- RS MediTrack: D1 Database Schema
-- ================================================================

CREATE TABLE IF NOT EXISTS departments (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  supervisor_id TEXT
);

CREATE TABLE IF NOT EXISTS shifts (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  color TEXT NOT NULL,
  duration_hours REAL NOT NULL,
  is_overnight INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS employees (
  id TEXT PRIMARY KEY,
  nip TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  posisi TEXT NOT NULL,
  jabatan TEXT NOT NULL,
  department_id TEXT NOT NULL,
  role TEXT NOT NULL,
  annual_leave_quota INTEGER NOT NULL DEFAULT 12,
  used_leave INTEGER NOT NULL DEFAULT 0,
  phone TEXT,
  join_date TEXT NOT NULL,
  is_active INTEGER NOT NULL DEFAULT 1,
  password TEXT NOT NULL DEFAULT 'RS-2026',
  is_first_login INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS schedules (
  id TEXT PRIMARY KEY,
  employee_id TEXT NOT NULL,
  department_id TEXT NOT NULL,
  shift_id TEXT NOT NULL,
  date TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'published',
  created_by TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS attendance (
  id TEXT PRIMARY KEY,
  employee_id TEXT NOT NULL,
  schedule_id TEXT,
  date TEXT NOT NULL,
  clock_in_time TEXT,
  clock_out_time TEXT,
  photo_base64 TEXT,
  location TEXT NOT NULL DEFAULT 'inside',
  status TEXT NOT NULL DEFAULT 'on-time',
  total_hours REAL,
  overtime_hours REAL
);

CREATE TABLE IF NOT EXISTS leaves (
  id TEXT PRIMARY KEY,
  employee_id TEXT NOT NULL,
  supervisor_id TEXT,
  department_id TEXT NOT NULL,
  type TEXT NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL,
  total_days INTEGER NOT NULL,
  reason TEXT NOT NULL,
  attachment_base64 TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  review_note TEXT,
  created_at TEXT NOT NULL,
  reviewed_at TEXT
);

CREATE TABLE IF NOT EXISTS swaps (
  id TEXT PRIMARY KEY,
  requester_id TEXT NOT NULL,
  target_id TEXT NOT NULL,
  requester_date TEXT NOT NULL,
  target_date TEXT NOT NULL,
  requester_shift_id TEXT NOT NULL,
  target_shift_id TEXT NOT NULL,
  reason TEXT NOT NULL,
  department_id TEXT NOT NULL,
  peer_status TEXT NOT NULL DEFAULT 'pending',
  supervisor_status TEXT NOT NULL DEFAULT 'pending',
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS app_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
