import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateStudentLevel,
  calculateCourseProgress,
  evaluateQuizSubmission,
  filterCourses,
  calculateGPA,
  getLessonNarrationScript,
  getRoleCapabilities,
  calculateSnellRefraction,
  calculateParabolaVertex,
  calculateRubricScore,
  calculateClassAttendanceSummary,
  getSmartDeadlines,
  calculatePtnEligibility,
  filterCommunityQuestions,
  validateLoginCredentials,
} from './learningLogic.ts';
import { Course, CompetencyScore } from '../types/index.ts';

test('calculateStudentLevel accurately computes level, rank title, and percent progress', () => {
  const level1 = calculateStudentLevel(50);
  assert.equal(level1.level, 1);
  assert.equal(level1.progressPercent, 50);
  assert.equal(level1.title, 'Pelajar Pemula');

  const level9 = calculateStudentLevel(876);
  assert.equal(level9.level, 9);
  assert.equal(level9.progressPercent, 76);
  assert.equal(level9.title, 'Master Eksplorer');
});

test('calculateCourseProgress handles valid ratios and boundary checks', () => {
  assert.equal(calculateCourseProgress(18, 40), 45);
  assert.equal(calculateCourseProgress(0, 20), 0);
  assert.equal(calculateCourseProgress(25, 25), 100);
  assert.equal(calculateCourseProgress(10, 0), 0);
});

test('evaluateQuizSubmission properly scores and awards points', () => {
  const result = evaluateQuizSubmission([0, 1, 2], [0, 1, 2], 50);
  assert.equal(result.score, 100);
  assert.equal(result.earnedPoints, 150);
  assert.equal(result.isPassed, true);
  assert.equal(result.correctCount, 3);

  const partial = evaluateQuizSubmission([0, 0, 0], [0, 1, 2], 30);
  assert.equal(partial.correctCount, 1);
  assert.equal(partial.score, 33);
  assert.equal(partial.isPassed, false);
});

test('filterCourses filters accurately by query string and subject category', () => {
  const mockCourses = [
    { id: '1', code: 'MAT-12', title: 'Kalkulus Terapan', category: 'Matematika', teacher: 'Ibu Rahma' },
    { id: '2', code: 'FIS-12', title: 'Fisika Kuantum', category: 'IPA', teacher: 'Pak Budi' },
    { id: '3', code: 'RPL-12', title: 'Web Development', category: 'Informatika', teacher: 'Pak Deni' },
  ] as Course[];

  const all = filterCourses(mockCourses, '', 'semua');
  assert.equal(all.length, 3);

  const mathOnly = filterCourses(mockCourses, '', 'Matematika');
  assert.equal(mathOnly.length, 1);
  assert.equal(mathOnly[0].code, 'MAT-12');

  const searched = filterCourses(mockCourses, 'kuantum', 'semua');
  assert.equal(searched.length, 1);
  assert.equal(searched[0].id, '2');
});

test('calculateGPA computes accurate average and grade predicates', () => {
  const sampleScores: CompetencyScore[] = [
    { subject: 'Matematika', score: 92, kkm: 75, grade: 'A', predicate: 'Sangat Baik', description: '', competencies: [] },
    { subject: 'Fisika', score: 88, kkm: 75, grade: 'B', predicate: 'Baik', description: '', competencies: [] },
    { subject: 'Informatika', score: 96, kkm: 75, grade: 'A', predicate: 'Sangat Baik', description: '', competencies: [] },
  ];

  const gpa = calculateGPA(sampleScores);
  assert.equal(gpa.average, 92);
  assert.equal(gpa.letterGrade, 'A');
  assert.equal(gpa.predicate, 'Sangat Memuaskan (Cum Laude)');
});

