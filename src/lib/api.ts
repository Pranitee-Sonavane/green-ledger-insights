export type OverviewResponse = {
  total_emissions_kg: number;
  total_vendors: number;
  total_transactions: number;
  top_category: string | null;
  top_category_emissions_kg: number;
};

export type EmissionsByCategoryResponse = {
  name: string;
  value: number;
};

export type TopVendorResponse = {
  name: string;
  emissions: number;
};

export type MonthlyTrendResponse = {
  month: string;
  emissions: number;
};

export type VendorSummaryResponse = {
  name: string;
  category: string;
  spend: number;
  emissions: number;
  intensityScore: number;
};

export type RecommendationResponse = {
  id: number;
  currentVendor: string;
  currentEmissions: number;
  recommendedVendor: string;
  estimatedEmissions: number;
  reductionPercent: number;
  category: string;
};

export type AIInsightResponse = {
  id: number;
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  metric: string;
  metricLabel: string;
};

async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(path);
  if (!response.ok) {
    const data = (await response.json().catch(() => null)) as { detail?: string } | null;
    throw new Error(data?.detail || `Request failed: ${response.status}`);
  }
  return (await response.json()) as T;
}

export function getOverview() {
  return apiGet<OverviewResponse>("/api/dashboard/overview");
}

export function getEmissionsByCategory() {
  return apiGet<EmissionsByCategoryResponse[]>("/api/dashboard/emissions-by-category");
}

export function getTopVendors(limit = 10) {
  return apiGet<TopVendorResponse[]>(`/api/dashboard/top-vendors?limit=${limit}`);
}

export function getMonthlyTrend() {
  return apiGet<MonthlyTrendResponse[]>("/api/dashboard/monthly-trend");
}

export function getVendors() {
  return apiGet<VendorSummaryResponse[]>("/api/vendors");
}

export function getRecommendations(limit = 4) {
  return apiGet<RecommendationResponse[]>(`/api/recommendations?limit=${limit}`);
}

export function getAIInsights(limit = 5) {
  return apiGet<AIInsightResponse[]>(`/api/ai-insights?limit=${limit}`);
}
