
export enum CategoryId {
  ALL = 'all',
  HIFZ = 'hifz',
  REVIEW = 'review',
  MOTIVATION = 'motivation',
  MANAGEMENT = 'management',
  TAJWEED = 'tajweed'
}

export interface TeachingIdea {
  title: string;
  description: string;
  steps: string[];
  benefit: string;
  category: string;
}

export interface Category {
  id: CategoryId;
  label: string;
  description: string;
  color: string;
}
