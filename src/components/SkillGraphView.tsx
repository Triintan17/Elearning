import React from 'react';
import {
  Activity,
  Award,
  BookOpen,
  Printer,
  TrendingUp,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { CompetencyScore } from '../types/index.ts';
import { calculateGPA } from '../utils/learningLogic.ts';

interface SkillGraphViewProps {
  scores: CompetencyScore[];
  studentName: string;
  studentNis: string;
  className: string;
}

export const SkillGraphView: React.FC<SkillGraphViewProps> = ({
  scores,
  studentName,
  studentNis,
  className,
}) => {
  const gpaInfo = calculateGPA(scores);

  const handlePrintRaport = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header Raport Card */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF3EB] text-[#FF5A26] text-xs font-bold mb-2">
            <Activity className="w-3.5 h-3.5" />
            <span>Peta Kompetensi & Raport Digital</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
            Capaian Akademik: {studentName}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            NIS: {studentNis} · {className} · Tahun Ajaran 2026/2027
          </p>
        </div>

        {/* GPA Highlight Box */}
        <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/80 shrink-0">
          <div className="text-right">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">
              Rata-rata Nilai (GPA)
            </span>
            <span className="text-2xl font-black text-slate-900 tabular-nums">
              {gpaInfo.average}
            </span>
            <span className="text-xs font-extrabold text-[#FF5A26] ml-1.5">
              (Predikat {gpaInfo.letterGrade})
            </span>
          </div>

          <button
            onClick={handlePrintRaport}
            className="p-3 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl transition-colors shadow-2xs"
            title="Cetak Raport Digital"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Visual Competency Bars by Subject */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {scores.map((item, idx) => (
          <div
            key={idx}
            className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#FFF3EB] text-[#FF5A26] flex items-center justify-center font-black text-sm">
                  {item.grade}
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 leading-tight">
                    {item.subject}
                  </h3>
                  <span className="text-[11px] text-slate-400 font-medium">
                    KKM: {item.kkm} · Nilai Akhir: <strong className="text-slate-800">{item.score}</strong>
                  </span>
                </div>
              </div>

              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
                {item.predicate}
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed italic bg-slate-50 p-3 rounded-xl border border-slate-100">
              "{item.description}"
            </p>

            {/* Sub-competencies breakdown */}
            <div className="space-y-2.5 pt-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Penguasaan Sub-Materi:
              </span>
              {item.competencies.map((comp, cIdx) => (
                <div key={cIdx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-700 font-semibold">{comp.name}</span>
                    <span className="text-slate-900 font-bold tabular-nums">{comp.score}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      style={{ width: `${comp.score}%` }}
                      className="h-full bg-[#FF5A26] rounded-full transition-all duration-300"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
