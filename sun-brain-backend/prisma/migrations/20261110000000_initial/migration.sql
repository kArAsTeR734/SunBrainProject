--
-- PostgreSQL database dump
--


-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: check_answer(integer, character varying); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.check_answer(p_task_id integer, p_user_answer character varying) RETURNS TABLE(is_correct boolean, correct_answer character varying, solution text)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        LOWER(TRIM(t.correct_answer)) = LOWER(TRIM(p_user_answer)) as is_correct,
        t.correct_answer,
        t.solution
    FROM tasks t
    WHERE t.id = p_task_id;
END;
$$;


--
-- Name: get_random_task(character varying); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_random_task(subject_code character varying) RETURNS TABLE(task_id integer, title character varying, content text, subject_name character varying, topic_name character varying)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.id,
        t.title,
        t.content,
        s.name as subject_name,
        COALESCE(top.name, 'Без темы') as topic_name
    FROM tasks t
    JOIN subjects s ON t.subject_id = s.id
    LEFT JOIN topics top ON t.topic_id = top.id
    WHERE s.code = subject_code
    ORDER BY RANDOM()
    LIMIT 1;
END;
$$;


--
-- Name: update_leaderboard_on_solution(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_leaderboard_on_solution() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Обновляем рейтинг при каждом решении
    INSERT INTO leaderboard (user_id, total_points, tasks_solved, correct_solutions, last_activity_at)
    VALUES (
        NEW.user_id,
        CASE WHEN NEW.is_correct THEN 1 ELSE 0 END,
        1,
        CASE WHEN NEW.is_correct THEN 1 ELSE 0 END,
        CURRENT_TIMESTAMP
    )
    ON CONFLICT (user_id) DO UPDATE SET
        total_points = leaderboard.total_points + CASE WHEN NEW.is_correct THEN 1 ELSE 0 END,
        tasks_solved = leaderboard.tasks_solved + 1,
        correct_solutions = leaderboard.correct_solutions + 
            CASE WHEN NEW.is_correct THEN 1 ELSE 0 END,
        last_activity_at = CURRENT_TIMESTAMP;
    
    RETURN NEW;
END;
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: homework_answers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.homework_answers (
    id integer NOT NULL,
    user_id integer,
    task_id integer,
    answer text NOT NULL,
    is_correct boolean DEFAULT false,
    points_awarded integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT now()
);


--
-- Name: homework_answers_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.homework_answers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: homework_answers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.homework_answers_id_seq OWNED BY public.homework_answers.id;


--
-- Name: homework_assignments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.homework_assignments (
    id integer NOT NULL,
    homework_id integer NOT NULL,
    user_id integer NOT NULL,
    assigned_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    completed_at timestamp without time zone
);


--
-- Name: homework_assignments_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.homework_assignments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: homework_assignments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.homework_assignments_id_seq OWNED BY public.homework_assignments.id;


--
-- Name: homework_tasks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.homework_tasks (
    id integer NOT NULL,
    homework_id integer NOT NULL,
    task_id integer NOT NULL,
    order_index integer DEFAULT 0
);


--
-- Name: homework_tasks_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.homework_tasks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: homework_tasks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.homework_tasks_id_seq OWNED BY public.homework_tasks.id;


--
-- Name: homeworks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.homeworks (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    subject_id integer NOT NULL,
    deadline timestamp without time zone NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    topic_id integer
);


--
-- Name: homeworks_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.homeworks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: homeworks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.homeworks_id_seq OWNED BY public.homeworks.id;


--
-- Name: leaderboard; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.leaderboard (
    id integer NOT NULL,
    user_id integer NOT NULL,
    total_points integer DEFAULT 0,
    tasks_solved integer DEFAULT 0,
    correct_solutions integer DEFAULT 0,
    last_activity_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: leaderboard_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.leaderboard_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: leaderboard_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.leaderboard_id_seq OWNED BY public.leaderboard.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying(255) NOT NULL,
    password_hash character varying(255) NOT NULL,
    full_name character varying(150) NOT NULL,
    role character varying(20) NOT NULL,
    refresh_token character varying(500),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    avatar_url character varying(500),
    CONSTRAINT users_role_check CHECK (((role)::text = ANY (ARRAY[('student'::character varying)::text, ('teacher'::character varying)::text, ('admin'::character varying)::text])))
);


--
-- Name: leaderboard_top_20; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.leaderboard_top_20 AS
 SELECT row_number() OVER (ORDER BY l.total_points DESC) AS "position",
    u.id,
    u.full_name,
    l.total_points,
    l.tasks_solved,
    l.correct_solutions,
    l.last_activity_at
   FROM (public.leaderboard l
     JOIN public.users u ON ((l.user_id = u.id)))
  WHERE ((u.role)::text = 'student'::text)
  ORDER BY l.total_points DESC
 LIMIT 20;


--
-- Name: solutions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.solutions (
    id integer NOT NULL,
    user_id integer NOT NULL,
    task_id integer NOT NULL,
    user_answer character varying(500) NOT NULL,
    is_correct boolean NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    homework_id integer
);


--
-- Name: solutions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.solutions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: solutions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.solutions_id_seq OWNED BY public.solutions.id;


--
-- Name: study_recommendations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.study_recommendations (
    id integer NOT NULL,
    user_id integer NOT NULL,
    subject_id integer NOT NULL,
    topic_id integer NOT NULL,
    mastery_level integer DEFAULT 0,
    recommended_tasks integer DEFAULT 5,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: study_recommendations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.study_recommendations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: study_recommendations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.study_recommendations_id_seq OWNED BY public.study_recommendations.id;


--
-- Name: subjects; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.subjects (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    code character varying(20) NOT NULL
);


--
-- Name: subjects_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.subjects_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: subjects_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.subjects_id_seq OWNED BY public.subjects.id;


--
-- Name: tasks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tasks (
    id integer NOT NULL,
    content text NOT NULL,
    original_tex text,
    solution text,
    correct_answer text,
    points integer DEFAULT 1,
    topic_id integer,
    difficulty text,
    exam_type text,
    answer_format text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


--
-- Name: tasks_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.tasks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: tasks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.tasks_id_seq OWNED BY public.tasks.id;


--
-- Name: test_answers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.test_answers (
    id integer NOT NULL,
    test_id integer,
    user_id integer,
    task_id integer,
    task_number integer,
    difficulty character varying(10),
    user_answer text,
    is_correct boolean,
    answered_at timestamp without time zone DEFAULT now()
);


--
-- Name: test_answers_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.test_answers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: test_answers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.test_answers_id_seq OWNED BY public.test_answers.id;


--
-- Name: test_tasks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.test_tasks (
    id integer NOT NULL,
    test_id integer,
    task_id integer,
    task_number integer,
    difficulty character varying(10),
    order_index integer
);


--
-- Name: test_tasks_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.test_tasks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: test_tasks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.test_tasks_id_seq OWNED BY public.test_tasks.id;


--
-- Name: tests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tests (
    id integer NOT NULL,
    user_id integer NOT NULL,
    subject_id integer NOT NULL,
    started_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    completed_at timestamp without time zone,
    total_questions integer,
    correct_answers integer DEFAULT 0,
    status character varying(20) DEFAULT 'in_progress'::character varying
);


--
-- Name: tests_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.tests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: tests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.tests_id_seq OWNED BY public.tests.id;


--
-- Name: topics; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.topics (
    id integer NOT NULL,
    subject_code character varying(50) CONSTRAINT topics_subject_id_not_null NOT NULL,
    name character varying(200) NOT NULL,
    number integer
);


--
-- Name: topics_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.topics_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: topics_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.topics_id_seq OWNED BY public.topics.id;


--
-- Name: user_stats; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.user_stats AS
 SELECT u.id,
    u.email,
    u.full_name,
    u.role,
    COALESCE(l.total_points, 0) AS total_points,
    COALESCE(l.tasks_solved, 0) AS tasks_solved,
    COALESCE(l.correct_solutions, 0) AS correct_solutions,
        CASE
            WHEN (COALESCE(l.tasks_solved, 0) > 0) THEN round((((l.correct_solutions)::numeric / (l.tasks_solved)::numeric) * (100)::numeric), 2)
            ELSE (0)::numeric
        END AS accuracy_percent,
    COALESCE(l.last_activity_at, u.created_at) AS last_activity_at
   FROM (public.users u
     LEFT JOIN public.leaderboard l ON ((u.id = l.user_id)));


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: homework_answers id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.homework_answers ALTER COLUMN id SET DEFAULT nextval('public.homework_answers_id_seq'::regclass);


--
-- Name: homework_assignments id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.homework_assignments ALTER COLUMN id SET DEFAULT nextval('public.homework_assignments_id_seq'::regclass);


--
-- Name: homework_tasks id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.homework_tasks ALTER COLUMN id SET DEFAULT nextval('public.homework_tasks_id_seq'::regclass);


--
-- Name: homeworks id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.homeworks ALTER COLUMN id SET DEFAULT nextval('public.homeworks_id_seq'::regclass);


--
-- Name: leaderboard id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.leaderboard ALTER COLUMN id SET DEFAULT nextval('public.leaderboard_id_seq'::regclass);


--
-- Name: solutions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.solutions ALTER COLUMN id SET DEFAULT nextval('public.solutions_id_seq'::regclass);


--
-- Name: study_recommendations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.study_recommendations ALTER COLUMN id SET DEFAULT nextval('public.study_recommendations_id_seq'::regclass);


--
-- Name: subjects id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subjects ALTER COLUMN id SET DEFAULT nextval('public.subjects_id_seq'::regclass);


--
-- Name: tasks id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tasks ALTER COLUMN id SET DEFAULT nextval('public.tasks_id_seq'::regclass);


--
-- Name: test_answers id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.test_answers ALTER COLUMN id SET DEFAULT nextval('public.test_answers_id_seq'::regclass);


--
-- Name: test_tasks id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.test_tasks ALTER COLUMN id SET DEFAULT nextval('public.test_tasks_id_seq'::regclass);


--
-- Name: tests id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tests ALTER COLUMN id SET DEFAULT nextval('public.tests_id_seq'::regclass);


--
-- Name: topics id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.topics ALTER COLUMN id SET DEFAULT nextval('public.topics_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: homework_answers homework_answers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.homework_answers
    ADD CONSTRAINT homework_answers_pkey PRIMARY KEY (id);


--
-- Name: homework_assignments homework_assignments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.homework_assignments
    ADD CONSTRAINT homework_assignments_pkey PRIMARY KEY (id);


--
-- Name: homework_tasks homework_tasks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.homework_tasks
    ADD CONSTRAINT homework_tasks_pkey PRIMARY KEY (id);


--
-- Name: homeworks homeworks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.homeworks
    ADD CONSTRAINT homeworks_pkey PRIMARY KEY (id);


--
-- Name: leaderboard leaderboard_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.leaderboard
    ADD CONSTRAINT leaderboard_pkey PRIMARY KEY (id);


--
-- Name: leaderboard leaderboard_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.leaderboard
    ADD CONSTRAINT leaderboard_user_id_key UNIQUE (user_id);


--
-- Name: solutions solutions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.solutions
    ADD CONSTRAINT solutions_pkey PRIMARY KEY (id);


--
-- Name: study_recommendations study_recommendations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.study_recommendations
    ADD CONSTRAINT study_recommendations_pkey PRIMARY KEY (id);


--
-- Name: subjects subjects_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subjects
    ADD CONSTRAINT subjects_code_key UNIQUE (code);


--
-- Name: subjects subjects_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subjects
    ADD CONSTRAINT subjects_name_key UNIQUE (name);


--
-- Name: subjects subjects_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subjects
    ADD CONSTRAINT subjects_pkey PRIMARY KEY (id);


--
-- Name: tasks tasks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_pkey PRIMARY KEY (id);


--
-- Name: test_answers test_answers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.test_answers
    ADD CONSTRAINT test_answers_pkey PRIMARY KEY (id);


--
-- Name: test_tasks test_tasks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.test_tasks
    ADD CONSTRAINT test_tasks_pkey PRIMARY KEY (id);


--
-- Name: tests tests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tests
    ADD CONSTRAINT tests_pkey PRIMARY KEY (id);


--
-- Name: topics topics_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.topics
    ADD CONSTRAINT topics_pkey PRIMARY KEY (id);


--
-- Name: subjects unique_subject_code; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subjects
    ADD CONSTRAINT unique_subject_code UNIQUE (code);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: idx_leaderboard_total_points; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_leaderboard_total_points ON public.leaderboard USING btree (total_points DESC);


--
-- Name: idx_solutions_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_solutions_created_at ON public.solutions USING btree (created_at);


--
-- Name: idx_solutions_task_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_solutions_task_id ON public.solutions USING btree (task_id);


--
-- Name: idx_solutions_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_solutions_user_id ON public.solutions USING btree (user_id);


--
-- Name: idx_test_answers_test_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_test_answers_test_id ON public.test_answers USING btree (test_id);


--
-- Name: idx_test_tasks_test_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_test_tasks_test_id ON public.test_tasks USING btree (test_id);


--
-- Name: idx_topics_subject_code; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_topics_subject_code ON public.topics USING btree (subject_code);


--
-- Name: idx_unique_solution; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX idx_unique_solution ON public.solutions USING btree (user_id, task_id);


--
-- Name: solutions trigger_update_leaderboard; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trigger_update_leaderboard AFTER INSERT ON public.solutions FOR EACH ROW EXECUTE FUNCTION public.update_leaderboard_on_solution();


--
-- Name: homework_assignments fk_homework_assignments_user; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.homework_assignments
    ADD CONSTRAINT fk_homework_assignments_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: homeworks fk_homeworks_subject; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.homeworks
    ADD CONSTRAINT fk_homeworks_subject FOREIGN KEY (subject_id) REFERENCES public.subjects(id) ON DELETE CASCADE;


--
-- Name: study_recommendations fk_rec_subject; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.study_recommendations
    ADD CONSTRAINT fk_rec_subject FOREIGN KEY (subject_id) REFERENCES public.subjects(id);


--
-- Name: study_recommendations fk_rec_topic; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.study_recommendations
    ADD CONSTRAINT fk_rec_topic FOREIGN KEY (topic_id) REFERENCES public.topics(id);


--
-- Name: study_recommendations fk_rec_user; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.study_recommendations
    ADD CONSTRAINT fk_rec_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: tests fk_tests_subject; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tests
    ADD CONSTRAINT fk_tests_subject FOREIGN KEY (subject_id) REFERENCES public.subjects(id);


--
-- Name: tests fk_tests_user; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tests
    ADD CONSTRAINT fk_tests_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: topics fk_topics_subjects_code; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.topics
    ADD CONSTRAINT fk_topics_subjects_code FOREIGN KEY (subject_code) REFERENCES public.subjects(code);


--
-- Name: homework_answers homework_answers_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.homework_answers
    ADD CONSTRAINT homework_answers_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: homeworks homeworks_topic_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.homeworks
    ADD CONSTRAINT homeworks_topic_id_fkey FOREIGN KEY (topic_id) REFERENCES public.topics(id);


--
-- Name: leaderboard leaderboard_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.leaderboard
    ADD CONSTRAINT leaderboard_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: solutions solutions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.solutions
    ADD CONSTRAINT solutions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: tasks tasks_topic_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_topic_id_fkey FOREIGN KEY (topic_id) REFERENCES public.topics(id);


--
-- Name: test_answers test_answers_task_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.test_answers
    ADD CONSTRAINT test_answers_task_id_fkey FOREIGN KEY (task_id) REFERENCES public.tasks(id);


--
-- Name: test_answers test_answers_test_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.test_answers
    ADD CONSTRAINT test_answers_test_id_fkey FOREIGN KEY (test_id) REFERENCES public.tests(id) ON DELETE CASCADE;


--
-- Name: test_answers test_answers_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.test_answers
    ADD CONSTRAINT test_answers_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: test_tasks test_tasks_task_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.test_tasks
    ADD CONSTRAINT test_tasks_task_id_fkey FOREIGN KEY (task_id) REFERENCES public.tasks(id) ON DELETE CASCADE;


--
-- Name: test_tasks test_tasks_test_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.test_tasks
    ADD CONSTRAINT test_tasks_test_id_fkey FOREIGN KEY (test_id) REFERENCES public.tests(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--


