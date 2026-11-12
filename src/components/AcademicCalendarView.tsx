import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  BookOpen,
  User,
  MapPin,
  Bell,
  Plus,
  AlertTriangle,
  CheckCircle2,
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  Download,
  Filter,
  Sparkles,
  X,
} from 'lucide-react';
import { Assignment, UserProfile } from '../types/index.ts';
import { getSmartDeadlines } from '../utils/learningLogic.ts';

interface AcademicCalendarViewProps {
  assignments: Assignment[];
  currentUser: UserProfile;
  onNavigateToAssignment?: (id: string) => void;
}

export const AcademicCalendarView: React.FC<AcademicCalendarViewProps> = ({
  assignments,
  currentUser,
  onNavigateToAssignment,
}) => {
  const [viewMode, setViewMode] = useState<'schedule' | 'calendar' | 'reminders'>('schedule');
  const [selectedDay, setSelectedDay] = useState<'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat'>('Rabu');
  const [showAddReminderModal, setShowAddReminderModal] = useState(false);
  const [reminderTitle, setReminderTitle] = useState('');
  const [reminderDate, setReminderDate] = useState('06 Nov 2026, 14:00 WIB');
  const [reminderCategory, setReminderCategory] = useState('Ujian & Kuis');
  const [customReminders, setCustomReminders] = useState([
    {
      id: 'rem-1',
      title: 'Kuis Harian 2: Integral Tertentu & Garis Singgung',
      subject: 'Matematika Peminatan XII',
      time: 'Kamis, 05 Nov 2026 · 08:00 WIB',
      priority: 'Mendesak' as const,
      category: 'Kuis',
    },
    {
      id: 'rem-2',
      title: 'Batas Pengumpulan Resume Praktikum Pembiasan Snellius',
      subject: 'Fisika Optika Terapan',
      time: 'Jumat, 06 Nov 2026 · 23:59 WIB',
      priority: 'Mendekati' as const,
      category: 'Tugas',
    },
    {
      id: 'rem-3',
      title: 'Simulasi Tryout UTBK Saintek Gelombang 1',
      subject: 'Persiapan Masuk PTN 2027',
      time: 'Sabtu, 07 Nov 2026 · 07:30 WIB',
      priority: 'Terjadwal' as const,
      category: 'Simulasi',
    },
  ]);

  const smartDeadlines = getSmartDeadlines(assignments);

  // Daily Timetable Data for Class XII MIPA 1
  const weeklyTimetable = {
    Senin: [
      { time: '06:45 - 07:30', subject: 'Upacara Bendera Rutin', teacher: 'Pembina Upacara', room: 'Lapangan Utama', type: 'Kegiatan' },
      { time: '07:30 - 09:30', subject: 'Matematika Peminatan (Kalkulus)', teacher: 'Dra. Siti Rahmawati, M.Pd', room: 'R. XII MIPA 1', type: 'Materi Inti' },
      { time: '09:45 - 11:45', subject: 'Fisika Gelombang & Optika', teacher: 'Dr. Bambang Hermanto', room: 'Lab Fisika Terpadu', type: 'Praktikum' },
      { time: '12:30 - 14:30', subject: 'Bahasa Indonesia & Literasi Ilmiah', teacher: 'Drs. Hendro Wibowo', room: 'R. XII MIPA 1', type: 'Materi Inti' },
    ],
    Selasa: [
      { time: '07:15 - 09:15', subject: 'Kimia Organik & Makromolekul', teacher: 'Nurul Hidayati, S.Pd', room: 'Lab Kimia Barat', type: 'Praktikum' },
      { time: '09:30 - 11:30', subject: 'Biologi Genetika & DNA', teacher: 'Dra. Endang Sri Mulyani', room: 'Lab Biologi', type: 'Praktikum' },
      { time: '12:30 - 14:30', subject: 'Pendidikan Agama & Budi Pekerti', teacher: 'Ust. Ahmad Fauzan, M.A', room: 'Masjid Sekolah / R. Audio', type: 'Materi' },
    ],
    Rabu: [
      { time: '07:15 - 09:15', subject: 'Matematika Lanjut & Persamaan Diferensial', teacher: 'Dra. Siti Rahmawati, M.Pd', room: 'R. Multimedia 2', type: 'Materi Inti' },
      { time: '09:30 - 11:30', subject: 'Informatika & Pemrograman Web Modern', teacher: 'Scott Warden, S.Kom, M.T', room: 'Lab Komputer Gedung C', type: 'Koding' },
      { time: '12:30 - 14:00', subject: 'Bahasa Inggris Akademik & TOEFL Prep', teacher: 'Sarah Jenkins, B.Ed', room: 'R. Bahasa', type: 'Materi Inti' },
      { time: '14:00 - 15:30', subject: 'Konsultasi Belajar & Bimbingan Minat PTN', teacher: 'Wali Kelas & Guru BK', room: 'Ruang Konseling', type: 'Konseling' },
    ],
    Kamis: [
      { time: '07:15 - 09:15', subject: 'Fisika Kuantum & Relativitas Khusus', teacher: 'Dr. Bambang Hermanto', room: 'R. XII MIPA 1', type: 'Materi Inti' },
      { time: '09:30 - 11:30', subject: 'Pendidikan Jasmani & Olahraga Kebugaran', teacher: 'Eko Prasetyo, S.Pd', room: 'GOR Indoor Olahraga', type: 'Praktik' },
      { time: '12:30 - 14:30', subject: 'Sejarah Nasional & Wawasan Kebangsaan', teacher: 'Dra. Retno Wulandari', room: 'R. XII MIPA 1', type: 'Materi' },
    ],
    Jumat: [
      { time: '06:45 - 07:30', subject: 'Jumat Bersih & Doa Bersama', teacher: 'Wali Kelas', room: 'Kelas Masing-masing', type: 'Kegiatan' },
      { time: '07:30 - 09:30', subject: 'Kuis & Evaluasi Sumatif Mingguan', teacher: 'Guru Mata Pelajaran', room: 'Portal E-Learning', type: 'Evaluasi' },
      { time: '09:45 - 11:15', subject: 'Proyek Penguatan Profil Pelajar Pancasila', teacher: 'Koordinator P5', room: 'Aula Gedung Kreatif', type: 'Proyek' },
    ],
  };

  const handleAddReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reminderTitle.trim()) return;

    setCustomReminders([
      {
        id: `rem-${Date.now()}`,
        title: reminderTitle.trim(),
        subject: 'Agenda Siswa Mandiri',
        time: reminderDate,
        priority: 'Mendekati',
        category: reminderCategory,
      },
      ...customReminders,
    ]);
    setShowAddReminderModal(false);
    setReminderTitle('');
  };

  const handleExportICS = () => {
    const icsContent = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//NusantaraEdu LMS//Schedule//ID\nSUMMARY:Jadwal Pelajaran Kelas XII MIPA 1 SMAN 1 Nusantara\nEND:VCALENDAR`;
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'jadwal_nusantara_edu.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner & Mode Switcher */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-[#FF5A26]" />
            Kalender Akademik & Pengingat Pintar
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Jadwal kelas harian terintegrasi, agenda ujian nasional, dan pengingat tenggat waktu otomatis.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportICS}
            className="px-3.5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 flex items-center gap-1.5 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Unduh iCal/Jadwal</span>
          </button>

          <button
            onClick={() => setShowAddReminderModal(true)}
            className="px-4 py-2 bg-[#FF5A26] hover:bg-[#E84E1D] text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Pengingat</span>
          </button>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('schedule')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                viewMode === 'schedule'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Jadwal Kelas
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                viewMode === 'calendar'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Agenda Bulanan
            </button>
            <button
              onClick={() => setViewMode('reminders')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                viewMode === 'reminders'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pengingat Pintar ({smartDeadlines.length + customReminders.length})
            </button>
          </div>
        </div>
      </div>

      {/* Main Viewport */}
      {viewMode === 'schedule' && (
        <div className="space-y-6">
          {/* Day of week pill selector */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {(['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'] as const).map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
                  selectedDay === day
                    ? 'bg-[#FF5A26] text-white shadow-sm'
                    : 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-200/80'
                }`}
              >
                <CalendarCheck className="w-4 h-4" />
                <span>Hari {day}</span>
                {day === 'Rabu' && (
                  <span className="text-[9px] bg-white text-[#FF5A26] px-1.5 py-0.5 rounded-full font-extrabold uppercase">
                    Hari Ini
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Timetable List for Selected Day */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Jadwal Tatap Muka & Daring: {selectedDay}
                </h3>
                <p className="text-xs text-slate-500">Kelas XII MIPA 1 (Tahun Pelajaran 2026/2027)</p>
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                {weeklyTimetable[selectedDay].length} Sesi Terjadwal
              </span>
            </div>

            <div className="space-y-3">
              {weeklyTimetable[selectedDay].map((session, index) => (
                <div
                  key={index}
                  className="p-4 rounded-2xl bg-slate-50/70 hover:bg-orange-50/40 border border-slate-100 hover:border-orange-200 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#FFF3EB] text-[#FF5A26] flex flex-col items-center justify-center shrink-0 font-bold text-xs shadow-2xs">
                      <Clock className="w-4 h-4 mb-0.5" />
                      <span className="text-[10px] leading-none">SESI {index + 1}</span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-extrabold text-slate-900">{session.subject}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-md font-bold bg-slate-200 text-slate-700">
                          {session.type}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                        <span className="flex items-center gap-1 font-medium">
                          <User className="w-3.5 h-3.5 text-slate-400" /> {session.teacher}
                        </span>
                        <span className="flex items-center gap-1 font-medium text-slate-600">
                          <MapPin className="w-3.5 h-3.5 text-orange-500" /> {session.room}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                    <div className="text-right">
                      <div className="text-xs font-mono font-bold text-slate-800">{session.time}</div>
                      <div className="text-[10px] text-emerald-600 font-semibold">Tatap Muka Aktif</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* View Mode: Calendar Matrix */}
      {viewMode === 'calendar' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-slate-900">November 2026</h3>
              <div className="flex items-center gap-1">
                <button className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 7 Columns Days Header */}
            <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs text-slate-400 py-1">
              <div>MIN</div>
              <div>SEN</div>
              <div>SEL</div>
              <div>RAB</div>
              <div>KAM</div>
              <div>JUM</div>
              <div>SAB</div>
            </div>

            {/* Calendar Days Cells */}
            <div className="grid grid-cols-7 gap-1 text-xs">
              {/* Previous month empty days */}
              <div className="h-16 p-1 rounded-xl bg-slate-50/40 text-slate-300">26</div>
              <div className="h-16 p-1 rounded-xl bg-slate-50/40 text-slate-300">27</div>
              <div className="h-16 p-1 rounded-xl bg-slate-50/40 text-slate-300">28</div>
              <div className="h-16 p-1 rounded-xl bg-slate-50/40 text-slate-300">29</div>
              <div className="h-16 p-1 rounded-xl bg-slate-50/40 text-slate-300">30</div>
              <div className="h-16 p-1 rounded-xl bg-slate-50/40 text-slate-300">31</div>
              <div className="h-16 p-1 rounded-xl border border-slate-100 font-bold text-slate-700">1</div>

              {/* Week 2 */}
              <div className="h-16 p-1 rounded-xl border border-slate-100 font-bold text-slate-700">2</div>
              <div className="h-16 p-1 rounded-xl border border-slate-100 font-bold text-slate-700">3</div>
              <div className="h-16 p-1 rounded-xl border-2 border-[#FF5A26] bg-orange-50/50 font-bold text-[#FF5A26] relative">
                4 <span className="block text-[9px] font-bold text-orange-600">Hari Ini</span>
              </div>
              <div className="h-16 p-1 rounded-xl border border-slate-100 font-bold text-slate-700">
                5 <span className="block text-[8px] bg-red-100 text-red-700 rounded px-1 mt-0.5">Kuis</span>
              </div>
              <div className="h-16 p-1 rounded-xl border border-slate-100 font-bold text-slate-700">
                6 <span className="block text-[8px] bg-blue-100 text-blue-700 rounded px-1 mt-0.5">Tugas</span>
              </div>
              <div className="h-16 p-1 rounded-xl border border-slate-100 font-bold text-slate-700">
                7 <span className="block text-[8px] bg-purple-100 text-purple-700 rounded px-1 mt-0.5">Tryout</span>
              </div>
              <div className="h-16 p-1 rounded-xl border border-slate-100 font-bold text-slate-700">8</div>

              {/* Week 3 */}
              <div className="h-16 p-1 rounded-xl border border-slate-100 font-bold text-slate-700">9</div>
              <div className="h-16 p-1 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800 font-bold">
                10 <span className="block text-[8px] font-semibold">Hari Pahlawan</span>
              </div>
              <div className="h-16 p-1 rounded-xl border border-slate-100 font-bold text-slate-700">11</div>
              <div className="h-16 p-1 rounded-xl border border-slate-100 font-bold text-slate-700">12</div>
              <div className="h-16 p-1 rounded-xl border border-slate-100 font-bold text-slate-700">13</div>
              <div className="h-16 p-1 rounded-xl border border-slate-100 font-bold text-slate-700">
                14 <span className="block text-[8px] bg-orange-100 text-orange-700 rounded px-1 mt-0.5">Kalkulus</span>
              </div>
              <div className="h-16 p-1 rounded-xl border border-slate-100 font-bold text-slate-700">15</div>

              {/* Week 4 & 5 */}
              <div className="h-16 p-1 rounded-xl border border-slate-100 font-bold text-slate-700">16</div>
              <div className="h-16 p-1 rounded-xl border border-slate-100 font-bold text-slate-700">17</div>
              <div className="h-16 p-1 rounded-xl border border-slate-100 font-bold text-slate-700">18</div>
              <div className="h-16 p-1 rounded-xl border border-slate-100 font-bold text-slate-700">19</div>
              <div className="h-16 p-1 rounded-xl border border-slate-100 font-bold text-slate-700">20</div>
              <div className="h-16 p-1 rounded-xl border border-slate-100 font-bold text-slate-700">21</div>
              <div className="h-16 p-1 rounded-xl border border-slate-100 font-bold text-slate-700">22</div>
            </div>
          </div>

          {/* Agenda Event Sidebar */}
          <div className="space-y-4">
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-4">
              <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Bell className="w-4 h-4 text-orange-500" /> Agenda Penting Bulan Ini
              </h4>

              <div className="space-y-3">
                <div className="p-3 bg-red-50 rounded-2xl border border-red-100 text-xs">
                  <div className="flex justify-between items-center text-red-900 font-bold">
                    <span>Kuis Harian 2 Kalkulus</span>
                    <span className="text-[10px] bg-red-200 px-1.5 py-0.5 rounded">05 Nov</span>
                  </div>
                  <p className="text-[11px] text-red-700 mt-1">Wajib diikuti di kelas melalui aplikasi e-learning.</p>
                </div>

                <div className="p-3 bg-blue-50 rounded-2xl border border-blue-100 text-xs">
                  <div className="flex justify-between items-center text-blue-900 font-bold">
                    <span>Batas Laporan Fisika Optika</span>
                    <span className="text-[10px] bg-blue-200 px-1.5 py-0.5 rounded">06 Nov</span>
                  </div>
                  <p className="text-[11px] text-blue-700 mt-1">Unggah berkas PDF grafik sudut deviasi.</p>
                </div>

                <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100 text-xs">
                  <div className="flex justify-between items-center text-emerald-900 font-bold">
                    <span>Hari Pahlawan Nasional</span>
                    <span className="text-[10px] bg-emerald-200 px-1.5 py-0.5 rounded">10 Nov</span>
                  </div>
                  <p className="text-[11px] text-emerald-700 mt-1">Upacara bendera & kegiatan pameran seni siswa.</p>
                </div>

                <div className="p-3 bg-purple-50 rounded-2xl border border-purple-100 text-xs">
                  <div className="flex justify-between items-center text-purple-900 font-bold">
                    <span>Pertemuan Wali Murid Semester 1</span>
                    <span className="text-[10px] bg-purple-200 px-1.5 py-0.5 rounded">28 Nov</span>
                  </div>
                  <p className="text-[11px] text-purple-700 mt-1">Evaluasi capaian tengah semester & konsultasi karir.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Mode: Smart Reminders Widget */}
      {viewMode === 'reminders' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#FF5A26]" /> Pengingat Tenggat Tugas & Ujian Aktif
              </h3>
              <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full">
                Otomatis Tersinkron
              </span>
            </div>

            <div className="space-y-3">
              {/* Smart deadlines from assignments */}
              {smartDeadlines.map((task) => (
                <div
                  key={task.id}
                  className="p-4 rounded-2xl border border-orange-100 bg-orange-50/40 flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                        {task.priority}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">{task.subject}</span>
                    </div>
                    <h4 className="text-sm font-extrabold text-slate-900">{task.title}</h4>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-orange-500" /> Batas Pengumpulan: {task.dueDate}
                    </p>
                  </div>

                  {onNavigateToAssignment && (
                    <button
                      onClick={() => onNavigateToAssignment(task.id)}
                      className="px-3.5 py-2 bg-white hover:bg-orange-500 hover:text-white border border-orange-200 text-[#FF5A26] rounded-xl text-xs font-bold transition shrink-0 shadow-2xs"
                    >
                      Buka Tugas
                    </button>
                  )}
                </div>
              ))}

              {/* Custom reminders */}
              {customReminders.map((rem) => (
                <div
                  key={rem.id}
                  className="p-4 rounded-2xl border border-slate-100 bg-slate-50/70 flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                        {rem.category}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">{rem.subject}</span>
                    </div>
                    <h4 className="text-sm font-extrabold text-slate-900">{rem.title}</h4>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" /> Jadwal: {rem.time}
                    </p>
                  </div>

                  <span className="text-xs font-bold text-slate-400">Aktif</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick tips & add reminder widget */}
          <div className="space-y-4">
            <div className="p-6 bg-gradient-to-br from-orange-500 to-amber-600 text-white rounded-3xl shadow-sm space-y-3">
              <h4 className="text-base font-bold flex items-center gap-2">
                <Bell className="w-5 h-5 text-amber-200" /> Notifikasi WhatsApp & Email
              </h4>
              <p className="text-xs text-white/90 leading-relaxed">
                Pengingat pintar otomatis dikirimkan ke kontak terdaftar H-1 sebelum batas waktu tugas berakhir.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => setShowAddReminderModal(true)}
                  className="w-full py-2.5 bg-white text-orange-600 hover:bg-orange-50 text-xs font-bold rounded-xl transition shadow-xs"
                >
                  + Tambah Pengingat Kustom
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add Custom Reminder */}
      {showAddReminderModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-100 p-6 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Bell className="w-5 h-5 text-[#FF5A26]" /> Pasang Pengingat Baru
              </h3>
              <button
                onClick={() => setShowAddReminderModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddReminder} className="py-4 space-y-4 text-xs text-slate-700">
              <div>
                <label className="font-bold block mb-1">Judul Pengingat:</label>
                <input
                  type="text"
                  value={reminderTitle}
                  onChange={(e) => setReminderTitle(e.target.value)}
                  placeholder="Contoh: Belajar kelompok rumus deviasi prisma..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs"
                  required
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Kategori:</label>
                <select
                  value={reminderCategory}
                  onChange={(e) => setReminderCategory(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs"
                >
                  <option value="Ujian & Kuis">Ujian & Kuis</option>
                  <option value="Tugas Mandiri">Tugas Mandiri</option>
                  <option value="Konsultasi Guru">Konsultasi Guru</option>
                  <option value="Simulasi UTBK">Simulasi UTBK</option>
                </select>
              </div>

              <div>
                <label className="font-bold block mb-1">Waktu / Jadwal Pengingat:</label>
                <input
                  type="text"
                  value={reminderDate}
                  onChange={(e) => setReminderDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddReminderModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#FF5A26] hover:bg-[#E84E1D] text-white font-bold text-xs shadow-sm"
                >
                  Simpan Pengingat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
