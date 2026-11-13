import { SubjectInfo, OrganelleInfo, ChemicalElement, MoleculeInfo, QuizQuestion, FormulaData, SubjectId } from '../types';

export const SUBJECTS: SubjectInfo[] = [
  {
    id: 'khtn_bio',
    name: 'Sinh Học 6',
    badge: 'KHTN - Sinh Học',
    subTitle: 'Bài 17-21: Tế bào - Đơn vị cơ sở của sự sống & Kính hiển vi quang học',
    topicTitle: 'Mô hình Tế bào 3D Đa Bào quan & Kính Hiển Vi Ảo',
    iconName: 'Dna',
    color: '#10b981',
    gradient: 'from-emerald-500 to-teal-700',
  },
  {
    id: 'khtn_physics',
    name: 'Vật Lý 6',
    badge: 'KHTN - Vật Lý',
    subTitle: 'Bài 40-45: Lực đàn hồi, Trọng lượng, Đòn bẩy & Khối lượng riêng',
    topicTitle: 'Thí nghiệm Đo Lực Kế, Độ Dãn Lò Xo & Cân Bằng Đòn Bẩy',
    iconName: 'Weight',
    color: '#3b82f6',
    gradient: 'from-blue-500 to-indigo-700',
  },
  {
    id: 'khtn_chem',
    name: 'Hóa Học 6',
    badge: 'KHTN - Hóa Học',
    subTitle: 'Bài 2-12: Cấu tạo nguyên tử, Phân tử hợp chất & Các thể của chất',
    topicTitle: 'Mô hình Nguyên tử Bohr, Phân tử Hóa học 3D & Chuyển thể',
    iconName: 'Atom',
    color: '#8b5cf6',
    gradient: 'from-purple-500 to-violet-700',
  },
  {
    id: 'math',
    name: 'Toán Học 6',
    badge: 'Toán Học Trực Quan',
    subTitle: 'Hình học trực quan: Hình hộp chữ nhật, Hình lập phương & Lăng trụ đứng',
    topicTitle: 'Khối Không Gian 3D, Trải Hình (Net) & Đếm Thể Tích Đơn Vị',
    iconName: 'Box',
    color: '#f59e0b',
    gradient: 'from-amber-500 to-orange-700',
  },
];

