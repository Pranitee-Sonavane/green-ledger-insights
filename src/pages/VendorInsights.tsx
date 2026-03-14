import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import VendorTable from "@/components/VendorTable";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getVendors } from "@/lib/api";

const VendorInsights = () => {
  const [category, setCategory] = useState("All");
  const vendorsQuery = useQuery({ queryKey: ["vendors-summary"], queryFn: getVendors });

  const categories = useMemo(() => {
    const vendorRows = vendorsQuery.data ?? [];
    const dynamic = Array.from(new Set(vendorRows.map((v) => v.category))).sort();
    return ["All", ...dynamic];
  }, [vendorsQuery.data]);

  const filtered = useMemo(() => {
    const base = vendorsQuery.data ?? [];
    let result = [...base].sort((a, b) => b.emissions - a.emissions);
    if (category !== "All") result = result.filter((v) => v.category === category);
    return result;
  }, [category, vendorsQuery.data]);

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

      {vendorsQuery.isLoading && (
        <div className="rounded-md border border-border/50 bg-muted/40 p-3 text-sm text-muted-foreground">
          Loading vendor data...
        </div>
      )}

      {vendorsQuery.error && (
        <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
          {vendorsQuery.error instanceof Error ? vendorsQuery.error.message : "Failed to load vendors"}
        </div>
      )}

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <VendorTable vendors={filtered} />
      </motion.div>
    </div>
  );
};

export default VendorInsights;
