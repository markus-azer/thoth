ALTER TABLE bio ADD CONSTRAINT bio_handle_not_blank CHECK (length(trim(handle)) > 0);
ALTER TABLE bio ADD CONSTRAINT bio_name_not_blank CHECK (length(trim(name)) > 0);
ALTER TABLE bio ADD CONSTRAINT bio_headline_not_blank CHECK (length(trim(headline)) > 0);
ALTER TABLE bio ADD CONSTRAINT bio_about_not_blank CHECK (length(trim(about)) > 0);
