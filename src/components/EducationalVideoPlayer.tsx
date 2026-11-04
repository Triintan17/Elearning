import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  SkipBack,
  SkipForward,
  Volume2,
  Volume1,
  VolumeX,
  Maximize2,
  Subtitles,
  Radio,
  Sparkles,
  Mic,
  AudioLines,
  Volume,
} from 'lucide-react';
import { Course, Lesson } from '../types/index.ts';
import { getLessonNarrationScript } from '../utils/learningLogic.ts';

interface EducationalVideoPlayerProps {
  course: Course;
  lesson: Lesson;
  isPlaying: boolean;
  onTogglePlay: () => void;
  currentTimeSec: number;
  durationSec: number;
  onSeek: (seconds: number) => void;
  playbackSpeed: number;
  onSpeedToggle: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  showSubtitles: boolean;
  onToggleSubtitles: () => void;
  onComplete: () => void;
  volume?: number;
  onVolumeChange?: (vol: number) => void;
}

export const EducationalVideoPlayer: React.FC<EducationalVideoPlayerProps> = ({
  course,
  lesson,
  isPlaying,
  onTogglePlay,
  currentTimeSec,
  durationSec,
  onSeek,
  playbackSpeed,
  onSpeedToggle,
  isMuted,
  onToggleMute,
  showSubtitles,
  onToggleSubtitles,
  onComplete,
  volume = 0.8,
  onVolumeChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Web Audio Context & Nodes
  const audioCtxRef = useRef<AudioContext | null>(null);
  const synthOscRef = useRef<OscillatorNode | null>(null);
  const synthGainRef = useRef<GainNode | null>(null);

  const [hasStarted, setHasStarted] = useState<boolean>(true);
  const [internalVolume, setInternalVolume] = useState<number>(volume);
  const [isTeacherSpeaking, setIsTeacherSpeaking] = useState<boolean>(false);
  const [lastSpokenSectionId, setLastSpokenSectionId] = useState<number>(-1);
  const [audioActivated, setAudioActivated] = useState<boolean>(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState<boolean>(false);

  // Get current pedagogical narration and subtitle for this moment
  const narration = getLessonNarrationScript(
    course.category,
    course.title,
    course.teacher,
    currentTimeSec
  );

  // Initialize or resume Web Audio Context safely
  const ensureAudioContext = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!audioCtxRef.current && AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
      if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      setAudioActivated(true);
      return audioCtxRef.current;
    } catch (e) {
      return null;
    }
  }, []);

  // Play a harmonic pleasant chime on chapter transition
  const playChapterChime = useCallback(() => {
    if (isMuted) return;
    const ctx = ensureAudioContext();
    if (!ctx) return;

    try {
      const freqs = [523.25, 659.25, 783.99]; // C5, E5, G5 major triad
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);

        const targetVol = internalVolume * 0.12;
        gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.08);
        gain.gain.linearRampToValueAtTime(targetVol, ctx.currentTime + idx * 0.08 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.08 + 0.6);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.08);
        osc.stop(ctx.currentTime + idx * 0.08 + 0.65);
      });
    } catch (e) {}
  }, [internalVolume, isMuted, ensureAudioContext]);

  // Indonesian Speech Synthesis Voice Function
  const speakTeacherText = useCallback(
    (textToSpeak: string) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
      if (isMuted || internalVolume === 0) return;

      ensureAudioContext();

      try {
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.rate = Math.max(0.85, Math.min(1.4, playbackSpeed));
        utterance.pitch = 1.05;
        utterance.volume = internalVolume;

        // Find Indonesian voice if present, otherwise default
        const voices = window.speechSynthesis.getVoices();
        const idVoice = voices.find(
          (v) =>
            v.lang.toLowerCase().startsWith('id') ||
            v.lang.toLowerCase().includes('id-id') ||
            v.name.toLowerCase().includes('indonesian')
        );
        if (idVoice) {
          utterance.voice = idVoice;
        }
        utterance.lang = 'id-ID';

        utterance.onstart = () => {
          setIsTeacherSpeaking(true);
        };
        utterance.onend = () => {
          setIsTeacherSpeaking(false);
        };
        utterance.onerror = () => {
          setIsTeacherSpeaking(false);
        };

        window.speechSynthesis.speak(utterance);
      } catch (err) {
        setIsTeacherSpeaking(false);
      }
    },
    [isMuted, internalVolume, playbackSpeed, ensureAudioContext]
  );

  // Trigger speech when narration section changes or when playing
  useEffect(() => {
    if (isPlaying && !isMuted) {
      if (narration.sectionId !== lastSpokenSectionId) {
        setLastSpokenSectionId(narration.sectionId);
        playChapterChime();
        speakTeacherText(narration.text);
      }
    } else {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsTeacherSpeaking(false);
    }
  }, [
    isPlaying,
    isMuted,
    narration.sectionId,
    lastSpokenSectionId,
    narration.text,
    playChapterChime,
    speakTeacherText,
  ]);

  // Ambient educational studio background tone (Web Audio API)
  useEffect(() => {
    if (isPlaying && !isMuted && internalVolume > 0) {
      const ctx = ensureAudioContext();
      if (ctx) {
        if (!synthOscRef.current) {
          try {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const filter = ctx.createBiquadFilter();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(164.81, ctx.currentTime); // E3 warm soft tone

            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(450, ctx.currentTime); // Warm lecture studio acoustic

            const targetVol = internalVolume * 0.04;
            gain.gain.setValueAtTime(0.001, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(targetVol, ctx.currentTime + 0.5);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);
            osc.start();

            synthOscRef.current = osc;
            synthGainRef.current = gain;
          } catch (e) {}
        } else if (synthGainRef.current) {
          const targetVol = internalVolume * 0.04;
          synthGainRef.current.gain.setValueAtTime(targetVol, ctx.currentTime);
        }
      }
    } else {
      if (synthOscRef.current) {
        try {
          synthOscRef.current.stop();
          synthOscRef.current.disconnect();
        } catch (e) {}
        synthOscRef.current = null;
        synthGainRef.current = null;
      }
    }

    return () => {
      if (synthOscRef.current) {
        try {
          synthOscRef.current.stop();
          synthOscRef.current.disconnect();
        } catch (e) {}
        synthOscRef.current = null;
        synthGainRef.current = null;
      }
    };
  }, [isPlaying, isMuted, internalVolume, ensureAudioContext]);

  // Stop speech & audio on component unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Update volume
  const handleVolumeSlide = (newVol: number) => {
    setInternalVolume(newVol);
    if (onVolumeChange) onVolumeChange(newVol);
    if (isMuted && newVol > 0) onToggleMute();
  };

  // Manual replay button for teacher explanation
  const handleReplayTeacherSpeech = () => {
    ensureAudioContext();
    if (isMuted) onToggleMute();
    playChapterChime();
    speakTeacherText(narration.text);
  };

  // Canvas visual rendering animation loop
  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frame = 0;
    let lastTime = 0;
    const frameInterval = 1000 / 24; // 24 fps smooth playback rate

    const render = (timestamp: number) => {
      animId = requestAnimationFrame(render);
      if (timestamp - lastTime < frameInterval) return;
      lastTime = timestamp;

      frame++;
      const width = canvas.width;
      const height = canvas.height;

      // Dark studio canvas background
      ctx.fillStyle = '#0B0F17';
      ctx.fillRect(0, 0, width, height);

      // Grid background effect
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      const isMath = course.category.toLowerCase().includes('matematika');
      const isPhysics = course.category.toLowerCase().includes('fisika');
      const isBiology = course.category.toLowerCase().includes('biologi');

      const timeOffset = isPlaying ? frame * 0.03 * playbackSpeed : 0;

      if (isMath) {
        // Dynamic Parabolic Waveform & Calculus Curves
        ctx.save();
        ctx.translate(width / 2, height / 2 + 30);

        // Coordinate axes
        ctx.strokeStyle = 'rgba(255, 90, 38, 0.4)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-width / 3, 0);
        ctx.lineTo(width / 3, 0);
        ctx.moveTo(0, -height / 3);
        ctx.lineTo(0, height / 3);
        ctx.stroke();

        // Parabola f(x) = a * x^2
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#FF5A26';
        ctx.beginPath();
        for (let x = -width / 4; x <= width / 4; x += 4) {
          const y = -0.003 * Math.pow(x, 2) + Math.sin(x * 0.05 + timeOffset) * 15;
          if (x === -width / 4) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Tangent Line at moving point
        const ptX = Math.sin(timeOffset * 0.7) * (width / 6);
        const ptY = -0.003 * Math.pow(ptX, 2) + Math.sin(ptX * 0.05 + timeOffset) * 15;
        const slope = -0.006 * ptX;

        ctx.strokeStyle = '#38BDF8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(ptX - 80, ptY - slope * 80);
        ctx.lineTo(ptX + 80, ptY + slope * 80);
        ctx.stroke();

        // Tangent Point Circle
        ctx.fillStyle = '#FF5A26';
        ctx.beginPath();
        ctx.arc(ptX, ptY, 6, 0, Math.PI * 2);
        ctx.fill();

        // Text Equation
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 16px "JetBrains Mono", monospace';
        ctx.fillText(`f'(x) = 2x - 3 · Gradien m = ${slope.toFixed(2)}`, -width / 4, -height / 3 + 20);
        ctx.fillStyle = '#F97316';
        ctx.font = '13px "Plus Jakarta Sans", sans-serif';
        ctx.fillText(`Titik Singgung P(${ptX.toFixed(0)}, ${(-ptY).toFixed(0)})`, ptX + 12, ptY - 8);

        ctx.restore();
      } else if (isPhysics) {
        // Optics Laser Refraction & Prism Dispersion
        ctx.save();
        const prismX = width / 2;
        const prismY = height / 2;

        // Triangular Prism
        ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.8)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(prismX, prismY - 120);
        ctx.lineTo(prismX - 110, prismY + 90);
        ctx.lineTo(prismX + 110, prismY + 90);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Incident Laser Beam (Red)
        ctx.strokeStyle = '#EF4444';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(width / 6, prismY + 30);
        ctx.lineTo(prismX - 45, prismY);
        ctx.stroke();

        // Refracted Spectrum inside and exiting
        const colors = ['#EF4444', '#F97316', '#EAB308', '#22C55E', '#06B6D4', '#8B5CF6'];
        colors.forEach((col, idx) => {
          ctx.strokeStyle = col;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(prismX - 45, prismY);
          const exitY = prismY + 15 + idx * 6;
          ctx.lineTo(prismX + 45, exitY);
          ctx.lineTo(width - width / 5, exitY + (idx - 2.5) * 25 + Math.sin(timeOffset + idx) * 3);
          ctx.stroke();
        });

        // Label
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 15px "JetBrains Mono", monospace';
        ctx.fillText('HUKUM SNELLIUS: n₁·sin(θ₁) = n₂·sin(θ₂)', width / 6, prismY - 130);
        ctx.fillStyle = '#38BDF8';
        ctx.font = '13px "Plus Jakarta Sans", sans-serif';
        ctx.fillText('Dispersi Spektrum Cahaya Polikromatik', width / 6, prismY - 110);

        ctx.restore();
      } else if (isBiology) {
        // Rotating DNA Double Helix
        ctx.save();
        ctx.translate(width / 2, height / 2);

        const strandCount = 20;
        const spacing = 18;
        const totalHeight = strandCount * spacing;
        const startY = -totalHeight / 2;

        for (let i = 0; i < strandCount; i++) {
          const y = startY + i * spacing;
          const angle = timeOffset * 1.5 + i * 0.35;
          const x1 = Math.sin(angle) * 110;
          const x2 = -Math.sin(angle) * 110;
          const depth = Math.cos(angle);

          // Rung line between bases
          ctx.strokeStyle = depth > 0 ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.15)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(x1, y);
          ctx.lineTo(x2, y);
          ctx.stroke();

          // Base 1 (Adenin / Timin)
          ctx.fillStyle = depth > 0 ? '#10B981' : '#059669';
          ctx.beginPath();
          ctx.arc(x1, y, depth > 0 ? 7 : 5, 0, Math.PI * 2);
          ctx.fill();

          // Base 2 (Guanin / Sitosin)
          ctx.fillStyle = depth > 0 ? '#FF5A26' : '#C2410C';
          ctx.beginPath();
          ctx.arc(x2, y, depth > 0 ? 7 : 5, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 15px "JetBrains Mono", monospace';
        ctx.fillText('REPLIKASI DNA HELIKASE & TRANSLASI mRNA', -width / 3, -height / 2 + 40);

        ctx.restore();
      } else {
        // Web Development / Code Editor Animation
        ctx.save();
        ctx.fillStyle = '#1E1E2E';
        ctx.roundRect(width / 8, height / 6, (width * 3) / 4, (height * 2) / 3, 16);
        ctx.fill();

        // Mac window dots
        ctx.fillStyle = '#EF4444';
        ctx.beginPath();
        ctx.arc(width / 8 + 24, height / 6 + 20, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#F59E0B';
        ctx.beginPath();
        ctx.arc(width / 8 + 44, height / 6 + 20, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#10B981';
        ctx.beginPath();
        ctx.arc(width / 8 + 64, height / 6 + 20, 6, 0, Math.PI * 2);
        ctx.fill();

        // Code Lines
        const codeLines = [
          { text: 'import React, { useState } from "react";', color: '#C084FC' },
          { text: 'import { motion } from "framer-motion";', color: '#C084FC' },
          { text: '', color: '#FFFFFF' },
          { text: 'export function App() {', color: '#38BDF8' },
          { text: '  const [count, setCount] = useState(42);', color: '#F43F5E' },
          { text: '  const handleAction = () => setCount(prev => prev + 1);', color: '#FBBF24' },
          { text: '  return (', color: '#38BDF8' },
          { text: '    <div className="flex p-8 bg-slate-900 rounded-3xl">', color: '#4ADE80' },
          { text: '      <h1 className="text-xl font-bold text-orange-500">', color: '#4ADE80' },
          { text: '        NusantaraEdu E-Learning Studio', color: '#FFFFFF' },
          { text: '      </h1>', color: '#4ADE80' },
          { text: '    </div>', color: '#4ADE80' },
          { text: '  );', color: '#38BDF8' },
          { text: '}', color: '#38BDF8' },
        ];

        ctx.font = '13px "JetBrains Mono", monospace';
        codeLines.forEach((line, idx) => {
          ctx.fillStyle = '#64748B';
          ctx.fillText(String(idx + 1).padStart(2, '0'), width / 8 + 20, height / 6 + 55 + idx * 20);

          ctx.fillStyle = line.color;
          ctx.fillText(line.text, width / 8 + 55, height / 6 + 55 + idx * 20);
        });

        // Blinking Cursor
        if (Math.sin(frame * 0.1) > 0) {
          ctx.fillStyle = '#FF5A26';
          ctx.fillRect(width / 8 + 55 + 240, height / 6 + 55 + 9 * 20 - 12, 8, 16);
        }

        ctx.restore();
      }

      // Audio Equalizer Waveform in bottom right corner (reacts dynamically to teacher speaking)
      if (isPlaying && !isMuted) {
        ctx.save();
        ctx.translate(width - 150, height - 35);
        ctx.fillStyle = isTeacherSpeaking ? '#22C55E' : '#FF5A26';
        const numBars = 12;
        for (let b = 0; b < numBars; b++) {
          const mult = isTeacherSpeaking ? 28 : 12;
          const barHeight = Math.abs(Math.sin(frame * 0.2 + b * 0.6)) * mult + 4;
          ctx.fillRect(b * 7, -barHeight, 4, barHeight);
        }
        ctx.restore();
      }
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, course.category, playbackSpeed, isMuted, isTeacherSpeaking]);

  const formatTime = (secs: number) => {
    const safe = Math.max(0, Math.floor(secs));
    const mins = Math.floor(safe / 60);
    const remainder = safe % 60;
    const mm = String(mins).padStart(2, '0');
    const ss = String(remainder).padStart(2, '0');
    return `${mm}:${ss}`;
  };

  const handleScrubberClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const targetSec = Math.floor(ratio * durationSec);
    onSeek(targetSec);
    // Restart voice from new section
    setLastSpokenSectionId(-1);
  };

  const handleFullscreen = () => {
    if (containerRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        containerRef.current.requestFullscreen();
      }
    }
  };

  const isCompleted = currentTimeSec >= durationSec;

  return (
    <div
      ref={containerRef}
      className="bg-black rounded-3xl overflow-hidden shadow-2xl relative select-none border border-slate-800"
    >
      {/* Visual Canvas Stage */}
      <div className="relative aspect-video w-full flex items-center justify-center overflow-hidden bg-black">
        <canvas
          ref={canvasRef}
          width={960}
          height={540}
          className="w-full h-full object-cover cursor-pointer"
          onClick={() => {
            ensureAudioContext();
            setHasStarted(true);
            onTogglePlay();
          }}
        />

        {/* Big Center Play / Pause Overlay (Only if not completed) */}
        {!isCompleted && (!isPlaying || !hasStarted) && (
          <button
            onClick={() => {
              ensureAudioContext();
              setHasStarted(true);
              onTogglePlay();
            }}
            aria-label={isPlaying ? 'Jeda Video' : 'Putar Video Sekarang'}
            className="absolute w-20 h-20 rounded-full bg-[#FF5A26] hover:bg-[#E84E1D] text-white flex items-center justify-center shadow-2xl transform transition-transform hover:scale-110 active:scale-95 z-20 group"
          >
            <Play className="w-9 h-9 ml-1 fill-white" />
            <span className="sr-only">Putar Video</span>
          </button>
        )}

        {/* Video Completed Full End-Card Overlay */}
        {isCompleted && (
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-30 animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xl shadow-emerald-500/30 mb-3 animate-bounce">
              <Sparkles className="w-8 h-8" />
            </div>

            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-wider border border-emerald-500/30">
              🎉 Materi Selesai Ditonton Penuh!
            </span>

            <h3 className="text-xl md:text-2xl font-black text-white mt-2">
              {lesson.title}
            </h3>

            <p className="text-xs text-slate-300 max-w-md mt-1 leading-relaxed">
              Selamat! Anda telah menyelesaikan pemutaran materi ini dari menit awal (00:00) hingga tuntas ({formatTime(durationSec)}).
            </p>

            <div className="flex items-center gap-2 mt-3 px-3.5 py-1.5 rounded-xl bg-orange-500/20 border border-orange-500/30 text-orange-300 text-xs font-bold font-mono">
              <span>+50 XP Berhasil Diklaim</span>
            </div>

            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={() => {
                  onSeek(0);
                  setHasStarted(true);
                  if (!isPlaying) onTogglePlay();
                }}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors flex items-center gap-2 border border-white/10"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Putar Ulang dari Menit Awal (00:00)</span>
              </button>

              <button
                onClick={onComplete}
                className="px-5 py-2.5 rounded-xl bg-[#FF5A26] hover:bg-[#E84E1D] text-white text-xs font-bold transition-all shadow-md flex items-center gap-2"
              >
                <span>Kerjakan Kuis Interaktif</span>
                <Sparkles className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Top Video Header HUD */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-white text-xs font-semibold bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl z-10">
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isPlaying ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'
              }`}
            />
            <span className="truncate max-w-[200px] md:max-w-xs font-bold">
              {lesson.title}
            </span>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            {/* Real-time Teacher Audio State Indicator Badge */}
            <button
              onClick={handleReplayTeacherSpeech}
              title="Klik untuk dengarkan penjelasan suara guru saat ini"
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] md:text-xs font-bold transition-all shadow-xs ${
                isTeacherSpeaking
                  ? 'bg-emerald-500 text-white animate-pulse'
                  : isMuted
                  ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                  : 'bg-orange-500/20 text-orange-300 hover:bg-orange-500/40 border border-orange-500/30'
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
              <span>
                {isTeacherSpeaking
                  ? '🎙️ Guru Sedang Berbicara...'
                  : isMuted
                  ? '🔇 Audio Mati'
                  : '🔊 Suara Guru Aktif (Klik Dengarkan)'}
              </span>
            </button>

            <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-orange-500/20 text-orange-400 text-[10px] font-extrabold uppercase tracking-wider border border-orange-500/30">
              🔴 Live HD
            </span>
          </div>
        </div>

        {/* Teacher PIP (Picture-In-Picture) Webcam Badge */}
        <div className="absolute top-16 right-4 w-28 h-20 md:w-36 md:h-24 rounded-2xl overflow-hidden border-2 border-white/20 shadow-xl bg-slate-900 pointer-events-none z-10 hidden sm:block">
          <img
            src={course.teacherAvatar}
            alt={course.teacher}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 to-transparent p-1.5 text-center">
            <p className="text-[10px] text-white font-extrabold truncate">{course.teacher}</p>
            <div className="flex items-center justify-center gap-1 mt-0.5">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isTeacherSpeaking
                    ? 'bg-emerald-400 animate-ping'
                    : isPlaying
                    ? 'bg-emerald-400'
                    : 'bg-amber-400'
                }`}
              />
              <span className="text-[9px] text-emerald-400 font-bold block leading-none">
                {isTeacherSpeaking ? 'Bicara (id-ID)' : isPlaying ? 'Mengajar' : 'Standby'}
              </span>
            </div>
          </div>
        </div>

        {/* Floating Synchronized Subtitles Overlay */}
        {showSubtitles && (
          <div className="absolute bottom-14 inset-x-4 md:inset-x-8 flex justify-center pointer-events-none z-10">
            <div className="bg-black/85 backdrop-blur-sm text-white text-xs md:text-sm font-semibold px-4 py-2.5 rounded-2xl text-center max-w-xl shadow-2xl border border-white/10 leading-relaxed">
              <p className="text-orange-400 text-[10px] uppercase font-bold tracking-wider mb-0.5">
                {narration.timeRange} · {course.teacher}
              </p>
              <span>{narration.subtitle}</span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Scrubber & Control Bar */}
      <div className="bg-slate-950/95 backdrop-blur-md px-4 py-3 border-t border-slate-800 relative z-20 space-y-2">
        {/* Chapter Milestones Bar */}
        <div className="hidden sm:flex items-center justify-between text-[10px] font-mono text-slate-400 px-1">
          {[
            { sec: 0, label: '00:00 Menit Awal' },
            { sec: 90, label: '01:30 Teori' },
            { sec: 180, label: '03:00 Visual' },
            { sec: 300, label: '05:00 Latihan' },
            { sec: 420, label: '07:00 Rangkuman' },
            { sec: durationSec, label: `${formatTime(durationSec)} Menit Akhir` },
          ].map((chap, i) => {
            const isPassed = currentTimeSec >= chap.sec;
            return (
              <button
                key={i}
                onClick={() => {
                  onSeek(chap.sec);
                  setLastSpokenSectionId(-1);
                }}
                className={`transition-colors hover:text-white flex items-center gap-1 ${
                  isPassed ? 'text-orange-400 font-bold' : 'text-slate-500'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${isPassed ? 'bg-[#FF5A26]' : 'bg-slate-700'}`} />
                <span>{chap.label}</span>
              </button>
            );
          })}
        </div>

        {/* Scrubber Bar */}
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono text-slate-300 tabular-nums w-12 text-right font-bold">
            {formatTime(currentTimeSec)}
          </span>
          <div
            className="flex-1 h-2.5 bg-slate-700/80 rounded-full cursor-pointer relative overflow-hidden group/scrubber"
            onClick={handleScrubberClick}
          >
            <div
              style={{
                width: `${durationSec > 0 ? (currentTimeSec / durationSec) * 100 : 0}%`,
              }}
              className="h-full bg-[#FF5A26] rounded-full relative transition-all duration-100"
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-xs opacity-0 group-hover/scrubber:opacity-100 transition-opacity" />
            </div>
          </div>
          <span className="text-[11px] font-mono text-slate-400 tabular-nums w-12 font-bold">
            {formatTime(durationSec)}
          </span>
        </div>

        {/* Control Buttons & Audio Management */}
        <div className="flex items-center justify-between text-white text-xs pt-1">
          <div className="flex items-center gap-1.5 md:gap-2">
            {/* Quick Seek to 00:00 (Awal) */}
            <button
              onClick={() => {
                onSeek(0);
                setLastSpokenSectionId(-1);
              }}
              className="px-2 py-1 rounded-lg bg-white/10 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-[10px] font-mono font-bold"
              title="Mulai dari Menit Awal (00:00)"
            >
              00:00
            </button>

            {/* Skip Back -10s */}
            <button
              onClick={() => {
                onSeek(Math.max(0, currentTimeSec - 10));
                setLastSpokenSectionId(-1);
              }}
              className="w-8 h-8 rounded-lg bg-white/10 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
              title="Mundur 10 detik"
            >
              <SkipBack className="w-3.5 h-3.5" />
            </button>

            {/* Play/Pause */}
            <button
              onClick={() => {
                ensureAudioContext();
                setHasStarted(true);
                onTogglePlay();
              }}
              aria-label={isPlaying ? 'Jeda Video' : 'Putar Video'}
              className="w-9 h-9 rounded-xl bg-white/10 hover:bg-[#FF5A26] flex items-center justify-center transition-colors text-white shadow-xs"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>

            {/* Skip Forward +10s */}
            <button
              onClick={() => {
                onSeek(Math.min(durationSec, currentTimeSec + 10));
                setLastSpokenSectionId(-1);
              }}
              className="w-8 h-8 rounded-lg bg-white/10 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
              title="Maju 10 detik"
            >
              <SkipForward className="w-3.5 h-3.5" />
            </button>

            {/* Quick Seek to End (Akhir) */}
            <button
              onClick={() => {
                onSeek(durationSec);
                setLastSpokenSectionId(-1);
              }}
              className="px-2 py-1 rounded-lg bg-white/10 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-[10px] font-mono font-bold"
              title="Lompat ke Menit Akhir Materi"
            >
              {formatTime(durationSec)}
            </button>

            {/* Audio Volume Button & Slider Popover */}
            <div className="relative flex items-center">
              <button
                onClick={() => {
                  ensureAudioContext();
                  onToggleMute();
                }}
                onMouseEnter={() => setShowVolumeSlider(true)}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
                title={isMuted ? 'Nyalakan Audio Guru' : 'Bisukan Audio'}
              >
                {isMuted || internalVolume === 0 ? (
                  <VolumeX className="w-4 h-4 text-red-400" />
                ) : internalVolume > 0.5 ? (
                  <Volume2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Volume1 className="w-4 h-4 text-emerald-400" />
                )}
              </button>

              {/* Quick Volume Slider */}
              <div className="hidden sm:flex items-center gap-1.5 ml-2">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : internalVolume}
                  onChange={(e) => handleVolumeSlide(parseFloat(e.target.value))}
                  className="w-16 h-1.5 bg-slate-700 accent-[#FF5A26] rounded-full cursor-pointer"
                  title={`Volume: ${Math.round((isMuted ? 0 : internalVolume) * 100)}%`}
                />
                <span className="text-[10px] font-mono text-slate-400 w-7">
                  {Math.round((isMuted ? 0 : internalVolume) * 100)}%
                </span>
              </div>
            </div>

            {/* Dedicated "Ucapkan Materi" Replay Speech Button */}
            <button
              onClick={handleReplayTeacherSpeech}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-600/30 hover:bg-orange-600/50 text-orange-200 border border-orange-500/40 text-[11px] font-bold transition-all shadow-xs"
              title="Dengarkan penjelasan suara guru untuk bagian materi ini"
            >
              <AudioLines className="w-3.5 h-3.5 text-orange-400" />
              <span>Dengarkan Suara Guru</span>
            </button>

            {/* Speed Toggle */}
            <button
              onClick={onSpeedToggle}
              className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 font-bold text-[11px] tracking-wide"
              title="Kecepatan Putar Video & Suara"
            >
              {playbackSpeed}x
            </button>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            {/* Subtitle Toggle */}
            <button
              onClick={onToggleSubtitles}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                showSubtitles ? 'bg-[#FF5A26] text-white' : 'bg-white/10 text-slate-400'
              }`}
              title="Teks Subtitle Indonesia"
            >
              <Subtitles className="w-3.5 h-3.5" />
              <span>CC</span>
            </button>

            {/* Fullscreen Toggle */}
            <button
              onClick={handleFullscreen}
              className="w-8 h-8 rounded-lg bg-white/10 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
              title="Layar Penuh"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
