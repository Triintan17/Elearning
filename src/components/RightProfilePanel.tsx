import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Info,
  Calendar,
  BookOpen,
  GraduationCap,
  Trophy,
  Flame,
  Target,
  Medal,
  ChevronDown,
  CheckCircle2,
  Sparkles,
  UserCheck,
  CreditCard,
  Phone,
  Clock,
  Send,
  ShieldCheck,
  FileText,
} from 'lucide-react';
import { UserProfile } from '../types/index.ts';
import { WEEKLY_WATCH_HOURS } from '../data/mockData.ts';
import { CircularProgressBar } from './CircularProgressBar.tsx';

interface RightProfilePanelProps {
  user: UserProfile;
  isOpen: boolean;
  onToggle: () => void;
  onOpenCourse: (courseId: string) => void;
  onNavigateTab?: (tabId: string) => void;
}

export const RightProfilePanel: React.FC<RightProfilePanelProps> = ({
  user,
  isOpen,
  onToggle,
  onOpenCourse,
  onNavigateTab,
}) => {
  const isTeacher = user.role === 'guru';
  const isParent = user.role === 'wali';

  const [selectedDayIndex, setSelectedDayIndex] = useState(2); // Wednesday (Wed 31)
  const [streakDays, setStreakDays] = useState([
    { day: 'Sen', date: '29', active: true },
    { day: 'Sel', date: '30', active: true },
    { day: 'Rab', date: '31', active: true },
    { day: 'Kam', date: '1', active: false },
    { day: 'Jum', date: '2', active: false },
    { day: 'Sab', date: '3', active: false },
    { day: 'Min', date: '4', active: false },
  ]);

  const toggleDayCheck = (index: number) => {
    setStreakDays((prev) =>
      prev.map((d, i) => (i === index ? { ...d, active: !d.active } : d))
    );
  };

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="fixed right-4 bottom-6 z-40 bg-[#FF5A26] hover:bg-[#E84E1D] text-white px-4 py-2.5 rounded-2xl shadow-lg flex items-center gap-2 text-xs font-bold transition-all hover:scale-105 xl:hidden cursor-pointer"
      >
        <Medal className="w-4 h-4" />
        <span>Buka Statistik & Peran</span>
      </button>
    );
  }

  // Calculate target study completion
  const totalWeeklyHours = WEEKLY_WATCH_HOURS.reduce((acc, curr) => acc + curr.hours, 0);
  const targetWeeklyHours = 20;
  const weeklyCompletionRate = Math.min(100, Math.round((totalWeeklyHours / targetWeeklyHours) * 100));

  return (
    <aside className="w-full xl:w-84 2xl:w-92 shrink-0 bg-transparent xl:border-l border-slate-200/60 p-4 md:p-6 space-y-5">
      {/* Top Toggle Bar with Active Role Indicator */}
      <div className="flex items-center justify-between pb-1">
        <button
          onClick={onToggle}
          className="flex items-center gap-1.5 text-xs font-bold text-[#FF5A26] hover:text-[#E84E1D] transition-colors cursor-pointer"
        >
          <span className="w-4 h-4 rounded-full border border-[#FF5A26] flex items-center justify-center text-[10px]">
            &minus;
          </span>
          <span>Tutup Rincian</span>
        </button>

        <span
          className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${
            isTeacher
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : isParent
              ? 'bg-purple-50 text-purple-800 border-purple-200'
              : 'bg-orange-50 text-orange-800 border-orange-200'
          }`}
        >
          {isTeacher ? 'Akun Pendidik' : isParent ? 'Akun Wali Murid' : 'Akun Siswa'}
        </span>
      </div>

      {/* 1. Main Profile Bento Card */}
      <div className="glass-card rounded-3xl p-6 text-center relative overflow-hidden group">
        <div className="relative flex flex-col items-center">
          <div className="relative mb-3">
            <img
              src={user.avatar}
              alt={user.name}
              referrerPolicy="no-referrer"
              className={`w-20 h-20 rounded-3xl object-cover ring-4 shadow-md transition-transform duration-300 group-hover:scale-105 ${
                isTeacher ? 'ring-emerald-100' : isParent ? 'ring-purple-100' : 'ring-orange-100'
              }`}
            />
            <div
              className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full text-white flex items-center justify-center shadow-xs ${
                isTeacher ? 'bg-emerald-600' : isParent ? 'bg-purple-600' : 'bg-[#FF5A26]'
              }`}
            >
              {isTeacher ? (
                <UserCheck className="w-3.5 h-3.5" />
              ) : isParent ? (
                <ShieldCheck className="w-3.5 h-3.5" />
              ) : (
                <Sparkles className="w-3.5 h-3.5" />
              )}
            </div>
          </div>

          <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
            {user.name}
          </h3>
          <p className="text-xs font-medium text-slate-500 mt-0.5">
            {user.className}
          </p>

          {isParent && user.childName && (
            <div className="mt-2 text-[11px] font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
              Siswa Dipantau: {user.childName}
            </div>
          )}

          {isTeacher && (
            <div className="mt-2 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              NIP: {user.nis}
            </div>
          )}

          {!isTeacher && !isParent && (
            <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-[#FF5A26] text-xs font-bold">
              <Medal className="w-3.5 h-3.5" />
              <span className="tabular-nums">{user.points} XP Terkumpul</span>
            </div>
          )}

          {/* 3 Stats in a Row (Differentiated per Role) */}
          <div className="grid grid-cols-3 gap-2 w-full mt-5 pt-4 border-t border-slate-100 text-center">
            {isTeacher ? (
              <>
                <div className="p-1">
                  <div className="text-emerald-700 font-extrabold text-sm">32</div>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Siswa Kelas</p>
                </div>
                <div className="p-1 border-x border-slate-100">
                  <div className="text-orange-600 font-extrabold text-sm">12</div>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Perlu Koreksi</p>
                </div>
                <div className="p-1">
                  <div className="text-amber-500 font-extrabold text-sm">4.9 ★</div>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Rating Guru</p>
                </div>
              </>
            ) : isParent ? (
              <>
                <div className="p-1">
                  <div className="text-emerald-700 font-extrabold text-sm">06:42</div>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Masuk Hari Ini</p>
                </div>
                <div className="p-1 border-x border-slate-100">
                  <div className="text-purple-700 font-extrabold text-sm">89.5</div>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Nilai Rapor</p>
                </div>
                <div className="p-1">
                  <div className="text-emerald-600 font-extrabold text-sm">Lunas</div>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">SPP Ganjil</p>
                </div>
              </>
            ) : (
              <>
                <div className="p-1">
                  <div className="flex items-center justify-center gap-1 text-slate-900 font-extrabold text-sm">
                    <Flame className="w-4 h-4 text-[#FF5A26] fill-[#FF5A26]" />
                    <span className="tabular-nums">{user.streakDays}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Days Streak</p>
                </div>
                <div className="p-1 border-x border-slate-100">
                  <div className="text-slate-900 font-extrabold text-sm">0{user.monthlyGoals}</div>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Target Bulan</p>
                </div>
                <div className="p-1">
                  <div className="text-amber-500 font-extrabold text-sm">Juara 0{user.classRank}</div>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Peringkat</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 2. Role Specific Widget 2 */}
      {isTeacher ? (
        <div className="glass-card rounded-3xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-extrabold text-slate-900">Beban Mengajar Mingguan</h4>
              <p className="text-[10px] text-slate-400 font-medium">28 dari 30 jam wajib KBM tercapai</p>
            </div>
            <CircularProgressBar
              value={93}
              size={50}
              strokeWidth={5}
              color="#10B981"
              trackColor="#E2E8F0"
            />
          </div>

          <div className="p-2.5 rounded-2xl bg-emerald-50 border border-emerald-100 text-xs font-semibold text-emerald-800 flex items-center justify-between">
            <span>Status Beban Kerja Guru</span>
            <span className="font-bold">Memenuhi Sertifikasi</span>
          </div>

          <div className="pt-2 space-y-2">
            <button
              onClick={() => onNavigateTab && onNavigateTab('assignments')}
              className="w-full py-2 px-3 rounded-xl bg-orange-50 hover:bg-orange-100 text-[#FF5A26] text-xs font-bold transition-colors flex items-center justify-between cursor-pointer"
            >
              <span>Periksa 12 Tugas Masuk</span>
              <span className="text-[10px] bg-[#FF5A26] text-white px-2 py-0.5 rounded-full">Koreksi</span>
            </button>
            <button
              onClick={() => onNavigateTab && onNavigateTab('attendance')}
              className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center justify-between cursor-pointer"
            >
              <span>Rekap Absensi XII MIPA 1</span>
              <span>➔</span>
            </button>
          </div>
        </div>
      ) : isParent ? (
        <div className="glass-card rounded-3xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-extrabold text-slate-900">Kehadiran Ahmad Rizky</h4>
              <p className="text-[10px] text-slate-400 font-medium">Semester 1: 92/94 hari masuk</p>
            </div>
            <CircularProgressBar
              value={98}
              size={50}
              strokeWidth={5}
              color="#6366F1"
              trackColor="#E0E7FF"
            />
          </div>

          <div className="space-y-2 pt-1">
            <button
              onClick={() => onNavigateTab && onNavigateTab('parent-portal')}
              className="w-full py-2 px-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold transition-colors flex items-center justify-between cursor-pointer"
            >
              <span>Ajukan Surat Izin / Sakit</span>
              <span>➔</span>
            </button>
            <button
              onClick={() => onNavigateTab && onNavigateTab('parent-portal')}
              className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center justify-between cursor-pointer"
            >
              <span>Jadwalkan Konsultasi Guru</span>
              <span>➔</span>
            </button>
          </div>
        </div>
      ) : (
        /* Siswa Weekly Target */
        <div className="glass-card rounded-3xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center">
                <Target className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-slate-900">Target Belajar Mandiri</h4>
                <p className="text-[10px] text-slate-400 font-medium">{totalWeeklyHours.toFixed(1)} dari {targetWeeklyHours} jam tercapai</p>
              </div>
            </div>

            <CircularProgressBar
              value={weeklyCompletionRate}
              size={48}
              strokeWidth={5}
              color="#10B981"
              trackColor="#E2E8F0"
            />
          </div>

          <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 bg-emerald-50/60 border border-emerald-100/60 px-3 py-1.5 rounded-2xl">
            <span className="flex items-center gap-1 text-emerald-700">
              <CheckCircle2 className="w-3.5 h-3.5" /> Konsistensi Bagus
            </span>
            <span className="text-emerald-700 font-extrabold">{weeklyCompletionRate}%</span>
          </div>
        </div>
      )}

      {/* 3. Weekly Streak / Presensi Widget */}
      <div className="glass-card rounded-3xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5">
            <h4 className="text-xs font-extrabold text-slate-900">
              {isTeacher ? 'Presensi Kelas Mingguan' : isParent ? 'Presensi Ananda Mingguan' : 'Presensi & Streak'}
            </h4>
            <Info className="w-3.5 h-3.5 text-slate-400" />
          </div>

          <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-slate-100/80 px-2 py-1 rounded-xl border border-slate-200/50">
            <Calendar className="w-3 h-3 text-slate-400" />
            <span>Mei 2026</span>
          </div>
        </div>

        {/* 7 Day Streak Buttons */}
        <div className="grid grid-cols-7 gap-1.5 text-center">
          {streakDays.map((item, idx) => (
            <button
              key={idx}
              onClick={() => toggleDayCheck(idx)}
              className={`py-2.5 px-1 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                item.active
                  ? isTeacher
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : isParent
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-[#FF5A26] text-white shadow-xs'
                  : 'bg-slate-100/70 text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              <span className={`text-[10px] font-semibold ${item.active ? 'text-white/90' : 'text-slate-400'}`}>
                {item.day}
              </span>
              <span className="text-xs font-extrabold mt-0.5 tabular-nums">
                {item.date}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 4. Watch Time / Activity Chart */}
      <div className="glass-card rounded-3xl p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <h4 className="text-xs font-extrabold text-slate-900">
              {isTeacher ? 'Jam Konsultasi & KBM' : isParent ? 'Waktu Belajar Ananda' : 'Aktivitas Belajar'}
            </h4>
            <Info className="w-3.5 h-3.5 text-slate-400" />
          </div>

          <span className="text-[10px] text-slate-400 font-semibold">Mei 2026</span>
        </div>

        {/* Visual Bar Chart with Tooltip */}
        <div className="relative pt-8 pb-1">
          <div
            className="absolute top-0 transition-all duration-200 pointer-events-none"
            style={{
              left: `${(selectedDayIndex / 6) * 78 + 4}%`,
            }}
          >
            <div className="bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-md whitespace-nowrap">
              {WEEKLY_WATCH_HOURS[selectedDayIndex].label}
            </div>
            <div className="w-1.5 h-1.5 bg-slate-900 rotate-45 mx-auto -mt-0.5" />
          </div>

          <div className="h-32 flex items-end justify-between gap-2.5 px-2">
            {WEEKLY_WATCH_HOURS.map((item, idx) => {
              const isSelected = selectedDayIndex === idx;
              const heightPercent = (item.hours / 6) * 100;

              return (
                <div
                  key={idx}
                  onClick={() => setSelectedDayIndex(idx)}
                  className="flex-1 flex flex-col items-center h-full justify-end cursor-pointer group"
                >
                  <div className="w-full flex justify-center items-end h-24">
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className={`w-3.5 rounded-full transition-all duration-300 ${
                        isSelected
                          ? isTeacher
                            ? 'bg-emerald-600 ring-2 ring-emerald-300'
                            : isParent
                            ? 'bg-purple-600 ring-2 ring-purple-300'
                            : 'bg-[#FF5A26] ring-2 ring-orange-300'
                          : 'bg-slate-200/80 group-hover:bg-slate-300'
                      }`}
                    />
                  </div>
                  <span
                    className={`text-[10px] font-bold mt-2 ${
                      isSelected ? (isTeacher ? 'text-emerald-700' : isParent ? 'text-purple-700' : 'text-[#FF5A26]') : 'text-slate-400'
                    }`}
                  >
                    {item.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>{isTeacher ? 'Jadwal Aktif: 5 Hari KBM' : 'Keaktifan Terjadwal'}</span>
          <span className="font-bold text-emerald-600 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Normal & Disiplin
          </span>
        </div>
      </div>
    </aside>
  );
};
