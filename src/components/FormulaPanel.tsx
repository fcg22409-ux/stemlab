import React, { useState } from 'react';
import { SubjectId, FormulaData } from '../types';
import { FORMULAS, SUBJECTS } from '../data/curriculumData';
import { X, Calculator, ArrowRight, BookOpen, CheckCircle2 } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface FormulaPanelProps {
  isOpen: boolean;
  onClose: () => void;
  currentSubject: SubjectId;
  onSelectSubject: (id: SubjectId) => void;
}

export const FormulaPanel: React.FC<FormulaPanelProps> = ({
  isOpen,
  onClose,
  currentSubject,
  onSelectSubject,
}) => {
  const [selectedSub, setSelectedSub] = useState<SubjectId>(currentSubject);

  // Sync with current subject when opened
  React.useEffect(() => {
    setSelectedSub(currentSubject);
  }, [currentSubject, isOpen]);

  const formulas = FORMULAS[selectedSub] || [];
  const [activeFormulaIdx, setActiveFormulaIdx] = useState(0);

  // Form values state for the interactive calculator
  const [calcValues, setCalcValues] = useState<Record<string, number>>({});

  const currentFormula = formulas[activeFormulaIdx] || formulas[0];

  // Initialize values when active formula changes
  React.useEffect(() => {
    if (currentFormula) {
      const initVals: Record<string, number> = {};
      currentFormula.variables.forEach((v) => {
        initVals[v.symbol] = v.defaultVal;
      });
      setCalcValues(initVals);
    }
  }, [currentFormula]);

  if (!isOpen) return null;

  const calculationResult = currentFormula
    ? currentFormula.calculate(calcValues)
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl shadow-cyan-950/40 overflow-hidden text-slate-100">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-lg text-white">
                Bảng Công Thức & Máy Tính Khoa Học Lớp 6
              </h2>
              <p className="text-xs text-slate-400">
                Ôn tập lý thuyết, bản chất vật lý & máy tính tương tác số thực
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

        {/* Subject Tabs */}
        <div className="flex items-center gap-2 p-2.5 bg-slate-950/40 border-b border-slate-800 overflow-x-auto">
          {SUBJECTS.map((sub) => {
            const isSel = sub.id === selectedSub;
            return (
              <button
                key={sub.id}
                onClick={() => {
                  soundFx.playClick();
                  setSelectedSub(sub.id);
                  setActiveFormulaIdx(0);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap border ${
                  isSel
                    ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white border-cyan-400/40 shadow-sm'
                    : 'bg-slate-800/60 text-slate-400 border-slate-700/50 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                {sub.name}
              </button>
            );
          })}
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Multiple formula chips if subject has more than 1 */}
          {formulas.length > 1 && (
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
              {formulas.map((f, idx) => (
                <button
                  key={f.title}
                  onClick={() => {
                    soundFx.playClick();
                    setActiveFormulaIdx(idx);
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                    activeFormulaIdx === idx
                      ? 'bg-slate-700 text-cyan-300 font-bold border border-cyan-500/40'
                      : 'bg-slate-800/60 text-slate-400 hover:text-white'
                  }`}
                >
                  Công thức {idx + 1}: {f.title.split(':')[0]}
                </button>
              ))}
            </div>
          )}

          {currentFormula ? (
            <div className="space-y-6">
              {/* Formula Main Card */}
              <div className="bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-900 border border-indigo-500/30 rounded-2xl p-5 shadow-lg relative overflow-hidden">
                <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
                  <BookOpen className="w-4 h-4" />
                  <span>{currentFormula.title}</span>
                </div>

                {/* Big Formula Display Box */}
                <div className="bg-slate-950/80 border border-indigo-400/20 rounded-xl p-4 my-3 text-center">
                  <div className="text-xl sm:text-2xl font-mono font-extrabold text-cyan-300 tracking-wider">
                    {currentFormula.latex}
                  </div>
                </div>

                <p className="text-sm text-slate-300 leading-relaxed">
                  {currentFormula.description}
                </p>
              </div>

              {/* Interactive Calculator Section */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5">
                <div className="flex items-center gap-2 text-sm font-bold text-amber-400 mb-4">
                  <Calculator className="w-4 h-4" />
                  <span>Máy Tính Tương Tác: Thử Thay Đổi Các Đại Lượng</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Left: Input Variables */}
                  <div className="space-y-3.5">
                    {currentFormula.variables.map((variable) => {
                      const curVal = calcValues[variable.symbol] ?? variable.defaultVal;
                      return (
                        <div key={variable.symbol} className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl">
                          <div className="flex justify-between items-center text-xs mb-1.5">
                            <span className="font-semibold text-slate-300">
                              {variable.name}
                            </span>
                            <span className="font-mono font-bold text-cyan-400 text-sm">
                              {curVal} {variable.unit}
                            </span>
                          </div>
                          <input
                            type="range"
                            min={variable.min}
                            max={variable.max}
                            step={variable.step}
                            value={curVal}
                            onChange={(e) => {
                              const val = parseFloat(e.target.value);
                              setCalcValues((prev) => ({
                                ...prev,
                                [variable.symbol]: val,
                              }));
                              soundFx.playSliderTick(280 + val * 20);
                            }}
                            className="w-full accent-cyan-500 cursor-pointer"
                          />
                        </div>
                      );
                    })}
                  </div>

                  {/* Right: Step-by-Step Result Card */}
                  {calculationResult && (
                    <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl flex flex-col justify-between">
                      <div>
                        <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                          Các bước giải chi tiết:
                        </span>
                        <div className="mt-2.5 space-y-2 text-xs font-mono text-slate-300">
                          {calculationResult.steps.map((step, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                              <ArrowRight className="w-3.5 h-3.5 text-cyan-400 mt-0.5 shrink-0" />
                              <span>{step}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                        <span className="text-xs text-slate-400 font-semibold">Kết quả:</span>
                        <div className="text-right">
                          <span className="text-xl font-extrabold font-mono text-emerald-400">
                            {calculationResult.result}
                          </span>
                          <span className="text-xs text-slate-400 ml-1">
                            {calculationResult.unit}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-slate-400 text-center py-8">Chưa có công thức cho môn học này.</p>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
          <span>Chuẩn chương trình SGK mới (Kết nối tri thức • Cánh diều • Chân trời sáng tạo)</span>
          <button
            onClick={() => {
              soundFx.playClick();
              onClose();
            }}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
