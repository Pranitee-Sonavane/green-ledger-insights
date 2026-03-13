import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RecommendationCardProps {
  currentVendor: string;
  currentEmissions: number;
  recommendedVendor: string;
  estimatedEmissions: number;
  reductionPercent: number;
  category: string;
}

const RecommendationCard = ({
  currentVendor,
  currentEmissions,
  recommendedVendor,
  estimatedEmissions,
  reductionPercent,
  category,
}: RecommendationCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -3 }}
    >
      <Card className="border-border/50 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-primary to-chart-3" />
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-medium bg-accent text-accent-foreground px-2.5 py-1 rounded-full">
              {category}
            </span>
            <span className="text-xs font-bold text-primary bg-accent px-2.5 py-1 rounded-full">
              -{reductionPercent}% CO₂
            </span>
          </div>

          <div className="flex items-center gap-4 mb-5">
            <div className="flex-1 text-center p-3 rounded-lg bg-muted">
              <p className="text-xs text-muted-foreground mb-1">Current</p>
              <p className="font-semibold text-foreground">{currentVendor}</p>
              <p className="text-sm text-muted-foreground">{currentEmissions} kg CO₂</p>
            </div>

            <ArrowRight className="h-5 w-5 text-primary shrink-0" />

            <div className="flex-1 text-center p-3 rounded-lg bg-accent">
              <p className="text-xs text-accent-foreground mb-1">Recommended</p>
              <p className="font-semibold text-foreground">{recommendedVendor}</p>
              <p className="text-sm text-primary font-medium">{estimatedEmissions} kg CO₂</p>
            </div>
          </div>

          <Button className="w-full gap-2" size="sm">
            <Leaf className="h-4 w-4" />
            Switch to Greener Vendor
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default RecommendationCard;
