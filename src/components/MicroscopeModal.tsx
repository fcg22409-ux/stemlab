import React, { useState } from 'react';
import { X, ZoomIn, Eye, Sparkles, Sliders } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface MicroscopeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MicroscopeModal: React.FC<MicroscopeModalProps> = ({ isOpen, onClose }) => {
  const [slideType, setSlideType] = useState<'onion' | 'cheek' | 'algae'>('onion');
  const [eyepieceMag, setEyepieceMag] = useState(10);
  const [objectiveMag, setObjectiveMag] = useState(40);
  const [coarseFocus, setCoarseFocus] = useState(50); // 0-100 (50 is sharp)
  const [brightness, setBrightness] = useState(85); // 20-100

  if (!isOpen) return null;

  const totalMag = eyepieceMag * objectiveMag;
  // Blur amount based on distance from sharp focus 50
  const blurAmount = Math.abs(coarseFocus - 50) * 0.16;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl shadow-cyan-950/60 overflow-hidden text-slate-100">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-base sm:text-lg text-white flex items-center gap-2">
                <span>Phòng Thực Hành: Kính Hiển Vi Quang Học Ảo</span>
                <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {totalMag}x
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Thao tác chỉnh nét ốc to/nhỏ, tụ quang và quan sát tế bào thực nghiệm
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

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Microscope Circular Field View (Left / Center) */}
          <div className="md:col-span-7 flex flex-col items-center justify-center">
            <div className="relative w-72 h-72 sm:w-84 sm:h-84 rounded-full border-8 border-slate-800 shadow-2xl shadow-emerald-950/50 bg-black overflow-hidden flex items-center justify-center">
              {/* Microscope Specimen Canvas */}
              <div
                className="w-full h-full relative transition-all duration-150"
                style={{
                  filter: `blur(${blurAmount}px) brightness(${brightness}%)`,
                  transform: `scale(${1 + (objectiveMag / 100) * 0.4})`,
                }}
              >
                {slideType === 'onion' && (
                  /* Onion Epidermal Cell Wall & Stained Nuclei */
                  <div className="w-full h-full bg-[#ecfdf5] p-2 flex flex-col justify-around">
                    {[0, 1, 2, 3, 4].map((row) => (
                      <div key={row} className="flex gap-1.5 h-12">
                        {[0, 1, 2, 3].map((col) => (
                          <div
                            key={col}
                            className="flex-1 border-2 border-emerald-700/80 bg-emerald-100/60 rounded-sm relative flex items-center justify-center"
                          >
                            {/* Stained nucleus dot */}
                            <div className="w-3.5 h-3.5 rounded-full bg-rose-700/80 shadow-sm" />
                            {/* Central vacuole light area */}
                            <div className="absolute inset-1 rounded bg-teal-50/40 pointer-events-none" />
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}

                {slideType === 'cheek' && (
                  /* Human Cheek Epithelial Cells */
                  <div className="w-full h-full bg-[#f8fafc] relative overflow-hidden">
                    {[
                      { x: 35, y: 30, r: 24 },
                      { x: 65, y: 55, r: 28 },
                      { x: 25, y: 70, r: 22 },
                      { x: 75, y: 25, r: 20 },
                    ].map((cell, i) => (
                      <div
                        key={i}
                        className="absolute border border-blue-400 bg-sky-100/70 shadow-sm flex items-center justify-center"
                        style={{
                          left: `${cell.x}%`,
                          top: `${cell.y}%`,
                          width: `${cell.r * 2.4}%`,
                          height: `${cell.r * 1.8}%`,
                          borderRadius: '45% 55% 60% 40% / 50% 45% 55% 50%',
                        }}
                      >
                        <div className="w-4 h-4 rounded-full bg-indigo-800 shadow" />
                      </div>
                    ))}
                  </div>
                )}

                {slideType === 'algae' && (
                  /* Chlamydomonas / Euglena */
                  <div className="w-full h-full bg-[#064e3b] relative">
                    {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                      <div
                        key={i}
                        className="absolute w-7 h-10 rounded-full border border-green-300 bg-green-500 shadow-md flex items-center justify-center"
                        style={{
                          left: `${15 + (i * 24) % 70}%`,
                          top: `${20 + (i * 31) % 65}%`,
                          transform: `rotate(${i * 45}deg)`,
                        }}
                      >
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Reticle / Crosshair Overlay */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-full h-[1px] bg-red-500/25" />
                <div className="h-full w-[1px] bg-red-500/25 absolute" />
                <div className="w-24 h-24 rounded-full border border-red-500/30 absolute" />
              </div>

              {/* Eyepiece ring reflection */}
              <div className="absolute inset-0 rounded-full border-4 border-white/10 pointer-events-none shadow-inner" />
            </div>

            <div className="mt-3 text-xs text-slate-400 font-mono text-center">
              {blurAmount < 0.5 ? (
                <span className="text-emerald-400 font-bold flex items-center gap-1 justify-center">
                  <Sparkles className="w-3.5 h-3.5" /> Ảnh cực kỳ sắc nét (Tiêu cự chuẩn!)
                </span>
              ) : (
                <span className="text-amber-400">
                  Đang mờ (Vặn ốc vi cấp để lấy nét)
                </span>
              )}
            </div>
          </div>

          {/* Microscope Controls Panel (Right) */}
          <div className="md:col-span-5 flex flex-col gap-4">
            {/* Slide Sample Selector */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2.5">
                Chọn Tiêu Bản Mẫu (Thực hành SGK 6):
              </span>
              <div className="grid grid-cols-1 gap-2">
                <button
                  onClick={() => {
                    soundFx.playClick();
                    setSlideType('onion');
                  }}
                  className={`p-2.5 rounded-xl text-xs font-bold text-left border transition-all cursor-pointer ${
                    slideType === 'onion'
                      ? 'bg-emerald-600/30 text-emerald-300 border-emerald-500 shadow'
                      : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  🧅 Biểu bì vảy hành tây (Tế bào Thực vật)
                </button>
                <button
                  onClick={() => {
                    soundFx.playClick();
                    setSlideType('cheek');
                  }}
                  className={`p-2.5 rounded-xl text-xs font-bold text-left border transition-all cursor-pointer ${
                    slideType === 'cheek'
                      ? 'bg-sky-600/30 text-sky-300 border-sky-500 shadow'
                      : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  👄 Tế bào niêm mạc miệng (Tế bào Động vật)
                </button>
                <button
                  onClick={() => {
                    soundFx.playClick();
                    setSlideType('algae');
                  }}
                  className={`p-2.5 rounded-xl text-xs font-bold text-left border transition-all cursor-pointer ${
                    slideType === 'algae'
                      ? 'bg-teal-600/30 text-teal-300 border-teal-500 shadow'
                      : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  🌿 Tảo lục đơn bào (Sinh vật đơn bào)
                </button>
              </div>
            </div>

            {/* Magnification Controls */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-semibold">Độ phóng đại thị kính:</span>
                <div className="flex gap-1.5">
                  {[10, 15, 20].map((m) => (
                    <button
                      key={m}
                      onClick={() => {
                        soundFx.playClick();
                        setEyepieceMag(m);
                      }}
                      className={`px-2 py-1 rounded-lg text-xs font-mono font-bold cursor-pointer ${
                        eyepieceMag === m ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {m}x
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-semibold">Vật kính (Đầu xoay):</span>
                <div className="flex gap-1.5">
                  {[10, 40, 100].map((m) => (
                    <button
                      key={m}
                      onClick={() => {
                        soundFx.playClick();
                        setObjectiveMag(m);
                      }}
                      className={`px-2 py-1 rounded-lg text-xs font-mono font-bold cursor-pointer ${
                        objectiveMag === m ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {m}x
                    </button>
                  ))}
                </div>
              </div>

              {/* Coarse & Fine Focus Slider */}
              <div className="pt-2 border-t border-slate-800 space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                    Ốc to / Ốc nhỏ (Lấy nét):
                  </span>
                  <span className="font-mono text-cyan-400 font-bold">{coarseFocus}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={coarseFocus}
                  onChange={(e) => {
                    const v = parseInt(e.target.value);
                    setCoarseFocus(v);
                    soundFx.playSliderTick(200 + v * 3);
                  }}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>

              {/* Brightness diaphragm */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-300">Đĩa chắn sáng (Độ sáng):</span>
                  <span className="font-mono text-amber-400 font-bold">{brightness}%</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="130"
                  value={brightness}
                  onChange={(e) => setBrightness(parseInt(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Formula reminder card */}
            <div className="bg-gradient-to-r from-emerald-950/40 to-slate-900 border border-emerald-500/30 rounded-2xl p-3 text-xs">
              <span className="font-bold text-emerald-400 block mb-1">Công thức phóng đại:</span>
              <p className="font-mono text-slate-300">
                M = M(thị kính) × M(vật kính) = {eyepieceMag} × {objectiveMag} = <strong className="text-cyan-300 text-sm">{totalMag} lần</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
          <span>Học sinh làm quen với kỹ năng sử dụng kính hiển vi quang học trong phòng thí nghiệm Sinh học 6</span>
          <button
            onClick={() => {
              soundFx.playClick();
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
