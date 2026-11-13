import React, { useState } from 'react';
import { X, FileSpreadsheet, Plus, TrendingUp, CheckCircle, Trash2 } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface LabNotebookModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MeasurementRow {
  id: number;
  massG: number;
  weightN: number;
  lengthCm: number;
  deltaLCm: number;
}

export const LabNotebookModal: React.FC<LabNotebookModalProps> = ({ isOpen, onClose }) => {
  const [naturalLength, setNaturalLength] = useState(12); // l0 = 12 cm
  const [springK] = useState(25); // 25 N/m

  const [rows, setRows] = useState<MeasurementRow[]>([
    { id: 1, massG: 50, weightN: 0.5, lengthCm: 14.0, deltaLCm: 2.0 },
    { id: 2, massG: 100, weightN: 1.0, lengthCm: 16.0, deltaLCm: 4.0 },
    { id: 3, massG: 150, weightN: 1.5, lengthCm: 18.0, deltaLCm: 6.0 },
    { id: 4, massG: 200, weightN: 2.0, lengthCm: 20.0, deltaLCm: 8.0 },
  ]);

  const [inputMass, setInputMass] = useState(250);

  if (!isOpen) return null;

  const handleAddMeasurement = () => {
    soundFx.playClick();
    const P = Math.round((inputMass / 1000) * 10 * 10) / 10;
    const deltaL = Math.round(((P / springK) * 100) * 10) / 10;
    const totalL = Math.round((naturalLength + deltaL) * 10) / 10;

    setRows((prev) => [
      ...prev,
      {
        id: Date.now(),
        massG: inputMass,
        weightN: P,
        lengthCm: totalL,
        deltaLCm: deltaL,
      },
    ]);
  };

  const handleRemoveRow = (id: number) => {
    soundFx.playClick();
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl shadow-blue-950/60 overflow-hidden text-slate-100">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-base sm:text-lg text-white flex items-center gap-2">
                <span>Sổ Tay Thí Nghiệm & Đồ Thị Thực Nghiệm</span>
                <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  SGK KHTN 6
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Ghi chép số liệu đo độ dãn lò xo & đồ thị biểu diễn định luật Hooke
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Top parameters & Add measurement */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-xs">
              <span className="text-slate-400 font-semibold">Chiều dài tự nhiên ban đầu (l₀):</span>
              <span className="font-mono text-cyan-400 font-bold text-sm bg-slate-900 px-3 py-1 rounded-lg border border-slate-700">
                {naturalLength} cm
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-300">Treo thêm quả nặng:</span>
              <input
                type="number"
                min="10"
                max="1000"
                step="10"
                value={inputMass}
                onChange={(e) => setInputMass(parseInt(e.target.value) || 0)}
                className="w-20 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 font-mono text-xs text-white"
              />
              <span className="text-xs text-slate-400">g</span>
              <button
                onClick={handleAddMeasurement}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs cursor-pointer shadow transition-all ml-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Ghi số liệu</span>
              </button>
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-900/90 text-slate-300 font-bold border-b border-slate-800">
                  <tr>
                    <th className="p-3">Lần đo</th>
                    <th className="p-3">Khối lượng m (g)</th>
                    <th className="p-3">Trọng lượng P (N)</th>
                    <th className="p-3">Chiều dài l (cm)</th>
                    <th className="p-3 text-cyan-400">Độ dãn Δl = l - l₀ (cm)</th>
                    <th className="p-3">Tỉ số P / Δl</th>
                    <th className="p-3 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {rows.map((row, idx) => {
                    const ratio = Math.round((row.weightN / row.deltaLCm) * 100) / 100;
                    return (
                      <tr key={row.id} className="hover:bg-slate-900/50">
                        <td className="p-3 text-slate-400 font-bold">#{idx + 1}</td>
                        <td className="p-3 font-bold text-blue-300">{row.massG} g</td>
                        <td className="p-3 font-bold text-amber-300">{row.weightN} N</td>
                        <td className="p-3 text-slate-200">{row.lengthCm} cm</td>
                        <td className="p-3 font-bold text-cyan-400">+{row.deltaLCm} cm</td>
                        <td className="p-3 text-emerald-400 font-bold">{ratio} N/cm</td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => handleRemoveRow(row.id)}
                            className="p-1 rounded text-slate-500 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Interactive Chart Graphic */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center gap-2 text-sm font-bold text-cyan-400 mb-3">
              <TrendingUp className="w-4 h-4" />
              <span>Đồ Thị Biểu Diễn Mối Quan Hệ Giữa Độ Dãn (Δl) và Trọng Lượng (P)</span>
            </div>

            <div className="w-full h-52 bg-slate-900/80 rounded-xl border border-slate-800 relative flex items-center justify-center p-4">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 400 180">
                {/* Axes */}
                <line x1="40" y1="150" x2="380" y2="150" stroke="#475569" strokeWidth="2" />
                <line x1="40" y1="150" x2="40" y2="20" stroke="#475569" strokeWidth="2" />

                {/* Arrow heads */}
                <polygon points="380,147 386,150 380,153" fill="#475569" />
                <polygon points="37,20 40,14 43,20" fill="#475569" />

                {/* Labels */}
                <text x="360" y="170" fill="#94a3b8" fontSize="11" fontFamily="JetBrains Mono">P (N)</text>
                <text x="10" y="25" fill="#38bdf8" fontSize="11" fontFamily="JetBrains Mono">Δl (cm)</text>
                <text x="28" y="165" fill="#64748b" fontSize="11" fontFamily="JetBrains Mono">0</text>

                {/* Linear regression line */}
                <line x1="40" y1="150" x2="360" y2="30" stroke="#38bdf8" strokeWidth="2.5" strokeDasharray="4 2" />

                {/* Plot points from rows */}
                {rows.map((r, i) => {
                  const cx = 40 + Math.min(320, (r.weightN / 2.5) * 300);
                  const cy = 150 - Math.min(125, (r.deltaLCm / 10) * 115);
                  return (
                    <g key={r.id}>
                      <circle cx={cx} cy={cy} r="5" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.5" />
                      <text x={cx + 6} y={cy - 4} fill="#f8fafc" fontSize="10" fontFamily="JetBrains Mono">
                        ({r.weightN}N, {r.deltaLCm}cm)
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Scientific conclusion */}
            <div className="mt-4 p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-slate-300 flex items-start gap-2.5">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-emerald-300 block mb-0.5">Kết luận rút ra từ thực nghiệm:</strong>
                <p>
                  Đồ thị biểu diễn mối quan hệ giữa độ dãn của lò xo và trọng lượng vật treo là một{' '}
                  <strong className="text-white">đường thẳng đi qua gốc tọa độ O</strong>. Điều này chứng minh rằng:{' '}
                  <span className="text-cyan-300 font-bold">
                    Độ biến dạng (độ dãn) của lò xo tỉ lệ thuận với độ lớn lực kéo (trọng lượng quả nặng)
                  </span>.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex justify-end">
          <button
            onClick={() => {
              soundFx.playClick();
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs cursor-pointer"
          >
            Đóng Sổ Tay
          </button>
        </div>
      </div>
    </div>
  );
};
