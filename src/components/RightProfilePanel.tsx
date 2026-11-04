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
  X,
  CheckCircle2,
} from 'lucide-react';
import { UserProfile } from '../types/index.ts';
import { WEEKLY_WATCH_HOURS } from '../data/mockData.ts';

interface RightProfilePanelProps {
  user: UserProfile;
  isOpen: boolean;
  onToggle: () => void;
  onOpenCourse: (courseId: string) => void;
}

export const RightProfilePanel: React.FC<RightProfilePanelProps> = ({
  user,
  isOpen,
  onToggle,
  onOpenCourse,
}) => {
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
        className="fixed right-4 bottom-6 z-40 bg-[#FF5A26] hover:bg-[#E84E1D] text-white px-4 py-2.5 rounded-2xl shadow-lg flex items-center gap-2 text-xs font-bold transition-all hover:scale-105 xl:hidden"
      >
        <Medal className="w-4 h-4" />
        <span>Buka Statistik & Streak</span>
      </button>
    );
  }

  return (
    <aside className="w-full xl:w-84 2xl:w-92 shrink-0 bg-[#FAFAFC] xl:border-l border-slate-100 p-4 md:p-6 space-y-5">
      {/* Top Toggle Bar */}
      <div className="flex items-center justify-between pb-1">
        <button
          onClick={onToggle}
          className="flex items-center gap-1.5 text-xs font-bold text-[#FF5A26] hover:text-[#E84E1D] transition-colors"
        >
          <span className="w-4 h-4 rounded-full border border-[#FF5A26] flex items-center justify-center text-[10px]">
            &minus;
          </span>
          <span>Tutup Rincian</span>
        </button>

        <span className="text-[11px] font-semibold text-slate-400">
          Semester Ganjil 2026
        </span>
      </div>

      {/* 1. Student Profile Card (exact match with reference) */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs text-center relative overflow-hidden">
        {/* Subtle grid background accent */}
        <div className="absolute inset-0 bg-[radial-gradient(#FF5A26_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.03] pointer-events-none" />

        <div className="relative flex flex-col items-center">
          <div className="relative mb-3">
            <img
              src={user.avatar}
              alt={user.name}
              referrerPolicy="no-referrer"
              className="w-18 h-18 rounded-2xl object-cover ring-4 ring-[#FFF3EB] shadow-sm"
            />
            <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-[#FF5A26] text-white flex items-center justify-center shadow-xs">
              <SparklesIcon />
            </div>
          </div>

          <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
            {user.name}
          </h3>
          <p className="text-xs font-medium text-slate-500 mt-0.5">
            {user.className}
          </p>

          <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF3EB] text-[#FF5A26] text-xs font-bold">
            <Medal className="w-3.5 h-3.5" />
            <span className="tabular-nums">{user.points} Points</span>
          </div>

          {/* 3 Stats in a Row */}
          <div className="grid grid-cols-3 gap-2 w-full mt-5 pt-4 border-t border-slate-100">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-slate-900 font-extrabold text-sm">
                <Flame className="w-4 h-4 text-[#FF5A26] fill-[#FF5A26]" />
                <span className="tabular-nums">{user.streakDays}</span>
              </div>
              <p className="text-[10px] font-medium text-slate-400 mt-0.5">
                Days Streak
              </p>
            </div>

            <div className="text-center border-x border-slate-100">
              <div className="flex items-center justify-center gap-1 text-slate-900 font-extrabold text-sm">
                <Target className="w-4 h-4 text-[#FF5A26]" />
                <span className="tabular-nums">0{user.monthlyGoals}</span>
              </div>
              <p className="text-[10px] font-medium text-slate-400 mt-0.5">
                Goals In Month
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-slate-900 font-extrabold text-sm">
                <Trophy className="w-4 h-4 text-amber-500" />
                <span className="tabular-nums">0{user.classRank}</span>
              </div>
              <p className="text-[10px] font-medium text-slate-400 mt-0.5">
                2nd Place
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Weekly Streak Widget */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5">
            <h4 className="text-xs font-extrabold text-slate-900">Weekly Streak</h4>
            <Info className="w-3.5 h-3.5 text-slate-400" />
          </div>

          <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
            <Calendar className="w-3 h-3 text-slate-400" />
            <span>Mei 2026</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
          <span className="font-semibold text-slate-600">4/4 Minggu</span>
          <div className="flex items-center gap-1">
            <button
              aria-label="Minggu sebelumnya"
              className="w-5 h-5 rounded-md hover:bg-slate-100 flex items-center justify-center text-slate-500"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              aria-label="Minggu berikutnya"
              className="w-5 h-5 rounded-md hover:bg-slate-100 flex items-center justify-center text-slate-500"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 7 Day Streak Buttons */}
        <div className="grid grid-cols-7 gap-1.5 text-center">
          {streakDays.map((item, idx) => (
            <button
              key={idx}
              onClick={() => toggleDayCheck(idx)}
              className={`py-2 px-1 rounded-2xl flex flex-col items-center justify-center transition-all ${
                item.active
                  ? 'bg-[#FF5A26] text-white shadow-xs shadow-orange-500/20'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span
                className={`text-[10px] font-semibold ${
                  item.active ? 'text-white/80' : 'text-slate-400'
                }`}
              >
                {item.day}
              </span>
              <span className="text-xs font-extrabold mt-0.5 tabular-nums">
                {item.date}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Two Stats Cards Side by Side */}
      <div className="grid grid-cols-2 gap-3">
        <div
          onClick={() => onOpenCourse('crs-math-01')}
          className="bg-white rounded-3xl p-4 border border-slate-100 shadow-xs cursor-pointer hover:border-orange-200 transition-colors"
        >
          <div className="w-9 h-9 rounded-xl bg-[#FFF3EB] text-[#FF5A26] flex items-center justify-center mb-3">
            <BookOpen className="w-4 h-4" />
          </div>
          <p className="text-lg font-black text-slate-900 leading-none tabular-nums">
            {user.totalCoursesInProgress} Modul
          </p>
          <p className="text-[11px] font-medium text-slate-400 mt-1">Sedang Berjalan</p>
        </div>

        <div
          onClick={() => onOpenCourse('crs-web-01')}
          className="bg-white rounded-3xl p-4 border border-slate-100 shadow-xs cursor-pointer hover:border-orange-200 transition-colors"
        >
          <div className="w-9 h-9 rounded-xl bg-[#FFF3EB] text-[#FF5A26] flex items-center justify-center mb-3">
            <GraduationCap className="w-4 h-4" />
          </div>
          <p className="text-lg font-black text-slate-900 leading-none tabular-nums">
            {user.totalCoursesCompleted} Modul
          </p>
          <p className="text-[11px] font-medium text-slate-400 mt-1">Telah Selesai</p>
        </div>
      </div>

      {/* 4. Weekly Watch Time Chart Widget (matching the reference bar chart) */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <h4 className="text-xs font-extrabold text-slate-900">Waktu Belajar</h4>
            <Info className="w-3.5 h-3.5 text-slate-400" />
          </div>

          <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
            <Calendar className="w-3 h-3 text-slate-400" />
            <span>Mei 2026</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span className="font-semibold text-slate-600">4/4 Minggu</span>
          <div className="flex items-center gap-1">
            <button
              aria-label="Minggu sebelumnya"
              className="w-5 h-5 rounded-md hover:bg-slate-100 flex items-center justify-center text-slate-500"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              aria-label="Minggu berikutnya"
              className="w-5 h-5 rounded-md hover:bg-slate-100 flex items-center justify-center text-slate-500"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Visual Bar Chart with Tooltip */}
        <div className="relative pt-8 pb-1">
          {/* Active tooltip badge on Rabu (index 2) */}
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
                      className={`w-3 md:w-3.5 rounded-full transition-all duration-200 ${
                        isSelected
                          ? 'bg-[#FF5A26] shadow-xs ring-2 ring-[#FF5A26]/30'
                          : 'bg-[#EFF2F6] group-hover:bg-slate-300'
                      }`}
                    />
                  </div>
                  <span
                    className={`text-[10px] font-bold mt-2 ${
                      isSelected ? 'text-[#FF5A26]' : 'text-slate-400'
                    }`}
                  >
                    {item.day}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Background horizontal guide lines */}
          <div className="absolute inset-x-2 top-8 bottom-7 flex flex-col justify-between pointer-events-none opacity-20">
            <div className="border-b border-dashed border-slate-300 w-full" />
            <div className="border-b border-dashed border-slate-300 w-full" />
            <div className="border-b border-dashed border-slate-300 w-full" />
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>Target harian: 3.5 jam</span>
          <span className="font-bold text-emerald-600 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> +24% minggu ini
          </span>
        </div>
      </div>
    </aside>
  );
};

function SparklesIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
    </svg>
  );
}
