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
  INITIAL_USER,
  INITIAL_TEACHER,
  COURSES_DATA,
  CONTINUE_LEARNING_COURSES,
  ASSIGNMENTS_DATA,
  LEADERBOARD_DATA,
  COMPETENCY_SCORES,
  CERTIFICATES_DATA,
  INITIAL_CHAT_MESSAGES,
} from './data/mockData.ts';
import {
  Course,
  Assignment,
  UserRole,
  UserProfile,
  ChatMessage,
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
} from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('overview');
  const [userRole, setUserRole] = useState<UserRole>('siswa');
  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_USER);
  const [courses, setCourses] = useState<Course[]>(COURSES_DATA);
  const [assignments, setAssignments] = useState<Assignment[]>(ASSIGNMENTS_DATA);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('semua');

  // Modals & Drawers
  const [selectedCourseForModal, setSelectedCourseForModal] = useState<Course | null>(null);
  const [showExamPortal, setShowExamPortal] = useState<boolean>(false);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState<boolean>(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  // Switch role handler
  const handleSwitchRole = (role: UserRole) => {
    setUserRole(role);
    if (role === 'guru') {
      setUserProfile(INITIAL_TEACHER);
    } else {
      setUserProfile(INITIAL_USER);
    }
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
      />

      {/* 2. Main Layout Container (offset by sidebar width on desktop) */}
      <div className="lg:pl-64 flex-1 flex flex-col min-w-0">
        {/* Sticky Top Bar */}
        <Header
          currentTabName={
            currentTab === 'overview'
              ? 'Dashboard'
              : currentTab === 'lessons'
              ? 'Mata Pelajaran'
              : currentTab === 'assignments'
              ? 'Tugas & Ujian'
              : currentTab === 'attendance'
              ? 'Presensi & Kehadiran'
              : currentTab === 'achievements'
              ? 'Pencapaian & Badge'
              : currentTab === 'leaderboard'
              ? 'Papan Peringkat'
              : currentTab === 'skill-graph'
              ? 'Grafik Kemampuan'
              : currentTab === 'certificates'
              ? 'Sertifikat'
              : currentTab === 'messages'
              ? 'Pesan & Diskusi'
              : 'Pengaturan'
          }
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          currentUser={userProfile}
          onSwitchRole={handleSwitchRole}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onOpenMessagesTab={() => setCurrentTab('messages')}
          onNavigateTab={(target) => setCurrentTab(target)}
        />

        {/* 3. Central Working Canvas + Collapsible Right Profile Panel */}
        <div className="flex-1 flex flex-col xl:flex-row min-w-0">
          {/* Main Content Area */}
          <main className="flex-1 min-w-0 p-4 md:p-8 space-y-8">
            {/* TAB: OVERVIEW (DASHBOARD - Exact match with user reference) */}
            {currentTab === 'overview' && (
              <div className="space-y-8">
                {/* SECTION 1: CONTINUE LEARNING */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                      Continue Learning
                    </h2>
                    <button
                      onClick={() => setCurrentTab('lessons')}
                      className="text-xs font-bold text-[#FF5A26] hover:text-[#E84E1D] flex items-center gap-1 transition-colors"
                    >
                      <span>Lihat Semua</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* 2 Cards side by side matching user screenshot */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      progress={45}
                      lessonsText="18/40 Lessons"
                      timeLeftText="2 hours left"
                      onResume={() => setSelectedCourseForModal(courses[1])}
                    />
                  </div>
                </div>

                {/* SECTION 2: RECOMMENDED COURSES FOR YOU */}
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
                    <div className="hidden sm:flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
                      {['semua', 'Matematika', 'Informatika', 'IPA / Fisika'].map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategory(cat)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition-colors ${
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
    </div>
  );
}
