export type SubjectId = 'khtn_bio' | 'khtn_physics' | 'khtn_chem' | 'math';

export interface SubjectInfo {
  id: SubjectId;
  name: string;
  badge: string;
  subTitle: string;
  topicTitle: string;
  iconName: string;
  color: string;
  gradient: string;
}

export interface OrganelleInfo {
  id: string;
  name: string;
  scientificName: string;
  role: string;
  foundIn: 'both' | 'plant' | 'animal';
  formulaOrFact: string;
  color: string;
}

export interface ChemicalElement {
  symbol: string;
  name: string;
  atomicNumber: number; // Z = p = e
  massNumber: number; // A = p + n
  protons: number;
  neutrons: number;
  electrons: number;
  shells: number[];
  stateAtRoomTemp: 'Khí' | 'Rắn' | 'Lỏng';
  description: string;
}

export interface MoleculeInfo {
  id: string;
  formula: string;
  name: string;
  description: string;
  atoms: { symbol: string; x: number; y: number; z: number; color: string; radius: number }[];
  bonds: { from: number; to: number; type: 'single' | 'double' }[];
}

export interface QuizQuestion {
  id: string;
  subjectId: SubjectId;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  formulaRef?: string;
}

export interface FormulaData {
  title: string;
  latex: string;
  description: string;
  variables: { symbol: string; name: string; unit: string; defaultVal: number; min: number; max: number; step: number }[];
  calculate: (values: Record<string, number>) => { result: number; unit: string; steps: string[] };
}
