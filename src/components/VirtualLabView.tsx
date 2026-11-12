import React, { useState, useRef, useEffect } from 'react';
import {
  Compass,
  Sliders,
  RotateCcw,
  Sparkles,
  Zap,
  BookOpen,
  Download,
  CheckCircle,
  HelpCircle,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { calculateSnellRefraction, calculateParabolaVertex } from '../utils/learningLogic.ts';

export const VirtualLabView: React.FC = () => {
  const [labTab, setLabTab] = useState<'physics' | 'math'>('physics');

  // Physics Optics State
  const [n1, setN1] = useState<number>(1.0); // Medium 1
  const [n2, setN2] = useState<number>(1.5); // Medium 2
  const [theta1, setTheta1] = useState<number>(45); // Incident angle in deg
  const [laserWavelength, setLaserWavelength] = useState<'red' | 'green' | 'violet'>('red');
  const physicsCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Math Calculus Parabola State
  const [paramA, setParamA] = useState<number>(1);
  const [paramB, setParamB] = useState<number>(-4);
  const [paramC, setParamC] = useState<number>(3);
  const [probeX, setProbeX] = useState<number>(2.5);
  const mathCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const [copiedNotification, setCopiedNotification] = useState<string | null>(null);

  // Physics calculation
  const snellResult = calculateSnellRefraction(n1, n2, theta1);

  // Math calculation
  const parabolaResult = calculateParabolaVertex(paramA, paramB, paramC);
  const tangentSlope = Math.round((2 * paramA * probeX + paramB) * 100) / 100;
  const probeY = Math.round((paramA * probeX * probeX + paramB * probeX + paramC) * 100) / 100;

  // Draw Physics Optics Canvas
  useEffect(() => {
    if (labTab !== 'physics') return;
    const canvas = physicsCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const midX = width / 2;
    const midY = height / 2;

    ctx.clearRect(0, 0, width, height);

    // Medium 1 Background (Top)
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, width, midY);

    // Medium 2 Background (Bottom)
    const alpha = Math.min(0.35, 0.08 * n2);
    ctx.fillStyle = `rgba(14, 165, 233, ${alpha})`;
    ctx.fillRect(0, midY, width, midY);

    // Boundary interface line
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(0, midY);
    ctx.lineTo(width, midY);
    ctx.stroke();

    // Medium labels
    ctx.font = 'bold 12px Inter, sans-serif';
    ctx.fillStyle = '#475569';
    ctx.fillText(`Medium 1 (n₁ = ${n1.toFixed(2)})`, 20, 28);
    ctx.fillStyle = '#0369a1';
    ctx.fillText(`Medium 2 (n₂ = ${n2.toFixed(2)})`, 20, midY + 28);

    // Normal dashed line
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(midX, 20);
    ctx.lineTo(midX, height - 20);
    ctx.stroke();
    ctx.setLineDash([]); // Reset line dash

    ctx.fillStyle = '#64748b';
    ctx.font = '10px Inter, sans-serif';
    ctx.fillText('Garis Normal (N)', midX + 8, 35);

    // Laser ray color
    const laserColors = {
      red: '#ef4444',
      green: '#10b981',
      violet: '#8b5cf6',
    };
    const currentColor = laserColors[laserWavelength];

    // Incident ray
    const rayLength = 170;
    const theta1Rad = (theta1 * Math.PI) / 180;
    const startX = midX - rayLength * Math.sin(theta1Rad);
    const startY = midY - rayLength * Math.cos(theta1Rad);

    ctx.strokeStyle = currentColor;
    ctx.lineWidth = 3.5;
    ctx.shadowColor = currentColor;
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(midX, midY);
    ctx.stroke();

    // Specular Reflected ray (always present)
    const reflectedEndX = midX + rayLength * Math.sin(theta1Rad);
    const reflectedEndY = midY - rayLength * Math.cos(theta1Rad);
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = snellResult.isTotalInternalReflection ? 3.5 : 1.5;
    ctx.globalAlpha = snellResult.isTotalInternalReflection ? 1.0 : 0.45;
    ctx.beginPath();
    ctx.moveTo(midX, midY);
    ctx.lineTo(reflectedEndX, reflectedEndY);
    ctx.stroke();
    ctx.globalAlpha = 1.0;

    // Refracted ray (if not total internal reflection)
    if (!snellResult.isTotalInternalReflection && snellResult.theta2Deg !== null) {
      const theta2Rad = (snellResult.theta2Deg * Math.PI) / 180;
      const refractedEndX = midX + rayLength * Math.sin(theta2Rad);
      const refractedEndY = midY + rayLength * Math.cos(theta2Rad);

      ctx.strokeStyle = currentColor;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(midX, midY);
      ctx.lineTo(refractedEndX, refractedEndY);
      ctx.stroke();

      // Refracted angle arc
      ctx.shadowBlur = 0;
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(midX, midY, 40, Math.PI / 2 - theta2Rad, Math.PI / 2);
      ctx.stroke();
      ctx.fillStyle = '#0284c7';
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.fillText(`θ₂=${snellResult.theta2Deg}°`, midX + 15, midY + 48);
    } else {
      // Total Internal Reflection indicator on bottom
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#dc2626';
      ctx.font = 'bold 12px Inter, sans-serif';
      ctx.fillText('⚠️ Pemantulan Sempurna (Total Internal Reflection)', midX - 140, midY + 50);
    }

    // Incident angle arc
    ctx.shadowBlur = 0;
    ctx.strokeStyle = '#f97316';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(midX, midY, 40, (3 * Math.PI) / 2, (3 * Math.PI) / 2 + theta1Rad);
    ctx.stroke();
    ctx.fillStyle = '#ea580c';
    ctx.font = 'bold 11px Inter, sans-serif';
    ctx.fillText(`θ₁=${theta1}°`, midX - 35, midY - 45);

    // Laser Source Indicator
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(startX, startY, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = currentColor;
    ctx.beginPath();
    ctx.arc(startX, startY, 3, 0, Math.PI * 2);
    ctx.fill();
  }, [labTab, n1, n2, theta1, laserWavelength, snellResult]);

  // Draw Math Calculus Parabola Canvas
  useEffect(() => {
    if (labTab !== 'math') return;
    const canvas = mathCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const originX = width / 2;
    const originY = height / 2;
    const scale = 24; // 24 pixels per unit

    ctx.clearRect(0, 0, width, height);

    // Grid lines
    ctx.strokeStyle = '#f1f5f9';
    ctx.lineWidth = 1;
    for (let x = originX % scale; x < width; x += scale) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = originY % scale; y < height; y += scale) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Cartesian Axes
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1.5;
    // X Axis
    ctx.beginPath();
    ctx.moveTo(0, originY);
    ctx.lineTo(width, originY);
    ctx.stroke();
    // Y Axis
    ctx.beginPath();
    ctx.moveTo(originX, 0);
    ctx.lineTo(originX, height);
    ctx.stroke();

    // Axis labels & tick marks
    ctx.font = '10px Inter, sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.fillText('X', width - 15, originY - 8);
    ctx.fillText('Y', originX + 8, 15);
    ctx.fillText('(0,0)', originX - 25, originY + 15);

    // Draw Parabola Curve: y = ax^2 + bx + c
    ctx.strokeStyle = '#FF5A26';
    ctx.lineWidth = 3;
    ctx.shadowColor = 'rgba(255, 90, 38, 0.4)';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    let started = false;

    for (let px = 0; px < width; px += 2) {
      const graphX = (px - originX) / scale;
      const graphY = paramA * graphX * graphX + paramB * graphX + paramC;
      const py = originY - graphY * scale;

      if (py >= -200 && py <= height + 200) {
        if (!started) {
          ctx.moveTo(px, py);
          started = true;
        } else {
          ctx.lineTo(px, py);
        }
      }
    }
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Axis of symmetry
    const symmPx = originX + parabolaResult.axisOfSymmetry * scale;
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(symmPx, 0);
    ctx.lineTo(symmPx, height);
    ctx.stroke();
    ctx.setLineDash([]);

    // Vertex Point (Puncak)
    const vertexPx = originX + parabolaResult.vertexX * scale;
    const vertexPy = originY - parabolaResult.vertexY * scale;
    if (vertexPx >= 0 && vertexPx <= width && vertexPy >= 0 && vertexPy <= height) {
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.arc(vertexPx, vertexPy, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#991b1b';
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.fillText(`Puncak (${parabolaResult.vertexX}, ${parabolaResult.vertexY})`, vertexPx + 8, vertexPy - 8);
    }

    // Roots Points on X Axis
    if (parabolaResult.roots) {
      parabolaResult.roots.forEach((rootVal, idx) => {
        const rootPx = originX + rootVal * scale;
        if (rootPx >= 0 && rootPx <= width) {
          ctx.fillStyle = '#059669';
          ctx.beginPath();
          ctx.arc(rootPx, originY, 5, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#065f46';
          ctx.font = 'bold 10px Inter, sans-serif';
          ctx.fillText(`x${idx + 1}=${rootVal}`, rootPx - 15, originY + 16);
        }
      });
    }

    // Probe Tangent Line at probeX
    const pPx = originX + probeX * scale;
    const pPy = originY - probeY * scale;

    if (pPx >= 0 && pPx <= width && pPy >= 0 && pPy <= height) {
      // Tangent line segment
      const dx = 2.5; // units
      const tanStartX = originX + (probeX - dx) * scale;
      const tanStartY = originY - (probeY - dx * tangentSlope) * scale;
      const tanEndX = originX + (probeX + dx) * scale;
      const tanEndY = originY - (probeY + dx * tangentSlope) * scale;

      ctx.strokeStyle = '#2563eb';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(tanStartX, tanStartY);
      ctx.lineTo(tanEndX, tanEndY);
      ctx.stroke();

      // Probe point
      ctx.fillStyle = '#2563eb';
      ctx.beginPath();
      ctx.arc(pPx, pPy, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#1e40af';
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.fillText(`Titik P(${probeX}, ${probeY}) | m=${tangentSlope}`, pPx + 10, pPy + 18);
    }
  }, [labTab, paramA, paramB, paramC, probeX, parabolaResult, tangentSlope, probeY]);

  const copyLabNotes = () => {
    let report = '';
    if (labTab === 'physics') {
      report = `[LAPORAN PRAKTIKUM FISIKA OPTIKA]\nTopik: Hukum Snellius & Refraksi Sinar\n- Medium 1: n1 = ${n1.toFixed(2)}\n- Medium 2: n2 = ${n2.toFixed(2)}\n- Sudut Datang (θ1): ${theta1}°\n- Sudut Bias (θ2): ${snellResult.theta2Deg !== null ? `${snellResult.theta2Deg}°` : 'Pemantulan Sempurna'}\n- Kecepatan Cahaya Medium 1: ${snellResult.speedMedium1KmS.toLocaleString()} km/s\n- Kecepatan Cahaya Medium 2: ${snellResult.speedMedium2KmS.toLocaleString()} km/s\nStatus: Terverifikasi oleh Laboratorium Virtual NusantaraEdu.`;
    } else {
      report = `[LAPORAN PRAKTIKUM MATEMATIKA KALKULUS]\nTopik: Analisis Titik Stasioner & Garis Singgung Kurva Kuadrat\n- Fungsi: f(x) = ${paramA}x² + ${paramB >= 0 ? `+${paramB}x` : `${paramB}x`} + ${paramC >= 0 ? `+${paramC}` : paramC}\n- Titik Puncak Stasioner: (${parabolaResult.vertexX}, ${parabolaResult.vertexY})\n- Diskriminan (D): ${parabolaResult.discriminant}\n- Arah Kelengkungan: ${parabolaResult.curvature}\n- Gradien Garis Singgung di x = ${probeX}: m = ${tangentSlope}\nStatus: Terverifikasi oleh Laboratorium Virtual NusantaraEdu.`;
    }

    navigator.clipboard?.writeText(report);
    setCopiedNotification('Laporan praktikum disalin ke papan klip!');
    setTimeout(() => setCopiedNotification(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-10">
          <Compass className="w-64 h-64 text-cyan-400" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 border border-white/20 backdrop-blur-md rounded-full text-xs font-semibold text-cyan-300">
              <Sparkles className="w-3.5 h-3.5" /> Laboratorium Sains & Matematika Interaktif
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Simulasi Dinamis Sains & Kalkulus
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Eksperimen langsung dengan parameter fisik dan matematis. Amati perubahan berkas cahaya laser dan grafik kurva kuadrat secara visual dan terukur.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-800/80 p-1.5 rounded-2xl border border-slate-700">
            <button
              onClick={() => setLabTab('physics')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 ${
                labTab === 'physics'
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              Fisika Optika (Snellius)
            </button>
            <button
              onClick={() => setLabTab('math')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 ${
                labTab === 'math'
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Matematika (Parabola)
            </button>
          </div>
        </div>
      </div>

      {copiedNotification && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-2xl text-xs font-medium flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          {copiedNotification}
        </div>
      )}

      {/* Main Lab Content */}
      {labTab === 'physics' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Canvas Simulation Viewport */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs">
                    LAB
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-gray-900">
                      Simulasi Pembiasan Berkas Cahaya (Hukum Snellius)
                    </h2>
                    <p className="text-xs text-gray-500">n₁ · sin(θ₁) = n₂ · sin(θ₂)</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-xl">
                  {(['red', 'green', 'violet'] as const).map((clr) => (
                    <button
                      key={clr}
                      onClick={() => setLaserWavelength(clr)}
                      className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg capitalize transition ${
                        laserWavelength === clr
                          ? 'bg-white text-gray-900 shadow-xs'
                          : 'text-gray-500 hover:text-gray-800'
                      }`}
                    >
                      {clr === 'red' ? 'Laser Merah' : clr === 'green' ? 'Laser Hijau' : 'Laser Ungu'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Responsive Canvas Container */}
              <div className="w-full flex items-center justify-center bg-slate-50 rounded-2xl border border-gray-200 p-2 overflow-hidden">
                <canvas
                  ref={physicsCanvasRef}
                  width={560}
                  height={340}
                  className="w-full max-w-[560px] h-[340px] rounded-xl shadow-inner bg-white"
                />
              </div>
            </div>

            {/* Live Measurements Badges */}
            <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 bg-gray-50 rounded-xl">
                <div className="text-[10px] uppercase font-bold text-gray-400">Sudut Datang (θ₁)</div>
                <div className="text-lg font-extrabold text-orange-600">{theta1}°</div>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl">
                <div className="text-[10px] uppercase font-bold text-gray-400">Sudut Bias (θ₂)</div>
                <div className="text-lg font-extrabold text-blue-600">
                  {snellResult.isTotalInternalReflection ? 'TIR (Pantul)' : `${snellResult.theta2Deg}°`}
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl">
                <div className="text-[10px] uppercase font-bold text-gray-400">Sudut Kritis (θc)</div>
                <div className="text-lg font-extrabold text-purple-600">
                  {snellResult.criticalAngleDeg ? `${snellResult.criticalAngleDeg}°` : 'N/A'}
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl">
                <div className="text-[10px] uppercase font-bold text-gray-400">Kecepatan Medium 2</div>
                <div className="text-base font-extrabold text-emerald-600">
                  {snellResult.speedMedium2KmS.toLocaleString()} km/s
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Controls & Presets */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-orange-500" /> Parameter Percobaan
                </h3>
                <button
                  onClick={() => {
                    setN1(1.0);
                    setN2(1.5);
                    setTheta1(45);
                  }}
                  className="text-xs text-gray-500 hover:text-orange-600 flex items-center gap-1 font-medium"
                >
                  <RotateCcw className="w-3 h-3" /> Reset
                </button>
              </div>

              {/* Slider Sudut Datang */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1.5">
                  <span>Sudut Datang (θ₁)</span>
                  <span className="text-orange-600 font-bold">{theta1}°</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="85"
                  step="1"
                  value={theta1}
                  onChange={(e) => setTheta1(Number(e.target.value))}
                  className="w-full accent-orange-500 cursor-pointer"
                />
              </div>

              {/* Slider Medium 1 */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1.5">
                  <span>Indeks Bias Medium 1 (n₁)</span>
                  <span className="text-gray-900 font-bold">{n1.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="2.5"
                  step="0.05"
                  value={n1}
                  onChange={(e) => setN1(Number(e.target.value))}
                  className="w-full accent-orange-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                  <span>1.00 (Udara)</span>
                  <span>1.33 (Air)</span>
                  <span>2.42 (Intan)</span>
                </div>
              </div>

              {/* Slider Medium 2 */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1.5">
                  <span>Indeks Bias Medium 2 (n₂)</span>
                  <span className="text-gray-900 font-bold">{n2.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="2.5"
                  step="0.05"
                  value={n2}
                  onChange={(e) => setN2(Number(e.target.value))}
                  className="w-full accent-blue-500 cursor-pointer"
                />
              </div>

              {/* Presets */}
              <div className="pt-2 border-t border-gray-100">
                <div className="text-xs font-bold text-gray-700 mb-2">Preset Pembiasan Terkenal:</div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setN1(1.0);
                      setN2(1.33);
                      setTheta1(45);
                    }}
                    className="p-2 bg-gray-50 hover:bg-orange-50 hover:text-orange-600 rounded-xl text-left border border-gray-200 text-xs font-medium transition"
                  >
                    Udara → Air (Kolam)
                  </button>
                  <button
                    onClick={() => {
                      setN1(1.0);
                      setN2(1.52);
                      setTheta1(50);
                    }}
                    className="p-2 bg-gray-50 hover:bg-orange-50 hover:text-orange-600 rounded-xl text-left border border-gray-200 text-xs font-medium transition"
                  >
                    Udara → Kaca Prisma
                  </button>
                  <button
                    onClick={() => {
                      setN1(1.5);
                      setN2(1.0);
                      setTheta1(60);
                    }}
                    className="p-2 bg-gray-50 hover:bg-orange-50 hover:text-orange-600 rounded-xl text-left border border-gray-200 text-xs font-medium transition"
                  >
                    Kaca → Udara (TIR)
                  </button>
                  <button
                    onClick={() => {
                      setN1(1.0);
                      setN2(2.42);
                      setTheta1(35);
                    }}
                    className="p-2 bg-gray-50 hover:bg-orange-50 hover:text-orange-600 rounded-xl text-left border border-gray-200 text-xs font-medium transition"
                  >
                    Udara → Intan
                  </button>
                </div>
              </div>

              {/* Action buttons */}
              <button
                onClick={copyLabNotes}
                className="w-full py-2.5 bg-gray-900 hover:bg-black text-white text-xs font-semibold rounded-xl shadow-sm transition flex items-center justify-center gap-2"
              >
                <Download className="w-3.5 h-3.5" />
                Salin Catatan Praktikum ke Klip
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Math Canvas Graph */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs">
                    CALC
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-gray-900">
                      Grafik Fungsi Kuadrat & Garis Singgung Turunan
                    </h2>
                    <p className="text-xs text-gray-500 font-mono">
                      y = {paramA}x² {paramB >= 0 ? `+ ${paramB}x` : `- ${Math.abs(paramB)}x`} {paramC >= 0 ? `+ ${paramC}` : `- ${Math.abs(paramC)}`}
                    </p>
                  </div>
                </div>

                <div className="text-xs font-bold px-3 py-1 bg-orange-100 text-orange-700 rounded-full">
                  {parabolaResult.curvature}
                </div>
              </div>

              {/* Math Canvas */}
              <div className="w-full flex items-center justify-center bg-slate-50 rounded-2xl border border-gray-200 p-2 overflow-hidden">
                <canvas
                  ref={mathCanvasRef}
                  width={560}
                  height={340}
                  className="w-full max-w-[560px] h-[340px] rounded-xl shadow-inner bg-white"
                />
              </div>
            </div>

            {/* Realtime Statistics Badges */}
            <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 bg-gray-50 rounded-xl">
                <div className="text-[10px] uppercase font-bold text-gray-400">Titik Puncak (Xv, Yv)</div>
                <div className="text-base font-extrabold text-red-600">
                  ({parabolaResult.vertexX}, {parabolaResult.vertexY})
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl">
                <div className="text-[10px] uppercase font-bold text-gray-400">Diskriminan (D)</div>
                <div className="text-lg font-extrabold text-gray-900">{parabolaResult.discriminant}</div>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl">
                <div className="text-[10px] uppercase font-bold text-gray-400">Akar Persamaan (x₁, x₂)</div>
                <div className="text-sm font-extrabold text-emerald-600">
                  {parabolaResult.roots ? parabolaResult.roots.join(' & ') : 'Imajiner'}
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl">
                <div className="text-[10px] uppercase font-bold text-gray-400">Gradien Garis Singgung (m)</div>
                <div className="text-lg font-extrabold text-blue-600">{tangentSlope}</div>
              </div>
            </div>
          </div>

          {/* Math Sliders & Presets */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-orange-500" /> Koefisien Fungsi
                </h3>
                <button
                  onClick={() => {
                    setParamA(1);
                    setParamB(-4);
                    setParamC(3);
                    setProbeX(2.5);
                  }}
                  className="text-xs text-gray-500 hover:text-orange-600 flex items-center gap-1 font-medium"
                >
                  <RotateCcw className="w-3 h-3" /> Reset
                </button>
              </div>

              {/* Slider A */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                  <span>Koefisien a (Kelengkungan)</span>
                  <span className="text-orange-600 font-bold">{paramA}</span>
                </div>
                <input
                  type="range"
                  min="-3"
                  max="3"
                  step="0.2"
                  value={paramA}
                  onChange={(e) => setParamA(Number(e.target.value))}
                  className="w-full accent-orange-500 cursor-pointer"
                />
              </div>

              {/* Slider B */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                  <span>Koefisien b (Pergeseran)</span>
                  <span className="text-gray-900 font-bold">{paramB}</span>
                </div>
                <input
                  type="range"
                  min="-8"
                  max="8"
                  step="0.5"
                  value={paramB}
                  onChange={(e) => setParamB(Number(e.target.value))}
                  className="w-full accent-orange-500 cursor-pointer"
                />
              </div>

              {/* Slider C */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                  <span>Koefisien c (Titik Potong Y)</span>
                  <span className="text-gray-900 font-bold">{paramC}</span>
                </div>
                <input
                  type="range"
                  min="-6"
                  max="6"
                  step="0.5"
                  value={paramC}
                  onChange={(e) => setParamC(Number(e.target.value))}
                  className="w-full accent-orange-500 cursor-pointer"
                />
              </div>

              {/* Slider Probe X */}
              <div className="pt-2 border-t border-gray-100">
                <div className="flex justify-between text-xs font-semibold text-blue-700 mb-1">
                  <span>Titik Singgung x (Probe)</span>
                  <span className="text-blue-600 font-bold">{probeX}</span>
                </div>
                <input
                  type="range"
                  min="-4"
                  max="6"
                  step="0.1"
                  value={probeX}
                  onChange={(e) => setProbeX(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              {/* Presets */}
              <div className="pt-2 border-t border-gray-100">
                <div className="text-xs font-bold text-gray-700 mb-2">Preset Kurva Terkenal:</div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setParamA(-1);
                      setParamB(4);
                      setParamC(0);
                      setProbeX(2);
                    }}
                    className="p-2 bg-gray-50 hover:bg-orange-50 hover:text-orange-600 rounded-xl text-left border border-gray-200 text-xs font-medium transition"
                  >
                    Lintasan Proyektil (Fisika)
                  </button>
                  <button
                    onClick={() => {
                      setParamA(1);
                      setParamB(-4);
                      setParamC(3);
                      setProbeX(1);
                    }}
                    className="p-2 bg-gray-50 hover:bg-orange-50 hover:text-orange-600 rounded-xl text-left border border-gray-200 text-xs font-medium transition"
                  >
                    Titik Minimum Standar
                  </button>
                  <button
                    onClick={() => {
                      setParamA(2);
                      setParamB(0);
                      setParamC(-8);
                      setProbeX(0);
                    }}
                    className="p-2 bg-gray-50 hover:bg-orange-50 hover:text-orange-600 rounded-xl text-left border border-gray-200 text-xs font-medium transition"
                  >
                    Simetris Sumbu Y
                  </button>
                  <button
                    onClick={() => {
                      setParamA(0.5);
                      setParamB(2);
                      setParamC(2);
                      setProbeX(-2);
                    }}
                    className="p-2 bg-gray-50 hover:bg-orange-50 hover:text-orange-600 rounded-xl text-left border border-gray-200 text-xs font-medium transition"
                  >
                    Menyinggung Sumbu X (D=0)
                  </button>
                </div>
              </div>

              <button
                onClick={copyLabNotes}
                className="w-full py-2.5 bg-gray-900 hover:bg-black text-white text-xs font-semibold rounded-xl shadow-sm transition flex items-center justify-center gap-2"
              >
                <Download className="w-3.5 h-3.5" />
                Salin Catatan Analisis Kalkulus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
