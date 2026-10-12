# React Standards Template

<sub><a href="README.md">Português</a></sub>

**The rules are part of the repository.**
A React and TypeScript base for internal systems that talk to a separate API,
with a working session and CRUD journey and the coding standards written down next to it.

Every rule has a code (`API-02`), a severity and the reason it exists. A review cites the code
instead of arguing from memory, and the same document is what a Claude Code skill reads when it
checks uncommitted work.

## What you get

### A working example you delete

Login, session handling, and a CRUD module you can read end to end. The example comes out once your
first real feature exists, and the development guide says how.

### Standards with codes

`docs/standards.md` holds the rules, each with a code, a severity and a reason.
`docs/decisions/` keeps one file per architectural decision, so a big rule can be traced back to
the argument that produced it.

### Review skill for Claude Code

`app-review-standards` runs `pnpm check`, `typecheck` and `test`, reads the uncommitted work against
the standards, and returns a report ordered by severity. It reports and changes nothing.

### One command for the next project

`criar-app ~/dev/my-system --title "My System"` copies the template, rewrites the package name,
HTML title, application name and storage namespace, installs dependencies and makes the first commit.
`CLAUDE.md`, `docs/`, `.claude/`, `.mcp.json`, `biome.json` and `biome-plugins/` come along, so the
new project starts with the rules and the review already in place, and `.template-origin.json` records
the template commit it came from, so later rule changes can be brought over. It publishes nothing and
creates no remote.

### Browser demo with no backend

`pnpm dev:mock` serves the app against MSW handlers. The form arrives filled with
`demo@example.com` / `demo12345`, the data lives in local storage and survives a reload, and the
production build fails if a mock reaches it.

### Responses checked at runtime

Zod parses every API response against the contract in `docs/api-contract.md`. Sessions use cookies
plus a CSRF token issued by the API. Search and pagination live in the URL, so a filtered list is a
link you can send to someone.

### shadcn over MCP

`.mcp.json` registers `pnpm exec shadcn mcp` at project scope, pinned to the version in the lockfile,
reading the Base UI preset and the aliases from `components.json`. Ask Claude Code for a component and
it follows the project's configuration.

### One verification command

`pnpm verify` runs Biome, TypeScript, the tests, the generator check and the build. Playwright covers
the browser journey. CI runs both groups, skips the code jobs when a change only touches text, and
generates a project from scratch to check the generator. What each workflow covers is in
[.github/CONTRIBUTING.md](.github/CONTRIBUTING.md).

## Stack

React 19, TypeScript, Vite, TanStack Router, Query, Form and Table, Tailwind 4, Base UI through the
shadcn preset, Zod, ky, Biome, Vitest with MSW, Playwright. Node 24 and pnpm 10.33.0.

## Quick start

```bash
pnpm install --frozen-lockfile
pnpm dev:mock   # http://localhost:3000
```

To point at a real API, copy `.env.example` to `.env` and run `pnpm dev`.

## What it does not include

No backend, no identity provider, no account signup, no password recovery. For OIDC or SSO, replace
the `auth` module with what your backend expects. The interface text is in Portuguese and `locale`
only controls formatting; full translation means adopting a message catalog when a real need appears.
Generated copies are independent, so later changes to the template do not reach them.

## Documentation

The reference documentation is in Portuguese.

- [Documentation index](docs/README.md)
- [Coding standards, with code and severity](docs/standards.md)
- [Architecture](docs/architecture.md)
- [API contract and authentication](docs/api-contract.md)
- [Creating and removing features](docs/development.md)
- [Decisions, one per file](docs/decisions/)
- [Template changelog](CHANGELOG.md)
