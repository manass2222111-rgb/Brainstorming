
import React from 'react';

export enum CategoryId {
  ALL = 'all',
  HIFZ = 'hifz',
  REVIEW = 'review',
  MOTIVATION = 'motivation',
  MANAGEMENT = 'management',
  TAJWEED = 'tajweed'
}

export enum StudentLevel {
  CHILDREN = 'children',
  ADULTS = 'adults'
}

export interface TeachingIdea {
  title: string;
  description: string;
  steps: string[];
  benefit: string;
  category: string;
  estimatedTime: string; // الزمن التقريبي للتنفيذ
}

export interface Category {
  id: CategoryId;
  label: string;
  icon: React.ReactNode;
  color: string;
}
