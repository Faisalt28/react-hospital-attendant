import { Hono } from "hono"
import { cors } from "hono/cors"

type Bindings = {
  DB: D1Database
}

const app = new Hono<{ Bindings: Bindings }>()

// Enable CORS for frontend web app (Cloudflare Pages, localhost, etc.)
app.use(
  "/*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
  })
)

// Health Check
app.get("/", (c) => {
  return c.json({
    status: "online",
    service: "RS MediTrack Cloudflare API",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  })
})

// ─── AUTH ─────────────────────────────────────────────────────────────────────

// Login (Verifikasi NIP & Password langsung dari D1)
app.post("/api/auth/login", async (c) => {
  try {
    const { nip, password } = await c.req.json()
    if (!nip || !password) {
      return c.json({ error: "NIP dan kata sandi wajib diisi" }, 400)
    }

    const employee = await c.env.DB.prepare(
      "SELECT * FROM employees WHERE nip = ? AND is_active = 1"
    )
      .bind(nip.trim())
      .first<any>()

    if (!employee) {
      return c.json({ error: "NIP tidak terdaftar atau akun tidak aktif" }, 401)
    }

    if (employee.password !== password) {
      return c.json({ error: "Kata sandi salah" }, 401)
    }

    // Format employee data according to frontend Employee type
    const user = {
      id: employee.id,
      nip: employee.nip,
      name: employee.name,
      email: employee.email,
      posisi: employee.posisi,
      jabatan: employee.jabatan,
      departmentId: employee.department_id,
      role: employee.role,
      annualLeaveQuota: employee.annual_leave_quota,
      usedLeave: employee.used_leave,
      phone: employee.phone,
      joinDate: employee.join_date,
      isActive: Boolean(employee.is_active),
      isFirstLogin: Boolean(employee.is_first_login),
    }

    return c.json({
      success: true,
      user,
      token: `tok_${employee.id}_${Date.now()}`,
    })
  } catch (err: any) {
    return c.json({ error: err.message }, 500)
  }
})

// Change Password (Update di D1 dan hilangkan flag is_first_login)
app.post("/api/auth/change-password", async (c) => {
  try {
    const { userId, nip, newPassword } = await c.req.json()
    if (!newPassword || newPassword.length < 8) {
      return c.json({ error: "Password baru minimal 8 karakter" }, 400)
    }

    let query = "UPDATE employees SET password = ?, is_first_login = 0 WHERE id = ?"
    let param = userId
    if (!userId && nip) {
      query = "UPDATE employees SET password = ?, is_first_login = 0 WHERE nip = ?"
      param = nip
    }

    const res = await c.env.DB.prepare(query).bind(newPassword, param).run()
    if (!res.success) {
      return c.json({ error: "Gagal memperbarui kata sandi" }, 500)
    }

    return c.json({ success: true, message: "Kata sandi berhasil diperbarui" })
  } catch (err: any) {
    return c.json({ error: err.message }, 500)
  }
})

// ─── FULL DATA SYNC (PULL) ───────────────────────────────────────────────────

