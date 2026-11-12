import React, { useState } from 'react';
import {
  UserCheck,
  Calendar,
  Clock,
  Award,
  AlertCircle,
  FileText,
  Send,
  Download,
  MessageSquare,
  CheckCircle2,
  TrendingUp,
  CreditCard,
  Phone,
  ShieldCheck,
  ChevronRight,
  Upload,
  Video,
  Sparkles,
  X,
  Flame,
  CheckCircle,
} from 'lucide-react';
import { UserProfile, CompetencyScore, AttendanceRecord } from '../types/index.ts';
import { CircularProgressBar } from './CircularProgressBar.tsx';

interface ParentPortalViewProps {
  user: UserProfile;
  attendanceHistory: AttendanceRecord[];
  competencies: CompetencyScore[];
  onOpenChatWithTeacher?: () => void;
  onNavigateTab: (tab: string) => void;
}

export const ParentPortalView: React.FC<ParentPortalViewProps> = ({
  user,
  attendanceHistory,
  competencies,
  onOpenChatWithTeacher,
  onNavigateTab,
}) => {
  // State for digital excuse submission
  const [excuseType, setExcuseType] = useState<'Sakit' | 'Izin Keluarga' | 'Dispensasi Lomba'>('Sakit');
  const [excuseDate, setExcuseDate] = useState<string>('2026-11-05');
  const [excuseReason, setExcuseReason] = useState<string>('');
  const [excuseFileName, setExcuseFileName] = useState<string>('');
  const [submittedExcuses, setSubmittedExcuses] = useState<
    Array<{
      id: string;
      type: string;
      date: string;
      reason: string;
      fileName?: string;
      status: 'Disetujui Wali Kelas' | 'Menunggu Verifikasi';
      timestamp: string;
    }>
  >([
    {
      id: 'EXC-01',
      type: 'Sakit',
      date: '28 Oktober 2026',
      reason: 'Demam tinggi dan istirahat dokter selama 1 hari.',
      fileName: 'surat_dokter_klinik_sehat.pdf',
      status: 'Disetujui Wali Kelas',
      timestamp: '28 Okt 2026, 06:15 WIB',
    },
  ]);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Consultation booking modal state
  const [showConsultationModal, setShowConsultationModal] = useState(false);
  const [consultationMode, setConsultationMode] = useState<'Tatap Muka di Ruang BK' | 'Google Meet / Online'>('Tatap Muka di Ruang BK');
  const [consultationDate, setConsultationDate] = useState('Jumat, 06 Nov 2026 (14:00 WIB)');
  const [consultationTopic, setConsultationTopic] = useState('Konsultasi Minat Bakat Jurusan Kuliah PTN');
  const [consultationBookedToast, setConsultationBookedToast] = useState(false);

  const handleSubmitExcuse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!excuseReason.trim()) return;

    const newExcuse = {
      id: `EXC-0${submittedExcuses.length + 1}`,
      type: excuseType,
      date: excuseDate,
      reason: excuseReason,
      fileName: excuseFileName || 'surat_keterangan_wali.pdf',
      status: 'Disetujui Wali Kelas' as const,
      timestamp: 'Baru saja',
    };

    setSubmittedExcuses([newExcuse, ...submittedExcuses]);
    setExcuseReason('');
    setExcuseFileName('');
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 4000);
  };

  const handleBookConsultation = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConsultationModal(false);
    setConsultationBookedToast(true);
    setTimeout(() => setConsultationBookedToast(false), 5000);
  };

  const childName = user.childName || 'Ahmad Rizky Pratama';
  const childNis = user.childNis || '10214890';

  const presentDays = attendanceHistory.filter((a) => a.status === 'Hadir' || a.status === 'hadir').length;
  const attendanceRate = attendanceHistory.length > 0 ? Math.round((presentDays / attendanceHistory.length) * 100) : 98;

  const totalScores = competencies.reduce((acc, c) => acc + c.score, 0);
  const avgScore = competencies.length > 0 ? (totalScores / competencies.length).toFixed(1) : '92.4';

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Welcome Banner for Parent */}
      <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-10">
          <ShieldCheck className="w-64 h-64 text-white" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" /> Portal Khusus Pemantauan Orang Tua / Wali Murid
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Selamat Datang, {user.name}
            </h1>
            <p className="text-white/90 text-sm sm:text-base leading-relaxed">
              Memantau perkembangan akademis & keaktifan belajar putra/putri Anda: <strong className="text-white underline decoration-amber-300 decoration-2">{childName}</strong> (NIS: {childNis} - Kelas XII MIPA 1).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowConsultationModal(true)}
              className="px-4 py-2.5 bg-white text-orange-600 hover:bg-orange-50 font-semibold rounded-2xl shadow-sm transition flex items-center gap-2 text-sm"
            >
              <Calendar className="w-4 h-4 text-orange-500" />
              Jadwalkan Konsultasi Guru
            </button>
            <button
              onClick={onOpenChatWithTeacher}
              className="px-4 py-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-semibold rounded-2xl transition flex items-center gap-2 text-sm"
            >
              <MessageSquare className="w-4 h-4" />
              Chat Langsung Wali Kelas
            </button>
          </div>
        </div>
      </div>

      {/* Success Toasts */}
      {showSuccessToast && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl flex items-center gap-3 shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div className="text-sm font-medium">
            Surat izin digital berhasil dikirimkan ke Dra. Siti Rahmawati, M.Pd (Wali Kelas XII MIPA 1). Status presensi ananda akan diperbarui otomatis.
          </div>
        </div>
      )}

      {consultationBookedToast && (
        <div className="bg-blue-50 border border-blue-200 text-blue-900 p-4 rounded-2xl flex items-center gap-3 shadow-sm">
          <Calendar className="w-5 h-5 text-blue-600 shrink-0" />
          <div className="text-sm font-medium">
            Jadwal konsultasi berhasil dipesan: <strong>{consultationDate}</strong> ({consultationMode}). Notifikasi konfirmasi dan link meeting telah dikirimkan ke WhatsApp Anda.
          </div>
        </div>
      )}

      {/* Quick KPI Overview (Modern Bento Style with Circular Progress) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Kehadiran Siswa */}
        <div className="glass-card glass-card-hover p-5 rounded-3xl flex items-center justify-between relative overflow-hidden">
          <div className="space-y-1">
            <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100/70 text-emerald-700 border border-emerald-200/50">
              Presensi Siswa
            </span>
            <div className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight pt-1">
              {attendanceRate}%
            </div>
            <p className="text-[11px] text-slate-500 font-medium">Tingkat Kehadiran Semester Ini</p>
            <p className="text-[11px] text-emerald-600 font-bold flex items-center gap-1 pt-1">
              <Clock className="w-3.5 h-3.5" /> Masuk 06:42 WIB (Tepat Waktu)
            </p>
          </div>

          <CircularProgressBar
            value={attendanceRate}
            size={58}
            strokeWidth={5}
            color="#10B981"
            trackColor="#D1FAE5"
          />
        </div>

        {/* Card 2: Rata-Rata Nilai GPA */}
        <div className="glass-card glass-card-hover p-5 rounded-3xl flex items-center justify-between relative overflow-hidden">
          <div className="space-y-1">
            <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-orange-100/70 text-[#FF5A26] border border-orange-200/50">
              Predikat A
            </span>
            <div className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight pt-1">
              {avgScore} <span className="text-sm font-semibold text-slate-400">/ 100</span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">Rata-rata Nilai Akademik (GPA)</p>
            <p className="text-[11px] text-[#FF5A26] font-bold flex items-center gap-1 pt-1">
              <TrendingUp className="w-3.5 h-3.5" /> Peringkat 2 dari 32 Siswa
            </p>
          </div>

          <CircularProgressBar
            value={parseFloat(avgScore) || 89}
            size={58}
            strokeWidth={5}
            color="#FF5A26"
            trackColor="#FFE6D9"
          />
        </div>

        {/* Card 3: Poin Keaktifan Belajar */}
        <div className="glass-card glass-card-hover p-5 rounded-3xl flex items-center justify-between relative overflow-hidden">
          <div className="space-y-1">
            <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-100/70 text-blue-700 border border-blue-200/50">
              Streak 54 Hari
            </span>
            <div className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight pt-1">
              876 <span className="text-sm font-semibold text-slate-400">XP</span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">Poin Keaktifan Mandiri</p>
            <p className="text-[11px] text-blue-600 font-bold flex items-center gap-1 pt-1">
              <Award className="w-3.5 h-3.5" /> Level 9: Master Eksplorer
            </p>
          </div>

          <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200/60 flex items-center justify-center text-blue-600">
            <Award className="w-7 h-7" />
          </div>
        </div>

        {/* Card 4: Administrasi SPP */}
        <div className="glass-card glass-card-hover p-5 rounded-3xl flex items-center justify-between relative overflow-hidden">
          <div className="space-y-1">
            <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100/70 text-emerald-700 border border-emerald-200/50">
              Lunas Terverifikasi
            </span>
            <div className="text-xl md:text-2xl font-black text-slate-900 tracking-tight pt-1">
              Semester Ganjil
            </div>
            <p className="text-[11px] text-slate-500 font-medium">Administrasi & SPP Sekolah</p>
            <p className="text-[11px] text-emerald-600 font-bold flex items-center gap-1 pt-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Periode Aktif 2026/2027
            </p>
          </div>

          <div className="w-14 h-14 rounded-2xl bg-purple-50 border border-purple-200/60 flex items-center justify-center text-purple-600">
            <CreditCard className="w-7 h-7" />
          </div>
        </div>
      </div>

      {/* Main Grid: Monitoring, Academic Grades & Excuse Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Progress, Activity, and Grades */}
        <div className="lg:col-span-2 space-y-6">
          {/* Keaktifan Belajar Anak (Weekly Watch Time & Module Progress) */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
                  Keaktifan Belajar Mandiri Ananda (Minggu Ini)
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Waktu tonton video materi, kuis harian, dan eksperimen lab sains
                </p>
              </div>
              <span className="text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
                4.4 Jam Minggu Ini
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400">Modul Selesai</span>
                <div className="text-lg font-extrabold text-slate-900 mt-0.5">17 / 40 Modul</div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-orange-500 h-full w-[42.5%]"></div>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400">Akurasi Kuis</span>
                <div className="text-lg font-extrabold text-emerald-600 mt-0.5">94% Benar</div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[94%]"></div>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400">Daily Streak</span>
                <div className="text-lg font-extrabold text-blue-600 mt-0.5">54 Hari Rutin</div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-blue-500 h-full w-[80%]"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Academic Grade Breakdown */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-orange-500" />
                  Rapor Nilai Mata Pelajaran Utama
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Berdasarkan penilaian formatif harian, kuis terintegrasi, dan tugas Kurikulum Merdeka
                </p>
              </div>
              <button
                onClick={() => onNavigateTab('skill-graph')}
                className="text-xs font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1"
              >
                Grafik Radar Lengkap <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {competencies.map((comp, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl border border-gray-100 bg-gray-50/60 flex items-center justify-between hover:bg-gray-50 transition"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-900">{comp.subject}</span>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        comp.grade === 'A' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        Predikat {comp.grade}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">{comp.predicate} • KKM: {comp.kkm}</p>
                  </div>

                  <div className="text-right">
                    <div className="text-lg font-extrabold text-gray-900">{comp.score}</div>
                    <div className="text-[10px] text-emerald-600 font-semibold">Tuntas +{comp.score - comp.kkm} Poin</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Homeroom Teacher Feedback Note */}
            <div className="mt-5 p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="text-xs font-bold text-amber-900">
                  Catatan Evaluasi Wali Kelas (Dra. Siti Rahmawati, M.Pd):
                </div>
                <p className="text-xs text-amber-800 leading-relaxed">
                  "Ananda Ahmad Rizky Pratama menunjukkan fokus yang sangat istimewa pada bidang eksakta dan kalkulus. Sikap mandiri dan kepemimpinan di kelas sangat positif. Tetap jaga ritme belajar dan istirahat agar kondisi fisik selalu bugar."
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Consultation Booking, Digital Excuse Form & Tuition */}
        <div className="space-y-6">
          {/* Direct Homeroom Teacher Card */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-orange-500" /> Wali Kelas XII MIPA 1
            </h3>

            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80"
                alt="Wali Kelas"
                className="w-12 h-12 rounded-xl object-cover ring-2 ring-orange-200"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-slate-900 truncate">Dra. Siti Rahmawati, M.Pd</h4>
                <p className="text-[10px] text-slate-500">Guru Matematika & Wali Kelas</p>
                <span className="inline-block text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full mt-1">
                  Aktif Menerima Konsultasi
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => setShowConsultationModal(true)}
                className="py-2.5 px-3 bg-[#FF5A26] hover:bg-[#E84E1D] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Pesan Sesi</span>
              </button>
              <button
                onClick={onOpenChatWithTeacher}
                className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition"
              >
                <MessageSquare className="w-3.5 h-3.5 text-orange-500" />
                <span>Kirim Pesan</span>
              </button>
            </div>
          </div>

          {/* Digital Permission Form */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2 mb-2">
              <FileText className="w-5 h-5 text-orange-500" />
              Surat Izin Digital Siswa
            </h2>
            <p className="text-xs text-gray-500 mb-4">
              Kirimkan surat dispensasi atau permohonan izin anak langsung ke sistem absensi sekolah.
            </p>

            <form onSubmit={handleSubmitExcuse} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Jenis Ketidakhadiran
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Sakit', 'Izin Keluarga', 'Dispensasi Lomba'] as const).map((type) => (
                    <button
                      type="button"
                      key={type}
                      onClick={() => setExcuseType(type)}
                      className={`text-xs font-medium py-2 px-1 rounded-xl border text-center transition ${
                        excuseType === type
                          ? 'border-orange-500 bg-orange-50 text-orange-600 font-semibold'
                          : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Tanggal Izin
                </label>
                <input
                  type="date"
                  value={excuseDate}
                  onChange={(e) => setExcuseDate(e.target.value)}
                  className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Alasan / Keterangan Orang Tua
                </label>
                <textarea
                  rows={3}
                  value={excuseReason}
                  onChange={(e) => setExcuseReason(e.target.value)}
                  placeholder="Contoh: Mohon izin ananda Ahmad istirahat karena demam dan pemeriksaan dokter..."
                  className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Lampiran Surat Dokter / Bukti (Opsional)
                </label>
                <div className="border border-dashed border-gray-300 rounded-xl p-3 text-center bg-gray-50 hover:bg-gray-100 transition cursor-pointer">
                  <Upload className="w-4 h-4 mx-auto text-gray-400 mb-1" />
                  <span className="text-[11px] text-gray-600 font-medium">
                    {excuseFileName ? excuseFileName : 'Unggah Surat Dokter / Bukti Izin (PDF/JPG)'}
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    id="excuse-file-upload"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setExcuseFileName(e.target.files[0].name);
                      }
                    }}
                  />
                  <label htmlFor="excuse-file-upload" className="block text-[10px] text-orange-500 font-semibold mt-1 cursor-pointer">
                    Pilih Berkas dari Perangkat
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xs rounded-xl shadow-sm transition flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                Kirim Permohonan Izin ke Guru
              </button>
            </form>

            {/* Previous Excuses List */}
            <div className="mt-5 pt-4 border-t border-gray-100 space-y-2.5">
              <div className="text-xs font-bold text-gray-900">Riwayat Pengajuan Surat Izin:</div>
              {submittedExcuses.map((exc) => (
                <div key={exc.id} className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-900">{exc.type} - {exc.date}</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">
                      {exc.status}
                    </span>
                  </div>
                  <p className="text-gray-500 text-[11px] line-clamp-1">{exc.reason}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tuition & SPP Card */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-orange-500" />
              Status Biaya Pendidikan (SPP)
            </h2>

            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white space-y-2 shadow-sm">
              <div className="flex items-center justify-between text-xs text-emerald-100">
                <span>Tahun Ajaran 2026/2027</span>
                <span className="bg-white/20 px-2 py-0.5 rounded-md font-semibold">LUNAS</span>
              </div>
              <div className="text-xl font-bold">Bulan November 2026</div>
              <div className="text-xs text-white/90">Rp 450.000 (Telah Dibayar via Virtual Account Mandiri)</div>
            </div>

            <button
              onClick={() => {
                alert('Bukti Kwitansi SPP Resmi November 2026 (No: KWT-2026-11-890) berhasil diunduh ke perangkat.');
              }}
              className="w-full py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-2"
            >
              <Download className="w-3.5 h-3.5 text-gray-500" />
              Unduh Kwitansi Pembayaran Resmi
            </button>
          </div>
        </div>
      </div>

      {/* Modal: Book Consultation Session with Wali Kelas */}
      {showConsultationModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-100 p-6 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#FF5A26]" /> Jadwalkan Konsultasi Wali Kelas
              </h3>
              <button
                onClick={() => setShowConsultationModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleBookConsultation} className="py-4 space-y-4 text-xs text-slate-700">
              <div>
                <label className="font-bold block mb-1">Pilih Mode Pertemuan:</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['Tatap Muka di Ruang BK', 'Google Meet / Online'] as const).map((mode) => (
                    <button
                      type="button"
                      key={mode}
                      onClick={() => setConsultationMode(mode)}
                      className={`p-2.5 rounded-xl border text-center font-bold transition text-xs ${
                        consultationMode === mode
                          ? 'border-[#FF5A26] bg-orange-50 text-[#FF5A26]'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1">Pilihan Waktu Tersedia:</label>
                <select
                  value={consultationDate}
                  onChange={(e) => setConsultationDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs"
                >
                  <option value="Jumat, 06 Nov 2026 (14:00 WIB)">Jumat, 06 Nov 2026 (14:00 WIB)</option>
                  <option value="Senin, 09 Nov 2026 (15:00 WIB)">Senin, 09 Nov 2026 (15:00 WIB)</option>
                  <option value="Rabu, 11 Nov 2026 (14:30 WIB)">Rabu, 11 Nov 2026 (14:30 WIB)</option>
                </select>
              </div>

              <div>
                <label className="font-bold block mb-1">Topik Utama Konsultasi:</label>
                <input
                  type="text"
                  value={consultationTopic}
                  onChange={(e) => setConsultationTopic(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowConsultationModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#FF5A26] hover:bg-[#E84E1D] text-white font-bold text-xs shadow-sm"
                >
                  Konfirmasi Jadwal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
