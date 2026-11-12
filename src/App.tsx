import React, { useState } from 'react';
import {
  Sidebar,
} from './components/Sidebar.tsx';
import {
  Header,
} from './components/Header.tsx';
import {
  RightProfilePanel,
} from './components/RightProfilePanel.tsx';
import {
  ContinueLearningCard,
} from './components/ContinueLearningCard.tsx';
import {
  RecommendedCourseCard,
} from './components/RecommendedCourseCard.tsx';
import {
  InteractiveLessonModal,
} from './components/InteractiveLessonModal.tsx';
import {
  AssignmentView,
} from './components/AssignmentView.tsx';
import {
  LeaderboardView,
} from './components/LeaderboardView.tsx';
import {
  SkillGraphView,
} from './components/SkillGraphView.tsx';
import {
  CertificatesView,
} from './components/CertificatesView.tsx';
import {
  MessagesView,
} from './components/MessagesView.tsx';
import {
  ExamPortalModal,
} from './components/ExamPortalModal.tsx';
import {
  AttendanceView,
} from './components/AttendanceView.tsx';
import {
  AchievementsView,
} from './components/AchievementsView.tsx';
import {
  ParentPortalView,
} from './components/ParentPortalView.tsx';
import {
  VirtualLabView,
} from './components/VirtualLabView.tsx';
import {
  DocumentationView,
} from './components/DocumentationView.tsx';
import {
  AcademicCalendarView,
} from './components/AcademicCalendarView.tsx';
import {
  CircularProgressBar,
} from './components/CircularProgressBar.tsx';
import {
  CommunityForumView,
} from './components/CommunityForumView.tsx';
import {
  PtnPredictorAndReportView,
} from './components/PtnPredictorAndReportView.tsx';
import {
  RoleAccessModal,
} from './components/RoleAccessModal.tsx';
import {
  LoginView,
} from './components/LoginView.tsx';

