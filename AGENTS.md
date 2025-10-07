# Repository Guidelines

## Project Structure & Module Organization
The Next.js App Router lives in `app/`, with routes grouped by feature: `app/blog` for posts, `app/projects` for portfolio entries, and `app/api` for supporting endpoints. Shared UI sits in `components/`, while `layouts/` hosts page wrappers and theme shells. `data/` stores authors, navigation, and markdown/MDX sources compiled by Contentlayer. Static assets belong under `public/` (use `public/static/images` for post media), and helper scripts live in `scripts/`. Global styling tokens and Tailwind directives stay in `css/`.

## Content & Assets
Create new articles as Markdown or MDX under `data/blog`. Keep filenames kebab-case and include front matter fields (`title`, `date`, `tags`, `summary`, `draft`). Author profiles reside in `data/authors`. When adding images, optimize dimensions and export WebP or AVIF when possible before placing them in `public/static/images/{post-slug}/`.

## Build, Test, and Development Commands
- `yarn` installs dependencies via Yarn 3 (Plug'n'Play disabled).
- `yarn dev` launches the local dev server with Contentlayer watching.
- `yarn build` runs the production Next.js build and invokes `scripts/postbuild.mjs` to refresh feeds and sitemaps.
- `yarn start` serves the optimized build.
- `yarn lint` applies ESLint checks across `pages`, `app`, `components`, `layouts`, `lib`, and `scripts`.

## Coding Style & Naming Conventions
Stick to TypeScript wherever possible, using PascalCase for components, camelCase for hooks/utilities, and kebab-case for route segments. Prettier (see `prettier.config.js`) enforces two-space indentation and Tailwind class sorting; run `npx prettier --check .` before committing out-of-band edits. React components should stay functional, colocate styles via Tailwind utility classes, and keep props typed explicitly. Favor Contentlayer data fetching over manual filesystem reads.

## Testing Guidelines
The repo currently relies on linting and manual verification. Always run `yarn lint` and smoke-test your change in `yarn dev`, covering light/dark themes and mobile layouts. When adding logic-heavy modules, accompany them with unit tests (Vitest or Jest) under a new `__tests__/` directory and document execution steps in the PR.

## Commit & Pull Request Guidelines
Existing history follows short, imperative messages (e.g., `Initial commit`), so keep summaries under 72 characters and elaborate in the body if needed. Reference related issues with `Closes #123` and note migration steps or schema changes. Pull requests should describe the user-visible impact, list manual test results, and attach before/after screenshots or recordings for UI updates.
