export type RecommendationStatus =
  | 'pending'
  | 'saved'
  | 'in-progress'
  | 'done'
  | 'dismissed';

export type EffortLevel = 'Low' | 'Medium' | 'High';
export type TimeSensitivity =
  | 'Immediate'
  | 'This Week'
  | 'This Month'
  | 'This Quarter';

export interface ImplementationStep {
  step: number;
  action: string;
  timeframe: string;
}

export interface Recommendation {
  id: string;
  title: string;
  rationale: string;
  whyItMatters: string;
  implementationSteps: ImplementationStep[];
  effortLevel: EffortLevel;
  impactScore: number;
  timeSensitivity: TimeSensitivity;
  status: RecommendationStatus;
  framework: string;
  triggerSignal?: string;
  createdAt: string;
}