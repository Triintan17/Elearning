import React, { useState } from 'react';
import {
  FolderKanban,
  Clock,
  CheckCircle,
  AlertCircle,
  FileUp,
  Award,
  Send,
  X,
  Plus,
  FileText,
  Upload,
  CheckCircle2,
  Trash2,
  Sliders,
  HelpCircle,
  BookOpen,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Assignment, UserProfile } from '../types/index.ts';
import { calculateRubricScore, RubricCriteria } from '../utils/learningLogic.ts';

interface AssignmentViewProps {
  assignments: Assignment[];
  currentUser: UserProfile;
  onSubmitAssignment: (id: string, answerText: string) => void;
  onGradeAssignment: (id: string, score: number, feedback: string) => void;
  onAddNewAssignment: (newAsg: Assignment) => void;
}

export const AssignmentView: React.FC<AssignmentViewProps> = ({
  assignments,
  currentUser,
  onSubmitAssignment,
  onGradeAssignment,
  onAddNewAssignment,
}) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'submitted' | 'graded'>('all');
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [submissionText, setSubmissionText] = useState('');
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string; type: string } | null>(null);

  // Teacher grading rubric state
  const [rubric, setRubric] = useState<RubricCriteria>({
    concept: 36,
    method: 27,
    neatness: 27,
  });
  const [gradingFeedback, setGradingFeedback] = useState('Analisis sangat baik, runtut, dan tepat rumus.');

  // Teacher new task state
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState('Matematika Peminatan XII');
  const [newDueDate, setNewDueDate] = useState('14 Nov 2026, 23:59 WIB');
  const [newDesc, setNewDesc] = useState('');

  const currentRubricResult = calculateRubricScore(rubric);

  const filtered = assignments.filter((item) => {
    if (filter === 'pending') return item.status === 'belum_dikumpulkan';
    if (filter === 'submitted') return item.status === 'menunggu_dinilai';
    if (filter === 'graded') return item.status === 'selesai_dinilai';
    return true;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssignment || !submissionText.trim()) return;

    const fullSubmission = uploadedFile
      ? `[Berkas Terlampir: ${uploadedFile.name} (${uploadedFile.size})]\n\nCatatan Siswa:\n${submissionText}`
      : submissionText;

    onSubmitAssignment(selectedAssignment.id, fullSubmission);
    try {
      confetti({
        particleCount: 75,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#FF5A26', '#10B981', '#3B82F6'],
      });
    } catch (e) {}

    setSelectedAssignment(null);
    setSubmissionText('');
    setUploadedFile(null);
  };

  const handleTeacherGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssignment) return;

    const finalFeedbackWithRubric = `${gradingFeedback} (Rubrik: Konsep ${rubric.concept}/40, Langkah ${rubric.method}/30, Kerapian ${rubric.neatness}/30 - Predikat: ${currentRubricResult.predicate})`;
    onGradeAssignment(selectedAssignment.id, currentRubricResult.totalScore, finalFeedbackWithRubric);
    try {
      confetti({
        particleCount: 50,
        spread: 50,
        origin: { y: 0.5 },
        colors: ['#10B981', '#FF5A26'],
      });
    } catch (e) {}
    setSelectedAssignment(null);
  };

  const handleCreateNewTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const created: Assignment = {
      id: `asg-${Date.now()}`,
      title: newTitle.trim(),
      subject: newSubject,
      teacher: currentUser.name,
      dueDate: newDueDate,
      maxScore: 100,
      status: 'belum_dikumpulkan',
      description: newDesc.trim() || 'Kerjakan modul latihan soal berikut secara mandiri dan unggah resume jawabannya.',
    };

    onAddNewAssignment(created);
    setShowNewTaskModal(false);
    setNewTitle('');
    setNewDesc('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card p-6 md:p-8 rounded-3xl border border-white/80 shadow-xs">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-[#FF5A26]" />
            Pusat Pengumpulan Tugas & Penilaian Interaktif
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Pengumpulan berkas digital, batas tenggat waktu real-time, dan transparansi rubrik penilaian guru.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {currentUser.role === 'guru' && (
            <button
              onClick={() => setShowNewTaskModal(true)}
              className="px-4 py-2.5 rounded-xl bg-[#FF5A26] hover:bg-[#E84E1D] text-white text-xs font-bold flex items-center gap-2 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Buat Tugas Baru</span>
            </button>
          )}

          {/* Filter tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                filter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua ({assignments.length})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                filter === 'pending'
                  ? 'bg-white text-[#FF5A26] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Belum Kumpul
            </button>
            <button
              onClick={() => setFilter('graded')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                filter === 'graded'
                  ? 'bg-white text-emerald-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Dinilai
            </button>
          </div>
        </div>
      </div>

      {/* Assignment Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item, idx) => {
          let statusBadge = (
            <span className="text-[11px] font-bold text-amber-600 bg-amber-50 border border-amber-200/60 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Belum Dikumpulkan
            </span>
          );
          if (item.status === 'menunggu_dinilai') {
            statusBadge = (
              <span className="text-[11px] font-bold text-blue-600 bg-blue-50 border border-blue-200/60 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> Menunggu Penilaian
              </span>
            );
          } else if (item.status === 'selesai_dinilai') {
            statusBadge = (
              <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200/60 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> Nilai: {item.score}/100
              </span>
            );
          }

          // Urgency tag based on index
          const urgencyBadge = item.status === 'belum_dikumpulkan' && (
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-orange-100 text-orange-700">
              {idx === 0 ? '🔥 Mendesak (H-1)' : '⏳ Tersisa 3 Hari'}
            </span>
          );

          return (
            <div
              key={item.id}
              className="glass-card glass-card-hover rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    {item.subject}
                  </span>
                  {statusBadge}
                </div>

                <div className="flex items-center justify-between gap-2 mt-1">
                  <h3 className="text-sm font-extrabold text-slate-900 leading-snug">
                    {item.title}
                  </h3>
                  {urgencyBadge}
                </div>

                <p className="text-xs text-slate-500 font-medium mt-1">
                  Guru: {item.teacher}
                </p>

                <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>

                {item.teacherFeedback && (
                  <div className="mt-3 p-3 rounded-2xl bg-emerald-50/80 border border-emerald-100 text-xs text-slate-700">
                    <p className="font-bold text-emerald-800 text-[10px] uppercase flex items-center gap-1">
                      <Award className="w-3 h-3 text-emerald-600" /> Hasil Evaluasi & Rubrik:
                    </p>
                    <p className="mt-1 text-emerald-950 font-medium leading-relaxed">{item.teacherFeedback}</p>
                  </div>
                )}
              </div>

              <div className="mt-5 pt-3 border-t border-slate-50 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium flex items-center gap-1 text-[11px]">
                  <Clock className="w-3 h-3" /> {item.dueDate}
                </span>

                <button
                  onClick={() => {
                    setSelectedAssignment(item);
                    setSubmissionText(item.studentAnswer || '');
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-[#FFF3EB] hover:bg-[#FFE6D9] text-[#FF5A26] font-bold transition-colors text-xs"
                >
                  {currentUser.role === 'guru'
                    ? 'Koreksi Rubrik'
                    : item.status === 'belum_dikumpulkan'
                    ? 'Kumpulkan Tugas'
                    : 'Lihat Detail'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Submission or Teacher Grading */}
      {selectedAssignment && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-100 p-6 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF5A26]">
                  {selectedAssignment.subject}
                </span>
                <h3 className="text-base font-extrabold text-slate-900 mt-1">
                  {selectedAssignment.title}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Tenggat: {selectedAssignment.dueDate}</p>
              </div>
              <button
                onClick={() => setSelectedAssignment(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs text-slate-600">
              <div>
                <h4 className="font-bold text-slate-800 mb-1 flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-orange-500" /> Instruksi & Kisi-kisi Pengerjaan:
                </h4>
                <p className="bg-slate-50 p-3 rounded-2xl border border-slate-100 leading-relaxed text-slate-700">
                  {selectedAssignment.description}
                </p>
              </div>

              {/* Rubric Breakdown Info for Students */}
              <div className="p-3.5 bg-blue-50/60 rounded-2xl border border-blue-100">
                <h5 className="font-bold text-blue-900 mb-1 flex items-center gap-1.5 text-xs">
                  <Sliders className="w-3.5 h-3.5 text-blue-600" /> Rubrik Penilaian Standar Guru:
                </h5>
                <ul className="grid grid-cols-3 gap-2 text-[11px] text-blue-800 mt-2">
                  <li className="bg-white p-2 rounded-xl border border-blue-100 text-center">
                    <span className="block font-bold">40% Konsep</span>
                    <span className="text-slate-500 text-[10px]">Ketepatan Teori</span>
                  </li>
                  <li className="bg-white p-2 rounded-xl border border-blue-100 text-center">
                    <span className="block font-bold">30% Metode</span>
                    <span className="text-slate-500 text-[10px]">Langkah Hitung</span>
                  </li>
                  <li className="bg-white p-2 rounded-xl border border-blue-100 text-center">
                    <span className="block font-bold">30% Kerapian</span>
                    <span className="text-slate-500 text-[10px]">Format & Bahasa</span>
                  </li>
                </ul>
              </div>

              {/* Teacher Mode: Grading Form with Live Rubric Sliders */}
              {currentUser.role === 'guru' ? (
                <form onSubmit={handleTeacherGrade} className="space-y-4 pt-2">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-xs">Rubrik Penilaian Objektif:</span>
                      <span className="text-xs font-extrabold text-[#FF5A26] bg-orange-100 px-3 py-1 rounded-full">
                        Skor Total: {currentRubricResult.totalScore}/100 ({currentRubricResult.letterGrade})
                      </span>
                    </div>

                    {/* Criteria 1 */}
                    <div>
                      <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                        <span>1. Pemahaman Konsep & Ketepatan Rumus (Max 40)</span>
                        <span className="text-orange-600 font-bold">{rubric.concept} Poin</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="40"
                        value={rubric.concept}
                        onChange={(e) => setRubric({ ...rubric, concept: Number(e.target.value) })}
                        className="w-full accent-orange-500 cursor-pointer"
                      />
                    </div>

                    {/* Criteria 2 */}
                    <div>
                      <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                        <span>2. Sistematika & Langkah Pengerjaan (Max 30)</span>
                        <span className="text-orange-600 font-bold">{rubric.method} Poin</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="30"
                        value={rubric.method}
                        onChange={(e) => setRubric({ ...rubric, method: Number(e.target.value) })}
                        className="w-full accent-orange-500 cursor-pointer"
                      />
                    </div>

                    {/* Criteria 3 */}
                    <div>
                      <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                        <span>3. Kerapian, Format, & Orisinalitas (Max 30)</span>
                        <span className="text-orange-600 font-bold">{rubric.neatness} Poin</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="30"
                        value={rubric.neatness}
                        onChange={(e) => setRubric({ ...rubric, neatness: Number(e.target.value) })}
                        className="w-full accent-orange-500 cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Student Answer Review */}
                  {selectedAssignment.studentAnswer && (
                    <div>
                      <h4 className="font-bold text-slate-800 mb-1">Jawaban yang Diserahkan Siswa:</h4>
                      <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 font-mono text-xs text-slate-700 whitespace-pre-wrap">
                        {selectedAssignment.studentAnswer}
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="font-bold text-slate-800 block mb-1">
                      Catatan Evaluasi & Umpan Balik Guru:
                    </label>
                    <textarea
                      rows={3}
                      value={gradingFeedback}
                      onChange={(e) => setGradingFeedback(e.target.value)}
                      placeholder="Tuliskan apresiasi, koreksi rumus, atau saran belajar..."
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 focus:outline-none focus:border-[#FF5A26]"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setSelectedAssignment(null)}
                      className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 text-xs"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Simpan Nilai ({currentRubricResult.totalScore}/100)
                    </button>
                  </div>
                </form>
              ) : (
                /* Student Submission Form with File Upload Simulation */
                <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                  <div>
                    <label className="font-bold text-slate-800 block mb-1">
                      Unggah Berkas Lembar Jawaban (PDF / Word / ZIP / Foto):
                    </label>

                    {uploadedFile ? (
                      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileText className="w-5 h-5 text-emerald-600" />
                          <div>
                            <p className="text-xs font-bold text-emerald-900">{uploadedFile.name}</p>
                            <p className="text-[10px] text-emerald-700">{uploadedFile.size} · Terverifikasi Siap Diunggah</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setUploadedFile(null)}
                          className="p-1 rounded-lg text-slate-400 hover:text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-slate-200 hover:border-orange-400 rounded-2xl p-4 text-center bg-slate-50 hover:bg-orange-50/30 transition cursor-pointer">
                        <Upload className="w-6 h-6 mx-auto text-slate-400 mb-1" />
                        <p className="text-xs font-bold text-slate-700">Tarik berkas tugas Anda ke sini atau klik untuk pilih</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Mendukung format PDF, DOCX, ZIP, JPG hingga 25 MB</p>

                        <input
                          type="file"
                          id="student-file-input"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              const f = e.target.files[0];
                              setUploadedFile({
                                name: f.name,
                                size: `${(f.size / 1024).toFixed(1)} KB`,
                                type: f.type || 'Dokumen Tugas',
                              });
                            }
                          }}
                        />
                        <label
                          htmlFor="student-file-input"
                          className="inline-block mt-2 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-[11px] font-bold text-orange-600 hover:bg-orange-50 cursor-pointer shadow-2xs"
                        >
                          Pilih Berkas dari Komputer / HP
                        </label>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="font-bold text-slate-800 block mb-1">
                      Catatan / Penjelasan Ringkas Jawaban:
                    </label>
                    <textarea
                      rows={3}
                      value={submissionText}
                      onChange={(e) => setSubmissionText(e.target.value)}
                      placeholder="Tuliskan rangkuman langkah pengerjaan atau keterangan nomor soal yang telah selesai..."
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 focus:outline-none focus:border-[#FF5A26]"
                      required
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setSelectedAssignment(null)}
                      className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 text-xs"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-[#FF5A26] hover:bg-[#E84E1D] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
                    >
                      <Send className="w-4 h-4" />
                      Kirim Tugas Sekarang
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal: Teacher Create New Task */}
      {showNewTaskModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 p-6 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#FF5A26]" /> Buat Penugasan Baru untuk Siswa
              </h3>
              <button
                onClick={() => setShowNewTaskModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateNewTask} className="py-4 space-y-4 text-xs text-slate-700">
              <div>
                <label className="font-bold block mb-1">Judul Tugas:</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Contoh: Modul 5: Turunan Parsial & Titik Stasioner"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">Mata Pelajaran:</label>
                  <select
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs"
                  >
                    <option value="Matematika Peminatan XII">Matematika Peminatan XII</option>
                    <option value="Fisika Gelombang & Optika">Fisika Gelombang & Optika</option>
                    <option value="Biologi Molekuler">Biologi Molekuler</option>
                    <option value="Informatika & Pemrograman">Informatika & Pemrograman</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold block mb-1">Batas Tenggat (Deadline):</label>
                  <input
                    type="text"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1">Deskripsi Tugas & Kriteria:</label>
                <textarea
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Sebutkan langkah pengerjaan, bab buku panduan, atau ketentuan file upload..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewTaskModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#FF5A26] hover:bg-[#E84E1D] text-white font-bold text-xs shadow-sm"
                >
                  Terbitkan Tugas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
