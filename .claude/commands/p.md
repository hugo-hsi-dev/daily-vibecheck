# Push Command

This command runs diagnostics, stages all changes, generates a commit message, and pushes to remote.

## Workflow

1. **Run Diagnostic Checks** (in order):
   - `pnpm run check` - TypeScript and Svelte type checking
     - If this fails, **STOP** and report the errors. Cannot auto-fix type errors.
   - `pnpm run format:check` - Check code formatting with Prettier
     - If this fails, run `pnpm run format` to auto-fix formatting issues
     - Re-run `pnpm run format:check` to verify fixes
   - `pnpm run lint:check` - Run ESLint checks
     - If this fails, run `pnpm run lint` to auto-fix linting issues
     - Re-run `pnpm run lint:check` to verify fixes

   **Auto-fix behavior:**
   - Formatting errors: Automatically fixed with `pnpm run format`
   - Linting errors: Automatically fixed with `pnpm run lint`
   - Type errors: Cannot be auto-fixed - stop and report

2. **Review Changes**:
   - Run `git status` to see unstaged and staged files
   - Read the diff of changed files using `git diff` (for unstaged) and `git diff --cached` (for staged)
   - Analyze the changes to understand what was modified

3. **Generate Commit Message**:
   - Based on the changes, generate a concise, descriptive commit message following conventional commits format:
     - `feat:` for new features
     - `fix:` for bug fixes
     - `docs:` for documentation changes
     - `test:` for test additions/changes
     - `refactor:` for code refactoring
     - `chore:` for maintenance tasks
     - `style:` for formatting/style changes
   - Include a brief description (max 50 chars for subject line)
   - If needed, add a longer description in the commit body

4. **Stage, Commit, and Push**:
   - Run `git add -A` to stage all changes
   - Run `git commit -m "<generated message>"` with the generated message
   - Run `git push` to push to remote
   - Confirm success and show the commit hash

## Example Output

**Success case:**

```
✅ Type checking passed (0 errors)
✅ Format checking passed
✅ Lint checking passed

📋 Changes detected:
   M src/lib/auth/components/sign-in-form/email-field.svelte
   M src/lib/auth/components/sign-in-form/tests/email-field.svelte.test.ts
   A src/lib/test-mocks.ts

📝 Generated commit message:
   test: add centralized mock helpers for auth testing

🚀 Staging all changes...
🚀 Committing...
🚀 Pushing to remote...

✅ Successfully pushed! Commit: a1b2c3d
```

**Auto-fix case:**

```
✅ Type checking passed (0 errors)
❌ Format checking failed (5 files need formatting)
🔧 Running 'pnpm run format' to fix formatting issues...
✅ Formatting fixed!
✅ Format checking passed

❌ Lint checking failed (2 fixable issues)
🔧 Running 'pnpm run lint' to fix linting issues...
✅ Linting fixed!
✅ Lint checking passed

📋 Changes detected (including auto-fixes):
   M src/lib/auth/components/sign-in-form/email-field.svelte
   M src/lib/auth/schemas.ts

📝 Generated commit message:
   style: fix formatting and linting issues

🚀 Staging all changes...
🚀 Committing...
🚀 Pushing to remote...

✅ Successfully pushed! Commit: a1b2c3d
```

## Error Handling

If diagnostics fail:

```
❌ Type checking failed (3 errors found)
   - Fix errors before pushing
   - Run 'pnpm run check' to see details

Push operation cancelled.
```

## Notes

- Always run diagnostics first to catch errors before pushing
- Generate meaningful commit messages based on actual changes
- If there are no changes to commit, report that and exit gracefully
- Use conventional commit format for consistency
- Review the changes before committing to ensure the message is accurate