export const ORGANELLES: OrganelleInfo[] = [
  {
    id: 'nucleus',
    name: 'Nhân tế bào (Nucleus)',
    scientificName: 'Nucleus',
    role: 'Trung tâm chỉ huy và điều khiển mọi hoạt động sống của tế bào, chứa vật chất di truyền (ADN / Nhiễm sắc thể).',
    foundIn: 'both',
    formulaOrFact: 'Kích thước khoảng 5 - 10 µm. Có màng nhân kép bao bọc và nhân con bên trong chứa ribosome.',
    color: '#ec4899',
  },
  {
    id: 'cell_wall',
    name: 'Thành tế bào (Cell Wall)',
    scientificName: 'Murus cellularis',
    role: 'Bảo vệ tế bào, tạo bộ khung vững chắc giúp thực vật đứng thẳng và giữ nguyên hình dạng cố định.',
    foundIn: 'plant',
    formulaOrFact: 'Được cấu tạo chủ yếu từ sợi xenlulôzơ (cellulose). Chỉ có ở thực vật, nấm, không có ở động vật!',
    color: '#10b981',
  },
  {
    id: 'membrane',
    name: 'Màng sinh chất (Cell Membrane)',
    scientificName: 'Membrana cellularis',
    role: 'Kiểm soát có chọn lọc các chất đi vào và ra khỏi tế bào (nước, chất dinh dưỡng, khí oxy, chất thải).',
    foundIn: 'both',
    formulaOrFact: 'Gồm lớp kép phospholipid và các phân tử protein xuyên màng mỏng khoảng 7-10 nm.',
    color: '#38bdf8',
  },
  {
    id: 'chloroplast',
    name: 'Lục lạp (Chloroplast)',
    scientificName: 'Chloroplastus',
    role: 'Thực hiện quá trình quang hợp: hấp thụ năng lượng ánh sáng mặt trời để tổng hợp chất hữu cơ (đường) nuôi cây.',
    foundIn: 'plant',
    formulaOrFact: 'Chứa chất diệp lục (chlorophyll). Phương trình: 6CO₂ + 6H₂O + Ánh sáng → C₆H₁₂O₆ + 6O₂.',
    color: '#22c55e',
  },
  {
    id: 'mitochondria',
    name: 'Ti thể (Mitochondria)',
    scientificName: 'Mitochondrion',
    role: '"Nhà máy năng lượng" của tế bào, thực hiện hô hấp tế bào để phân giải đường và tạo ra năng lượng ATP cung cấp cho sự sống.',
    foundIn: 'both',
    formulaOrFact: 'Phương trình hô hấp: C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + Năng lượng (ATP). Có màng kép và mào cristae gấp nếp.',
    color: '#f97316',
  },
  {
    id: 'vacuole',
    name: 'Không bào trung tâm (Vacuole)',
    scientificName: 'Vacuola',
    role: 'Dự trữ nước, khoáng chất, chất dinh dưỡng, sắc tố hoa quả và điều hòa áp suất thẩm thấu cho tế bào thực vật.',
    foundIn: 'plant',
    formulaOrFact: 'Ở tế bào thực vật trưởng thành, không bào trung tâm có thể chiếm tới 90% thể tích tế bào!',
    color: '#06b6d4',
  },
  {
    id: 'golgi',
    name: 'Bộ máy Golgi (Golgi Apparatus)',
    scientificName: 'Complexus golgiensis',
    role: 'Đóng gói, chế biến, hoàn thiện và phân phối các sản phẩm protein, lipid tới các bào quan khác hoặc xuất khẩu ra ngoài.',
    foundIn: 'both',
    formulaOrFact: 'Gồm hệ thống các túi dẹt xếp chồng lên nhau hình đĩa cong kèm theo các túi cầu vận chuyển (vesicles).',
    color: '#eab308',
  },
  {
    id: 'er',
    name: 'Lưới nội chất & Ribosome (Endoplasmic Reticulum)',
    scientificName: 'Reticulum endoplasmicum',
    role: 'Mạng lưới đường ống màng tổng hợp protein (lưới có hạt đính ribosome) và tổng hợp lipid (lưới trơn).',
    foundIn: 'both',
    formulaOrFact: 'Ribosome là nơi lắp ráp chuỗi axit amin thành protein nuôi cơ thể.',
    color: '#a855f7',
  },
  {
    id: 'cytoplasm',
    name: 'Chất tế bào (Cytoplasm)',
    scientificName: 'Cytoplasma',
    role: 'Khối dịch keo chứa dịch bào và các bào quan, là nơi diễn ra hầu hết các phản ứng hóa sinh của tế bào.',
    foundIn: 'both',
    formulaOrFact: 'Gồm 80-90% là nước cùng protein, muối khoáng hòa tan.',
    color: '#c084fc',
  },
];

export const CHEMICAL_ELEMENTS: ChemicalElement[] = [
  {
    symbol: 'H',
    name: 'Hydrogen (Hiđrô)',
    atomicNumber: 1,
    massNumber: 1,
    protons: 1,
    neutrons: 0,
    electrons: 1,
    shells: [1],
    stateAtRoomTemp: 'Khí',
    description: 'Nguyên tố nhẹ nhất và phong phú nhất trong vũ trụ, tạo nên nước (H₂O) và các vì sao.',
  },
  {
    symbol: 'He',
    name: 'Helium (Heli)',
    atomicNumber: 2,
    massNumber: 4,
    protons: 2,
    neutrons: 2,
    electrons: 2,
    shells: [2],
    stateAtRoomTemp: 'Khí',
    description: 'Khí hiếm nhẹ thứ nhì, không cháy, dùng để bơm bóng bay khinh khí cầu và làm lạnh siêu dẫn.',
  },
  {
    symbol: 'C',
    name: 'Carbon (Cacbon)',
    atomicNumber: 6,
    massNumber: 12,
    protons: 6,
    neutrons: 6,
    electrons: 6,
    shells: [2, 4],
    stateAtRoomTemp: 'Rắn',
    description: 'Khung xương của mọi sự sống trên Trái Đất, tồn tại dưới dạng than củi, than chì ruột bút chì, kim cương.',
  },
  {
    symbol: 'N',
    name: 'Nitrogen (Nitơ)',
    atomicNumber: 7,
    massNumber: 14,
    protons: 7,
    neutrons: 7,
    electrons: 7,
    shells: [2, 5],
    stateAtRoomTemp: 'Khí',
    description: 'Chiếm tới 78% thể tích bầu khí quyển của Trái Đất, đóng vai trò quan trọng trong đạm dinh dưỡng cây trồng.',
  },
  {
    symbol: 'O',
    name: 'Oxygen (Oxy)',
    atomicNumber: 8,
    massNumber: 16,
    protons: 8,
    neutrons: 8,
    electrons: 8,
    shells: [2, 6],
    stateAtRoomTemp: 'Khí',
    description: 'Duy trì sự hô hấp của con người, động vật và sự cháy. Chiếm 21% thể tích không khí quyển.',
  },
  {
    symbol: 'Na',
    name: 'Sodium (Natri)',
    atomicNumber: 11,
    massNumber: 23,
    protons: 11,
    neutrons: 12,
    electrons: 11,
    shells: [2, 8, 1],
    stateAtRoomTemp: 'Rắn',
    description: 'Kim loại kiềm mềm màu trắng bạc, phản ứng dữ dội với nước. Kết hợp với Clo tạo muối ăn NaCl.',
  },
  {
    symbol: 'Mg',
    name: 'Magnesium (Magiê)',
    atomicNumber: 12,
    massNumber: 24,
    protons: 12,
    neutrons: 12,
    electrons: 12,
    shells: [2, 8, 2],
    stateAtRoomTemp: 'Rắn',
    description: 'Kim loại nhẹ màu bạc, cháy với ngọn lửa trắng chói lòa trong pháo hoa, là nhân tố trung tâm của phân tử diệp lục.',
  },
  {
    symbol: 'Al',
    name: 'Aluminium (Nhôm)',
    atomicNumber: 13,
    massNumber: 27,
    protons: 13,
    neutrons: 14,
    electrons: 13,
    shells: [2, 8, 3],
    stateAtRoomTemp: 'Rắn',
    description: 'Kim loại phổ biến nhất trong vỏ Trái Đất, nhẹ, dẫn điện và dẫn nhiệt tốt, dùng làm khung cửa, máy bay, nồi chảo.',
  },
  {
    symbol: 'Cl',
    name: 'Chlorine (Clo)',
    atomicNumber: 17,
    massNumber: 35,
    protons: 17,
    neutrons: 18,
    electrons: 17,
    shells: [2, 8, 7],
    stateAtRoomTemp: 'Khí',
    description: 'Khí màu vàng lục có mùi hắc đặc trưng, dùng để khử trùng nước sinh hoạt bể bơi và tạo muối ăn.',
  },
];

