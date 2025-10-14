/** @type {import("pliny/config").PlinyConfig } */
const siteMetadata = {
  title: 'Terry的日记本',
  author: 'Terry Tan',
  headerTitle: 'Terry的旅行日记',
  description: 'reading, writing, and sharing',
  language: 'zh-cn',
  theme: 'system', // system, dark or light
  siteUrl: 'https://tailwind-nextjs-starter-blog.vercel.app',
  siteRepo: 'https://github.com/dszdsxc19/my-next-blog',
  siteLogo: `${process.env.BASE_PATH || ''}/static/images/logo.png`,
  socialBanner: `${process.env.BASE_PATH || ''}/static/images/twitter-card.png`,
  mastodon: 'https://mastodon.social/@mastodonuser',
  email: 'dszdsxc19@gmail.com',
  github: 'https://github.com/dszdsxc19',
  // x: 'https://twitter.com/x',
  // twitter: 'https://twitter.com/Twitter',
  // facebook: 'https://facebook.com',
  // youtube: 'https://youtube.com',
  linkedin: 'https://www.linkedin.com',
  // threads: 'https://www.threads.net',
  // instagram: 'https://www.instagram.com',
  medium: 'https://medium.com',
  // bluesky: 'https://bsky.app/',
  locale: 'zh-CN',
  // set to true if you want a navbar fixed to the top
  stickyNav: false,
  analytics: {
    // If you want to use an analytics provider you have to add it to the
    // content security policy in the `next.config.js` file.
    // supports Plausible, Simple Analytics, Umami, Posthog or Google Analytics.
    umamiAnalytics: {
      // We use an env variable for this site to avoid other users cloning our analytics ID
      umamiWebsiteId: process.env.NEXT_UMAMI_ID, // e.g. 123e4567-e89b-12d3-a456-426614174000
      // You may also need to overwrite the script if you're storing data in the US - ex:
      // src: 'https://us.umami.is/script.js'
      // Remember to add 'us.umami.is' in `next.config.js` as a permitted domain for the CSP
    },
    // plausibleAnalytics: {
    //   plausibleDataDomain: '', // e.g. tailwind-nextjs-starter-blog.vercel.app
    // If you are hosting your own Plausible.
    //   src: '', // e.g. https://plausible.my-domain.com/js/script.js
    // },
    // simpleAnalytics: {},
    // posthogAnalytics: {
    //   posthogProjectApiKey: '', // e.g. 123e4567-e89b-12d3-a456-426614174000
    // },
    // googleAnalytics: {
    //   googleAnalyticsId: '', // e.g. G-XXXXXXX
    // },
  },
  newsletter: {
    // supports mailchimp, buttondown, convertkit, klaviyo, revue, emailoctopus, beehive
    // Please add your .env file and modify it according to your selection
    // provider: 'buttondown',
  },
  comments: {
    // If you want to use an analytics provider you have to add it to the
    // content security policy in the `next.config.js` file.
    // Select a provider and use the environment variables associated to it
    // https://vercel.com/docs/environment-variables
    provider: 'giscus', // supported providers: giscus, utterances, disqus
    giscusConfig: {
      // Visit the link below, and follow the steps in the 'configuration' section
      // https://giscus.app/
      repo: process.env.NEXT_PUBLIC_GISCUS_REPO,
      repositoryId: process.env.NEXT_PUBLIC_GISCUS_REPOSITORY_ID,
      category: process.env.NEXT_PUBLIC_GISCUS_CATEGORY,
      categoryId: process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID,
      mapping: 'pathname', // supported options: pathname, url, title
      reactions: '1', // Emoji reactions: 1 = enable / 0 = disable
      // Send discussion metadata periodically to the parent window: 1 = enable / 0 = disable
      metadata: '0',
      // theme example: light, dark, dark_dimmed, dark_high_contrast
      // transparent_dark, preferred_color_scheme, custom
      theme: 'light',
      // theme when dark mode
      darkTheme: 'transparent_dark',
      // If the theme option above is set to 'custom`
      // please provide a link below to your custom theme css file.
      // example: https://giscus.app/themes/custom_example.css
      themeURL: '',
      // This corresponds to the `data-lang="zh-CN"` in giscus's configurations
      lang: 'zh-CN',
    },
  },
  search: {
    provider: 'kbar', // kbar or algolia
    kbarConfig: {
      searchDocumentsPath: 'search.json', // path to load documents to search
    },
    // provider: 'algolia',
    // algoliaConfig: {
    //   // The application ID provided by Algolia
    //   appId: 'R2IYF7ETH7',
    //   // Public API key: it is safe to commit it
    //   apiKey: '599cec31baffa4868cae4e79f180729b',
    //   indexName: 'docsearch',
    // },
  },
  toc: {
    enabled: true, // Enable TOC globally
    minHeadings: 3, // Minimum number of headings required to show TOC
    maxDepth: 6, // Maximum heading depth to include (1-6)
    position: 'auto', // 'auto', 'sidebar', 'top', or 'floating'
    sticky: true, // Make TOC sticky when in sidebar or floating position
    showToggle: false, // Show toggle button (auto-enabled on mobile)
  },
  visualizations: {
    // Activity heatmap configuration
    heatmap: {
      enabled: true, // Enable activity heatmap
      weeksToShow: 52, // Number of weeks to display (1 year)
      colorScheme: 'github', // 'github' or 'custom'
      showTooltips: true, // Show tooltips on hover
      // customColors: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'], // Custom colors (optional)
    },
    // Tag treemap configuration
    treemap: {
      enabled: true, // Enable tag treemap
      hierarchical: true, // Use hierarchical tag organization
      colorScheme: 'category', // 'category', 'frequency', or 'custom'
      enableZoom: true, // Allow zooming into categories
      linkToTagPages: true, // Link tags to their respective pages
      // Tag hierarchy (optional) - organize tags into categories
      tagHierarchy: {
        'Technology': ['react', 'vue', 'angular', 'javascript', 'typescript', 'node', 'python', 'java', 'go', 'rust'],
        'Computer Science': ['algorithm', 'data-structure', 'system-design', 'computer-science', 'math', 'statistics'],
        'Web Development': ['frontend', 'backend', 'fullstack', 'web', 'mobile', 'responsive', 'ui', 'ux', 'design'],
        'Learning': ['tutorial', 'guide', 'howto', 'tips', 'tricks', 'best-practices', 'learn-notes'],
        'Personal': ['weekly', 'diary', 'reflection', 'thoughts', 'life']
      }
    },
    // External integrations (optional)
    external: {
      // GitHub integration for commit activity (optional)
      // github: {
      //   enabled: false, // Enable GitHub integration
      //   username: 'your-github-username', // Your GitHub username
      //   includePrivate: false, // Include private repository activity
      // }
    }
  },
}

module.exports = siteMetadata
