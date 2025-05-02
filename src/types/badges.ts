
export interface Badge {
  id: string;
  name: string;
  description: string;
  category: 'streak' | 'time' | 'task' | 'goal';
  icon: string;
  condition?: string;
  earned?: boolean;
}
