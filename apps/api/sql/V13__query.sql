CREATE ROLE llm_reader NOLOGIN;
GRANT SELECT ON feedback TO llm_reader;
GRANT llm_reader TO api WITH INHERIT FALSE, SET TRUE;

ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback FORCE ROW LEVEL SECURITY;
CREATE POLICY owner_reads ON feedback FOR SELECT TO llm_reader
    USING (user_id = current_setting('app.user_id', true));
CREATE POLICY api_inserts ON feedback FOR INSERT TO api WITH CHECK (true);

-- Without this, a query could forge the owner with set_config.
REVOKE EXECUTE ON FUNCTION pg_catalog.set_config(text, text, boolean) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION pg_catalog.set_config(text, text, boolean) TO api;
