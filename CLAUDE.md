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

- `npm run dev` - Start development server with Vite, PostgreSQL database, and Vitest in watch mode
- `npm run build` - Build for production
- `npm run preview` - Preview production build (runs on port 4173)

### Code Quality

- `npm run check` - Run Svelte type checking with TypeScript
- `npm run check:watch` - Run type checking in watch mode
- `npm run lint` - Run Prettier and ESLint checks
- `npm run format` - Format all files with Prettier

### Testing

- `npm test` - Run all tests once (CI mode)

**Test Organization:**

- Client-side Svelte component tests: `src/**/*.svelte.{test,spec}.{js,ts}` (run in browser with Playwright)
- Server-side tests: `src/**/*.{test,spec}.{js,ts}` (exclude `.svelte.{test,spec}` files, run in Node)
- Vitest is configured with `expect.requireAssertions: true` - all tests must include at least one assertion
- Tests run automatically in watch mode during `npm run dev`

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

### Feature-Based Architecture

This project uses **feature-based organization** rather than organizing by file type (e.g., `components/`, `utils/`, `remote-functions/`). Each feature is a self-contained module with strict boundaries that prevent cross-feature dependencies.

**Philosophy:**

- Features are organized by domain (e.g., `auth`, `questions`, `dashboard`)
- All related files for a feature live together in `src/lib/[feature]/`
- Features **cannot import from each other** - this enforces isolation
- Only **routes** (`src/routes/`) can compose multiple features together
- Keeps the codebase cohesive and makes refactoring easier

#### Standard Feature Structure

Every feature follows this structure:

```
src/lib/[feature]/
├── components/          # UI components (always)
├── remotes/             # Remote functions (always)
│   ├── queries.remote.ts      # Query functions (read data)
│   ├── queries.logic.ts       # Pure testable query logic (optional)
│   ├── queries.logic.test.ts  # Unit tests for query logic (optional)
│   ├── mutations.remote.ts    # Form and command functions (write data)
│   ├── mutations.logic.ts     # Pure testable mutation logic (optional)
│   └── mutations.logic.test.ts # Unit tests for mutation logic (optional)
├── schemas.ts           # Zod validation schemas (always, shared client/server)
├── utils.ts             # Pure helper functions (optional)
├── constants.ts         # Feature-specific constants (optional)
├── types.ts             # Shared TypeScript types (rare - use type inference!)
└── *.server.ts          # Server-only code (optional, as needed)
```

**File Type Guidelines:**

- **`components/`** - Svelte UI components used by this feature
- **`remotes/`** - Remote functions folder (always present)
  - **`queries.remote.ts`** - Query functions for fetching data (read-only)
    - Usage: `import { getUser } from '$lib/auth/remotes/queries'`
    - Thin wrappers around `query()` that call logic functions
  - **`queries.logic.ts`** - Pure business logic for queries (optional, for unit testing)
    - Uses dependency injection for testability
    - Example: `getUserLogic({ event })`, `validateUserLogic({ getUser })`
  - **`queries.logic.test.ts`** - Unit tests for query logic
  - **`mutations.remote.ts`** - Form and command functions for modifying data
    - Usage: `import { signup, signin } from '$lib/auth/remotes/mutations'`
    - Thin wrappers around `form()` and `command()` that call logic functions
  - **`mutations.logic.ts`** - Pure business logic for mutations (optional, for unit testing)
    - Uses dependency injection for testability
  - **`mutations.logic.test.ts`** - Unit tests for mutation logic
- **`schemas.ts`** - Zod validation schemas (used by remote functions and components)
  - Shared between client and server (no duplication)
  - No `.server.ts` suffix because validation rules are identical
- **`utils.ts`** - Pure utility functions specific to this feature
  - Examples: `formatMBTIType()`, `calculateTypeFromResponses()`
- **`constants.ts`** - Static configuration values
  - Examples: `MBTI_DIMENSIONS`, `QUESTIONS_PER_DAY = 3`
- **`types.ts`** - Shared TypeScript types/interfaces (rarely needed)
  - Most types are inferred from schemas, database, or remote functions
  - Only create if you have types that can't be inferred
