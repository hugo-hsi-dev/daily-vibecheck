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

### Type-Safe Routing

**Always use `resolve()` for internal navigation** to ensure routes are validated at compile time and properly handle base path configuration.

```typescript
import { resolve } from '$app/paths';
import { goto } from '$app/navigation';

// ✅ CORRECT: Use resolve() with goto()
await goto(resolve('/dashboard'));
await goto(resolve('/blog/[slug]', { slug: 'hello-world' }));

// ✅ CORRECT: Use resolve() in href attributes
<a href={resolve('/about')}>About</a>
<a href={resolve('/posts/[id]', { id: '123' })}>View Post</a>

// ❌ WRONG: Hardcoded paths (fails ESLint svelte/no-navigation-without-resolve)
await goto('/dashboard');
<a href="/about">About</a>
```

**Why use `resolve()`?**

1. **Type safety** - Routes are validated at compile time, preventing broken links during refactoring
2. **Base path handling** - Automatically prefixes routes with configured base path
3. **ESLint enforcement** - The `svelte/no-navigation-without-resolve` rule (enabled in recommended config) catches missing `resolve()` calls
4. **Dynamic routes** - Properly populates route parameters with type checking

**Exceptions:** Absolute URLs (e.g., `https://example.com`), fragment URLs (e.g., `#section`), and empty strings for shallow routing don't require `resolve()`.

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

### Phase 1: Foundation (Auth + Database)

1. **Database schema** - Set up PostgreSQL tables for users, questions, responses, type_history
2. **better-auth setup** - Configure authentication with email/password
3. **Auth pages** - Build signup/login pages

### Phase 2: Content (Questions + Algorithm)

4. **Curate 100 MBTI questions** - Create balanced questions across E/I, S/N, T/F, J/P poles
5. **MBTI algorithm** - Implement type calculation logic from responses

### Phase 3: Core Features (User Flows)

6. **Onboarding** - 10 questions → initial type calculation
7. **Daily quiz** - 3 random questions per day
8. **Dashboard** - Display current MBTI type

### Phase 4: Polish & Analysis

9. **Historical tracking** - Charts showing type evolution (month/year views)
10. **PWA setup** - Make it installable on mobile
11. **Testing** - Comprehensive test coverage

### Recommended Approach

Start with **Phase 1** (Database + Auth), as everything else depends on it:

- Database schema provides data persistence
- better-auth handles user management
- Auth pages enable user access

Once Phase 1 is solid, Phase 2 (questions + algorithm) is critical as it's the core logic of the app.

## Testing Patterns

### Essential Setup for Component Tests

Every component test file should start with:

```typescript
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { page } from '@vitest/browser/context';
import { createRawSnippet } from 'svelte';
import { flushSync, untrack } from 'svelte';
```

### The Golden Rule: Always Use Locators

**✅ DO: Use page locators (auto-retry, semantic)**

```typescript
const button = page.getByRole('button', { name: 'Submit' });
await button.click();
```

**❌ DON'T: Use containers (no auto-retry, manual queries)**

```typescript
const { container } = render(MyButton);
const button = container.querySelector('button'); // Never do this
```

### Locator Hierarchy (Use in Order)

1. **Semantic roles** (best for accessibility):
   - `page.getByRole('button', { name: 'Submit' })`
   - `page.getByRole('textbox', { name: 'Email' })`
2. **Labels** (good for forms): `page.getByLabel('Email address')`
3. **Text content** (good for unique text): `page.getByText('Welcome back')`
4. **Test IDs** (fallback): `page.getByTestId('submit-button')`

### Handling Multiple Elements (Strict Mode)

Vitest Browser operates in strict mode - if multiple elements match, you'll get an error:

```typescript
// ❌ FAILS: "strict mode violation" if multiple elements match
page.getByRole('link', { name: 'Home' });

// ✅ CORRECT: Use .first(), .nth(), .last()
page.getByRole('link', { name: 'Home' }).first();
page.getByRole('link', { name: 'Home' }).nth(1); // Second element (0-indexed)
page.getByRole('link', { name: 'Home' }).last();
```

### Common Role Confusion Fixes

```typescript
// ❌ WRONG: Input role doesn't exist
page.getByRole('input', { name: 'Email' });

// ✅ CORRECT: Use textbox for input elements
page.getByRole('textbox', { name: 'Email' });

// ❌ WRONG: Looking for link when element has role="button"
page.getByRole('link', { name: 'Submit' }); // <a role="button">Submit</a>

// ✅ CORRECT: Use the actual role
page.getByRole('button', { name: 'Submit' });
```

### Testing Svelte 5 Runes

Use `untrack()` when testing derived state:

```typescript
it('should handle reactive state', () => {
	let count = $state(0);
	let doubled = $derived(count * 2);

	expect(untrack(() => doubled)).toBe(0);

	count = 5;
	flushSync(); // Ensure derived state updates
	expect(untrack(() => doubled)).toBe(10);
});
```

**Important**: Runes (`$state`, `$derived`) can only be used in `.test.svelte.ts` files, not regular `.ts` files!

### Form Testing Pattern

```typescript
it('should handle form input and validation', async () => {
	render(MyForm);

	const email_input = page.getByLabel('Email');
	await email_input.fill('[email protected]');

	await expect.element(email_input).toHaveValue('[email protected]');

	// Test validation
	await email_input.fill('invalid-email');
	await email_input.blur();

	await expect.element(page.getByText('Invalid email format')).toBeInTheDocument();
});
```

