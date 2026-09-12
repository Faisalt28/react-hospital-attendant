// Shared options for Posisi, Jabatan, and Roles
// Dipakai di EmployeesPage, Sign-Up, dll

export const POSISI_OPTIONS = [
  { value: "admin_hrd",        label: "Admin HRD" },
  { value: "staf_hrd",         label: "Staf HRD / Personalia" },
  { value: "kepala_hrd",       label: "Kepala HRD / Manajer SDM" },
  { value: "recruiter",        label: "Rekrutmen & Pelatihan" },
  { value: "dokter_umum",      label: "Dokter Umum" },
  { value: "dokter_spesialis", label: "Dokter Spesialis" },
  { value: "perawat",          label: "Perawat" },
  { value: "bidan",            label: "Bidan" },
  { value: "apoteker",         label: "Apoteker" },
  { value: "radiografer",      label: "Radiografer" },
  { value: "analis_lab",       label: "Analis Laboratorium" },
  { value: "fisioterapis",     label: "Fisioterapis" },
  { value: "staf_admin",       label: "Staf Administrasi" },
  { value: "kasir",            label: "Kasir" },
  { value: "satpam",           label: "Satpam" },
  { value: "cleaning",         label: "Cleaning Service" },
] as const

export const JABATAN_OPTIONS = [
  { value: "direktur",         label: "Direktur" },
  { value: "wakil_direktur",   label: "Wakil Direktur" },
  { value: "kepala_divisi",    label: "Kepala Divisi / HRD" },
  { value: "kepala_ruangan",   label: "Kepala Ruangan" },
  { value: "supervisor",       label: "Supervisor" },
  { value: "staf_senior",      label: "Staf Senior" },
  { value: "staf_junior",      label: "Staf Junior" },
  { value: "magang",           label: "Magang / Intern" },
] as const

export const ROLE_OPTIONS = [
  { value: "admin",      label: "Admin HRD (Full Access)" },
  { value: "hrd",        label: "Staf HRD" },
  { value: "supervisor", label: "Supervisor / Kepala Ruangan" },
  { value: "employee",   label: "Pegawai" },
] as const
