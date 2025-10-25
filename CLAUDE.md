# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 16.0.0 application using React 19.2.0, styled with Tailwind CSS 4, and integrated with shadcn/ui components (New York style). The project uses TypeScript and follows the Next.js App Router architecture.

## Development Commands

```bash
# Start the development server
bun run dev

# Build for production
bun run build

# Start production server
bun run start

# Run linter
bun run lint
```

The development server runs at http://localhost:3000

## Tech Stack & Configuration

- **Framework**: Next.js 16.0.0 (App Router)
- **React**: 19.2.0
- **TypeScript**: 5.x with strict mode enabled
- **Styling**: Tailwind CSS 4 with PostCSS
- **UI Components**: shadcn/ui (New York style, with RSC support)
- **Icon Library**: lucide-react
- **Utilities**: class-variance-authority, clsx, tailwind-merge
- **Animations**: tw-animate-css

## Project Structure

```
app/               # Next.js App Router directory
  layout.tsx       # Root layout with Geist fonts
  page.tsx         # Home page
  globals.css      # Global Tailwind + shadcn styles
lib/               # Utility functions
  utils.ts         # cn() utility for className merging
components/        # React components (to be created)
  ui/              # shadcn/ui components (added via CLI)
```

## Path Aliases

The project uses `@/` as an alias for the root directory:

```typescript
@/components     -> ./components
@/lib            -> ./lib
@/lib/utils      -> ./lib/utils
@/components/ui  -> ./components/ui
@/hooks          -> ./hooks
```

## shadcn/ui Integration

This project is configured for shadcn/ui components:

- **Style**: New York
- **Base color**: Neutral
- **CSS Variables**: Enabled
- **RSC**: Enabled (React Server Components)
- **CSS Location**: `app/globals.css`

Add components using:
```bash
bunx shadcn@latest add [component-name]
```

Components will be added to `components/ui/` with automatic path alias resolution.

## Styling System

The project uses Tailwind CSS 4 with a custom design token system:

- **Color Tokens**: Defined in `globals.css` using CSS custom properties with OKLCH color space
- **Theme Support**: Built-in dark mode support via `.dark` class
- **Border Radius**: Configurable via `--radius` variable (default: 0.625rem)

### Class Merging

Prefer `clsx` for simple conditional class merging:
```typescript
import { clsx } from "clsx"

<div className={clsx("base-class", conditional && "extra-class")} />
```

Use `cn()` from `@/lib/utils` when merging Tailwind classes (e.g., components accepting dynamic `className` props):
```typescript
import { cn } from "@/lib/utils"

// Component with className prop
function Button({ className, ...props }: { className?: string }) {
  return <button className={cn("px-4 py-2 bg-primary", className)} {...props} />
}
```

## TypeScript Configuration

- **Target**: ES2017
- **Module Resolution**: Bundler
- **Strict Mode**: Enabled
- **JSX**: react-jsx
- **Path Mapping**: `@/*` resolves to project root

## Fonts

The project uses Google Fonts via `next/font`:
- **Sans Serif**: Geist
- **Monospace**: Geist Mono

Both are configured as CSS variables in the root layout.

## MCP Servers

This project has MCP (Model Context Protocol) server integrations configured. Check the project's MCP configuration for available tools and resources.