// Unduh seluruh data D1 ke state frontend
app.get("/api/sync", async (c) => {
  try {
    const [
      departmentsRes,
      shiftsRes,
      employeesRes,
      schedulesRes,
      attendanceRes,
      leavesRes,
      swapsRes,
      settingsRes,
    ] = await Promise.all([
      c.env.DB.prepare("SELECT * FROM departments").all(),
      c.env.DB.prepare("SELECT * FROM shifts").all(),
      c.env.DB.prepare("SELECT * FROM employees").all(),
      c.env.DB.prepare("SELECT * FROM schedules").all(),
      c.env.DB.prepare("SELECT * FROM attendance").all(),
      c.env.DB.prepare("SELECT * FROM leaves").all(),
      c.env.DB.prepare("SELECT * FROM swaps").all(),
      c.env.DB.prepare("SELECT value FROM app_settings WHERE key = 'app_settings'").first<{ value: string }>(),
    ])

    const departments = (departmentsRes.results || []).map((d: any) => ({
      id: d.id,
      name: d.name,
      supervisorId: d.supervisor_id,
    }))

    const shifts = (shiftsRes.results || []).map((s: any) => ({
      id: s.id,
      name: s.name,
      startTime: s.start_time,
      endTime: s.end_time,
      color: s.color,
      durationHours: s.duration_hours,
      isOvernight: Boolean(s.is_overnight),
    }))

    const employees = (employeesRes.results || []).map((e: any) => ({
      id: e.id,
      nip: e.nip,
      name: e.name,
      email: e.email,
      posisi: e.posisi,
      jabatan: e.jabatan,
      departmentId: e.department_id,
      role: e.role,
      annualLeaveQuota: e.annual_leave_quota,
      usedLeave: e.used_leave,
      phone: e.phone,
      joinDate: e.join_date,
      isActive: Boolean(e.is_active),
      password: e.password,
      isFirstLogin: Boolean(e.is_first_login),
    }))

    const schedules = (schedulesRes.results || []).map((sc: any) => ({
      id: sc.id,
      employeeId: sc.employee_id,
      departmentId: sc.department_id,
      shiftId: sc.shift_id,
      date: sc.date,
      status: sc.status,
      createdBy: sc.created_by,
    }))

    const attendance = (attendanceRes.results || []).map((a: any) => ({
      id: a.id,
      employeeId: a.employee_id,
      scheduleId: a.schedule_id,
      date: a.date,
      clockInTime: a.clock_in_time,
      clockOutTime: a.clock_out_time,
      photoBase64: a.photo_base64,
      location: a.location,
      status: a.status,
      totalHours: a.total_hours,
      overtimeHours: a.overtime_hours,
    }))

    const leaves = (leavesRes.results || []).map((l: any) => ({
      id: l.id,
      employeeId: l.employee_id,
      supervisorId: l.supervisor_id,
      departmentId: l.department_id,
      type: l.type,
      startDate: l.start_date,
      endDate: l.end_date,
      totalDays: l.total_days,
      reason: l.reason,
      attachmentBase64: l.attachment_base64,
      status: l.status,
      reviewNote: l.review_note,
      createdAt: l.created_at,
      reviewedAt: l.reviewed_at,
    }))

    const swaps = (swapsRes.results || []).map((sw: any) => ({
      id: sw.id,
      requesterId: sw.requester_id,
      targetId: sw.target_id,
      requesterDate: sw.requester_date,
      targetDate: sw.target_date,
      requesterShiftId: sw.requester_shift_id,
      targetShiftId: sw.target_shift_id,
      reason: sw.reason,
      departmentId: sw.department_id,
      peerStatus: sw.peer_status,
      supervisorStatus: sw.supervisor_status,
      createdAt: sw.created_at,
    }))

    const appSettings = settingsRes?.value ? JSON.parse(settingsRes.value) : null

    return c.json({
      success: true,
      data: {
        departments,
        shifts,
        employees,
        schedules,
        attendance,
        leaves,
        swaps,
        app_settings: appSettings,
      },
    })
  } catch (err: any) {
    return c.json({ error: err.message }, 500)
  }
})

// ─── BACKGROUND SYNC PUSH FROM FRONTEND ──────────────────────────────────────

