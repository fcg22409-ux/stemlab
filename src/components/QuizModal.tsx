import React, { useState } from 'react';
import { SubjectId, QuizQuestion } from '../types';
import { QUIZZES, SUBJECTS } from '../data/curriculumData';
import { X, HelpCircle, CheckCircle, AlertCircle, Award, RotateCcw, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundFx } from '../utils/audio';

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSubject: SubjectId;
}

export const QuizModal: React.FC<QuizModalProps> = ({
  isOpen,
  onClose,
  currentSubject,
}) => {
  const [selectedSub, setSelectedSub] = useState<SubjectId>(currentSubject);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  // Sync subject when opened
  React.useEffect(() => {
    setSelectedSub(currentSubject);
    setCurrentQIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setQuizFinished(false);
  }, [currentSubject, isOpen]);

  const questions = QUIZZES.filter((q) => q.subjectId === selectedSub);
  const currentQ = questions[currentQIndex] || questions[0];

  if (!isOpen) return null;

  const handleSelectOption = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);

    const isCorrect = index === currentQ.correctIndex;
    if (isCorrect) {
      soundFx.playSuccess();
      setScore((prev) => prev + 1);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    } else {
      soundFx.playClick();
    }
  };

  const handleNext = () => {
    soundFx.playClick();
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setQuizFinished(true);
      if (score + (selectedOption === currentQ.correctIndex ? 0 : 0) >= questions.length - 1) {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
        });
      }
    }
  };

  const restartQuiz = () => {
    soundFx.playClick();
    setCurrentQIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setQuizFinished(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl shadow-emerald-950/40 overflow-hidden text-slate-100">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-lg text-white">
                Thử Tài Trắc Nghiệm Nhanh Lớp 6
              </h2>
              <p className="text-xs text-slate-400">
                Kiểm tra kiến thức & công thức đã học qua mô hình 3D
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              soundFx.playClick();
              onClose();
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Subject Filter Pills */}
        <div className="flex items-center gap-2 p-2.5 bg-slate-950/40 border-b border-slate-800 overflow-x-auto">
          {SUBJECTS.map((sub) => {
            const isSel = sub.id === selectedSub;
            return (
              <button
                key={sub.id}
                onClick={() => {
                  soundFx.playClick();
                  setSelectedSub(sub.id);
                  setCurrentQIndex(0);
                  setSelectedOption(null);
                  setIsAnswered(false);
                  setScore(0);
                  setQuizFinished(false);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap border ${
                  isSel
                    ? 'bg-emerald-600 text-white border-emerald-400 shadow-sm'
                    : 'bg-slate-800/60 text-slate-400 border-slate-700/50 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                {sub.name}
              </button>
            );
          })}
        </div>

        {/* Quiz Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {!quizFinished && currentQ ? (
            <div className="space-y-5">
              {/* Progress Bar & Question Counter */}
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                <span>
                  Câu hỏi {currentQIndex + 1} / {questions.length}
                </span>
                <span className="font-mono text-emerald-400">
                  Điểm số: {score} câu đúng
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 transition-all duration-300"
                  style={{ width: `${((currentQIndex + 1) / questions.length) * 100}%` }}
                />
              </div>

              {/* Question text */}
              <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4.5 text-base sm:text-lg font-bold text-slate-100 leading-snug">
                {currentQ.question}
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {currentQ.options.map((opt, idx) => {
                  let btnStyle = 'bg-slate-800/70 border-slate-700/80 hover:bg-slate-800 text-slate-200';
                  if (isAnswered) {
                    if (idx === currentQ.correctIndex) {
                      btnStyle = 'bg-emerald-600/30 border-emerald-500 text-emerald-200 font-bold';
                    } else if (idx === selectedOption) {
                      btnStyle = 'bg-red-600/30 border-red-500 text-red-200 line-through';
                    } else {
                      btnStyle = 'bg-slate-800/40 border-slate-800 text-slate-500 opacity-60';
                    }
                  } else if (selectedOption === idx) {
                    btnStyle = 'bg-cyan-600/30 border-cyan-500 text-cyan-200';
                  }

                  return (
                    <button
                      key={idx}
                      disabled={isAnswered}
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full p-3.5 rounded-xl border text-left text-sm font-medium transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-lg bg-slate-900/80 border border-slate-700/60 flex items-center justify-center font-bold text-xs shrink-0">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{opt}</span>
                      </div>
                      {isAnswered && idx === currentQ.correctIndex && (
                        <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 ml-2" />
                      )}
                      {isAnswered && idx === selectedOption && idx !== currentQ.correctIndex && (
                        <AlertCircle className="w-5 h-5 text-red-400 shrink-0 ml-2" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation card after answered */}
              {isAnswered && (
                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 text-xs sm:text-sm text-slate-300 animate-in fade-in">
                  <div className="font-bold text-amber-400 mb-1 flex items-center gap-1.5">
                    <span>💡 Giải thích chi tiết (SGK Lớp 6):</span>
                  </div>
                  <p className="leading-relaxed">{currentQ.explanation}</p>
                </div>
              )}
            </div>
          ) : (
            /* Finished Card */
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-600 mx-auto flex items-center justify-center text-white shadow-xl shadow-amber-500/30">
                <Award className="w-9 h-9" />
              </div>
              <h3 className="text-xl font-extrabold text-white">Hoàn Thành Bài Ôn Tập!</h3>
              <p className="text-slate-300 text-sm">
                Bạn đã trả lời đúng{' '}
                <strong className="text-emerald-400 font-bold text-lg font-mono">
                  {score} / {questions.length}
                </strong>{' '}
                câu hỏi.
              </p>
              <div className="pt-4 flex justify-center gap-3">
                <button
                  onClick={restartQuiz}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs cursor-pointer border border-slate-700"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Làm Lại</span>
                </button>
                <button
                  onClick={() => {
                    soundFx.playClick();
                    onClose();
                  }}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer shadow-lg shadow-emerald-600/30"
                >
                  Tiếp Tục Khám Phá 3D
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Next button */}
        {!quizFinished && isAnswered && (
          <div className="p-3 sm:p-4 border-t border-slate-800 bg-slate-950/80 flex justify-end">
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm cursor-pointer shadow-lg shadow-emerald-600/30 transition-all"
            >
              <span>{currentQIndex < questions.length - 1 ? 'Câu Tiếp Theo' : 'Xem Kết Quả'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
