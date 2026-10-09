BEGIN;
CREATE TYPE padi."SurveyMode" AS ENUM ('research', 'fair');
CREATE TYPE padi."SessionStatus" AS ENUM ('IN_PROGRESS', 'COMPLETED');
CREATE TYPE padi."QuestionContextType" AS ENUM ('diagnostico', 'feira');
ALTER TABLE padi.sessions DROP CONSTRAINT sessions_mode_check;
ALTER TABLE padi.sessions ALTER COLUMN mode TYPE padi."SurveyMode" USING mode::padi."SurveyMode";
ALTER TABLE padi.question_contexts DROP CONSTRAINT question_contexts_context_check;
ALTER TABLE padi.question_contexts ALTER COLUMN context TYPE padi."QuestionContextType" USING context::padi."QuestionContextType";
ALTER TABLE padi.sessions ADD COLUMN status padi."SessionStatus" NOT NULL DEFAULT 'IN_PROGRESS',
 ADD COLUMN updated_at timestamptz NOT NULL DEFAULT now();
UPDATE padi.sessions SET status='COMPLETED' WHERE completed_at IS NOT NULL;
ALTER TABLE padi.sessions ADD CONSTRAINT sessions_status_consistent CHECK (
 (status='IN_PROGRESS' AND completed_at IS NULL) OR (status='COMPLETED' AND completed_at IS NOT NULL));
ALTER TABLE padi.questions ADD COLUMN created_at timestamptz NOT NULL DEFAULT now(),
 ADD COLUMN updated_at timestamptz NOT NULL DEFAULT now();
ALTER TABLE padi.answers ADD COLUMN created_at timestamptz NOT NULL DEFAULT now();
DROP INDEX padi.sessions_completed;
DROP INDEX padi.questions_competency;
CREATE INDEX sessions_mode_completed_at_idx ON padi.sessions(mode, completed_at);
CREATE INDEX sessions_synthetic_idx ON padi.sessions(synthetic);
CREATE INDEX questions_competency_id_active_idx ON padi.questions(competency_id, active);
CREATE INDEX session_questions_question_id_idx ON padi.session_questions(question_id);
-- Old custom runner history is no longer authoritative. Prisma Migrate owns history.
DROP TABLE IF EXISTS padi.migrations;
COMMIT;
