import React from 'react';
import {
  LayoutDashboard,
  BookOpen,
  Trophy,
  Activity,
  FolderKanban,
  Award,
  CalendarCheck,
  Flame,
  MessageSquare,
  Settings,
  Sparkles,
  ArrowUpRight,
  X,
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tabId: string) => void;
  unreadCount?: number;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  onOpenExamPortal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  unreadCount = 5,
  isOpenMobile,
  onCloseMobile,
  onOpenExamPortal,
}) => {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'lessons', label: 'Mata Pelajaran', icon: BookOpen },
    { id: 'assignments', label: 'Tugas & Ujian', icon: FolderKanban },
    { id: 'attendance', label: 'Presensi Siswa', icon: CalendarCheck },
    { id: 'achievements', label: 'Pencapaian & Badge', icon: Flame },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
    { id: 'skill-graph', label: 'Skill Graph', icon: Activity },
    { id: 'certificates', label: 'Sertifikat', icon: Award },
    { id: 'messages', label: 'Pesan', icon: MessageSquare, badge: unreadCount },
    { id: 'settings', label: 'Pengaturan', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 w-64 bg-white border-r border-slate-100 flex flex-col z-50 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Logo */}
        <div className="h-20 px-6 flex items-center justify-between border-b border-slate-50">
          <div className="flex items-center gap-3">
            {/* Coral-orange logo mark matching reference */}
            <div className="w-9 h-9 rounded-xl bg-[#FFF1EB] flex items-center justify-center text-[#FF5A26] shadow-xs">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="8" cy="8" r="4" fill="#FF5A26" fillOpacity="0.85" />
                <circle cx="16" cy="8" r="4" fill="#FF5A26" />
                <circle cx="8" cy="16" r="4" fill="#FF5A26" />
                <circle cx="16" cy="16" r="4" fill="#FF5A26" fillOpacity="0.85" />
              </svg>
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900 block leading-none">
                Foco<span className="text-[#FF5A26]">tech</span>
              </span>
              <span className="text-[10px] font-medium text-slate-400 tracking-wider uppercase mt-1 block">
                Nusantara LMS
              </span>
            </div>
          </div>

          <button
            onClick={onCloseMobile}
            aria-label="Tutup menu navigasi"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
          <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Menu
          </div>

          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    onCloseMobile();
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-[#FFF3EB] text-[#FF5A26]'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive ? 'text-[#FF5A26]' : 'text-slate-400'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && item.badge > 0 ? (
                    <span className="w-5 h-5 rounded-full bg-[#FF5A26] text-white text-[11px] font-bold flex items-center justify-center">
                      {item.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Card - Upgrade / Exam Portal matching reference illustration */}
        <div className="p-4 m-3 rounded-2xl bg-gradient-to-b from-[#FFF5F0] to-[#FFEBE0] border border-[#FFD9C6]/60 relative overflow-hidden shadow-xs">
          {/* Decorative background shape */}
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-[#FF8A65]/20 rounded-full blur-xl pointer-events-none" />

          {/* Red banner flag icon element */}
          <div className="w-8 h-8 rounded-lg bg-[#FF5A26] text-white flex items-center justify-center mb-3 shadow-sm">
            <Sparkles className="w-4 h-4" />
          </div>

          <h4 className="text-sm font-bold text-slate-900 leading-tight">
            Tryout Nasional UTBK!
          </h4>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
            Akses bank 5.000+ soal pembahasan guru penggerak.
          </p>

          <button
            onClick={onOpenExamPortal}
            className="mt-3.5 w-full py-2.5 px-3 bg-[#FF5A26] hover:bg-[#E84E1D] text-white text-xs font-bold rounded-xl transition-colors shadow-sm flex items-center justify-center gap-1.5"
          >
            <span>Mulai Simulasi</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </aside>
    </>
  );
};
