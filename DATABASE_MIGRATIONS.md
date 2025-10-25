# Database Migrations with Drizzle

This project uses [Drizzle ORM](https://orm.drizzle.team/) and [Drizzle Kit](https://orm.drizzle.team/docs/kit-overview) for database schema management and migrations.

## Migration Scripts

The following npm scripts are available:

```bash
# Generate a new migration based on schema changes
bun run db:generate

# Apply pending migrations to the database
bun run db:migrate

# Open Drizzle Studio (database GUI)
bun run db:studio
```

## Workflow for Schema Changes

### 1. Modify the Schema

Edit `lib/db/schema.ts` to make your changes:

```typescript
// Example: Add a new table
export const newTable = mysqlTable("new_table", {
  id: varchar("id", { length: 255 }).primaryKey(),
  // ... other columns
});
```

### 2. Generate Migration

```bash
bun run db:generate
```

This will:
- Compare your schema with the current database state
- Generate SQL migration files in the `drizzle/` directory
- Update the migration journal in `drizzle/meta/_journal.json`

### 3. Review the Migration

Check the generated SQL file in `drizzle/0XXX_description.sql` to ensure it's correct.

### 4. Apply the Migration

```bash
bun run db:migrate
```

This will:
- Execute all pending migrations in order
- Update the migrations tracking table in your database

## Initial Setup (Already Completed)

For this project, the initial schema was set up using:

1. Schema definition in `lib/db/schema.ts`
2. SQL file in `schema.sql` (for manual setup reference)
3. Drizzle Kit for generating migrations

The passkey table was added as the first migration: `0000_add_passkey_table.sql`

## Database Connection

This project uses a single `DATABASE_URL` environment variable for database configuration:

```env
# Format: mysql://<user>:<password>@<host>:<port>/<database>
DATABASE_URL=mysql://blindtest_user:password@localhost:3306/blindtest
```

**Benefits:**
- Single configuration variable
- Standard format across tools (Drizzle, mysql2, etc.)
- Easy to use with hosting platforms (Vercel, Railway, PlanetScale, etc.)
- No need to parse multiple variables

## Current Schema

The database includes the following tables:

- **user**: User accounts
- **session**: Active user sessions
- **account**: OAuth accounts and password storage
- **verification**: Email verification tokens
- **passkey**: WebAuthn passkey credentials (added for passkey authentication)

## Alternative: Push for Development

For rapid development without migration files, you can use:

```bash
bunx drizzle-kit push
```

**Warning**: This directly syncs your schema to the database without creating migration files. Only use this in development environments.

## Drizzle Studio

Launch a visual database browser:

```bash
bun run db:studio
```

This opens a web interface at `https://local.drizzle.studio` where you can:
- Browse tables and data
- Execute queries
- Manage your database visually

## Troubleshooting

### "Table already exists" error

If you get this error when running migrations, it means the table was already created. This can happen if:
1. You ran `schema.sql` manually before setting up migrations
2. You used `drizzle-kit push` instead of migrations

**Solution**: The migration system tracks what's been applied via the `_journal.json` file and a migrations table in your database.

### Database connection issues

Ensure your `.env` has the correct connection string:

```env
# Format: mysql://<user>:<password>@<host>:<port>/<database>
DATABASE_URL=mysql://your_user:your_password@localhost:3306/blindtest
```

This is used by both the application and migration scripts.

## Best Practices

1. **Always generate migrations** for schema changes in production
2. **Review generated SQL** before applying
3. **Commit migration files** to version control
4. **Never edit applied migrations** - create new ones instead
5. **Use `drizzle-kit push`** only in local development
6. **Test migrations** on a staging database first

## References

- [Drizzle ORM Docs](https://orm.drizzle.team/docs/overview)
- [Drizzle Kit Docs](https://orm.drizzle.team/docs/kit-overview)
- [MySQL Migrations Guide](https://orm.drizzle.team/docs/migrations)
