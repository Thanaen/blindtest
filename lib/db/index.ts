import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";

// Create MySQL connection pool
const connection = mysql.createPool({
  host: process.env.DATABASE_HOST || "localhost",
  user: process.env.DATABASE_USER || "root",
  password: process.env.DATABASE_PASSWORD || "",
  database: process.env.DATABASE_NAME || "blindtest",
});

// Create Drizzle instance
export const db = drizzle(connection, { schema, mode: "default" });

// Export types for convenience
export { schema };
export type User = typeof schema.user.$inferSelect;
export type NewUser = typeof schema.user.$inferInsert;
export type Session = typeof schema.session.$inferSelect;
export type NewSession = typeof schema.session.$inferInsert;
export type Account = typeof schema.account.$inferSelect;
export type NewAccount = typeof schema.account.$inferInsert;
export type Verification = typeof schema.verification.$inferSelect;
export type NewVerification = typeof schema.verification.$inferInsert;
