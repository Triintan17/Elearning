import React from 'react';
import { ShieldAlert, UserCheck, GraduationCap, Sparkles, X, ArrowRight } from 'lucide-react';
import { UserRole } from '../types/index.ts';

interface RoleAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  requiredRole: UserRole;
  currentRole: UserRole;
  actionTitle: string;
  onSwitchRole: (role: UserRole) => void;
}

export const RoleAccessModal: React.FC<RoleAccessModalProps> = ({
  isOpen,
  onClose,
  requiredRole,
  currentRole,
  actionTitle,
  onSwitchRole,
}) => {
  if (!isOpen) return null;

  const getRoleInfo = (role: UserRole) => {
    switch (role) {
      case 'guru':
        return {
          title: 'Guru / Pendidik',
          color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
          icon: <UserCheck className="w-5 h-5 text-emerald-600" />,
          desc: 'Memiliki wewenang mengoreksi tugas, menilai rubrik, membuat tugas baru, mengelola absensi kelas, dan memverifikasi forum.',
        };
      case 'wali':
        return {
          title: 'Orang Tua / Wali Murid',
          color: 'text-purple-700 bg-purple-50 border-purple-200',
          icon: <Sparkles className="w-5 h-5 text-purple-600" />,
          desc: 'Memiliki wewenang memantau perkembangan anak, mengajukan surat izin resmi, memesan konsultasi BK, dan cek administrasi SPP.',
        };
      case 'siswa':
      default:
        return {
          title: 'Siswa / Murid',
          color: 'text-orange-700 bg-orange-50 border-orange-200',
          icon: <GraduationCap className="w-5 h-5 text-[#FF5A26]" />,
          desc: 'Memiliki wewenang belajar modul video, mengumpulkan tugas mandiri, check-in presensi GPS, dan eksplorasi laboratorium sains.',
        };
    }
  };

  const requiredInfo = getRoleInfo(requiredRole);
  const currentInfo = getRoleInfo(currentRole);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative space-y-4">
        {/* Header with Shield Icon */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700 bg-amber-100/70 px-2.5 py-0.5 rounded-full border border-amber-200/60">
                Akses Peran Dibatasi
              </span>
              <h3 className="text-base font-extrabold text-slate-900 mt-1">
                Hak Akses Khusus Diperlukan
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action description */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 space-y-1">
          <p className="font-semibold text-slate-900">
            Aksi yang Anda coba akses:
          </p>
          <p className="font-bold text-[#FF5A26] text-xs">
            "{actionTitle}"
          </p>
          <p className="text-[11px] text-slate-500 pt-1">
            Fitur ini secara khusus dikunci untuk peran <strong className="text-slate-800">{requiredInfo.title}</strong> berdasarkan kebijakan keamanan sistem e-learning (RBAC).
          </p>
        </div>

        {/* Current Role vs Required Role comparison */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-2xl border border-slate-200 bg-slate-50/50">
            <span className="text-[10px] text-slate-400 font-bold block uppercase">Peran Anda Saat Ini:</span>
            <div className="flex items-center gap-1.5 mt-1 font-bold text-slate-800">
              {currentInfo.icon}
              <span className="truncate">{currentInfo.title}</span>
            </div>
          </div>

          <div className={`p-3 rounded-2xl border ${requiredInfo.color}`}>
            <span className="text-[10px] opacity-75 font-bold block uppercase">Peran yang Diizinkan:</span>
            <div className="flex items-center gap-1.5 mt-1 font-bold">
              {requiredInfo.icon}
              <span className="truncate">{requiredInfo.title}</span>
            </div>
          </div>
        </div>

        {/* Role Capability Explanation */}
        <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
          {requiredInfo.desc}
        </p>

        {/* Fast Switch Role CTA Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 cursor-pointer"
          >
            Tutup
          </button>
          <button
            onClick={() => {
              onSwitchRole(requiredRole);
              onClose();
            }}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#FF5A26] hover:bg-[#E84E1D] text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer hover:scale-105"
          >
            <span>Beralih ke Mode {requiredInfo.title}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
