export const transactions = [
  { id: 1, date: "2024-01-15", vendor: "AWS", category: "Cloud Services", amount: 12500, emissions: 45.2 },
  { id: 2, date: "2024-01-18", vendor: "Delta Airlines", category: "Transportation", amount: 3200, emissions: 28.7 },
  { id: 3, date: "2024-01-20", vendor: "Dell Technologies", category: "Hardware", amount: 8900, emissions: 32.1 },
  { id: 4, date: "2024-01-22", vendor: "FedEx", category: "Logistics", amount: 1500, emissions: 12.4 },
  { id: 5, date: "2024-01-25", vendor: "Staples", category: "Office Supplies", amount: 800, emissions: 3.2 },
  { id: 6, date: "2024-02-01", vendor: "Google Cloud", category: "Cloud Services", amount: 9800, emissions: 38.5 },
  { id: 7, date: "2024-02-05", vendor: "United Airlines", category: "Transportation", amount: 4500, emissions: 35.2 },
  { id: 8, date: "2024-02-10", vendor: "HP Inc", category: "Hardware", amount: 6200, emissions: 22.8 },
  { id: 9, date: "2024-02-15", vendor: "UPS", category: "Logistics", amount: 2100, emissions: 15.6 },
  { id: 10, date: "2024-02-20", vendor: "Office Depot", category: "Office Supplies", amount: 600, emissions: 2.1 },
];

export const vendors = [
  { name: "AWS", category: "Cloud Services", spend: 45000, emissions: 142.5, intensityScore: 3.17 },
  { name: "Google Cloud", category: "Cloud Services", spend: 32000, emissions: 98.2, intensityScore: 3.07 },
  { name: "Delta Airlines", category: "Transportation", spend: 18000, emissions: 85.4, intensityScore: 4.74 },
  { name: "United Airlines", category: "Transportation", spend: 15000, emissions: 72.1, intensityScore: 4.81 },
  { name: "Dell Technologies", category: "Hardware", spend: 28000, emissions: 68.3, intensityScore: 2.44 },
  { name: "HP Inc", category: "Hardware", spend: 22000, emissions: 52.7, intensityScore: 2.40 },
  { name: "FedEx", category: "Logistics", spend: 12000, emissions: 48.9, intensityScore: 4.08 },
  { name: "UPS", category: "Logistics", spend: 9500, emissions: 38.2, intensityScore: 4.02 },
  { name: "Staples", category: "Office Supplies", spend: 5000, emissions: 8.5, intensityScore: 1.70 },
  { name: "Office Depot", category: "Office Supplies", spend: 3800, emissions: 6.2, intensityScore: 1.63 },
];

export const emissionsByCategory = [
  { name: "Cloud Services", value: 240.7, fill: "hsl(160, 84%, 29%)" },
  { name: "Hardware", value: 121.0, fill: "hsl(158, 64%, 18%)" },
  { name: "Transportation", value: 157.5, fill: "hsl(142, 71%, 45%)" },
  { name: "Logistics", value: 87.1, fill: "hsl(152, 60%, 52%)" },
  { name: "Office Supplies", value: 14.7, fill: "hsl(168, 76%, 36%)" },
];

export const monthlyEmissions = [
  { month: "Jul", emissions: 145 },
  { month: "Aug", emissions: 162 },
  { month: "Sep", emissions: 158 },
  { month: "Oct", emissions: 175 },
  { month: "Nov", emissions: 168 },
  { month: "Dec", emissions: 182 },
  { month: "Jan", emissions: 195 },
  { month: "Feb", emissions: 188 },
  { month: "Mar", emissions: 172 },
  { month: "Apr", emissions: 165 },
  { month: "May", emissions: 155 },
  { month: "Jun", emissions: 148 },
];

export const topVendorsByEmissions = [
  { name: "AWS", emissions: 142.5 },
  { name: "Google Cloud", emissions: 98.2 },
  { name: "Delta Airlines", emissions: 85.4 },
  { name: "United Airlines", emissions: 72.1 },
  { name: "Dell Technologies", emissions: 68.3 },
];

export const recommendations = [
  {
    id: 1,
    currentVendor: "AWS",
    currentEmissions: 142.5,
    recommendedVendor: "Green Cloud Co.",
    estimatedEmissions: 106.9,
    reductionPercent: 25,
    category: "Cloud Services",
  },
  {
    id: 2,
    currentVendor: "Delta Airlines",
    currentEmissions: 85.4,
    recommendedVendor: "EcoJet Airways",
    estimatedEmissions: 59.8,
    reductionPercent: 30,
    category: "Transportation",
  },
  {
    id: 3,
    currentVendor: "FedEx",
    currentEmissions: 48.9,
    recommendedVendor: "GreenShip Logistics",
    estimatedEmissions: 36.7,
    reductionPercent: 25,
    category: "Logistics",
  },
  {
    id: 4,
    currentVendor: "Dell Technologies",
    currentEmissions: 68.3,
    recommendedVendor: "EcoTech Hardware",
    estimatedEmissions: 47.8,
    reductionPercent: 30,
    category: "Hardware",
  },
];

export const aiInsights: Array<{ id: number; title: string; description: string; impact: "high" | "medium" | "low"; metric: string; metricLabel: string }> = [
  {
    id: 1,
    title: "Cloud Infrastructure Dominance",
    description: "Cloud infrastructure contributes 42% of your total carbon footprint. Consider consolidating workloads or switching to carbon-neutral providers.",
    impact: "high",
    metric: "42%",
    metricLabel: "of total emissions",
  },
  {
    id: 2,
    title: "Highest Emitting Vendor",
    description: "Vendor AWS accounts for the highest emissions at 142.5 kg CO2. Their emission intensity score is 3.17 kg CO2 per $1,000 spent.",
    impact: "high",
    metric: "142.5 kg",
    metricLabel: "CO2 from AWS",
  },
  {
    id: 3,
    title: "Greener Cloud Opportunity",
    description: "Switching to greener cloud providers could reduce emissions by 18%. Green Cloud Co. offers carbon-neutral hosting with comparable performance.",
    impact: "medium",
    metric: "18%",
    metricLabel: "potential reduction",
  },
  {
    id: 4,
    title: "Travel Optimization",
    description: "Business travel accounts for 25% of emissions. Virtual meetings could replace 40% of trips, saving an estimated 63 kg CO2 monthly.",
    impact: "medium",
    metric: "63 kg",
    metricLabel: "CO2 saveable monthly",
  },
  {
    id: 5,
    title: "Logistics Efficiency",
    description: "Consolidating shipments could reduce logistics emissions by 15%. Consider batching orders with FedEx and UPS for fewer deliveries.",
    impact: "low",
    metric: "15%",
    metricLabel: "logistics reduction",
  },
];

export const reportTypes = [
  {
    id: "monthly",
    title: "Monthly Carbon Report",
    description: "Detailed breakdown of monthly emissions by category and vendor.",
    icon: "calendar",
  },
  {
    id: "quarterly",
    title: "Quarterly ESG Report",
    description: "Comprehensive ESG metrics and sustainability progress for stakeholders.",
    icon: "bar-chart",
  },
  {
    id: "annual",
    title: "Annual Carbon Summary",
    description: "Year-over-year emissions comparison with reduction targets and achievements.",
    icon: "file-text",
  },
];
