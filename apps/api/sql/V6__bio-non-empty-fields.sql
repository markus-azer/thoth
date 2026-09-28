ALTER TABLE bio ADD CONSTRAINT bio_handle_not_blank CHECK (handle ~ '[^[:space:]]');
ALTER TABLE bio ADD CONSTRAINT bio_name_not_blank CHECK (name ~ '[^[:space:]]');
ALTER TABLE bio ADD CONSTRAINT bio_headline_not_blank CHECK (headline ~ '[^[:space:]]');
ALTER TABLE bio ADD CONSTRAINT bio_about_not_blank CHECK (about ~ '[^[:space:]]');
