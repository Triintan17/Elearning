import React, { useState } from 'react';
import {
  Trophy,
  Flame,
  Award,
  Sparkles,
  CheckCircle2,
  Lock,
  Star,
  Gift,
  Zap,
  Target,
  BookOpen,
  Calendar,
  Medal,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserProfile } from '../types/index.ts';
import { calculateStudentLevel } from '../utils/learningLogic.ts';

interface AchievementsViewProps {
  currentUser: UserProfile;
  onAwardBonusXp?: (points: number) => void;
}

interface BadgeItem {
  id: string;
  name: string;
  category: 'disiplin' | 'akademik' | 'keaktifan';
  description: string;
  icon: string;
  tier: 'Emas' | 'Perak' | 'Perunggu';
  isUnlocked: boolean;
  unlockedDate?: string;
  xpReward: number;
  progress?: { current: number; total: number };
}

export const AchievementsView: React.FC<AchievementsViewProps> = ({
  currentUser,
  onAwardBonusXp,
}) => {
  const levelInfo = calculateStudentLevel(currentUser.points);

  // Selected Badge Filter
  const [activeCategory, setActiveCategory] = useState<'all' | 'disiplin' | 'akademik' | 'keaktifan'>('all');
  const [selectedBadge, setSelectedBadge] = useState<BadgeItem | null>(null);

  // Claimed Rewards state
  const [claimedRewards, setClaimedRewards] = useState<string[]>([]);

  // Badges Data
  const badges: BadgeItem[] = [
    {
      id: 'b-streak-50',
      name: 'Pelajar Disiplin (50 Hari)',
      category: 'disiplin',
      description: 'Menjaga streak belajar tanpa putus selama 50 hari berturut-turut di NusantaraEdu.',
      icon: '🔥',
      tier: 'Emas',
      isUnlocked: true,
      unlockedDate: '03 Nov 2026',
      xpReward: 50,
    },
    {
      id: 'b-math-master',
      name: 'Master Kalkulus Lanjut',
      category: 'akademik',
      description: 'Memperoleh nilai 95 pada tugas pemodelan turunan parsial dan grafik fungsi.',
      icon: '📐',
      tier: 'Emas',
      isUnlocked: true,
      unlockedDate: '04 Nov 2026',
      xpReward: 100,
    },
    {
      id: 'b-fast-learner',
      name: 'Penyelesai Modul Kilat',
      category: 'keaktifan',
      description: 'Menonton dan menyelesaikan 15 video modul pembelajaran terakreditasi.',
      icon: '⚡',
      tier: 'Perak',
      isUnlocked: true,
      unlockedDate: '28 Okt 2026',
      xpReward: 75,
    },
    {
      id: 'b-xp-collector',
      name: 'Kolektor Poin Cendekia',
      category: 'akademik',
      description: 'Mengumpulkan lebih dari 850 poin XP dalam semester ganjil.',
      icon: '💎',
      tier: 'Emas',
      isUnlocked: true,
      unlockedDate: '01 Nov 2026',
      xpReward: 100,
    },
    {
      id: 'b-quiz-champ',
      name: 'Juara Kuis Sempurna',
      category: 'akademik',
      description: 'Mencapai skor 100% pada 5 kuis interaktif secara berturut-turut.',
      icon: '🎯',
      tier: 'Perak',
      isUnlocked: false,
      xpReward: 100,
      progress: { current: 4, total: 5 },
    },
    {
      id: 'b-virtual-lab',
      name: 'Peneliti Lab Sains Virtual',
      category: 'keaktifan',
      description: 'Menyelesaikan seluruh eksperimen optik prisma dan perakitan DNA.',
      icon: '🔬',
      tier: 'Perunggu',
      isUnlocked: false,
      xpReward: 50,
      progress: { current: 2, total: 3 },
    },
    {
      id: 'b-forum-hero',
      name: 'Pahlawan Diskusi Kelas',
      category: 'keaktifan',
      description: 'Membantu menjawab dan memberikan solusi pada 10 pertanyaan rekan sekelas.',
      icon: '🤝',
      tier: 'Perunggu',
      isUnlocked: false,
      xpReward: 60,
      progress: { current: 6, total: 10 },
    },
    {
      id: 'b-top-rank',
      name: 'Bintang Prestasi Emas',
      category: 'akademik',
      description: 'Meraih Peringkat 1 Umum di angkatan sekolah kelas XII.',
      icon: '🏆',
      tier: 'Emas',
      isUnlocked: false,
      xpReward: 250,
      progress: { current: currentUser.classRank === 1 ? 1 : 0, total: 1 },
    },
  ];

  const filteredBadges = badges.filter((b) => {
    if (activeCategory === 'all') return true;
    return b.category === activeCategory;
  });

  const unlockedCount = badges.filter((b) => b.isUnlocked).length;

  const handleClaimReward = (id: string, title: string) => {
    setClaimedRewards((prev) => [...prev, id]);
    try {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#FF5A26', '#10B981', '#F59E0B', '#3B82F6'],
      });
    } catch (e) {}
  };

  const handleInspectBadge = (b: BadgeItem) => {
    setSelectedBadge(b);
    if (b.isUnlocked) {
      try {
        confetti({
          particleCount: 50,
          spread: 50,
          origin: { y: 0.5 },
          colors: ['#FF5A26', '#F59E0B'],
        });
      } catch (e) {}
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* 1. Hero Showcase: 54-Day Streak & Level Progress */}
      <div className="bg-gradient-to-br from-[#FFF5F0] via-white to-[#FFF9F5] rounded-3xl p-6 md:p-8 border border-orange-100/80 shadow-xs relative overflow-hidden">
        {/* Soft decorative background circles */}
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-orange-200/20 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 left-1/3 w-64 h-64 rounded-full bg-amber-200/20 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          {/* Left: Streak Celebration */}
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-3xl bg-[#FF5A26] text-white flex items-center justify-center shadow-xl shadow-[#FF5A26]/20 shrink-0 transform hover:scale-105 transition-transform">
              <Flame className="w-9 h-9 md:w-11 md:h-11 animate-pulse" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-orange-100 text-[#FF5A26] text-[10px] font-extrabold tracking-wider uppercase">
                  Streak Konsistensi
                </span>
                <span className="text-xs font-bold text-slate-500">Badge "Pelajar Disiplin"</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                {currentUser.streakDays} Hari Belajar Tanpa Putus! 🔥
              </h2>
              <p className="text-xs text-slate-600 max-w-lg leading-relaxed pt-0.5">
                Luar biasa, {currentUser.name}! Anda telah melampaui rekor 50 hari berturut-turut.
                Pertahankan streak harian untuk mengklaim bonus XP ganda dan lencana emas.
              </p>
            </div>
          </div>

          {/* Right: Level & Next Goal Progress */}
          <div className="bg-white/90 backdrop-blur-md p-5 rounded-2xl border border-orange-100/80 shadow-xs lg:min-w-[320px] space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider">
                  Tingkat Pembelajar
                </span>
                <p className="text-base font-black text-slate-900">
                  Level {levelInfo.level} · {levelInfo.title}
                </p>
              </div>
              <span className="px-3 py-1 rounded-xl bg-[#FFF3EB] text-[#FF5A26] text-xs font-black font-mono">
                {currentUser.points} XP
              </span>
            </div>

            {/* Level Progress Bar */}
            <div className="space-y-1">
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  style={{ width: `${levelInfo.progressPercent}%` }}
                  className="bg-gradient-to-r from-[#FF5A26] to-amber-500 h-full rounded-full transition-all duration-500"
                />
              </div>
              <div className="flex justify-between text-[10px] font-bold text-slate-400">
                <span>Progres Level: {levelInfo.progressPercent}%</span>
                <span>Target: {levelInfo.nextLevelPoints} XP</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 text-[11px] font-bold text-slate-600 border-t border-slate-100">
              <span>Peringkat Kelas: #{currentUser.classRank}</span>
              <span className="text-emerald-600">6/8 Sasaran Bulan Ini Tercapai</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Badges Showcase Grid */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
              Galeri Lencana & Penghargaan ({unlockedCount}/{badges.length} Terbuka)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Klik lencana untuk melihat rincian kriteria pencapaian dan reward XP
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
            {[
              { id: 'all', label: 'Semua Lencana' },
              { id: 'disiplin', label: 'Kedisiplinan' },
              { id: 'akademik', label: 'Akademik' },
              { id: 'keaktifan', label: 'Keaktifan' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeCategory === cat.id
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Badges Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredBadges.map((badge) => {
            return (
              <div
                key={badge.id}
                onClick={() => handleInspectBadge(badge)}
                className={`p-5 rounded-3xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                  badge.isUnlocked
                    ? 'bg-white border-slate-100 hover:border-orange-200 hover:shadow-md'
                    : 'bg-slate-50/70 border-slate-200/60 opacity-80 hover:opacity-100'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between">
                    <span className="text-3xl filter drop-shadow-xs">{badge.icon}</span>
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider ${
                        badge.tier === 'Emas'
                          ? 'bg-amber-100 text-amber-800'
                          : badge.tier === 'Perak'
                          ? 'bg-slate-200 text-slate-700'
                          : 'bg-orange-100 text-orange-800'
                      }`}
                    >
                      {badge.tier}
                    </span>
                  </div>

                  <h4 className="text-sm font-extrabold text-slate-900 mt-3 leading-snug">
                    {badge.name}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {badge.description}
                  </p>
                </div>

                <div className="pt-4 mt-3 border-t border-slate-100">
                  {badge.isUnlocked ? (
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Terbuka
                      </span>
                      <span className="text-xs font-mono font-bold text-[#FF5A26]">
                        +{badge.xpReward} XP
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                        <span className="flex items-center gap-1">
                          <Lock className="w-3 h-3" /> Terkunci
                        </span>
                        {badge.progress && (
                          <span className="font-mono">
                            {badge.progress.current}/{badge.progress.total}
                          </span>
                        )}
                      </div>
                      {badge.progress && (
                        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                          <div
                            style={{
                              width: `${(badge.progress.current / badge.progress.total) * 100}%`,
                            }}
                            className="bg-[#FF5A26] h-full rounded-full"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Recent Milestones & Redeemable Perks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Recent Milestones History */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#FF5A26]" />
            <h3 className="text-base font-extrabold text-slate-900">
              Linimasa Rekor & Pencapaian Terbaru
            </h3>
          </div>

          <div className="divide-y divide-slate-100">
            {[
              {
                date: '04 Nov 2026',
                title: 'Tugas Kalkulus Dinilai: 95/100 (Predikat A)',
                desc: 'Mendapat apresiasi langsung dari Dra. Siti Rahmawati atas pemodelan kurva fungsi 3D.',
                icon: '📐',
              },
              {
                date: '03 Nov 2026',
                title: 'Lencana Pelajar Disiplin (50 Hari Streak)',
                desc: 'Konsistensi belajar penuh setiap hari tanpa jeda di aplikasi e-learning.',
                icon: '🔥',
              },
              {
                date: '01 Nov 2026',
                title: 'Menembus Peringkat 2 Kelas XII MIPA 1',
                desc: 'Total akumulasi nilai dan keaktifan melampaui 850 poin XP.',
                icon: '🥈',
              },
              {
                date: '28 Okt 2026',
                title: 'Menuntaskan Modul Pemrograman Web & UI/UX',
                desc: 'Sertifikat kompetensi keahlian digital resmi diterbitkan.',
                icon: '💻',
              },
            ].map((mile, i) => (
              <div key={i} className="py-3 flex items-start gap-3">
                <span className="text-xl shrink-0 mt-0.5">{mile.icon}</span>
                <div className="space-y-0.5 flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-slate-900 truncate">{mile.title}</p>
                    <span className="text-[10px] font-mono text-slate-400 shrink-0">{mile.date}</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-snug">{mile.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Redeemable Academic Perks (Tukar XP) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gift className="w-4 h-4 text-[#FF5A26]" />
              <h3 className="text-base font-extrabold text-slate-900">
                Tukar Poin XP dengan Benefit Akademik
              </h3>
            </div>
            <span className="text-xs font-extrabold text-[#FF5A26]">Saldo: {currentUser.points} XP</span>
          </div>

          <div className="space-y-3">
            {[
              {
                id: 'rw-1',
                title: 'Sesi Konsultasi 1-on-1 dengan Wali Kelas',
                cost: 300,
                desc: 'Bimbingan privat persiapan SNBT & pemilihan jurusan kuliah bersama Bu Siti.',
              },
              {
                id: 'rw-2',
                title: 'Badge Profil Emas Cendekiawan Nusantara',
                cost: 500,
                desc: 'Lencana eksklusif yang tampil di samping nama Anda di seluruh forum & chat kelas.',
              },
              {
                id: 'rw-3',
                title: 'Akses Repositori Bank Soal Ujian Nasional Premium',
                cost: 400,
                desc: '1.000+ arsip latihan soal lengkap dengan pembahasan video guru penggerak.',
              },
            ].map((reward) => {
              const isClaimed = claimedRewards.includes(reward.id);
              const canAfford = currentUser.points >= reward.cost;

              return (
                <div
                  key={reward.id}
                  className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100 flex items-center justify-between gap-4"
                >
                  <div className="space-y-0.5 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-slate-900">{reward.title}</p>
                      <span className="px-2 py-0.2 rounded-full bg-orange-100 text-[#FF5A26] font-mono text-[10px] font-extrabold">
                        {reward.cost} XP
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-snug">{reward.desc}</p>
                  </div>

                  <button
                    disabled={isClaimed || !canAfford}
                    onClick={() => handleClaimReward(reward.id, reward.title)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-colors ${
                      isClaimed
                        ? 'bg-emerald-100 text-emerald-800 cursor-default'
                        : canAfford
                        ? 'bg-[#FF5A26] hover:bg-[#E84E1D] text-white shadow-xs'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    {isClaimed ? 'Telah Diklaim' : 'Klaim Reward'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Badge Inspection Modal */}
      {selectedBadge && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
            <span className="text-5xl filter drop-shadow-md block">{selectedBadge.icon}</span>

            <div>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                  selectedBadge.tier === 'Emas'
                    ? 'bg-amber-100 text-amber-800'
                    : selectedBadge.tier === 'Perak'
                    ? 'bg-slate-200 text-slate-700'
                    : 'bg-orange-100 text-orange-800'
                }`}
              >
                Lencana {selectedBadge.tier}
              </span>
              <h4 className="text-lg font-black text-slate-900 mt-2">{selectedBadge.name}</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                {selectedBadge.description}
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
              {selectedBadge.isUnlocked ? (
                <div className="text-emerald-700 font-bold space-y-0.5">
                  <p className="flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Terbuka pada {selectedBadge.unlockedDate}
                  </p>
                  <p className="text-[11px] text-slate-500 font-normal">
                    Hadiah XP telah ditambahkan ke profil Anda (+{selectedBadge.xpReward} XP).
                  </p>
                </div>
              ) : (
                <div className="text-slate-600 space-y-1">
                  <p className="font-bold flex items-center justify-center gap-1 text-slate-700">
                    <Lock className="w-3.5 h-3.5" /> Masih Terkunci
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Selesaikan target pembelajaran di atas untuk membuka lencana ini dan klaim +{selectedBadge.xpReward} XP!
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedBadge(null)}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
