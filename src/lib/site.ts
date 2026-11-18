/**
 * Site config — every piece of copy the plan marks "Site config" (hero, metrics, why-Amitrix,
 * process, tech stack, final CTA, nav, footer, social, contact) lives here, so components never
 * hard-code it. Collection content (products, services, work, posts, team, testimonials,
 * clients, jobs) lives in /content instead — see src/lib/content.ts.
 *
 * Anything marked "[Placeholder]" (or `placeholder: true`) must be replaced before launch.
 * Icons are lucide-react export names (e.g. "Zap" → `import { Zap } from "lucide-react"`).
 */

export type NavLink = { label: string; href: string; external?: boolean };
export type Cta = NavLink;
export type Stat = {
  value: number;
  /** Shown before the number, e.g. "$". */
  prefix?: string;
  /** Shown after the number, e.g. "+", "%", "x". */
  suffix?: string;
  /** Decimal places to animate/display. */
  decimals?: number;
  label: string;
};
export type IconItem = { title: string; description: string; icon: string };
export type SectionCopy = { eyebrow: string; heading: string; subheading?: string };
export type TerminalLine = {
  text: string;
  /** muted = timestamps/info, success = ✓ lines, accent = cyan highlights, warn = warnings */
  tone?: "default" | "muted" | "success" | "accent" | "warn";
  /** Extra pause (ms) before this line is printed, for pacing the typing animation. */
  delay?: number;
};
export type TechItem = {
  name: string;
  /** Key for the logo component the tech-stack section renders (simple monochrome SVGs). */
  logo: string;
};
export type FooterColumn = {
  title: string;
  links: NavLink[];
  /** Append every item of this collection (via getProducts()/getServices()) after `links`. */
  from?: "products" | "services";
};
export type SocialLink = NavLink & {
  icon: "linkedin" | "x" | "github" | "youtube" | "instagram" | "dribbble";
  placeholder?: boolean;
};

