import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import InsightCard from "@/components/InsightCard";
import { Brain } from "lucide-react";
import { getAIInsights } from "@/lib/api";

const AIInsights = () => {
  const insightsQuery = useQuery({
    queryKey: ["ai-insights"],
    queryFn: () => getAIInsights(6),
  });

  const aiInsights = insightsQuery.data ?? [];

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

      {insightsQuery.isLoading && (
        <div className="rounded-md border border-border/50 bg-muted/40 p-3 text-sm text-muted-foreground">
          Loading AI insights...
        </div>
      )}

      {insightsQuery.error && (
        <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
          {insightsQuery.error instanceof Error ? insightsQuery.error.message : "Failed to load AI insights"}
        </div>
      )}

      {aiInsights.length === 0 && (
        <div className="rounded-md border border-border/50 bg-muted/20 p-4 text-sm text-muted-foreground">
          No insights available yet. Upload a CSV to analyze real emissions data. Current analyzed emissions: 0.000 kg CO2.
        </div>
      )}

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
