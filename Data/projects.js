export const projects = [
  {
    slug: "luma-dashboard",
    title: "Luma Dashboard",
    description:
      "A performance analytics workspace for operations teams to monitor growth, retention, and delivery trends in one place.",
    role: "Lead Frontend Engineer",
    status: "Featured",
    stack: ["React", "TypeScript", "Node.js", "PostgreSQL"],
    challenge:
      "The client was juggling metrics across spreadsheets, legacy dashboards, and manual reporting, so teams were making decisions from stale data.",
    highlights: [
      "Designed a modular analytics surface with KPI cards, filters, and trend views.",
      "Connected real-time data pipelines for more accurate reporting across teams.",
      "Reduced reporting time by streamlining dashboard navigation and chart interactions."
    ],
    demo: "https://example.com/luma-dashboard",
    repo: "https://github.com/example/luma-dashboard",
    image: ""
  },
  {
    slug: "orbit-commerce",
    title: "Orbit Commerce",
    description:
      "An ecommerce storefront and admin experience built to make product discovery, checkout, and merchandising easier for growing brands.",
    role: "Full Stack Developer",
    status: "Product launch",
    stack: ["Next.js", "Stripe", "MongoDB", "Tailwind"],
    challenge:
      "The brand needed a direct-to-consumer storefront that could quickly scale while giving merchandising teams more control over campaigns and inventory.",
    highlights: [
      "Built an intuitive product catalog with flexible filtering and search UX.",
      "Introduced a smarter checkout flow and campaign-driven merchandising controls.",
      "Improved product publishing cycles for marketing and operations teams."
    ],
    demo: "https://example.com/orbit-commerce",
    repo: "https://github.com/example/orbit-commerce",
    image: ""
  },
  {
    slug: "beacon-health",
    title: "Beacon Health",
    description:
      "A patient-centered care platform designed to simplify appointment booking, records access, and care coordination for clinics.",
    role: "Frontend Engineer",
    status: "Healthcare",
    stack: ["React", "Firebase", "Figma", "Accessibility"],
    challenge:
      "Clinics needed a more accessible digital experience without creating more friction for staff or patients handling appointments and follow-up care.",
    highlights: [
      "Created a patient dashboard that surfaced upcoming visits and care plans clearly.",
      "Improved appointment workflows and accessibility compliance across core screens.",
      "Collaborated closely with clinicians to simplify complex medical information."
    ],
    demo: "https://example.com/beacon-health",
    repo: "https://github.com/example/beacon-health",
    image: ""
  },
  {
    slug: "atlas-ops",
    title: "Atlas Ops",
    description:
      "A logistics command center that helps teams track deliveries, field performance, and route changes in real time.",
    role: "Product Engineer",
    status: "Operations",
    stack: ["React", "Redux", "PostgreSQL", "Mapbox"],
    challenge:
      "Operations teams were relying on fragmented tools and manual dispatch updates, which caused slow response times during route disruptions.",
    highlights: [
      "Built a live control center showing dispatch health, route status, and inventory signals.",
      "Improved field team coordination with fast state updates and team-level views.",
      "Created reusable map and status components for faster iteration."
    ],
    demo: "https://example.com/atlas-ops",
    repo: "https://github.com/example/atlas-ops",
    image: ""
  },
  {
    slug: "pulse-analytics",
    title: "Pulse Analytics",
    description:
      "A marketing intelligence tool that transforms campaign data into concise recommendations and weekly performance summaries.",
    role: "UI Engineer",
    status: "Growth",
    stack: ["Vue", "Chart.js", "Express", "SQL"],
    challenge:
      "The marketing team needed a single source of truth that could explain performance shifts without requiring deep spreadsheet analysis.",
    highlights: [
      "Developed clear scorecards and trend analysis for campaign optimization.",
      "Enabled smarter decision-making with digestible weekly performance narratives.",
      "Built a design system for consistent stakeholder-friendly reporting."
    ],
    demo: "https://example.com/pulse-analytics",
    repo: "https://github.com/example/pulse-analytics",
    image: ""
  },
  {
    slug: "northstar-lms",
    title: "Northstar LMS",
    description:
      "A learning platform for training organizations that blends course content, progress tracking, and learner engagement metrics.",
    role: "Full Stack Developer",
    status: "Education",
    stack: ["React", "Express", "MySQL", "AWS"],
    challenge:
      "The platform needed to support multiple learning paths while keeping instructors, administrators, and learners in sync across progress and assignments.",
    highlights: [
      "Built enrollment and learning-path flows for differentiated course journeys.",
      "Created a robust admin dashboard for course publishing and learner tracking.",
      "Improved learner engagement with progress visibility and milestone prompts."
    ],
    demo: "https://example.com/northstar-lms",
    repo: "https://github.com/example/northstar-lms",
    image: ""
  },
  {
    slug: "drift-scheduler",
    title: "Drift Scheduler",
    description:
      "A scheduling system for distributed teams to coordinate time blocks, resource assignments, and project handoffs without confusion.",
    role: "Product Engineer",
    status: "Workflow",
    stack: ["React", "D3", "Prisma", "Supabase"],
    challenge:
      "Teams were scheduling work across shared calendars with inconsistent visibility, causing overlap and missed handoffs between projects.",
    highlights: [
      "Built a calendar-first planning experience with shared team availability views.",
      "Introduced clarity around capacity constraints and project dependencies.",
      "Reduced coordination overhead for cross-functional stakeholders."
    ],
    demo: "https://example.com/drift-scheduler",
    repo: "https://github.com/example/drift-scheduler",
    image: ""
  },
  {
    slug: "coastal-forms",
    title: "Coastal Forms",
    description:
      "A workflow automation tool that helps service teams collect requests, route approvals, and manage completion status across departments.",
    role: "Frontend Engineer",
    status: "Automation",
    stack: ["React", "TypeScript", "Node.js", "SQL"],
    challenge:
      "The client had too many manual intake forms and approval chains, making everyday requests slow and difficult to trace.",
    highlights: [
      "Restructured the request journey into guided step-based workflows.",
      "Improved visibility into approval status and user accountability.",
      "Reduced process friction for both requesters and managers."
    ],
    demo: "https://example.com/coastal-forms",
    repo: "https://github.com/example/coastal-forms",
    image: ""
  },
  {
    slug: "nova-finance",
    title: "Nova Finance",
    description:
      "A finance operations portal for teams managing recurring budget reviews, approvals, and campaign spend insights.",
    role: "Senior Frontend Engineer",
    status: "Enterprise",
    stack: ["React", "Next.js", "GraphQL", "PostgreSQL"],
    challenge:
      "Finance teams needed clearer forecasting and faster review cycles without sacrificing the controls required for enterprise-level operations.",
    highlights: [
      "Built budget dashboards with scenario comparison and variance tracking.",
      "Improved approval experiences for cross-functional finance reviews.",
      "Created reusable reporting components that scaled with the product."
    ],
    demo: "https://example.com/nova-finance",
    repo: "https://github.com/example/nova-finance",
    image: ""
  },
  {
    slug: "harbor-portal",
    title: "Harbor Portal",
    description:
      "An internal operations portal used to centralize vendor management, service tickets, and regional reporting for a distributed team.",
    role: "Full Stack Developer",
    status: "Internal tool",
    stack: ["React", "Express", "MongoDB", "Docker"],
    challenge:
      "Regional teams were handling operational tasks through disconnected tools, making it hard to share updates and maintain visibility across the organization.",
    highlights: [
      "Unified vendor records, service requests, and reporting in one interface.",
      "Designed a clearer internal routing model for task ownership and follow-up.",
      "Improved operational transparency across distributed teams."
    ],
    demo: "https://example.com/harbor-portal",
    repo: "https://github.com/example/harbor-portal",
    image: ""
  }
];
