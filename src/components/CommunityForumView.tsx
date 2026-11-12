import React, { useState } from 'react';
import {
  MessageSquare,
  Search,
  ThumbsUp,
  CheckCircle2,
  Sparkles,
  Plus,
  X,
  Send,
  HelpCircle,
  Tag,
  BookOpen,
  UserCheck,
  ChevronDown,
  ChevronUp,
  Award,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CommunityQuestion, CommunityAnswer, UserProfile } from '../types/index.ts';
import { filterCommunityQuestions } from '../utils/learningLogic.ts';

interface CommunityForumViewProps {
  currentUser: UserProfile;
  initialQuestions: CommunityQuestion[];
  onAwardPoints: (points: number) => void;
}

export const CommunityForumView: React.FC<CommunityForumViewProps> = ({
  currentUser,
  initialQuestions,
  onAwardPoints,
}) => {
  const [questions, setQuestions] = useState<CommunityQuestion[]>(initialQuestions);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('semua');
  const [filterTab, setFilterTab] = useState<'all' | 'solved' | 'unsolved' | 'popular'>('all');
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>('q-1');

  // New question modal state
  const [showAskModal, setShowAskModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState('Matematika');
  const [newContent, setNewContent] = useState('');
  const [newTagInput, setNewTagInput] = useState('');

  // Reply draft state (per question)
  const [replyTextMap, setReplyTextMap] = useState<Record<string, string>>({});

  const subjects = ['semua', 'Matematika', 'Fisika', 'Informatika', 'Biologi', 'Kimia'];

  // Upvote question
  const handleUpvoteQuestion = (qId: string) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === qId ? { ...q, upvotes: q.upvotes + 1 } : q))
    );
  };

  // Upvote answer
  const handleUpvoteAnswer = (qId: string, ansId: string) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== qId) return q;
        return {
          ...q,
          answers: q.answers.map((a) => (a.id === ansId ? { ...a, upvotes: a.upvotes + 1 } : a)),
        };
      })
    );
  };

  // Teacher verify answer
  const handleVerifyAnswer = (qId: string, ansId: string) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== qId) return q;
        return {
          ...q,
          isSolved: true,
          answers: q.answers.map((a) =>
            a.id === ansId ? { ...a, isVerifiedByTeacher: true } : a
          ),
        };
      })
    );

    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#FF5A26', '#10B981', '#6366F1'],
      });
    } catch (e) {}
  };

  // Post reply/answer
  const handlePostAnswer = (qId: string) => {
    const text = replyTextMap[qId]?.trim();
    if (!text) return;

    const newAns: CommunityAnswer = {
      id: `ans-${Date.now()}`,
      authorName: currentUser.name,
      authorRole: currentUser.role,
      authorAvatar: currentUser.avatar,
      createdAt: 'Baru saja',
      content: text,
      upvotes: 1,
      isVerifiedByTeacher: currentUser.role === 'guru',
    };

    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== qId) return q;
        return {
          ...q,
          isSolved: currentUser.role === 'guru' ? true : q.isSolved,
          answers: [...q.answers, newAns],
        };
      })
    );

    setReplyTextMap((prev) => ({ ...prev, [qId]: '' }));
    onAwardPoints(30);

    try {
      confetti({
        particleCount: 50,
        spread: 50,
        origin: { y: 0.7 },
        colors: ['#FF5A26', '#10B981'],
      });
    } catch (e) {}
  };

  // Submit new question
  const handleCreateQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const tags = newTagInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const created: CommunityQuestion = {
      id: `q-${Date.now()}`,
      title: newTitle.trim(),
      subject: newSubject,
      authorName: currentUser.name,
      authorRole: currentUser.role,
      authorAvatar: currentUser.avatar,
      createdAt: 'Baru saja',
      content: newContent.trim(),
      tags: tags.length ? tags : [newSubject, 'Diskusi Kelas'],
      upvotes: 1,
      isSolved: false,
      answers: [],
    };

    setQuestions((prev) => [created, ...prev]);
    setShowAskModal(false);
    setNewTitle('');
    setNewContent('');
    setNewTagInput('');
    setExpandedQuestionId(created.id);
    onAwardPoints(25);

    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#FF5A26', '#3B82F6'],
      });
    } catch (e) {}
  };

  const filtered = filterCommunityQuestions(questions, searchQuery, selectedSubject, filterTab);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Header Hero Bento Banner */}
      <div className="glass-card rounded-3xl p-6 md:p-8 bg-gradient-to-r from-orange-50/80 via-amber-50/60 to-rose-50/70 border border-orange-200/60 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#FF5A26] border border-orange-200/60 text-xs font-extrabold shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#FF5A26]" />
              <span>Forum Komunitas Belajar & Tanya Jawab Guru-Siswa</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
              Tanyakan Soal, Diskusikan Solusi
            </h1>
            <p className="text-xs md:text-sm text-slate-600 font-medium leading-relaxed">
              Dapatkan bantuan pemecahan soal kalkulus, fisika, hingga pemrograman dari guru pengampu
              dan rekan sekelas. Setiap partisipasi aktif dihadiahi XP gamifikasi.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <button
              onClick={() => setShowAskModal(true)}
              className="px-5 py-3 rounded-2xl bg-[#FF5A26] hover:bg-[#E84E1D] text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 hover:scale-105 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Ajukan Pertanyaan Baru (+25 XP)</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Search & Filter Bar */}
      <div className="glass-card rounded-3xl p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari topik diskusi, rumus, atau kata kunci..."
            className="w-full h-10 pl-10 pr-4 rounded-xl bg-slate-50/80 border border-slate-200/80 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#FF5A26] focus:bg-white transition-all"
          />
        </div>

        {/* Status Tabs */}
        <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-2xl border border-slate-200/50 overflow-x-auto">
          {[
            { id: 'all', label: 'Semua' },
            { id: 'solved', label: 'Terjawab' },
            { id: 'unsolved', label: 'Belum Terjawab' },
            { id: 'popular', label: 'Populer 🔥' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                filterTab === tab.id
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Subject Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {subjects.map((sub) => (
          <button
            key={sub}
            onClick={() => setSelectedSubject(sub)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold capitalize transition-all cursor-pointer whitespace-nowrap ${
              selectedSubject === sub
                ? 'bg-[#FF5A26] text-white shadow-xs'
                : 'bg-white/80 border border-slate-200/70 text-slate-600 hover:bg-slate-100'
            }`}
          >
            {sub}
          </button>
        ))}
      </div>

      {/* 4. Questions List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="glass-card rounded-3xl p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#FF5A26] mx-auto flex items-center justify-center">
              <HelpCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-extrabold text-slate-800">Belum Ada Pertanyaan di Topik Ini</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Jadilah yang pertama mengajukan pertanyaan atau ubah filter pencarian Anda.
            </p>
            <button
              onClick={() => setShowAskModal(true)}
              className="px-4 py-2 bg-[#FF5A26] text-white text-xs font-bold rounded-xl shadow-xs"
            >
              Mulai Diskusi Baru
            </button>
          </div>
        ) : (
          filtered.map((item) => {
            const isExpanded = expandedQuestionId === item.id;

            return (
              <div
                key={item.id}
                className="glass-card glass-card-hover rounded-3xl p-6 transition-all duration-300"
              >
                {/* Header: Author Info, Status Pill & Subject Tag */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.authorAvatar}
                      alt={item.authorName}
                      className="w-10 h-10 rounded-2xl object-cover ring-2 ring-slate-100 shadow-2xs"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold text-slate-900">{item.authorName}</span>
                        <span
                          className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${
                            item.authorRole === 'guru'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-orange-50 text-orange-700 border-orange-200'
                          }`}
                        >
                          {item.authorRole === 'guru' ? 'Guru' : 'Siswa'}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                        {item.createdAt} • Topik: <strong className="text-slate-600">{item.subject}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {item.isSolved ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Terjawab</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold">
                        <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                        <span>Diskusi Terbuka</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Question Title & Content */}
                <div className="mt-3">
                  <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {item.content}
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap items-center gap-1.5 mt-3">
                  {item.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-slate-100/80 text-slate-600 text-[10px] font-semibold"
                    >
                      <Tag className="w-2.5 h-2.5 text-slate-400" />
                      <span>{tag}</span>
                    </span>
                  ))}
                </div>

                {/* Footer Controls: Upvote Question, Answers Count, Toggle Accordion */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleUpvoteQuestion(item.id)}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-orange-50/70 hover:bg-orange-100/70 text-[#FF5A26] border border-orange-200/50 text-xs font-bold transition-all cursor-pointer"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span className="tabular-nums">{item.upvotes} Bermanfaat</span>
                    </button>

                    <button
                      onClick={() => setExpandedQuestionId(isExpanded ? null : item.id)}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100/80 hover:bg-slate-200/80 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                      <span>{item.answers.length} Tanggapan</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <span className="text-[11px] font-bold text-slate-400">
                    Solusi Terverifikasi Guru
                  </span>
                </div>

                {/* Accordion: Answers & Discussion Thread */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-slate-100/80 space-y-4 animate-in fade-in duration-150">
                    <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                      Jawaban & Pembahasan ({item.answers.length})
                    </h4>

                    {item.answers.map((ans) => (
                      <div
                        key={ans.id}
                        className={`p-4 rounded-2xl border transition-all ${
                          ans.isVerifiedByTeacher
                            ? 'bg-emerald-50/50 border-emerald-200/80'
                            : 'bg-white/80 border-slate-200/60'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={ans.authorAvatar}
                              alt={ans.authorName}
                              className="w-8 h-8 rounded-xl object-cover ring-1 ring-slate-200"
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-slate-900">{ans.authorName}</span>
                                {ans.isVerifiedByTeacher && (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-extrabold">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                    <span>Terverifikasi Guru</span>
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-slate-400">{ans.createdAt}</span>
                            </div>
                          </div>

                          {/* Teacher Action: Verify Answer */}
                          {currentUser.role === 'guru' && !ans.isVerifiedByTeacher && (
                            <button
                              onClick={() => handleVerifyAnswer(item.id, ans.id)}
                              className="px-2.5 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer"
                            >
                              <UserCheck className="w-3 h-3" />
                              <span>Verifikasi Jawaban Ini</span>
                            </button>
                          )}
                        </div>

                        <p className="text-xs text-slate-700 mt-2.5 leading-relaxed font-medium">
                          {ans.content}
                        </p>

                        <div className="mt-3 flex items-center justify-between text-xs">
                          <button
                            onClick={() => handleUpvoteAnswer(item.id, ans.id)}
                            className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-[#FF5A26] transition-colors cursor-pointer"
                          >
                            <ThumbsUp className="w-3 h-3" />
                            <span>{ans.upvotes} Terbantu</span>
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* Reply Input Box */}
                    <div className="flex items-center gap-2 pt-2">
                      <input
                        type="text"
                        value={replyTextMap[item.id] || ''}
                        onChange={(e) =>
                          setReplyTextMap((prev) => ({ ...prev, [item.id]: e.target.value }))
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handlePostAnswer(item.id);
                        }}
                        placeholder={`Tulis jawaban atau bantuan solusi sebagai ${currentUser.name}...`}
                        className="flex-1 h-10 px-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#FF5A26] focus:bg-white transition-all"
                      />
                      <button
                        onClick={() => handlePostAnswer(item.id)}
                        className="px-4 py-2.5 rounded-xl bg-[#FF5A26] hover:bg-[#E84E1D] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Kirim (+30 XP)</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* 5. Modal: Ajukan Pertanyaan Baru */}
      {showAskModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 relative space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#FFF3EB] text-[#FF5A26] flex items-center justify-center">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Ajukan Pertanyaan Baru
                </h3>
              </div>
              <button
                onClick={() => setShowAskModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateQuestion} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mata Pelajaran
                </label>
                <select
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#FF5A26]"
                >
                  <option value="Matematika">Matematika Peminatan / Wajib</option>
                  <option value="Fisika">Fisika (Mekanika & Optika)</option>
                  <option value="Informatika">Informatika & Pemrograman Web</option>
                  <option value="Biologi">Biologi Molekuler & Genetika</option>
                  <option value="Kimia">Kimia Analitik</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Judul Pertanyaan (Ringkas & Jelas)
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Contoh: Mengapa bayangan benda di cermin cekung dapat terbalik?"
                  className="w-full h-10 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#FF5A26]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Uraian Lengkap Masalah / Soal
                </label>
                <textarea
                  rows={4}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Jelaskan langkah yang sudah Anda coba atau bagian mana yang membingungkan..."
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#FF5A26] resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tags (Pisahkan dengan koma)
                </label>
                <input
                  type="text"
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  placeholder="Contoh: Cermin Cekung, Fokus, Optik Geometri"
                  className="w-full h-10 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#FF5A26]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAskModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#FF5A26] hover:bg-[#E84E1D] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publikasikan Pertanyaan (+25 XP)</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
