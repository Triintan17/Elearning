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
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Assignment, UserProfile } from '../types/index.ts';

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
  const [fileName, setFileName] = useState('');

  // Teacher grading state
  const [gradingScore, setGradingScore] = useState(90);
  const [gradingFeedback, setGradingFeedback] = useState('Analisis sangat baik dan runut.');

  // Teacher new task state
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState('Matematika Peminatan XII');
  const [newDesc, setNewDesc] = useState('');

  const filtered = assignments.filter((item) => {
    if (filter === 'pending') return item.status === 'belum_dikumpulkan';
    if (filter === 'submitted') return item.status === 'menunggu_dinilai';
    if (filter === 'graded') return item.status === 'selesai_dinilai';
    return true;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssignment || !submissionText.trim()) return;

    onSubmitAssignment(selectedAssignment.id, submissionText);
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#FF5A26', '#10B981', '#3B82F6'],
      });
    } catch (e) {}

    setSelectedAssignment(null);
    setSubmissionText('');
    setFileName('');
  };

  const handleTeacherGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssignment) return;

    onGradeAssignment(selectedAssignment.id, Number(gradingScore), gradingFeedback);
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
      dueDate: '14 Nov 2026, 23:59 WIB',
      maxScore: 100,
      status: 'belum_dikumpulkan',
      description: newDesc.trim() || 'Kerjakan latihan soal berikut secara mandiri dan unggah resume jawabannya.',
    };

    onAddNewAssignment(created);
    setShowNewTaskModal(false);
    setNewTitle('');
    setNewDesc('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-xs">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Portal Tugas & Penilaian Akademik
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Kumpulkan tugas harian, ikuti kuis terjadwal, dan pantau umpan balik guru.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {currentUser.role === 'guru' && (
            <button
              onClick={() => setShowNewTaskModal(true)}
              className="px-4 py-2.5 rounded-xl bg-[#FF5A26] hover:bg-[#E84E1D] text-white text-xs font-bold flex items-center gap-2 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Buat Tugas Baru</span>
            </button>
          )}

          {/* Interactive filter tabs */}
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
              Belum Dikumpul
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
        {filtered.map((item) => {
          let statusBadge = (
            <span className="text-[11px] font-bold text-amber-600 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Belum Dikumpulkan
            </span>
          );
          if (item.status === 'menunggu_dinilai') {
            statusBadge = (
              <span className="text-[11px] font-bold text-blue-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> Menunggu Penilaian Guru
              </span>
            );
          } else if (item.status === 'selesai_dinilai') {
            statusBadge = (
              <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> Nilai: {item.score}/100
              </span>
            );
          }

          return (
            <div
              key={item.id}
              className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs flex flex-col justify-between hover:shadow-md transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    {item.subject}
                  </span>
                  {statusBadge}
                </div>

                <h3 className="text-sm font-extrabold text-slate-900 leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  Pengajar: {item.teacher}
                </p>

                <p className="text-xs text-slate-600 mt-3 line-clamp-3 leading-relaxed">
                  {item.description}
                </p>

                {item.teacherFeedback && (
                  <div className="mt-3 p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-xs text-slate-700">
                    <p className="font-bold text-emerald-800 text-[10px] uppercase">
                      Catatan Evaluasi Guru:
                    </p>
                    <p className="mt-0.5 text-emerald-900">{item.teacherFeedback}</p>
                  </div>
                )}
              </div>

              <div className="mt-5 pt-3 border-t border-slate-50 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">Batas: {item.dueDate}</span>

                <button
                  onClick={() => setSelectedAssignment(item)}
                  className="px-3.5 py-1.5 rounded-xl bg-[#FFF3EB] hover:bg-[#FFE6D9] text-[#FF5A26] font-bold transition-colors"
                >
                  {currentUser.role === 'guru'
                    ? 'Koreksi & Nilai'
                    : item.status === 'belum_dikumpulkan'
                    ? 'Kumpulkan Tugas'
                    : 'Lihat Jawaban'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Submission or Teacher Grading */}
      {selectedAssignment && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-100 p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF5A26]">
                  {selectedAssignment.subject}
                </span>
                <h3 className="text-base font-extrabold text-slate-900 mt-1">
                  {selectedAssignment.title}
                </h3>
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
                <h4 className="font-bold text-slate-800 mb-1">Instruksi Tugas:</h4>
                <p className="bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                  {selectedAssignment.description}
                </p>
              </div>

              {/* Form Siswa */}
              {currentUser.role === 'siswa' && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="font-bold text-slate-800 block mb-1">
                      Jawaban / Penjelasan Siswa:
                    </label>
                    <textarea
                      value={submissionText}
                      onChange={(e) => setSubmissionText(e.target.value)}
                      placeholder="Tuliskan uraian solusi, link dokumen, atau penjelasan tugas Anda..."
                      rows={4}
                      required
                      className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[#FF5A26] text-xs"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-800 block mb-1">
                      Unggah Lampiran (PDF / Gambar / Kode):
                    </label>
                    <div className="border-2 border-dashed border-slate-200 hover:border-[#FF5A26] rounded-2xl p-4 text-center cursor-pointer bg-slate-50">
                      <FileUp className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                      <p className="text-slate-600 font-semibold">
                        {fileName || 'Klik untuk memilih berkas laporan tugas'}
                      </p>
                      <input
                        type="file"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            setFileName(e.target.files[0].name);
                          }
                        }}
                        className="hidden"
                        id="asg-file-upload"
                      />
                      <label
                        htmlFor="asg-file-upload"
                        className="mt-1 inline-block text-[11px] text-[#FF5A26] font-bold cursor-pointer hover:underline"
                      >
                        Pilih file dari perangkat
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setSelectedAssignment(null)}
                      className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-[#FF5A26] hover:bg-[#E84E1D] text-white font-bold flex items-center gap-1.5 shadow-sm"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Kirim Jawaban Sekarang</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Form Guru (Koreksi) */}
              {currentUser.role === 'guru' && (
                <form onSubmit={handleTeacherGrade} className="space-y-4">
                  {selectedAssignment.studentAnswer && (
                    <div className="bg-orange-50/50 p-3 rounded-xl border border-orange-100">
                      <p className="font-bold text-[#FF5A26] mb-1">Jawaban yang Dikumpulkan Siswa:</p>
                      <p className="text-slate-800">{selectedAssignment.studentAnswer}</p>
                    </div>
                  )}

                  <div>
                    <label className="font-bold text-slate-800 block mb-1">
                      Nilai Angka (Skala 0 - 100):
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={gradingScore}
                      onChange={(e) => setGradingScore(Number(e.target.value))}
                      className="w-32 p-2.5 rounded-xl border border-slate-200 font-bold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-800 block mb-1">
                      Catatan Evaluasi / Feedback Guru:
                    </label>
                    <textarea
                      value={gradingFeedback}
                      onChange={(e) => setGradingFeedback(e.target.value)}
                      rows={3}
                      className="w-full p-3 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setSelectedAssignment(null)}
                      className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5 shadow-sm"
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>Simpan & Terbitkan Nilai</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal Buat Tugas Baru (Mode Guru) */}
      {showNewTaskModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-extrabold text-slate-900">
                Buat Tugas Baru untuk Kelas
              </h3>
              <button
                onClick={() => setShowNewTaskModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateNewTask} className="py-4 space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-800 block mb-1">Judul Tugas / Ujian:</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Contoh: Tugas 05: Simulasi Persamaan Diferensial"
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#FF5A26]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Mata Pelajaran:</label>
                <select
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#FF5A26]"
                >
                  <option value="Matematika Peminatan XII">Matematika Peminatan XII</option>
                  <option value="Fisika Terapan XII">Fisika Terapan XII</option>
                  <option value="Informatika & Web XII">Informatika & Web XII</option>
                  <option value="Biologi Molekuler XII">Biologi Molekuler XII</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Instruksi Soal:</label>
                <textarea
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Ketik rincian tugas dan kriteria penilaian..."
                  rows={4}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#FF5A26]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowNewTaskModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#FF5A26] hover:bg-[#E84E1D] text-white font-bold shadow-sm"
                >
                  Terbitkan ke Kelas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
