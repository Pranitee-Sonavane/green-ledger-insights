import { motion } from "framer-motion";
import RecommendationCard from "@/components/RecommendationCard";
import ChartCard from "@/components/ChartCard";
import { recommendations } from "@/data/mockData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const comparisonData = recommendations.map((r) => ({
  name: r.currentVendor,
  current: r.currentEmissions,
  recommended: r.estimatedEmissions,
}));

const Recommendations = () => {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Sustainable Vendor Alternatives</h1>
        <p className="text-sm text-muted-foreground mt-1">Discover greener options to reduce your carbon footprint</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {recommendations.map((r, i) => (
          <motion.div key={r.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <RecommendationCard {...r} />
          </motion.div>
        ))}
      </div>

      <ChartCard title="Emissions Comparison: Current vs. Recommended">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "0.5rem",
                  fontSize: "0.875rem",
                }}
              />
              <Legend />
              <Bar dataKey="current" name="Current Emissions" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} animationDuration={800} />
              <Bar dataKey="recommended" name="Recommended" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} animationDuration={800} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>
    </div>
  );
};

export default Recommendations;
