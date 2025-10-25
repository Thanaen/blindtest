# Authentication Setup Guide

This guide will help you complete the authentication setup for your Next.js application using better-auth with MySQL.

## What's Been Set Up

1. **Dependencies Installed**
   - `better-auth` - Authentication library
   - `mysql2` - MySQL database driver

2. **Environment Variables** (`.env.local`)
   - Database connection settings
   - Better Auth configuration

3. **Better Auth Configuration** (`lib/auth.ts`)
   - MySQL database adapter
   - Email/password authentication enabled

4. **API Routes** (`app/api/auth/[...all]/route.ts`)
   - Authentication endpoints configured

5. **Auth Client** (`lib/auth-client.ts`)
   - React client for authentication
   - Exports: `authClient`, `useSession`, `signIn`, `signOut`, `signUp`

6. **UI Components**
   - Login form (`components/auth/login-form.tsx`)
   - Signup form (`components/auth/signup-form.tsx`)

7. **Pages**
   - `/login` - Login page
   - `/signup` - Signup page
   - `/dashboard` - Protected dashboard page
   - `/` - Updated home page with auth links

## Database Setup (Required)

### Step 1: Update Environment Variables

Edit `.env.local` and update the database credentials:

```env
DATABASE_HOST=localhost
DATABASE_USER=root
DATABASE_PASSWORD=your_mysql_password
DATABASE_NAME=blindtest

BETTER_AUTH_SECRET=your-secret-key-change-this-in-production
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
```

**Important:** Change `BETTER_AUTH_SECRET` to a secure random string in production.

### Step 2: Create the Database

Connect to your MySQL server and create the database:

```sql
CREATE DATABASE IF NOT EXISTS blindtest;
```

### Step 3: Run the Schema

Run the SQL schema file to create the required tables:

```bash
mysql -u root -p blindtest < schema.sql
```

Or manually execute the SQL commands from `schema.sql` in your MySQL client.

### Step 4: Verify Tables

Check that the tables were created successfully:

```sql
USE blindtest;
SHOW TABLES;
```

You should see:
- `user`
- `session`
- `account`
- `verification`

## Testing the Authentication Flow

### Step 1: Start the Development Server

```bash
bun run dev
```

The app will be available at http://localhost:3000

### Step 2: Test Signup

1. Navigate to http://localhost:3000
2. Click "Sign Up"
3. Fill in the form:
   - Name
   - Email
   - Password (minimum 8 characters)
4. Submit the form
5. You should be redirected to the dashboard

### Step 3: Test Logout

1. On the dashboard page, click "Sign Out"
2. You should be redirected to the home page

### Step 4: Test Login

1. Click "Sign In"
2. Enter your email and password
3. Submit the form
4. You should be redirected to the dashboard

## API Endpoints

The following authentication endpoints are available at `/api/auth/`:

- `POST /api/auth/sign-up/email` - Create a new user
- `POST /api/auth/sign-in/email` - Sign in with email/password
- `POST /api/auth/sign-out` - Sign out the current user
- `GET /api/auth/session` - Get current session

## Client-Side Usage

### Check Authentication Status

```tsx
"use client";

import { useSession } from "@/lib/auth-client";

export function MyComponent() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <div>Not authenticated</div>;
  }

  return <div>Welcome, {session.user.name}!</div>;
}
```

### Sign In Programmatically

```tsx
import { authClient } from "@/lib/auth-client";

const { data, error } = await authClient.signIn.email({
  email: "user@example.com",
  password: "password123",
});
```

### Sign Up Programmatically

```tsx
import { authClient } from "@/lib/auth-client";

const { data, error } = await authClient.signUp.email({
  email: "user@example.com",
  password: "password123",
  name: "John Doe",
});
```

### Sign Out

```tsx
import { authClient } from "@/lib/auth-client";

await authClient.signOut();
```

## Troubleshooting

### Database Connection Issues

If you get database connection errors:

1. Verify MySQL is running:
   ```bash
   mysql --version
   sudo service mysql status  # Linux
   brew services list         # macOS
   ```

2. Check credentials in `.env.local`

3. Ensure the database exists:
   ```bash
   mysql -u root -p -e "SHOW DATABASES;"
   ```

### Migration Errors

If `bunx @better-auth/cli migrate` fails, use the manual SQL script:

```bash
mysql -u root -p blindtest < schema.sql
```

### Environment Variables Not Loading

Restart the development server after changing `.env.local`:

```bash
# Stop the server (Ctrl+C)
bun run dev
```

## Next Steps

1. **Add Email Verification**: Configure email sending for verification
2. **Add OAuth Providers**: Set up GitHub, Google, etc.
3. **Add Two-Factor Authentication**: Enable 2FA with the two-factor plugin
4. **Customize UI**: Style the forms to match your design
5. **Add Protected Routes**: Create middleware to protect specific pages

## Additional Resources

- [Better Auth Documentation](https://www.better-auth.com/docs)
- [Better Auth with Next.js](https://www.better-auth.com/docs/integrations/next)
- [MySQL Configuration](https://www.better-auth.com/docs/adapters/mysql)
