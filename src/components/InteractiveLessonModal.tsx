import React, { useState, useEffect } from 'react';
import {
  X,
  CheckCircle,
  HelpCircle,
  BookOpen,
  FileText,
  MessageCircle,
  Award,
  Sparkles,
  Send,
  Check,
  ChevronRight,
  ArrowLeft,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Course, Lesson } from '../types/index.ts';
import { evaluateQuizSubmission } from '../utils/learningLogic.ts';
import { EducationalVideoPlayer } from './EducationalVideoPlayer.tsx';

interface InteractiveLessonModalProps {
  course: Course;
  onClose: () => void;
  onAwardPoints: (points: number) => void;
  onCompleteLesson: (courseId: string, lessonId: string) => void;
}

export const InteractiveLessonModal: React.FC<InteractiveLessonModalProps> = ({
  course,
  onClose,
  onAwardPoints,
  onCompleteLesson,
}) => {
  const currentLesson: Lesson = course.lessons[0];

  // Video State
  const [isPlaying, setIsPlaying] = useState<boolean>(true); // Starts playing automatically!
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [currentTimeSec, setCurrentTimeSec] = useState<number>(0); // Mulai dari menit awal 00:00!
  const durationSec = 572; // ~9:32 (menit akhir materi)
  const [showSubtitles, setShowSubtitles] = useState<boolean>(true);
  const [volume, setVolume] = useState<number>(0.85);
  const [hasCompletedVideo, setHasCompletedVideo] = useState<boolean>(false);

  // Tabs state
  const [activeTab, setActiveTab] = useState<'summary' | 'quiz' | 'notes' | 'discussion'>('summary');

  // Quiz state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizResult, setQuizResult] = useState<{
    score: number;
    earnedPoints: number;
    isPassed: boolean;
    correctCount: number;
  } | null>(null);

  // Student Notes state
  const [notesText, setNotesText] = useState<string>(
    'Catatan penting: Jangan lupa rumus turunan parsial terhadap x menganggap y konstan. Latihan soal nomor 3 sangat sering keluar pada ujian semester!'
  );
  const [noteSaved, setNoteSaved] = useState<boolean>(false);

  // Discussion state
  const [questionsList, setQuestionsList] = useState([
    {
      id: 'd1',
      author: 'Dimas Bagaskara',
      role: 'Siswa',
      text: 'Bu, apakah pada grafik saddle point nilai determinan matriks Hessian harus negatif?',
      time: '15 menit lalu',
      reply: 'Tepat sekali Dimas! Jika determinan Hessian det(H) < 0, maka titik tersebut adalah titik pelana (saddle point).',
    },
  ]);
  const [newQuestionInput, setNewQuestionInput] = useState('');

  // Handle video playback time advancement dari menit awal (0:00) sampai akhir (9:32)
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTimeSec((prev) => {
          if (prev >= durationSec) {
            setIsPlaying(false);
            setHasCompletedVideo(true);
            onAwardPoints(50);
            try {
              confetti({
                particleCount: 100,
                spread: 80,
                origin: { y: 0.6 },
                colors: ['#FF5A26', '#10B981', '#F59E0B', '#3B82F6'],
              });
            } catch (e) {}
            return durationSec;
          }
          return prev + 1;
        });
      }, 1000 / playbackSpeed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, durationSec]);

  const handleSpeedToggle = () => {
    const speeds = [0.75, 1, 1.25, 1.5, 2];
    const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
    setPlaybackSpeed(speeds[nextIdx]);
  };

  const handleSelectOption = (qIdx: number, optIdx: number) => {
    if (quizSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
  };

  const handleQuizSubmit = () => {
    if (!currentLesson.quiz || currentLesson.quiz.length === 0) return;

    const answersArray = currentLesson.quiz.map((_, i) =>
      selectedAnswers[i] !== undefined ? selectedAnswers[i] : -1
    );
    const correctArray = currentLesson.quiz.map((q) => q.correctAnswer);

    const result = evaluateQuizSubmission(answersArray, correctArray, 50);
    setQuizResult(result);
    setQuizSubmitted(true);

    if (result.earnedPoints > 0) {
      onAwardPoints(result.earnedPoints);
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FF5A26', '#FFA485', '#22C55E', '#3B82F6'],
        });
      } catch (err) {}
    }
  };

  const handleSaveNotes = () => {
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 2500);
  };

  const handlePostQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionInput.trim()) return;

    setQuestionsList((prev) => [
      ...prev,
      {
        id: `d-${Date.now()}`,
        author: 'Ahmad Rizky Pratama',
        role: 'Siswa',
        text: newQuestionInput.trim(),
        time: 'Baru saja',
        reply: 'Pertanyaan bagus! Guru akan segera meninjau pertanyaan ini dalam 15 menit.',
      },
    ]);
    setNewQuestionInput('');
  };

  const handleCompleteLessonAction = () => {
    onCompleteLesson(course.id, currentLesson.id);
    onAwardPoints(100);
    try {
      confetti({
        particleCount: 100,
        spread: 90,
        origin: { y: 0.5 },
        colors: ['#FF5A26', '#10B981', '#F59E0B'],
      });
    } catch (e) {}
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 md:p-6 overflow-y-auto">
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[95vh]">
        {/* Modal Top Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-lg bg-[#FFF3EB] text-[#FF5A26] text-xs font-extrabold">
              {course.code}
            </span>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 leading-tight">
                {course.title}
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Pengampu: {course.teacher} · {course.teacherTitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-[#FF5A26] border border-orange-200 text-xs font-bold transition-all shadow-2xs"
              title="Kembali ke Beranda"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Kembali ke Beranda</span>
              <span className="sm:hidden">Beranda</span>
            </button>
            <button
              onClick={onClose}
              aria-label="Tutup kelas interaktif"
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {/* 1. VISUAL EDUCATIONAL VIDEO PLAYER WITH AUDIO NARRATION */}
          <EducationalVideoPlayer
            course={course}
            lesson={currentLesson}
            isPlaying={isPlaying}
            onTogglePlay={() => setIsPlaying(!isPlaying)}
            currentTimeSec={currentTimeSec}
            durationSec={durationSec}
            onSeek={(secs) => setCurrentTimeSec(secs)}
            playbackSpeed={playbackSpeed}
            onSpeedToggle={handleSpeedToggle}
            isMuted={isMuted}
            onToggleMute={() => setIsMuted(!isMuted)}
            showSubtitles={showSubtitles}
            onToggleSubtitles={() => setShowSubtitles(!showSubtitles)}
            onComplete={() => onAwardPoints(50)}
            volume={volume}
            onVolumeChange={(newVol) => setVolume(newVol)}
          />

          {/* 2. Interactive Navigation Tabs */}
          <div className="border-b border-slate-200">
            <nav className="flex items-center gap-2 overflow-x-auto pb-px">
              <button
                onClick={() => setActiveTab('summary')}
                className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-colors flex items-center gap-2 shrink-0 ${
                  activeTab === 'summary'
                    ? 'bg-[#FFF3EB] text-[#FF5A26] border-b-2 border-[#FF5A26]'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Rangkuman Materi</span>
              </button>

              <button
                onClick={() => setActiveTab('quiz')}
                className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-colors flex items-center gap-2 shrink-0 ${
                  activeTab === 'quiz'
                    ? 'bg-[#FFF3EB] text-[#FF5A26] border-b-2 border-[#FF5A26]'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <HelpCircle className="w-4 h-4" />
                <span>Kuis Interaktif</span>
                {quizResult && (
                  <span className="px-1.5 py-0.2 rounded-full bg-emerald-500 text-white text-[10px]">
                    {quizResult.score}%
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('notes')}
                className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-colors flex items-center gap-2 shrink-0 ${
                  activeTab === 'notes'
                    ? 'bg-[#FFF3EB] text-[#FF5A26] border-b-2 border-[#FF5A26]'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Catatan Mandiri</span>
              </button>

              <button
                onClick={() => setActiveTab('discussion')}
                className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-colors flex items-center gap-2 shrink-0 ${
                  activeTab === 'discussion'
                    ? 'bg-[#FFF3EB] text-[#FF5A26] border-b-2 border-[#FF5A26]'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <MessageCircle className="w-4 h-4" />
                <span>Tanya Guru & Forum</span>
              </button>
            </nav>
          </div>

          {/* 3. Tab Contents */}
          <div className="bg-slate-50/70 rounded-2xl p-5 border border-slate-100">
            {/* TAB: RANGKUMAN MATERI */}
            {activeTab === 'summary' && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900">
                    Konsep Utama Pembelajaran
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {currentLesson.summary}
                  </p>
                </div>

                <div className="pt-2">
                  <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Poin Pengetahuan Kunci
                  </h5>
                  <div className="space-y-2">
                    {currentLesson.keyPoints.map((point, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2.5 bg-white p-3 rounded-xl border border-slate-100"
                      >
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="text-xs font-medium text-slate-700 leading-relaxed">
                          {point}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: KUIS INTERAKTIF */}
            {activeTab === 'quiz' && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900">
                      Uji Pemahaman Materi (Instant Quiz)
                    </h4>
                    <p className="text-xs text-slate-500">
                      Jawab pertanyaan berikut untuk meraih +50 Poin XP dan meningkatkan pemahaman.
                    </p>
                  </div>

                  {quizSubmitted && quizResult && (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                      <Award className="w-4 h-4 text-emerald-600" />
                      <span>Nilai: {quizResult.score}/100 (+{quizResult.earnedPoints} XP)</span>
                    </div>
                  )}
                </div>

                {currentLesson.quiz.map((q, qIdx) => {
                  const isCorrect = selectedAnswers[qIdx] === q.correctAnswer;

                  return (
                    <div
                      key={q.id}
                      className="bg-white p-4 rounded-2xl border border-slate-100 space-y-3"
                    >
                      <div className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0">
                          {qIdx + 1}
                        </span>
                        <p className="text-xs font-extrabold text-slate-900 leading-snug">
                          {q.question}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-7">
                        {q.options.map((opt, optIdx) => {
                          const chosen = selectedAnswers[qIdx] === optIdx;
                          let btnStyle = 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200';

                          if (quizSubmitted) {
                            if (optIdx === q.correctAnswer) {
                              btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-800 font-bold';
                            } else if (chosen && !isCorrect) {
                              btnStyle = 'bg-red-50 border-red-300 text-red-800';
                            }
                          } else if (chosen) {
                            btnStyle = 'bg-[#FFF3EB] border-[#FF5A26] text-[#FF5A26] font-bold shadow-xs';
                          }

                          return (
                            <button
                              key={optIdx}
                              onClick={() => handleSelectOption(qIdx, optIdx)}
                              className={`p-2.5 rounded-xl border text-xs text-left transition-all flex items-center gap-2 ${btnStyle}`}
                            >
                              <div
                                className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] ${
                                  chosen ? 'border-[#FF5A26] bg-[#FF5A26] text-white' : 'border-slate-300'
                                }`}
                              >
                                {chosen && <Check className="w-2.5 h-2.5" />}
                              </div>
                              <span className="flex-1">{opt}</span>
                            </button>
                          );
                        })}
                      </div>

                      {quizSubmitted && (
                        <div className="mt-2 pl-7 text-[11px] bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-slate-600">
                          <span className="font-bold text-slate-800">Pembahasan: </span>
                          {q.explanation}
                        </div>
                      )}
                    </div>
                  );
                })}

                <div className="flex items-center justify-end gap-3 pt-2">
                  {!quizSubmitted ? (
                    <button
                      onClick={handleQuizSubmit}
                      className="px-5 py-2.5 rounded-xl bg-[#FF5A26] hover:bg-[#E84E1D] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Kirim Jawaban Kuis</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setQuizSubmitted(false);
                        setSelectedAnswers({});
                        setQuizResult(null);
                      }}
                      className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                    >
                      Ulangi Kuis
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* TAB: CATATAN MANDIRI */}
            {activeTab === 'notes' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-extrabold text-slate-900">
                    Buku Catatan Belajar Digital
                  </h4>
                  {noteSaved && (
                    <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Tersimpan Otomatis
                    </span>
                  )}
                </div>

                <textarea
                  value={notesText}
                  onChange={(e) => setNotesText(e.target.value)}
                  rows={5}
                  placeholder="Ketik catatan, rumus, atau pemikiran Anda di sini..."
                  className="w-full p-3.5 rounded-2xl bg-white border border-slate-200 text-xs text-slate-800 leading-relaxed focus:outline-none focus:border-[#FF5A26] focus:ring-2 focus:ring-[#FF5A26]/10"
                />

                <div className="flex justify-end">
                  <button
                    onClick={handleSaveNotes}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors shadow-xs"
                  >
                    Simpan Catatan
                  </button>
                </div>
              </div>
            )}

            {/* TAB: TANYA GURU & FORUM */}
            {activeTab === 'discussion' && (
              <div className="space-y-4">
                <h4 className="text-sm font-extrabold text-slate-900">
                  Ruang Tanya Guru & Diskusi Kelas
                </h4>

                <div className="space-y-3">
                  {questionsList.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white p-3.5 rounded-2xl border border-slate-100 space-y-2"
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-slate-800">
                          {item.author} ({item.role})
                        </span>
                        <span className="text-slate-400">{item.time}</span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed">{item.text}</p>

                      {item.reply && (
                        <div className="mt-2 p-2.5 rounded-xl bg-orange-50/60 border border-orange-100 text-xs text-slate-800 space-y-1">
                          <p className="font-extrabold text-[#FF5A26] text-[10px] uppercase">
                            Tanggapan Guru ({course.teacher}):
                          </p>
                          <p className="text-slate-700 leading-relaxed">{item.reply}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <form onSubmit={handlePostQuestion} className="flex gap-2 pt-2">
                  <input
                    type="text"
                    value={newQuestionInput}
                    onChange={(e) => setNewQuestionInput(e.target.value)}
                    placeholder="Tanyakan hal yang belum dipahami kepada guru..."
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#FF5A26]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-[#FF5A26] hover:bg-[#E84E1D] text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Kirim</span>
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Modal Bottom Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-100 bg-white flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-500">
            Progres Modul: <span className="font-bold text-slate-800">18 dari 40 Pelajaran Selesai (45%)</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors"
            >
              Kembali ke Dashboard
            </button>
            <button
              onClick={handleCompleteLessonAction}
              className="px-5 py-2.5 rounded-xl bg-[#FF5A26] hover:bg-[#E84E1D] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2"
            >
              <span>Selesaikan Sesi & Klaim +100 XP</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
