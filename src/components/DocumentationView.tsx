import React, { useState } from 'react';
import {
  BookOpen,
  User,
  GraduationCap,
  Users,
  CheckCircle2,
  HelpCircle,
  Volume2,
  FileText,
  Sliders,
  Shield,
  ChevronDown,
  ChevronUp,
  Download,
  Search,
  Award,
} from 'lucide-react';

export const DocumentationView: React.FC = () => {
  const [activeRoleTab, setActiveRoleTab] = useState<'siswa' | 'guru' | 'wali'>('siswa');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Bagaimana cara mengaktifkan suara narasi guru pada modul video?',
      a: 'Saat membuka modul pelajaran (misal Kalkulus atau Fisika Optika), klik tombol "Bicara Suara Guru" berwarna oranye di atas player. Sistem menggunakan sintesis suara beraksen Bahasa Indonesia (Web Speech API). Anda juga dapat mengatur volume suara (0% - 100%) dan kecepatan pemutaran (1x, 1.25x, 1.5x) yang otomatis menyinkronkan tempo suara pengajar.',
    },
    {
      q: 'Bagaimana durasi video dihitung dari awal sampai akhir?',
      a: 'Durasi video berjalan realistis dari 00:00 hingga 09:32. Di setiap milestone waktu, subtitle dan topik narasi guru otomatis berganti (Menit Awal, Konsep Dasar, Penurunan Rumus, Aplikasi Lanjutan, hingga Akhir Materi). Ketika durasi mencapai akhir, siswa berhak membuka kuis pemahaman materi.',
    },
    {
      q: 'Bagaimana cara orang tua mengajukan surat izin sakit untuk anaknya?',
      a: 'Masuk melalui mode peran "Orang Tua / Wali", buka menu "Portal Orang Tua", kemudian isi formulir Surat Izin Digital. Pilih jenis izin (Sakit, Izin Keluarga, Dispensasi Lomba), tanggal, dan keterangan. Surat akan langsung masuk ke dashboard wali kelas tanpa perlu kertas fisik.',
    },
    {
      q: 'Bagaimana sistem menentukan peringkat di Papan Peringkat (Leaderboard)?',
      a: 'Peringkat dihitung berdasarkan akumulasi XP dari menyelesaikan durasi video materi (+10 XP), mengerjakan kuis nilai sempurna (+50 XP), pengumpulan tugas tepat waktu (+30 XP), dan streak kehadiran harian berturut-turut.',
    },
    {
      q: 'Apakah Laboratorium Virtual dapat digunakan untuk praktikum mandiri?',
      a: 'Ya, modul Lab Virtual menyediakan dua simulasi fisika & matematika teruji: pembiasan Hukum Snellius dengan laser multi-spektrum dan grafik kalkulus kurva kuadrat dengan kalkulasi garis singgung otomatis serta titik puncak stasioner.',
    },
  ];

  const filteredFaqs = faqs.filter(
    (item) =>
      item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-10">
          <BookOpen className="w-64 h-64 text-white" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold uppercase tracking-wider">
              <BookOpen className="w-3.5 h-3.5" /> Panduan & Dokumentasi Resmi
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Buku Panduan NusantaraEdu
            </h1>
            <p className="text-white/90 text-sm sm:text-base leading-relaxed">
              Panduan lengkap tata cara penggunaan sistem e-learning terintegrasi untuk Siswa, Pendidik (Guru & Wali Kelas), dan Orang Tua / Wali Murid.
            </p>
          </div>

          <button
            onClick={() => {
              window.print();
            }}
            className="px-4 py-2.5 bg-white text-orange-600 hover:bg-orange-50 font-semibold rounded-2xl shadow-sm transition flex items-center gap-2 text-sm shrink-0"
          >
            <Download className="w-4 h-4 text-orange-500" />
            Cetak / Simpan PDF Panduan
          </button>
        </div>
      </div>

      {/* Role Navigation Guides Tabs */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-orange-500" /> Alur Kerja Berdasarkan Peran Pengguna
            </h2>
            <p className="text-xs text-gray-500">
              Pilih peran di bawah ini untuk melihat alur fitur dan hak akses masing-masing pengguna.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-gray-100 p-1.5 rounded-2xl">
            <button
              onClick={() => setActiveRoleTab('siswa')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-2 ${
                activeRoleTab === 'siswa'
                  ? 'bg-white text-gray-900 shadow-xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-orange-500" />
              Peran Siswa
            </button>
            <button
              onClick={() => setActiveRoleTab('guru')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-2 ${
                activeRoleTab === 'guru'
                  ? 'bg-white text-gray-900 shadow-xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <User className="w-4 h-4 text-blue-500" />
              Peran Guru
            </button>
            <button
              onClick={() => setActiveRoleTab('wali')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-2 ${
                activeRoleTab === 'wali'
                  ? 'bg-white text-gray-900 shadow-xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <Shield className="w-4 h-4 text-emerald-500" />
              Peran Orang Tua
            </button>
          </div>
        </div>

        {/* Tab Content: Siswa */}
        {activeRoleTab === 'siswa' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in duration-200">
            <div className="p-4 rounded-2xl bg-orange-50/50 border border-orange-100 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs">
                1
              </div>
              <h3 className="font-bold text-sm text-gray-900">Belajar Video & Suara Narasi</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Tonton video interaktif dari menit 00:00 sampai 09:32. Dengarkan suara asli guru Bahasa Indonesia yang tersinkronisasi otomatis dengan materi kurva grafis di layar.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-orange-50/50 border border-orange-100 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs">
                2
              </div>
              <h3 className="font-bold text-sm text-gray-900">Kuis & Pengumpulan Tugas</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Jawab kuis pemahaman setelah tuntas menonton untuk klaim +50 XP. Kerjakan tugas esai dan kalkulus dengan batas waktu, lalu unggah berkas PDF jawaban.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-orange-50/50 border border-orange-100 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs">
                3
              </div>
              <h3 className="font-bold text-sm text-gray-900">Presensi & Prestasi XP</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Lakukan absensi harian dengan verifikasi lokasi sekolah (geofencing). Pertahankan daily streak untuk membuka badge kehormatan dan menaiki klasemen kelas.
              </p>
            </div>
          </div>
        )}

        {/* Tab Content: Guru */}
        {activeRoleTab === 'guru' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in duration-200">
            <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                1
              </div>
              <h3 className="font-bold text-sm text-gray-900">Penilaian Tugas & Umpan Balik</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Buka tab Tugas untuk melihat daftar kiriman siswa. Masukkan skor angka 0-100, pilih predikat capaian kompetensi, dan berikan saran konstruktif.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                2
              </div>
              <h3 className="font-bold text-sm text-gray-900">Monitoring Presensi Kelas</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Tinjau statistik kehadiran 32 siswa kelas XII MIPA 1 secara waktu nyata. Validasi dispensasi izin dan surat dokter yang dikirimkan oleh wali murid.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                3
              </div>
              <h3 className="font-bold text-sm text-gray-900">Konsultasi & Ruang Diskusi</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Berkomunikasi dua arah dengan murid maupun orang tua di Ruang Pesan untuk menjawab pertanyaan seputar materi pelajaran atau kendala belajar.
              </p>
            </div>
          </div>
        )}

        {/* Tab Content: Wali */}
        {activeRoleTab === 'wali' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in duration-200">
            <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                1
              </div>
              <h3 className="font-bold text-sm text-gray-900">Pantau Jam Masuk & Kehadiran</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Ketahui jam tepat anak tiba di gerbang sekolah via notifikasi GPS geofence RFID, serta persentase kehadiran semester berjalan secara transparan.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                2
              </div>
              <h3 className="font-bold text-sm text-gray-900">Transparansi Nilai & Rapor</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Lihat grafik radar kompetensi, nilai harian setiap mata pelajaran, serta catatan evaluasi khusus dari Dra. Siti Rahmawati selaku wali kelas.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                3
              </div>
              <h3 className="font-bold text-sm text-gray-900">Surat Izin Sakit Digital & SPP</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Ajukan surat izin atau lampirkan foto surat dokter secara online langsung ke sistem sekolah. Tinjau status lunas administrasi SPP sekolah tanpa antre.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Curriculum Architecture & Grading Weights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-orange-500" />
            <h3 className="text-base font-bold text-gray-900">
              Komposisi Pembobotan Nilai (Kurikulum Merdeka)
            </h3>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed">
            Perhitungan nilai akhir rapor mengintegrasikan asesmen proses dan capaian sumatif sesuai standar Kementerian Pendidikan:
          </p>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-gray-700">Tugas Proyek & Portofolio Formatif</span>
              <span className="font-bold text-orange-600">30%</span>
            </div>
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div className="bg-orange-500 h-full w-[30%]"></div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-gray-700">Ujian Sumatif Akhir Semester (SAS)</span>
              <span className="font-bold text-blue-600">30%</span>
            </div>
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div className="bg-blue-500 h-full w-[30%]"></div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-gray-700">Kuis Pemahaman Modul Video</span>
              <span className="font-bold text-purple-600">20%</span>
            </div>
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div className="bg-purple-500 h-full w-[20%]"></div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-gray-700">Kehadiran & Kedisiplinan Waktu</span>
              <span className="font-bold text-emerald-600">20%</span>
            </div>
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full w-[20%]"></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-orange-500" />
            <h3 className="text-base font-bold text-gray-900">
              Spesifikasi Audio Penjelasan Guru
            </h3>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">
            Sistem audio menggunakan Web Speech Synthesis terkalibrasi khusus bahasa Indonesia (id-ID) untuk memberikan pendampingan visual & auditori:
          </p>

          <ul className="text-xs text-gray-600 space-y-2 list-disc list-inside">
            <li><strong>Sinkronisasi Durasi:</strong> Naskah audio otomatis terbagi per segmen menit (00:00 - 09:32) selaras dengan kurva grafik.</li>
            <li><strong>Pengatur Volume:</strong> Geser slider volume 0% - 100% tepat di sebelah tombol audio kapan pun dibutuhkan.</li>
            <li><strong>Equalizer Dinamis:</strong> Indikator visual gelombang suara di pojok video aktif berdenyut ketika suara pengajar sedang membacakan penjelasan.</li>
            <li><strong>Dukungan Aksesibilitas:</strong> Dilengkapi subtitle dinamis di layar bagi siswa berkebutuhan visual atau auditori.</li>
          </ul>
        </div>
      </div>

      {/* Interactive FAQ Accordion */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-orange-500" />
            <h3 className="text-base font-bold text-gray-900">Pertanyaan yang Sering Diajukan (FAQ)</h3>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari pertanyaan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>

        <div className="space-y-3 pt-2">
          {filteredFaqs.map((faq, idx) => (
            <div
              key={idx}
              className="border border-gray-100 rounded-2xl overflow-hidden transition"
            >
              <button
                onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                className="w-full p-4 text-left flex items-center justify-between bg-gray-50/60 hover:bg-gray-50 transition"
              >
                <span className="text-xs sm:text-sm font-bold text-gray-800">{faq.q}</span>
                {expandedFaq === idx ? (
                  <ChevronUp className="w-4 h-4 text-gray-500 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-500 shrink-0" />
                )}
              </button>

              {expandedFaq === idx && (
                <div className="p-4 bg-white text-xs text-gray-600 leading-relaxed border-t border-gray-100">
                  {faq.a}
                </div>
              )}
            </div>
          ))}

          {filteredFaqs.length === 0 && (
            <div className="text-center py-6 text-xs text-gray-400">
              Tidak ada pertanyaan yang sesuai dengan kata kunci "{searchQuery}".
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
