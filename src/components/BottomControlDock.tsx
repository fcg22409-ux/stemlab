import React, { useState } from 'react';
import { SubjectId, OrganelleInfo } from '../types';
import { SceneControlsRef } from './ThreeCanvas';
import { ORGANELLES, CHEMICAL_ELEMENTS } from '../data/curriculumData';
import {
  ChevronDown,
  ChevronUp,
  RotateCcw,
  RefreshCw,
  Eye,
  Layers,
  Thermometer,
  Zap,
  Compass,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { soundFx } from '../utils/audio';

interface BottomControlDockProps {
  currentSubject: SubjectId;
  controlsRef: React.MutableRefObject<SceneControlsRef | null>;
  selectedOrganelleId: string | null;
  onSelectOrganelle: (id: string | null) => void;
}

export const BottomControlDock: React.FC<BottomControlDockProps> = ({
  currentSubject,
  controlsRef,
  selectedOrganelleId,
  onSelectOrganelle,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isAutoRotating, setIsAutoRotating] = useState(false);

  // Sinh học state
  const [cellType, setCellType] = useState<'plant' | 'animal'>('plant');
  const [explodedVal, setExplodedVal] = useState(0);

  // Vật lý state
  const [massGrams, setMassGrams] = useState(200);
  const [springK, setSpringK] = useState(25);
  const [gravityVal, setGravityVal] = useState(9.8);
  const [gravityPreset, setGravityPreset] = useState<'earth' | 'moon' | 'mars' | 'zero'>('earth');

  // Hóa học state
  const [chemMode, setChemMode] = useState<'atom' | 'matter'>('atom');
  const [selectedElement, setSelectedElement] = useState('C');
  const [tempC, setTempC] = useState(25);

  // Toán học state
  const [shapeType, setShapeType] = useState<'box' | 'cube'>('box');
  const [unfoldVal, setUnfoldVal] = useState(0);
  const [dimA, setDimA] = useState(2.4);
  const [dimB, setDimB] = useState(1.6);
  const [dimH, setDimH] = useState(1.8);

  // Địa lý state
  const [season, setSeason] = useState<'summer' | 'winter' | 'equinox'>('summer');
  const [earthSpeed, setEarthSpeed] = useState(0.4);

  const activeOrganelle = ORGANELLES.find((o) => o.id === selectedOrganelleId);

  return (
    <div
      className={`fixed left-1/2 -translate-x-1/2 z-30 transition-all duration-300 pointer-events-auto ${
        isCollapsed ? 'bottom-2' : 'bottom-4'
      } w-full max-w-[min(960px,94vw)] flex flex-col items-center`}
    >
      {/* Collapse / Expand Toggle Button */}
      <button
        onClick={() => {
          soundFx.playClick();
          setIsCollapsed(!isCollapsed);
        }}
        className="flex items-center gap-1.5 px-4 py-1 rounded-t-xl bg-slate-900/95 border-t border-x border-slate-700/80 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer shadow-lg shadow-black/50"
      >
        {isCollapsed ? (
          <>
            <ChevronUp className="w-3.5 h-3.5 text-cyan-400" />
            <span>Hiện điều khiển</span>
          </>
        ) : (
          <>
            <ChevronDown className="w-3.5 h-3.5 text-cyan-400" />
            <span>Thu gọn (Toàn màn hình 3D)</span>
          </>
        )}
      </button>

      {/* Main Dock Container */}
      {!isCollapsed && (
        <div className="w-full bg-slate-900/95 border border-slate-800/90 rounded-2xl p-3.5 sm:p-4.5 shadow-2xl shadow-black/60 flex flex-col gap-3">
          {/* SUBJECT SPECIFIC CONTROLS */}
          {currentSubject === 'khtn_bio' && (
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap items-center justify-between gap-2.5">
                {/* Cell Type Selector */}
                <div className="flex items-center gap-1.5 p-1 bg-slate-800/90 rounded-xl border border-slate-700/60">
                  <button
                    onClick={() => {
                      soundFx.playClick();
                      setCellType('plant');
                      controlsRef.current?.setCellType('plant');
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      cellType === 'plant'
                        ? 'bg-emerald-600 text-white shadow'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    🌱 Tế bào Thực vật
                  </button>
                  <button
                    onClick={() => {
                      soundFx.playClick();
                      setCellType('animal');
                      controlsRef.current?.setCellType('animal');
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      cellType === 'animal'
                        ? 'bg-sky-600 text-white shadow'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    🐾 Tế bào Động vật
                  </button>
                </div>

                {/* Exploded View Slider */}
                <div className="flex items-center gap-3 flex-1 min-w-[220px] max-w-sm px-3 py-1.5 bg-slate-800/70 rounded-xl border border-slate-700/50">
                  <Layers className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-xs font-semibold text-slate-300 whitespace-nowrap">
                    Bóc tách 3D: {Math.round(explodedVal * 100)}%
                  </span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.02"
                    value={explodedVal}
                    onChange={(e) => {
                      const v = parseFloat(e.target.value);
                      setExplodedVal(v);
                      controlsRef.current?.setCellExploded(v);
                      soundFx.playSliderTick(300 + v * 200);
                    }}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Organelle quick selection chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
                  Bào quan:
                </span>
                {ORGANELLES.filter((o) =>
                  cellType === 'plant' ? true : o.foundIn !== 'plant'
                ).map((org) => {
                  const isSel = org.id === selectedOrganelleId;
                  return (
                    <button
                      key={org.id}
                      onClick={() => {
                        soundFx.playClick();
                        const nextId = isSel ? null : org.id;
                        onSelectOrganelle(nextId);
                        controlsRef.current?.setSelectedOrganelle(nextId);
                      }}
                      className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer shrink-0 border ${
                        isSel
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow'
                          : 'bg-slate-800/70 text-slate-300 border-slate-700/50 hover:bg-slate-700'
                      }`}
                    >
                      {org.name.split(' (')[0]}
                    </button>
                  );
                })}
              </div>

              {/* Selected Organelle Card info banner */}
              {activeOrganelle && (
                <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-2.5 flex items-start justify-between gap-3 text-xs">
                  <div>
                    <div className="font-bold text-cyan-300 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: activeOrganelle.color }} />
                      {activeOrganelle.name}
                    </div>
                    <p className="text-slate-300 mt-0.5">{activeOrganelle.role}</p>
                    <p className="text-slate-400 text-[11px] mt-1 font-mono">{activeOrganelle.formulaOrFact}</p>
                  </div>
                  <button
                    onClick={() => {
                      onSelectOrganelle(null);
                      controlsRef.current?.setSelectedOrganelle(null);
                    }}
                    className="text-slate-400 hover:text-white p-1"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          )}

          {currentSubject === 'khtn_physics' && (
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {/* Mass Slider */}
                <div className="flex flex-col gap-1 p-2.5 bg-slate-800/70 rounded-xl border border-slate-700/50">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-300">Khối lượng (m):</span>
                    <span className="text-blue-400 font-mono font-bold">{massGrams} g ({(massGrams / 1000).toFixed(2)} kg)</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="1000"
                    step="50"
                    value={massGrams}
                    onChange={(e) => {
                      const v = parseInt(e.target.value);
                      setMassGrams(v);
                      controlsRef.current?.setSpringMass(v);
                      soundFx.playSliderTick(200 + v);
                    }}
                    className="accent-blue-500 cursor-pointer"
                  />
                  <div className="flex gap-1 mt-1">
                    {[100, 200, 500].map((quick) => (
                      <button
                        key={quick}
                        onClick={() => {
                          setMassGrams(quick);
                          controlsRef.current?.setSpringMass(quick);
                          soundFx.playClick();
                        }}
                        className={`text-[10px] px-1.5 py-0.5 rounded ${
                          massGrams === quick ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300'
                        }`}
                      >
                        {quick}g
                      </button>
                    ))}
                  </div>
                </div>

                {/* Spring Constant k */}
                <div className="flex flex-col gap-1 p-2.5 bg-slate-800/70 rounded-xl border border-slate-700/50">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-300">Độ cứng lò xo (k):</span>
                    <span className="text-cyan-400 font-mono font-bold">{springK} N/m</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="60"
                    step="5"
                    value={springK}
                    onChange={(e) => {
                      const v = parseInt(e.target.value);
                      setSpringK(v);
                      controlsRef.current?.setSpringConstant(v);
                      soundFx.playSliderTick(350 + v * 5);
                    }}
                    className="accent-cyan-500 cursor-pointer"
                  />
                  <span className="text-[10px] text-slate-400">k càng lớn lò xo càng cứng</span>
                </div>

                {/* Gravity Preset */}
                <div className="flex flex-col gap-1 p-2.5 bg-slate-800/70 rounded-xl border border-slate-700/50">
                  <span className="text-xs font-semibold text-slate-300">Môi trường trọng lực (g):</span>
                  <div className="grid grid-cols-2 gap-1 mt-0.5">
                    <button
                      onClick={() => {
                        soundFx.playClick();
                        setGravityPreset('earth');
                        setGravityVal(9.8);
                        controlsRef.current?.setSpringGravity(9.8);
                      }}
                      className={`text-[11px] py-1 px-1.5 rounded font-medium border text-center ${
                        gravityPreset === 'earth'
                          ? 'bg-blue-600 text-white border-blue-400'
                          : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                      }`}
                    >
                      🌍 Trái Đất (10 N/kg)
                    </button>
                    <button
                      onClick={() => {
                        soundFx.playClick();
                        setGravityPreset('moon');
                        setGravityVal(1.6);
                        controlsRef.current?.setSpringGravity(1.6);
                      }}
                      className={`text-[11px] py-1 px-1.5 rounded font-medium border text-center ${
                        gravityPreset === 'moon'
                          ? 'bg-amber-600 text-white border-amber-400'
                          : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                      }`}
                    >
                      🌙 Mặt Trăng (1.6)
                    </button>
                  </div>
                </div>
              </div>

              {/* Nudge Button & Live Math Formula Preview */}
              <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-800 text-xs">
                <div className="font-mono text-slate-300 flex items-center gap-3">
                  <span>Trọng lượng: <strong className="text-emerald-400 font-bold">P = {Math.round((massGrams / 1000) * gravityVal * 100) / 100} N</strong></span>
                  <span className="hidden sm:inline text-slate-500">•</span>
                  <span className="hidden sm:inline">Độ dãn lò xo: <strong className="text-cyan-400 font-bold">Δl ≈ {(Math.round((((massGrams / 1000) * gravityVal) / springK) * 100 * 10) / 10)} cm</strong></span>
                </div>
                <button
                  onClick={() => {
                    soundFx.playSpringBoing();
                    controlsRef.current?.triggerSpringPerturb();
                  }}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow"
                >
                  <Zap className="w-3.5 h-3.5 text-yellow-300" />
                  <span>Kéo thả dao động</span>
                </button>
              </div>
            </div>
          )}

          {currentSubject === 'khtn_chem' && (
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                {/* Submode Switcher */}
                <div className="flex items-center gap-1 p-1 bg-slate-800/90 rounded-xl border border-slate-700/60">
                  <button
                    onClick={() => {
                      soundFx.playClick();
                      setChemMode('atom');
                      controlsRef.current?.setChemMode('atom');
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      chemMode === 'atom' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    ⚛️ Mô hình Nguyên tử
                  </button>
                  <button
                    onClick={() => {
                      soundFx.playClick();
                      setChemMode('matter');
                      controlsRef.current?.setChemMode('matter');
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      chemMode === 'matter' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    🧊 3 Thể của Chất (Rắn - Lỏng - Khí)
                  </button>
                </div>

                {chemMode === 'matter' && (
                  <div className="flex items-center gap-3 flex-1 min-w-[240px] px-3 py-1.5 bg-slate-800/70 rounded-xl border border-slate-700/50">
                    <Thermometer className="w-4 h-4 text-orange-400 shrink-0" />
                    <span className="text-xs font-semibold text-slate-300 whitespace-nowrap">
                      Nhiệt độ: <strong className="text-amber-400 font-mono">{tempC}°C</strong>
                    </span>
                    <input
                      type="range"
                      min="-20"
                      max="140"
                      step="2"
                      value={tempC}
                      onChange={(e) => {
                        const v = parseInt(e.target.value);
                        setTempC(v);
                        controlsRef.current?.setChemTemperature(v);
                        soundFx.playSliderTick(200 + v * 3);
                      }}
                      className="w-full accent-orange-500 cursor-pointer"
                    />
                    <span className={`text-xs px-2 py-0.5 rounded font-bold shrink-0 ${
                      tempC < 0
                        ? 'bg-blue-500/20 text-blue-300'
                        : tempC <= 100
                        ? 'bg-cyan-500/20 text-cyan-300'
                        : 'bg-orange-500/20 text-orange-300'
                    }`}>
                      {tempC < 0 ? 'Thể Rắn (Băng)' : tempC <= 100 ? 'Thể Lỏng (Nước)' : 'Thể Khí (Hơi)'}
                    </span>
                  </div>
                )}
              </div>

              {chemMode === 'atom' && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
                    Chọn nguyên tố:
                  </span>
                  {CHEMICAL_ELEMENTS.map((el) => {
                    const isSel = el.symbol === selectedElement;
                    return (
                      <button
                        key={el.symbol}
                        onClick={() => {
                          soundFx.playClick();
                          setSelectedElement(el.symbol);
                          controlsRef.current?.setChemElement(el.symbol);
                        }}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer shrink-0 border ${
                          isSel
                            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-400 shadow'
                            : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700'
                        }`}
                      >
                        <span className="text-amber-400 font-mono">{el.symbol}</span>
                        <span>{el.name.split(' (')[0]}</span>
                        <span className="text-[10px] opacity-75 font-mono">(Z={el.atomicNumber})</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {currentSubject === 'math' && (
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                {/* Shape Selector */}
                <div className="flex items-center gap-1 p-1 bg-slate-800/90 rounded-xl border border-slate-700/60">
                  <button
                    onClick={() => {
                      soundFx.playClick();
                      setShapeType('box');
                      controlsRef.current?.setBoxShape('box');
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      shapeType === 'box' ? 'bg-amber-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    📦 Hình Hộp Chữ Nhật
                  </button>
                  <button
                    onClick={() => {
                      soundFx.playClick();
                      setShapeType('cube');
                      controlsRef.current?.setBoxShape('cube');
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      shapeType === 'cube' ? 'bg-orange-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    🎲 Hình Lập Phương
                  </button>
                </div>

                {/* Unfold Slider (Trải hình 3D) */}
                <div className="flex items-center gap-3 flex-1 min-w-[240px] px-3 py-1.5 bg-slate-800/70 rounded-xl border border-slate-700/50">
                  <Layers className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="text-xs font-semibold text-slate-300 whitespace-nowrap">
                    Trải hình (Unfold): <strong className="text-amber-400 font-mono">{Math.round(unfoldVal * 100)}%</strong>
                  </span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.02"
                    value={unfoldVal}
                    onChange={(e) => {
                      const v = parseFloat(e.target.value);
                      setUnfoldVal(v);
                      controlsRef.current?.setBoxUnfold(v);
                      soundFx.playSliderTick(250 + v * 300);
                    }}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  <div className="flex gap-1">
                    <button
                      onClick={() => {
                        setUnfoldVal(0);
                        controlsRef.current?.setBoxUnfold(0);
                        soundFx.playClick();
                      }}
                      className="text-[10px] px-2 py-0.5 rounded bg-slate-700 text-slate-300 hover:bg-slate-600"
                    >
                      Đóng 3D
                    </button>
                    <button
                      onClick={() => {
                        setUnfoldVal(1);
                        controlsRef.current?.setBoxUnfold(1);
                        soundFx.playClick();
                      }}
                      className="text-[10px] px-2 py-0.5 rounded bg-amber-600 text-white hover:bg-amber-500"
                    >
                      Mở 2D
                    </button>
                  </div>
                </div>
              </div>

              {/* Dimensions sliders (when box) */}
              {shapeType === 'box' && (
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="flex items-center gap-2 p-1.5 bg-slate-800/60 rounded-lg">
                    <span className="text-slate-400">Dài a:</span>
                    <input
                      type="range"
                      min="1.2"
                      max="3.6"
                      step="0.2"
                      value={dimA}
                      onChange={(e) => {
                        const v = parseFloat(e.target.value);
                        setDimA(v);
                        controlsRef.current?.setBoxDimensions(v, dimB, dimH);
                      }}
                      className="w-full accent-blue-500"
                    />
                    <span className="font-mono text-blue-400 font-bold">{Math.round(dimA * 5)}cm</span>
                  </div>
                  <div className="flex items-center gap-2 p-1.5 bg-slate-800/60 rounded-lg">
                    <span className="text-slate-400">Rộng b:</span>
                    <input
                      type="range"
                      min="1.0"
                      max="3.0"
                      step="0.2"
                      value={dimB}
                      onChange={(e) => {
                        const v = parseFloat(e.target.value);
                        setDimB(v);
                        controlsRef.current?.setBoxDimensions(dimA, v, dimH);
                      }}
                      className="w-full accent-amber-500"
                    />
                    <span className="font-mono text-amber-400 font-bold">{Math.round(dimB * 5)}cm</span>
                  </div>
                  <div className="flex items-center gap-2 p-1.5 bg-slate-800/60 rounded-lg">
                    <span className="text-slate-400">Cao h:</span>
                    <input
                      type="range"
                      min="1.0"
                      max="3.0"
                      step="0.2"
                      value={dimH}
                      onChange={(e) => {
                        const v = parseFloat(e.target.value);
                        setDimH(v);
                        controlsRef.current?.setBoxDimensions(dimA, dimB, v);
                      }}
                      className="w-full accent-emerald-500"
                    />
                    <span className="font-mono text-emerald-400 font-bold">{Math.round(dimH * 5)}cm</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {currentSubject === 'geography' && (
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                {/* Season Presets */}
                <div className="flex items-center gap-1.5 p-1 bg-slate-800/90 rounded-xl border border-slate-700/60">
                  <span className="text-[11px] font-bold text-slate-400 px-2 uppercase">Mùa:</span>
                  <button
                    onClick={() => {
                      soundFx.playClick();
                      setSeason('summer');
                      controlsRef.current?.setEarthSeason('summer');
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      season === 'summer' ? 'bg-orange-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    ☀️ Hạ chí (22/6)
                  </button>
                  <button
                    onClick={() => {
                      soundFx.playClick();
                      setSeason('winter');
                      controlsRef.current?.setEarthSeason('winter');
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      season === 'winter' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    ❄️ Đông chí (22/12)
                  </button>
                  <button
                    onClick={() => {
                      soundFx.playClick();
                      setSeason('equinox');
                      controlsRef.current?.setEarthSeason('equinox');
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      season === 'equinox' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    🌱 Xuân/Thu phân
                  </button>
                </div>

                {/* Earth Rotation Speed */}
                <div className="flex items-center gap-3 flex-1 min-w-[200px] px-3 py-1.5 bg-slate-800/70 rounded-xl border border-slate-700/50">
                  <Compass className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span className="text-xs font-semibold text-slate-300 whitespace-nowrap">Tốc độ quay:</span>
                  <input
                    type="range"
                    min="0"
                    max="1.5"
                    step="0.1"
                    value={earthSpeed}
                    onChange={(e) => {
                      const v = parseFloat(e.target.value);
                      setEarthSpeed(v);
                      controlsRef.current?.setEarthRotateSpeed(v);
                    }}
                    className="w-full accent-cyan-500 cursor-pointer"
                  />
                  <span className="text-xs font-mono text-cyan-400">{earthSpeed === 0 ? 'Dừng' : `${earthSpeed.toFixed(1)}x`}</span>
                </div>
              </div>
            </div>
          )}

          {/* COMMON FOOTER TOOLS: CAMERA RESET & AUTO-ROTATE */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-800/90 text-xs">
            <span className="text-slate-400 text-[11px] hidden sm:inline">
              🖱️ Nhấp chuột trái để xoay • Cuộn để phóng to/thu nhỏ • Giữ chuột phải để di chuyển
            </span>
            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={() => {
                  soundFx.playClick();
                  const newState = controlsRef.current?.toggleAutoRotate() || false;
                  setIsAutoRotating(newState);
                }}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer border ${
                  isAutoRotating
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                }`}
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isAutoRotating ? 'text-cyan-400' : ''}`} />
                <span>Tự động xoay</span>
              </button>

              <button
                onClick={() => {
                  soundFx.playClick();
                  controlsRef.current?.resetCamera();
                }}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-medium transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Đặt lại góc nhìn</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
