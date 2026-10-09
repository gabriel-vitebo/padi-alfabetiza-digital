BEGIN;
-- Existing sessions remain intact but cannot be claimed with a public UUID.
-- Only newly issued, secret tokens authorize individual access.
ALTER TABLE padi.sessions ADD COLUMN access_token_hash text;
ALTER TABLE padi.sessions ADD CONSTRAINT sessions_access_token_hash_check
  CHECK (access_token_hash IS NULL OR access_token_hash ~ '^[a-f0-9]{64}$');
COMMIT;
