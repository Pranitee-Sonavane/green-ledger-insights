import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const ChartCard = ({ title, children, className }: ChartCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow duration-300">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold text-foreground">{title}</CardTitle>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </motion.div>
  );
};

export default ChartCard;
