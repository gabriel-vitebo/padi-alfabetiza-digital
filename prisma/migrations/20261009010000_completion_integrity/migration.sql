BEGIN;
-- SQL CHECK accepts UNKNOWN; explicitly exclude NULL totals in completed rows.
-- Keep the original constraints/history intact and strengthen the invariant.
ALTER TABLE padi.sessions ADD CONSTRAINT sessions_completion_totals_check CHECK (
  (status = 'IN_PROGRESS' AND completed_at IS NULL AND earned_score IS NULL AND max_score IS NULL)
  OR
  (status = 'COMPLETED' AND completed_at IS NOT NULL AND earned_score IS NOT NULL
    AND max_score IS NOT NULL AND max_score > 0 AND earned_score >= 0 AND earned_score <= max_score)
);
COMMIT;
