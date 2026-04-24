-- PostgreSQL script: create homework and assign it to a student.
-- Usage:
-- 1) Update values in the "INPUT" block below.
-- 2) Run the whole script in pgAdmin.

BEGIN;

DO $$
DECLARE
  -- INPUT
  v_title text := 'Homework: Algebra and Geometry';
  v_subject_id integer := 1;
  v_topic_id integer := 1;
  v_deadline timestamptz := '2026-04-30 23:59:00+03';
  v_student_user_id integer := 1;
  v_task_ids integer[] := ARRAY[101, 102, 103];

  -- INTERNAL
  v_homework_id integer;
  v_inserted_tasks integer;
BEGIN
  IF v_title IS NULL OR btrim(v_title) = '' THEN
    RAISE EXCEPTION 'Title is required.';
  END IF;

  IF v_task_ids IS NULL OR array_length(v_task_ids, 1) IS NULL THEN
    RAISE EXCEPTION 'Task list is empty.';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM subjects s WHERE s.id = v_subject_id) THEN
    RAISE EXCEPTION 'Subject with id % was not found.', v_subject_id;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM topics tp WHERE tp.id = v_topic_id) THEN
    RAISE EXCEPTION 'Topic with id % was not found.', v_topic_id;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM users u WHERE u.id = v_student_user_id) THEN
    RAISE EXCEPTION 'User with id % was not found.', v_student_user_id;
  END IF;

  -- Optional guard: ensure every task exists.
  IF EXISTS (
    SELECT 1
    FROM unnest(v_task_ids) AS t(task_id)
    LEFT JOIN tasks tt ON tt.id = t.task_id
    WHERE tt.id IS NULL
  ) THEN
    RAISE EXCEPTION 'One or more task_ids do not exist in tasks table.';
  END IF;

  INSERT INTO homeworks (
    title,
    subject_id,
    deadline,
    topic_id,
    created_at,
    updated_at
  )
  VALUES (
    v_title,
    v_subject_id,
    v_deadline,
    v_topic_id,
    now(),
    now()
  )
  RETURNING id INTO v_homework_id;

  INSERT INTO homework_tasks (
    homework_id,
    task_id,
    order_index,
    points
  )
  SELECT
    v_homework_id,
    src.task_id,
    src.order_index,
    COALESCE(tt.points, 1)
  FROM unnest(v_task_ids) WITH ORDINALITY AS src(task_id, order_index)
  JOIN tasks tt ON tt.id = src.task_id;

  GET DIAGNOSTICS v_inserted_tasks = ROW_COUNT;

  INSERT INTO homework_assignments (
    homework_id,
    user_id,
    assigned_at,
    completed_at
  )
  VALUES (
    v_homework_id,
    v_student_user_id,
    now(),
    NULL
  );

  RAISE NOTICE 'Done. homework_id=%, assigned_to_user_id=%, tasks_added=%',
    v_homework_id, v_student_user_id, v_inserted_tasks;
END $$;

COMMIT;

