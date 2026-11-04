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