- **`*.server.ts`** - Server-only files (e.g., `auth.server.ts`, `service.server.ts`)
  - Never bundled for client - safe for secrets, sensitive logic
  - Examples: better-auth instances, database queries, business logic
  - Naming: `[feature].server.ts` or `[name].server.ts` (e.g., `queries.server.ts`)

#### Example Features

**Auth feature:**

```
src/lib/auth/
├── components/
│   ├── sign-in-form.svelte
│   └── sign-up-form.svelte
├── remotes/
│   ├── queries.remote.ts      # getUser, validateUser (thin wrappers)
│   ├── queries.logic.ts       # getUserLogic, validateUserLogic (testable)
│   ├── queries.logic.test.ts  # Unit tests for query logic
│   ├── mutations.remote.ts    # signup, signin (thin wrappers)
│   ├── mutations.logic.ts     # signupLogic, signinLogic (testable)
│   └── mutations.logic.test.ts # Unit tests for mutation logic
├── auth.server.ts             # Better-auth instance
└── schemas.ts                 # signInSchema, signUpSchema
```

**Questions feature:**

```
src/lib/questions/
├── components/
│   ├── question-card.svelte
│   └── answer-buttons.svelte
├── remotes/
│   ├── queries.remote.ts      # getDailyQuestions, getTypeHistory
│   └── mutations.remote.ts    # submitAnswer, calculateType
├── service.server.ts          # MBTI calculation algorithm
├── schemas.ts                 # answerSchema, questionSchema
└── constants.ts               # MBTI_DIMENSIONS, QUESTIONS_PER_DAY
```

#### Database Schema Organization

The database layer is **centralized** but with special handling for better-auth:

```
src/lib/server/db/
├── index.ts              # DB client (postgres-js + Drizzle)
├── schema.ts             # Application tables (hand-written)
│                         # Tables: questions, responses, type_history, etc.
└── auth-schema.ts        # Better-auth generated tables (auto-generated)
                          # Tables: users, sessions, accounts, verifications
```

**Why separate?**

- Better-auth auto-generates and manages its schema - keep it isolated
- Application schema is hand-written and evolved by the team
- Prevents accidental edits to auto-generated auth tables
- Different migration workflows (auth migrations vs app migrations)

**All features import the same DB client:**

```typescript
// src/lib/questions/service.server.ts
import { db } from '$lib/server/db';
import { questions, responses } from '$lib/server/db/schema';
import { users } from '$lib/server/db/auth-schema';

export async function calculateUserType(userId: string) {
	const user_responses = await db.select().from(responses).where(eq(responses.userId, userId));
	// ...
}
```

#### Routes as the Composition Layer

Routes (`src/routes/`) are where features come together. Routes import components and remote functions from features and compose them.

**Example: Auth sign-in route**

```svelte
<!-- src/routes/auth/sign-in/+page.svelte -->
<script lang="ts">
	import SignInForm from '$lib/auth/components/sign-in-form.svelte';
</script>

<div class="sign-in-page">
	<SignInForm />
</div>
```

```svelte
<!-- src/lib/auth/components/sign-in-form.svelte -->
<script lang="ts">
	import { signin } from '$lib/auth/remotes/mutations';
	import { signInSchema } from '$lib/auth/schemas';
</script>

<form {...signin}>
	<!-- Form implementation -->
</form>
```

#### Feature Isolation Rules

**✅ ALLOWED:**

```typescript
// Feature imports from itself
import { getDailyQuestions } from '$lib/questions/remotes/queries';
import { submitAnswer } from '$lib/questions/remotes/mutations';
import QuestionCard from '$lib/questions/components/question-card.svelte';

// Route imports from multiple features
import SignInForm from '$lib/auth/components/sign-in-form.svelte';
import { getUser } from '$lib/auth/remotes/queries';
import { signin } from '$lib/auth/remotes/mutations';

// All features can import DB client
import { db } from '$lib/server/db';
```

**❌ NOT ALLOWED:**

