export interface UploadedFile {
  id: string;
  name: string;
  type: string;
  content: string; // base64
  preview?: string; // for images
}

export type AnalysisStatus = 'idle' | 'analyzing' | 'complete' | 'error';
export type ViewType = 'analysis' | 'history' | 'settings';

export interface TimelineEvent {
  date: string;
  title: string;
  description: string;
  category: 'consultation' | 'lab' | 'procedure' | 'medication' | 'general';
}

export interface PatientAnalysisResult {
  summary: string;
  timeline: TimelineEvent[];
}