export const seedPrompts = [
  {
    title: "Create a 30-Day Content Calendar",
    category: "content-strategy",
    author: "AI Hustle Guy",
    preview: "Claude plans the strategy while you focus on execution. Build a 30-day content calendar for any platform and niche with varied post types.",
    full: "Build a 30-day content calendar for [platform] in the [niche] space. Include 3 themes per week (e.g., education, proof, engagement), vary post types (text, carousel, video, story), and focus each idea on either solving a pain point or sparking conversation."
  },
  {
    title: "Turn My Notes Into a Full Blog Post",
    category: "writing",
    author: "AI Hustle Guy",
    preview: "Claude expands rough notes into polished long-form writing. Transform bullet points into a compelling 700-word post with a bold opening and clear CTA.",
    full: "Turn these bullet notes into a 700-word blog post. Use a bold opening that highlights the reader's pain or goal, then break the content into 3 practical sections with subheads. End with a CTA that promotes my lead magnet or service."
  },
  {
    title: "Repurpose a Blog Into 3 Instagram Carousels",
    category: "social-media",
    author: "AI Hustle Guy",
    preview: "More reach without rewriting everything. Extract 3 carousel post ideas with hooks, insights, and CTAs formatted for Instagram.",
    full: "Extract 3 carousel post ideas from this blog. For each: write a hook slide (short, curiosity-based), 3-5 slides of practical insight (one takeaway per slide), and a final slide CTA to save or share. Format for Instagram tone: clear, bold, casual."
  },
  {
    title: "Write a LinkedIn Post That Builds Authority",
    category: "linkedin",
    author: "AI Hustle Guy",
    preview: "Professional but human. Open with a bold opinion, back it with examples, end with a discussion prompt that drives engagement.",
    full: "Write a 300-word LinkedIn post on [topic]. Open with a personal insight or bold opinion, include 2-3 stats or examples, and wrap with a prompt for discussion or reflection. Keep it clear, confident, and human."
  },
  {
    title: "Draft a 60-Second Reels Script",
    category: "video-content",
    author: "AI Hustle Guy",
    preview: "Fast, sharp, and punchy. A scroll-stopping 60-second Reels script with a 5-second hook, 3 key points, and a clear CTA.",
    full: "Write a 60-second script for an Instagram Reel on [topic]. Start with a 5-second hook (controversy, question, or stat), break the idea into 3 digestible points, and end with a CTA to comment or DM."
  },
  {
    title: "Summarize My Podcast Into a LinkedIn Post",
    category: "repurposing",
    author: "AI Hustle Guy",
    preview: "Turn long-form into bite-size authority content. Pull the core idea from your episode and make it shareable in 250-300 words.",
    full: "Summarize this podcast episode into a LinkedIn post that feels like a mini blog. Pull one core idea, add a quick story or stat, and include a reflective question or CTA at the end. Aim for 250-300 words."
  },
  {
    title: "Rewrite My Blog for SEO Naturally",
    category: "seo",
    author: "AI Hustle Guy",
    preview: "Improve rankings without destroying your voice. Rewrite for search intent while keeping the tone conversational and human.",
    full: "Rewrite this blog post to rank for [target keyword]. Naturally weave the keyword into the title, first paragraph, 2-3 subheadings, and conclusion. Improve meta description. Keep tone conversational. Do not keyword stuff — prioritize readability. [PASTE BLOG]"
  },
  {
    title: "Turn a YouTube Video Into a Twitter Thread",
    category: "twitter",
    author: "AI Hustle Guy",
    preview: "Extract the 10 most quotable moments from your video and turn them into an engaging thread with a strong hook tweet.",
    full: "Turn this YouTube transcript into a 10-tweet thread. Start with a hook tweet that creates curiosity. Then share the 9 best insights as individual tweets (1 idea per tweet). End with a CTA tweet. Keep each tweet under 250 characters. [PASTE TRANSCRIPT]"
  },
  {
    title: "Cold Email That Actually Gets Replies",
    category: "marketing",
    author: "Alex Hormozi",
    preview: "A 4-sentence cold email framework that opens with relevance, identifies pain, offers value, and ends with a low-friction CTA.",
    full: "Write a cold email to [TARGET PERSON/ROLE] at [COMPANY TYPE]. My offer: [YOUR PRODUCT/SERVICE]. Their likely pain: [PAIN POINT]. Format: 4 sentences max. Sentence 1: relevant opener (not a compliment — a specific observation). Sentence 2: identify their pain without assuming. Sentence 3: one concrete result you've driven for similar companies. Sentence 4: low-friction CTA (not a call, just a question). No attachments mentioned. No buzzwords."
  },
  {
    title: "Executive Brief from Long Document",
    category: "productivity",
    author: "Justin Welsh",
    preview: "Turn any long document into a 1-page executive brief: situation, key findings, 2-3 options with trade-offs, and one clear recommendation.",
    full: "[PASTE LONG DOCUMENT] Create a 1-page executive brief. Format: (1) Situation: what is happening and why it matters now, (2) Key findings: 3-5 bullet points with the most important data points, (3) Options: 2-3 courses of action with trade-offs, (4) Recommendation: one clear recommended action with rationale. Use direct, assertive language. No hedging. The reader is a C-level executive with 3 minutes to decide."
  },
  {
    title: "Code Review with Security Focus",
    category: "coding",
    author: "Dickie Bush",
    preview: "Comprehensive security-focused code review checking for SQL injection, XSS, auth flaws, data exposure, input validation gaps.",
    full: "Perform a comprehensive code review on the following [LANGUAGE] code with an emphasis on security vulnerabilities. Check for: SQL injection, XSS, authentication/authorization flaws, insecure data exposure, dependency vulnerabilities, input validation gaps, and secrets in code. For each issue found: identify exact location, explain the risk, rate severity (Critical/High/Medium/Low), and provide corrected code. [PASTE CODE]"
  },
  {
    title: "Generate Comprehensive Unit Tests",
    category: "coding",
    author: "Nicolas Cole",
    preview: "Generate a complete test suite with happy paths, edge cases, boundary values, invalid inputs, and error handling — aiming for 100% branch coverage.",
    full: "Generate a complete unit test suite for the following function/class: [PASTE CODE]. Use [TEST FRAMEWORK — e.g., Jest, pytest, JUnit]. Include tests for: happy paths, edge cases, boundary values, invalid inputs, error/exception handling, and any async behavior. Each test should have a descriptive name that reads like documentation. Aim for 100% branch coverage. Add setup/teardown where appropriate."
  },
  {
    title: "Financial Document Analysis",
    category: "analysis",
    author: "Prompt Vault",
    preview: "Analyze a 10-K or earnings transcript like a buy-side analyst: revenue drivers, margin trends, balance sheet health, and red flags.",
    full: "[PASTE FINANCIAL REPORT/10-K/EARNINGS CALL TRANSCRIPT] Analyze this financial document as a buy-side equity analyst. Extract: (1) Revenue drivers and growth quality (recurring vs one-time), (2) Margin trends and key cost items, (3) Balance sheet health and capital allocation, (4) Management commentary on risks and guidance, (5) Red flags or items requiring deeper investigation. Format as a structured analyst note. Quantify every claim with specific numbers from the document."
  },
  {
    title: "Deep Literature Review",
    category: "research",
    author: "Lenny Rachitsky",
    preview: "Synthesize sources into a structured literature review: evolution of thinking, schools of thought, scholarly consensus, active debates.",
    full: "Act as a research librarian and academic writing specialist. Based on the following sources I have compiled on [TOPIC]: [PASTE SOURCES OR KEY FINDINGS]. Synthesize a structured literature review covering: (1) Evolution of thinking on this topic over time, (2) Major schools of thought and their key proponents, (3) Points of scholarly consensus, (4) Active debates and contested areas, (5) Methodological trends and limitations across the field. Academic tone, third-person, 600-800 words."
  },
  {
    title: "Persuasive Piece with Rhetorical Techniques",
    category: "writing",
    author: "Leila Hormozi",
    preview: "Write a persuasive piece using logos, pathos, and ethos — each technique labeled inline so you can see exactly where it appears.",
    full: "Write a [LENGTH]-word persuasive piece arguing [POSITION]. Deliberately use these three rhetorical techniques: (1) logos — cite specific data or logical reasoning, (2) pathos — one concrete human story or scenario, (3) ethos — establish credibility through demonstrated expertise in [FIELD]. Label which technique you are using as a comment in brackets so I can see where each appears. Target reader: [AUDIENCE]."
  },
  {
    title: "Detailed Product Description",
    category: "marketing",
    author: "Sahil Bloom",
    preview: "Write a 200-word product description with an opening hook, aspirational paragraph, feature-benefit breakdown, and urgency close.",
    full: "Write a product description for [PRODUCT NAME], a [CATEGORY] designed for [TARGET CUSTOMER]. Features: [LIST FEATURES]. Primary benefit: [BENEFIT]. Tone: [BRAND VOICE]. Format: opening hook (1 sentence), aspirational paragraph (2-3 sentences), feature-benefit breakdown (each feature paired with a customer outcome), and a closing sentence with urgency. 200 words maximum. Avoid: revolutionary, innovative, game-changing, powerful."
  },
  {
    title: "Debug with Systematic Root Cause",
    category: "coding",
    author: "Corey Quinn",
    preview: "Think through bug causes systematically. For the top 3 candidates, explain the diagnosis and provide a specific fix for each.",
    full: "I am experiencing a bug in my [LANGUAGE/FRAMEWORK] application. Error: [ERROR MESSAGE]. Steps to reproduce: [LIST STEPS]. Expected behavior: [EXPECTED]. Actual behavior: [ACTUAL]. Here is the relevant code: [PASTE CODE]. Here is what I have already tried: [LIST ATTEMPTS]. Think through the possible causes systematically, starting with the most likely. For the top 3 candidates, explain the diagnosis and provide a specific fix for each."
  },
  {
    title: "Counter-Argument Generator",
    category: "research",
    author: "AI Hustle Guy",
    preview: "Generate the 5 strongest steelmanned counter-arguments to your position — each rated by strength and paired with what you would need to rebut it.",
    full: "I am arguing that [POSITION]. Generate the five strongest possible counter-arguments to my position. For each counter-argument: (1) State it clearly and charitably (steelman it — make it as strong as possible), (2) Identify what type of objection it is (empirical, logical, ethical, practical), (3) Rate its strength as a counter-argument (1-10), (4) Suggest what evidence or reasoning I would need to rebut it. Do not argue for my position — your job is to identify its genuine vulnerabilities."
  },
  {
    title: "Stakeholder Map Generator",
    category: "analysis",
    author: "Wes Kao",
    preview: "Map every stakeholder's influence, interest, position, and motivation — then generate a prioritized engagement plan for the top 5.",
    full: "Based on the following project/situation description, create a comprehensive stakeholder map: [DESCRIBE PROJECT OR SITUATION]. For each stakeholder group: (1) Name and role, (2) Level of influence (High/Medium/Low), (3) Level of interest (High/Medium/Low), (4) Current position (Supporter/Neutral/Resistant), (5) Their primary concern or motivation, (6) Recommended engagement strategy. Present as a structured table, then provide a prioritized engagement plan for the top 5 stakeholders."
  },
  {
    title: "System Design for Scale",
    category: "coding",
    author: "Sahil Bloom",
    preview: "Design a scalable system with data model, API design, services, storage choices, caching, queues, failure modes, and estimated infra costs.",
    full: "Design a system to handle [USE CASE] at [SCALE — e.g., 100K users, 10M events/day]. Requirements: [LIST FUNCTIONAL AND NON-FUNCTIONAL REQUIREMENTS]. Think through: data model, API design, core services and their responsibilities, data storage choices with justification, caching strategy, queue/async processing, scalability bottlenecks, failure modes and resilience, and estimated infrastructure costs. Present as a structured technical design document with trade-off discussion."
  }
];

