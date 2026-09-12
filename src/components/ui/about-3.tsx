import { Button } from "@/components/ui/button";

export interface About3Props {
  title?: string;
  description?: string;
  mainImage?: {
    src: string;
    alt: string;
  };
  secondaryImage?: {
    src: string;
    alt: string;
  };
  breakout?: {
    src?: string;
    alt?: string;
    title?: string;
    description?: string;
    buttonText?: string;
    buttonUrl?: string;
  };
  companiesTitle?: string;
  companies?: Array<{
    src?: string;
    alt: string;
    iconName?: string;
  }>;
  achievementsTitle?: string;
  achievementsDescription?: string;
  achievements?: Array<{
    label: string;
    value: string;
  }>;
}

const defaultCompanies = [
  { alt: "Kementerian Kesehatan RI" },
  { alt: "BPJS Kesehatan" },
  { alt: "Akreditasi KARS Paripurna" },
  { alt: "ISO 9001:2015 Healthcare" },
  { alt: "SatuSehat Kemenkes" },
  { alt: "Perhimpunan RS Seluruh Indonesia" },
];

const defaultAchievements = [
  { label: "Tenaga Medis Aktif", value: "350+" },
  { label: "Unit & Poli Pelayanan", value: "24+" },
  { label: "Akurasi Kehadiran GPS", value: "99.8%" },
  { label: "Penghargaan Akreditasi", value: "KARS ★★★★★" },
];

export const About3 = ({
  title = "Pelayanan Medis Prima dengan Sistem Manajemen Presensi Terpadu",
  description = "RS MediTrack mengintegrasikan kedisiplinan kerja staf, manajemen jadwal sif dinas otomatis, dan verifikasi presensi geofencing berbasis GPS & live camera selfie untuk memastikan standar keselamatan pasien terbaik.",
  mainImage = {
    src: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80",
    alt: "Fasilitas Modern Rumah Sakit RS MediTrack",
  },
  secondaryImage = {
    src: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80",
    alt: "Dokter dan Tenaga Kesehatan Siaga",
  },
  breakout = {
    src: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80",
    alt: "Presensi Realtime",
    title: "Presensi Pintar Geofencing & Selfie",
    description:
      "Memastikan kehadiran tenaga medis tepat waktu di zona rumah sakit dengan anti-fake GPS dan validasi wajah real-time.",
    buttonText: "Masuk ke Sistem Presensi",
    buttonUrl: "/login",
  },
  companiesTitle = "Terhubung dan Terakreditasi Standar Pelayanan Nasional",
  companies = defaultCompanies,
  achievementsTitle = "Kinerja & Dedikasi Pelayanan Kami",
  achievementsDescription = "Mendukung operasional 24/7 di seluruh IGD, ICU, Rawat Inap, Farmasi, dan Radiologi untuk pelayanan kesehatan prima.",
  achievements = defaultAchievements,
}: About3Props = {}) => {
  return (
    <section className="py-12 sm:py-20 lg:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title and Intro */}
        <div className="mb-10 sm:mb-14 grid gap-4 sm:gap-5 text-center md:grid-cols-2 md:text-left items-end">
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight leading-tight">
            {title}
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Bento Image Grid */}
        <div className="grid gap-5 sm:gap-7 lg:grid-cols-3 items-stretch">
          <div className="relative group overflow-hidden rounded-3xl lg:col-span-2 shadow-lg min-h-[220px] sm:min-h-[340px] lg:min-h-[500px]">
            <img
              src={mainImage.src}
              alt={mainImage.alt}
              className="size-full max-h-[560px] rounded-3xl object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-4 sm:p-8">
              <div className="text-white space-y-1">
                <span className="px-2.5 py-0.5 bg-emerald-600/90 text-white rounded-full text-[10px] sm:text-xs font-semibold backdrop-blur-xs">
                  Fasilitas & Sistem Terintegrasi
                </span>
                <p className="text-base sm:text-lg font-bold">Layanan Kesehatan 24 Jam Nonstop</p>
                <p className="text-[11px] sm:text-xs text-gray-200">Didukung pemantauan jadwal sif dan kesiapan dokter jaga secara presisi.</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-5 sm:gap-7 md:flex-row lg:flex-col justify-between">
            <div className="flex flex-col justify-between gap-4 sm:gap-5 rounded-3xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-800/60 p-5 sm:p-7 md:w-1/2 lg:w-auto shadow-sm">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg sm:text-xl shadow-md shadow-emerald-600/20">
                +
              </div>
              <div>
                <p className="mb-1.5 text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100">{breakout.title}</p>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{breakout.description}</p>
              </div>
              <Button variant="default" className="mr-auto cursor-pointer text-xs font-semibold py-2 px-4 rounded-xl" asChild>
                <a href={breakout.buttonUrl}>
                  {breakout.buttonText}
                </a>
              </Button>
            </div>

            <div className="relative overflow-hidden rounded-3xl grow basis-0 md:w-1/2 lg:min-h-0 lg:w-auto shadow-sm group min-h-[160px] sm:min-h-[200px]">
              <img
                src={secondaryImage.src}
                alt={secondaryImage.alt}
                className="size-full min-h-[160px] max-h-[280px] rounded-3xl object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 to-transparent flex items-end p-4 sm:p-5">
                <p className="text-xs font-semibold text-white">Tenaga Kesehatan Terverifikasi & Tersertifikasi</p>
              </div>
            </div>
          </div>
        </div>

        {/* Partners / Accreditation */}
        <div className="py-12 sm:py-20">
          <p className="text-center text-[10px] sm:text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
            {companiesTitle}
          </p>
          <div className="mt-6 flex flex-wrap justify-center items-center gap-2.5 sm:gap-4 lg:gap-6">
            {companies.map((company, idx) => (
              <div
                className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-xs text-[11px] sm:text-xs font-bold text-gray-700 dark:text-gray-300"
                key={company.alt + idx}
              >
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500" />
                {company.alt}
              </div>
            ))}
          </div>
        </div>

        {/* Numbers & Achievements */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 via-indigo-950 to-emerald-950 text-white p-5 sm:p-10 lg:p-14 shadow-2xl">
          <div className="flex flex-col gap-2 sm:gap-3 text-center md:text-left relative z-10">
            <h2 className="text-xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">{achievementsTitle}</h2>
            <p className="max-w-screen-sm text-xs sm:text-base text-gray-300">
              {achievementsDescription}
            </p>
          </div>

          <div className="mt-8 sm:mt-10 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8 text-center relative z-10">
            {achievements.map((item, idx) => (
              <div className="flex flex-col gap-1 sm:gap-2 p-3 sm:p-4 rounded-2xl bg-white/5 backdrop-blur-xs border border-white/10" key={item.label + idx}>
                <span className="text-2xl sm:text-4xl font-extrabold text-emerald-400 tracking-tight">
                  {item.value}
                </span>
                <p className="text-[11px] sm:text-sm text-gray-300 font-medium">{item.label}</p>
              </div>
            ))}
          </div>

          <div className="pointer-events-none absolute -top-1 right-1 z-0 hidden h-full w-full bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:60px_60px] opacity-20 [mask-image:linear-gradient(to_bottom_right,#000,transparent,transparent)] md:block"></div>
        </div>
      </div>
    </section>
  );
};