test('getLessonNarrationScript returns context-specific Indonesian audio narration scripts and subtitles', () => {
  const mathNarration = getLessonNarrationScript('Matematika', 'Kalkulus Lanjut', 'Ibu Rahma', 5);
  assert.equal(mathNarration.sectionId, 1);
  assert.ok(mathNarration.text.includes('Kalkulus Lanjut'));
  assert.ok(mathNarration.text.includes('Ibu Rahma'));

  const mathMid = getLessonNarrationScript('Matematika', 'Kalkulus Lanjut', 'Ibu Rahma', 45);
  assert.equal(mathMid.sectionId, 2);
  assert.ok(mathMid.text.includes('gradien m'));

  const physics = getLessonNarrationScript('Fisika', 'Optika Modern', 'Pak Budi', 130);
  assert.ok(physics.text.includes('indeks bias'));

  const bio = getLessonNarrationScript('Biologi', 'Genetika', 'Ibu Linda', 45);
  assert.ok(bio.text.includes('adenin'));
});

test('getRoleCapabilities properly isolates features for siswa, guru, and wali', () => {
  const siswa = getRoleCapabilities('siswa');
  assert.equal(siswa.canGradeAssignments, false);
  assert.equal(siswa.canAccessVirtualLab, true);

  const guru = getRoleCapabilities('guru');
  assert.equal(guru.canGradeAssignments, true);
  assert.equal(guru.canSubmitExcuses, false);

  const wali = getRoleCapabilities('wali');
  assert.equal(wali.canSubmitExcuses, true);
  assert.equal(wali.canGradeAssignments, false);
  assert.ok(wali.allowedNavTabs.includes('parent-portal'));
});

test('calculateSnellRefraction correctly handles refraction and total internal reflection', () => {
  // Air (1.0) to Water (1.33) at 30 deg
  const airToWater = calculateSnellRefraction(1.0, 1.33, 30);
  assert.equal(airToWater.isTotalInternalReflection, false);
  assert.ok(airToWater.theta2Deg !== null && airToWater.theta2Deg > 21 && airToWater.theta2Deg < 23);

  // Glass (1.5) to Air (1.0) at 60 deg -> TIR (critical angle ~41.8 deg)
  const tir = calculateSnellRefraction(1.5, 1.0, 60);
  assert.equal(tir.isTotalInternalReflection, true);
  assert.equal(tir.theta2Deg, null);
  assert.ok(tir.criticalAngleDeg !== null && tir.criticalAngleDeg > 41 && tir.criticalAngleDeg < 42.5);
});

test('calculateParabolaVertex determines vertex, discriminant and roots', () => {
  // y = x^2 - 4x + 3 -> roots at x=1 and x=3, vertex at (2, -1)
  const res = calculateParabolaVertex(1, -4, 3);
  assert.equal(res.vertexX, 2);
  assert.equal(res.vertexY, -1);
  assert.equal(res.discriminant, 4);
  assert.deepEqual(res.roots, [1, 3]);
  assert.equal(res.curvature, 'Membuka ke Atas');
});

test('calculateRubricScore correctly calculates total score and qualitative grade', () => {
  const result = calculateRubricScore({ concept: 38, method: 28, neatness: 28 });
  assert.equal(result.totalScore, 94);
  assert.equal(result.letterGrade, 'A');
  assert.equal(result.predicate, 'Sangat Memuaskan & Komprehensif');

  const partial = calculateRubricScore({ concept: 30, method: 25, neatness: 20 });
  assert.equal(partial.totalScore, 75);
  assert.equal(partial.letterGrade, 'C');
});

test('calculateClassAttendanceSummary calculates accurate percentages and status counts', () => {
  const students = [
    { status: 'hadir' },
    { status: 'hadir' },
    { status: 'hadir' },
    { status: 'izin' },
    { status: 'sakit' },
  ];
  const summary = calculateClassAttendanceSummary(students);
  assert.equal(summary.totalStudents, 5);
  assert.equal(summary.presentCount, 3);
  assert.equal(summary.permittedCount, 1);
  assert.equal(summary.sickCount, 1);
  assert.equal(summary.absentCount, 0);
  assert.equal(summary.attendancePercentage, 60);
});

