import { Cloud, Gauge, Building2, Factory } from "lucide-react";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  LineChart, Line, ResponsiveContainer,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import StatCard from "@/components/StatCard";
import ChartCard from "@/components/ChartCard";
import InsightCard from "@/components/InsightCard";
import { motion } from "framer-motion";
import { getAIInsights, getEmissionsByCategory, getMonthlyTrend, getOverview, getTopVendors } from "@/lib/api";

const COLORS = [
  "hsl(160, 84%, 29%)",
  "hsl(158, 64%, 18%)",
  "hsl(142, 71%, 45%)",
  "hsl(152, 60%, 52%)",
  "hsl(168, 76%, 36%)",
];

const Dashboard = () => {
  const overviewQuery = useQuery({ queryKey: ["dashboard-overview"], queryFn: getOverview });
  const categoryQuery = useQuery({ queryKey: ["dashboard-categories"], queryFn: getEmissionsByCategory });
  const topVendorsQuery = useQuery({ queryKey: ["dashboard-top-vendors"], queryFn: () => getTopVendors(10) });
  const monthlyTrendQuery = useQuery({ queryKey: ["dashboard-monthly-trend"], queryFn: getMonthlyTrend });
  const insightsQuery = useQuery({ queryKey: ["dashboard-insights"], queryFn: () => getAIInsights(3) });

  const isLoading = overviewQuery.isLoading || categoryQuery.isLoading || topVendorsQuery.isLoading || monthlyTrendQuery.isLoading;
  const error = overviewQuery.error || categoryQuery.error || topVendorsQuery.error || monthlyTrendQuery.error;

  const overview = overviewQuery.data;
  const emissionsByCategory = categoryQuery.data ?? [];
  const topVendorsByEmissions = topVendorsQuery.data ?? [];
  const monthlyEmissions = monthlyTrendQuery.data ?? [];

  const sustainabilityScore = Math.max(0, Math.min(100, Math.round(100 - (overview?.total_emissions_kg ?? 0) / 10)));

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Carbon Emissions Overview</h1>
        <p className="text-sm text-muted-foreground mt-1">Track and analyze your company's carbon footprint</p>
      </div>

      {isLoading && (
        <div className="rounded-md border border-border/50 bg-muted/40 p-3 text-sm text-muted-foreground">
          Loading dashboard data...
        </div>
      )}

      {error && (
        <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
          {error instanceof Error ? error.message : "Failed to load dashboard data"}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Carbon Emissions"
          value={`${(overview?.total_emissions_kg ?? 0).toFixed(3)} kg`}
          subtitle="CO2 equivalent"
          icon={Factory}
        />
        <StatCard
          title="Sustainability Score"
          value={`${sustainabilityScore} / 100`}
          subtitle="Auto-estimated"
          icon={Gauge}
        />
        <StatCard
          title="Total Vendors"
          value={overview?.total_vendors ?? 0}
          subtitle="Tracked vendors"
          icon={Building2}
        />
        <StatCard
          title="Highest Category"
          value={overview?.top_category ?? "N/A"}
          subtitle={`${(overview?.top_category_emissions_kg ?? 0).toFixed(3)} kg CO2`}
          icon={Cloud}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Emissions by Category">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={emissionsByCategory}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={3}
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={800}
                >
                  {emissionsByCategory.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [`${value.toFixed(3)} kg CO2`, ""]}
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.5rem",
                    fontSize: "0.875rem",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-3 justify-center mt-2">
            {emissionsByCategory.map((cat, i) => (
              <div key={cat.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: COLORS[i] }} />
                {cat.name}
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="Top Vendors by Emissions">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topVendorsByEmissions} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} width={100} />
                <Tooltip
                  formatter={(value: number) => [`${value.toFixed(3)} kg CO2`, "Emissions"]}
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.5rem",
                    fontSize: "0.875rem",
                  }}
                />
                <Bar dataKey="emissions" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} animationDuration={800} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <ChartCard title="Monthly Carbon Emissions Trend">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyEmissions}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
              <Tooltip
                formatter={(value: number) => [`${value} kg CO2`, "Emissions"]}
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "0.5rem",
                  fontSize: "0.875rem",
                }}
              />
              <Line
                type="monotone"
                dataKey="emissions"
                stroke="hsl(var(--primary))"
                strokeWidth={2.5}
                dot={{ fill: "hsl(var(--primary))", r: 4 }}
                activeDot={{ r: 6 }}
                animationDuration={1000}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {/* AI Insights */}
      <div>
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xl font-bold text-foreground mb-4"
        >
          AI-Powered Insights
        </motion.h2>
        <div className="space-y-3">
          {(insightsQuery.data ?? []).slice(0, 3).map((insight, i) => (
            <motion.div key={insight.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
              <InsightCard {...insight} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
