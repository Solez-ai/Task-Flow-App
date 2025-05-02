
export type BadgeCategory = 'streak' | 'time' | 'task' | 'goal';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: BadgeCategory;
  condition: string;
  earned: boolean;
  earnedAt?: string;
}

export interface BadgeProgress {
  id: string;
  progress: number;
  total: number;
}
