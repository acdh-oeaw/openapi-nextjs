# openapi-nextjs

generate openapi docs from next.js route handlers.

Development uses Node.js 26 and the pinned pnpm version. Run `pnpm install` to install dependencies
and the Lefthook pre-commit hook.

- `pnpm format:check` / `pnpm format:fix`: check or apply formatting with Oxfmt.
- `pnpm lint:check` / `pnpm lint:fix`: run type-aware Oxlint checks or apply fixes.
- `pnpm types:check`: check types with TypeScript 7.
- `pnpm build`: build the package, generate API documentation, and build the example app.
- `pnpm test:e2e`: run the example app's browser tests.

The pre-commit hook lints and formats staged files and stages the fixes. Shared formatting and lint
settings live in `.oxfmtrc.json` and `.oxlintrc.json`. Oxlint uses its built-in TypeScript, React,
Next.js, accessibility, import, Node.js, Promise, Unicorn, and Oxc rules; the former ESLint-only
Playwright and Tailwind rules are not included.
