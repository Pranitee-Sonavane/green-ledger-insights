import { motion } from "framer-motion";
import InsightCard from "@/components/InsightCard";
import { aiInsights } from "@/data/mockData";
import { Brain } from "lucide-react";

const AIInsights = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-accent p-2.5">
          <Brain className="h-6 w-6 text-accent-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">AI Insights</h1>
          <p className="text-sm text-muted-foreground">Smart recommendations powered by AI analysis</p>
        </div>
      </div>

      <div className="space-y-4">
        {aiInsights.map((insight, i) => (
          <motion.div
            key={insight.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.12 }}
          >
            <InsightCard {...insight} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AIInsights;
