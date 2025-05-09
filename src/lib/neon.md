# Comprehensive Migration Plan: MongoDB+Prisma → Neon (PostgreSQL)+Prisma

This document provides a detailed, step-by-step plan to migrate from MongoDB with Prisma to Neon (PostgreSQL) with Prisma. We'll be starting with an empty Neon database (no data migration required).

---

## 1. Set Up Neon Database

1. Sign up for [Neon](https://neon.tech)
2. Create a new project
3. Create a new database
4. Get your connection string, which will look like:
   ```
   postgresql://[user]:[password]@[endpoint]/[dbname]?sslmode=require
   ```

## 2. Update Environment Variables

1. Add to your `.env` file:
   ```
   DATABASE_URL="postgresql://[user]:[password]@[endpoint]/[dbname]?sslmode=require"
   ```
2. You can remove the `MONGODB_URI` or keep it commented out for reference

## 3. Update Prisma Schema (`prisma/schema.prisma`)

### Change the datasource
```prisma
// FROM
datasource db {
  provider = "mongodb"
  url      = env("MONGODB_URI")
}

// TO
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### Update model ID fields
For each model, update the ID field:

```prisma
// FROM (MongoDB)
model User {
  id String @id @default(auto()) @map("_id") @db.ObjectId
  // ...
}

// TO (PostgreSQL)
model User {
  id String @id @default(uuid())
  // ...
}
```

### Remove MongoDB-specific attributes

1. Remove `@db.ObjectId` on all fields
2. Remove `@map("_id")` on ID fields
3. Replace `@db.String` with standard types
4. Update relation fields to ensure they use the correct ID types

### Example of fully converted model:

```prisma
// FROM (MongoDB)
model User {
  id                    String    @id @default(auto()) @map("_id") @db.ObjectId
  email                 String?   @unique
  accounts              Account[]
  sessions              Session[]
  posts                 Post[]
  followerId            String?   @db.ObjectId
  followingId           String?   @db.ObjectId
}

// TO (PostgreSQL)
model User {
  id                    String    @id @default(uuid())
  email                 String?   @unique
  accounts              Account[]
  sessions              Session[]
  posts                 Post[]
  followerId            String?
  followingId           String?
}
```

## 4. Update Database Access (`src/lib/db.ts`)

```typescript
// FROM
// import { PrismaClient } from "@prisma/client";

// declare global {
//   let prisma: PrismaClient | undefined;
// }

// // Add Article model to PrismaClient type
// type PrismaClientWithArticle = PrismaClient & {
//   article: any;
// };

// // Explicitly type global to allow prisma property
// const globalForPrisma = global as { prisma?: PrismaClientWithArticle }

// export const db = (globalForPrisma.prisma || new PrismaClient()) as PrismaClientWithArticle;

// TO
import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

export const db = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") global.prisma = db;
```

## 5. Update Auth Configuration (`src/auth.config.ts`)

The main changes needed are to ensure all ID handling for users, accounts, etc. matches your new UUID format (instead of ObjectId):

```typescript
// No major structural changes needed, but ensure all TypeScript interfaces
// correctly reflect your schema changes (especially ID fields)

interface UserProfile {
  id: string;
  // Other fields...
}

// If you were checking for MongoDB ObjectId format anywhere (24-char hex string),
// update that logic to check for UUID format instead
```

## 6. Update Auth Logic (`src/auth.ts`)

Ensure all database queries using IDs work with UUID format:

```typescript
// Example update:
// FROM (MongoDB)
const existingUser = await getUserById(token.sub);

// TO (PostgreSQL)
// The implementation might not need to change if your getUserById function 
// already handles the ID parameter correctly, but ensure it works with UUID
const existingUser = await getUserById(token.sub);
```

## 7. Update Middleware and Routes

No major changes needed in `src/middleware.ts` and `src/routes.ts` unless you have specific code that relies on MongoDB ObjectId format.

## 8. Initialize the Database

1. Create the initial migration:
   ```bash
   npx prisma migrate dev --name init
   ```

2. This will:
   - Create the database tables based on your schema
   - Generate Prisma Client
   - Apply the migration

3. Confirm your tables were created in Neon dashboard

## 9. Update Any Other Database Access Code

Scan your codebase for:
- MongoDB-specific query patterns (like `$set`, `$push`, etc.)
- Usage of `ObjectId` types or string conversions
- Assumptions about 24-character ID strings

## 10. Recreate Indices and Constraints (if needed)

PostgreSQL has powerful indexing capabilities:

```prisma
// Example: Adding composite index
model User {
  // ...fields
  @@index([email, name])
}

// Example: Adding unique constraint
model Post {
  // ...fields
  @@unique([title, authorId])
}
```

## 11. Test Your Application

1. Run your development server
2. Test all authentication flows
3. Test all database operations
4. Check for any errors related to IDs or database queries

## 12. Deploy the Changes

1. Update your production environment variables
2. Deploy your updated codebase
3. Run migrations in production:
   ```bash
   npx prisma migrate deploy
   ```

---

## File-by-File Changes Summary

| File | Changes Required |
|------|------------------|
| `prisma/schema.prisma` | Major changes: datasource, ID fields, relations, attributes |
| `src/lib/db.ts` | Minor changes: clean up MongoDB-specific code |
| `src/auth.config.ts` | Minor/None: ensure ID handling works with UUIDs |
| `src/auth.ts` | Minor/None: ensure DB queries work with UUIDs |
| `src/middleware.ts` | None (unless MongoDB-specific) |
| `src/routes.ts` | None (unless MongoDB-specific) |

---

## References and Resources

- [Neon Documentation](https://neon.tech/docs)
- [Prisma with PostgreSQL](https://www.prisma.io/docs/orm/overview/databases/postgresql)
- [Prisma Migrate](https://www.prisma.io/docs/orm/prisma-migrate)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

---

**After completing these steps, your project will be fully migrated to Neon PostgreSQL with Prisma, starting with a fresh database.**
