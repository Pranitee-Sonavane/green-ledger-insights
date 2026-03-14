import { useState } from "react";
import { motion } from "framer-motion";
import UploadBox from "@/components/UploadBox";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Zap } from "lucide-react";
import Papa from "papaparse";

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
  const [uploaded, setUploaded] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadResult, setUploadResult] = useState<UploadResponse | null>(null);

  const inferCategory = (vendor: string) => {
    const v = vendor.toLowerCase();
    if (v.includes("aws") || v.includes("google") || v.includes("dell") || v.includes("apple")) return "Cloud / IT";
    if (v.includes("airlines") || v.includes("delta") || v.includes("united")) return "Air Travel";
    if (v.includes("fedex") || v.includes("ups")) return "Freight";
    if (v.includes("staples") || v.includes("office depot")) return "Office Supplies";
    return "Other";
  };

  const calculateEmissions = (row: any) => {
    // CSV fields: amount, distance_km, passenger_count, freight_ton_km
    const amount = Number(row.amount);
    const distance = Number(row.distance_km);
    const passengers = Number(row.passenger_count);
    const freight = Number(row.freight_ton_km);

    if (!Number.isNaN(freight) && freight > 0) {
      return freight * 0.0006 * 1000; // ton-km to kg by surrogate factor
    }

    if (!Number.isNaN(distance) && !Number.isNaN(passengers) && passengers > 0) {
      return distance * passengers * 0.17; // airline average kg/passenger-km
    }

    if (!Number.isNaN(amount) && amount > 0) {
      return amount * 0.003; // finance-based emission proxy
    }

    return 0;
  };

  const handleUpload = async (file: File) => {
    setError(null);
    setIsUploading(true);

    const fileName = file.name.toLowerCase();
    if (fileName.endsWith(".csv")) {
      try {
        const text = await file.text();
        const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });
        const invalidRows: number[] = [];
        const validRows: PreviewTransaction[] = [];

        const rows = parsed.data as Record<string, string>[];

        rows.forEach((row, idx) => {
          const date = (row.date || "").trim();
          const vendor = (row.vendor || "").trim();
          const amount = Number((row.amount || "").toString().replace(/[^0-9.\-]/g, ""));

          if (!date || !vendor || Number.isNaN(amount)) {
            invalidRows.push(idx + 2); // +2 includes header line
            return;
          }

          const category = inferCategory(vendor);
          const emissions = calculateEmissions(row);

          validRows.push({
            date,
            vendor,
            category,
            amount,
            emissions_kg: Number(emissions.toFixed(3)),
          });
        });

        if (validRows.length === 0) {
          throw new Error("No valid rows found in CSV. Please check header and numeric fields.");
        }

        const totalEmissions = validRows.reduce((acc, row) => acc + row.emissions_kg, 0);

        setUploadResult({
          batch_id: Date.now(),
          filename: file.name,
          rows_processed: validRows.length,
          total_emissions_kg: Number(totalEmissions.toFixed(3)),
          preview: validRows.slice(0, 10),
        });

        setUploaded(true);

        if (invalidRows.length > 0) {
          setError(`Skipped ${invalidRows.length} invalid row(s): ${invalidRows.join(", ")}.`);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "CSV parsing failed";
        setError(message);
        setUploaded(false);
        setUploadResult(null);
      } finally {
        setIsUploading(false);
      }

      return;
    }

    // Fallback for non-CSV (existing backend API path)
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