export const MOLECULES: MoleculeInfo[] = [
  {
    id: 'water',
    formula: 'H₂O',
    name: 'Phân tử Nước (Water)',
    description: 'Hợp chất nuôi dưỡng mọi sự sống, gồm 1 nguyên tử Oxy liên kết với 2 nguyên tử Hiđrô góc 104.5°.',
    atoms: [
      { symbol: 'O', x: 0, y: 0.2, z: 0, color: '#ef4444', radius: 0.4 },
      { symbol: 'H', x: -0.65, y: -0.4, z: 0, color: '#f8fafc', radius: 0.25 },
      { symbol: 'H', x: 0.65, y: -0.4, z: 0, color: '#f8fafc', radius: 0.25 },
    ],
    bonds: [
      { from: 0, to: 1, type: 'single' },
      { from: 0, to: 2, type: 'single' },
    ],
  },
  {
    id: 'co2',
    formula: 'CO₂',
    name: 'Khí Carbon dioxide (Cacbonic)',
    description: 'Phân tử thẳng hàng gồm 1 nguyên tử Cacbon ở giữa liên kết đôi với 2 nguyên tử Oxy hai bên.',
    atoms: [
      { symbol: 'C', x: 0, y: 0, z: 0, color: '#334155', radius: 0.35 },
      { symbol: 'O', x: -0.9, y: 0, z: 0, color: '#ef4444', radius: 0.38 },
      { symbol: 'O', x: 0.9, y: 0, z: 0, color: '#ef4444', radius: 0.38 },
    ],
    bonds: [
      { from: 0, to: 1, type: 'double' },
      { from: 0, to: 2, type: 'double' },
    ],
  },
  {
    id: 'o2',
    formula: 'O₂',
    name: 'Khí Oxygen (Oxy phân tử)',
    description: 'Đơn chất khí cần thiết cho hô hấp và sự cháy, gồm 2 nguyên tử Oxy liên kết đôi bền vững.',
    atoms: [
      { symbol: 'O', x: -0.45, y: 0, z: 0, color: '#ef4444', radius: 0.38 },
      { symbol: 'O', x: 0.45, y: 0, z: 0, color: '#ef4444', radius: 0.38 },
    ],
    bonds: [{ from: 0, to: 1, type: 'double' }],
  },
  {
    id: 'ch4',
    formula: 'CH₄',
    name: 'Khí Methane (Khí sinh học Biogas)',
    description: 'Khí đốt thiên nhiên, 1 nguyên tử Cacbon ở tâm tứ diện đều liên kết với 4 nguyên tử Hiđrô xung quanh.',
    atoms: [
      { symbol: 'C', x: 0, y: 0, z: 0, color: '#334155', radius: 0.38 },
      { symbol: 'H', x: 0, y: 0.75, z: 0, color: '#f8fafc', radius: 0.22 },
      { symbol: 'H', x: 0.7, y: -0.25, z: 0, color: '#f8fafc', radius: 0.22 },
      { symbol: 'H', x: -0.35, y: -0.25, z: 0.6, color: '#f8fafc', radius: 0.22 },
      { symbol: 'H', x: -0.35, y: -0.25, z: -0.6, color: '#f8fafc', radius: 0.22 },
    ],
    bonds: [
      { from: 0, to: 1, type: 'single' },
      { from: 0, to: 2, type: 'single' },
      { from: 0, to: 3, type: 'single' },
      { from: 0, to: 4, type: 'single' },
    ],
  },
  {
    id: 'nacl',
    formula: 'NaCl',
    name: 'Muối ăn (Natri Clorua)',
    description: 'Hợp chất ion gồm cation Na⁺ mang điện dương và anion Cl⁻ mang điện âm hút nhau mạnh mẽ.',
    atoms: [
      { symbol: 'Na⁺', x: -0.6, y: 0, z: 0, color: '#a855f7', radius: 0.32 },
      { symbol: 'Cl⁻', x: 0.6, y: 0, z: 0, color: '#22c55e', radius: 0.45 },
    ],
    bonds: [{ from: 0, to: 1, type: 'single' }],
  },
];

