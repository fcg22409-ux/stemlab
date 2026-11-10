import { SubjectInfo, OrganelleInfo, ChemicalElement, QuizQuestion, FormulaData, SubjectId } from '../types';

export const SUBJECTS: SubjectInfo[] = [
  {
    id: 'khtn_bio',
    name: 'Sinh Học 6',
    badge: 'KHTN - Sinh Học',
    subTitle: 'Bài 17-20: Tế bào - Đơn vị cơ sở của sự sống',
    topicTitle: 'Mô hình Cấu tạo Tế bào Thực vật & Động vật',
    iconName: 'Dna',
    color: '#10b981',
    gradient: 'from-emerald-500 to-teal-700',
  },
  {
    id: 'khtn_physics',
    name: 'Vật Lý 6',
    badge: 'KHTN - Vật Lý',
    subTitle: 'Bài 40-44: Lực, Trọng lực & Độ dãn của lò xo',
    topicTitle: 'Thí nghiệm Đo Lực Kế & Định luật Hooke',
    iconName: 'Weight',
    color: '#3b82f6',
    gradient: 'from-blue-500 to-indigo-700',
  },
  {
    id: 'khtn_chem',
    name: 'Hóa Học 6',
    badge: 'KHTN - Hóa Học',
    subTitle: 'Bài 2-10: Cấu tạo nguyên tử & Các thể của chất',
    topicTitle: 'Mô hình Nguyên tử Bohr & Động học Thể chất',
    iconName: 'Atom',
    color: '#8b5cf6',
    gradient: 'from-purple-500 to-violet-700',
  },
  {
    id: 'math',
    name: 'Toán Học 6',
    badge: 'Toán Học Trực Quan',
    subTitle: 'Hình học trực quan: Hình hộp chữ nhật & Hình lập phương',
    topicTitle: 'Mô hình Khối hộp 3D & Trải hình (Unfolding Net)',
    iconName: 'Box',
    color: '#f59e0b',
    gradient: 'from-amber-500 to-orange-700',
  },
  {
    id: 'geography',
    name: 'Địa Lý 6',
    badge: 'Lịch Sử & Địa Lý 6',
    subTitle: 'Bài 1-7: Trái Đất trong Hệ Mặt Trời & Kinh Vĩ Tuyến',
    topicTitle: 'Mô hình Trái Đất, Lưới Kinh Vĩ Tuyến & 4 Mùa',
    iconName: 'Globe',
    color: '#06b6d4',
    gradient: 'from-cyan-500 to-blue-700',
  },
];

