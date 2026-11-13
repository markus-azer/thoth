-- Without this, a query could SET the owner inside a DO block.
REVOKE USAGE ON LANGUAGE plpgsql FROM PUBLIC;
