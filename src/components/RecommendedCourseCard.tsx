import React from 'react';
import { Play, Star, Clock, BookOpen } from 'lucide-react';
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
      className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col group"
    >
      {/* Thumbnail with Simulated Video Player Bar */}
      <div className="relative aspect-video w-full bg-slate-900 overflow-hidden">
        <img
          src={course.thumbnail}
          alt={course.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Video Scrim Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

        {/* "New" or Category Badge on top left */}
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 rounded-lg bg-[#FF5A26] text-white text-[10px] font-extrabold uppercase tracking-wider shadow-sm">
            {course.category}
          </span>
        </div>

        {/* Center / Bottom Video Player Overlay Controls (exact match with reference) */}
        <div className="absolute bottom-3 inset-x-3 flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-white/90 text-slate-900 flex items-center justify-center shrink-0 shadow-sm group-hover:bg-[#FF5A26] group-hover:text-white transition-colors">
            <Play className="w-3.5 h-3.5 ml-0.5 fill-current" />
          </div>

          <span className="text-[10px] font-bold text-white/90 shrink-0 tabular-nums">
            3:50
          </span>

          <div className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
            <div className="w-2/5 h-full bg-[#FF5A26] rounded-full" />
          </div>

          <span className="text-[10px] font-bold text-white/90 shrink-0 tabular-nums">
            9:32
          </span>
        </div>
      </div>

      {/* Course Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h4 className="text-sm font-extrabold text-slate-900 leading-snug line-clamp-2 group-hover:text-[#FF5A26] transition-colors">
            {course.title}
          </h4>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            {course.teacher}
          </p>
        </div>

        {/* Bottom row: Rating & Status / Total Lessons */}
        <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span className="font-extrabold text-slate-900">{course.rating}</span>
            <span className="text-slate-400 text-[11px]">({course.ratingCount})</span>
          </div>

          <div className="flex items-center gap-1 text-xs font-bold text-[#FF5A26]">
            <span>{course.totalLessons} Modul</span>
          </div>
        </div>
      </div>
    </div>
  );
};
