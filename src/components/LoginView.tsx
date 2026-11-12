import React, { useState } from 'react';
import {
  GraduationCap,
  UserCheck,
  ShieldCheck,
  Sparkles,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  X,
  Compass,
  FileText,
  Clock,
  KeyRound,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserRole } from '../types/index.ts';
import { validateLoginCredentials } from '../utils/learningLogic.ts';

interface LoginViewProps {
  onLogin: (role: UserRole) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [activeTab, setActiveTab] = useState<'quick' | 'form'>('quick');
  const [selectedRole, setSelectedRole] = useState<UserRole>('siswa');
  const [identifier, setIdentifier] = useState('siswa@nusantara.edu');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);

  // Quick 1-click login handler
  const handleQuickLogin = (role: UserRole) => {
    setIsLoading(true);
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#FF5A26', '#10B981', '#8B5CF6'],
      });
    } catch (e) {}

    setTimeout(() => {
      setIsLoading(false);
      onLogin(role);
    }, 400);
  };

  // Form submit handler with validation
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const validation = validateLoginCredentials(identifier, password, selectedRole);
    if (!validation.isValid) {
      setErrorMessage(validation.errorMessage || 'Kredensial tidak valid.');
      return;
    }

    setIsLoading(true);
    try {
      confetti({
        particleCount: 50,
        spread: 50,
        origin: { y: 0.5 },
      });
    } catch (e) {}

    setTimeout(() => {
      setIsLoading(false);
      onLogin(validation.matchedRole || selectedRole);
    }, 500);
  };

  // Autofill presets
  const handleApplyPreset = (role: UserRole) => {
    setSelectedRole(role);
    if (role === 'guru') {
      setIdentifier('guru.siti@nusantara.edu');
      setPassword('guru2026');
    } else if (role === 'wali') {
      setIdentifier('wali.hendra@nusantara.edu');
      setPassword('wali2026');
    } else {
      setIdentifier('siswa@nusantara.edu');
      setPassword('password123');
    }
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF9F6] via-[#FDFDFE] to-[#F5F7FB] flex flex-col justify-between p-4 sm:p-6 md:p-8 font-sans selection:bg-orange-100 selection:text-[#FF5A26]">
      {/* Decorative ambient background glows */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Top Brand Bar */}
      <header className="max-w-5xl w-full mx-auto flex items-center justify-between py-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#FFF1EB] flex items-center justify-center text-[#FF5A26] shadow-2xs border border-orange-200/60">
            <svg
              width="24"
              height="24"
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
            <span className="text-xl font-black tracking-tight text-slate-900 block leading-none">
              Foco<span className="text-[#FF5A26]">tech</span>
            </span>
            <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mt-0.5 block">
              Nusantara LMS
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-700 text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Server Aktif & Aman</span>
          </span>
          <span className="text-xs text-slate-500 font-medium bg-white/80 px-3 py-1 rounded-full border border-slate-200/60 shadow-2xs">
            Tahun Ajaran 2026/2027
          </span>
        </div>
      </header>

      {/* Main Center Login Bento Card */}
      <main className="max-w-4xl w-full mx-auto my-6">
        <div className="glass-card rounded-3xl p-6 sm:p-8 md:p-10 border border-white/80 shadow-xl relative overflow-hidden backdrop-blur-xl">
          {/* Subtle top gradient bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#FF5A26] via-amber-400 to-purple-600" />

          {/* Heading Section */}
          <div className="text-center max-w-xl mx-auto space-y-2 mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200/60 text-[#FF5A26] text-xs font-extrabold shadow-2xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sistem E-Learning Sekolah Terpadu</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              Selamat Datang di <span className="text-[#FF5A26]">NusantaraEdu</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-medium">
              Pilih peran Anda atau masukkan kredensial resmi untuk mengakses modul belajar video interaktif, penilaian rubrik, dan portal orang tua.
            </p>

            {/* Mode Tabs */}
            <div className="inline-flex p-1 rounded-2xl bg-slate-100/90 border border-slate-200/80 mt-4">
              <button
                type="button"
                onClick={() => setActiveTab('quick')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'quick'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                ⚡ 1-Klik Masuk Demo Peran (Paling Cepat)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('form')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'form'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                🔑 Masuk Manual Kredensial
              </button>
            </div>
          </div>

          {/* TAB 1: 1-KLIK MASUK DEMO PERAN */}
          {activeTab === 'quick' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="text-center pb-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Pilih Akun Profil Pengguna untuk Masuk Instan
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 1. SISWA CARD */}
                <div
                  onClick={() => handleQuickLogin('siswa')}
                  className="p-5 rounded-3xl border border-orange-200/70 bg-gradient-to-br from-orange-50/70 via-white to-amber-50/40 hover:border-orange-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-4 relative overflow-hidden"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-orange-100 text-[#FF5A26] border border-orange-200">
                        Akun Siswa
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">NIS: 10214890</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <img
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                        alt="Ahmad Rizky Pratama"
                        className="w-12 h-12 rounded-2xl object-cover ring-2 ring-orange-200 group-hover:scale-105 transition-transform"
                      />
                      <div>
                        <h3 className="text-sm font-extrabold text-slate-900 leading-snug group-hover:text-[#FF5A26] transition-colors">
                          Ahmad Rizky Pratama
                        </h3>
                        <p className="text-[11px] text-slate-500">Kelas XII MIPA 1 (Unggulan)</p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                      Modul video audio sinkron, latihan kuis berhadiah XP, lab sains virtual, dan presensi mandiri.
                    </p>
                  </div>

                  <div className="pt-3 border-t border-orange-100 flex items-center justify-between text-xs">
                    <span className="text-[11px] font-bold text-[#FF5A26]">876 XP · 54 Hari Streak</span>
                    <button className="px-3.5 py-1.5 rounded-xl bg-[#FF5A26] hover:bg-[#E84E1D] text-white font-bold text-xs flex items-center gap-1 shadow-2xs group-hover:scale-105 transition-all">
                      <span>Masuk Siswa</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* 2. GURU CARD */}
                <div
                  onClick={() => handleQuickLogin('guru')}
                  className="p-5 rounded-3xl border border-emerald-200/70 bg-gradient-to-br from-emerald-50/70 via-white to-teal-50/40 hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-4 relative overflow-hidden"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">
                        Akun Guru & Pendidik
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">NIP Pengajar</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <img
                        src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
                        alt="Dra. Siti Rahmawati, M.Pd"
                        className="w-12 h-12 rounded-2xl object-cover ring-2 ring-emerald-200 group-hover:scale-105 transition-transform"
                      />
                      <div>
                        <h3 className="text-sm font-extrabold text-slate-900 leading-snug group-hover:text-emerald-700 transition-colors">
                          Dra. Siti Rahmawati, M.Pd
                        </h3>
                        <p className="text-[11px] text-slate-500">Wali Kelas XII MIPA 1</p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                      Koreksi tugas dengan slider rubrik, rekap presensi kelas 1-klik, dan ekspor CSV kehadiran siswa.
                    </p>
                  </div>

                  <div className="pt-3 border-t border-emerald-100 flex items-center justify-between text-xs">
                    <span className="text-[11px] font-bold text-emerald-700">32 Siswa · Rating 4.9 ★</span>
                    <button className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow-2xs group-hover:scale-105 transition-all">
                      <span>Masuk Guru</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* 3. WALI MURID CARD */}
                <div
                  onClick={() => handleQuickLogin('wali')}
                  className="p-5 rounded-3xl border border-purple-200/70 bg-gradient-to-br from-purple-50/70 via-white to-rose-50/40 hover:border-purple-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-4 relative overflow-hidden"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-purple-100 text-purple-800 border border-purple-200">
                        Akun Orang Tua
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">Portal Wali</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <img
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
                        alt="Bpk. Hendra Pratama, S.E"
                        className="w-12 h-12 rounded-2xl object-cover ring-2 ring-purple-200 group-hover:scale-105 transition-transform"
                      />
                      <div>
                        <h3 className="text-sm font-extrabold text-slate-900 leading-snug group-hover:text-purple-700 transition-colors">
                          Bpk. Hendra Pratama, S.E
                        </h3>
                        <p className="text-[11px] text-slate-500">Wali dari Ahmad Rizky Pratama</p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                      Pantau catatan jam masuk anak real-time, evaluasi nilai rapor digital, pengajuan izin, dan SPP.
                    </p>
                  </div>

                  <div className="pt-3 border-t border-purple-100 flex items-center justify-between text-xs">
                    <span className="text-[11px] font-bold text-purple-700">SPP Lunas · Nilai 89.5</span>
                    <button className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1 shadow-2xs group-hover:scale-105 transition-all">
                      <span>Masuk Wali</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MANUAL FORM LOGIN */}
          {activeTab === 'form' && (
            <div className="max-w-md mx-auto space-y-5 animate-in fade-in duration-200">
              {/* Role selector pill */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Pilih Peran Pengguna:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleApplyPreset('siswa')}
                    className={`py-2 px-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      selectedRole === 'siswa'
                        ? 'border-[#FF5A26] bg-[#FFF3EB] text-[#FF5A26] shadow-2xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>Siswa</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyPreset('guru')}
                    className={`py-2 px-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      selectedRole === 'guru'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-2xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Guru</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyPreset('wali')}
                    className={`py-2 px-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      selectedRole === 'wali'
                        ? 'border-purple-500 bg-purple-50 text-purple-700 shadow-2xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Orang Tua</span>
                  </button>
                </div>
              </div>

              {/* Error banner */}
              {errorMessage && (
                <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nomor Induk Siswa (NIS) / NIP / Email Sekolah:
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                    <input
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="Contoh: 10214890 atau siswa@nusantara.edu"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200/90 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#FF5A26] focus:bg-white focus:ring-2 focus:ring-[#FF5A26]/10 transition-all font-medium"
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700">
                      Kata Sandi (Password):
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowForgotPasswordModal(true)}
                      className="text-[11px] text-[#FF5A26] hover:underline font-bold cursor-pointer"
                    >
                      Lupa kata sandi?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Masukkan kata sandi akun Anda"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 border border-slate-200/90 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#FF5A26] focus:bg-white focus:ring-2 focus:ring-[#FF5A26]/10 transition-all font-medium"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember me checkbox */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-600 font-medium select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 accent-[#FF5A26] rounded cursor-pointer"
                    />
                    <span>Ingat sesi saya di perangkat ini</span>
                  </label>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-2xl bg-[#FF5A26] hover:bg-[#E84E1D] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer hover:scale-102 disabled:opacity-50"
                >
                  {isLoading ? (
                    <span>Memverifikasi Akun...</span>
                  ) : (
                    <>
                      <span>Masuk ke Dashboard NusantaraEdu</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </main>

      {/* Footer Feature Highlights */}
      <footer className="max-w-5xl w-full mx-auto py-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
          <div className="p-3 rounded-2xl bg-white/70 border border-slate-100/80 shadow-2xs flex flex-col items-center">
            <span className="w-7 h-7 rounded-lg bg-orange-100 text-[#FF5A26] flex items-center justify-center mb-1.5">
              <Compass className="w-4 h-4" />
            </span>
            <span className="text-[11px] font-extrabold text-slate-800">Modul Video Interaktif</span>
            <span className="text-[10px] text-slate-400">Suara Guru Terpadu</span>
          </div>

          <div className="p-3 rounded-2xl bg-white/70 border border-slate-100/80 shadow-2xs flex flex-col items-center">
            <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center mb-1.5">
              <CheckCircle2 className="w-4 h-4" />
            </span>
            <span className="text-[11px] font-extrabold text-slate-800">Presensi GPS Geofence</span>
            <span className="text-[10px] text-slate-400">Verifikasi Lokasi & Jam</span>
          </div>

          <div className="p-3 rounded-2xl bg-white/70 border border-slate-100/80 shadow-2xs flex flex-col items-center">
            <span className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center mb-1.5">
              <GraduationCap className="w-4 h-4" />
            </span>
            <span className="text-[11px] font-extrabold text-slate-800">Prediksi PTN & Rapor</span>
            <span className="text-[10px] text-slate-400">Simulasi SNBP & UTBK</span>
          </div>

          <div className="p-3 rounded-2xl bg-white/70 border border-slate-100/80 shadow-2xs flex flex-col items-center">
            <span className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center mb-1.5">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <span className="text-[11px] font-extrabold text-slate-800">Portal Wali Murid</span>
            <span className="text-[10px] text-slate-400">Surat Izin & SPP Terhubung</span>
          </div>
        </div>

        <p className="text-center text-[11px] text-slate-400 mt-4 font-medium">
          © 2026 SMAN 1 Unggulan Nusantara Jakarta · Sistem E-Learning & Manajemen Sekolah Terpadu
        </p>
      </footer>

      {/* Forgot Password Modal */}
      {showForgotPasswordModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-orange-50 text-[#FF5A26] flex items-center justify-center">
                  <KeyRound className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-extrabold text-slate-900">Bantuan Lupa Kata Sandi</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowForgotPasswordModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Untuk keamanan akun siswa, pendidik, dan wali murid, reset kata sandi dikelola secara tersentralisasi oleh tim TU & Admin IT Sekolah.
            </p>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700">Pusat Layanan IT:</span>
                <span className="text-[#FF5A26] font-mono font-bold">helpdesk@sman-nusantara.sch.id</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700">Hotline TU & BK:</span>
                <span className="text-slate-800 font-mono font-bold">+62 812-9900-1122</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700">Kata Sandi Demo Default:</span>
                <span className="font-mono bg-white px-2 py-0.5 rounded border text-slate-800 font-bold">password123</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowForgotPasswordModal(false)}
                className="px-4 py-2 rounded-xl bg-[#FF5A26] hover:bg-[#E84E1D] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                Saya Mengerti
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