import {
  INITIAL_USER,
  INITIAL_TEACHER,
  INITIAL_PARENT,
  COURSES_DATA,
  CONTINUE_LEARNING_COURSES,
  ASSIGNMENTS_DATA,
  LEADERBOARD_DATA,
  COMPETENCY_SCORES,
  CERTIFICATES_DATA,
  INITIAL_CHAT_MESSAGES,
  ATTENDANCE_HISTORY,
  INITIAL_COMMUNITY_QUESTIONS,
} from './data/mockData.ts';
import {
  Course,
  Assignment,
  UserRole,
  UserProfile,
  ChatMessage,
  CommunityQuestion,
} from './types/index.ts';
import { filterCourses } from './utils/learningLogic.ts';
import {
  Compass,
  Code2,
  Binary,
  Layers,
  Sparkles,
  ArrowRight,
  Filter,
  CheckCircle2,
  Clock,
  TrendingUp,
  Award,
  BookOpen,
  Calendar,
  GraduationCap,
  FlaskConical,
  Users,
  ShieldCheck,
  ShieldAlert,
  UserCheck,
  Download,
  CreditCard,
  FileText,
  Sliders,
  Check,
} from 'lucide-react';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [currentTab, setCurrentTab] = useState<string>('overview');
  const [userRole, setUserRole] = useState<UserRole>('siswa');
  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_USER);
  const [courses, setCourses] = useState<Course[]>(COURSES_DATA);
  const [assignments, setAssignments] = useState<Assignment[]>(ASSIGNMENTS_DATA);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('semua');
  const [communityQuestions, setCommunityQuestions] = useState<CommunityQuestion[]>(INITIAL_COMMUNITY_QUESTIONS);

  // Modals & Drawers
  const [selectedCourseForModal, setSelectedCourseForModal] = useState<Course | null>(null);
  const [showExamPortal, setShowExamPortal] = useState<boolean>(false);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState<boolean>(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [teacherMarkedAllToday, setTeacherMarkedAllToday] = useState<boolean>(false);

  // Role Access Guard Modal State
  const [roleModalState, setRoleModalState] = useState<{
    isOpen: boolean;
    requiredRole: UserRole;
    actionTitle: string;
  }>({
    isOpen: false,
    requiredRole: 'guru',
    actionTitle: '',
  });

  const triggerRoleGuard = (requiredRole: UserRole, actionTitle: string) => {
    setRoleModalState({
      isOpen: true,
      requiredRole,
      actionTitle,
    });
  };

  // Switch role handler
  const handleSwitchRole = (role: UserRole) => {
    setUserRole(role);
    if (role === 'guru') {
      setUserProfile(INITIAL_TEACHER);
      if (currentTab === 'parent-portal') setCurrentTab('overview');
    } else if (role === 'wali') {
      setUserProfile(INITIAL_PARENT);
      setCurrentTab('parent-portal');
    } else {
      setUserProfile(INITIAL_USER);
      if (currentTab === 'parent-portal') setCurrentTab('overview');
    }
  };

  // Login handler
  const handleLogin = (role: UserRole) => {
    handleSwitchRole(role);
    setIsAuthenticated(true);
  };

  // Logout handler
  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  // Gamification points addition
  const handleAwardPoints = (addedPoints: number) => {
    setUserProfile((prev) => ({
      ...prev,
      points: prev.points + addedPoints,
    }));
  };

  // Complete lesson
  const handleCompleteLesson = (courseId: string, lessonId: string) => {
    setCourses((prev) =>
      prev.map((c) => {
        if (c.id === courseId) {
          const nextCompleted = Math.min(c.totalLessons, c.completedLessons + 1);
          return {
            ...c,
            completedLessons: nextCompleted,
            progressPercent: Math.round((nextCompleted / c.totalLessons) * 100),
          };
        }
        return c;
      })
    );
  };

  // Submit assignment
  const handleSubmitAssignment = (id: string, answerText: string) => {
    setAssignments((prev) =>
      prev.map((asg) =>
        asg.id === id
          ? {
              ...asg,
              status: 'menunggu_dinilai',
              studentAnswer: answerText,
              submittedAt: 'Baru saja',
            }
          : asg
      )
    );
  };

  // Grade assignment (Teacher)
  const handleGradeAssignment = (id: string, score: number, feedback: string) => {
    setAssignments((prev) =>
      prev.map((asg) =>
        asg.id === id
          ? {
              ...asg,
              status: 'selesai_dinilai',
              score,
              teacherFeedback: feedback,
            }
          : asg
      )
    );
  };

  // Add new assignment (Teacher)
  const handleAddNewAssignment = (newAsg: Assignment) => {
    setAssignments((prev) => [newAsg, ...prev]);
  };

  // Send message
  const handleSendMessage = (text: string) => {
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: userProfile.name,
      role: userProfile.role,
      text,
      time: 'Baru saja',
      isCurrent: true,
    };
    setChatMessages((prev) => [...prev, newMsg]);
  };

  const filteredCoursesList = filterCourses(courses, searchQuery, selectedCategory);

  // If user is not authenticated, display dedicated Login & Authentication View
  if (!isAuthenticated) {
    return <LoginView onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-[#FDFDFE] flex flex-col font-sans">
      {/* 1. Left Fixed Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={(tabId) => setCurrentTab(tabId)}
        unreadCount={5}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        onOpenExamPortal={() => setShowExamPortal(true)}
        userRole={userRole}
        onLogout={handleLogout}
      />

      {/* 2. Main Layout Container (offset by sidebar width on desktop) */}
      <div className="lg:pl-64 flex-1 flex flex-col min-w-0">
        {/* Sticky Top Bar */}
        <Header
          currentTabName={
            currentTab === 'overview'
              ? userRole === 'guru'
                ? 'Dashboard Pengajar'
                : 'Dashboard'
              : currentTab === 'calendar'
              ? 'Jadwal Kelas & Kalender Akademik'
              : currentTab === 'parent-portal'
              ? 'Portal Orang Tua / Wali'
              : currentTab === 'lab'
              ? 'Laboratorium Virtual Sains'
              : currentTab === 'docs'
              ? 'Buku Panduan & Dokumentasi'
              : currentTab === 'lessons'
              ? 'Mata Pelajaran'
              : currentTab === 'assignments'
              ? userRole === 'guru'
                ? 'Evaluasi Tugas Siswa'
                : 'Tugas & Ujian'
              : currentTab === 'attendance'
              ? 'Presensi & Kehadiran'
              : currentTab === 'achievements'
              ? 'Pencapaian & Badge'
              : currentTab === 'leaderboard'
              ? 'Papan Peringkat'
              : currentTab === 'skill-graph'
              ? 'Grafik Kemampuan & Radar'
              : currentTab === 'certificates'
              ? 'Sertifikat'
              : currentTab === 'messages'
              ? 'Pesan & Diskusi'
              : currentTab === 'community'
              ? 'Forum Komunitas & Tanya Jawab'
              : currentTab === 'ptn-report'
              ? 'Prediksi Kelulusan PTN & Rapor Digital'
              : 'Pengaturan'
          }
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          currentUser={userProfile}
          currentTab={currentTab}
          onSwitchRole={handleSwitchRole}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onOpenMessagesTab={() => setCurrentTab('messages')}
          onNavigateTab={(target) => setCurrentTab(target)}
          onLogout={handleLogout}
        />

        {/* 3. Central Working Canvas + Collapsible Right Profile Panel */}
        <div className="flex-1 flex flex-col xl:flex-row min-w-0">
          {/* Main Content Area */}
          <main className="flex-1 min-w-0 p-4 md:p-8 space-y-8">
            {/* TAB: OVERVIEW (MODERN BENTO GRID ARCHITECTURE DIVERSIFIED PER ROLE) */}
            {currentTab === 'overview' && (
              userRole === 'guru' ? (
                /* ================= 1. TEACHER BENTO DASHBOARD (Dra. Siti Rahmawati, M.Pd) ================= */
                <div className="space-y-8 animate-in fade-in duration-200">
                  {/* Hero Banner for Teacher (Emerald / Teal Glassmorphic Palette) */}
                  <div className="glass-card rounded-3xl p-6 md:p-8 relative overflow-hidden bg-gradient-to-br from-emerald-50/90 via-teal-50/50 to-emerald-50/70 border border-emerald-200/70 shadow-xs">
                    <div className="absolute -top-16 -right-16 w-52 h-52 rounded-full bg-gradient-to-br from-emerald-200/30 to-teal-200/10 blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-16 -left-16 w-52 h-52 rounded-full bg-gradient-to-tr from-teal-200/30 to-emerald-200/10 blur-3xl pointer-events-none" />

                    <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      <div className="space-y-2 max-w-2xl">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-emerald-700 border border-emerald-200/60 text-xs font-extrabold shadow-2xs">
                            <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Portal Pengajar & Wali Kelas XII MIPA 1</span>
                          </span>
                          <span className="text-[11px] font-bold text-slate-500 bg-white/60 px-2.5 py-0.5 rounded-full border border-white/80">
                            NIP: 19820315 200501 2 004
                          </span>
                        </div>

                        <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                          Selamat Datang, <span className="text-emerald-700">{userProfile.name}</span>! 👩‍🏫
                        </h1>
                        <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-medium">
                          Kelola 32 siswa bimbingan, periksa 12 berkas tugas masuk dengan rubrik analitik, kelola rekapitulasi kehadiran kelas, dan verifikasi diskusi tanya jawab siswa.
                        </p>

                        {/* Teacher Fast Action Pills */}
                        <div className="flex flex-wrap items-center gap-2 pt-2">
                          <button
                            onClick={() => setCurrentTab('assignments')}
                            className="px-3.5 py-1.5 rounded-2xl bg-white/90 hover:bg-white text-slate-700 text-xs font-bold border border-slate-200/80 shadow-2xs flex items-center gap-1.5 transition-all hover:scale-105 cursor-pointer"
                          >
                            <Sliders className="w-3.5 h-3.5 text-[#FF5A26]" />
                            <span>Koreksi 12 Tugas Masuk</span>
                          </button>
                          <button
                            onClick={() => setCurrentTab('attendance')}
                            className="px-3.5 py-1.5 rounded-2xl bg-white/90 hover:bg-white text-slate-700 text-xs font-bold border border-slate-200/80 shadow-2xs flex items-center gap-1.5 transition-all hover:scale-105 cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Presensi Kelas XII MIPA 1</span>
                          </button>
                          <button
                            onClick={() => setCurrentTab('community')}
                            className="px-3.5 py-1.5 rounded-2xl bg-white/90 hover:bg-white text-slate-700 text-xs font-bold border border-slate-200/80 shadow-2xs flex items-center gap-1.5 transition-all hover:scale-105 cursor-pointer"
                          >
                            <Users className="w-3.5 h-3.5 text-blue-600" />
                            <span>Moderasi Forum (4 Tanya Jawab)</span>
                          </button>
                          <button
                            onClick={() => setCurrentTab('calendar')}
                            className="px-3.5 py-1.5 rounded-2xl bg-white/90 hover:bg-white text-slate-700 text-xs font-bold border border-slate-200/80 shadow-2xs flex items-center gap-1.5 transition-all hover:scale-105 cursor-pointer"
                          >
                            <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                            <span>Jadwal Mengajar Hari Ini</span>
                          </button>
                          <button
                            onClick={() => triggerRoleGuard('siswa', 'Pengumpulan Tugas & Kuis Siswa')}
                            className="px-3.5 py-1.5 rounded-2xl bg-emerald-100/70 hover:bg-emerald-200/70 text-emerald-800 text-xs font-bold border border-emerald-300/60 shadow-2xs flex items-center gap-1.5 transition-all hover:scale-105 cursor-pointer"
                            title="Uji coba proteksi hak akses peran"
                          >
                            <ShieldAlert className="w-3.5 h-3.5 text-emerald-700" />
                            <span>Uji Guard Akses Peran</span>
                          </button>
                        </div>
                      </div>

                      {/* Teacher Profile Summary Badge */}
                      <div className="shrink-0 flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 bg-white/80 backdrop-blur-md p-4 rounded-3xl border border-white/80 shadow-xs">
                        <div className="flex items-center gap-3">
                          <img
                            src={userProfile.avatar}
                            alt={userProfile.name}
                            className="w-12 h-12 rounded-2xl object-cover ring-2 ring-emerald-200"
                          />
                          <div>
                            <p className="text-xs font-extrabold text-slate-900 leading-tight">{userProfile.name}</p>
                            <p className="text-[11px] text-emerald-700 font-bold">{userProfile.className}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-black flex items-center gap-1">
                            <Award className="w-3.5 h-3.5" />
                            <span>32 Siswa Bimbingan</span>
                          </span>
                          <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold">
                            Rating 4.9 ★
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 2. TEACHER KPI ROW (Circular Rings for Teacher Responsibilities) */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* KPI 1: Tugas Perlu Dikoreksi */}
                    <div
                      onClick={() => setCurrentTab('assignments')}
                      className="glass-card glass-card-hover rounded-3xl p-5 flex items-center justify-between cursor-pointer group"
                    >
                      <div className="space-y-1">
                        <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-orange-100/70 text-[#FF5A26] border border-orange-200/60">
                          Evaluasi Berkas
                        </span>
                        <h4 className="text-base font-extrabold text-slate-900 group-hover:text-[#FF5A26] transition-colors">
                          12 Perlu Dikoreksi
                        </h4>
                        <p className="text-xs text-slate-500">
                          85% dari total tugas ternilai
                        </p>
                        <span className="text-[11px] font-bold text-[#FF5A26] flex items-center gap-1 pt-1">
                          <Clock className="w-3.5 h-3.5" /> 3 Tugas Baru Hari Ini
                        </span>
                      </div>
                      <CircularProgressBar
                        value={85}
                        size={58}
                        strokeWidth={5}
                        color="#FF5A26"
                        trackColor="#FFE6D9"
                      />
                    </div>

                    {/* KPI 2: Kehadiran Siswa Kelas XII MIPA 1 */}
                    <div
                      onClick={() => setCurrentTab('attendance')}
                      className="glass-card glass-card-hover rounded-3xl p-5 flex items-center justify-between cursor-pointer group"
                    >
                      <div className="space-y-1">
                        <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100/70 text-emerald-700 border border-emerald-200/60">
                          Presensi Hari Ini
                        </span>
                        <h4 className="text-base font-extrabold text-slate-900 group-hover:text-emerald-600 transition-colors">
                          Kehadiran 98.4%
                        </h4>
                        <p className="text-xs text-slate-500">
                          31 Hadir · 1 Izin OSN · 0 Alpa
                        </p>
                        <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1 pt-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Geofence Lab Aktif
                        </span>
                      </div>
                      <CircularProgressBar
                        value={98}
                        size={58}
                        strokeWidth={5}
                        color="#10B981"
                        trackColor="#D1FAE5"
                      />
                    </div>

                    {/* KPI 3: Forum Tanya Jawab Menunggu Respon */}
                    <div
                      onClick={() => setCurrentTab('community')}
                      className="glass-card glass-card-hover rounded-3xl p-5 flex items-center justify-between cursor-pointer group"
                    >
                      <div className="space-y-1">
                        <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-100/70 text-blue-700 border border-blue-200/60">
                          Forum Siswa
                        </span>
                        <h4 className="text-base font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">
                          4 Menunggu Verifikasi
                        </h4>
                        <p className="text-xs text-slate-500">
                          Pertanyaan kalkulus & optika
                        </p>
                        <span className="text-[11px] font-bold text-blue-600 flex items-center gap-1 pt-1">
                          <Users className="w-3.5 h-3.5" /> Butuh Badge Guru
                        </span>
                      </div>
                      <CircularProgressBar
                        value={75}
                        size={58}
                        strokeWidth={5}
                        color="#3B82F6"
                        trackColor="#DBEAFE"
                      />
                    </div>

                    {/* KPI 4: Rata-Rata Nilai Rapor Kelas */}
                    <div
                      onClick={() => setCurrentTab('ptn-report')}
                      className="glass-card glass-card-hover rounded-3xl p-5 flex items-center justify-between cursor-pointer group"
                    >
                      <div className="space-y-1">
                        <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-100/70 text-indigo-700 border border-indigo-200/60">
                          Capaian Kelas
                        </span>
                        <h4 className="text-base font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          Rata-Rata 87.5 / 100
                        </h4>
                        <p className="text-xs text-slate-500">
                          32 Siswa Lolos KKM 75
                        </p>
                        <span className="text-[11px] font-bold text-indigo-600 flex items-center gap-1 pt-1">
                          <TrendingUp className="w-3.5 h-3.5" /> +3.8 Poin Semester
                        </span>
                      </div>
                      <CircularProgressBar
                        value={88}
                        size={58}
                        strokeWidth={5}
                        color="#6366F1"
                        trackColor="#E0E7FF"
                      />
                    </div>
                  </div>

                  {/* 3. BENTO SECTION: ANTREAN TUGAS SISWA PERLU DIKOREKSI */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                          Antrean Pengumpulan Tugas Siswa
                        </h2>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                          Tugas yang diserahkan siswa dan siap dinilai dengan slider rubrik penilaian objektif
                        </p>
                      </div>
                      <button
                        onClick={() => setCurrentTab('assignments')}
                        className="text-xs font-bold text-[#FF5A26] hover:text-[#E84E1D] flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <span>Buka Tab Evaluasi</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Submission 1: Ahmad Rizky */}
                      <div className="glass-card rounded-3xl p-5 border border-slate-200/80 hover:border-orange-200 space-y-3 transition-all">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-orange-100 text-[#FF5A26]">
                            Matematika Peminatan
                          </span>
                          <span className="text-[11px] font-bold text-slate-400">10 mnt lalu</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <img
                            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                            alt="Ahmad Rizky Pratama"
                            className="w-10 h-10 rounded-2xl object-cover ring-2 ring-orange-200"
                          />
                          <div>
                            <h4 className="text-xs font-extrabold text-slate-900">Ahmad Rizky Pratama</h4>
                            <p className="text-[10px] text-slate-500 font-mono">NIS: 10214890 · XII MIPA 1</p>
                          </div>
                        </div>
                        <p className="text-xs text-slate-700 font-medium">
                          Modul 4: Turunan Parsial, Gradien m, dan Garis Singgung Kurva
                        </p>
                        <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                          <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                            <FileText className="w-3.5 h-3.5" /> Berkas PDF Terlampir
                          </span>
                          <button
                            onClick={() => setCurrentTab('assignments')}
                            className="px-3 py-1.5 rounded-xl bg-[#FF5A26] hover:bg-[#E84E1D] text-white text-xs font-bold transition-all shadow-2xs cursor-pointer hover:scale-105"
                          >
                            Koreksi Rubrik
                          </button>
                        </div>
                      </div>

                      {/* Submission 2: Siti Nurhaliza */}
                      <div className="glass-card rounded-3xl p-5 border border-slate-200/80 hover:border-blue-200 space-y-3 transition-all">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700">
                            Fisika Gelombang
                          </span>
                          <span className="text-[11px] font-bold text-slate-400">45 mnt lalu</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <img
                            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"
                            alt="Siti Nurhaliza"
                            className="w-10 h-10 rounded-2xl object-cover ring-2 ring-blue-200"
                          />
                          <div>
                            <h4 className="text-xs font-extrabold text-slate-900">Siti Nurhaliza</h4>
                            <p className="text-[10px] text-slate-500 font-mono">NIS: 10214896 · XII MIPA 1</p>
                          </div>
                        </div>
                        <p className="text-xs text-slate-700 font-medium">
                          Praktikum Virtual: Interferensi Celah Ganda dan Kisi Difraksi Laser
                        </p>
                        <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                          <span className="text-[11px] text-blue-600 font-bold flex items-center gap-1">
                            <FileText className="w-3.5 h-3.5" /> Laporan Praktikum
                          </span>
                          <button
                            onClick={() => setCurrentTab('assignments')}
                            className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-2xs cursor-pointer hover:scale-105"
                          >
                            Koreksi Rubrik
                          </button>
                        </div>
                      </div>

                      {/* Submission 3: Dimas Bagaskara */}
                      <div className="glass-card rounded-3xl p-5 border border-slate-200/80 hover:border-emerald-200 space-y-3 transition-all">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                            Pemrograman Web
                          </span>
                          <span className="text-[11px] font-bold text-slate-400">2 jam lalu</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <img
                            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
                            alt="Dimas Bagaskara"
                            className="w-10 h-10 rounded-2xl object-cover ring-2 ring-emerald-200"
                          />
                          <div>
                            <h4 className="text-xs font-extrabold text-slate-900">Dimas Bagaskara</h4>
                            <p className="text-[10px] text-slate-500 font-mono">NIS: 10214891 · XII MIPA 1</p>
                          </div>
                        </div>
                        <p className="text-xs text-slate-700 font-medium">
                          Proyek Frontend: Arsitektur Bento Grid & Komponen Reaktif TypeScript
                        </p>
                        <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                          <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                            <FileText className="w-3.5 h-3.5" /> Source Code ZIP
                          </span>
                          <button
                            onClick={() => setCurrentTab('assignments')}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-2xs cursor-pointer hover:scale-105"
                          >
                            Koreksi Rubrik
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 4. BENTO ROW: JADWAL MENGAJAR HARI INI & AKSI CEPAT ADMINISTRASI GURU */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Schedule Card */}
                    <div className="glass-card rounded-3xl p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                            <Calendar className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="text-sm font-extrabold text-slate-900">Jadwal Mengajar Hari Ini</h3>
                            <p className="text-[11px] text-slate-400 font-medium">Rabu, 04 November 2026</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                          3 Sesi Aktif
                        </span>
                      </div>

                      <div className="space-y-2.5 text-xs">
                        <div className="p-3 rounded-2xl bg-slate-50/80 border border-slate-100 flex items-center justify-between">
                          <div>
                            <p className="font-extrabold text-slate-900">Fisika Gelombang & Optika</p>
                            <p className="text-[11px] text-slate-500">Kelas XII MIPA 1 · Lab Fisika Terpadu</p>
                          </div>
                          <span className="font-mono font-bold text-slate-600 bg-white px-2.5 py-1 rounded-xl border border-slate-200">
                            07:30 - 09:00 WIB
                          </span>
                        </div>

                        <div className="p-3 rounded-2xl bg-slate-50/80 border border-slate-100 flex items-center justify-between">
                          <div>
                            <p className="font-extrabold text-slate-900">Matematika Peminatan (Kalkulus)</p>
                            <p className="text-[11px] text-slate-500">Kelas XII MIPA 2 · Ruang Teori 304</p>
                          </div>
                          <span className="font-mono font-bold text-slate-600 bg-white px-2.5 py-1 rounded-xl border border-slate-200">
                            10:15 - 11:45 WIB
                          </span>
                        </div>

                        <div className="p-3 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex items-center justify-between">
                          <div>
                            <p className="font-extrabold text-indigo-950">Konsultasi Akademik Wali Murid</p>
                            <p className="text-[11px] text-indigo-700">Ruang BK & Google Meet Daring</p>
                          </div>
                          <span className="font-mono font-bold text-indigo-700 bg-white px-2.5 py-1 rounded-xl border border-indigo-200">
                            13:00 - 14:30 WIB
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Admin Actions Card */}
                    <div className="glass-card rounded-3xl p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                            <CheckCircle2 className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="text-sm font-extrabold text-slate-900">Aksi Cepat Administrasi Kelas</h3>
                            <p className="text-[11px] text-slate-400 font-medium">Otomatisasi harian guru dan wali kelas</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2.5">
                        <button
                          onClick={() => {
                            setTeacherMarkedAllToday(true);
                          }}
                          className={`w-full p-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                            teacherMarkedAllToday
                              ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                              : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <Check className="w-4 h-4" />
                            {teacherMarkedAllToday ? 'Seluruh 32 Siswa Telah Ditandai Hadir' : 'Tandai Hadir Seluruh Siswa Hari Ini (32 Siswa)'}
                          </span>
                          <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-mono">1-Klik</span>
                        </button>

                        <button
                          onClick={() => {
                            let csv = "NIS,Nama Siswa,Kelas,Status Presensi,Waktu Check-In,Keterangan\n";
                            csv += "10214890,\"Ahmad Rizky Pratama\",\"XII MIPA 1\",HADIR,\"07:14 WIB\",\"Tepat Waktu\"\n";
                            csv += "10214891,\"Dimas Bagaskara\",\"XII MIPA 1\",HADIR,\"07:02 WIB\",\"Tepat Waktu\"\n";
                            csv += "10214892,\"Nabila Nurul Fadillah\",\"XII MIPA 1\",HADIR,\"06:55 WIB\",\"Tepat Waktu\"\n";
                            csv += "10214893,\"Muhammad Farhan\",\"XII MIPA 1\",IZIN,\"-\",\"Delegasi Olimpiade OSN\"\n";
                            csv += "10214894,\"Zahra Annisa Putri\",\"XII MIPA 1\",HADIR,\"07:18 WIB\",\"Tepat Waktu\"\n";
                            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                            const url = URL.createObjectURL(blob);
                            const link = document.createElement('a');
                            link.href = url;
                            link.setAttribute('download', `Rekap_Presensi_XII_MIPA1_${new Date().toISOString().slice(0, 10)}.csv`);
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                          }}
                          className="w-full p-3 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all flex items-center justify-between cursor-pointer"
                        >
                          <span className="flex items-center gap-2">
                            <Download className="w-4 h-4 text-[#FF5A26]" />
                            <span>Unduh Rekapitulasi Presensi Kelas (CSV)</span>
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">.csv</span>
                        </button>

                        <button
                          onClick={() => setCurrentTab('assignments')}
                          className="w-full p-3 rounded-2xl border border-slate-200 bg-white hover:bg-orange-50 text-slate-700 hover:text-orange-700 text-xs font-bold transition-all flex items-center justify-between cursor-pointer"
                        >
                          <span className="flex items-center gap-2">
                            <Sliders className="w-4 h-4 text-orange-500" />
                            <span>Buat Penugasan / Ujian Baru untuk Siswa</span>
                          </span>
                          <span className="text-xs">➔</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : userRole === 'wali' ? (
                /* ================= 2. PARENT BENTO DASHBOARD (Bpk. Hendra Pratama) ================= */
                <div className="space-y-8 animate-in fade-in duration-200">
                  {/* Hero Banner for Parent (Purple & Rose Glassmorphism) */}
                  <div className="glass-card rounded-3xl p-6 md:p-8 relative overflow-hidden bg-gradient-to-br from-purple-50/90 via-rose-50/50 to-purple-50/70 border border-purple-200/70 shadow-xs">
                    <div className="absolute -top-16 -right-16 w-52 h-52 rounded-full bg-gradient-to-br from-purple-200/30 to-rose-200/10 blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-16 -left-16 w-52 h-52 rounded-full bg-gradient-to-tr from-rose-200/30 to-purple-200/10 blur-3xl pointer-events-none" />

                    <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      <div className="space-y-2 max-w-2xl">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-purple-700 border border-purple-200/60 text-xs font-extrabold shadow-2xs">
                            <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                            <span>Portal Pemantauan Orang Tua & Wali Murid</span>
                          </span>
                          <span className="text-[11px] font-bold text-slate-500 bg-white/60 px-2.5 py-0.5 rounded-full border border-white/80">
                            Wali dari: Ahmad Rizky Pratama (XII MIPA 1)
                          </span>
                        </div>

                        <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                          Selamat Datang, <span className="text-purple-700">{userProfile.name}</span>! 👨‍💼
                        </h1>
                        <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-medium">
                          Pantau presensi harian putra Anda secara real-time, evaluasi grafik nilai akademik rapor, ajukan surat permohonan izin/sakit digital, dan terhubung langsung dengan wali kelas.
                        </p>

                        {/* Parent Fast Action Pills */}
                        <div className="flex flex-wrap items-center gap-2 pt-2">
                          <button
                            onClick={() => setCurrentTab('parent-portal')}
                            className="px-3.5 py-1.5 rounded-2xl bg-white/90 hover:bg-white text-slate-700 text-xs font-bold border border-slate-200/80 shadow-2xs flex items-center gap-1.5 transition-all hover:scale-105 cursor-pointer"
                          >
                            <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                            <span>Buka Portal Khusus Orang Tua</span>
                          </button>
                          <button
                            onClick={() => setCurrentTab('ptn-report')}
                            className="px-3.5 py-1.5 rounded-2xl bg-white/90 hover:bg-white text-slate-700 text-xs font-bold border border-slate-200/80 shadow-2xs flex items-center gap-1.5 transition-all hover:scale-105 cursor-pointer"
                          >
                            <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
                            <span>Prediksi PTN & Rapor Anak</span>
                          </button>
                          <button
                            onClick={() => setCurrentTab('messages')}
                            className="px-3.5 py-1.5 rounded-2xl bg-white/90 hover:bg-white text-slate-700 text-xs font-bold border border-slate-200/80 shadow-2xs flex items-center gap-1.5 transition-all hover:scale-105 cursor-pointer"
                          >
                            <Users className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Konsultasi Wali Kelas (Bu Siti)</span>
                          </button>
                          <button
                            onClick={() => triggerRoleGuard('guru', 'Pemberian Nilai Rubrik Guru')}
                            className="px-3.5 py-1.5 rounded-2xl bg-purple-100/70 hover:bg-purple-200/70 text-purple-800 text-xs font-bold border border-purple-300/60 shadow-2xs flex items-center gap-1.5 transition-all hover:scale-105 cursor-pointer"
                            title="Uji coba proteksi hak akses peran"
                          >
                            <ShieldAlert className="w-3.5 h-3.5 text-purple-700" />
                            <span>Uji Guard Akses Peran</span>
                          </button>
                        </div>
                      </div>

                      {/* Parent Child Profile Snapshot Badge */}
                      <div className="shrink-0 flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 bg-white/80 backdrop-blur-md p-4 rounded-3xl border border-white/80 shadow-xs">
                        <div className="flex items-center gap-3">
                          <img
                            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                            alt="Ahmad Rizky Pratama"
                            className="w-12 h-12 rounded-2xl object-cover ring-2 ring-purple-200"
                          />
                          <div>
                            <p className="text-xs font-extrabold text-slate-900 leading-tight">Ahmad Rizky Pratama</p>
                            <p className="text-[11px] text-slate-500 font-medium">Kelas XII MIPA 1 · NIS: 10214890</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-black flex items-center gap-1">
                            <CreditCard className="w-3.5 h-3.5" />
                            <span>SPP: Lunas</span>
                          </span>
                          <span className="px-2.5 py-1 rounded-full bg-purple-100 text-purple-800 text-[11px] font-bold">
                            Juara 3 Kelas
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 2. PARENT KPI ROW */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* KPI 1: Kehadiran Hari Ini */}
                    <div
                      onClick={() => setCurrentTab('attendance')}
                      className="glass-card glass-card-hover rounded-3xl p-5 flex items-center justify-between cursor-pointer group"
                    >
                      <div className="space-y-1">
                        <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100/70 text-emerald-700 border border-emerald-200/60">
                          Presensi Hari Ini
                        </span>
                        <h4 className="text-base font-extrabold text-slate-900 group-hover:text-emerald-600 transition-colors">
                          Hadir 06:55 WIB
                        </h4>
                        <p className="text-xs text-slate-500">
                          Geofence GPS Terverifikasi
                        </p>
                        <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1 pt-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> 92 dari 94 hari masuk
                        </span>
                      </div>
                      <CircularProgressBar
                        value={98}
                        size={58}
                        strokeWidth={5}
                        color="#10B981"
                        trackColor="#D1FAE5"
                      />
                    </div>

                    {/* KPI 2: Rata-Rata Nilai Rapor */}
                    <div
                      onClick={() => setCurrentTab('ptn-report')}
                      className="glass-card glass-card-hover rounded-3xl p-5 flex items-center justify-between cursor-pointer group"
                    >
                      <div className="space-y-1">
                        <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-100/70 text-indigo-700 border border-indigo-200/60">
                          Nilai Rapor
                        </span>
                        <h4 className="text-base font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          Rata-Rata 89.5 / 100
                        </h4>
                        <p className="text-xs text-slate-500">
                          Predikat A (Sangat Memuaskan)
                        </p>
                        <span className="text-[11px] font-bold text-indigo-600 flex items-center gap-1 pt-1">
                          <Award className="w-3.5 h-3.5" /> Peringkat 3 di Kelas
                        </span>
                      </div>
                      <CircularProgressBar
                        value={90}
                        size={58}
                        strokeWidth={5}
                        color="#6366F1"
                        trackColor="#E0E7FF"
                      />
                    </div>

                    {/* KPI 3: Status Administrasi SPP */}
                    <div
                      onClick={() => setCurrentTab('parent-portal')}
                      className="glass-card glass-card-hover rounded-3xl p-5 flex items-center justify-between cursor-pointer group"
                    >
                      <div className="space-y-1">
                        <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100/70 text-emerald-700 border border-emerald-200/60">
                          Administrasi SPP
                        </span>
                        <h4 className="text-base font-extrabold text-slate-900 group-hover:text-emerald-600 transition-colors">
                          Status: Lunas
                        </h4>
                        <p className="text-xs text-slate-500">
                          Semester Ganjil 2026/2027
                        </p>
                        <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1 pt-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Bukti Kwitansi Tersedia
                        </span>
                      </div>
                      <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 font-black">
                        <CreditCard className="w-6 h-6" />
                      </div>
                    </div>

                    {/* KPI 4: Target UTBK / PTN */}
                    <div
                      onClick={() => setCurrentTab('ptn-report')}
                      className="glass-card glass-card-hover rounded-3xl p-5 flex items-center justify-between cursor-pointer group"
                    >
                      <div className="space-y-1">
                        <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-purple-100/70 text-purple-700 border border-purple-200/60">
                          Peluang PTN
                        </span>
                        <h4 className="text-base font-extrabold text-slate-900 group-hover:text-purple-600 transition-colors">
                          88.5% Probabilitas
                        </h4>
                        <p className="text-xs text-slate-500">
                          ITB - Teknik Informatika
                        </p>
                        <span className="text-[11px] font-bold text-purple-600 flex items-center gap-1 pt-1">
                          <GraduationCap className="w-3.5 h-3.5" /> Peluang Tinggi Aman
                        </span>
                      </div>
                      <CircularProgressBar
                        value={89}
                        size={58}
                        strokeWidth={5}
                        color="#8B5CF6"
                        trackColor="#EDE9FE"
                      />
                    </div>
                  </div>

                  {/* 3. BENTO SECTION: AKTIVITAS BELAJAR & KEHADIRAN AHMAD RIZKY */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Activity Feed */}
                    <div className="glass-card rounded-3xl p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                            <Clock className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="text-sm font-extrabold text-slate-900">Aktivitas Belajar Ananda Hari Ini</h3>
                            <p className="text-[11px] text-slate-400 font-medium">Catatan real-time otomatis dari sistem sekolah</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3 text-xs">
                        <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                          <div className="space-y-0.5">
                            <p className="font-extrabold text-slate-900">Check-in Presensi Mandiri Terverifikasi</p>
                            <p className="text-slate-600">Ahmad Rizky telah tiba di sekolah pukul 06:55 WIB melalui gerbang utama Lab Fisika Terpadu.</p>
                            <p className="text-[10px] text-emerald-700 font-mono pt-1">Hari Ini, 06:55 WIB · Wi-Fi Biometrik</p>
                          </div>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-100 flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                          <div className="space-y-0.5">
                            <p className="font-extrabold text-slate-900">Nilai Tugas Matematika Peminatan Diterbitkan</p>
                            <p className="text-slate-600">Ibu Dra. Siti Rahmawati memberikan nilai 95/100 (Predikat A) untuk tugas Turunan Parsial.</p>
                            <p className="text-[10px] text-blue-700 font-mono pt-1">Kemarin, 14:20 WIB · Nilai Sempurna</p>
                          </div>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-orange-50/70 border border-orange-100 flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full bg-[#FF5A26] mt-1.5 shrink-0" />
                          <div className="space-y-0.5">
                            <p className="font-extrabold text-slate-900">Pencapaian Streak Belajar 50 Hari</p>
                            <p className="text-slate-600">Ahmad Rizky berhasil mempertahankan kehadiran dan belajar mandiri tanpa putus selama 50 hari.</p>
                            <p className="text-[10px] text-orange-700 font-mono pt-1">3 Hari Lalu · Badge Pelajar Disiplin</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Quick Parent Communication Card */}
                    <div className="glass-card rounded-3xl p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                            <Users className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="text-sm font-extrabold text-slate-900">Koneksi Langsung Wali Murid & Sekolah</h3>
                            <p className="text-[11px] text-slate-400 font-medium">Layanan komunikasi resmi terintegrasi</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <button
                          onClick={() => setCurrentTab('parent-portal')}
                          className="w-full p-3.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all flex items-center justify-between shadow-xs cursor-pointer"
                        >
                          <span className="flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            <span>Ajukan Surat Keterangan Sakit / Izin Digital</span>
                          </span>
                          <span className="text-xs">➔</span>
                        </button>

                        <button
                          onClick={() => setCurrentTab('parent-portal')}
                          className="w-full p-3.5 rounded-2xl border border-slate-200 bg-white hover:bg-purple-50 text-slate-800 text-xs font-bold transition-all flex items-center justify-between cursor-pointer"
                        >
                          <span className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-purple-600" />
                            <span>Jadwalkan Konsultasi Guru BK / Tatap Muka</span>
                          </span>
                          <span className="text-xs">➔</span>
                        </button>

                        <button
                          onClick={() => setCurrentTab('messages')}
                          className="w-full p-3.5 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold transition-all flex items-center justify-between cursor-pointer"
                        >
                          <span className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-emerald-600" />
                            <span>Kirim Pesan ke Dra. Siti Rahmawati (Wali Kelas)</span>
                          </span>
                          <span className="text-xs">➔</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* ================= 3. STUDENT BENTO DASHBOARD (Ahmad Rizky Pratama) ================= */
                <div className="space-y-8 animate-in fade-in duration-200">
                  {/* 1. BENTO HERO BANNER (Warm Pastel Glassmorphic Hero Tile) */}
                  <div className="glass-card rounded-3xl p-6 md:p-8 relative overflow-hidden bg-gradient-to-br from-amber-50/80 via-orange-50/50 to-rose-50/70 border border-orange-200/60 shadow-xs">
                    <div className="absolute -top-16 -right-16 w-52 h-52 rounded-full bg-gradient-to-br from-orange-200/30 to-amber-200/10 blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-16 -left-16 w-52 h-52 rounded-full bg-gradient-to-tr from-rose-200/30 to-orange-200/10 blur-3xl pointer-events-none" />

                    <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      <div className="space-y-2 max-w-2xl">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#FF5A26] border border-orange-200/60 text-xs font-extrabold shadow-2xs">
                            <Sparkles className="w-3.5 h-3.5 text-[#FF5A26]" />
                            <span>Pelajar Disiplin & Aktif</span>
                          </span>
                          <span className="text-[11px] font-bold text-slate-500 bg-white/60 px-2.5 py-0.5 rounded-full border border-white/80">
                            Semester Ganjil 2026/2027
                          </span>
                        </div>

                        <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                          Selamat Datang Kembali, <span className="text-[#FF5A26]">{userProfile.name}</span>! 👋
                        </h1>
                        <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-medium">
                          Lanjutkan pembelajaran video interaktif dengan suara guru terpadu, eksplorasi laboratorium sains, dan pertahankan streak belajar harian.
                        </p>

                        {/* Fast Action Pills */}
                        <div className="flex flex-wrap items-center gap-2 pt-2">
                          <button
                            onClick={() => setCurrentTab('community')}
                            className="px-3.5 py-1.5 rounded-2xl bg-white/90 hover:bg-white text-slate-700 text-xs font-bold border border-slate-200/80 shadow-2xs flex items-center gap-1.5 transition-all hover:scale-105 cursor-pointer"
                          >
                            <Users className="w-3.5 h-3.5 text-blue-600" />
                            <span>Forum Komunitas</span>
                          </button>
                          <button
                            onClick={() => setCurrentTab('ptn-report')}
                            className="px-3.5 py-1.5 rounded-2xl bg-white/90 hover:bg-white text-slate-700 text-xs font-bold border border-slate-200/80 shadow-2xs flex items-center gap-1.5 transition-all hover:scale-105 cursor-pointer"
                          >
                            <GraduationCap className="w-3.5 h-3.5 text-purple-600" />
                            <span>Prediksi PTN & Rapor</span>
                          </button>
                          <button
                            onClick={() => setCurrentTab('lab')}
                            className="px-3.5 py-1.5 rounded-2xl bg-white/90 hover:bg-white text-slate-700 text-xs font-bold border border-slate-200/80 shadow-2xs flex items-center gap-1.5 transition-all hover:scale-105 cursor-pointer"
                          >
                            <FlaskConical className="w-3.5 h-3.5 text-[#FF5A26]" />
                            <span>Lab Virtual Sains</span>
                          </button>
                          <button
                            onClick={() => setCurrentTab('attendance')}
                            className="px-3.5 py-1.5 rounded-2xl bg-white/90 hover:bg-white text-slate-700 text-xs font-bold border border-slate-200/80 shadow-2xs flex items-center gap-1.5 transition-all hover:scale-105 cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Presensi Mandiri</span>
                          </button>
                          <button
                            onClick={() => setCurrentTab('calendar')}
                            className="px-3.5 py-1.5 rounded-2xl bg-white/90 hover:bg-white text-slate-700 text-xs font-bold border border-slate-200/80 shadow-2xs flex items-center gap-1.5 transition-all hover:scale-105 cursor-pointer"
                          >
                            <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                            <span>Jadwal Harian</span>
                          </button>
                          <button
                            onClick={() => triggerRoleGuard('guru', 'Penerbitan Tugas & Penilaian Rubrik Guru')}
                            className="px-3.5 py-1.5 rounded-2xl bg-orange-100/70 hover:bg-orange-200/70 text-orange-800 text-xs font-bold border border-orange-300/60 shadow-2xs flex items-center gap-1.5 transition-all hover:scale-105 cursor-pointer"
                            title="Uji coba proteksi hak akses peran"
                          >
                            <ShieldAlert className="w-3.5 h-3.5 text-[#FF5A26]" />
                            <span>Uji Guard Akses Peran</span>
                          </button>
                        </div>
                      </div>

                      {/* Quick Profile Summary Badge */}
                      <div className="shrink-0 flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 bg-white/80 backdrop-blur-md p-4 rounded-3xl border border-white/80 shadow-xs">
                        <div className="flex items-center gap-3">
                          <img
                            src={userProfile.avatar}
                            alt={userProfile.name}
                            className="w-12 h-12 rounded-2xl object-cover ring-2 ring-orange-200"
                          />
                          <div>
                            <p className="text-xs font-extrabold text-slate-900 leading-tight">{userProfile.name}</p>
                            <p className="text-[11px] text-slate-500 font-medium">{userProfile.className}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 rounded-full bg-orange-100 text-[#FF5A26] text-[11px] font-black flex items-center gap-1">
                            <Award className="w-3.5 h-3.5" />
                            <span>{userProfile.points} XP</span>
                          </span>
                          <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold">
                            Juara {userProfile.classRank}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 2. BENTO ROW: ACADEMIC KPI SNAPSHOT (3 Circular Progress Rings) */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* KPI 1: Kehadiran Siswa */}
                    <div
                      onClick={() => setCurrentTab('attendance')}
                      className="glass-card glass-card-hover rounded-3xl p-5 flex items-center justify-between cursor-pointer group"
                    >
                      <div className="space-y-1">
                        <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100/70 text-emerald-700 border border-emerald-200/60">
                          Presensi Terverifikasi
                        </span>
                        <h4 className="text-base font-extrabold text-slate-900 group-hover:text-emerald-600 transition-colors">
                          Kehadiran 98.4%
                        </h4>
                        <p className="text-xs text-slate-500">
                          92 dari 94 hari aktif sekolah
                        </p>
                        <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1 pt-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> GPS Geofence Aktif
                        </span>
                      </div>

                      <CircularProgressBar
                        value={98}
                        size={60}
                        strokeWidth={6}
                        color="#10B981"
                        trackColor="#D1FAE5"
                      />
                    </div>

                    {/* KPI 2: Rata-Rata Nilai Tugas */}
                    <div
                      onClick={() => setCurrentTab('assignments')}
                      className="glass-card glass-card-hover rounded-3xl p-5 flex items-center justify-between cursor-pointer group"
                    >
                      <div className="space-y-1">
                        <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-100/70 text-indigo-700 border border-indigo-200/60">
                          Nilai Akademik
                        </span>
                        <h4 className="text-base font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          Rata-Rata 89 / 100
                        </h4>
                        <p className="text-xs text-slate-500">
                          Predikat A (Sangat Memuaskan)
                        </p>
                        <span className="text-[11px] font-bold text-indigo-600 flex items-center gap-1 pt-1">
                          <TrendingUp className="w-3.5 h-3.5" /> +4.2 Poin Semester Ini
                        </span>
                      </div>

                      <CircularProgressBar
                        value={89}
                        size={60}
                        strokeWidth={6}
                        color="#6366F1"
                        trackColor="#E0E7FF"
                      />
                    </div>

                    {/* KPI 3: Capaian Modul Belajar */}
                    <div
                      onClick={() => setCurrentTab('lessons')}
                      className="glass-card glass-card-hover rounded-3xl p-5 flex items-center justify-between cursor-pointer group"
                    >
                      <div className="space-y-1">
                        <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-orange-100/70 text-[#FF5A26] border border-orange-200/60">
                          Silabus Terlaksana
                        </span>
                        <h4 className="text-base font-extrabold text-slate-900 group-hover:text-[#FF5A26] transition-colors">
                          Modul Selesai 68%
                        </h4>
                        <p className="text-xs text-slate-500">
                          18 dari 40 modul kurikulum
                        </p>
                        <span className="text-[11px] font-bold text-[#FF5A26] flex items-center gap-1 pt-1">
                          <Clock className="w-3.5 h-3.5" /> On-Track Target Ujian
                        </span>
                      </div>

                      <CircularProgressBar
                        value={68}
                        size={60}
                        strokeWidth={6}
                        color="#FF5A26"
                        trackColor="#FFE6D9"
                      />
                    </div>
                  </div>

                  {/* 3. SECTION: CONTINUE LEARNING (Bento Pair) */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                          Continue Learning
                        </h2>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                          Lanjutkan modul pembelajaran video interaktif terakhir Anda
                        </p>
                      </div>
                      <button
                        onClick={() => setCurrentTab('lessons')}
                        className="text-xs font-bold text-[#FF5A26] hover:text-[#E84E1D] flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <span>Lihat Semua</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* 2 Bento Cards side by side with Circular Progress */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <ContinueLearningCard
                        title="Advance UI/UX Design"
                        category="DESIGN"
                        iconType="design"
                        progress={45}
                        lessonsText="18/40 Lessons"
                        timeLeftText="2 hours left"
                        onResume={() => setSelectedCourseForModal(courses[1])}
                      />

                      <ContinueLearningCard
                        title="Basic Web Development"
                        category="DEVELOPMENT"
                        iconType="code"
                        progress={60}
                        lessonsText="24/40 Lessons"
                        timeLeftText="1.5 hours left"
                        onResume={() => setSelectedCourseForModal(courses[0])}
                      />
                    </div>
                  </div>

                  {/* 4. SMART DEADLINES & JADWAL HARI INI BENTO BANNER */}
                  <div className="glass-card rounded-3xl p-5 border border-orange-200/70 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-orange-50/70 via-amber-50/50 to-orange-50/60">
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-2xl bg-[#FF5A26] text-white flex items-center justify-center shrink-0 shadow-sm">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-extrabold text-slate-900">Pengingat Pintar & Kalender Hari Ini</span>
                          <span className="text-[10px] font-extrabold bg-red-100 text-red-700 px-2.5 py-0.5 rounded-full border border-red-200/60">
                            Tenggat H-1
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5 font-medium">
                          Tugas Terdekat: <strong className="text-slate-800">Latihan Mandiri: Integral & Garis Singgung</strong> (Batas: 14 Nov, 23:59 WIB)
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setCurrentTab('calendar')}
                        className="px-4 py-2 bg-white hover:bg-orange-50 text-slate-700 hover:text-orange-700 text-xs font-bold rounded-2xl border border-slate-200/80 transition-all shadow-2xs cursor-pointer"
                      >
                        Buka Kalender & Jadwal
                      </button>
                      <button
                        onClick={() => setCurrentTab('assignments')}
                        className="px-4 py-2 bg-[#FF5A26] hover:bg-[#E84E1D] text-white text-xs font-bold rounded-2xl transition-all shadow-xs cursor-pointer hover:scale-105"
                      >
                        Kumpulkan Tugas
                      </button>
                    </div>
                  </div>

                  {/* 5. SECTION: RECOMMENDED COURSES FOR YOU */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                          Recommended Courses For You
                        </h2>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                          Materi unggulan terintegrasi kurikulum sekolah tahun 2026
                        </p>
                      </div>

                      {/* Quick filter pills */}
                      <div className="hidden sm:flex items-center gap-1.5 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/50">
                        {['semua', 'Matematika', 'Informatika', 'IPA / Fisika'].map((cat) => (
                          <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-3 py-1 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                              selectedCategory === cat
                                ? 'bg-white text-slate-900 shadow-2xs'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Video Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {filteredCoursesList.slice(0, 4).map((course) => (
                        <RecommendedCourseCard
                          key={course.id}
                          course={course}
                          onOpen={() => setSelectedCourseForModal(course)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )
            )}

            {/* TAB: LESSONS (MATA PELAJARAN LENGKAP) */}
            {currentTab === 'lessons' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-xs">
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                      Katalog Mata Pelajaran Lengkap
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Silabus terstruktur kurikulum SMA kelas XII MIPA & Kejuruan Digital
                    </p>
                  </div>

                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {['semua', 'Matematika', 'Informatika', 'IPA / Fisika', 'IPA / Biologi'].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                          selectedCategory === cat
                            ? 'bg-[#FF5A26] text-white shadow-2xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredCoursesList.map((course) => (
                    <RecommendedCourseCard
                      key={course.id}
                      course={course}
                      onOpen={() => setSelectedCourseForModal(course)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* TAB: LEADERBOARD */}
            {currentTab === 'leaderboard' && (
              <LeaderboardView
                entries={LEADERBOARD_DATA}
                currentUserId={userProfile.id}
              />
            )}

            {/* TAB: SKILL GRAPH */}
            {currentTab === 'skill-graph' && (
              <SkillGraphView
                scores={COMPETENCY_SCORES}
                studentName={userProfile.name}
                studentNis={userProfile.nis}
                className={userProfile.className}
              />
            )}

            {/* TAB: CALENDAR & TIMETABLE (JADWAL KELAS & PENGINGAT PINTAR) */}
            {currentTab === 'calendar' && (
              <AcademicCalendarView
                assignments={assignments}
                currentUser={userProfile}
                onNavigateToAssignment={() => setCurrentTab('assignments')}
              />
            )}

            {/* TAB: ASSIGNMENTS & TESTS */}
            {currentTab === 'assignments' && (
              <AssignmentView
                assignments={assignments}
                currentUser={userProfile}
                onSubmitAssignment={handleSubmitAssignment}
                onGradeAssignment={handleGradeAssignment}
                onAddNewAssignment={handleAddNewAssignment}
              />
            )}

            {/* TAB: ATTENDANCE (PRESENSI SISWA) */}
            {currentTab === 'attendance' && (
              <AttendanceView currentUser={userProfile} />
            )}

            {/* TAB: ACHIEVEMENTS (PENCAPAIAN & BADGE) */}
            {currentTab === 'achievements' && (
              <AchievementsView
                currentUser={userProfile}
                onAwardBonusXp={handleAwardPoints}
              />
            )}

            {/* TAB: CERTIFICATES */}
            {currentTab === 'certificates' && (
              <CertificatesView
                certificates={CERTIFICATES_DATA}
                studentName={userProfile.name}
              />
            )}

            {/* TAB: MESSAGES */}
            {currentTab === 'messages' && (
              <MessagesView
                messages={chatMessages}
                currentUser={userProfile}
                onSendMessage={handleSendMessage}
              />
            )}

            {/* TAB: PARENT PORTAL (PORTAL WALI MURID) */}
            {currentTab === 'parent-portal' && (
              <ParentPortalView
                user={userProfile}
                attendanceHistory={ATTENDANCE_HISTORY}
                competencies={COMPETENCY_SCORES}
                onOpenChatWithTeacher={() => setCurrentTab('messages')}
                onNavigateTab={(target) => setCurrentTab(target)}
              />
            )}

            {/* TAB: COMMUNITY FORUM & PEER Q&A */}
            {currentTab === 'community' && (
              <CommunityForumView
                currentUser={userProfile}
                initialQuestions={communityQuestions}
                onAwardPoints={handleAwardPoints}
              />
            )}

            {/* TAB: PTN PREDICTOR & DIGITAL REPORT CARD */}
            {currentTab === 'ptn-report' && (
              <PtnPredictorAndReportView
                currentUser={userProfile}
                competencies={COMPETENCY_SCORES}
                onOpenCourse={(cId) => {
                  const targetCourse = courses.find((c) => c.id === cId) || courses[0];
                  setSelectedCourseForModal(targetCourse);
                }}
              />
            )}

            {/* TAB: VIRTUAL LAB (LABORATORIUM VIRTUAL SAINS) */}
            {currentTab === 'lab' && <VirtualLabView />}

            {/* TAB: DOCUMENTATION & USER GUIDE */}
            {currentTab === 'docs' && <DocumentationView />}

            {/* TAB: SETTINGS */}
            {currentTab === 'settings' && (
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-xs max-w-2xl space-y-6">
                <h2 className="text-xl font-extrabold text-slate-900">
                  Pengaturan Akun & Sekolah
                </h2>

                <div className="space-y-4 text-xs text-slate-600">
                  <div>
                    <label className="font-bold text-slate-800 block mb-1">Nama Lengkap:</label>
                    <input
                      type="text"
                      defaultValue={userProfile.name}
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50"
                      readOnly
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-800 block mb-1">Nomor Induk / NIP:</label>
                    <input
                      type="text"
                      defaultValue={userProfile.nis}
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50"
                      readOnly
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-800 block mb-1">Instansi Sekolah:</label>
                    <input
                      type="text"
                      defaultValue="SMAN 1 Unggulan Nusantara Jakarta"
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50"
                      readOnly
                    />
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-800">Notifikasi WhatsApp & Email</p>
                      <p className="text-slate-400">Terima pengingat tugas harian dan jadwal kuis</p>
                    </div>
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-4 h-4 accent-[#FF5A26] rounded cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}
          </main>

          {/* Right Profile Panel (matches reference image right side) */}
          <RightProfilePanel
            user={userProfile}
            isOpen={isRightPanelOpen}
            onToggle={() => setIsRightPanelOpen(!isRightPanelOpen)}
            onOpenCourse={(id) => {
              const target = courses.find((c) => c.id === id);
              if (target) setSelectedCourseForModal(target);
            }}
          />
        </div>
      </div>

      {/* Modals */}
      {selectedCourseForModal && (
        <InteractiveLessonModal
          course={selectedCourseForModal}
          onClose={() => setSelectedCourseForModal(null)}
          onAwardPoints={handleAwardPoints}
          onCompleteLesson={handleCompleteLesson}
        />
      )}

      {showExamPortal && (
        <ExamPortalModal
          onClose={() => setShowExamPortal(false)}
          onAwardPoints={handleAwardPoints}
        />
      )}

      {/* Role Access Guard Modal */}
      <RoleAccessModal
        isOpen={roleModalState.isOpen}
        onClose={() => setRoleModalState((prev) => ({ ...prev, isOpen: false }))}
        requiredRole={roleModalState.requiredRole}
        currentRole={userRole}
        actionTitle={roleModalState.actionTitle}
        onSwitchRole={handleSwitchRole}
      />
    </div>
  );
}
