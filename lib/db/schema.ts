import { mysqlTable, varchar, boolean, text, timestamp, index } from "drizzle-orm/mysql-core";

// User table
export const user = mysqlTable("user", {
  id: varchar("id", { length: 255 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerified: boolean("emailVerified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow().onUpdateNow(),
});

// Session table
export const session = mysqlTable(
  "session",
  {
    id: varchar("id", { length: 255 }).primaryKey(),
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    expiresAt: timestamp("expiresAt").notNull(),
    token: varchar("token", { length: 255 }).notNull().unique(),
    ipAddress: varchar("ipAddress", { length: 255 }),
    userAgent: text("userAgent"),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    updatedAt: timestamp("updatedAt").notNull().defaultNow().onUpdateNow(),
  },
  (table) => ({
    userIdIdx: index("idx_session_userId").on(table.userId),
    tokenIdx: index("idx_session_token").on(table.token),
  })
);

// Account table
export const account = mysqlTable(
  "account",
  {
    id: varchar("id", { length: 255 }).primaryKey(),
    accountId: varchar("accountId", { length: 255 }).notNull(),
    providerId: varchar("providerId", { length: 255 }).notNull(),
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("accessToken"),
    refreshToken: text("refreshToken"),
    expiresAt: timestamp("expiresAt"),
    scope: text("scope"),
    password: varchar("password", { length: 255 }),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    updatedAt: timestamp("updatedAt").notNull().defaultNow().onUpdateNow(),
  },
  (table) => ({
    userIdIdx: index("idx_account_userId").on(table.userId),
    providerIdIdx: index("idx_account_providerId").on(table.providerId),
  })
);

// Verification table
export const verification = mysqlTable(
  "verification",
  {
    id: varchar("id", { length: 255 }).primaryKey(),
    identifier: varchar("identifier", { length: 255 }).notNull(),
    value: varchar("value", { length: 255 }).notNull(),
    expiresAt: timestamp("expiresAt").notNull(),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    updatedAt: timestamp("updatedAt").notNull().defaultNow().onUpdateNow(),
  },
  (table) => ({
    identifierIdx: index("idx_verification_identifier").on(table.identifier),
  })
);
