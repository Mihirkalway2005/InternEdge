# InternEdge Next.js Application

React + Next.js App Router + Tailwind CSS project.

## Development Server

A Next.js development server runs on `$PORT` (default 8443).

- Preview URL: The user can access the running app through the preview panel
- Hot reload: Changes to source files are reflected immediately

## Project Structure

- `src/app/layout.tsx` - Next.js root layout; sets up document metadata, global CSS, and the auth provider
- `src/app/page.tsx` - Main home page component mounting `src/App.tsx`
- `src/app/globals.css` - Global CSS entrypoint and Tailwind CSS v4 import (`@import 'tailwindcss';`)
- `src/App.tsx` - Primary Keynote presentation shell component
- `src/app/api/` - REST API route handlers backed by Prisma + PostgreSQL
- `prisma/schema.prisma` - Prisma data model (PostgreSQL)
- `prisma.config.ts` - Prisma CLI config (datasource URL, migrations)
- `src/lib/db.ts` - Prisma client singleton (driver adapter for Postgres)
- `src/lib/auth.ts` - BetterAuth server config (Prisma adapter)
- `package.json` - Project dependencies and Next.js build, development, and formatting scripts
- `next.config.mjs` - Next.js configuration
- `postcss.config.mjs` - PostCSS configuration with `@tailwindcss/postcss` plugin

## Dependencies

- Runtime: Next.js 15, React 19, and React DOM 19
- Styling: Tailwind CSS v4 with `@tailwindcss/postcss` plugin
- Backend: Prisma ORM 7 + PostgreSQL (via `@prisma/adapter-pg`)
- Auth: BetterAuth (Prisma adapter)
- Formatting: oxfmt

## Code Quality

- Use double quotes for strings containing apostrophes (`"We're here to help"`), or escape them in single-quoted strings.
- Ensure JSX tags are closed and braces are balanced.
- Mark interactive client-side components with `'use client';`.
