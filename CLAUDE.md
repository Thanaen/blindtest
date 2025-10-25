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
- **Authentication**: better-auth v1.3.31 (with Drizzle adapter)
- **Database**: MySQL (via mysql2 driver)
- **ORM**: Drizzle ORM with drizzle-kit

## Project Structure

```
app/                      # Next.js App Router directory
  layout.tsx              # Root layout with Geist fonts
  page.tsx                # Home page
  globals.css             # Global Tailwind + shadcn styles
  api/
    auth/[...all]/        # Better Auth API routes
      route.ts            # Authentication endpoints
  login/
    page.tsx              # Login page
  signup/
    page.tsx              # Signup page
  dashboard/
    page.tsx              # Protected dashboard page
lib/                      # Utility functions
  utils.ts                # cn() utility for className merging
  auth.ts                 # Better Auth server configuration
  auth-client.ts          # Better Auth React client
  db/                     # Database configuration
    index.ts              # Drizzle ORM instance and connection
    schema.ts             # Database schema (Drizzle ORM)
components/               # React components
  auth/                   # Authentication components
    login-form.tsx        # Login form component
    signup-form.tsx       # Signup form component
  ui/                     # shadcn/ui components (added via CLI)
drizzle/                  # Drizzle migrations (auto-generated)
drizzle.config.ts         # Drizzle Kit configuration
schema.sql                # MySQL database schema (initial setup)
.env.local                # Local environment variables (git-ignored)
.env.example              # Environment variables template
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

## Authentication

This project uses **better-auth** for authentication with MySQL as the database backend.

### Database Setup (Required for Development)

A local MySQL server is required for development. The application will not work without it.

1. **Install MySQL** (if not already installed):
   - **macOS**: `brew install mysql && brew services start mysql`
   - **Linux**: `sudo apt install mysql-server` or `sudo systemctl start mysql`
   - **Windows**: Download from [MySQL website](https://dev.mysql.com/downloads/)

2. **Configure environment variables** in `.env.local`:
   ```env
   DATABASE_HOST=localhost
   DATABASE_USER=root
   DATABASE_PASSWORD=your_password
   DATABASE_NAME=blindtest
   BETTER_AUTH_SECRET=generate-a-secure-random-string
   BETTER_AUTH_URL=http://localhost:3000
   NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
   ```

3. **Create the database and tables**:
   ```bash
   mysql -u root -p -e "CREATE DATABASE blindtest;"
   mysql -u root -p blindtest < schema.sql
   ```

### Authentication Configuration

- **Server Config**: `lib/auth.ts` - Better Auth instance with Drizzle adapter
- **Client Config**: `lib/auth-client.ts` - React client with hooks
- **API Routes**: `/api/auth/*` - All authentication endpoints
- **Protected Routes**: Use `useSession()` hook to check authentication status

### Available Auth Hooks

```typescript
import { useSession, authClient } from "@/lib/auth-client";

// Check session
const { data: session, isPending } = useSession();

// Sign up
await authClient.signUp.email({ email, password, name });

// Sign in
await authClient.signIn.email({ email, password });

// Sign out
await authClient.signOut();
```

### Database Schema

The following tables are created by `schema.sql`:
- **user**: User accounts (id, name, email, emailVerified, image, timestamps)
- **session**: User sessions (id, userId, expiresAt, token, ipAddress, userAgent)
- **account**: OAuth accounts and password storage (id, accountId, providerId, userId, accessToken, refreshToken, password)
- **verification**: Email verification tokens (id, identifier, value, expiresAt)

For complete setup instructions, see `AUTH_SETUP.md`.

## Database & ORM (Drizzle)

This project uses **Drizzle ORM** for type-safe database interactions with MySQL.

### Drizzle Configuration

- **Config File**: `drizzle.config.ts` - Drizzle Kit configuration
- **Schema**: `lib/db/schema.ts` - Database schema definitions
- **Database Instance**: `lib/db/index.ts` - Drizzle client and connection pool
- **Migrations**: `drizzle/` directory (auto-generated)

### Using Drizzle ORM

Import the database instance and schema from `@/lib/db`:

```typescript
import { db } from "@/lib/db";
import { user, session, account, verification } from "@/lib/db/schema";
import { eq, and, or } from "drizzle-orm";

// Query users
const users = await db.select().from(user);

// Query with conditions
const specificUser = await db
  .select()
  .from(user)
  .where(eq(user.email, "user@example.com"));

// Insert data
await db.insert(user).values({
  id: "unique-id",
  name: "John Doe",
  email: "john@example.com",
  emailVerified: false,
});

// Update data
await db
  .update(user)
  .set({ name: "Jane Doe" })
  .where(eq(user.id, "user-id"));

// Delete data
await db.delete(user).where(eq(user.id, "user-id"));
```

### Type-Safe Queries

Drizzle provides full TypeScript type safety:

```typescript
import type { User, NewUser } from "@/lib/db";

// User is the inferred type from select queries
const user: User = await db.select().from(user).limit(1);

// NewUser is the type for insert operations
const newUser: NewUser = {
  id: "unique-id",
  name: "John Doe",
  email: "john@example.com",
  emailVerified: false,
};
```

### Drizzle Commands

```bash
# Generate migrations from schema
bunx drizzle-kit generate

# Push schema changes to database (development)
bunx drizzle-kit push

# Open Drizzle Studio (database GUI)
bunx drizzle-kit studio

# Run migrations
bunx drizzle-kit migrate
```

### Schema Management

The database schema is defined in `lib/db/schema.ts` using Drizzle's schema builder. When you modify the schema:

1. Update `lib/db/schema.ts` with your changes
2. Run `bunx drizzle-kit push` to apply changes directly (development), OR
3. Run `bunx drizzle-kit generate` to create a migration file, then apply it

### Integration with Better Auth

Better Auth uses the Drizzle adapter configured in `lib/auth.ts`. The adapter automatically handles all authentication-related database operations using the defined schema.

## MCP Servers

This project has MCP (Model Context Protocol) server integrations configured. Check the project's MCP configuration for available tools and resources.