```typescript
// ❌ Feature importing from another feature
// src/lib/dashboard/index.remote.ts
import { getDailyQuestions } from '$lib/questions'; // NO!

// ❌ Cross-feature component imports
// src/lib/auth/components/sign-in-form.svelte
import QuestionCard from '$lib/questions/components/question-card.svelte'; // NO!
```

**Solution for cross-feature logic:**

If you need shared logic between features, consider:

1. **Move to a shared feature** - Create `src/lib/shared/` for truly cross-cutting concerns
2. **Move to server layer** - Put shared logic in `src/lib/server/` for server-only operations
3. **Compose in routes** - Let routes coordinate between features, not the features themselves

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
- Server-only code must be in `src/lib/server/` or `*.server.ts` files

**IMPORTANT:** This project uses **remote functions** instead of traditional load functions (`+page.server.ts`, `+page.ts`) and form actions. Remote functions provide better type safety, more flexible DX, and can be called from anywhere in your application.

### Remote Functions - Mandatory Usage

**This project exclusively uses SvelteKit remote functions for all server communication.** No load functions or form actions should be used.

Remote functions are type-safe server functions exported from `.remote.ts` files that can be called from anywhere in your application. They execute on the server while being callable like regular functions from components.

**Enable in `svelte.config.js`:**

```javascript
const config = {
	kit: {
		experimental: {
			remoteFunctions: true
		}
	},
	compilerOptions: {
		experimental: {
			async: true
		}
	}
};
```

#### Query Functions (Read Data)

Use `query()` for fetching dynamic data from the server. Queries return Promise-like objects with `loading`, `error`, and `current` properties.

**✅ CORRECT: Query function in `.remote.ts` file**

```typescript
// src/routes/blog/data.remote.ts
import { query } from '$app/server';
import * as db from '$lib/server/database';

export const getPosts = query(async () => {
	const posts = await db.sql`
		SELECT title, slug FROM post ORDER BY published_at DESC
	`;
	return posts;
});
```

**Component usage with await:**

```svelte
<script lang="ts">
	import { getPosts } from './data.remote';
</script>

<ul>
	{#each await getPosts() as { title, slug }}
		<li><a href="/blog/{slug}">{title}</a></li>
	{/each}
</ul>
```

**Alternative with loading states:**

```svelte
<script lang="ts">
	import { getPosts } from './data.remote';
	const posts_query = getPosts();
</script>

{#if posts_query.error}
	<p>Error loading posts</p>
{:else if posts_query.loading}
	<p>Loading...</p>
{:else}
	<ul>
		{#each posts_query.current as post}
			<li>{post.title}</li>
		{/each}
	</ul>
{/if}
```

**Query with arguments (requires validation):**

```typescript
import { query } from '$app/server';
import { z } from 'zod';

export const getPost = query(z.object({ slug: z.string() }), async ({ slug }) => {
	const post = await db.query.posts.findFirst({
		where: (table, { eq }) => eq(table.slug, slug)
	});
	return post;
});
```

**Note:** This project uses **Zod** for schema validation across both client and server code.

**Cross-field validation** (e.g., password confirmation):

```typescript
import { z } from 'zod';

const signupSchema = z
	.object({
		password: z.string().min(8, 'Password must be at least 8 characters'),
		confirmPassword: z.string().min(1, 'Please confirm your password')
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Passwords do not match',
		path: ['confirmPassword'] // Attach error to confirmPassword field
	});
```

Use `.refine()` with the `path` option to validate that two fields match and attach the error message to a specific field.

#### Form Functions (Submit Data with Forms)

Use `form()` for handling form submissions with validation and progressive enhancement.

**✅ CORRECT: Form function with validation and error handling**

```typescript
// src/lib/auth/index.remote.ts
import { form } from '$app/server';
import { z } from 'zod';
import { APIError } from 'better-auth/api';
import { auth } from '$lib/auth';
import { signupSchema } from './schemas';

export const signup = form(signupSchema, async (data, { invalid }) => {
	try {
		await auth.api.signUpEmail({
			body: {
				name: data.name,
				email: data.email,
				password: data.password
			}
		});

		return { success: true };
	} catch (error) {
		// Handle better-auth APIError
		if (error instanceof APIError) {
			if (error.message.includes('already exists')) {
				invalid.email('An account with this email already exists');
			} else {
				invalid(error.message || 'Sign up failed');
			}
		} else {
			invalid('An unexpected error occurred. Please try again.');
		}
	}
});
```

