CREATE TABLE bio (
    id         uuid PRIMARY KEY,
    tenant     text NOT NULL UNIQUE,
    name       text NOT NULL,
    headline   text NOT NULL,
    about      text NOT NULL,
    created_at timestamptz NOT NULL,
    updated_at timestamptz NOT NULL
);
