export const SITE_URL = "https://eshwarkolla.com";

export const BIO = {
  name: "Eshwar Kolla",
  title: "Cofounder & CTO",
  company: "Alvva",
  companyUrl: "https://alvva.co",
  tagline: "12+ years in fintech, AI & data. Building legal tech that changes lives.",
  location: "Palo Alto, CA",
  from: "India",
  email: "eshwar.kolla@outlook.com",

  social: {
    github: "https://github.com/eshwarkolla",
    linkedin: "https://linkedin.com/in/eshwarkolla",
    x: "https://x.com/eshwarkolla",
  },

  education: [
    { school: "Jain University", degree: "B.Com Finance & Capital Markets" },
    { school: "Chapman University", degree: "MBA", year: "2015-2017", note: "$40K Graduate Fellowship" },
    { school: "Harrisburg University", degree: "MS Data Science & ML", year: "Expected May 2026" },
  ],

  journey: [
    "Deloitte Consulting in Bangalore → Swastiks Food ($300M revenue, built predictive models with 92% forecast accuracy) → Chapman University MBA ($40K fellowship) → founded Karma Koins (raised $200K seed, 0 to 10K users in 7 months).",
    "Product at Prudential (robo advisor, 33% satisfaction increase) & Poly ($4B global sales org, ML-powered quota accuracy to 85%, employee retention up 60%).",
    "Co-founded Foresee Health — Gen AI healthcare platform, $3M+ in transactions within 4 months, boosted client payments by 30%. Sold it to private equity.",
    "Then co-founded Alchemy Tech Labs — AI frameworks for enterprise data extraction & autonomous agent platform. 5 enterprise design partners.",
    "Now Cofounder & CTO at Alvva, building AlvvaOS — an AI operating system for immigration law firms. Agentic AI fine-tuned on thousands of real USCIS filings. Pursuing MS in Data Science & ML at Harrisburg University.",
    "Currently obsessed with AI agents — building multi-agent systems, designing agentic workflows, and shipping autonomous platforms. Every day is about pushing what's possible with tool-using, planning, self-correcting AI.",
  ],

  projects: [
    {
      name: "alvva.co",
      url: "https://alvva.co",
      description: "Immigration tech platform — helping immigrants file USCIS applications at 1/10th the cost. 99.7% approval rate. Backed by Google for Startups, AWS, Berkeley SkyDeck.",
    },
    {
      name: "alvvaos.com",
      url: "https://alvvaos.com",
      description: "AI Operating System for immigration law firms. Agentic AI fine-tuned on thousands of real USCIS filings. White-label platform with unified messaging.",
    },
  ],

  skills: [
    { label: "ai/ml", items: ["python", "pytorch", "tensorflow", "keras", "scikit-learn", "xgboost", "hugging-face", "llms", "fine-tuning", "lora", "rag", "vector-embeddings", "langchain", "langgraph", "llamaindex", "crew-ai", "openai-api", "anthropic-api", "gemini-api", "nlp", "spacy", "computer-vision", "prompt-engineering", "model-deployment"] },
    { label: "ai-agents", items: ["agentic-workflows", "multi-agent-orchestration", "tool-use", "function-calling", "mcp-servers", "autonomous-agents", "agent-memory", "agent-planning", "reflection-patterns", "claude-code", "cursor", "github-copilot", "ai-pair-programming", "human-in-the-loop", "chain-of-thought"] },
    { label: "full-stack", items: ["react", "next.js", "typescript", "javascript", "node.js", "python", "fastapi", "flask", "express", "html5", "css3", "tailwind", "postgres", "mongodb", "redis", "sqlite", "prisma", "rest-apis", "graphql", "websockets", "oauth", "jwt", "responsive-design"] },
    { label: "devops/infra", items: ["aws", "gcp", "docker", "docker-compose", "kubernetes", "ci-cd", "github-actions", "terraform", "vercel", "cloudflare", "nginx", "caddy", "linux", "shell-scripting", "monitoring", "ssl-tls"] },
    { label: "data-engineering", items: ["sql", "pandas", "numpy", "snowflake", "databricks", "bigquery", "apache-spark", "airflow", "dbt", "etl-pipelines", "data-modeling", "data-warehousing", "powerbi", "tableau", "statistical-analysis", "time-series-forecasting"] },
    { label: "product", items: ["agile", "scrum", "ab-testing", "gtm-strategy", "roadmapping", "figma", "user-research", "okrs", "stakeholder-management", "data-driven-decisions"] },
  ],

  interests: [
    {
      label: "road-cycling",
      text: "Road cycling through California — riding a Trek Domane SLR 7 (upgraded from a Scott). Weekend rides through the peninsula hills, down to the coast, and up the Santa Cruz mountains. There's nothing like 60 miles of empty road and a 4,000ft climb to clear your head.",
    },
    {
      label: "pizza-and-dosa",
      text: "Obsessed with Neapolitan pizza — San Marzano tomatoes, 00 flour, 72-hour cold ferment, 900°F in the Ooni. Equally obsessed with masala dosa — crispy crepe, potato masala, three chutneys. Always experimenting with dough hydration, batter fermentation, and sauce ratios. Kitchen is the second lab.",
    },
    {
      label: "ai-agents",
      text: "Now fully in the AI agents era — building with Claude, GPT, Gemini every single day. Designing multi-agent orchestration, tool-use patterns, MCP servers, and autonomous workflows. The goal: AI systems that plan, execute, self-correct, and actually ship real work.",
    },
  ],
} as const;
