import React from 'react';
import { Play, Star, Clock, BookOpen, Sparkles } from 'lucide-react';
import { Course } from '../types/index.ts';

interface RecommendedCourseCardProps {
  course: Course;
  onOpen: () => void;
}

export const RecommendedCourseCard: React.FC<RecommendedCourseCardProps> = ({
  course,
  onOpen,
}) => {
  return (
    <div
      onClick={onOpen}
      className="glass-card glass-card-hover rounded-3xl overflow-hidden cursor-pointer flex flex-col group relative"
    >
      {/* Thumbnail with Simulated Video Player Bar */}
      <div className="relative aspect-video w-full bg-slate-900 overflow-hidden">
        <img
          src={course.thumbnail}
          alt={course.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Video Scrim Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/30 to-black/10 pointer-events-none" />

        {/* Category Pill Badge on top left - Soft pastel glass badge */}
        <div className="absolute top-3.5 left-3.5">
          <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#FF5A26] border border-white/60 text-[10px] font-extrabold uppercase tracking-wider shadow-sm flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5A26]" />
            {course.category}
          </span>
        </div>

        {/* Play Icon floating pill on top right */}
        <div className="absolute top-3.5 right-3.5 opacity-90 group-hover:opacity-100 transition-opacity">
          <span className="px-2.5 py-1 rounded-full bg-slate-900/60 backdrop-blur-md text-white/90 border border-white/20 text-[10px] font-bold flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {course.hoursLeft ? `${course.hoursLeft} Jam` : '2 Jam'}
          </span>
        </div>

        {/* Center Video Play Button on Hover */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 shadow-xl">
            <Play className="w-5 h-5 ml-0.5 fill-current text-white" />
          </div>
        </div>

        {/* Bottom Video Player Overlay Controls (exact match with reference) */}
        <div className="absolute bottom-3 inset-x-3 flex items-center gap-2 bg-slate-950/60 backdrop-blur-md px-3 py-2 rounded-2xl border border-white/10">
          <div className="w-6 h-6 rounded-full bg-white text-slate-900 flex items-center justify-center shrink-0 shadow-sm group-hover:bg-[#FF5A26] group-hover:text-white transition-colors">
            <Play className="w-3 h-3 ml-0.5 fill-current" />
          </div>

          <span className="text-[10px] font-bold text-white/90 shrink-0 tabular-nums">
            3:50
          </span>

          <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
            <div className="w-2/5 h-full bg-[#FF5A26] rounded-full transition-all duration-300" />
          </div>

          <span className="text-[10px] font-bold text-white/90 shrink-0 tabular-nums">
            9:32
          </span>
        </div>
      </div>

      {/* Course Details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h4 className="text-sm font-extrabold text-slate-900 leading-snug line-clamp-2 group-hover:text-[#FF5A26] transition-colors">
            {course.title}
          </h4>
          <p className="text-xs text-slate-500 mt-1.5 font-medium flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Pengajar: {course.teacher}</span>
          </p>
        </div>

        {/* Bottom row: Rating & Status / Total Lessons */}
        <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50/80 border border-amber-200/50 text-xs">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span className="font-extrabold text-slate-800">{course.rating}</span>
            <span className="text-slate-400 text-[10px]">({course.ratingCount})</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-bold text-[#FF5A26] bg-orange-50/80 border border-orange-200/50 px-2.5 py-1 rounded-full">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{course.totalLessons} Modul</span>
          </div>
        </div>
      </div>
    </div>
  );
};
