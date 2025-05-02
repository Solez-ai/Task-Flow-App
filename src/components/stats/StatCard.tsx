
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor: string;
  bgColorClass: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  iconColor,
  bgColorClass
}) => {
  return (
    <div className={`flex flex-col items-center p-3 rounded-lg border ${bgColorClass}`}>
      <Badge variant="secondary" className="mb-1 bg-white/80 dark:bg-slate-700">
        <Icon className={`h-3 w-3 mr-1 ${iconColor}`} />
        {title}
      </Badge>
      <span className={`text-2xl font-bold ${iconColor.replace('text-', 'text-')}`}>{value}</span>
    </div>
  );
};

export default StatCard;
