import { Course, CompetencyScore } from '../types/index.ts';

/**
 * Calculates student level based on gamified XP / points.
 */
export function calculateStudentLevel(points: number): {
  level: number;
  title: string;
  nextLevelPoints: number;
  progressPercent: number;
} {
  const safePoints = Math.max(0, points);
  const pointsPerLevel = 100;
  const level = Math.floor(safePoints / pointsPerLevel) + 1;
  const currentLevelBase = (level - 1) * pointsPerLevel;
  const nextLevelPoints = level * pointsPerLevel;
  const pointsInCurrentLevel = safePoints - currentLevelBase;
  const progressPercent = Math.min(100, Math.round((pointsInCurrentLevel / pointsPerLevel) * 100));

  let title = 'Pelajar Pemula';
  if (level >= 15) title = 'Cendekiawan Utama';
  else if (level >= 10) title = 'Pakar Riset Sekolah';
  else if (level >= 8) title = 'Master Eksplorer';
  else if (level >= 5) title = 'Pejuang Prestasi';
  else if (level >= 3) title = 'Pelajar Aktif';

  return {
    level,
    title,
    nextLevelPoints,
    progressPercent,
  };
}

/**
 * Calculates percentage completion for a course.
 */
export function calculateCourseProgress(completedLessons: number, totalLessons: number): number {
  if (totalLessons <= 0) return 0;
  const ratio = completedLessons / totalLessons;
  return Math.min(100, Math.max(0, Math.round(ratio * 100)));
}

/**
 * Evaluates student answers against answer keys and calculates scores and XP earned.
 */
export function evaluateQuizSubmission(
  answers: number[],
  correctAnswers: number[],
  baseXpPerCorrect: number = 25
): {
  score: number;
  earnedPoints: number;
  isPassed: boolean;
  correctCount: number;
  totalQuestions: number;
} {
  const totalQuestions = correctAnswers.length;
  if (totalQuestions === 0) {
    return { score: 100, earnedPoints: 0, isPassed: true, correctCount: 0, totalQuestions: 0 };
  }

  let correctCount = 0;
  for (let i = 0; i < totalQuestions; i++) {
    if (answers[i] !== undefined && answers[i] === correctAnswers[i]) {
      correctCount++;
    }
  }

  const score = Math.round((correctCount / totalQuestions) * 100);
  const earnedPoints = correctCount * baseXpPerCorrect;
  const isPassed = score >= 70;

  return {
    score,
    earnedPoints,
    isPassed,
    correctCount,
    totalQuestions,
  };
}

/**
 * Filters courses by search text and category.
 */
export function filterCourses(courses: Course[], query: string, category: string): Course[] {
  const cleanQuery = query.trim().toLowerCase();
  const cleanCategory = category.trim().toLowerCase();

  return courses.filter((course) => {
    const matchesCategory =
      cleanCategory === 'semua' ||
      cleanCategory === 'all' ||
      course.category.toLowerCase() === cleanCategory;

    const matchesQuery =
      !cleanQuery ||
      course.title.toLowerCase().includes(cleanQuery) ||
      course.code.toLowerCase().includes(cleanQuery) ||
      course.teacher.toLowerCase().includes(cleanQuery);

    return matchesCategory && matchesQuery;
  });
}

/**
 * Computes overall GPA / Rata-rata Nilai and predicates.
 */
export function calculateGPA(scores: CompetencyScore[]): {
  average: number;
  letterGrade: 'A' | 'B' | 'C' | 'D';
  predicate: string;
} {
  if (scores.length === 0) {
    return { average: 0, letterGrade: 'D', predicate: 'Belum Ada Nilai' };
  }

  const sum = scores.reduce((acc, curr) => acc + curr.score, 0);
  const average = Math.round((sum / scores.length) * 10) / 10;

  let letterGrade: 'A' | 'B' | 'C' | 'D' = 'D';
  let predicate = 'Perlu Pendampingan Khusus';

  if (average >= 90) {
    letterGrade = 'A';
    predicate = 'Sangat Memuaskan (Cum Laude)';
  } else if (average >= 80) {
    letterGrade = 'B';
    predicate = 'Memuaskan & Kompeten';
  } else if (average >= 70) {
    letterGrade = 'C';
    predicate = 'Cukup & Memenuhi KKM';
  }

  return {
    average,
    letterGrade,
    predicate,
  };
}

