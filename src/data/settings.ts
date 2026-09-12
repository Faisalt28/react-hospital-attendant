import type { AppSettings } from "@/types"

export const DEFAULT_SETTINGS: AppSettings = {
  hospitalName: "RSUD MediTrack Utama",
  address: "Jl. Kesehatan Raya No. 45, Jakarta Pusat",
  latitude: -6.2088,
  longitude: 106.8456,
  geofenceRadiusMeters: 100,
  blockOutsideGeofence: true,
  antiFakeGps: true,
  lateToleranceMinutes: 15,
  earlyClockInMinutes: 60,
  maxClockOutMinutes: 120,
  requireSelfie: true,
  requireHighAccuracyGps: true,
  notifySupervisorOnLate: true,
}