export const FORMULAS: Record<SubjectId, FormulaData[]> = {
  khtn_bio: [
    {
      title: 'Độ phóng đại của kính hiển vi quang học',
      latex: 'M = M_{thị\\,kính} \\times M_{vật\\,kính}',
      description: 'Để quan sát tế bào nhỏ bé cỡ micromét (µm), học sinh dùng kính hiển vi quang học. Độ phóng đại tổng cộng bằng tích độ phóng đại của thị kính nhân với vật kính.',
      variables: [
        { symbol: 'M1', name: 'Độ phóng đại thị kính (mắt ngắm)', unit: 'lần (x)', defaultVal: 10, min: 5, max: 20, step: 5 },
        { symbol: 'M2', name: 'Độ phóng đại vật kính (đầu ống kính)', unit: 'lần (x)', defaultVal: 40, min: 4, max: 100, step: 4 },
      ],
      calculate: (vals) => {
        const res = (vals.M1 || 10) * (vals.M2 || 40);
        return {
          result: res,
          unit: 'lần (x)',
          steps: [
            `Độ phóng đại thị kính: ${vals.M1 || 10}x`,
            `Độ phóng đại vật kính: ${vals.M2 || 40}x`,
            `M = ${vals.M1 || 10} × ${vals.M2 || 40} = ${res}x (vật được phóng to gấp ${res} lần kích thước thật)`,
          ],
        };
      },
    },
  ],
  khtn_physics: [
    {
      title: 'Công thức mối liên hệ Trọng lượng & Khối lượng',
      latex: 'P = 10 \\cdot m',
      description: 'Trọng lượng P là độ lớn của lực hút Trái Đất tác dụng lên vật. Khối lượng m là lượng chất chứa trong vật (ở điều kiện bề mặt Trái Đất: 1 kg tương đương trọng lượng 10 N).',
      variables: [
        { symbol: 'm', name: 'Khối lượng vật (m)', unit: 'kg', defaultVal: 0.5, min: 0.05, max: 5.0, step: 0.05 },
        { symbol: 'g', name: 'Gia tốc trọng trường (g)', unit: 'N/kg', defaultVal: 10, min: 1.6, max: 24.8, step: 0.1 },
      ],
      calculate: (vals) => {
        const m = vals.m || 0.5;
        const g = vals.g || 10;
        const P = Math.round(m * g * 100) / 100;
        return {
          result: P,
          unit: 'N (Newton)',
          steps: [
            `Khối lượng m = ${m} kg`,
            `Gia tốc trọng trường g = ${g} N/kg`,
            `Trọng lượng: P = m × g = ${m} × ${g} = ${P} N`,
          ],
        };
      },
    },
    {
      title: 'Độ biến dạng (độ dãn) của lò xo (Định luật Hooke)',
      latex: '\\Delta l = l - l_0 = \\frac{P}{k}',
      description: 'Độ dãn của lò xo treo thẳng đứng tỉ lệ thuận với khối lượng quả nặng (hay trọng lượng P) treo vào nó.',
      variables: [
        { symbol: 'l0', name: 'Chiều dài tự nhiên ban đầu (l₀)', unit: 'cm', defaultVal: 12, min: 5, max: 30, step: 1 },
        { symbol: 'P', name: 'Trọng lượng quả nặng (P)', unit: 'N', defaultVal: 2, min: 0.5, max: 10, step: 0.5 },
        { symbol: 'k', name: 'Độ cứng của lò xo (k)', unit: 'N/m', defaultVal: 20, min: 10, max: 100, step: 5 },
      ],
      calculate: (vals) => {
        const l0 = vals.l0 || 12;
        const P = vals.P || 2;
        const k = vals.k || 20;
        const deltaL_m = P / k;
        const deltaL_cm = Math.round(deltaL_m * 100 * 10) / 10;
        const totalL = Math.round((l0 + deltaL_cm) * 10) / 10;
        return {
          result: deltaL_cm,
          unit: 'cm',
          steps: [
            `Độ dãn: Δl = P / k = ${P} / ${k} = ${(deltaL_m).toFixed(3)} m = ${deltaL_cm} cm`,
            `Chiều dài của lò xo khi dãn: l = l₀ + Δl = ${l0} + ${deltaL_cm} = ${totalL} cm`,
          ],
        };
      },
    },
    {
      title: 'Điều kiện cân bằng của Đòn bẩy (Lever Balance)',
      latex: 'F_1 \\cdot d_1 = F_2 \\cdot d_2',
      description: 'Khi đòn bẩy cân bằng nằm ngang, tích của lực nhân với cánh tay đòn ở hai phía của điểm tựa phải bằng nhau.',
      variables: [
        { symbol: 'F1', name: 'Lực bên trái (F₁)', unit: 'N', defaultVal: 4, min: 1, max: 20, step: 1 },
        { symbol: 'd1', name: 'Khoảng cách điểm tựa bên trái (d₁)', unit: 'cm', defaultVal: 15, min: 5, max: 50, step: 5 },
        { symbol: 'd2', name: 'Khoảng cách điểm tựa bên phải (d₂)', unit: 'cm', defaultVal: 30, min: 5, max: 50, step: 5 },
      ],
      calculate: (vals) => {
        const f1 = vals.F1 || 4;
        const d1 = vals.d1 || 15;
        const d2 = vals.d2 || 30;
        const f2 = Math.round(((f1 * d1) / d2) * 100) / 100;
        return {
          result: f2,
          unit: 'N',
          steps: [
            `Momen lực bên trái: M₁ = F₁ × d₁ = ${f1} × ${d1} = ${f1 * d1} N·cm`,
            `Để cân bằng nằm ngang: F₂ × d₂ = F₁ × d₁`,
            `Lực cần tác dụng bên phải: F₂ = (F₁ × d₁) / d₂ = ${f1 * d1} / ${d2} = ${f2} N`,
            d2 > d1 ? `Cánh tay đòn dài gấp ${(d2 / d1).toFixed(1)} lần nên lực F₂ nhỏ hơn gấp ${(d2 / d1).toFixed(1)} lần (Được lợi về lực!)` : 'Cánh tay đòn ngắn hơn nên lực cần tác dụng lớn hơn.',
          ],
        };
      },
    },
    {
      title: 'Công thức tính Khối lượng riêng của chất',
      latex: 'D = \\frac{m}{V}',
      description: 'Khối lượng riêng của một chất là khối lượng của một đơn vị thể tích chất đó. Thường dùng đơn vị kg/m³ hoặc g/cm³.',
      variables: [
        { symbol: 'm', name: 'Khối lượng (m)', unit: 'g', defaultVal: 78, min: 10, max: 500, step: 1 },
        { symbol: 'V', name: 'Thể tích (V)', unit: 'cm³', defaultVal: 10, min: 1, max: 100, step: 1 },
      ],
      calculate: (vals) => {
        const m = vals.m || 78;
        const V = vals.V || 10;
        const D = Math.round((m / V) * 100) / 100;
        return {
          result: D,
          unit: 'g/cm³ (hay ' + D * 1000 + ' kg/m³)',
          steps: [
            `Khối lượng: m = ${m} g`,
            `Thể tích: V = ${V} cm³`,
            `Khối lượng riêng: D = m / V = ${m} / ${V} = ${D} g/cm³`,
            `Quy đổi sang hệ SI: D = ${D * 1000} kg/m³`,
          ],
        };
      },
    },
  ],
  khtn_chem: [
    {
      title: 'Mối liên hệ các hạt trong nguyên tử',
      latex: 'Số\\,khối\\,A = Z + N = p + n',
      description: 'Nguyên tử trung hòa về điện nên: Số electron (e) = Số proton (p) = Số hiệu nguyên tử (Z). Khối lượng nguyên tử tập trung hầu hết ở hạt nhân: A = p + n (đơn vị amu).',
      variables: [
        { symbol: 'Z', name: 'Số hạt Proton (p) = Số Electron (e)', unit: 'hạt', defaultVal: 6, min: 1, max: 20, step: 1 },
        { symbol: 'N', name: 'Số hạt Neutron (n)', unit: 'hạt', defaultVal: 6, min: 0, max: 25, step: 1 },
      ],
      calculate: (vals) => {
        const p = Math.round(vals.Z || 6);
        const n = Math.round(vals.N || 6);
        const a = p + n;
        return {
          result: a,
          unit: 'amu',
          steps: [
            `Số hạt mang điện dương (Proton): p = ${p}`,
            `Số hạt mang điện âm (Electron): e = ${p} (trung hòa điện)`,
            `Số hạt không mang điện (Neutron): n = ${n}`,
            `Tổng số hạt trong hạt nhân (Số khối A): A = p + n = ${p} + ${n} = ${a} amu`,
          ],
        };
      },
    },
  ],
  math: [
    {
      title: 'Hình hộp chữ nhật: Diện tích xung quanh, Toàn phần & Thể tích',
      latex: 'S_{xq} = 2(a+b)h, \\quad S_{tp} = S_{xq} + 2ab, \\quad V = a \\cdot b \\cdot h',
      description: 'Hình hộp chữ nhật có 6 mặt là hình chữ nhật, 8 đỉnh và 12 cạnh. Chiều dài a, chiều rộng b, chiều cao h.',
      variables: [
        { symbol: 'a', name: 'Chiều dài đáy (a)', unit: 'cm', defaultVal: 6, min: 2, max: 20, step: 1 },
        { symbol: 'b', name: 'Chiều rộng đáy (b)', unit: 'cm', defaultVal: 4, min: 2, max: 20, step: 1 },
        { symbol: 'h', name: 'Chiều cao (h)', unit: 'cm', defaultVal: 5, min: 2, max: 20, step: 1 },
      ],
      calculate: (vals) => {
        const a = vals.a || 6;
        const b = vals.b || 4;
        const h = vals.h || 5;
        const C_day = 2 * (a + b);
        const S_day = a * b;
        const S_xq = C_day * h;
        const S_tp = S_xq + 2 * S_day;
        const V = a * b * h;
        return {
          result: V,
          unit: 'cm³',
          steps: [
            `Chu vi đáy: C_đáy = 2 × (${a} + ${b}) = ${C_day} cm`,
            `Diện tích đáy: S_đáy = ${a} × ${b} = ${S_day} cm²`,
            `Diện tích xung quanh: S_xq = 2 × (${a} + ${b}) × ${h} = ${S_xq} cm²`,
            `Diện tích toàn phần: S_tp = ${S_xq} + 2 × ${S_day} = ${S_tp} cm²`,
            `Thể tích hình hộp: V = ${a} × ${b} × ${h} = ${V} cm³`,
          ],
        };
      },
    },
    {
      title: 'Hình lăng trụ đứng tam giác: Diện tích xung quanh & Thể tích',
      latex: 'S_{xq} = C_{đáy} \\cdot h = (a+b+c) \\cdot h, \\quad V = S_{đáy} \\cdot h',
      description: 'Hình lăng trụ đứng tam giác có 2 đáy là hai tam giác bằng nhau và song song, 3 mặt bên là các hình chữ nhật.',
      variables: [
        { symbol: 'a', name: 'Cạnh đáy 1 (a)', unit: 'cm', defaultVal: 3, min: 2, max: 15, step: 1 },
        { symbol: 'b', name: 'Cạnh đáy 2 (b)', unit: 'cm', defaultVal: 4, min: 2, max: 15, step: 1 },
        { symbol: 'c', name: 'Cạnh đáy 3 (c)', unit: 'cm', defaultVal: 5, min: 2, max: 15, step: 1 },
        { symbol: 'h', name: 'Chiều cao lăng trụ (h)', unit: 'cm', defaultVal: 8, min: 2, max: 20, step: 1 },
      ],
      calculate: (vals) => {
        const a = vals.a || 3;
        const b = vals.b || 4;
        const c = vals.c || 5;
        const h = vals.h || 8;
        const C_day = a + b + c;
        const S_xq = C_day * h;
        // Heron formula for triangle area
        const p = C_day / 2;
        const S_day = Math.sqrt(Math.max(0, p * (p - a) * (p - b) * (p - c)));
        const S_day_round = Math.round(S_day * 10) / 10;
        const V = Math.round(S_day * h * 10) / 10;
        return {
          result: V,
          unit: 'cm³',
          steps: [
            `Chu vi đáy tam giác: C_đáy = ${a} + ${b} + ${c} = ${C_day} cm`,
            `Diện tích xung quanh: S_xq = C_đáy × h = ${C_day} × ${h} = ${S_xq} cm²`,
            `Diện tích đáy tam giác: S_đáy ≈ ${S_day_round} cm²`,
            `Thể tích hình lăng trụ: V = S_đáy × h ≈ ${S_day_round} × ${h} = ${V} cm³`,
          ],
        };
      },
    },
  ],
};