**Error Handling with `invalid()`:**

The `invalid()` function is used to handle validation failures:

- `invalid.fieldName(message)` - Field-specific errors (type-safe)
- `invalid(message)` - Form-level errors (accessible via `fields.allIssues()`)
- Automatically sets `aria-invalid` attributes on form fields
- Prevents form submission when called

**Component usage (spreads onto form element):**

```svelte
<!-- src/lib/auth/components/sign-up-form.svelte -->
<script lang="ts">
	import { signup } from '../index.remote';
</script>

<form {...signup}>
	<!-- Form-level errors -->
	{#each signup.fields.allIssues() as issue (issue)}
		<p class="error">{issue.message}</p>
	{/each}

	<input type="email" name="email" required />
	{#each signup.fields.email.issues() as issue (issue)}
		<p class="error">{issue.message}</p>
	{/each}

	<input type="password" name="password" required />
	{#each signup.fields.password.issues() as issue (issue)}
		<p class="error">{issue.message}</p>
	{/each}

	<button type="submit" disabled={signup.pending !== 0}>
		{signup.pending !== 0 ? 'Signing up...' : 'Sign up'}
	</button>
</form>
```

**Key points:**

- Import and spread the remote function directly: `{...signup}`
- Use `pending !== 0` to check if form is submitting
- Add `(issue)` keys to `{#each}` blocks for proper reactivity
- No need to call the function or manage state manually

#### Command Functions (Imperative Actions)

Use `command()` for data mutations that aren't tied to forms (e.g., button clicks, programmatic actions).

**✅ CORRECT: Command function**

```typescript
// src/routes/posts/actions.remote.ts
import { command } from '$app/server';
import { z } from 'zod';
import { db } from '$lib/server/db';

export const addLike = command(z.string(), async (post_id) => {
	await db
		.update(posts)
		.set({ likes: sql`likes + 1` })
		.where(eq(posts.id, post_id));
	return { success: true };
});
```

**Component usage (call from event handlers):**

```svelte
<script lang="ts">
	import { addLike } from './actions.remote';

	interface Props {
		post_id: string;
	}

	let { post_id }: Props = $props();

	async function handle_like() {
		await addLike(post_id);
	}
</script>

<button onclick={handle_like}>Like</button>
```

#### Why Remote Functions?

1. **Type safety** - Full TypeScript inference from server to client
2. **Flexible** - Call from anywhere, not just load functions or forms
3. **DX** - No need for separate API routes or manual fetch calls
4. **Validation** - Built-in schema validation with Zod
5. **Progressive enhancement** - Forms work without JavaScript

**❌ NEVER use these outdated patterns:**

```typescript
// ❌ DON'T: Load functions in +page.server.ts
export const load = async () => { ... };

// ❌ DON'T: Form actions in +page.server.ts
export const actions = {
	default: async ({ request }) => { ... }
};

// ❌ DON'T: Manual API routes for simple data fetching
// src/routes/api/posts/+server.ts
export async function GET() { ... }
```

**✅ INSTEAD: Use remote functions**

```typescript
// ✅ DO: Remote functions in .remote.ts files
export const getPosts = query(async () => { ... });
export const createPost = form(schema, async (data) => { ... });
export const deletePost = command(schema, async (id) => { ... });
```

### Better-Auth Integration

**Do NOT use `@better-auth/svelte` client** - it uses legacy Svelte stores that will be deprecated. Instead, use remote functions to interact with the `auth` object from `src/lib/auth.ts`.

**❌ WRONG: Using better-auth Svelte client**

```typescript
import { createAuthClient } from '@better-auth/svelte';
const client = createAuthClient(); // Uses stores - avoid!
```

**✅ CORRECT: Use remote functions with server-side auth**

