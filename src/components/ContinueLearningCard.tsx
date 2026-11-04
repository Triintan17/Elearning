import React from 'react';
import {
  BookOpen,
  Clock,
  ArrowRight,
  Code2,
  PenTool,
  Binary,
  Compass,
} from 'lucide-react';

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
  const getIcon = () => {
    switch (iconType) {
      case 'code':
        return <Code2 className="w-5 h-5 text-[#FF5A26]" />;
      case 'math':
        return <Binary className="w-5 h-5 text-[#FF5A26]" />;
      case 'design':
      default:
        return <PenTool className="w-5 h-5 text-[#FF5A26]" />;
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      {/* Top Header: Icon & Titles */}
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-[#FFF3EB] border border-[#FFE6D9] flex items-center justify-center shrink-0">
          {getIcon()}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-extrabold text-slate-900 tracking-tight truncate">
            {title}
          </h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
            {category}
          </p>
        </div>
      </div>

      {/* Middle: Progress Bar */}
      <div className="mt-4">
        <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
          <div
            style={{ width: `${progress}%` }}
            className="h-full bg-[#FF5A26] rounded-full transition-all duration-500"
          />
        </div>
      </div>

      {/* Bottom: Lessons & Hours Metadata */}
      <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-1.5 font-medium">
          <BookOpen className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-[11px] font-semibold text-slate-600">{lessonsText}</span>
        </div>

        <div className="flex items-center gap-1.5 font-medium">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-[11px] font-semibold text-slate-600">{timeLeftText}</span>
        </div>
      </div>

      {/* Action Button: Resume Course */}
      <button
        onClick={onResume}
        className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between text-xs font-bold text-[#FF5A26] hover:text-[#E84E1D] group transition-colors"
      >
        <span>Lanjutkan Belajar</span>
        <div className="w-6 h-6 rounded-full border border-[#FF5A26]/30 flex items-center justify-center group-hover:bg-[#FFF3EB] transition-colors">
          <ArrowRight className="w-3.5 h-3.5 text-[#FF5A26] group-hover:translate-x-0.5 transition-transform" />
        </div>
      </button>
    </div>
  );
};
