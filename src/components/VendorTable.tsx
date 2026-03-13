import { motion } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Vendor {
  name: string;
  category: string;
  spend: number;
  emissions: number;
  intensityScore: number;
}

interface VendorTableProps {
  vendors: Vendor[];
  highlightTop?: number;
}

const VendorTable = ({ vendors, highlightTop = 3 }: VendorTableProps) => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="rounded-lg border border-border/50 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="font-semibold">Rank</TableHead>
              <TableHead className="font-semibold">Vendor</TableHead>
              <TableHead className="font-semibold">Category</TableHead>
              <TableHead className="font-semibold text-right">Total Spend</TableHead>
              <TableHead className="font-semibold text-right">Emissions (kg CO₂)</TableHead>
              <TableHead className="font-semibold text-right">Intensity Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vendors.map((vendor, index) => (
              <TableRow
                key={vendor.name}
                className={`transition-colors ${index < highlightTop ? "bg-destructive/5 hover:bg-destructive/10" : "hover:bg-muted/30"}`}
              >
                <TableCell className="font-medium">
                  {index < highlightTop ? (
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-destructive/10 text-destructive text-xs font-bold">
                      {index + 1}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">{index + 1}</span>
                  )}
                </TableCell>
                <TableCell className="font-medium text-foreground">{vendor.name}</TableCell>
                <TableCell>
                  <span className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded-full">
                    {vendor.category}
                  </span>
                </TableCell>
                <TableCell className="text-right text-foreground">
                  ${vendor.spend.toLocaleString()}
                </TableCell>
                <TableCell className="text-right font-medium text-foreground">
                  {vendor.emissions.toFixed(1)}
                </TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {vendor.intensityScore.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </motion.div>
  );
};

export default VendorTable;