```typescript
// src/lib/auth/remotes/queries.remote.ts
import { query } from '$app/server';
import { auth } from '$lib/auth';

export const getSession = query(async (event) => {
	const session = await auth.api.getSession({ headers: event.request.headers });
	return session;
});
```

**Component usage:**

```svelte
<script lang="ts">
	import { getSession } from '$lib/auth/remotes/queries';
	const session = getSession();
</script>

{#if session.loading}
	<p>Loading...</p>
{:else if session.current?.user}
	<p>Welcome, {session.current.user.email}!</p>
{:else}
	<a href="/auth/sign-in">Sign in</a>
{/if}
```

### Svelte 5 Runes - Mandatory Usage

**This project exclusively uses Svelte 5 runes for all reactive state.** No legacy Svelte code (pre-runes) should be written.

**✅ CORRECT: Always use runes for reactive state**

```typescript
<script lang="ts">
	// Reactive state
	let count = $state(0);
	let name = $state('');
	let items = $state<string[]>([]);

	// Derived state
	let doubled = $derived(count * 2);
	let isEmpty = $derived(items.length === 0);

	// Effects
	$effect(() => {
		console.log(`Count is now ${count}`);
	});
</script>
```

**❌ WRONG: Never use legacy let declarations for reactive state**

```typescript
<script lang="ts">
	// This is old Svelte style - DO NOT USE
	let count = 0;
	let name = '';
	let items = [];

	// This won't work properly in Svelte 5
	$: doubled = count * 2;
</script>
```

**Key Runes:**

- `$state()` - Reactive state (replaces `let` for reactive variables)
- `$state.raw()` - Non-deep reactive state (for large objects/arrays)
- `$derived()` - Computed values (replaces `$:` reactive statements)
- `$effect()` - Side effects (replaces `$:` for side effects)
- `$props()` - Component props (replaces `export let`)
- `$bindable()` - Two-way bindable props

**Why runes-only?**

1. **Modern Svelte 5** - Runes are the future of Svelte, legacy syntax is deprecated
2. **Explicit reactivity** - Clear which variables are reactive vs regular
3. **Better performance** - Fine-grained reactivity tracking
4. **TypeScript integration** - Better type inference with runes
5. **Consistency** - Single way to handle reactivity across the entire codebase

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

### TypeScript Patterns and Best Practices

This project prioritizes type safety through inference and smart use of TypeScript utilities. Follow these patterns for maximum type safety with minimal boilerplate.

#### Type vs Interface

**Always use `type` for local type definitions.** Avoid `interface` unless extending third-party types.

```typescript
// ✅ CORRECT: Use type
type UserData = {
	name: string;
	email: string;
};

// ❌ WRONG: Interface has unexpected behaviors
interface UserData {
	name: string;
	email: string;
}
// If you accidentally declare another interface UserData, they merge!
// This is a footgun for local types.
```

**Why prefer `type`?**
- No declaration merging - safer for local definitions
- Clearer error messages
- Works with unions, intersections, and mapped types more naturally

**When to use `interface`:**
- Only when extending third-party library types that use interfaces
- Example: `interface CustomRequestEvent extends RequestEvent { ... }`

#### Dependency Injection Types

For `.logic.ts` files, use dependency injection with well-typed dependencies.

**Naming Convention:** `{FunctionName}Deps`

```typescript
// queries.logic.ts
import type { RequestEvent } from '@sveltejs/kit';
import type { db } from '$lib/server/db';
import type { auth } from '$lib/auth';

// Pattern: Use 'type', not 'interface', keep unexported
type GetUserDeps = {
	event: RequestEvent;
};

export function getUserLogic({ event }: GetUserDeps) {
	return event.locals.user;
}

type ValidateUserDeps = {
	getUser: typeof getUser;  // Reference remote function type
};

export async function validateUserLogic({ getUser }: ValidateUserDeps) {
	const user = await getUser();
	if (!user) throw error(401, 'Unauthorized');
	return user;
}
```

**For mutations with form validation:**

