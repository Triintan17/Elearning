import React, { useState } from 'react';
import { MessageSquare, Send, CheckCircle2, User, Sparkles } from 'lucide-react';
import { ChatMessage, UserProfile } from '../types/index.ts';

interface MessagesViewProps {
  messages: ChatMessage[];
  currentUser: UserProfile;
  onSendMessage: (text: string) => void;
}

export const MessagesView: React.FC<MessagesViewProps> = ({
  messages,
  currentUser,
  onSendMessage,
}) => {
  const [inputText, setInputText] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden flex flex-col h-[75vh]">
      {/* Messages Header */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#FFF3EB] text-[#FF5A26] flex items-center justify-center">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900">
              Ruang Konsultasi & Pengumuman Kelas XII MIPA 1
            </h3>
            <p className="text-[11px] text-slate-400 font-medium">
              Wali Kelas: Dra. Siti Rahmawati, M.Pd · 32 Siswa Terhubung
            </p>
          </div>
        </div>

        <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500" /> Jam Konsultasi Aktif
        </span>
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg) => {
          const isSenderMe =
            (currentUser.role === 'siswa' && msg.role === 'siswa') ||
            (currentUser.role === 'guru' && msg.role === 'guru');

          return (
            <div
              key={msg.id}
              className={`flex flex-col max-w-[80%] ${
                isSenderMe ? 'ml-auto items-end' : 'mr-auto items-start'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-extrabold text-slate-700">
                  {msg.sender}
                </span>
                <span className="text-[10px] text-slate-400">{msg.time}</span>
              </div>

              <div
                className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                  isSenderMe
                    ? 'bg-[#FF5A26] text-white rounded-br-xs shadow-xs'
                    : 'bg-slate-100 text-slate-800 rounded-bl-xs'
                }`}
              >
                {msg.text}
              </div>
            </div>
          );
        })}
      </div>

      {/* Send Input Bar */}
      <form onSubmit={handleSend} className="p-4 border-t border-slate-100 bg-white flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`Tulis pesan atau pertanyaan sebagai ${currentUser.name}...`}
          className="flex-1 px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#FF5A26]"
        />
        <button
          type="submit"
          className="px-6 py-3 rounded-2xl bg-[#FF5A26] hover:bg-[#E84E1D] text-white text-xs font-bold flex items-center gap-2 transition-colors shadow-xs"
        >
          <Send className="w-4 h-4" />
          <span>Kirim</span>
        </button>
      </form>
    </div>
  );
};
