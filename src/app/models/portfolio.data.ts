import { PortfolioData } from '../models/portfolio.model';

/** Files live under public/assets/assets/ → served at assets/assets/… */
export const ASSETS_BASE = 'assets/assets';

export const PORTFOLIO_DATA: PortfolioData = {
  name: 'Sivaraaj',
  fullName: 'Sivaraaj C',
  title: 'Senior Software Engineer',
  location: 'Chennai, Tamil Nadu, India',
  email: 'sivaraaj6997@gmail.com',
  phone: '+91 84890 17762',
  linkedin: 'https://linkedin.com/in/sivaraaj-c',
  github: 'https://github.com/sivaraajc',
  portfolio: 'https://sivaraajc.github.io/SIVARAAJ/#/',
  cvPath: `${ASSETS_BASE}/cv/SIVA_CV.pdf`,
  heroAvatarImage: `${ASSETS_BASE}/images/siva-avatar.png`,
  avatarImage: `${ASSETS_BASE}/images/siva-avatar.png`,
  tagline:
    'I craft scalable Angular systems, production APIs, and cinematic developer experiences — engineered for performance and polish.',
  roles: [
    'Software Developer',
    'Full Stack Engineer',
    'AI Engineer',
    'Problem Solver',
    'Open Source Contributor',
  ],

  identity: {
    badges: [
      'Software Engineer',
      'Full Stack Developer',
      'Angular Expert',
      'TypeScript Specialist',
      'UI/UX Enthusiast',
      'Performance Advocate',
      'Open Source Contributor',
      'AI & Web Explorer',
    ],
    terminalLines: [
      '> npm create awesome-portfolio',
      '> Building amazing experiences...',
      '> Compiling Angular signals...',
      '> Deploying innovation...',
      '> Ready.',
    ],
    codeSnippet: [
      "const engineer = {",
      "  name: 'Sivaraaj C',",
      "  stack: ['Angular', 'TypeScript', 'Spring Boot'],",
      "  focus: 'scalable systems',",
      "  ship(): Promise<Impact> {",
      "    return optimize(architect(build()));",
      "  }",
      "};",
    ],
    orbitTechs: [
      'React',
      'Angular',
      'Node.js',
      'Express',
      'MongoDB',
      'PostgreSQL',
      'Python',
      'Java',
      'Spring Boot',
      'Docker',
      'AWS',
      'Git',
      'TensorFlow',
      'Firebase',
      'TypeScript',
      'Linux',
    ],
  },

  widgets: {
    years: 3,
    projects: 20,
    technologies: 18,
    contributions: 420,
    streak: 46,
    codingHours: 4800,
    openSource: 12,
    coffee: 1840,
  },

  nav: [
    { label: 'About', href: '#about', id: 'about' },
    { label: 'Skills', href: '#skills', id: 'skills' },
    { label: 'Experience', href: '#experience', id: 'experience' },
    { label: 'Projects', href: '#projects', id: 'projects' },
    { label: 'Lab', href: '#lab', id: 'lab' },
    { label: 'Services', href: '#services', id: 'services' },
    { label: 'Contact', href: '#contact', id: 'contact' },
  ],

  about: {
    title: 'About Me',
    paragraphs: [
      `With <span class="underline-accent">over 3 years of experience</span>, I have worked across both <span class="underline-accent">frontend</span> and <span class="underline-accent">backend development</span>, with a strong focus on Angular-based applications across enterprise ERP, oil & gas, government POS, and e-commerce domains.`,
      `My expertise includes implementing system enhancements, optimizing Angular applications for performance and scalability, standardizing UI/UX patterns, building reusable component libraries, and leading cross-functional teams to deliver measurable value.`,
      `I actively work on personal and utility-based projects — including AI-powered conversational apps and real-time drilling dashboards — to explore new technologies and strengthen my technical skill set.`,
      `Technologies I regularly work with include Angular, TypeScript, Java Spring Boot, Python, PostgreSQL, MySQL, MongoDB, RESTful APIs, WebSockets, Docker, Jenkins, and Git.`,
    ],
  },

  stats: [
    { label: 'Projects Completed', value: 20, suffix: '+' },
    { label: 'Hackathons', value: 4, suffix: '+' },
    { label: 'Certificates', value: 3, suffix: '' },
    { label: 'GitHub Contributions', value: 420, suffix: '+' },
    { label: 'Clients & Teams', value: 8, suffix: '+' },
  ],

  skills: [
    {
      category: 'Frontend',
      items: [
        { name: 'Angular', level: 96 },
        { name: 'TypeScript', level: 95 },
        { name: 'RxJS', level: 90 },
        { name: 'Tailwind CSS', level: 88 },
        { name: 'GSAP / Three.js', level: 80 },
      ],
    },
    {
      category: 'Backend',
      items: [
        { name: 'Spring Boot', level: 88 },
        { name: 'FastAPI', level: 80 },
        { name: 'REST APIs', level: 92 },
        { name: 'WebSockets', level: 84 },
        { name: 'Microservices', level: 82 },
      ],
    },
    {
      category: 'Mobile',
      items: [
        { name: 'Responsive UI', level: 94 },
        { name: 'PWA Patterns', level: 78 },
        { name: 'Touch UX', level: 82 },
      ],
    },
    {
      category: 'Database',
      items: [
        { name: 'PostgreSQL', level: 86 },
        { name: 'MongoDB', level: 80 },
        { name: 'MySQL', level: 78 },
        { name: 'SQL Optimization', level: 84 },
      ],
    },
    {
      category: 'Cloud',
      items: [
        { name: 'AWS Basics', level: 72 },
        { name: 'Vercel', level: 85 },
        { name: 'Firebase', level: 74 },
      ],
    },
    {
      category: 'DevOps',
      items: [
        { name: 'Docker', level: 78 },
        { name: 'Jenkins / CI-CD', level: 76 },
        { name: 'Git', level: 92 },
        { name: 'Linux', level: 80 },
      ],
    },
    {
      category: 'AI',
      items: [
        { name: 'AI API Integration', level: 84 },
        { name: 'Speech / Realtime', level: 80 },
        { name: 'Prompt Engineering', level: 78 },
      ],
    },
    {
      category: 'Languages',
      items: [
        { name: 'TypeScript', level: 95 },
        { name: 'JavaScript', level: 92 },
        { name: 'Java', level: 88 },
        { name: 'Python', level: 82 },
        { name: 'SQL', level: 85 },
      ],
    },
  ],

  experience: {
    title: 'Experience',
    jobs: [
      {
        tab: 'I-Bytes',
        company: 'Ibytes Bits and Bots Pvt Ltd – Oil & Gas Software Solutions',
        title: 'Senior Software Engineer',
        date: 'Apr 2025 – Present',
        description: [
          'Improved enterprise application scalability by leading Angular frontend architecture design, enabling faster feature rollout and stronger cross-team code reuse.',
          'Accelerated feature delivery by 30% by managing and mentoring a 5-member cross-functional engineering team using Agile Scrum.',
          'Reduced frontend code duplication by 40% through reusable Angular component libraries and standardized UI design patterns.',
          'Improved application performance by 30% via lazy loading, OnPush change detection, and Angular bundle optimization.',
          'Enabled real-time data workflows with Angular, Python (FastAPI), and MongoDB for production applications.',
          'Led Angular upgrade from v8+ to v15–19, resolving vulnerabilities and regression issues.',
        ],
      },
      {
        tab: 'Oasys',
        company: 'Oasys Cybernetics Pvt Ltd.',
        title: 'Software Developer',
        date: 'Aug 2023 – Apr 2025',
        description: [
          'Migrated legacy JSF applications to modern Angular frontends, improving UI performance and maintainability.',
          'Designed scalable microservices architecture for enterprise backend services with Java Spring Boot.',
          'Enhanced ERP system performance by 25% through PostgreSQL query optimization and Angular change detection tuning.',
          'Built RESTful APIs with Spring Boot and connected Angular clients to PostgreSQL for seamless integration.',
          'Led and mentored a team focused on Angular-based projects; contributed to frontend hiring.',
          'Implemented CI pipelines, automated tests, RBAC, and authentication mechanisms for secure back-end systems.',
        ],
      },
    ],
  },

  projects: {
    title: 'Selected Work',
    label: 'Projects',
    items: [
      {
        id: 'ai-avatar',
        title: 'AI Avatar Assistant',
        description:
          'AI-powered web application with interactive 3D avatar and real-time speech features. Implements encrypted API key management, speech-to-text/text-to-speech, and sub-100ms response optimization.',
        imgs: [
          `${ASSETS_BASE}/images/Screenshot 2026-07-06 153116.png`,
          `${ASSETS_BASE}/images/Screenshot 2026-07-06 153123.png`,
          `${ASSETS_BASE}/images/Screenshot 2026-07-06 153132.png`,
        ],
        technologies: ['Angular', 'TypeScript', 'AI APIs', 'Vercel', 'Real-Time'],
        category: 'AI',
        link: 'https://ai-web-ten-beta.vercel.app/',
        github: 'https://github.com/sivaraajc',
        featured: true,
        status: 'Live',
        stars: 24,
        commits: 186,
        lighthouse: 96,
        latency: '<100ms',
        architecture: 'Angular + AI APIs + Realtime Speech',
      },
      {
        id: 'drilling-ai',
        title: 'Drilling AI',
        description:
          'AI-driven oil & gas data visualization platform with WebSocket-based live dashboards achieving under 100ms latency. Features RBAC, lazy loading, and 35% faster dashboard load performance.',
        imgs: [`${ASSETS_BASE}/icons/icon-512x512.png`],
        technologies: ['Angular 19', 'TypeScript', 'WebSockets', 'RBAC'],
        category: 'Enterprise',
        featured: true,
        status: 'Production',
        stars: 11,
        commits: 312,
        lighthouse: 94,
        latency: '<100ms',
        architecture: 'Angular + WebSockets + RBAC',
      },
      {
        id: 'cooptex',
        title: 'CO-OPTEX',
        description:
          'Enterprise ERP retail application managing supplies through all production stages with Java Spring Boot and Angular.',
        imgs: [
          `${ASSETS_BASE}/images/coptex1.png`,
          `${ASSETS_BASE}/images/coptex2.png`,
          `${ASSETS_BASE}/images/coptex3.png`,
        ],
        technologies: ['Angular 16', 'TypeScript', 'Java', 'PostgreSQL', 'RxJS'],
        category: 'Enterprise',
        status: 'Production',
        commits: 540,
        lighthouse: 91,
        architecture: 'Angular + Spring Boot + PostgreSQL',
      },
      {
        id: 'stella',
        title: 'THE STELLA',
        description:
          'E-commerce system with Angular frontend and Spring Boot REST APIs for order management, payments, inventory tracking, and sales analytics.',
        imgs: [
          `${ASSETS_BASE}/images/stella1.png`,
          `${ASSETS_BASE}/images/stella3.png`,
          `${ASSETS_BASE}/images/stella4.png`,
        ],
        technologies: ['Angular 18', 'Spring Boot', 'TypeScript', 'RxJS'],
        category: 'E-Commerce',
        status: 'Live',
        commits: 278,
        lighthouse: 93,
        architecture: 'SPA + REST microservices',
      },
      {
        id: 'static-ecommerce',
        title: 'Static Ecommerce',
        description:
          'A polished Angular ecommerce frontend showcase with interactive product discovery and seamless responsive navigation.',
        imgs: [
          `${ASSETS_BASE}/images/static1.png`,
          `${ASSETS_BASE}/images/static2.png`,
          `${ASSETS_BASE}/images/static3.png`,
        ],
        technologies: ['Angular 18', 'TypeScript', 'RxJS'],
        category: 'E-Commerce',
        status: 'Live',
        commits: 94,
        lighthouse: 97,
        architecture: 'Angular frontend showcase',
      },
      {
        id: 'wddi',
        title: 'WDDI Project',
        description:
          'Production-ready oil & gas enterprise application delivered on a 120-day deadline with modular Angular 19 UI architecture.',
        imgs: [`${ASSETS_BASE}/icons/icon-384x384.png`],
        technologies: ['Angular 19', 'TypeScript', 'Enterprise Web'],
        category: 'Enterprise',
        status: 'Production',
        commits: 210,
        lighthouse: 92,
        architecture: 'Modular Angular 19 enterprise UI',
      },
      {
        id: 'gov-pos',
        title: 'Government POS',
        description:
          'Point-of-sale system for government billing operations with transaction management, receipt generation, and automated billing via REST APIs.',
        imgs: [`${ASSETS_BASE}/icons/icon-192x192.png`],
        technologies: ['Angular', 'REST APIs', 'Full Stack'],
        category: 'Enterprise',
        status: 'Internal',
        commits: 165,
        lighthouse: 90,
        architecture: 'Angular + REST billing APIs',
      },
    ],
  },

  services: [
    {
      title: 'Angular Architecture',
      description:
        'Scalable frontend architecture, component libraries, OnPush strategies, and performance-first Angular applications.',
      icon: 'layout',
    },
    {
      title: 'Full-Stack Development',
      description:
        'End-to-end delivery with Angular, Spring Boot, and FastAPI — secure APIs, RBAC, and production-ready systems.',
      icon: 'server',
    },
    {
      title: 'UI Motion & Experience',
      description:
        'Cinematic interfaces with GSAP, ScrollTrigger, Lenis, and Three.js that feel fluid, intentional, and premium.',
      icon: 'zap',
    },
    {
      title: 'Performance Optimization',
      description:
        'Bundle analysis, lazy loading, change detection tuning, and measurable load-time improvements.',
      icon: 'code',
    },
    {
      title: 'Team Mentorship',
      description:
        'Guiding engineers with coding standards, architecture reviews, and Agile delivery practices.',
      icon: 'users',
    },
    {
      title: 'Secure Systems',
      description:
        'Authentication, authorization, encrypted workflows, and resilient API design for enterprise environments.',
      icon: 'shield',
    },
  ],

  testimonials: [
    {
      name: 'Engineering Lead',
      role: 'Tech Lead',
      company: 'Oil & Gas Domain',
      quote:
        'Sivaraaj elevates Angular delivery with architectural clarity and a rare eye for polish. Feature velocity and code quality improved across the team.',
    },
    {
      name: 'Product Stakeholder',
      role: 'Product Manager',
      company: 'Enterprise ERP',
      quote:
        'He translates complex requirements into elegant interfaces. Communication is crisp, demos are cinematic, and releases land on time.',
    },
    {
      name: 'Peer Engineer',
      role: 'Software Developer',
      company: 'Cross-functional Squad',
      quote:
        'Mentorship that actually sticks — reusable patterns, performance habits, and a culture of craftsmanship.',
    },
    {
      name: 'Client Partner',
      role: 'Delivery Manager',
      company: 'Digital Transformation',
      quote:
        'From legacy migration to modern Angular stacks, Sivaraaj brings calm execution and measurable performance wins.',
    },
  ],

  education: {
    title: 'Education',
    degree: 'Bachelor of Technology (B.Tech), Information Technology',
    school: 'Coimbatore Institute of Engineering and Technology',
    location: 'Coimbatore, India',
    date: 'Aug 2018 – Apr 2022',
    gpa: 'CGPA 7.8 / 10.0',
  },

  certifications: [
    'Cyber Security Training — National-Level Webinar',
    'Advanced Python Training — FITA Academy, Chennai',
    'TCS National Qualifier Test (NQT) — Score: 64%',
  ],

  contact: {
    pretitle: 'Ready when you are',
    title: "Let's build something exceptional",
    content:
      'Open to senior frontend / full-stack opportunities and collaborations. Share a brief about your product — I respond quickly.',
    btn: 'Send Message',
  },
};