export const seedSkills = [
  {
    name: "wonderwhy-er/desktop-commander",
    desc: "The most-starred Claude skill on GitHub. Gives Claude persistent terminal access — run shell commands, edit files, search codebases, and manage processes directly from your Claude conversation. The de facto standard for developers who want Claude to write and run code end-to-end.",
    icon: "⚡",
    tag: "Dev Tools",
    github: "https://github.com/wonderwhy-er/desktop-commander"
  },
  {
    name: "anthropics/claude-code",
    desc: "Official Anthropic skill for agentic software engineering. Claude reads your repo, plans changes across files, runs tests, and commits — all in one shot. Trusted by engineers building production systems who want Claude to function like a senior pair programmer.",
    icon: "💻",
    tag: "Coding",
    github: "https://github.com/anthropics/claude-code"
  },
  {
    name: "modelcontextprotocol/servers",
    desc: "The official MCP server collection from Anthropic. Connects Claude to Brave Search, filesystem, GitHub, Google Drive, Slack, Postgres, Puppeteer, and more. If you install one skill collection, make it this one — it covers the most common real-world integrations.",
    icon: "🔌",
    tag: "Integrations",
    github: "https://github.com/modelcontextprotocol/servers"
  },
  {
    name: "21st-dev/magic-mcp",
    desc: "Gives Claude the ability to generate polished UI components on demand. Describe a button, form, card, or full page layout and Magic MCP produces clean, production-ready code. Built for designers and frontend engineers who use Claude to accelerate their workflow.",
    icon: "🎨",
    tag: "UI/Design",
    github: "https://github.com/21st-dev/magic-mcp"
  },
  {
    name: "executeautomation/playwright-mcp-server",
    desc: "Connect Claude to Playwright and let it navigate browsers, click buttons, fill forms, and scrape structured data — all through natural language. Ideal for QA engineers, data teams, and anyone who needs web automation without writing Playwright scripts by hand.",
    icon: "🎭",
    tag: "Automation",
    github: "https://github.com/executeautomation/playwright-mcp-server"
  },
  {
    name: "K-Dense-AI/claude-scientific-skills",
    desc: "15+ advanced ML and AI skills purpose-built for technical analysis. Includes PyTorch model evaluation, scikit-learn pipelines, benchmark graph generation, and investment research automation. Best suited for data scientists, AI researchers, and analysts.",
    icon: "🧪",
    tag: "ML & AI",
    github: "https://github.com/K-Dense-AI/claude-scientific-skills"
  },
  {
    name: "AgriciDaniel/claude-seo",
    desc: "12 open-source SEO skills that turn Claude into a full-stack SEO analyst. Covers on-page audits, competitor keyword gap analysis, content brief generation, meta optimization, and YouTube/Reddit/Google ranking strategies.",
    icon: "📈",
    tag: "SEO",
    github: "https://github.com/AgriciDaniel/claude-seo"
  }
];
