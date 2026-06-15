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
    "Now Cofounder & CTO at Alvva, building AlvvaOS — an AI operating system for immigration law firms. Pursuing MS in Data Science & ML at Harrisburg University.",
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
    { label: "ai-ml", items: ["python", "pytorch", "scikit-learn", "hugging-face", "llms", "nlp", "spacy"] },
    { label: "data", items: ["sql", "pandas", "snowflake", "databricks", "bigquery", "powerbi", "tableau"] },
    { label: "cloud", items: ["aws", "gcp", "docker", "salesforce", "pinecone"] },
    { label: "frontend", items: ["react", "next.js", "typescript", "node.js", "html", "css"] },
    { label: "product", items: ["agile", "a-b-testing", "gtm-strategy", "roadmapping", "figma"] },
  ],
} as const;
