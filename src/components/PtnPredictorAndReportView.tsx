import React, { useState } from 'react';
import {
  GraduationCap,
  Building2,
  TrendingUp,
  Award,
  CheckCircle2,
  AlertTriangle,
  Printer,
  Download,
  Share2,
  QrCode,
  FileCheck,
  Sparkles,
  BookOpen,
  Calendar,
  Compass,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserProfile, CompetencyScore, PtnTarget } from '../types/index.ts';
import { PTN_TARGETS } from '../data/mockData.ts';
import { calculatePtnEligibility, calculateGPA } from '../utils/learningLogic.ts';
import { CircularProgressBar } from './CircularProgressBar.tsx';

interface PtnPredictorAndReportViewProps {
  currentUser: UserProfile;
  competencies: CompetencyScore[];
  onOpenCourse: (courseId: string) => void;
}

export const PtnPredictorAndReportView: React.FC<PtnPredictorAndReportViewProps> = ({
  currentUser,
  competencies,
  onOpenCourse,
}) => {
  const [selectedTargetId, setSelectedTargetId] = useState<string>('ptn-1');
  const [activeSubTab, setActiveSubTab] = useState<'ptn' | 'rapor'>('ptn');
  const [showPrintModal, setShowPrintModal] = useState(false);

  const selectedTarget =
    PTN_TARGETS.find((p) => p.id === selectedTargetId) || PTN_TARGETS[0];

  const gpaResult = calculateGPA(competencies);
  const userAverage = gpaResult.average || 89.5;

  const eligibility = calculatePtnEligibility(
    userAverage,
    selectedTarget.passingGradeEstimated,
    currentUser.points
  );

  const handlePrintReport = () => {
    setShowPrintModal(true);
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#FF5A26', '#10B981', '#3B82F6'],
      });
    } catch (e) {}

    setTimeout(() => {
      window.print();
    }, 400);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Header Hero Bento Banner */}
      <div className="glass-card rounded-3xl p-6 md:p-8 bg-gradient-to-r from-orange-50/80 via-amber-50/60 to-rose-50/70 border border-orange-200/60 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#FF5A26] border border-orange-200/60 text-xs font-extrabold shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#FF5A26]" />
              <span>Pusat Karir Akademik & Transkrip Resmi</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
              Prediksi Masuk PTN & Rapor Digital Resmi
            </h1>
            <p className="text-xs md:text-sm text-slate-600 font-medium leading-relaxed">
              Analisis peluang kelulusan jalur SNBP/SNBT perguruan tinggi negeri impian berbasis rata-rata rapor
              dan cetak transkrip nilai digital berstandar kurikulum nasional.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-white/80 p-1.5 rounded-2xl border border-orange-200/60 shadow-2xs shrink-0">
            <button
              onClick={() => setActiveSubTab('ptn')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeSubTab === 'ptn'
                  ? 'bg-[#FF5A26] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Simulasi Kelulusan PTN
            </button>
            <button
              onClick={() => setActiveSubTab('rapor')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeSubTab === 'rapor'
                  ? 'bg-[#FF5A26] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Lembar Rapor Digital
            </button>
          </div>
        </div>
      </div>

      {/* SUB-TAB 1: SIMULASI PREDIKSI KELULUSAN PTN */}
      {activeSubTab === 'ptn' && (
        <div className="space-y-6">
          {/* Main Simulation Bento Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 1 Col: University Target Selector */}
            <div className="glass-card rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-[#FF5A26]" />
                  <span>Pilihan Program Studi Impian</span>
                </h3>
                <span className="text-[10px] font-bold text-slate-400">Jalur SNBP 2026</span>
              </div>

              <div className="space-y-2.5">
                {PTN_TARGETS.map((target) => {
                  const isSelected = target.id === selectedTargetId;

                  return (
                    <button
                      key={target.id}
                      onClick={() => setSelectedTargetId(target.id)}
                      className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-[#FFF3EB] border-[#FF5A26]/50 shadow-xs ring-1 ring-[#FF5A26]/20'
                          : 'bg-white/70 hover:bg-white border-slate-200/70'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                            {target.shortName} • {target.cluster}
                          </span>
                          <h4 className="text-xs font-bold text-slate-900 mt-0.5 leading-snug">
                            {target.major}
                          </h4>
                          <p className="text-[11px] text-slate-500 font-medium">
                            {target.university}
                          </p>
                        </div>

                        <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border ${target.badgeColor}`}>
                          {target.competitiveness}
                        </span>
                      </div>

                      <div className="mt-2.5 pt-2 border-t border-slate-100/80 flex items-center justify-between text-[10px] text-slate-400">
                        <span>Estimasi Passing: <strong>{target.passingGradeEstimated}</strong></span>
                        <span>Kuota: <strong>{target.quota} Kursi</strong></span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right 2 Cols: Eligibility Probability & Detailed Roadmap */}
            <div className="lg:col-span-2 space-y-6">
              {/* Bento Card: Live Probability Analysis */}
              <div className="glass-card rounded-3xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
                <div className="space-y-2.5 max-w-lg">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full border ${
                        eligibility.status === 'Aman / Peluang Tinggi'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : eligibility.status === 'Kompetitif / Cukup Peluang'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-red-50 text-red-800 border-red-200'
                      }`}
                    >
                      {eligibility.status}
                    </span>
                    <span className="text-xs font-bold text-slate-400">Analisis Algoritma SNBP</span>
                  </div>

                  <h2 className="text-xl md:text-2xl font-black text-slate-900 leading-tight">
                    {selectedTarget.major} ({selectedTarget.shortName})
                  </h2>

                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {eligibility.recommendedAction}
                  </p>

                  <div className="pt-2 flex flex-wrap items-center gap-3 text-xs">
                    <div className="px-3 py-1.5 rounded-xl bg-slate-100 font-bold text-slate-700">
                      Rata-Rata Rapor Anda: <strong className="text-slate-950">{userAverage}</strong>
                    </div>
                    <div className="px-3 py-1.5 rounded-xl bg-orange-50 font-bold text-[#FF5A26]">
                      Target Passing Grade: <strong>{selectedTarget.passingGradeEstimated}</strong>
                    </div>
                    <div className="px-3 py-1.5 rounded-xl bg-emerald-50 font-bold text-emerald-700">
                      Selisih Gap: <strong>{eligibility.gapScore > 0 ? `+${eligibility.gapScore}` : eligibility.gapScore} Poin</strong>
                    </div>
                  </div>
                </div>

                {/* Big Circular Progress Gauge */}
                <div className="shrink-0 flex flex-col items-center justify-center p-4 rounded-3xl bg-white/80 border border-white/80 shadow-xs">
                  <CircularProgressBar
                    value={eligibility.probabilityPercent}
                    size={110}
                    strokeWidth={10}
                    color={
                      eligibility.probabilityPercent >= 75
                        ? '#10B981'
                        : eligibility.probabilityPercent >= 50
                        ? '#FF5A26'
                        : '#EF4444'
                    }
                    trackColor="#F1F5F9"
                  />
                  <p className="text-xs font-black text-slate-800 mt-2 text-center">
                    Peluang Lolos
                  </p>
                  <p className="text-[10px] text-slate-400 text-center font-medium">
                    Jalur Prestasi Rapor
                  </p>
                </div>
              </div>

              {/* Bento Card: Recommended Priority Study Modules */}
              <div className="glass-card rounded-3xl p-6 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[#FF5A26]" />
                    <span>Modul Penguat Mata Pelajaran Kunci untuk {selectedTarget.shortName}</span>
                  </h3>
                  <span className="text-xs font-bold text-[#FF5A26]">Rekomendasi Pintar</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div
                    onClick={() => onOpenCourse('crs-math-01')}
                    className="p-4 rounded-2xl bg-white/80 border border-slate-200/70 hover:border-orange-300 transition-all cursor-pointer group"
                  >
                    <span className="text-[10px] font-extrabold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
                      Mata Pelajaran Pendukung Utama
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 mt-1.5 group-hover:text-[#FF5A26] transition-colors">
                      Kalkulus Lanjut & Pemodelan Kurva Fungsi
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Dra. Siti Rahmawati, M.Pd • 40 Modul Terstruktur
                    </p>
                  </div>

                  <div
                    onClick={() => onOpenCourse('crs-web-01')}
                    className="p-4 rounded-2xl bg-white/80 border border-slate-200/70 hover:border-indigo-300 transition-all cursor-pointer group"
                  >
                    <span className="text-[10px] font-extrabold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                      Kompetensi Khusus Kejuruan
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 mt-1.5 group-hover:text-indigo-600 transition-colors">
                      Basic To Advance Web Development & UI/UX
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Scott Warden, S.Kom, M.T • Portofolio Digital
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: LEMBAR RAPOR DIGITAL RESMI & CETAK PDF */}
      {activeSubTab === 'rapor' && (
        <div className="space-y-6">
          {/* Action Bar */}
          <div className="glass-card rounded-3xl p-4 md:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">
                Pratinjau Rapor Hasil Belajar Siswa
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Dokumen resmi ber-QR Code dengan tanda tangan digital Kepala Sekolah & Wali Kelas.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrintReport}
                className="px-4 py-2.5 rounded-2xl bg-[#FF5A26] hover:bg-[#E84E1D] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer hover:scale-105"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak / Simpan Rapor PDF</span>
              </button>
            </div>
          </div>

          {/* Printable Official Report Card Document */}
          <div className="bg-white rounded-3xl p-6 md:p-10 border border-slate-200 shadow-lg text-slate-900 space-y-6 max-w-4xl mx-auto print:p-0 print:border-none print:shadow-none">
            {/* Kop Surat Resmi Sekolah */}
            <div className="text-center pb-4 border-b-2 border-slate-800 space-y-1">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Pemerintah Provinsi Daerah Khusus Ibukota Jakarta • Dinas Pendidikan
              </p>
              <h2 className="text-lg md:text-xl font-black tracking-tight text-slate-900 uppercase">
                SMA Negeri Nusantara Unggulan Jakarta
              </h2>
              <p className="text-xs text-slate-600">
                Jl. Pendidikan Karakter Bangsa No. 12, Jakarta Pusat • Telp: (021) 3948291 • Web: nusantaraedu.sch.id
              </p>
            </div>

            {/* Judul Dokumen & Identitas Siswa */}
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-sm font-extrabold uppercase tracking-wider underline">
                  Laporan Hasil Capaian Kompetensi Belajar Siswa
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Semester Ganjil • Tahun Ajaran 2026/2027</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Nama Siswa</span>
                  <strong className="text-slate-900">{currentUser.name}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Nomor Induk / NISN</span>
                  <strong className="text-slate-900">{currentUser.nis}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Kelas / Fase</span>
                  <strong className="text-slate-900">XII MIPA 1 (Fase F)</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Peringkat Kelas</span>
                  <strong className="text-slate-900">Juara {currentUser.classRank} dari 32 Siswa</strong>
                </div>
              </div>
            </div>

            {/* Tabel Nilai & Capaian Mata Pelajaran */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border border-slate-200">
                <thead className="bg-slate-100 text-slate-700 font-extrabold uppercase text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3 border-r border-slate-200">No</th>
                    <th className="py-2.5 px-3 border-r border-slate-200">Mata Pelajaran</th>
                    <th className="py-2.5 px-3 border-r border-slate-200 text-center">KKM</th>
                    <th className="py-2.5 px-3 border-r border-slate-200 text-center">Nilai Akhir</th>
                    <th className="py-2.5 px-3 border-r border-slate-200 text-center">Predikat</th>
                    <th className="py-2.5 px-3">Capaian Kompetensi & Deskripsi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {competencies.map((c, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="py-2.5 px-3 font-bold text-center border-r border-slate-200">{idx + 1}</td>
                      <td className="py-2.5 px-3 font-bold border-r border-slate-200">{c.subject}</td>
                      <td className="py-2.5 px-3 text-center border-r border-slate-200 tabular-nums">{c.kkm}</td>
                      <td className="py-2.5 px-3 text-center font-black text-[#FF5A26] border-r border-slate-200 tabular-nums">
                        {c.score}
                      </td>
                      <td className="py-2.5 px-3 text-center font-bold border-r border-slate-200">
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px]">
                          {c.grade}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-[11px] text-slate-600 leading-relaxed">
                        {c.predicate}. {c.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Rekap Absensi & Nilai Rata-Rata */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-1.5">
                <span className="text-[10px] font-extrabold uppercase text-slate-400">
                  Rekapitulasi Ketidakhadiran (Semester 1)
                </span>
                <div className="flex items-center justify-between text-slate-700">
                  <span>Hadir Efektif:</span>
                  <strong>92 Hari (98.4%)</strong>
                </div>
                <div className="flex items-center justify-between text-slate-700">
                  <span>Izin Resmi:</span>
                  <strong>2 Hari</strong>
                </div>
                <div className="flex items-center justify-between text-slate-700">
                  <span>Sakit:</span>
                  <strong>0 Hari</strong>
                </div>
                <div className="flex items-center justify-between text-slate-700">
                  <span>Tanpa Keterangan (Alpha):</span>
                  <strong className="text-emerald-700">0 Hari (Disiplin Terpuji)</strong>
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-1.5">
                <span className="text-[10px] font-extrabold uppercase text-slate-400">
                  Catatan Wali Kelas
                </span>
                <p className="text-slate-700 leading-relaxed italic text-[11px]">
                  "Ananda Ahmad menunjukkan dedikasi dan penalaran analitis yang sangat mengagumkan,
                  terutama di bidang Matematika Kalkulus dan Informatika. Pertahankan konsistensi untuk target masuk ITB/UI."
                </p>
              </div>
            </div>

            {/* Tanda Tangan & QR Code Verifikasi */}
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-center">
              <div className="flex items-center gap-3 text-left">
                <div className="w-16 h-16 p-1 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center">
                  <QrCode className="w-12 h-12 text-slate-800" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Verifikasi Digital</span>
                  <strong className="text-slate-800 text-[11px] block">KEMDIKBUD-RI 2026</strong>
                  <span className="text-[10px] text-emerald-600 font-semibold">Tersertifikasi Asli</span>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-slate-500">Jakarta, 11 November 2026</p>
                <p className="font-bold text-slate-900">Wali Kelas XII MIPA 1</p>
                <div className="h-10 flex items-center justify-center">
                  <span className="font-serif italic text-base text-slate-600">[Dra. Siti Rahmawati]</span>
                </div>
                <p className="text-[11px] text-slate-500 font-mono">NIP: 198204122005012004</p>
              </div>

              <div className="space-y-1">
                <p className="text-slate-500">Mengetahui,</p>
                <p className="font-bold text-slate-900">Kepala Sekolah SMA Nusantara</p>
                <div className="h-10 flex items-center justify-center">
                  <span className="font-serif italic text-base text-slate-600">[Dr. H. Bambang Susanto, M.Pd]</span>
                </div>
                <p className="text-[11px] text-slate-500 font-mono">NIP: 197405101999031002</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