```typescript
// mutations.logic.ts
import type { Invalid } from '@sveltejs/kit';
import type { z } from 'zod';
import type { signUpSchema } from '../schemas';
import type { db } from '$lib/server/db';
import type { auth } from '$lib/auth';

type SignUpDeps = {
	db: typeof db;                              // Complex client - use typeof
	auth: typeof auth;                          // Complex client - use typeof
	data: z.infer<typeof signUpSchema>;        // Infer from schema
	invalid: Invalid<z.infer<typeof signUpSchema>>; // SvelteKit helper type
};

export async function signUpLogic({ db, auth, data, invalid }: SignUpDeps) {
	// Implementation
}
```

#### Type Inference Strategies

**Use `typeof` for complex client types:**

```typescript
// ✅ CORRECT: Extract type from implementation
import type { db } from '$lib/server/db';
import type { auth } from '$lib/auth';

type MyDeps = {
	db: typeof db;     // PostgresJsDatabase<Schema> - complex!
	auth: typeof auth; // Better-Auth client - complex!
};

// ❌ WRONG: Manual type replication
type MyDeps = {
	db: PostgresJsDatabase<{ users: ..., sessions: ... }>;  // Don't do this!
	auth: Auth;  // This loses specific configuration types
};
```

**Why use `typeof`?**
- Avoids replicating complex generic types
- Types stay in sync with implementation automatically
- No need to import internal library types

**Use helper types from libraries:**

```typescript
// ✅ CORRECT: Use provided helper types
import type { RequestEvent, Invalid } from '@sveltejs/kit';
import type { z } from 'zod';

type Deps = {
	event: RequestEvent;                    // SvelteKit provides this
	invalid: Invalid<{ email: string }>;    // SvelteKit provides this
	data: z.infer<typeof mySchema>;         // Zod provides this
};

// ❌ WRONG: Manually define what libraries provide
type Deps = {
	event: {
		request: Request;
		params: Record<string, string>;
		locals: App.Locals;
		// ... 20+ more properties
	};
};
```

**Use `Parameters<>` and `ReturnType<>` utilities:**

```typescript
// Extract types from existing functions
type GetUserParams = Parameters<typeof getUserLogic>[0];
type GetUserReturn = ReturnType<typeof getUserLogic>;

// Reference remote function types
type ValidateUserDeps = {
	getUser: typeof getUser;  // Exact remote function signature
};
```

#### When to Export Types

**Default: Don't export dependency types.**

```typescript
// queries.logic.ts
type GetUserDeps = { ... };  // Not exported - internal only

export function getUserLogic(deps: GetUserDeps) { ... }
```

**Why not export?**
- Reduces auto-import noise in IDE
- These types are only used in tests (which use `as any` for mocking)
- Keeps the public API surface small

**Exception: Export when used across multiple files**

```typescript
// Only export if genuinely reused
export type SharedUserData = {
	id: string;
	email: string;
	name: string;
};
```

If a type is only used in one file (like dependency injection types), keep it private.

#### Schema-Driven Types

**Always infer from schemas, never duplicate:**

```typescript
import { z } from 'zod';

// ✅ CORRECT: Schema is single source of truth
export const userSchema = z.object({
	name: z.string().min(1),
	email: z.string().email(),
	age: z.number().optional(),
});

type UserData = z.infer<typeof userSchema>;  // Derives from schema

// ❌ WRONG: Duplicates validation rules
export const userSchema = z.object({ ... });

type UserData = {
	name: string;
	email: string;
	age?: number;
};  // Now schema and type can drift apart!
```

**This applies to form validation too:**

```typescript
type SignUpDeps = {
	data: z.infer<typeof signUpSchema>;        // ✅ Derives from schema
	invalid: Invalid<z.infer<typeof signUpSchema>>; // ✅ Derives from schema
};

// If schema changes, types update automatically
```

#### Type Safety Checklist

- ✅ Use `type` instead of `interface` for local definitions
- ✅ Use `typeof` for complex client types (db, auth)
- ✅ Use library helper types (RequestEvent, Invalid, z.infer)
- ✅ Keep dependency injection types unexported
- ✅ Infer from schemas - never duplicate validation rules
- ✅ Use `Parameters<>` and `ReturnType<>` to extract types
- ✅ Name dependency types with `{FunctionName}Deps` pattern

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

