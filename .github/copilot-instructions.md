## Why this repo is structured this way

- This is a Next.js (App Router) TypeScript project. The `src/app` folder defines routes — any directory with a `page.tsx` becomes a route.
- `/lib` holds non-route shared code and small component libraries (see `src/lib/shared` mentioned in the root README).
- Components are organized under `src/components` by feature (media, header, details, calendar, etc.). Many components are server components by default; client components are explicitly marked with a top-line "use client".

## Quick developer commands (use exact scripts)
- Install: `npm install`
- Dev server: `npm run dev` (Next dev at http://localhost:3000)
- Build: `npm run build`
- Start (production): `npm run start`
- Tests: `npm run test` (or `npm run test:watch` for iterative work)
- Lint: `npm run lint`

## Key patterns and conventions for AI agents
- Routing: add a new page by creating a folder under `src/app` with a `page.tsx`. Use nested folders for nested routes.
- Server vs Client components: by default use server components. If you need client-side hooks/state/events, top of the file must contain exactly `"use client"` (examples: `src/components/media/media-grid.tsx`, `src/app/login/page.tsx`).
- Naming conventions: some components include `-client` or `-server` in filenames (e.g., `header-client.tsx`, `title-server.tsx`) to make intent explicit — follow that pattern when adding variants.
- Shared UI lives in `src/lib` (library/shared bits). Prefer reusing existing shared components rather than copying.

## Integration points (where to look first)
- Firebase: `src/lib/firebase/{config,client,auth,admin}.ts` — auth and DB helper functions live here. If you change authentication flow, update these files and check `src/lib/clientLogout.ts`.
- NextAuth / session: see `src/app/api/session` and `next-auth` usage in `package.json` deps.
- External APIs: The project consumes TMDB, justwatch, and `streaming-availability` packages (check `src/utils/api` and `src/lib/fetch*` helpers). When calling external APIs, follow existing `fetchMulti`/`fetchByTitle` helpers.

## Testing and CI expectations
- Tests run with Jest (see `jest.config.js` and `jest.setup.js`). Use `npm run test` for CI-like runs. Unit tests use `@testing-library/react`.
- Keep tests fast and isolated: prefer mocking network calls and firebase helpers (see `src/utils/test-utils.tsx`).

## Small, concrete examples for common tasks
- Add a new route: create `src/app/my-feature/page.tsx` and export a React component (no `use client` unless it needs hooks/events).
- Make a component interactive: add `"use client"` at top, import hooks from `src/hooks` (e.g., `useWatchlist`) and follow existing patterns in `src/components/buttons/*`.
- Update auth: inspect `src/lib/firebase/*` and `src/app/api/logout` — sessions are bridged in `src/lib/clientLogout.ts`.

## Files to read first (high signal)
- `README.md` — repo overview and routing note
- `package.json` — exact scripts and deps
- `src/app` — routes and pages
- `src/components` — UI by feature
- `src/lib/firebase/*` — firebase integration
- `jest.config.js`, `jest.setup.js` — test harness

If any section above is unclear or you'd like more examples (for example, a short walkthrough modifying auth or adding a page + test), tell me which area to expand and I will update this file.