export const QUIZZES: QuizQuestion[] = [
  // Sinh học
  {
    id: 'bio_1',
    subjectId: 'khtn_bio',
    question: 'Bào quan nào chỉ có ở tế bào thực vật mà KHÔNG có ở tế bào động vật?',
    options: ['Nhân tế bào và ti thể', 'Lục lạp và thành tế bào xenlulôzơ', 'Màng sinh chất và chất tế bào', 'Ti thể và không bào nhỏ'],
    correctIndex: 1,
    explanation: 'Thành tế bào (xenlulôzơ) giúp cây cứng cáp và lục lạp chứa chất diệp lục giúp quang hợp là hai đặc trưng cơ bản chỉ có ở tế bào thực vật!',
  },
  {
    id: 'bio_2',
    subjectId: 'khtn_bio',
    question: 'Khi sử dụng kính hiển vi quang học có thị kính 10x và vật kính 40x thì ảnh của tế bào được phóng đại bao nhiêu lần?',
    options: ['50 lần', '400 lần', '40 lần', '4000 lần'],
    correctIndex: 1,
    explanation: 'Độ phóng đại tổng cộng M = M(thị kính) × M(vật kính) = 10 × 40 = 400 lần.',
  },
  {
    id: 'bio_3',
    subjectId: 'khtn_bio',
    question: 'Bào quan nào được ví như "nhà máy sản xuất năng lượng" cho tế bào hoạt động?',
    options: ['Nhân tế bào', 'Không bào', 'Ti thể (Mitochondria)', 'Bộ máy Golgi'],
    correctIndex: 2,
    explanation: 'Ti thể thực hiện hô hấp tế bào, phân giải chất hữu cơ giải phóng năng lượng dưới dạng ATP cung cấp cho mọi hoạt động sống.',
  },
  {
    id: 'bio_4',
    subjectId: 'khtn_bio',
    question: 'Khi làm tiêu bản quan sát tế bào biểu bì vảy hành tây dưới kính hiển vi, ta thường nhỏ dung dịch gì để nhuộm màu nhân tế bào?',
    options: ['Dung dịch muối ăn NaCl', 'Dung dịch cồn 90 độ', 'Dung dịch I-ốt hoặc xanh metylen', 'Nước cất'],
    correctIndex: 2,
    explanation: 'Dung dịch I-ốt (hoặc xanh metylen) giúp bắt màu nhân tế bào sẫm hơn, nổi bật rõ ràng dưới kính hiển vi quang học.',
  },

  // Vật lý
  {
    id: 'phy_1',
    subjectId: 'khtn_physics',
    question: 'Một học sinh treo một quả cân có khối lượng 300g lên lực kế ở Trái Đất. Số chỉ của lực kế là bao nhiêu?',
    options: ['300 N', '3 N', '30 N', '0.3 N'],
    correctIndex: 1,
    explanation: 'Đổi m = 300 g = 0.3 kg. Trọng lượng P = 10 × m = 10 × 0.3 = 3 N.',
  },
  {
    id: 'phy_2',
    subjectId: 'khtn_physics',
    question: 'Khi treo quả nặng 100g lò xo dãn thêm 2cm. Nếu treo quả nặng 300g thì lò xo dãn thêm bao nhiêu cm?',
    options: ['4 cm', '6 cm', '8 cm', '10 cm'],
    correctIndex: 1,
    explanation: 'Độ dãn của lò xo tỉ lệ thuận với khối lượng quả treo: Khối lượng tăng gấp 3 (100g -> 300g) nên độ dãn cũng tăng gấp 3: 2 × 3 = 6 cm.',
  },
  {
    id: 'phy_3',
    subjectId: 'khtn_physics',
    question: 'Dùng một đòn bẩy để bẩy một tảng đá nặng. Để được lợi về lực (dùng lực nhỏ hơn), ta cần làm gì?',
    options: ['Đặt điểm tựa gần tảng đá hơn và tay cầm xa điểm tựa hơn', 'Đặt điểm tựa thật xa tảng đá', 'Rút ngắn cánh tay đòn của tay đẩy', 'Không thể giảm lực bằng đòn bẩy'],
    correctIndex: 0,
    explanation: 'Theo quy tắc đòn bẩy F₁·d₁ = F₂·d₂, khi cánh tay đòn phía tác dụng lực d₂ lớn hơn nhiều so với d₁ phía vật nâng, thì lực cần tác dụng F₂ sẽ nhỏ hơn rất nhiều!',
  },
  {
    id: 'phy_4',
    subjectId: 'khtn_physics',
    question: 'Một thỏi nhôm có thể tích 20 cm³ và khối lượng 54 g. Khối lượng riêng của nhôm là:',
    options: ['2.7 g/cm³', '1080 g/cm³', '0.37 g/cm³', '74 g/cm³'],
    correctIndex: 0,
    explanation: 'Khối lượng riêng D = m / V = 54 / 20 = 2.7 g/cm³ (tương đương 2700 kg/m³).',
  },

  // Hóa học
  {
    id: 'chem_1',
    subjectId: 'khtn_chem',
    question: 'Hạt nào mang điện tích DƯƠNG trong nguyên tử?',
    options: ['Electron (e)', 'Proton (p)', 'Neutron (n)', 'Phân tử'],
    correctIndex: 1,
    explanation: 'Proton (p) mang điện tích dương (+), Electron (e) mang điện tích âm (-), còn Neutron (n) không mang điện.',
  },
  {
    id: 'chem_2',
    subjectId: 'khtn_chem',
    question: 'Công thức hóa học của phân tử khí Cacbonic (Carbon dioxide) là gì?',
    options: ['CO', 'CO₂', 'C₂O', 'CH₄'],
    correctIndex: 1,
    explanation: 'Phân tử Carbon dioxide gồm 1 nguyên tử Cacbon liên kết với 2 nguyên tử Oxy: CO₂.',
  },
  {
    id: 'chem_3',
    subjectId: 'khtn_chem',
    question: 'Ở thể nào các phân tử chuyển động hỗn loạn, tự do nhất và chiếm toàn bộ thể tích bình chứa?',
    options: ['Thể rắn', 'Thể lỏng', 'Thể khí', 'Cả thể rắn và thể lỏng'],
    correctIndex: 2,
    explanation: 'Ở thể khí, khoảng cách giữa các phân tử rất lớn, lực liên kết rất yếu nên chúng chuyển động nhanh, hỗn loạn về mọi hướng.',
  },

  // Toán học
  {
    id: 'math_1',
    subjectId: 'math',
    question: 'Một hình hộp chữ nhật có chiều dài 5cm, rộng 3cm, cao 4cm. Thể tích của hình hộp này là:',
    options: ['60 cm³', '47 cm³', '94 cm³', '24 cm³'],
    correctIndex: 0,
    explanation: 'Thể tích V = dài × rộng × cao = 5 × 3 × 4 = 60 cm³.',
  },
  {
    id: 'math_2',
    subjectId: 'math',
    question: 'Hình lập phương có cạnh 4 cm. Diện tích toàn phần của hình lập phương là:',
    options: ['16 cm²', '64 cm²', '96 cm²', '32 cm²'],
    correctIndex: 2,
    explanation: 'Hình lập phương có 6 mặt vuông bằng nhau. Diện tích 1 mặt = 4 × 4 = 16 cm². Diện tích toàn phần = 16 × 6 = 96 cm².',
  },
  {
    id: 'math_3',
    subjectId: 'math',
    question: 'Hình lăng trụ đứng tam giác có bao nhiêu đỉnh, bao nhiêu cạnh và bao nhiêu mặt?',
    options: ['6 đỉnh, 9 cạnh, 5 mặt', '8 đỉnh, 12 cạnh, 6 mặt', '6 đỉnh, 8 cạnh, 5 mặt', '5 đỉnh, 8 cạnh, 6 mặt'],
    correctIndex: 0,
    explanation: 'Hình lăng trụ đứng tam giác có đúng 6 đỉnh (3 đỉnh trên, 3 đỉnh dưới), 9 cạnh (3 cạnh đáy trên, 3 cạnh đáy dưới, 3 cạnh bên) và 5 mặt (2 đáy tam giác + 3 mặt bên chữ nhật).',
  },
];