### Testing Strategy Overview

**What to Test:**

1. **Component Tests (Unit)** - UI behavior, validation, user interactions
   - Use Vitest Browser Mode with Playwright
   - Test user-facing behavior, not implementation details
   - Mock as little as possible

2. **E2E Tests (Integration)** - Full user flows from browser to database
   - Use Playwright for complete workflows
   - Test critical paths: signup, login, core features
   - No mocking - test against real services

3. **Remote Functions Business Logic** - Extract testable logic from remote functions
   - Remote functions (`.remote.ts`) are SvelteKit integration points and cannot be unit tested
   - Extract business logic into `.logic.ts` files using dependency injection
   - Unit test the `.logic.ts` files with standard mocking
   - Keep `.remote.ts` as thin wrappers that call logic functions

**Testing Remote Functions with Logic Layer:**

```typescript
// ❌ DON'T: Try to unit test remote functions directly
// src/lib/auth/remotes/queries.test.ts
import { getUser } from './queries.remote'; // This will fail - SvelteKit integration!

// ✅ DO: Extract logic with dependency injection
// src/lib/auth/remotes/queries.logic.ts
export interface GetUserDeps {
	event: RequestEvent;
}

export function getUserLogic({ event }: GetUserDeps) {
	return event.locals.user;
}

// src/lib/auth/remotes/queries.remote.ts
import { getRequestEvent, query } from '$app/server';
import { getUserLogic } from './queries.logic';

export const getUser = query(() => {
	const event = getRequestEvent();
	return getUserLogic({ event }); // Thin wrapper
});

// ✅ DO: Unit test the logic layer
// src/lib/auth/remotes/queries.logic.test.ts
import { getUserLogic } from './queries.logic';

test('should return user from event.locals', () => {
	const mockEvent = { locals: { user: { id: '123' } } } as any;
	const result = getUserLogic({ event: mockEvent });
	expect(result).toEqual({ id: '123' });
});
```

**Why This Pattern Works:**

- **`.remote.ts`** = SvelteKit integration (thin, cannot be tested)
- **`.logic.ts`** = Pure business logic (testable with dependency injection)
- **`.logic.test.ts`** = Unit tests with mocked dependencies

This separation allows comprehensive unit testing while maintaining SvelteKit's remote function benefits.

**Testing Components That Use Remote Functions:**

**Components using query() functions** can be tested by mocking the query:

```typescript
// ✅ DO: Mock query functions
vi.mock('../remotes/queries.remote', () => ({
	getUser: vi.fn(() => Promise.resolve({ name: 'Test User', email: 'test@example.com' }))
}));

render(UserDisplay);
await expect.element(page.getByText('Test User')).toBeInTheDocument();
```

**Components using form() functions** are difficult to test in isolation because `form()` returns complex objects with Svelte snippets that must be spread onto `<form>` elements. Mocking these leads to deep Svelte internal errors.

```typescript
// ❌ DON'T: Try to unit test form components
// Mocking form() objects is extremely difficult due to snippet complexity
it.skip('should render sign-in form', () => {
	// Form components should be tested via E2E instead
});
```

**✅ DO: Test form components via E2E tests:**

```typescript
// e2e/auth.spec.ts
test('user can sign in', async ({ page }) => {
	await page.goto('/auth/sign-in');

	await page.getByLabel('Email').fill('test@example.com');
	await page.getByLabel('Password').fill('password123');
	await page.getByRole('button', { name: 'Sign in' }).click();

	await expect(page).toHaveURL('/');
});
```

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

## Notes for Future Sessions

- **MBTI Algorithm**: Design how to calculate type from accumulated responses (simple majority vote per dimension, or weighted scoring?)
- **Question Distribution**: Ensure 100 questions are evenly distributed across 8 poles (E/I, S/N, T/F, J/P) for balanced tracking
- **Type History Granularity**: Store type daily? Or only when it changes?
- **GDPR**: Defer for now, add privacy policy + account deletion + data export later
