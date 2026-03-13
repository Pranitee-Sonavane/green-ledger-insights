

# Green Ledger — Sustainability Analytics Platform

## Overview
A modern SaaS dashboard for tracking and reducing corporate carbon emissions by analyzing financial transactions. Premium emerald-green themed UI with smooth animations.

## Design System
- **Colors**: Emerald green primary, dark green secondary, light gray background, white cards
- **Style**: Rounded cards, soft shadows, subtle gradients, smooth hover transitions
- **Typography**: Clean sans-serif (Inter via Tailwind defaults)

## Pages & Features

### 1. Landing Page (`/`)
- Hero section with headline, subtitle, CTA buttons (Get Started / View Demo)
- Dashboard preview illustration
- 3 feature cards (Carbon Tracking, Vendor Insights, AI Recommendations)
- "How It Works" steps section
- Footer with links and social icons

### 2. Dashboard (`/dashboard`)
- 4 KPI stat cards (Total Emissions, Sustainability Score, Total Vendors, Highest Category)
- Pie chart: emissions by category
- Bar chart: top vendors by emissions
- Line chart: monthly emissions trend
- AI Insights card section with smart suggestion cards

### 3. Upload Transactions (`/upload`)
- Drag-and-drop upload area with CSV button
- Preview table after upload (Date, Vendor, Category, Amount, Estimated CO2)
- "Analyze Transactions" button

### 4. Vendor Insights (`/vendors`)
- Vendor leaderboard table (Name, Category, Spend, Emissions, Intensity Score)
- Category and emission range filters
- Top 3 highest emitters highlighted

### 5. Green Recommendations (`/recommendations`)
- Recommendation cards comparing current vs. alternative vendors with reduction %
- Comparison bar chart
- "Switch to Greener Vendor" CTA buttons

### 6. AI Insights (`/ai-insights`)
- Smart insight cards with AI-generated suggestions
- Actionable recommendations with impact metrics

### 7. Reports (`/reports`)
- Report type selection (Monthly, Quarterly ESG, Annual)
- Download PDF / Export CSV buttons

### 8. Settings (`/settings`)
- Basic settings placeholder page

## Layout
- **Left Sidebar**: Logo, navigation links with active highlighting, collapsible
- **Top Navbar**: Search bar, notification bell, user avatar, company dropdown
- **Main Content**: Dynamic based on route

## Reusable Components
- Sidebar, TopNavbar, StatCard, ChartCard, UploadBox, VendorTable, RecommendationCard, InsightCard

## Data
- Mock JSON data for transactions, vendors, emissions, recommendations, and AI insights

## Interactions
- Hover effects on all cards
- Sidebar collapse animation
- Animated chart transitions via Recharts
- File upload drag-and-drop with preview
- Responsive grid layout (desktop + tablet)

