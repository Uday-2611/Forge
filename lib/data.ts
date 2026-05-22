export type SourceDetail = {
  sub: string;
  title: string;
  upvotes: number | null;
};

export type PainPoint = {
  id: number;
  score: number;
  title: string;
  industry: string;
  difficulty: string;
  source: string;
  sourceDetail: SourceDetail[];
  target: string;
  solution: string;
  keywords: string[];
  builders: number;
};

export const PAIN_POINTS: PainPoint[] = [
  {
    id: 1,
    score: 9.2,
    title:
      "Indie founders waste 11 hours a week reconciling Stripe, bank, and bookkeeping spreadsheets that never agree on the same number.",
    industry: "Finance",
    difficulty: "Solo",
    source: "Reddit · 47 posts",
    sourceDetail: [
      {
        sub: "r/startups",
        title:
          "I've spent more time fixing my books than building my product this month",
        upvotes: 1284,
      },
      {
        sub: "r/Entrepreneur",
        title: "Why does every bookkeeping tool assume I have an accountant?",
        upvotes: 892,
      },
      {
        sub: "Hacker News",
        title:
          "Show HN: I built a Stripe reconciliation script because I lost my mind",
        upvotes: 543,
      },
    ],
    target:
      "Bootstrapped SaaS founders doing under $20k MRR who handle their own books.",
    solution:
      "A single ledger that ingests Stripe, Mercury/Brex, and Wise via API; auto-classifies transactions; flags only the ones that disagree.",
    keywords: ["Stripe", "reconciliation", "bookkeeping", "SaaS finance", "MRR"],
    builders: 14,
  },
  {
    id: 2,
    score: 8.7,
    title:
      "Newsletter writers track sponsorship pipelines inside Notion databases that break the moment a deal moves to step three.",
    industry: "Creator",
    difficulty: "Weekend",
    source: "Reddit · 31 posts",
    sourceDetail: [
      {
        sub: "r/Substack",
        title: "Anyone else's sponsor CRM held together with duct tape?",
        upvotes: 612,
      },
      {
        sub: "r/newsletters",
        title: "Lost a $4k sponsor because I forgot to send the invoice",
        upvotes: 411,
      },
    ],
    target:
      "Solo newsletter operators with 5k–80k subs running 2–6 sponsorships per quarter.",
    solution:
      "Lightweight CRM with pipeline stages tailored to newsletter ads: pitched, contract, ad ready, sent, invoiced, paid. Auto-pulls open rates per send.",
    keywords: ["newsletter", "sponsorships", "CRM", "ad sales", "creators"],
    builders: 7,
  },
  {
    id: 3,
    score: 8.4,
    title:
      "Therapists in private practice still hand-write session notes because every EHR built for them feels like hospital software.",
    industry: "Healthcare",
    difficulty: "Team",
    source: "Reddit · 22 posts",
    sourceDetail: [
      {
        sub: "r/therapists",
        title:
          "SimplePractice is too much. Notion is too little. Where do I go?",
        upvotes: 778,
      },
      {
        sub: "r/psychotherapy",
        title:
          "I'm a therapist who codes — I'm building my own SOAP note app",
        upvotes: 322,
      },
    ],
    target:
      "Solo private-practice therapists, LCSWs, LMFTs not affiliated with a group.",
    solution:
      "HIPAA-compliant note app with SOAP/DAP templates, voice dictation, and a calendar — nothing else. No billing, no insurance bloat.",
    keywords: [
      "therapy",
      "SOAP notes",
      "HIPAA",
      "private practice",
      "mental health",
    ],
    builders: 3,
  },
  {
    id: 4,
    score: 7.9,
    title:
      "Open-source maintainers have no idea which of their thousand GitHub issues come from paying customers of companies built on their code.",
    industry: "Developer",
    difficulty: "Solo",
    source: "Hacker News · 18 posts",
    sourceDetail: [
      {
        sub: "Hacker News",
        title:
          "The maintainer's dilemma: triage as a stranger to your own users",
        upvotes: 1102,
      },
      {
        sub: "r/opensource",
        title: "How do you prioritize issues when 80% are from hobbyists?",
        upvotes: 488,
      },
    ],
    target:
      "Maintainers of mid-sized OSS projects (1k–50k stars) accepting sponsorships.",
    solution:
      "GitHub app that cross-references issue authors with GitHub Sponsors, OpenCollective backers, and corporate email domains. Adds a 'context' badge to every issue.",
    keywords: ["open source", "GitHub", "maintainers", "triage", "sponsors"],
    builders: 11,
  },
  {
    id: 5,
    score: 7.6,
    title:
      "Independent contractors send invoices in PDF, get paid in 47 days, and have no way to politely escalate before the relationship sours.",
    industry: "Finance",
    difficulty: "Weekend",
    source: "Reddit · 29 posts",
    sourceDetail: [
      {
        sub: "r/freelance",
        title: "Do I follow up again? I've sent three emails",
        upvotes: 901,
      },
      {
        sub: "r/digitalnomad",
        title: "Client owes me $8k. What's the polite-but-firm script?",
        upvotes: 654,
      },
    ],
    target:
      "Freelancers and small agencies billing $2k–$30k per invoice.",
    solution:
      "Invoice tool with a built-in escalation cadence: friendly nudge → firm reminder → 'this is going to collections' template. One-click each, fully editable.",
    keywords: ["invoicing", "freelance", "payment terms", "collections"],
    builders: 22,
  },
  {
    id: 6,
    score: 9.0,
    title:
      "Adult children of aging parents are stitching estate paperwork together across six banks, three lawyers, and an unsearchable Gmail inbox.",
    industry: "Finance",
    difficulty: "Team",
    source: "Reddit · 64 posts",
    sourceDetail: [
      {
        sub: "r/personalfinance",
        title: "Dad passed. Where do I even start with his accounts?",
        upvotes: 4211,
      },
      {
        sub: "r/Estateplanning",
        title: "My mother has dementia and I can't find her will",
        upvotes: 1893,
      },
      {
        sub: "Hacker News",
        title:
          "Ask HN: Software for managing a parent's late-stage life logistics?",
        upvotes: 712,
      },
    ],
    target:
      "Adults aged 35–55 managing aging-parent finances and end-of-life logistics.",
    solution:
      "A private vault that maps every account, document, contact, and recurring bill in one place. Designed for the moment of crisis, not the lawyer's office.",
    keywords: ["estate planning", "elder care", "aging parents", "end of life"],
    builders: 5,
  },
  {
    id: 7,
    score: 6.8,
    title:
      "Discord moderators of large communities run their entire policy stack inside pinned messages no one has read since 2022.",
    industry: "Creator",
    difficulty: "Weekend",
    source: "Reddit · 19 posts",
    sourceDetail: [
      {
        sub: "r/discordapp",
        title:
          "Modmail bot is great. Everything else is held together with hope.",
        upvotes: 287,
      },
    ],
    target: "Mod teams of Discord servers with 10k+ members.",
    solution:
      "A web-based mod handbook tied to the server: rules, warning ladders, escalation flows, and an audit log of why each ban happened.",
    keywords: ["Discord", "moderation", "community", "policy"],
    builders: 2,
  },
  {
    id: 8,
    score: 8.1,
    title:
      "Etsy makers reorder packaging supplies from memory and discover at midnight they're out of mailers the day a sale goes live.",
    industry: "Productivity",
    difficulty: "Solo",
    source: "Reddit · 26 posts",
    sourceDetail: [
      {
        sub: "r/Etsy",
        title:
          "I keep running out of bubble mailers at the worst possible time",
        upvotes: 1422,
      },
      {
        sub: "r/handmade",
        title: "Inventory tracking that doesn't require a spreadsheet PhD?",
        upvotes: 533,
      },
    ],
    target:
      "Etsy and Shopify makers shipping 20–500 orders per month from home.",
    solution:
      "A barcode-free inventory app: snap a photo of the shelf, set a low-stock threshold, get a reorder reminder with the exact Amazon/Uline link saved.",
    keywords: ["Etsy", "inventory", "shipping", "makers", "DTC"],
    builders: 8,
  },
  {
    id: 9,
    score: 7.3,
    title:
      "Adults diagnosed with ADHD in their thirties find every habit-tracking app either gamifies them into shame or vanishes into another tab.",
    industry: "Healthcare",
    difficulty: "Solo",
    source: "Reddit · 41 posts",
    sourceDetail: [
      {
        sub: "r/ADHD",
        title: "Why does every habit app punish you for missing a day?",
        upvotes: 3210,
      },
      {
        sub: "r/productivity",
        title: "I built 11 habit trackers. None of them stuck.",
        upvotes: 1188,
      },
    ],
    target:
      "Adults diagnosed with ADHD post-25 who have abandoned at least three habit apps.",
    solution:
      "An anti-streak tracker. Records what you actually did, not what you missed. Weekly review surfaces patterns, not penalties.",
    keywords: ["ADHD", "habits", "neurodivergent", "behavior change"],
    builders: 18,
  },
  {
    id: 10,
    score: 6.4,
    title:
      "Wet-lab scientists still copy pipetting volumes from a printed protocol to a paper notebook to an Excel file before any data exists.",
    industry: "Healthcare",
    difficulty: "Team",
    source: "Hacker News · 9 posts",
    sourceDetail: [
      {
        sub: "Hacker News",
        title: "Why is bench science software stuck in 2003?",
        upvotes: 887,
      },
    ],
    target:
      "Academic and biotech wet-lab researchers running repeatable protocols.",
    solution:
      "iPad-first electronic lab notebook that lives next to the bench. Voice + tap entry. Protocols become checklists; data flows out as CSV.",
    keywords: ["biotech", "ELN", "lab notebook", "research tools"],
    builders: 4,
  },
  {
    id: 11,
    score: 8.6,
    title:
      "First-time home buyers receive sixty PDFs across three weeks and have no shared place to ask 'wait, is this the right one to sign?'",
    industry: "Finance",
    difficulty: "Team",
    source: "Reddit · 38 posts",
    sourceDetail: [
      {
        sub: "r/FirstTimeHomeBuyer",
        title:
          "My loan officer just sent me 14 documents named 'final_v2'",
        upvotes: 2104,
      },
      {
        sub: "r/RealEstate",
        title: "Closing in 6 days and I have no idea what I'm signing",
        upvotes: 1567,
      },
    ],
    target: "First-time buyers in the 30 days before closing.",
    solution:
      "A buyer-side document room that mirrors the lender's. Annotates each PDF in plain English. Flags missing signatures.",
    keywords: ["mortgage", "home buying", "closing", "real estate"],
    builders: 6,
  },
  {
    id: 12,
    score: 7.1,
    title:
      "Solo founders run customer interviews and lose 80% of the insight because Otter transcripts go straight into a folder they never reopen.",
    industry: "Productivity",
    difficulty: "Solo",
    source: "User Submitted",
    sourceDetail: [
      {
        sub: "Forge · submitted by @maren",
        title:
          "I have 47 customer interview transcripts I will never read again",
        upvotes: null,
      },
    ],
    target: "Pre-PMF founders doing weekly customer development calls.",
    solution:
      "Drop transcripts in. Get back a living document of themes, quotes, and contradiction patterns across all interviews. Updates as new calls land.",
    keywords: [
      "customer development",
      "interviews",
      "user research",
      "PMF",
    ],
    builders: 9,
  },
];

export const INDUSTRIES = [
  "All",
  "Finance",
  "Productivity",
  "Healthcare",
  "Creator",
  "Developer",
];
export const DIFFICULTIES = ["Any build", "Weekend", "Solo", "Team"];
export const SORTS = ["Trending", "New", "Pain Score"];
