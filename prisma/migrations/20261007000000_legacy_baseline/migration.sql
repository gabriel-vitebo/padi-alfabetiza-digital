CREATE SCHEMA IF NOT EXISTS padi;
REVOKE ALL ON SCHEMA padi FROM PUBLIC;
CREATE TABLE padi.environment (
 singleton boolean PRIMARY KEY DEFAULT true CHECK (singleton),
 environment text NOT NULL CHECK (environment IN ('local','homolog','production'))
);
CREATE TABLE padi.competencies (id text PRIMARY KEY, label text NOT NULL, description text NOT NULL);
CREATE TABLE padi.questions (
 id text PRIMARY KEY, competency_id text NOT NULL REFERENCES padi.competencies(id),
 title text NOT NULL, statement text NOT NULL, justification text NOT NULL, active boolean NOT NULL DEFAULT true
);
CREATE TABLE padi.question_contexts (
 question_id text REFERENCES padi.questions(id), context text CHECK(context IN ('diagnostico','feira')),
 PRIMARY KEY(question_id, context)
);
CREATE TABLE padi.options (
 question_id text REFERENCES padi.questions(id), id text NOT NULL, label text NOT NULL,
 score smallint NOT NULL CHECK(score BETWEEN 0 AND 2), PRIMARY KEY(question_id, id)
);
CREATE TABLE padi.profile_options (
 kind text NOT NULL CHECK(kind IN ('course','semester','device','internet','help')),
 value text NOT NULL, label text NOT NULL, PRIMARY KEY(kind, value)
);
CREATE TABLE padi.sessions (
 id uuid PRIMARY KEY, mode text NOT NULL CHECK(mode IN ('research','fair')),
 created_at timestamptz NOT NULL DEFAULT now(), completed_at timestamptz,
 question_count integer NOT NULL CHECK(question_count > 0), synthetic boolean NOT NULL DEFAULT false,
 earned_score integer, max_score integer,
 CHECK((completed_at IS NULL AND earned_score IS NULL AND max_score IS NULL) OR
       (completed_at IS NOT NULL AND earned_score >= 0 AND max_score > 0 AND earned_score <= max_score))
);
CREATE TABLE padi.profiles (
 session_id uuid PRIMARY KEY REFERENCES padi.sessions(id) ON DELETE CASCADE,
 course text NOT NULL, semester text NOT NULL, device text NOT NULL, internet text NOT NULL, help text NOT NULL,
 course_kind text GENERATED ALWAYS AS ('course') STORED,
 semester_kind text GENERATED ALWAYS AS ('semester') STORED,
 device_kind text GENERATED ALWAYS AS ('device') STORED,
 internet_kind text GENERATED ALWAYS AS ('internet') STORED,
 help_kind text GENERATED ALWAYS AS ('help') STORED,
 FOREIGN KEY(course_kind, course) REFERENCES padi.profile_options(kind,value),
 FOREIGN KEY(semester_kind, semester) REFERENCES padi.profile_options(kind,value),
 FOREIGN KEY(device_kind, device) REFERENCES padi.profile_options(kind,value),
 FOREIGN KEY(internet_kind, internet) REFERENCES padi.profile_options(kind,value),
 FOREIGN KEY(help_kind, help) REFERENCES padi.profile_options(kind,value)
);
CREATE TABLE padi.session_questions (
 session_id uuid REFERENCES padi.sessions(id) ON DELETE CASCADE,
 question_id text REFERENCES padi.questions(id), position integer NOT NULL CHECK(position >= 0),
 competency_id text NOT NULL REFERENCES padi.competencies(id),
 snapshot jsonb NOT NULL, max_score smallint NOT NULL CHECK(max_score > 0),
 PRIMARY KEY(session_id, question_id), UNIQUE(session_id, position)
);
CREATE TABLE padi.session_options (
 session_id uuid, question_id text, option_id text, label text NOT NULL,
 score smallint NOT NULL CHECK(score BETWEEN 0 AND 2),
 PRIMARY KEY(session_id,question_id,option_id),
 FOREIGN KEY(session_id,question_id) REFERENCES padi.session_questions(session_id,question_id) ON DELETE CASCADE
);
CREATE TABLE padi.answers (
 session_id uuid, question_id text, option_id text NOT NULL, score smallint NOT NULL CHECK(score BETWEEN 0 AND 2),
 PRIMARY KEY(session_id,question_id),
 FOREIGN KEY(session_id,question_id,option_id) REFERENCES padi.session_options(session_id,question_id,option_id)
);
CREATE TABLE padi.competency_results (
 session_id uuid REFERENCES padi.sessions(id) ON DELETE CASCADE,
 competency_id text REFERENCES padi.competencies(id), earned_score integer NOT NULL CHECK(earned_score >= 0),
 max_score integer NOT NULL CHECK(max_score > 0), CHECK(earned_score <= max_score),
 PRIMARY KEY(session_id,competency_id)
);
CREATE INDEX sessions_completed ON padi.sessions(mode,completed_at) WHERE completed_at IS NOT NULL;
CREATE INDEX profiles_course ON padi.profiles(course);
CREATE INDEX profiles_semester ON padi.profiles(semester);
CREATE INDEX profiles_device ON padi.profiles(device);
CREATE INDEX profiles_internet ON padi.profiles(internet);
CREATE INDEX answers_question ON padi.answers(question_id);
CREATE INDEX results_competency ON padi.competency_results(competency_id);
CREATE INDEX questions_competency ON padi.questions(competency_id) WHERE active;
