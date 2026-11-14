CREATE TABLE ai_catalog_runs (
  id UUID PRIMARY KEY,
  subject_code VARCHAR(20) NOT NULL DEFAULT 'emath',
  review_before_publish BOOLEAN NOT NULL DEFAULT false,
  budget_rubles NUMERIC(14,6) NOT NULL CHECK (budget_rubles > 0 AND budget_rubles <= 50),
  charged_rubles NUMERIC(14,6) NOT NULL DEFAULT 0 CHECK (charged_rubles >= 0),
  status TEXT NOT NULL DEFAULT 'pending',
  provider_evidence JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE ai_catalog_items (
  id SERIAL PRIMARY KEY,
  run_id UUID NOT NULL REFERENCES ai_catalog_runs(id),
  topic_id INTEGER NOT NULL REFERENCES topics(id),
  topic_name TEXT NOT NULL,
  topic_number INTEGER,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy','medium','hard')),
  requires_image BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'pending',
  attempts INTEGER NOT NULL DEFAULT 0,
  candidate JSONB,
  verification JSONB,
  error TEXT,
  task_id INTEGER REFERENCES tasks(id),
  UNIQUE (run_id, topic_id, difficulty)
);

CREATE TABLE ai_catalog_calls (
  id SERIAL PRIMARY KEY,
  run_id UUID NOT NULL REFERENCES ai_catalog_runs(id),
  item_id INTEGER REFERENCES ai_catalog_items(id),
  purpose TEXT NOT NULL,
  reserved_rubles NUMERIC(14,6) NOT NULL,
  charged_rubles NUMERIC(14,6) NOT NULL,
  usage JSONB,
  provider_response_id TEXT,
  status TEXT NOT NULL DEFAULT 'reserved',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX ai_catalog_items_run ON ai_catalog_items(run_id, id);
CREATE INDEX ai_catalog_calls_run ON ai_catalog_calls(run_id, id);