export interface LessonNarration {
  sectionId: number;
  timeRange: string;
  text: string;
  subtitle: string;
}

/**
 * Provides pedagogical Indonesian spoken narration scripts and subtitles
 * mapped to lesson elapsed seconds and course category.
 */
export function getLessonNarrationScript(
  category: string,
  courseTitle: string,
  teacherName: string,
  sec: number
): LessonNarration {
  const cat = (category || '').toLowerCase();

  if (cat.includes('matematika')) {
    if (sec < 30) {
      return {
        sectionId: 1,
        timeRange: '00:00 - 00:30',
        text: `Halo anak-anak sekalian, selamat datang di menit awal modul pembelajaran ${courseTitle} bersama saya, ${teacherName}. Mari kita ikuti materi ini hingga tuntas.`,
        subtitle: `Menit Awal (00:00): Selamat datang di modul ${courseTitle} bersama ${teacherName}.`,
      };
    }
    if (sec < 90) {
      return {
        sectionId: 2,
        timeRange: '00:30 - 01:30',
        text: 'Perhatikan bidang grafik fungsi kuadrat pada layar. Garis berwarna biru adalah garis singgung dengan gradien m yang bergerak dinamis mengikuti posisi kurva.',
        subtitle: 'Konsep Dasar: Pergeseran kurva, garis singgung biru, dan nilai kemiringan gradien m.',
      };
    }
    if (sec < 180) {
      return {
        sectionId: 3,
        timeRange: '01:30 - 03:00',
        text: 'Ketika nilai turunan pertama sama dengan nol, kita menemukan titik puncak atau titik stasioner kurva.',
        subtitle: "Penurunan Rumus: Titik stasioner kurva diperoleh saat turunan pertama f'(x) = 0.",
      };
    }
    if (sec < 300) {
      return {
        sectionId: 4,
        timeRange: '03:00 - 05:00',
        text: 'Ingat aturan diferensiasi parsial: jika kita menurunkan terhadap variabel x, anggap variabel y sebagai konstanta.',
        subtitle: 'Eksplorasi Lanjutan: Aturan diferensiasi parsial dan interpretasi geometris kurva 3D.',
      };
    }
    if (sec < 420) {
      return {
        sectionId: 5,
        timeRange: '05:00 - 07:00',
        text: 'Konsep kalkulus diferensial ini adalah materi inti yang sangat sering diujikan dalam ujian seleksi masuk perguruan tinggi negeri.',
        subtitle: 'Tips Ujian SNBT: Pemodelan fungsi optimal dan penentuan nilai ekstrim kurva.',
      };
    }
    if (sec < 510) {
      return {
        sectionId: 6,
        timeRange: '07:00 - 08:30',
        text: 'Silakan catat rumus gradien garis singgung ini ke dalam tab catatan belajar mandiri Anda di bagian bawah.',
        subtitle: 'Rangkuman Materi: Catat poin utama kurva stasioner pada buku catatan digital Anda.',
      };
    }
    return {
      sectionId: 7,
      timeRange: '08:30 - 09:32',
      text: 'Bagus sekali! Anda telah menyaksikan seluruh durasi video materi ini dari awal hingga akhir. Silakan selesaikan kuis interaktif!',
      subtitle: 'Akhir Materi (09:32): Materi selesai ditonton penuh! Lanjut kerjakan Kuis untuk klaim +50 XP!',
    };
  }

  if (cat.includes('fisika')) {
    if (sec < 30) {
      return {
        sectionId: 1,
        timeRange: '00:00 - 00:30',
        text: `Halo para siswa cerdas, selamat datang di menit awal laboratorium fisika gelombang dan optika bersama ${teacherName}.`,
        subtitle: `Menit Awal (00:00): Laboratorium Virtual Fisika Optika bersama ${teacherName}.`,
      };
    }
    if (sec < 120) {
      return {
        sectionId: 2,
        timeRange: '00:30 - 02:00',
        text: 'Perhatikan berkas laser yang mengenai prisma kaca. Prisma ini membelokkan berkas cahaya polikromatik.',
        subtitle: 'Refraksi & Dispersi: Berkas sinar laser terurai saat melewati prisma kaca segitiga.',
      };
    }
    if (sec < 240) {
      return {
        sectionId: 3,
        timeRange: '02:00 - 04:00',
        text: 'Dispersi cahaya terjadi karena setiap warna spektrum memiliki indeks bias yang berbeda di dalam medium kaca.',
        subtitle: 'Hukum Snellius: Setiap panjang gelombang spektrum warna memiliki sudut bias unik.',
      };
    }
    if (sec < 420) {
      return {
        sectionId: 4,
        timeRange: '04:00 - 07:00',
        text: 'Menurut Hukum Snellius, hasil kali indeks bias medium pertama dengan sinus sudut datang selalu bernilai konstan.',
        subtitle: 'Kalkulasi Sudut Deviasi: n1 × sin(θ1) = n2 × sin(θ2) pada optika modern.',
      };
    }
    return {
      sectionId: 5,
      timeRange: '07:00 - 09:32',
      text: 'Pemahaman optik ini mendasari teknologi komunikasi kabel fiber optik modern berkecepatan tinggi. Selamat menyelesaikan materi!',
      subtitle: 'Akhir Materi (09:32): Seluruh materi optika selesai dipelajari! Lanjut ke Kuis Pemahaman.',
    };
  }

  if (cat.includes('biologi')) {
    if (sec < 30) {
      return {
        sectionId: 1,
        timeRange: '00:00 - 00:30',
        text: `Selamat datang di menit awal simulasi biologi molekuler dan genetika bersama ${teacherName}.`,
        subtitle: `Menit Awal (00:00): Simulasi Biologi Molekuler DNA bersama ${teacherName}.`,
      };
    }
    if (sec < 150) {
      return {
        sectionId: 2,
        timeRange: '00:30 - 02:30',
        text: 'Di hadapan kita berputar model heliks ganda DNA. Basa adenin selalu berikatan dengan timin, dan guanin dengan sitosin.',
        subtitle: 'Struktur Untai Ganda: Pasangan basa Adenin-Timin dan Guanin-Sitosin.',
      };
    }
    if (sec < 360) {
      return {
        sectionId: 3,
        timeRange: '02:30 - 06:00',
        text: 'Ikatan hidrogen yang stabil menjaga kedua untai DNA tetap terhubung saat proses replikasi seluler.',
        subtitle: 'Replikasi DNA: Peran enzim helikase dan polimerase dalam pembelahan sel.',
      };
    }
    return {
      sectionId: 4,
      timeRange: '06:00 - 09:32',
      text: 'Pahami pasangan basa ini sebelum melanjutkan ke pembahasan transkripsi asam ribonukleat. Selamat menuntaskan sesi!',
      subtitle: 'Akhir Materi (09:32): Materi genetika selesai dipelajari secara lengkap! Kerjakan kuis untuk +50 XP.',
    };
  }

  // Default / Web & Informatics
  if (sec < 30) {
    return {
      sectionId: 1,
      timeRange: '00:00 - 00:30',
      text: `Selamat datang di menit awal kelas pemrograman praktis ${courseTitle} bersama ${teacherName}.`,
      subtitle: `Menit Awal (00:00): Kelas Pemrograman Web Modern bersama ${teacherName}.`,
    };
  }
  if (sec < 150) {
    return {
      sectionId: 2,
      timeRange: '00:30 - 02:30',
      text: 'Perhatikan editor kode interaktif di layar. Kita menyusun komponen web dengan arsitektur reaktif dan modular.',
      subtitle: 'Editor Kode: Struktur komponen reaktif, hook state, dan layout UI.',
    };
  }
  if (sec < 360) {
    return {
      sectionId: 3,
      timeRange: '02:30 - 06:00',
      text: 'Setiap pembaruan data atau state akan merender ulang antarmuka secara instan tanpa memuat ulang seluruh halaman.',
      subtitle: 'Rendering Reaktif: Perubahan state langsung tercermin pada DOM browser secara efisien.',
    };
  }
  return {
    sectionId: 4,
    timeRange: '06:00 - 09:32',
    text: 'Struktur kode yang bersih dan teratur akan sangat memudahkan pemeliharaan sistem web berskala besar. Selamat menuntaskan modul!',
    subtitle: 'Akhir Materi (09:32): Seluruh modul pemrograman web tuntas dipelajari! Lanjut ke Kuis.',
  };
}