export const site = {
  name: "Amitrix Labs",
  shortName: "Amitrix",
  url: "https://amitrixlabs.com",
  domain: "amitrixlabs.com",
  locale: "en",
  /** Draft positioning line (CLAUDE.md). */
  positioning: "We build software and AI that actually ships.",
  description:
    "Amitrix Labs builds its own software products and delivers custom software, AI agents and automation, web and SaaS platforms and mobile apps for teams in every industry.",

  seo: {
    titleTemplate: "%s — Amitrix Labs",
    defaultTitle: "Amitrix Labs — Software and AI that actually ships",
    /** Meta description for the home page and the site-wide default (kept under ~160 characters). */
    description:
      "Amitrix Labs builds its own software products and delivers custom software, AI agents and automation for teams in every industry. Book a call.",
    keywords: [
      "AI agents",
      "AI automation",
      "custom software development",
      "SaaS development",
      "web application development",
      "mobile app development",
      "product design",
      "cloud and DevOps",
    ],
  },

  hero: {
    badge: { label: "// NEW — [Placeholder product launch]", href: "/products" },
    headline: "We build software and AI that actually ships.",
    /** Word in `headline` that gets the gradient light-sweep. */
    highlight: "ships",
    subline: "Our own products, plus custom software and AI for teams in every industry.",
    primaryCta: { label: "Book a call", href: "/contact" },
    secondaryCta: { label: "See our work", href: "/work" },
    stats: [
      { value: 0, suffix: "+", label: "[Placeholder] projects shipped" },
      { value: 0, suffix: "+", label: "[Placeholder] industries served" },
      { value: 0, suffix: "", label: "[Placeholder] countries" },
      { value: 0, suffix: "+", label: "[Placeholder] years building" },
    ] satisfies readonly Stat[],
    scrollLabel: "Scroll",
  },

  /** Home section headers (eyebrow + heading). Draft copy. */
  sections: {
    trust: { eyebrow: "// CLIENTS", heading: "Trusted by teams at" },
    services: {
      eyebrow: "// 01 — SERVICES",
      heading: "Everything you need to go from idea to production.",
      subheading: "Six disciplines, one team — so strategy, design and engineering never get lost in handover.",
    },
    metrics: { eyebrow: "// 02 — BY THE NUMBERS", heading: "[Placeholder] Proof, not promises." },
    why: { eyebrow: "// 03 — WHY AMITRIX", heading: "A product team that happens to build for you." },
    products: {
      eyebrow: "// 04 — OUR PRODUCTS",
      heading: "We build our own products, too.",
      subheading: "The same team, tools and standards we bring to client work.",
    },
    work: { eyebrow: "// 05 — SELECTED WORK", heading: "Work that made a measurable difference." },
    process: { eyebrow: "// 06 — HOW WE WORK", heading: "A clear path from first call to launch." },
    stack: {
      eyebrow: "// 07 — TECH STACK",
      heading: "Modern, proven technology — chosen per project.",
    },
    testimonials: { eyebrow: "// 08 — CLIENTS", heading: "What our clients say." },
    insights: { eyebrow: "// INSIGHTS", heading: "Notes from the lab." },
  } satisfies Record<string, SectionCopy>,

  metrics: [
    { value: 0, suffix: "+", label: "[Placeholder] projects shipped" },
    { value: 0, suffix: "+", label: "[Placeholder] industries" },
    { value: 0, suffix: "%", label: "[Placeholder] clients who return" },
    { value: 0, suffix: "", label: "[Placeholder] products of our own" },
  ] satisfies readonly Stat[],

  why: [
    {
      title: "Ship fast",
      description:
        "Working software every week, not slide decks. Small senior teams, short feedback loops and preview links for every change.",
      icon: "Zap",
    },
    {
      title: "Built to scale",
      description:
        "Typed, tested and observable from day one, on proven infrastructure — so the first version becomes the foundation, not a rewrite.",
      icon: "Layers",
    },
    {
      title: "AI-native",
      description:
        "We build AI agents and automation into products where they create real leverage, with evaluations and guardrails your team can trust.",
      icon: "Sparkles",
    },
  ] satisfies readonly IconItem[],

  process: [
    {
      title: "Discover",
      description: "Workshops, research and a look at your systems. You leave with a scoped plan and clear success metrics.",
      icon: "Search",
    },
    {
      title: "Design",
      description: "Flows, prototypes and a design system, tested with real users before development starts.",
      icon: "PenTool",
    },
    {
      title: "Build",
      description: "Short cycles with working software you can click every week, plus tests and CI from the start.",
      icon: "CodeXml",
    },
    {
      title: "Launch & Scale",
      description: "Careful rollout, monitoring and training — then a roadmap for what comes next.",
      icon: "Rocket",
    },
  ] satisfies readonly IconItem[],

  techStack: {
    command: "amitrix deploy --prod",
    log: [
      { text: "› Resolving project amitrix/web …", tone: "muted" },
      { text: "› Installing dependencies (1,248 packages)", tone: "muted", delay: 300 },
      { text: "✓ Type check passed", tone: "success", delay: 400 },
      { text: "✓ 214 tests passed", tone: "success", delay: 300 },
      { text: "✓ AI agent evals: 0 regressions", tone: "success", delay: 300 },
      { text: "› Building for production …", tone: "muted", delay: 500 },
      { text: "✓ Build completed", tone: "success", delay: 500 },
      { text: "› Deploying to edge regions", tone: "muted", delay: 300 },
      { text: "✓ Health checks green", tone: "success", delay: 400 },
      { text: "▲ Live at https://amitrixlabs.com", tone: "accent", delay: 300 },
    ] satisfies readonly TerminalLine[],
    tools: [
      { name: "React", logo: "react" },
      { name: "Next.js", logo: "nextjs" },
      { name: "TypeScript", logo: "typescript" },
      { name: "Node.js", logo: "nodejs" },
      { name: "Python", logo: "python" },
      { name: "AI model APIs", logo: "ai" },
      { name: "React Native", logo: "react-native" },
      { name: "Postgres", logo: "postgres" },
      { name: "AWS", logo: "aws" },
      { name: "Google Cloud", logo: "gcp" },
      { name: "Vercel", logo: "vercel" },
      { name: "Docker", logo: "docker" },
    ] satisfies readonly TechItem[],
  },

  finalCta: {
    eyebrow: "// LET'S TALK",
    heading: "Have something to build?",
    body: "Tell us what you're working on. We'll reply within one business day with honest next steps — even if that means pointing you elsewhere.",
    primaryCta: { label: "Book a call", href: "/contact" },
    /** Rendered as a mailto: link using contact.email. */
    emailLabel: "Or email us",
  },

  nav: {
    main: [
      { label: "Products", href: "/products" },
      { label: "Services", href: "/services" },
      { label: "Work", href: "/work" },
      { label: "About", href: "/about" },
      { label: "Insights", href: "/insights" },
    ] satisfies readonly NavLink[],
    cta: { label: "Book a call", href: "/contact" } satisfies Cta,
  },

  footer: {
    tagline: "We build software and AI that actually ships.",
    newsletter: {
      heading: "Notes from the lab",
      body: "[Placeholder] Occasional emails about what we're building and learning. No spam.",
      placeholder: "you@company.com",
      button: "Subscribe",
    },
    columns: [
      { title: "Products", from: "products", links: [{ label: "All products", href: "/products" }] },
      { title: "Services", from: "services", links: [{ label: "All services", href: "/services" }] },
      {
        title: "Company",
        links: [
          { label: "About", href: "/about" },
          { label: "Work", href: "/work" },
          { label: "Careers", href: "/careers" },
          { label: "Contact", href: "/contact" },
        ],
      },
      {
        title: "Resources",
        links: [
          { label: "Insights", href: "/insights" },
          { label: "Case studies", href: "/work" },
        ],
      },
      {
        title: "Legal",
        links: [
          { label: "Privacy", href: "/privacy" },
          { label: "Terms", href: "/terms" },
        ],
      },
    ] satisfies readonly FooterColumn[],
    /** Rendered as "© {year} {legalName}. All rights reserved." */
    legalName: "Amitrix Labs",
  },

  /** [Placeholder] Replace with real profile URLs, then drop `placeholder: true`. */
  social: [
    { label: "LinkedIn", href: "https://www.linkedin.com/", icon: "linkedin", placeholder: true },
    { label: "X", href: "https://x.com/", icon: "x", placeholder: true },
    { label: "GitHub", href: "https://github.com/", icon: "github", placeholder: true },
  ] satisfies readonly SocialLink[],

  contact: {
    /** [Placeholder] Confirm the inbox exists before launch. */
    email: "hello@amitrixlabs.com",
    location: "[your location]",
    locationNote: "Serving clients worldwide",
    /** [Placeholder] Cal.com "username/event" link for the booking embed. */
    calLink: "placeholder/30min",
    responseTime: "[Placeholder] We reply within one business day.",
    budgets: ["< $10k", "$10k – $25k", "$25k – $50k", "$50k – $100k", "$100k+", "Not sure yet"],
  },

  /**
   * Inner-page copy (draft): header text, section headings and meta descriptions for the pages that
   * used to hard-code them. Detail pages (/products/[slug] …) take their copy from /content.
   */
  pages: {
    products: {
      eyebrow: "Products",
      title: "Software we build for ourselves — and for you.",
      intro:
        "Our own products, built with the same team, tools and standards we bring to client work. Some are live, some are in beta, some are on the way.",
      description:
        "Products built by Amitrix Labs: AI agents, automation and analytics software, built with the same team and standards we bring to client work.",
      cta: {
        title: "Want a product like this — built for your team?",
        intro: "We design and build custom software and AI for teams in every industry.",
      },
    },
    services: {
      eyebrow: "Services",
      title: "Custom software and AI, from first idea to production.",
      intro:
        "Six disciplines, one senior team. Pick the one you need today — strategy, design and engineering stay together, so nothing gets lost in handover.",
      description:
        "Custom software development, AI agents and automation, web and SaaS platforms, mobile apps, product design and cloud & DevOps — delivered by one senior team.",
    },
    work: {
      eyebrow: "Work",
      title: "Case studies from teams we've built with.",
      intro:
        "Software, AI agents and products that made a measurable difference. Filter by industry or by service.",
      description:
        "Case studies from Amitrix Labs: custom software, AI agents and automation, web platforms and mobile apps for teams in every industry.",
    },
    insights: {
      description:
        "Notes from the lab: how we build AI agents, software products and client platforms — engineering, design and process.",
    },
    about: {
      eyebrow: "About",
      title: "A product team that happens to build for you.",
      description:
        "Amitrix Labs is a product studio and engineering partner: we build our own software products and custom software and AI for teams in every industry.",
      story: { eyebrow: "Our story", heading: "From first commit to products of our own." },
      team: {
        eyebrow: "Team",
        heading: "Small, senior, hands-on.",
        intro: "The people you meet on the first call are the people who build your product.",
      },
    },
    careers: {
      eyebrow: "Careers",
      title: "Build things that actually ship.",
      intro:
        "We're a small team that builds our own products and custom software and AI for clients. If you like owning work end to end, you'll fit right in.",
      description:
        "Join Amitrix Labs: build software products and AI for clients in every industry with a small, senior team.",
      cultureSection: { eyebrow: "Culture", heading: "Small senior teams. Real ownership." },
      roles: { eyebrow: "Open roles", heading: "Join the lab.", headingEmpty: "No open roles right now." },
      /** Draft culture principles. The Culture block only knows the Zap, Layers and Sparkles icons. */
      culture: [
        {
          title: "Own the outcome",
          description:
            "You follow work from the first conversation to production, with the context and the trust to make the call.",
          icon: "Zap",
        },
        {
          title: "Small, senior teams",
          description:
            "Few layers and short feedback loops. You work next to people who raise the bar and share what they know.",
          icon: "Layers",
        },
        {
          title: "Always learning",
          description:
            "Room to try new tools and AI techniques, then bring what works into client and product work.",
          icon: "Sparkles",
        },
      ] satisfies readonly IconItem[],
    },
    contact: {
      eyebrow: "Contact",
      title: "Let's build something that ships.",
      /** Followed by contact.responseTime. */
      introLead: "Tell us what you're working on, or book a call straight away.",
      description:
        "Book a call or send Amitrix Labs a message about your software, AI or product project. We reply within one business day.",
      form: { eyebrow: "Send a message", heading: "Tell us about your project." },
      details: { emailLabel: "Email", basedInLabel: "Based in", workingWithLabel: "Working with" },
      closingCta: {
        title: "Not ready to talk yet?",
        intro: "See how we've helped other teams ship — then come back when you are.",
      },
    },
  },

  ctaLabels: {
    bookCall: "Book a call",
    seeWork: "See our work",
    explore: "Explore",
    viewCaseStudy: "View case study",
    nextCaseStudy: "Next case study",
    readArticle: "Read article",
    allProducts: "All products",
    allServices: "All services",
    allWork: "All work",
    allPosts: "All insights",
    contact: "Get in touch",
    apply: "Apply",
  },

  /** About page draft copy (Phase 10). */
  about: {
    mission:
      "[Placeholder] Our mission in one or two sentences — why Amitrix Labs exists and who it is for.",
    values: [
      { title: "[Placeholder] Value one", description: "[Placeholder] What it means in practice.", icon: "Target" },
      { title: "[Placeholder] Value two", description: "[Placeholder] What it means in practice.", icon: "Handshake" },
      { title: "[Placeholder] Value three", description: "[Placeholder] What it means in practice.", icon: "FlaskConical" },
    ] satisfies readonly IconItem[],
    timeline: [
      { year: "[Year]", title: "[Placeholder] Founded", description: "[Placeholder] How it started." },
      { year: "[Year]", title: "[Placeholder] First product", description: "[Placeholder] What we launched." },
      { year: "[Year]", title: "[Placeholder] Today", description: "[Placeholder] Where we are now." },
    ],
    careersIntro:
      "[Placeholder] A short paragraph about how we work and who thrives here.",
    noOpenRoles: "No open roles right now — but we're always looking for great people. Send us a note.",
  },
} as const;

export type Site = typeof site;
