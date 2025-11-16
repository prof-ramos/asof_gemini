# Repository Guidelines

## Project Structure & Module Organization
- `app/` holds the Next.js App Router pages, layouts, and `globals.css`; content sections live in route folders (e.g., `sobre`, `atuacao`, `noticias/[slug]`).
- `components/` contains shared UI, layout, and section blocks; keep reusable parts in `components/ui/` and page-specific slices in `components/sections/`.
- `content/noticias/` stores MDX articles with frontmatter; align slugs with filenames.
- `lib/`, `hooks/`, and `types/` provide shared utilities, hooks, and TypeScript types; prefer adding helpers here instead of duplicating logic.
- `prisma/` holds `schema.prisma`, migrations, and seeds; `public/` keeps static assets; `e2e/` contains Playwright specs and fixtures.

## Build, Test, and Development Commands
- Install deps: `npm install`
- Local dev: `npm run dev` (Next.js with App Router)
- Production build: `npm run build`; start preview: `npm start`
- Lint/format check: `npm run lint`
- E2E tests (Playwright): `npm run test:e2e`; UI mode: `npm run test:e2e:ui`; single browser: `npm run test:e2e:chromium|firefox|webkit`
- Database workflows (Prisma): `npm run db:migrate` for dev migrations, `npm run db:migrate:deploy` for deploy, `npm run db:seed` for seed data; ensure `DATABASE_URL` is set in `.env.local`.

## Coding Style & Naming Conventions
- Language: TypeScript with strict settings; favor typed props/returns and `unknown` over `any`.
- Components use PascalCase filenames; utility modules use camelCase and live in `lib/`.
- Styling: Tailwind CSS; prefer composable utility classes and `clsx`/`tailwind-merge` helpers in `lib/utils.ts`.
- MDX content: frontmatter drives metadata; keep titles sentence-case and slugs kebab-case.
- Run `npm run lint` before pushing to keep ESLint + Next.js rules green.

## Testing Guidelines
- Test suite: Playwright in `e2e/`; add new specs alongside related routes/components.
- Prefer deterministic data: seed via Prisma or mock network calls when possible; avoid hitting production services.
- Naming: use descriptive test titles, scoped by page/feature (e.g., `noticias page shows latest posts`).
- Accessibility and performance checks exist (`npm run test:a11y`, `npm run test:performance`); run them for UI-heavy changes.

## Commit & Pull Request Guidelines
- Follow conventional-style prefixes seen in history (`feat: ...`, `fix: ...`); keep subjects concise and imperative.
- Commits should bundle related changes only; include migrations or seeds in the same commit that requires them.
- PRs: provide a short summary, testing notes (`npm run lint`, `npm run test:e2e`, etc.), linked issues/tasks, and UI screenshots for visible changes.
- Highlight any config/env updates (`.env.local`, `prisma`). Avoid committing secrets or generated binaries.

## Security & Configuration Tips
- Never commit `.env*` files or database dumps; populate `.env.local` with local credentials only.
- Review `PRISMA_SETUP.md` before altering the schema; regenerate client (`npm run db:generate`) after schema edits.
- Validate redirects and robots rules when touching `app/sitemap.ts` or `app/robots.ts` to avoid leaking drafts.