export interface RoleCapability {
  role: 'siswa' | 'guru' | 'wali';
  badgeTitle: string;
  allowedNavTabs: string[];
  canGradeAssignments: boolean;
  canSubmitExcuses: boolean;
  canAccessVirtualLab: boolean;
  description: string;
}

/**
 * Returns capabilities and permissions tailored for each role: Siswa, Guru, and Orang Tua (Wali).
 */
export function getRoleCapabilities(role: 'siswa' | 'guru' | 'wali'): RoleCapability {
  switch (role) {
    case 'guru':
      return {
        role: 'guru',
        badgeTitle: 'Pendidik & Wali Kelas',
        allowedNavTabs: ['overview', 'lessons', 'assignments', 'attendance', 'lab', 'skill-graph', 'leaderboard', 'docs'],
        canGradeAssignments: true,
        canSubmitExcuses: false,
        canAccessVirtualLab: true,
        description: 'Akses penuh administrasi nilai, penilaian tugas siswa, validasi presensi, dan simulasi lab.',
      };
    case 'wali':
      return {
        role: 'wali',
        badgeTitle: 'Orang Tua / Wali Murid',
        allowedNavTabs: ['parent-portal', 'attendance', 'skill-graph', 'messages', 'docs'],
        canGradeAssignments: false,
        canSubmitExcuses: true,
        canAccessVirtualLab: false,
        description: 'Pemantauan real-time perkembangan anak: kehadiran harian, grafik nilai, surat izin digital, dan SPP.',
      };
    case 'siswa':
    default:
      return {
        role: 'siswa',
        badgeTitle: 'Siswa / Murid',
        allowedNavTabs: ['overview', 'lessons', 'assignments', 'attendance', 'achievements', 'lab', 'skill-graph', 'leaderboard', 'certificates', 'messages', 'docs'],
        canGradeAssignments: false,
        canSubmitExcuses: false,
        canAccessVirtualLab: true,
        description: 'Akses belajar modul interaktif, pemutaran video berpenjelasan suara, pengerjaan tugas, presensi mandiri, dan lab sains.',
      };
  }
}

