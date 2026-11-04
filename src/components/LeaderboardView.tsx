import React from 'react';
import {
  Trophy,
  Flame,
  Medal,
  Sparkles,
  Zap,
  TrendingUp,
} from 'lucide-react';
import { LeaderboardEntry } from '../types/index.ts';

interface LeaderboardViewProps {
  entries: LeaderboardEntry[];
  currentUserId: string;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({
  entries,
  currentUserId,
}) => {
  const top1 = entries[0];
  const top2 = entries[1];
  const top3 = entries[2];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-orange-950 text-white p-6 md:p-8 rounded-3xl relative overflow-hidden shadow-sm">
        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-orange-300 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Peringkat Liga Prestasi Mingguan</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight leading-tight">
            Papan Peringkat & Gamifikasi Akademik
          </h2>
          <p className="text-xs text-slate-300 mt-2 leading-relaxed">
            Dapatkan poin XP dari setiap modul yang dipelajari, kuis yang diselesaikan dengan skor sempurna, serta konsistensi streak kehadiran harian.
          </p>
        </div>

        {/* Decorative badge background */}
        <div className="absolute -right-6 -bottom-8 w-44 h-44 bg-[#FF5A26]/20 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Top 3 Podium Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end pt-4">
        {/* 2nd Place */}
        {top2 && (
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs text-center order-2 md:order-1 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-slate-200 text-slate-700 text-xs font-black flex items-center gap-1 shadow-2xs">
              <Medal className="w-3.5 h-3.5 text-slate-500" />
              <span>JUARA 2</span>
            </div>
            <img
              src={top2.avatar}
              alt={top2.name}
              referrerPolicy="no-referrer"
              className="w-16 h-16 rounded-2xl mx-auto object-cover ring-4 ring-slate-100 mt-2"
            />
            <h3 className="text-sm font-extrabold text-slate-900 mt-3 truncate">{top2.name}</h3>
            <p className="text-[11px] text-slate-400 font-medium">{top2.className}</p>
            <div className="mt-3 inline-flex items-center gap-1 text-xs font-black text-slate-800">
              <span className="tabular-nums">{top2.points} XP</span>
            </div>
          </div>
        )}

        {/* 1st Place (Highest elevation) */}
        {top1 && (
          <div className="bg-gradient-to-b from-[#FFF5F0] to-white rounded-3xl p-6 border-2 border-[#FFD9C6] shadow-md text-center order-1 md:order-2 relative -translate-y-2">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-amber-400 text-amber-950 text-xs font-black flex items-center gap-1.5 shadow-sm">
              <Trophy className="w-4 h-4 fill-amber-950" />
              <span>JUARA 1</span>
            </div>
            <img
              src={top1.avatar}
              alt={top1.name}
              referrerPolicy="no-referrer"
              className="w-20 h-20 rounded-2xl mx-auto object-cover ring-4 ring-amber-300 mt-2 shadow-sm"
            />
            <h3 className="text-base font-extrabold text-slate-900 mt-3 truncate">{top1.name}</h3>
            <p className="text-xs text-slate-500 font-medium">{top1.className}</p>
            <div className="mt-3 inline-flex items-center gap-1 text-sm font-black text-[#FF5A26] bg-[#FFF3EB] px-3.5 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="tabular-nums">{top1.points} XP</span>
            </div>
          </div>
        )}

        {/* 3rd Place */}
        {top3 && (
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs text-center order-3 md:order-3 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-black flex items-center gap-1 shadow-2xs">
              <Medal className="w-3.5 h-3.5 text-amber-600" />
              <span>JUARA 3</span>
            </div>
            <img
              src={top3.avatar}
              alt={top3.name}
              referrerPolicy="no-referrer"
              className="w-16 h-16 rounded-2xl mx-auto object-cover ring-4 ring-amber-100 mt-2"
            />
            <h3 className="text-sm font-extrabold text-slate-900 mt-3 truncate">{top3.name}</h3>
            <p className="text-[11px] text-slate-400 font-medium">{top3.className}</p>
            <div className="mt-3 inline-flex items-center gap-1 text-xs font-black text-slate-800">
              <span className="tabular-nums">{top3.points} XP</span>
            </div>
          </div>
        )}
      </div>

      {/* Leaderboard Table */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-2">
          <h3 className="text-sm font-extrabold text-slate-900">
            Daftar Peringkat Lengkap Angkatan 2026
          </h3>
          <span className="text-xs text-slate-400 font-medium">Diperbarui real-time</span>
        </div>

        <div className="divide-y divide-slate-100">
          {entries.map((entry) => {
            const isMe = entry.id === currentUserId;

            return (
              <div
                key={entry.id}
                className={`py-3.5 px-3 rounded-2xl flex items-center justify-between transition-colors ${
                  isMe ? 'bg-[#FFF3EB] font-bold' : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3 md:gap-4">
                  <span
                    className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black tabular-nums ${
                      entry.rank === 1
                        ? 'bg-amber-100 text-amber-800'
                        : entry.rank === 2
                        ? 'bg-slate-200 text-slate-700'
                        : entry.rank === 3
                        ? 'bg-orange-100 text-[#FF5A26]'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {entry.rank}
                  </span>

                  <img
                    src={entry.avatar}
                    alt={entry.name}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-xl object-cover ring-2 ring-slate-100"
                  />

                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs md:text-sm font-extrabold text-slate-900">
                        {entry.name}
                      </p>
                      {isMe && (
                        <span className="text-[10px] px-2 py-0.2 bg-[#FF5A26] text-white rounded-full font-bold">
                          Anda
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 font-medium">{entry.className}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 md:gap-8">
                  <div className="hidden sm:flex items-center gap-1 text-xs text-slate-600 font-semibold">
                    <Flame className="w-4 h-4 text-[#FF5A26] fill-[#FF5A26]" />
                    <span className="tabular-nums">{entry.streak} Hari Streak</span>
                  </div>

                  <div className="text-right">
                    <p className="text-xs md:text-sm font-black text-slate-900 tabular-nums">
                      {entry.points} XP
                    </p>
                    <p className="text-[10px] text-emerald-600 font-bold flex items-center justify-end gap-0.5">
                      <TrendingUp className="w-3 h-3" /> Aktif Belajar
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
