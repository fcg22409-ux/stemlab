export type SubjectId = 'khtn_bio' | 'khtn_physics' | 'khtn_chem' | 'math' | 'geography';

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
  shells: number[]; // e.g. [2, 4] for Carbon
  stateAtRoomTemp: 'Khí' | 'Rắn' | 'Lỏng';
  description: string;
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
