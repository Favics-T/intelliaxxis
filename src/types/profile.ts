export type BusinessStage =
  | 'Idea Stage'
  | 'Early Startup'
  | 'Growing Startup'
  | 'Established Business'
  | 'Scaling Company';

export type RevenueRange =
  | 'Pre-revenue'
  | 'Under $50K'
  | '$50K - $200K'
  | '$200K - $500K'
  | '$500K - $1M'
  | '$1M - $5M'
  | '$5M - $20M'
  | '$20M+';

export type TeamSize =
  | 'Solo founder'
  | '2 - 5'
  | '6 - 20'
  | '21 - 50'
  | '51 - 200'
  | '200+';

export type TargetMarket =
  | 'Local'
  | 'National'
  | 'Africa'
  | 'Europe'
  | 'North America'
  | 'Asia'
  | 'Global';

export type BusinessGoal =
  | 'Increase revenue'
  | 'Expand customer base'
  | 'Enter new markets'
  | 'Improve marketing'
  | 'Reduce operational costs'
  | 'Launch new products'
  | 'Improve competitive positioning'
  | 'Raise funding'
  | 'Improve operations'
  | 'Build brand awareness';

export interface BusinessProfile {
  // Step 1 — Basic info
  businessName: string;
  founderName: string;
  industry: string;
  subSector: string;
  businessStage: BusinessStage;
  revenueRange: RevenueRange;
  teamSize: TeamSize;

  // Step 2 — Goals
  goals: BusinessGoal[];
  biggestChallenge: string;

  // Step 3 — Market
  targetMarket: TargetMarket;
  geographies: string[];
  customerDescription: string;

  // Step 4 — Competitors
  competitors: string[];
  uniqueAdvantage: string;

  // Step 5 — Description
  businessDescription: string;
  productsServices: string;

  // Meta
  completedAt: string | null;
  isComplete: boolean;
}

export const EMPTY_PROFILE: BusinessProfile = {
  businessName: '',
  founderName: '',
  industry: '',
  subSector: '',
  businessStage: 'Early Startup',
  revenueRange: 'Pre-revenue',
  teamSize: 'Solo founder',
  goals: [],
  biggestChallenge: '',
  targetMarket: 'Local',
  geographies: [],
  customerDescription: '',
  competitors: [],
  uniqueAdvantage: '',
  businessDescription: '',
  productsServices: '',
  completedAt: null,
  isComplete: false,
};

export const INDUSTRIES = [
  'Technology',
  'Fintech',
  'Fashion & Apparel',
  'E-commerce',
  'Food & Beverage',
  'Healthcare',
  'Education',
  'Logistics & Supply Chain',
  'Manufacturing',
  'Real Estate',
  'Media & Entertainment',
  'Agriculture',
  'Energy',
  'Professional Services',
  'Retail',
  'Other',
] as const;

export const GOAL_OPTIONS: BusinessGoal[] = [
  'Increase revenue',
  'Expand customer base',
  'Enter new markets',
  'Improve marketing',
  'Reduce operational costs',
  'Launch new products',
  'Improve competitive positioning',
  'Raise funding',
  'Improve operations',
  'Build brand awareness',
];