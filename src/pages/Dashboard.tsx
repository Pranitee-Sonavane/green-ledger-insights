import { Cloud, Gauge, Building2, Factory } from "lucide-react";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  LineChart, Line, ResponsiveContainer,
} from "recharts";
import StatCard from "@/components/StatCard";
import ChartCard from "@/components/ChartCard";
import InsightCard from "@/components/InsightCard";
import { emissionsByCategory, topVendorsByEmissions, monthlyEmissions, aiInsights } from "@/data/mockData";
import { motion } from "framer-motion";

const COLORS = [
  "hsl(160, 84%, 29%)",
  "hsl(158, 64%, 18%)",
  "hsl(142, 71%, 45%)",
  "hsl(152, 60%, 52%)",
  "hsl(168, 76%, 36%)",
];

const Dashboard = () => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Carbon Emissions Overview</h1>
        <p className="text-sm text-muted-foreground mt-1">Track and analyze your company's carbon footprint</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Carbon Emissions" value="195 kg" subtitle="CO₂ equivalent" icon={Factory} trend={{ value: 3.2, positive: false }} />
        <StatCard title="Sustainability Score" value="78 / 100" subtitle="Above average" icon={Gauge} trend={{ value: 5, positive: true }} />
        <StatCard title="Total Vendors" value="10" subtitle="Tracked vendors" icon={Building2} />
        <StatCard title="Highest Category" value="Cloud" subtitle="240.7 kg CO₂" icon={Cloud} />
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
                  formatter={(value: number) => [`${value.toFixed(1)} kg CO₂`, ""]}
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
                  formatter={(value: number) => [`${value.toFixed(1)} kg CO₂`, "Emissions"]}
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
                formatter={(value: number) => [`${value} kg CO₂`, "Emissions"]}
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
          {aiInsights.slice(0, 3).map((insight, i) => (
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
