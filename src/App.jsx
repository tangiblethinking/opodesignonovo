import { useState, useEffect, useRef, useCallback } from "react";

// ── FULL CONTENT DATA ──────────────────────────────────────────────────────────
const SECTIONS = [
  {
    id: "s1", num: "01", title: "Executive Summary", icon: "BarChart2",
    roles: ["Executive"],
    tagline: "The business case for this initiative — written for leadership first.",
    heroQuote: "\"Every dollar we spend on rework is a dollar we did not spend on growth. This document is a plan to stop spending it.\"",
    summary: "This document presents a Design Operations framework for the eCommerce site, Customer Portal, and Back Office — a structured, measurable plan to reduce the organizational friction that is currently inflating cycle times, degrading release quality, and absorbing team capacity in rework. It is not a theory. It is a working operational model, ready to implement.",
    keyPoints: [
      { label: "30%+ Capacity Lost", detail: "Estimated team capacity consumed by corrections, re-designs, and re-builds caused by incomplete requirements. A team operating at 70% effective capacity because of rework and re-alignment is delivering 30% less value per dollar of payroll. The ROI of this initiative is not speculative — it is the recovery of capacity that is already being paid for and not fully received." },
      { label: "2–5x Cycle Inflation", detail: "Estimated multiplier on ticket cycle time when a handoff is rejected and work restarts mid-cycle. This is the compounding cost of informal, unstandarded handoffs — each rejection resets the work and every downstream team absorbs the cost." },
      { label: "#1 Root Cause of Defects", detail: "Scope gaps and missing acceptance criteria in BRDs are the leading driver of post-release defects across all three products. Every gap in the BRD becomes rework in design, development, and QA — multiplying the cost of the original gap by every team it touches." },
    ],
    problems: [
      { problem: "BRDs arrive at UX missing required information", impact: "Every gap in the BRD becomes rework in design, development, and QA — multiplying the cost of the original gap by every team it touches", section: "Section 5 — BRD Standards", sectionId: "s5" },
      { problem: "No one clearly owns decisions — they stall or get deferred in circles", impact: "Work waits while decisions travel up and back down the org chart. Releases slip. Team capacity idles. Frustration compounds.", section: "Section 4 —  DRAC & Decision Framework", sectionId: "s4" },
      { problem: "No handoff standards exist between any two teams", impact: "Each team receives work in whatever format was convenient for the sender. Re-work is absorbed silently and never surfaces as a process problem.", section: "Section 6 — Handoff Standards", sectionId: "s6" },
      { problem: "Jira and Confluence are fragmented — one board and set of pages per department", impact: "There is no unified view of work in progress. Leaders cannot see pipeline health. Blockers are invisible until they become crises.", section: "Sections 8 & 9 — Jira & Confluence Config", sectionId: "s8" },
      { problem: "Creative dependencies (Workfront) are invisible inside the product cycle", impact: "UX tickets stall waiting for copy and assets with no visibility to the PM or Dev team. Release dates slip without warning.", section: "Section 7 — Workfront Integration", sectionId: "s7" },
    ],
    framework: [
      { system: "Product Cycle — 16-stage workflow", does: "Defines every stage, every gate, and every ownership assignment from Backlog to Release", outcome: "Eliminates ambiguity about where work is and who is responsible for it" },
      { system: " DRAC Matrix", does: "Assigns exactly one Accountable party to every decision across all three products", outcome: "Breaks the decision-deferral cycle that stalls work without resolution" },
      { system: "BRD Standards — 3 tiers", does: "Sets the minimum information required before UX accepts any work request", outcome: "Reduces rework by ensuring all teams start from a complete, validated brief", sectionId: "s5" },
      { system: "Handoff Standards — 6 transitions", does: "Defines required deliverables, rejection triggers, and done criteria at every team boundary", outcome: "Protects downstream teams from absorbing upstream gaps silently", sectionId: "s6" },
      { system: "Workfront Integration", does: "Makes creative asset dependencies visible inside Jira without a technical integration", outcome: "Eliminates the blind spot that causes release dates to slip without warning", sectionId: "s7" },
      { system: "Jira Configuration", does: "Unified 16-stage workflow, 10 custom fields, 6 ticket templates, 12 automations across 4 boards", outcome: "Creates a single source of truth for work in progress — visible to all", sectionId: "s8" },
      { system: "Confluence Architecture", does: "5 governed spaces, 5 templates, naming standards, and governance rules", outcome: "Makes every process document findable in 3 clicks — no more scattered pages", sectionId: "s9" },
      { system: "Design System Governance", does: "Defines who approves creative decisions and establishes the path to Creative Director ratification", outcome: "Protects brand consistency and eliminates unauthorized visual drift", sectionId: "s10" },
      { system: "Implementation Roadmap", does: "90-day phased plan with measurable milestones and 5 tracked KPIs", outcome: "Delivers quick wins in 30 days and full implementation in 90 — with proof", sectionId: "s11" },
    ],
    roiTimeline: [
      { timeframe: "Day 30", changes: "BRD template live.  DRAC published. Jira ticket templates active. Workfront tag field created.", signal: "First BRD reviewed against the intake checklist. First ticket using the new template structure.", impact: "Early: Reduction in the number of design iterations caused by scope gaps. Hours recovered per cycle." },
      { timeframe: "Day 60", changes: "All Jira boards live. eCommerce migrated. Confluence spaces built. Handoff checklists active.", signal: "Cycle time per stage tracked for the first time. First release notes published from template.", impact: "Moderate: Faster handoffs reduce idle time between stages. PM can see pipeline health in one view." },
      { timeframe: "Day 90", changes: "All 3 products on new Jira structure. Automations live. Slack integration active. Baseline metrics set.", signal: "Full cycle completed on new process. 5 KPI baselines established. Executive metrics report delivered.", impact: "Significant: Baseline established — every subsequent improvement is measured against it." },
      { timeframe: "6 months", changes: "BRD rework rate reduced 50%. Cycle time per stage improving. Handoff rejection rate declining.", signal: "Quarterly KPI report showing measurable trend improvement across all 5 metrics.", impact: "Compounding: 50% reduction in rework rate = material capacity recovery across the full team." },
      { timeframe: "12 months", changes: "Full design system ratified. All tools integrated. Process fully embedded in team culture.", signal: "Annual KPI review. Process retrospectives embedded. Team onboarded to new standards.", impact: "Structural: Predictable release cadence. Reduced defect rate. Higher quality per dollar of team investment." },
    ],
    objections: [
      { q: "\"We\'ve done process docs before and nothing changed.\"", a: "This document is different in three ways: it includes step-by-step Jira and Confluence configuration that makes the process structural — not optional. It includes a 90-day phased roadmap with named owners for every action. And it includes five measurable KPIs so progress is visible, not assumed." },
      { q: "\"This adds bureaucracy and slows the team down.\"", a: "The current process has no fewer steps — it has the same steps performed inconsistently and repeatedly. A rejected BRD, a returned handoff, a post-release defect — each of these is a step that does not appear in any process doc but consumes real time. This framework replaces invisible rework with visible structure." },
      { q: "\"The team is too small for this level of process.\"", a: "A 3–5 person team sharing responsibility across three products is exactly the team that needs clear ownership and structured handoffs. Process overhead is proportional to team size — these standards are deliberately tiered so Tier 1 work moves fast and only Tier 3 initiatives carry full documentation weight." },
      { q: "\"We don\'t have time to implement this right now.\"", a: "The implementation is designed to run in parallel with current work — nothing stops shipping while this is set up. The first 30 days require approximately 2–4 hours per team lead to publish templates and communicate standards. That is the cost of entry for a process that recovers hours every week in perpetuity." },
      { q: "\"Who owns this after it\'s published?\"", a: "The Director of UX owns the document, the process governance, and the quarterly metrics review. The PM Lead owns the Jira and Confluence health checks. The Director of Software owns the tool configuration. Ownership is explicit, named, and not shared — see Section 4 for the full  DRAC." },
      { q: "\"How do we know it will actually work?\"", a: "We establish 5 measurable KPI baselines at Day 90 and report quarterly. If a metric is not improving, the process is adjusted — not defended. The retrospective cadence built into this framework exists specifically to course-correct. The framework is designed to be improved, not protected." },
    ],
    decisions: [
      { text: "Approve this Design Operations Guide as the official operational standard for all three products", owner: "Executive team", impact: "Without formal approval, individual directors may operate under conflicting standards — undermining the unified process before it starts" },
      { text: "Direct the Director of Software to implement the Jira and Confluence configuration in Sections 8 and 9", owner: "CTO or Director of Software\'s direct manager", impact: "The tool configuration is the structural backbone of the process — without it, the framework exists only on paper" },
      { text: "Direct the Creative Director to schedule the design token and component ratification sessions within 90 days", owner: "Creative Director\'s direct manager", impact: "Until tokens and components are ratified, the design system operates under interim standards — creating ongoing visual inconsistency risk" },
      { text: "Agree to respect the Executive Review gate — respond within the defined 2-business-day window", owner: "All Executive Stakeholders", impact: "Executive Review is a conditional gate — it only adds value if executives engage with it. Silent non-response is the current default that stalls releases" },
    ],
    quickWins: [
      { win: "First BRD reviewed against a formal intake checklist — accepted or rejected with documented reasons", who: "PM Lead, Director of UX, relevant Director", why: "The first time a formal quality gate has been applied to the most expensive source of rework in the cycle" },
      { win: " DRAC matrix published — every role knows who owns what decision for each product", who: "All team leads, Executive Stakeholders", why: "Eliminates the \"who decides this?\" conversation that currently delays work at every approval gate" },
      { win: "Jira ticket templates active — every new ticket has a structured description format", who: "PM team, Dev team, QA team", why: "Immediately improves ticket quality and reduces back-and-forth between teams on missing information" },
      { win: "Workfront dependency tag field live in Jira — creative blockers visible on every ticket", who: "PM, Director of UX, Dev leads", why: "The first time a Workfront dependency has been visible inside Jira — eliminates a daily blind spot" },
      { win: "Escalation path communicated and posted — everyone knows what to do when a decision stalls", who: "All team members", why: "Replaces \"I\'ll follow up\" with a defined 4-step process that has timeboxes and a named owner at each step" },
    ],
    docStructure: [
      { num: "1", title: "Executive Summary", audience: "Executive team, all directors", question: "What is this, why does it matter, and what do we need from leadership?" },
      { num: "2", title: "DesignOps Mission & Scope", audience: "All team members, new hires", question: "What is Design Operations and why does it exist here?" },
      { num: "3", title: "The Product Cycle", audience: "All team members", question: "How does work flow from idea to release?" },
      { num: "4", title: "Roles & Ownership —  DRAC", audience: "All team leads, executive team", question: "Who owns what, and who decides what?" },
      { num: "5", title: "BRD Standards", audience: "PM team, Director of UX", question: "What must be true before UX accepts any work request?" },
      { num: "6", title: "Handoff Standards", audience: "All disciplines", question: "What must be true before work passes between teams?" },
      { num: "7", title: "Creative & Workfront Integration", audience: "UX team, Creative team, PM", question: "How do Workfront dependencies flow through the UX cycle?" },
      { num: "8", title: "Jira Configuration", audience: "Director of Software, PM Lead", question: "How must Jira be structured and configured to support this process?" },
      { num: "9", title: "Confluence Configuration", audience: "Director of Software, PM Lead", question: "How must Confluence be structured to serve as the single source of truth?" },
      { num: "10", title: "Design System Governance", audience: "Director of UX, Creative Director", question: "Who approves creative decisions, and what is the path to full ratification?" },
      { num: "11", title: "Quick Wins & Roadmap", audience: "Executive team, all leads", question: "What changes, when, and how will we know it is working?" },
    ],
    accordions: [
      { title: "1.1 Business Case — Process investment is capacity recovery", content: "A team operating at 70% effective capacity because of rework and re-alignment is a team delivering 30% less value per dollar of payroll. The ROI of this initiative is not speculative — it is the recovery of capacity that is already being paid for and not fully received. The five systemic problems above have been observed consistently across all three products and all release cycles." },
      { title: "1.3 ROI — Full 5-milestone breakdown", content: "Day 30: Hours recovered per cycle. | Day 60: Reduced idle time between stages, PM pipeline visibility in one view. | Day 90: 5 KPI baselines established, executive metrics report delivered. | 6 months: 50% rework reduction = material capacity recovery across the full team. | 12 months: Structural improvement — predictable release cadence, reduced defect rate, higher quality per dollar of team investment." },
      { title: "1.4 Objections — All 6 responses", content: "Six objections are addressed in full: (1) We have done this before — structural configuration makes it stick. (2) Adds bureaucracy — replaces invisible rework with visible structure. (3) Team is too small — tiered standards scale to scope. (4) No time — runs in parallel, 2–4 hrs to start. (5) Who owns it — Director of UX, PM Lead, Director of Software. (6) How do we know it works — 5 KPI baselines + quarterly review cadence." },
      { title: "1.5 What Is Being Asked of Leadership", content: "The implementation begins with or without executive endorsement — but it is significantly more effective with it. Teams follow process more consistently when leadership has explicitly endorsed it. The four decisions below are the difference between a process that is adopted and one that is tolerated. Tap the Decisions card above to see each decision with its owner and consequence if deferred." },
      { title: "1.6 Quick Wins — Visible in 30 days", content: "Five concrete changes are visible within the first 30 days of approval — before any Jira board is rebuilt or any Confluence space is restructured. Each quick win is paired with who sees it and why it matters. Tap the Quick Wins card above to see all five." },
      { title: "1.7 How to Read This Guide", content: "This document serves multiple audiences. Executives: read Sections 1 and 11 for the full business case and implementation plan. Team leads: read your relevant sections for operational standards. All team members: the full document is the reference for how a specific part of the process works. Every section cross-references the others. Tap the Document Structure card to see the full navigation guide." },
    ]
  },
  {
    id: "s2", num: "02", title: "DesignOps Mission & Scope", icon: "Target",
    roles: ["Designer", "PM", "Executive"],
    tagline: "What Design Operations means at this organization and why it exists now.",
    summary: "This section establishes what Design Operations means at this organization, why it exists, what it governs, and how the UX team operates as the connective tissue between every discipline in the product cycle. It is the context that makes every other section in this document meaningful.",
    definition: "Design Operations (DesignOps) is the practice of orchestrating the people, processes, and tools that enable design teams to do their best work at scale. It is not about designing — it is about creating the conditions under which great design can happen consistently, efficiently, and in alignment with business goals.",
    mission: "The mission of Design Operations at this organization is to create a product cycle where every team knows what to do, when to do it, and what good looks like — so that UX, Development, QA, and Product Management can deliver high-quality experiences across the eCommerce site, Customer Portal, and Back Office without friction, rework, or wasted effort.",
    whyNow: [
      { num: "1", title: "BRD Quality is the Bottleneck", body: "Business requirements documents consistently arrive at UX missing discovery findings, technical constraints, acceptance criteria, and scope definitions. Every gap in the BRD becomes rework downstream — in design, in development, and in QA. The cost of a poorly written BRD is not paid by the person who wrote it. It is paid by every team that touches the work after it.", sectionId: "s5", sectionLabel: "Section 5 — BRD Standards & Requirements" },
      { num: "2", title: "Ownership is Assumed, Not Assigned", body: "When no one clearly owns a decision, decisions are deferred upward — to directors, to executives — who then defer to their reports. Work stalls not because of complexity but because of ambiguity. The cycle\'s weakest point is not any individual stage — it is the space between stages where no one knows who is responsible for what.", sectionId: "s4", sectionLabel: "Section 4 — Roles & Ownership (DRAC)" },
      { num: "3", title: "Handoffs Carry No Standards", body: "Each team hands off work in whatever format is convenient for the sender rather than what is required by the receiver. Designs arrive at Dev without annotations. Builds arrive at QA without self-testing. Requests arrive at UX without briefs. Every informal handoff is a hidden tax on the receiving team.", sectionId: "s6", sectionLabel: "Section 6 — Handoff Standards" },
      { num: "4", title: "Tools Are Fragmented", body: "Jira has one board per department with no shared workflow. Confluence has pages scattered without structure. Workfront operates in isolation from Jira. The tools that should connect the team instead reflect its silos. A team member working across multiple products navigates multiple inconsistent systems daily.", sectionId: "s8", sectionLabel: "Section 8 — Jira Configuration Guide" },
      { num: "5", title: "UX Absorbs Every Gap", body: "Because UX sits at the intersection of branding, development feasibility, business goals, and user expectations, it is the first team to feel the impact of every upstream gap. UX is regularly asked to produce solutions for problems that are not yet well-defined, for audiences that have not been researched, and within constraints that have not been confirmed. This is not a UX problem — it is an organizational process problem.", sectionId: null, sectionLabel: null },
    ],
    products: [
      { name: "eCommerce Site", color: "#1565C0", audience: "External customers — browsing, purchasing, account management", scope: "Product listings, PDP, cart & checkout, account, CMS content, navigation", devOwner: "Offshore Dev (cart & checkout architecture) + Onshore Dev (CMS & content publishing)", uxFocus: "Conversion, usability, brand consistency, accessibility, mobile-first experience" },
      { name: "Customer Portal", color: "#1A7A4A", audience: "Existing customers — account management, order history, support", scope: "Dashboard, account settings, order tracking, support & help center", devOwner: "Offshore Dev (portal infrastructure and architecture)", uxFocus: "Task completion, personalization, clarity, self-service efficiency" },
      { name: "Back Office", color: "#6C3483", audience: "Internal qualifying customers — operations, customer management, reporting", scope: "Operations dashboard, customer management, order processing, system configuration", devOwner: "Offshore Dev (architecture & build) + Onshore Dev (CMS-adjacent tooling)", uxFocus: "Operational efficiency, information density, error prevention, internal usability" },
    ],
    uxConstraints: [
      { label: "BRAND", desc: "Visual and tonal consistency across all three products. Every screen must feel like the same company.", color: "#A93226" },
      { label: "FEASIBILITY", desc: "Every design must be technically buildable within the constraints confirmed by the Dev team.", color: "#1A7A4A" },
      { label: "BUSINESS", desc: "Every design must serve a business objective defined in the BRD and measurable by a KPI.", color: "#2E86AB" },
      { label: "USER", desc: "Every design must meet reasonable user expectations for usability, accessibility, and clarity.", color: "#6C3483" },
    ],
    mandates: [
      { responsibility: "BRD Intake & Validation", description: "Review all incoming BRDs for completeness against the standards in Section 5. Accept or reject with specific, actionable comments. Facilitate Discovery Meetings when BRDs have significant gaps.", owner: "Director of UX", sectionId: "s5", sectionLabel: "Section 5 — BRD Standards & Requirements" },
      { responsibility: "Design Execution", description: "Produce complete, annotated Figma specifications for all accepted BRDs. All work must reference the approved component library, meet accessibility standards, and include all required states and breakpoints.", owner: "Senior Designer", sectionId: null, sectionLabel: null },
      { responsibility: "Handoff Quality", description: "Ensure every UX deliverable meets the handoff standard defined in Section 6 before moving forward. Complete the UX → Dev handoff checklist on every task. Maintain Figma file hygiene and component library discipline.", owner: "Senior Designer + Director of UX", sectionId: "s6", sectionLabel: "Section 6 — Handoff Standards" },
      { responsibility: "Process Governance", description: "Maintain the Design Operations Guide in Confluence. Monitor the Jira workflow for process compliance. Escalate violations and gaps through the channels defined in Section 4. Facilitate retrospectives and feed learnings back into this document.", owner: "Director of UX", sectionId: "s4", sectionLabel: "Section 4 — Roles & Ownership (DRAC)" },
    ],
    uxNeeds: [
      { team: "Product Manager", fromTeam: "A complete, accepted BRD before design begins. Realistic timelines that account for design iteration. Clear scope definition — what is in and what is explicitly out. Technical constraints confirmed by Dev before submission.", fromUX: "A Figma file that is complete, annotated, and matches the accepted BRD scope. A realistic design schedule with milestone dates. Proactive communication when scope, dependencies, or constraints change.", sectionId: "s5", sectionLabel: "Section 5 — BRD Standards & Requirements" },
      { team: "Dev Team", fromTeam: "Dev Review feedback within 2 business days — specific and technical, not stylistic. Technical constraints identified during BRD stage, not at Design Approval. A collaborative relationship on feasibility — Dev is a partner in design, not a reviewer at the end.", fromUX: "Figma specs that are complete with all states, breakpoints, and annotations. Components sourced from the approved library. No placeholder copy. Handoff checklist completed. Design Approval completed before Dev Review is requested.", sectionId: "s6", sectionLabel: "Section 6 — Handoff Standards" },
      { team: "QA Team", fromTeam: "Acceptance criteria written in testable format in the BRD before design begins. Prompt, clear answers to design-related questions during QA Stage. Availability to review QA findings that relate to design accuracy.", fromUX: "Figma specs that serve as the visual acceptance standard. Clear documentation of any intentional design deviations from the component library. Prompt response when QA flags a design-accuracy defect.", sectionId: "s5", sectionLabel: "Section 5 — BRD Standards & Requirements" },
      { team: "Creative Team", fromTeam: "Workfront deliverables fulfilled within agreed SLAs. Proactive communication when a delivery is at risk — not silence followed by a missed deadline. Assets delivered in the correct format, dimensions, and brand compliance.", fromUX: "Complete Workfront briefs submitted at Design Review — not mid-design. Specific tone, dimension, and reference guidance in every request. Priority settings that match actual business urgency.", sectionId: "s7", sectionLabel: "Section 7 — Creative & Workfront Integration" },
      { team: "Executive Stakeholder", fromTeam: "Timely decisions at Executive Review gates — within the 2-business-day window. Strategic direction provided during Planning so design can account for it. Delegation of approval authority communicated clearly and in advance.", fromUX: "Clear, concise visual presentations of design decisions tied to business objectives. Flagging of strategic risks before they become delivery problems. Honest assessment of what is and is not achievable within the given constraints.", sectionId: "s4", sectionLabel: "Section 4 — Roles & Ownership (DRAC)" },
    ],
    governs: [
      { item: "The product cycle — every stage, every gate, every ownership assignment", sectionId: "s3" },
      { item: "Roles and accountability — every  DRAC assignment across all three products", sectionId: "s4" },
      { item: "BRD standards — what must be true before UX accepts any work request", sectionId: "s5" },
      { item: "Handoff standards — what must be true before work passes between any two teams", sectionId: "s6" },
      { item: "Creative dependencies — how Workfront requests are managed within the UX workflow", sectionId: "s7" },
      { item: "Jira configuration — how the tooling is structured to support this process", sectionId: "s8" },
      { item: "Confluence architecture — how documentation is organized, maintained, and found", sectionId: "s9" },
      { item: "Design system governance — how the component library and creative standards are maintained", sectionId: "s10" },
    ],
    livingDoc: [
      { activity: "Process retrospective", cadence: "After every major release (Tier 2+)", owner: "Director of UX", output: "Action items logged in Confluence, document updated if process changes" },
      { activity: "Document review", cadence: "Quarterly", owner: "Director of UX + PM Lead", output: "Sections reviewed for accuracy, outdated content updated or archived" },
      { activity: " DRAC review", cadence: "After any org structure change", owner: "Director of UX", output: "Section 4 updated to reflect new roles or ownership changes" },
      { activity: "Jira / Confluence audit", cadence: "Quarterly", owner: "Director of Software + PM Lead", output: "Tool configuration reviewed against standards in Sections 8 and 9" },
      { activity: "Onboarding guide update", cadence: "After any team change", owner: "PM Lead", output: "Team Onboarding Space updated to reflect current team and tools" },
    ],
    keyPoints: [
      { label: "Three Products in Scope", detail: "eCommerce site, Customer Portal, and Back Office — all governed by one unified process, the same Jira structure, and the same Confluence architecture defined in this document." },
      { label: "UX as Connective Tissue", detail: "UX simultaneously satisfies Brand, Feasibility, Business, and User constraints — the only discipline required to do all four at once. UX is not a service bureau — it is a strategic discipline that translates business intent into human experience." },
      { label: "Four UX Mandates", detail: "BRD Intake & Validation, Design Execution, Handoff Quality, and Process Governance. All four apply across all three products and all stages of the cycle." },
    ],
    accordions: [
      { title: "2.1 What Is DesignOps — Full Definition", content: "The company is mid-reorganization — moving away from department-siloed operations toward a cross-functional product model. DesignOps does not add bureaucracy — it removes ambiguity. It replaces informal coordination with clear process, replaces assumed ownership with explicit accountability, and replaces scattered documentation with a single source of truth." },
      { title: "2.5 UX as Connective Tissue — Full Context", content: "UX cannot do its job well unless every upstream input — the BRD, the technical constraints, the creative assets, the brand direction — is complete and correct before design begins. Every downstream team — Dev, QA, release — cannot do their job well unless the UX output — Figma specs, annotations, the handoff checklist — is complete and correct before they begin." },
      { title: "2.8 What This Document Does NOT Govern", content: "This document does not govern creative direction, brand strategy, or the business priorities that determine what gets built. Those decisions belong to the Creative Director, Marketing leadership, and the Executive team respectively. This document governs how work moves through the system once those decisions have been made." },
      { title: "2.9 Living Document — Change Rules", content: "Changes to this document that affect  DRAC assignments, BRD standards, or handoff requirements must be reviewed by the Director of UX and PM Lead before being published. Minor clarifications and corrections may be made by the document owner directly. All changes are logged in the Changelog page in the Design Operations Confluence space." },
    ]
  },
  {
    id: "s3", num: "03", title: "The Product Cycle", icon: "GitBranch",
    roles: ["PM", "Designer", "Dev", "QA", "Executive"],
    tagline: "How work flows from Backlog to Release across all three products.",
    summary: "This section defines the official product cycle for all work across the eCommerce site, Customer Portal, and Back Office. It establishes the sequence of stages every work item must pass through, the entry and exit criteria at each gate, who owns movement within each lane, and how release cadence operates across the three products.",
    workflowNote: "This workflow applies to all tracked work — Epics, Stories, and Tasks — regardless of size. The stage a ticket is in at any moment represents its current state of progress and signals who is responsible for it. No ticket moves forward without meeting the exit criteria of its current stage.",
    keyPoints: [
      { label: "16 Stages, 5 Lanes", detail: "Planning → Design → Development → QA → Release. Every stage has defined entry criteria, exit criteria, owner, and operational notes. No ticket advances without meeting exit criteria." },
      { label: "Lane Movement Rules", detail: "Team members move tickets within their own lane only. PM, Scrum Master, Department Directors, and Executives have cross-lane override rights. Every cross-lane move must include a Jira comment explaining the reason." },
      { label: "Dual Release Cadence", detail: "Weekly (minor/priority) and Monthly (major) — both run simultaneously. Priority determines the cadence target, not size alone. Quality gates do not flex for schedule pressure — a major feature that is not ready does not ship to meet a deadline." },
    ],
    stages: [
      { name: "Backlog", lane: "Planning", color: "#5D6D7E", owner: "Product Manager", entry: "Work item exists as an idea, request, or intake. Epic created in Jira with required custom fields.", exit: "BRD is complete, accepted by UX, and linked to the Epic. Ticket moves to Product Review.", notes: "This is the holding area. No design or dev work begins while a ticket is in Backlog. BRD rejection returns tickets here." },
      { name: "Product Review", lane: "Planning", color: "#5D6D7E", owner: "Product Manager", entry: "BRD has been submitted by PM and linked to the Jira Epic. UX Lead has been tagged for review.", exit: "UX Lead accepts the BRD within the defined SLA. Ticket advances to Design Review.", notes: "BRD review SLA clock starts here. If BRD is rejected, ticket returns to Backlog with comments. See Section 5.9 — Rejection Protocol." },
      { name: "Design Review", lane: "Design", color: "#2E86AB", owner: "UX Team", entry: "BRD accepted. Ticket enters UX queue. Senior Designer or Director of UX assigned.", exit: "UX team has reviewed scope, confirmed Workfront dependencies, and scheduled work. Ticket moves to Design Ready.", notes: "If Workfront requests are needed (copy, imagery, brand assets), they must be submitted here. Ticket is tagged with Workfront dependency blocker. See Section 7 — Creative & Workfront Integration." },
      { name: "Design Ready", lane: "Design", color: "#2E86AB", owner: "UX Team", entry: "Design scope confirmed. Designer assigned. Workfront requests submitted if applicable.", exit: "Active design work has begun. Ticket moves to Design In Progress.", notes: "Workfront blocker must be resolved or in active progress before Design In Progress can be entered for work dependent on creative assets." },
      { name: "Design In Progress", lane: "Design", color: "#1565C0", owner: "Senior Designer", entry: "Designer is actively working. Figma file created and linked to Jira ticket.", exit: "Designs are complete, annotated, and ready for review. Ticket moves to Design Approval.", notes: "Design work must reference the approved component library. Any deviations must be flagged to Director of UX before proceeding. See Section 10 — Design System Governance." },
      { name: "Design Approval", lane: "Design", color: "#0D47A1", owner: "Director of UX", entry: "Designs are complete and annotated in Figma. Director of UX or Senior Designer submits for approval.", exit: "Director of UX approves designs. Ticket advances to Dev Review. Approval window: 2 business days.", notes: "If designs are rejected, ticket returns to Design In Progress with specific comments in Figma and Jira. PM is notified of the return." },
      { name: "Dev Review", lane: "Development", color: "#1A7A4A", owner: "Dev Lead (Onshore or Offshore)", entry: "Design Approval complete. Figma specs and annotations are finalized. Dev Lead tagged in Jira.", exit: "Dev Lead approves designs as technically feasible OR returns to Design with specific comments. Window: 2 business days.", notes: "This is a feasibility checkpoint — not a design critique. Dev feedback must be specific, technical, and actionable. Vague rejections are not accepted." },
      { name: "Dev Ready", lane: "Development", color: "#155724", owner: "Dev Lead", entry: "Dev Review approved. Work is scheduled in the Dev queue by the Dev Lead.", exit: "Active development has begun. Ticket moves to Dev In Progress.", notes: "Offshore Dev Lead owns architecture and build across all products. Onshore Dev Lead owns CMS and content management work. Assignment is made at this stage." },
      { name: "Dev In Progress", lane: "Development", color: "#1B5E20", owner: "Offshore Dev Lead", entry: "Developer actively building. Jira ticket assigned to developer.", exit: "Build is complete, self-tested, and deployed to staging environment. Ticket moves to Dev Approval.", notes: "Developer must verify the build against acceptance criteria before moving to Dev Approval. UX may be consulted for design accuracy checks during this stage." },
      { name: "Dev Approval", lane: "Development", color: "#33691E", owner: "Dev Lead", entry: "Build deployed to staging. Developer has self-tested against acceptance criteria.", exit: "Dev Lead approves the build for QA. QA task is auto-created in Jira. Ticket moves to QA Stage. Window: 1 business day.", notes: "Dev Lead reviews both technical quality and design accuracy against Figma specs." },
      { name: "QA Stage", lane: "QA", color: "#B7770D", owner: "QA Team", entry: "Build deployed to staging. Dev Approval complete. QA task created and assigned.", exit: "QA testing complete in staging. All defects logged. Critical and high defects resolved and re-tested. Ticket moves to QA Prod.", notes: "QA tests against the acceptance criteria defined in the BRD. Any defect that does not match acceptance criteria is logged and returned to Dev In Progress for resolution." },
      { name: "QA Prod", lane: "QA", color: "#A0522D", owner: "QA Team", entry: "QA Stage sign-off complete. Build deployed to production environment.", exit: "QA smoke test in production complete. No critical defects found. Ticket moves to UAT.", notes: "QA Prod is a smoke test — not a full regression. It confirms the production deployment matches the staging-approved build." },
      { name: "UAT", lane: "QA", color: "#6D4C41", owner: "QA Team + PM", entry: "QA Prod complete. UAT participants identified (internal users for Back Office; PM + stakeholders for eCommerce and Portal).", exit: "UAT sign-off received. All UAT feedback resolved or formally deferred. Ticket moves to PM Approval.", notes: "Back Office UAT must include at least one internal qualifying customer representative. UAT feedback that cannot be resolved before release must be formally logged as a follow-up Epic." },
      { name: "PM Approval", lane: "Release", color: "#A93226", owner: "Product Manager", entry: "UAT complete and signed off. All release criteria met.", exit: "PM formally approves the release. Ticket moves to Executive Review (if triggered) or directly to Release. Window: 1 business day.", notes: "PM Approval is the final quality gate before release. PM confirms scope was delivered as defined in the BRD, all acceptance criteria are met, and no open critical defects exist." },
      { name: "Executive Review", lane: "Release (Conditional)", color: "#7B241C", owner: "Executive Stakeholder or Delegated Director", entry: "PM Approval complete. Executive Review triggered by Tier 2+, cross-product impact, new journey, or strategic risk flag.", exit: "Executive Stakeholder or delegated Director approves release. Window: 2 business days.", notes: "Not required for every release. Trigger criteria defined in Section 4.6 — Executive Review Delegation. If not triggered, ticket bypasses this stage and moves directly from PM Approval to Release." },
      { name: "Released", lane: "Release", color: "#145A32", owner: "Product Manager + Dev Lead", entry: "All approvals complete. Release checklist confirmed. Deploy window scheduled.", exit: "Build deployed to production. Release notes published in Confluence. Jira Epic closed. Stakeholders notified.", notes: "Post-release defect escalation protocol is active for 48 hours after release. PM owns defect triage. Critical post-release defects trigger an emergency hotfix cycle." },
    ],
    laneMovement: [
      { lane: "Planning Lane", stages: "Backlog → Product Review", owner: "Product Manager / Scrum Master", override: "PM, Scrum Master, Department Director, Executive" },
      { lane: "Design Lane", stages: "Design Review → Design Ready → In Progress → Approval", owner: "UX Team (Senior Designer / Dir UX)", override: "PM, Scrum Master, Department Director, Executive" },
      { lane: "Dev Lane", stages: "Dev Review → Dev Ready → In Progress → Dev Approval", owner: "Dev Team (Onshore or Offshore)", override: "PM, Scrum Master, Department Director, Executive" },
      { lane: "QA Lane", stages: "QA Stage → QA Prod → UAT", owner: "QA Team", override: "PM, Scrum Master, Department Director, Executive" },
      { lane: "Release Lane", stages: "PM Approval → Executive Review → Release", owner: "Product Manager", override: "PM, Scrum Master, Department Director, Executive" },
    ],
    laneOverrideRules: [
      "PM and Scrum Master may move tickets across any lane at any time to unblock a stall or correct a misplaced ticket.",
      "Department Directors and Executives may move tickets across lanes when exercising their approval authority.",
      "A cross-lane move must always be accompanied by a Jira comment explaining the reason for the move.",
      "Cross-lane moves that skip a required gate (e.g., moving from Design Approval directly to Dev Ready without Dev Review) are not permitted under any circumstance.",
    ],
    releaseCadence: [
      { type: "Minor Update", cadence: "Weekly", examples: "Bug fixes, copy updates, small UI tweaks, CMS content updates", approval: "PM Approval", execReview: "No", brd: "Tier 1 BRD or no BRD if publishing-only" },
      { type: "Standard Feature", cadence: "Weekly or Monthly", examples: "New feature, feature change, component update", approval: "PM Approval", execReview: "Conditional", brd: "Tier 1 BRD required" },
      { type: "Major Feature / Initiative", cadence: "Monthly", examples: "New journey, cross-product impact, large feature", approval: "PM Approval + Exec Review", execReview: "Yes (Tier 2+)", brd: "Tier 2 or Tier 3 BRD required" },
      { type: "Publishing-Only", cadence: "Anytime", examples: "No dev work — content, copy, or asset publish only", approval: "Director or PM", execReview: "No", brd: "Fast-track lane — no BRD required" },
    ],
    crossProduct: [
      { workType: "Single-product work", board: "Assigned to that product\'s board", ticket: "Standard Epic → Story → Task hierarchy", jiraField: "Product Area field set to single product" },
      { workType: "Cross-product work", board: "Parent Epic on program-level board, child tickets on each product board", ticket: "Parent Epic links to child Epics per product", jiraField: "Product Area field set to all impacted products" },
      { workType: "Publishing-only work", board: "PM\'s planning board", ticket: "Task only — no Epic or Story needed", jiraField: "Approval Tier = Publishing" },
      { workType: "Workfront-dependent work", board: "Assigned product board + Workfront tag", ticket: "Standard hierarchy + Workfront dependency tag", jiraField: "Blocked status active until Workfront resolves" },
    ],
    doneDefinitions: [
      { level: "Task", definition: "The specific work defined in the task has been completed, reviewed by the responsible party, and the Jira ticket has been moved to the appropriate completion stage. All comments and decisions are documented in the ticket." },
      { level: "Story", definition: "All child tasks are done. The story\'s acceptance criteria are met and verified. The story has passed QA Stage and the build is confirmed in the staging environment." },
      { level: "Epic", definition: "All child stories and tasks are done. The full feature has passed QA Prod and UAT. PM Approval (and Executive Review if triggered) are complete. The Epic has been released to production, release notes are published in Confluence, and the Jira Epic is closed." },
      { level: "Release", definition: "All Epics and Stories included in the release window are done. The production deployment is confirmed. Stakeholders are notified. Post-release monitoring is active for 48 hours. No open critical defects exist." },
    ],
    quickRef: [
      { topic: "Total Stages", standard: "16 stages: Backlog → Product Review → Design Review → Design Ready → Design In Progress → Design Approval → Dev Review → Dev Ready → Dev In Progress → Dev Approval → QA Stage → QA Prod → UAT → PM Approval → Executive Review → Release" },
      { topic: "Number of Lanes", standard: "5 — Planning, Design, Development, QA, Release" },
      { topic: "Lane Movement", standard: "Team members move tickets within their own lane only" },
      { topic: "Cross-Lane Movement", standard: "PM, Scrum Master, Department Directors, Executives only — with Jira comment required" },
      { topic: "Publishing Fast Track", standard: "Backlog → PM/Director Approval → Publish → Confirm & Close — no BRD required" },
      { topic: "Release Cadence", standard: "Weekly (minor/priority) and Monthly (major) — simultaneous. Priority determines cadence target." },
      { topic: "Cross-Product Tracking", standard: "Parent Epic on program board, child Epics on each product board. PM owns synchronization." },
      { topic: "Definition of Done", standard: "Released to production, confirmed, release notes published in Confluence, Jira Epic closed" },
      { topic: "Post-Release Monitoring", standard: "48 hours active after every release. PM owns defect triage. Critical defects trigger hotfix cycle." },
    ],
    accordions: [
      { title: "3.3 Publishing-Only Fast Track — Full Rules", content: "Fast-track is not a shortcut around process — it is a separate, appropriate process for a different type of work. Misclassifying a development change as publishing-only to skip the cycle is a process violation and will result in the ticket being returned and reclassified. Sequence: Publishing Request (Backlog) → PM or Director Approval → Publish → Confirm & Close. No BRD required. Jira Task (not Epic or Story) created with Approval Tier = Publishing. Onshore Dev Lead or CMS owner executes the publish. Confirmation screenshot or audit log added to Jira ticket before closure." },
      { title: "3.4 Cross-Lane Override Rules — Detail", content: "Moving a ticket to the next stage is not administrative — it is a declaration that the exit criteria for the current stage have been met. Never move a ticket forward because it is convenient. Move it forward because it is ready. Four override rules: (1) PM and Scrum Master may move across any lane to unblock or correct. (2) Department Directors and Executives may move when exercising approval authority. (3) Every cross-lane move requires a Jira comment. (4) Moves that skip a required gate are not permitted under any circumstance." },
      { title: "3.5 Release Cadence — Key Rules", content: "A minor update elevated to Critical priority may ship in the weekly window even if originally planned for monthly. A major feature that is not ready does not ship to meet a monthly deadline — quality gates do not flex for schedule pressure. See the Release Cadence table for full breakdown by type, cadence, approval required, and BRD requirement." },
      { title: "3.6 Cross-Product Work — Full Rules", content: "Cross-product Epics must tag all impacted Product Area values in the Jira custom field. The PM who owns the parent Epic is responsible for keeping all child Epics synchronized. Milestone updates must be reflected on all boards — not just the parent. A single initiative impacting all three products gets one BRD with cross-product scope defined explicitly — not three separate BRDs. See Section 8 — Jira Configuration Guide for board setup." },
    ]
  },
  {
    id: "s4", num: "04", title: "Roles & Ownership (DRAC)", icon: "Users",
    roles: ["PM", "Designer", "Dev", "QA", "Executive"],
    tagline: "A modern hybrid accountability model replacing traditional  DRAC. One Driver. One Accountable. Reviewers with teeth. Contributors who cannot block.",
    summary: "This section defines who drives work, who holds final accountability, who has veto power with a time limit, and who contributes without blocking — across all three products. The DRAC model eliminates the decision paralysis caused by open-ended Consulted tags by replacing them with timeboxed Reviewers and non-blocking Contributors.",
    decisionRule: "Every activity in the product cycle has exactly one Driver and exactly one Accountable party. Reviewers must provide evidence-backed feedback within 48 hours or silence equals proceed. Contributors provide input but cannot block forward movement under any circumstances.",
    keyPoints: [
      { label: "D — Driver", detail: "The must-go person. Owns forward momentum and is responsible for ensuring the activity reaches completion — not just doing the work but ensuring it gets done. Typically PM or Sr. Designer. One Driver per activity. If the Driver changes mid-cycle, ownership must be explicitly re-assigned in the Jira ticket." },
      { label: "R — Reviewer", detail: "Must-input parties with veto power. Strictly limited to 2 per activity maximum. Veto must be supported with documented evidence within 48 hours — silence equals proceed. Reviewers cannot delay work indefinitely. Their role is to catch real problems, not to manage comfort." },
      { label: "A — Accountable", detail: "One head. Final sign-off on the outcome. Exactly one Accountable party per activity — no exceptions. Shared accountability is no accountability. The Accountable party is answerable for the quality and completeness of the outcome, not just the process." },
      { label: "C — Contributor", detail: "Provides assets, feedback, or context. Cannot block forward movement. No timebox obligation — their input is welcome but not required for work to proceed. Sr. Manager Marketing Ops, downstream teams, and Executives on non-strategic activities all operate as Contributors." },
    ],
    dracLegend: [
      { code: "D", role: "Driver", meaning: "Owns forward momentum. One per activity.", timebox: "N/A — they move it forward", color: "#1565C0" },
      { code: "R", role: "Reviewer", meaning: "Veto power. Veto requires evidence within 48hrs. Max 2 per activity.", timebox: "48hrs — silence = proceed", color: "#A93226" },
      { code: "A", role: "Accountable", meaning: "Final sign-off. Exactly one per activity. No exceptions.", timebox: "Tier-dependent", color: "#1E3A5F" },
      { code: "C", role: "Contributor", meaning: "Input or assets. Cannot block. No obligation timebox.", timebox: "None", color: "#6B778C" },
    ],
    decisionTiers: [
      { tier: "Executional", risk: "Low", description: "Fully owned at the Sr. Designer or Dev Lead level. Covers how work is carried out within agreed scope — component choices, implementation methods, acceptance criteria language.", owner: "Sr. Designer (design) / Dev Lead (engineering) / QA Lead (testing)", rule: "No escalation required. No Executive Review. No silent approval timebox — the Driver proceeds at their own judgment within the agreed scope.", examples: "Choosing a component approach in Figma, selecting a technical implementation method, writing acceptance criteria phrasing, ordering test cases." },
      { tier: "Tactical", risk: "Medium", description: "Owned by PM Lead or Director of UX. Covers how a feature is scoped, sequenced, or resourced. The 48hr silent approval rule applies — Reviewers must provide evidence-backed feedback or work proceeds.", owner: "PM Lead or Director of UX", rule: "48hr silent approval. If a Reviewer does not provide documented feedback within 48hrs, the Driver proceeds as if approval is granted. No manual Slack escalation required.", examples: "Prioritizing one feature over another, adjusting release scope, resolving a cross-team dependency conflict, BRD tier assignment." },
      { tier: "Strategic", risk: "High", description: "Triggers Executive Stakeholder involvement. No time limit — the decision waits for the Executive. At 48hrs without resolution, direct reports of the Executive Stakeholder are notified with a written impact brief to identify unblocking paths.", owner: "Executive Stakeholder", rule: "No time limit. At 48hrs, direct reports notified with written impact assessment. They present unblocking options to the Executive. Work does not proceed without Executive sign-off.", examples: "Launching a new product area, rebranding a product experience, changing core checkout flow architecture, any initiative crossing all three products simultaneously." },
    ],
    roles_detail: [
      { role: "Product Manager", detail: "Drives BRD creation, Epic management, and delivery timelines. Accountable for scope definition and cross-team coordination. Serves as Reviewer on Executive Review activities — must present the evidence package when escalating to Executive level.", sectionId: "s5", sectionLabel: "Section 5 — BRD Standards & Requirements" },
      { role: "Director of UX", detail: "Accountable for all UX output quality, design system governance, and UX team operations. Serves as Reviewer on BRD review, Dev Review, and QA activities. Drives the post-release retrospective.", sectionId: "s10", sectionLabel: "Section 10 — Design System Governance" },
      { role: "Senior Designer", detail: "Drives day-to-day design execution across assigned products. Drives Design In Progress and the Workfront request submission. Acts as Reviewer on QA Stage for design accuracy.", sectionId: "s6", sectionLabel: "Section 6 — Handoff Standards" },
      { role: "Onshore Dev Lead", detail: "Drives CMS tooling and content management decisions. Acts as Architecture Peer Reviewer on Dev In Progress for CMS-adjacent impact — specifically reviews when Offshore Lead is building features that touch CMS or content publishing.", sectionId: "s8", sectionLabel: "Section 8 — Jira Configuration Guide" },
      { role: "Offshore Dev Lead", detail: "Drives architecture and build across all three products. Primary Driver for cart & checkout, portal infrastructure, and back office development. Accountable for Dev In Progress execution.", sectionId: "s8", sectionLabel: "Section 8 — Jira Configuration Guide" },
      { role: "QA Team / QA Lead", detail: "Drives QA Stage and QA Prod testing. Accountable for test sign-off. Acts as Reviewer on PM Approval — must confirm all acceptance criteria passed before PM proceeds.", sectionId: "s5", sectionLabel: "Section 5 — BRD Standards & Requirements" },
      { role: "Sr. Manager, Marketing Ops", detail: "Contributor on all product cycle activities. Acts as Reviewer specifically on Workfront request submission — approves or returns requests within 2 business days. Cannot block any other activity.", sectionId: "s7", sectionLabel: "Section 7 — Creative & Workfront Integration" },
      { role: "Executive Stakeholder", detail: "Accountable for Strategic decisions. Contributor on non-strategic activities — informed but not blocking. At 48hrs without resolution on Strategic decisions, direct reports are notified with a written impact brief to identify unblocking paths.", sectionId: null, sectionLabel: null },
      { role: "PM Lead", detail: "Accountable for BRD acceptance standards and delivery coordination. Reviewer on Post-release retrospective. Notified at 48hrs when an Executive decision is unresolved — responsible for presenting unblocking options.", sectionId: null, sectionLabel: null },
    ],
    dracMatrix: [
      {
        phase: "PLANNING", tier: "Tactical", tierRisk: "Medium",
        activity: "Create & submit BRD (incl. acceptance criteria, scope, Workfront dependencies)",
        driver: "PM", reviewer: "Dir UX", accountable: "PM Lead", contributor: "Sr Des, Dev Lead",
        note: "PM owns completeness. Director of UX reviews for design feasibility before the Epic can advance. Dev Lead contributes technical constraints as a non-blocking input.",
        vetoNote: "Dir UX veto: must cite a specific missing BRD section per Section 5.3 — Required Sections by Tier. Vague concerns do not block.",
        sectionId: "s5"
      },
      {
        phase: "PLANNING", tier: "Tactical", tierRisk: "Medium",
        activity: "Review, accept, or reject BRD (incl. Discovery Meeting if triggered)",
        driver: "Dir UX", reviewer: "Dev Lead", accountable: "Dir UX", contributor: "PM, QA",
        note: "Dir UX drives the review and is Accountable for the accept/reject decision. Dev Lead has Reviewer rights on technical feasibility only. Discovery Meeting is a sub-event of rejection — not a separate activity.",
        vetoNote: "Dev Lead veto: must cite a specific technical constraint or integration risk. Cannot veto on scope preference.",
        sectionId: "s5"
      },
      {
        phase: "DESIGN", tier: "Executional", tierRisk: "Low",
        activity: "Design Review + Workfront submission",
        driver: "Sr Designer", reviewer: "Dir UX, Sr Mgr MO†", accountable: "Dir UX", contributor: "PM",
        note: "Sr Designer drives scope confirmation and Workfront request submission. All Workfront requests must be submitted here — not mid-design. † Sr Mgr Marketing Ops is Reviewer for the Workfront request only.",
        vetoNote: "Dir UX veto: must cite a design constraint or missing dependency per Section 6 — Handoff Standards. Sr Mgr MO veto on Workfront: must cite a missing required field per Section 7.3.",
        sectionId: "s7"
      },
      {
        phase: "DESIGN", tier: "Executional", tierRisk: "Low",
        activity: "Design In Progress",
        driver: "Sr Designer", reviewer: "Dir UX", accountable: "Dir UX", contributor: "—",
        note: "Sr Designer drives execution. No other blocking parties. All components must be sourced from the approved library. Deviations must be flagged to Dir UX before proceeding.",
        vetoNote: "Dir UX veto: must cite a specific library standard or token rule per Section 10 — Design System Governance.",
        sectionId: "s10"
      },
      {
        phase: "DESIGN", tier: "Tactical", tierRisk: "Medium",
        activity: "Design Approval",
        driver: "Dir UX", reviewer: "PM", accountable: "Dir UX", contributor: "Dev Lead",
        note: "Dir UX drives and is Accountable. PM reviews for BRD scope alignment — if designs have drifted from accepted scope, PM may veto. Dev Lead contributes feasibility notes as non-blocking input.",
        vetoNote: "PM veto: must cite a specific scope item from the accepted BRD that the design does not address or contradicts.",
        sectionId: "s5"
      },
      {
        phase: "DEVELOPMENT", tier: "Executional", tierRisk: "Low",
        activity: "Dev Review — feasibility check on designs",
        driver: "Dev Lead", reviewer: "Dir UX", accountable: "Dev Lead", contributor: "PM",
        note: "Dev Lead drives feasibility assessment and is Accountable. Dir UX has Reviewer rights on the design impact of any feasibility constraints. Architecture Peer Review applies when Offshore Dev is building CMS-adjacent features.",
        vetoNote: "Dir UX veto: must cite a specific design standard or accessibility requirement that the proposed feasibility constraint would violate.",
        sectionId: "s6"
      },
      {
        phase: "DEVELOPMENT", tier: "Executional", tierRisk: "Low",
        activity: "Dev In Progress",
        driver: "Off Dev Lead", reviewer: "On Dev Lead†", accountable: "Off Dev Lead", contributor: "Sr Des",
        note: "Offshore Dev Lead drives build execution and is Accountable. † Onshore Dev Lead is Reviewer for CMS-adjacent impact only (Architecture Peer Review — Section 4.6). Sr Designer contributes design accuracy checks as non-blocking input.",
        vetoNote: "On Dev Lead veto: must cite a specific CMS integration risk or architectural standard conflict. Cannot veto on general preference.",
        sectionId: null
      },
      {
        phase: "DEVELOPMENT", tier: "Tactical", tierRisk: "Medium",
        activity: "Dev Approval",
        driver: "Dev Lead", reviewer: "Dir UX", accountable: "Dev Lead", contributor: "PM, QA",
        note: "Dev Lead drives and is Accountable for build quality. Dir UX has Reviewer veto specifically for design accuracy against the Figma spec. PM and QA contribute readiness context as non-blocking.",
        vetoNote: "Dir UX veto: must reference specific Figma frame and describe the visual deviation. General style concerns do not qualify.",
        sectionId: "s6"
      },
      {
        phase: "QA", tier: "Executional", tierRisk: "Low",
        activity: "QA Stage — staging environment",
        driver: "QA Lead", reviewer: "Sr Des", accountable: "QA Lead", contributor: "Dev Lead",
        note: "QA Lead drives staging testing and is Accountable for sign-off. Sr Designer has Reviewer veto specifically for design accuracy defects — not general UX preference. Dev Lead contributes defect context as non-blocking.",
        vetoNote: "Sr Des veto: must cite a specific Figma spec discrepancy or approved design token violation. Cannot veto based on aesthetic preference.",
        sectionId: "s6"
      },
      {
        phase: "QA", tier: "Tactical", tierRisk: "Medium",
        activity: "QA Prod + UAT",
        driver: "QA Lead", reviewer: "PM", accountable: "QA Lead", contributor: "Sr Des",
        note: "QA Lead drives production smoke test and UAT coordination. PM reviews scope delivery against the BRD — confirms that what shipped matches what was accepted. Sr Designer contributes visual spot-check as non-blocking.",
        vetoNote: "PM veto: must cite a specific BRD acceptance criterion that the build fails to meet. General scope discomfort does not qualify.",
        sectionId: "s5"
      },
      {
        phase: "RELEASE", tier: "Tactical", tierRisk: "Medium",
        activity: "PM Approval",
        driver: "PM", reviewer: "QA Lead", accountable: "PM", contributor: "Dir UX",
        note: "PM drives the go/no-go release decision and is Accountable. QA Lead has Reviewer veto — must confirm all acceptance criteria passed before PM proceeds. Dir UX contributes a final design quality signal as non-blocking.",
        vetoNote: "QA Lead veto: must cite open critical or high defects by Jira ticket ID, or specify which acceptance criterion has not been met.",
        sectionId: "s6"
      },
      {
        phase: "RELEASE (STRATEGIC)", tier: "Strategic", tierRisk: "High",
        activity: "Executive Review — conditional on Strategic tier",
        driver: "PM", reviewer: "PM†", accountable: "Exec Stakeholder", contributor: "Dir UX",
        note: "Triggered by Tier 2+ BRD, cross-product impact, new journey, or strategic risk. PM drives the evidence package. † PM serves as Reviewer in the specific sense of presenting and defending the impact brief to the Executive. No time limit. At 48hrs, Executive direct reports are notified to identify unblocking paths.",
        vetoNote: "No 48hr silent approval on Strategic decisions. Executive veto is unconditional. PM must present a complete written evidence package: decision, options, recommendation, and cost of delay.",
        sectionId: "s5"
      },
      {
        phase: "RELEASE", tier: "Tactical", tierRisk: "Medium",
        activity: "Deploy to Production + Release communication",
        driver: "PM", reviewer: "Dev Lead", accountable: "PM", contributor: "All Leads",
        note: "PM drives and is Accountable for coordinating deployment and stakeholder communication. Dev Lead has Reviewer veto on deployment readiness. All Leads contribute to release communication as non-blocking.",
        vetoNote: "Dev Lead veto: must cite a specific deployment risk, environment instability, or unresolved critical defect by ticket ID.",
        sectionId: null
      },
      {
        phase: "POST-RELEASE", tier: "Executional", tierRisk: "Low",
        activity: "Post-release defect escalation",
        driver: "PM", reviewer: "Dev Lead", accountable: "PM", contributor: "QA Lead, Dir UX",
        note: "PM drives defect triage and is Accountable. Dev Lead has Reviewer veto on severity classification — if Dev Lead classifies a defect as low and PM or QA believe it is critical, Dev Lead must document the classification rationale. QA and Dir UX contribute context as non-blocking.",
        vetoNote: "Dev Lead veto on severity: must provide documented rationale citing user impact scope, blast radius, and workaround availability.",
        sectionId: null
      },
      {
        phase: "POST-RELEASE", tier: "Tactical", tierRisk: "Medium",
        activity: "Post-release retrospective",
        driver: "Dir UX", reviewer: "PM Lead", accountable: "Dir UX", contributor: "All Leads",
        note: "Dir UX drives and is Accountable for retrospective facilitation and process change proposals. PM Lead has Reviewer veto on process change proposals — ensures proposed changes align with delivery commitments. All Leads contribute as non-blocking participants.",
        vetoNote: "PM Lead veto: must cite a specific delivery impact or resource constraint that the proposed process change would create.",
        sectionId: null
      },
    ],
    silentApprovalRule: {
      title: "48-Hour Silent Approval Rule",
      applies: "All Tactical-tier activities and all Reviewer roles except Executive Review",
      rule: "If a Reviewer does not provide documented, evidence-backed feedback within 48 business hours of being tagged, the Driver proceeds as if the review was approved. The absence of a veto is not passive — it is an active signal that the Reviewer has no blocking concern.",
      vetoRequirements: [
        "The veto must be posted as a comment on the Jira ticket — not delivered verbally or via Slack.",
        "The veto must reference the specific criterion, standard, or documented constraint being violated.",
        "Vague objections (e.g., 'I\'m not comfortable with this') are not valid vetoes. They must cite a specific standard.",
        "If the veto is valid, the Driver must address it before proceeding. If disputed, it escalates to the Accountable party for resolution — not upward to Executive.",
      ],
    },
    escalationPath: [
      { step: "Step 1 — 0 to 48hrs", detail: "Executive Stakeholder holds the Strategic decision. PM assembles the written evidence package: what is the decision, what are the options, what is the recommended path, and what is the cost of delay. PM shares this directly with the Executive Stakeholder.", applicableTo: "Strategic decisions only" },
      { step: "Step 2 — 48hrs+", detail: "If no resolution, PM notifies the Executive Stakeholder's direct reports with the full written impact brief. Direct reports identify unblocking paths and bring options back to the Executive. Work does not proceed. No time limit beyond this point — the decision waits for the Executive.", applicableTo: "Strategic decisions only — no auto-proceed" },
    ],
    fastTrackDRAC: {
      title: "Fast-Track Publishing Lane — DRAC Applied",
      note: "For publishing-only updates, the DRAC model is stripped to its minimum. No Reviewer required. PM is both Driver and Accountable. No Dev or QA involvement.",
      rows: [
        { activity: "Publishing request created", driver: "PM", reviewer: "—", accountable: "PM", contributor: "—" },
        { activity: "Content/asset publish", driver: "On Dev / CMS Owner", reviewer: "—", accountable: "PM", contributor: "—" },
        { activity: "Publish confirmation", driver: "PM", reviewer: "—", accountable: "PM", contributor: "—" },
      ],
    },
    arcPeerReview: {
      title: "Architecture Peer Review — Onshore / Offshore",
      note: "When the Offshore Dev Lead builds features with CMS-adjacent impact, the Onshore Dev Lead acts as a scoped Reviewer — not a general Consulted party. This is targeted Architecture Peer Review, not open-ended consultation.",
      triggers: [
        "Any Portal or Back Office feature that touches CMS content management or publishing tooling.",
        "Any eCommerce feature that changes how the Offshore-owned checkout system integrates with Onshore-owned CMS.",
        "Any feature that requires both Onshore and Offshore Dev to modify shared infrastructure.",
      ],
      rule: "Onshore Dev Lead has 48hrs to flag CMS-adjacent impact concerns. Silence = proceed. Veto must cite a specific architectural standard or integration risk.",
    },
    quickRef: [
      { topic: "Model name", standard: "DRAC — Driver, Reviewer, Accountable, Contributor" },
      { topic: "Max Reviewers per activity", standard: "2 — strictly enforced to prevent decision paralysis" },
      { topic: "Reviewer timebox", standard: "48 business hours — silence = proceed. Veto must be evidence-backed and posted in Jira." },
      { topic: "Executional decisions", standard: "Owned entirely by Sr. Designer or Dev Lead — no escalation, no Executive Review" },
      { topic: "Tactical decisions", standard: "PM Lead or Director of UX — 48hr silent approval applies" },
      { topic: "Strategic decisions", standard: "Executive Stakeholder — no time limit. At 48hrs, direct reports notified to unblock." },
      { topic: "Fast-track publishing", standard: "PM is Driver + Accountable. No Reviewer. No Dev or QA. See Section 3.3 — Publishing-Only Fast Track.", sectionId: "s3" },
      { topic: "Architecture Peer Review", standard: "Onshore Dev Lead = scoped Reviewer for CMS-adjacent impact only. 48hr timebox applies." },
      { topic: "Executive Review trigger", standard: "Strategic tier only — Tier 2+ BRD, cross-product, new journey, or strategic risk flag. See Section 5 — BRD Standards.", sectionId: "s5" },
      { topic: "Silent approval scope", standard: "Tactical activities and all Reviewer roles except Executive Review" },
    ],
    accordions: [
      { title: "Why DRAC Replaces  DRAC Here", content: " DRAC's core structural problem is that 'Consulted' (C) has no timebox and no teeth. Any Consulted party can delay work indefinitely simply by not responding or by raising concerns without evidence. In a 3–5 person team operating across three products simultaneously, this creates the decision paralysis documented throughout this guide. DRAC solves it in three ways: (1) Reviewer replaces Consulted with a 48hr timebox and evidence requirement. (2) Contributor replaces Informed for parties who provide input but hold no blocking power. (3) Driver replaces Responsible to emphasize that one person owns forward momentum — not just task completion." },
      { title: "The Veto Evidence Standard in Practice", content: "A valid veto cites a specific standard. Examples of valid vetoes: 'This BRD is missing the acceptance criteria required by Section 5.3.' 'This design uses a color not in the ratified token set per Section 10.2.' 'This build does not match the Figma spec on the error state — see Figma frame [link].' Examples of invalid vetoes: 'I\'m not sure about this direction.' 'I\'d like more time to review.' 'Can we revisit in our next sync?' Invalid vetoes do not stop the Driver from proceeding after 48hrs." },
      { title: "4.6 Executive Review — No Time Limit Rationale", content: "Strategic decisions affecting brand direction, cross-product architecture, or new product areas carry a level of organizational consequence that cannot be resolved on an arbitrary clock. A 2-business-day window created a false urgency that sometimes resulted in poorly considered approvals. Under DRAC, the Executive holds the decision as long as the decision requires — but they do not hold it in silence. At 48hrs, direct reports are notified with a full written impact brief. Their job is to identify unblocking paths, not to override the Executive. The Executive remains the sole Accountable party." },
      { title: "4.7 What Changed From the Previous  DRAC", content: "Key changes: (1) 25 rows → 15 rows. Discovery Meeting, Workfront submission, and Dev Ready scheduling merged into parent activities. (2) Multiple C tags per row eliminated — now max 2 Reviewers per activity. (3) Sr. Manager Marketing Ops moved from I (Informed) to C (Contributor) everywhere except Workfront review. (4) Executive Stakeholder moved from I to C on non-strategic activities. (5) Silent approval rule formally codified — no more manual Slack escalation for Tactical decisions. (6) Onshore/Offshore relationship restructured from mutual C tags to scoped Architecture Peer Review with Reviewer rights and 48hr timebox." },
    ]
  },
  {
    id: "s5", num: "05", title: "BRD Standards & Requirements", icon: "FileText",
    roles: ["PM", "Designer"],
    tagline: "The foundational contract between the requesting team and UX, Design, and Development.",
    summary: "The Business Requirements Document (BRD) is the single most critical artifact in the product cycle — when it is incomplete, every downstream team absorbs the cost in rework, delays, and misaligned output. This section defines what a complete BRD must contain, who is responsible for each part, how it is submitted and reviewed, and what happens when it does not meet the standard.",
    gateNote: "A BRD is not a suggestion or a rough outline. It is a gate. Work does not enter the UX queue until the BRD has been reviewed and accepted. This standard exists to protect every team\'s time and the quality of every product we ship.",
    keyPoints: [
      { label: "Tier 1 — Standard", detail: "New features, feature changes, or component updates. Impacts an existing user journey without introducing a new one. Scope is contained to a single product area. Examples: updating a checkout flow step, adding a filter to a product listing, modifying a portal dashboard widget." },
      { label: "Tier 2 — Complex", detail: "New user journeys or flows, cross-product impact, or work that touches multiple teams simultaneously. Examples: redesigning the onboarding flow, introducing a new account management section in the portal, a feature that affects both the eCommerce site and the back office." },
      { label: "Tier 3 — Major Initiative", detail: "New product areas, large-scale initiatives, platform-level changes, or work with a multi-month implementation roadmap. Requires a scaling plan and phased delivery strategy. Examples: launching a new product vertical, rebuilding the back office architecture, introducing a new customer-facing portal module from scratch." },
    ],
    brdPurpose: [
      "It communicates what the business needs and why it matters.",
      "It defines the scope, constraints, and success criteria before any design or development work begins.",
      "It creates shared accountability — the PM owns its completeness, UX validates its design scope, and Dev confirms technical feasibility before work is scheduled.",
    ],
    required_sections: [
      { section: "Business Objective & Problem Statement", tier1: "Required", tier2: "Required", tier3: "Required" },
      { section: "Success Metrics & KPIs", tier1: "Required", tier2: "Required", tier3: "Required" },
      { section: "Scope Definition (what is IN and OUT)", tier1: "Required", tier2: "Required", tier3: "Required" },
      { section: "Discovery & User Research Findings", tier1: "Recommended", tier2: "Required", tier3: "Required" },
      { section: "Technical Requirements & Constraints", tier1: "Required", tier2: "Required", tier3: "Required" },
      { section: "Design Specifications & Known Constraints", tier1: "Required", tier2: "Required", tier3: "Required" },
      { section: "Acceptance Criteria for QA", tier1: "Required", tier2: "Required", tier3: "Required" },
      { section: "Impacted Products / Systems", tier1: "Required", tier2: "Required", tier3: "Required" },
      { section: "Stakeholder & Approver List", tier1: "Required", tier2: "Required", tier3: "Required" },
      { section: "Dependencies (internal & external)", tier1: "Recommended", tier2: "Required", tier3: "Required" },
      { section: "Scaling Roadmap & Phased Delivery Plan", tier1: "N/A", tier2: "Recommended", tier3: "Required" },
      { section: "Risk Assessment", tier1: "N/A", tier2: "Recommended", tier3: "Required" },
      { section: "Content & Copy Requirements (Workfront)", tier1: "If applicable", tier2: "If applicable", tier3: "Required" },
    ],
    sectionDefinitions: [
      { name: "Business Objective & Problem Statement", definition: "A clear, concise explanation of the business problem being solved. Must answer: What is broken or missing? Why does it matter to the business? What happens if we do not address it? This section may not be vague or aspirational — it must be specific and tied to a measurable outcome." },
      { name: "Success Metrics & KPIs", definition: "Quantifiable measures that define what success looks like when the work is complete. Must include at least one primary metric and one secondary metric. Examples: increase cart conversion rate by 5%, reduce support tickets related to X by 20%, achieve a task completion rate of 85% in user testing." },
      { name: "Scope Definition", definition: "An explicit list of what is included in this request AND what is explicitly excluded. Both are required. The out-of-scope section protects the team from scope creep and sets expectations with stakeholders before design begins." },
      { name: "Discovery & User Research Findings", definition: "Any existing data, user research, analytics, support ticket trends, or competitive analysis that informs the request. If no research exists, this must be stated explicitly and a recommendation for a discovery phase should be made prior to full BRD submission for Tier 2 and Tier 3 requests." },
      { name: "Technical Requirements & Constraints", definition: "A summary provided by or validated with the Development team confirming what is technically feasible, what systems are impacted, what integrations are involved, and any constraints that will limit design options. This section requires Dev input before submission — it may not be left blank or marked TBD." },
      { name: "Design Specifications & Known Constraints", definition: "Any known design constraints that must be respected — branding requirements, existing component library limitations, platform-specific considerations (mobile vs. desktop), accessibility standards, or creative direction dependencies. If Workfront requests for copy, imagery, or brand assets will be required, this must be noted here. See Section 7 — Creative & Workfront Integration." },
      { name: "Acceptance Criteria for QA", definition: "A specific, testable list of conditions that must be true for the work to be considered complete. Written in the format: Given [context], when [action], then [expected result]. These criteria become the QA test plan. Vague criteria such as \'it should work correctly\' are not acceptable." },
      { name: "Scaling Roadmap & Phased Delivery Plan", definition: "Required for Tier 3 initiatives. Defines how a large effort will be broken into phases, what ships in each phase, what dependencies exist between phases, and how the team will validate each phase before proceeding. This plan must be realistic and account for the team\'s current weekly and monthly release cadence. See Section 3.5 — Release Cadence." },
    ],
    ownership: [
      { section: "Business Objective & Problem Statement", author: "Product Manager", input: "Business Stakeholder", validator: "PM Lead" },
      { section: "Success Metrics & KPIs", author: "Product Manager", input: "Business Stakeholder", validator: "PM Lead" },
      { section: "Scope Definition", author: "Product Manager", input: "UX Lead", validator: "PM Lead" },
      { section: "Discovery & Research Findings", author: "Product Manager", input: "UX Lead", validator: "UX Lead" },
      { section: "Technical Requirements & Constraints", author: "Product Manager", input: "Dev Lead", validator: "Dev Lead" },
      { section: "Design Specifications & Constraints", author: "UX Lead", input: "PM + Dev", validator: "UX Lead" },
      { section: "Acceptance Criteria for QA", author: "Product Manager", input: "QA + UX + Dev", validator: "QA Lead" },
      { section: "Scaling Roadmap", author: "Product Manager", input: "Dev Lead + UX Lead", validator: "Director of UX" },
      { section: "Content & Copy Requirements", author: "Product Manager", input: "UX Lead", validator: "UX Lead" },
    ],
    whereItLives: [
      "PM creates a Jira Epic and fills in all required custom fields including Tier, Product Area, and Approval Tier. See Section 8 — Jira Configuration Guide for field setup.",
      "PM creates a BRD Confluence page using the standard BRD template (located in the Product Confluence space). See Section 9 — Confluence Configuration Guide for template location.",
      "PM links the Confluence BRD page to the Jira Epic using the Confluence page link field.",
      "PM completes all required BRD sections for the identified tier, gathering input from Dev and UX as defined in Section 5.5.",
      "PM submits the BRD for UX review by moving the Jira Epic to the Product Review stage and tagging the UX Lead.",
      "UX Lead reviews the BRD within the SLA window defined in Section 5.7 and either accepts or rejects with comments.",
      "Upon acceptance, the Epic moves to Design Review and enters the UX queue.",
    ],
    slaTable: [
      { tier: "Tier 1 — Standard", critical: "1 business day", high: "2 business days", medium: "3 business days" },
      { tier: "Tier 2 — Complex", critical: "2 business days", high: "3 business days", medium: "4 business days" },
      { tier: "Tier 3 — Major Initiative", critical: "3 business days", high: "4 business days", medium: "5 business days" },
    ],
    intakeChecklist: [
      { item: "Jira Epic created with all required custom fields completed", tier1: "Required", tier2: "Required", tier3: "Required" },
      { item: "BRD Confluence page created from the standard template", tier1: "Required", tier2: "Required", tier3: "Required" },
      { item: "Confluence BRD linked to Jira Epic", tier1: "Required", tier2: "Required", tier3: "Required" },
      { item: "Tier correctly identified and justified", tier1: "Required", tier2: "Required", tier3: "Required" },
      { item: "Business Objective written to standard (specific, measurable)", tier1: "Required", tier2: "Required", tier3: "Required" },
      { item: "Success Metrics defined with at least 2 KPIs", tier1: "Required", tier2: "Required", tier3: "Required" },
      { item: "In-scope AND out-of-scope items explicitly listed", tier1: "Required", tier2: "Required", tier3: "Required" },
      { item: "Technical requirements validated with Dev Lead", tier1: "Required", tier2: "Required", tier3: "Required" },
      { item: "Acceptance criteria written in testable format", tier1: "Required", tier2: "Required", tier3: "Required" },
      { item: "Discovery findings included or absence documented", tier1: "Recommended", tier2: "Required", tier3: "Required" },
      { item: "Workfront dependency noted if copy/assets needed", tier1: "If applicable", tier2: "If applicable", tier3: "Required" },
      { item: "Scaling roadmap included", tier1: "N/A", tier2: "Recommended", tier3: "Required" },
      { item: "All contributing team members have reviewed their sections", tier1: "Required", tier2: "Required", tier3: "Required" },
    ],
    rejectionProcess: [
      "UX Lead adds specific, actionable comments to the Confluence BRD page identifying each incomplete or missing section.",
      "The Jira Epic is moved back to Backlog with a comment referencing the Confluence rejection notes.",
      "The PM is notified via Jira and Slack.",
      "PM has 2 business days to either revise and resubmit, or request a Discovery Meeting.",
    ],
    discoveryMeetingTriggers: [
      "Three or more required sections are incomplete or missing.",
      "The scope is unclear and requires cross-functional alignment before it can be defined.",
      "Technical feasibility has not been confirmed and Dev input is needed.",
      "The business objective conflicts with known technical or design constraints.",
    ],
    quickRef: [
      { topic: "BRD Owner", standard: "Product Manager (with UX and Dev input)" },
      { topic: "BRD Home", standard: "Confluence template linked to Jira Epic" },
      { topic: "Tier 1 Scope", standard: "New features, feature changes, component updates" },
      { topic: "Tier 2 Scope", standard: "New journeys/flows, cross-product impact" },
      { topic: "Tier 3 Scope", standard: "New product areas, large initiatives" },
      { topic: "Review SLA", standard: "1–5 business days depending on tier and priority" },
      { topic: "Rejection Response", standard: "Comments in Confluence, Epic returned to Backlog" },
      { topic: "Discovery Meeting Trigger", standard: "3+ incomplete sections or unresolved scope conflict" },
      { topic: "Escalation Trigger", standard: "2 rejections for the same missing sections" },
      { topic: "Template Location", standard: "Confluence > Product Space > Templates > BRD Template" },
    ],
    accordions: [
      { title: "5.1 Purpose of the BRD — Three Functions", content: "The BRD serves three functions: (1) It communicates what the business needs and why it matters. (2) It defines the scope, constraints, and success criteria before any design or development work begins. (3) It creates shared accountability — the PM owns its completeness, UX validates its design scope, and Dev confirms technical feasibility before work is scheduled." },
      { title: "5.6 Where the BRD Lives — Tool Workflow", content: "Every BRD lives as a structured Confluence page linked to its corresponding Jira Epic. A Jira Epic without a linked, accepted BRD will not be moved out of the Backlog stage. See the Where the BRD Lives steps above for the full 7-step tool workflow from Epic creation to Design Review entry." },
      { title: "5.7 SLA Priority Rule", content: "Priority level is set by the PM at Epic creation and must be justified in the Business Objective section of the BRD. Marking all tickets as Critical is not acceptable and will result in priority re-evaluation by the PM Lead." },
      { title: "5.9 Rejection Escalation Rule", content: "A BRD that has been rejected twice for the same missing sections will be escalated to the Director of UX and the PM Lead for resolution before re-submission is permitted. Discovery Meetings are facilitated by the UX Lead and must include the PM, a Dev representative, and the requesting business stakeholder. The output of the meeting is a revised, complete BRD ready for re-submission." },
      { title: "5.10 BRD Confluence Template — Reference", content: "The official BRD template is located at: Confluence > Product Space > Templates > BRD Template. Do not create BRDs from blank pages. Always use the template. The template includes the intake checklist, all required sections pre-labeled by tier, and the Jira Epic link field. The template is version-controlled — new template applies to all new submissions after the update date. The UX Lead owns the BRD template and is responsible for keeping it current." },
    ]
  },
  {
    id: "s6", num: "06", title: "Handoff Standards", icon: "ArrowRightCircle",
    roles: ["PM", "Designer", "Dev", "QA"],
    tagline: "The required deliverables, rejection triggers, and definition of done at every team boundary.",
    summary: "A handoff is the highest-risk point in any product cycle — when context is lost, requirements are misunderstood, or expectations are misaligned, every downstream team absorbs the cost. Rework, delays, and quality failures almost always trace back to a handoff that was done poorly.",
    ruleNote: "A rejection is not a failure — it is the process working correctly. Rejecting an incomplete handoff costs hours. Accepting an incomplete handoff costs days or weeks of rework. Every team member is empowered to reject a handoff that does not meet the standard defined here, without requiring management approval to do so.",
    keyPoints: [
      { label: "6 Formal Handoffs", detail: "PM→UX, UX→Creative, UX→Dev, Dev→QA, QA→PM, and Publishing Fast Track. Each is a formal gate — not a casual hand-wave. The receiving team has the right and responsibility to reject a handoff that does not meet the standard." },
      { label: "Rejection Authority", detail: "Any team member may reject a handoff without requiring management approval. The checklist is the authority. Overriding a rejection requires explicit written approval from the PM Lead or Director of UX and must be documented in the Jira ticket." },
      { label: "Override Rules", detail: "A rejected handoff must never be moved forward without addressing the rejection comments. Overriding requires explicit written approval from the PM Lead or Director of UX, documented in the Jira ticket with the reason for the override." },
    ],
    handoffOverview: [
      { num: "1", label: "Brief to Design", from: "PM", to: "UX Team", gate: "BRD accepted, Workfront dependencies identified", sectionRef: "6.2", sectionId: null },
      { num: "2", label: "UX to Creative", from: "UX Team", to: "Creative / Workfront", gate: "Workfront request submitted with complete brief", sectionRef: "6.3", sectionId: null },
      { num: "3", label: "UX to Dev", from: "UX Team", to: "Dev Team", gate: "Figma specs complete, annotated, Dev Review approved", sectionRef: "6.4", sectionId: null },
      { num: "4", label: "Dev to QA", from: "Dev Team", to: "QA Team", gate: "Build deployed to staging, self-tested", sectionRef: "6.5", sectionId: null },
      { num: "5", label: "QA to PM", from: "QA Team", to: "Product Manager", gate: "QA sign-off complete, UAT passed", sectionRef: "6.6", sectionId: null },
      { num: "6", label: "Publishing Fast Track", from: "PM / Director", to: "Onshore Dev / CMS Owner", gate: "No dev work — content or asset publish only", sectionRef: "6.7", sectionId: null },
    ],
    handoffs: [
      {
        id: "h1", num: "6.2", label: "PM → UX Team", from: "Product Manager", to: "UX Team",
        intro: "This is the most critical handoff in the entire cycle. Everything downstream depends on the quality of what UX receives. The PM is responsible for ensuring the brief is complete before submitting. UX is responsible for rejecting it if it is not.",
        note: "The PM → UX handoff is complete when the Jira Epic is in Design Review with a linked, accepted BRD. Until those two conditions are true, UX has not received the work. Verbal briefings, Slack messages, and email summaries do not constitute a handoff.",
        noteType: "info",
        deliverables: [
          "BRD accepted by UX Lead — see Section 5 — BRD Standards & Requirements",
          "Jira Epic created with all required custom fields",
          "Confluence BRD page linked to Epic",
          "BRD Tier correctly identified",
          "Workfront dependencies identified in BRD",
          "Acceptance criteria written in testable format",
          "Technical constraints validated by Dev Lead",
          "Scope — in and out — explicitly defined",
        ],
        rejects: [
          "BRD missing required sections for its tier",
          "Acceptance criteria are vague or untestable",
          "Technical constraints not validated by Dev",
          "Scope is undefined or contradictory",
          "No Confluence BRD link on the Epic",
          "Discovery findings absent without explanation",
        ],
        doneWhen: [
          "BRD is fully accepted by UX Lead",
          "Jira Epic moves to Design Review",
          "UX Lead is assigned in Jira",
          "Workfront requests submitted if dependencies exist",
          "Design schedule confirmed with PM",
        ],
        sectionLink: { label: "Section 5 — BRD Standards & Requirements", id: "s5" },
      },
      {
        id: "h2", num: "6.3", label: "UX Team → Creative / Workfront", from: "UX Team", to: "Creative (Workfront)",
        intro: "When UX identifies a dependency on creative assets — copy, imagery, or brand materials — a formal Workfront request must be submitted before design work begins. This handoff ensures the Creative team has everything needed to deliver on time.",
        note: "See Section 7 — Creative & Workfront Integration for full Workfront request standards, SLA expectations, and the escalation path when creative deliverables are late.",
        noteType: "info",
        deliverables: [
          "Workfront request submitted with complete brief",
          "Request type correctly identified",
          "Jira Epic link included in Workfront request",
          "Due date set (design target minus 3 business days)",
          "Tone, dimensions, or brand reference included",
          "Priority matches Jira ticket priority",
          "Jira Workfront Dependency field filled in",
          "workfront-blocked label added to Jira task",
          "Confluence Workfront log updated",
          "Sr. Manager Marketing Ops notified via Slack",
        ],
        rejects: [
          "Workfront request missing required fields",
          "No due date or unrealistic due date",
          "Priority not set or inconsistent with Jira",
          "No Figma reference or brief description provided",
          "Request submitted after Design In Progress begins",
        ],
        doneWhen: [
          "Workfront request confirmed with a WF ID",
          "Jira field updated: WF-[ID] | Submitted | Due: [date]",
          "Confluence log row added for the request",
          "Sr. Manager Marketing Ops has acknowledged receipt",
        ],
        sectionLink: { label: "Section 7 — Creative & Workfront Integration", id: "s7" },
      },
      {
        id: "h3", num: "6.4", label: "UX Team → Dev Team", from: "UX Team", to: "Dev Team",
        intro: "The UX to Dev handoff is where design intent becomes a buildable specification. This handoff fails most often when Figma files are incomplete, annotations are missing, or components deviate from the approved library without documentation. Dev has the right to reject any handoff that does not meet the standard below.",
        note: "The UX → Dev handoff checklist (Section 6.4.1) must be completed in the Jira UX task before requesting Dev Review. It is embedded in the UX Task template — see Section 8.5 — Jira Ticket Templates.",
        noteType: "info",
        deliverables: [
          "Figma file linked in Jira task",
          "All screens and states designed and present",
          "Error states, empty states, loading states included",
          "Mobile and desktop breakpoints defined",
          "Component annotations on every non-obvious interaction",
          "Spacing, padding, and sizing annotated using design tokens",
          "All components from the approved library — deviations flagged",
          "Copy finalized or Workfront status confirmed In Progress",
          "Figma file uses approved component library — no detached instances",
          "Handoff checklist completed in Jira UX task (see 6.4.1)",
          "Design Approval completed by Director of UX",
          "Dev Review completed and approved by Dev Lead",
        ],
        rejects: [
          "Figma file not linked or not accessible to Dev",
          "Missing screens, states, or breakpoints",
          "No annotations on complex interactions",
          "Components are detached from library without documentation",
          "Copy is placeholder text with no Workfront request active",
          "Design Approval not yet completed",
          "Spacing or sizing is inconsistent or unannotated",
        ],
        doneWhen: [
          "Dev Lead has approved designs in Dev Review",
          "Jira ticket moves to Dev Ready",
          "Dev team has confirmed they can begin building",
          "All open design questions are resolved or documented",
        ],
        sectionLink: { label: "Section 8.5 — Jira Ticket Templates", id: "s8" },
        checklist: {
          title: "6.4.1 UX → Dev Handoff Checklist",
          intro: "The following checklist must be completed in the Jira UX task before requesting Dev Review. Embedded in the UX Task template — see Section 8.5 — Jira Configuration Guide.",
          items: [
            { item: "Figma file URL added to Jira task", req: "Required" },
            { item: "All screens complete — no placeholder frames", req: "Required" },
            { item: "Mobile breakpoints designed (if applicable)", req: "Required" },
            { item: "Desktop breakpoints designed (if applicable)", req: "Required" },
            { item: "All interactive states present (hover, focus, active, disabled)", req: "Required" },
            { item: "Error states designed for all form inputs", req: "Required" },
            { item: "Empty states designed for all data-dependent views", req: "Required" },
            { item: "Loading/skeleton states designed where applicable", req: "Required" },
            { item: "All components sourced from approved library", req: "Required" },
            { item: "Detached components documented with reason in Figma comment", req: "If applicable" },
            { item: "Spacing and sizing annotated using design tokens", req: "Required" },
            { item: "Complex interactions annotated with behavior descriptions", req: "Required" },
            { item: "Copy is finalized OR Workfront request is active (WF ID in Jira)", req: "Required" },
            { item: "Accessibility considerations noted (contrast, touch target, alt text)", req: "Required" },
            { item: "Design Approval completed by Director of UX", req: "Required" },
          ],
        },
      },
      {
        id: "h4", num: "6.5", label: "Dev Team → QA Team", from: "Dev Team", to: "QA Team",
        intro: "The Dev to QA handoff delivers a build that QA can test meaningfully. QA should never receive a build that the developer has not already self-tested. An untested build handed to QA wastes QA capacity and extends the cycle unnecessarily.",
        note: "The Dev → QA handoff checklist (Section 6.5.1) must be completed in the Jira Dev task before moving to QA Stage. QA task auto-creation is triggered by the Section 8.7 — Jira Automation rule on Dev Approval.",
        noteType: "info",
        deliverables: [
          "Build deployed to staging environment",
          "Staging URL confirmed and accessible by QA",
          "Developer has self-tested against acceptance criteria",
          "All acceptance criteria from BRD verified by developer",
          "Figma spec reviewed for visual accuracy before handoff",
          "No known critical or high defects at time of handoff",
          "Any known minor defects documented in Jira with severity",
          "QA task auto-created and assigned (Section 8.7 — Jira Automations)",
          "Jira task moved to QA Stage by Dev Lead",
          "Dev Approval completed by Dev Lead",
        ],
        rejects: [
          "Build not deployed or staging URL broken",
          "Developer has not self-tested",
          "Known critical or high defects exist at handoff",
          "Acceptance criteria not met by the build",
          "Significant visual deviations from Figma spec",
          "QA task not created or not assigned",
        ],
        doneWhen: [
          "QA Lead has confirmed the build is testable",
          "QA task is in progress in Jira",
          "Staging URL is confirmed accessible",
          "Dev team is available for defect questions during QA",
        ],
        sectionLink: { label: "Section 8.7 — Jira Automations", id: "s8" },
        checklist: {
          title: "6.5.1 Dev → QA Handoff Checklist",
          intro: "The following checklist must be completed in the Jira Dev task before moving to QA Stage.",
          items: [
            { item: "Build deployed to staging environment", req: "Required" },
            { item: "Staging URL added to Jira task comment", req: "Required" },
            { item: "All acceptance criteria self-tested and passed", req: "Required" },
            { item: "Figma spec reviewed — visual accuracy confirmed", req: "Required" },
            { item: "No critical or high defects known at handoff", req: "Required" },
            { item: "Known low/medium defects documented in Jira with severity label", req: "If applicable" },
            { item: "Cross-browser testing completed (Chrome, Safari, Firefox minimum)", req: "Required" },
            { item: "Mobile responsiveness tested on at least one device", req: "Required" },
            { item: "Console errors cleared — no JavaScript errors in staging", req: "Required" },
            { item: "Dev Approval completed by Dev Lead", req: "Required" },
          ],
        },
      },
      {
        id: "h5", num: "6.6", label: "QA Team → Product Manager", from: "QA Team", to: "Product Manager",
        intro: "The QA to PM handoff delivers a tested, verified build ready for release sign-off. The PM is not a QA resource — by the time this handoff occurs, all critical and high defects must be resolved. The PM\'s role at this stage is to confirm scope delivery against the BRD, not to re-test the build.",
        note: "The QA sign-off comment (Section 6.6.1) must be posted on the Jira ticket by the QA Lead before this handoff is considered complete. PM Approval window: 1 business day. See Section 4.8 — Approval Timeboxes.",
        noteType: "info",
        deliverables: [
          "QA Stage testing complete — all acceptance criteria passed",
          "QA Prod smoke test complete — build confirmed in production",
          "UAT sign-off received from all UAT participants",
          "All critical and high defects resolved and re-tested",
          "Any deferred defects documented with severity and follow-up Epic linked",
          "QA task closed with sign-off comment in Jira",
          "QA Lead has added sign-off comment with name and date",
          "Jira ticket moved to PM Approval by QA Lead",
        ],
        rejects: [
          "Open critical or high defects at handoff",
          "UAT not completed or sign-off not received",
          "QA Prod smoke test not performed",
          "Deferred defects not documented or linked to follow-up Epics",
          "QA sign-off comment missing from Jira task",
        ],
        doneWhen: [
          "PM has received the QA sign-off comment",
          "Jira ticket is in PM Approval stage",
          "PM has confirmed scope delivery against the BRD",
          "PM makes go/no-go release decision within 1 business day",
        ],
        sectionLink: { label: "Section 4.8 — Approval Timeboxes", id: "s4" },
        signOffFormat: {
          title: "6.6.1 QA Sign-Off Comment Standard",
          format: [
            "QA SIGN-OFF — [QA Lead Name] — [Date]",
            "Environment tested: Stage + Prod",
            "Acceptance criteria: All [X] criteria passed",
            "UAT: Completed by [participant names] on [date]",
            "Open defects: [None / list any deferred low-severity defects with ticket links]",
            "Recommendation: READY FOR RELEASE",
          ],
        },
      },
      {
        id: "h6", num: "6.7", label: "Publishing-Only Fast Track", from: "PM / Director", to: "Onshore Dev / CMS Owner",
        intro: "Publishing-only updates bypass the Design, Dev, and QA lanes entirely. This handoff is between the PM or Director who approves the change and the Onshore Dev Lead or CMS owner who executes it. Speed is the purpose — but accuracy and confirmation are still required.",
        note: "If any doubt exists about whether an update requires development work, default to the full product cycle. Publishing-only fast track is not a mechanism to skip the cycle for convenience — it exists only for genuinely non-development changes. Misuse is a process violation.",
        noteType: "warning",
        deliverables: [
          "Jira Task created with Approval Tier = Publishing",
          "Clear description of what is being published",
          "Content, copy, or asset attached or linked in Jira task",
          "PM or Director has approved the publish in writing (Jira comment)",
          "No development work involved — confirmed",
          "Brand or legal review completed if required",
        ],
        rejects: [
          "Task involves any code change — route to full cycle",
          "No written approval in Jira before publish",
          "Content not attached or linked in the task",
          "Brand guidelines not followed",
          "Legal disclaimer or compliance review not completed where required",
        ],
        doneWhen: [
          "Content published and confirmed live",
          "Screenshot or audit log added to Jira task",
          "Jira task closed with confirmation comment",
          "PM notified that publish is complete",
        ],
        sectionLink: { label: "Section 3.3 — Publishing-Only Fast Track", id: "s3" },
      },
    ],
    rejectionSteps: [
      "The receiving team member identifies the specific deficiency using the rejection triggers listed in the relevant handoff card.",
      "The receiving team member posts a comment on the Jira ticket with: (a) a clear statement that the handoff is rejected, (b) the specific items that must be addressed before re-submission, and (c) their name and the date.",
      "The Jira ticket is moved back to the previous stage by the receiving team member.",
      "The originating team is notified via the Jira comment and Slack if the rejection will impact the release timeline.",
      "The originating team addresses all listed items and re-submits by moving the ticket forward again.",
      "If the same handoff is rejected twice for the same reasons, the PM escalates to the Director of UX or PM Lead for resolution.",
    ],
    uxNeeds: [
      { team: "Product Manager", fromTeam: "A complete, accepted BRD with clear scope, testable acceptance criteria, and validated technical constraints before design begins.", fromUX: "A Figma file with all screens, states, and annotations complete. A realistic design schedule. Proactive communication when scope impacts the design timeline.", sectionId: "s5", sectionLabel: "Section 5 — BRD Standards & Requirements" },
      { team: "Dev Team", fromTeam: "A Dev Review within 2 business days of Design Approval. Specific, technical feedback when designs are returned — not vague rejections. Technical constraints identified early during BRD, not at Dev Review.", fromUX: "Figma specs that are complete, annotated, and use the approved component library. No placeholder copy. All states designed. Dev handoff checklist completed.", sectionId: "s5", sectionLabel: "Section 5 — BRD Standards & Requirements" },
      { team: "QA Team", fromTeam: "Acceptance criteria written in testable format before design begins (PM provides, UX validates). Questions about design intent answered promptly during QA Stage.", fromUX: "Clear design specifications in Figma that QA can reference when verifying visual accuracy. Prompt responses when QA finds design-related defects.", sectionId: "s5", sectionLabel: "Section 5 — BRD Standards & Requirements" },
      { team: "Creative Team", fromTeam: "Workfront requests fulfilled within agreed SLAs. Proactive communication when a delivery is at risk. Final assets delivered in the correct format and dimensions.", fromUX: "Complete, specific Workfront request briefs with reference materials, tone guidance, and correct dimensions. Requests submitted at Design Review — not mid-design.", sectionId: "s7", sectionLabel: "Section 7 — Creative & Workfront Integration" },
      { team: "Executive / Director", fromTeam: "Timely decisions at Executive Review gates (within 2 business days). Strategic direction provided during Planning — not after Design Approval.", fromUX: "Clear visual presentations of design decisions tied to business objectives. Flagging of strategic risks before they become delivery problems.", sectionId: "s4", sectionLabel: "Section 4 — Roles & Ownership (DRAC)" },
    ],
    quickRef: [
      { handoff: "PM → UX", gate: "BRD accepted + Epic in Design Review", authority: "UX Lead", window: "Per BRD SLA — Section 5.7 — BRD Review SLA", sectionId: "s5" },
      { handoff: "UX → Creative", gate: "Workfront request submitted with complete brief", authority: "Sr. Mgr Marketing Ops", window: "2 business days review", sectionId: "s7" },
      { handoff: "UX → Dev", gate: "Design Approval complete + Dev Review approved", authority: "Dev Lead", window: "2 business days Dev Review", sectionId: null },
      { handoff: "Dev → QA", gate: "Build on staging, self-tested, Dev Approval complete", authority: "QA Lead", window: "1 business day Dev Approval", sectionId: null },
      { handoff: "QA → PM", gate: "QA Stage + Prod complete, UAT signed off", authority: "PM", window: "1 business day PM Approval — Section 4.8 — Approval Timeboxes", sectionId: "s4" },
      { handoff: "Publishing Fast Track", gate: "Written approval in Jira, no dev work involved", authority: "PM / Director", window: "Same day", sectionId: "s3" },
    ],
    accordions: [
      { title: "6.8 Rejection Protocol — Full 6-Step Process", content: "See the Rejection Protocol section above for the complete 6-step process. Key rule: a rejected handoff must never be moved forward without addressing the rejection comments. Overriding requires explicit written approval from the PM Lead or Director of UX, documented in the Jira ticket with the reason for the override." },
      { title: "6.9 Bilateral Needs — UX and Every Team", content: "See the What UX Needs section above for the full bilateral dependency table across all 5 team relationships. Each row shows what UX needs from that team and what that team needs from UX." },
    ]
  },
  {
    id: "s7", num: "07", title: "Creative & Workfront Integration", icon: "Layers",
    roles: ["Designer", "PM"],
    tagline: "How UX manages creative asset dependencies through Adobe Workfront.",
    summary: "The UX team regularly depends on the Creative team for copy, imagery, and brand assets. These two tools are currently disconnected — Workfront status is only visible to the submitter via email, creating a blind spot. This section establishes a lightweight manual bridge — a structured tagging and logging standard that makes Workfront dependency visible inside Jira without requiring a technical integration.",
    workfrontNote: "Workfront and Jira will not be formally integrated at the system level. Instead, this section establishes a structured tagging and logging standard that makes Workfront dependency visible inside Jira and Confluence without requiring a technical integration.",
    keyPoints: [
      { label: "4 Request Types", detail: "Copy & Content Writing, Photography & Imagery, Brand & Marketing Assets, and Content Strategy. All must be submitted at Design Review — before Design In Progress begins. Submitting after design starts is a process violation." },
      { label: "Jira Field Format", detail: "The Workfront Dependency field must always follow this exact format: WF-[ID] | [Status] | Due: [YYYY-MM-DD]. Example: WF-4821 | In Progress | Due: 2025-09-12. Inconsistent formatting breaks Jira filters and dashboard queries. No exceptions." },
      { label: "SLA Start Point", detail: "SLAs begin from the date the Workfront request is approved (status moves to In Progress) — not from the date of submission. Submission review by the Creative team takes an additional 1–2 business days before approval." },
    ],
    requestTypes: [
      { type: "Copy & Content Writing", desc: "Any user-facing text requiring a professional copywriter — product descriptions, UI microcopy, marketing language, legal disclaimers", examples: "Checkout confirmation copy, portal onboarding messaging, back office help text, homepage hero text", submitAt: "Design Review — before Design In Progress begins" },
      { type: "Photography & Imagery", desc: "Product photography, lifestyle imagery, hero images, or any visual asset requiring a creative shoot or licensed procurement", examples: "Product hero images, category banner photography, portal dashboard illustrations", submitAt: "Design Review — before Design In Progress begins" },
      { type: "Brand & Marketing Assets", desc: "Brand-governed assets — logos, brand illustrations, campaign graphics, promotional banners, email templates", examples: "Seasonal promotional banners, brand-compliant icons, email header templates", submitAt: "Design Review — before Design In Progress begins" },
      { type: "Content Strategy", desc: "Structural content planning for larger initiatives — content hierarchy, information architecture copy, SEO copy frameworks", examples: "New product category structure, portal navigation labels, back office section naming", submitAt: "BRD stage — flag as dependency during BRD review" },
    ],
    submissionSteps: [
      "Confirm the creative dependency is noted in the BRD Design Specifications section before submitting. See Section 5.3 — Required BRD Sections.",
      "Log in to Adobe Workfront and navigate to the intake request form.",
      "Select the correct request type: Copy & Content / Photography & Imagery / Brand & Marketing Asset / Content Strategy.",
      "Complete all required Workfront fields: Project name, Product (eCommerce / Portal / Back Office), Jira Epic link, request description, reference materials (Figma link if available), and due date needed.",
      "In the Due Date Needed field, use the design target date from the Jira Epic minus 3 business days as a buffer.",
      "Submit the request. Note the Workfront ticket ID from the confirmation (format: WF-XXXXX).",
      "Return to the Jira UX task and fill in the Workfront Dependency field: WF-[ID] | Submitted | Due: [YYYY-MM-DD].",
      "Add the label workfront-blocked to the Jira task.",
      "Add a row to the Workfront Request Log in Confluence for the relevant product. See Section 9.4 — Confluence Page Templates.",
      "Notify the Sr. Manager of Marketing Operations via Slack in #creative-requests with a brief summary and the Workfront ticket ID.",
    ],
    requiredFields: [
      { field: "Request Type", requiredFor: "All", standard: "Select from: Copy & Content / Photography & Imagery / Brand & Marketing Asset / Content Strategy" },
      { field: "Project / Epic Name", requiredFor: "All", standard: "Match the Jira Epic name exactly — e.g. Checkout Flow Redesign" },
      { field: "Product", requiredFor: "All", standard: "eCommerce / Customer Portal / Back Office — select one or multiple" },
      { field: "Jira Epic Link", requiredFor: "All", standard: "Full URL to the Jira Epic" },
      { field: "Request Description", requiredFor: "All", standard: "Specific description of what is needed — minimum 3 sentences. Vague requests will be returned." },
      { field: "Reference Materials", requiredFor: "All", standard: "Figma link (if available), existing brand examples, competitor references, or relevant copy from BRD" },
      { field: "Tone & Voice Notes", requiredFor: "Copy & Content", standard: "Target audience, desired tone (e.g. friendly, professional, urgent), any words or phrases to avoid" },
      { field: "Image Dimensions", requiredFor: "Photography", standard: "Required dimensions per placement (e.g. 1440x600px for hero, 400x400px for product tile)" },
      { field: "Brand Guidelines Ref", requiredFor: "Brand & Marketing", standard: "Link to or name of the brand guidelines version to follow" },
      { field: "Due Date Needed", requiredFor: "All", standard: "Design target date minus 3 business days — format: YYYY-MM-DD" },
      { field: "Priority", requiredFor: "All", standard: "Match the Jira ticket priority: Critical / High / Medium / Low" },
    ],
    workfrontStatuses: [
      { status: "New / Submitted", meaning: "Request received by the Creative team. Not yet reviewed by Sr. Manager of Marketing Operations.", action: "No action needed. Update Jira field to: WF-[ID] | Submitted | Due: [date]", color: "#6B778C" },
      { status: "In Review", meaning: "Sr. Manager of Marketing Operations is reviewing the request for completeness and scheduling.", action: "No action needed. Monitor for approval or return within 2 business days.", color: "#2E86AB" },
      { status: "Returned / Rejected", meaning: "Request was incomplete or missing required information. Workfront email will contain specific comments.", action: "Address comments and resubmit within 1 business day. Update Jira field to: WF-[ID] | Returned | Due: [date]", color: "#A93226" },
      { status: "Approved / In Progress", meaning: "Request accepted. Creative team has begun work.", action: "Update Jira field to: WF-[ID] | In Progress | Due: [date]. Update Confluence log.", color: "#1A7A4A" },
      { status: "In Review — Creative", meaning: "Creative work is complete and under internal review by the Creative team before delivery.", action: "Expect delivery soon. Begin preparing design file for asset placement.", color: "#B7770D" },
      { status: "Delivered", meaning: "Asset has been delivered. Check Workfront for the delivered file or link.", action: "Download or link the asset. Update Jira field to: WF-[ID] | Delivered. Remove workfront-blocked label. Update Confluence log with delivery date.", color: "#1A7A4A" },
      { status: "On Hold", meaning: "Creative work has been paused — usually due to a missing brief detail or resource constraint.", action: "Contact Sr. Manager of Marketing Operations via Slack to understand the hold. Escalate to PM if hold will impact design target date.", color: "#6C3483" },
    ],
    jiraFieldUpdates: [
      { trigger: "Workfront request submitted", updateTo: "WF-[ID] | Submitted | Due: [date]", alsoDo: "Add workfront-blocked label to ticket" },
      { trigger: "Workfront status changes to In Review", updateTo: "WF-[ID] | In Review | Due: [date]", alsoDo: "No additional action" },
      { trigger: "Workfront request returned", updateTo: "WF-[ID] | Returned | Due: [date]", alsoDo: "Post comment in Jira explaining the return and resubmission plan" },
      { trigger: "Workfront status changes to In Progress", updateTo: "WF-[ID] | In Progress | Due: [date]", alsoDo: "Update Confluence Workfront log row" },
      { trigger: "Asset delivered", updateTo: "WF-[ID] | Delivered", alsoDo: "Remove workfront-blocked label. Attach or link asset in Jira comment." },
      { trigger: "Request placed on hold", updateTo: "WF-[ID] | On Hold | Due: [date]", alsoDo: "Post comment in Jira. Notify PM if hold impacts timeline." },
    ],
    jiraBoardVisibility: [
      "The Workfront Dependency field is visible in the ticket detail view on any Jira board.",
      "The workfront-blocked label is visible on ticket cards in board view — providing at-a-glance awareness of dependencies without opening the ticket.",
      "The Jira automation defined in Section 8.7 — Jira Automations posts a comment when the field is first filled in, notifying the PM and UX Lead.",
      "The Stale Ticket Alert automation (Section 8.7 — Jira Automations) will flag any ticket with the workfront-blocked label that has not been updated in 5 business days.",
    ],
    confluenceLogRules: [
      "One log per product — eCommerce, Customer Portal, Back Office.",
      "Active requests stay in the top Active Requests section.",
      "Delivered requests move to the Resolved Requests (Last 90 Days) section.",
      "Requests older than 90 days are archived — moved to a collapsed section at the bottom of the page.",
    ],
    sla_table: [
      { type: "Copy & Content Writing", critical: "2 business days", high: "3 business days", medium: "5 business days", low: "7 business days" },
      { type: "Photography & Imagery", critical: "3 business days", high: "5 business days", medium: "7 business days", low: "10 business days" },
      { type: "Brand & Marketing Assets", critical: "2 business days", high: "3 business days", medium: "5 business days", low: "7 business days" },
      { type: "Content Strategy", critical: "5 business days", high: "7 business days", medium: "10 business days", low: "14 business days" },
    ],
    escalationPath: [
      { step: "Step 1 — Direct Outreach", timeframe: "3 business days before due date", action: "Senior Designer sends a direct Slack message to the assigned Creative team member with a polite reminder of the due date and the Jira ticket context.", owner: "Senior Designer" },
      { step: "Step 2 — Lead Escalation", timeframe: "On the due date if not delivered", action: "Senior Designer notifies Sr. Manager of Marketing Operations via Slack DM with the WF ticket ID, due date, and impact on design timeline. PM is cc\'d in the message.", owner: "Senior Designer + PM" },
      { step: "Step 3 — PM Escalation", timeframe: "1 business day after due date", action: "PM formally escalates to Sr. Manager of Marketing Operations with a written summary of the impact on the release target. Updates the Jira ticket with a comment documenting the escalation.", owner: "PM" },
      { step: "Step 4 — Director Escalation", timeframe: "2 business days after due date", action: "Director of UX escalates to the relevant Department Director or PM Lead with a written impact assessment. The release target date is formally flagged as at risk in the Jira Epic.", owner: "Director of UX" },
    ],
    lateDeliveryDecision: "If a Workfront deliverable is more than 3 business days late and no resolution is in sight, the Director of UX and PM Lead jointly decide whether to: (1) proceed with a design placeholder and release with a known gap, (2) push the release to the next window, or (3) descope the creative dependency for this release and create a follow-up Epic. This decision is documented in the Jira Epic and Confluence Kickoff page.",
    responsibilities: [
      { role: "Senior Designer", resp: "Identifies creative dependencies during BRD review. Submits Workfront requests at Design Review. Fills in and maintains the Jira Workfront Dependency field. Updates the Confluence Workfront log. Monitors Workfront email notifications and escalates at Step 1." },
      { role: "Director of UX", resp: "Reviews Workfront dependencies flagged in BRDs. Supports escalation at Step 4. Accountable for all creative asset dependencies impacting UX delivery. Acts as Senior Designer for Workfront submissions when no Senior Designer is assigned." },
      { role: "Product Manager", resp: "Ensures Workfront dependencies are noted in the BRD Design Specifications section. Receives Slack notification when a Workfront tag is added to a Jira ticket. Escalates at Step 3. Updates release target status when a creative dependency is at risk." },
      { role: "Sr. Manager, Marketing Operations", resp: "Owns the Workfront intake queue. Reviews and approves or returns all incoming requests within 2 business days. Manages Creative team workload and communicates delivery risks proactively. Escalation point for Step 2 resolution." },
      { role: "Creative Team", resp: "Executes Workfront requests within agreed SLAs. Updates Workfront status as work progresses. Delivers assets directly in Workfront with a download link or file attachment. Communicates directly with submitter if additional information is needed." },
    ],
    quickRef: [
      { topic: "Request types", standard: "Copy & Content / Photography & Imagery / Brand & Marketing Assets / Content Strategy" },
      { topic: "When to submit", standard: "At Design Review — before Design In Progress begins" },
      { topic: "Workfront owner", standard: "Sr. Manager, Marketing Operations" },
      { topic: "Submission notification", standard: "Slack #creative-requests after submitting — include WF ID" },
      { topic: "Jira field format", standard: "WF-[ID] | [Status] | Due: [YYYY-MM-DD] — no exceptions" },
      { topic: "Jira label", standard: "workfront-blocked — added at submission, removed at delivery" },
      { topic: "Confluence log", standard: "One log per product — updated at submission and every status change. See Section 9.4 — Confluence Page Templates.", sectionId: "s9" },
      { topic: "SLA start", standard: "From Workfront approval (In Progress) — not from submission date" },
      { topic: "Fastest SLA", standard: "Copy & Brand Assets Critical: 2 business days from approval" },
      { topic: "Slowest SLA", standard: "Content Strategy Low: 14 business days from approval" },
      { topic: "Step 1 escalation", standard: "3 days before due date — Senior Designer to Creative team member" },
      { topic: "Step 4 escalation", standard: "2 days after due date — Director of UX to Department Director" },
      { topic: "Late delivery decision", standard: "Director of UX + PM Lead jointly decide: placeholder / push / descope" },
    ],
    accordions: [
      { title: "7.1 Submission Timing Rule — Full Detail", content: "All Workfront requests must be submitted at Design Review — not mid-design. Submitting a request after design has started is a process violation that creates rework risk. If a creative dependency is identified during the BRD stage, it must be noted in the BRD Design Specifications section and submitted to Workfront as soon as the BRD is accepted. See Section 5.3 — Required BRD Sections for where to note this in the BRD." },
      { title: "7.5 How Workfront Dependency Appears on the Jira Board", content: "The Workfront Dependency field is visible in the ticket detail view. The workfront-blocked label appears on ticket cards in board view for at-a-glance awareness. The Jira automation in Section 8.7 — Jira Automations posts a comment when the field is first filled in. The Stale Ticket Alert automation flags any ticket with workfront-blocked that has not been updated in 5 business days." },
      { title: "7.6 Confluence Log — Entry Format", content: "Log columns: WF ID | Request Type | Project / Epic | Submitted By | Submitted Date | Status | Due Date | Delivered? Example rows: WF-4821 | Copy & Content | Checkout Flow Redesign | J. Smith | 2025-09-01 | In Progress | 2025-09-12 | No. See Section 9.4 — Confluence Page Templates for the full Workfront Request Log template." },
      { title: "7.7 SLA Priority Rule", content: "Priority level in Workfront must match the priority level set in Jira. Inflating priority to Critical for all requests defeats the system and will result in the Sr. Manager of Marketing Operations resetting priorities in coordination with the PM Lead." },
    ]
  },
  {
    id: "s8", num: "08", title: "Jira Configuration Guide", icon: "Settings",
    roles: ["PM", "Dev", "Executive"],
    tagline: "How Jira must be structured and configured to support the product cycle. All structural changes require the Director of Software.",
    summary: "This section defines how Jira must be structured and configured to support the product cycle defined in Section 3 — The Product Cycle. It covers board architecture, ticket hierarchy, workflow stages, custom fields, ticket templates, labels, automations, and cross-tool integrations with Confluence, Slack, and Workfront.",
    adminNote: "All structural changes to Jira require approval and execution by the Director of Software, who holds Jira admin rights on the Atlassian Cloud instance. This document serves as the specification. No team member should attempt to create new projects, modify workflows, or change global settings without admin coordination.",
    transitionNote: "Existing department boards will be kept active and phased out over time. New boards are built in parallel. Teams migrate product by product, not all at once. Old boards are archived — not deleted — once migration is confirmed complete.",
    keyPoints: [
      { label: "4-Board Architecture", detail: "Program Board (all 3 products — Epics and cross-product initiatives), eCommerce Board, Customer Portal Board, Back Office Board. Legacy department boards phase out over 60–90 days." },
      { label: "10 Custom Fields", detail: "Product Area, Discipline, Priority, Release Target, Approval Tier, BRD Tier, Workfront Dependency, Exec Review Required, Confluence BRD Link, Dev Assignment. Replaces all legacy per-team field configurations." },
      { label: "12 Automations", detail: "Rebuilt for signal, not noise. Every notification must be actionable. All existing automation rules on legacy department boards must be audited and disabled before the new boards go live." },
    ],
    boardArch: [
      { type: "Program Board", scope: "All 3 products — Epics and cross-product initiatives only", users: "Director of UX, PM Lead, Dev Leads, PM Lead, Executives", managedBy: "PM Lead", style: "Kanban" },
      { type: "eCommerce Board", scope: "All work for the eCommerce site", users: "PM, UX, Onshore Dev, Offshore Dev, QA", managedBy: "PM (eCommerce)", style: "Kanban" },
      { type: "Customer Portal Board", scope: "All work for the Customer Portal", users: "PM, UX, Offshore Dev, QA", managedBy: "PM (Portal)", style: "Kanban" },
      { type: "Back Office Board", scope: "All work for the Back Office", users: "PM, UX, Offshore Dev, QA", managedBy: "PM (Back Office)", style: "Kanban" },
      { type: "[Legacy] Dept Boards", scope: "Existing department boards — phase out over 60–90 days", users: "Existing team members", managedBy: "Respective dept leads", style: "Kanban" },
    ],
    boardSetupSteps: [
      "Log in to Jira Cloud as Director of Software (admin required).",
      "Navigate to Projects > Create Project > select Kanban template.",
      "Name the project per convention: [PROG] Program Board, [ECM] eCommerce, [CPT] Customer Portal, [BOF] Back Office.",
      "Set project lead to the appropriate PM for each product board; set Program Board lead to PM Lead.",
      "Under Project Settings > Access, set visibility to Private and add all relevant team members with appropriate roles.",
      "Connect each product board to the Program Board by setting the product Epic's parent to the Program Board project.",
      "Archive legacy department boards only after the team has confirmed migration is complete for that product area.",
    ],
    ticketHierarchy: [
      { level: "Epic", jiraType: "Epic", definition: "A complete initiative, feature, or deliverable with a defined start and end. Maps to a BRD. May span multiple sprints or release windows.", livesOn: "Program Board + Product Board", requiresBRD: "Yes — linked Confluence BRD page required" },
      { level: "Story", jiraType: "Story", definition: "A user-facing capability or experience within an Epic. Written from the user's perspective. Testable and deliverable independently.", livesOn: "Product Board", requiresBRD: "No — inherits Epic BRD" },
      { level: "Task", jiraType: "Task", definition: "A specific unit of work within a Story or Epic. Assigned to one person. Completable within one release window.", livesOn: "Product Board", requiresBRD: "No" },
      { level: "Subtask", jiraType: "Subtask", definition: "A granular action within a Task. Used sparingly — only when a Task has distinct parallel workstreams.", livesOn: "Product Board", requiresBRD: "No" },
    ],
    namingConventions: [
      { type: "Epic", format: "[Product] — [Feature/Initiative Name]", example: "[ECM] — Checkout Flow Redesign" },
      { type: "Story", format: "As a [user type], I want to [action] so that [outcome]", example: "As a returning customer, I want to save my payment method so that checkout is faster" },
      { type: "Task (UX)", format: "UX: [Action] — [Context]", example: "UX: Design — Payment confirmation screen" },
      { type: "Task (Dev)", format: "DEV: [Action] — [Context]", example: "DEV: Build — Payment API integration" },
      { type: "Task (QA)", format: "QA: [Action] — [Context]", example: "QA: Test — Payment flow on mobile" },
      { type: "Subtask", format: "[Action] — [Specific detail]", example: "Annotate — Error states for declined card" },
    ],
    workflowStages: [
      { stage: "Backlog", statusName: "Backlog", category: "To Do", movesIn: "PM", movesOut: "PM (after BRD accepted)" },
      { stage: "Product Review", statusName: "Product Review", category: "To Do", movesIn: "PM", movesOut: "UX Lead (after BRD review)" },
      { stage: "Design Review", statusName: "Design Review", category: "In Progress", movesIn: "UX Team", movesOut: "UX Team" },
      { stage: "Design Ready", statusName: "Design Ready", category: "In Progress", movesIn: "UX Team", movesOut: "UX Team" },
      { stage: "Design In Progress", statusName: "Design In Progress", category: "In Progress", movesIn: "Senior Designer", movesOut: "Senior Designer" },
      { stage: "Design Approval", statusName: "Design Approval", category: "In Progress", movesIn: "Senior Designer", movesOut: "Director of UX" },
      { stage: "Dev Review", statusName: "Dev Review", category: "In Progress", movesIn: "Dev Lead", movesOut: "Dev Lead" },
      { stage: "Dev Ready", statusName: "Dev Ready", category: "In Progress", movesIn: "Dev Lead", movesOut: "Dev Lead" },
      { stage: "Dev In Progress", statusName: "Dev In Progress", category: "In Progress", movesIn: "Developer", movesOut: "Developer" },
      { stage: "Dev Approval", statusName: "Dev Approval", category: "In Progress", movesIn: "Developer", movesOut: "Dev Lead" },
      { stage: "QA Stage", statusName: "QA Stage", category: "In Progress", movesIn: "QA Team", movesOut: "QA Lead" },
      { stage: "QA Prod", statusName: "QA Prod", category: "In Progress", movesIn: "QA Team", movesOut: "QA Lead" },
      { stage: "UAT", statusName: "UAT", category: "In Progress", movesIn: "QA Team", movesOut: "PM" },
      { stage: "PM Approval", statusName: "PM Approval", category: "In Progress", movesIn: "PM", movesOut: "PM" },
      { stage: "Executive Review", statusName: "Executive Review", category: "In Progress", movesIn: "PM", movesOut: "Exec or Delegate" },
      { stage: "Released", statusName: "Released", category: "Done", movesIn: "Dev Lead / PM", movesOut: "N/A — terminal stage" },
    ],
    customFields: [
      { name: "Product Area", type: "Multi-select", values: "eCommerce / Customer Portal / Back Office", requiredOn: "Epic, Story, Task", usedFor: "Board filtering, cross-product tagging, reporting" },
      { name: "Discipline", type: "Single-select", values: "UX / Dev-Onshore / Dev-Offshore / QA / PM / Creative", requiredOn: "Task, Subtask", usedFor: "Lane assignment, workload visibility" },
      { name: "Priority", type: "Single-select", values: "Critical / High / Medium / Low", requiredOn: "Epic, Story, Task", usedFor: "Release cadence targeting, BRD SLA calculation" },
      { name: "Release Target", type: "Single-select", values: "Weekly / Monthly / TBD", requiredOn: "Epic, Story, Task", usedFor: "Release planning, cadence management" },
      { name: "Approval Tier", type: "Single-select", values: "Executive / Director / PM / Publishing", requiredOn: "Epic", usedFor: "Routing to correct approval stage, Executive Review trigger" },
      { name: "BRD Tier", type: "Single-select", values: "Tier 1 / Tier 2 / Tier 3", requiredOn: "Epic", usedFor: "BRD SLA calculation, review routing — triggers Executional / Tactical / Strategic decision tier" },
      { name: "Workfront Dependency", type: "Text (free)", values: "Format: WF-[ID] | [Status] | Due: [date]", requiredOn: "Task", usedFor: "Creative asset tracking, Workfront blocker visibility" },
      { name: "Exec Review Required", type: "Single-select", values: "Yes / No / Delegated: [Name]", requiredOn: "Epic", usedFor: "Executive Review gate trigger" },
      { name: "Confluence BRD Link", type: "URL", values: "Direct URL to BRD Confluence page", requiredOn: "Epic", usedFor: "BRD access, audit trail" },
      { name: "Dev Assignment", type: "Single-select", values: "Onshore / Offshore", requiredOn: "Task (Dev)", usedFor: "Dev team routing and workload split" },
    ],
    ticketTemplates: [
      {
        type: "Epic",
        note: "Every Epic must have a linked Confluence BRD page. The description below is a summary — the full detail lives in Confluence.",
        fields: [
          "Epic Summary: [One sentence describing the initiative]",
          "BRD Link: [Confluence BRD page URL]",
          "BRD Tier: [Tier 1 / Tier 2 / Tier 3]",
          "Products Impacted: [eCommerce / Portal / Back Office — select all that apply]",
          "Business Objective: [2–3 sentences — what problem does this solve?]",
          "Success Metric: [Primary KPI]",
          "Release Target: [Weekly / Monthly / TBD]",
          "Approval Tier: [Executive / Director / PM / Publishing]",
          "Exec Review Required: [Yes / No / Delegated: Name]",
          "Dependencies: [List any cross-team or Workfront dependencies]",
        ],
      },
      {
        type: "Story",
        fields: [
          "User Story: As a [user type], I want to [action] so that [outcome].",
          "Acceptance Criteria: Given [context], when [action], then [expected result].",
          "Out of Scope: [What this story does NOT cover]",
          "Design Reference: [Figma link — required before Dev Review]",
          "Dependencies: [List blockers or related tickets]",
        ],
      },
      {
        type: "UX Task",
        fields: [
          "Task: [UX: Design / UX: Research / UX: Review] — [specific description]",
          "Parent Story/Epic: [Link]",
          "Figma File: [Link — add when file is created]",
          "Workfront Dependency: [WF-ID | Status | Due date — if applicable]",
          "Design Constraints: [Component library notes, brand flags, known limitations]",
          "Definition of Done: [What does complete look like for this task?]",
        ],
      },
      {
        type: "Dev Task",
        fields: [
          "Task: [DEV: Build / DEV: Fix / DEV: Review] — [specific description]",
          "Parent Story/Epic: [Link]",
          "Figma Spec: [Link — required at Dev Ready stage]",
          "Dev Assignment: [Onshore / Offshore]",
          "Technical Notes: [Known constraints, API endpoints, integration points]",
          "Acceptance Criteria: [Inherited from Story — confirm alignment]",
          "Definition of Done: Deployed to staging, self-tested, matches Figma spec.",
        ],
      },
      {
        type: "QA Task",
        fields: [
          "Task: [QA: Stage / QA: Prod / QA: UAT] — [specific description]",
          "Parent Story/Epic: [Link]",
          "Test Environment: [Stage URL / Prod URL]",
          "Acceptance Criteria to Test: [Paste from Story]",
          "Devices/Browsers in Scope: [List]",
          "Defects Found: [Link to defect tickets — add during testing]",
          "Sign-Off: [QA Lead name + date when complete]",
        ],
      },
      {
        type: "Publishing-Only Task",
        fields: [
          "Task: [PUBLISH] — [description of content being published]",
          "Product: [eCommerce / Portal / Back Office]",
          "Approval Tier: Publishing",
          "What is being published: [Copy / Image / Asset / CMS update — describe]",
          "Approved By: [PM or Director name — required before publish]",
          "Publish Confirmation: [Screenshot or audit log link — add after publish]",
        ],
      },
    ],
    labels: [
      { label: "needs-discovery", when: "BRD is missing discovery findings — flag for PM to address before Design Review" },
      { label: "workfront-blocked", when: "Ticket is waiting on a Workfront creative asset — mirrors the Workfront Dependency field" },
      { label: "cross-product", when: "Work impacts more than one of the three products" },
      { label: "fast-track", when: "Publishing-only work — no dev required" },
      { label: "hotfix", when: "Post-release emergency fix — bypasses standard cycle with PM Lead approval" },
      { label: "tech-debt", when: "Development work to address technical debt — not user-facing" },
      { label: "accessibility", when: "Work with a specific accessibility requirement or WCAG compliance impact" },
      { label: "design-system", when: "Work that touches or proposes changes to the component library. See Section 10 — Design System Governance." },
      { label: "exec-review", when: "Executive Review has been triggered for this Epic. See Section 4.6 — Executive Review Delegation." },
      { label: "blocked", when: "Ticket cannot progress due to an unresolved external dependency" },
    ],
    components: [
      { product: "eCommerce", name: "Product Listings", desc: "PLP, search results, filters, sorting" },
      { product: "eCommerce", name: "Product Detail", desc: "PDP, images, descriptions, specs" },
      { product: "eCommerce", name: "Cart & Checkout", desc: "Add to cart, cart drawer, checkout flow, payment" },
      { product: "eCommerce", name: "Account & Auth", desc: "Login, registration, account management" },
      { product: "eCommerce", name: "CMS & Content", desc: "Homepage, landing pages, banners, CMS-managed content" },
      { product: "eCommerce", name: "Navigation & Search", desc: "Header, footer, site search, mega menu" },
      { product: "Customer Portal", name: "Dashboard", desc: "Portal home, summary widgets, quick actions" },
      { product: "Customer Portal", name: "Account Management", desc: "Profile, preferences, settings" },
      { product: "Customer Portal", name: "Orders & History", desc: "Order tracking, order history, returns" },
      { product: "Customer Portal", name: "Support & Help", desc: "Help center, ticket submission, live chat" },
      { product: "Back Office", name: "Operations Dashboard", desc: "Internal admin views, reporting, KPIs" },
      { product: "Back Office", name: "Customer Management", desc: "Customer records, qualifying status, account actions" },
      { product: "Back Office", name: "Order Management", desc: "Order processing, fulfillment, status updates" },
      { product: "Back Office", name: "Configuration", desc: "System settings, user roles, permissions" },
    ],
    automations: [
      { rule: "BRD Submitted for Review", trigger: "Ticket moves to Product Review", condition: "Issue type = Epic", action: "Post comment: BRD submitted. UX Lead to review within SLA.", notifies: "UX Lead (assignee tag)" },
      { rule: "BRD Rejected — Return", trigger: "Ticket moves to Backlog from Product Review", condition: "Comment contains rejected", action: "Post comment with rejection template + Confluence link", notifies: "PM (reporter)" },
      { rule: "Design Assigned", trigger: "Ticket moves to Design Review", condition: "Issue type = Epic or Story", action: "Assign to UX Lead; post comment: Entering UX queue.", notifies: "UX Lead" },
      { rule: "Workfront Block Active", trigger: "Workfront Dependency field updated", condition: "Field is not empty", action: "Add label: workfront-blocked; post comment with WF details", notifies: "PM + UX Lead" },
      { rule: "Design Approval — Notify Dev", trigger: "Ticket moves to Design Approval", condition: "Issue type = Epic or Story", action: "Post comment: Design ready for Dev Review.", notifies: "Dev Lead (onshore + offshore)" },
      { rule: "Dev Review Rejected", trigger: "Ticket moves to Design In Progress", condition: "Previous status = Dev Review", action: "Post comment: Returned from Dev Review. See Dev Review comments.", notifies: "UX Lead + PM" },
      { rule: "Dev Approved — Create QA Task", trigger: "Ticket moves to QA Stage", condition: "Issue type = Story or Task", action: "Auto-create linked QA Task using QA template", notifies: "QA Lead" },
      { rule: "QA Defect — Return to Dev", trigger: "Ticket moves to Dev In Progress", condition: "Previous status = QA Stage", action: "Post comment: QA defect found. Returned to Dev.", notifies: "Dev Lead + PM" },
      { rule: "PM Approval Due", trigger: "Ticket moves to PM Approval", condition: "Issue type = Epic or Story", action: "Post comment: Awaiting PM Approval. Window: 1 business day.", notifies: "PM" },
      { rule: "Exec Review Triggered", trigger: "Exec Review Required field = Yes", condition: "Issue type = Epic", action: "Add label: exec-review; assign to Exec delegate if set", notifies: "Exec Stakeholder or Delegate" },
      { rule: "Released — Notify & Close", trigger: "Ticket moves to Released", condition: "Issue type = Epic", action: "Post comment: Released. Link release notes in Confluence.", notifies: "PM + all watchers" },
      { rule: "Stale Ticket Alert", trigger: "Ticket unchanged for 5 business days", condition: "Status is not Backlog or Released", action: "Post comment: This ticket has been inactive for 5 days.", notifies: "Ticket assignee + PM" },
    ],
    confluenceIntegration: [
      { event: "Epic created", action: "PM creates BRD page from template in Product Confluence space; links URL in Confluence BRD Link field", who: "PM", when: "At Epic creation — before moving to Product Review", sectionId: "s9", sectionLabel: "Section 9 — Confluence Configuration Guide" },
      { event: "Epic enters Design Review", action: "UX Lead creates or links Project Kickoff page in UX Confluence space", who: "UX Lead", when: "At Design Review entry", sectionId: "s9", sectionLabel: "Section 9 — Confluence Configuration Guide" },
      { event: "Epic reaches Dev Ready", action: "Dev Lead links or creates Technical Notes page in Dev Confluence space", who: "Dev Lead", when: "At Dev Ready entry", sectionId: "s9", sectionLabel: "Section 9 — Confluence Configuration Guide" },
      { event: "Epic reaches Released", action: "PM creates Release Notes page from template; links in Jira comment", who: "PM", when: "Within 24 hours of release", sectionId: "s9", sectionLabel: "Section 9 — Confluence Configuration Guide" },
      { event: "Epic closed", action: "Confluence BRD page status updated to Released using page label", who: "PM", when: "At Epic closure", sectionId: "s9", sectionLabel: "Section 9 — Confluence Configuration Guide" },
    ],
    slackChannels: [
      { channel: "#product-releases", event: "Epic moves to Released", format: "[Product] — [Epic name] has been released. Release notes: [Confluence link]" },
      { channel: "#product-releases", event: "Epic moves to Executive Review", format: "[Product] — [Epic name] requires Executive Review. Assigned to: [name]. Due: [date]" },
      { channel: "#dev-escalations", event: "Ticket blocked for 3+ business days in any Dev stage", format: "BLOCKED: [Ticket ID] — [name] has been in [stage] for [X] days. PM: [name]" },
      { channel: "#ux-queue", event: "Epic moves to Design Review", format: "New design request: [Ticket ID] — [Epic name]. BRD: [Confluence link]" },
      { channel: "#qa-team", event: "QA Task auto-created (Dev Approval trigger)", format: "New QA task created: [Ticket ID] — [Story name]. Assigned to QA Lead." },
      { channel: "#pm-approvals", event: "Ticket moves to PM Approval", format: "Approval needed: [Ticket ID] — [name]. Window: 1 business day." },
    ],
    workfrontTagSteps: [
      "Submit the Workfront request first — do not tag Jira until a Workfront ticket ID exists.",
      "Open the Jira task that is waiting on the creative asset.",
      "Fill in the Workfront Dependency custom field: WF-[ID] | [Status] | Due: [YYYY-MM-DD]",
      "Add the label: workfront-blocked to the ticket.",
      "The Jira automation will post a comment notifying the PM and UX Lead.",
      "Update the Workfront Dependency field whenever the Workfront status changes.",
      "Remove the workfront-blocked label and clear the dependency field once the asset is delivered.",
    ],
    migrationPlan: [
      { phase: "Phase 1 — Setup", timeframe: "Week 1–2", actions: "Admin creates 4 new boards. Configures workflow stages, custom fields, templates, labels, components. Tests automations with dummy tickets.", owner: "Director of Software + PM Lead" },
      { phase: "Phase 2 — eCommerce", timeframe: "Week 3–4", actions: "eCommerce team migrates active Epics to new board. Old eCommerce board set to read-only. New tickets created on new board only.", owner: "PM (eCommerce) + Director of UX" },
      { phase: "Phase 3 — Portal", timeframe: "Week 5–6", actions: "Portal team migrates active Epics. Old Portal board set to read-only.", owner: "PM (Portal) + Director of UX" },
      { phase: "Phase 4 — Back Office", timeframe: "Week 7–8", actions: "Back Office team migrates. Old Back Office board set to read-only.", owner: "PM (Back Office) + Director of UX" },
      { phase: "Phase 5 — Cleanup", timeframe: "Week 9–12", actions: "All legacy department boards audited. Completed tickets archived. Boards formally archived (not deleted). Confluence migration log updated.", owner: "Director of Software + PM Lead" },
    ],
    quickRef: [
      { topic: "Jira Version", standard: "Atlassian Cloud (SAML) — admin: Director of Software" },
      { topic: "Board Structure", standard: "Program Board + 3 Product Boards + Legacy boards (phasing out)" },
      { topic: "Ticket Hierarchy", standard: "Epic → Story → Task → Subtask — all with naming conventions" },
      { topic: "Workflow Stages", standard: "16 stages across 5 lanes — same configuration on all 4 boards. See Section 3 — The Product Cycle.", sectionId: "s3" },
      { topic: "Required Custom Fields", standard: "10 standardized fields — replaces all legacy per-team fields" },
      { topic: "Ticket Templates", standard: "6 templates: Epic, Story, UX Task, Dev Task, QA Task, Publishing" },
      { topic: "Labels", standard: "10 standard labels — no ad hoc label creation" },
      { topic: "Components", standard: "6 eCommerce + 4 Portal + 4 Back Office = 14 total components" },
      { topic: "Automations", standard: "12 purposeful rules — noise-free, action-oriented only" },
      { topic: "Confluence Integration", standard: "BRD Link required on every Epic — mandatory field. See Section 9 — Confluence Configuration Guide.", sectionId: "s9" },
      { topic: "Slack Integration", standard: "5 channels, 6 trigger events — escalations and releases only" },
      { topic: "Workfront Tag", standard: "WF-[ID] | [Status] | Due: [date] format in custom field. See Section 7 — Creative & Workfront Integration.", sectionId: "s7" },
      { topic: "Transition Approach", standard: "Phased migration — legacy boards archived, not deleted" },
      { topic: "Transition Timeline", standard: "12 weeks across 5 phases" },
    ],
    accordions: [
      { title: "8.1 Board Setup — Step-by-Step (7 steps)", content: "1. Log in to Jira Cloud as Director of Software (admin required). 2. Navigate to Projects > Create Project > select Kanban. 3. Name per convention: [PROG], [ECM], [CPT], [BOF]. 4. Set project lead to appropriate PM. 5. Under Project Settings > Access, set visibility to Private, add team members. 6. Connect product boards to Program Board via Epic parent settings. 7. Archive legacy boards only after migration is confirmed complete." },
      { title: "8.3 Workflow Setup — Step-by-Step (7 steps)", content: "8. Go to Project Settings > Workflow for each product board. 9. Select Edit Workflow (admin required). 10. Add each status using the exact Jira Status Names in the table above. 11. Set the Category for each status: To Do, In Progress, or Done. 12. Draw transitions between statuses following the left-to-right sequence. Add a Return to Design In Progress transition from Dev Review. 13. Apply the same workflow to all four boards. 14. Save and publish. Notify all team members of new stage names." },
      { title: "8.4 Custom Fields Setup — Step-by-Step (8 steps)", content: "15. Go to Jira Settings > Issues > Custom Fields (global admin view). 16. Create each field using the Field Name and Field Type in the table above. 17. For single-select and multi-select fields, add all values exactly as written. 18. Navigate to each project board > Project Settings > Issue Types. 19. For each issue type, add the relevant custom fields from the Required On column. 20. Set Product Area, Priority, Approval Tier, and BRD Tier as required fields on Epic creation. 21. Set Confluence BRD Link as a required field on Epic — blocks movement from Backlog without a linked BRD page. 22. Retire conflicting legacy custom fields by removing them from active project screens." },
      { title: "8.7 Automation Rules — Setup Notes", content: "28. Go to Project Settings > Automation for each product board. 29. Click Create Rule for each automation in the table above. 30. Set Trigger, Condition, and Action exactly as specified. 31. For notifications, use Post a comment with @mention — not email (email is reserved for critical escalations only). 32. Set the Stale Ticket Alert rule globally across all four boards. 33. Test each rule with a dummy ticket before going live. 34. Disable all legacy automation rules from department boards before activating new rules." },
      { title: "8.11 Migration — No Board is Ever Deleted", content: "No legacy board is deleted during this transition — only archived. Archiving preserves the full ticket history and audit trail. If a team needs to reference a historical ticket from a legacy board, it remains accessible in read-only mode indefinitely. Migration is phased: one product at a time across 5 phases over 12 weeks." },
    ]
  },
  {
    id: "s9", num: "09", title: "Confluence Configuration Guide", icon: "BookOpen",
    roles: ["PM", "Dev", "Executive"],
    tagline: "Confluence as the single source of truth for all process documentation, project records, and team references.",
    summary: "Confluence is currently used heavily but erratically — pages exist in isolation, spaces are created without standards, and critical documents are scattered and hard to find. This section establishes the structure that makes documentation findable, trustworthy, and maintainable. The goal is not to create more documentation — it is to make the documentation that matters easy to find and easy to keep current.",
    keyPoints: [
      { label: "5 Governed Spaces", detail: "Design Operations (DESIGNOPS), Product (PRODUCT), UX & Design (UX), Engineering (ENG), Team Onboarding (ONBOARD). All new pages must be created within one of these five spaces — free-floating pages outside the space structure are not permitted." },
      { label: "Findable in 3 Clicks", detail: "Any team member should be able to navigate from the Confluence home page to the document they need in no more than 3 clicks. If it takes longer, the structure is wrong." },
      { label: "Archive, Never Delete", detail: "Pages are never deleted — only archived. Archived pages remain searchable and accessible. This protects institutional knowledge and audit trails." },
    ],
    principles: [
      { name: "One Source of Truth", meaning: "Every piece of process documentation exists in exactly one place. No copies, no duplicates. If something changes, it changes in one place and everyone sees the update." },
      { name: "Findable in 3 Clicks", meaning: "Any team member should be able to navigate from the Confluence home page to the document they need in no more than 3 clicks. If it takes longer, the structure is wrong." },
      { name: "Linked, Not Repeated", meaning: "Instead of copying content between pages, pages link to each other. BRD pages link to Jira Epics. Jira Epics link back to BRD pages. Release notes link to the relevant Epic." },
      { name: "Templates Over Blank Pages", meaning: "No page starts from scratch. Every page type has a template. Templates ensure consistency and reduce the time it takes to create new documentation." },
      { name: "Owner = Accountable", meaning: "Every space and every critical page has a named owner. Ownerless pages become stale. If a page has no owner, it is flagged for archival." },
      { name: "Archive, Never Delete", meaning: "Pages are never deleted — only archived. Archived pages remain searchable and accessible. This protects institutional knowledge and audit trails." },
    ],
    spaces: [
      { key: "DESIGNOPS", name: "Design Operations", owner: "Director of UX", audience: "All team members, executives, new hires, cross-functional partners", purpose: "Home for this document and all process governance. The authoritative reference for how the product cycle works, role definitions, BRD standards, handoff standards, and the design system.", color: "#1E3A5F" },
      { key: "PRODUCT", name: "Product Space", owner: "PM Lead", audience: "PMs, UX, Dev, QA, Executive Stakeholders", purpose: "All active and archived project documentation. BRD pages, project kickoff pages, release notes, Workfront request logs, and retrospectives — organized by product.", color: "#2E86AB" },
      { key: "UX", name: "UX & Design Space", owner: "Director of UX", audience: "UX team, Dev team, PM", purpose: "Design system documentation, component library guidelines, Figma file index, UX handoff standards, and design research findings. The technical reference for how design is done.", color: "#0D47A1" },
      { key: "ENG", name: "Engineering Space", owner: "Director of Software", audience: "Dev team, QA team, PM, Director of UX", purpose: "Technical standards, architecture decisions, QA checklists, dev environment setup guides, and onboarding for new developers.", color: "#1A7A4A" },
      { key: "ONBOARD", name: "Team Onboarding Space", owner: "PM Lead + Director of UX", audience: "New hires across all disciplines", purpose: "Onboarding guides for every role in the product cycle. Links to all relevant spaces, tools setup guides, and first-week checklists. Single destination for anyone new to the team.", color: "#6C3483" },
    ],
    spaceSetupSteps: [
      "Log in to Confluence Cloud as an admin.",
      "Navigate to Spaces > Create Space for each of the five spaces.",
      "Use the exact Space Name and Space Key listed in each card — keys are used in Jira linking and must be consistent.",
      "Set Space Permissions: Design Operations and Onboarding spaces are viewable by all; Product, UX, and Engineering spaces are editable only by their respective teams.",
      "Set the Space Home page for each space using the homepage template defined in Section 9.4 — Page Templates.",
      "Add all relevant team members to each space with appropriate permissions (View / Edit / Admin).",
      "Create a Space Index page in each space as the top-level navigation page — this becomes the 3-click entry point for all content.",
    ],
    pageHierarchy: [
      {
        space: "Design Operations Space",
        color: "#1E3A5F",
        tree: [
          "About This Document",
          "Section 1 — Executive Summary",
          "Section 2 — DesignOps Mission & Scope",
          "Section 3 — The Product Cycle",
          "Section 4 — Roles & Ownership (DRAC)",
          "Section 5 — BRD Standards & Requirements → [TEMPLATE] BRD Template",
          "Section 6 — Handoff Standards",
          "Section 7 — Creative & Workfront Integration",
          "Section 8 — Jira Configuration Guide",
          "Section 9 — Confluence Configuration Guide (this page)",
          "Section 10 — Design System Governance",
          "Section 11 — Quick Wins & Roadmap",
          "Changelog — Document Version History",
        ],
      },
      {
        space: "Product Space",
        color: "#2E86AB",
        tree: [
          "Templates: BRD Template, Project Kickoff, Release Notes, Workfront Request Log, Retrospective",
          "eCommerce > Active Projects > [Epic Name] — BRD [auto-linked from Jira]",
          "eCommerce > Released > [Release Notes by date]",
          "eCommerce > Workfront Request Log — eCommerce",
          "Customer Portal > Active Projects / Released / Workfront Request Log — Portal",
          "Back Office > Active Projects / Released / Workfront Request Log — Back Office",
        ],
      },
      {
        space: "UX & Design Space",
        color: "#0D47A1",
        tree: [
          "Design System > Component Library Index",
          "Design System > Color & Typography Guidelines",
          "Design System > Layout & Grid Standards",
          "Design System > Component Change Log",
          "Figma File Index > eCommerce / Portal / Back Office Figma Files",
          "Handoff Standards > UX → Dev Handoff Checklist",
          "Handoff Standards > Annotation Standards",
          "Research & Insights > [Product] — [Research Project Name]",
        ],
      },
      {
        space: "Engineering Space",
        color: "#1A7A4A",
        tree: [
          "Architecture > eCommerce Architecture Overview",
          "Architecture > Customer Portal Architecture",
          "Architecture > Back Office Architecture",
          "Dev Standards > Coding Standards & Conventions",
          "Dev Standards > Git Branching Strategy",
          "Dev Standards > Environment Setup Guide",
          "QA > QA Checklist — Stage / Prod / UAT Protocol",
          "Technical Decisions Log",
        ],
      },
      {
        space: "Team Onboarding Space",
        color: "#6C3483",
        tree: [
          "Welcome & Overview > How We Work — Product Cycle Summary",
          "Welcome & Overview > Tools Setup Guide (Jira, Confluence, Figma, Slack)",
          "Role Onboarding Guides > [TEMPLATE] Onboarding Guide — PM",
          "Role Onboarding Guides > [TEMPLATE] Onboarding Guide — UX Designer",
          "Role Onboarding Guides > [TEMPLATE] Onboarding Guide — Developer",
          "Role Onboarding Guides > [TEMPLATE] Onboarding Guide — QA",
          "Key Contacts & Escalation Paths",
        ],
      },
    ],
    templates: [
      {
        name: "BRD Template",
        location: "Product Space > Templates > BRD Template",
        note: "This template matches the BRD standard defined in Section 5 — BRD Standards & Requirements exactly. The PM creates this page when the Jira Epic is created and links the URL in the Epic's Confluence BRD Link field.",
        sectionId: "s5",
        sectionLabel: "Section 5 — BRD Standards & Requirements",
        namingFormat: "BRD — [Epic Name] — [Product] — [YYYY-MM-DD]",
        keyFields: [
          "Page Status: Draft / In Review / Accepted / Released",
          "BRD Tier: 1 / 2 / 3",
          "Jira Epic Link",
          "Business Objective & Problem Statement",
          "Success Metrics & KPIs (Primary + Secondary)",
          "Scope — In Scope + Out of Scope (both required)",
          "Discovery & Research Findings",
          "Technical Requirements & Constraints (Dev Lead required)",
          "Design Specifications & Known Constraints (UX Lead)",
          "Acceptance Criteria (Given / When / Then format)",
          "Dependencies",
          "Scaling Roadmap (Tier 2 & 3 only)",
          "BRD Intake Checklist (embedded — matches Section 5.8)",
        ],
      },
      {
        name: "Project Kickoff Page",
        location: "Product Space > [Product] > Active Projects",
        note: "Created by the UX Lead when an Epic enters Design Review. Auto-linked to the Jira Epic. Serves as the living project hub throughout the design and dev cycle.",
        sectionId: null,
        sectionLabel: null,
        namingFormat: "Kickoff — [Epic Name] — [Product]",
        keyFields: [
          "Page Status: Active / In Dev / Released",
          "Quick Links: Jira Epic, BRD, Figma File, Release Notes",
          "Team: PM, UX Lead, Dev Lead (Onshore/Offshore), QA Lead",
          "Key Dates: BRD Accepted, Design Target, Dev Ready Target, Release Target",
          "Decisions Log (table: Date | Decision | Made By | Rationale)",
          "Open Questions (table: Question | Owner | Due | Status)",
          "Workfront Requests (table: WF ID | Type | Status | Due | Delivered?)",
        ],
      },
      {
        name: "Release Notes Template",
        location: "Product Space > [Product] > Released",
        note: "Created by the PM within 24 hours of every release. Linked in the Jira Epic comment and in the Released section of the relevant product folder.",
        sectionId: null,
        sectionLabel: null,
        namingFormat: "Release Notes — [Product] — [YYYY-MM-DD]",
        keyFields: [
          "Release Type: Weekly / Monthly",
          "Released By: [PM name]",
          "What Shipped (table: Epic / Story | Summary | Jira Link)",
          "Known Issues (list any post-release issues and status)",
          "Rollback Plan (describe rollback steps if critical issue found)",
          "Post-Release Monitoring (active until: 48hrs post-release, escalation contact)",
        ],
      },
      {
        name: "Workfront Request Log",
        location: "Product Space > [Product] > Workfront Request Log",
        note: "One log per product. Updated by the UX team whenever a Workfront request is submitted, updated, or resolved. Linked from the Project Kickoff page. See Section 7 — Creative & Workfront Integration.",
        sectionId: "s7",
        sectionLabel: "Section 7 — Creative & Workfront Integration",
        namingFormat: "Workfront Request Log — [eCommerce / Portal / Back Office]",
        keyFields: [
          "Active Requests table: WF ID | Request Type | Project/Epic | Submitted By | Submitted Date | Status | Due Date | Delivered?",
          "Resolved Requests (Last 90 Days) table: WF ID | Request Type | Project/Epic | Delivered Date | Notes",
        ],
      },
      {
        name: "Team Onboarding Guide",
        location: "Team Onboarding Space > Role Onboarding Guides",
        note: "One guide per role. Updated whenever the product cycle, tools, or team structure changes. Owned by the PM Lead (PM guide) and Director of UX (UX guide).",
        sectionId: "s4",
        sectionLabel: "Section 4 — Roles & Ownership (DRAC)",
        namingFormat: "Onboarding Guide — [PM / UX Designer / Developer / QA]",
        keyFields: [
          "Welcome (brief welcome message and purpose of guide)",
          "Your Role in the Product Cycle (reference Section 4  DRAC)",
          "Tools Setup: Jira, Confluence, Figma, Slack, others",
          "Key Pages to Bookmark: Design Ops Guide, Jira board, BRD Template, Team contacts",
          "First Week Checklist (5 items — tools, reading, shadowing, meetings, Slack)",
        ],
      },
    ],
    namingConventions: [
      { pageType: "BRD", format: "BRD — [Epic Name] — [Product] — [YYYY-MM-DD]", example: "BRD — Checkout Flow Redesign — eCommerce — 2025-09-01" },
      { pageType: "Project Kickoff", format: "Kickoff — [Epic Name] — [Product]", example: "Kickoff — Checkout Flow Redesign — eCommerce" },
      { pageType: "Release Notes", format: "Release Notes — [Product] — [YYYY-MM-DD]", example: "Release Notes — eCommerce — 2025-09-15" },
      { pageType: "Workfront Log", format: "Workfront Request Log — [Product]", example: "Workfront Request Log — Customer Portal" },
      { pageType: "Onboarding Guide", format: "Onboarding Guide — [Role]", example: "Onboarding Guide — UX Designer" },
      { pageType: "Research", format: "[Product] — [Research Type] — [YYYY-MM]", example: "eCommerce — Checkout Usability Study — 2025-08" },
      { pageType: "Retrospective", format: "Retro — [Epic or Sprint Name] — [YYYY-MM-DD]", example: "Retro — Checkout Flow Redesign — 2025-10-01" },
      { pageType: "Architecture Doc", format: "[Product] — [System/Area] — Architecture", example: "Customer Portal — Auth System — Architecture" },
    ],
    pageLabels: [
      { label: "brd", appliedTo: "All BRD pages" },
      { label: "active", appliedTo: "Any project page currently in progress" },
      { label: "released", appliedTo: "BRD and kickoff pages for completed projects" },
      { label: "ecommerce", appliedTo: "All pages related to the eCommerce site" },
      { label: "portal", appliedTo: "All pages related to the Customer Portal" },
      { label: "back-office", appliedTo: "All pages related to the Back Office" },
      { label: "workfront", appliedTo: "All Workfront request log pages" },
      { label: "design-system", appliedTo: "All design system and component library pages" },
      { label: "onboarding", appliedTo: "All onboarding guide pages" },
      { label: "archived", appliedTo: "Pages no longer active but preserved for reference" },
    ],
    spaceOwnership: [
      { space: "Design Operations", owner: "Director of UX", backup: "PM Lead", cadence: "Quarterly" },
      { space: "Product", owner: "PM Lead", backup: "Director of UX", cadence: "Monthly (per release)" },
      { space: "UX & Design", owner: "Director of UX", backup: "Senior Designer", cadence: "Quarterly" },
      { space: "Engineering", owner: "Director of Software", backup: "Dev Lead", cadence: "Quarterly" },
      { space: "Team Onboarding", owner: "PM Lead", backup: "Director of UX", cadence: "Semi-annually or after org changes" },
    ],
    pageReviewRules: [
      "Every page in the governed spaces must have a named owner in the page metadata (use the Confluence Owner page property).",
      "Pages marked active that have not been updated in 30 days are flagged automatically — the page owner is notified to update or archive.",
      "Pages marked active that have not been updated in 60 days are escalated to the space owner for review.",
      "BRD pages must be updated to Released status within 24 hours of the corresponding Jira Epic being closed.",
      "Project Kickoff pages must be updated with a release date and link to Release Notes within 24 hours of release.",
    ],
    archivalProtocol: [
      "A page is a candidate for archival if it is more than 90 days old, has no active Jira links, and is not referenced by any other active page.",
      "The space owner reviews archival candidates during the quarterly audit.",
      "Before archiving, the space owner confirms with the page owner that the content is no longer needed as a live reference.",
      "Archived pages are moved to an Archive folder within the relevant space — they are not deleted and remain searchable.",
      "A page is never deleted unless it contains duplicate content that already exists in a more current page, and only with PM Lead or Director of UX approval.",
    ],
    jiraLinking: [
      { direction: "Jira → Confluence", linkType: "Confluence BRD Link field", standard: "URL of the BRD page — required field on all Epics", when: "At Epic creation", sectionId: "s8", sectionLabel: "Section 8.8 — Jira ↔ Confluence Integration" },
      { direction: "Jira → Confluence", linkType: "Jira comment", standard: "Kickoff page URL posted as comment when Epic enters Design Review", when: "At Design Review entry", sectionId: "s8", sectionLabel: "Section 8.8 — Jira ↔ Confluence Integration" },
      { direction: "Jira → Confluence", linkType: "Jira comment", standard: "Release Notes URL posted as comment when Epic is Released", when: "At release", sectionId: "s8", sectionLabel: "Section 8.8 — Jira ↔ Confluence Integration" },
      { direction: "Confluence → Jira", linkType: "Jira Issue macro on BRD page", standard: "Embeds the Epic status directly on the BRD page — updates automatically", when: "At BRD page creation", sectionId: null, sectionLabel: null },
      { direction: "Confluence → Jira", linkType: "Jira Issue macro on Kickoff", standard: "Shows current Epic stage at a glance on the Kickoff page", when: "At Kickoff page creation", sectionId: null, sectionLabel: null },
    ],
    quickRef: [
      { topic: "Number of governed spaces", standard: "5 — DesignOps, Product, UX & Design, Engineering, Onboarding" },
      { topic: "Space creation", standard: "Guided model — proposal required, approved by Director of UX or dept lead" },
      { topic: "Page hierarchy", standard: "Defined tree structure per space — no free-floating pages" },
      { topic: "Required templates", standard: "5 — BRD, Project Kickoff, Release Notes, Workfront Log, Onboarding Guide" },
      { topic: "Page naming", standard: "Mandatory format per page type — see Section 9.5 naming table above" },
      { topic: "Confluence labels", standard: "10 standard labels — mirrors Jira label taxonomy. See Section 8.6 — Labels.", sectionId: "s8" },
      { topic: "Space owner review cadence", standard: "Monthly (Product), Quarterly (DesignOps, UX, Eng), Semi-annual (Onboarding)" },
      { topic: "Stale page alert", standard: "30 days — owner notified; 60 days — escalated to space owner" },
      { topic: "Archival", standard: "Pages moved to Archive folder — never deleted" },
      { topic: "BRD → Jira link", standard: "Jira Issue macro on every BRD and Kickoff page — shows live Epic status" },
      { topic: "Jira → Confluence link", standard: "Confluence BRD Link field required on all Epics. See Section 8.8 — Jira ↔ Confluence Integration.", sectionId: "s8" },
      { topic: "Release notes deadline", standard: "Published within 24 hours of release" },
    ],
    accordions: [
      { title: "9.2 Space Setup — Step-by-Step (7 steps)", content: "1. Log in to Confluence Cloud as an admin. 2. Navigate to Spaces > Create Space for each of the five spaces. 3. Use the exact Space Name and Space Key — keys are used in Jira linking. 4. Set permissions: DesignOps and Onboarding viewable by all; Product, UX, Eng editable by respective teams only. 5. Set Space Home page using the homepage template in Section 9.4. 6. Add team members with View / Edit / Admin permissions. 7. Create a Space Index page in each space as the top-level navigation page." },
      { title: "9.6 New Space Request Process (5 steps)", content: "1. Team member submits a New Space Request using the Space Request form in the Design Operations space. 2. Request must include: proposed space name, space key, owner, audience, purpose, and why existing spaces cannot serve this need. 3. Director of UX (for design/product spaces) or relevant department lead reviews within 5 business days. 4. If approved, the Director of Software creates the space following the setup standards in Section 9.2. 5. If not approved, the requester is directed to the existing space that best serves their need." },
      { title: "9.7 Jira Issue Macro — Why It Matters", content: "The Jira Issue macro in Confluence automatically reflects the current status of the linked Jira ticket. This means a BRD page always shows whether the Epic is in Backlog, Design, Dev, QA, or Released — without the PM manually updating the Confluence page. Use this macro on every BRD and Kickoff page." },
    ]
  },
  {
    id: "s10", num: "10", title: "Design System Governance", icon: "Palette",
    roles: ["Designer", "Dev"],
    tagline: "Who approves creative decisions and the path to full Creative Director ratification.",
    summary: "The design system is the shared visual and behavioral language of all three products. When followed consistently it reduces design time, reduces development time, improves quality, and ensures users experience a coherent product family. When not followed consistently it creates visual drift, rework, and a codebase that diverges from design over time.",
    approvalNote: "All creative direction decisions — colors, typography, visual style, brand tone, layout principles — require approval from the Creative Director or their designated higher report before being adopted into the design system or applied to any product. UX does not make unilateral creative direction decisions. This rule applies without exception, including under deadline pressure.",
    keyPoints: [
      { label: "MUI + Custom Foundation", detail: "Component library is a blend of MUI-based components (themed to the product brand) and custom components built for product-specific needs. Lives in Figma. Used by designers but applied inconsistently — components are sometimes detached, mixed with legacy patterns, or blended with existing published designs." },
      { label: "Tokens Exist — Not Ratified", detail: "Design tokens exist in Figma variables with loose approval from Creative. Colors, spacing, and typography are defined but not formally ratified — pending explicit Creative Director decisions. Tokens may be used for design work but must be formally ratified before being connected to production code." },
      { label: "90-Day Ratification Roadmap", detail: "Token Audit → Creative Director Session → Token Ratification → Token-to-Code Connection → Component Library Audit → Component Ratification → Full Design System v1. All 7 milestones within 90 days, dependent on Creative Director availability and prioritization." },
    ],
    currentState: [
      { area: "Component Library", current: "Blend of MUI-based and custom components in Figma. Used but applied inconsistently — components sometimes detached, mixed with legacy patterns.", target: "Fully documented library in Figma. All components properly structured, named, and sourced. Detachments logged. Consistent use across all three products." },
      { area: "Design Tokens", current: "Tokens exist in Figma variables with loose approval from Creative. Colors, spacing, and typography defined but not formally ratified.", target: "Tokens formally approved by Creative Director. All tokens documented in Confluence UX & Design space. Tokens connected to code (CSS variables / MUI theme) by Dev team." },
      { area: "Color System", current: "Colors exist in Figma but have not been formally approved. Usage is inconsistent across products.", target: "Color palette formally approved by Creative Director. Primary, secondary, semantic, and neutral scales documented with usage rules. Accessible contrast ratios verified." },
      { area: "Typography", current: "Type styles exist in Figma. Font choices and scale have not been formally ratified by Creative Director.", target: "Type scale formally approved. Font families, weights, sizes, and line heights documented per product context (marketing vs. functional UI)." },
      { area: "Layout & Grid", current: "No formal grid or layout system documented. Designers apply spacing based on judgment.", target: "Grid system documented: column counts, gutters, margins per breakpoint. Spacing scale tied to design tokens." },
      { area: "Iconography", current: "Icons sourced from MUI icon set with ad hoc additions. No formal icon usage standard.", target: "Icon library documented. Usage rules defined. New icon requests go through component request process." },
      { area: "Motion & Animation", current: "No motion standards exist. Animations applied ad hoc.", target: "Basic motion principles documented (duration, easing, purpose). Defined after Creative Director ratification." },
    ],
    approval_gates: [
      { decision: "Use an existing approved component", canUX: "Yes", approver: "N/A", urgencyOverride: "N/A" },
      { decision: "Detach a component for one-off modification", canUX: "With documentation", approver: "Director of UX notified", urgencyOverride: "No" },
      { decision: "Apply an existing approved token (color, spacing)", canUX: "Yes", approver: "N/A", urgencyOverride: "N/A" },
      { decision: "Introduce a new color not in the current token set", canUX: "No", approver: "Creative Director or higher report", urgencyOverride: "No" },
      { decision: "Change or extend the type scale", canUX: "No", approver: "Creative Director or higher report", urgencyOverride: "No" },
      { decision: "Introduce a new layout pattern or grid variation", canUX: "No", approver: "Creative Director or Director of UX", urgencyOverride: "No" },
      { decision: "Add a new icon not in the MUI set", canUX: "No", approver: "Director of UX + Creative Director", urgencyOverride: "No" },
      { decision: "Propose a new component for the library", canUX: "Propose only", approver: "Director of UX to review, Creative Director approves visual direction", urgencyOverride: "No" },
      { decision: "Apply motion or animation to a new interaction", canUX: "No", approver: "Creative Director or higher report", urgencyOverride: "No" },
      { decision: "Override a brand guideline for a product-specific need", canUX: "No", approver: "Creative Director — in writing", urgencyOverride: "No" },
    ],
    componentUsageRules: [
      "All components must be sourced from the Figma component library — not copied from old files, not recreated from scratch.",
      "Use the component as structured — do not manually override styles by detaching unless documented and approved.",
      "Apply props and variants within the component's designed range — do not force components into use cases they were not designed for.",
      "If an existing component does not meet the need, submit a component request (Section 10.3.3) — do not create a one-off workaround.",
    ],
    detachingRules: [
      { condition: "The component needs a minor visual adjustment not available as a prop", permitted: "Yes — with documentation", action: "Add a Figma comment explaining the detachment reason. Notify Director of UX in the Jira task comment." },
      { condition: "The component is being used as a starting point for a new component", permitted: "Yes — as a draft only", action: "Label the frame as [DRAFT — Not for Dev]. Submit a component request before proceeding to Dev." },
      { condition: "The component does not fit the use case at all", permitted: "No — submit a request", action: "Do not detach. Submit a component request. Use the closest available component as a placeholder." },
      { condition: "Deadline pressure requires a faster solution", permitted: "No", action: "Deadline pressure is not a reason to bypass the component library. Escalate the timeline — do not bypass the system." },
    ],
    newComponentSteps: [
      "Designer identifies the gap and documents: what is needed, why no existing component serves the need, which products will use it, and a proposed visual direction (wireframe or sketch).",
      "Designer creates a Jira Task tagged with the label design-system and the component request details. See Section 8.6 — Label Taxonomy.",
      "Director of UX reviews the request. If the component requires new visual direction (new color, new pattern), Creative Director approval is required before design begins.",
      "If approved, Director of UX or Senior Designer designs the new component in a [DRAFT] Figma frame, following existing library patterns and token usage.",
      "Director of UX reviews the draft component for consistency with the existing library.",
      "Creative Director approves the visual direction (required for any new visual element).",
      "Director of Software or Dev Lead reviews for technical feasibility.",
      "Component is added to the Figma library by the Director of UX. Component Change Log in the Confluence UX & Design Space is updated. See Section 9.3 — Page Hierarchy.",
      "Dev team implements the coded equivalent in the MUI theme or custom component layer.",
    ],
    tokenCategories: [
      { category: "Color — Brand", currentStatus: "Exists in Figma, loosely approved", rule: "Use as-is for design. Do not add new values. Pending Creative Director ratification.", owner: "Creative Director" },
      { category: "Color — Semantic (success, error, warning, info)", currentStatus: "Exists in Figma", rule: "Use as-is. Pending ratification for accessibility verification.", owner: "Creative Director + Dir UX" },
      { category: "Color — Neutral", currentStatus: "Exists in Figma", rule: "Use as-is. Pending ratification.", owner: "Creative Director" },
      { category: "Typography — Scale", currentStatus: "Exists in Figma, not formally ratified", rule: "Use existing scale. No new sizes without approval.", owner: "Creative Director" },
      { category: "Typography — Fonts", currentStatus: "Font families defined, not ratified", rule: "Do not change font families without Creative Director approval.", owner: "Creative Director" },
      { category: "Spacing Scale", currentStatus: "Exists in Figma variables", rule: "Use existing scale. Spacing increments must follow the defined scale — no arbitrary values.", owner: "Director of UX" },
      { category: "Border Radius", currentStatus: "Exists loosely", rule: "Use existing values. No new radii without Director of UX review.", owner: "Director of UX" },
      { category: "Elevation / Shadow", currentStatus: "Partially defined", rule: "Use defined values. Pending Creative Director ratification for full shadow scale.", owner: "Creative Director" },
      { category: "Motion / Duration", currentStatus: "Not formally defined", rule: "No motion tokens until Creative Director defines motion standards.", owner: "Creative Director" },
    ],
    figmaFileNaming: [
      { fileType: "Product Design File", format: "[Product] — [Epic Name] — [Version]", example: "eCommerce — Checkout Redesign — v1" },
      { fileType: "Component Library", format: "[Product] Component Library — [Version]", example: "eCommerce Component Library — v3.2" },
      { fileType: "Design System Reference", format: "Design System — [Category] — [Version]", example: "Design System — Color Tokens — v1" },
      { fileType: "Exploration / Draft", format: "[DRAFT] — [Description]", example: "[DRAFT] — New checkout confirmation concepts" },
      { fileType: "Archived File", format: "[ARCHIVED] — [Original Name] — [Date]", example: "[ARCHIVED] — Checkout Redesign v1 — 2025-08" },
    ],
    figmaFileRules: [
      "Every Figma file linked to a Jira ticket must have a cover page with: project name, product, designer name, version, and status (Draft / In Review / Approved / Handed Off).",
      "Pages within a file must be organized: Cover > Flows > Components Used > Archive.",
      "All frames must be named — no Frame 1, Frame 2, or untitled frames in any file submitted for review or handoff.",
      "All layers must be named meaningfully — component layers inherit their component name; custom layers use descriptive names.",
      "Prototype connections must be complete for any interactive flow submitted for review.",
      "Design tokens must be applied via Figma variables — no hardcoded hex values or arbitrary spacing values in production files.",
    ],
    versionControlRules: [
      "Use Figma's Version History feature to save named versions at key milestones: v1 — Initial concept, v2 — Post-feedback revision, v3 — Dev handoff.",
      "Never delete old frames — move them to the Archive page within the file.",
      "When a file is handed off to Dev, the Figma link in Jira must point to the specific approved page — not the file root.",
      "Files no longer active are renamed with the [ARCHIVED] prefix and moved to the Figma Archive project.",
    ],
    designSystemRoadmap: [
      { milestone: "Token Audit", description: "Director of UX audits all existing Figma variables and documents current token set in Confluence UX space.", owner: "Director of UX", dependency: "None", target: "30 days" },
      { milestone: "Creative Director Session", description: "Director of UX presents token audit to Creative Director. Creative Director formally approves, rejects, or revises each token category.", owner: "Director of UX", dependency: "Token Audit complete", target: "45 days" },
      { milestone: "Token Ratification", description: "Approved tokens documented in Confluence with usage rules. Figma variables updated to reflect any Creative Director revisions.", owner: "Director of UX", dependency: "Creative Director Session", target: "60 days" },
      { milestone: "Token-to-Code Connection", description: "Dev Lead connects ratified Figma tokens to CSS variables / MUI theme. Design and code are in sync.", owner: "Director of Software", dependency: "Token Ratification", target: "75 days" },
      { milestone: "Component Library Audit", description: "Director of UX audits all Figma components — documents which are MUI-based, which are custom, and which need Creative Director review.", owner: "Director of UX", dependency: "Token Ratification", target: "75 days" },
      { milestone: "Component Ratification", description: "Creative Director reviews components flagged during audit. Any visual direction changes approved and applied.", owner: "Creative Director", dependency: "Component Library Audit", target: "90 days" },
      { milestone: "Full Design System v1", description: "Fully ratified design system published in Confluence. Component library, tokens, usage rules, and governance process all documented and enforced.", owner: "Director of UX", dependency: "All prior milestones", target: "90 days" },
    ],
    jiraConfluenceConnections: [
      { connection: "Jira label design-system", standard: "Applied to any Jira ticket that touches the component library — new components, token changes, or design system defects. See Section 8.6 — Label Taxonomy.", sectionId: "s8" },
      { connection: "Component request tickets", standard: "Created as Jira Tasks with label design-system. Linked to the relevant Epic if triggered by a product initiative.", sectionId: null },
      { connection: "Confluence Component Index", standard: "Every approved component listed in UX & Design Confluence space with: name, description, Figma link, MUI base (if applicable), and approved usage notes. See Section 9.3 — Page Hierarchy.", sectionId: "s9" },
      { connection: "Confluence Component Change Log", standard: "All library changes logged with: date, change description, approved by, and Figma version reference.", sectionId: "s9" },
      { connection: "Confluence Token Documentation", standard: "All ratified tokens documented with: name, value, usage rule, and approval date. Updated after every Creative Director session.", sectionId: "s9" },
      { connection: "Figma File Index", standard: "All active Figma files listed in Confluence UX space with Jira Epic link and current file status. See Section 9.3 — Page Hierarchy.", sectionId: "s9" },
    ],
    quickRef: [
      { topic: "Component library foundation", standard: "MUI-themed base + custom components — lives in Figma" },
      { topic: "Token status", standard: "Exist in Figma variables — pending Creative Director ratification" },
      { topic: "Creative direction authority", standard: "Creative Director or higher report — required for ALL new visual decisions" },
      { topic: "New color / type / layout", standard: "No — Creative Director approval required without exception" },
      { topic: "New component request", standard: "9-step process — Jira Task + Director of UX review + Creative Director approval. See Section 8.6 — Label Taxonomy.", sectionId: "s8" },
      { topic: "Detaching components", standard: "Permitted only with documentation and Director of UX notification" },
      { topic: "Token naming format", standard: "[category]/[variant]/[state] — e.g. color/brand/primary" },
      { topic: "Figma file naming", standard: "[Product] — [Epic Name] — [Version]" },
      { topic: "Version control", standard: "Named versions at key milestones — Archive page for old frames" },
      { topic: "Design system ratification", standard: "90-day roadmap — Token Audit → Creative Director Session → Full DS v1" },
      { topic: "Jira label for DS work", standard: "design-system — applied to all component and token tickets. See Section 8.6 — Label Taxonomy.", sectionId: "s8" },
      { topic: "Confluence home for DS", standard: "UX & Design Space > Design System section. See Section 9.2 — Space Architecture.", sectionId: "s9" },
    ],
    accordions: [
      { title: "10.2 Urgency Override Rule", content: "If a creative direction decision is needed urgently and the Creative Director is unavailable, the Director of UX escalates to the Creative Director's direct manager or the relevant Executive Stakeholder. Work does not proceed with an unapproved creative direction decision — a placeholder or an approved existing standard is used until approval is received." },
      { title: "10.3.3 Component Request — What Happens at Rejection", content: "A component request that is rejected at any stage returns to the designer with specific comments. It does not move forward without addressing the feedback. A component used in production that was not approved through this process will be flagged and must be retroactively reviewed or replaced." },
      { title: "10.4 Token Governance — Urgency Rule", content: "No new token values may be introduced without Creative Director approval. Tokens that currently exist with loose approval are treated as interim standards — they may be used for design work but must be formally ratified before being connected to production code. The Director of UX is responsible for scheduling the token ratification session with the Creative Director." },
      { title: "10.6 Roadmap Dependency Warning", content: "This roadmap is dependent on Creative Director availability and prioritization. The Director of UX is responsible for scheduling the required sessions and escalating if the timeline is at risk. Until the formal design system is ratified, all creative direction decisions continue to require Creative Director approval per Section 10.2." },
    ]
  },
  {
    id: "s11", num: "11", title: "Quick Wins & Implementation Roadmap", icon: "TrendingUp",
    roles: ["PM", "Designer", "Dev", "QA", "Executive"],
    tagline: "What changes, when, and how we know it's working. Phased to deliver measurable value at each milestone.",
    summary: "This section translates everything in this document into a concrete, phased action plan. Each phase delivers measurable value independently — this is not a plan where nothing works until everything is done. The implementation does not require a pause on current product work. Every action is designed to be executed in parallel with the existing release cadence.",
    executiveNote: "The implementation of this roadmap does not require a pause on current product work. Every action below is designed to be executed in parallel with the existing release cadence. The team ships while the process improves around it.",
    keyPoints: [
      { label: "Days 1–30: Foundation", detail: "BRD template published.  DRAC published. Jira ticket templates created for all 6 types. Workfront Dependency field added. Standard labels communicated. Approval timeboxes and escalation path communicated. Focus: stop the bleeding." },
      { label: "Days 31–60: Structure", detail: "Program board + 4 product boards created. Unified 16-stage workflow configured. All 10 custom fields created. eCommerce team migrated to new board. 5 Confluence spaces live. Page hierarchy built. All 5 templates published. Handoff checklists embedded in ticket templates. Focus: build the infrastructure." },
      { label: "Days 61–90: Optimization", detail: "Portal + Back Office migrated. 12 automation rules live. Jira → Slack integration configured. Legacy boards audited and archived. Token audit complete. Baseline metrics captured for all 5 KPIs. First retrospective. Executive progress report. Focus: close the loop." },
    ],
    costOfCurrentState: [
      { stat: "#1", label: "Rework Driver", detail: "BRDs missing required information — the leading cause of design and dev rework across all three products." },
      { stat: "2–5x", label: "Cycle Inflation", detail: "Estimated cycle time increase when a ticket is rejected and restarted mid-cycle due to incomplete handoffs or missing requirements." },
      { stat: "3+", label: "Tools Disconnected", detail: "Jira, Confluence, and Workfront operate without a shared standard or bridge, creating blind spots at every team boundary." },
      { stat: "0", label: "Formal Handoffs", detail: "No documented handoff standard exists today across any of the 6 team transitions. Every team receives work in whatever format was convenient for the sender." },
    ],
    phase1: {
      title: "Days 1–30 — Foundation",
      subtitle: "Stop the Bleeding",
      color: "#1565C0",
      quickWin: "Day 30 Win: The first BRD submitted using the new template is reviewed by UX using the intake checklist. Regardless of outcome, this marks the first time a formal standard has been applied to the BRD process. That is measurable progress.",
      columns: [
        { heading: "BRD & Process", items: [
          "BRD template published in Confluence Product space",
          "BRD intake checklist embedded in template",
          "BRD rejection protocol communicated to all PMs",
          "BRD tier definitions shared with PM team",
        ]},
        { heading: "Jira", items: [
          "Director of Software briefed on new Jira structure",
          "Jira ticket templates created for all 6 ticket types",
          "Workfront Dependency custom field added to Jira",
          "Standard labels taxonomy published",
        ]},
        { heading: "People &  DRAC", items: [
          " DRAC matrix published in Confluence DesignOps space",
          "Executive Review trigger criteria communicated",
          "Approval timebox windows communicated to all leads",
          "Escalation path posted in #product-releases Slack channel",
        ]},
      ],
    },
    phase2: {
      title: "Days 31–60 — Structure",
      subtitle: "Build the Infrastructure",
      color: "#1A7A4A",
      quickWin: "Day 60 Win: The eCommerce team runs its first full ticket cycle on the new Jira board. Every stage transition is tracked. Workfront dependency tags are used for the first time. The first release notes page is created in Confluence from the template.",
      columns: [
        { heading: "Jira", items: [
          "Program board and all 4 product boards created by Director of Software",
          "Unified 16-stage workflow configured on all boards",
          "All 10 custom fields created and configured",
          "eCommerce team migrated to new board (Phase 2 of transition plan)",
          "Legacy eCommerce board set to read-only",
        ]},
        { heading: "Confluence", items: [
          "5 governed spaces created and structured",
          "Page hierarchy built per Section 9.3 trees",
          "All 5 page templates published and accessible",
          "DesignOps Guide published in its Confluence home",
        ]},
        { heading: "Handoffs", items: [
          "UX → Dev handoff checklist embedded in UX task template",
          "Dev → QA handoff checklist embedded in Dev task template",
          "QA sign-off comment standard communicated to QA team",
        ]},
      ],
    },
    phase3: {
      title: "Days 61–90 — Optimization",
      subtitle: "Close the Loop",
      color: "#6C3483",
      quickWin: "Day 90 Win: The first ticket has traveled the complete new cycle — from BRD submission through Release — on all three product boards. Metrics baseline is established. The executive team receives a progress report showing measurable improvement in cycle time and BRD quality.",
      columns: [
        { heading: "Jira", items: [
          "Portal team migrated to new board (Phase 3)",
          "Back Office team migrated to new board (Phase 4)",
          "12 automation rules built and tested",
          "Jira → Slack integration configured for 5 channels",
          "Legacy boards audited and archived (Phase 5 begins)",
        ]},
        { heading: "Design System", items: [
          "Token audit completed by Director of UX",
          "Creative Director session scheduled for ratification",
          "Component library audit underway",
        ]},
        { heading: "Measurement", items: [
          "Baseline metrics captured for all 5 KPIs",
          "First retrospective held using new Confluence template",
          "Day 90 progress report prepared for executive review",
          "Days 91+ roadmap adjusted based on retrospective findings",
        ]},
      ],
    },
    ongoingOps: [
      { activity: "BRD quality review", cadence: "Monthly", owner: "Director of UX + PM Lead", output: "BRD rejection rate trend report. Process adjustments if rejection rate is not declining.", sectionId: "s5", sectionLabel: "Section 5 — BRD Standards & Requirements" },
      { activity: "Jira board health check", cadence: "Monthly", owner: "PM Lead", output: "Stale tickets resolved. Labels cleaned. Automation rules verified.", sectionId: "s8", sectionLabel: "Section 8 — Jira Configuration Guide" },
      { activity: "Confluence space audit", cadence: "Quarterly", owner: "Space owners (per Section 9.6)", output: "Outdated pages archived. Templates updated. Ownership confirmed.", sectionId: "s9", sectionLabel: "Section 9 — Confluence Configuration Guide" },
      { activity: "Process retrospective", cadence: "After every Tier 2+ release", owner: "Director of UX", output: "Action items logged. Document updated if process changes.", sectionId: "s3", sectionLabel: "Section 3 — The Product Cycle" },
      { activity: " DRAC review", cadence: "After org changes", owner: "Director of UX", output: "Section 4 updated. Changes communicated to all leads.", sectionId: "s4", sectionLabel: "Section 4 — Roles & Ownership (DRAC)" },
      { activity: "Design system ratification", cadence: "Per 90-day DS roadmap", owner: "Director of UX", output: "Tokens and components formally approved. DS v1 published.", sectionId: "s10", sectionLabel: "Section 10 — Design System Governance" },
      { activity: "Metrics review", cadence: "Quarterly", owner: "Director of UX + PM Lead", output: "KPI dashboard updated. Trends presented to executive team." },
      { activity: "Onboarding guide update", cadence: "After any team change", owner: "PM Lead + Director of UX", output: "Role onboarding guides updated to reflect current team and process.", sectionId: "s9", sectionLabel: "Section 9 — Confluence Configuration Guide" },
      { activity: "Tool configuration review", cadence: "Quarterly", owner: "Director of Software + PM Lead", output: "Jira + Confluence config reviewed against standards in Sections 8–9.", sectionId: "s8", sectionLabel: "Section 8 — Jira Configuration Guide" },
    ],
    metrics: [
      { name: "BRD Rework Rate", what: "Percentage of BRDs rejected at intake and requiring revision before acceptance", baseline: "Count BRD rejections vs. submissions in Jira over 30 days post-launch", target6: "50% reduction from baseline", target12: "75% reduction from baseline" },
      { name: "Cycle Time per Stage", what: "Average days a ticket spends in each Jira workflow stage", baseline: "Jira time-in-status report across all boards at Day 90", target6: "Design and Dev stages each reduced by 20%", target12: "All stages within defined SLA windows 80% of the time" },
      { name: "Handoff Rejection Rate", what: "Percentage of handoffs rejected and returned to the sending team", baseline: "Count Jira tickets returned from each stage over 30 days", target6: "Rejection rate stable or declining — not increasing", target12: "Fewer than 15% of handoffs rejected across all transitions" },
      { name: "Workfront Turnaround", what: "Average days from Workfront submission to asset delivery", baseline: "Confluence Workfront Request Log review at Day 90", target6: "All deliveries within SLA 70% of the time", target12: "All deliveries within SLA 85% of the time" },
      { name: "Release Frequency vs. Defect Rate", what: "Number of releases per month vs. post-release critical defects", baseline: "Count releases and P1 defects over 30 days post-launch", target6: "Release frequency maintained — defect rate reduced by 20%", target12: "Release frequency increased OR defect rate reduced by 40%" },
    ],
    ownerSummary: [
      { owner: "Director of UX", phase1: "Publish BRD template +  DRAC. Communicate standards to team.", phase2: "Publish DesignOps Guide in Confluence. Build UX space page tree.", phase3: "Token audit. Creative Director session scheduled. First retrospective.", ongoing: "Quarterly metrics review. Document maintenance. Process retrospectives." },
      { owner: "PM Lead", phase1: "Communicate BRD standards to PMs. Share escalation path.", phase2: "Build Confluence Product space. Oversee eCommerce migration. Capture baseline metrics.", phase3: "Oversee Portal and Back Office migration.", ongoing: "Monthly Jira board health. Onboarding guide updates. Metrics reporting." },
      { owner: "Director of Software", phase1: "Review Jira structure spec. Prepare for board build.", phase2: "Create 4 boards. Configure 16-stage workflow. Add 10 custom fields.", phase3: "Build 12 automations. Configure Slack integration. Archive legacy boards.", ongoing: "Quarterly tool configuration review. Jira admin governance." },
      { owner: "Product Managers", phase1: "Submit first BRD using new template. Begin using rejection protocol.", phase2: "Migrate in-flight Epics to new boards. Use new ticket templates.", phase3: "Full cycle on new board. Use Workfront tags. Write release notes in Confluence.", ongoing: "BRD quality. Jira hygiene. Release notes. Workfront dependency updates." },
      { owner: "Senior Designer", phase1: "Review handoff checklists. Begin using UX task template. Update Confluence Workfront log.", phase2: "Use Workfront submission process. First full cycle with all handoff standards applied.", phase3: "First full cycle with all handoff standards applied.", ongoing: "Component library discipline. Figma file hygiene. Handoff quality." },
    ],
    successAt12Months: [
      { today: "BRDs arrive missing discovery, constraints, and acceptance criteria", future: "BRDs pass intake on first submission the majority of the time" },
      { today: "Decisions stall because no one knows who owns them", future: "Every decision has a named owner and a timebox — stalls are escalated, not absorbed" },
      { today: "Jira has one board per department — no shared workflow", future: "One unified workflow across all four boards — tickets are trackable at a glance" },
      { today: "Handoffs are informal — receiving teams absorb the gap", future: "Every handoff has a checklist — rejected handoffs are the exception, not the rule" },
      { today: "Workfront dependencies are invisible inside Jira", future: "Workfront status is visible on every Jira ticket that has a creative dependency" },
      { today: "Confluence pages are scattered and untrusted", future: "Five governed spaces — every document is findable in 3 clicks or fewer" },
      { today: "The design system has no formal governance", future: "Tokens and components are ratified — Creative Director has approved Design System v1" },
      { today: "UX absorbs every upstream gap without a formal escalation path", future: "UX has a defined escalation path, a formal rejection protocol, and  DRAC backing" },
    ],
    quickRef: [
      { phase: "Days 1–30", focus: "Foundation", deliverables: "BRD template,  DRAC published, Jira templates, Workfront tag field", win: "First BRD reviewed using the new intake checklist" },
      { phase: "Days 31–60", focus: "Structure", deliverables: "All boards live, Confluence spaces built, eCommerce migrated, handoff checklists active", win: "First full ticket cycle on new eCommerce board" },
      { phase: "Days 61–90", focus: "Optimization", deliverables: "All 3 products migrated, automations live, Slack integration, baseline metrics captured", win: "Full cycle complete across all products — metrics baseline set" },
      { phase: "Ongoing", focus: "Sustaining", deliverables: "Monthly/quarterly reviews, metrics reporting, document maintenance, DS ratification", win: "Quarterly executive metrics report" },
    ],
    accordions: [
      { title: "11.1 ROI Signal — The Math on Rework", content: "These are organizational friction costs — they do not show up on a single line item but they compound across every product cycle, every quarter. A team that spends 30% of its time on rework and re-alignment has 30% less capacity for shipping. Process investment is capacity investment." },
      { title: "11.6 Metrics Note — How to Read Rising Rejection Rate", content: "These metrics are not intended to be punitive — they exist to surface where the process is working and where it needs adjustment. A rising rejection rate, for example, may indicate the team is getting better at catching problems early, not that something is broken. Context matters. The Director of UX adds interpretive notes to each quarterly metrics report." },
      { title: "11.8 What Changes at 12 Months — Full Comparison", content: "See the Today vs 12 Months table above for the complete before/after picture across all 8 dimensions: BRD quality, decision ownership, Jira structure, handoff standards, Workfront visibility, Confluence findability, design system governance, and UX escalation authority." },
    ]
  },
];

const ALL_ROLES = ["PM", "Designer", "Dev", "QA", "Executive"];

// Build search index — hardened with null guards + full coverage of all data shapes
const safe = (v) => (v == null ? "" : String(v));

const SEARCH_INDEX = [];
SECTIONS.forEach(s => {
  const push = (id, title, text, type, subsectionId = null) => {
    const safeText = safe(text);
    const safeTitle = safe(title);
    if (!safeText && !safeTitle) return; // skip empty entries
    SEARCH_INDEX.push({ id, sectionId: s.id, title: safeTitle, text: safeText, type, num: s.num, subsectionId });
  };

  // Core
  push(s.id, s.title, s.tagline, "section");
  push(s.id + "-sum", s.title + " — Overview", s.summary, "content");

  // Key points
  s.keyPoints?.forEach((kp, i) => push(s.id + "-kp" + i, s.title + " — " + safe(kp.label), kp.detail, "detail"));

  // Accordions
  s.accordions?.forEach((a, i) => push(s.id + "-acc" + i, s.title + " — " + safe(a.title), a.content, "detail"));

  // S1 — problems, framework, ROI, objections, decisions, quickWins, docStructure
  s.problems?.forEach((p, i) => push(s.id + "-prob" + i, "Problem: " + safe(p.problem), safe(p.impact) + " " + safe(p.section), "problem"));
  s.framework?.forEach((f, i) => push(s.id + "-fw" + i, "Framework: " + safe(f.system), safe(f.does) + " " + safe(f.outcome), "framework"));
  s.roiTimeline?.forEach((r, i) => push(s.id + "-roi" + i, "ROI — " + safe(r.timeframe), safe(r.changes) + " " + safe(r.impact), "roi"));
  s.objections?.forEach((o, i) => push(s.id + "-obj" + i, "Objection: " + safe(o.q), o.a, "objection"));
  s.decisions?.forEach((d, i) => push(s.id + "-dec" + i, "Decision: " + safe(d.text), safe(d.owner) + " " + safe(d.impact), "decision"));
  s.quickWins?.forEach((w, i) => push(s.id + "-win" + i, "Quick Win: " + safe(w.win), safe(w.who) + " " + safe(w.why), "quickwin"));
  s.docStructure?.forEach((d, i) => push(s.id + "-doc" + i, "Section " + safe(d.num) + " — " + safe(d.title), safe(d.audience) + " " + safe(d.question), "guide"));

  // S2 — whyNow, products, mandates, uxNeeds, governs
  s.whyNow?.forEach((w, i) => push(s.id + "-why" + i, "Why Now: " + safe(w.title), w.body, "context"));
  s.products?.forEach((p, i) => push(s.id + "-prod" + i, "Product: " + safe(p.name), safe(p.audience) + " " + safe(p.scope) + " " + safe(p.uxFocus), "product"));
  s.uxConstraints?.forEach((c, i) => push(s.id + "-uxc" + i, "UX Constraint: " + safe(c.label), c.desc, "constraint"));
  s.mandates?.forEach((m, i) => push(s.id + "-man" + i, "Mandate: " + safe(m.responsibility), safe(m.description) + " " + safe(m.owner), "mandate"));
  s.uxNeeds?.forEach((n, i) => push(s.id + "-need" + i, "Bilateral: " + safe(n.team), safe(n.fromTeam) + " " + safe(n.fromUX), "bilateral"));
  s.governs?.forEach((g, i) => push(s.id + "-gov" + i, "Governs: " + safe(g.item), g.item, "governance"));
  s.livingDoc?.forEach((l, i) => push(s.id + "-liv" + i, "Living Doc: " + safe(l.activity), safe(l.cadence) + " " + safe(l.owner) + " " + safe(l.output), "cadence"));

  // S3 — stages, laneMovement, releaseCadence, crossProduct, doneDefinitions, quickRef
  s.stages?.forEach((st, i) => push(s.id + "-stage" + i, "Stage: " + safe(st.name), safe(st.entry) + " " + safe(st.exit) + " " + safe(st.notes), "stage"));
  s.laneMovement?.forEach((l, i) => push(s.id + "-lane" + i, "Lane: " + safe(l.lane), safe(l.stages) + " " + safe(l.owner), "lane"));
  s.releaseCadence?.forEach((r, i) => push(s.id + "-rel" + i, "Release: " + safe(r.type), safe(r.examples) + " " + safe(r.approval), "release"));
  s.crossProduct?.forEach((c, i) => push(s.id + "-cp" + i, "Cross-Product: " + safe(c.workType), safe(c.board) + " " + safe(c.ticket), "cross-product"));
  s.doneDefinitions?.forEach((d, i) => push(s.id + "-done" + i, "Done: " + safe(d.level), d.definition, "done"));
  s.quickRef?.forEach((q, i) => push(s.id + "-qr" + i, "Quick Ref: " + safe(q.topic), safe(q.standard) || safe(q.deliverables) || safe(q.win), "quickref"));

  // S4 DRAC — dracLegend, decisionTiers, roles_detail, dracMatrix, fastTrackDRAC, arcPeerReview, escalationPath
  s.dracLegend?.forEach((r, i) => push(s.id + "-drac" + i, "DRAC: " + safe(r.code) + " — " + safe(r.role), safe(r.meaning) + " " + safe(r.timebox), "drac"));
  s.decisionTiers?.forEach((d, i) => push(s.id + "-tier" + i, "Decision Tier: " + safe(d.tier), safe(d.description) + " " + safe(d.rule) + " " + safe(d.examples), "tier"));
  s.roles_detail?.forEach((r, i) => push(s.id + "-role" + i, "Role: " + safe(r.role), r.detail, "role"));
  s.dracMatrix?.forEach((row, i) => push(s.id + "-dm" + i, "DRAC Activity: " + safe(row.activity), safe(row.driver) + " " + safe(row.reviewer) + " " + safe(row.accountable) + " " + safe(row.note), "activity"));
  s.fastTrackDRAC?.rows?.forEach((r, i) => push(s.id + "-ft" + i, "Fast-Track: " + safe(r.activity), safe(r.driver) + " " + safe(r.accountable), "fasttrack"));
  s.arcPeerReview?.triggers?.forEach((trig, i) => push(s.id + "-arc" + i, "Architecture Peer Review", trig, "architecture"));
  s.escalationPath?.forEach((ep, i) => push(s.id + "-esc" + i, "Escalation: " + safe(ep.step), ep.detail, "escalation"));
  s.silentApprovalRule?.vetoRequirements?.forEach((req, i) => push(s.id + "-veto" + i, "Veto Requirement " + (i+1), req, "rule"));
  s.raciLegend?.forEach((r, i) => push(s.id + "-rl" + i, "RACI: " + safe(r.code), safe(r.meaning) + " " + safe(r.who), "raci"));
  s.raciMatrix?.forEach((row, i) => push(s.id + "-rm" + i, "RACI: " + safe(row.activity), safe(row.phase), "activity"));
  s.decisionTypes?.forEach((d, i) => push(s.id + "-dt" + i, "Decision Type: " + safe(d.type), safe(d.description) + " " + safe(d.accountable), "decision"));
  s.timeboxes?.forEach((tb, i) => push(s.id + "-tb" + i, "Timebox: " + safe(tb.gate), safe(tb.window) + " " + safe(tb.defaultAction), "timebox"));

  // S5 — required_sections, ownership, whereItLives, slaTable, intakeChecklist, rejectionProcess
  s.required_sections?.forEach((r, i) => push(s.id + "-req" + i, "BRD Section: " + safe(r.section), safe(r.tier1) + " " + safe(r.tier2) + " " + safe(r.tier3), "brd-section"));
  s.sectionDefinitions?.forEach((d, i) => push(s.id + "-sd" + i, "BRD Definition: " + safe(d.name), d.definition, "definition"));
  s.ownership?.forEach((o, i) => push(s.id + "-own" + i, "BRD Ownership: " + safe(o.section), safe(o.author) + " " + safe(o.input) + " " + safe(o.validator), "ownership"));
  s.whereItLives?.forEach((step, i) => push(s.id + "-wil" + i, "BRD Workflow Step " + (i+1), step, "workflow"));
  s.slaTable?.forEach((sl, i) => push(s.id + "-sla" + i, "SLA: " + safe(sl.type || sl.tier), safe(sl.critical) + " " + safe(sl.high) + " " + safe(sl.medium), "sla"));
  s.intakeChecklist?.forEach((c, i) => push(s.id + "-ic" + i, "Checklist: " + safe(c.item), safe(c.tier1) + " " + safe(c.tier2) + " " + safe(c.tier3), "checklist"));
  s.rejectionProcess?.forEach((step, i) => push(s.id + "-rej" + i, "Rejection Step " + (i+1), step, "rejection"));
  s.discoveryMeetingTriggers?.forEach((trig, i) => push(s.id + "-dmt" + i, "Discovery Meeting Trigger", trig, "trigger"));

  // S6 — handoffOverview, handoffs (now use intro not key), rejectionSteps
  s.handoffOverview?.forEach((h, i) => push(s.id + "-ho" + i, "Handoff: " + safe(h.label), safe(h.from) + " → " + safe(h.to) + " " + safe(h.gate), "handoff"));
  s.handoffs?.forEach((h, i) => {
    const text = safe(h.intro) + " " + (h.deliverables || []).join(" ") + " " + (h.rejects || []).join(" ");
    push(s.id + "-hoff" + i, "Handoff: " + safe(h.from) + " → " + safe(h.to), text, "handoff");
    h.checklist?.items?.forEach((item, ii) => push(s.id + "-hci" + i + "-" + ii, "Checklist: " + safe(h.label), safe(item.item), "checklist"));
  });
  s.rejectionSteps?.forEach((step, i) => push(s.id + "-rs" + i, "Rejection Protocol Step " + (i+1), step, "rejection"));

  // S7 — requestTypes, submissionSteps, requiredFields, workfrontStatuses, jiraFieldUpdates, escalationPath
  s.requestTypes?.forEach((r, i) => push(s.id + "-rt" + i, "Workfront: " + safe(r.type), safe(r.desc) + " " + safe(r.examples), "request-type"));
  s.submissionSteps?.forEach((step, i) => push(s.id + "-ss" + i, "Submission Step " + (i+1), step, "workflow"));
  s.requiredFields?.forEach((f, i) => push(s.id + "-rf" + i, "Required Field: " + safe(f.field), safe(f.requiredFor) + " " + safe(f.standard), "field"));
  s.workfrontStatuses?.forEach((ws, i) => push(s.id + "-ws" + i, "Workfront Status: " + safe(ws.status), safe(ws.meaning) + " " + safe(ws.action), "status"));
  s.jiraFieldUpdates?.forEach((u, i) => push(s.id + "-jfu" + i, "Jira Update: " + safe(u.trigger), safe(u.updateTo) + " " + safe(u.alsoDo), "field-update"));
  s.jiraBoardVisibility?.forEach((item, i) => push(s.id + "-jbv" + i, "Jira Board Visibility", item, "visibility"));
  s.confluenceLogRules?.forEach((rule, i) => push(s.id + "-clr" + i, "Confluence Log Rule", rule, "rule"));
  s.responsibilities?.forEach((r, i) => push(s.id + "-resp" + i, "Responsibility: " + safe(r.role), r.resp, "responsibility"));

  // S8 — boardArch, ticketHierarchy, workflowStages, customFields, ticketTemplates, labels, automations, confluenceIntegration, slackChannels, migrationPlan
  s.boardArch?.forEach((b, i) => push(s.id + "-ba" + i, "Board: " + safe(b.type), safe(b.scope) + " " + safe(b.users), "board"));
  s.ticketHierarchy?.forEach((h, i) => push(s.id + "-th" + i, "Ticket: " + safe(h.level), h.definition, "ticket"));
  s.namingConventions?.forEach((n, i) => push(s.id + "-nc" + i, "Naming: " + safe(n.type), safe(n.format) + " " + safe(n.example), "naming"));
  s.workflowStages?.forEach((ws, i) => push(s.id + "-ws" + i, "Workflow Stage: " + safe(ws.stage), safe(ws.movesIn) + " " + safe(ws.movesOut), "stage"));
  s.customFields?.forEach((f, i) => push(s.id + "-cf" + i, "Custom Field: " + safe(f.name), safe(f.type) + " " + safe(f.values) + " " + safe(f.usedFor), "field"));
  s.ticketTemplates?.forEach((tmpl, i) => push(s.id + "-tt" + i, "Template: " + safe(tmpl.type), (tmpl.fields || []).join(" "), "template"));
  s.labels?.forEach((l, i) => push(s.id + "-lbl" + i, "Label: " + safe(l.label), l.when, "label"));
  s.automations?.forEach((a, i) => push(s.id + "-auto" + i, "Automation: " + safe(a.rule), safe(a.trigger) + " " + safe(a.action) + " " + safe(a.notifies), "automation"));
  s.confluenceIntegration?.forEach((c, i) => push(s.id + "-ci" + i, "Confluence Integration: " + safe(c.event), safe(c.action) + " " + safe(c.who), "integration"));
  s.slackChannels?.forEach((sc, i) => push(s.id + "-sc" + i, "Slack: " + safe(sc.channel), safe(sc.event) + " " + safe(sc.format), "slack"));
  s.workfrontTagSteps?.forEach((step, i) => push(s.id + "-wts" + i, "Workfront Tag Step " + (i+1), step, "workflow"));
  s.migrationPlan?.forEach((p, i) => push(s.id + "-mp" + i, "Migration: " + safe(p.phase), safe(p.actions) + " " + safe(p.owner), "migration"));

  // S9 — principles, spaces, pageHierarchy, templates, namingConventions, pageLabels, spaceOwnership, jiraLinking
  s.principles?.forEach((p, i) => push(s.id + "-prin" + i, "Principle: " + safe(p.name), p.meaning, "principle"));
  s.spaces?.forEach((sp, i) => push(s.id + "-sp" + i, "Space: " + safe(sp.name), safe(sp.purpose) + " " + safe(sp.owner), "space"));
  s.templates?.forEach((tmpl, i) => {
    push(s.id + "-tmpl" + i, "Template: " + safe(tmpl.name), safe(tmpl.location) + " " + safe(tmpl.note) + " " + (tmpl.keyFields || []).join(" "), "template");
  });
  s.pageLabels?.forEach((l, i) => push(s.id + "-pl" + i, "Page Label: " + safe(l.label), l.appliedTo, "label"));
  s.spaceOwnership?.forEach((so, i) => push(s.id + "-so" + i, "Space Owner: " + safe(so.space), safe(so.owner) + " " + safe(so.cadence), "ownership"));
  s.pageReviewRules?.forEach((rule, i) => push(s.id + "-prr" + i, "Page Review Rule", rule, "rule"));
  s.archivalProtocol?.forEach((step, i) => push(s.id + "-ap" + i, "Archival Step " + (i+1), step, "protocol"));
  s.jiraLinking?.forEach((l, i) => push(s.id + "-jl" + i, "Jira Link: " + safe(l.direction), safe(l.standard) + " " + safe(l.when), "linking"));

  // S10 — currentState, approval_gates, componentUsageRules, detachingRules, newComponentSteps, tokenCategories, figmaFileNaming, designSystemRoadmap, jiraConfluenceConnections
  s.currentState?.forEach((cs, i) => push(s.id + "-cs" + i, "Design System: " + safe(cs.area), safe(cs.current) + " " + safe(cs.target), "state"));
  s.approval_gates?.forEach((g, i) => push(s.id + "-ag" + i, "Approval Gate: " + safe(g.decision), safe(g.canUX) + " " + safe(g.approver), "approval"));
  s.componentUsageRules?.forEach((rule, i) => push(s.id + "-cur" + i, "Component Rule " + (i+1), rule, "rule"));
  s.detachingRules?.forEach((d, i) => push(s.id + "-dr" + i, "Detaching: " + safe(d.condition), safe(d.permitted) + " " + safe(d.action), "rule"));
  s.newComponentSteps?.forEach((step, i) => push(s.id + "-ncs" + i, "New Component Step " + (i+1), step, "workflow"));
  s.tokenCategories?.forEach((tk, i) => push(s.id + "-tc" + i, "Token: " + safe(tk.category), safe(tk.currentStatus) + " " + safe(tk.rule), "token"));
  s.figmaFileNaming?.forEach((f, i) => push(s.id + "-ffn" + i, "Figma Naming: " + safe(f.fileType), safe(f.format) + " " + safe(f.example), "naming"));
  s.figmaFileRules?.forEach((rule, i) => push(s.id + "-ffr" + i, "Figma Rule " + (i+1), rule, "rule"));
  s.versionControlRules?.forEach((rule, i) => push(s.id + "-vcr" + i, "Version Control Rule", rule, "rule"));
  s.designSystemRoadmap?.forEach((m, i) => push(s.id + "-dsr" + i, "DS Roadmap: " + safe(m.milestone), safe(m.description) + " " + safe(m.owner) + " " + safe(m.target), "milestone"));
  s.jiraConfluenceConnections?.forEach((c, i) => push(s.id + "-jcc" + i, "DS Connection: " + safe(c.connection), c.standard, "connection"));

  // S11 — costOfCurrentState, phase columns, ongoingOps, metrics, ownerSummary, successAt12Months
  s.costOfCurrentState?.forEach((c, i) => push(s.id + "-cost" + i, "Cost: " + safe(c.label), safe(c.stat) + " " + safe(c.detail), "cost"));
  [s.phase1, s.phase2, s.phase3].filter(Boolean).forEach((phase, pi) => {
    push(s.id + "-ph" + pi, "Phase: " + safe(phase.title), safe(phase.subtitle) + " " + safe(phase.quickWin), "phase");
    phase.columns?.forEach((col, ci) => (col.items || []).forEach((item, ii) =>
      push(s.id + "-ph" + pi + "c" + ci + "i" + ii, safe(phase.title) + " — " + safe(col.heading), item, "action")
    ));
  });
  s.ongoingOps?.forEach((op, i) => push(s.id + "-oo" + i, "Ongoing: " + safe(op.activity), safe(op.cadence) + " " + safe(op.owner) + " " + safe(op.output), "ops"));
  s.metrics?.forEach((m, i) => push(s.id + "-met" + i, "Metric: " + safe(m.name), safe(m.what) + " " + safe(m.baseline) + " " + safe(m.target6) + " " + safe(m.target12), "metric"));
  s.ownerSummary?.forEach((o, i) => push(s.id + "-os" + i, "Owner: " + safe(o.owner), safe(o.phase1) + " " + safe(o.phase2) + " " + safe(o.phase3) + " " + safe(o.ongoing), "owner"));
  s.successAt12Months?.forEach((row, i) => push(s.id + "-s12" + i, "12-Month Goal", safe(row.today) + " → " + safe(row.future), "goal"));
});

// ── ICONS (Lucide-style SVG inline) ──────────────────────────────────────────
const icons = {
  BarChart2: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="18" y="3" width="4" height="18" rx="1"/><rect x="10" y="8" width="4" height="13" rx="1"/><rect x="2" y="13" width="4" height="8" rx="1"/></svg>,
  Target: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"/><path d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18Z" fill="var(--bg)"/><path d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z"/></svg>,
  GitBranch: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><circle cx="6" cy="4" r="2"/><circle cx="6" cy="20" r="2"/><circle cx="18" cy="4" r="2"/><path d="M6 6v10M6 6c0 0 4 2 6 4 2 2 6 2 6-2V6" stroke="currentColor" strokeWidth="2" fill="none"/></svg>,
  Users: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2h16z"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2" fill="none"/></svg>,
  FileText: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="var(--bg)" strokeWidth="1.5" fill="none"/></svg>,
  ArrowRightCircle: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/><path d="M12 8l4 4-4 4M8 12h8" stroke="var(--bg)" strokeWidth="2" fill="none" strokeLinecap="round"/></svg>,
  Layers: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17" stroke="currentColor" strokeWidth="2" fill="none"/><polyline points="2 12 12 17 22 12" stroke="currentColor" strokeWidth="2" fill="none"/></svg>,
  Settings: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="currentColor" strokeWidth="1.5" fill="none"/></svg>,
  BookOpen: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
  Palette: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8z"/><circle cx="6.5" cy="11.5" r="1.5"/><circle cx="9.5" cy="7.5" r="1.5"/><circle cx="14.5" cy="7.5" r="1.5"/><circle cx="17.5" cy="11.5" r="1.5"/></svg>,
  TrendingUp: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/><polyline points="17 6 23 6 23 12" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  Search: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35" stroke="var(--bg)" strokeWidth="2.5" strokeLinecap="round"/></svg>,
  Moon: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
  Sun: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3" stroke="currentColor" strokeWidth="2"/><line x1="12" y1="21" x2="12" y2="23" stroke="currentColor" strokeWidth="2"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="currentColor" strokeWidth="2"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="currentColor" strokeWidth="2"/><line x1="1" y1="12" x2="3" y2="12" stroke="currentColor" strokeWidth="2"/><line x1="21" y1="12" x2="23" y2="12" stroke="currentColor" strokeWidth="2"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="currentColor" strokeWidth="2"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="currentColor" strokeWidth="2"/></svg>,
  Menu: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="6" width="18" height="2" rx="1"/><rect x="3" y="11" width="18" height="2" rx="1"/><rect x="3" y="16" width="18" height="2" rx="1"/></svg>,
  X: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg>,
  ChevronDown: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>,
  ChevronRight: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>,
  Info: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01" stroke="var(--bg)" strokeWidth="2.5" strokeLinecap="round"/></svg>,
  Home: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22" stroke="var(--bg)" strokeWidth="1.5" fill="none"/></svg>,
  AlertTriangle: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13" stroke="var(--bg)" strokeWidth="2"/><line x1="12" y1="17" x2="12.01" y2="17" stroke="var(--bg)" strokeWidth="2"/></svg>,
};

const Icon = ({ name, size = 18, className = "" }) => {
  const C = icons[name];
  return C ? <span className={className} style={{ display: "inline-flex", alignItems: "center" }}><C size={size} /></span> : null;
};


// ── SUBSECTION REGISTRY — for scroll-aware breadcrumb ─────────────────────────
const SUBSECTIONS = {
  s1: [
    { id: "s1-hero", label: "1.0 — Executive Summary", subId: "s1-hero" },
    { id: "s1-problems", label: "1.1 — The Business Case" },
    { id: "s1-framework", label: "1.2 — What This Framework Establishes" },
    { id: "s1-roi", label: "1.3 — Return on Investment Timeline" },
    { id: "s1-objections", label: "1.4 — Addressing Likely Objections" },
    { id: "s1-decisions", label: "1.5 — What Is Being Asked of Leadership" },
    { id: "s1-wins", label: "1.6 — Quick Wins in 30 Days" },
    { id: "s1-docstruct", label: "1.7 — How to Read This Guide" },
  ],
  s2: [
    { id: "s2-def", label: "2.1 — What Is Design Operations?" },
    { id: "s2-mission", label: "2.2 — Mission Statement" },
    { id: "s2-why", label: "2.3 — Why This Exists Now" },
    { id: "s2-scope", label: "2.4 — Scope — Three Products" },
    { id: "s2-connective", label: "2.5 — UX as the Connective Tissue" },
    { id: "s2-mandate", label: "2.6 — Design Team Mandate" },
    { id: "s2-needs", label: "2.7 — What UX Needs From Every Team" },
    { id: "s2-governs", label: "2.8 — What This Document Governs" },
    { id: "s2-living", label: "2.9 — Living Document" },
  ],
  s3: [
    { id: "s3-note", label: "3.1 — Workflow Overview" },
    { id: "s3-stages", label: "3.2 — Stage-by-Stage Definitions" },
    { id: "s3-fasttrack", label: "3.3 — Publishing-Only Fast Track" },
    { id: "s3-lane", label: "3.4 — Lane Movement Rules" },
    { id: "s3-cadence", label: "3.5 — Release Cadence" },
    { id: "s3-crossproduct", label: "3.6 — Cross-Product Work" },
    { id: "s3-done", label: "3.7 — Definition of Done" },
  ],
  s4: [
    { id: "s4-rule", label: "4.1 — DRAC Legend & Silent Approval" },
    { id: "s4-roles", label: "4.2 — Role Definitions" },
    { id: "s4-matrix", label: "4.3 — DRAC Activity Matrix" },
    { id: "s4-decisions", label: "4.4 — Decision Tier Framework" },
    { id: "s4-fasttrack", label: "4.5 — Fast-Track Publishing Lane" },
    { id: "s4-arcreview", label: "4.6 — Architecture Peer Review" },
    { id: "s4-escalation", label: "4.7 — Escalation Path (Strategic Only)" },
  ],
  s5: [
    { id: "s5-gate", label: "5.1 — Purpose of the BRD" },
    { id: "s5-tiers", label: "5.2 — BRD Tiers" },
    { id: "s5-required", label: "5.3 — Required Sections by Tier" },
    { id: "s5-ownership", label: "5.5 — BRD Ownership" },
    { id: "s5-where", label: "5.6 — Where the BRD Lives" },
    { id: "s5-sla", label: "5.7 — BRD Review SLA" },
    { id: "s5-checklist", label: "5.8 — Intake Checklist" },
    { id: "s5-rejection", label: "5.9 — Rejection Protocol" },
  ],
  s6: [
    { id: "s6-rule", label: "6.1 — Handoff Overview" },
    { id: "s6-overview", label: "6.1 — Six Formal Handoffs" },
    { id: "s6-handoffs", label: "6.2–6.7 — Handoff Details" },
    { id: "s6-rejection", label: "6.8 — Rejection Protocol" },
    { id: "s6-needs", label: "6.9 — What UX Needs & Gives" },
  ],
  s7: [
    { id: "s7-when", label: "7.1 — When to Submit a Request" },
    { id: "s7-how", label: "7.2 — How to Submit" },
    { id: "s7-what", label: "7.3 — What a Complete Request Must Include" },
    { id: "s7-status", label: "7.4 — Workfront Status Guide" },
    { id: "s7-jira", label: "7.5 — Making Workfront Visible in Jira" },
    { id: "s7-confluence", label: "7.6 — Confluence Workfront Log" },
    { id: "s7-sla", label: "7.7 — SLA Expectations" },
    { id: "s7-escalation", label: "7.8 — Escalation Path" },
  ],
  s8: [
    { id: "s8-arch", label: "8.1 — Board Architecture" },
    { id: "s8-hierarchy", label: "8.2 — Ticket Hierarchy" },
    { id: "s8-workflow", label: "8.3 — Unified Workflow Stages" },
    { id: "s8-fields", label: "8.4 — Custom Fields" },
    { id: "s8-templates", label: "8.5 — Ticket Templates" },
    { id: "s8-labels", label: "8.6 — Labels & Components" },
    { id: "s8-automations", label: "8.7 — Automations & Notifications" },
    { id: "s8-confluence", label: "8.8 — Jira ↔ Confluence Integration" },
    { id: "s8-slack", label: "8.9 — Jira ↔ Slack Integration" },
    { id: "s8-workfront", label: "8.10 — Workfront Dependency Tag" },
    { id: "s8-migration", label: "8.11 — Migration & Transition Plan" },
  ],
  s9: [
    { id: "s9-principles", label: "9.1 — Guiding Principles" },
    { id: "s9-spaces", label: "9.2 — Space Architecture" },
    { id: "s9-hierarchy", label: "9.3 — Page Hierarchy" },
    { id: "s9-templates", label: "9.4 — Page Templates" },
    { id: "s9-naming", label: "9.5 — Naming & Tagging Conventions" },
    { id: "s9-governance", label: "9.6 — Governance" },
    { id: "s9-linking", label: "9.7 — Confluence ↔ Jira Linking" },
  ],
  s10: [
    { id: "s10-state", label: "10.1 — Current State of the Design System" },
    { id: "s10-approval", label: "10.2 — Creative Direction Approval Gate" },
    { id: "s10-library", label: "10.3 — Component Library Standards" },
    { id: "s10-tokens", label: "10.4 — Design Tokens" },
    { id: "s10-figma", label: "10.5 — Figma File Structure" },
    { id: "s10-roadmap", label: "10.6 — Design System Roadmap" },
    { id: "s10-links", label: "10.7 — Design System ↔ Jira ↔ Confluence" },
  ],
  s11: [
    { id: "s11-cost", label: "11.1 — Cost of the Current State" },
    { id: "s11-30", label: "11.2 — Days 1–30 — Foundation" },
    { id: "s11-60", label: "11.3 — Days 31–60 — Structure" },
    { id: "s11-90", label: "11.4 — Days 61–90 — Optimization" },
    { id: "s11-ongoing", label: "11.5 — Ongoing Operations" },
    { id: "s11-metrics", label: "11.6 — Success Metrics" },
    { id: "s11-owners", label: "11.7 — Implementation Owner Summary" },
    { id: "s11-success", label: "11.8 — What Success Looks Like at 12 Months" },
  ],
};

// ── MAIN APP ──────────────────────────────────────────────────────────────────
export default function DesignOpsApp() {
  const [dark, setDark] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [sideSheet, setSideSheet] = useState(null);
  const [modal, setModal] = useState(null);
  const [expandedAccordions, setExpandedAccordions] = useState({});
  const [deviationOpen, setDeviationOpen] = useState(false);
  const [roleFilter, setRoleFilter] = useState("All");
  const [activeSubsection, setActiveSubsection] = useState(null);
  const [sectionJumpMenu, setSectionJumpMenu] = useState(null);
  const [subJumpMenu, setSubJumpMenu] = useState(false);
  const [diagramOpen, setDiagramOpen] = useState(false);
  const [roleFilterOpen, setRoleFilterOpen] = useState(false);
  const sectionRefs = useRef({});
  const searchRef = useRef(null);
  const subsectionEls = useRef({});

  const t = dark ? {
    bg: "#0D1117", surface: "#161B22", surfaceHover: "#21262D", border: "#30363D",
    text: "#E6EDF3", textSec: "#8B949E", accent: "#2E86AB", accentLight: "#1C3A4A",
    badge: "#21262D", badgeText: "#8B949E", pill: "#1C3A4A", pillText: "#58A6FF",
    navBg: "#161B22", cardBg: "#161B22", shadow: "0 2px 16px rgba(0,0,0,0.4)",
    danger: "#F85149", warn: "#D29922", success: "#3FB950"
  } : {
    bg: "#F7F8FA", surface: "#FFFFFF", surfaceHover: "#F0F2F5", border: "#DFE1E6",
    text: "#172B4D", textSec: "#6B778C", accent: "#0052CC", accentLight: "#DEEBFF",
    badge: "#F4F5F7", badgeText: "#6B778C", pill: "#DEEBFF", pillText: "#0052CC",
    navBg: "#0052CC", cardBg: "#FFFFFF", shadow: "0 2px 8px rgba(9,30,66,0.12)",
    danger: "#DE350B", warn: "#FF8B00", success: "#00875A"
  };

  useEffect(() => {
    if (searchQuery.trim().length < 2) { setSearchResults([]); return; }
    const q = searchQuery.toLowerCase();
    const results = SEARCH_INDEX.filter(item => {
      const title = (item.title || "").toLowerCase();
      const text = (item.text || "").toLowerCase();
      return title.includes(q) || text.includes(q);
    }).slice(0, 10);
    setSearchResults(results);
    setSearchOpen(true);
  }, [searchQuery]);

  // Scroll-aware breadcrumb — ONLY tracks subsections within the currently OPEN section
  useEffect(() => {
    const STICKY_HEIGHT = 144;
    const TRIGGER_OFFSET = STICKY_HEIGHT + 16;

    const handleScroll = () => {
      if (!activeSection || !SUBSECTIONS[activeSection]) {
        setActiveSubsection(null);
        return;
      }
      let bestSub = null;
      let bestTop = -Infinity;
      SUBSECTIONS[activeSection].forEach(sub => {
        const el = document.getElementById(sub.id);
        if (!el) return;
        const top = el.getBoundingClientRect().top;
        if (top <= TRIGGER_OFFSET && top > bestTop) {
          bestTop = top;
          bestSub = sub.label;
        }
      });
      setActiveSubsection(bestSub || null);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeSection]);

  // SCROLL_OFFSET: nav (56) + sticky bar (88) + 16px breathing room = 160px
  // Add extra 8px so the section number badge sits fully below the bar
  const SCROLL_OFFSET = 168;

  const scrollToSection = useCallback((id) => {
    setActiveSection(id);
    setMenuOpen(false);
    setSearchQuery("");
    setSearchOpen(false);
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET;
        window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
      }
    }, 100);
  }, []);

  const toggleAccordion = (key) => setExpandedAccordions(p => ({ ...p, [key]: !p[key] }));

  const filteredSections = roleFilter === "All" ? SECTIONS : SECTIONS.filter(s => s.roles.includes(roleFilter));

  const css = `
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, 'Segoe UI', sans-serif; }
    :root { --bg: ${t.bg}; }
    .app { min-height: 100vh; background: ${t.bg}; color: ${t.text}; transition: background 0.2s, color 0.2s; }
    .nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; background: ${t.navBg}; box-shadow: ${t.shadow}; height: 56px; display: flex; align-items: center; padding: 0 16px; gap: 12px; }
    .nav-brand { color: #fff; font-weight: 700; font-size: 15px; letter-spacing: -0.3px; flex-shrink: 0; }
    .nav-search { flex: 1; max-width: 400px; position: relative; }
    .nav-search input { width: 100%; background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.2); color: #fff; padding: 7px 12px 7px 36px; border-radius: 6px; font-size: 14px; outline: none; }
    .nav-search input::placeholder { color: rgba(255,255,255,0.6); }
    .nav-search input:focus { background: rgba(255,255,255,0.22); border-color: rgba(255,255,255,0.4); }
    .nav-search-icon { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: rgba(255,255,255,0.7); pointer-events: none; }
    .search-dropdown { position: absolute; top: calc(100% + 6px); left: 0; right: 0; background: ${t.surface}; border: 1px solid ${t.border}; border-radius: 8px; box-shadow: ${t.shadow}; z-index: 200; overflow: hidden; }
    .search-item { padding: 10px 14px; cursor: pointer; border-bottom: 1px solid ${t.border}; transition: background 0.1s; }
    .search-item:last-child { border-bottom: none; }
    .search-item:hover { background: ${t.surfaceHover}; }
    .search-item-title { font-size: 13px; font-weight: 600; color: ${t.text}; }
    .search-item-text { font-size: 12px; color: ${t.textSec}; margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .search-item-badge { font-size: 11px; background: ${t.pill}; color: ${t.pillText}; padding: 1px 6px; border-radius: 10px; margin-left: 6px; }
    .nav-actions { display: flex; align-items: center; gap: 8px; margin-left: auto; }
    .nav-btn { background: rgba(255,255,255,0.15); border: none; color: #fff; width: 34px; height: 34px; border-radius: 6px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.15s; flex-shrink: 0; }
    .nav-btn:hover { background: rgba(255,255,255,0.25); }
    .nav-deviation-btn { background: rgba(255,255,255,0.15); border: none; color: #fff; height: 34px; padding: 0 10px; border-radius: 6px; cursor: pointer; display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 600; transition: background 0.15s; white-space: nowrap; }
    .nav-deviation-btn:hover { background: rgba(255,200,0,0.3); }
    .sticky-bar { position: fixed; top: 56px; left: 0; right: 0; z-index: 90; background: ${t.surface}; border-bottom: 1px solid ${t.border}; box-shadow: 0 2px 6px rgba(0,0,0,0.06); }
    .breadcrumb { display: flex; align-items: center; gap: 6px; font-size: 13px; color: ${t.textSec}; padding: 7px 16px; flex-wrap: wrap; border-top: 1px solid ${t.border}; background: ${t.bg}; }
    .breadcrumb-link { cursor: pointer; color: ${t.accent}; }
    .breadcrumb-link:hover { text-decoration: underline; }
    .breadcrumb-sep { color: ${t.textSec}; }
    .main { padding-top: 56px; }
    .hero { margin-top: 88px; }
    .hero { background: linear-gradient(135deg, #0052CC 0%, #172B4D 100%); color: #fff; padding: 48px 20px 40px; text-align: center; }
    .hero h1 { font-size: clamp(22px, 5vw, 36px); font-weight: 800; letter-spacing: -0.5px; margin-bottom: 12px; }
    .hero p { font-size: clamp(14px, 3vw, 17px); opacity: 0.85; max-width: 600px; margin: 0 auto 24px; line-height: 1.6; }
    .hero-stats { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; margin-top: 8px; }
    .hero-stat { background: rgba(255,255,255,0.15); border-radius: 10px; padding: 14px 20px; text-align: center; cursor: pointer; transition: background 0.15s, transform 0.12s, box-shadow 0.15s; border: 1.5px solid rgba(255,255,255,0.1); position: relative; min-width: 110px; }
    .hero-stat:hover { background: rgba(255,255,255,0.26); transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.25); border-color: rgba(255,255,255,0.3); }
    .hero-stat:active { transform: translateY(0px); background: rgba(255,255,255,0.32); }
    .hero-stat-val { font-size: 26px; font-weight: 900; letter-spacing: -0.5px; }
    .hero-stat-lbl { font-size: 11px; opacity: 0.8; margin-top: 3px; font-weight: 600; letter-spacing: 0.3px; }
    .hero-stat-hint { font-size: 10px; opacity: 0.55; margin-top: 4px; }
    .role-bar { padding: 10px 16px; background: ${t.surface}; display: flex; align-items: center; gap: 8px; overflow-x: auto; }
    .role-bar-label { font-size: 12px; font-weight: 700; color: ${t.textSec}; white-space: nowrap; text-transform: uppercase; letter-spacing: 0.5px; }
    .role-pill { padding: 5px 14px; border-radius: 20px; font-size: 13px; font-weight: 600; cursor: pointer; border: 1.5px solid ${t.border}; background: transparent; color: ${t.textSec}; transition: all 0.15s; white-space: nowrap; }
    .role-pill.active { background: ${t.accent}; border-color: ${t.accent}; color: #fff; }
    .role-pill:hover:not(.active) { background: ${t.surfaceHover}; color: ${t.text}; }
    .content { max-width: 900px; margin: 0 auto; padding: 24px 16px 80px; display: flex; flex-direction: column; gap: 24px; }
    .section-card { background: ${t.cardBg}; border: 1px solid ${t.border}; border-radius: 10px; overflow: hidden; box-shadow: ${t.shadow}; transition: box-shadow 0.2s; }
    .section-card:hover { box-shadow: 0 4px 20px rgba(0,82,204,0.12); }
    .section-header { padding: 18px 20px 14px; border-bottom: 1px solid ${t.border}; cursor: pointer; display: flex; align-items: flex-start; gap: 14px; }
    .section-num { font-size: 12px; font-weight: 800; color: ${t.accent}; letter-spacing: 1px; background: ${t.accentLight}; padding: 3px 8px; border-radius: 4px; flex-shrink: 0; margin-top: 2px; }
    .section-icon { color: ${t.accent}; flex-shrink: 0; margin-top: 2px; }
    .section-title { font-size: 17px; font-weight: 700; color: ${t.text}; line-height: 1.3; }
    .section-tagline { font-size: 13px; color: ${t.textSec}; margin-top: 4px; line-height: 1.4; }
    .section-body { padding: 18px 20px; }
    .section-summary { font-size: 14px; color: ${t.text}; line-height: 1.6; margin-bottom: 16px; }
    .keypoints { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 10px; margin-bottom: 16px; }
    .keypoint-card { background: ${t.accentLight}; border: 1px solid ${dark ? t.border : "#DEEBFF"}; border-radius: 8px; padding: 12px 14px; cursor: pointer; transition: all 0.15s; position: relative; }
    .keypoint-card:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,82,204,0.15); }
    .keypoint-label { font-size: 13px; font-weight: 700; color: ${t.accent}; margin-bottom: 4px; }
    .keypoint-hint { font-size: 11px; color: ${t.textSec}; }
    .roles-badges { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 14px; }
    .role-badge { font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 4px; background: ${t.badge}; color: ${t.badgeText}; border: 1px solid ${t.border}; text-transform: uppercase; letter-spacing: 0.3px; }
    .accordion { border: 1px solid ${t.border}; border-radius: 8px; overflow: hidden; margin-bottom: 8px; }
    .accordion-header { padding: 12px 16px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; background: ${t.surfaceHover}; transition: background 0.15s; }
    .accordion-header:hover { background: ${t.accentLight}; }
    .accordion-title { font-size: 14px; font-weight: 600; color: ${t.text}; }
    .accordion-body { padding: 14px 16px; font-size: 13px; color: ${t.textSec}; line-height: 1.65; border-top: 1px solid ${t.border}; background: ${t.surface}; }
    .table-wrapper { overflow-x: auto; margin-bottom: 16px; border-radius: 8px; border: 1px solid ${t.border}; }
    .data-table { width: 100%; border-collapse: collapse; font-size: 13px; }
    .data-table th { background: ${t.accent}; color: #fff; padding: 10px 12px; text-align: left; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.3px; }
    .data-table td { padding: 10px 12px; color: ${t.text}; border-bottom: 1px solid ${t.border}; vertical-align: top; line-height: 1.5; }
    .data-table tr:last-child td { border-bottom: none; }
    .data-table tr:nth-child(even) td { background: ${t.surfaceHover}; }
    .stage-grid { display: flex; flex-direction: column; gap: 0; margin-bottom: 16px; }
    .stage-lane { margin-bottom: 8px; }
    .stage-lane-label { font-size: 11px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; color: ${t.textSec}; margin-bottom: 4px; padding-left: 4px; }
    .stage-pills { display: flex; gap: 6px; flex-wrap: wrap; }
    .stage-pill { padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 600; color: #fff; cursor: pointer; transition: transform 0.1s, box-shadow 0.1s; }
    .stage-pill:hover { transform: translateY(-1px); box-shadow: 0 3px 8px rgba(0,0,0,0.2); }
    .sheet-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 300; display: flex; justify-content: flex-end; }
    .sheet { width: min(420px, 100vw); height: 100vh; background: ${t.surface}; box-shadow: -4px 0 32px rgba(0,0,0,0.2); overflow-y: auto; display: flex; flex-direction: column; animation: slideIn 0.25s ease; }
    @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
    .sheet-header { padding: 20px; border-bottom: 1px solid ${t.border}; display: flex; justify-content: space-between; align-items: flex-start; position: sticky; top: 0; background: ${t.surface}; z-index: 1; }
    .sheet-title { font-size: 17px; font-weight: 700; color: ${t.text}; }
    .sheet-close { background: ${t.surfaceHover}; border: none; color: ${t.text}; width: 32px; height: 32px; border-radius: 6px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
    .sheet-body { padding: 20px; flex: 1; font-size: 14px; color: ${t.text}; line-height: 1.65; }
    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 400; display: flex; align-items: center; justify-content: center; padding: 16px; }
    .modal { background: ${t.surface}; border-radius: 12px; width: min(560px, 100%); max-height: 80vh; overflow-y: auto; box-shadow: 0 20px 60px rgba(0,0,0,0.3); animation: popIn 0.2s ease; }
    @keyframes popIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
    .modal-header { padding: 20px 20px 16px; border-bottom: 1px solid ${t.border}; display: flex; justify-content: space-between; align-items: center; }
    .modal-title { font-size: 17px; font-weight: 700; color: ${t.text}; }
    .modal-body { padding: 20px; font-size: 14px; color: ${t.text}; line-height: 1.65; }
    .mobile-menu { position: fixed; inset: 0; z-index: 200; background: ${t.surface}; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 8px; }
    .mobile-menu-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid ${t.border}; }
    .mobile-menu-title { font-size: 16px; font-weight: 700; color: ${t.text}; }
    .menu-section-item { display: flex; align-items: center; gap: 12px; padding: 12px 14px; border-radius: 8px; cursor: pointer; transition: background 0.15s; border: 1px solid ${t.border}; }
    .menu-section-item:hover { background: ${t.surfaceHover}; }
    .menu-section-num { font-size: 11px; font-weight: 800; color: ${t.accent}; background: ${t.accentLight}; padding: 2px 6px; border-radius: 4px; }
    .menu-section-title { font-size: 14px; font-weight: 600; color: ${t.text}; }
    .deviation-sheet .sheet-header { background: #B7770D; }
    .deviation-sheet .sheet-title { color: #fff; }
    .deviation-sheet .sheet-close { background: rgba(255,255,255,0.2); color: #fff; }
    .deviation-banner { background: ${dark ? "#2D1F00" : "#FEF9E7"}; border: 1.5px solid #B7770D; border-radius: 8px; padding: 14px 16px; margin-bottom: 16px; display: flex; gap: 12px; align-items: flex-start; }
    .deviation-banner-icon { color: #B7770D; flex-shrink: 0; margin-top: 1px; }
    .deviation-banner-text { font-size: 13px; color: ${t.text}; line-height: 1.6; }
    .green-badge { background: ${dark ? "#1B3A2D" : "#E3FCEF"}; color: ${t.success}; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 700; }
    .red-badge { background: ${dark ? "#3D1F1F" : "#FFEBE6"}; color: ${t.danger}; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 700; }
    .dark-toggle { position: fixed; bottom: 20px; left: 20px; z-index: 150; background: ${t.surface}; border: 1.5px solid ${t.border}; border-radius: 50px; padding: 8px 14px; display: flex; align-items: center; gap: 8px; cursor: pointer; box-shadow: ${t.shadow}; font-size: 13px; font-weight: 600; color: ${t.text}; transition: all 0.15s; }
    .dark-toggle:hover { background: ${t.surfaceHover}; }
    .diagram-overlay { position: fixed; inset: 0; z-index: 500; background: rgba(0,0,0,0.93); display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px; animation: popIn 0.18s ease; }
    .diagram-inner { position: relative; max-width: min(1280px, 100%); width: 100%; }
    .diagram-img { width: 100%; height: auto; border-radius: 10px; display: block; box-shadow: 0 24px 64px rgba(0,0,0,0.6); }
    .diagram-close-btn { position: absolute; top: -14px; right: -14px; width: 36px; height: 36px; border-radius: 50%; background: #fff; border: none; cursor: pointer; font-size: 16px; font-weight: 900; color: #172B4D; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 12px rgba(0,0,0,0.4); transition: transform 0.15s; z-index: 1; }
    .diagram-close-btn:hover { transform: scale(1.12); }
    .diagram-label { margin-top: 14px; font-size: 12px; color: rgba(255,255,255,0.5); text-align: center; letter-spacing: 0.5px; }
    @media (max-width: 640px) {
      .hero { padding: 32px 16px 28px; }
      .hero-stats { flex-direction: column; gap: 10px; align-items: stretch; }
      .hero-stat { padding: 14px 18px; width: 100%; min-width: 0; }
      .content { padding: 16px 12px 80px; }
      .keypoints { grid-template-columns: 1fr; }
      .dark-toggle { display: none; }
      .role-bar-pills { display: none; }
      .role-bar-pills.open { display: flex; flex-wrap: wrap; gap: 6px; }
      .role-bar-ellipsis { display: flex; }
    }
    @media (min-width: 641px) {
      .role-bar-ellipsis { display: none; }
      .role-bar-pills { display: flex; gap: 8px; overflow-x: auto; }
    }
    @media (min-width: 641px) { .nav-btn.hamburger { display: none; } }
    @media (max-width: 640px) { .nav-deviation-btn span { display: none; } }
    .section-header-wrap { position: relative; }
    .jump-menu-overlay { position: absolute; top: calc(100% + 2px); right: 0; background: ${t.surface}; border: 1px solid ${t.border}; border-radius: 8px; box-shadow: 0 8px 32px rgba(0,0,0,0.18); z-index: 300; min-width: 280px; overflow: hidden; animation: popIn 0.15s ease; }
    .jump-menu-heading { padding: 7px 14px 6px; font-size: 11px; font-weight: 700; color: ${t.textSec}; text-transform: uppercase; letter-spacing: 0.6px; background: ${t.surfaceHover}; border-bottom: 1px solid ${t.border}; }
    .jump-menu-btn { display: block; width: 100%; padding: 9px 14px; background: none; border: none; border-bottom: 1px solid ${t.border}; text-align: left; cursor: pointer; font-size: 13px; color: ${t.text}; transition: background 0.1s; }
    .jump-menu-btn:last-child { border-bottom: none; }
    .jump-menu-btn:hover { background: ${t.accentLight}; color: ${t.accent}; font-weight: 600; }
    .caret-btn { background: none; border: none; cursor: pointer; color: ${t.textSec}; padding: 4px 6px; border-radius: 4px; display: flex; align-items: center; justify-content: center; transition: background 0.15s, color 0.15s; flex-shrink: 0; margin-left: 4px; }
    .caret-btn:hover { background: ${t.accentLight}; color: ${t.accent}; }
    .tooltip { position: relative; display: inline-block; }
    .tooltip-content { visibility: hidden; opacity: 0; position: absolute; bottom: calc(100% + 8px); left: 50%; transform: translateX(-50%); background: ${t.text}; color: ${t.bg}; font-size: 12px; padding: 6px 10px; border-radius: 6px; white-space: nowrap; max-width: 200px; white-space: normal; z-index: 50; transition: opacity 0.15s; pointer-events: none; line-height: 1.4; }
    .tooltip:hover .tooltip-content { visibility: visible; opacity: 1; }
    .product-cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 10px; margin-bottom: 16px; }
    .product-card { border-radius: 8px; overflow: hidden; border: 1px solid ${t.border}; cursor: pointer; transition: transform 0.15s, box-shadow 0.15s; }
    .product-card:hover { transform: translateY(-2px); box-shadow: ${t.shadow}; }
    .product-card-header { padding: 10px 14px; color: #fff; font-size: 14px; font-weight: 700; }
    .product-card-body { padding: 10px 14px; background: ${t.surface}; font-size: 12px; color: ${t.textSec}; line-height: 1.6; }
    .handoff-cards { display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; }
    .handoff-card { border: 1px solid ${t.border}; border-radius: 8px; overflow: hidden; cursor: pointer; transition: box-shadow 0.15s; }
    .handoff-card:hover { box-shadow: ${t.shadow}; }
    .handoff-card-header { padding: 10px 14px; background: ${t.surfaceHover}; display: flex; align-items: center; gap: 10px; font-size: 13px; font-weight: 700; color: ${t.text}; }
    .handoff-arrow { color: ${t.accent}; font-size: 18px; font-weight: 900; }
    .handoff-key { font-size: 12px; color: ${t.textSec}; padding: 8px 14px; background: ${t.surface}; }
    .approval-table-yes { color: ${t.success}; font-weight: 700; }
    .approval-table-no { color: ${t.danger}; font-weight: 700; }
    .approval-table-cond { color: ${t.warn}; font-weight: 700; }
  `;

  // Group stages by lane
  const groupedStages = {};
  (SECTIONS[2].stages || []).forEach(s => {
    if (!groupedStages[s.lane]) groupedStages[s.lane] = [];
    groupedStages[s.lane].push(s);
  });

  return (
    <div className="app">
      <style>{css}</style>

      {/* ── NAV ── */}
      <nav className="nav">
        <span className="nav-brand">DesignOps</span>
        <div className="nav-search">
          <span className="nav-search-icon"><Icon name="Search" /></span>
          <input
            ref={searchRef}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onFocus={() => searchResults.length && setSearchOpen(true)}
            placeholder="Search all content..."
          />
          {searchOpen && searchResults.length > 0 && (
            <div className="search-dropdown">
              {searchResults.map(r => (
                <div key={r.id} className="search-item" onClick={() => {
                  setSearchQuery("");
                  setSearchOpen(false);
                  // Open the section first
                  setActiveSection(r.sectionId);
                  setActiveSubsection(null);
                  setTimeout(() => {
                    // Try to scroll to the specific subsection anchor first
                    const anchorEl = r.subsectionId ? document.getElementById(r.subsectionId) : null;
                    const sectionEl = document.getElementById(r.sectionId);
                    const target = anchorEl || sectionEl;
                    if (target) {
                      const top = target.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET;
                      window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
                    }
                  }, 150);
                }}>
                  <div className="search-item-title">
                    {r.title}
                    <span className="search-item-badge">{r.type}</span>
                  </div>
                  <div className="search-item-text">{r.text}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="nav-actions">
          <button className="nav-deviation-btn" onClick={() => setDeviationOpen(true)} title="Realistic Expectation">
            <Icon name="Info" />
            <span>Realistic Expectation</span>
          </button>
          <button className="nav-btn hamburger" onClick={() => setMenuOpen(true)} title="Menu">
            <Icon name="Menu" />
          </button>
        </div>
      </nav>

      {/* ── MOBILE MENU ── */}
      {menuOpen && (
        <div className="mobile-menu">
          <div className="mobile-menu-header">
            <span className="mobile-menu-title">Navigation</span>
            <button className="sheet-close" onClick={() => setMenuOpen(false)}><Icon name="X" /></button>
          </div>
          <div style={{ marginBottom: 8, paddingBottom: 8, borderBottom: `1px solid ${t.border}` }}>
            <button className="nav-deviation-btn" style={{ background: "#B7770D", color: "#fff", width: "100%", justifyContent: "center", marginBottom: 8 }} onClick={() => { setDeviationOpen(true); setMenuOpen(false); }}>
              <Icon name="Info" /><span>Realistic Expectation</span>
            </button>
            <button className="nav-deviation-btn" style={{ background: t.surfaceHover, color: t.text, width: "100%", justifyContent: "center" }} onClick={() => { setDark(d => !d); }}>
              <Icon name={dark ? "Sun" : "Moon"} /><span>{dark ? "Light Mode" : "Dark Mode"}</span>
            </button>
          </div>
          {SECTIONS.map(s => (
            <div key={s.id} className="menu-section-item" onClick={() => scrollToSection(s.id)}>
              <span className="menu-section-num">{s.num}</span>
              <span style={{ color: t.accent, flexShrink: 0 }}><Icon name={s.icon} /></span>
              <span className="menu-section-title">{s.title}</span>
            </div>
          ))}
        </div>
      )}

      {/* ── DIAGRAM OVERLAY ── */}
      {diagramOpen && (
        <div className="diagram-overlay" onClick={() => setDiagramOpen(false)}>
          <div className="diagram-inner" onClick={e => e.stopPropagation()}>
            <button className="diagram-close-btn" onClick={() => setDiagramOpen(false)}>✕</button>
            <img
              className="diagram-img"
              src="data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAAA8AAD/4QOCaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSAxMC4wLWMwMDAgNzkuZDIwZTQ2NjMwLCAyMDI1LzEyLzA5LTAyOjExOjIzICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjNiZThhNThkLWFjMjktNGU3NS1hYTFkLWZmMjk2ZWFiYThlNyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpENTQwQzQwNDNDMTQxMUYxQUMwRUFBNzI2MjIwRTQ0NyIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpENTQwQzQwMzNDMTQxMUYxQUMwRUFBNzI2MjIwRTQ0NyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjcuNCAoTWFjaW50b3NoKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjNiZThhNThkLWFjMjktNGU3NS1hYTFkLWZmMjk2ZWFiYThlNyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDozYmU4YTU4ZC1hYzI5LTRlNzUtYWExZC1mZjI5NmVhYmE4ZTciLz4gPC9yZGY6RGVzY3JpcHRp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"
              alt="Design Operations Cycle Diagram"
            />
            <div className="diagram-label">Design Operations Cycle — tap outside or ✕ to close</div>
          </div>
        </div>
      )}

      {/* ── DEVIATION SIDE SHEET ── */}
      {deviationOpen && (
        <div className="sheet-overlay" onClick={() => setDeviationOpen(false)}>
          <div className="sheet deviation-sheet" onClick={e => e.stopPropagation()}>
            <div className="sheet-header" style={{ background: "#B7770D" }}>
              <span className="sheet-title" style={{ color: "#fff" }}>Realistic Expectation</span>
              <button className="sheet-close" style={{ background: "rgba(255,255,255,0.2)", color: "#fff" }} onClick={() => setDeviationOpen(false)}><Icon name="X" /></button>
            </div>
            <div className="sheet-body">
              <div className="deviation-banner">
                <span className="deviation-banner-icon"><Icon name="AlertTriangle" /></span>
                <div className="deviation-banner-text">
                  <strong>This process will not always flow exactly as outlined.</strong> That is not a failure — it is the reality of how organizations operate during transition and growth.
                </div>
              </div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: t.text, marginBottom: 10 }}>The Adaptive Deviation Principle</h3>
              <p style={{ fontSize: 14, color: t.text, lineHeight: 1.7, marginBottom: 16 }}>
                Every role is expected to be <strong>adaptive</strong> — to recognize when process cannot be followed exactly as written, to document that deviation explicitly, and to obtain appropriate approval before or immediately after the deviation occurs.
              </p>
              <p style={{ fontSize: 14, color: t.text, lineHeight: 1.7, marginBottom: 16 }}>
                This is not permission to skip the process. It is a mechanism to <strong>protect the integrity of the process</strong> over time by making exceptions visible, purposeful, and traceable — rather than invisible and habitual.
              </p>
              <div style={{ background: t.accentLight, border: `1px solid ${t.accent}`, borderRadius: 8, padding: "14px 16px", marginBottom: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: t.accent, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px" }}>When deviation is acceptable:</div>
                {["Documented in the relevant Jira ticket with a comment explaining what deviated and why.", "Approved by the PM Lead, Director of UX, or relevant Department Director.", "Time-bound — deviation is for this instance only, not a permanent change to process.", "Logged in the Confluence project page for retrospective review."].map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6, fontSize: 13, color: t.text, lineHeight: 1.5 }}>
                    <span style={{ color: t.success, fontWeight: 800, flexShrink: 0 }}>✓</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <div style={{ background: dark ? "#1B0000" : "#FFEBE6", border: `1px solid ${t.danger}`, borderRadius: 8, padding: "14px 16px", marginBottom: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: t.danger, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px" }}>What deviation is NOT:</div>
                {["A workaround to avoid a difficult conversation.", "A way to skip a gate under deadline pressure.", "An undocumented shortcut that becomes the new normal.", "A unilateral decision made without approval."].map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6, fontSize: 13, color: t.text, lineHeight: 1.5 }}>
                    <span style={{ color: t.danger, fontWeight: 800, flexShrink: 0 }}>✗</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: t.text, marginBottom: 10 }}>Why This Builds Consistency Over Time</h3>
              <p style={{ fontSize: 14, color: t.text, lineHeight: 1.7, marginBottom: 12 }}>
                Documented deviations become the input for retrospectives. Patterns of deviation reveal where the process needs adjustment. Over time, the process becomes more accurate to how the team actually works — not a theoretical ideal that is quietly ignored.
              </p>
              <p style={{ fontSize: 14, color: t.text, lineHeight: 1.7, marginBottom: 0 }}>
                <strong>The goal is not perfection from day one.</strong> The goal is to rally consistency over time through transparency, documentation, and the shared commitment to making the process better with every cycle.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── SIDE SHEET ── */}
      {sideSheet && (
        <div className="sheet-overlay" onClick={() => setSideSheet(null)}>
          <div className="sheet" onClick={e => e.stopPropagation()}>
            <div className="sheet-header">
              <span className="sheet-title">{sideSheet.title}</span>
              <button className="sheet-close" onClick={() => setSideSheet(null)}><Icon name="X" /></button>
            </div>
            <div className="sheet-body"
              dangerouslySetInnerHTML={{ __html: sideSheet.content }}
              onClick={(e) => {
                const link = e.target.closest('[data-nav], [data-anchor]');
                if (link) {
                  const sectionTarget = link.getAttribute('data-nav');
                  const anchorTarget = link.getAttribute('data-anchor');
                  setSideSheet(null);
                  setTimeout(() => {
                    if (anchorTarget) {
                      // Navigate to section first, then scroll to specific subsection anchor
                      const anchorEl = document.getElementById(anchorTarget);
                      // Find which section this anchor belongs to
                      const sectionId = sectionTarget || Object.keys(SUBSECTIONS).find(sid =>
                        SUBSECTIONS[sid].some(sub => sub.id === anchorTarget)
                      );
                      if (sectionId) setActiveSection(sectionId);
                      setTimeout(() => {
                        const el = document.getElementById(anchorTarget);
                        if (el) {
                          const top = el.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET;
                          window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
                          // Update breadcrumb subsection label
                          const sub = sectionId && SUBSECTIONS[sectionId]?.find(s => s.id === anchorTarget);
                          if (sub) setActiveSubsection(sub.label);
                        }
                      }, 150);
                    } else if (sectionTarget) {
                      scrollToSection(sectionTarget);
                    }
                  }, 50);
                }
              }}
            />
          </div>
        </div>
      )}

      {/* ── MODAL ── */}
      {modal && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">{modal.title}</span>
              <button className="sheet-close" onClick={() => setModal(null)}><Icon name="X" /></button>
            </div>
            <div className="modal-body">{modal.content}</div>
          </div>
        </div>
      )}

      {/* ── MAIN CONTENT ── */}
      <main className="main">
        {/* Hero */}
        <div className="hero">
          <h1>Design Operations Guide</h1>
          <p>An operational methodology for designers to interact throughout the organization. Every role. Every standard. Every tool.</p>
          <div className="hero-stats">
            {/* Diagram — first card */}
            <div className="hero-stat" onClick={() => setDiagramOpen(true)}>
              <div className="hero-stat-val" style={{ fontSize: 22 }}>⬡</div>
              <div className="hero-stat-lbl">Diagram</div>
              <div className="hero-stat-hint">view cycle →</div>
            </div>

            {/* 11 Sections */}
            <div className="hero-stat" onClick={() => setSideSheet({
              title: "11 Sections — How to Navigate This Guide",
              content: `
                <div style="margin-bottom:16px;font-size:14px;line-height:1.7">This guide is organized into 11 sections covering every aspect of how the product cycle works — from the business case to the Jira configuration. Each section serves a different audience and purpose. Tap any section below to jump directly to it.</div>
                <div style="display:flex;flex-direction:column;gap:6px;margin-bottom:16px">
                  ${SECTIONS.map(s => `<a href="#${s.id}" data-nav="${s.id}" style="display:flex;align-items:center;gap:10px;padding:10px 12px;background:#F4F5F7;border-radius:8px;text-decoration:none;cursor:pointer;border:1px solid #DFE1E6">
                    <span style="background:#0052CC;color:#fff;border-radius:4px;padding:2px 7px;font-size:11px;font-weight:700;flex-shrink:0">${s.num}</span>
                    <div>
                      <div style="font-size:13px;font-weight:700;color:#172B4D">${s.title}</div>
                      <div style="font-size:12px;color:#6B778C;margin-top:2px">${s.tagline}</div>
                    </div>
                  </a>`).join("")}
                </div>
                <div style="font-size:12px;color:#6B778C;line-height:1.6;padding:10px 12px;background:#DEEBFF;border-radius:6px">
                  <strong style="color:#0052CC">TIP — </strong>Use the breadcrumb at the top to navigate between sections. The caret (▾) after each section title opens a jump menu to any subsection directly.
                </div>
              `
            })}>
              <div className="hero-stat-val">11</div>
              <div className="hero-stat-lbl">Sections</div>
              <div className="hero-stat-hint">tap to explore →</div>
            </div>

            {/* 16 Workflow Stages */}
            <div className="hero-stat" onClick={() => setSideSheet({
              title: "16 Workflow Stages",
              content: `
                <div style="margin-bottom:14px;font-size:14px;line-height:1.7">Every piece of work — regardless of size — travels through 16 defined stages across 5 lanes before it is released. Each stage has a named owner, entry criteria that must be met before work enters it, and exit criteria that must be met before work leaves it.</div>
                <div style="margin-bottom:14px">
                  ${[
                    { lane: "Planning", color: "#5D6D7E", stages: ["Backlog", "Product Review"] },
                    { lane: "Design", color: "#2E86AB", stages: ["Design Review", "Design Ready", "Design In Progress", "Design Approval"] },
                    { lane: "Development", color: "#1A7A4A", stages: ["Dev Review", "Dev Ready", "Dev In Progress", "Dev Approval"] },
                    { lane: "QA", color: "#B7770D", stages: ["QA Stage", "QA Prod", "UAT"] },
                    { lane: "Release", color: "#A93226", stages: ["PM Approval", "Executive Review (conditional)", "Released"] },
                  ].map(group => `
                    <div style="margin-bottom:10px">
                      <div style="font-size:11px;font-weight:700;color:${group.color};text-transform:uppercase;letter-spacing:0.5px;margin-bottom:5px">${group.lane}</div>
                      <div style="display:flex;gap:5px;flex-wrap:wrap">
                        ${group.stages.map(s => `<span style="background:${group.color};color:#fff;border-radius:5px;padding:4px 10px;font-size:12px;font-weight:600">${s}</span>`).join("")}
                      </div>
                    </div>
                  `).join("")}
                </div>
                <div style="font-size:13px;color:#172B4D;line-height:1.6;margin-bottom:14px;padding:10px 12px;background:#FEF9E7;border:1px solid #B7770D;border-radius:6px">
                  <strong style="color:#B7770D">RULE — </strong>No ticket advances without meeting the exit criteria of its current stage. Moving a ticket forward is a declaration that the work is ready — not that it is convenient.
                </div>
                <a href="#s3-stages" data-nav="s3" data-anchor="s3-stages" style="display:flex;align-items:center;justify-content:space-between;padding:12px 16px;background:#0052CC;border-radius:8px;text-decoration:none;cursor:pointer">
                  <span style="color:#fff;font-weight:700;font-size:14px">Section 03 — The Product Cycle → 3.1 Workflow Stages</span>
                  <span style="color:#fff;font-size:16px">→</span>
                </a>
              `
            })}>
              <div className="hero-stat-val">16</div>
              <div className="hero-stat-lbl">Workflow Stages</div>
              <div className="hero-stat-hint">tap to explore →</div>
            </div>

            {/* 6 Handoff Gates */}
            <div className="hero-stat" onClick={() => setSideSheet({
              title: "6 Handoff Gates",
              content: `
                <div style="margin-bottom:14px;font-size:14px;line-height:1.7">A handoff is the highest-risk point in any product cycle — when context is lost, requirements are misunderstood, or expectations are misaligned, every downstream team absorbs the cost. There are 6 formal handoff gates. Each has required deliverables, rejection triggers, and a definition of done.</div>
                <div style="display:flex;flex-direction:column;gap:6px;margin-bottom:14px">
                  ${[
                    { num: "1", from: "PM", to: "UX Team", gate: "BRD accepted + Epic in Design Review" },
                    { num: "2", from: "UX Team", to: "Creative / Workfront", gate: "Workfront request submitted with complete brief" },
                    { num: "3", from: "UX Team", to: "Dev Team", gate: "Figma specs complete, annotated, Dev Review approved" },
                    { num: "4", from: "Dev Team", to: "QA Team", gate: "Build deployed to staging, self-tested" },
                    { num: "5", from: "QA Team", to: "Product Manager", gate: "QA sign-off complete, UAT passed" },
                    { num: "6", from: "PM / Director", to: "CMS / Publishing", gate: "Publishing-only approval — no dev required" },
                  ].map(h => `
                    <div style="padding:10px 12px;background:#F4F5F7;border-radius:8px;border:1px solid #DFE1E6">
                      <div style="display:flex;align-items:center;gap:8px;margin-bottom:3px">
                        <span style="background:#172B4D;color:#fff;border-radius:4px;padding:1px 6px;font-size:11px;font-weight:700">${h.num}</span>
                        <span style="font-size:13px;font-weight:700;color:#172B4D">${h.from} → ${h.to}</span>
                      </div>
                      <div style="font-size:12px;color:#6B778C">${h.gate}</div>
                    </div>
                  `).join("")}
                </div>
                <div style="font-size:13px;color:#172B4D;line-height:1.6;margin-bottom:14px;padding:10px 12px;background:#FFEBE6;border:1px solid #DE350B;border-radius:6px">
                  <strong style="color:#DE350B">RULE — </strong>A rejection is not a failure — it is the process working correctly. Any team member may reject a handoff that does not meet the standard. The checklist is the authority.
                </div>
                <a href="#s6-overview" data-nav="s6" data-anchor="s6-overview" style="display:flex;align-items:center;justify-content:space-between;padding:12px 16px;background:#0052CC;border-radius:8px;text-decoration:none;cursor:pointer">
                  <span style="color:#fff;font-weight:700;font-size:14px">Section 06 — Handoff Standards → 6.1 Overview</span>
                  <span style="color:#fff;font-size:16px">→</span>
                </a>
              `
            })}>
              <div className="hero-stat-val">6</div>
              <div className="hero-stat-lbl">Handoff Gates</div>
              <div className="hero-stat-hint">tap to explore →</div>
            </div>

            {/* 5 KPI Metrics */}
            <div className="hero-stat" onClick={() => setSideSheet({
              title: "5 KPI Metrics",
              content: `
                <div style="margin-bottom:14px;font-size:14px;line-height:1.7">Five metrics define whether this initiative is working. Baselines are captured at Day 90. Progress is reviewed quarterly and reported to the executive team. These are not punitive — they surface where the process is working and where it needs adjustment.</div>
                <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:14px">
                  ${[
                    { name: "BRD Rework Rate", what: "% of BRDs rejected at intake requiring revision", target6: "50% reduction", target12: "75% reduction" },
                    { name: "Cycle Time per Stage", what: "Avg days a ticket spends in each Jira workflow stage", target6: "Design + Dev each −20%", target12: "All stages within SLA 80% of the time" },
                    { name: "Handoff Rejection Rate", what: "% of handoffs rejected and returned to the sending team", target6: "Rate stable or declining", target12: "Fewer than 15% rejected" },
                    { name: "Workfront Turnaround", what: "Avg days from Workfront submission to asset delivery", target6: "Within SLA 70% of the time", target12: "Within SLA 85% of the time" },
                    { name: "Release Frequency vs. Defect Rate", what: "Releases per month vs. post-release critical defects", target6: "Defect rate −20%", target12: "Defect rate −40%" },
                  ].map((m, i) => `
                    <div style="padding:10px 12px;background:#F4F5F7;border-radius:8px;border:1px solid #DFE1E6">
                      <div style="font-size:13px;font-weight:700;color:#0052CC;margin-bottom:3px">${i+1}. ${m.name}</div>
                      <div style="font-size:12px;color:#172B4D;margin-bottom:6px">${m.what}</div>
                      <div style="display:flex;gap:6px">
                        <span style="background:#E3FCEF;color:#006644;border-radius:4px;padding:2px 7px;font-size:11px;font-weight:700">6mo: ${m.target6}</span>
                        <span style="background:#DEEBFF;color:#0052CC;border-radius:4px;padding:2px 7px;font-size:11px;font-weight:700">12mo: ${m.target12}</span>
                      </div>
                    </div>
                  `).join("")}
                </div>
                <div style="font-size:13px;color:#172B4D;line-height:1.6;margin-bottom:14px;padding:10px 12px;background:#E3FCEF;border:1px solid #00875A;border-radius:6px">
                  <strong style="color:#006644">NOTE — </strong>A rising rejection rate may indicate the team is getting better at catching problems early — not that something is broken. Context matters. The Director of UX adds interpretive notes to each quarterly report.
                </div>
                <a href="#s11-metrics" data-nav="s11" data-anchor="s11-metrics" style="display:flex;align-items:center;justify-content:space-between;padding:12px 16px;background:#0052CC;border-radius:8px;text-decoration:none;cursor:pointer">
                  <span style="color:#fff;font-weight:700;font-size:14px">Section 11 — Quick Wins & Roadmap → 11.6 Success Metrics</span>
                  <span style="color:#fff;font-size:16px">→</span>
                </a>
              `
            })}>
              <div className="hero-stat-val">5</div>
              <div className="hero-stat-lbl">KPI Metrics</div>
              <div className="hero-stat-hint">tap to explore →</div>
            </div>
          </div>
        </div>

        {/* Sticky bar — role filter + breadcrumb */}
        <div className="sticky-bar">
          <div className="role-bar" style={{ flexWrap: "wrap" }}>
            <span className="role-bar-label">Filter by role:</span>
            {/* Mobile: ellipsis toggle */}
            <button className="role-bar-ellipsis"
              style={{ background: roleFilterOpen ? t.accent : t.surfaceHover, border: `1.5px solid ${roleFilterOpen ? t.accent : t.border}`, color: roleFilterOpen ? "#fff" : t.text, padding: "5px 12px", borderRadius: 20, fontSize: 16, fontWeight: 700, cursor: "pointer", lineHeight: 1 }}
              onClick={() => setRoleFilterOpen(o => !o)}>
              ···
            </button>
            {/* Pills — hidden on mobile unless open */}
            <div className={`role-bar-pills${roleFilterOpen ? " open" : ""}`}>
              {["All", ...ALL_ROLES].map(r => (
                <button key={r} className={`role-pill ${roleFilter === r ? "active" : ""}`}
                  onClick={() => { setRoleFilter(r); setRoleFilterOpen(false); }}>{r}</button>
              ))}
            </div>
          </div>
          <div className="breadcrumb" style={{ position: "relative" }}>
            {/* Close any open menus when clicking elsewhere */}
            {(sectionJumpMenu || subJumpMenu) && (
              <div style={{ position: "fixed", inset: 0, zIndex: 298 }} onClick={() => { setSectionJumpMenu(null); setSubJumpMenu(false); }} />
            )}

            {/* Home */}
            <span className="breadcrumb-link" onClick={() => { setActiveSection(null); setActiveSubsection(null); setSectionJumpMenu(null); setSubJumpMenu(false); window.scrollTo({ top: 0, behavior: "smooth" }); }}><Icon name="Home" /></span>
            <span className="breadcrumb-sep">/</span>

            {/* All Sections — always visible */}
            <span className="breadcrumb-link" onClick={() => { setActiveSection(null); setActiveSubsection(null); setSectionJumpMenu(null); setSubJumpMenu(false); window.scrollTo({ top: 0, behavior: "smooth" }); }}>All Sections</span>

            {/* Level 2: Section title + SECTION caret (→ all 11 sections list) */}
            {(() => {
              const sec = activeSection ? SECTIONS.find(s => s.id === activeSection) : null;
              const secLabel = sec ? `${sec.num} — ${sec.title}` : null;
              const hasSubs = sec && SUBSECTIONS[sec.id] && SUBSECTIONS[sec.id].length > 0;
              const caretStyle = (open) => ({
                background: open ? t.accentLight : "none",
                border: `1px solid ${open ? t.accent : "transparent"}`,
                borderRadius: 4, cursor: "pointer", color: t.accent,
                padding: "2px 5px", display: "inline-flex", alignItems: "center",
                lineHeight: 1, transition: "all 0.15s", flexShrink: 0,
              });
              const CaretSVG = ({ open }) => (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                  style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              );
              return (
                <>
                  <span className="breadcrumb-sep">/</span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
                    {sec
                      ? <span className="breadcrumb-link" style={{ fontWeight: 600 }} onClick={() => { setSectionJumpMenu(null); setSubJumpMenu(false); scrollToSection(sec.id); }}>{secLabel}</span>
                      : <span style={{ color: t.textSec }}>Select a section</span>
                    }
                    {/* SECTION CARET — shows all 11 sections */}
                    <button
                      onClick={(e) => { e.stopPropagation(); setSubJumpMenu(false); setSectionJumpMenu(sectionJumpMenu ? null : "sections"); }}
                      style={caretStyle(sectionJumpMenu === "sections")}
                      title="Navigate to section">
                      <CaretSVG open={sectionJumpMenu === "sections"} />
                    </button>
                  </span>

                  {/* SECTION DROPDOWN — all 11 sections */}
                  {sectionJumpMenu === "sections" && (
                    <div style={{
                      position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0,
                      background: t.surface, border: `1px solid ${t.border}`,
                      borderRadius: 8, boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
                      zIndex: 300, maxHeight: "min(70vh, 480px)", overflowY: "auto",
                      animation: "popIn 0.15s ease"
                    }}>
                      <div style={{ padding: "8px 16px 6px", fontSize: 11, fontWeight: 700, color: t.textSec, textTransform: "uppercase", letterSpacing: "0.6px", background: t.surfaceHover, borderBottom: `1px solid ${t.border}`, position: "sticky", top: 0 }}>
                        Navigate to Section
                      </div>
                      {SECTIONS.map((s) => (
                        <button key={s.id}
                          style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 16px", background: s.id === activeSection ? t.accentLight : "none", border: "none", borderBottom: `1px solid ${t.border}`, textAlign: "left", cursor: "pointer", fontSize: 13, color: s.id === activeSection ? t.accent : t.text, fontWeight: s.id === activeSection ? 700 : 400, transition: "background 0.1s" }}
                          onMouseEnter={e => { if (s.id !== activeSection) { e.currentTarget.style.background = t.surfaceHover; }}}
                          onMouseLeave={e => { if (s.id !== activeSection) { e.currentTarget.style.background = "none"; }}}
                          onClick={() => { setSectionJumpMenu(null); setSubJumpMenu(false); setActiveSubsection(null); scrollToSection(s.id); }}>
                          <span style={{ background: s.id === activeSection ? t.accent : t.badge, color: s.id === activeSection ? "#fff" : t.badgeText, borderRadius: 4, padding: "2px 7px", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{s.num}</span>
                          <span>{s.title}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Level 3: Subsection title + SUBSECTION caret (→ subsections of open section) */}
                  {sec && activeSubsection && hasSubs && (
                    <>
                      <span className="breadcrumb-sep">/</span>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 3, minWidth: 0 }}>
                        <span style={{ color: t.text, fontWeight: 600, fontSize: 12, maxWidth: "clamp(80px, 28vw, 220px)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{activeSubsection}</span>
                        {/* SUBSECTION CARET — shows subsections of current section */}
                        <button
                          onClick={(e) => { e.stopPropagation(); setSectionJumpMenu(null); setSubJumpMenu(!subJumpMenu); }}
                          style={caretStyle(subJumpMenu)}
                          title="Jump to subsection">
                          <CaretSVG open={subJumpMenu} />
                        </button>
                      </span>

                      {/* SUBSECTION DROPDOWN */}
                      {subJumpMenu && (
                        <div style={{
                          position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0,
                          background: t.surface, border: `1px solid ${t.border}`,
                          borderRadius: 8, boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
                          zIndex: 300, maxHeight: "min(60vh, 400px)", overflowY: "auto",
                          animation: "popIn 0.15s ease"
                        }}>
                          <div style={{ padding: "8px 16px 6px", fontSize: 11, fontWeight: 700, color: t.textSec, textTransform: "uppercase", letterSpacing: "0.6px", background: t.surfaceHover, borderBottom: `1px solid ${t.border}`, position: "sticky", top: 0 }}>
                            {sec.num} {sec.title} — Subsections
                          </div>
                          {SUBSECTIONS[sec.id].map((sub, si) => (
                            <button key={si}
                              style={{ display: "block", width: "100%", padding: "10px 16px", background: sub.label === activeSubsection ? t.accentLight : "none", border: "none", borderBottom: `1px solid ${t.border}`, textAlign: "left", cursor: "pointer", fontSize: 13, color: sub.label === activeSubsection ? t.accent : t.text, fontWeight: sub.label === activeSubsection ? 700 : 400, transition: "background 0.1s" }}
                              onMouseEnter={e => { if (sub.label !== activeSubsection) { e.currentTarget.style.background = t.surfaceHover; }}}
                              onMouseLeave={e => { if (sub.label !== activeSubsection) { e.currentTarget.style.background = "none"; }}}
                              onClick={() => {
                                setSubJumpMenu(false);
                                setTimeout(() => {
                                  const el = document.getElementById(sub.id);
                                  if (el) {
                                    const top = el.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET;
                                    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
                                    setActiveSubsection(sub.label);
                                  }
                                }, 50);
                              }}>
                              {sub.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </>
                  )}

                  {/* Subsection title without caret when no activeSubsection yet */}
                  {sec && !activeSubsection && hasSubs && (
                    <span style={{ color: t.textSec, fontSize: 12, marginLeft: 2 }}>— tap ▾ to jump to subsection</span>
                  )}
                </>
              );
            })()}
          </div>
        </div>

        <div className="content">
          {filteredSections.map(section => {
            const isOpen = activeSection === section.id;
            return (
              <div key={section.id} id={section.id} className="section-card">
                {/* Section Header */}
                <div className="section-header" onClick={() => { setActiveSection(isOpen ? null : section.id); setActiveSubsection(null); setSectionJumpMenu(null); setSubJumpMenu(false); }}>
                  <span className="section-num">{section.num}</span>
                  <span className="section-icon"><Icon name={section.icon} /></span>
                  <div style={{ flex: 1 }}>
                    <div className="section-title">{section.title}</div>
                    <div className="section-tagline">{section.tagline}</div>
                  </div>
                  <span style={{ color: t.textSec, flexShrink: 0, marginTop: 2, transform: isOpen ? "rotate(90deg)" : "none", transition: "transform 0.2s" }}>
                    <Icon name="ChevronRight" />
                  </span>
                </div>

                {/* Section Body */}
                {isOpen && (
                  <div className="section-body">
                    {/* Role badges */}
                    <div className="roles-badges">
                      {section.roles.map(r => <span key={r} className="role-badge">{r}</span>)}
                    </div>

                    {/* Summary */}
                    <p className="section-summary">{section.summary}</p>

                    {/* Key Points */}
                    {section.keyPoints && (
                      <div className="keypoints">
                        {section.keyPoints.map((kp, i) => (
                          <div key={i} className="keypoint-card"
                            onClick={() => setModal({ title: kp.label, content: kp.detail })}>
                            <div className="keypoint-label">{kp.label}</div>
                            <div className="keypoint-hint">Tap for details →</div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Section-specific content */}

                    {/* S1: Objections */}
                    {section.id === "s1" && (
                      <>
                        {/* Hero quote */}
                        {section.heroQuote && (
                          <div style={{ background: "linear-gradient(135deg, #0052CC 0%, #172B4D 100%)", borderRadius: 8, padding: "16px 20px", marginBottom: 16, fontStyle: "italic", fontSize: 15, color: "#fff", lineHeight: 1.6 }}>
                            {section.heroQuote}
                          </div>
                        )}

                        <div id="s1-problems"></div>
                        {/* 1.1 Problems — scannable cards, tap for impact detail */}
                        {section.problems && (
                          <>
                            <div style={{ fontSize: 12, fontWeight: 700, color: t.textSec, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>1.1 — Five Systemic Problems</div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 18 }}>
                              {section.problems.map((p, i) => (
                                <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "10px 14px", background: t.surfaceHover, borderRadius: 8, border: `1px solid ${t.border}`, cursor: "pointer", transition: "box-shadow 0.15s" }}
                                  onClick={() => setSideSheet({ title: p.problem, content: `<div style="margin-bottom:14px"><strong>Business Impact:</strong><br/><br/>${p.impact}</div><div style="margin-top:12px;padding:10px 12px;background:#DEEBFF;border-radius:6px;font-size:13px"><strong>Resolved by:</strong> <a href="#${p.sectionId}" data-nav="${p.sectionId}" style="color:#0052CC;font-weight:700;text-decoration:underline;cursor:pointer">${p.section}</a></div>`, onLink: p.sectionId })}>
                                  <span style={{ color: t.danger, fontWeight: 800, fontSize: 16, flexShrink: 0, marginTop: 1 }}>!</span>
                                  <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: 13, fontWeight: 600, color: t.text }}>{p.problem}</div>
                                    <div style={{ fontSize: 12, color: t.accent, marginTop: 2 }}>{p.section} — tap for impact detail</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </>
                        )}

                        <div id="s1-framework"></div>
                        {/* 1.2 Framework — 9 systems as compact tappable rows */}
                        {section.framework && (
                          <>
                            <div style={{ fontSize: 12, fontWeight: 700, color: t.textSec, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>1.2 — Nine Interconnected Systems</div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 18 }}>
                              {section.framework.map((f, i) => (
                                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 14px", background: i%2===0 ? t.surface : t.surfaceHover, borderRadius: 7, border: `1px solid ${t.border}`, cursor: "pointer" }}
                                  onClick={() => setModal({ title: f.system, content: <div><div style={{ marginBottom: 12 }}><strong>What it does:</strong> {f.does}</div><div style={{ padding: "10px 12px", background: "#E3FCEF", borderRadius: 6, color: "#006644", fontWeight: 600 }}>Business outcome: {f.outcome}</div>{f.sectionId && <div style={{ marginTop: 12 }}><button onClick={() => { setModal(null); scrollToSection(f.sectionId); }} style={{ background: "#0052CC", color: "#fff", border: "none", borderRadius: 6, padding: "8px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Go to {f.system} →</button></div>}</div> })}>
                                  <span style={{ fontSize: 13, fontWeight: 600, color: t.text }}>{f.system}</span>
                                  <span style={{ fontSize: 11, color: t.accent, marginLeft: 8, flexShrink: 0 }}>details →</span>
                                </div>
                              ))}
                            </div>
                          </>
                        )}

                        <div id="s1-roi"></div>
                        {/* 1.3 ROI Timeline — compact rows, tap for full detail */}
                        {section.roiTimeline && (
                          <>
                            <div style={{ fontSize: 12, fontWeight: 700, color: t.textSec, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>1.3 — Return on Investment Timeline</div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 18 }}>
                              {section.roiTimeline.map((r, i) => (
                                <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "10px 14px", background: t.surfaceHover, borderRadius: 8, border: `1px solid ${t.border}`, cursor: "pointer" }}
                                  onClick={() => setSideSheet({ title: `ROI — ${r.timeframe}`, content: `<div style="margin-bottom:14px"><strong>What Changes:</strong><br/>${r.changes}</div><div style="margin-bottom:14px"><strong>Measurable Signal:</strong><br/>${r.signal}</div><div style="padding:10px 12px;background:#E3FCEF;border-radius:6px;color:#006644;font-weight:600">Revenue / Margin Impact:<br/>${r.impact}</div>` })}>
                                  <span style={{ background: ["#1565C0","#1A7A4A","#6C3483","#B7770D","#1E3A5F"][i], color: "#fff", borderRadius: 5, padding: "3px 8px", fontSize: 12, fontWeight: 700, flexShrink: 0, minWidth: 70, textAlign: "center" }}>{r.timeframe}</span>
                                  <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: 13, color: t.text, lineHeight: 1.4 }}>{r.changes}</div>
                                    <div style={{ fontSize: 11, color: t.textSec, marginTop: 3 }}>{r.impact.split(":")[0]} — tap for full detail</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </>
                        )}

                        <div id="s1-objections"></div>
                        {/* 1.4 Objections — collapsible rows */}
                        {section.objections && (
                          <>
                            <div style={{ fontSize: 12, fontWeight: 700, color: t.textSec, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>1.4 — Addressing Likely Objections</div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 18 }}>
                              {section.objections.map((o, i) => (
                                <div key={i} style={{ border: `1px solid ${t.border}`, borderRadius: 8, overflow: "hidden" }}>
                                  <div style={{ padding: "10px 14px", background: t.surfaceHover, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}
                                    onClick={() => toggleAccordion(`s1-obj-${i}`)}>
                                    <span style={{ fontSize: 13, fontWeight: 600, color: t.danger }}>{o.q}</span>
                                    <span style={{ color: t.textSec, transform: expandedAccordions[`s1-obj-${i}`] ? "rotate(180deg)" : "none", transition: "transform 0.2s", flexShrink: 0, marginLeft: 8 }}><Icon name="ChevronDown" /></span>
                                  </div>
                                  {expandedAccordions[`s1-obj-${i}`] && (
                                    <div style={{ padding: "12px 14px", fontSize: 13, color: t.text, lineHeight: 1.65, borderTop: `1px solid ${t.border}`, background: t.surface }}>{o.a}</div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </>
                        )}

                        <div id="s1-decisions"></div>
                        {/* 1.5 Decisions — cards with impact on hover/tap */}
                        {section.decisions && (
                          <>
                            <div style={{ background: dark ? "#2D1F00" : "#FEF9E7", border: "1.5px solid #B7770D", borderRadius: 8, padding: "10px 14px", marginBottom: 10, fontSize: 13, color: t.text }}>
                              <strong style={{ color: "#B7770D" }}>EXECUTIVE DECISION REQUIRED —</strong> The implementation begins with or without executive endorsement — but it is significantly more effective with it. Teams follow process more consistently when leadership has explicitly endorsed it.
                            </div>
                            <div style={{ fontSize: 12, fontWeight: 700, color: t.textSec, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>1.5 — Four Decisions Required</div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 18 }}>
                              {section.decisions.map((d, i) => (
                                <div key={i} style={{ padding: "12px 14px", background: t.surfaceHover, borderRadius: 8, border: `1.5px solid #B7770D`, cursor: "pointer" }}
                                  onClick={() => setModal({ title: "Decision Required", content: <div><div style={{ marginBottom: 12, fontSize: 15, fontWeight: 600 }}>{d.text}</div><div style={{ marginBottom: 10 }}><strong>Owner:</strong> {d.owner}</div><div style={{ padding: "10px 12px", background: "#FFEBE6", borderRadius: 6, color: "#DE350B" }}><strong>Impact if deferred:</strong> {d.impact}</div></div> })}>
                                  <div style={{ fontSize: 13, fontWeight: 600, color: t.text, marginBottom: 4 }}>{d.text}</div>
                                  <div style={{ fontSize: 12, color: "#B7770D" }}>Owner: {d.owner} — tap to see impact if deferred</div>
                                </div>
                              ))}
                            </div>
                          </>
                        )}

                        <div id="s1-wins"></div>
                        {/* 1.6 Quick Wins */}
                        {section.quickWins && (
                          <>
                            <div style={{ fontSize: 12, fontWeight: 700, color: t.textSec, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>1.6 — Quick Wins Visible in 30 Days</div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 18 }}>
                              {section.quickWins.map((w, i) => (
                                <div key={i} style={{ padding: "10px 14px", background: t.surfaceHover, borderRadius: 8, border: `1px solid ${t.border}`, cursor: "pointer" }}
                                  onClick={() => setSideSheet({ title: w.win, content: `<div style="margin-bottom:12px"><strong>Who sees it:</strong> ${w.who}</div><div style="padding:10px 12px;background:#E3FCEF;border-radius:6px;color:#006644"><strong>Why it matters:</strong><br/>${w.why}</div>` })}>
                                  <div style={{ fontSize: 13, fontWeight: 600, color: t.success, marginBottom: 3 }}>✓ {w.win}</div>
                                  <div style={{ fontSize: 12, color: t.textSec }}>{w.who} — tap for details</div>
                                </div>
                              ))}
                            </div>
                          </>
                        )}

                        <div id="s1-docstruct"></div>
                        {/* 1.7 Document structure */}
                        {section.docStructure && (
                          <>
                            <div style={{ fontSize: 12, fontWeight: 700, color: t.textSec, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>1.7 — How to Read This Guide</div>
                            <div className="table-wrapper">
                              <table className="data-table">
                                <thead><tr><th>#</th><th>Section</th><th>Primary Audience</th><th>Key Question</th></tr></thead>
                                <tbody>{section.docStructure.map((d, i) => (
                                  <tr key={i} style={{ cursor: "pointer" }} onClick={() => scrollToSection(`s${d.num}`)}>
                                    <td style={{ fontWeight: 700, color: t.accent }}>{d.num}</td>
                                    <td style={{ fontWeight: 600 }}>{d.title}</td>
                                    <td style={{ color: t.textSec }}>{d.audience}</td>
                                    <td>{d.question}</td>
                                  </tr>
                                ))}</tbody>
                              </table>
                            </div>
                          </>
                        )}
                      </>
                    )}

                    {/* S2: Full content */}
                    {section.id === "s2" && (
                      <>
                        <div id="s2-def"></div>
                        {/* 2.1 Definition callout */}
                        {section.definition && (
                          <div style={{ background: t.accentLight, border: `1.5px solid ${t.accent}`, borderRadius: 8, padding: "14px 16px", marginBottom: 18 }}>
                            <div style={{ fontSize: 11, fontWeight: 800, color: t.accent, letterSpacing: "0.8px", textTransform: "uppercase", marginBottom: 6 }}>DEFINITION</div>
                            <div style={{ fontSize: 14, color: t.text, lineHeight: 1.65 }}>{section.definition}</div>
                          </div>
                        )}

                        <div id="s2-mission"></div>
                        {/* 2.2 Mission callout */}
                        {section.mission && (
                          <div style={{ background: "linear-gradient(135deg, #0052CC 0%, #172B4D 100%)", borderRadius: 8, padding: "16px 20px", marginBottom: 18 }}>
                            <div style={{ fontSize: 11, fontWeight: 800, color: "rgba(255,255,255,0.7)", letterSpacing: "0.8px", textTransform: "uppercase", marginBottom: 6 }}>2.2 — MISSION STATEMENT</div>
                            <div style={{ fontSize: 14, color: "#fff", lineHeight: 1.7, fontStyle: "italic" }}>{section.mission}</div>
                          </div>
                        )}

                        <div id="s2-why"></div>
                        {/* 2.3 Why This Exists Now — numbered cards */}
                        {section.whyNow && (
                          <>
                            <div style={{ fontSize: 12, fontWeight: 700, color: t.textSec, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>2.3 — Why This Exists Now</div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 18 }}>
                              {section.whyNow.map((w, i) => (
                                <div key={i} style={{ display: "flex", gap: 12, padding: "12px 14px", background: t.surfaceHover, borderRadius: 8, border: `1px solid ${t.border}`, cursor: "pointer" }}
                                  onClick={() => setSideSheet({ title: w.title, content: `<div style="margin-bottom:16px;font-size:14px;line-height:1.7">${w.body}</div>${w.sectionId ? `<div style="padding:10px 12px;background:#DEEBFF;border-radius:6px;font-size:13px"><strong>Resolved by:</strong> <a href="#${w.sectionId}" data-nav="${w.sectionId}" style="color:#0052CC;font-weight:700;text-decoration:underline;cursor:pointer">${w.sectionLabel} →</a></div>` : ""}` })}>
                                  <span style={{ background: t.accent, color: "#fff", borderRadius: "50%", width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, flexShrink: 0 }}>{w.num}</span>
                                  <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: 13, fontWeight: 700, color: t.text }}>{w.title}</div>
                                    <div style={{ fontSize: 12, color: t.textSec, marginTop: 2 }}>{w.sectionId ? <span style={{ color: t.accent }}>Tap to read + see resolving section →</span> : "Tap to read more"}</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </>
                        )}

                        <div id="s2-scope"></div>
                        {/* 2.4 Products — cards with full detail in side sheet */}
                        {section.products && (
                          <>
                            <div style={{ fontSize: 12, fontWeight: 700, color: t.textSec, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>2.4 — Three Products, One Process</div>
                            <div style={{ fontSize: 13, color: t.textSec, marginBottom: 10, lineHeight: 1.5 }}>Work spanning multiple products uses one BRD with cross-product scope — not three separate BRDs. See <button onClick={() => scrollToSection("s3")} style={{ background: "none", border: "none", color: t.accent, fontWeight: 700, cursor: "pointer", padding: 0, fontSize: 13, textDecoration: "underline" }}>Section 3.6</button> and <button onClick={() => scrollToSection("s8")} style={{ background: "none", border: "none", color: t.accent, fontWeight: 700, cursor: "pointer", padding: 0, fontSize: 13, textDecoration: "underline" }}>Section 8.2</button>.</div>
                            <div className="product-cards">
                              {section.products.map((p, i) => (
                                <div key={i} className="product-card"
                                  onClick={() => setSideSheet({ title: p.name, content: `<div style="margin-bottom:12px"><strong style="color:#6B778C;font-size:11px;text-transform:uppercase;letter-spacing:0.5px">PRIMARY AUDIENCE</strong><br/><div style="margin-top:4px">${p.audience}</div></div><div style="margin-bottom:12px"><strong style="color:#6B778C;font-size:11px;text-transform:uppercase;letter-spacing:0.5px">SCOPE</strong><br/><div style="margin-top:4px">${p.scope}</div></div><div style="margin-bottom:12px"><strong style="color:#6B778C;font-size:11px;text-transform:uppercase;letter-spacing:0.5px">DEV OWNERSHIP</strong><br/><div style="margin-top:4px">${p.devOwner}</div></div><div><strong style="color:#6B778C;font-size:11px;text-transform:uppercase;letter-spacing:0.5px">UX FOCUS</strong><br/><div style="margin-top:4px">${p.uxFocus}</div></div>` })}>
                                  <div className="product-card-header" style={{ background: p.color }}>{p.name}</div>
                                  <div className="product-card-body">{p.audience} — Tap for full details</div>
                                </div>
                              ))}
                            </div>
                          </>
                        )}

                        <div id="s2-connective"></div>
                        {/* 2.5 UX Constraints — 4 pillars */}
                        {section.uxConstraints && (
                          <>
                            <div style={{ fontSize: 12, fontWeight: 700, color: t.textSec, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>2.5 — UX as the Connective Tissue</div>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 8, marginBottom: 10 }}>
                              {section.uxConstraints.map((c, i) => (
                                <div key={i} style={{ borderRadius: 8, overflow: "hidden", border: `1px solid ${t.border}`, cursor: "pointer" }}
                                  onClick={() => setModal({ title: c.label, content: <div style={{ fontSize: 14, lineHeight: 1.7 }}>{c.desc}</div> })}>
                                  <div style={{ background: c.color, padding: "10px 14px" }}>
                                    <div style={{ fontSize: 13, fontWeight: 800, color: "#fff", letterSpacing: "0.5px" }}>{c.label}</div>
                                  </div>
                                  <div style={{ padding: "8px 14px", background: t.surface, fontSize: 12, color: t.textSec }}>Tap for details</div>
                                </div>
                              ))}
                            </div>
                            <div style={{ fontSize: 13, color: t.textSec, lineHeight: 1.6, marginBottom: 18, padding: "10px 14px", background: t.surfaceHover, borderRadius: 8, border: `1px solid ${t.border}` }}>
                              UX cannot do its job well unless every upstream input is complete and correct before design begins. Every downstream team cannot do their job well unless UX output is complete and correct before they begin.
                            </div>
                          </>
                        )}

                        <div id="s2-mandate"></div>
                        {/* 2.6 Mandates — tappable rows with section links */}
                        {section.mandates && (
                          <>
                            <div style={{ fontSize: 12, fontWeight: 700, color: t.textSec, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>2.6 — Design Team Mandate & Responsibilities</div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 18 }}>
                              {section.mandates.map((m, i) => (
                                <div key={i} style={{ padding: "11px 14px", background: t.surfaceHover, borderRadius: 8, border: `1px solid ${t.border}`, cursor: "pointer" }}
                                  onClick={() => setSideSheet({ title: m.responsibility, content: `<div style="margin-bottom:12px;font-size:14px;line-height:1.7">${m.description}</div><div style="margin-bottom:10px"><strong>Primary Owner:</strong> ${m.owner}</div>${m.sectionId ? `<div style="padding:10px 12px;background:#DEEBFF;border-radius:6px;font-size:13px"><strong>See:</strong> <a href="#${m.sectionId}" data-nav="${m.sectionId}" style="color:#0052CC;font-weight:700;text-decoration:underline;cursor:pointer">${m.sectionLabel} →</a></div>` : ""}` })}>
                                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <div>
                                      <div style={{ fontSize: 13, fontWeight: 700, color: t.text }}>{m.responsibility}</div>
                                      <div style={{ fontSize: 12, color: t.textSec, marginTop: 2 }}>Owner: {m.owner}</div>
                                    </div>
                                    <Icon name="ChevronRight" />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </>
                        )}

                        <div id="s2-needs"></div>
                        {/* 2.7 Needs table — expandable rows */}
                        {section.uxNeeds && (
                          <>
                            <div style={{ fontSize: 12, fontWeight: 700, color: t.textSec, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>2.7 — What UX Needs & What Each Team Needs From UX</div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 18 }}>
                              {section.uxNeeds.map((n, i) => (
                                <div key={i} style={{ border: `1px solid ${t.border}`, borderRadius: 8, overflow: "hidden" }}>
                                  <div style={{ padding: "10px 14px", background: t.surfaceHover, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}
                                    onClick={() => toggleAccordion(`s2-need-${i}`)}>
                                    <span style={{ fontSize: 13, fontWeight: 700, color: t.text }}>{n.team}</span>
                                    <span style={{ color: t.textSec, transform: expandedAccordions[`s2-need-${i}`] ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}><Icon name="ChevronDown" /></span>
                                  </div>
                                  {expandedAccordions[`s2-need-${i}`] && (
                                    <div style={{ borderTop: `1px solid ${t.border}`, background: t.surface }}>
                                      <div style={{ padding: "12px 14px", borderBottom: `1px solid ${t.border}` }}>
                                        <div style={{ fontSize: 11, fontWeight: 700, color: t.accent, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6 }}>What UX Needs From {n.team}</div>
                                        <div style={{ fontSize: 13, color: t.text, lineHeight: 1.6 }}>{n.fromTeam}</div>
                                      </div>
                                      <div style={{ padding: "12px 14px" }}>
                                        <div style={{ fontSize: 11, fontWeight: 700, color: t.success, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6 }}>What {n.team} Needs From UX</div>
                                        <div style={{ fontSize: 13, color: t.text, lineHeight: 1.6 }}>{n.fromUX}</div>
                                      </div>
                                      {n.sectionId && (
                                        <div style={{ padding: "8px 14px", background: t.accentLight, borderTop: `1px solid ${t.border}` }}>
                                          <button onClick={() => scrollToSection(n.sectionId)} style={{ background: "none", border: "none", color: t.accent, fontWeight: 700, cursor: "pointer", padding: 0, fontSize: 12, textDecoration: "underline" }}>See {n.sectionLabel} →</button>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </>
                        )}

                        <div id="s2-governs"></div>
                        {/* 2.8 What this governs — clickable links */}
                        {section.governs && (
                          <>
                            <div style={{ fontSize: 12, fontWeight: 700, color: t.textSec, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>2.8 — What This Document Governs</div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 6 }}>
                              {section.governs.map((g, i) => (
                                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 14px", background: i%2===0 ? t.surface : t.surfaceHover, borderRadius: 7, border: `1px solid ${t.border}`, cursor: "pointer" }}
                                  onClick={() => scrollToSection(g.sectionId)}>
                                  <span style={{ color: t.success, fontWeight: 800, flexShrink: 0 }}>→</span>
                                  <span style={{ fontSize: 13, color: t.text, flex: 1 }}>{g.item}</span>
                                  <span style={{ fontSize: 11, color: t.accent, flexShrink: 0, fontWeight: 600 }}>Go to section</span>
                                </div>
                              ))}
                            </div>
                            <div style={{ fontSize: 13, color: t.textSec, padding: "10px 14px", background: dark ? "#1B0000" : "#FFEBE6", borderRadius: 8, border: `1px solid ${t.danger}`, marginBottom: 18, lineHeight: 1.6 }}>
                              <strong style={{ color: t.danger }}>NOT governed here:</strong> Creative direction, brand strategy, or the business priorities that determine what gets built. Those belong to the Creative Director, Marketing leadership, and the Executive team.
                            </div>
                          </>
                        )}

                        <div id="s2-living"></div>
                        {/* 2.9 Living document cadence table */}
                        {section.livingDoc && (
                          <>
                            <div style={{ fontSize: 12, fontWeight: 700, color: t.textSec, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>2.9 — Living Document Cadence</div>
                            <div className="table-wrapper">
                              <table className="data-table">
                                <thead><tr><th>Activity</th><th>Cadence</th><th>Owner</th><th>Output</th></tr></thead>
                                <tbody>{section.livingDoc.map((l, i) => (
                                  <tr key={i}><td style={{ fontWeight: 600 }}>{l.activity}</td><td>{l.cadence}</td><td>{l.owner}</td><td>{l.output}</td></tr>
                                ))}</tbody>
                              </table>
                            </div>
                          </>
                        )}
                      </>
                    )}

                    {/* S3: Full Product Cycle */}
                    {section.id === "s3" && (
                      <>
                        <div id="s3-note"></div>
                        {/* Workflow note */}
                        {section.workflowNote && (
                          <div style={{ background: t.accentLight, border: `1.5px solid ${t.accent}`, borderRadius: 8, padding: "12px 16px", marginBottom: 16, fontSize: 13, color: t.text, lineHeight: 1.6 }}>
                            <strong style={{ color: t.accent }}>NOTE — </strong>{section.workflowNote}
                          </div>
                        )}

                        <div id="s3-stages"></div>
                        {/* 3.1 Stage pipeline — grouped by lane */}
                        {section.stages && (() => {
                          const grouped = {};
                          section.stages.forEach(s => { if (!grouped[s.lane]) grouped[s.lane] = []; grouped[s.lane].push(s); });
                          const laneColors = { "Planning": "#5D6D7E", "Design": "#2E86AB", "Development": "#1A7A4A", "QA": "#B7770D", "Release": "#A93226", "Release (Conditional)": "#7B241C" };
                          return (
                            <>
                              <div style={{ fontSize: 12, fontWeight: 700, color: t.textSec, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 10 }}>3.1 — 16 Workflow Stages — Tap Any Stage for Entry / Exit Criteria</div>
                              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 18 }}>
                                {Object.entries(grouped).map(([lane, stages]) => (
                                  <div key={lane}>
                                    <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase", color: laneColors[lane] || t.textSec, marginBottom: 5, paddingLeft: 4 }}>{lane}</div>
                                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                                      {stages.map((st, i) => (
                                        <div key={i} style={{ padding: "7px 12px", borderRadius: 6, fontSize: 12, fontWeight: 600, color: "#fff", background: st.color, cursor: "pointer", transition: "transform 0.1s, box-shadow 0.1s" }}
                                          onClick={() => setSideSheet({ title: `${st.name} — ${st.lane}`, content: `<div style="margin-bottom:4px;font-size:11px;font-weight:700;color:#6B778C;text-transform:uppercase;letter-spacing:0.5px">Owner</div><div style="margin-bottom:14px;font-weight:600">${st.owner}</div><div style="margin-bottom:4px;font-size:11px;font-weight:700;color:#006644;text-transform:uppercase;letter-spacing:0.5px">Entry Criteria</div><div style="margin-bottom:14px;line-height:1.6">${st.entry}</div><div style="margin-bottom:4px;font-size:11px;font-weight:700;color:#DE350B;text-transform:uppercase;letter-spacing:0.5px">Exit Criteria</div><div style="margin-bottom:14px;line-height:1.6">${st.exit}</div><div style="margin-bottom:4px;font-size:11px;font-weight:700;color:#B7770D;text-transform:uppercase;letter-spacing:0.5px">Operational Notes</div><div style="line-height:1.6">${st.notes}</div>` })}>
                                          {st.name}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </>
                          );
                        })()}

                        <div id="s3-lane"></div>
                        {/* 3.4 Lane Movement Rules */}
                        {section.laneMovement && (
                          <>
                            <div style={{ background: dark ? "#1C2033" : "#FEF9E7", border: "1.5px solid #B7770D", borderRadius: 8, padding: "10px 14px", marginBottom: 10, fontSize: 13, color: t.text, lineHeight: 1.55 }}>
                              <strong style={{ color: "#B7770D" }}>RULE — </strong>Moving a ticket to the next stage is not administrative — it is a declaration that the exit criteria for the current stage have been met. Never move a ticket forward because it is convenient. Move it forward because it is ready.
                            </div>
                            <div style={{ fontSize: 12, fontWeight: 700, color: t.textSec, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>3.4 — Lane Movement Rules</div>
                            <div className="table-wrapper" style={{ marginBottom: 10 }}>
                              <table className="data-table">
                                <thead><tr><th>Lane</th><th>Stages Covered</th><th>Who Can Move Within Lane</th><th>Cross-Lane Override</th></tr></thead>
                                <tbody>{section.laneMovement.map((l, i) => (
                                  <tr key={i}><td style={{ fontWeight: 700 }}>{l.lane}</td><td>{l.stages}</td><td>{l.owner}</td><td style={{ color: t.textSec }}>{l.override}</td></tr>
                                ))}</tbody>
                              </table>
                            </div>
                            {section.laneOverrideRules && (
                              <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 18 }}>
                                {section.laneOverrideRules.map((rule, i) => (
                                  <div key={i} style={{ display: "flex", gap: 10, padding: "9px 14px", background: t.surfaceHover, borderRadius: 7, border: `1px solid ${t.border}`, fontSize: 13, color: t.text, lineHeight: 1.5 }}>
                                    <span style={{ color: t.accent, fontWeight: 800, flexShrink: 0 }}>•</span>
                                    <span>{rule}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </>
                        )}

                        <div id="s3-cadence"></div>
                        {/* 3.5 Release Cadence */}
                        {section.releaseCadence && (
                          <>
                            <div style={{ fontSize: 12, fontWeight: 700, color: t.textSec, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>3.5 — Release Cadence</div>
                            <div className="table-wrapper" style={{ marginBottom: 18 }}>
                              <table className="data-table">
                                <thead><tr><th>Release Type</th><th>Cadence</th><th>Examples</th><th>Final Approval</th><th>Exec Review?</th><th>BRD Requirement</th></tr></thead>
                                <tbody>{section.releaseCadence.map((r, i) => (
                                  <tr key={i}>
                                    <td style={{ fontWeight: 700 }}>{r.type}</td>
                                    <td>{r.cadence}</td>
                                    <td style={{ color: t.textSec }}>{r.examples}</td>
                                    <td>{r.approval}</td>
                                    <td><span style={{ fontWeight: 700, color: r.execReview === "No" ? t.success : r.execReview === "Yes (Tier 2+)" ? t.danger : t.warn }}>{r.execReview}</span></td>
                                    <td style={{ fontSize: 12 }}>{r.brd}</td>
                                  </tr>
                                ))}</tbody>
                              </table>
                            </div>
                          </>
                        )}

                        <div id="s3-crossproduct"></div>
                        {/* 3.6 Cross-product tracking */}
                        {section.crossProduct && (
                          <>
                            <div style={{ fontSize: 12, fontWeight: 700, color: t.textSec, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>3.6 — Cross-Product Work Tracking</div>
                            <div style={{ fontSize: 13, color: t.textSec, marginBottom: 8, lineHeight: 1.5 }}>
                              One BRD with cross-product scope — not three separate BRDs. See <button onClick={() => scrollToSection("s8")} style={{ background: "none", border: "none", color: t.accent, fontWeight: 700, cursor: "pointer", padding: 0, fontSize: 13, textDecoration: "underline" }}>Section 8 — Jira Configuration Guide</button> for board setup.
                            </div>
                            <div className="table-wrapper" style={{ marginBottom: 18 }}>
                              <table className="data-table">
                                <thead><tr><th>Work Type</th><th>Board Assignment</th><th>Ticket Structure</th><th>Jira Field Requirements</th></tr></thead>
                                <tbody>{section.crossProduct.map((c, i) => (
                                  <tr key={i}><td style={{ fontWeight: 700 }}>{c.workType}</td><td>{c.board}</td><td>{c.ticket}</td><td style={{ fontSize: 12 }}>{c.jiraField}</td></tr>
                                ))}</tbody>
                              </table>
                            </div>
                          </>
                        )}

                        <div id="s3-done"></div>
                        {/* 3.7 Definition of Done */}
                        {section.doneDefinitions && (
                          <>
                            <div style={{ fontSize: 12, fontWeight: 700, color: t.textSec, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>3.7 — Definition of Done at Every Level</div>
                            <div style={{ fontSize: 13, color: t.textSec, marginBottom: 8 }}>Done is not when development is finished. Done is when the work has been released, confirmed in production, and documented.</div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 18 }}>
                              {section.doneDefinitions.map((d, i) => (
                                <div key={i} style={{ display: "flex", gap: 12, padding: "12px 14px", background: t.surfaceHover, borderRadius: 8, border: `1px solid ${t.border}` }}>
                                  <span style={{ background: ["#5D6D7E","#2E86AB","#1A7A4A","#A93226"][i], color: "#fff", borderRadius: 6, padding: "3px 10px", fontSize: 12, fontWeight: 700, flexShrink: 0, alignSelf: "flex-start" }}>{d.level}</span>
                                  <span style={{ fontSize: 13, color: t.text, lineHeight: 1.65 }}>{d.definition}</span>
                                </div>
                              ))}
                            </div>
                          </>
                        )}

                        {/* 3 Quick Reference */}
                        {section.quickRef && (
                          <>
                            <div style={{ fontSize: 12, fontWeight: 700, color: t.textSec, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>Section 3 — Quick Reference</div>
                            <div className="table-wrapper">
                              <table className="data-table">
                                <thead><tr><th>Topic</th><th>Standard</th></tr></thead>
                                <tbody>{section.quickRef.map((q, i) => (
                                  <tr key={i}><td style={{ fontWeight: 700 }}>{q.topic}</td><td>{q.standard}</td></tr>
                                ))}</tbody>
                              </table>
                            </div>
                          </>
                        )}
                      </>
                    )}

                    {/* S4: Full DRAC Model */}
                    {section.id === "s4" && (
                      <>
                        {/* Decision rule banner */}
                        {section.decisionRule && (
                          <div style={{ background: dark ? "#1C1C33" : "#F3E5F5", border: "1.5px solid #6C3483", borderRadius: 8, padding: "12px 16px", marginBottom: 16, fontSize: 13, color: t.text, lineHeight: 1.6 }}>
                            <strong style={{ color: "#6C3483" }}>DECISION RULE — </strong>{section.decisionRule}
                          </div>
                        )}

                        {/* 4.1 DRAC Legend */}
                        {section.dracLegend && (
                          <>
                            <div id="s4-rule" style={{ fontSize: 12, fontWeight: 700, color: t.textSec, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>4.1 — DRAC Legend</div>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 8, marginBottom: 18 }}>
                              {section.dracLegend.map((r, i) => (
                                <div key={i} style={{ borderRadius: 8, overflow: "hidden", border: `1px solid ${t.border}`, cursor: "pointer" }}
                                  onClick={() => setModal({ title: `${r.code} — ${r.role}`, content: <div style={{ fontSize: 14 }}>
                                    <div style={{ marginBottom: 10 }}><strong>Meaning:</strong> {r.meaning}</div>
                                    <div style={{ padding: "8px 12px", background: "#E3FCEF", borderRadius: 6, color: "#006644" }}><strong>Timebox:</strong> {r.timebox}</div>
                                  </div> })}>
                                  <div style={{ background: r.color, padding: "10px 14px", display: "flex", alignItems: "center", gap: 10 }}>
                                    <span style={{ fontSize: 22, fontWeight: 900, color: "#fff" }}>{r.code}</span>
                                    <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{r.role}</span>
                                  </div>
                                  <div style={{ padding: "7px 12px", background: t.surface, fontSize: 12, color: t.textSec }}>{r.meaning}</div>
                                </div>
                              ))}
                            </div>
                          </>
                        )}

                        {/* 4.1b Silent Approval Rule */}
                        {section.silentApprovalRule && (
                          <>
                            <div style={{ background: dark ? "#1C1400" : "#FEF9E7", border: "1.5px solid #B7770D", borderRadius: 8, padding: "12px 16px", marginBottom: 10, fontSize: 13, color: t.text, lineHeight: 1.6 }}>
                              <strong style={{ color: "#B7770D" }}>48-HR SILENT APPROVAL — </strong>{section.silentApprovalRule.rule}
                            </div>
                            <div style={{ fontSize: 12, fontWeight: 700, color: t.textSec, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6 }}>Veto Requirements — All 4 Must Be Met</div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 18 }}>
                              {section.silentApprovalRule.vetoRequirements.map((req, i) => (
                                <div key={i} style={{ display: "flex", gap: 10, padding: "9px 14px", background: i%2===0 ? t.surface : t.surfaceHover, borderRadius: 7, border: `1px solid ${t.border}`, fontSize: 13, color: t.text, lineHeight: 1.5 }}>
                                  <span style={{ color: t.danger, fontWeight: 800, flexShrink: 0 }}>{i+1}</span>
                                  <span>{req}</span>
                                </div>
                              ))}
                            </div>
                          </>
                        )}

                        {/* 4.2 Role Definitions */}
                        {section.roles_detail && (
                          <>
                            <div id="s4-roles" style={{ fontSize: 12, fontWeight: 700, color: t.textSec, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>4.2 — Role Definitions — Tap for Detail</div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 18 }}>
                              {section.roles_detail.map((r, i) => (
                                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: i%2===0 ? t.surface : t.surfaceHover, borderRadius: 8, border: `1px solid ${t.border}`, cursor: "pointer" }}
                                  onClick={() => setSideSheet({ title: r.role, content: `<div style="margin-bottom:14px;font-size:14px;line-height:1.7">${r.detail}</div>${r.sectionId ? `<div style="padding:10px 12px;background:#DEEBFF;border-radius:6px;font-size:13px"><strong>See:</strong> <a href="#${r.sectionId}" data-nav="${r.sectionId}" style="color:#0052CC;font-weight:700;text-decoration:underline;cursor:pointer">${r.sectionLabel} →</a></div>` : ""}` })}>
                                  <span style={{ fontSize: 13, fontWeight: 600, color: t.text }}>{r.role}</span>
                                  <Icon name="ChevronRight" />
                                </div>
                              ))}
                            </div>
                          </>
                        )}

                        {/* 4.3 DRAC Matrix — 15 rows, 5 phases */}
                        {section.dracMatrix && (() => {
                          const phases = [...new Set(section.dracMatrix.map(r => r.phase))];
                          const phaseColor = { "PLANNING": "#5D6D7E", "DESIGN": "#2E86AB", "DEVELOPMENT": "#1A7A4A", "QA": "#B7770D", "RELEASE": "#A93226", "RELEASE (STRATEGIC)": "#7B241C", "POST-RELEASE": "#145A32" };
                          const tierBg = { Low: dark ? "rgba(26,122,74,0.12)" : "rgba(26,122,74,0.07)", Medium: dark ? "rgba(183,119,13,0.12)" : "rgba(183,119,13,0.07)", High: dark ? "rgba(169,50,38,0.15)" : "rgba(169,50,38,0.08)" };
                          const tierColor = { Low: "#1A7A4A", Medium: "#B7770D", High: "#A93226" };
                          const roleCell = (name, type) => {
                            const colors = { driver: { bg: "#1565C0", light: dark ? "#1C2E4A" : "#DEEBFF", text: "#1565C0" }, reviewer: { bg: "#A93226", light: dark ? "#3D1F1F" : "#FFEBE6", text: "#A93226" }, accountable: { bg: "#1E3A5F", light: dark ? "#1C2535" : "#EAE6FF", text: "#3A2E7A" }, contributor: { bg: "#6B778C", light: dark ? "#2A2D35" : "#F4F5F7", text: "#6B778C" } };
                            const c = colors[type] || colors.contributor;
                            if (!name || name === "—") return <td style={{ textAlign: "center", padding: "8px 10px", color: t.textSec, fontSize: 13 }}>—</td>;
                            return (
                              <td style={{ padding: "8px 10px", verticalAlign: "middle" }}>
                                <div style={{ fontSize: 12, fontWeight: 600, color: c.text, lineHeight: 1.4 }}>{name}</div>
                              </td>
                            );
                          };
                          return (
                            <>
                              <div id="s4-matrix" style={{ fontSize: 12, fontWeight: 700, color: t.textSec, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>4.3 — DRAC Activity Matrix — 15 Activities — Tap Any Row for Full Detail</div>

                              {/* Row color key */}
                              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10, padding: "8px 12px", background: t.surfaceHover, borderRadius: 8, border: `1px solid ${t.border}`, alignItems: "center" }}>
                                <span style={{ fontSize: 11, fontWeight: 700, color: t.textSec, textTransform: "uppercase", letterSpacing: "0.5px", marginRight: 4 }}>Row color = Decision Tier:</span>
                                {[["Low", "#1A7A4A", "Executional — owned at Sr. Designer / Dev Lead level"], ["Medium", "#B7770D", "Tactical — 48hr silent approval applies"], ["High", "#A93226", "Strategic — Executive sign-off, no time limit"]].map(([risk, color, desc]) => (
                                  <div key={risk} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                    <span style={{ width: 14, height: 14, borderRadius: 3, background: color, flexShrink: 0, opacity: 0.7 }}></span>
                                    <span style={{ fontSize: 12, color: t.text }}><strong style={{ color }}>{risk}</strong> — {desc}</span>
                                  </div>
                                ))}
                              </div>

                              <div className="table-wrapper" style={{ marginBottom: 10 }}>
                                <table className="data-table" style={{ tableLayout: "fixed" }}>
                                  <colgroup>
                                    <col style={{ width: "12%" }} />
                                    <col style={{ width: "8%" }} />
                                    <col style={{ width: "28%" }} />
                                    <col style={{ width: "13%" }} />
                                    <col style={{ width: "13%" }} />
                                    <col style={{ width: "13%" }} />
                                    <col style={{ width: "13%" }} />
                                  </colgroup>
                                  <thead>
                                    <tr>
                                      <th>Phase</th>
                                      <th style={{ textAlign: "center" }}>Tier</th>
                                      <th>Activity</th>
                                      <th style={{ color: "#1565C0" }}>Driver</th>
                                      <th style={{ color: "#FFBDAD" }}>Reviewer <span style={{ fontWeight: 400, fontSize: 10 }}>(48hr veto)</span></th>
                                      <th style={{ color: "#C5CAE9" }}>Accountable</th>
                                      <th style={{ color: "#CFD8DC" }}>Contributor <span style={{ fontWeight: 400, fontSize: 10 }}>(non-blocking)</span></th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {phases.map(phase => {
                                      const rows = section.dracMatrix.filter(r => r.phase === phase);
                                      const pc = phaseColor[phase] || "#5D6D7E";
                                      return rows.map((row, ri) => (
                                        <tr key={`${phase}-${ri}`} style={{ cursor: "pointer", background: tierBg[row.tierRisk] || "transparent" }}
                                          onClick={() => setSideSheet({
                                            title: row.activity,
                                            content: `
                                              <div style="margin-bottom:10px;display:flex;gap:8px;align-items:center">
                                                <span style="background:${pc};color:#fff;border-radius:4px;padding:2px 8px;font-size:11px;font-weight:700">${row.phase}</span>
                                                <span style="background:${tierColor[row.tierRisk]};color:#fff;border-radius:4px;padding:2px 8px;font-size:11px;font-weight:700">${row.tier} — ${row.tierRisk} Risk</span>
                                              </div>
                                              <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px">
                                                <div style="padding:10px 12px;background:#DEEBFF;border-radius:6px">
                                                  <div style="font-size:11px;font-weight:700;color:#1565C0;margin-bottom:3px;text-transform:uppercase;letter-spacing:0.5px">Driver</div>
                                                  <div style="font-weight:600">${row.driver}</div>
                                                </div>
                                                <div style="padding:10px 12px;background:#FFEBE6;border-radius:6px">
                                                  <div style="font-size:11px;font-weight:700;color:#DE350B;margin-bottom:3px;text-transform:uppercase;letter-spacing:0.5px">Reviewer (48hr veto)</div>
                                                  <div style="font-weight:600">${row.reviewer}</div>
                                                </div>
                                                <div style="padding:10px 12px;background:#EAE6FF;border-radius:6px">
                                                  <div style="font-size:11px;font-weight:700;color:#3A2E7A;margin-bottom:3px;text-transform:uppercase;letter-spacing:0.5px">Accountable</div>
                                                  <div style="font-weight:600">${row.accountable}</div>
                                                </div>
                                                <div style="padding:10px 12px;background:#F4F5F7;border-radius:6px">
                                                  <div style="font-size:11px;font-weight:700;color:#6B778C;margin-bottom:3px;text-transform:uppercase;letter-spacing:0.5px">Contributor</div>
                                                  <div style="font-weight:600">${row.contributor}</div>
                                                </div>
                                              </div>
                                              <div style="margin-bottom:12px;font-size:13px;line-height:1.7;color:#172B4D">${row.note}</div>
                                              ${row.vetoNote ? `<div style="padding:10px 14px;background:#FEF9E7;border:1.5px solid #B7770D;border-radius:6px;font-size:13px;line-height:1.6">
                                                <strong style="color:#B7770D">EVIDENCE-VETO REQUIREMENT — </strong>${row.vetoNote}
                                              </div>` : ""}
                                              ${row.sectionId ? `<div style="margin-top:10px;padding:8px 12px;background:#DEEBFF;border-radius:6px;font-size:13px">
                                                <strong>Related standard:</strong> <a href="#${row.sectionId}" data-nav="${row.sectionId}" style="color:#0052CC;font-weight:700;text-decoration:underline;cursor:pointer">${SECTIONS.find(s=>s.id===row.sectionId)?.num||""} — ${SECTIONS.find(s=>s.id===row.sectionId)?.title||""} →</a>
                                              </div>` : ""}
                                            `
                                          })}>
                                          {ri === 0 && (
                                            <td rowSpan={rows.length} style={{ background: pc, color: "#fff", fontWeight: 800, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.5px", padding: "8px 8px", verticalAlign: "middle", textAlign: "center", whiteSpace: "nowrap" }}>
                                              {phase}
                                            </td>
                                          )}
                                          <td style={{ textAlign: "center", padding: "8px 6px", verticalAlign: "middle" }}>
                                            <span style={{ background: tierColor[row.tierRisk], color: "#fff", borderRadius: 4, padding: "2px 6px", fontSize: 10, fontWeight: 700, whiteSpace: "nowrap" }}>{row.tier}</span>
                                          </td>
                                          <td style={{ fontSize: 12, padding: "8px 10px", lineHeight: 1.4, verticalAlign: "middle" }}>{row.activity}</td>
                                          {roleCell(row.driver, "driver")}
                                          {roleCell(row.reviewer, "reviewer")}
                                          {roleCell(row.accountable, "accountable")}
                                          {roleCell(row.contributor, "contributor")}
                                        </tr>
                                      ));
                                    })}
                                  </tbody>
                                </table>
                              </div>
                              <div style={{ fontSize: 12, color: t.textSec, marginBottom: 18, lineHeight: 1.6, padding: "8px 12px", background: t.surfaceHover, borderRadius: 6 }}>
                                † = scoped role — see operational notes. Tap any row for the full DRAC breakdown, operational notes, and evidence-veto requirement.
                              </div>
                            </>
                          );
                        })()}

                        {/* 4.4 Decision Tiers */}
                        {section.decisionTiers && (
                          <>
                            <div id="s4-decisions" style={{ fontSize: 12, fontWeight: 700, color: t.textSec, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>4.4 — Decision Tier Framework</div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 18 }}>
                              {section.decisionTiers.map((d, i) => (
                                <div key={i} style={{ border: `1px solid ${t.border}`, borderRadius: 8, overflow: "hidden", cursor: "pointer" }}
                                  onClick={() => setSideSheet({ title: `${d.tier} Decision — ${d.risk} Risk`, content: `<div style="margin-bottom:12px"><strong style="color:#6B778C;font-size:11px;text-transform:uppercase;letter-spacing:0.5px">Description</strong><br/><div style="margin-top:4px;line-height:1.65">${d.description}</div></div><div style="margin-bottom:12px"><strong style="color:#6B778C;font-size:11px;text-transform:uppercase;letter-spacing:0.5px">Owner</strong><br/><div style="margin-top:4px;font-weight:600">${d.owner}</div></div><div style="margin-bottom:12px;padding:10px 12px;background:#FEF9E7;border:1px solid #B7770D;border-radius:6px"><strong style="color:#B7770D">Rule:</strong> ${d.rule}</div><div><strong style="color:#6B778C;font-size:11px;text-transform:uppercase;letter-spacing:0.5px">Examples</strong><br/><div style="margin-top:4px;font-size:13px;color:#6B778C">${d.examples}</div></div>` })}>
                                  <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: t.surfaceHover }}>
                                    <span style={{ background: ["#1A7A4A","#B7770D","#A93226"][i], color: "#fff", borderRadius: 6, padding: "3px 10px", fontSize: 12, fontWeight: 700 }}>{d.risk} Risk</span>
                                    <div style={{ flex: 1 }}>
                                      <div style={{ fontSize: 14, fontWeight: 700, color: t.text }}>{d.tier} Decision</div>
                                      <div style={{ fontSize: 12, color: t.textSec, marginTop: 2 }}>Owner: {d.owner}</div>
                                    </div>
                                    <span style={{ fontSize: 12, color: t.accent }}>tap for rule + examples →</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </>
                        )}

                        {/* 4.5 Fast-Track DRAC */}
                        {section.fastTrackDRAC && (
                          <>
                            <div id="s4-fasttrack" style={{ fontSize: 12, fontWeight: 700, color: t.textSec, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6 }}>4.5 — Fast-Track Publishing Lane — DRAC Applied</div>
                            <div style={{ fontSize: 13, color: t.textSec, marginBottom: 8 }}>{section.fastTrackDRAC.note} See <button onClick={() => scrollToSection("s3")} style={{ background: "none", border: "none", color: t.accent, fontWeight: 700, cursor: "pointer", padding: 0, fontSize: 13, textDecoration: "underline" }}>Section 3.3 — Publishing-Only Fast Track →</button></div>
                            <div className="table-wrapper" style={{ marginBottom: 18 }}>
                              <table className="data-table">
                                <thead><tr><th>Activity</th><th>D — Driver</th><th>R — Reviewer</th><th>A — Accountable</th><th>C — Contributor</th></tr></thead>
                                <tbody>{section.fastTrackDRAC.rows.map((r, i) => (
                                  <tr key={i}>
                                    <td style={{ fontWeight: 600 }}>{r.activity}</td>
                                    <td><span style={{ background: "#1565C0", color: "#fff", borderRadius: 4, padding: "2px 7px", fontSize: 12, fontWeight: 700 }}>{r.driver}</span></td>
                                    <td style={{ color: t.textSec }}>—</td>
                                    <td><span style={{ background: "#1E3A5F", color: "#fff", borderRadius: 4, padding: "2px 7px", fontSize: 12, fontWeight: 700 }}>{r.accountable}</span></td>
                                    <td style={{ color: t.textSec }}>—</td>
                                  </tr>
                                ))}</tbody>
                              </table>
                            </div>
                          </>
                        )}

                        {/* 4.6 Architecture Peer Review */}
                        {section.arcPeerReview && (
                          <>
                            <div id="s4-arcreview" style={{ fontSize: 12, fontWeight: 700, color: t.textSec, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6 }}>4.6 — Architecture Peer Review — Onshore / Offshore</div>
                            <div style={{ background: t.accentLight, border: `1px solid ${t.accent}`, borderRadius: 8, padding: "10px 14px", marginBottom: 8, fontSize: 13, color: t.text, lineHeight: 1.6 }}>
                              {section.arcPeerReview.note}
                            </div>
                            <div style={{ fontSize: 12, fontWeight: 700, color: t.textSec, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6 }}>Triggers — When Architecture Peer Review Applies</div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 10 }}>
                              {section.arcPeerReview.triggers.map((trig, i) => (
                                <div key={i} style={{ display: "flex", gap: 10, padding: "9px 14px", background: t.surfaceHover, borderRadius: 7, border: `1px solid ${t.border}`, fontSize: 13, color: t.text, lineHeight: 1.5 }}>
                                  <span style={{ color: t.accent, fontWeight: 800, flexShrink: 0 }}>→</span>
                                  <span>{trig}</span>
                                </div>
                              ))}
                            </div>
                            <div style={{ fontSize: 13, color: t.textSec, padding: "10px 14px", background: dark ? "#1C1400" : "#FEF9E7", borderRadius: 8, border: "1px solid #B7770D", marginBottom: 18, lineHeight: 1.6 }}>
                              <strong style={{ color: "#B7770D" }}>RULE — </strong>{section.arcPeerReview.rule}
                            </div>
                          </>
                        )}

                        {/* 4.7 Strategic Escalation Path */}
                        {section.escalationPath && (
                          <>
                            <div id="s4-escalation" style={{ fontSize: 12, fontWeight: 700, color: t.textSec, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6 }}>4.7 — Escalation Path — Strategic Decisions Only</div>
                            <div style={{ background: dark ? "#1C1C33" : "#F3E5F5", border: "1.5px solid #6C3483", borderRadius: 8, padding: "10px 14px", marginBottom: 8, fontSize: 13, color: t.text, lineHeight: 1.6 }}>
                              <strong style={{ color: "#6C3483" }}>SCOPE — </strong>This escalation path applies only to Strategic-tier decisions. Executional and Tactical decisions do not escalate — they are resolved by the Driver, Reviewer, and Accountable using the 48hr silent approval rule.
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 18 }}>
                              {section.escalationPath.map((s, i) => (
                                <div key={i} style={{ display: "flex", gap: 12, padding: "14px 16px", background: t.surfaceHover, borderRadius: 8, border: `1px solid ${t.border}` }}>
                                  <span style={{ background: ["#A93226","#7B241C"][i], color: "#fff", borderRadius: 6, padding: "4px 10px", fontSize: 12, fontWeight: 700, flexShrink: 0, alignSelf: "flex-start", whiteSpace: "nowrap" }}>{s.step}</span>
                                  <div>
                                    <div style={{ fontSize: 13, color: t.text, lineHeight: 1.65, marginBottom: 4 }}>{s.detail}</div>
                                    <div style={{ fontSize: 11, fontWeight: 700, color: t.textSec, textTransform: "uppercase", letterSpacing: "0.5px" }}>Applies to: {s.applicableTo}</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </>
                        )}

                        {/* Quick Reference */}
                        {section.quickRef && (
                          <>
                            <div style={{ fontSize: 12, fontWeight: 700, color: t.textSec, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>Section 4 — Quick Reference</div>
                            <div className="table-wrapper">
                              <table className="data-table">
                                <thead><tr><th>Topic</th><th>Standard</th></tr></thead>
                                <tbody>{section.quickRef.map((q, i) => (
                                  <tr key={i}>
                                    <td style={{ fontWeight: 700 }}>{q.topic}</td>
                                    <td style={{ fontSize: 12 }}>
                                      {q.sectionId
                                        ? <span dangerouslySetInnerHTML={{ __html: q.standard
                                            .replace("Section 3.3 — Publishing-Only Fast Track", `<a href="#s3" data-nav="s3" style="color:#0052CC;font-weight:700;text-decoration:underline;cursor:pointer">Section 3.3 — Publishing-Only Fast Track</a>`)
                                            .replace("Section 5 — BRD Standards", `<a href="#s5" data-nav="s5" style="color:#0052CC;font-weight:700;text-decoration:underline;cursor:pointer">Section 5 — BRD Standards</a>`)
                                          }} />
                                        : q.standard}
                                    </td>
                                  </tr>
                                ))}</tbody>
                              </table>
                            </div>
                          </>
                        )}
                      </>
                    )}

                    {/* S5: Full BRD Standards */}
                    {section.id === "s5" && (
                      <>
                        {/* Gate note banner */}
                        <div id="s1-problems"></div>
                        {section.gateNote && (
                          <div style={{ background: dark ? "#1B0000" : "#FFEBE6", border: "1.5px solid #DE350B", borderRadius: 8, padding: "12px 16px", marginBottom: 16, fontSize: 13, color: t.text, lineHeight: 1.6 }}>
                            <strong style={{ color: "#DE350B" }}>GATE — </strong>{section.gateNote}
                          </div>
                        )}

                        <div id="s5-gate"></div>
                        {/* 5.1 Purpose */}
                        {section.brdPurpose && (
                          <>
                            <div style={{ fontSize: 12, fontWeight: 700, color: t.textSec, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>5.1 — Three Functions of the BRD</div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 18 }}>
                              {section.brdPurpose.map((p, i) => (
                                <div key={i} style={{ display: "flex", gap: 10, padding: "10px 14px", background: t.surfaceHover, borderRadius: 8, border: `1px solid ${t.border}`, fontSize: 13, color: t.text, lineHeight: 1.5 }}>
                                  <span style={{ background: t.accent, color: "#fff", borderRadius: "50%", width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, flexShrink: 0 }}>{i+1}</span>
                                  <span>{p}</span>
                                </div>
                              ))}
                            </div>
                          </>
                        )}

                        <div id="s5-tiers"></div>
                        {/* 5.2 Tiers — color coded cards */}
                        <div style={{ fontSize: 12, fontWeight: 700, color: t.textSec, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>5.2 — BRD Tiers — Requirements Scale With Scope</div>
                        {section.keyPoints && (
                          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 18 }}>
                            {section.keyPoints.map((kp, i) => (
                              <div key={i} style={{ display: "flex", gap: 0, borderRadius: 8, border: `1px solid ${t.border}`, overflow: "hidden", cursor: "pointer" }}
                                onClick={() => setModal({ title: kp.label, content: <div style={{ fontSize: 14, lineHeight: 1.7 }}>{kp.detail}</div> })}>
                                <div style={{ background: ["#1565C0","#B7770D","#A93226"][i], padding: "12px 16px", minWidth: 90, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                  <span style={{ color: "#fff", fontWeight: 800, fontSize: 12, textAlign: "center" }}>{["TIER 1","TIER 2","TIER 3"][i]}<br/><span style={{ fontWeight: 500, fontSize: 11 }}>{["Standard","Complex","Major"][i]}</span></span>
                                </div>
                                <div style={{ padding: "12px 14px", background: t.surface, flex: 1 }}>
                                  <div style={{ fontSize: 13, fontWeight: 700, color: t.text, marginBottom: 3 }}>{kp.label}</div>
                                  <div style={{ fontSize: 12, color: t.textSec }}>Tap for full scope description →</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        <div id="s5-required"></div>
                        {/* 5.3 Required sections by tier */}
                        {section.required_sections && (
                          <>
                            <div style={{ fontSize: 12, fontWeight: 700, color: t.textSec, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6 }}>5.3 — Required BRD Sections by Tier — Tap Any Row for Definition</div>
                            <div className="table-wrapper" style={{ marginBottom: 18 }}>
                              <table className="data-table">
                                <thead><tr><th>BRD Section</th><th>Tier 1</th><th>Tier 2</th><th>Tier 3</th></tr></thead>
                                <tbody>{section.required_sections.map((r, i) => {
                                  const def = section.sectionDefinitions?.find(d => d.name.toLowerCase().includes(r.section.split(" ")[0].toLowerCase()));
                                  const badge = (val) => {
                                    if (val === "Required") return <span className="green-badge">{val}</span>;
                                    if (val === "N/A") return <span className="red-badge">{val}</span>;
                                    return <span style={{ fontSize: 11, color: t.textSec }}>{val}</span>;
                                  };
                                  return (
                                    <tr key={i} style={{ cursor: def ? "pointer" : "default" }}
                                      onClick={() => def && setSideSheet({ title: def.name, content: `<div style="font-size:14px;line-height:1.7;margin-bottom:14px">${def.definition}</div>${def.name.includes("Workfront") ? `<div style="padding:10px 12px;background:#DEEBFF;border-radius:6px;font-size:13px"><strong>See:</strong> <a href="#s7" data-nav="s7" style="color:#0052CC;font-weight:700;text-decoration:underline">Section 7 — Creative & Workfront Integration →</a></div>` : ""}${def.name.includes("Scaling") ? `<div style="padding:10px 12px;background:#DEEBFF;border-radius:6px;font-size:13px"><strong>See:</strong> <a href="#s3" data-nav="s3" style="color:#0052CC;font-weight:700;text-decoration:underline">Section 3.5 — Release Cadence →</a></div>` : ""}` })}>
                                      <td style={{ fontWeight: 600 }}>{r.section}{def && <span style={{ fontSize: 11, color: t.accent, marginLeft: 6 }}>→ definition</span>}</td>
                                      <td>{badge(r.tier1)}</td>
                                      <td>{badge(r.tier2)}</td>
                                      <td>{badge(r.tier3)}</td>
                                    </tr>
                                  );
                                })}</tbody>
                              </table>
                            </div>
                          </>
                        )}

                        <div id="s5-ownership"></div>
                        {/* 5.5 Ownership table */}
                        {section.ownership && (
                          <>
                            <div style={{ fontSize: 12, fontWeight: 700, color: t.textSec, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>5.5 — BRD Ownership — Who Contributes What</div>
                            <div className="table-wrapper" style={{ marginBottom: 18 }}>
                              <table className="data-table">
                                <thead><tr><th>BRD Section</th><th>Primary Author</th><th>Required Input From</th><th>Validated By</th></tr></thead>
                                <tbody>{section.ownership.map((o, i) => (
                                  <tr key={i}>
                                    <td style={{ fontWeight: 600 }}>{o.section}</td>
                                    <td>{o.author}</td>
                                    <td style={{ color: t.textSec }}>{o.input}</td>
                                    <td style={{ fontWeight: 600, color: t.accent }}>{o.validator}</td>
                                  </tr>
                                ))}</tbody>
                              </table>
                            </div>
                          </>
                        )}

                        <div id="s5-where"></div>
                        {/* 5.6 Where the BRD lives */}
                        {section.whereItLives && (
                          <>
                            <div style={{ background: t.accentLight, border: `1.5px solid ${t.accent}`, borderRadius: 8, padding: "10px 14px", marginBottom: 10, fontSize: 13, color: t.text, lineHeight: 1.6 }}>
                              <strong style={{ color: t.accent }}>DEFINITION — </strong>Every BRD lives as a structured Confluence page linked to its corresponding Jira Epic. A Jira Epic without a linked, accepted BRD will not be moved out of the Backlog stage.
                            </div>
                            <div style={{ fontSize: 12, fontWeight: 700, color: t.textSec, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>5.6 — Where the BRD Lives — 7-Step Workflow</div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 18 }}>
                              {section.whereItLives.map((step, i) => (
                                <div key={i} style={{ display: "flex", gap: 12, padding: "10px 14px", background: i%2===0 ? t.surface : t.surfaceHover, borderRadius: 8, border: `1px solid ${t.border}`, fontSize: 13, color: t.text, lineHeight: 1.5 }}>
                                  <span style={{ background: t.accent, color: "#fff", borderRadius: "50%", width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, flexShrink: 0 }}>{i+1}</span>
                                  <span dangerouslySetInnerHTML={{ __html: step
                                    .replace("Section 8 — Jira Configuration Guide", `<a href="#s8" data-nav="s8" style="color:#0052CC;font-weight:700;text-decoration:underline;cursor:pointer">Section 8 — Jira Configuration Guide</a>`)
                                    .replace("Section 9 — Confluence Configuration Guide", `<a href="#s9" data-nav="s9" style="color:#0052CC;font-weight:700;text-decoration:underline;cursor:pointer">Section 9 — Confluence Configuration Guide</a>`)
                                    .replace("Section 5.5", `<a href="#s5" data-nav="s5" style="color:#0052CC;font-weight:700;text-decoration:underline;cursor:pointer">Section 5.5 — BRD Ownership</a>`)
                                    .replace("Section 5.7", `<a href="#s5" data-nav="s5" style="color:#0052CC;font-weight:700;text-decoration:underline;cursor:pointer">Section 5.7 — Review SLA</a>`)
                                  }} />
                                </div>
                              ))}
                            </div>
                          </>
                        )}

                        <div id="s5-sla"></div>
                        {/* 5.7 SLA table */}
                        {section.slaTable && (
                          <>
                            <div style={{ fontSize: 12, fontWeight: 700, color: t.textSec, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>5.7 — BRD Review SLA</div>
                            <div className="table-wrapper" style={{ marginBottom: 10 }}>
                              <table className="data-table">
                                <thead><tr><th>Tier</th><th>Priority: Critical</th><th>Priority: High</th><th>Priority: Medium / Low</th></tr></thead>
                                <tbody>{section.slaTable.map((s, i) => (
                                  <tr key={i}>
                                    <td style={{ fontWeight: 700 }}>{s.tier}</td>
                                    <td style={{ color: t.danger, fontWeight: 700 }}>{s.critical}</td>
                                    <td style={{ color: t.warn, fontWeight: 600 }}>{s.high}</td>
                                    <td>{s.medium}</td>
                                  </tr>
                                ))}</tbody>
                              </table>
                            </div>
                            <div style={{ fontSize: 13, color: t.textSec, padding: "10px 14px", background: dark ? "#1C1400" : "#FEF9E7", borderRadius: 8, border: "1px solid #B7770D", marginBottom: 18, lineHeight: 1.6 }}>
                              <strong style={{ color: "#B7770D" }}>IMPORTANT — </strong>Priority level is set by the PM at Epic creation and must be justified in the Business Objective section of the BRD. Marking all tickets as Critical is not acceptable and will result in priority re-evaluation by the PM Lead.
                            </div>
                          </>
                        )}

                        <div id="s5-checklist"></div>
                        {/* 5.8 Intake Checklist */}
                        {section.intakeChecklist && (
                          <>
                            <div style={{ fontSize: 12, fontWeight: 700, color: t.textSec, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6 }}>5.8 — BRD Intake Checklist — Go / No-Go Gate</div>
                            <div style={{ fontSize: 13, color: t.textSec, marginBottom: 8 }}>An incomplete checklist is grounds for immediate rejection. This checklist is embedded in the BRD Confluence template.</div>
                            <div className="table-wrapper" style={{ marginBottom: 18 }}>
                              <table className="data-table">
                                <thead><tr><th>Checklist Item</th><th>Tier 1</th><th>Tier 2</th><th>Tier 3</th></tr></thead>
                                <tbody>{section.intakeChecklist.map((c, i) => {
                                  const badge = (val) => {
                                    if (val === "Required") return <span className="green-badge">{val}</span>;
                                    if (val === "N/A") return <span className="red-badge">{val}</span>;
                                    return <span style={{ fontSize: 11, color: t.textSec }}>{val}</span>;
                                  };
                                  return (
                                    <tr key={i}>
                                      <td style={{ fontSize: 13 }}>☐ {c.item}</td>
                                      <td>{badge(c.tier1)}</td>
                                      <td>{badge(c.tier2)}</td>
                                      <td>{badge(c.tier3)}</td>
                                    </tr>
                                  );
                                })}</tbody>
                              </table>
                            </div>
                          </>
                        )}

                        <div id="s5-rejection"></div>
                        {/* 5.9 Rejection Protocol */}
                        {section.rejectionProcess && (
                          <>
                            <div style={{ background: dark ? "#1B0000" : "#FFEBE6", border: "1.5px solid #DE350B", borderRadius: 8, padding: "10px 14px", marginBottom: 10, fontSize: 13, color: t.text, lineHeight: 1.6 }}>
                              <strong style={{ color: "#DE350B" }}>REJECTION TRIGGER — </strong>An incomplete BRD will be rejected by UX and returned to the PM with documented comments. This is not a failure — it is the process working correctly. The cost of a 2-day BRD revision is significantly lower than the cost of rework after design or development has begun.
                            </div>
                            <div style={{ fontSize: 12, fontWeight: 700, color: t.textSec, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>5.9 — Rejection Process — 4 Steps</div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 14 }}>
                              {section.rejectionProcess.map((step, i) => (
                                <div key={i} style={{ display: "flex", gap: 12, padding: "10px 14px", background: t.surfaceHover, borderRadius: 8, border: `1px solid ${t.border}`, fontSize: 13, color: t.text, lineHeight: 1.5 }}>
                                  <span style={{ background: t.danger, color: "#fff", borderRadius: "50%", width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, flexShrink: 0 }}>{i+1}</span>
                                  <span>{step}</span>
                                </div>
                              ))}
                            </div>
                            {section.discoveryMeetingTriggers && (
                              <>
                                <div style={{ fontSize: 12, fontWeight: 700, color: t.textSec, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>When to Request a Discovery Meeting</div>
                                <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 18 }}>
                                  {section.discoveryMeetingTriggers.map((trigger, i) => (
                                    <div key={i} style={{ display: "flex", gap: 10, padding: "9px 14px", background: i%2===0 ? t.surface : t.surfaceHover, borderRadius: 7, border: `1px solid ${t.border}`, fontSize: 13, color: t.text, lineHeight: 1.5 }}>
                                      <span style={{ color: t.warn, fontWeight: 800, flexShrink: 0 }}>!</span>
                                      <span>{trigger}</span>
                                    </div>
                                  ))}
                                </div>
                              </>
                            )}
                          </>
                        )}

                        {/* Quick Reference */}
                        {section.quickRef && (
                          <>
                            <div style={{ fontSize: 12, fontWeight: 700, color: t.textSec, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>Section 5 — Quick Reference</div>
                            <div className="table-wrapper">
                              <table className="data-table">
                                <thead><tr><th>Topic</th><th>Standard</th></tr></thead>
                                <tbody>{section.quickRef.map((q, i) => (
                                  <tr key={i}>
                                    <td style={{ fontWeight: 700 }}>{q.topic}</td>
                                    <td>{q.topic === "Template Location"
                                      ? <span>{q.standard} — <button onClick={() => scrollToSection("s9")} style={{ background: "none", border: "none", color: t.accent, fontWeight: 700, cursor: "pointer", padding: 0, fontSize: 13, textDecoration: "underline" }}>See Section 9 — Confluence Configuration Guide</button></span>
                                      : q.standard}
                                    </td>
                                  </tr>
                                ))}</tbody>
                              </table>
                            </div>
                          </>
                        )}
                      </>
                    )}

                    {/* S6: Full Handoff Standards */}
                    {section.id === "s6" && (
                      <>
                        <div id="s6-rule"></div>
                        {/* Rule banner */}
                        {section.ruleNote && (
                          <div style={{ background: dark ? "#1C1C33" : "#F3E5F5", border: "1.5px solid #6C3483", borderRadius: 8, padding: "12px 16px", marginBottom: 16, fontSize: 13, color: t.text, lineHeight: 1.6 }}>
                            <strong style={{ color: "#6C3483" }}>RULE — </strong>{section.ruleNote}
                          </div>
                        )}

                        <div id="s6-overview"></div>
                        {/* 6.1 Overview table */}
                        {section.handoffOverview && (
                          <>
                            <div style={{ fontSize: 12, fontWeight: 700, color: t.textSec, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>6.1 — Six Formal Handoffs Overview</div>
                            <div className="table-wrapper" style={{ marginBottom: 18 }}>
                              <table className="data-table">
                                <thead><tr><th>#</th><th>Handoff</th><th>From</th><th>To</th><th>Key Gate</th></tr></thead>
                                <tbody>{section.handoffOverview.map((h, i) => (
                                  <tr key={i}>
                                    <td style={{ fontWeight: 700, color: t.accent }}>{h.num}</td>
                                    <td style={{ fontWeight: 600 }}>{h.label}</td>
                                    <td>{h.from}</td>
                                    <td style={{ color: t.accent }}>{h.to}</td>
                                    <td style={{ fontSize: 12, color: t.textSec }}>{h.gate}</td>
                                  </tr>
                                ))}</tbody>
                              </table>
                            </div>
                          </>
                        )}

                        <div id="s6-handoffs"></div>
                        {/* 6.2–6.7 Individual handoff cards — expandable */}
                        {section.handoffs && (
                          <>
                            <div style={{ fontSize: 12, fontWeight: 700, color: t.textSec, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>6.2–6.7 — Handoff Details — Tap to Expand</div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 18 }}>
                              {section.handoffs.map((h, hi) => (
                                <div key={hi} style={{ border: `1px solid ${t.border}`, borderRadius: 10, overflow: "hidden" }}>
                                  {/* Header */}
                                  <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: t.surfaceHover, cursor: "pointer", borderLeft: `4px solid ${["#5D6D7E","#6C3483","#2E86AB","#1A7A4A","#B7770D","#A93226"][hi]}` }}
                                    onClick={() => toggleAccordion(`s6-h${hi}`)}>
                                    <span style={{ background: ["#5D6D7E","#6C3483","#2E86AB","#1A7A4A","#B7770D","#A93226"][hi], color: "#fff", borderRadius: 6, padding: "3px 10px", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{h.num}</span>
                                    <div style={{ flex: 1 }}>
                                      <div style={{ fontSize: 14, fontWeight: 700, color: t.text }}>{h.from} <span style={{ color: t.accent }}>→</span> {h.to}</div>
                                      <div style={{ fontSize: 12, color: t.textSec, marginTop: 2 }}>{h.label}</div>
                                    </div>
                                    <span style={{ color: t.textSec, transform: expandedAccordions[`s6-h${hi}`] ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}><Icon name="ChevronDown" /></span>
                                  </div>

                                  {/* Expanded body */}
                                  {expandedAccordions[`s6-h${hi}`] && (
                                    <div style={{ borderTop: `1px solid ${t.border}`, background: t.surface }}>
                                      {/* Intro */}
                                      <div style={{ padding: "12px 16px", fontSize: 13, color: t.text, lineHeight: 1.65, borderBottom: `1px solid ${t.border}` }}>{h.intro}</div>

                                      {/* 3-column grid: deliverables | rejects | done when */}
                                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 0 }}>
                                        <div style={{ padding: "12px 16px", borderRight: `1px solid ${t.border}` }}>
                                          <div style={{ fontSize: 11, fontWeight: 700, color: t.success, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>Required Deliverables</div>
                                          {h.deliverables.map((d, di) => (
                                            <div key={di} style={{ display: "flex", gap: 6, marginBottom: 5, fontSize: 12, color: t.text, lineHeight: 1.5 }}>
                                              <span style={{ color: t.success, fontWeight: 800, flexShrink: 0 }}>✓</span>
                                              <span dangerouslySetInnerHTML={{ __html: d
                                                .replace("Section 5 — BRD Standards & Requirements", `<a href="#s5" data-nav="s5" style="color:#0052CC;font-weight:700;text-decoration:underline;cursor:pointer">Section 5 — BRD Standards & Requirements</a>`)
                                                .replace("Section 8.5 — Jira Ticket Templates", `<a href="#s8" data-nav="s8" style="color:#0052CC;font-weight:700;text-decoration:underline;cursor:pointer">Section 8.5 — Jira Ticket Templates</a>`)
                                                .replace("Section 8.7 — Jira Automations", `<a href="#s8" data-nav="s8" style="color:#0052CC;font-weight:700;text-decoration:underline;cursor:pointer">Section 8.7 — Jira Automations</a>`)
                                              }} />
                                            </div>
                                          ))}
                                        </div>
                                        <div style={{ padding: "12px 16px", borderRight: `1px solid ${t.border}` }}>
                                          <div style={{ fontSize: 11, fontWeight: 700, color: t.danger, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>Rejection Triggers</div>
                                          {h.rejects.map((r, ri) => (
                                            <div key={ri} style={{ display: "flex", gap: 6, marginBottom: 5, fontSize: 12, color: t.text, lineHeight: 1.5 }}>
                                              <span style={{ color: t.danger, fontWeight: 800, flexShrink: 0 }}>✗</span>
                                              <span>{r}</span>
                                            </div>
                                          ))}
                                        </div>
                                        <div style={{ padding: "12px 16px" }}>
                                          <div style={{ fontSize: 11, fontWeight: 700, color: t.accent, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>Done When</div>
                                          {h.doneWhen.map((d, di) => (
                                            <div key={di} style={{ display: "flex", gap: 6, marginBottom: 5, fontSize: 12, color: t.text, lineHeight: 1.5 }}>
                                              <span style={{ color: t.accent, fontWeight: 800, flexShrink: 0 }}>→</span>
                                              <span>{d}</span>
                                            </div>
                                          ))}
                                        </div>
                                      </div>

                                      {/* Note */}
                                      {h.note && (
                                        <div style={{ margin: "0 16px 12px", padding: "10px 14px", background: h.noteType === "warning" ? (dark ? "#1C1400" : "#FEF9E7") : t.accentLight, border: `1px solid ${h.noteType === "warning" ? "#B7770D" : t.accent}`, borderRadius: 8, fontSize: 12, color: t.text, lineHeight: 1.6 }}
                                          dangerouslySetInnerHTML={{ __html: h.note
                                            .replace("Section 5 — BRD Standards & Requirements", `<a href="#s5" data-nav="s5" style="color:#0052CC;font-weight:700;text-decoration:underline;cursor:pointer">Section 5 — BRD Standards & Requirements</a>`)
                                            .replace("Section 7 — Creative & Workfront Integration", `<a href="#s7" data-nav="s7" style="color:#0052CC;font-weight:700;text-decoration:underline;cursor:pointer">Section 7 — Creative & Workfront Integration</a>`)
                                            .replace("Section 8.5 — Jira Configuration Guide", `<a href="#s8" data-nav="s8" style="color:#0052CC;font-weight:700;text-decoration:underline;cursor:pointer">Section 8.5 — Jira Configuration Guide</a>`)
                                            .replace("Section 8.7 — Jira Automation", `<a href="#s8" data-nav="s8" style="color:#0052CC;font-weight:700;text-decoration:underline;cursor:pointer">Section 8.7 — Jira Automations</a>`)
                                            .replace("Section 4.8 — Approval Timeboxes", `<a href="#s4" data-nav="s4" style="color:#0052CC;font-weight:700;text-decoration:underline;cursor:pointer">Section 4.8 — Approval Timeboxes</a>`)
                                            .replace("Section 3.3 — Publishing-Only Fast Track", `<a href="#s3" data-nav="s3" style="color:#0052CC;font-weight:700;text-decoration:underline;cursor:pointer">Section 3.3 — Publishing-Only Fast Track</a>`)
                                          }} />
                                      )}

                                      {/* Checklist if present */}
                                      {h.checklist && (
                                        <div style={{ margin: "0 16px 12px" }}>
                                          <div style={{ fontSize: 12, fontWeight: 700, color: t.textSec, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6 }}>{h.checklist.title}</div>
                                          <div style={{ fontSize: 12, color: t.textSec, marginBottom: 8 }}
                                            dangerouslySetInnerHTML={{ __html: h.checklist.intro
                                              .replace("Section 8.5 — Jira Configuration Guide", `<a href="#s8" data-nav="s8" style="color:#0052CC;font-weight:700;text-decoration:underline;cursor:pointer">Section 8.5 — Jira Configuration Guide</a>`)
                                            }} />
                                          <div className="table-wrapper">
                                            <table className="data-table">
                                              <thead><tr><th>Checklist Item</th><th>Required</th></tr></thead>
                                              <tbody>{h.checklist.items.map((item, ii) => (
                                                <tr key={ii}>
                                                  <td style={{ fontSize: 12 }}>☐ {item.item}</td>
                                                  <td><span className={item.req === "Required" ? "green-badge" : ""}>{item.req}</span></td>
                                                </tr>
                                              ))}</tbody>
                                            </table>
                                          </div>
                                        </div>
                                      )}

                                      {/* Sign-off format if present */}
                                      {h.signOffFormat && (
                                        <div style={{ margin: "0 16px 12px" }}>
                                          <div style={{ fontSize: 12, fontWeight: 700, color: t.textSec, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6 }}>{h.signOffFormat.title}</div>
                                          <div style={{ background: t.surfaceHover, border: `1px solid ${t.border}`, borderRadius: 8, padding: "10px 14px" }}>
                                            {h.signOffFormat.format.map((line, li) => (
                                              <div key={li} style={{ fontFamily: "monospace", fontSize: 12, color: t.text, lineHeight: 1.8 }}>{line}</div>
                                            ))}
                                          </div>
                                        </div>
                                      )}

                                      {/* Section link */}
                                      {h.sectionLink && (
                                        <div style={{ padding: "10px 16px", borderTop: `1px solid ${t.border}`, background: t.accentLight }}>
                                          <button onClick={() => scrollToSection(h.sectionLink.id)} style={{ background: "none", border: "none", color: t.accent, fontWeight: 700, cursor: "pointer", padding: 0, fontSize: 12, textDecoration: "underline" }}>
                                            See {h.sectionLink.label} →
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </>
                        )}

                        <div id="s6-rejection"></div>
                        {/* 6.8 Rejection Protocol */}
                        {section.rejectionSteps && (
                          <>
                            <div style={{ background: dark ? "#1B0000" : "#FFEBE6", border: "1.5px solid #DE350B", borderRadius: 8, padding: "10px 14px", marginBottom: 10, fontSize: 13, color: t.text, lineHeight: 1.6 }}>
                              <strong style={{ color: "#DE350B" }}>REJECTION TRIGGER — </strong>A rejected handoff must never be moved forward without addressing the rejection comments. Overriding requires explicit written approval from the PM Lead or Director of UX, documented in the Jira ticket with the reason for the override.
                            </div>
                            <div style={{ fontSize: 12, fontWeight: 700, color: t.textSec, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>6.8 — Rejection Protocol — 6 Steps</div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 18 }}>
                              {section.rejectionSteps.map((step, i) => (
                                <div key={i} style={{ display: "flex", gap: 12, padding: "10px 14px", background: i%2===0 ? t.surface : t.surfaceHover, borderRadius: 8, border: `1px solid ${t.border}`, fontSize: 13, color: t.text, lineHeight: 1.5 }}>
                                  <span style={{ background: t.danger, color: "#fff", borderRadius: "50%", width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, flexShrink: 0 }}>{i+1}</span>
                                  <span>{step}</span>
                                </div>
                              ))}
                            </div>
                          </>
                        )}

                        <div id="s6-needs"></div>
                        {/* 6.9 UX Bilateral Needs */}
                        {section.uxNeeds && (
                          <>
                            <div style={{ fontSize: 12, fontWeight: 700, color: t.textSec, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>6.9 — What UX Needs & What Each Team Needs From UX</div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 18 }}>
                              {section.uxNeeds.map((n, i) => (
                                <div key={i} style={{ border: `1px solid ${t.border}`, borderRadius: 8, overflow: "hidden" }}>
                                  <div style={{ padding: "10px 14px", background: t.surfaceHover, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}
                                    onClick={() => toggleAccordion(`s6-need-${i}`)}>
                                    <span style={{ fontSize: 13, fontWeight: 700, color: t.text }}>{n.team}</span>
                                    <span style={{ color: t.textSec, transform: expandedAccordions[`s6-need-${i}`] ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}><Icon name="ChevronDown" /></span>
                                  </div>
                                  {expandedAccordions[`s6-need-${i}`] && (
                                    <div style={{ borderTop: `1px solid ${t.border}`, background: t.surface }}>
                                      <div style={{ padding: "12px 14px", borderBottom: `1px solid ${t.border}` }}>
                                        <div style={{ fontSize: 11, fontWeight: 700, color: t.accent, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6 }}>What UX Needs From {n.team}</div>
                                        <div style={{ fontSize: 13, color: t.text, lineHeight: 1.6 }}>{n.fromTeam}</div>
                                      </div>
                                      <div style={{ padding: "12px 14px" }}>
                                        <div style={{ fontSize: 11, fontWeight: 700, color: t.success, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6 }}>What {n.team} Needs From UX</div>
                                        <div style={{ fontSize: 13, color: t.text, lineHeight: 1.6 }}>{n.fromUX}</div>
                                      </div>
                                      {n.sectionId && (
                                        <div style={{ padding: "8px 14px", background: t.accentLight, borderTop: `1px solid ${t.border}` }}>
                                          <button onClick={() => scrollToSection(n.sectionId)} style={{ background: "none", border: "none", color: t.accent, fontWeight: 700, cursor: "pointer", padding: 0, fontSize: 12, textDecoration: "underline" }}>
                                            See {n.sectionLabel} →
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </>
                        )}

                        {/* Quick Reference */}
                        {section.quickRef && (
                          <>
                            <div style={{ fontSize: 12, fontWeight: 700, color: t.textSec, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>Section 6 — Quick Reference</div>
                            <div className="table-wrapper">
                              <table className="data-table">
                                <thead><tr><th>Handoff</th><th>Gate Condition</th><th>Rejection Authority</th><th>Window</th></tr></thead>
                                <tbody>{section.quickRef.map((q, i) => (
                                  <tr key={i}>
                                    <td style={{ fontWeight: 700 }}>{q.handoff}</td>
                                    <td style={{ fontSize: 12 }}>{q.gate}</td>
                                    <td>{q.authority}</td>
                                    <td style={{ fontSize: 12 }}>
                                      {q.sectionId
                                        ? <button onClick={() => scrollToSection(q.sectionId)} style={{ background: "none", border: "none", color: t.accent, fontWeight: 700, cursor: "pointer", padding: 0, fontSize: 12, textDecoration: "underline", textAlign: "left" }}>{q.window}</button>
                                        : q.window}
                                    </td>
                                  </tr>
                                ))}</tbody>
                              </table>
                            </div>
                          </>
                        )}
                      </>
                    )}

                    {/* S7: Full Workfront Integration */}
                    {section.id === "s7" && (
                      <>
                        {/* Workfront bridge note */}
                        {section.workfrontNote && (
                          <div id="s7-when" style={{ background: dark ? "#1C1200" : "#FFF3E0", border: "1.5px solid #E65100", borderRadius: 8, padding: "12px 16px", marginBottom: 16, fontSize: 13, color: t.text, lineHeight: 1.6 }}>
                            <strong style={{ color: "#E65100" }}>WORKFRONT — </strong>{section.workfrontNote}
                          </div>
                        )}

                        {/* 7.1 Request Types */}
                        {section.requestTypes && (
                          <>
                            <div style={{ fontSize: 12, fontWeight: 700, color: t.textSec, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>7.1 — When UX Must Submit — 4 Request Types</div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 10 }}>
                              {section.requestTypes.map((r, i) => (
                                <div key={i} style={{ border: `1px solid ${t.border}`, borderRadius: 8, overflow: "hidden", cursor: "pointer" }}
                                  onClick={() => setSideSheet({ title: r.type, content: `<div style="margin-bottom:12px"><strong style="color:#6B778C;font-size:11px;text-transform:uppercase;letter-spacing:0.5px">Description</strong><br/><div style="margin-top:4px;line-height:1.7">${r.desc}</div></div><div style="margin-bottom:12px"><strong style="color:#6B778C;font-size:11px;text-transform:uppercase;letter-spacing:0.5px">Examples</strong><br/><div style="margin-top:4px">${r.examples}</div></div><div style="padding:10px 12px;background:#DEEBFF;border-radius:6px"><strong style="color:#0052CC">Submit at:</strong> ${r.submitAt}</div>` })}>
                                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", background: t.surfaceHover }}>
                                    <div>
                                      <div style={{ fontSize: 13, fontWeight: 700, color: t.text }}>{r.type}</div>
                                      <div style={{ fontSize: 12, color: t.textSec, marginTop: 2 }}>Submit at: {r.submitAt}</div>
                                    </div>
                                    <Icon name="ChevronRight" />
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div style={{ fontSize: 13, color: t.textSec, padding: "10px 14px", background: dark ? "#1C1400" : "#FEF9E7", borderRadius: 8, border: "1px solid #B7770D", marginBottom: 18, lineHeight: 1.6 }}>
                              <strong style={{ color: "#B7770D" }}>IMPORTANT — </strong>All Workfront requests must be submitted at Design Review — not mid-design. Submitting after design has started is a process violation. If a creative dependency is identified during the BRD stage, it must be noted in the BRD and submitted to Workfront as soon as the BRD is accepted. See <button onClick={() => scrollToSection("s5")} style={{ background: "none", border: "none", color: t.accent, fontWeight: 700, cursor: "pointer", padding: 0, fontSize: 13, textDecoration: "underline" }}>Section 5.3 — Required BRD Sections</button>.
                            </div>
                          </>
                        )}

                        {/* 7.2 Submission Steps */}
                        {section.submissionSteps && (
                          <>
                            <div id="s7-how" style={{ fontSize: 12, fontWeight: 700, color: t.textSec, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>7.2 — How to Submit — 10-Step Process</div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 18 }}>
                              {section.submissionSteps.map((step, i) => (
                                <div key={i} style={{ display: "flex", gap: 12, padding: "10px 14px", background: i%2===0 ? t.surface : t.surfaceHover, borderRadius: 8, border: `1px solid ${t.border}`, fontSize: 13, color: t.text, lineHeight: 1.5 }}>
                                  <span style={{ background: "#E65100", color: "#fff", borderRadius: "50%", width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, flexShrink: 0 }}>{i+1}</span>
                                  <span dangerouslySetInnerHTML={{ __html: step
                                    .replace("Section 5.3 — Required BRD Sections", `<a href="#s5" data-nav="s5" style="color:#0052CC;font-weight:700;text-decoration:underline;cursor:pointer">Section 5.3 — Required BRD Sections</a>`)
                                    .replace("Section 9.4 — Confluence Page Templates", `<a href="#s9" data-nav="s9" style="color:#0052CC;font-weight:700;text-decoration:underline;cursor:pointer">Section 9.4 — Confluence Page Templates</a>`)
                                  }} />
                                </div>
                              ))}
                            </div>
                          </>
                        )}

                        {/* 7.3 Required Fields */}
                        {section.requiredFields && (
                          <>
                            <div id="s7-what" style={{ fontSize: 12, fontWeight: 700, color: t.textSec, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>7.3 — What a Complete Request Must Include</div>
                            <div className="table-wrapper" style={{ marginBottom: 18 }}>
                              <table className="data-table">
                                <thead><tr><th>Field</th><th>Required For</th><th>Standard / Format</th></tr></thead>
                                <tbody>{section.requiredFields.map((f, i) => (
                                  <tr key={i}>
                                    <td style={{ fontWeight: 700 }}>{f.field}</td>
                                    <td><span className={f.requiredFor === "All" ? "green-badge" : ""}>{f.requiredFor}</span></td>
                                    <td style={{ fontSize: 12 }}>{f.standard}</td>
                                  </tr>
                                ))}</tbody>
                              </table>
                            </div>
                          </>
                        )}

                        {/* 7.4 Workfront Statuses */}
                        {section.workfrontStatuses && (
                          <>
                            <div id="s7-status" style={{ fontSize: 12, fontWeight: 700, color: t.textSec, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>7.4 — Workfront Status Guide — Tap Any Status</div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 18 }}>
                              {section.workfrontStatuses.map((s, i) => (
                                <div key={i} style={{ border: `1px solid ${t.border}`, borderRadius: 8, overflow: "hidden", cursor: "pointer" }}
                                  onClick={() => setModal({ title: s.status, content: <div><div style={{ marginBottom: 12 }}><strong>What it means:</strong> {s.meaning}</div><div style={{ padding: "10px 12px", background: "#E3FCEF", borderRadius: 6, color: "#006644" }}><strong>UX Action Required:</strong> {s.action}</div></div> })}>
                                  <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: t.surfaceHover }}>
                                    <span style={{ background: s.color, color: "#fff", borderRadius: 6, padding: "3px 10px", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{s.status}</span>
                                    <span style={{ fontSize: 12, color: t.textSec, flex: 1 }}>{s.meaning}</span>
                                    <Icon name="ChevronRight" />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </>
                        )}

                        {/* 7.5 Jira Field Updates */}
                        {section.jiraFieldUpdates && (
                          <>
                            <div id="s7-jira" style={{ background: dark ? "#1C1200" : "#FFF3E0", border: "1.5px solid #E65100", borderRadius: 8, padding: "10px 14px", marginBottom: 10, fontSize: 13, color: t.text, lineHeight: 1.6 }}>
                              <strong style={{ color: "#E65100" }}>WORKFRONT FIELD FORMAT — </strong>WF-[ID] | [Status] | Due: [YYYY-MM-DD] — Example: WF-4821 | In Progress | Due: 2025-09-12. Inconsistent formatting breaks Jira filters. No exceptions. See <button onClick={() => scrollToSection("s8")} style={{ background: "none", border: "none", color: t.accent, fontWeight: 700, cursor: "pointer", padding: 0, fontSize: 13, textDecoration: "underline" }}>Section 8.4 — Jira Custom Fields</button> for field setup.
                            </div>
                            <div style={{ fontSize: 12, fontWeight: 700, color: t.textSec, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>7.5 — When to Update the Jira Field</div>
                            <div className="table-wrapper" style={{ marginBottom: 10 }}>
                              <table className="data-table">
                                <thead><tr><th>Trigger</th><th>Update Field To</th><th>Also Do</th></tr></thead>
                                <tbody>{section.jiraFieldUpdates.map((u, i) => (
                                  <tr key={i}>
                                    <td style={{ fontWeight: 600 }}>{u.trigger}</td>
                                    <td style={{ fontFamily: "monospace", fontSize: 12, color: t.accent }}>{u.updateTo}</td>
                                    <td style={{ fontSize: 12 }}>{u.alsoDo}</td>
                                  </tr>
                                ))}</tbody>
                              </table>
                            </div>
                            {section.jiraBoardVisibility && (
                              <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 18 }}>
                                {section.jiraBoardVisibility.map((item, i) => (
                                  <div key={i} style={{ display: "flex", gap: 10, padding: "9px 14px", background: i%2===0 ? t.surface : t.surfaceHover, borderRadius: 7, border: `1px solid ${t.border}`, fontSize: 13, color: t.text, lineHeight: 1.5 }}>
                                    <span style={{ color: t.accent, fontWeight: 800, flexShrink: 0 }}>•</span>
                                    <span dangerouslySetInnerHTML={{ __html: item
                                      .replace("Section 8.7 — Jira Automations", `<a href="#s8" data-nav="s8" style="color:#0052CC;font-weight:700;text-decoration:underline;cursor:pointer">Section 8.7 — Jira Automations</a>`)
                                    }} />
                                  </div>
                                ))}
                              </div>
                            )}
                          </>
                        )}

                        {/* 7.6 Confluence Log */}
                        {section.confluenceLogRules && (
                          <>
                            <div id="s7-confluence" style={{ fontSize: 12, fontWeight: 700, color: t.textSec, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>7.6 — Confluence Workfront Request Log</div>
                            <div style={{ fontSize: 13, color: t.textSec, marginBottom: 8, lineHeight: 1.5 }}>
                              The Confluence Workfront Request Log is updated by the Senior Designer or Director of UX — not the Creative team. Template at <button onClick={() => scrollToSection("s9")} style={{ background: "none", border: "none", color: t.accent, fontWeight: 700, cursor: "pointer", padding: 0, fontSize: 13, textDecoration: "underline" }}>Section 9.4 — Confluence Page Templates</button>.
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 18 }}>
                              {section.confluenceLogRules.map((rule, i) => (
                                <div key={i} style={{ display: "flex", gap: 10, padding: "9px 14px", background: i%2===0 ? t.surface : t.surfaceHover, borderRadius: 7, border: `1px solid ${t.border}`, fontSize: 13, color: t.text, lineHeight: 1.5 }}>
                                  <span style={{ color: t.success, fontWeight: 800, flexShrink: 0 }}>✓</span>
                                  <span>{rule}</span>
                                </div>
                              ))}
                            </div>
                          </>
                        )}

                        {/* 7.7 SLA Table */}
                        {section.sla_table && (
                          <>
                            <div id="s7-sla" style={{ fontSize: 12, fontWeight: 700, color: t.textSec, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>7.7 — SLA Expectations — Creative Turnaround by Request Type</div>
                            <div className="table-wrapper" style={{ marginBottom: 10 }}>
                              <table className="data-table">
                                <thead><tr><th>Request Type</th><th>Critical</th><th>High</th><th>Medium</th><th>Low</th></tr></thead>
                                <tbody>{section.sla_table.map((r, i) => (
                                  <tr key={i}>
                                    <td style={{ fontWeight: 600 }}>{r.type}</td>
                                    <td style={{ color: t.danger, fontWeight: 700 }}>{r.critical}</td>
                                    <td style={{ color: t.warn, fontWeight: 600 }}>{r.high}</td>
                                    <td>{r.medium}</td>
                                    <td style={{ color: t.textSec }}>{r.low}</td>
                                  </tr>
                                ))}</tbody>
                              </table>
                            </div>
                            <div style={{ fontSize: 13, color: t.textSec, padding: "10px 14px", background: dark ? "#1C1C33" : "#F3E5F5", borderRadius: 8, border: "1px solid #6C3483", marginBottom: 18, lineHeight: 1.6 }}>
                              <strong style={{ color: "#6C3483" }}>RULE — </strong>Priority level in Workfront must match the priority level set in Jira. Inflating priority to Critical defeats the system and will result in the Sr. Manager of Marketing Operations resetting priorities in coordination with the PM Lead.
                            </div>
                          </>
                        )}

                        {/* 7.8 Escalation Path */}
                        {section.escalationPath && (
                          <>
                            <div id="s7-escalation" style={{ fontSize: 12, fontWeight: 700, color: t.textSec, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>7.8 — Escalation Path — When Creative Deliverables Are Stalling</div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 10 }}>
                              {section.escalationPath.map((s, i) => (
                                <div key={i} style={{ display: "flex", gap: 12, padding: "12px 14px", background: t.surfaceHover, borderRadius: 8, border: `1px solid ${t.border}` }}>
                                  <span style={{ background: ["#1565C0","#1A7A4A","#B7770D","#A93226"][i], color: "#fff", borderRadius: 6, padding: "3px 10px", fontSize: 11, fontWeight: 700, flexShrink: 0, alignSelf: "flex-start", whiteSpace: "nowrap" }}>{s.step}</span>
                                  <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: 11, fontWeight: 700, color: t.textSec, marginBottom: 4 }}>{s.timeframe} — Owner: {s.owner}</div>
                                    <div style={{ fontSize: 13, color: t.text, lineHeight: 1.55 }}>{s.action}</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                            {section.lateDeliveryDecision && (
                              <div style={{ background: dark ? "#1B0000" : "#FFEBE6", border: "1.5px solid #DE350B", borderRadius: 8, padding: "12px 16px", marginBottom: 18, fontSize: 13, color: t.text, lineHeight: 1.65 }}>
                                <strong style={{ color: "#DE350B" }}>ESCALATION REQUIRED — </strong>{section.lateDeliveryDecision}
                              </div>
                            )}
                          </>
                        )}

                        {/* 7.9 Responsibilities */}
                        {section.responsibilities && (
                          <>
                            <div style={{ fontSize: 12, fontWeight: 700, color: t.textSec, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>7.9 — Roles & Responsibilities Summary</div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 18 }}>
                              {section.responsibilities.map((r, i) => (
                                <div key={i} style={{ padding: "11px 14px", background: i%2===0 ? t.surface : t.surfaceHover, borderRadius: 8, border: `1px solid ${t.border}`, cursor: "pointer" }}
                                  onClick={() => setSideSheet({ title: r.role, content: `<div style="font-size:14px;line-height:1.7">${r.resp}</div>` })}>
                                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <span style={{ fontSize: 13, fontWeight: 700, color: t.text }}>{r.role}</span>
                                    <Icon name="ChevronRight" />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </>
                        )}

                        {/* Quick Reference */}
                        {section.quickRef && (
                          <>
                            <div style={{ fontSize: 12, fontWeight: 700, color: t.textSec, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>Section 7 — Quick Reference</div>
                            <div className="table-wrapper">
                              <table className="data-table">
                                <thead><tr><th>Topic</th><th>Standard</th></tr></thead>
                                <tbody>{section.quickRef.map((q, i) => (
                                  <tr key={i}>
                                    <td style={{ fontWeight: 700 }}>{q.topic}</td>
                                    <td style={{ fontSize: 12 }}>
                                      {q.sectionId
                                        ? <span>{q.standard.split("See")[0]}<button onClick={() => scrollToSection(q.sectionId)} style={{ background: "none", border: "none", color: t.accent, fontWeight: 700, cursor: "pointer", padding: 0, fontSize: 12, textDecoration: "underline" }}>Section 9.4 — Confluence Page Templates</button></span>
                                        : q.standard}
                                    </td>
                                  </tr>
                                ))}</tbody>
                              </table>
                            </div>
                          </>
                        )}
                      </>
                    )}

                    {/* S8: Full Jira Configuration */}
                    {section.id === "s8" && (
                      <>
                        {/* Admin + transition banners */}
                        {section.adminNote && (
                          <div style={{ background: dark ? "#1B0000" : "#FFEBE6", border: "1.5px solid #DE350B", borderRadius: 8, padding: "12px 16px", marginBottom: 10, fontSize: 13, color: t.text, lineHeight: 1.6 }}>
                            <strong style={{ color: "#DE350B" }}>ADMIN ACTION REQUIRED — </strong>{section.adminNote}
                          </div>
                        )}
                        {section.transitionNote && (
                          <div style={{ background: t.accentLight, border: `1px solid ${t.accent}`, borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: t.text, lineHeight: 1.6 }}>
                            <strong style={{ color: t.accent }}>TRANSITION — </strong>{section.transitionNote}
                          </div>
                        )}

                        {/* 8.1 Board Architecture */}
                        {section.boardArch && (
                          <>
                            <div id="s8-arch" style={{ fontSize: 12, fontWeight: 700, color: t.textSec, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>8.1 — Board Architecture — 4-Board Model</div>
                            <div className="table-wrapper" style={{ marginBottom: 18 }}>
                              <table className="data-table">
                                <thead><tr><th>Board Type</th><th>Style</th><th>Scope</th><th>Primary Users</th><th>Managed By</th></tr></thead>
                                <tbody>{section.boardArch.map((b, i) => (
                                  <tr key={i}>
                                    <td style={{ fontWeight: 700 }}>{b.type}</td>
                                    <td><span style={{ background: t.badge, color: t.badgeText, padding: "2px 7px", borderRadius: 4, fontSize: 11, fontWeight: 700 }}>{b.style}</span></td>
                                    <td style={{ fontSize: 12 }}>{b.scope}</td>
                                    <td style={{ fontSize: 12 }}>{b.users}</td>
                                    <td style={{ fontWeight: 600, color: t.accent }}>{b.managedBy}</td>
                                  </tr>
                                ))}</tbody>
                              </table>
                            </div>
                          </>
                        )}

                        {/* 8.2 Ticket Hierarchy */}
                        {section.ticketHierarchy && (
                          <>
                            <div id="s8-hierarchy" style={{ fontSize: 12, fontWeight: 700, color: t.textSec, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>8.2 — Ticket Hierarchy Standards</div>
                            <div className="table-wrapper" style={{ marginBottom: 10 }}>
                              <table className="data-table">
                                <thead><tr><th>Level</th><th>Definition</th><th>Lives On</th><th>Requires BRD?</th></tr></thead>
                                <tbody>{section.ticketHierarchy.map((h, i) => (
                                  <tr key={i}>
                                    <td style={{ fontWeight: 800, color: t.accent }}>{h.level}</td>
                                    <td style={{ fontSize: 12 }}>{h.definition}</td>
                                    <td style={{ fontSize: 12 }}>{h.livesOn}</td>
                                    <td style={{ fontSize: 12 }}>{h.requiresBRD.startsWith("Yes") ? <span className="green-badge">{h.requiresBRD}</span> : <span style={{ color: t.textSec }}>{h.requiresBRD}</span>}</td>
                                  </tr>
                                ))}</tbody>
                              </table>
                            </div>
                            {section.namingConventions && (
                              <>
                                <div style={{ fontSize: 12, fontWeight: 700, color: t.textSec, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6 }}>Naming Conventions</div>
                                <div className="table-wrapper" style={{ marginBottom: 18 }}>
                                  <table className="data-table">
                                    <thead><tr><th>Ticket Type</th><th>Format</th><th>Example</th></tr></thead>
                                    <tbody>{section.namingConventions.map((n, i) => (
                                      <tr key={i}>
                                        <td style={{ fontWeight: 700 }}>{n.type}</td>
                                        <td style={{ fontFamily: "monospace", fontSize: 12 }}>{n.format}</td>
                                        <td style={{ fontSize: 12, color: t.textSec }}>{n.example}</td>
                                      </tr>
                                    ))}</tbody>
                                  </table>
                                </div>
                              </>
                            )}
                          </>
                        )}

                        {/* 8.3 Workflow Stages */}
                        {section.workflowStages && (
                          <>
                            <div id="s8-workflow" style={{ fontSize: 12, fontWeight: 700, color: t.textSec, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6 }}>8.3 — Unified Workflow Stages — Same on All 4 Boards</div>
                            <div style={{ fontSize: 13, color: t.textSec, marginBottom: 8 }}>All four boards share the same 16 workflow stages. See <button onClick={() => scrollToSection("s3")} style={{ background: "none", border: "none", color: t.accent, fontWeight: 700, cursor: "pointer", padding: 0, fontSize: 13, textDecoration: "underline" }}>Section 3 — The Product Cycle</button> for full stage definitions.</div>
                            <div className="table-wrapper" style={{ marginBottom: 18 }}>
                              <table className="data-table">
                                <thead><tr><th>Stage</th><th>Jira Status Name</th><th>Category</th><th>Who Moves In</th><th>Who Moves Out</th></tr></thead>
                                <tbody>{section.workflowStages.map((s, i) => (
                                  <tr key={i}>
                                    <td style={{ fontWeight: 700 }}>{s.stage}</td>
                                    <td style={{ fontFamily: "monospace", fontSize: 12 }}>{s.statusName}</td>
                                    <td><span style={{ fontSize: 11, fontWeight: 700, color: s.category === "Done" ? t.success : s.category === "To Do" ? t.textSec : t.accent }}>{s.category}</span></td>
                                    <td style={{ fontSize: 12 }}>{s.movesIn}</td>
                                    <td style={{ fontSize: 12 }}>{s.movesOut}</td>
                                  </tr>
                                ))}</tbody>
                              </table>
                            </div>
                          </>
                        )}

                        {/* 8.4 Custom Fields */}
                        {section.customFields && (
                          <>
                            <div id="s8-fields" style={{ fontSize: 12, fontWeight: 700, color: t.textSec, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>8.4 — Custom Fields — 10 Required Across All Boards</div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 18 }}>
                              {section.customFields.map((f, i) => (
                                <div key={i} style={{ padding: "10px 14px", background: i%2===0 ? t.surface : t.surfaceHover, borderRadius: 8, border: `1px solid ${t.border}`, cursor: "pointer" }}
                                  onClick={() => setModal({ title: f.name, content: <div style={{ fontSize: 14 }}>
                                    <div style={{ marginBottom: 8 }}><strong>Field Type:</strong> {f.type}</div>
                                    <div style={{ marginBottom: 8 }}><strong>Values:</strong> <span style={{ fontFamily: "monospace", fontSize: 13 }}>{f.values}</span></div>
                                    <div style={{ marginBottom: 8 }}><strong>Required On:</strong> {f.requiredOn}</div>
                                    <div style={{ padding: "8px 12px", background: "#E3FCEF", borderRadius: 6, color: "#006644" }}><strong>Used For:</strong> {f.usedFor}</div>
                                  </div> })}>
                                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <div>
                                      <span style={{ fontSize: 13, fontWeight: 700, color: t.text }}>{f.name}</span>
                                      <span style={{ marginLeft: 8, fontSize: 11, background: t.badge, color: t.badgeText, padding: "2px 6px", borderRadius: 4 }}>{f.type}</span>
                                    </div>
                                    <span style={{ fontSize: 12, color: t.textSec }}>{f.requiredOn} — tap for details</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </>
                        )}

                        {/* 8.5 Ticket Templates */}
                        {section.ticketTemplates && (
                          <>
                            <div id="s8-templates" style={{ fontSize: 12, fontWeight: 700, color: t.textSec, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>8.5 — Ticket Templates — 6 Types — Tap to View Fields</div>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 8, marginBottom: 18 }}>
                              {section.ticketTemplates.map((tmpl, i) => (
                                <div key={i} style={{ background: t.accentLight, border: `1px solid ${dark ? t.border : "#DEEBFF"}`, borderRadius: 8, padding: "12px 14px", cursor: "pointer" }}
                                  onClick={() => setSideSheet({ title: `${tmpl.type} Template`, content: `${tmpl.note ? `<div style="margin-bottom:12px;padding:8px 12px;background:#FEF9E7;border:1px solid #B7770D;border-radius:6px;font-size:12px">${tmpl.note}</div>` : ""}<div style="font-size:11px;font-weight:700;color:#6B778C;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px">Template Fields</div><div style="font-family:monospace;font-size:12px;line-height:2;background:#F4F5F7;padding:12px;border-radius:6px">${tmpl.fields.map(f => f).join("<br/>")}</div>` })}>
                                  <div style={{ fontSize: 13, fontWeight: 700, color: t.accent }}>{tmpl.type}</div>
                                  <div style={{ fontSize: 12, color: t.textSec, marginTop: 4 }}>{tmpl.fields.length} fields → tap</div>
                                </div>
                              ))}
                            </div>
                          </>
                        )}

                        {/* 8.6 Labels + Components */}
                        {section.labels && (
                          <>
                            <div id="s8-labels" style={{ fontSize: 12, fontWeight: 700, color: t.textSec, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>8.6 — Label Taxonomy — 10 Standard Labels</div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 14 }}>
                              {section.labels.map((l, i) => (
                                <div key={i} style={{ display: "flex", gap: 12, padding: "9px 14px", background: i%2===0 ? t.surface : t.surfaceHover, borderRadius: 8, border: `1px solid ${t.border}` }}>
                                  <span style={{ fontFamily: "monospace", fontSize: 12, fontWeight: 700, color: t.accent, flexShrink: 0, minWidth: 140 }}>{l.label}</span>
                                  <span style={{ fontSize: 12, color: t.text, lineHeight: 1.5 }} dangerouslySetInnerHTML={{ __html: l.when
                                    .replace("Section 10 — Design System Governance", `<a href="#s10" data-nav="s10" style="color:#0052CC;font-weight:700;text-decoration:underline;cursor:pointer">Section 10 — Design System Governance</a>`)
                                    .replace("Section 4.6 — Executive Review Delegation", `<a href="#s4" data-nav="s4" style="color:#0052CC;font-weight:700;text-decoration:underline;cursor:pointer">Section 4.6 — Executive Review Delegation</a>`)
                                  }} />
                                </div>
                              ))}
                            </div>
                            {section.components && (
                              <>
                                <div style={{ fontSize: 12, fontWeight: 700, color: t.textSec, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>Components by Product — 14 Total</div>
                                {["eCommerce", "Customer Portal", "Back Office"].map(prod => {
                                  const items = section.components.filter(c => c.product === prod);
                                  return (
                                    <div key={prod} style={{ marginBottom: 10, border: `1px solid ${t.border}`, borderRadius: 8, overflow: "hidden" }}>
                                      <div style={{ background: { "eCommerce": "#1565C0", "Customer Portal": "#1A7A4A", "Back Office": "#6C3483" }[prod], padding: "8px 14px", fontSize: 13, fontWeight: 700, color: "#fff" }}>{prod}</div>
                                      <div style={{ padding: "8px 14px", background: t.surface }}>
                                        {items.map((c, ci) => (
                                          <div key={ci} style={{ display: "flex", gap: 8, marginBottom: 4, fontSize: 13, color: t.text }}>
                                            <span style={{ fontWeight: 700, minWidth: 180, flexShrink: 0 }}>{c.name}</span>
                                            <span style={{ color: t.textSec }}>{c.desc}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  );
                                })}
                                <div style={{ marginBottom: 18 }}></div>
                              </>
                            )}
                          </>
                        )}

                        {/* 8.7 Automations */}
                        {section.automations && (
                          <>
                            <div id="s8-automations" style={{ background: dark ? "#1B0000" : "#FFEBE6", border: "1.5px solid #DE350B", borderRadius: 8, padding: "10px 14px", marginBottom: 10, fontSize: 13, color: t.text, lineHeight: 1.6 }}>
                              <strong style={{ color: "#DE350B" }}>ADMIN ACTION REQUIRED — </strong>All existing automation rules on legacy department boards must be audited and disabled before new boards go live. The Director of Software will export the current automation list for review by the PM Lead and Director of UX.
                            </div>
                            <div style={{ fontSize: 12, fontWeight: 700, color: t.textSec, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>8.7 — 12 Required Automation Rules — Tap for Full Detail</div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 18 }}>
                              {section.automations.map((a, i) => (
                                <div key={i} style={{ padding: "10px 14px", background: i%2===0 ? t.surface : t.surfaceHover, borderRadius: 8, border: `1px solid ${t.border}`, cursor: "pointer" }}
                                  onClick={() => setModal({ title: a.rule, content: <div style={{ fontSize: 14 }}>
                                    <div style={{ marginBottom: 8 }}><strong>Trigger:</strong> {a.trigger}</div>
                                    <div style={{ marginBottom: 8 }}><strong>Condition:</strong> {a.condition}</div>
                                    <div style={{ marginBottom: 8 }}><strong>Action:</strong> {a.action}</div>
                                    <div style={{ padding: "8px 12px", background: "#E3FCEF", borderRadius: 6, color: "#006644" }}><strong>Notifies:</strong> {a.notifies}</div>
                                  </div> })}>
                                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <span style={{ fontSize: 13, fontWeight: 700, color: t.text }}>{a.rule}</span>
                                    <span style={{ fontSize: 11, color: t.textSec }}>tap for detail →</span>
                                  </div>
                                  <div style={{ fontSize: 12, color: t.textSec, marginTop: 2 }}>Trigger: {a.trigger}</div>
                                </div>
                              ))}
                            </div>
                          </>
                        )}

                        {/* 8.8 Confluence Integration */}
                        {section.confluenceIntegration && (
                          <>
                            <div id="s8-confluence" style={{ fontSize: 12, fontWeight: 700, color: t.textSec, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6 }}>8.8 — Jira ↔ Confluence Integration</div>
                            <div style={{ fontSize: 13, color: t.textSec, marginBottom: 8 }}>The Confluence BRD Link field on every Epic is mandatory. See <button onClick={() => scrollToSection("s9")} style={{ background: "none", border: "none", color: t.accent, fontWeight: 700, cursor: "pointer", padding: 0, fontSize: 13, textDecoration: "underline" }}>Section 9 — Confluence Configuration Guide</button> for page templates and space setup.</div>
                            <div className="table-wrapper" style={{ marginBottom: 18 }}>
                              <table className="data-table">
                                <thead><tr><th>Jira Event</th><th>Confluence Action</th><th>Who Does It</th><th>When</th></tr></thead>
                                <tbody>{section.confluenceIntegration.map((c, i) => (
                                  <tr key={i}>
                                    <td style={{ fontWeight: 700 }}>{c.event}</td>
                                    <td style={{ fontSize: 12 }}>{c.action}</td>
                                    <td>{c.who}</td>
                                    <td style={{ fontSize: 12 }}>{c.when}</td>
                                  </tr>
                                ))}</tbody>
                              </table>
                            </div>
                          </>
                        )}

                        {/* 8.9 Slack Integration */}
                        {section.slackChannels && (
                          <>
                            <div id="s8-slack" style={{ fontSize: 12, fontWeight: 700, color: t.textSec, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>8.9 — Jira ↔ Slack Integration — 5 Channels, 6 Events</div>
                            <div className="table-wrapper" style={{ marginBottom: 18 }}>
                              <table className="data-table">
                                <thead><tr><th>Slack Channel</th><th>Triggering Event</th><th>Message Format</th></tr></thead>
                                <tbody>{section.slackChannels.map((s, i) => (
                                  <tr key={i}>
                                    <td style={{ fontFamily: "monospace", fontSize: 12, fontWeight: 700, color: t.accent }}>{s.channel}</td>
                                    <td style={{ fontSize: 12 }}>{s.event}</td>
                                    <td style={{ fontFamily: "monospace", fontSize: 11, color: t.textSec }}>{s.format}</td>
                                  </tr>
                                ))}</tbody>
                              </table>
                            </div>
                          </>
                        )}

                        {/* 8.10 Workfront Tag */}
                        {section.workfrontTagSteps && (
                          <>
                            <div id="s8-workfront" style={{ fontSize: 12, fontWeight: 700, color: t.textSec, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>8.10 — Workfront Dependency Tag in Jira</div>
                            <div style={{ fontSize: 13, color: t.textSec, marginBottom: 8 }}>See <button onClick={() => scrollToSection("s7")} style={{ background: "none", border: "none", color: t.accent, fontWeight: 700, cursor: "pointer", padding: 0, fontSize: 13, textDecoration: "underline" }}>Section 7 — Creative & Workfront Integration</button> for full Workfront standards and SLAs.</div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 18 }}>
                              {section.workfrontTagSteps.map((step, i) => (
                                <div key={i} style={{ display: "flex", gap: 12, padding: "10px 14px", background: i%2===0 ? t.surface : t.surfaceHover, borderRadius: 8, border: `1px solid ${t.border}`, fontSize: 13, color: t.text, lineHeight: 1.5 }}>
                                  <span style={{ background: "#E65100", color: "#fff", borderRadius: "50%", width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, flexShrink: 0 }}>{i+1}</span>
                                  <span>{step}</span>
                                </div>
                              ))}
                            </div>
                          </>
                        )}

                        {/* 8.11 Migration Plan */}
                        {section.migrationPlan && (
                          <>
                            <div id="s8-migration" style={{ fontSize: 12, fontWeight: 700, color: t.textSec, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>8.11 — Migration & Transition Plan — 5 Phases, 12 Weeks</div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 10 }}>
                              {section.migrationPlan.map((p, i) => (
                                <div key={i} style={{ display: "flex", gap: 12, padding: "12px 14px", background: t.surfaceHover, borderRadius: 8, border: `1px solid ${t.border}` }}>
                                  <span style={{ background: ["#1565C0","#1A7A4A","#2E86AB","#6C3483","#B7770D"][i], color: "#fff", borderRadius: 6, padding: "3px 10px", fontSize: 12, fontWeight: 700, flexShrink: 0, alignSelf: "flex-start", whiteSpace: "nowrap" }}>{p.timeframe}</span>
                                  <div>
                                    <div style={{ fontSize: 13, fontWeight: 700, color: t.text, marginBottom: 3 }}>{p.phase}</div>
                                    <div style={{ fontSize: 12, color: t.textSec, marginBottom: 3, lineHeight: 1.5 }}>{p.actions}</div>
                                    <div style={{ fontSize: 12, color: t.accent, fontWeight: 600 }}>Owner: {p.owner}</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div style={{ fontSize: 13, color: t.textSec, padding: "10px 14px", background: t.accentLight, border: `1px solid ${t.accent}`, borderRadius: 8, marginBottom: 18, lineHeight: 1.6 }}>
                              <strong style={{ color: t.accent }}>NOTE — </strong>No legacy board is deleted during this transition — only archived. Archiving preserves the full ticket history and audit trail. Historical tickets remain accessible in read-only mode indefinitely.
                            </div>
                          </>
                        )}

                        {/* Quick Reference */}
                        {section.quickRef && (
                          <>
                            <div style={{ fontSize: 12, fontWeight: 700, color: t.textSec, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>Section 8 — Quick Reference</div>
                            <div className="table-wrapper">
                              <table className="data-table">
                                <thead><tr><th>Topic</th><th>Standard</th></tr></thead>
                                <tbody>{section.quickRef.map((q, i) => (
                                  <tr key={i}>
                                    <td style={{ fontWeight: 700 }}>{q.topic}</td>
                                    <td style={{ fontSize: 12 }}>
                                      {q.sectionId
                                        ? <span dangerouslySetInnerHTML={{ __html: q.standard.replace(
                                            q.standard.includes("Section 3") ? "Section 3 — The Product Cycle" :
                                            q.standard.includes("Section 9") ? "Section 9 — Confluence Configuration Guide" :
                                            "Section 7 — Creative & Workfront Integration",
                                            (match) => `<a href="#${q.sectionId}" data-nav="${q.sectionId}" style="color:#0052CC;font-weight:700;text-decoration:underline;cursor:pointer">${match}</a>`
                                          ) }} />
                                        : q.standard}
                                    </td>
                                  </tr>
                                ))}</tbody>
                              </table>
                            </div>
                          </>
                        )}
                      </>
                    )}

                    {/* S9: Full Confluence Configuration */}
                    {section.id === "s9" && (
                      <>
                        {/* 9.1 Guiding Principles */}
                        {section.principles && (
                          <>
                            <div id="s9-principles" style={{ fontSize: 12, fontWeight: 700, color: t.textSec, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>9.1 — Guiding Principles</div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 18 }}>
                              {section.principles.map((p, i) => (
                                <div key={i} style={{ display: "flex", gap: 12, padding: "10px 14px", background: i%2===0 ? t.surface : t.surfaceHover, borderRadius: 8, border: `1px solid ${t.border}` }}>
                                  <span style={{ fontSize: 13, fontWeight: 700, color: t.accent, flexShrink: 0, minWidth: 180 }}>{p.name}</span>
                                  <span style={{ fontSize: 13, color: t.text, lineHeight: 1.55 }}>{p.meaning}</span>
                                </div>
                              ))}
                            </div>
                          </>
                        )}

                        {/* 9.2 Space Architecture */}
                        {section.spaces && (
                          <>
                            <div style={{ background: dark ? "#1C1C33" : "#F3E5F5", border: "1.5px solid #6C3483", borderRadius: 8, padding: "10px 14px", marginBottom: 10, fontSize: 13, color: t.text, lineHeight: 1.6 }}>
                              <strong style={{ color: "#6C3483" }}>GOVERNANCE RULE — </strong>Space creation rights are governed by a guided model: any team member may propose a new space, but spaces must follow the naming standard and be approved by the Director of UX or the relevant department lead. Spaces created outside this process will be flagged for consolidation during the quarterly audit.
                            </div>
                            <div id="s9-spaces" style={{ fontSize: 12, fontWeight: 700, color: t.textSec, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>9.2 — Five Governed Confluence Spaces — Tap for Full Detail</div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 10 }}>
                              {section.spaces.map((sp, i) => (
                                <div key={i} style={{ borderRadius: 8, overflow: "hidden", border: `1px solid ${t.border}`, cursor: "pointer" }}
                                  onClick={() => setSideSheet({ title: `${sp.key} — ${sp.name}`, content: `<div style="margin-bottom:12px"><strong style="color:#6B778C;font-size:11px;text-transform:uppercase;letter-spacing:0.5px">Space Key</strong><br/><div style="margin-top:4px;font-family:monospace;font-size:14px;font-weight:700;color:#0052CC">${sp.key}</div></div><div style="margin-bottom:12px"><strong style="color:#6B778C;font-size:11px;text-transform:uppercase;letter-spacing:0.5px">Owner</strong><br/><div style="margin-top:4px">${sp.owner}</div></div><div style="margin-bottom:12px"><strong style="color:#6B778C;font-size:11px;text-transform:uppercase;letter-spacing:0.5px">Audience</strong><br/><div style="margin-top:4px">${sp.audience}</div></div><div><strong style="color:#6B778C;font-size:11px;text-transform:uppercase;letter-spacing:0.5px">Purpose</strong><br/><div style="margin-top:4px;line-height:1.65">${sp.purpose}</div></div>` })}>
                                  <div style={{ background: sp.color, padding: "10px 16px", display: "flex", alignItems: "center", gap: 12 }}>
                                    <span style={{ fontFamily: "monospace", fontSize: 12, fontWeight: 800, color: "rgba(255,255,255,0.7)", background: "rgba(0,0,0,0.2)", padding: "2px 8px", borderRadius: 4 }}>{sp.key}</span>
                                    <span style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{sp.name}</span>
                                  </div>
                                  <div style={{ padding: "8px 16px", background: t.surface, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <span style={{ fontSize: 12, color: t.textSec }}>Owner: {sp.owner}</span>
                                    <span style={{ fontSize: 12, color: t.accent }}>Tap for audience + purpose →</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                            {section.spaceSetupSteps && (
                              <>
                                <div style={{ fontSize: 12, fontWeight: 700, color: t.textSec, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6 }}>Space Setup — 7 Steps</div>
                                <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 18 }}>
                                  {section.spaceSetupSteps.map((step, i) => (
                                    <div key={i} style={{ display: "flex", gap: 12, padding: "9px 14px", background: i%2===0 ? t.surface : t.surfaceHover, borderRadius: 7, border: `1px solid ${t.border}`, fontSize: 13, color: t.text, lineHeight: 1.5 }}>
                                      <span style={{ background: t.accent, color: "#fff", borderRadius: "50%", width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, flexShrink: 0 }}>{i+1}</span>
                                      <span dangerouslySetInnerHTML={{ __html: step
                                        .replace("Section 9.4 — Page Templates", `<a href="#s9" data-nav="s9" style="color:#0052CC;font-weight:700;text-decoration:underline;cursor:pointer">Section 9.4 — Page Templates</a>`)
                                      }} />
                                    </div>
                                  ))}
                                </div>
                              </>
                            )}
                          </>
                        )}

                        {/* 9.3 Page Hierarchy */}
                        {section.pageHierarchy && (
                          <>
                            <div id="s9-hierarchy" style={{ fontSize: 12, fontWeight: 700, color: t.textSec, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>9.3 — Page Hierarchy — Full Structure per Space</div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 18 }}>
                              {section.pageHierarchy.map((h, hi) => (
                                <div key={hi} style={{ border: `1px solid ${t.border}`, borderRadius: 8, overflow: "hidden" }}>
                                  <div style={{ background: h.color, padding: "9px 14px", fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer" }}
                                    onClick={() => toggleAccordion(`s9-hier-${hi}`)}>
                                    <span>{h.space}</span>
                                    <span style={{ float: "right", opacity: 0.7 }}>{expandedAccordions[`s9-hier-${hi}`] ? "▲" : "▼"}</span>
                                  </div>
                                  {expandedAccordions[`s9-hier-${hi}`] && (
                                    <div style={{ padding: "10px 14px", background: t.surface }}>
                                      {h.tree.map((item, ti) => (
                                        <div key={ti} style={{ display: "flex", gap: 8, padding: "4px 0", borderBottom: ti < h.tree.length-1 ? `1px solid ${t.border}` : "none", fontSize: 12, color: t.text }}>
                                          <span style={{ color: t.accent, flexShrink: 0 }}>├──</span>
                                          <span>{item}</span>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </>
                        )}

                        {/* 9.4 Page Templates */}
                        {section.templates && (
                          <>
                            <div id="s9-templates" style={{ fontSize: 12, fontWeight: 700, color: t.textSec, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>9.4 — 5 Required Page Templates — Tap for Full Template</div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 18 }}>
                              {section.templates.map((tmpl, i) => (
                                <div key={i} style={{ border: `1px solid ${t.border}`, borderRadius: 8, overflow: "hidden", cursor: "pointer" }}
                                  onClick={() => setSideSheet({ title: tmpl.name, content: `<div style="margin-bottom:12px"><strong style="color:#6B778C;font-size:11px;text-transform:uppercase;letter-spacing:0.5px">Location</strong><br/><div style="margin-top:4px">${tmpl.location}</div></div><div style="margin-bottom:12px"><strong style="color:#6B778C;font-size:11px;text-transform:uppercase;letter-spacing:0.5px">Naming Format</strong><br/><div style="margin-top:4px;font-family:monospace;font-size:13px">${tmpl.namingFormat}</div></div><div style="margin-bottom:12px;padding:8px 12px;background:#FEF9E7;border:1px solid #B7770D;border-radius:6px;font-size:12px;line-height:1.6">${tmpl.note}</div><div style="margin-bottom:8px"><strong style="color:#6B778C;font-size:11px;text-transform:uppercase;letter-spacing:0.5px">Key Fields / Sections</strong></div><ul style="padding-left:16px;margin:0">${tmpl.keyFields.map(f => `<li style="margin-bottom:5px;font-size:13px">${f}</li>`).join("")}</ul>${tmpl.sectionId ? `<div style="margin-top:14px;padding:10px 12px;background:#DEEBFF;border-radius:6px;font-size:13px"><strong>See:</strong> <a href="#${tmpl.sectionId}" data-nav="${tmpl.sectionId}" style="color:#0052CC;font-weight:700;text-decoration:underline;cursor:pointer">${tmpl.sectionLabel} →</a></div>` : ""}` })}>
                                  <div style={{ padding: "11px 16px", background: t.surfaceHover, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <div>
                                      <div style={{ fontSize: 13, fontWeight: 700, color: t.text }}>{tmpl.name}</div>
                                      <div style={{ fontSize: 12, color: t.textSec, marginTop: 2, fontFamily: "monospace" }}>{tmpl.namingFormat}</div>
                                    </div>
                                    <Icon name="ChevronRight" />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </>
                        )}

                        {/* 9.5 Naming Conventions + Labels */}
                        {section.namingConventions && (
                          <>
                            <div id="s9-naming" style={{ fontSize: 12, fontWeight: 700, color: t.textSec, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>9.5 — Naming & Tagging Conventions</div>
                            <div className="table-wrapper" style={{ marginBottom: 14 }}>
                              <table className="data-table">
                                <thead><tr><th>Page Type</th><th>Naming Format</th><th>Example</th></tr></thead>
                                <tbody>{section.namingConventions.map((n, i) => (
                                  <tr key={i}>
                                    <td style={{ fontWeight: 700 }}>{n.pageType}</td>
                                    <td style={{ fontFamily: "monospace", fontSize: 12 }}>{n.format}</td>
                                    <td style={{ fontSize: 12, color: t.textSec }}>{n.example}</td>
                                  </tr>
                                ))}</tbody>
                              </table>
                            </div>
                            {section.pageLabels && (
                              <>
                                <div style={{ fontSize: 12, fontWeight: 700, color: t.textSec, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6 }}>Page Labels — Mirrors Jira Label Taxonomy</div>
                                <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 18 }}>
                                  {section.pageLabels.map((l, i) => (
                                    <div key={i} style={{ display: "flex", gap: 14, padding: "8px 14px", background: i%2===0 ? t.surface : t.surfaceHover, borderRadius: 7, border: `1px solid ${t.border}` }}>
                                      <span style={{ fontFamily: "monospace", fontSize: 12, fontWeight: 700, color: t.accent, flexShrink: 0, minWidth: 120 }}>{l.label}</span>
                                      <span style={{ fontSize: 12, color: t.text }}>{l.appliedTo}</span>
                                    </div>
                                  ))}
                                </div>
                              </>
                            )}
                          </>
                        )}

                        {/* 9.6 Governance */}
                        {section.spaceOwnership && (
                          <>
                            <div id="s9-governance" style={{ fontSize: 12, fontWeight: 700, color: t.textSec, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>9.6 — Governance — Space Ownership & Review Cadence</div>
                            <div className="table-wrapper" style={{ marginBottom: 14 }}>
                              <table className="data-table">
                                <thead><tr><th>Space</th><th>Owner</th><th>Backup Owner</th><th>Review Cadence</th></tr></thead>
                                <tbody>{section.spaceOwnership.map((s, i) => (
                                  <tr key={i}>
                                    <td style={{ fontWeight: 700 }}>{s.space}</td>
                                    <td style={{ color: t.accent, fontWeight: 600 }}>{s.owner}</td>
                                    <td>{s.backup}</td>
                                    <td style={{ fontSize: 12 }}>{s.cadence}</td>
                                  </tr>
                                ))}</tbody>
                              </table>
                            </div>
                            {section.pageReviewRules && (
                              <>
                                <div style={{ fontSize: 12, fontWeight: 700, color: t.textSec, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6 }}>Page Review Rules</div>
                                <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 14 }}>
                                  {section.pageReviewRules.map((rule, i) => (
                                    <div key={i} style={{ display: "flex", gap: 10, padding: "9px 14px", background: i%2===0 ? t.surface : t.surfaceHover, borderRadius: 7, border: `1px solid ${t.border}`, fontSize: 13, color: t.text, lineHeight: 1.5 }}>
                                      <span style={{ color: t.warn, fontWeight: 800, flexShrink: 0 }}>•</span>
                                      <span>{rule}</span>
                                    </div>
                                  ))}
                                </div>
                              </>
                            )}
                            {section.archivalProtocol && (
                              <>
                                <div style={{ fontSize: 12, fontWeight: 700, color: t.textSec, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6 }}>Archival Protocol — 5 Steps</div>
                                <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 18 }}>
                                  {section.archivalProtocol.map((step, i) => (
                                    <div key={i} style={{ display: "flex", gap: 12, padding: "9px 14px", background: t.surfaceHover, borderRadius: 7, border: `1px solid ${t.border}`, fontSize: 13, color: t.text, lineHeight: 1.5 }}>
                                      <span style={{ background: t.textSec, color: "#fff", borderRadius: "50%", width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, flexShrink: 0 }}>{i+1}</span>
                                      <span>{step}</span>
                                    </div>
                                  ))}
                                </div>
                              </>
                            )}
                          </>
                        )}

                        {/* 9.7 Jira Linking */}
                        {section.jiraLinking && (
                          <>
                            <div id="s9-linking" style={{ background: t.accentLight, border: `1.5px solid ${t.accent}`, borderRadius: 8, padding: "10px 14px", marginBottom: 10, fontSize: 13, color: t.text, lineHeight: 1.6 }}>
                              <strong style={{ color: t.accent }}>KEY TOOL — </strong>The Jira Issue macro in Confluence automatically reflects the current status of the linked Jira ticket. A BRD page always shows whether the Epic is in Backlog, Design, Dev, QA, or Released — without the PM manually updating the Confluence page. Use this macro on every BRD and Kickoff page.
                            </div>
                            <div style={{ fontSize: 12, fontWeight: 700, color: t.textSec, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>9.7 — Confluence ↔ Jira Linking Standards</div>
                            <div style={{ fontSize: 13, color: t.textSec, marginBottom: 8 }}>These supplement the linking standards in <button onClick={() => scrollToSection("s8")} style={{ background: "none", border: "none", color: t.accent, fontWeight: 700, cursor: "pointer", padding: 0, fontSize: 13, textDecoration: "underline" }}>Section 8.8 — Jira ↔ Confluence Integration</button>.</div>
                            <div className="table-wrapper" style={{ marginBottom: 18 }}>
                              <table className="data-table">
                                <thead><tr><th>Direction</th><th>Link Type</th><th>Standard</th><th>When</th></tr></thead>
                                <tbody>{section.jiraLinking.map((l, i) => (
                                  <tr key={i}>
                                    <td style={{ fontWeight: 700, fontSize: 12 }}>{l.direction}</td>
                                    <td style={{ fontSize: 12 }}>{l.linkType}</td>
                                    <td style={{ fontSize: 12 }}>{l.standard}</td>
                                    <td style={{ fontSize: 12 }}>{l.when}</td>
                                  </tr>
                                ))}</tbody>
                              </table>
                            </div>
                          </>
                        )}

                        {/* Quick Reference */}
                        {section.quickRef && (
                          <>
                            <div style={{ fontSize: 12, fontWeight: 700, color: t.textSec, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>Section 9 — Quick Reference</div>
                            <div className="table-wrapper">
                              <table className="data-table">
                                <thead><tr><th>Topic</th><th>Standard</th></tr></thead>
                                <tbody>{section.quickRef.map((q, i) => (
                                  <tr key={i}>
                                    <td style={{ fontWeight: 700 }}>{q.topic}</td>
                                    <td style={{ fontSize: 12 }}>
                                      {q.sectionId
                                        ? <span dangerouslySetInnerHTML={{ __html: q.standard.replace(
                                            q.sectionId === "s8" ? (q.standard.includes("8.6") ? "Section 8.6 — Labels" : "Section 8.8 — Jira ↔ Confluence Integration") : "",
                                            (m) => m ? `<a href="#${q.sectionId}" data-nav="${q.sectionId}" style="color:#0052CC;font-weight:700;text-decoration:underline;cursor:pointer">${m}</a>` : ""
                                          ) }} />
                                        : q.standard}
                                    </td>
                                  </tr>
                                ))}</tbody>
                              </table>
                            </div>
                          </>
                        )}
                      </>
                    )}

                    {/* S10: Full Design System Governance */}
                    {section.id === "s10" && (
                      <>
                        {/* Approval required banner */}
                        {section.approvalNote && (
                          <div style={{ background: dark ? "#1B0000" : "#FFEBE6", border: "1.5px solid #DE350B", borderRadius: 8, padding: "12px 16px", marginBottom: 16, fontSize: 13, color: t.text, lineHeight: 1.6 }}>
                            <strong style={{ color: "#DE350B" }}>APPROVAL REQUIRED — </strong>{section.approvalNote}
                          </div>
                        )}

                        {/* 10.1 Current State */}
                        {section.currentState && (
                          <>
                            <div id="s10-state" style={{ fontSize: 12, fontWeight: 700, color: t.textSec, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>10.1 — Current State of the Design System</div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 18 }}>
                              {section.currentState.map((s, i) => (
                                <div key={i} style={{ border: `1px solid ${t.border}`, borderRadius: 8, overflow: "hidden", cursor: "pointer" }}
                                  onClick={() => setModal({ title: s.area, content: <div style={{ fontSize: 14 }}>
                                    <div style={{ marginBottom: 12, padding: "10px 12px", background: dark ? "#1B0000" : "#FFEBE6", borderRadius: 6, border: "1px solid #DE350B" }}>
                                      <div style={{ fontSize: 11, fontWeight: 700, color: t.danger, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 4 }}>Current State</div>
                                      <div style={{ lineHeight: 1.65 }}>{s.current}</div>
                                    </div>
                                    <div style={{ padding: "10px 12px", background: "#E3FCEF", borderRadius: 6, border: "1px solid #00875A" }}>
                                      <div style={{ fontSize: 11, fontWeight: 700, color: "#006644", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 4 }}>Target State</div>
                                      <div style={{ lineHeight: 1.65 }}>{s.target}</div>
                                    </div>
                                  </div> })}>
                                  <div style={{ display: "flex", alignItems: "center", padding: "10px 14px", background: t.surfaceHover, gap: 12 }}>
                                    <span style={{ fontSize: 13, fontWeight: 700, color: t.text, flex: 1 }}>{s.area}</span>
                                    <span style={{ fontSize: 11, color: t.textSec }}>tap to see current → target</span>
                                    <Icon name="ChevronRight" />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </>
                        )}

                        {/* 10.2 Approval Gate */}
                        {section.approval_gates && (
                          <>
                            <div style={{ background: dark ? "#1C1C33" : "#F3E5F5", border: "1.5px solid #6C3483", borderRadius: 8, padding: "10px 14px", marginBottom: 10, fontSize: 13, color: t.text, lineHeight: 1.6 }}>
                              <strong style={{ color: "#6C3483" }}>GOVERNANCE RULE — </strong>The absence of formal Creative Director sign-off does not mean UX can make permanent creative decisions independently. A new color, a new type style, a new layout pattern — all require approval before they become standard.
                            </div>
                            <div id="s10-approval" style={{ fontSize: 12, fontWeight: 700, color: t.textSec, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>10.2 — Creative Direction Approval Gate</div>
                            <div className="table-wrapper" style={{ marginBottom: 18 }}>
                              <table className="data-table">
                                <thead><tr><th>Design Decision Type</th><th>Can UX Decide?</th><th>Who Must Approve</th><th>Urgency Override?</th></tr></thead>
                                <tbody>{section.approval_gates.map((g, i) => (
                                  <tr key={i}>
                                    <td style={{ fontWeight: 600 }}>{g.decision}</td>
                                    <td style={{ fontWeight: 700, color: g.canUX === "Yes" ? t.success : g.canUX === "No" ? t.danger : t.warn }}>{g.canUX}</td>
                                    <td style={{ fontSize: 12 }}>{g.approver}</td>
                                    <td style={{ fontSize: 12, color: g.urgencyOverride === "No" ? t.danger : t.textSec }}>{g.urgencyOverride}</td>
                                  </tr>
                                ))}</tbody>
                              </table>
                            </div>
                          </>
                        )}

                        {/* 10.3 Component Library */}
                        {section.componentUsageRules && (
                          <>
                            <div id="s10-library" style={{ background: t.accentLight, border: `1.5px solid ${t.accent}`, borderRadius: 8, padding: "10px 14px", marginBottom: 10, fontSize: 13, color: t.text, lineHeight: 1.6 }}>
                              <strong style={{ color: t.accent }}>STANDARD — </strong>Always use the component library first. Before creating anything new, search the library. If an appropriate component exists, use it — even if it requires minor adaptation through approved props and variants.
                            </div>
                            <div style={{ fontSize: 12, fontWeight: 700, color: t.textSec, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>10.3.1 — Using Existing Components</div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 14 }}>
                              {section.componentUsageRules.map((rule, i) => (
                                <div key={i} style={{ display: "flex", gap: 10, padding: "9px 14px", background: i%2===0 ? t.surface : t.surfaceHover, borderRadius: 7, border: `1px solid ${t.border}`, fontSize: 13, color: t.text, lineHeight: 1.5 }}>
                                  <span style={{ color: t.success, fontWeight: 800, flexShrink: 0 }}>✓</span>
                                  <span>{rule}</span>
                                </div>
                              ))}
                            </div>
                            {section.detachingRules && (
                              <>
                                <div style={{ fontSize: 12, fontWeight: 700, color: t.textSec, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>10.3.2 — Detaching Components</div>
                                <div className="table-wrapper" style={{ marginBottom: 14 }}>
                                  <table className="data-table">
                                    <thead><tr><th>Condition</th><th>Permitted?</th><th>Required Action</th></tr></thead>
                                    <tbody>{section.detachingRules.map((d, i) => (
                                      <tr key={i}>
                                        <td style={{ fontSize: 13 }}>{d.condition}</td>
                                        <td style={{ fontWeight: 700, color: d.permitted.startsWith("Yes") ? t.success : t.danger, whiteSpace: "nowrap" }}>{d.permitted}</td>
                                        <td style={{ fontSize: 12 }}>{d.action}</td>
                                      </tr>
                                    ))}</tbody>
                                  </table>
                                </div>
                              </>
                            )}
                            {section.newComponentSteps && (
                              <>
                                <div style={{ fontSize: 12, fontWeight: 700, color: t.textSec, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>10.3.3 — Requesting a New Component — 9 Steps</div>
                                <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 18 }}>
                                  {section.newComponentSteps.map((step, i) => (
                                    <div key={i} style={{ display: "flex", gap: 12, padding: "10px 14px", background: i%2===0 ? t.surface : t.surfaceHover, borderRadius: 8, border: `1px solid ${t.border}`, fontSize: 13, color: t.text, lineHeight: 1.5 }}>
                                      <span style={{ background: t.accent, color: "#fff", borderRadius: "50%", width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, flexShrink: 0 }}>{i+1}</span>
                                      <span dangerouslySetInnerHTML={{ __html: step
                                        .replace("Section 8.6 — Label Taxonomy", `<a href="#s8" data-nav="s8" style="color:#0052CC;font-weight:700;text-decoration:underline;cursor:pointer">Section 8.6 — Label Taxonomy</a>`)
                                        .replace("Section 9.3 — Page Hierarchy", `<a href="#s9" data-nav="s9" style="color:#0052CC;font-weight:700;text-decoration:underline;cursor:pointer">Section 9.3 — Page Hierarchy</a>`)
                                      }} />
                                    </div>
                                  ))}
                                </div>
                              </>
                            )}
                          </>
                        )}

                        {/* 10.4 Token Categories */}
                        {section.tokenCategories && (
                          <>
                            <div style={{ background: dark ? "#1B0000" : "#FFEBE6", border: "1.5px solid #DE350B", borderRadius: 8, padding: "10px 14px", marginBottom: 10, fontSize: 13, color: t.text, lineHeight: 1.6 }}>
                              <strong style={{ color: "#DE350B" }}>APPROVAL REQUIRED — </strong>No new token values may be introduced without Creative Director approval. Tokens that exist with loose approval are interim standards — may be used for design but must be ratified before connecting to production code.
                            </div>
                            <div id="s10-tokens" style={{ fontSize: 12, fontWeight: 700, color: t.textSec, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>10.4 — Design Token Categories & Governance</div>
                            <div className="table-wrapper" style={{ marginBottom: 10 }}>
                              <table className="data-table">
                                <thead><tr><th>Token Category</th><th>Current Status</th><th>Governance Rule</th><th>Ratification Owner</th></tr></thead>
                                <tbody>{section.tokenCategories.map((tk, i) => (
                                  <tr key={i}>
                                    <td style={{ fontWeight: 700 }}>{tk.category}</td>
                                    <td style={{ fontSize: 12, color: t.textSec }}>{tk.currentStatus}</td>
                                    <td style={{ fontSize: 12 }}>{tk.rule}</td>
                                    <td style={{ fontWeight: 600, color: t.accent, fontSize: 12 }}>{tk.owner}</td>
                                  </tr>
                                ))}</tbody>
                              </table>
                            </div>
                            <div style={{ background: t.surfaceHover, border: `1px solid ${t.border}`, borderRadius: 8, padding: "12px 14px", marginBottom: 18 }}>
                              <div style={{ fontSize: 12, fontWeight: 700, color: t.textSec, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6 }}>Token Naming Convention</div>
                              <div style={{ fontFamily: "monospace", fontSize: 14, color: t.accent, marginBottom: 6 }}>Format: [category]/[variant]/[state]</div>
                              <div style={{ fontSize: 12, color: t.textSec, lineHeight: 1.8 }}>
                                color/brand/primary &nbsp;·&nbsp; color/semantic/error &nbsp;·&nbsp; color/neutral/subtle<br/>
                                spacing/base/md &nbsp;·&nbsp; typography/size/body-lg &nbsp;·&nbsp; border/radius/md
                              </div>
                            </div>
                          </>
                        )}

                        {/* 10.5 Figma File Structure */}
                        {section.figmaFileNaming && (
                          <>
                            <div id="s10-figma" style={{ fontSize: 12, fontWeight: 700, color: t.textSec, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>10.5 — Figma File Structure & Version Control</div>
                            <div className="table-wrapper" style={{ marginBottom: 10 }}>
                              <table className="data-table">
                                <thead><tr><th>File Type</th><th>Naming Format</th><th>Example</th></tr></thead>
                                <tbody>{section.figmaFileNaming.map((f, i) => (
                                  <tr key={i}>
                                    <td style={{ fontWeight: 700 }}>{f.fileType}</td>
                                    <td style={{ fontFamily: "monospace", fontSize: 12 }}>{f.format}</td>
                                    <td style={{ fontSize: 12, color: t.textSec }}>{f.example}</td>
                                  </tr>
                                ))}</tbody>
                              </table>
                            </div>
                            {section.figmaFileRules && (
                              <>
                                <div style={{ fontSize: 12, fontWeight: 700, color: t.textSec, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6 }}>File Structure Standards</div>
                                <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 14 }}>
                                  {section.figmaFileRules.map((rule, i) => (
                                    <div key={i} style={{ display: "flex", gap: 10, padding: "9px 14px", background: i%2===0 ? t.surface : t.surfaceHover, borderRadius: 7, border: `1px solid ${t.border}`, fontSize: 13, color: t.text, lineHeight: 1.5 }}>
                                      <span style={{ color: t.accent, fontWeight: 800, flexShrink: 0 }}>•</span>
                                      <span>{rule}</span>
                                    </div>
                                  ))}
                                </div>
                              </>
                            )}
                            {section.versionControlRules && (
                              <>
                                <div style={{ fontSize: 12, fontWeight: 700, color: t.textSec, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6 }}>Version Control Rules</div>
                                <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 18 }}>
                                  {section.versionControlRules.map((rule, i) => (
                                    <div key={i} style={{ display: "flex", gap: 10, padding: "9px 14px", background: i%2===0 ? t.surface : t.surfaceHover, borderRadius: 7, border: `1px solid ${t.border}`, fontSize: 13, color: t.text, lineHeight: 1.5 }}>
                                      <span style={{ color: t.success, fontWeight: 800, flexShrink: 0 }}>✓</span>
                                      <span>{rule}</span>
                                    </div>
                                  ))}
                                </div>
                              </>
                            )}
                          </>
                        )}

                        {/* 10.6 Design System Roadmap */}
                        {section.designSystemRoadmap && (
                          <>
                            <div id="s10-roadmap" style={{ fontSize: 12, fontWeight: 700, color: t.textSec, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>10.6 — Design System Roadmap — Path to Formal Ratification</div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 18 }}>
                              {section.designSystemRoadmap.map((m, i) => (
                                <div key={i} style={{ display: "flex", gap: 12, padding: "12px 14px", background: t.surfaceHover, borderRadius: 8, border: `1px solid ${t.border}`, cursor: "pointer" }}
                                  onClick={() => setModal({ title: m.milestone, content: <div style={{ fontSize: 14 }}>
                                    <div style={{ marginBottom: 10, lineHeight: 1.7 }}>{m.description}</div>
                                    <div style={{ marginBottom: 8 }}><strong>Owner:</strong> {m.owner}</div>
                                    <div style={{ marginBottom: 8 }}><strong>Depends on:</strong> {m.dependency}</div>
                                    <div style={{ padding: "8px 12px", background: "#E3FCEF", borderRadius: 6, color: "#006644", fontWeight: 700 }}>Target: {m.target}</div>
                                  </div> })}>
                                  <span style={{ background: ["#5D6D7E","#2E86AB","#1565C0","#1A7A4A","#B7770D","#A93226","#145A32"][i], color: "#fff", borderRadius: 6, padding: "3px 10px", fontSize: 12, fontWeight: 700, flexShrink: 0, alignSelf: "flex-start", whiteSpace: "nowrap" }}>{m.target}</span>
                                  <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: 13, fontWeight: 700, color: t.text, marginBottom: 2 }}>{m.milestone}</div>
                                    <div style={{ fontSize: 12, color: t.textSec }}>Owner: {m.owner} — tap for full detail</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </>
                        )}

                        {/* 10.7 Jira + Confluence Connections */}
                        {section.jiraConfluenceConnections && (
                          <>
                            <div id="s10-links" style={{ fontSize: 12, fontWeight: 700, color: t.textSec, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>10.7 — Design System ↔ Jira ↔ Confluence</div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 18 }}>
                              {section.jiraConfluenceConnections.map((c, i) => (
                                <div key={i} style={{ display: "flex", gap: 12, padding: "10px 14px", background: i%2===0 ? t.surface : t.surfaceHover, borderRadius: 8, border: `1px solid ${t.border}` }}>
                                  <span style={{ fontSize: 12, fontWeight: 700, color: t.accent, flexShrink: 0, minWidth: 200 }}>{c.connection}</span>
                                  <span style={{ fontSize: 12, color: t.text, lineHeight: 1.5 }} dangerouslySetInnerHTML={{ __html: c.standard
                                    .replace("Section 8.6 — Label Taxonomy", `<a href="#s8" data-nav="s8" style="color:#0052CC;font-weight:700;text-decoration:underline;cursor:pointer">Section 8.6 — Label Taxonomy</a>`)
                                    .replace("Section 9.3 — Page Hierarchy", `<a href="#s9" data-nav="s9" style="color:#0052CC;font-weight:700;text-decoration:underline;cursor:pointer">Section 9.3 — Page Hierarchy</a>`)
                                    .replace("Section 9.2 — Space Architecture", `<a href="#s9" data-nav="s9" style="color:#0052CC;font-weight:700;text-decoration:underline;cursor:pointer">Section 9.2 — Space Architecture</a>`)
                                  }} />
                                </div>
                              ))}
                            </div>
                          </>
                        )}

                        {/* Quick Reference */}
                        {section.quickRef && (
                          <>
                            <div style={{ fontSize: 12, fontWeight: 700, color: t.textSec, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>Section 10 — Quick Reference</div>
                            <div className="table-wrapper">
                              <table className="data-table">
                                <thead><tr><th>Topic</th><th>Standard</th></tr></thead>
                                <tbody>{section.quickRef.map((q, i) => (
                                  <tr key={i}>
                                    <td style={{ fontWeight: 700 }}>{q.topic}</td>
                                    <td style={{ fontSize: 12 }}>
                                      {q.sectionId
                                        ? <span dangerouslySetInnerHTML={{ __html: q.standard
                                            .replace("Section 8.6 — Label Taxonomy", `<a href="#s8" data-nav="s8" style="color:#0052CC;font-weight:700;text-decoration:underline;cursor:pointer">Section 8.6 — Label Taxonomy</a>`)
                                            .replace("Section 9.2 — Space Architecture", `<a href="#s9" data-nav="s9" style="color:#0052CC;font-weight:700;text-decoration:underline;cursor:pointer">Section 9.2 — Space Architecture</a>`)
                                          }} />
                                        : q.standard}
                                    </td>
                                  </tr>
                                ))}</tbody>
                              </table>
                            </div>
                          </>
                        )}
                      </>
                    )}

                    {/* S11: Full Roadmap */}
                    {section.id === "s11" && (
                      <>
                        {/* Executive note */}
                        {section.executiveNote && (
                          <div style={{ background: t.accentLight, border: `1.5px solid ${t.accent}`, borderRadius: 8, padding: "12px 16px", marginBottom: 16, fontSize: 13, color: t.text, lineHeight: 1.6 }}>
                            <strong style={{ color: t.accent }}>EXECUTIVE NOTE — </strong>{section.executiveNote}
                          </div>
                        )}

                        {/* 11.1 Cost of current state */}
                        {section.costOfCurrentState && (
                          <>
                            <div id="s11-cost" style={{ fontSize: 12, fontWeight: 700, color: t.textSec, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>11.1 — The Cost of the Current State</div>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 8, marginBottom: 10 }}>
                              {section.costOfCurrentState.map((c, i) => (
                                <div key={i} style={{ borderRadius: 8, overflow: "hidden", border: `1px solid ${t.border}`, cursor: "pointer" }}
                                  onClick={() => setModal({ title: c.label, content: <div style={{ fontSize: 14, lineHeight: 1.7 }}>{c.detail}</div> })}>
                                  <div style={{ background: ["#A93226","#B7770D","#1565C0","#1A7A4A"][i], padding: "12px 14px", textAlign: "center" }}>
                                    <div style={{ fontSize: 28, fontWeight: 900, color: "#fff" }}>{c.stat}</div>
                                  </div>
                                  <div style={{ padding: "8px 12px", background: t.surface }}>
                                    <div style={{ fontSize: 12, fontWeight: 700, color: t.text }}>{c.label}</div>
                                    <div style={{ fontSize: 11, color: t.textSec, marginTop: 2 }}>Tap for detail</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div style={{ fontSize: 13, color: t.textSec, padding: "10px 14px", background: t.surfaceHover, borderRadius: 8, border: `1px solid ${t.border}`, marginBottom: 18, lineHeight: 1.6 }}>
                              <strong style={{ color: t.warn }}>ROI SIGNAL — </strong>These are organizational friction costs. A team spending 30% of its capacity on rework has 30% less capacity for shipping. Process investment is capacity investment.
                            </div>
                          </>
                        )}

                        {/* Phases 1–3 */}
                        {[section.phase1, section.phase2, section.phase3].filter(Boolean).map((phase, pi) => (
                          <div key={pi} style={{ marginBottom: 16 }}>
                            <div id={["s11-30","s11-60","s11-90"][pi]} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                              <div style={{ background: phase.color, color: "#fff", borderRadius: 6, padding: "4px 12px", fontSize: 13, fontWeight: 700 }}>{phase.title}</div>
                              <div style={{ fontSize: 12, color: t.textSec, fontWeight: 600 }}>{phase.subtitle}</div>
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 8, marginBottom: 8 }}>
                              {phase.columns.map((col, ci) => (
                                <div key={ci} style={{ background: t.surfaceHover, borderRadius: 8, border: `1px solid ${t.border}`, overflow: "hidden" }}>
                                  <div style={{ padding: "7px 12px", background: phase.color, fontSize: 11, fontWeight: 700, color: "#fff", textTransform: "uppercase", letterSpacing: "0.5px" }}>{col.heading}</div>
                                  <div style={{ padding: "8px 12px" }}>
                                    {col.items.map((item, ii) => (
                                      <div key={ii} style={{ display: "flex", gap: 6, marginBottom: 5, fontSize: 12, color: t.text, lineHeight: 1.5 }}>
                                        <span style={{ color: phase.color, fontWeight: 800, flexShrink: 0 }}>•</span>
                                        <span>{item}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div style={{ background: dark ? "#1C1400" : "#FEF9E7", border: "1px solid #B7770D", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: t.text, lineHeight: 1.6 }}>
                              <strong style={{ color: "#B7770D" }}>QUICK WIN — </strong>{phase.quickWin}
                            </div>
                          </div>
                        ))}

                        {/* 11.5 Ongoing Operations */}
                        {section.ongoingOps && (
                          <>
                            <div id="s11-ongoing" style={{ fontSize: 12, fontWeight: 700, color: t.textSec, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>11.5 — Ongoing Operations — Sustaining the Gains</div>
                            <div className="table-wrapper" style={{ marginBottom: 18 }}>
                              <table className="data-table">
                                <thead><tr><th>Activity</th><th>Cadence</th><th>Owner</th><th>Output + Reference</th></tr></thead>
                                <tbody>{section.ongoingOps.map((op, i) => (
                                  <tr key={i}>
                                    <td style={{ fontWeight: 700 }}>{op.activity}</td>
                                    <td style={{ fontSize: 12 }}>{op.cadence}</td>
                                    <td style={{ fontSize: 12 }}>{op.owner}</td>
                                    <td style={{ fontSize: 12 }}>
                                      {op.output}
                                      {op.sectionId && <span> — <button onClick={() => scrollToSection(op.sectionId)} style={{ background: "none", border: "none", color: t.accent, fontWeight: 700, cursor: "pointer", padding: 0, fontSize: 12, textDecoration: "underline" }}>{op.sectionLabel} →</button></span>}
                                    </td>
                                  </tr>
                                ))}</tbody>
                              </table>
                            </div>
                          </>
                        )}

                        {/* 11.6 Success Metrics */}
                        {section.metrics && (
                          <>
                            <div id="s11-metrics" style={{ background: t.accentLight, border: `1px solid ${t.accent}`, borderRadius: 8, padding: "10px 14px", marginBottom: 10, fontSize: 13, color: t.text, lineHeight: 1.6 }}>
                              <strong style={{ color: t.accent }}>NOTE — </strong>Baselines are captured at Day 90. Progress is reviewed quarterly and reported to the executive team. These metrics are not punitive — they surface where the process is working and where it needs adjustment.
                            </div>
                            <div style={{ fontSize: 12, fontWeight: 700, color: t.textSec, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>11.6 — Success Metrics — 5 KPIs — Tap for Baseline Method</div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 18 }}>
                              {section.metrics.map((m, i) => (
                                <div key={i} style={{ border: `1px solid ${t.border}`, borderRadius: 8, overflow: "hidden", cursor: "pointer" }}
                                  onClick={() => setSideSheet({ title: m.name, content: `<div style="margin-bottom:12px"><strong style="color:#6B778C;font-size:11px;text-transform:uppercase;letter-spacing:0.5px">What It Measures</strong><br/><div style="margin-top:4px;line-height:1.65">${m.what}</div></div><div style="margin-bottom:12px"><strong style="color:#6B778C;font-size:11px;text-transform:uppercase;letter-spacing:0.5px">How to Baseline</strong><br/><div style="margin-top:4px">${m.baseline}</div></div><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px"><div style="padding:10px 12px;background:#E3FCEF;border-radius:6px"><div style="font-size:11px;font-weight:700;color:#006644;margin-bottom:4px">6-MONTH TARGET</div>${m.target6}</div><div style="padding:10px 12px;background:#DEEBFF;border-radius:6px"><div style="font-size:11px;font-weight:700;color:#0052CC;margin-bottom:4px">12-MONTH TARGET</div>${m.target12}</div></div>` })}>
                                  <div style={{ display: "flex", alignItems: "center", padding: "10px 14px", background: t.surfaceHover, gap: 12 }}>
                                    <div style={{ flex: 1 }}>
                                      <div style={{ fontSize: 13, fontWeight: 700, color: t.text }}>{m.name}</div>
                                      <div style={{ fontSize: 12, color: t.textSec, marginTop: 2 }}>{m.what}</div>
                                    </div>
                                    <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                                      <span className="green-badge">{m.target6.split(" ")[0]} {m.target6.split(" ")[1]}</span>
                                    </div>
                                    <Icon name="ChevronRight" />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </>
                        )}

                        {/* 11.7 Owner Summary */}
                        {section.ownerSummary && (
                          <>
                            <div id="s11-owners" style={{ fontSize: 12, fontWeight: 700, color: t.textSec, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>11.7 — Implementation Owner Summary</div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 18 }}>
                              {section.ownerSummary.map((o, i) => (
                                <div key={i} style={{ border: `1px solid ${t.border}`, borderRadius: 8, overflow: "hidden", cursor: "pointer" }}
                                  onClick={() => setSideSheet({ title: o.owner, content: `<div style="margin-bottom:12px"><div style="font-size:11px;font-weight:700;color:#1565C0;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px">Days 1–30 (Foundation)</div><div style="line-height:1.65">${o.phase1}</div></div><div style="margin-bottom:12px"><div style="font-size:11px;font-weight:700;color:#1A7A4A;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px">Days 31–60 (Structure)</div><div style="line-height:1.65">${o.phase2}</div></div><div style="margin-bottom:12px"><div style="font-size:11px;font-weight:700;color:#6C3483;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px">Days 61–90 (Optimization)</div><div style="line-height:1.65">${o.phase3}</div></div><div style="padding:10px 12px;background:#E3FCEF;border-radius:6px"><div style="font-size:11px;font-weight:700;color:#006644;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px">Ongoing</div><div style="line-height:1.65">${o.ongoing}</div></div>` })}>
                                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 14px", background: t.surfaceHover }}>
                                    <span style={{ fontSize: 13, fontWeight: 700, color: t.text }}>{o.owner}</span>
                                    <span style={{ fontSize: 12, color: t.textSec }}>tap for full phase breakdown →</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </>
                        )}

                        {/* 11.8 Success at 12 months */}
                        {section.successAt12Months && (
                          <>
                            <div id="s11-success" style={{ fontSize: 12, fontWeight: 700, color: t.textSec, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>11.8 — What Success Looks Like at 12 Months</div>
                            <div className="table-wrapper" style={{ marginBottom: 18 }}>
                              <table className="data-table">
                                <thead>
                                  <tr>
                                    <th style={{ background: "#A93226" }}>TODAY</th>
                                    <th style={{ background: "#1A7A4A" }}>12 MONTHS</th>
                                  </tr>
                                </thead>
                                <tbody>{section.successAt12Months.map((s, i) => (
                                  <tr key={i}>
                                    <td style={{ color: t.danger, fontSize: 13 }}>{s.today}</td>
                                    <td style={{ color: t.success, fontWeight: 600, fontSize: 13 }}>{s.future}</td>
                                  </tr>
                                ))}</tbody>
                              </table>
                            </div>
                          </>
                        )}

                        {/* Quick Reference */}
                        {section.quickRef && (
                          <>
                            <div style={{ fontSize: 12, fontWeight: 700, color: t.textSec, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>Section 11 — Quick Reference</div>
                            <div className="table-wrapper">
                              <table className="data-table">
                                <thead><tr><th>Phase</th><th>Focus</th><th>Key Deliverables</th><th>Day Marker Win</th></tr></thead>
                                <tbody>{section.quickRef.map((q, i) => (
                                  <tr key={i}>
                                    <td style={{ fontWeight: 700, color: ["#1565C0","#1A7A4A","#6C3483","#B7770D"][i] }}>{q.phase}</td>
                                    <td style={{ fontWeight: 600 }}>{q.focus}</td>
                                    <td style={{ fontSize: 12 }}>{q.deliverables}</td>
                                    <td style={{ fontSize: 12, color: t.success, fontWeight: 600 }}>{q.win}</td>
                                  </tr>
                                ))}</tbody>
                              </table>
                            </div>
                          </>
                        )}
                      </>
                    )}

                    {/* Accordions */}
                    {section.accordions?.map((acc, i) => {
                      const key = `${section.id}-acc${i}`;
                      return (
                        <div key={i} className="accordion">
                          <div className="accordion-header" onClick={() => toggleAccordion(key)}>
                            <span className="accordion-title">{acc.title}</span>
                            <span style={{ color: t.textSec, transform: expandedAccordions[key] ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
                              <Icon name="ChevronDown" />
                            </span>
                          </div>
                          {expandedAccordions[key] && (
                            <div className="accordion-body">{acc.content}</div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>

      {/* Dark mode toggle — desktop lower left */}
      <button className="dark-toggle" onClick={() => setDark(d => !d)}>
        <Icon name={dark ? "Sun" : "Moon"} />
        {dark ? "Light Mode" : "Dark Mode"}
      </button>
    </div>
  );
}
