import React, { useState } from 'react';
import {
  CalendarCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  MapPin,
  Wifi,
  FileText,
  UserCheck,
  Download,
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  X,
  Search,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserProfile } from '../types/index.ts';

interface AttendanceViewProps {
  currentUser: UserProfile;
}

interface AttendanceRecord {
  id: string;
  date: string;
  day: string;
  timeIn: string;
  timeOut: string;
  status: 'hadir' | 'izin' | 'sakit' | 'alpa';
  location: string;
  notes?: string;
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({ currentUser }) => {
  const isTeacher = currentUser.role === 'guru';

  // Student Attendance State
  const [isCheckedInToday, setIsCheckedInToday] = useState(true);
  const [checkInTime, setCheckInTime] = useState('07:14 WIB');
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [permissionType, setPermissionType] = useState<'izin' | 'sakit'>('izin');
  const [permissionReason, setPermissionReason] = useState('');
  const [permissionSuccess, setPermissionSuccess] = useState(false);

  // Month navigation
  const [selectedMonth, setSelectedMonth] = useState('November 2026');

  // Student history records
  const [records, setRecords] = useState<AttendanceRecord[]>([
    {
      id: 'att-1',
      date: '04 Nov 2026',
      day: 'Rabu',
      timeIn: '07:14 WIB',
      timeOut: '15:30 WIB (Dijadwalkan)',
      status: 'hadir',
      location: 'Gedung A Lab Terpadu (GPS Verified)',
      notes: 'Presensi otomatis terverifikasi sistem biometrik & Wi-Fi sekolah.',
    },
    {
      id: 'att-2',
      date: '03 Nov 2026',
      day: 'Selasa',
      timeIn: '07:05 WIB',
      timeOut: '15:35 WIB',
      status: 'hadir',
      location: 'Kelas XII MIPA 1',
      notes: 'Tepat waktu.',
    },
    {
      id: 'att-3',
      date: '02 Nov 2026',
      day: 'Senin',
      timeIn: '06:58 WIB',
      timeOut: '15:40 WIB',
      status: 'hadir',
      location: 'Lapangan Upacara Bendera',
      notes: 'Upacara rutin hari Senin.',
    },
    {
      id: 'att-4',
      date: '31 Okt 2026',
      day: 'Jumat',
      timeIn: '07:10 WIB',
      timeOut: '11:45 WIB',
      status: 'hadir',
      location: 'Kelas XII MIPA 1',
      notes: 'Jadwal Jumat berkah.',
    },
    {
      id: 'att-5',
      date: '30 Okt 2026',
      day: 'Kamis',
      timeIn: '07:20 WIB',
      timeOut: '15:30 WIB',
      status: 'hadir',
      location: 'Kelas XII MIPA 1',
      notes: 'Hadir tepat waktu.',
    },
    {
      id: 'att-6',
      date: '29 Okt 2026',
      day: 'Rabu',
      timeIn: '-',
      timeOut: '-',
      status: 'izin',
      location: 'Dispensasi Sekolah',
      notes: 'Mewakili sekolah pada Olimpiade Sains Nasional (OSN) Matematika.',
    },
    {
      id: 'att-7',
      date: '28 Okt 2026',
      day: 'Selasa',
      timeIn: '07:08 WIB',
      timeOut: '15:30 WIB',
      status: 'hadir',
      location: 'Kelas XII MIPA 1',
      notes: 'Hadir teratur.',
    },
  ]);

  // Teacher Class Roster State
  const [classStudents, setClassStudents] = useState([
    { id: 'st-1', name: 'Ahmad Rizky Pratama', nis: '10214890', status: 'hadir', time: '07:14 WIB' },
    { id: 'st-2', name: 'Dimas Bagaskara', nis: '10214891', status: 'hadir', time: '07:02 WIB' },
    { id: 'st-3', name: 'Nabila Nurul Fadillah', nis: '10214892', status: 'hadir', time: '06:55 WIB' },
    { id: 'st-4', name: 'Muhammad Farhan', nis: '10214893', status: 'izin', time: 'Surat Izin Disetujui' },
    { id: 'st-5', name: 'Zahra Annisa Putri', nis: '10214894', status: 'hadir', time: '07:18 WIB' },
    { id: 'st-6', name: 'Bayu Arya Pratama', nis: '10214895', status: 'hadir', time: '07:11 WIB' },
    { id: 'st-7', name: 'Siti Sarah Rahmadani', nis: '10214896', status: 'hadir', time: '07:05 WIB' },
    { id: 'st-8', name: 'Kevin Jonathan', nis: '10214897', status: 'hadir', time: '07:09 WIB' },
  ]);
  const [classSearch, setClassSearch] = useState('');

  // Handle student check-in
  const handleCheckInNow = () => {
    setIsCheckedInToday(true);
    const nowTime = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';
    setCheckInTime(nowTime);

    const newRecord: AttendanceRecord = {
      id: `att-${Date.now()}`,
      date: 'Hari Ini (04 Nov 2026)',
      day: 'Rabu',
      timeIn: nowTime,
      timeOut: '15:30 WIB (Dijadwalkan)',
      status: 'hadir',
      location: 'SMA Nusantara (Geofence Verified)',
      notes: 'Presensi mandiri berhasil dicatat ke sistem pusat.',
    };

    setRecords((prev) => [newRecord, ...prev]);

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF5A26', '#10B981', '#38BDF8'],
      });
    } catch (e) {}
  };

  const handleSubmitPermission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!permissionReason.trim()) return;

    const newRecord: AttendanceRecord = {
      id: `att-p-${Date.now()}`,
      date: '05 Nov 2026 (Pengajuan)',
      day: 'Kamis',
      timeIn: '-',
      timeOut: '-',
      status: permissionType,
      location: 'Surat Keterangan Resmi',
      notes: `Alasan: ${permissionReason.trim()}`,
    };

    setRecords((prev) => [newRecord, ...prev]);
    setPermissionSuccess(true);
    setTimeout(() => {
      setPermissionSuccess(false);
      setShowPermissionModal(false);
      setPermissionReason('');
    }, 1800);
  };

  // Toggle single student status (Teacher role)
  const handleToggleStudentStatus = (id: string) => {
    setClassStudents((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        const nextStatus = s.status === 'hadir' ? 'izin' : s.status === 'izin' ? 'sakit' : 'hadir';
        return { ...s, status: nextStatus };
      })
    );
  };

  // Mark all students present (Teacher)
  const handleMarkAllPresent = () => {
    setClassStudents((prev) =>
      prev.map((s) => ({ ...s, status: 'hadir', time: '07:15 WIB' }))
    );
    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.5 },
        colors: ['#10B981', '#FF5A26'],
      });
    } catch (e) {}
  };

  const filteredClass = classStudents.filter((s) =>
    s.name.toLowerCase().includes(classSearch.toLowerCase()) || s.nis.includes(classSearch)
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* 1. Header Hero Card */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl bg-[#FFF3EB] text-[#FF5A26] flex items-center justify-center font-bold">
              <CalendarCheck className="w-5 h-5" />
            </span>
            <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
              Presensi & Absensi Sekolah Digital
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-2 max-w-xl leading-relaxed">
            Sistem pemantauan kehadiran otomatis berbasis verifikasi Wi-Fi Sekolah, geofencing lokasi,
            dan sinkronisasi raport berkala semester ganjil 2026/2027.
          </p>
        </div>

        {/* Quick Check-in CTA Button for Student */}
        {!isTeacher && (
          <div className="flex items-center gap-3 shrink-0">
            {isCheckedInToday ? (
              <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200/80 px-4 py-3 rounded-2xl">
                <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-extrabold text-emerald-900">Hadir Hari Ini</p>
                  <p className="text-[11px] font-mono text-emerald-700">Masuk: {checkInTime}</p>
                </div>
              </div>
            ) : (
              <button
                onClick={handleCheckInNow}
                className="px-5 py-3 rounded-2xl bg-[#FF5A26] hover:bg-[#E84E1D] text-white text-xs font-bold transition-all shadow-md flex items-center gap-2"
              >
                <Clock className="w-4 h-4" />
                <span>Check-in Hadir Sekarang</span>
              </button>
            )}

            <button
              onClick={() => setShowPermissionModal(true)}
              className="px-4 py-3 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors"
            >
              Ajukan Izin / Sakit
            </button>
          </div>
        )}

        {/* Teacher Action Controls */}
        {isTeacher && (
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleMarkAllPresent}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-xs flex items-center gap-1.5"
            >
              <UserCheck className="w-4 h-4" />
              <span>Tandai Hadir Semua</span>
            </button>
            <button
              onClick={() => alert('Laporan rekap presensi kelas XII MIPA 1 berhasil diunduh (Format XLSX/PDF)!')}
              className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Export Rekap</span>
            </button>
          </div>
        )}
      </div>

      {/* 2. Key Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-1">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Persentase Kehadiran</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl md:text-3xl font-extrabold text-[#FF5A26]">98.4%</span>
            <span className="text-xs font-bold text-emerald-600">+1.2% bulan lalu</span>
          </div>
          <p className="text-[11px] text-slate-500 pt-1">Target minimal kelulusan KKM: 85%</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-1">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Hari Hadir</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl md:text-3xl font-extrabold text-slate-900">92</span>
            <span className="text-xs text-slate-400">/ 94 hari sekolah</span>
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold pt-1">Status: Sangat Disiplin ⭐</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-1">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Izin & Dispensasi</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl md:text-3xl font-extrabold text-amber-500">2</span>
            <span className="text-xs text-slate-400">kali izin resmi</span>
          </div>
          <p className="text-[11px] text-slate-500 pt-1">Semua surat izin terverifikasi</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-1">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Alpha / Tanpa Keterangan</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl md:text-3xl font-extrabold text-emerald-600">0</span>
            <span className="text-xs text-slate-400">alpa</span>
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold pt-1">Catatan disiplin bersih</p>
        </div>
      </div>

      {/* 3. Detailed Views: Student History or Teacher Class Roster */}
      {!isTeacher ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Attendance History Log */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Riwayat Kehadiran Mandiri
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pencatatan sesi belajar langsung dari gerbang dan ruang kelas
                </p>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                <Calendar className="w-3.5 h-3.5 text-[#FF5A26]" />
                <span className="font-bold">{selectedMonth}</span>
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {records.map((rec) => {
                const isHadir = rec.status === 'hadir';
                const isIzin = rec.status === 'izin';

                return (
                  <div key={rec.id} className="py-3.5 flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                          isHadir
                            ? 'bg-emerald-50 text-emerald-600'
                            : isIzin
                            ? 'bg-amber-50 text-amber-600'
                            : 'bg-red-50 text-red-600'
                        }`}
                      >
                        {isHadir ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : (
                          <AlertCircle className="w-5 h-5" />
                        )}
                      </div>

                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-extrabold text-slate-900">
                            {rec.day}, {rec.date}
                          </span>
                          <span
                            className={`px-2 py-0.2 rounded-full text-[10px] font-extrabold capitalize ${
                              isHadir
                                ? 'bg-emerald-100 text-emerald-800'
                                : isIzin
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {rec.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 leading-snug">{rec.notes}</p>
                        <div className="flex items-center gap-3 text-[11px] text-slate-400 font-medium pt-1">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Masuk: {rec.timeIn}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {rec.location}
                          </span>
                        </div>
                      </div>
                    </div>

                    <span className="text-[11px] font-mono font-bold text-slate-500 shrink-0">
                      {isHadir ? 'Terverifikasi' : 'Disetujui'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right 1 Col: Subject-by-Subject Attendance breakdown */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-5">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Kehadiran per Mata Pelajaran
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Evaluasi presensi tatap muka & video conference
              </p>
            </div>

            <div className="space-y-4">
              {[
                { subject: 'Matematika Peminatan XII', percent: 100, attended: 18, total: 18, teacher: 'Bu Siti' },
                { subject: 'Fisika Gelombang & Optika', percent: 100, attended: 14, total: 14, teacher: 'Dr. Hendra' },
                { subject: 'Pemrograman Web & UI/UX', percent: 94, attended: 16, total: 17, teacher: 'Scott Warden' },
                { subject: 'Biologi Sel Molekuler', percent: 100, attended: 12, total: 12, teacher: 'Ibu Ratna' },
                { subject: 'Bahasa Indonesia Ilmiah', percent: 100, attended: 10, total: 10, teacher: 'Pak Joko' },
              ].map((sub, i) => (
                <div key={i} className="space-y-1.5 bg-slate-50/70 p-3.5 rounded-2xl border border-slate-100">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-extrabold text-slate-800">{sub.subject}</span>
                    <span className="font-extrabold text-[#FF5A26] font-mono">{sub.percent}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${sub.percent}%` }}
                      className="bg-[#FF5A26] h-full rounded-full transition-all duration-300"
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Pengampu: {sub.teacher}</span>
                    <span>{sub.attended}/{sub.total} Sesi</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-orange-50/60 p-4 rounded-2xl border border-orange-100 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#FF5A26] shrink-0 mt-0.5" />
              <div className="text-xs">
                <p className="font-bold text-slate-900">Ketentuan Kehadiran Ujian</p>
                <p className="text-slate-600 mt-0.5 leading-relaxed">
                  Siswa yang mencapai kehadiran di atas 90% berhak mengikuti Ujian Akhir Semester tanpa syarat tambahan.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Teacher Mode: Class XII Roster Attendance */
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Daftar Presensi Kelas XII MIPA 1 (32 Siswa)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Rabu, 04 November 2026 · Guru Pengampu: Dra. Siti Rahmawati, M.Pd
              </p>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Cari siswa atau NIS..."
                value={classSearch}
                onChange={(e) => setClassSearch(e.target.value)}
                className="pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:outline-none focus:border-[#FF5A26] w-64"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3">No</th>
                  <th className="p-3">Nama Siswa</th>
                  <th className="p-3">NIS</th>
                  <th className="p-3">Waktu Presensi</th>
                  <th className="p-3">Status Kehadiran</th>
                  <th className="p-3 text-right">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredClass.map((student, idx) => (
                  <tr key={student.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-3 text-slate-400 font-mono">{idx + 1}</td>
                    <td className="p-3 font-bold text-slate-900">{student.name}</td>
                    <td className="p-3 font-mono text-slate-500">{student.nis}</td>
                    <td className="p-3 font-mono text-slate-600">{student.time}</td>
                    <td className="p-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold capitalize inline-flex items-center gap-1 ${
                          student.status === 'hadir'
                            ? 'bg-emerald-100 text-emerald-800'
                            : student.status === 'izin'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {student.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleToggleStudentStatus(student.id)}
                        className="px-3 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-[11px] font-bold text-slate-700 transition-colors"
                      >
                        Ubah Status
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Permission Modal */}
      {showPermissionModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="text-base font-extrabold text-slate-900">
                Formulir Pengajuan Izin / Sakit
              </h4>
              <button
                onClick={() => setShowPermissionModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {permissionSuccess ? (
              <div className="p-6 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h5 className="font-extrabold text-slate-900">Pengajuan Berhasil Dikirim</h5>
                <p className="text-xs text-slate-500">
                  Wali kelas Anda akan memvalidasi surat ini dalam waktu 1x24 jam.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitPermission} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Jenis Keterangan:</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPermissionType('izin')}
                      className={`p-2.5 rounded-xl border font-bold text-center transition-all ${
                        permissionType === 'izin'
                          ? 'border-[#FF5A26] bg-[#FFF3EB] text-[#FF5A26]'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      Izin (Keperluan Resmi)
                    </button>
                    <button
                      type="button"
                      onClick={() => setPermissionType('sakit')}
                      className={`p-2.5 rounded-xl border font-bold text-center transition-all ${
                        permissionType === 'sakit'
                          ? 'border-[#FF5A26] bg-[#FFF3EB] text-[#FF5A26]'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      Sakit (Surat Dokter)
                    </button>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Alasan / Keterangan Lengkap:
                  </label>
                  <textarea
                    rows={3}
                    value={permissionReason}
                    onChange={(e) => setPermissionReason(e.target.value)}
                    placeholder="Contoh: Menghadiri lomba sains perwakilan sekolah / Istirahat karena demam..."
                    className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[#FF5A26]"
                    required
                  />
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-dashed border-slate-300 text-center text-slate-500">
                  <FileText className="w-5 h-5 mx-auto text-slate-400 mb-1" />
                  <span className="font-bold text-slate-700">Unggah Bukti Surat (Opsional)</span>
                  <p className="text-[10px] text-slate-400">PDF, JPG, atau PNG maksimal 5MB</p>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowPermissionModal(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#FF5A26] hover:bg-[#E84E1D] text-white font-bold transition-colors shadow-xs"
                  >
                    Kirim Permohonan
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
