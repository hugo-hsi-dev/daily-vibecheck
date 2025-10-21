# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Product Vision

**Daily Vibecheck** is a personality tracking PWA inspired by 16 Personalities/MBTI, but designed for continuous tracking over time rather than one-time quizzes.

**Core Concept:**

- Users answer **3 questions per day** with binary choices (Agree/Disagree)
- Their MBTI type **updates dynamically** based on accumulated responses
- They can view their **type history** and see how their personality has evolved
- Designed as a **PWA** for mobile installation and offline capability

**User Flow:**

1. Sign up with email/password (better-auth)
2. Onboarding: Answer 10 curated questions → initial MBTI type calculated
3. Daily: 3 random questions from a bank of ~100 → type updates dynamically
4. Dashboard: See current type + historical charts (by month/year)

**Key Features:**

- Low-friction daily engagement (just 3 questions with binary answers)
- Dynamic type calculation algorithm (to be designed)
- Historical tracking with month/year granularity
- PWA with offline support
- Requires login to use

## Project Overview

Daily Vibecheck is a SvelteKit application using TypeScript, Tailwind CSS v4, and PostgreSQL with Drizzle ORM. The project uses the Node adapter for deployment.

## Development Commands

### Running the Application

- `npm run dev` - Start development server with Vite
- `npm run build` - Build for production
- `npm run preview` - Preview production build (runs on port 4173)

### Code Quality

- `npm run check` - Run Svelte type checking with TypeScript
- `npm run check:watch` - Run type checking in watch mode
- `npm run lint` - Run Prettier and ESLint checks
- `npm run format` - Format all files with Prettier

### Testing

- `npm run test:unit` - Run Vitest unit tests interactively
- `npm run test:unit -- --run` - Run unit tests once (CI mode)
- `npm run test:e2e` - Run Playwright end-to-end tests
- `npm test` - Run both unit and e2e tests

**Test Organization:**

- Client-side Svelte component tests: `src/**/*.svelte.{test,spec}.{js,ts}` (run in browser with Playwright)
- Server-side tests: `src/**/*.{test,spec}.{js,ts}` (exclude `.svelte.{test,spec}` files, run in Node)
- E2E tests: `e2e/*.test.ts` (Playwright tests that build and preview the app first)
- Vitest is configured with `expect.requireAssertions: true` - all tests must include at least one assertion

### Database Commands

- `npm run db:start` - Start PostgreSQL database via Docker Compose
- `npm run db:push` - Push schema changes to database (development)
- `npm run db:generate` - Generate migration files from schema
- `npm run db:migrate` - Run migrations
- `npm run db:studio` - Open Drizzle Studio (database GUI)

**Database Setup:**

- Requires `DATABASE_URL` environment variable in `.env` file
- Schema is defined in `src/lib/server/db/schema.ts`
- Database client is initialized in `src/lib/server/db/index.ts` using `postgres-js`
- Uses Drizzle ORM with PostgreSQL dialect

## Architecture

### Directory Structure

- `src/routes/` - SvelteKit file-based routing (pages and API endpoints)
- `src/lib/` - Shared library code (exported via `$lib` alias)
- `src/lib/server/` - Server-only code (never bundled for client)
- `src/lib/server/db/` - Database configuration and schema
- `e2e/` - Playwright end-to-end tests

### Key Configuration Files

- `svelte.config.js` - SvelteKit configuration with Node adapter
- `vite.config.ts` - Vite configuration with Tailwind CSS v4 plugin and Vitest test projects
- `drizzle.config.ts` - Drizzle Kit configuration (schema path, PostgreSQL dialect)
- `eslint.config.js` - Flat ESLint config with TypeScript and Svelte support
- `.prettierrc` - Prettier config (tabs, single quotes, Tailwind plugin)

### Code Style

- Uses **tabs** for indentation (not spaces)
- Single quotes for strings
- No trailing commas
- 100 character print width
- Prettier with Tailwind CSS class sorting enabled

### SvelteKit Conventions

- Uses Svelte 5 with runes (modern reactivity)
- `+page.svelte` - Page components
- `+layout.svelte` - Layout components
- `+page.server.ts` / `+layout.server.ts` - Server-side load functions and actions
- `+page.ts` / `+layout.ts` - Universal load functions
- Server-only code must be in `src/lib/server/` or `*.server.ts` files

### Environment Variables

- Accessed via `$env/dynamic/private` for server-side runtime variables
- `DATABASE_URL` is required for database connections

## Data Model

### Core Tables

- **users** - Account information (email, password hash via better-auth)
- **questions** - MBTI questions (~100 curated questions with category/dimension info)
- **responses** - User answers (user_id, question_id, answer (agree/disagree), created_at)
- **type_history** - Historical MBTI types (user_id, mbti_type, date)

### MBTI Dimensions

- **E/I** - Extroversion/Introversion
- **S/N** - Sensing/Intuition
- **T/F** - Thinking/Feeling
- **J/P** - Judging/Perceiving

Each question should target one dimension and one pole (e.g., "Extroversion" vs "Introversion").

## Implementation Roadmap

Priority order for MVP:

1. Database schema + better-auth setup
2. Generate 100 curated MBTI questions (balanced across 4 dimensions)
3. Authentication pages (signup, login, logout)
4. Onboarding flow (10 questions → initial type)
5. MBTI type calculation algorithm
6. Daily quiz page (3 random questions)
7. Dashboard with current type display
8. Historical charts (month/year views)
9. PWA setup (vite-pwa)
10. Testing and polish

## Notes for Future Sessions

- **MBTI Algorithm**: Design how to calculate type from accumulated responses (simple majority vote per dimension, or weighted scoring?)
- **Question Distribution**: Ensure 100 questions are evenly distributed across 8 poles (E/I, S/N, T/F, J/P) for balanced tracking
- **Type History Granularity**: Store type daily? Or only when it changes?
- **GDPR**: Defer for now, add privacy policy + account deletion + data export later
