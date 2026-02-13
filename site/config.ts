export interface SiteConfig {
  author: string;
  desc: string;
  title: string;
  ogImage: string;
  lang: string;
  base: string;
  website: string;
  social: Record<string, string>;
  googleAnalyticsId?: string;
  homeHeroDescription: string;
  blogDescription: string;
  projectsDescription: string;

  // Homepage post counts
  featuredPostsCount: number;
  latestPostsCount: number;

  // Homepage projects
  homeProjects: {
    enabled: boolean;
    count: number;
  };

  // CTA (Call-to-Action) block for blog posts
  cta: {
    enabled: boolean;
    filePath: string; // Path to markdown file with CTA content
  };

  // Homepage Hero block
  hero: {
    enabled: boolean;
    filePath: string;
  };

  // Giscus comments configuration
  comments: {
    enabled: boolean;
    repo: string; // e.g., 'username/repo'
    repoId: string;
    category: string;
    categoryId: string;
    mapping: 'pathname' | 'url' | 'title' | 'og:title' | 'specific' | 'number';
    reactionsEnabled: boolean;
    emitMetadata: boolean;
    inputPosition: 'top' | 'bottom';
    theme: string; // e.g., 'preferred_color_scheme', 'light', 'dark'
    lang: string;
  };
}

export const SITE: SiteConfig = {
  author: 'Tom Fieber',
  desc: 'Dad, husband, grandpa',
  title: 'pawpawhacks',
  ogImage: 'opImage.png', // Path to your default OG image in the public directory
  lang: 'en-US',
  base: '/',
  website: 'https://tomfieber.dev',
  social: {
    x: 'https://x.com/pawpawhacks',
    github: 'https://github.com/tomfieber',
    discord: 'https://discord.gg/pjUUkw38mC',
    linkedin: 'https://linkedin.com/in/thomasfieber',
    youtube: 'https://youtube.com/@pawpawhacks',
    // telegram: 'https://t.me/pawpawhacks',
    // facebook: 'https://facebook.com/pawpawhacks',
  },
  googleAnalyticsId: '', // Example: 'G-XXXXXXXXXX'
  homeHeroDescription:
    'Sharing my journey in web application security, pentesting, and bug bounty hunting. I write about my experiences, research, and the tools I use.',
  blogDescription: 'Writeups, research, and other thoughts.',
  projectsDescription: 'Things I’ve built that I’m proud of. Many of them are open-source.',

  // Homepage post counts
  featuredPostsCount: 3,
  latestPostsCount: 3,

  // Homepage projects
  homeProjects: {
    enabled: false,
    count: 4,
  },

  // CTA (Call-to-Action) block for blog posts
  cta: {
    enabled: true,
    filePath: 'site/cta.md',
  },

  hero: {
    enabled: true,
    filePath: 'site/hero.md',
  },

  // Giscus comments configuration
  // Get your configuration from https://giscus.app
  comments: {
    enabled: false, // Set to true after filling in the IDs below
    repo: 'alec-c4/spaceship', // Your GitHub repository
    repoId: '', // Get from https://giscus.app - enter repo above and copy the value
    category: 'General', // GitHub Discussions category name
    categoryId: '', // Get from https://giscus.app - select category and copy the value
    mapping: 'pathname',
    reactionsEnabled: true,
    emitMetadata: false,
    inputPosition: 'bottom',
    theme: 'preferred_color_scheme', // Automatically matches your site theme
    lang: 'en',
  },
};
