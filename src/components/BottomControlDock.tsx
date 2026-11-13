import React, { useState } from 'react';
import { SubjectId } from '../types';
import { SceneControlsRef } from './ThreeCanvas';
import { ORGANELLES, CHEMICAL_ELEMENTS, MOLECULES } from '../data/curriculumData';
import {
  ChevronDown,
  ChevronUp,
  RotateCcw,
  RefreshCw,
  Layers,
  Thermometer,
  Zap,
  FileSpreadsheet,
  Eye,
  Box,
} from 'lucide-react';
import { soundFx } from '../utils/audio';

interface BottomControlDockProps {
  currentSubject: SubjectId;
  controlsRef: React.MutableRefObject<SceneControlsRef | null>;
  selectedOrganelleId: string | null;
  onSelectOrganelle: (id: string | null) => void;
  onOpenMicroscope: () => void;
  onOpenLabNotebook: () => void;
}

export const BottomControlDock: React.FC<BottomControlDockProps> = ({
  currentSubject,
  controlsRef,
  selectedOrganelleId,
  onSelectOrganelle,
  onOpenMicroscope,
  onOpenLabNotebook,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isAutoRotating, setIsAutoRotating] = useState(false);

  // Sinh học
  const [cellType, setCellType] = useState<'plant' | 'animal'>('plant');
  const [explodedVal, setExplodedVal] = useState(0);

  // Vật lý
  const [physicsMode, setPhysicsMode] = useState<'spring' | 'lever'>('spring');
  const [massGrams, setMassGrams] = useState(200);
  const [springK, setSpringK] = useState(25);
  const [gravityVal, setGravityVal] = useState(9.8);
  const [gravityPreset, setGravityPreset] = useState<'earth' | 'moon' | 'mars' | 'zero'>('earth');
  // Lever
  const [leverLeftM, setLeverLeftM] = useState(200);
  const [leverLeftD, setLeverLeftD] = useState(15);
  const [leverRightM, setLeverRightM] = useState(100);
  const [leverRightD, setLeverRightD] = useState(30);

  // Hóa học
  const [chemMode, setChemMode] = useState<'atom' | 'molecule' | 'matter'>('atom');
  const [selectedElement, setSelectedElement] = useState('C');
  const [selectedMolecule, setSelectedMolecule] = useState('water');
  const [tempC, setTempC] = useState(25);

  // Toán học
  const [shapeType, setShapeType] = useState<'box' | 'cube' | 'tri_prism'>('box');
  const [unfoldVal, setUnfoldVal] = useState(0);
  const [dimA, setDimA] = useState(2.4);
  const [dimB, setDimB] = useState(1.6);
  const [dimH, setDimH] = useState(1.8);
  const [showVoxels, setShowVoxels] = useState(false);

  const activeOrganelle = ORGANELLES.find((o) => o.id === selectedOrganelleId);
  const isLeverBalanced = Math.abs(leverLeftM * leverLeftD - leverRightM * leverRightD) < 10;

  return (
    <div
      className={`fixed left-1/2 -translate-x-1/2 z-30 transition-all duration-300 pointer-events-auto ${
        isCollapsed ? 'bottom-2' : 'bottom-4'
      } w-full max-w-[min(980px,95vw)] flex flex-col items-center`}
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
          {/* SINH HỌC 6 */}
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
                      cellType === 'plant' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
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
                      cellType === 'animal' ? 'bg-sky-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    🐾 Tế bào Động vật
                  </button>
                </div>

                {/* Exploded View Slider */}
                <div className="flex items-center gap-3 flex-1 min-w-[200px] max-w-xs px-3 py-1.5 bg-slate-800/70 rounded-xl border border-slate-700/50">
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

                {/* Virtual Microscope Button */}
                <button
                  onClick={() => {
                    soundFx.playClick();
                    onOpenMicroscope();
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md shadow-emerald-600/30 cursor-pointer transition-all shrink-0"
                >
                  <Eye className="w-4 h-4 text-emerald-200" />
                  <span>Kính hiển vi ảo</span>
                </button>
              </div>

              {/* Organelle chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
                  Bào quan:
                </span>
                {ORGANELLES.filter((o) => (cellType === 'plant' ? true : o.foundIn !== 'plant')).map((org) => {
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

          {/* VẬT LÝ 6 */}
          {currentSubject === 'khtn_physics' && (
            <div className="flex flex-col gap-3">
              {/* Physics Mode Switcher & Lab Notebook Button */}
              <div className="flex flex-wrap items-center justify-between gap-2.5">
                <div className="flex items-center gap-1.5 p-1 bg-slate-800/90 rounded-xl border border-slate-700/60">
                  <button
                    onClick={() => {
                      soundFx.playClick();
                      setPhysicsMode('spring');
                      controlsRef.current?.setPhysicsMode('spring');
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      physicsMode === 'spring' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    🪝 Lò xo & Trọng lực
                  </button>
                  <button
                    onClick={() => {
                      soundFx.playClick();
                      setPhysicsMode('lever');
                      controlsRef.current?.setPhysicsMode('lever');
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      physicsMode === 'lever' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    ⚖️ Cân bằng Đòn bẩy
                  </button>
                </div>

                <button
                  onClick={() => {
                    soundFx.playClick();
                    onOpenLabNotebook();
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md cursor-pointer transition-all"
                >
                  <FileSpreadsheet className="w-4 h-4 text-blue-200" />
                  <span>Sổ tay Thực nghiệm & Đồ thị</span>
                </button>
              </div>

              {physicsMode === 'spring' ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Mass Slider */}
                    <div className="flex flex-col gap-1 p-2.5 bg-slate-800/70 rounded-xl border border-slate-700/50">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-300">Khối lượng m:</span>
                        <span className="text-blue-400 font-mono font-bold">{massGrams} g</span>
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
                    </div>

                    {/* Spring Constant */}
                    <div className="flex flex-col gap-1 p-2.5 bg-slate-800/70 rounded-xl border border-slate-700/50">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-300">Độ cứng lò xo k:</span>
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
                    </div>

                    {/* Gravity Selector */}
                    <div className="flex flex-col gap-1 p-2.5 bg-slate-800/70 rounded-xl border border-slate-700/50">
                      <span className="text-xs font-semibold text-slate-300">Trọng trường g:</span>
                      <div className="grid grid-cols-2 gap-1 mt-0.5">
                        <button
                          onClick={() => {
                            setGravityPreset('earth');
                            setGravityVal(9.8);
                            controlsRef.current?.setSpringGravity(9.8);
                          }}
                          className={`text-[11px] py-1 px-1 rounded font-medium border text-center ${
                            gravityPreset === 'earth' ? 'bg-blue-600 text-white border-blue-400' : 'bg-slate-800 text-slate-300 border-slate-700'
                          }`}
                        >
                          🌍 Trái Đất (10)
                        </button>
                        <button
                          onClick={() => {
                            setGravityPreset('moon');
                            setGravityVal(1.6);
                            controlsRef.current?.setSpringGravity(1.6);
                          }}
                          className={`text-[11px] py-1 px-1 rounded font-medium border text-center ${
                            gravityPreset === 'moon' ? 'bg-amber-600 text-white border-amber-400' : 'bg-slate-800 text-slate-300 border-slate-700'
                          }`}
                        >
                          🌙 Mặt Trăng (1.6)
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-800 text-xs">
                    <div className="font-mono text-slate-300 flex items-center gap-3">
                      <span>P = <strong className="text-emerald-400 font-bold">{Math.round((massGrams / 1000) * gravityVal * 100) / 100} N</strong></span>
                      <span>•</span>
                      <span>Δl ≈ <strong className="text-cyan-400 font-bold">{(Math.round((((massGrams / 1000) * gravityVal) / springK) * 100 * 10) / 10)} cm</strong></span>
                    </div>
                    <button
                      onClick={() => {
                        soundFx.playSpringBoing();
                        controlsRef.current?.triggerSpringPerturb();
                      }}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow"
                    >
                      <Zap className="w-3.5 h-3.5 text-yellow-300" />
                      <span>Kéo thả nhún</span>
                    </button>
                  </div>
                </>
              ) : (
                /* LEVER CONTROLS */
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {/* Left arm */}
                    <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60 space-y-2">
                      <div className="flex justify-between font-bold text-blue-300">
                        <span>Bên Trái (F₁): {Math.round(leverLeftM * 0.01 * 10) / 10} N ({leverLeftM}g)</span>
                        <span className="font-mono">d₁ = {leverLeftD} cm</span>
                      </div>
                      <div className="flex gap-2 items-center">
                        <span className="text-slate-400 text-[11px]">Tải:</span>
                        <input
                          type="range"
                          min="50"
                          max="500"
                          step="50"
                          value={leverLeftM}
                          onChange={(e) => {
                            const v = parseInt(e.target.value);
                            setLeverLeftM(v);
                            controlsRef.current?.setLeverLeft(v, leverLeftD);
                          }}
                          className="w-full accent-blue-500"
                        />
                      </div>
                      <div className="flex gap-2 items-center">
                        <span className="text-slate-400 text-[11px]">Vị trí:</span>
                        <input
                          type="range"
                          min="5"
                          max="20"
                          step="5"
                          value={leverLeftD}
                          onChange={(e) => {
                            const v = parseInt(e.target.value);
                            setLeverLeftD(v);
                            controlsRef.current?.setLeverLeft(leverLeftM, v);
                          }}
                          className="w-full accent-blue-500"
                        />
                      </div>
                    </div>

                    {/* Right arm */}
                    <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60 space-y-2">
                      <div className="flex justify-between font-bold text-amber-300">
                        <span>Bên Phải (F₂): {Math.round(leverRightM * 0.01 * 10) / 10} N ({leverRightM}g)</span>
                        <span className="font-mono">d₂ = {leverRightD} cm</span>
                      </div>
                      <div className="flex gap-2 items-center">
                        <span className="text-slate-400 text-[11px]">Tải:</span>
                        <input
                          type="range"
                          min="50"
                          max="500"
                          step="50"
                          value={leverRightM}
                          onChange={(e) => {
                            const v = parseInt(e.target.value);
                            setLeverRightM(v);
                            controlsRef.current?.setLeverRight(v, leverRightD);
                          }}
                          className="w-full accent-amber-500"
                        />
                      </div>
                      <div className="flex gap-2 items-center">
                        <span className="text-slate-400 text-[11px]">Vị trí:</span>
                        <input
                          type="range"
                          min="5"
                          max="20"
                          step="5"
                          value={leverRightD}
                          onChange={(e) => {
                            const v = parseInt(e.target.value);
                            setLeverRightD(v);
                            controlsRef.current?.setLeverRight(leverRightM, v);
                          }}
                          className="w-full accent-amber-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-2.5 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                    <span className="font-mono text-slate-300">
                      F₁·d₁ = {leverLeftM * leverLeftD} • F₂·d₂ = {leverRightM * leverRightD}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-lg font-bold ${
                        isLeverBalanced ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {isLeverBalanced ? '✓ Cân bằng nằm ngang (F₁·d₁ = F₂·d₂)' : 'Chưa cân bằng'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* HÓA HỌC 6 */}
          {currentSubject === 'khtn_chem' && (
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
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
                    ⚛️ Nguyên tử Bohr
                  </button>
                  <button
                    onClick={() => {
                      soundFx.playClick();
                      setChemMode('molecule');
                      controlsRef.current?.setChemMode('molecule');
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      chemMode === 'molecule' ? 'bg-teal-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    🧪 Phân tử 3D
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
                    🧊 3 Thể của Chất
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
                      }}
                      className="w-full accent-orange-500 cursor-pointer"
                    />
                    <span className="text-xs px-2 py-0.5 rounded font-bold shrink-0 bg-orange-500/20 text-orange-300">
                      {tempC < 0 ? 'Thể Rắn' : tempC <= 100 ? 'Thể Lỏng' : 'Thể Khí'}
                    </span>
                  </div>
                )}
              </div>

              {chemMode === 'atom' && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
                    Nguyên tố:
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
                      </button>
                    );
                  })}
                </div>
              )}

              {chemMode === 'molecule' && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
                    Phân tử:
                  </span>
                  {MOLECULES.map((mol) => {
                    const isSel = mol.id === selectedMolecule;
                    return (
                      <button
                        key={mol.id}
                        onClick={() => {
                          soundFx.playClick();
                          setSelectedMolecule(mol.id);
                          controlsRef.current?.setChemMolecule(mol.id);
                        }}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer shrink-0 border ${
                          isSel
                            ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white border-teal-400 shadow'
                            : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700'
                        }`}
                      >
                        <span className="text-cyan-300 font-mono">{mol.formula}</span>
                        <span>{mol.name.split(' (')[0]}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TOÁN HỌC 6 */}
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
                    📦 Hộp Chữ Nhật
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
                    🎲 Lập Phương
                  </button>
                  <button
                    onClick={() => {
                      soundFx.playClick();
                      setShapeType('tri_prism');
                      controlsRef.current?.setBoxShape('tri_prism');
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      shapeType === 'tri_prism' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    🔺 Lăng Trụ Đứng
                  </button>
                </div>

                {/* Voxel Counting Mode */}
                <button
                  onClick={() => {
                    soundFx.playClick();
                    const n = !showVoxels;
                    setShowVoxels(n);
                    controlsRef.current?.toggleBoxVoxels(n);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    showVoxels ? 'bg-cyan-600 text-white border-cyan-400' : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  <Box className="w-3.5 h-3.5" />
                  <span>Đếm khối đơn vị 1cm³</span>
                </button>
              </div>

              {/* Unfold Slider */}
              <div className="flex items-center gap-3 px-3 py-1.5 bg-slate-800/70 rounded-xl border border-slate-700/50">
                <Layers className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-xs font-semibold text-slate-300 whitespace-nowrap">
                  Trải hình 3D (Unfold): <strong className="text-amber-400 font-mono">{Math.round(unfoldVal * 100)}%</strong>
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
              </div>

              {/* Dimensions sliders & Live Calculations for Box */}
              {shapeType === 'box' && (
                <div className="space-y-2">
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

                  <div className="flex flex-wrap items-center justify-between gap-2 p-2 bg-slate-950/70 rounded-xl text-xs font-mono text-slate-300 border border-slate-800">
                    <span className="text-slate-400">6 mặt • 8 đỉnh • 12 cạnh</span>
                    <div className="flex items-center gap-3">
                      <span>S_xq = <strong className="text-amber-400">{2 * (Math.round(dimA * 5) + Math.round(dimB * 5)) * Math.round(dimH * 5)} cm²</strong></span>
                      <span>•</span>
                      <span>V = <strong className="text-cyan-400">{Math.round(dimA * 5) * Math.round(dimB * 5) * Math.round(dimH * 5)} cm³</strong></span>
                    </div>
                  </div>
                </div>
              )}

              {/* Dimensions sliders & Live Calculations for Cube */}
              {shapeType === 'cube' && (
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-2 bg-slate-800/60 rounded-lg text-xs">
                    <span className="text-slate-300 font-medium whitespace-nowrap">Cạnh lập phương a:</span>
                    <input
                      type="range"
                      min="1.2"
                      max="3.2"
                      step="0.2"
                      value={dimA}
                      onChange={(e) => {
                        const v = parseFloat(e.target.value);
                        setDimA(v);
                        setDimB(v);
                        setDimH(v);
                        controlsRef.current?.setBoxDimensions(v, v, v);
                      }}
                      className="w-full accent-orange-500 cursor-pointer"
                    />
                    <span className="font-mono text-orange-400 font-bold whitespace-nowrap">{Math.round(dimA * 5)} cm</span>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 p-2 bg-slate-950/70 rounded-xl text-xs font-mono text-slate-300 border border-slate-800">
                    <span className="text-slate-400">6 mặt vuông bằng nhau • 8 đỉnh • 12 cạnh</span>
                    <div className="flex items-center gap-3">
                      <span>S_tp = 6a² = <strong className="text-amber-400">{6 * Math.pow(Math.round(dimA * 5), 2)} cm²</strong></span>
                      <span>•</span>
                      <span>V = a³ = <strong className="text-cyan-400">{Math.pow(Math.round(dimA * 5), 3)} cm³</strong></span>
                    </div>
                  </div>
                </div>
              )}

              {/* Dimensions sliders & Live Calculations for Triangular Prism */}
              {shapeType === 'tri_prism' && (
                <div className="space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-2 p-2 bg-slate-800/60 rounded-lg">
                      <span className="text-slate-300 font-medium whitespace-nowrap">Cạnh đáy a:</span>
                      <input
                        type="range"
                        min="1.4"
                        max="3.2"
                        step="0.2"
                        value={dimA}
                        onChange={(e) => {
                          const v = parseFloat(e.target.value);
                          setDimA(v);
                          controlsRef.current?.setBoxDimensions(v, dimB, dimH);
                        }}
                        className="w-full accent-cyan-500 cursor-pointer"
                      />
                      <span className="font-mono text-cyan-400 font-bold">{Math.round(dimA * 5)} cm</span>
                    </div>

                    <div className="flex items-center gap-2 p-2 bg-slate-800/60 rounded-lg">
                      <span className="text-slate-300 font-medium whitespace-nowrap">Chiều cao h:</span>
                      <input
                        type="range"
                        min="1.4"
                        max="3.2"
                        step="0.2"
                        value={dimH}
                        onChange={(e) => {
                          const v = parseFloat(e.target.value);
                          setDimH(v);
                          controlsRef.current?.setBoxDimensions(dimA, dimB, v);
                        }}
                        className="w-full accent-emerald-500 cursor-pointer"
                      />
                      <span className="font-mono text-emerald-400 font-bold">{Math.round(dimH * 5)} cm</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 p-2 bg-slate-950/70 rounded-xl text-xs font-mono text-slate-300 border border-slate-800">
                    <span className="text-cyan-400 font-sans font-semibold">5 mặt (2 đáy tam giác, 3 mặt bên chữ nhật) • 9 cạnh • 6 đỉnh</span>
                    <div className="flex items-center gap-3">
                      <span>C_đáy = <strong className="text-blue-300">{3 * Math.round(dimA * 5)} cm</strong></span>
                      <span>•</span>
                      <span>S_xq = <strong className="text-amber-400">{3 * Math.round(dimA * 5) * Math.round(dimH * 5)} cm²</strong></span>
                      <span>•</span>
                      <span>V ≈ <strong className="text-emerald-400">{Math.round((Math.sqrt(3) / 4) * Math.pow(Math.round(dimA * 5), 2) * Math.round(dimH * 5))} cm³</strong></span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* COMMON FOOTER TOOLS */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-800/90 text-xs">
            <span className="text-slate-400 text-[11px] hidden sm:inline">
              🖱️ Nhấp chuột trái để xoay • Cuộn để zoom • Giữ chuột phải để di chuyển
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
