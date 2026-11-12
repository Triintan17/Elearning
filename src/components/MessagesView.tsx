import React, { useState } from 'react';
import {
  MessageSquare,
  Send,
  User,
  Sparkles,
  Search,
  CheckCheck,
  Clock,
  Shield,
  GraduationCap,
  Users,
} from 'lucide-react';
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
  const [activeChannel, setActiveChannel] = useState<'class' | 'private' | 'forum'>('class');
  const [searchFilter, setSearchFilter] = useState('');

  const quickPrompts = {
    siswa: [
      'Ibu guru, bagaimana cara menghitung turunan parsial di titik puncak?',
      'Apakah modul fisika optika ada tugas resume praktikum?',
      'Kapan pengumuman hasil kuis kalkulus keluar?',
    ],
    guru: [
      'Pengumuman: Jangan lupa selesaikan kuis sebelum pukul 16:00 WIB.',
      'Praktikum virtual lab fisika sudah dapat diakses di menu Lab Virtual.',
      'Selamat bagi para siswa yang telah mempertahankan streak 50 hari!',
    ],
    wali: [
      'Selamat pagi Bu Siti, mohon konfirmasi surat izin ananda Ahmad.',
      'Bagaimana perkembangan capaian belajar ananda minggu ini Bu?',
      'Terima kasih banyak atas perhatian dan bimbingan Ibu terhadap anak kami.',
    ],
  };

  const currentPrompts = quickPrompts[currentUser.role] || quickPrompts.siswa;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const handleQuickPromptClick = (prompt: string) => {
    setInputText(prompt);
  };

  const filteredMessages = messages.filter((msg) =>
    msg.text.toLowerCase().includes(searchFilter.toLowerCase()) ||
    msg.sender.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden flex flex-col h-[78vh]">
      {/* Messages Header */}
      <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#FFF3EB] text-[#FF5A26] flex items-center justify-center shrink-0">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-extrabold text-slate-900">
                {activeChannel === 'class'
                  ? 'Ruang Pengumuman & Diskusi Kelas XII MIPA 1'
                  : activeChannel === 'private'
                  ? 'Konsultasi Privat Wali Kelas (Dra. Siti Rahmawati, M.Pd)'
                  : 'Forum Tanya Jawab Materi Sains & Kalkulus'}
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold hidden sm:inline">
                Online
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              Masuk sebagai: <strong className="text-slate-800">{currentUser.name}</strong> ({currentUser.className})
            </p>
          </div>
        </div>

        {/* Channel Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-200/60 p-1 rounded-2xl">
          <button
            onClick={() => setActiveChannel('class')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              activeChannel === 'class'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Kelas
          </button>
          <button
            onClick={() => setActiveChannel('private')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              activeChannel === 'private'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Konsultasi Wali
          </button>
          <button
            onClick={() => setActiveChannel('forum')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              activeChannel === 'forum'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Forum Sains
          </button>
        </div>
      </div>

      {/* Message Filter & Quick Search */}
      <div className="px-6 py-2.5 bg-white border-b border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-2 w-full max-w-sm">
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Cari pesan atau nama pengirim..."
            className="w-full bg-transparent focus:outline-none text-xs text-slate-700"
          />
        </div>
        <span className="text-[11px] text-slate-400 shrink-0">
          {filteredMessages.length} pesan terdaftar
        </span>
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {filteredMessages.map((msg) => {
          const isSenderMe =
            msg.isCurrent === true ||
            msg.sender === currentUser.name ||
            (currentUser.role === msg.role && msg.isCurrent);

          return (
            <div
              key={msg.id}
              className={`flex flex-col max-w-[85%] sm:max-w-[75%] ${
                isSenderMe ? 'ml-auto items-end' : 'mr-auto items-start'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-extrabold text-slate-700 flex items-center gap-1">
                  {msg.role === 'guru' ? (
                    <span className="text-emerald-600 flex items-center gap-0.5 font-bold">
                      <GraduationCap className="w-3.5 h-3.5" /> [Guru]
                    </span>
                  ) : msg.role === 'wali' ? (
                    <span className="text-purple-600 flex items-center gap-0.5 font-bold">
                      <Shield className="w-3.5 h-3.5" /> [Orang Tua]
                    </span>
                  ) : null}
                  {msg.sender}
                </span>
                <span className="text-[10px] text-slate-400">{msg.time}</span>
              </div>

              <div
                className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                  isSenderMe
                    ? 'bg-[#FF5A26] text-white rounded-br-xs shadow-xs'
                    : msg.role === 'guru'
                    ? 'bg-emerald-50 text-emerald-950 border border-emerald-100 rounded-bl-xs'
                    : 'bg-slate-100 text-slate-800 rounded-bl-xs'
                }`}
              >
                {msg.text}
              </div>

              {isSenderMe && (
                <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1">
                  <CheckCheck className="w-3 h-3 text-emerald-500" />
                  <span>Terkirim</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Quick Prompts Chips */}
      <div className="px-6 py-2.5 bg-slate-50 border-t border-slate-100 overflow-x-auto flex items-center gap-2">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-[#FF5A26]" /> Template:
        </span>
        {currentPrompts.map((prompt, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleQuickPromptClick(prompt)}
            className="text-[11px] bg-white hover:bg-orange-50 hover:text-orange-600 border border-slate-200/80 px-2.5 py-1 rounded-xl text-slate-600 truncate transition shrink-0"
          >
            {prompt}
          </button>
        ))}
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
