# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # Start Vite dev server
pnpm build        # Type-check and build static files into dist/
pnpm preview      # Serve the production build locally
pnpm lint         # Run ESLint on src/
pnpm type-check   # Run tsc --noEmit
pnpm format       # Run Prettier on src/
```

## Stack

- **HTML + TypeScript** (strict mode), no UI framework
- **Vite** as dev server and bundler
- **ESLint** (typescript-eslint) + **Prettier**
- **pnpm** as the package manager
- Production image: static files from `dist/` served by nginx

## Project profile

- README profile: application end-user (B.1)
- RELEASES profile: utilisateur final non-tech (B.1)

## Architecture

Entry point: `index.html` loads `src/main.ts` and `src/styles.css`.

### Layers

Business code lives in `src/modules/<feature>/`:

- `ui/`: DOM rendering and event wiring. Imports `core/`, never `infra/`.
- `core/`: types, state and game logic. Never imports `ui/`.
- `infra/`: external calls (HTTP, storage, files). Imports only types of `core/` (`import type`), never `ui/`.

`@typescript-eslint/no-restricted-imports` in `eslint.config.mjs` enforces these rules.

Shared utilities live in `src/shared/`.
