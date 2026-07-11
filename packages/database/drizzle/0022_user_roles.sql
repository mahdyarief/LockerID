-- Add role column to users table
-- 'superadmin' = first registered user ever (system-level admin)
-- 'user' = everyone else (can create workspace or be invited)

ALTER TABLE "users" ADD COLUMN "role" varchar(20) DEFAULT 'user' NOT NULL;

-- Update existing users: if this is the first user (earliest created_at), set to superadmin
-- Otherwise keep as 'user' (the default)
UPDATE "users" 
SET "role" = 'superadmin'
WHERE "id" = (
  SELECT "id" FROM "users" 
  ORDER BY "created_at" ASC 
  LIMIT 1
);
