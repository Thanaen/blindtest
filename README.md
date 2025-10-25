# Blindtest

A modern web application built with Next.js 16, React 19, and authenticated with better-auth.

## Features

- 🔐 **Authentication** - Email/password authentication powered by better-auth
- 🗃️ **Type-Safe ORM** - Drizzle ORM for database interactions
- 🎨 **Modern UI** - Built with Tailwind CSS 4 and shadcn/ui components
- ⚡ **Fast Development** - Powered by Bun runtime
- 🌙 **Dark Mode** - Built-in dark mode support
- 📱 **Responsive** - Mobile-first responsive design
- 🔒 **Type Safe** - Full TypeScript support with strict mode

## Tech Stack

- **Framework**: [Next.js 16.0.0](https://nextjs.org/) (App Router)
- **React**: 19.2.0
- **Authentication**: [better-auth](https://www.better-auth.com/) v1.3.31
- **Database**: MySQL (with mysql2 driver)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/) with drizzle-kit
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) (New York style)
- **TypeScript**: 5.x with strict mode
- **Runtime**: Bun

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18+ or **Bun** (recommended)
- **MySQL** 8.0+ (required for authentication)

### Installing MySQL

#### macOS
```bash
brew install mysql
brew services start mysql
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
```

#### Windows
Download and install from the [official MySQL website](https://dev.mysql.com/downloads/mysql/).

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd blindtest
```

### 2. Install Dependencies

```bash
bun install
# or
npm install
```

### 3. Set Up Environment Variables

Copy the example environment file and update it with your configuration:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your MySQL credentials:

```env
# Database Configuration
DATABASE_HOST=localhost
DATABASE_USER=root
DATABASE_PASSWORD=your_mysql_password
DATABASE_NAME=blindtest

# Better Auth
BETTER_AUTH_SECRET=your-secret-key-change-this-in-production
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
```

**Important:**
- Replace `your_mysql_password` with your actual MySQL password
- Generate a secure random string for `BETTER_AUTH_SECRET` (use a password generator)

### 4. Create the Database

Connect to MySQL and create the database:

```bash
mysql -u root -p
```

Then in the MySQL prompt:

```sql
CREATE DATABASE blindtest;
EXIT;
```

### 5. Run Database Migrations

Apply the database schema:

```bash
mysql -u root -p blindtest < schema.sql
```

Verify the tables were created:

```bash
mysql -u root -p -e "USE blindtest; SHOW TABLES;"
```

You should see four tables: `user`, `session`, `account`, and `verification`.

### 6. Start the Development Server

```bash
bun run dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
blindtest/
├── app/                      # Next.js App Router
│   ├── api/
│   │   └── auth/[...all]/   # Authentication API routes
│   ├── login/               # Login page
│   ├── signup/              # Signup page
│   ├── dashboard/           # Protected dashboard
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page
│   └── globals.css          # Global styles
├── components/              # React components
│   ├── auth/                # Authentication components
│   │   ├── login-form.tsx
│   │   └── signup-form.tsx
│   └── ui/                  # shadcn/ui components
├── lib/                     # Utility functions
│   ├── auth.ts              # Better Auth server config
│   ├── auth-client.ts       # Better Auth client
│   ├── utils.ts             # Utility functions
│   └── db/                  # Database configuration
│       ├── index.ts         # Drizzle ORM instance
│       └── schema.ts        # Database schema (Drizzle)
├── drizzle/                 # Drizzle migrations (auto-generated)
├── drizzle.config.ts        # Drizzle Kit configuration
├── schema.sql               # Database schema (initial setup)
├── .env.example             # Environment variables template
├── .env.local               # Local environment variables (git-ignored)
└── README.md                # This file
```

## Available Scripts

```bash
# Development
bun run dev              # Start development server
bun run build            # Build for production
bun run start            # Start production server
bun run lint             # Run linter

# Database (Drizzle ORM)
bunx drizzle-kit push    # Push schema changes to database (development)
bunx drizzle-kit generate # Generate migrations from schema
bunx drizzle-kit migrate  # Run migrations
bunx drizzle-kit studio   # Open Drizzle Studio (database GUI)
```

## Authentication

The app uses **better-auth** for authentication with the following features:

- ✅ Email/password authentication
- ✅ Session management
- ✅ Protected routes
- ✅ User dashboard

### Usage

#### Sign Up
Navigate to `/signup` or click "Sign Up" on the home page to create a new account.

#### Sign In
Navigate to `/login` or click "Sign In" on the home page to access your account.

#### Protected Routes
The `/dashboard` route is protected and requires authentication. Users will be redirected to `/login` if not authenticated.

### Using Authentication in Your Code

```tsx
"use client";

import { useSession, authClient } from "@/lib/auth-client";

export function MyComponent() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <div>Not authenticated</div>;
  }

  return (
    <div>
      <p>Welcome, {session.user.name}!</p>
      <button onClick={() => authClient.signOut()}>
        Sign Out
      </button>
    </div>
  );
}
```

## Database Schema

The application uses the following MySQL tables:

| Table | Description |
|-------|-------------|
| `user` | User accounts with email, name, and verification status |
| `session` | Active user sessions with tokens and expiry |
| `account` | OAuth providers and password hashes |
| `verification` | Email verification tokens |

For detailed schema information, see `schema.sql` or `lib/db/schema.ts`.

## Using Drizzle ORM

This project uses Drizzle ORM for type-safe database operations. The ORM is integrated with better-auth for authentication.

### Basic Usage

```typescript
import { db } from "@/lib/db";
import { user } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