export interface SnellRefractionResult {
  n1: number;
  n2: number;
  theta1Deg: number;
  theta2Deg: number | null; // null if total internal reflection
  isTotalInternalReflection: boolean;
  criticalAngleDeg: number | null;
  speedMedium1KmS: number;
  speedMedium2KmS: number;
}

/**
 * Calculates optical refraction and critical angles based on Snellius' Law.
 * n1 * sin(θ1) = n2 * sin(θ2)
 */
export function calculateSnellRefraction(
  n1: number,
  n2: number,
  theta1Deg: number
): SnellRefractionResult {
  const safeN1 = Math.max(1.0, n1);
  const safeN2 = Math.max(1.0, n2);
  const safeTheta1 = Math.min(89.9, Math.max(0, theta1Deg));

  const c = 299792; // speed of light in vacuum ~ km/s
  const speedMedium1KmS = Math.round(c / safeN1);
  const speedMedium2KmS = Math.round(c / safeN2);

  const theta1Rad = (safeTheta1 * Math.PI) / 180;
  const sinTheta2 = (safeN1 * Math.sin(theta1Rad)) / safeN2;

  let criticalAngleDeg: number | null = null;
  if (safeN1 > safeN2) {
    criticalAngleDeg = Math.round((Math.asin(safeN2 / safeN1) * 180) / Math.PI * 10) / 10;
  }

  if (sinTheta2 > 1.0) {
    return {
      n1: safeN1,
      n2: safeN2,
      theta1Deg: safeTheta1,
      theta2Deg: null,
      isTotalInternalReflection: true,
      criticalAngleDeg,
      speedMedium1KmS,
      speedMedium2KmS,
    };
  }

  const theta2Rad = Math.asin(sinTheta2);
  const theta2Deg = Math.round(((theta2Rad * 180) / Math.PI) * 10) / 10;

  return {
    n1: safeN1,
    n2: safeN2,
    theta1Deg: safeTheta1,
    theta2Deg,
    isTotalInternalReflection: false,
    criticalAngleDeg,
    speedMedium1KmS,
    speedMedium2KmS,
  };
}

export interface ParabolaVertexResult {
  vertexX: number;
  vertexY: number;
  discriminant: number;
  roots: number[] | null;
  curvature: 'Membuka ke Atas' | 'Membuka ke Bawah';
  axisOfSymmetry: number;
}

/**
 * Calculates parabola vertex, discriminant, and roots for quadratic y = ax^2 + bx + c.
 */
