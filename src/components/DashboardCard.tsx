
import { ArrowDown, ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { DashboardCardProps } from '@/lib/types';

const DashboardCard = ({ title, value, icon, description, trend, className }: DashboardCardProps) => {
  const renderTrend = () => {
    if (trend === undefined) return null;
    
    const isPositive = trend >= 0;
    return (
      <div className={`flex items-center gap-1 text-xs ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
        <span>{Math.abs(trend)}%</span>
        <span className="text-muted-foreground">from last month</span>
      </div>
    );
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-muted-foreground text-sm font-medium mb-1">{title}</p>
            <h3 className="text-2xl font-bold">{value}</h3>
            {description && <p className="text-muted-foreground text-xs mt-1">{description}</p>}
            {renderTrend()}
          </div>
          <div className="bg-primary/10 p-3 rounded-full">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardCard;
