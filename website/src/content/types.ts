export interface Reference {
  id: string;
  author: string;
  year: string;
  entry?: string;
  date?: string;
  title?: string;
  description?: string;
  retrievedDate?: string;
  url?: string;
}

export interface TableData {
  id: string;
  caption: string;
  columns: readonly string[];
  rows: readonly (readonly string[])[];
  wide?: boolean;
  scrollHint?: string;
  pending?: string;
}

export interface FigureData {
  id: string;
  caption: string;
  image?: { src: string; alt: string };
  source?: Reference;
  pending?: string;
}

export interface DecisionMatrixData {
  id: string;
  caption: string;
  options: readonly string[];
  criteria: readonly {
    name: string;
    weight: number;
    scores: readonly number[];
  }[];
  explanation: string;
  pending?: string;
}

export interface Topic {
  id: string;
  title: string;
  pending?: string;
  paragraphs?: readonly { text: string; citations?: readonly Reference[] }[];
  figure?: FigureData;
  table?: TableData;
  matrix?: DecisionMatrixData;
  bibliography?: readonly Reference[];
  documents?: readonly { title: string; url: string }[];
}

export interface ReportSection {
  title: string;
  label: string;
  summary: string;
  topics: readonly Topic[];
}
