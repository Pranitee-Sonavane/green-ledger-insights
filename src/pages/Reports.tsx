import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Calendar, BarChart3, Download, FileText, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getEmissionsByCategory,
  getMonthlyTrend,
  getOverview,
  getRecommendations,
  getVendors,
} from "@/lib/api";

type ReportDefinition = {
  id: "monthly" | "quarterly" | "annual";
  title: string;
  description: string;
  icon: React.ElementType;
};

const reportDefinitions: ReportDefinition[] = [
  {
    id: "monthly",
    title: "Monthly Carbon Report",
    description: "Current upload summary with emissions by category, vendor, and operational recommendations.",
    icon: Calendar,
  },
  {
    id: "quarterly",
    title: "Quarterly ESG Report",
    description: "Management snapshot with top categories, vendor performance, and recommended reduction actions.",
    icon: BarChart3,
  },
  {
    id: "annual",
    title: "Annual Carbon Summary",
    description: "Executive-ready report combining totals, trends, hotspots, and opportunity areas.",
    icon: FileText,
  },
];

function formatDateStamp(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

function formatKg(value: number) {
  return value < 1 ? value.toFixed(3) : value.toFixed(1);
}

function buildPrintableHtml(params: {
  title: string;
  subtitle: string;
  overview: Array<{ label: string; value: string }>;
  sections: Array<{ title: string; rows: string[] }>;
}) {
  const overviewMarkup = params.overview
    .map(
      (item) => `
        <div class="metric-card">
          <div class="metric-label">${item.label}</div>
          <div class="metric-value">${item.value}</div>
        </div>`
    )
    .join("");

  const sectionsMarkup = params.sections
    .map(
      (section) => `
        <section class="section-block">
          <h2>${section.title}</h2>
          <ul>
            ${section.rows.map((row) => `<li>${row}</li>`).join("")}
          </ul>
        </section>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>${params.title}</title>
    <style>
      body {
        font-family: "Segoe UI", sans-serif;
        margin: 32px;
        color: #123524;
        background: #f7fbf8;
      }
      h1, h2 {
        margin: 0;
      }
      p {
        margin: 8px 0 0;
        color: #4d6b5c;
      }
      .hero {
        padding: 24px;
        border-radius: 18px;
        background: linear-gradient(135deg, #d9f7df 0%, #eef8f1 100%);
        margin-bottom: 24px;
      }
      .metrics {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 12px;
        margin: 24px 0;
      }
      .metric-card {
        background: white;
        border: 1px solid #dbe8df;
        border-radius: 14px;
        padding: 16px;
      }
      .metric-label {
        color: #5d7768;
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: 0.08em;
      }
      .metric-value {
        margin-top: 8px;
        font-size: 24px;
        font-weight: 700;
      }
      .section-block {
        margin-top: 24px;
        padding: 20px;
        background: white;
        border: 1px solid #dbe8df;
        border-radius: 14px;
      }
      ul {
        margin: 14px 0 0;
        padding-left: 20px;
      }
      li {
        margin: 8px 0;
        line-height: 1.4;
      }
      @media print {
        body {
          margin: 16px;
          background: white;
        }
      }
    </style>
  </head>
  <body>
    <div class="hero">
      <h1>${params.title}</h1>
      <p>${params.subtitle}</p>
    </div>
    <div class="metrics">${overviewMarkup}</div>
    ${sectionsMarkup}
  </body>
</html>`;
}

function printHtmlDocument(html: string) {
  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";
  iframe.setAttribute("aria-hidden", "true");
  document.body.appendChild(iframe);

  const cleanup = () => {
    window.setTimeout(() => {
      iframe.remove();
    }, 1000);
  };

  iframe.onload = () => {
    const printWindow = iframe.contentWindow;
    if (!printWindow) {
      cleanup();
      return;
    }

    printWindow.focus();
    printWindow.print();
    cleanup();
  };

  const iframeDocument = iframe.contentDocument;
  if (!iframeDocument) {
    cleanup();
    return;
  }

  iframeDocument.open();
  iframeDocument.write(html);
  iframeDocument.close();
}

function getReportSubtitle(reportId: ReportDefinition["id"], generatedOn: string) {
  if (reportId === "monthly") {
    return `Generated ${generatedOn} from the latest uploaded batch with an operational monthly focus.`;
  }

  if (reportId === "quarterly") {
    return `Generated ${generatedOn} as a management ESG snapshot for recent emissions performance.`;
  }

  return `Generated ${generatedOn} as an executive carbon summary covering footprint, hotspots, and reduction priorities.`;
}

function getReportSections(
  reportId: ReportDefinition["id"],
  categories: Array<{ name: string; value: number }>,
  vendors: Array<{ name: string; category: string; spend: number; emissions: number; intensityScore: number }>,
  monthlyTrend: Array<{ month: string; emissions: number }>,
  recommendations: Array<{
    currentVendor: string;
    currentEmissions: number;
    recommendedVendor: string;
    estimatedEmissions: number;
    reductionPercent: number;
    category: string;
  }>
) {
  const totalEmissions = vendors.reduce((sum, vendor) => sum + vendor.emissions, 0);
  const topCategory = categories[0];
  const topVendor = vendors[0];

  if (reportId === "monthly") {
    return [
      {
        title: "Monthly Category Breakdown",
        rows: categories.slice(0, 5).map((item) => `${item.name}: ${item.value.toFixed(3)} kg CO2e`),
      },
      {
        title: "Highest-Impact Vendors This Month",
        rows: vendors.slice(0, 5).map(
          (vendor) => `${vendor.name} (${vendor.category}) emitted ${vendor.emissions.toFixed(3)} kg CO2e from Rs ${vendor.spend.toLocaleString("en-IN")}`
        ),
      },
      {
        title: "Operational Reduction Actions",
        rows: recommendations.slice(0, 4).map(
          (item) => `${item.currentVendor} -> ${item.recommendedVendor} could cut emissions by ${item.reductionPercent}% to ${item.estimatedEmissions.toFixed(3)} kg CO2e`
        ),
      },
    ];
  }

  if (reportId === "quarterly") {
    return [
      {
        title: "ESG Performance Snapshot",
        rows: [
          `Current tracked footprint: ${totalEmissions.toFixed(3)} kg CO2e across ${vendors.length} vendors`,
          topCategory
            ? `${topCategory.name} is the largest emissions category at ${topCategory.value.toFixed(3)} kg CO2e`
            : "No category data available",
          topVendor
            ? `${topVendor.name} is the highest-impact vendor at ${topVendor.emissions.toFixed(3)} kg CO2e`
            : "No vendor data available",
        ],
      },
      {
        title: "Priority Supplier Risks",
        rows: vendors.slice(0, 5).map(
          (vendor) => `${vendor.name}: intensity score ${vendor.intensityScore.toFixed(2)}, spend Rs ${vendor.spend.toLocaleString("en-IN")}, emissions ${vendor.emissions.toFixed(3)} kg CO2e`
        ),
      },
      {
        title: "Near-Term Decarbonisation Opportunities",
        rows: recommendations.slice(0, 4).map(
          (item) => `${item.category}: replace ${item.currentVendor} with ${item.recommendedVendor} for an estimated ${item.reductionPercent}% reduction`
        ),
      },
    ];
  }

  return [
    {
      title: "Executive Carbon Summary",
      rows: [
        `Total measured emissions: ${totalEmissions.toFixed(3)} kg CO2e`,
        `Tracked supplier base: ${vendors.length} vendors across ${categories.length} categories`,
        topCategory
          ? `Primary hotspot: ${topCategory.name} at ${topCategory.value.toFixed(3)} kg CO2e`
          : "No hotspot data available",
      ],
    },
    {
      title: "Trend And Hotspot Review",
      rows: [
        ...monthlyTrend.slice(0, 6).map((item) => `${item.month}: ${item.emissions.toFixed(3)} kg CO2e`),
        ...vendors.slice(0, 3).map((vendor) => `Key vendor hotspot: ${vendor.name} contributes ${vendor.emissions.toFixed(3)} kg CO2e`),
      ],
    },
    {
      title: "Strategic Reduction Roadmap",
      rows: recommendations.slice(0, 5).map(
        (item) => `${item.currentVendor} in ${item.category}: target ${item.reductionPercent}% reduction by switching to ${item.recommendedVendor}`
      ),
    },
  ];
}

const Reports = () => {
  const overviewQuery = useQuery({ queryKey: ["reports-overview"], queryFn: getOverview });
  const categoriesQuery = useQuery({ queryKey: ["reports-categories"], queryFn: getEmissionsByCategory });
  const vendorsQuery = useQuery({ queryKey: ["reports-vendors"], queryFn: getVendors });
  const trendQuery = useQuery({ queryKey: ["reports-trend"], queryFn: getMonthlyTrend });
  const recommendationsQuery = useQuery({
    queryKey: ["reports-recommendations"],
    queryFn: () => getRecommendations(6),
  });

  const isLoading =
    overviewQuery.isLoading ||
    categoriesQuery.isLoading ||
    vendorsQuery.isLoading ||
    trendQuery.isLoading ||
    recommendationsQuery.isLoading;
  const error =
    overviewQuery.error ||
    categoriesQuery.error ||
    vendorsQuery.error ||
    trendQuery.error ||
    recommendationsQuery.error;

  const overview = overviewQuery.data;
  const categories = categoriesQuery.data ?? [];
  const vendors = vendorsQuery.data ?? [];
  const monthlyTrend = trendQuery.data ?? [];
  const recommendations = recommendationsQuery.data ?? [];

  const generatedOn = new Date().toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
  const topVendors = vendors.slice(0, 5);
  const topRecommendations = recommendations.slice(0, 4);

  const overviewCards = [
    { label: "Total emissions", value: `${formatKg(overview?.total_emissions_kg ?? 0)} kg CO2e` },
    { label: "Tracked vendors", value: String(overview?.total_vendors ?? 0) },
    { label: "Transactions", value: String(overview?.total_transactions ?? 0) },
    { label: "Highest category", value: overview?.top_category ?? "N/A" },
  ];

  const exportPdf = (report: ReportDefinition) => {
    const html = buildPrintableHtml({
      title: report.title,
      subtitle: getReportSubtitle(report.id, generatedOn),
      overview: overviewCards,
      sections: getReportSections(report.id, categories, vendors, monthlyTrend, recommendations),
    });

    printHtmlDocument(html);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Sustainability Reports</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Generate downloadable reports from the latest uploaded carbon dataset.
          </p>
        </div>
        <div className="rounded-xl border border-border/50 bg-card px-4 py-3 text-sm text-muted-foreground shadow-sm">
          Generated from latest batch on {generatedOn}
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center gap-2 rounded-md border border-border/50 bg-muted/40 p-3 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading report data...
        </div>
      )}

      {error && (
        <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
          {error instanceof Error ? error.message : "Failed to load report data"}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {overviewCards.map((card) => (
          <Card key={card.label} className="border-border/50 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{card.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-foreground">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4">
        {reportDefinitions.map((report, index) => {
          const Icon = report.icon;
          return (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
            >
              <Card className="border-border/50 shadow-sm transition-all duration-300 hover:shadow-md">
                <CardContent className="p-6">
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-start gap-4">
                      <div className="rounded-2xl bg-accent p-3">
                        <Icon className="h-6 w-6 text-accent-foreground" />
                      </div>
                      <div className="space-y-2">
                        <div>
                          <h3 className="font-semibold text-foreground">{report.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{report.description}</p>
                        </div>
                        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                          <span className="rounded-full bg-muted px-2.5 py-1">{vendors.length} vendors</span>
                          <span className="rounded-full bg-muted px-2.5 py-1">{categories.length} categories</span>
                          <span className="rounded-full bg-muted px-2.5 py-1">{monthlyTrend.length} trend points</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                      <Button variant="outline" size="sm" className="gap-2" onClick={() => exportPdf(report)} disabled={isLoading || !!error}>
                        <Download className="h-3.5 w-3.5" />
                        PDF
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Top Vendor Hotspots</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {topVendors.length === 0 && <p className="text-sm text-muted-foreground">No vendor data available yet.</p>}
            {topVendors.map((vendor) => (
              <div key={vendor.name} className="flex items-center justify-between rounded-xl border border-border/50 px-4 py-3">
                <div>
                  <div className="font-medium text-foreground">{vendor.name}</div>
                  <div className="text-sm text-muted-foreground">{vendor.category}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-foreground">{vendor.emissions.toFixed(3)} kg</div>
                  <div className="text-sm text-muted-foreground">Rs {vendor.spend.toLocaleString("en-IN")}</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Recommended Actions Snapshot</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {topRecommendations.length === 0 && <p className="text-sm text-muted-foreground">No recommendation data available yet.</p>}
            {topRecommendations.map((item) => (
              <div key={item.id} className="rounded-xl border border-border/50 px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="font-medium text-foreground">{item.currentVendor}</div>
                    <div className="text-sm text-muted-foreground">{item.recommendedVendor}</div>
                  </div>
                  <div className="rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-accent-foreground">
                    -{item.reductionPercent}% CO2
                  </div>
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  {item.currentEmissions.toFixed(3)} kg -&gt; {item.estimatedEmissions.toFixed(3)} kg
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reports;
