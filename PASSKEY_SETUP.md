# Passkey Authentication Setup

This document describes the passkey authentication implementation in this project.

## Overview

Passkey authentication has been added using better-auth's built-in passkey plugin, which uses WebAuthn/FIDO2 standards via the SimpleWebAuthn library. Users can now sign up and sign in using biometrics, security keys, or platform authenticators instead of passwords.

## Implementation Details

### 1. Server Configuration

**File**: `lib/auth.ts`

Added the passkey plugin to the better-auth configuration:

```typescript
import { passkey } from "better-auth/plugins/passkey";

export const auth = betterAuth({
  // ... other config
  plugins: [
    passkey({
      rpID: process.env.NODE_ENV === "production"
        ? process.env.PASSKEY_RP_ID || "localhost"
        : "localhost",
      rpName: "Blindtest",
      origin: process.env.BETTER_AUTH_URL || "http://localhost:3000",
    }),
  ],
});
```

**Configuration Options:**
- `rpID`: Relying Party ID (your domain). Uses "localhost" in development.
- `rpName`: Human-readable name shown to users during passkey registration.
- `origin`: The URL where authentication occurs. Must match your application URL.

### 2. Database Schema

**File**: `lib/db/schema.ts`

Added the `passkey` table to store WebAuthn credentials:

```typescript
export const passkey = mysqlTable("passkey", {
  id: varchar("id", { length: 255 }).primaryKey(),
  name: varchar("name", { length: 255 }),
  publicKey: text("publicKey").notNull(),
  userId: varchar("userId", { length: 255 }).notNull().references(() => user.id, { onDelete: "cascade" }),
  credentialID: text("credentialID").notNull(),
  counter: int("counter").notNull(),
  deviceType: varchar("deviceType", { length: 255 }).notNull(),
  backedUp: boolean("backedUp").notNull(),
  transports: varchar("transports", { length: 255 }),
  aaguid: varchar("aaguid", { length: 255 }),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});
```

**Migration**: `drizzle/0000_add_passkey_table.sql`

### 3. Client Configuration

**File**: `lib/auth-client.ts`

Added the passkey client plugin:

```typescript
import { passkeyClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000",
  plugins: [passkeyClient()],
});
```

### 4. UI Components

#### Login Form (`components/auth/login-form.tsx`)

Added "Sign in with Passkey" button that triggers WebAuthn authentication:

```typescript
const handlePasskeySignIn = async () => {
  const { data, error } = await authClient.signIn.passkey({
    fetchOptions: {
      onSuccess() {
        router.push("/dashboard");
      },
    },
  });
};
```

#### Signup Form (`components/auth/signup-form.tsx`)

Added "Sign up with Passkey" button that creates an account and registers a passkey:

```typescript
const handlePasskeySignup = async () => {
  // Create account
  await authClient.signUp.email({ email, password: randomPassword, name });

  // Register passkey
  await authClient.passkey.addPasskey({ name: `${name}'s Passkey` });
};
```

## Usage

### For Users

**Sign Up with Passkey:**
1. Navigate to `/signup`
2. Enter your name and email
3. Click "Sign up with Passkey"
4. Follow your device's authentication prompt (Face ID, Touch ID, Windows Hello, etc.)

**Sign In with Passkey:**
1. Navigate to `/login`
2. Click "Sign in with Passkey"
3. Select your registered passkey
4. Authenticate with your device

**Add Passkey to Existing Account:**

For authenticated users, passkeys can be added programmatically:

```typescript
await authClient.passkey.addPasskey({
  name: "My MacBook Pro Passkey", // Optional custom name
});
```

### For Developers

#### Testing Passkeys

**Chrome DevTools Emulation:**
1. Open Chrome DevTools (F12)
2. Go to Settings → Devices → WebAuthn
3. Click "Enable virtual authenticator environment"
4. Add a virtual authenticator
5. Test passkey registration and authentication

**Real Devices:**
- **macOS**: Uses Touch ID or password
- **iOS**: Uses Face ID or Touch ID
- **Windows**: Uses Windows Hello (face, fingerprint, or PIN)
- **Android**: Uses biometric or PIN
- **Hardware Keys**: YubiKey, Titan Security Key, etc.

#### API Endpoints

The passkey plugin adds these endpoints to `/api/auth/*`:

- `POST /api/auth/passkey/generate-register-options` - Start passkey registration
- `POST /api/auth/passkey/verify-registration` - Complete passkey registration
- `POST /api/auth/passkey/generate-authenticate-options` - Start passkey signin
- `POST /api/auth/passkey/verify-authentication` - Complete passkey signin

## Environment Variables

### Development (`.env`)

```env
# Use localhost for development
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
```

### Production (`.env.production`)

```env
# Set your production domain
BETTER_AUTH_URL=https://yourdomain.com
NEXT_PUBLIC_BETTER_AUTH_URL=https://yourdomain.com
PASSKEY_RP_ID=yourdomain.com  # Without protocol or port
```

## Browser Support

Passkeys work on modern browsers with WebAuthn support:

- ✅ Chrome/Edge 67+
- ✅ Firefox 60+
- ✅ Safari 13+
- ✅ Opera 54+

## Security Features

1. **Phishing Resistant**: Passkeys are bound to the domain and can't be used on fake sites
2. **No Password Storage**: No passwords to leak or steal
3. **Biometric Authentication**: Uses device's native secure authentication
4. **Hardware-backed**: Private keys stored in secure enclaves (TPM, Secure Enclave)
5. **FIDO2 Certified**: Based on W3C WebAuthn and FIDO2 standards

## Troubleshooting

### "Passkey not supported" error
- Ensure you're using HTTPS (localhost is ok for development)
- Check browser compatibility
- Verify device has biometric/security features enabled

### "Operation cancelled" error
- User cancelled the authentication prompt
- Timeout occurred (default 60 seconds)

### Database connection issues
- Ensure passkey table exists: `bun run db:migrate`
- Check database connection string in `.env`:
  ```env
  DATABASE_URL=mysql://user:password@localhost:3306/blindtest
  ```

## Additional Resources

- [Better Auth Passkey Plugin Docs](https://better-auth.com/docs/plugins/passkey)
- [WebAuthn Guide](https://webauthn.guide/)
- [SimpleWebAuthn Library](https://simplewebauthn.dev/)
- [FIDO Alliance](https://fidoalliance.org/)

## Database Scripts

```bash
# Generate migration for schema changes
bun run db:generate

# Apply migrations
bun run db:migrate

# View database in GUI
bun run db:studio
```

See `DATABASE_MIGRATIONS.md` for detailed migration workflow.
