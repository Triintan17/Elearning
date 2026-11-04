import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  MessageSquare,
  Menu,
  ChevronDown,
  UserCheck,
  GraduationCap,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { UserProfile, UserRole } from '../types/index.ts';

interface HeaderProps {
  currentTabName: string;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  currentUser: UserProfile;
  onSwitchRole: (role: UserRole) => void;
  onOpenMobileSidebar: () => void;
  onOpenMessagesTab: () => void;
  onSelectSubject?: (subjectCode: string) => void;
  onNavigateTab?: (tabId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTabName,
  searchQuery,
  onSearchChange,
  currentUser,
  onSwitchRole,
  onOpenMobileSidebar,
  onOpenMessagesTab,
  onNavigateTab,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  const [notificationsList, setNotificationsList] = useState([
    {
      id: 'n1',
      title: 'Tugas Kalkulus Dinilai',
      desc: 'Nilai Anda: 95/100 (Predikat A). Catatan dari Bu Siti tersedia.',
      time: '10 menit yang lalu',
      unread: true,
      targetTab: 'assignments',
      category: 'Tugas',
    },
    {
      id: 'n2',
      title: 'Presensi Otomatis Tercatat',
      desc: 'Kehadiran Anda di sesi Fisika Optika telah terverifikasi sistem.',
      time: '1 jam yang lalu',
      unread: true,
      targetTab: 'attendance',
      category: 'Presensi',
    },
    {
      id: 'n3',
      title: 'Pencapaian Baru: 50 Hari Streak!',
      desc: 'Selamat! Anda memperoleh 50 Poin XP dan Badge Pelajar Disiplin.',
      time: 'Kemarin',
      unread: false,
      targetTab: 'achievements',
      category: 'Pencapaian',
    },
  ]);

  const handleNotificationClick = (item: (typeof notificationsList)[0]) => {
    if (onNavigateTab && item.targetTab) {
      onNavigateTab(item.targetTab);
    }
    setShowNotifications(false);
    setNotificationsList((prev) =>
      prev.map((n) => (n.id === item.id ? { ...n, unread: false } : n))
    );
  };

  const handleMarkAllRead = () => {
    setNotificationsList((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (userRef.current && !userRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 md:px-8 flex items-center justify-between sticky top-0 z-30">
      {/* Left zone: Mobile toggle & Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          aria-label="Buka menu navigasi"
          className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 capitalize tracking-tight">
            {currentTabName}
          </h1>
        </div>
      </div>

      {/* Middle & Right zone: Search bar, role switcher, icons, and profile */}
      <div className="flex items-center gap-3 md:gap-5">
        {/* Search input with ⌘K badge */}
        <div className="relative hidden md:flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari materi, tugas, guru, atau kelas..."
            className="w-64 lg:w-80 h-10 pl-10 pr-12 rounded-xl bg-slate-50 border border-slate-200/80 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#FF5A26] focus:bg-white focus:ring-2 focus:ring-[#FF5A26]/10 transition-all"
          />
          <kbd className="absolute right-3 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-white border border-slate-200 text-slate-500 shadow-2xs pointer-events-none">
            ⌘K
          </kbd>
        </div>

        {/* Role Switcher Pill */}
        <div className="relative" ref={userRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200/60 transition-colors text-xs font-bold text-slate-700"
            title="Ganti Mode Pengguna (Siswa / Guru)"
          >
            {currentUser.role === 'siswa' ? (
              <>
                <GraduationCap className="w-4 h-4 text-[#FF5A26]" />
                <span className="hidden sm:inline">Mode Siswa</span>
              </>
            ) : (
              <>
                <UserCheck className="w-4 h-4 text-emerald-600" />
                <span className="hidden sm:inline">Mode Guru</span>
              </>
            )}
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* Role switcher dropdown */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-2 border-b border-slate-100">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Beralih Akun Uji Coba
                </p>
              </div>

              <div className="p-1 space-y-1">
                <button
                  onClick={() => {
                    onSwitchRole('siswa');
                    setShowUserMenu(false);
                  }}
                  className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-colors ${
                    currentUser.role === 'siswa'
                      ? 'bg-[#FFF3EB] text-[#FF5A26]'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-[#FFE6DB] flex items-center justify-center text-[#FF5A26]">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold truncate">Ahmad Rizky Pratama</p>
                    <p className="text-[10px] text-slate-500 truncate">Siswa XII MIPA 1</p>
                  </div>
                  {currentUser.role === 'siswa' && (
                    <CheckCircle2 className="w-4 h-4 text-[#FF5A26]" />
                  )}
                </button>

                <button
                  onClick={() => {
                    onSwitchRole('guru');
                    setShowUserMenu(false);
                  }}
                  className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-colors ${
                    currentUser.role === 'guru'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold truncate">Dra. Siti Rahmawati, M.Pd</p>
                    <p className="text-[10px] text-slate-500 truncate">Guru & Wali Kelas XII</p>
                  </div>
                  {currentUser.role === 'guru' && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Quick Message Button */}
        <button
          onClick={onOpenMessagesTab}
          aria-label="Pesan masuk"
          className="w-10 h-10 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 flex items-center justify-center text-slate-600 transition-colors relative"
        >
          <MessageSquare className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#FF5A26] ring-2 ring-white" />
        </button>

        {/* Notifications Bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Notifikasi sistem"
            className="w-10 h-10 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 flex items-center justify-center text-slate-600 transition-colors relative"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#FF5A26] ring-2 ring-white" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-900">Notifikasi Sekolah</h4>
                  <span className="px-2 py-0.5 rounded-full bg-[#FFF3EB] text-[#FF5A26] text-[10px] font-bold">
                    {notificationsList.filter((n) => n.unread).length} Baru
                  </span>
                </div>
                <button
                  onClick={handleMarkAllRead}
                  className="text-xs text-[#FF5A26] hover:underline font-semibold"
                >
                  Tandai Semua Dibaca
                </button>
              </div>

              <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                {notificationsList.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleNotificationClick(item)}
                    className={`p-3 rounded-xl transition-all cursor-pointer group hover:bg-[#FFF3EB]/60 ${
                      item.unread ? 'bg-orange-50/40' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded bg-orange-100 text-[#FF5A26] text-[9px] font-bold uppercase">
                          {item.category}
                        </span>
                        <p className="text-xs font-bold text-slate-900 group-hover:text-[#FF5A26] transition-colors">
                          {item.title}
                        </p>
                      </div>
                      <span className="text-[10px] text-slate-400 shrink-0">{item.time}</span>
                    </div>

                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{item.desc}</p>

                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-[11px] font-bold text-[#FF5A26] flex items-center gap-1 group-hover:underline">
                        <span>Buka Tampilan {item.category}</span>
                        <span>➔</span>
                      </span>
                      {item.unread && (
                        <span className="w-2 h-2 rounded-full bg-[#FF5A26]" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Avatar Chip (matching top right avatar in reference) */}
        <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
          <div className="relative">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-xl object-cover ring-2 ring-[#FF5A26]/30 shadow-xs"
            />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center">
              <span className="sr-only">Online</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
