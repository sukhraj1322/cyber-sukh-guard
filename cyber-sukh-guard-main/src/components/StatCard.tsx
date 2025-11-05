import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  gradient?: string;
  delay?: number;
}

export function StatCard({ title, value, icon: Icon, trend, trendUp, gradient = 'gradient-primary', delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
    >
      <Card className="glass-effect hover:glow-effect transition-all cursor-pointer group overflow-hidden relative">
        <div className={`absolute inset-0 ${gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />
        <CardContent className="p-6 relative z-10">
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              <p className="text-sm text-muted-foreground">{title}</p>
              <p className="text-3xl font-bold">{value}</p>
              {trend && (
                <p className={`text-sm flex items-center gap-1 ${trendUp ? 'text-success' : 'text-destructive'}`}>
                  <span>{trendUp ? '↑' : '↓'}</span>
                  {trend}
                </p>
              )}
            </div>
            <div className="bg-primary/10 p-3 rounded-lg group-hover:bg-primary/20 transition-colors">
              <Icon className="h-6 w-6 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
