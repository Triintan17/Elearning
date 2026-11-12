export type UserRole = 'siswa' | 'guru' | 'wali';

export interface UserProfile {
  id: string;
  name: string;
  nis: string;
  role: UserRole;
  avatar: string;
  className: string;
  points: number;
  streakDays: number;
  monthlyGoals: number;
  classRank: number;
  totalCoursesInProgress: number;
  totalCoursesCompleted: number;
  weeklyWatchTimeHours: number;
  childName?: string;
  childNis?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  videoTime: string;
  videoUrl?: string;
  summary: string;
  keyPoints: string[];
  quiz: QuizQuestion[];
}

export interface Course {
  id: string;
  code: string;
  title: string;
  category: string;
  teacher: string;
  teacherTitle: string;
  teacherAvatar: string;
  thumbnail: string;
  videoUrl?: string;
  progressPercent: number;
  completedLessons: number;
  totalLessons: number;
  hoursLeft: number;
  rating: number;
  ratingCount: number;
  accentColor: string;
  isRecommended?: boolean;
  lessons: Lesson[];
}

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  teacher: string;
  dueDate: string;
  maxScore: number;
  score?: number;
  status: 'belum_dikumpulkan' | 'menunggu_dinilai' | 'selesai_dinilai';
  description: string;
  studentAnswer?: string;
  teacherFeedback?: string;
  submittedAt?: string;
}

export interface LeaderboardEntry {
  rank: number;
  id: string;
  name: string;
  avatar: string;
  className: string;
  points: number;
  streak: number;
  badges: string[];
}

export interface CompetencyScore {
  subject: string;
  score: number;
  kkm: number;
  grade: 'A' | 'B' | 'C';
  predicate: string;
  description: string;
  competencies: {
    name: string;
    score: number;
  }[];
}

export interface Certificate {
  id: string;
  title: string;
  subject: string;
  issueDate: string;
  grade: string;
  certNumber: string;
  instructor: string;
}

export interface ChatMessage {
  id: string;
  sender: string;
  role: UserRole;
  text: string;
  time: string;
  isCurrent?: boolean;
}

export interface AttendanceRecord {
  id: string;
  date: string;
  day: string;
  timeIn: string;
  timeOut: string;
  status: 'Hadir' | 'Izin' | 'Sakit' | 'Alpa' | 'hadir' | 'izin' | 'sakit' | 'alpa';
  location: string;
  notes?: string;
}

export interface CommunityAnswer {
  id: string;
  authorName: string;
  authorRole: UserRole;
  authorAvatar: string;
  createdAt: string;
  content: string;
  upvotes: number;
  isVerifiedByTeacher?: boolean;
}

export interface CommunityQuestion {
  id: string;
  title: string;
  subject: string;
  authorName: string;
  authorRole: UserRole;
  authorAvatar: string;
  createdAt: string;
  content: string;
  tags: string[];
  upvotes: number;
  answers: CommunityAnswer[];
  isSolved: boolean;
}

export interface PtnTarget {
  id: string;
  university: string;
  shortName: string;
  major: string;
  cluster: 'Saintek' | 'Soshum';
  passingGradeEstimated: number;
  competitiveness: 'Sangat Tinggi' | 'Tinggi' | 'Sedang';
  quota: number;
  badgeColor: string;
}

export interface PtnSimulationResult {
  target: PtnTarget;
  userAverage: number;
  probabilityPercent: number;
  status: 'Aman / Peluang Tinggi' | 'Kompetitif / Cukup Peluang' | 'Perlu Peningkatan / Ketat';
  gapScore: number;
  recommendedSubjects: string[];
}