export function calculateParabolaVertex(a: number, b: number, c: number): ParabolaVertexResult {
  const safeA = a === 0 ? 0.001 : a;
  const vertexX = Math.round((-b / (2 * safeA)) * 100) / 100;
  const vertexY = Math.round((c - (b * b) / (4 * safeA)) * 100) / 100;
  const discriminant = Math.round((b * b - 4 * safeA * c) * 100) / 100;

  let roots: number[] | null = null;
  if (discriminant >= 0) {
    const sqrtD = Math.sqrt(discriminant);
    const r1 = Math.round(((-b + sqrtD) / (2 * safeA)) * 100) / 100;
    const r2 = Math.round(((-b - sqrtD) / (2 * safeA)) * 100) / 100;
    roots = discriminant === 0 ? [r1] : [Math.min(r1, r2), Math.max(r1, r2)];
  }

  return {
    vertexX,
    vertexY,
    discriminant,
    roots,
    curvature: safeA > 0 ? 'Membuka ke Atas' : 'Membuka ke Bawah',
    axisOfSymmetry: vertexX,
  };
}

export interface RubricCriteria {
  concept: number; // max 40
  method: number;  // max 30
  neatness: number;// max 30
}

/**
 * Calculates total score from rubric components and assigns qualitative predicate.
 */
export function calculateRubricScore(criteria: RubricCriteria): {
  totalScore: number;
  letterGrade: 'A' | 'B' | 'C' | 'D';
  predicate: string;
} {
  const safeConcept = Math.max(0, Math.min(40, criteria.concept || 0));
  const safeMethod = Math.max(0, Math.min(30, criteria.method || 0));
  const safeNeatness = Math.max(0, Math.min(30, criteria.neatness || 0));

  const totalScore = safeConcept + safeMethod + safeNeatness;

  let letterGrade: 'A' | 'B' | 'C' | 'D' = 'D';
  let predicate = 'Perlu Pendampingan Lanjut';

  if (totalScore >= 90) {
    letterGrade = 'A';
    predicate = 'Sangat Memuaskan & Komprehensif';
  } else if (totalScore >= 80) {
    letterGrade = 'B';
    predicate = 'Baik & Memenuhi Standar Kompetensi';
  } else if (totalScore >= 70) {
    letterGrade = 'C';
    predicate = 'Cukup & Memenuhi Kriteria Ketuntasan';
  }

  return { totalScore, letterGrade, predicate };
}

export interface ClassAttendanceSummary {
  totalStudents: number;
  presentCount: number;
  permittedCount: number;
  sickCount: number;
  absentCount: number;
  attendancePercentage: number;
}

/**
 * Computes attendance summary statistics for class roster.
 */
export function calculateClassAttendanceSummary(
  students: Array<{ status: string }>
): ClassAttendanceSummary {
  const totalStudents = students.length;
  if (totalStudents === 0) {
    return {
      totalStudents: 0,
      presentCount: 0,
      permittedCount: 0,
      sickCount: 0,
      absentCount: 0,
      attendancePercentage: 0,
    };
  }

  let presentCount = 0;
  let permittedCount = 0;
  let sickCount = 0;
  let absentCount = 0;

  for (const s of students) {
    const st = (s.status || '').toLowerCase();
    if (st === 'hadir') presentCount++;
    else if (st === 'izin') permittedCount++;
    else if (st === 'sakit') sickCount++;
    else absentCount++;
  }

  const attendancePercentage = Math.round((presentCount / totalStudents) * 100);

  return {
    totalStudents,
    presentCount,
    permittedCount,
    sickCount,
    absentCount,
    attendancePercentage,
  };
}

export interface SmartDeadlineItem {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  priority: 'Mendesak' | 'Mendekati' | 'Terjadwal';
  isPending: boolean;
}

/**
 * Categorizes assignments for smart dashboard reminders based on completion status.
 */
export function getSmartDeadlines(
  assignments: Array<{ id: string; title: string; subject: string; dueDate: string; status: string }>
): SmartDeadlineItem[] {
  return assignments
    .filter((a) => a.status === 'belum_dikumpulkan')
    .map((a, idx) => {
      let priority: 'Mendesak' | 'Mendekati' | 'Terjadwal' = 'Terjadwal';
      if (idx === 0) priority = 'Mendesak';
      else if (idx === 1) priority = 'Mendekati';

      return {
        id: a.id,
        title: a.title,
        subject: a.subject,
        dueDate: a.dueDate,
        priority,
        isPending: true,
      };
    });
}

/**
 * Calculates PTN / SNBP university admission eligibility and gap analysis.
 */
