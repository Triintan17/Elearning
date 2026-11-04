import React, { useState } from 'react';
import { Award, Download, CheckCircle, ExternalLink, X, ShieldCheck } from 'lucide-react';
import { Certificate } from '../types/index.ts';

interface CertificatesViewProps {
  certificates: Certificate[];
  studentName: string;
}

export const CertificatesView: React.FC<CertificatesViewProps> = ({
  certificates,
  studentName,
}) => {
  const [activeCert, setActiveCert] = useState<Certificate | null>(null);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-xs flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF3EB] text-[#FF5A26] text-xs font-bold mb-2">
            <Award className="w-3.5 h-3.5" />
            <span>Sertifikasi & Kredensial Resmi</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
            Sertifikat Kelulusan Modul Akademik
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Diterbitkan resmi oleh SMA Unggulan Nusantara dengan tanda tangan digital guru pengampu.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {certificates.map((cert) => (
          <div
            key={cert.id}
            className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs flex flex-col justify-between hover:shadow-md transition-all relative overflow-hidden"
          >
            {/* Subtle certificate border accent */}
            <div className="absolute top-0 right-0 w-28 h-28 bg-[#FFF3EB] rounded-bl-full -z-0 opacity-40 pointer-events-none" />

            <div className="relative z-10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#FF5A26]">
                  {cert.subject}
                </span>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Terverifikasi
                </span>
              </div>

              <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                {cert.title}
              </h3>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-1.5 text-xs text-slate-600">
                <p>
                  Penerima: <strong className="text-slate-900">{studentName}</strong>
                </p>
                <p>
                  Hasil: <strong className="text-slate-900">{cert.grade}</strong>
                </p>
                <p>
                  Instruktur: <span className="text-slate-700">{cert.instructor}</span>
                </p>
                <p className="text-[11px] text-slate-400 font-mono">
                  No. Sertifikat: {cert.certNumber}
                </p>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-50 flex items-center justify-between relative z-10">
              <span className="text-xs text-slate-400 font-medium">Tanggal: {cert.issueDate}</span>
              <button
                onClick={() => setActiveCert(cert)}
                className="px-4 py-2 rounded-xl bg-[#FF5A26] hover:bg-[#E84E1D] text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                <span>Lihat Sertifikat</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Certificate Modal */}
      {activeCert && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border-4 border-amber-200/60 p-8 relative overflow-hidden text-center">
            <button
              onClick={() => setActiveCert(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 mx-auto flex items-center justify-center mb-4">
              <Award className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-black text-slate-900 uppercase tracking-wider">
              Sertifikat Keberhasilan
            </h3>
            <p className="text-xs text-slate-500 mt-1">Diberikan dengan bangga kepada:</p>

            <h4 className="text-2xl font-black text-[#FF5A26] my-3">{studentName}</h4>

            <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
              Atas kelulusan dan penguasaan kompetensi tingkat lanjut pada program mata pelajaran{' '}
              <strong>{activeCert.subject}</strong> dengan capaian <strong>{activeCert.grade}</strong>.
            </p>

            <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 px-6">
              <div className="text-left">
                <p className="font-bold text-slate-800">{activeCert.instructor}</p>
                <p className="text-[10px]">Guru Pengampu Modul</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-slate-800">{activeCert.issueDate}</p>
                <p className="text-[10px] font-mono">{activeCert.certNumber}</p>
              </div>
            </div>

            <div className="mt-6 flex justify-center gap-3">
              <button
                onClick={() => window.print()}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-2 shadow-xs"
              >
                <Download className="w-4 h-4" />
                <span>Unduh PDF / Cetak</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