export const ORGANELLES: OrganelleInfo[] = [
  {
    id: 'nucleus',
    name: 'Nhân tế bào (Nucleus)',
    scientificName: 'Nucleus',
    role: 'Trung tâm điều khiển mọi hoạt động sống của tế bào, chứa vật chất di truyền (ADN / Nhiễm sắc thể).',
    foundIn: 'both',
    formulaOrFact: 'Kích thước khoảng 5 - 10 µm. Có màng nhân kép bao bọc và nhân con bên trong.',
    color: '#ec4899',
  },
  {
    id: 'cell_wall',
    name: 'Thành tế bào (Cell Wall)',
    scientificName: 'Murus cellularis',
    role: 'Bảo vệ tế bào, tạo bộ khung vững chắc giúp thực vật giữ nguyên hình dạng cố định.',
    foundIn: 'plant',
    formulaOrFact: 'Được cấu tạo chủ yếu từ sợi xenlulôzơ (cellulose). Chỉ có ở tế bào thực vật, nấm!',
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
    formulaOrFact: 'Chứa chất diệp lục (chlorophyll). Phương trình: CO₂ + H₂O + Ánh sáng → C₆H₁₂O₆ + O₂.',
    color: '#22c55e',
  },
  {
    id: 'mitochondria',
    name: 'Ti thể (Mitochondria)',
    scientificName: 'Mitochondrion',
    role: '"Nhà máy năng lượng" của tế bào, thực hiện hô hấp tế bào để phân giải đường và tạo ra năng lượng ATP.',
    foundIn: 'both',
    formulaOrFact: 'Phương trình hô hấp: C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + Năng lượng (ATP).',
    color: '#f97316',
  },
  {
    id: 'vacuole',
    name: 'Không bào trung tâm (Vacuole)',
    scientificName: 'Vacuola',
    role: 'Dự trữ nước, khoáng chất, chất dinh dưỡng, sắc tố hoa quả và điều hòa áp suất thẩm thấu cho tế bào thực vật.',
    foundIn: 'plant',
    formulaOrFact: 'Ở thực vật trưởng thành, không bào trung tâm có thể chiếm tới 90% thể tích tế bào!',
    color: '#06b6d4',
  },
  {
    id: 'cytoplasm',
    name: 'Chất tế bào (Cytoplasm)',
    scientificName: 'Cytoplasma',
    role: 'Khối dịch keo chứa dịch bào và các bào quan, là nơi diễn ra hầu hết các phản ứng hóa sinh của tế bào.',
    foundIn: 'both',
    formulaOrFact: 'Gồm 80-90% là nước cùng protein, muối khoáng hòa tan.',
    color: '#a78bfa',
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
  ],
  geography: [
    {
      title: 'Tính giờ theo Kinh độ & Múi giờ Trái Đất',
      latex: '1\\text{ vòng} = 360^\\circ = 24\\text{ giờ} \\Rightarrow 1\\text{ giờ} = 15^\\circ\\text{ Kinh độ}',
      description: 'Trái Đất tự quay từ Tây sang Đông quanh một trục nghiêng 23°27\'. Người ta chia bề mặt Trái Đất làm 24 khu vực giờ (múi giờ), mỗi múi rộng 15 kinh độ. Việt Nam nằm ở múi giờ thứ 7 (GMT+7).',
      variables: [
        { symbol: 'gmt0', name: 'Giờ tại Đài thiên văn Greenwich (GMT 0)', unit: 'giờ', defaultVal: 8, min: 0, max: 23, step: 1 },
        { symbol: 'zone', name: 'Múi giờ của địa phương (Việt Nam = +7)', unit: 'GMT', defaultVal: 7, min: -12, max: 12, step: 1 },
      ],
      calculate: (vals) => {
        const g0 = vals.gmt0 ?? 8;
        const zone = vals.zone ?? 7;
        const localHour = (g0 + zone + 24) % 24;
        return {
          result: localHour,
          unit: 'giờ',
          steps: [
            `Giờ gốc GMT 0: ${g0} giờ 00`,
            `Chênh lệch múi giờ: ${zone >= 0 ? '+' + zone : zone} giờ`,
            `Giờ địa phương: T = (${g0} + ${zone}) = ${localHour} giờ 00`,
            `Kinh độ trung tâm múi giờ: ${zone * 15}° ${zone >= 0 ? 'Đông (E)' : 'Tây (W)'}`,
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
    explanation: 'Thành tế bào (xenlulôzơ) giúp cây cứng cáp và lục lạp chứa chất diệp lục giúp quang hợp là hai đặc trưng chỉ có ở tế bào thực vật!',
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
    question: 'Bộ phận nào được coi là "bộ não" điều khiển mọi hoạt động sống của tế bào?',
    options: ['Không bào', 'Chất tế bào', 'Nhân tế bào', 'Lục lạp'],
    correctIndex: 2,
    explanation: 'Nhân tế bào chứa vật chất di truyền (ADN) và điều khiển mọi hoạt động trao đổi chất, phân chia của tế bào.',
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
    question: 'Lực nào dưới đây là lực TIẾP XÚC?',
    options: ['Lực hút của Trái Đất lên quả táo rơi', 'Lực của tay đẩy cánh cửa mở ra', 'Lực hút giữa hai cực nam châm', 'Lực hút tĩnh điện'],
    correctIndex: 1,
    explanation: 'Tay đẩy cánh cửa là lực tiếp xúc vì có sự tiếp xúc trực tiếp giữa tay và bề mặt cánh cửa.',
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
    question: 'Ở thể nào các phân tử chuyển động hỗn loạn, tự do nhất và chiếm toàn bộ thể tích bình chứa?',
    options: ['Thể rắn', 'Thể lỏng', 'Thể khí', 'Cả thể rắn và thể lỏng'],
    correctIndex: 2,
    explanation: 'Ở thể khí, khoảng cách giữa các phân tử rất lớn, lực liên kết rất yếu nên chúng chuyển động nhanh, hỗn loạn về mọi hướng.',
  },
  {
    id: 'chem_3',
    subjectId: 'khtn_chem',
    question: 'Nguyên tử Cacbon (C) có 6 proton và 6 neutron. Số electron của nguyên tử Cacbon là bao nhiêu?',
    options: ['12', '0', '6', '18'],
    correctIndex: 2,
    explanation: 'Vì nguyên tử luôn trung hòa về điện nên Số electron (e) = Số proton (p) = 6.',
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
    question: 'Hình hộp chữ nhật có bao nhiêu đỉnh, cạnh và mặt?',
    options: ['6 đỉnh, 8 cạnh, 12 mặt', '8 đỉnh, 12 cạnh, 6 mặt', '12 đỉnh, 8 cạnh, 6 mặt', '8 đỉnh, 6 cạnh, 12 mặt'],
    correctIndex: 1,
    explanation: 'Hình hộp chữ nhật có đúng 8 đỉnh, 12 cạnh và 6 mặt chữ nhật.',
  },

  // Địa lý
  {
    id: 'geo_1',
    subjectId: 'geography',
    question: 'Trục Trái Đất nghiêng so với mặt phẳng quỹ đạo chuyển động quanh Mặt Trời một góc bằng bao nhiêu?',
    options: ['45°', '90°', '66°33\' (nghiêng 23°27\' so với đường thẳng đứng)', '0°'],
    correctIndex: 2,
    explanation: 'Trục Trái Đất nghiêng 66°33\' so với mặt phẳng quỹ đạo (tức nghiêng 23°27\' hay xấp xỉ 23.5° so với phương thẳng đứng).',
  },
  {
    id: 'geo_2',
    subjectId: 'geography',
    question: 'Khi ở Luân Đôn (Kinh tuyến 0°, GMT 0) là 6 giờ sáng thì ở Hà Nội (Việt Nam, múi giờ thứ 7, GMT+7) là mấy giờ?',
    options: ['1 giờ sáng', '13 giờ (1 giờ chiều)', '7 giờ sáng', '23 giờ đêm'],
    correctIndex: 1,
    explanation: 'Hà Nội nằm ở múi giờ GMT+7, nghĩa là chạy trước Luân Đôn 7 tiếng: 6 + 7 = 13 giờ (1 giờ chiều).',
  },
  {
    id: 'geo_3',
    subjectId: 'geography',
    question: 'Chuyển động tự quay quanh trục của Trái Đất sinh ra hệ quả chính nào?',
    options: ['Hiện tượng 4 mùa Xuân - Hạ - Thu - Đông', 'Hiện tượng Ngày và Đêm luân phiên', 'Mưa bão trên đại dương', 'Hiện tượng nhật thực'],
    correctIndex: 1,
    explanation: 'Do Trái Đất hình cầu và tự quay quanh trục từ Tây sang Đông nên mọi nơi trên Trái Đất đều lần lượt được Mặt Trời chiếu sáng rồi khuất bóng, sinh ra hiện tượng ngày và đêm luân phiên!',
  },
];
