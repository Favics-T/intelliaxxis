export type ImpactLevel = 'Critical' | 'High' | 'Medium' | 'Low';
export type TrendTrajectory = 'Emerging' | 'Accelerating' | 'Plateauing' | 'Declining';
export type SignalCategory =
  | 'Market Trend'
  | 'Competitor Move'
  | 'Regulation'
  | 'Technology'
  | 'Consumer Behavior'
  | 'Economic Signal'
  | 'Opportunity';

export interface Signal {
  id: string;
  headline: string;
  summary: string;
  fullAnalysis: string;
  whyItMatters: string;
  strategicImplication: string;
  category: SignalCategory;
  impactLevel: ImpactLevel;
  trajectory: TrendTrajectory;
  recommendedActions: string[];
  industry: string;
  createdAt: string;
  saved: boolean;
  dismissed: boolean;
}

export interface IntelligenceReport {
  signals: Signal[];
  generatedAt: string;
  industry: string;
  summary: string;
}