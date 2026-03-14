import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import UploadBox from "@/components/UploadBox";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Zap } from "lucide-react";

type PreviewTransaction = {
  date: string;
  vendor: string;
  category: string;
  amount: number;
  emissions_kg: number;
};

type UploadResponse = {
  batch_id: number;
  filename: string;
  rows_processed: number;
  total_emissions_kg: number;
  preview: PreviewTransaction[];
};

const UploadPage = () => {
  const queryClient = useQueryClient();
  const [uploaded, setUploaded] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadResult, setUploadResult] = useState<UploadResponse | null>(null);

  const handleUpload = async (file: File) => {
    setError(null);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/uploads/statements", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { detail?: string } | null;
        throw new Error(data?.detail || "Upload failed");
      }

      const data = (await response.json()) as UploadResponse;
      setUploadResult(data);
      setUploaded(true);
      await queryClient.invalidateQueries();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong during upload";
      setError(message);
      setUploaded(false);
      setUploadResult(null);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Upload Financial Transactions</h1>
        <p className="text-sm text-muted-foreground mt-1">Import your transaction data to analyze carbon emissions</p>
      </div>

      <UploadBox onUpload={handleUpload} />

      {error && (
        <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {isUploading && (
        <div className="rounded-md border border-border/50 bg-muted/40 p-3 text-sm text-muted-foreground">
          Processing CSV and calculating emissions...
        </div>
      )}

      {uploaded && uploadResult && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Transaction Preview</h2>
              <p className="text-xs text-muted-foreground mt-1">
                {uploadResult.rows_processed} rows processed | Total Emissions: {uploadResult.total_emissions_kg.toFixed(3)} kg CO2
              </p>
            </div>
            <Button className="gap-2" disabled>
              <Zap className="h-4 w-4" />
              Analysis Complete
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
                {uploadResult.preview.map((t, index) => (
                  <TableRow key={`${t.date}-${t.vendor}-${index}`} className="hover:bg-muted/30">
                    <TableCell className="text-foreground">{t.date}</TableCell>
                    <TableCell className="font-medium text-foreground">{t.vendor}</TableCell>
                    <TableCell>
                      <span className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded-full">{t.category}</span>
                    </TableCell>
                    <TableCell className="text-right text-foreground">Rs {t.amount.toLocaleString("en-IN")}</TableCell>
                    <TableCell className="text-right font-medium text-foreground">{t.emissions_kg.toFixed(3)}</TableCell>
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
