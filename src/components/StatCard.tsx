import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: { value: number; positive: boolean };
}

const StatCard = ({ title, value, subtitle, icon: Icon, trend }: StatCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -2 }}
    >
      <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow duration-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              <p className="text-3xl font-bold text-foreground">{value}</p>
              {subtitle && (
                <p className="text-xs text-muted-foreground">{subtitle}</p>
              )}
              {trend && (
                <p className={`text-xs font-medium ${trend.positive ? "text-primary" : "text-destructive"}`}>
                  {trend.positive ? "↑" : "↓"} {Math.abs(trend.value)}% from last month
                </p>
              )}
            </div>
            <div className="rounded-xl bg-accent p-3">
              <Icon className="h-6 w-6 text-accent-foreground" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StatCard;
