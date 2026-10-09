-- Extend the catalog while retaining kinds referenced by historical profiles.
ALTER TABLE padi.profile_options
  DROP CONSTRAINT profile_options_kind_check,
  ADD CONSTRAINT profile_options_kind_check
    CHECK (kind IN ('course', 'semester', 'device', 'internet', 'help', 'area'));

-- Preserve historical answers without inferring an area from a former course.
ALTER TABLE padi.profiles
  ALTER COLUMN course DROP NOT NULL,
  ALTER COLUMN semester DROP NOT NULL,
  ALTER COLUMN device DROP NOT NULL,
  ALTER COLUMN internet DROP NOT NULL,
  ALTER COLUMN help DROP NOT NULL,
  ADD COLUMN area TEXT,
  ADD COLUMN area_kind TEXT NOT NULL DEFAULT 'area',
  ADD CONSTRAINT profiles_area_kind_check CHECK (area_kind = 'area'),
  ADD CONSTRAINT profiles_area_kind_area_fkey FOREIGN KEY (area_kind, area)
    REFERENCES padi.profile_options(kind, value) ON DELETE NO ACTION ON UPDATE NO ACTION;

CREATE INDEX profiles_area ON padi.profiles(area);