test('getSmartDeadlines filters only pending tasks and tags urgency', () => {
  const mockTasks = [
    { id: '1', title: 'Tugas 1', subject: 'Matematika', dueDate: 'Besok', status: 'belum_dikumpulkan' },
    { id: '2', title: 'Tugas 2', subject: 'Fisika', dueDate: 'Lusa', status: 'belum_dikumpulkan' },
    { id: '3', title: 'Tugas 3', subject: 'Kimia', dueDate: 'Kemarin', status: 'selesai_dinilai' },
  ];
  const deadlines = getSmartDeadlines(mockTasks);
  assert.equal(deadlines.length, 2);
  assert.equal(deadlines[0].priority, 'Mendesak');
  assert.equal(deadlines[1].priority, 'Mendekati');
});

test('calculatePtnEligibility determines correct admission probability and risk status', () => {
  // High score vs moderate passing grade (94 vs 86)
  const high = calculatePtnEligibility(94, 86, 300);
  assert.ok(high.probabilityPercent >= 80);
  assert.equal(high.status, 'Aman / Peluang Tinggi');

  // Competitive (88 vs 88)
  const comp = calculatePtnEligibility(88, 88, 0);
  assert.equal(comp.probabilityPercent, 50);
  assert.equal(comp.status, 'Kompetitif / Cukup Peluang');

  // Below target (80 vs 87)
  const tight = calculatePtnEligibility(80, 87, 0);
  assert.ok(tight.probabilityPercent < 55);
  assert.equal(tight.status, 'Perlu Peningkatan / Ketat');
});

test('filterCommunityQuestions correctly filters by subject, query, and status tabs', () => {
  const sampleQuestions = [
    { id: '1', title: 'Cara mencari limit tak hingga', content: 'Pembagian pangkat tertinggi', subject: 'Matematika', isSolved: true, upvotes: 15 },
    { id: '2', title: 'Hukum Snellius pembiasan', content: 'Sudut datang dan indeks bias', subject: 'Fisika', isSolved: false, upvotes: 4 },
    { id: '3', title: 'Rekursi fungsi di Python', content: 'Base case recursion', subject: 'Informatika', isSolved: false, upvotes: 12 },
  ];

  const mathOnly = filterCommunityQuestions(sampleQuestions, '', 'Matematika', 'all');
  assert.equal(mathOnly.length, 1);
  assert.equal(mathOnly[0].id, '1');

  const solvedOnly = filterCommunityQuestions(sampleQuestions, '', 'semua', 'solved');
  assert.equal(solvedOnly.length, 1);
  assert.equal(solvedOnly[0].id, '1');

  const popularOnly = filterCommunityQuestions(sampleQuestions, '', 'semua', 'popular');
  assert.equal(popularOnly.length, 2); // 15 and 12 upvotes

  const searched = filterCommunityQuestions(sampleQuestions, 'Snellius', 'semua', 'all');
  assert.equal(searched.length, 1);
  assert.equal(searched[0].id, '2');
});

test('validateLoginCredentials validates credentials, length, and auto-detects roles', () => {
  // Empty identifier error
  const emptyId = validateLoginCredentials('', 'password123');
  assert.equal(emptyId.isValid, false);
  assert.ok(emptyId.errorMessage?.includes('kosong'));

  // Short password error
  const shortPass = validateLoginCredentials('siswa@nusantara.edu', '123');
  assert.equal(shortPass.isValid, false);
  assert.ok(shortPass.errorMessage?.includes('minimal 4'));

  // Siswa credentials
  const siswa = validateLoginCredentials('10214890', 'password123');
  assert.equal(siswa.isValid, true);
  assert.equal(siswa.matchedRole, 'siswa');

  // Guru credentials
  const guru = validateLoginCredentials('guru.siti@nusantara.edu', 'guru2026');
  assert.equal(guru.isValid, true);
  assert.equal(guru.matchedRole, 'guru');

  // Wali credentials
  const wali = validateLoginCredentials('wali.hendra@nusantara.edu', 'wali2026');
  assert.equal(wali.isValid, true);
  assert.equal(wali.matchedRole, 'wali');
});
