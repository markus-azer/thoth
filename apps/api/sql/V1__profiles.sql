CREATE TABLE profiles (
    id         uuid PRIMARY KEY,
    name       text NOT NULL,
    tagline    text,
    avatar_url text,
    socials    jsonb NOT NULL,
    body_md    text NOT NULL,
    updated_at timestamptz NOT NULL
);