app.post("/api/sync/:key", async (c) => {
  const key = c.req.param("key")
  try {
    const data = await c.req.json()

    if (key === "app_settings") {
      await c.env.DB.prepare(
        "INSERT OR REPLACE INTO app_settings (key, value) VALUES ('app_settings', ?)"
      )
        .bind(JSON.stringify(data))
        .run()
      return c.json({ success: true })
    }

    if (key === "departments" && Array.isArray(data)) {
      const deleteStmt = c.env.DB.prepare("DELETE FROM departments")
      const insertStmts = data.map((d) =>
        c.env.DB.prepare(
          "INSERT INTO departments (id, name, supervisor_id) VALUES (?, ?, ?)"
        ).bind(d.id, d.name, d.supervisorId || null)
      )
      if (insertStmts.length > 0) {
        await c.env.DB.batch([deleteStmt, ...insertStmts])
      } else {
        await deleteStmt.run()
      }
      return c.json({ success: true, count: insertStmts.length })
    }

    if (key === "shifts" && Array.isArray(data)) {
      const deleteStmt = c.env.DB.prepare("DELETE FROM shifts")
      const insertStmts = data.map((s) =>
        c.env.DB.prepare(
          "INSERT INTO shifts (id, name, start_time, end_time, color, duration_hours, is_overnight) VALUES (?, ?, ?, ?, ?, ?, ?)"
        ).bind(
          s.id,
          s.name,
          s.startTime,
          s.endTime,
          s.color,
          s.durationHours,
          s.isOvernight ? 1 : 0
        )
      )
      if (insertStmts.length > 0) {
        await c.env.DB.batch([deleteStmt, ...insertStmts])
      } else {
        await deleteStmt.run()
      }
      return c.json({ success: true, count: insertStmts.length })
    }

    if (key === "employees" && Array.isArray(data)) {
      const deleteStmt = c.env.DB.prepare("DELETE FROM employees")
      const insertStmts = data.map((e) =>
        c.env.DB.prepare(
          `INSERT INTO employees 
          (id, nip, name, email, posisi, jabatan, department_id, role, annual_leave_quota, used_leave, phone, join_date, is_active, password, is_first_login)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        ).bind(
          e.id,
          e.nip,
          e.name,
          e.email,
          e.posisi,
          e.jabatan,
          e.departmentId,
          e.role,
          e.annualLeaveQuota ?? 12,
          e.usedLeave ?? 0,
          e.phone || null,
          e.joinDate,
          e.isActive ? 1 : 0,
          e.password || "RS-2026",
          e.isFirstLogin ? 1 : 0
        )
      )
      if (insertStmts.length > 0) {
        await c.env.DB.batch([deleteStmt, ...insertStmts])
      } else {
        await deleteStmt.run()
      }
      return c.json({ success: true, count: insertStmts.length })
    }

    if (key === "schedules" && Array.isArray(data)) {
      const deleteStmt = c.env.DB.prepare("DELETE FROM schedules")
      const insertStmts = data.map((sc) =>
        c.env.DB.prepare(
          "INSERT INTO schedules (id, employee_id, department_id, shift_id, date, status, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)"
        ).bind(
          sc.id,
          sc.employeeId,
          sc.departmentId,
          sc.shiftId,
          sc.date,
          sc.status || "published",
          sc.createdBy || "system"
        )
      )
      if (insertStmts.length > 0) {
        await c.env.DB.batch([deleteStmt, ...insertStmts])
      } else {
        await deleteStmt.run()
      }
      return c.json({ success: true, count: insertStmts.length })
    }

    if (key === "attendance" && Array.isArray(data)) {
      const deleteStmt = c.env.DB.prepare("DELETE FROM attendance")
      const insertStmts = data.map((a) =>
        c.env.DB.prepare(
          `INSERT INTO attendance 
          (id, employee_id, schedule_id, date, clock_in_time, clock_out_time, photo_base64, location, status, total_hours, overtime_hours)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        ).bind(
          a.id,
          a.employeeId,
          a.scheduleId || null,
          a.date,
          a.clockInTime || null,
          a.clockOutTime || null,
          a.photoBase64 || null,
          a.location || "inside",
          a.status || "on-time",
          a.totalHours || null,
          a.overtimeHours || null
        )
      )
      if (insertStmts.length > 0) {
        await c.env.DB.batch([deleteStmt, ...insertStmts])
      } else {
        await deleteStmt.run()
      }
      return c.json({ success: true, count: insertStmts.length })
    }

    if (key === "leaves" && Array.isArray(data)) {
      const deleteStmt = c.env.DB.prepare("DELETE FROM leaves")
      const insertStmts = data.map((l) =>
        c.env.DB.prepare(
          `INSERT INTO leaves 
          (id, employee_id, supervisor_id, department_id, type, start_date, end_date, total_days, reason, attachment_base64, status, review_note, created_at, reviewed_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        ).bind(
          l.id,
          l.employeeId,
          l.supervisorId || null,
          l.departmentId,
          l.type,
          l.startDate,
          l.endDate,
          l.totalDays,
          l.reason,
          l.attachmentBase64 || null,
          l.status || "pending",
          l.reviewNote || null,
          l.createdAt,
          l.reviewedAt || null
        )
      )
      if (insertStmts.length > 0) {
        await c.env.DB.batch([deleteStmt, ...insertStmts])
      } else {
        await deleteStmt.run()
      }
      return c.json({ success: true, count: insertStmts.length })
    }

    if (key === "swaps" && Array.isArray(data)) {
      const deleteStmt = c.env.DB.prepare("DELETE FROM swaps")
      const insertStmts = data.map((sw) =>
        c.env.DB.prepare(
          `INSERT INTO swaps 
          (id, requester_id, target_id, requester_date, target_date, requester_shift_id, target_shift_id, reason, department_id, peer_status, supervisor_status, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        ).bind(
          sw.id,
          sw.requesterId,
          sw.targetId,
          sw.requesterDate,
          sw.targetDate,
          sw.requesterShiftId,
          sw.targetShiftId,
          sw.reason,
          sw.departmentId,
          sw.peerStatus || "pending",
          sw.supervisorStatus || "pending",
          sw.createdAt
        )
      )
      if (insertStmts.length > 0) {
        await c.env.DB.batch([deleteStmt, ...insertStmts])
      } else {
        await deleteStmt.run()
      }
      return c.json({ success: true, count: insertStmts.length })
    }

    return c.json({ error: `Key '${key}' tidak dikenali` }, 400)
  } catch (err: any) {
    return c.json({ error: err.message }, 500)
  }
})

export default app
