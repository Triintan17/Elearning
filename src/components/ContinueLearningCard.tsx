import React from 'react';
import {
  BookOpen,
  Clock,
  ArrowRight,
  Code2,
  PenTool,
  Binary,
  Sparkles,
} from 'lucide-react';
import { CircularProgressBar } from './CircularProgressBar.tsx';

interface ContinueLearningCardProps {
  title: string;
  category: string;
  progress: number;
  lessonsText: string;
  timeLeftText: string;
  iconType?: string;
  onResume: () => void;
}

export const ContinueLearningCard: React.FC<ContinueLearningCardProps> = ({
  title,
  category,
  progress,
  lessonsText,
  timeLeftText,
  iconType = 'design',
  onResume,
}) => {
  const getIconConfig = () => {
    switch (iconType) {
      case 'code':
        return {
          icon: <Code2 className="w-5 h-5 text-indigo-600" />,
          bg: 'bg-indigo-50/80 border-indigo-100/70 text-indigo-700',
          badgeBg: 'bg-indigo-100/60 text-indigo-700 border-indigo-200/50',
          progressColor: '#6366F1',
        };
      case 'math':
        return {
          icon: <Binary className="w-5 h-5 text-emerald-600" />,
          bg: 'bg-emerald-50/80 border-emerald-100/70 text-emerald-700',
          badgeBg: 'bg-emerald-100/60 text-emerald-700 border-emerald-200/50',
          progressColor: '#10B981',
        };
      case 'design':
      default:
        return {
          icon: <PenTool className="w-5 h-5 text-[#FF5A26]" />,
          bg: 'bg-orange-50/80 border-orange-100/70 text-[#FF5A26]',
          badgeBg: 'bg-orange-100/60 text-orange-700 border-orange-200/50',
          progressColor: '#FF5A26',
        };
    }
  };

  const config = getIconConfig();

  return (
    <div className="glass-card glass-card-hover rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden group">
      {/* Soft pastel ambient background glow */}
      <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-gradient-to-br from-orange-100/40 via-amber-100/20 to-transparent blur-2xl pointer-events-none" />

      <div>
        {/* Top Header: Icon, Category Pill, and Circular Progress Ring */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className={`w-12 h-12 rounded-2xl ${config.bg} border flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform duration-300`}>
              {config.icon}
            </div>
            <div>
              <span className={`inline-block text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${config.badgeBg}`}>
                {category}
              </span>
              <h3 className="text-base font-extrabold text-slate-900 tracking-tight mt-1 line-clamp-1 group-hover:text-[#FF5A26] transition-colors">
                {title}
              </h3>
            </div>
          </div>

          {/* Integrated Circular Progress Bar */}
          <CircularProgressBar
            value={progress}
            size={52}
            strokeWidth={5}
            color={config.progressColor}
            trackColor="#F1F5F9"
          />
        </div>

        {/* Linear Progress Bar for visual complement */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 mb-1.5">
            <span>Progres Belajar</span>
            <span className="font-bold text-slate-800">{progress}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100/80 overflow-hidden p-0.5">
            <div
              className="h-full rounded-full transition-all duration-700 ease-out shadow-xs"
              style={{
                width: `${progress}%`,
                backgroundColor: config.progressColor,
              }}
            />
          </div>
        </div>

        {/* Metadata: Lessons and Hours */}
        <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5 font-medium bg-slate-50/80 px-2.5 py-1 rounded-xl border border-slate-100/60">
            <BookOpen className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[11px] font-semibold text-slate-600">{lessonsText}</span>
          </div>

          <div className="flex items-center gap-1.5 font-medium bg-slate-50/80 px-2.5 py-1 rounded-xl border border-slate-100/60">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[11px] font-semibold text-slate-600">{timeLeftText}</span>
          </div>
        </div>
      </div>

      {/* Action Button: Resume Course */}
      <button
        onClick={onResume}
        className="mt-5 pt-3.5 border-t border-slate-100/80 flex items-center justify-between text-xs font-bold text-[#FF5A26] hover:text-[#E84E1D] group/btn transition-colors cursor-pointer"
      >
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#FF5A26]" />
          <span>Lanjutkan Belajar</span>
        </span>
        <div className="w-7 h-7 rounded-full bg-[#FFF3EB] border border-[#FFE6D9] flex items-center justify-center group-hover/btn:bg-[#FF5A26] group-hover/btn:text-white transition-all duration-300">
          <ArrowRight className="w-3.5 h-3.5 text-[#FF5A26] group-hover/btn:text-white group-hover/btn:translate-x-0.5 transition-all" />
        </div>
      </button>
    </div>
  );
};
