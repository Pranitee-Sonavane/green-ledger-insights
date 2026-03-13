import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { reportTypes } from "@/data/mockData";
import { Calendar, BarChart3, FileText, Download, FileSpreadsheet } from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  calendar: Calendar,
  "bar-chart": BarChart3,
  "file-text": FileText,
};

const Reports = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Sustainability Reports</h1>
        <p className="text-sm text-muted-foreground mt-1">Generate and download comprehensive sustainability reports</p>
      </div>

      <div className="grid gap-4">
        {reportTypes.map((report, i) => {
          const Icon = iconMap[report.icon] || FileText;
          return (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.12 }}
            >
              <Card className="border-border/50 shadow-sm hover:shadow-md transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="rounded-xl bg-accent p-3">
                        <Icon className="h-6 w-6 text-accent-foreground" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{report.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{report.description}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Button variant="outline" size="sm" className="gap-2">
                        <Download className="h-3.5 w-3.5" />
                        PDF
                      </Button>
                      <Button variant="outline" size="sm" className="gap-2">
                        <FileSpreadsheet className="h-3.5 w-3.5" />
                        CSV
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Reports;
