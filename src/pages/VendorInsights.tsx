import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import VendorTable from "@/components/VendorTable";
import { vendors } from "@/data/mockData";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const categories = ["All", "Cloud Services", "Transportation", "Hardware", "Logistics", "Office Supplies"];

const VendorInsights = () => {
  const [category, setCategory] = useState("All");

  const filtered = useMemo(() => {
    let result = [...vendors].sort((a, b) => b.emissions - a.emissions);
    if (category !== "All") result = result.filter((v) => v.category === category);
    return result;
  }, [category]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Vendor Sustainability Leaderboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Vendors ranked by carbon emissions</p>
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <VendorTable vendors={filtered} />
      </motion.div>
    </div>
  );
};

export default VendorInsights;
