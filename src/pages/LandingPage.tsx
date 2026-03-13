import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, BarChart3, Building2, Brain, Leaf, Upload, LineChart, Github, Twitter, Linkedin } from "lucide-react";
import { useNavigate } from "react-router-dom";

const features = [
  {
    icon: BarChart3,
    title: "Automated Carbon Tracking",
    description: "Convert financial transactions into carbon emissions automatically with our AI-powered analysis engine.",
  },
  {
    icon: Building2,
    title: "Vendor Sustainability Insights",
    description: "Identify vendors contributing most to emissions and benchmark against industry standards.",
  },
  {
    icon: Brain,
    title: "Smart AI Recommendations",
    description: "Discover greener alternatives to reduce emissions with personalized, data-driven suggestions.",
  },
];

const steps = [
  { number: "01", icon: Upload, title: "Upload transaction data", description: "Import your financial transactions via CSV or connect your accounting software." },
  { number: "02", icon: Brain, title: "AI analyzes vendor emissions", description: "Our models calculate carbon footprint based on spend categories and vendor data." },
  { number: "03", icon: LineChart, title: "Dashboard provides insights", description: "Get actionable sustainability insights and recommendations to reduce emissions." },
];

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Leaf className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground">Green Ledger</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>Login</Button>
            <Button size="sm" onClick={() => navigate("/dashboard")}>Get Started</Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent via-background to-background" />
        <div className="relative max-w-6xl mx-auto px-6 py-24 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
            <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-accent text-accent-foreground px-3 py-1.5 rounded-full mb-6">
              <Leaf className="h-3.5 w-3.5" /> Sustainability Analytics Platform
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold text-foreground leading-tight tracking-tight mb-6">
              Track and Reduce Your Company's{" "}
              <span className="text-primary">Carbon Footprint</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-8 leading-relaxed">
              Turn financial transactions into actionable sustainability insights. Make data-driven decisions to lower emissions and meet ESG goals.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" className="gap-2 text-base" onClick={() => navigate("/dashboard")}>
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg" className="text-base" onClick={() => navigate("/dashboard")}>
                View Demo
              </Button>
            </div>
          </motion.div>

          {/* Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-16 rounded-xl border border-border/50 bg-card shadow-2xl overflow-hidden"
          >
            <div className="h-8 bg-muted/50 flex items-center px-4 gap-2 border-b border-border/50">
              <div className="w-3 h-3 rounded-full bg-destructive/60" />
              <div className="w-3 h-3 rounded-full bg-chart-4/60" />
              <div className="w-3 h-3 rounded-full bg-primary/60" />
            </div>
            <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Total Emissions", value: "195 kg CO₂" },
                { label: "Score", value: "78 / 100" },
                { label: "Vendors", value: "10" },
                { label: "Top Category", value: "Cloud" },
              ].map((item) => (
                <div key={item.label} className="rounded-lg bg-muted/50 p-4">
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="text-lg font-bold text-foreground mt-1">{item.value}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl font-bold text-foreground mb-3">Everything you need for carbon transparency</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Powerful tools to measure, analyze, and reduce your organization's environmental impact.
          </p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
            >
              <Card className="h-full border-border/50 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="rounded-xl bg-accent w-12 h-12 flex items-center justify-center mb-4">
                    <f.icon className="h-6 w-6 text-accent-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-muted/30 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl font-bold text-foreground mb-3">How it works</h2>
            <p className="text-muted-foreground">Three simple steps to carbon transparency.</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary text-primary-foreground text-xl font-bold mb-4">
                  {step.number}
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <Leaf className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground">Green Ledger</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">About</a>
            <a href="#" className="hover:text-foreground transition-colors">Pricing</a>
            <a href="#" className="hover:text-foreground transition-colors">Contact</a>
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
              <Twitter className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
              <Linkedin className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
              <Github className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
