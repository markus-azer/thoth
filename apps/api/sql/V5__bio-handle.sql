ALTER TABLE bio RENAME COLUMN tenant TO handle;
ALTER TABLE bio RENAME CONSTRAINT bio_tenant_key TO bio_handle_key;