// Query all users
const users = await db.select().from(user);

// Query with conditions
const specificUser = await db
  .select()
  .from(user)
  .where(eq(user.email, "user@example.com"));

// Insert a user (typically handled by better-auth)
await db.insert(user).values({
  id: "unique-id",
  name: "John Doe",
  email: "john@example.com",
  emailVerified: false,
});

// Update user
await db
  .update(user)
  .set({ name: "Jane Doe" })
  .where(eq(user.id, "user-id"));

// Delete user
await db.delete(user).where(eq(user.id, "user-id"));
```

### Type Safety

Drizzle provides full TypeScript type inference:

```typescript
import type { User, NewUser } from "@/lib/db";

// User type is inferred from select queries
const user: User = await db.select().from(user).limit(1);

// NewUser type is for insert operations
const newUser: NewUser = {
  id: "unique-id",
  name: "John Doe",
  email: "john@example.com",
  emailVerified: false,
};
```

### Schema Management

The database schema is defined in `lib/db/schema.ts`. To modify the schema:

1. Edit `lib/db/schema.ts`
2. Push changes directly (development):
   ```bash
   bunx drizzle-kit push
   ```
   OR generate a migration (production):
   ```bash
   bunx drizzle-kit generate
   bunx drizzle-kit migrate
   ```

### Drizzle Studio

View and edit your database visually:

```bash
bunx drizzle-kit studio
```

This opens a web interface at `https://local.drizzle.studio` where you can browse tables, run queries, and edit data.

### Available Tables

- **user**: User accounts
- **session**: Active sessions
- **account**: OAuth accounts and passwords
- **verification**: Email verification tokens

All tables are defined in `lib/db/schema.ts` with TypeScript types and relationships.

## Troubleshooting

### Database Connection Issues

**Error**: `connect ETIMEDOUT` or `Access denied for user`

**Solution**:
1. Verify MySQL is running:
   ```bash
   # macOS
   brew services list

   # Linux
   sudo systemctl status mysql
   ```

2. Check your credentials in `.env.local`

3. Test the connection:
   ```bash
   mysql -u root -p
   ```

### Port Already in Use

**Error**: `Port 3000 is already in use`

**Solution**:
```bash
# Find the process using port 3000
lsof -ti:3000

# Kill the process
kill -9 $(lsof -ti:3000)

# Or use a different port
PORT=3001 bun run dev
```

### Environment Variables Not Loading

**Solution**: Restart the development server after modifying `.env.local`:
```bash
# Stop the server (Ctrl+C)
bun run dev
```

## Documentation

- [AUTH_SETUP.md](./AUTH_SETUP.md) - Detailed authentication setup guide
- [CLAUDE.md](./CLAUDE.md) - Development guidelines for AI assistants

## Adding Components

This project uses shadcn/ui. To add a new component:

```bash
bunx shadcn@latest add [component-name]
```

Example:
```bash
bunx shadcn@latest add dropdown-menu
```

Components will be added to `components/ui/` with automatic styling.

## Deployment

### Environment Variables for Production

When deploying to production, make sure to set:

1. **BETTER_AUTH_SECRET**: Generate a secure random string (32+ characters)
2. **DATABASE_HOST**: Your production MySQL host
3. **DATABASE_USER**: Production database user
4. **DATABASE_PASSWORD**: Production database password
5. **DATABASE_NAME**: Production database name
6. **BETTER_AUTH_URL**: Your production URL (e.g., `https://yourdomain.com`)
7. **NEXT_PUBLIC_BETTER_AUTH_URL**: Same as BETTER_AUTH_URL

### Build and Deploy

```bash
# Build for production
bun run build

# Start production server
bun run start
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[MIT License](LICENSE) - feel free to use this project for your own purposes.

## Support

For issues and questions:
- Check [AUTH_SETUP.md](./AUTH_SETUP.md) for authentication issues
- Review [better-auth documentation](https://www.better-auth.com/docs)
- Review [Next.js documentation](https://nextjs.org/docs)

## Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [better-auth](https://www.better-auth.com/) - Authentication library
- [Drizzle ORM](https://orm.drizzle.team/) - TypeScript ORM
- [shadcn/ui](https://ui.shadcn.com/) - UI component library
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
