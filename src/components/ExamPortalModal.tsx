import React, { useState, useEffect } from 'react';
import { X, Clock, Award, CheckCircle, Sparkles, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ExamPortalModalProps {
  onClose: () => void;
  onAwardPoints: (points: number) => void;
}

export const ExamPortalModal: React.FC<ExamPortalModalProps> = ({
  onClose,
  onAwardPoints,
}) => {
  const [secondsLeft, setSecondsLeft] = useState(1200); // 20 minutes
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isFinished, setIsFinished] = useState(false);
  const [scoreResult, setScoreResult] = useState<number | null>(null);

  const questions = [
    {
      q: 'Diketahui f(x) = 2x³ - 9x² + 12x + 5. Interval di mana fungsi f(x) selalu turun adalah...',
      options: ['1 < x < 2', 'x < 1 atau x > 2', '-2 < x < -1', 'x < -2 atau x > 1'],
      correct: 0,
      exp: 'f\'(x) = 6x² - 18x + 12 = 6(x - 1)(x - 2). Fungsi turun saat f\'(x) < 0, yaitu pada interval 1 < x < 2.',
    },
    {
      q: 'Dalam sebuah kelas terdapat 36 siswa. 20 siswa menyukai Matematika, 18 siswa menyukai Fisika, dan 8 siswa menyukai keduanya. Peluang terpilih siswa yang tidak menyukai keduanya adalah...',
      options: ['6/36 = 1/6', '8/36 = 2/9', '4/36 = 1/9', '10/36 = 5/18'],
      correct: 0,
      exp: 'Siswa suka minimal satu = 20 + 18 - 8 = 30 siswa. Siswa yang tidak suka keduanya = 36 - 30 = 6 siswa. Peluang = 6/36 = 1/6.',
    },
    {
      q: 'Suatu gas ideal monoatomik mengalami proses ekspansi adiabatik. Manakah besaran yang bernilai 0 (nol) selama proses berlangsung?',
      options: ['Kalor yang diserap/dilepas (Q = 0)', 'Perubahan energi dalam (ΔU = 0)', 'Usaha luar (W = 0)', 'Perubahan suhu (ΔT = 0)'],
      correct: 0,
      exp: 'Pada proses adiabatik, tidak ada pertukaran kalor antara sistem dan lingkungan, sehingga Q = 0.',
    },
  ];

  useEffect(() => {
    if (isFinished) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [isFinished]);

  const formatTimer = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleFinish = () => {
    let correct = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correct) correct++;
    });
    const finalScore = Math.round((correct / questions.length) * 100);
    setScoreResult(finalScore);
    setIsFinished(true);
    onAwardPoints(finalScore);

    try {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#FF5A26', '#10B981', '#6366F1'],
      });
    } catch (e) {}
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#FF5A26] text-white flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">
                Simulasi CBT UTBK - Penalaran Matematika & Sains
              </h3>
              <p className="text-[11px] text-slate-400 font-medium">
                Sistem Ujian Terstandar Nasional SMAN 1
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-[#FF5A26] font-mono text-xs font-bold">
              <Clock className="w-3.5 h-3.5" />
              <span>{formatTimer(secondsLeft)}</span>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {!isFinished ? (
            <>
              {/* Question Navigator */}
              <div className="flex items-center gap-2">
                {questions.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentQIndex(idx)}
                    className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${
                      currentQIndex === idx
                        ? 'bg-[#FF5A26] text-white ring-2 ring-[#FF5A26]/30'
                        : selectedAnswers[idx] !== undefined
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>

              {/* Current Question */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-4">
                <div className="flex items-start gap-2">
                  <span className="font-bold text-xs text-[#FF5A26]">
                    Soal No. {currentQIndex + 1}
                  </span>
                </div>
                <p className="text-xs md:text-sm font-bold text-slate-900 leading-relaxed">
                  {questions[currentQIndex].q}
                </p>

                {/* Options */}
                <div className="space-y-2 pt-2">
                  {questions[currentQIndex].options.map((opt, oIdx) => {
                    const isSelected = selectedAnswers[currentQIndex] === oIdx;

                    return (
                      <button
                        key={oIdx}
                        onClick={() =>
                          setSelectedAnswers((prev) => ({
                            ...prev,
                            [currentQIndex]: oIdx,
                          }))
                        }
                        className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex items-center gap-3 ${
                          isSelected
                            ? 'bg-[#FFF3EB] border-[#FF5A26] text-[#FF5A26] font-bold shadow-2xs'
                            : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700'
                        }`}
                      >
                        <span
                          className={`w-5 h-5 rounded-full border text-[10px] flex items-center justify-center font-bold ${
                            isSelected
                              ? 'border-[#FF5A26] bg-[#FF5A26] text-white'
                              : 'border-slate-300'
                          }`}
                        >
                          {String.fromCharCode(65 + oIdx)}
                        </span>
                        <span>{opt}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  disabled={currentQIndex === 0}
                  onClick={() => setCurrentQIndex((prev) => prev - 1)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold disabled:opacity-40"
                >
                  ← Soal Sebelumnya
                </button>

                {currentQIndex < questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentQIndex((prev) => prev + 1)}
                    className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold"
                  >
                    Soal Berikutnya →
                  </button>
                ) : (
                  <button
                    onClick={handleFinish}
                    className="px-6 py-2.5 rounded-xl bg-[#FF5A26] hover:bg-[#E84E1D] text-white text-xs font-bold shadow-sm"
                  >
                    Selesaikan Ujian Sekarang
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-slate-900">
                Ujian Selesai! Skor Anda: {scoreResult}/100
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                Hasil evaluasi telah dicatat ke dalam rekapitulasi UTBK Anda. Anda memperoleh{' '}
                <strong>+{scoreResult} Poin Prestasi</strong>!
              </p>

              <button
                onClick={onClose}
                className="mt-4 px-6 py-2.5 rounded-xl bg-[#FF5A26] text-white text-xs font-bold"
              >
                Kembali ke Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
