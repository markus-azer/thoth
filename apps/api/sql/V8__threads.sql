CREATE TABLE threads (
    id         uuid PRIMARY KEY,
    bio_id     uuid NOT NULL REFERENCES bio (id) ON DELETE CASCADE,
    created_at timestamptz NOT NULL
);

CREATE INDEX threads_bio_id_idx ON threads (bio_id);
