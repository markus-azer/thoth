-- Requires: bio table is empty or all rows have user_id backfilled before this runs.
ALTER TABLE bio ADD COLUMN user_id text UNIQUE REFERENCES "user" (id) ON DELETE CASCADE;
ALTER TABLE bio ALTER COLUMN user_id SET NOT NULL;
