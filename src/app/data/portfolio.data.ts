/** Files live under public/assets/assets/ → served at assets/assets/… */
export const ASSETS_BASE = 'assets/assets';

export interface Job {
  tab: string;
  company: string;
  title: string;
  date: string;
  description: string[];
}

export interface Project {
  title: string;
  description: string;
  imgs: string[];
  technologies: string[];
  link?: string;
  featured?: boolean;
}

export const PORTFOLIO = {
  name: 'Sivaraaj',
  title: 'Senior Software Engineer',
  location: 'Chennai, Tamil Nadu, India',
  email: 'sivaraaj6997@gmail.com',
  phone: '+91 84890 17762',
  linkedin: 'https://linkedin.com/in/sivaraaj-c',
  github: 'https://github.com/sivaraajc',
  portfolio: 'https://sivaraajc.github.io/SIVARAAJ/#/',
  cvName: 'SIVA_CV.pdf',
  cvPath: `${ASSETS_BASE}/cv/SIVA_CV.pdf`,
  avatarModel: 'assets/models/avatar.glb',
  /** Processed avatar for hero circle — built from siva-source.jpg, never raw photo */
  heroAvatarImage: `${ASSETS_BASE}/images/siva-avatar.png`,
  /** @deprecated use heroAvatarImage */
  heroPortraitImage: `${ASSETS_BASE}/images/siva-avatar.png`,
  /** Header logo — same processed avatar as hero */
  avatarImage: `${ASSETS_BASE}/images/siva-avatar.png`,
  heroWorkplaceImage: `${ASSETS_BASE}/images/developer-workplace.png`,
  /** Optional movable 3D man video — drop MP4 here to use instead of GLB */
  heroVideo: `${ASSETS_BASE}/videos/hero-developer.mp4`,

  header: {
    items: ['About Me', 'Experience', 'Projects', 'Contact', 'Chat'],
    cvBtn: 'Resume',
  },

  banner: {
    pretitle: 'Hello! I am',
    description: `I have <span class="underline">3+ years of professional experience</span> developing dynamic, responsive, and user-friendly web applications. I specialize in building efficient systems, intuitive user interfaces, and scalable solutions that enhance user experience. Expert in <span class="underline">Angular</span> (v8–21), <span class="underline">TypeScript</span>, <span class="underline">Java Spring Boot</span>, and <span class="underline">Python FastAPI</span>. I improved application performance up to 30% and accelerated feature delivery through architecture, mentoring, and optimization.`,
    actionBtn: 'Say Hi',
  },

  about: {
    title: 'About Me',
    paragraphs: [
      `With <span class="underline">over 3 years of experience</span>, I have worked across both <span class="underline">frontend</span> and <span class="underline">backend development</span>, with a strong focus on Angular-based applications across enterprise ERP, oil & gas, government POS, and e-commerce domains.`,
      `My expertise includes implementing system enhancements, optimizing Angular applications for performance and scalability, standardizing UI/UX patterns, building reusable component libraries, and leading cross-functional teams to deliver measurable value.`,
      `I actively work on personal and utility-based projects — including AI-powered conversational apps and real-time drilling dashboards — to explore new technologies and strengthen my technical skill set.`,
      `Technologies I regularly work with include Angular, TypeScript, JavaScript, Java Spring Boot, Python, PostgreSQL, MySQL, MongoDB, RESTful APIs, WebSockets, Docker, Jenkins, and Git.`,
      `I have solid experience designing secure, scalable REST APIs with Java Spring Boot and Python FastAPI, enabling seamless communication between frontend applications and backend services.`,
    ],
  },

  skills: [
    { category: 'Languages', items: ['Java', 'TypeScript', 'JavaScript', 'Python', 'HTML5', 'CSS', 'SQL'] },
    { category: 'Frontend', items: ['Angular 8–21', 'RxJS', 'Reactive Forms', 'Lazy Loading', 'OnPush CD', 'Responsive UI'] },
    { category: 'Backend', items: ['Spring Boot', 'FastAPI', 'Microservices', 'REST APIs', 'WebSockets', 'RBAC'] },
    { category: 'Databases', items: ['PostgreSQL', 'MySQL', 'MongoDB', 'Query Optimization'] },
    { category: 'DevOps', items: ['Git', 'Docker', 'Jenkins', 'CI/CD', 'Agile', 'Scrum', 'Jira'] },
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
          'Reduced API error rate by 15% through validation improvements, logging, monitoring, and efficient database interactions.',
          'Enforcing code quality through ESLint, Prettier, and Angular linting rules across the team.',
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
          'Collaborated with stakeholders on sprint planning, progress reporting, and on-time enterprise releases.',
        ],
      },
    ] as Job[],
  },

  projects: {
    title: 'Work',
    label: 'Selected Projects',
    items: [
      {
        title: 'AI Avatar Assistant',
        description:
          'AI-powered web application with interactive <span class="underline">3D avatar</span> and real-time speech features. Implements encrypted API key management, speech-to-text/text-to-speech, and sub-100ms response optimization. Deployed on Vercel.',
        imgs: [
          `${ASSETS_BASE}/images/Screenshot 2026-07-06 153116.png`,
          `${ASSETS_BASE}/images/Screenshot 2026-07-06 153123.png`,
          `${ASSETS_BASE}/images/Screenshot 2026-07-06 153132.png`,
        ],
        technologies: ['Angular', 'TypeScript', 'AI APIs', 'Vercel', 'Real-Time'],
        link: 'https://ai-web-ten-beta.vercel.app/',
        featured: true,
      },
      {
        title: 'Drilling AI',
        description:
          'AI-driven <span class="underline">oil & gas data visualization</span> platform with WebSocket-based live dashboards achieving under 100ms latency. Features RBAC, lazy loading, and 35% faster dashboard load performance.',
        imgs: [`${ASSETS_BASE}/icons/icon-512x512.png`],
        technologies: ['Angular 19', 'TypeScript', 'WebSockets', 'RBAC'],
        featured: true,
      },
      {
        title: 'CO-OPTEX',
        description:
          'Developing a web application to efficiently suggest and manage the <span class="underline">COOPTEX</span> Retail Application, a comprehensive Enterprise Resource Planning (ERP) system overseeing supplies through all production stages with Java Spring Boot and Angular.',
        imgs: [
          `${ASSETS_BASE}/images/coptex1.png`,
          `${ASSETS_BASE}/images/coptex2.png`,
          `${ASSETS_BASE}/images/coptex3.png`,
          `${ASSETS_BASE}/images/coptex4.png`,
          `${ASSETS_BASE}/images/coptex5.png`,
        ],
        technologies: ['Angular 16', 'TypeScript 5.2', 'Angular Material', 'Java', 'PostgreSQL', 'RxJS'],
      },
      {
        title: 'THE STELLA',
        description:
          'The <span class="underline">Stella E-Commerce System</span> revolutionizes online shopping with Angular frontend and Spring Boot REST APIs for order management, payments, inventory tracking, and sales analytics.',
        imgs: [
          `${ASSETS_BASE}/images/stella1.png`,
          `${ASSETS_BASE}/images/stella3.png`,
          `${ASSETS_BASE}/images/stella4.png`,
          `${ASSETS_BASE}/images/stella5.png`,
          `${ASSETS_BASE}/images/stella2.png`,
        ],
        technologies: ['Angular 18', 'Angular Material', 'Bootstrap', 'TypeScript 5.5', 'Spring Boot', 'RxJS'],
      },
      {
        title: 'Static Ecommerce',
        description:
          'A <span class="underline">Stella E-Commerce</span> frontend showcase built with Angular — interactive product discovery, seamless navigation, and a polished responsive shopping interface.',
        imgs: [
          `${ASSETS_BASE}/images/static1.png`,
          `${ASSETS_BASE}/images/static2.png`,
          `${ASSETS_BASE}/images/static3.png`,
          `${ASSETS_BASE}/images/static4.png`,
          `${ASSETS_BASE}/images/static5.png`,
        ],
        technologies: ['Angular 18', 'Angular Material', 'Bootstrap', 'TypeScript 5.5', 'RxJS'],
      },
      {
        title: 'WDDI Project',
        description:
          'Production-ready <span class="underline">oil & gas enterprise application</span> delivered on a 120-day deadline with modular Angular 19 UI architecture and scalable feature boundaries.',
        imgs: [`${ASSETS_BASE}/icons/icon-384x384.png`],
        technologies: ['Angular 19', 'TypeScript', 'Enterprise Web'],
      },
      {
        title: 'Government POS',
        description:
          'Point-of-sale system for <span class="underline">government billing</span> operations with transaction management, receipt generation, and automated end-to-end billing via REST APIs.',
        imgs: [`${ASSETS_BASE}/icons/icon-192x192.png`],
        technologies: ['Angular', 'REST APIs', 'Full Stack'],
      },
    ] as Project[],
  },

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
    pretitle: 'And... Now?',
    title: 'Say Hi!',
    content:
      'I will be glad to hear from you if you want to discuss new opportunities. Write to me, and I will respond as soon as I see your message.',
    btn: 'Contact Me',
  },

  chat: {
    title: 'AI Chat',
    description: 'Try my AI-powered conversational assistant with real-time speech.',
    link: 'https://ai-web-ten-beta.vercel.app/',
    btn: 'Open Chat Demo',
  },
};
