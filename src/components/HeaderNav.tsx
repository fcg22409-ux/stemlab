import React from 'react';
import { SubjectId } from '../types';
import { SUBJECTS } from '../data/curriculumData';
import { Dna, Weight, Atom, Box, Globe, Calculator, HelpCircle, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface HeaderNavProps {
  currentSubject: SubjectId;
  onSelectSubject: (id: SubjectId) => void;
  onOpenFormula: () => void;
  onOpenQuiz: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

const ICONS: Record<string, React.ReactNode> = {
  Dna: <Dna className="w-4 h-4" />,
  Weight: <Weight className="w-4 h-4" />,
  Atom: <Atom className="w-4 h-4" />,
  Box: <Box className="w-4 h-4" />,
  Globe: <Globe className="w-4 h-4" />,
};

export const HeaderNav: React.FC<HeaderNavProps> = ({
  currentSubject,
  onSelectSubject,
  onOpenFormula,
  onOpenQuiz,
  isMuted,
  onToggleMute,
}) => {
  const currentSub = SUBJECTS.find((s) => s.id === currentSubject) || SUBJECTS[0];

  return (
    <header className="absolute top-0 left-0 right-0 z-20 pointer-events-none p-3 sm:p-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand & Subtitle */}
        <div className="flex items-center gap-3 pointer-events-auto bg-slate-900/90 border border-slate-800/80 rounded-2xl px-4 py-2.5 shadow-xl shadow-black/40">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm sm:text-base tracking-wide text-white">
                3D STEM LAB
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                LỚP 6
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              Mô hình trực quan & Công thức KHTN - Toán
            </p>
          </div>
        </div>

        {/* Subject Pills */}
        <nav className="flex items-center gap-1.5 sm:gap-2 p-1.5 bg-slate-900/90 border border-slate-800/80 rounded-2xl pointer-events-auto overflow-x-auto max-w-full shadow-xl shadow-black/40">
          {SUBJECTS.map((sub) => {
            const isActive = sub.id === currentSubject;
            return (
              <button
                key={sub.id}
                onClick={() => {
                  soundFx.playClick();
                  onSelectSubject(sub.id);
                }}
                className={`flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-cyan-500/20 scale-[1.02]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <span className={isActive ? 'text-white' : 'text-slate-400'}>
                  {ICONS[sub.iconName]}
                </span>
                <span>{sub.name}</span>
              </button>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={() => {
              soundFx.playClick();
              onOpenFormula();
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-indigo-600/90 hover:bg-indigo-600 text-white border border-indigo-400/30 shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
            title="Xem công thức & máy tính chi tiết"
          >
            <Calculator className="w-4 h-4 text-indigo-200" />
            <span className="hidden sm:inline">Công thức</span>
          </button>

          <button
            onClick={() => {
              soundFx.playClick();
              onOpenQuiz();
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-600/90 hover:bg-emerald-600 text-white border border-emerald-400/30 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
            title="Thử tài trắc nghiệm nhanh"
          >
            <HelpCircle className="w-4 h-4 text-emerald-200" />
            <span className="hidden sm:inline">Trắc nghiệm</span>
          </button>

          <button
            onClick={onToggleMute}
            className={`p-2 rounded-xl text-xs border transition-all cursor-pointer ${
              isMuted
                ? 'bg-slate-800 text-slate-400 border-slate-700'
                : 'bg-slate-900/90 text-cyan-400 border-slate-800 hover:bg-slate-800'
            }`}
            title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Current Topic Indicator Badge */}
      <div className="max-w-7xl mx-auto mt-2 flex justify-start pointer-events-none">
        <div className="pointer-events-auto inline-flex items-center gap-2 bg-slate-900/80 border border-slate-800/60 rounded-xl px-3 py-1 text-xs text-slate-300">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: currentSub.color }} />
          <span className="font-semibold text-slate-200">{currentSub.topicTitle}</span>
          <span className="hidden sm:inline text-slate-500">•</span>
          <span className="hidden sm:inline text-slate-400 text-[11px]">{currentSub.subTitle}</span>
        </div>
      </div>
    </header>
  );
};
