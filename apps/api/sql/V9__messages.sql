CREATE TYPE message_role AS ENUM ('user', 'assistant');

CREATE TABLE messages (
    id         uuid PRIMARY KEY,
    thread_id  uuid NOT NULL REFERENCES threads (id) ON DELETE CASCADE,
    role       message_role NOT NULL,
    content    text NOT NULL,
    created_at timestamptz NOT NULL,
    CONSTRAINT messages_content_not_blank CHECK (content ~ '[^[:space:]]')
);

CREATE INDEX messages_thread_id_idx ON messages (thread_id, id);
