CREATE TABLE feedback (
    id         uuid PRIMARY KEY,
    message    text NOT NULL,
    name       text,
    topic      text,
    email      text,
    created_at timestamptz NOT NULL
);
