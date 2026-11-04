import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateStudentLevel,
  calculateCourseProgress,
  evaluateQuizSubmission,
  filterCourses,
  calculateGPA,
  getLessonNarrationScript,
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

