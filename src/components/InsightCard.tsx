import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Lightbulb, AlertTriangle, TrendingDown } from "lucide-react";

interface InsightCardProps {
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  metric: string;
  metricLabel: string;
}

const impactConfig = {
  high: { icon: AlertTriangle, borderClass: "border-l-destructive" },
  medium: { icon: Lightbulb, borderClass: "border-l-primary" },
  low: { icon: TrendingDown, borderClass: "border-l-chart-4" },
};

const InsightCard = ({ title, description, impact, metric, metricLabel }: InsightCardProps) => {
  const config = impactConfig[impact];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ scale: 1.01 }}
    >
      <Card className={`border-l-4 ${config.borderClass} border-border/50 shadow-sm hover:shadow-md transition-all duration-300`}>
        <CardContent className="p-5">
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-accent p-2.5 mt-0.5">
              <Icon className="h-5 w-5 text-accent-foreground" />
            </div>
            <div className="flex-1 space-y-1">
              <h4 className="font-semibold text-foreground">{title}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-2xl font-bold text-foreground">{metric}</p>
              <p className="text-xs text-muted-foreground">{metricLabel}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default InsightCard;