### Button Click Pattern

```typescript
it('should handle click events', async () => {
	const click_handler = vi.fn();
	render(MyButton, { onclick: click_handler, children: 'Click me' });

	const button = page.getByRole('button', { name: 'Click me' });
	await button.click();

	expect(click_handler).toHaveBeenCalledOnce();
});

// For animated elements:
await button.click({ force: true });
```

### Common First-Day Issues

1. **"strict mode violation"**: Multiple elements match - use `.first()`, `.nth()`, `.last()`
2. **Test hanging**: Usually from clicking SvelteKit form submits - test state directly instead
3. **"Expected 2 arguments, but got 0"**: Mock function signature doesn't match real function
4. **Wrong roles**: Remember `textbox` not `input`, check actual `role` attributes

### Client-Server Alignment Strategy

Server tests should use real `FormData` and `Request` objects instead of heavy mocking:

```typescript
// ✅ CORRECT: Real FormData catches field name mismatches
const form_data = new FormData();
form_data.append('email', '[email protected]');
const request = new Request('http://localhost/api/register', {
	method: 'POST',
	body: form_data
});

// ❌ BRITTLE: Heavy mocking hides real issues
const mock_request = { formData: vi.fn().mockResolvedValue(...) };
```

### Foundation First Approach

Start with complete test structure using `describe` and `it.skip` to plan comprehensively:

```typescript
describe('TodoManager Component', () => {
	describe('Initial Rendering', () => {
		it('should render empty state', async () => {
			// Implement first test
		});

		it.skip('should render with initial todos', async () => {
			// TODO: Test with pre-populated data
		});
	});

	describe('User Interactions', () => {
		it.skip('should add new todo', async () => {
			// TODO: Test adding todos
		});

		it.skip('should delete todo', async () => {
			// TODO: Test deletion flow
		});
	});

	describe('Edge Cases', () => {
		it.skip('should handle empty data gracefully', async () => {
			// TODO: Test edge cases
		});
	});
});
```

**Benefits:**

- Complete picture of all requirements upfront
- Incremental progress by removing `.skip` as features are implemented
- No forgotten tests - all edge cases planned from start
- Flexible coverage - implement tests as needed, not for arbitrary metrics

### Avoid Testing Implementation Details

**❌ DON'T test exact SVG paths or internal markup:**

```typescript
// Brittle - breaks when icon library updates
expect(body).toContain('M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z');
```

**✅ DO test semantic meaning and user experience:**

```typescript
await expect.element(page.getByRole('img', { name: /success/i })).toBeInTheDocument();
await expect.element(page.getByTestId('status-icon')).toHaveClass('text-success');
```

### Testing Checklist

- ✅ Use `describe` and `it` (not `test`) for consistency
- ✅ Use `it.skip` for planned tests - Foundation First approach
- ✅ Use `page.getBy*()` locators - never containers
- ✅ Always await locator assertions: `await expect.element()`
- ✅ Use `.first()`, `.nth()`, `.last()` for multiple elements
- ✅ Use `untrack()` for `$derived`: `expect(untrack(() => derived_value))`
- ✅ Use `force: true` for animations: `await element.click({ force: true })`
- ✅ Handle role confusion: `textbox` not `input`, check actual `role` attributes
- ✅ Test user value, not implementation details (no SVG paths!)
- ✅ Share validation logic between client and server
- ✅ Use real `FormData`/`Request` objects in server tests

## E2E Testing (Playwright)

### Purpose

E2E tests complete the **Client-Server Alignment Strategy** by testing the full user journey from browser to server and back. They validate:

- Complete form submission flows
- Client-server integration
- Real network requests
- Full user workflows

### Basic E2E Pattern

```typescript
// e2e/registration.spec.ts
import { test, expect } from '@playwright/test';

test('user registration flow', async ({ page }) => {
	await page.goto('/register');

	await page.getByLabel('Email').fill('[email protected]');
	await page.getByLabel('Password').fill('secure123');
	await page.getByRole('button', { name: 'Register' }).click();

	// Tests the complete client-server integration
	await expect(page.getByText('Welcome!')).toBeVisible();
});
```

### When to Write E2E Tests

E2E tests are the **final safety net** but are slower and more expensive to run. Use them for:

- Critical user journeys (signup, login, core workflows)
- Complete form submissions with server validation
- Multi-step processes (onboarding, checkout, etc.)
- Integration between multiple pages/features

**Don't** use E2E tests for:

- UI component behavior (use component tests instead)
- Input validation (test in components)
- Individual button clicks (use component tests)

### E2E vs Component Tests

| Test Type       | Use For                                | Speed | Cost |
| --------------- | -------------------------------------- | ----- | ---- |
| Component Tests | UI behavior, validation, interactions  | Fast  | Low  |
| E2E Tests       | Full workflows, client-server contract | Slow  | High |

**Strategy**: Write many component tests, few critical E2E tests.

## Notes for Future Sessions

- **MBTI Algorithm**: Design how to calculate type from accumulated responses (simple majority vote per dimension, or weighted scoring?)
- **Question Distribution**: Ensure 100 questions are evenly distributed across 8 poles (E/I, S/N, T/F, J/P) for balanced tracking
- **Type History Granularity**: Store type daily? Or only when it changes?
- **GDPR**: Defer for now, add privacy policy + account deletion + data export later
