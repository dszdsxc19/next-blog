# Technology Stack

## Core Framework

- **Next.js 15.2.4** - React framework with App Router architecture
- **React 19.0.0** - UI library
- **TypeScript 5.9.3** - Type-safe JavaScript
- **Node.js** - Runtime environment

## Styling

- **Tailwind CSS 4.x** - Utility-first CSS framework
- **@tailwindcss/typography** - Prose styling for markdown content
- **@tailwindcss/forms** - Form styling
- Custom CSS in `css/tailwind.css` and `css/prism.css`

## Content Management

- **Contentlayer 0.5.5** - Type-safe content layer for MDX
- **MDX** - Markdown with JSX components
- **gray-matter** - Frontmatter parsing
- **reading-time** - Estimated reading time calculation

## Markdown Processing

### Remark Plugins (Markdown → AST)
- `remark-gfm` - GitHub Flavored Markdown
- `remark-math` - Math notation support
- `remark-github-blockquote-alert` - GitHub-style alerts

### Rehype Plugins (HTML Processing)
- `rehype-slug` - Add IDs to headings
- `rehype-autolink-headings` - Auto-link headings
- `rehype-katex` - Math rendering
- `rehype-prism-plus` - Syntax highlighting with line numbers
- `rehype-citation` - Bibliography and citations
- `rehype-preset-minify` - HTML minification

## Key Libraries

- **pliny** - Blog utilities (analytics, search, comments, newsletter)
- **next-themes** - Theme switching
- **github-slugger** - URL-safe slugs
- **@headlessui/react** - Unstyled UI components

## Development Tools

- **ESLint 9.x** - Linting with flat config
- **Prettier 3.x** - Code formatting with Tailwind plugin
- **Husky** - Git hooks
- **lint-staged** - Pre-commit linting
- **@next/bundle-analyzer** - Bundle size analysis

## Package Manager

- **Yarn 3.6.1** (Berry) with PnP mode

## Common Commands

```bash
# Development
yarn dev              # Start dev server at localhost:3000
yarn start            # Alias for dev

# Production
yarn build            # Build for production
yarn serve            # Start production server

# Analysis
yarn analyze          # Build with bundle analyzer

# Code Quality
yarn lint             # Run ESLint (via husky pre-commit)
yarn format           # Run Prettier (via lint-staged)
```

## Build Configuration

- **next.config.js** - Next.js configuration with security headers, CSP
- **contentlayer.config.ts** - Content schema and MDX plugin configuration
- **tsconfig.json** - TypeScript with path aliases (@/components, @/data, etc.)
- **eslint.config.mjs** - Flat ESLint config with TypeScript support
- **prettier.config.js** - Prettier with Tailwind plugin

## Environment Variables

Key environment variables (see `.env.example`):
- `NEXT_PUBLIC_GISCUS_*` - Giscus comments configuration
- `NEXT_UMAMI_ID` - Umami analytics
- `BASE_PATH` - For subdirectory deployments
- `EXPORT` - Enable static export
- `UNOPTIMIZED` - Disable image optimization for static hosting

## Deployment Targets

- **Vercel** (recommended) - Zero-config deployment
- **Netlify** - Next.js runtime support
- **Static hosting** - GitHub Pages, S3, Firebase (with `EXPORT=1`)
