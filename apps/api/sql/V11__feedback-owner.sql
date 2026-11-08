-- Requires: feedback table is empty.
ALTER TABLE feedback ADD COLUMN user_id text NOT NULL REFERENCES "user" (id) ON DELETE CASCADE;
CREATE INDEX feedback_user_id_idx ON feedback (user_id);
