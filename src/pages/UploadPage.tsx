import { useState } from "react";
import { motion } from "framer-motion";
import UploadBox from "@/components/UploadBox";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { transactions } from "@/data/mockData";
import { Zap } from "lucide-react";

const UploadPage = () => {
  const [uploaded, setUploaded] = useState(false);

  const handleUpload = () => {
    setUploaded(true);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Upload Financial Transactions</h1>
        <p className="text-sm text-muted-foreground mt-1">Import your transaction data to analyze carbon emissions</p>
      </div>

      <UploadBox onUpload={handleUpload} />

      {uploaded && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Transaction Preview</h2>
            <Button className="gap-2">
              <Zap className="h-4 w-4" />
              Analyze Transactions
            </Button>
          </div>

          <div className="rounded-lg border border-border/50 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="font-semibold">Date</TableHead>
                  <TableHead className="font-semibold">Vendor</TableHead>
                  <TableHead className="font-semibold">Category</TableHead>
                  <TableHead className="font-semibold text-right">Amount</TableHead>
                  <TableHead className="font-semibold text-right">Est. Emissions (kg CO₂)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((t) => (
                  <TableRow key={t.id} className="hover:bg-muted/30">
                    <TableCell className="text-foreground">{t.date}</TableCell>
                    <TableCell className="font-medium text-foreground">{t.vendor}</TableCell>
                    <TableCell>
                      <span className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded-full">{t.category}</span>
                    </TableCell>
                    <TableCell className="text-right text-foreground">${t.amount.toLocaleString()}</TableCell>
                    <TableCell className="text-right font-medium text-foreground">{t.emissions.toFixed(1)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default UploadPage;