export function calculatePtnEligibility(
  userAverageScore: number,
  targetPassingGrade: number,
  certificateBonusXP: number = 0
): {
  probabilityPercent: number;
  gapScore: number;
  status: 'Aman / Peluang Tinggi' | 'Kompetitif / Cukup Peluang' | 'Perlu Peningkatan / Ketat';
  recommendedAction: string;
} {
  const effectiveAverage = userAverageScore + Math.min(3, certificateBonusXP / 300);
  const diff = Math.round((effectiveAverage - targetPassingGrade) * 10) / 10;

  let probabilityPercent = 50 + diff * 8;
  probabilityPercent = Math.min(98, Math.max(15, Math.round(probabilityPercent)));

  let status: 'Aman / Peluang Tinggi' | 'Kompetitif / Cukup Peluang' | 'Perlu Peningkatan / Ketat' = 'Kompetitif / Cukup Peluang';
  let recommendedAction = 'Pertahankan kestabilan nilai semester ini dan perbanyak latihan soal prediksi UTBK.';

  if (probabilityPercent >= 75) {
    status = 'Aman / Peluang Tinggi';
    recommendedAction = 'Portofolio akademik Anda melampaui rata-rata passing grade prodi ini.';
  } else if (probabilityPercent < 45) {
    status = 'Perlu Peningkatan / Ketat';
    recommendedAction = 'Tingkatkan nilai mata pelajaran pendukung prodi utama minimal 3-5 poin pada rapor akhir.';
  }

  return {
    probabilityPercent,
    gapScore: diff,
    status,
    recommendedAction,
  };
}

/**
 * Filters community discussion forum questions by query, subject category, and tab status.
 */
export function filterCommunityQuestions<T extends { title: string; content: string; subject: string; isSolved: boolean; upvotes: number }>(
  questions: T[],
  query: string,
  category: string,
  filterTab: 'all' | 'solved' | 'unsolved' | 'popular'
): T[] {
  const cleanQ = query.trim().toLowerCase();
  const cleanCat = category.trim().toLowerCase();

  return questions.filter((item) => {
    const matchesCategory =
      cleanCat === 'semua' || cleanCat === 'all' || item.subject.toLowerCase() === cleanCat;

    const matchesQuery =
      !cleanQ ||
      item.title.toLowerCase().includes(cleanQ) ||
      item.content.toLowerCase().includes(cleanQ) ||
      item.subject.toLowerCase().includes(cleanQ);

    let matchesTab = true;
    if (filterTab === 'solved') matchesTab = item.isSolved;
    else if (filterTab === 'unsolved') matchesTab = !item.isSolved;
    else if (filterTab === 'popular') matchesTab = item.upvotes >= 10;

    return matchesCategory && matchesQuery && matchesTab;
  });
}

export interface LoginValidationResult {
  isValid: boolean;
  errorMessage?: string;
  matchedRole?: 'siswa' | 'guru' | 'wali';
}

/**
 * Validates login credentials (NIS / NIP / Email and Password) and infers user role.
 */
export function validateLoginCredentials(
  identifier: string,
  password: string,
  preferredRole?: 'siswa' | 'guru' | 'wali'
): LoginValidationResult {
  const cleanId = (identifier || '').trim().toLowerCase();
  const cleanPass = (password || '').trim();

  if (!cleanId) {
    return {
      isValid: false,
      errorMessage: 'NIS, NIP, atau Email akun tidak boleh kosong.',
    };
  }

  if (!cleanPass) {
    return {
      isValid: false,
      errorMessage: 'Kata sandi tidak boleh kosong.',
    };
  }

  if (cleanPass.length < 4) {
    return {
      isValid: false,
      errorMessage: 'Kata sandi harus minimal 4 karakter.',
    };
  }

  let matchedRole: 'siswa' | 'guru' | 'wali' = preferredRole || 'siswa';
  if (cleanId.includes('guru') || cleanId.includes('19820412') || cleanId.includes('siti')) {
    matchedRole = 'guru';
  } else if (cleanId.includes('wali') || cleanId.includes('hendra') || cleanId.includes('orangtua')) {
    matchedRole = 'wali';
  } else if (cleanId.includes('siswa') || cleanId.includes('10214890') || cleanId.includes('rizky')) {
    matchedRole = 'siswa';
  }

  return {
    isValid: true,
    matchedRole,
  };
}



